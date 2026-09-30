import { Storage, type StorageCallbackMap } from "@plasmohq/storage";
import {
  IDLE_SESSION,
  collect,
  finishSession as finish,
  startSession as start,
  type CollectResult,
  type FestivalSession
} from "./logic";

// 축제 게임 한 판의 상태. 부스 화면과 기념관 탭들이 같은 값을 보고 움직인다.
const storage = new Storage({ area: "local" });
const SESSION_KEY = "festivalSession";

export async function getSession(): Promise<FestivalSession> {
  return (await storage.get<FestivalSession>(SESSION_KEY)) ?? IDLE_SESSION;
}

export async function startSession(durationMs: number): Promise<FestivalSession> {
  const session = start(Date.now(), durationMs);
  await storage.set(SESSION_KEY, session);
  return session;
}

export async function collectCard(code: string): Promise<{ result: CollectResult; session: FestivalSession }> {
  const outcome = collect(await getSession(), code, Date.now());
  if (outcome.result === "collected") {
    await storage.set(SESSION_KEY, outcome.session);
  }
  return outcome;
}

export async function finishSession(): Promise<FestivalSession> {
  const current = await getSession();
  const next = finish(current);
  if (next !== current) {
    await storage.set(SESSION_KEY, next);
  }
  return next;
}

export async function resetSession(): Promise<void> {
  await storage.set(SESSION_KEY, IDLE_SESSION);
}

export function watchSession(onChange: (session: FestivalSession) => void): () => void {
  const callbackMap: StorageCallbackMap = {
    [SESSION_KEY]: change => onChange((change.newValue as FestivalSession | undefined) ?? IDLE_SESSION)
  };
  storage.watch(callbackMap);
  return () => {
    storage.unwatch(callbackMap);
  };
}

// 기념관 탭 ↔ 부스 화면 메시지
export const FESTIVAL_TIME_UP = "festival:time-up";
export const FESTIVAL_PAGE_PATH = "tabs/festival.html";
