import type {
  SnsEpisode,
  SnsQuestion,
  SnsTopicVote,
  SnsUgc,
  SnsEngagement,
} from "./types";

export const SNS_BANNED_WORDS: string[] = [
  "최고의",
  "완벽한",
  "환상적인",
  "꼭 가봐야 할",
  "강추",
  "대박",
  "기적",
  "감동 실화",
  "눈물 없이",
  "한국 최고",
  "세계 최고",
  "무조건",
  "100% 보장",
  "특가",
  "할인 이벤트",
];

export const JIHU_THREE_PRINCIPLES = [
  {
    code: "JIHU-01",
    title: "원칙 1 — 먼저 묻지 않고 옆에 둔다",
    desc: "상대가 도움을 청하기 전에 과잉 친절로 개입하지 않는다. 필요한 물건이나 화면을 말없이 옆에 놓아둔다.",
  },
  {
    code: "JIHU-02",
    title: "원칙 2 — 해결해 준 뒤 생색내지 않는다",
    desc: "'내가 도와줬다'는 표정이나 대사를 넣지 않는다. 해결 직후 자신의 할 일(악보 정리·연습)로 바로 돌아간다.",
  },
  {
    code: "JIHU-03",
    title: "원칙 3 — 문화를 고치지 않고 방식만 통역한다",
    desc: "외국인 멤버의 생활 습관이나 신앙을 한국식에 맞추려 하지 않고, 한국의 시스템(앱·표기·절차)만 담백하게 넘겨준다.",
  },
];

export const MUSLIM_REL_RULES = [
  {
    code: "REL-01",
    rule: "코란 원문·아랍어 경전 구절 직접 인용 금지 — 화면 자막·소품·BGM에 경전 원문을 넣지 않는다",
  },
  {
    code: "REL-02",
    rule: "예배(살라트) 동작 희화화 절대 금지 — 기도 장면을 개그·놀람 리액션의 소재로 소비하지 않는다",
  },
  {
    code: "REL-03",
    rule: "할랄(Halal) 확인의 일상화 — 까다로운 식성이 아니라 당연한 생활 기준으로 담백하게 묘사한다",
  },
  {
    code: "REL-04",
    rule: "지후의 비개입 배려 — 교리를 묻거나 설명하지 않고 성분표 번역·공간 확보 등 물리적 환경만 돕는다",
  },
  {
    code: "REL-05",
    rule: "설교·대표성 배제 — 이슬람 전체를 대변하는 설명조 대신 아이만 개인의 서울 생활기로만 그린다",
  },
  {
    code: "REL-06",
    rule: "말레이시아 현지 자문 검수 완료 — 공개 전 무슬림 크리에이터 자문단 시사 확인을 거친다",
  },
];

function createDefaultMuslimChecks(isMuslim: boolean, allDone = false) {
  if (!isMuslim) return [];
  return MUSLIM_REL_RULES.map((item, idx) => ({
    id: idx + 1,
    code: item.code,
    rule: item.rule,
    done: allDone ? true : idx < 4,
  }));
}

interface RawSnsSeed {
  no: number;
  code: string;
  memberId: "M2" | "M3" | "M4" | "M5";
  title: string;
  place: string;
  barrier: string;
  jihuAction: string;
  isMuslimEpisode: boolean;
  status: SnsEpisode["status"];
  releaseWeek: number;
  releaseDay: "화" | "금";
  accentColor: string;
  koreanPhrase: string;
  pronunciation: string;
  solutionTip: string;
  jihuQuote: string;
  askPrompt: string;
  beats: [string, string, string, string, string, string];
  igCopy: string;
  xCopy: string;
  lineCopy: string;
}

