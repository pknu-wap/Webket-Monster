import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useMemo, useRef, useState } from "react";

import { FESTIVAL_CARDS, cardImagePath, type FestivalCard } from "../festival/cards";
import {
  IDLE_SESSION,
  findCardForUrl,
  formatClock,
  hasFound,
  isPlaying,
  remainingMs,
  type FestivalSession
} from "../festival/logic";
import {
  FESTIVAL_PAGE_PATH,
  FESTIVAL_TIME_UP,
  collectCard,
  getSession,
  watchSession
} from "../festival/session";

// 유엔평화기념관 홈페이지에서만 동작한다. 부스 화면에서 게임을 시작했을 때만 화면에 나타난다.
export const config: PlasmoCSConfig = {
  matches: ["*://*.unpm.or.kr/*"]
};

const CARD_WIDTH = 300;
const CARD_HEIGHT = Math.round(CARD_WIDTH * 480 / 810);
// 게임이 끝난 직후에만 "시간 종료"를 보여 주고 부스 화면으로 돌아간다.
const TIME_UP_WINDOW_MS = 30 * 1000;
const FONT = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

type Toast = { title: string; detail?: string; tone: "success" | "info" };

const randomCardPosition = () => {
  const maxX = Math.max(16, window.innerWidth - CARD_WIDTH - 16);
  const maxY = Math.max(16, window.innerHeight - CARD_HEIGHT - 140);
  const minX = Math.min(maxX, window.innerWidth * 0.08);
  const minY = Math.min(maxY, window.innerHeight * 0.18);
  return {
    x: Math.round(minX + Math.random() * (maxX - minX)),
    y: Math.round(minY + Math.random() * (maxY - minY))
  };
};

