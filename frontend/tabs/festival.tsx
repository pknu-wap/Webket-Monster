import { useEffect, useRef, useState, type CSSProperties } from "react";

import { FESTIVAL_CARDS, MUSEUM_HOME_URL, cardImagePath } from "../festival/cards";
import {
  GAME_DURATION_MS,
  IDLE_SESSION,
  formatClock,
  hasFound,
  remainingMs,
  type FestivalSession
} from "../festival/logic";
import {
  FESTIVAL_TIME_UP,
  finishSession,
  getSession,
  resetSession,
  startSession,
  watchSession
} from "../festival/session";

// 부스 노트북에 띄워 두는 "1분 평화 카드 찾기" 화면.
// 대기 → 3·2·1 → 기념관 홈페이지에서 1분 → 결과 → 다음 사람 순서로 돈다.

const FONT = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
const NAVY = "#1d2540";
const BLUE = "#4b92db";
const CREAM = "#fffaf0";
const YELLOW = "#ffd23f";
const INK = "#4a5568";
const LINE = "#eadfca";

// 테스트할 때만 festival.html?sec=15 처럼 시간을 줄인다.
const readDurationMs = () => {
  const sec = Number(new URLSearchParams(window.location.search).get("sec"));
  return Number.isFinite(sec) && sec >= 5 && sec <= 600 ? sec * 1000 : GAME_DURATION_MS;
};

const cardUrl = (code: string) => chrome.runtime.getURL(cardImagePath(code));

const bigButton = (background: string, color: string): CSSProperties => ({
  fontFamily: FONT,
  fontSize: 30,
  fontWeight: 900,
  border: "none",
  borderRadius: 20,
  padding: "18px 44px",
  background,
  color,
  cursor: "pointer",
  boxShadow: "0 6px 0 rgba(0, 0, 0, 0.25)"
});

export default function FestivalPage() {
  const [session, setSession] = useState<FestivalSession>(IDLE_SESSION);
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [durationMs] = useState(readDurationMs);
  const selfTab = useRef<chrome.tabs.Tab | undefined>(undefined);
  const gameTabs = useRef(new Set<number>());
  const gameActive = useRef(false);
  const ending = useRef(false);

  const endGame = async () => {
    if (ending.current) return;
    ending.current = true;
    gameActive.current = false;
    try {
      await finishSession();
      const tabIds = [...gameTabs.current];
      gameTabs.current.clear();
      await Promise.allSettled(tabIds.map(id => chrome.tabs.remove(id)));
      const tab = selfTab.current;
      if (tab?.id !== undefined) {
        await chrome.tabs.update(tab.id, { active: true }).catch(() => {});
        await chrome.windows.update(tab.windowId, { focused: true }).catch(() => {});
      }
    } finally {
      ending.current = false;
    }
  };

  useEffect(() => {
    document.title = "1분 평화 카드 찾기";
    chrome.tabs.getCurrent().then(tab => {
      selfTab.current = tab;
    });
    getSession().then(saved => {
      setSession(saved);
      setLoaded(true);
    });
    const unwatch = watchSession(setSession);

    // 게임 중에 열린 탭(기념관 링크의 새 창 포함)은 끝날 때 모두 닫는다.
    const onCreated = (tab: chrome.tabs.Tab) => {
      if (gameActive.current && tab.id !== undefined && tab.id !== selfTab.current?.id) {
        gameTabs.current.add(tab.id);
      }
    };
    // 기념관 탭이 시간 종료를 먼저 알아채면 바로 결과로 넘어간다.
    const onMessage = (message: unknown) => {
      if ((message as { type?: string } | null)?.type === FESTIVAL_TIME_UP) {
        endGame();
      }
    };
    chrome.tabs.onCreated.addListener(onCreated);
    chrome.runtime.onMessage.addListener(onMessage);
    return () => {
      unwatch();
      chrome.tabs.onCreated.removeListener(onCreated);
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, []);

  useEffect(() => {
    if (session.status !== "running") return;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= session.endsAt) endGame();
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [session.status, session.endsAt]);

  const startGame = async () => {
    gameTabs.current.clear();
    gameActive.current = true;
    await startSession(durationMs);
    const tab = await chrome.tabs.create({ url: MUSEUM_HOME_URL, active: true });
    if (tab.id !== undefined) gameTabs.current.add(tab.id);
    setCountdown(null);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      startGame();
      return;
    }
    const timer = setTimeout(() => setCountdown(value => (value ?? 1) - 1), 800);
    return () => clearTimeout(timer);
  }, [countdown]);

  const showGameTab = async () => {
    const [tabId] = [...gameTabs.current];
    if (tabId !== undefined) {
      await chrome.tabs.update(tabId, { active: true }).catch(() => {});
    } else {
      const tab = await chrome.tabs.create({ url: MUSEUM_HOME_URL, active: true });
      if (tab.id !== undefined) gameTabs.current.add(tab.id);
      gameActive.current = true;
    }
  };

  const nextVisitor = async () => {
    gameActive.current = false;
    await resetSession();
  };

  if (!loaded) return null;

  return (
    <div style={{ minHeight: "100vh", background: CREAM, color: NAVY, fontFamily: FONT }}>
      <style>{`
        body { margin: 0; }
        @keyframes festival-count { from { transform: scale(1.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes festival-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        button:active { transform: translateY(3px); box-shadow: none !important; }
      `}</style>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", background: NAVY, color: CREAM }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: YELLOW }}>웹켓몬스터 × UN평화축제</span>
        <span style={{ fontSize: 16, color: "#c9d6ea" }}>유엔평화기념관 홈페이지에서 참전국 카드를 찾아요</span>
      </header>

      {session.status === "idle" && <ReadyScreen durationMs={durationMs} onStart={() => setCountdown(3)} />}

      {session.status === "running" && (
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "80px 40px" }}>
          <div style={{ fontSize: 36, fontWeight: 900 }}>게임 진행 중</div>
          <div style={{ fontSize: 120, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{formatClock(remainingMs(session, now))}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: BLUE }}>
            찾은 카드 {session.found.length}/{FESTIVAL_CARDS.length}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <button onClick={showGameTab} style={bigButton(BLUE, CREAM)}>기념관 화면으로</button>
            <button onClick={endGame} style={bigButton("#c9d6ea", NAVY)}>그만하기</button>
          </div>
        </main>
      )}

      {session.status === "finished" && <ResultScreen session={session} onNext={nextVisitor} />}

      {countdown !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(29, 37, 64, 0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div key={countdown} style={{ fontSize: countdown > 0 ? 220 : 140, fontWeight: 900, color: YELLOW, animation: "festival-count 0.5s ease-out" }}>
            {countdown > 0 ? countdown : "시작!"}
          </div>
        </div>
      )}
    </div>
  );
}