const RAW_SNS_EPISODES: RawSnsSeed[] = [
  {
    no: 1,
    code: "E1",
    memberId: "M2",
    title: "본인인증 번호가 없는 밤",
    place: "합정 숙소 거실",
    barrier: "한국 휴대폰 개통 전이라 배달앱 본인인증에서 막혀 저녁을 못 시킴",
    jihuAction: "말없이 자기 폰으로 주소를 맞춰 두고 메뉴 화면만 이든 쪽으로 돌려놓는다",
    isMuslimEpisode: false,
    status: "PUBLISHED",
    releaseWeek: 1,
    releaseDay: "화",
    accentColor: "#1F5E63",
    koreanPhrase: "문 앞에 두고 벨 누르지 마세요",
    pronunciation: "Mun a-pe du-go bel nu-reu-ji ma-se-yo",
    solutionTip: "외국인 등록증(ARC) 발급 전에는 선불 유심 대신 매장 현장결제·컨시어지 픽업 옵션을 활용하세요.",
    jihuQuote: "고르는 건 네가 해. 결제는 연습 끝나고 정산하자.",
    askPrompt: "한국 앱을 쓸 때 본인인증 때문에 가장 당황했던 순간은 언제였나요?",
    beats: [
      "밤 11시, 이든의 폰 화면에 뜬 '본인인증 실패' 팝업 클로즈업",
      "영문 카드로도 넘어가지 않는 배달앱 결제창 앞에서 한숨 쉬는 이든",
      "방에서 나오던 지후가 이든의 화면을 1초 보고 식탁에 앉음",
      "지후가 본인 인증된 공기계에 숙소 주소를 세팅해 이든 앞에 밀어둠",
      "배달 요청사항 한 줄 '문 앞에 두고 벨 누르지 마세요' 복사 카드 제시",
      "여러분은 한국 도착 첫날 밤, 첫 끼를 어떻게 해결했나요?",
    ],
    igCopy:
      "서울 도착 첫날 밤, 배는 고픈데 '본인인증' 네 글자에 멈춰버린 이든. 지후는 묻지 않고 공기계 화면만 돌려놓았습니다. 오늘의 SOS 문장: 문 앞에 두고 벨 누르지 마세요.",
    xCopy:
      "[E1] 한국 번호 없이는 야식도 못 시키는 밤. 지후가 식탁 위에 밀어둔 공기계 하나. 여러분의 첫 서울 야식은 무엇이었나요?",
    lineCopy:
      "韓国到着初日の夜、本人認証で止まったエデンのスマホ。ジフは何も聞かず画面だけを向けました。今日のSOSフレーズを保存しておきましょう。",
  },
  {
    no: 2,
    code: "E2",
    memberId: "M2",
    title: "키오스크 뒤의 줄",
    place: "홍대 무인 카페",
    barrier: "테이크아웃/매장컵 선택과 포인트 적립 팝업이 연달아 떠서 뒷사람 눈치가 보임",
    jihuAction: "뒤에 서서 재촉하지 않고 '건너뛰기' 버튼 위치만 손끝으로 짚어준다",
    isMuslimEpisode: false,
    status: "PUBLISHED",
    releaseWeek: 1,
    releaseDay: "금",
    accentColor: "#1F5E63",
    koreanPhrase: "적립 안 하고 바로 결제할게요",
    pronunciation: "Jeong-nip an ha-go ba-ro gyeol-je-hal-ge-yo",
    solutionTip: "한국 키오스크의 마지막 2단계는 대부분 '멤버십 적립'과 '영수증 출력'입니다. 회색 [건너뛰기]를 누르면 바로 결제됩니다.",
    jihuQuote: "회색 버튼 두 번이면 끝나. 천천히 눌러.",
    askPrompt: "한국 카페 키오스크에서 가장 헷갈렸던 버튼은 무엇인가요?",
    beats: [
      "키오스크 화면의 30초 카운트다운 숫자가 줄어드는 클로즈업",
      "이든 뒤로 줄이 세 명 늘어나고 손가락이 멈칫함",
      "지후가 바로 뒷자리에 서서 뒷사람 시선을 자연스럽게 가려줌",
      "화면 하단 '적립 건너뛰기' 한 곳만 짧게 짚고 물러남",
      "키오스크 마지막 2단계 팝업 패턴 요약 SOS 카드",
      "키오스크 앞에서 뒷사람 눈치 보였던 적 있나요?",
    ],
    igCopy:
      "키오스크 타이머는 줄어드는데 팝업이 세 번 연속 뜰 때. 지후는 이든 바로 뒤에 서서 시선을 막아주고 회색 버튼 하나만 짚었습니다.",
    xCopy:
      "[E2] 키오스크 앞에서 줄이 길어질 때 당황하지 않는 법. 마지막 팝업 두 개는 회색 건너뛰기만 기억하세요.",
    lineCopy:
      "キオスクの後ろに列ができると焦りますよね。ジフがそっと教えてくれた「グレーのボタン2回」の法則。",
  },
  {
    no: 3,
    code: "E3",
    memberId: "M2",
    title: "종량제 봉투의 색깔",
    place: "마포구 편의점",
    barrier: "구마다 다른 종량제 봉투 규격과 일반/음식물 분리 기준을 몰라 편의점에서 망설임",
    jihuAction: "마포구 10리터 봉투 두 종류를 집어 바구니에 넣고 매직으로 영어 약자를 적어둔다",
    isMuslimEpisode: false,
    status: "REVIEWED",
    releaseWeek: 2,
    releaseDay: "화",
    accentColor: "#1F5E63",
    koreanPhrase: "마포구 일반 쓰레기봉투 10리터 주세요",
    pronunciation: "Ma-po-gu il-ban sseu-re-gi-bong-tu sim-ni-teo ju-se-yo",
    solutionTip: "한국 쓰레기봉투는 거주하는 '구(District)' 이름이 적힌 봉투만 수거됩니다. 편의점 계산대에서 구 이름과 리터(10L/20L)를 말하세요.",
    jihuQuote: "흰색은 일반, 노란색은 음식물. 숙소 현관 옆에 걸어뒀어.",
    askPrompt: "한국 분리수거 규칙 중 가장 낯설었던 것은 무엇인가요?",
    beats: [
      "편의점 계산대 앞에서 봉투 이름을 몰라 머뭇거리는 이든",
      "점원이 '일반이요, 음식물이요?' 묻자 말문이 막힘",
      "지후가 뒤에서 '마포구 일반 10리터 두 장이요'라고 대신 말함",
      "숙소에 돌아와 봉투 겉면에 GEN / FOOD 두 글자만 적어 걸어둠",
      "구별 종량제 봉투 구매 필수 문장 SOS 카드",
      "한국의 분리수거 시스템에서 가장 신기했던 점은 무엇인가요?",
    ],
    igCopy:
      "편의점 계산대 안쪽에만 있는 종량제 봉투. 구 이름과 리터를 말해야 살 수 있습니다. 지후가 현관에 걸어둔 두 장의 봉투.",
    xCopy:
      "[E3] '마포구 일반 10리터 주세요.' 한국 편의점에서 쓰레기봉투 살 때 꼭 필요한 한 문장.",
    lineCopy:
      "韓国のゴミ袋は区ごとに色が違います。コンビニのレジでそのまま使える一言カード。",
  },
  {
    no: 4,
    code: "E4",
    memberId: "M2",
    title: "심야 막차와 호출 안 되는 택시",
    place: "올림픽공원역 3번 출구",
    barrier: "공연 관람 직후 밤 11시 반, 해외 카드로 택시 앱 호출이 연달아 취소됨",
    jihuAction: "출구 앞 인파에서 두 블록 떨어진 정차 가능 구역 좌표를 찍어 이든을 데려간다",
    isMuslimEpisode: false,
    status: "CARD_READY",
    releaseWeek: 2,
    releaseDay: "금",
    accentColor: "#1F5E63",
    koreanPhrase: "현장 결제 가능한 택시로 호출할게요",
    pronunciation: "Hyeon-jang gyeol-je ga-neung-han taek-si-ro ho-chul-hal-ge-yo",
    solutionTip: "공연장 직후에는 출구 바로 앞 대신 도보 5분 거리 대도로변 승차 지점으로 이동하거나 사전 확보된 송영 리무진을 이용하세요.",
    jihuQuote: "출구 앞은 차가 못 서. 저쪽 사거리 건너서 타자.",
    askPrompt: "한국에서 밤늦게 공연이나 일정을 마치고 귀가할 때 가장 걱정되는 점은 무엇인가요?",
    beats: [
      "밤 11시 40분, 공연장 앞 수백 명의 인파와 '배차 실패' 화면",
      "해외 카드 사전결제 오류까지 겹쳐 발을 동동 구르는 이든",
      "지후가 이든의 손목시계를 한 번 보고 횡단보도 쪽으로 걸어감",
      "정차 가능한 한적한 사거리에서 '직접 결제' 옵션으로 2분 만에 승차",
      "심야 공연장 귀가 동선 & 현장 결제 호출 SOS 카드",
      "심야 콘서트 후 숙소로 돌아갈 때 여러분만의 팁이 있나요?",
    ],
    igCopy:
      "공연이 끝난 밤 11시 40분, 출구 앞에서는 택시가 잡히지 않습니다. 지후가 말없이 건너간 사거리 승차 포인트.",
    xCopy:
      "[E4] 콘서트 직후 택시 배차 실패를 피하는 가장 현실적인 방법. 도보 5분 이동 + 현장 결제 호출.",
    lineCopy:
      "ライブ終了後の深夜、駅前でタクシーが捕まらない時。ジフが選んだ2ブロック先の乗車スポット。",
  },
  {
    no: 5,
    code: "W1",
    memberId: "M3",
    title: "보증금과 월세 사이",
    place: "연남동 부동산 앞",
    barrier: "한국 특유의 높은 보증금(전세·반전세)과 관리비 별도 구조를 이해하지 못해 계약서 앞에서 멈춤",
    jihuAction: "계약서 특약란 옆에 '관리비 포함 항목' 체크 메모지만 조용히 붙여준다",
    isMuslimEpisode: false,
    status: "PUBLISHED",
    releaseWeek: 3,
    releaseDay: "화",
    accentColor: "#2C4A6F",
    koreanPhrase: "관리비에 수도랑 인터넷이 포함되어 있나요?",
    pronunciation: "Gwan-ri-bi-e su-do-rang in-teo-ne-si po-ham-doe-eo in-na-yo?",
    solutionTip: "한국 단기/장기 숙소 계약 시 월세 외에 '관리비(Maintenance fee)' 포함 항목(수도·전기·가스·인터넷)을 반드시 먼저 확인하세요.",
    jihuQuote: "월세 숫자만 보지 말고 이 세 줄만 물어봐.",
    askPrompt: "한국의 집 구하기(보증금·관리비) 문화에서 가장 놀랐던 점은 무엇인가요?",
    beats: [
      "부동산 유리창에 붙은 '500/65' 숫자를 응시하는 위하오",
      "관리비 별도 항목 설명이 빨라지자 손끝이 굳는 위하오",
      "옆자리에 앉은 지후가 수첩 한 장을 찢어 항목 세 개를 적음",
      "중개사에게 위하오가 직접 읽을 수 있도록 한글 발음 옆에 한자를 병기해 줌",
      "한국 숙소·원룸 체크 필수 질문 3가지 SOS 카드",
      "한국 집 표기 '500/65'를 처음 봤을 때 무슨 뜻인지 아셨나요?",
    ],
    igCopy:
      "'500/65'라는 숫자 뒤에 숨은 관리비 항목들. 위하오가 직접 물어볼 수 있도록 지후는 수첩 귀퉁이에 질문 세 줄만 적어 건넸습니다.",
    xCopy:
      "[W1] 한국 부동산 유리창의 '500/65'와 관리비 체크리스트. 위하오의 첫 서울 방 구하기.",
    lineCopy:
      "韓国の部屋探しで必ず確認したい「管理費」の内訳。ウィハオのためにジフが書いた3行のメモ。",
  },
  {
    no: 6,
    code: "W2",
    memberId: "M3",
    title: "은행 번호표와 서류 세 장",
    place: "신촌 은행 지점",
    barrier: "외국인 한도제한계좌 해제에 필요한 서류를 몰라 번호표만 쥐고 기다림",
    jihuAction: "창구 순번이 오기 전 필요한 서류 순서를 클립으로 묶어 위하오 손에 쥐여준다",
    isMuslimEpisode: false,
    status: "REVIEWED",
    releaseWeek: 3,
    releaseDay: "금",
    accentColor: "#2C4A6F",
    koreanPhrase: "체크카드 발급이랑 모바일 뱅킹 신청하려고요",
    pronunciation: "Che-keu-ka-deu bal-geu-bi-rang mo-ba-il baeng-king sin-cheong-ha-ryeo-go-yo",
    solutionTip: "외국인 계좌 개설 시 여권·외국인등록증·거주지 증빙(계약서) 3가지를 순서대로 준비하면 창구 시간을 절반으로 줄일 수 있습니다.",
    jihuQuote: "창구 가면 말 많이 안 해도 돼. 이 순서대로만 내밀어.",
    askPrompt: "한국 은행이나 관공서에서 가장 어려웠던 한국어 단어는 무엇인가요?",
    beats: [
      "대기인수 18명이 찍힌 은행 번호표를 내려다보는 위하오",
      "가방 안에서 여권과 서류가 뒤섞여 초조해짐",
      "지후가 서류 세 장을 제출 순서대로 포개 클립을 꽂아줌",
      "맨 위 포스트잇에 '체크카드 + 모바일뱅킹' 여덟 글자를 적어둠",
      "외국인 은행 창구 방문 필수 서류 3종 SOS 카드",
      "한국에서 통장이나 카드를 만들 때 얼마나 걸리셨나요?",
    ],
    igCopy:
      "은행 대기 번호가 다가올수록 빨라지는 심장 소리. 지후는 말 대신 서류 세 장에 클립 하나를 꽂아주었습니다.",
    xCopy:
      "[W2] 외국인 은행 창구에서 당황하지 않는 서류 3장 순서. 위하오의 첫 체크카드 만들기.",
    lineCopy:
      "韓国の銀行窓口で緊張するウィハオ。ジフがクリップで留めた書類3枚の順番。",
  },
  {
    no: 7,
    code: "W3",
    memberId: "M3",
    title: "약국 앞의 손짓",
    place: "홍대입구역 약국",
    barrier: "환절기 목감기 증상을 한국어로 설명하기 어려워 종합감기약만 사려 함",
    jihuAction: "증상 부위(인후통·기침·발열 유무)가 적힌 메모 화면을 약사에게 보여줄 수 있게 띄워준다",
    isMuslimEpisode: false,
    status: "SCRIPTED",
    releaseWeek: 4,
    releaseDay: "화",
    accentColor: "#2C4A6F",
    koreanPhrase: "열은 없고 목이 부어서 침 삼킬 때 아파요",
    pronunciation: "Yeo-reun eop-go mo-gi bu-eo-seo chim sam-kil ttae a-pa-yo",
    solutionTip: "한국 약국에서는 '감기약 주세요'보다 열 유무와 아픈 부위(목·코·몸살)를 구분해 말하면 훨씬 정확한 일반의약품을 안내받습니다.",
    jihuQuote: "노래해야 하니까 졸리지 않은 약인지 꼭 물어보고.",
    askPrompt: "해외 체류 중 약국에서 증상을 설명하느라 진땀 뺐던 경험이 있나요?",
    beats: [
      "연습 중 헛기침을 참으며 목을 감싸는 위하오",
      "약국 문 앞에서 한국어 단어가 떠오르지 않아 멈춰 섬",
      "지후가 폰 메모장에 큰 글씨로 증상 두 줄을 적어 건넴",
      "'졸린 성분 없는 걸로 부탁드립니다' 한 줄이 아래에 덧붙여져 있음",
      "한국 약국 증상별 핵심 표현 SOS 카드",
      "한국 약국에서 사본 아이템 중 가장 유용했던 것은 무엇인가요?",
    ],
    igCopy:
      "보컬에게 가장 무서운 환절기 목감기. 지후가 적어준 메모 마지막 줄에는 '졸린 성분 없는 것'이라는 여덟 글자가 있었습니다.",
    xCopy:
      "[W3] 약국에서 '감기약 주세요' 대신 쓰기 좋은 증상 표현 카드. 위하오의 환절기 기록.",
    lineCopy:
      "韓国の薬局で症状を正確に伝えるフレーズ。ボーカルのウィハオを気遣うジフのメモ。",
  },
  {
    no: 8,
    code: "W4",
    memberId: "M3",
    title: "비 오는 날의 우산꽂이",
    place: "성수동 연습실 빌딩 입구",
    barrier: "똑같이 생긴 투명 비닐우산 수십 개 사이에서 자기 우산을 잃어버릴까 봐 들고 들어가려다 바닥을 적심",
    jihuAction: "우산 손잡이에 위하오 이니셜이 적힌 실리콘 링을 말없이 끼워준다",
    isMuslimEpisode: false,
    status: "PLANNING",
    releaseWeek: 4,
    releaseDay: "금",
    accentColor: "#2C4A6F",
    koreanPhrase: "우산 비닐 커버는 입구 오른쪽에 있어요",
    pronunciation: "U-san bi-nil keo-beo-neun ip-gu o-reun-jjo-ge i-sseo-yo",
    solutionTip: "장마철 한국 건물 입구에는 우산 빗물 제거기나 우산꽂이가 비치되어 있습니다. 투명 우산 손잡이에 작은 표시를 해두면 바뀌지 않습니다.",
    jihuQuote: "손잡이에 이거 끼워둬. 아무도 안 가져가.",
    askPrompt: "비 오는 날 한국 거리나 지하철에서 인상 깊었던 풍경이 있나요?",
    beats: [
      "폭우가 쏟아지는 성수동, 입구 우산꽂이에 꽂힌 똑같은 투명 우산 30개",
      "젖은 우산을 들고 서서 들어가지 못하는 위하오",
      "지후가 주머니에서 회색 실리콘 링을 꺼내 위하오 우산 손잡이에 끼움",
      "나란히 우산꽂이 맨 왼쪽 칸에 꽂고 연습실 계단을 오름",
      "비 오는 날 한국 실내 출입 매너 & 표현 SOS 카드",
      "투명 비닐우산이 바뀐 적, 한 번쯤 있지 않나요?",
    ],
    igCopy:
      "비 오는 날 서울의 우산꽂이에는 똑같은 투명 우산이 스무 개씩 꽂힙니다. 지후가 손잡이에 끼워준 작은 고리 하나.",
    xCopy:
      "[W4] 장마철 서울에서 내 투명 우산을 지키는 법. 지후가 건넨 실리콘 링.",
    lineCopy:
      "雨の日のソウル、同じビニール傘が並ぶ傘立て。ジフがつけてくれた小さな目印。",
  },
  {
    no: 9,
    code: "H1",
    memberId: "M4",
    title: "식당 벨을 누르기 전의 3초",
    place: "망원동 백반집",
    barrier: "일본처럼 점원이 먼저 오기를 기다리다 15분째 물도 못 받고 앉아 있음",
    jihuAction: "하루토가 민망하지 않게 테이블 모서리 호출 벨을 자연스럽게 한 번 누르고 물병을 따라준다",
    isMuslimEpisode: false,
    status: "PUBLISHED",
    releaseWeek: 5,
    releaseDay: "화",
    accentColor: "#3B5249",
    koreanPhrase: "여기 주문할게요, 반찬 조금만 더 주실 수 있나요?",
    pronunciation: "Yeo-gi ju-mun-hal-ge-yo, ban-chan jo-geum-man deo ju-sil su in-na-yo?",
    solutionTip: "한국 식당 대부분은 테이블 측면이나 위에 작은 호출 벨(딩동 벨)이 있습니다. 벨을 누르는 것이 가장 자연스러운 매너입니다.",
    jihuQuote: "여긴 벨 눌러야 오셔. 물은 셀프고.",
    askPrompt: "한국 식당 문화(호출벨·셀프 물·반찬 리필) 중 가장 편하거나 어색했던 것은 무엇인가요?",
    beats: [
      "점심시간 망원동 식당, 조용히 손만 들고 타이밍을 재는 하루토",
      "바쁜 직원이 계속 지나치자 귀가 붉어지며 고개를 숙임",
      "맞은편에 앉은 지후가 테이블 옆면의 검은색 호출 벨을 툭 누름",
      "'딩동' 소리와 함께 물컵에 보리차를 따라 하루토 앞에 놓음",
      "한국 식당 호출벨 & 셀프 코너 이용 SOS 카드",
      "한국 식당에서 '이모님' 부르기 vs 벨 누르기, 어느 쪽이 더 편한가요?",
    ],
    igCopy:
      "점원과 눈이 마주치길 15분째 기다리던 하루토. 지후는 말없이 테이블 옆면의 작은 검은 버튼을 눌렀습니다.",
    xCopy:
      "[H1] 일본에서 온 하루토가 한국 식당에서 15분 동안 주문하지 못한 이유. 테이블 옆 호출벨을 찾아보세요.",
    lineCopy:
      "店員さんと目が合うのを15分待っていたハルト。韓国の食堂ではテーブル横のベルを押すのが基本です。",
  },
  {
    no: 10,
    code: "H2",
    memberId: "M4",
    title: "버스 하차벨과 환승 30분",
    place: "합정역 환승 정류장",
    barrier: "내릴 때 카드를 한 번 더 찍어야 환승 할인이 된다는 걸 몰라 그냥 내리려 함",
    jihuAction: "뒷문 단말기 앞에 먼저 서서 자기 카드를 찍으며 하루토가 따라 찍을 시간을 벌어준다",
    isMuslimEpisode: false,
    status: "REVIEWED",
    releaseWeek: 5,
    releaseDay: "금",
    accentColor: "#3B5249",
    koreanPhrase: "이번 정류장에서 내릴게요, 잠시만요",
    pronunciation: "I-beon jeong-nyu-jang-e-seo nae-ril-ge-yo, jam-si-man-yo",
    solutionTip: "서울 대중교통(버스↔지하철)은 하차 시 반드시 교통카드를 태그해야 30분 이내 무료 환승이 적용됩니다.",
    jihuQuote: "내릴 때도 찍어야 다음 지하철이 안 깨져.",
    askPrompt: "서울 버스나 지하철 환승 시스템에서 가장 헷갈렸던 규칙은 무엇인가요?",
    beats: [
      "만원 버스 안, 정류장 안내방송이 나오자 문 쪽으로 이동하는 하루토",
      "지갑을 가방에 넣은 채 그냥 계단을 내려가려 함",
      "지후가 단말기 앞에서 '삑— 환승입니다' 소리가 나게 천천히 태그함",
      "하루토가 아차 하며 카드를 꺼내 찍을 때까지 문 옆에서 기다려 줌",
      "서울 대중교통 하차 태그 & 30분 환승 규칙 SOS 카드",
      "하차 태그를 깜빡해서 기본요금을 두 번 낸 적이 있나요?",
    ],
    igCopy:
      "'환승입니다.' 이 짧은 소리를 듣기 위해 내릴 때도 카드를 찍어야 한다는 걸, 하루토는 오늘 처음 알았습니다.",
    xCopy:
      "[H2] 서울 버스에서 내릴 때 카드를 안 찍으면 생기는 일. 하루토의 환승 적응기.",
    lineCopy:
      "ソウルのバスは降りる時もタッチが必須。ハルトが初めて知った「30分乗り換えルール」。",
  },
  {
    no: 11,
    code: "H3",
    memberId: "M4",
    title: "현관 도어락의 별표",
    place: "연습실 복도",
    barrier: "비밀번호 네 자리를 누르고도 마지막에 [*] 표를 눌러야 열린다는 걸 몰라 문 앞에서 서성임",
    jihuAction: "뒤에서 비밀번호를 보지 않도록 고개를 돌린 채 '마지막에 왼쪽 아래 별표'라고만 알려준다",
    isMuslimEpisode: false,
    status: "CARD_READY",
    releaseWeek: 6,
    releaseDay: "화",
    accentColor: "#3B5249",
    koreanPhrase: "비밀번호 누르고 마지막에 별표 누르시면 열려요",
    pronunciation: "Bi-mil-beon-ho nu-reu-go ma-ji-ma-ge byeol-pyo nu-reu-si-myeon yeol-lyeo-yo",
    solutionTip: "한국 디지털 도어락은 손바닥으로 화면을 터치해 숫자를 깨운 뒤, [비밀번호 + *(별표)] 순서로 입력하면 열립니다.",
    jihuQuote: "안 볼 테니까 숫자 누르고 왼쪽 아래 별표 눌러.",
    askPrompt: "한국의 디지털 도어락을 처음 써봤을 때 어땠나요?",
    beats: [
      "꺼져 있는 검은색 터치패드 도어락 앞에서 손잡이만 당겨보는 하루토",
      "숫자 네 자리를 눌렀는데도 문이 열리지 않아 당황함",
      "복도 끝에서 걸어온 지후가 시선을 벽 쪽으로 돌리고 멈춰 섬",
      "'숫자 다 누르고 왼쪽 아래 별표.' 띠리릭 소리와 함께 열리는 문",
      "한국 디지털 도어락 사용 순서(터치→번호→*) SOS 카드",
      "열쇠 대신 도어락을 쓰는 한국 숙소에서 기억에 남는 에피소드가 있나요?",
    ],
    igCopy:
      "비밀번호는 맞는데 열리지 않던 연습실 문. 지후는 고개를 돌린 채 '왼쪽 아래 별표' 다섯 글자만 말해주었습니다.",
    xCopy:
      "[H3] 한국 도어락 앞에서 멈칫한 적 있다면. 손바닥 터치 → 비밀번호 → 별표(*).",
    lineCopy:
      "暗証番号は合っているのに開かないドア。韓国のデジタルドアロックは最後の「＊」が鍵です。",
  },
  {
    no: 12,
    code: "H4",
    memberId: "M4",
    title: "세탁기 코스와 건조대",
    place: "숙소 다용도실",
    barrier: "드럼세탁기 한글 버튼('표준/울·섬세/탈수')을 구분하지 못해 연습복을 넣고도 시작을 못 누름",
    jihuAction: "자주 쓰는 세 가지 버튼 옆에 작은 야광 스티커 점만 붙여둔다",
    isMuslimEpisode: false,
    status: "PLANNING",
    releaseWeek: 6,
    releaseDay: "금",
    accentColor: "#3B5249",
    koreanPhrase: "표준 코스로 돌리고 건조대는 베란다에 있어요",
    pronunciation: "Pyo-jun ko-seu-ro dol-li-go geon-jo-dae-neun be-ran-da-e i-sseo-yo",
    solutionTip: "한국 숙소 세탁기는 [전원 → 표준(Standard) → 동작/일시정지] 3개 버튼만 알면 바로 사용할 수 있습니다. 니트류는 '울/섬세'를 선택하세요.",
    jihuQuote: "점 하나는 전원, 점 두 개는 표준, 세 개는 시작.",
    askPrompt: "한국 숙소 가전제품(세탁기·보일러·밥솥) 중 가장 버튼이 어려웠던 것은 무엇인가요?",
    beats: [
      "세탁기 앞에 쪼그려 앉아 번역기 카메라를 들이대는 하루토",
      "곡면 다이얼 글씨가 번져 번역이 이상하게 나옴",
      "지후가 다가와 버튼 세 개 옆에 작은 스티커를 붙임",
      "전원-표준-시작 순서대로 누르자 돌아가기 시작하는 세탁기",
      "한국 숙소 세탁기·보일러 필수 한글 버튼 5선 SOS 카드",
      "번역기 카메라로도 읽기 힘들었던 한글 버튼이 있었나요?",
    ],
    igCopy:
      "곡면 다이얼이라 번역기 카메라도 읽지 못하던 세탁기 버튼. 지후가 붙여둔 작은 스티커 세 개.",
    xCopy:
      "[H4] 전원 · 표준 · 동작. 한국 숙소 세탁기 앞에서 10초 만에 해결하는 버튼 가이드.",
    lineCopy:
      "韓国の洗濯機のハングルボタン。ジフが貼ってくれた3つのシールで迷わずスタート。",
  },
  {
    no: 13,
    code: "A1",
    memberId: "M5",
    title: "처음 겪는 서울의 영하 바람",
    place: "한강 망원지구 산책로",
    barrier: "연중 더운 말레이시아 출신이라 한국 11월 강바람의 체감온도를 모르고 얇은 셔츠만 입고 나옴",
    jihuAction: "자기 가방에 있던 여분 패딩 조끼와 붙이는 핫팩 두 개를 건네고 사용법만 보여준다",
    isMuslimEpisode: false,
    status: "PUBLISHED",
    releaseWeek: 7,
    releaseDay: "화",
    accentColor: "#7A4E2D",
    koreanPhrase: "붙이는 핫팩은 옷 위에 붙여야 화상을 안 입어요",
    pronunciation: "Bu-chi-neun hat-pae-geun ot wi-e bu-chyeo-ya hwa-sang-eul an i-beo-yo",
    solutionTip: "한국의 11월~2월 야외 체감온도는 바람 때문에 기온보다 5도 이상 낮습니다. 얇은 옷을 여러 겹 입는 레이어링과 붙이는 핫팩을 준비하세요.",
    jihuQuote: "맨살에 붙이지 말고 셔츠 등 쪽에 붙여.",
    askPrompt: "한국의 겨울이나 환절기 날씨를 처음 겪었을 때 가장 놀랐던 점은 무엇인가요?",
    beats: [
      "입김이 하얗게 피어오르는 한강변, 소매를 끌어내리는 아이만",
      "처음 보는 하얀 입김이 신기하면서도 손끝이 빨개짐",
      "지후가 가방에서 패딩 조끼와 붙이는 핫팩을 꺼내 흔들어 건넴",
      "아이만 셔츠 등판 바깥쪽에 핫팩을 반듯하게 붙여줌",
      "한국 겨울 체감온도 대비 & 핫팩 안전 사용 SOS 카드",
      "여러분이 태어나서 처음 본 한국의 계절 풍경은 무엇이었나요?",
    ],
    igCopy:
      "태어나서 처음 보는 하얀 입김에 웃다가도 금세 얼어붙는 손끝. 지후는 핫팩을 흔들어 아이만의 셔츠 등 뒤에 붙여주었습니다.",
    xCopy:
      "[A1] 말레이시아에서 온 아이만의 첫 서울 초겨울. 붙이는 핫팩은 꼭 옷 위에 붙이세요.",
    lineCopy:
      "マレーシア出身のアイマンが初めて体験するソウルの冬風。カイロは必ず服の上から貼りましょう。",
  },
  {
    no: 14,
    code: "A2",
    memberId: "M5",
    title: "지하철 같은 역, 다른 출구",
    place: "홍대입구역 지하 통로",
    barrier: "2호선과 공항철도 홍대입구역 환승 통로가 너무 길어 9번 출구와 3번 출구 방향을 완전히 반대로 감",
    jihuAction: "기둥의 노란색 출구 번호 안내판 사진을 찍어 '노란 숫자만 따라가'라고 알려준다",
    isMuslimEpisode: false,
    status: "REVIEWED",
    releaseWeek: 7,
    releaseDay: "금",
    accentColor: "#7A4E2D",
    koreanPhrase: "3번 출구로 나가려면 어느 쪽 통로로 가야 하나요?",
    pronunciation: "Sam-beon chul-gu-ro na-ga-ryeo-myeon eo-neu jjok tong-no-ro ga-ya ha-na-yo?",
    solutionTip: "서울 대형 환승역(홍대입구·강남·잠실)은 출구 간 거리가 500m 이상 벌어집니다. 개찰구를 나오기 전 노란색 출구 번호 표지판을 먼저 확인하세요.",
    jihuQuote: "개찰구 찍기 전에 천장에 노란 숫자부터 봐.",
    askPrompt: "서울 지하철역 중 출구 찾기가 가장 미로 같았던 역은 어디인가요?",
    beats: [
      "끝이 보이지 않는 홍대입구역 환승 무빙워크에 서 있는 아이만",
      "지상으로 나왔더니 약속 장소와 정반대편 출구임",
      "지후가 개찰구 안쪽 천장의 노란색 사각 출구 표지판을 가리킴",
      "다음번엔 몇 번 개찰구로 나가야 하는지 노선도 캡처에 동그라미를 쳐줌",
      "서울 대형 지하철역 출구 번호 & 개찰구 선택 SOS 카드",
      "홍대입구역이나 잠실역에서 길을 헤매본 적 있나요?",
    ],
    igCopy:
      "같은 역인데 출구 사이가 걸어서 10분 거리인 서울 지하철. 지후가 알려준 건 천장의 노란색 사각형 숫자였습니다.",
    xCopy:
      "[A2] 서울 지하철에서 길 잃지 않는 법. 개찰구 나가기 전에 천장의 노란 출구 번호부터 확인하세요.",
    lineCopy:
      "同じ駅なのに出口まで徒歩10分のソウル地下鉄。改札を出る前に黄色い出口番号をチェック。",
  },
  {
    no: 15,
    code: "A3",
    memberId: "M5",
    title: "맵기 1단계의 기준",
    place: "성수동 분식집",
    barrier: "'안 매운맛(순한맛)'이라고 적힌 메뉴를 시켰는데도 한국 기준 기본 고춧가루가 들어가 있어 땀을 흘림",
    jihuAction: "주방에 '고춧가루와 후추 완전히 빼고 간장 베이스로 가능한지' 미리 확인해 두고 쿨피스를 챙겨둔다",
    isMuslimEpisode: false,
    status: "CARD_READY",
    releaseWeek: 8,
    releaseDay: "화",
    accentColor: "#7A4E2D",
    koreanPhrase: "고춧가루 빼고 아예 안 맵게 조리해 주실 수 있나요?",
    pronunciation: "Go-chut-ga-ru ppae-go a-ye an maep-ge jo-ri-hae ju-sil su in-na-yo?",
    solutionTip: "한국 식당의 '순한맛(Mild)'은 신라면 정도의 매운맛을 포함하는 경우가 많습니다. 매운 음식을 못 드신다면 '고춧가루 없이(Zero spice)' 가능 여부를 먼저 확인하세요.",
    jihuQuote: "한국에서 '조금 매콤'은 매운 거야. 처음부터 빼달라고 하자.",
    askPrompt: "한국에서 '안 맵다'는 말을 믿고 먹었다가 놀랐던 메뉴가 있나요?",
    beats: [
      "메뉴판의 고추 아이콘 1개(순한맛)를 보고 안심하며 주문하는 아이만",
      "첫 입을 먹자마자 딸꾹질이 나오고 눈가가 촉촉해짐",
      "지후가 냉장고에서 복숭아 맛 유산균 음료를 꺼내 빨대를 꽂아 건넴",
      "다음 주문서를 쓸 때 '고춧가루 X (간장 베이스)' 요청 문구를 알려줌",
      "한국 식당 맵기 단계 실체 & 무매운맛 주문 문장 SOS 카드",
      "한국인의 '안 매워요'를 여러분은 몇 퍼센트 믿으시나요?",
    ],
    igCopy:
      "고추 아이콘 한 개를 믿었다가 딸꾹질이 멈추지 않던 점심. 지후는 말없이 복숭아 음료에 빨대를 꽂아 건넸습니다.",
    xCopy:
      "[A3] 한국 식당의 '순한맛'에 속지 않는 주문 문장: 고춧가루 아예 빼주실 수 있나요?",
    lineCopy:
      "韓国の「辛くない（マイルド）」は意外と辛い？アイマンを救ったジフの注文フレーズ。",
  },
  {
    no: 16,
    code: "I1",
    memberId: "M5",
    title: "편의점 뒷면의 작은 글씨",
    place: "합정동 편의점 스낵 코너",
    barrier: "과자와 라면 뒷면의 깨알 같은 한글 원재료명에서 돼지고기·젤라틴·주정 포함 여부를 혼자 판독하기 어려움",
    jihuAction: "아이만이 고른 간식 세 개의 뒷면 알레르기 유발물질 표시란(굵은 글씨 박스)만 짚어 함께 확인한다",
    isMuslimEpisode: true,
    status: "REVIEWED",
    releaseWeek: 8,
    releaseDay: "금",
    accentColor: "#1E4D3B",
    koreanPhrase: "원재료명에 돼지고기나 동물성 젤라틴이 들어 있나요?",
    pronunciation: "Won-jae-ryo-myeong-e dwae-ji-go-gi-na dong-mul-seong jel-la-ti-ni deu-reo in-na-yo?",
    solutionTip: "한국 가공식품 뒷면 하단에는 검은색 또는 파란색 박스로 [돼지고기·쇠고기·닭고기·우유·대두 함유] 알레르기 표시가 의무화되어 있어 3초 만에 확인할 수 있습니다.",
    jihuQuote: "전체 다 읽지 말고 맨 아래 네모 칸만 먼저 보면 빨라.",
    askPrompt: "한국 편의점이나 마트에서 성분표를 확인할 때 가장 찾기 힘들었던 단어는 무엇인가요?",
    beats: [
      "편의점 진열대 앞에서 과자 뒷면의 작은 한글을 한 줄씩 읽는 아이만",
      "비슷한 글자들 사이에서 '돈지·젤라틴' 표기를 찾느라 시간이 흐름",
      "지후가 옆에 서서 포장지 우측 하단의 '함유' 요약 박스를 손가락으로 짚음",
      "돼지고기 표기가 없는 식물성 유탕 스낵 두 봉지를 장바구니에 담음",
      "한국 식품 뒷면 알레르기·원재료 요약 박스 3초 확인법 SOS 카드",
      "한국 마트에서 비건·할랄 성분을 확인할 때 유용했던 팁이 있나요?",
    ],
    igCopy:
      "깨알 같은 원재료명을 처음부터 끝까지 읽고 있던 아이만에게, 지후는 포장지 맨 아래 작은 네모 칸 하나를 짚어주었습니다.",
    xCopy:
      "[I1] 한국 편의점 식품 뒷면 3초 확인법. 하단 알레르기 의무 표시 박스에서 육류 성분을 바로 확인할 수 있습니다.",
    lineCopy:
      "韓国のコンビニ食品、裏面を全部読まなくても右下の「含有表示ボックス」で3秒確認できます。",
  },
  {
    no: 17,
    code: "I2",
    memberId: "M5",
    title: "오후 네 시 반의 조용한 방",
    place: "성수동 연습실 옆 소회의실",
    barrier: "외부 합주 스튜디오 일정을 소화하는 중 오후 기도(아스르) 시간이 다가오지만 마땅한 조용한 공간을 찾기 어려움",
    jihuAction: "합주 쉬는 시간을 15분 앞당기고, 빈 소회의실 문고리에 '15분간 사용 중' 팻말을 걸어둔 뒤 방향 나침반이 잘 잡히는 창가 쪽을 비워둔다",
    isMuslimEpisode: true,
    status: "CARD_READY",
    releaseWeek: 9,
    releaseDay: "화",
    accentColor: "#1E4D3B",
    koreanPhrase: "잠시 조용히 쓸 수 있는 빈 방이나 기도실이 있을까요?",
    pronunciation: "Jam-si jo-yong-hi sseul su in-neun bin bang-i-na gi-do-si-ri i-sseul-kka-yo?",
    solutionTip: "인천공항·코엑스·롯데월드몰·주요 대학 병원 및 이태원·명동 관광안내소에는 전용 기도실(Prayer Room)이 마련되어 있습니다.",
    jihuQuote: "4시 반부터 15분 쉬었다 가자. 옆방 비워뒀어.",
    askPrompt: "서울 도심에서 조용히 머물거나 기도가 필요할 때 이용하기 좋았던 공간이 있나요?",
    beats: [
      "연습 도중 벽시계가 오후 4시 25분을 가리키자 시선을 확인하는 아이만",
      "말을 꺼내기 조심스러워 물병만 만지작거림",
      "지후가 먼저 '목 좀 축이고 15분 쉬자'며 앰프 볼륨을 줄임",
      "복도 끝 빈 소회의실 의자를 한쪽으로 치워 두고 문고리에 '사용 중' 팻말을 걸어줌",
      "서울 주요 권역(공항·코엑스·명동·성수) 조용한 공간 & 기도실 안내 SOS 카드",
      "일정 중 서로의 루틴을 존중받았다고 느꼈던 순간이 있나요?",
    ],
    igCopy:
      "오후 네 시 스물다섯 분. 아이만이 말을 꺼내기도 전에 지후는 앰프 볼륨을 줄이고 '15분 쉬자'고 말했습니다.",
    xCopy:
      "[I2] 묻지 않고 비워둔 15분의 시간. 서울 주요 권역 기도실 위치와 공간 안내 문장을 카드에 담았습니다.",
    lineCopy:
      "午後4時25分。アイマンが切り出す前に、ジフはアンプの音を下げて「15分休もう」と言いました。",
  },
  {
    no: 18,
    code: "I3",
    memberId: "M5",
    title: "모두가 같은 냄비를 먹을 수 있는 식탁",
    place: "이태원·용산 할랄 인증 한식당",
    barrier: "팀 회식 자리에서 본인 때문에 메뉴가 제한될까 봐 아이만이 '나는 샐러드만 먹어도 된다'며 사양함",
    jihuAction: "사전에 전원이 함께 먹을 수 있는 할랄 인증 닭갈비·해물전골 식당으로 예약해 두고 아무렇지 않게 들어간다",
    isMuslimEpisode: true,
    status: "CARD_READY",
    releaseWeek: 9,
    releaseDay: "금",
    accentColor: "#1E4D3B",
    koreanPhrase: "돼지고기 육수 대신 채수나 해물 육수로 조리되나요?",
    pronunciation: "Dwae-ji-go-gi yuk-su dae-sin chae-su-na hae-mul yuk-su-ro jo-ri-doe-na-yo?",
    solutionTip: "한국 한식당에서는 찌개·전골의 기본 육수(사골/고기 육수 vs 다시마/멸치 채수)만 확인해도 함께 즐길 수 있는 해물·생선구이·두부 요리가 많습니다.",
    jihuQuote: "오늘 원래 해물전골 먹으려던 날이야. 어서 앉아.",
    askPrompt: "식성이 다른 친구들과 서울에서 함께 가기 좋았던 한식 메뉴는 무엇인가요?",
    beats: [
      "첫 단체 연습이 끝난 저녁, 회식 메뉴 이야기에 조용해지는 아이만",
      "'저는 샐러드나 음료만 먹어도 괜찮아요'라며 미소 지음",
      "지후가 이미 예약해 둔 식당 앞에 멈춰 서자 문 옆에 붙은 Halal 친화 마크가 보임",
      "다섯 명이 하나의 큰 해물전골 냄비를 가운데 두고 숟가락을 듦",
      "한식당 육수(사골 vs 다시마·해물) 확인 질문 & 할랄 친화 한식 가이드 SOS 카드",
      "다섯 명이 한 식탁에 둘러앉은 오늘, 다음 시즌1 1화에서 만나요!",
    ],
    igCopy:
      "'오늘 원래 해물전골 먹으려던 날이야.' 누구 한 명도 따로 먹지 않는 다섯 명의 첫 식탁. 이제 시즌 1 서울 본편이 시작됩니다.",
    xCopy:
      "[I3] 다섯 명이 같은 냄비를 나눠 먹는 밤. 한식당 육수 확인 문장과 함께 SNS 18편 연재를 마치고 시즌1로 이어집니다.",
    lineCopy:
      "「今日は最初から海鮮鍋にするつもりだったよ。」5人が同じ鍋を囲む夜。いよいよシーズン1本編へ繋がります。",
  },
];

