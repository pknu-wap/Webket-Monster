// 실행: cd frontend && node --test festival/logic.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { FESTIVAL_CARDS, cardImagePath } from "./cards.ts";
import {
  IDLE_SESSION,
  collect,
  findCardForUrl,
  finishSession,
  formatClock,
  remainingMs,
  startSession
} from "./logic.ts";

const BASE = "https://www.unpm.or.kr/un2022/sub.php";
const codeFor = (url: string) => findCardForUrl(url, FESTIVAL_CARDS)?.code ?? null;

test("카드 20장, 코드와 위치가 겹치지 않고 이미지가 모두 있다", () => {
  assert.equal(FESTIVAL_CARDS.length, 20);
  assert.equal(new Set(FESTIVAL_CARDS.map(card => card.code)).size, 20);
  assert.equal(new Set(FESTIVAL_CARDS.map(card => `${card.menuId}/${card.boNo ?? ""}`)).size, 20);
  for (const card of FESTIVAL_CARDS) {
    assert.ok(existsSync(new URL(`../${cardImagePath(card.code)}`, import.meta.url)), `${card.code} 이미지 없음`);
  }
});

test("20개 페이지가 모두 자기 카드로 매칭된다", () => {
  for (const card of FESTIVAL_CARDS) {
    const url = card.boNo
      ? `${BASE}?MenuID=${card.menuId}&bCode=${card.bCode}&mode=view&bo_no=${card.boNo}`
      : `${BASE}?MenuID=${card.menuId}`;
    assert.equal(codeFor(url), card.code, url);
  }
});

test("들어온 경로에 따라 붙는 값과 주소 변형을 무시한다", () => {
  assert.equal(codeFor(`${BASE}?&MenuID=26&bCode=X10&cate=&st=&ss=&gotoPage=2&mode=view&bo_no=567`), "gb");
  assert.equal(codeFor("http://unpm.or.kr/un2022/sub.php?MenuID=122&bCode=X3&mode=view&bo_no=420"), "ca");
  assert.equal(codeFor(`${BASE}?menuid=26&bcode=x10&mode=view&bo_no=1133`), "de");
  assert.equal(codeFor(`${BASE}?bCode=X13&mode=view&bo_no=2946`), "dk");
  assert.equal(codeFor(`${BASE}?MenuID=32&mode=view&bo_no=2946`), "dk");
  assert.equal(codeFor(`${BASE}?MenuID=68#top`), "us");
});

test("카드가 없는 페이지는 매칭하지 않는다", () => {
  assert.equal(codeFor("https://www.unpm.or.kr/un2022/"), null);
  assert.equal(codeFor(`${BASE}?MenuID=26&bCode=X10&gotoPage=2`), null);
  assert.equal(codeFor(`${BASE}?MenuID=32&bCode=X13&mode=view&bo_no=567`), null);
  assert.equal(codeFor(`${BASE}?MenuID=68&bCode=X1&mode=view&bo_no=1`), null);
  assert.equal(codeFor("https://example.com/un2022/sub.php?MenuID=68"), null);
  assert.equal(codeFor("not a url"), null);
});

test("남은 시간과 시계 표시", () => {
  const session = startSession(1_000, 60_000);
  assert.equal(remainingMs(session, 1_000), 60_000);
  assert.equal(remainingMs(session, 31_000), 30_000);
  assert.equal(remainingMs(session, 90_000), 0);
  assert.equal(remainingMs(IDLE_SESSION, 5_000), 0);
  assert.equal(formatClock(60_000), "1:00");
  assert.equal(formatClock(59_000), "0:59");
  assert.equal(formatClock(9_500), "0:10");
  assert.equal(formatClock(0), "0:00");
  assert.equal(formatClock(-5), "0:00");
});

test("카드 줍기: 새 카드, 중복, 시간 종료", () => {
  const session = startSession(0, 60_000);
  const first = collect(session, "dk", 10_000);
  assert.equal(first.result, "collected");
  assert.deepEqual(first.session.found, [{ code: "dk", at: 10_000 }]);
  assert.equal(session.found.length, 0, "원래 세션은 바꾸지 않는다");

  assert.equal(collect(first.session, "dk", 20_000).result, "duplicate");
  assert.equal(collect(first.session, "se", 60_000).result, "closed");
  assert.equal(collect(IDLE_SESSION, "se", 1).result, "closed");
  assert.equal(collect(finishSession(first.session), "se", 20_000).result, "closed");
});

test("종료는 진행 중인 세션에만 적용된다", () => {
  assert.equal(finishSession(startSession(0)).status, "finished");
  assert.equal(finishSession(IDLE_SESSION), IDLE_SESSION);
});