function ReadyScreen({ durationMs, onStart }: { durationMs: number; onStart: () => void }) {
  const steps = [
    "시작 버튼을 누르면 유엔평화기념관 홈페이지가 열려요",
    "메뉴와 게시판을 둘러보며 나라 이야기가 담긴 페이지를 찾아요",
    "카드가 나타나면 클릭해서 모아요"
  ];
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 36, padding: "40px 56px 56px" }}>
      <section style={{ display: "flex", gap: 48, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1 }}>
            {Math.round(durationMs / 1000) === 60 ? "1분" : `${Math.round(durationMs / 1000)}초`} 평화 카드 찾기
          </div>
          <div style={{ fontSize: 22, color: INK, lineHeight: 1.5 }}>
            6·25전쟁 때 우리를 도운 나라들의 카드 {FESTIVAL_CARDS.length}장이 기념관 홈페이지 곳곳에 숨어 있어요.
          </div>
          <ol style={{ margin: 0, paddingLeft: 28, fontSize: 22, lineHeight: 1.7 }}>
            {steps.map(step => <li key={step}>{step}</li>)}
          </ol>
          <div>
            <button onClick={onStart} style={bigButton(BLUE, CREAM)}>시작하기 ▶</button>
          </div>
        </div>
        <div style={{ position: "relative", width: 460, height: 330 }}>
          {["dk", "us", "se"].map((code, index) => (
            <img
              key={code}
              src={cardUrl(code)}
              alt=""
              style={{
                position: "absolute",
                left: index * 70,
                top: index * 70,
                width: 300,
                transform: `rotate(${[-6, 3, -2][index]}deg)`,
                animation: `festival-bob 2.4s ease-in-out ${index * 0.4}s infinite`,
                filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.25))"
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>힌트: 이런 이야기가 있는 페이지에 카드가 있어요</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {FESTIVAL_CARDS.map(card => (
            <div key={card.code} style={{ background: "#fffefa", border: `2px solid ${LINE}`, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{card.flag} {card.name}</div>
              <div style={{ fontSize: 15, color: INK, marginTop: 4, lineHeight: 1.35 }}>{card.hint}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// 노트북 화면(약 1280×720)에서 스크롤 없이 [다음 사람]까지 보이도록 결과와 카드 격자를 나란히 둔다.
function ResultScreen({ session, onNext }: { session: FestivalSession; onNext: () => void }) {
  const count = session.found.length;
  return (
    <main style={{ display: "flex", gap: 48, alignItems: "center", justifyContent: "center", padding: "28px 48px" }}>
      <div style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>시간 종료!</div>
        <div data-festival-result style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.2 }}>
          평화 카드<br />
          <span style={{ fontSize: 96, color: BLUE }}>{count}장</span>을<br />
          찾았어요
        </div>
        <div style={{ fontSize: 20, color: INK, lineHeight: 1.5 }}>
          {count > 0 ? "평화를 지킨 나라들을 만나 줘서 고마워요!" : "다음에는 꼭 찾아봐요!"}
        </div>
        <div>
          <button onClick={onNext} style={bigButton(YELLOW, NAVY)}>다음 사람 ▶</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 150px)", gap: 12 }}>
        {FESTIVAL_CARDS.map(card => {
          const found = hasFound(session, card.code);
          return (
            <div key={card.code} title={card.hint} style={{ textAlign: "center" }}>
              <img
                src={cardUrl(card.code)}
                alt={`${card.name} 카드`}
                style={{ display: "block", width: 150, filter: found ? "none" : "grayscale(1)", opacity: found ? 1 : 0.35 }}
              />
              <div style={{ fontSize: 15, fontWeight: found ? 900 : 500, color: found ? NAVY : "#8a94a8" }}>
                {found ? "✓ " : ""}{card.flag} {card.name}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