export const INITIAL_SNS_EPISODES: SnsEpisode[] = RAW_SNS_EPISODES.map((raw) => {
  const beatKeys: Array<{
    code: SnsEpisode["beats"][number]["code"];
    label: string;
    secRange: string;
  }> = [
    { code: "hook", label: "1. HOOK (시선 멈춤)", secRange: "0~3s" },
    { code: "block", label: "2. BLOCK (현실 장벽)", secRange: "3~8s" },
    { code: "appear", label: "3. APPEAR (지후 등장)", secRange: "8~13s" },
    { code: "solve", label: "4. SOLVE (무심한 해결)", secRange: "13~20s" },
    { code: "sos", label: "5. SOS (한국어 팁 카드)", secRange: "20~25s" },
    { code: "ask", label: "6. ASK (댓글 질문)", secRange: "25~30s" },
  ];

  const allDone =
    raw.status === "PUBLISHED" ||
    raw.status === "REVIEWED" ||
    raw.status === "CARD_READY";

  return {
    id: raw.no,
    no: raw.no,
    code: raw.code,
    memberId: raw.memberId,
    helperMemberId: "M1",
    title: raw.title,
    place: raw.place,
    barrier: raw.barrier,
    jihuAction: raw.jihuAction,
    isMuslimEpisode: raw.isMuslimEpisode,
    status: raw.status,
    releaseWeek: raw.releaseWeek,
    releaseDay: raw.releaseDay,
    beats: beatKeys.map((bk, idx) => ({
      id: raw.no * 10 + idx + 1,
      code: bk.code,
      label: bk.label,
      secRange: bk.secRange,
      sceneDesc: raw.beats[idx],
      done: allDone ? true : idx < 4,
    })),
    card: {
      headline: `[${raw.code}] ${raw.title}`,
      problemText: raw.barrier,
      solutionTip: raw.solutionTip,
      koreanPhrase: raw.koreanPhrase,
      pronunciation: raw.pronunciation,
      jihuQuote: raw.jihuQuote,
      askPrompt: raw.askPrompt,
      accentColor: raw.accentColor,
    },
    channelCopies: [
      {
        channel: "IG",
        copyText: raw.igCopy,
        hashtags: "#KSoulmate #서울적응기 #한국생활SOS #GTTourConcierge",
        status: raw.status === "PUBLISHED" ? "DONE" : "IN_PROGRESS",
      },
      {
        channel: "X",
        copyText: raw.xCopy,
        hashtags: "#KSoulmate #SeoulSOS",
        status: raw.status === "PUBLISHED" ? "DONE" : "IN_PROGRESS",
      },
      {
        channel: "LINE",
        copyText: raw.lineCopy,
        hashtags: "#KSoulmate #韓国生活SOS",
        status: raw.status === "PUBLISHED" ? "DONE" : "IN_PROGRESS",
      },
    ],
    muslimChecks: createDefaultMuslimChecks(
      raw.isMuslimEpisode,
      raw.status === "PUBLISHED" || raw.status === "REVIEWED"
    ),
  };
});

