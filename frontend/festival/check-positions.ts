// 축제 직전 점검: 카드 글이 게시판 목록 몇 쪽에 있는지 확인한다.
// 실행: cd frontend && npm run check:festival
// 목록 1~2쪽이면 통과, 3쪽 이상으로 밀렸거나 목록에서 사라졌으면 경고하고 실패 코드로 끝난다.
import { FESTIVAL_CARDS, type FestivalCard } from "./cards.ts";

const BASE = "https://www.unpm.or.kr/un2022/sub.php";
const MAX_PAGE = 3;

const fetchText = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
};

// 본문 영역에 나오는 글 번호를 목록 순서대로 모은다.
const listPostNumbers = (html: string) => {
  const start = html.indexOf('id="sub-contents-center"');
  const end = html.indexOf('id="footer"', start);
  const body = start >= 0 ? html.slice(start, end > start ? end : undefined) : html;
  const numbers: string[] = [];
  for (const match of body.matchAll(/bo_no=(\d+)/g)) {
    if (!numbers.includes(match[1])) numbers.push(match[1]);
  }
  return numbers;
};

type Position = { card: FestivalCard; place: string; ok: boolean };

const boards = new Map<string, FestivalCard[]>();
for (const card of FESTIVAL_CARDS) {
  if (!card.boNo) continue;
  const key = `${card.menuId}|${card.bCode}`;
  boards.set(key, [...(boards.get(key) ?? []), card]);
}

const positions: Position[] = [];

for (const card of FESTIVAL_CARDS.filter(item => !item.boNo)) {
  const html = await fetchText(`${BASE}?MenuID=${card.menuId}`);
  const ok = html.includes("sub-contents");
  positions.push({ card, place: ok ? "메뉴 페이지" : "페이지를 읽지 못함", ok });
}

for (const [key, cards] of boards) {
  const [menuId, bCode] = key.split("|");
  const pages: string[][] = [];
  for (let page = 1; page <= MAX_PAGE; page++) {
    pages.push(listPostNumbers(await fetchText(`${BASE}?MenuID=${menuId}&bCode=${bCode}&cate=&st=&ss=&gotoPage=${page}`)));
  }
  for (const card of cards) {
    const pageIndex = pages.findIndex(numbers => numbers.includes(card.boNo!));
    if (pageIndex < 0) {
      positions.push({ card, place: `목록 ${MAX_PAGE}쪽 안에 없음`, ok: false });
      continue;
    }
    const rank = pages[pageIndex].indexOf(card.boNo!) + 1;
    positions.push({ card, place: `${pageIndex + 1}쪽 ${rank}번째`, ok: pageIndex + 1 < MAX_PAGE });
  }
}

positions.sort((a, b) => FESTIVAL_CARDS.indexOf(a.card) - FESTIVAL_CARDS.indexOf(b.card));
for (const { card, place, ok } of positions) {
  console.log(`${ok ? "✓" : "✗"} ${card.flag} ${card.name.padEnd(6)} ${card.menuPath.padEnd(24)} ${place}`);
}

const problems = positions.filter(position => !position.ok);
if (problems.length > 0) {
  console.log(`\n확인 필요 ${problems.length}장: ${problems.map(p => p.card.name).join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("\n20장 모두 목록 2쪽 안에 있어요.");
}