export default function FestivalOverlay() {
  const [session, setSession] = useState<FestivalSession>(IDLE_SESSION);
  const [now, setNow] = useState(() => Date.now());
  const [collectingCode, setCollectingCode] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const pageCard = useMemo(() => findCardForUrl(window.location.href, FESTIVAL_CARDS), []);
  const cardPosition = useMemo(randomCardPosition, []);
  const checkedRevisit = useRef(false);
  const reportedTimeUp = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (next: Toast) => {
    clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    getSession().then(setSession);
    return watchSession(setSession);
  }, []);

  const running = session.status === "running";
  const recentlyEnded = session.endsAt > 0 && now >= session.endsAt && now - session.endsAt < TIME_UP_WINDOW_MS;
  const timeUp = (running || session.status === "finished") && recentlyEnded;
  const playing = isPlaying(session, now);

  useEffect(() => {
    if (!running && !timeUp) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [running, timeUp]);

  // 이미 찾은 카드의 페이지에 다시 들어오면 한 번만 알려 준다.
  useEffect(() => {
    if (checkedRevisit.current || !playing || !pageCard) return;
    checkedRevisit.current = true;
    if (hasFound(session, pageCard.code)) {
      showToast({ title: `${pageCard.flag} ${pageCard.name} 카드는 이미 찾았어요`, tone: "info" });
    }
  }, [playing, pageCard, session]);

  // 시간이 끝나면 부스 화면에 알리고, 부스 화면이 없으면 이 탭이 직접 결과 화면으로 간다.
  useEffect(() => {
    if (!timeUp || reportedTimeUp.current) return;
    reportedTimeUp.current = true;
    try {
      chrome.runtime.sendMessage({ type: FESTIVAL_TIME_UP }).catch(() => {});
    } catch {
      // 확장이 다시 로드돼 연결이 끊긴 탭이면 아래 이동도 하지 않는다.
      return;
    }
    const fallback = setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.href = chrome.runtime.getURL(FESTIVAL_PAGE_PATH);
      }
    }, 2500);
    return () => clearTimeout(fallback);
  }, [timeUp]);

  const handleCardClick = async (card: FestivalCard) => {
    if (collectingCode) return;
    setCollectingCode(card.code);
    const { result } = await collectCard(card.code);
    if (result === "collected") {
      showToast({ title: `${card.flag} ${card.name} 카드 획득!`, detail: card.hint, tone: "success" });
      // 사라지는 효과가 끝나면 카드를 없애 페이지 클릭을 막지 않게 한다.
      setTimeout(() => setCollectingCode(null), 650);
    } else {
      setCollectingCode(null);
      if (result === "duplicate") {
        showToast({ title: `${card.flag} ${card.name} 카드는 이미 찾았어요`, tone: "info" });
      }
    }
  };

  if (!playing && !timeUp) return null;

  const remaining = remainingMs(session, now);
  const urgent = playing && remaining <= 10_000;
  const foundCount = session.found.length;
  const showCard = playing && pageCard && (!hasFound(session, pageCard.code) || collectingCode === pageCard.code);

  return (
    <div style={{ fontFamily: FONT, color: "#1d2540" }}>
      <style>{`
        @keyframes festival-pop { 0% { transform: scale(0.2) rotate(-12deg); opacity: 0; } 70% { transform: scale(1.08) rotate(3deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        @keyframes festival-float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
        @keyframes festival-glow { 0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 210, 63, 0.9)); } 50% { filter: drop-shadow(0 0 22px rgba(255, 210, 63, 1)); } }
        @keyframes festival-collect { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.7) rotate(8deg); opacity: 0; } }
        @keyframes festival-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes festival-toast { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .festival-card-button:hover img { transform: scale(1.05); }
      `}</style>

      {showCard && pageCard && (
        <div
          style={{
            position: "fixed",
            left: cardPosition.x,
            top: cardPosition.y,
            zIndex: 2147483000,
            pointerEvents: collectingCode === pageCard.code ? "none" : "auto",
            animation: collectingCode === pageCard.code
              ? "festival-collect 0.6s ease-in forwards"
              : "festival-pop 0.6s ease-out"
          }}>
          <div style={{ animation: collectingCode === pageCard.code ? "none" : "festival-float 2.4s ease-in-out 0.6s infinite" }}>
            <button
              className="festival-card-button"
              data-festival-card={pageCard.code}
              aria-label={`${pageCard.name} 카드 줍기`}
              onClick={() => handleCardClick(pageCard)}
              style={{
                display: "block",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                animation: "festival-glow 1.6s ease-in-out infinite"
              }}>
              <img
                src={chrome.runtime.getURL(cardImagePath(pageCard.code))}
                alt={`${pageCard.name} 카드: ${pageCard.symbol}와 국기`}
                draggable={false}
                style={{ display: "block", width: CARD_WIDTH, height: CARD_HEIGHT, transition: "transform 0.15s" }}
              />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            zIndex: 2147483001,
            transform: "translateX(-50%)",
            animation: "festival-toast 0.25s ease-out",
            background: toast.tone === "success" ? "#1d2540" : "rgba(29, 37, 64, 0.88)",
            color: "#fffaf0",
            border: toast.tone === "success" ? "3px solid #ffd23f" : "2px solid #4b92db",
            borderRadius: 18,
            padding: "14px 26px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            maxWidth: "80vw"
          }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{toast.title}</div>
          {toast.detail && <div style={{ fontSize: 16, marginTop: 6, color: "#c9d6ea" }}>{toast.detail}</div>}
        </div>
      )}

      {playing && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 2147483002,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10
          }}>
          {hintsOpen && (
            <div
              style={{
                width: 360,
                maxHeight: "55vh",
                overflowY: "auto",
                background: "#fffaf0",
                border: "3px solid #4b92db",
                borderRadius: 16,
                padding: "12px 14px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
              }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>카드가 숨은 곳 힌트</div>
              {FESTIVAL_CARDS.map(card => {
                const found = hasFound(session, card.code);
                return (
                  <div
                    key={card.code}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "baseline",
                      padding: "5px 0",
                      borderTop: "1px solid #eadfca",
                      opacity: found ? 0.45 : 1,
                      fontSize: 14,
                      lineHeight: 1.35
                    }}>
                    <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                      {found ? "✓" : card.flag} {card.name}
                    </span>
                    <span style={{ color: "#4a5568" }}>{card.hint}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: urgent ? "#d64545" : "#1d2540",
              color: "#fffaf0",
              borderRadius: 999,
              padding: "10px 12px 10px 20px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
              border: "3px solid #ffd23f",
              animation: urgent ? "festival-pulse 1s ease-in-out infinite" : "none"
            }}>
            <span data-festival-clock style={{ fontSize: 30, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
              ⏱ {formatClock(remaining)}
            </span>
            <span data-festival-count style={{ fontSize: 22, fontWeight: 800, color: "#ffd23f" }}>
              🃏 {foundCount}/{FESTIVAL_CARDS.length}
            </span>
            <button
              onClick={() => setHintsOpen(open => !open)}
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 800,
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                background: "#4b92db",
                color: "#fffaf0",
                cursor: "pointer"
              }}>
              힌트 {hintsOpen ? "▾" : "▴"}
            </button>
          </div>
        </div>
      )}

      {timeUp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483003,
            background: "rgba(29, 37, 64, 0.82)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            color: "#fffaf0"
          }}>
          <div style={{ fontSize: 72, fontWeight: 900 }}>시간 종료!</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#ffd23f" }}>
            평화 카드 {foundCount}장을 찾았어요
          </div>
          <div style={{ fontSize: 20, color: "#c9d6ea" }}>잠시 뒤 결과 화면으로 이동해요</div>
        </div>
      )}
    </div>
  );
}