export const INITIAL_SNS_QUESTIONS: SnsQuestion[] = [
  {
    id: 1,
    episodeCode: "E1",
    fanHandle: "@mika_tokyo_99",
    lang: "JP",
    question: "한국 번호 없이 식당 웨이팅 기계(캐치테이블)는 어떻게 등록하나요?",
    jihuReply:
      "매장 태블릿 우측 상단에서 English/日本語로 바꾸면 이메일 입력으로 호출 알림을 받을 수 있어.",
    replied: true,
    pinned: true,
  },
  {
    id: 2,
    episodeCode: "W1",
    fanHandle: "@chen_taipei",
    lang: "CN",
    question: "단기 체류할 때 보증금 없이 안전하게 머물 수 있는 Verified 숙소는 어디서 찾나요?",
    jihuReply:
      "공연장이나 연습실 동선 기준 도보 5분 Verified 스테이를 사전 블록으로 잡아두면 계약서 씨름 안 해도 돼.",
    replied: true,
    pinned: true,
  },
  {
    id: 3,
    episodeCode: "I1",
    fanHandle: "@nurul_kl",
    lang: "EN",
    question: "한국 편의점 삼각김밥 중 돼지고기나 주정이 안 들어간 메뉴를 구별하는 법이 궁금해요!",
    jihuReply:
      "참치마요나 구운연어 제품 뒷면 하단 검은 박스에 '돼지고기·쇠고기'가 없는지 먼저 확인하면 돼.",
    replied: false,
    pinned: false,
  },
  {
    id: 4,
    episodeCode: "H2",
    fanHandle: "@haru_osaka",
    lang: "JP",
    question: "심야 콘서트가 끝나고 지하철 막차가 끊기면 어떻게 이동하는 게 제일 안전한가요?",
    jihuReply:
      "공연장 출구 앞 택시 줄 대신 사전 예약된 정시 출발 나이트 리무진 탑승 구역으로 바로 이동하는 게 가장 빨라.",
    replied: true,
    pinned: true,
  },
];

