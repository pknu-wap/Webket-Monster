// UN평화축제 "1분 평화 카드 찾기" 카드 20장.
// 위치는 유엔평화기념관 홈페이지(unpm.or.kr/un2022)의 MenuID·bCode·bo_no 기준이다.
// 이 파일은 node --test와 점검 스크립트에서도 불러오므로 import 없이 데이터만 둔다.

export type FestivalCardRole = "전투지원" | "의료지원";

export interface FestivalCard {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  role: FestivalCardRole;
  menuId: string;
  bCode?: string;
  boNo?: string;
  menuPath: string;
  hint: string;
}

export const MUSEUM_HOME_URL = "https://www.unpm.or.kr/un2022/";

export const FESTIVAL_CARDS: FestivalCard[] = [
  { code: "us", name: "미국", flag: "🇺🇸", symbol: "자유의 여신상", role: "전투지원", menuId: "68", menuPath: "전시 › 상설전시 › 리차드 위트컴전", hint: "부산역 대화재 때 군수 창고를 연 장군" },
  { code: "gb", name: "영국", flag: "🇬🇧", symbol: "빅벤", role: "전투지원", menuId: "26", bCode: "X10", boNo: "567", menuPath: "기념사업 › 이달의 참전국", hint: "유엔기념공원에 889명이 잠든 나라" },
  { code: "ca", name: "캐나다", flag: "🇨🇦", symbol: "단풍잎", role: "전투지원", menuId: "122", bCode: "X3", boNo: "420", menuPath: "전시 › 기획전시 › 지난전시", hint: "26,791명, \"한국의 방패\"가 된 나라" },
  { code: "au", name: "호주", flag: "🇦🇺", symbol: "오페라 하우스", role: "전투지원", menuId: "26", bCode: "X10", boNo: "1545", menuPath: "기념사업 › 이달의 참전국", hint: "부산에 상륙해 가평 전투에서 활약한 제3대대" },
  { code: "ph", name: "필리핀", flag: "🇵🇭", symbol: "지프니", role: "전투지원", menuId: "30", bCode: "X12", boNo: "588", menuPath: "자료실 › 추천도서", hint: "한국과 함께 \"자유의 수호신\"이 된 나라" },
  { code: "th", name: "태국", flag: "🇹🇭", symbol: "툭툭", role: "전투지원", menuId: "141", bCode: "X20", boNo: "2895", menuPath: "소개 › 서포터즈 › 활동사진", hint: "기념관 서포터즈가 여름마다 찾아가는 나라" },
  { code: "nl", name: "네덜란드", flag: "🇳🇱", symbol: "풍차", role: "전투지원", menuId: "122", bCode: "X3", boNo: "395", menuPath: "전시 › 기획전시 › 지난전시", hint: "한 소녀가 연결고리가 된 사진전" },
  { code: "co", name: "콜롬비아", flag: "🇨🇴", symbol: "에메랄드", role: "전투지원", menuId: "30", bCode: "X12", boNo: "514", menuPath: "자료실 › 추천도서", hint: "중남미에서 유일하게 전투부대를 보낸 나라" },
  { code: "gr", name: "그리스", flag: "🇬🇷", symbol: "파르테논 신전", role: "전투지원", menuId: "30", bCode: "X12", boNo: "925", menuPath: "자료실 › 추천도서", hint: "\"스파르타 대대\"로 불린 신화의 나라" },
  { code: "nz", name: "뉴질랜드", flag: "🇳🇿", symbol: "은빛 고사리", role: "전투지원", menuId: "22", bCode: "X5", boNo: "2940", menuPath: "교육 › 교육사진", hint: "한국 초등학생과 평화스쿨을 함께한 학교의 나라" },
  { code: "et", name: "에티오피아", flag: "🇪🇹", symbol: "커피 주전자 제베나", role: "전투지원", menuId: "204", bCode: "X17", boNo: "2847", menuPath: "소식 › 기념관 소식 › 보도", hint: "\"강뉴부대\" 후손들이 부산에 왔다" },
  { code: "be", name: "벨기에", flag: "🇧🇪", symbol: "와플", role: "전투지원", menuId: "30", bCode: "X12", boNo: "1020", menuPath: "자료실 › 추천도서", hint: "룩셈부르크와 한 부대로 싸운 나라" },
  { code: "fr", name: "프랑스", flag: "🇫🇷", symbol: "에펠탑", role: "전투지원", menuId: "27", bCode: "X11", boNo: "2399", menuPath: "기념사업 › 이달의 영웅", hint: "2025년 7월의 영웅이 된 육군 상사" },
  { code: "za", name: "남아공", flag: "🇿🇦", symbol: "킹 프로테아", role: "전투지원", menuId: "26", bCode: "X10", boNo: "1102", menuPath: "기념사업 › 이달의 참전국", hint: "수영비행장에서 날아오른 \"창공의 치타\"" },
  { code: "se", name: "스웨덴", flag: "🇸🇪", symbol: "세 왕관", role: "의료지원", menuId: "30", bCode: "X12", boNo: "1483", menuPath: "자료실 › 추천도서", hint: "부산 서면과 남구에 있던 \"서전병원\"" },
  { code: "in", name: "인도", flag: "🇮🇳", symbol: "연꽃", role: "의료지원", menuId: "26", bCode: "X10", boNo: "960", menuPath: "기념사업 › 이달의 참전국", hint: "공수훈련을 받은 의무병들의 제60야전병원" },
  { code: "dk", name: "덴마크", flag: "🇩🇰", symbol: "병원선 유틀란디아호", role: "의료지원", menuId: "32", bCode: "X13", boNo: "2946", menuPath: "소식 › 기념관 소식", hint: "부산항에 온 병원선 유틀란디아호" },
  { code: "no", name: "노르웨이", flag: "🇳🇴", symbol: "오로라", role: "의료지원", menuId: "122", bCode: "X3", boNo: "398", menuPath: "전시 › 기획전시 › 지난전시", hint: "6개월마다 의료진을 교대하며 도운 나라" },
  { code: "it", name: "이탈리아", flag: "🇮🇹", symbol: "피사의 사탑", role: "의료지원", menuId: "26", bCode: "X10", boNo: "1650", menuPath: "기념사업 › 이달의 참전국", hint: "참전국 중 유일한 유엔 비회원국" },
  { code: "de", name: "독일", flag: "🇩🇪", symbol: "브란덴부르크 문", role: "의료지원", menuId: "26", bCode: "X10", boNo: "1133", menuPath: "기념사업 › 이달의 참전국", hint: "부산여고가 병원이 된 나라" }
];

export const cardImagePath = (code: string) => `assets/festival/festival_card_${code}.webp`;

export const getCard = (code: string) => FESTIVAL_CARDS.find(card => card.code === code);
