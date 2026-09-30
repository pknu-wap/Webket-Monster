// "1분 평화 카드 찾기" 전체 흐름 E2E 테스트.
// 먼저 npm run build 후 실행: npm run e2e:festival
// 실제 유엔평화기념관 홈페이지에 접속하므로 인터넷이 필요하다.
// FESTIVAL_E2E_SHOTS=폴더 를 주면 단계별 화면을 저장한다.
const puppeteer = require("puppeteer");
const path = require("path");

const EXTENSION_PATH = path.join(__dirname, "build", "chrome-mv3-prod");
const DENMARK_URL = "https://www.unpm.or.kr/un2022/sub.php?MenuID=32&bCode=X13&cate=&st=&ss=&gotoPage=1&mode=view&bo_no=2946";
const GAME_SECONDS = 15;
const SHOTS_DIR = process.env.FESTIVAL_E2E_SHOTS;

const step = message => console.log(`✓ ${message}`);
// 화면을 그리지 못하는 환경(원격·샌드박스 헤드리스)에서도 돌도록
// 마우스 좌표 클릭 대신 DOM 클릭을 쓰고, 대기는 requestAnimationFrame 대신 시간 간격으로 확인한다.
const clickDom = async (page, selector, timeout = 10000) => {
  const element = await page.waitForSelector(selector, { timeout });
  await element.evaluate(el => el.click());
};
const shot = async (page, name) => {
  if (!SHOTS_DIR) return;
  // 헤드리스 크롬은 뒤에 있는 탭을 그리지 않으므로 캡처 전에 앞으로 가져온다.
  await page.bringToFront();
  await page.screenshot({ path: path.join(SHOTS_DIR, `${name}.png`) });
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    pipe: true,
    enableExtensions: true,
    defaultViewport: { width: 1280, height: 760 }
  });
  const errors = [];
  // 기념관 사이트 자체 스크립트 오류(예: tts_setCookie)는 빼고, 확장 코드에서 난 오류만 모은다.
  const watchErrors = page =>
    page.on("pageerror", error => {
      const fromExtension = page.url().startsWith("chrome-extension://") || String(error.stack).includes("chrome-extension://");
      if (fromExtension) errors.push(`${page.url()}: ${error.message}`);
    });

  try {
    const extensionId = await browser.installExtension(EXTENSION_PATH);
    step(`확장 설치 (${extensionId})`);

    const booth = await browser.newPage();
    watchErrors(booth);
    await booth.goto(`chrome-extension://${extensionId}/tabs/festival.html?sec=${GAME_SECONDS}`);
    await booth.waitForSelector("::-p-text(시작하기)");
    await shot(booth, "1-ready");
    step("대기 화면");

    await clickDom(booth, "::-p-text(시작하기)");
    const museumTarget = await browser.waitForTarget(target => target.url().startsWith("https://www.unpm.or.kr/"), { timeout: 15000 });
    const museum = await museumTarget.page();
    watchErrors(museum);
    step("카운트다운 뒤 기념관 홈페이지 열림");

    await museum.goto(DENMARK_URL, { waitUntil: "domcontentloaded" });
    await museum.waitForSelector('>>> [data-festival-card="dk"]', { timeout: 15000 });
    // 카드 그림이 web_accessible_resources로 실제로 불러와졌는지 확인한다.
    const cardImage = await museum.waitForSelector('>>> [data-festival-card="dk"] img');
    await museum.waitForFunction(img => img.complete, { timeout: 5000, polling: 250 }, cardImage);
    const imageWidth = await cardImage.evaluate(img => img.naturalWidth);
    if (imageWidth === 0) throw new Error("카드 그림을 불러오지 못함");
    await new Promise(resolve => setTimeout(resolve, 700));
    await shot(museum, "2-card");
    step(`덴마크 글에서 카드 등장 (그림 ${imageWidth}px 로드)`);

    await clickDom(museum, '>>> [data-festival-card="dk"]');
    await museum.waitForFunction(
      () => {
        const host = [...document.querySelectorAll("*")].find(el => el.shadowRoot?.querySelector("[data-festival-count]"));
        return host?.shadowRoot.querySelector("[data-festival-count]").textContent.includes("1/20");
      },
      { timeout: 5000, polling: 250 }
    );
    await shot(museum, "3-collected");
    step("카드 클릭 → HUD 1/20");

    const museumClosed = new Promise(resolve => museum.once("close", resolve));
    await Promise.race([
      museumClosed,
      new Promise((_, reject) => setTimeout(() => reject(new Error("시간이 끝났는데 게임 탭이 닫히지 않음")), (GAME_SECONDS + 15) * 1000))
    ]);
    step("시간 종료 → 게임 탭 닫힘");

    await booth.waitForSelector("[data-festival-result]", { timeout: 10000 });
    const result = await booth.$eval("[data-festival-result]", el => el.textContent);
    if (!result.includes("1장")) throw new Error(`결과가 1장이 아님: ${result}`);
    await shot(booth, "4-result");
    step(`결과 화면: ${result.replace(/\s+/g, " ").trim()}`);

    await clickDom(booth, "::-p-text(다음 사람)");
    await booth.waitForSelector("::-p-text(시작하기)", { timeout: 5000 });
    step("다음 사람 → 대기 화면으로 초기화");

    if (errors.length > 0) throw new Error(`페이지 오류:\n${errors.join("\n")}`);
    console.log("\nE2E 통과");
  } catch (error) {
    console.error(`\n✗ E2E 실패: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