export const INITIAL_SNS_TOPIC_VOTES: SnsTopicVote[] = [
  {
    id: 1,
    weekLabel: "Week 4 팬 투표",
    question: "다음 주 위하오(M3)가 겪을 서울 생활 장벽 에피소드를 골라주세요",
    optionA: "한국 미용실에서 사진 보여주며 머리 길이 설명하기",
    votesA: 642,
    optionB: "무인 세탁방에서 세제 자동투입 코인세탁기 돌리기",
    votesB: 418,
    status: "CLOSED",
    adoptedEpisodeCode: "W4",
  },
  {
    id: 2,
    weekLabel: "Week 7 팬 투표",
    question: "아이만(M5)의 서울 겨울 적응기 첫 주제는?",
    optionA: "한강 영하 강바람과 붙이는 핫팩 사용법",
    votesA: 890,
    optionB: "온돌 바닥 보일러 '외출/실내' 온도 맞추기",
    votesB: 512,
    status: "CLOSED",
    adoptedEpisodeCode: "A1",
  },
  {
    id: 3,
    weekLabel: "Week 10 보너스 투표",
    question: "시즌1 본편 진입 전 특별 번외편으로 보고 싶은 주제는?",
    optionA: "5인 전원 한국 증명사진관에서 여권사진 찍기",
    votesA: 534,
    optionB: "심야 콘서트 종료 후 5인이 추천하는 안전 귀가 동선",
    votesB: 619,
    status: "OPEN",
    adoptedEpisodeCode: null,
  },
];

