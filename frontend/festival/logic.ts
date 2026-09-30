// "1분 평화 카드 찾기"의 순수 로직. 저장소나 브라우저 API를 쓰지 않아 node --test로 검사한다.

export type FestivalStatus = "idle" | "running" | "finished";

export interface FoundCard {
  code: string;
  at: number;
}

export interface FestivalSession {
  status: FestivalStatus;
  startedAt: number;
  endsAt: number;
  found: FoundCard[];
}

export interface CardLocation {
  code: string;
  menuId: string;
  bCode?: string;
  boNo?: string;
}

export const GAME_DURATION_MS = 60 * 1000;

export const IDLE_SESSION: FestivalSession = { status: "idle", startedAt: 0, endsAt: 0, found: [] };

// 게시판 글 주소에는 gotoPage, cate처럼 들어온 경로에 따라 바뀌는 값이 붙으므로
// MenuID·bCode·bo_no만 보고 카드를 찾는다. 파라미터 이름의 대소문자는 가리지 않는다.
export function findCardForUrl<T extends CardLocation>(url: string, cards: readonly T[]): T | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)unpm\.or\.kr$/i.test(parsed.hostname)) return null;

  const params = new Map<string, string>();
  parsed.searchParams.forEach((value, key) => params.set(key.toLowerCase(), value.trim()));
  const menuId = params.get("menuid") || null;
  const bCode = params.get("bcode")?.toUpperCase() || null;
  const boNo = params.get("bo_no") || null;

  for (const card of cards) {
    if (card.boNo) {
      const sameBoard = menuId === card.menuId || (!!card.bCode && bCode === card.bCode.toUpperCase());
      if (boNo === card.boNo && sameBoard) return card;
    } else if (!boNo && menuId === card.menuId) {
      return card;
    }
  }
  return null;
}

export function isPlaying(session: FestivalSession, now: number): boolean {
  return session.status === "running" && now < session.endsAt;
}

export function remainingMs(session: FestivalSession, now: number): number {
  if (session.status !== "running") return 0;
  return Math.max(0, session.endsAt - now);
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function hasFound(session: FestivalSession, code: string): boolean {
  return session.found.some(found => found.code === code);
}

export type CollectResult = "collected" | "duplicate" | "closed";

// 진행 중이 아니거나 시간이 끝났으면 "closed", 이미 찾은 카드면 "duplicate"를 돌려준다.
export function collect(session: FestivalSession, code: string, now: number): { result: CollectResult; session: FestivalSession } {
  if (!isPlaying(session, now)) return { result: "closed", session };
  if (hasFound(session, code)) return { result: "duplicate", session };
  return { result: "collected", session: { ...session, found: [...session.found, { code, at: now }] } };
}

export function startSession(now: number, durationMs: number = GAME_DURATION_MS): FestivalSession {
  return { status: "running", startedAt: now, endsAt: now + durationMs, found: [] };
}

export function finishSession(session: FestivalSession): FestivalSession {
  return session.status === "running" ? { ...session, status: "finished" } : session;
}