export const INITIAL_SNS_UGC: SnsUgc[] = [
  {
    id: 1,
    submitter: "@emma_sydney",
    nationality: "호주",
    episodeTarget: "E2",
    story: "홍대 무인 카페 키오스크에서 스탬프 적립 번호 입력창을 전화번호 인증인 줄 알고 5분 동안 서 있었어요.",
    status: "ADOPTED",
    creditNote: "E2 엔딩 크레딧 & 카드 하단 아이디 기재 완료",
  },
  {
    id: 2,
    submitter: "@aisyah_my",
    nationality: "말레이시아",
    episodeTarget: "I3",
    story: "한국 친구들이랑 식당 갈 때 멸치/다시마 육수인지 사골 육수인지 물어보는 한국어 문장이 꼭 필요했어요!",
    status: "ADOPTED",
    creditNote: "I3 SOS 카드 핵심 문장으로 채택",
  },
  {
    id: 3,
    submitter: "@yuki_fukuoka",
    nationality: "일본",
    episodeTarget: "H3",
    story: "한국 숙소 도어락 비밀번호 누르고 별표(*) 안 눌러서 문 고장 난 줄 알고 호스트에게 연락했어요.",
    status: "PENDING",
    creditNote: "H3 카드 리비전 반영 검토 중",
  },
];

export const INITIAL_SNS_ENGAGEMENT: SnsEngagement[] = INITIAL_SNS_EPISODES.map(
  (ep, idx) => {
    const baseViews = 18000 + ((idx * 3700) % 14000);
    const saves = Math.round(baseViews * (0.082 + (idx % 4) * 0.014));
    const shares = Math.round(baseViews * (0.041 + (idx % 3) * 0.009));
    const comments = 85 + ((idx * 29) % 140);
    return {
      episodeCode: ep.code,
      views: baseViews,
      saves,
      shares,
      questionComments: comments,
      saveRatePercent: Number(((saves / baseViews) * 100).toFixed(1)),
    };
  }
);
