import type {
  ConsoleStoreState,
  Member,
  Channel,
  Episode,
  ChannelVersion,
  ComplianceItem,
  ComplianceCheck,
  Origin,
} from "./types";
import {
  INITIAL_RELEASE_PHASES,
  INITIAL_SEASON2_DEVICES,
  INITIAL_SEASON2_EPISODES,
} from "./season2Seed";
import {
  INITIAL_SNS_EPISODES,
  INITIAL_SNS_QUESTIONS,
  INITIAL_SNS_TOPIC_VOTES,
  INITIAL_SNS_UGC,
  INITIAL_SNS_ENGAGEMENT,
} from "./snsSeed";

export const COMPOSITE_ANIME_SHEET_URL =
  "/assets/aistudio/65117b40-b331-42a8-9caf-3da1d13d2907_52c00c9d.jpg";

export const DEFAULT_MEMBER_ANIME_SHEETS: Record<
  string,
  {
    animeSheetUrl: string | null;
    animeSheetQuadrant: "TL" | "TR" | "BL" | "BR" | null;
    animeSheetStatus: "READY" | "HOLD" | "NONE";
    animeSheetLabel: string;
  }
> = {
  M1: {
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "TL",
    animeSheetStatus: "READY",
    animeSheetLabel: "Ji-min (좌측 상단 0% 0% · 2x2 시트)",
  },
  M2: {
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "TR",
    animeSheetStatus: "READY",
    animeSheetLabel: "Eden (우측 상단 100% 0% · 2x2 시트)",
  },
  M3: {
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "BL",
    animeSheetStatus: "READY",
    animeSheetLabel: "Yu-hao (좌측 하단 0% 100% · 2x2 시트)",
  },
  M4: {
    animeSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/0253faf113ac41a39ccab96184458976.png",
    animeSheetQuadrant: null,
    animeSheetStatus: "HOLD",
    animeSheetLabel: "Haruto 파일럿 시트 (판정 3/5 · 보류)",
  },
  M5: {
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "BR",
    animeSheetStatus: "READY",
    animeSheetLabel: "Aiman (우측 하단 100% 100% · 2x2 시트)",
  },
};

const MEMBERS_SEED: Member[] = [
  {
    id: "M1",
    nameKo: "한지후",
    nameJa: "ジフ",
    nameZh: "智厚",
    nationality: "한국",
    position: "리더 · 메인보컬",
    age: 24,
    heightCm: 182,
    photoSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/61e140b03ebe4296a90e4ccf16d471e6.png",
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "TL",
    animeSheetStatus: "READY",
    animeSheetLabel: "Ji-min (좌측 상단 0% 0% · 2x2 시트)",
    outfitSpec:
      "black tailored blazer worn open over an ivory ribbed turtleneck, straight-leg black trousers, black Chelsea boots, silver band ring",
    faceSpec:
      "Korean man, 24, 182cm lean athletic. Soft dark-brown wavy hair falling over the brow, warm brown eyes, calm mature handsome, understated elegance",
    voiceProfile: "voice-jihu-ko-01",
    channelCode: null,
    locked: true,
    domainAnchorBadge: "🚇 [Anchor 1: 심야 이동·막차·로컬 시스템 총괄]",
    domainAnchorDesc:
      "콘서트 심야 귀가(몽촌토성/구일역 우회), 택시 승차거부 돌파, 한국 행정/배달/부동산 시스템 무심한 해결사",
    personaLabel: "M1 한지후 · 무심한 츤데레 로컬 해결사",
  },
  {
    id: "M2",
    nameKo: "이든 박",
    nameJa: "イーデン・パク",
    nameZh: "伊登·朴",
    nationality: "영어권(호주교포)",
    position: "센터 댄서",
    age: 22,
    heightCm: 178,
    photoSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/3fdc42c697944fc08c64416f4ab76801.png",
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "TR",
    animeSheetStatus: "READY",
    animeSheetLabel: "Eden (우측 상단 100% 0% · 2x2 시트)",
    outfitSpec:
      "black cropped leather biker jacket over a plain black tee, black tapered cargo trousers, chunky black combat boots, thin silver chain necklace",
    faceSpec:
      "Korean-Australian man, 22, 178cm compact dancer build. Jet-black hair with a short undercut, narrow intense eyes, sharp defined jaw",
    voiceProfile: "voice-eden-en-01",
    channelCode: "US",
    locked: true,
    domainAnchorBadge: "🔥 [Anchor 2: 성수·한남 웨이팅·키오스크·짐 보관]",
    domainAnchorDesc:
      "010 번호 없는 캐치테이블 돌파, 팝업 오픈런, 무인 키오스크/배달앱 인증, 캐리어 당일 배송(Zimcarry/Lugstay)",
    personaLabel: "M2 이든 박 · 하이텐션 성수 인사이더 친구",
  },
  {
    id: "M3",
    nameKo: "린위하오",
    nameJa: "リン・ウィハオ",
    nameZh: "林宇浩",
    nationality: "중화권",
    position: "리드보컬",
    age: 23,
    heightCm: 180,
    photoSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/df39d50e33424081b9eda2fb5d801c98.png",
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "BL",
    animeSheetStatus: "READY",
    animeSheetLabel: "Yu-hao (좌측 하단 0% 100% · 2x2 시트)",
    outfitSpec:
      "slate-grey oversized wool coat worn open over a crisp white shirt, dark indigo straight trousers, black leather loafers, small silver ear stud",
    faceSpec:
      "Taiwanese man, 23, 180cm slim elegant build. Wavy honey-brown hair parted loosely, cat-shaped almond eyes with lifted outer corners, soft features",
    voiceProfile: "voice-weihao-zh-01",
    channelCode: "CN",
    locked: true,
    domainAnchorBadge: "💄 [Anchor 3: 청담 K-뷰티·웰니스·약국·호구 방지]",
    domainAnchorDesc:
      "청담 헤메코 아이돌 시안 전달법, 클리닉 VAT 정찰제 확인, 약국 증상 설명, 성수 플래그십 즉시 면세(Tax Refund)",
    personaLabel: "M3 린위하오 · 다정한 청담 뷰티·감성 멘토",
  },
  {
    id: "M4",
    nameKo: "하루토",
    nameJa: "ハルト",
    nameZh: "春人",
    nationality: "일어권",
    position: "서브보컬",
    age: 20,
    heightCm: 175,
    photoSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/cce760424fbc432f86215e02161ffab0.png",
    animeSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/0253faf113ac41a39ccab96184458976.png",
    animeSheetQuadrant: null,
    animeSheetStatus: "HOLD",
    animeSheetLabel: "Haruto 파일럿 시트 (판정 3/5 · 보류)",
    outfitSpec:
      "light washed-blue denim jacket worn open over a plain white tee, cream straight trousers, white low-top sneakers",
    faceSpec:
      "Japanese man, 20, 175cm slender. Fluffy ash-light-brown hair falling naturally over the forehead, large round friendly eyes, youthful boyish features",
    voiceProfile: "voice-haruto-ja-01",
    channelCode: "JP",
    locked: true,
    domainAnchorBadge: "🍱 [Anchor 4: 로컬 식당·카페·오시카츠 성지순례]",
    domainAnchorDesc:
      "식당 호출벨·셀프바 뉘앙스, 생일카페(센카) 투어, 혼밥 맛집, 대중교통 환승 하차벨 & 도어락 별표(*) 생존법",
    personaLabel: "M4 하루토 · 공감 100% 다정한 막내 메이트",
  },
  {
    id: "M5",
    nameKo: "아이만",
    nameJa: "アイマン",
    nameZh: "艾曼",
    nationality: "말레이시아",
    position: "래퍼",
    age: 21,
    heightCm: 176,
    photoSheetUrl:
      "https://cdn.omniultra.imagine.art/ceaed39a-684f-4da0-a1e9-ca9f91ee1c26/media/image/b0c0d3e0fb9b48129ec76e8445e65c7e.png",
    animeSheetUrl: COMPOSITE_ANIME_SHEET_URL,
    animeSheetQuadrant: "BR",
    animeSheetStatus: "READY",
    animeSheetLabel: "Aiman (우측 하단 100% 100% · 2x2 시트)",
    outfitSpec:
      "oversized charcoal-black hoodie with the hood down, wide-leg black trousers, chunky grey-and-black sneakers, black wristband",
    faceSpec:
      "Malaysian man of Chinese-Malay heritage, 21, 176cm athletic build. Warm tan skin, short textured dark curls on top with closely faded sides, thick defined brows",
    voiceProfile: "voice-aiman-en-01",
    channelCode: "MY",
    locked: true,
    domainAnchorBadge: "🌍 [Anchor 5: 할랄·비건·맵기 방어·다문화 생존]",
    domainAnchorDesc:
      "편의점 뒷면 돼지고기/젤라틴 3초 판독 박스, K-분식 '고춧가루 제로' 주문법, 기도실 확보, 서울 영하 강추위 핫팩 생존법",
    personaLabel: "M5 아이만 · 유쾌한 3개국어 할랄·맵찔이 구조대",
  },
];

const CHANNELS_SEED: Channel[] = [
  {
    code: "JP",
    label: "일본 · LINE / YouTube JP",
    narratorId: "M4",
    tone: "일기체 · 1인칭 · 과거 회상",
    totalSec: 90,
    cutCount: 24,
    avgCutSec: 3.8,
    rhythmBasis: "문장 호흡 — 나레이션 대본이 컷 길이를 정한다",
    workflowOrder: ["script", "vo", "cut", "bgm", "subtitle", "publish"],
    bgmTracks: ["jp-01-piano-room", "jp-02-piano-soft", "jp-03-strings-pad"],
    active: true,
  },
  {
    code: "US",
    label: "미국 · TikTok / Reels",
    narratorId: "M2",
    tone: "비트체 · 현재형 · 구어",
    totalSec: 60,
    cutCount: 32,
    avgCutSec: 1.9,
    rhythmBasis: "비트 — BGM 타임라인에 먼저 컷을 맞춘다",
    workflowOrder: ["bgm", "cut", "vo", "subtitle", "publish"],
    bgmTracks: ["us-01-boombap-96", "us-02-trap-92", "us-03-drill-100"],
    active: true,
  },
  {
    code: "KR",
    label: "한국 · Instagram",
    narratorId: "M1",
    tone: "담백체 · 정보 전달",
    totalSec: 90,
    cutCount: 18,
    avgCutSec: 5.0,
    rhythmBasis: "자막 가독 — 자막 읽는 시간이 컷 최소 길이",
    workflowOrder: ["subtitle", "cut", "vo", "bgm", "publish"],
    bgmTracks: ["kr-01-lofi-bright", "kr-02-upbeat-85", "kr-03-soft-pop"],
    active: true,
  },
  {
    code: "CN",
    label: "중화권 · 샤오홍슈",
    narratorId: "M3",
    tone: "감성체 · 짧은 문장",
    totalSec: 88,
    cutCount: 22,
    avgCutSec: 4.0,
    rhythmBasis: "하단 자막 영역 확보 우선",
    workflowOrder: ["subtitle", "cut", "vo", "bgm", "publish"],
    bgmTracks: ["cn-01-citypop-90", "cn-02-citypop-soft", "cn-03-ambient"],
    active: false,
  },
];

const EPISODES_SEED: Episode[] = [
  {
    id: 1,
    no: 1,
    title: "영하 5도에 아이스를 마시는 이유",
    place: "성수동 카페",
    memberId: "M4",
    narrativeSituation:
      "추운 날 따뜻한 차를 시키려던 하루토가 옆자리 한국인들과 지후가 전부 아이스만 들고 있는 걸 보고 문화충격에 빠짐",
    kMemeSlang: '🔥 [K-밈] "얼죽아 (얼어 죽어도 아이스 아메리카노)"',
    realNuance: '💬 [실전 뉘앙스] "사장님, 얼음은 살짝만 넣어주세요"',
    survivalTip: "💡 [생존 팁] 영수증 하단 화장실 도어락 비번 & 와이파이 찾는 법",
    expressions: [
      '🔥 [K-밈] "얼죽아 (얼어 죽어도 아이스 아메리카노)"',
      '💬 [실전 뉘앙스] "사장님, 얼음은 살짝만 넣어주세요"',
      "💡 [생존 팁] 영수증 하단 화장실 도어락 비번 & 와이파이 찾는 법",
    ],
    baseVideoUrl: "https://storage.k-soulmate.internal/ep-01-master-130s.mp4",
    status: "PUBLISHED",
    complianceRisk: false,
  },
  {
    id: 2,
    no: 2,
    title: "성수 편집숍, 입어만 봐도 될까?",
    place: "성수동 플래그십",
    memberId: "M3",
    narrativeSituation:
      "직원이 계속 따라붙어 부담스러운 위하오가 눈치 보지 않고 오버핏 사이즈를 찾고 즉시 면세까지 챙기는 에피소드",
    kMemeSlang: '🔥 [K-슬랭] "핏(Fit) 미쳤다 / 완전 찰떡인데?"',
    realNuance:
      '💬 [실전 뉘앙스] "천천히 둘러보고 부를게요 / 이거 한 치수 큰 거 재고 있나요?"',
    survivalTip:
      "💡 [생존 팁] 여권 제시 즉시 택스리펀드(15,000원 이상) 받는 법",
    expressions: [
      '🔥 [K-슬랭] "핏(Fit) 미쳤다 / 완전 찰떡인데?"',
      '💬 [실전 뉘앙스] "천천히 둘러보고 부를게요 / 이거 한 치수 큰 거 재고 있나요?"',
      "💡 [생존 팁] 여권 제시 즉시 택스리펀드(15,000원 이상) 받는 법",
    ],
    baseVideoUrl: "https://storage.k-soulmate.internal/ep-02-master-130s.mp4",
    status: "REVIEWED",
    complianceRisk: false,
  },
  {
    id: 3,
    no: 3,
    title: "청담 아이돌 숍에서 사진 보여주기 민망할 때",
    place: "청담 헤어메이크업",
    memberId: "M4",
    narrativeSituation:
      "연예인 사진을 내밀기 부끄러워 우물쭈물하다가 지후가 알려준 '3장 전달 공식'으로 인생 헤메코를 받는 이야기",
    kMemeSlang: '🔥 [K-밈] "오늘 완전 아이돌 재질인데?"',
    realNuance:
      '💬 [실전 뉘앙스] "이 사진 느낌으로 제 얼굴형에 맞게 시스루 뱅만 살려주세요"',
    survivalTip: "💡 [생존 팁] 숍 방문 시 정면·옆모습·피부톤 사진 3장 준비 공식",
    expressions: [
      '🔥 [K-밈] "오늘 완전 아이돌 재질인데?"',
      '💬 [실전 뉘앙스] "이 사진 느낌으로 제 얼굴형에 맞게 시스루 뱅만 살려주세요"',
      "💡 [생존 팁] 숍 방문 시 정면·옆모습·피부톤 사진 3장 준비 공식",
    ],
    baseVideoUrl: "https://storage.k-soulmate.internal/ep-03-master-130s.mp4",
    status: "EDITED",
    complianceRisk: true,
  },
  {
    id: 4,
    no: 4,
    title: "새벽 2시 성수 지하 연습실의 텐션",
    place: "K-pop 댄스 스튜디오",
    memberId: "M5",
    narrativeSituation:
      "안무 박자가 안 맞아 좌절하던 아이만이 한국의 '텐션' 문화를 배우며 댄서들과 하나가 되는 순간",
    kMemeSlang: '🔥 [K-슬랭] "폼 미쳤다 / 텐션 올려!"',
    realNuance:
      '💬 [실전 뉘앙스] "방금 그 카운트만 반 박자 천천히 다시 가볼게요"',
    survivalTip:
      "💡 [생존 팁] 외국인 원데이 K-POP 댄스 클래스 예약 & 촬영 매너",
    expressions: [
      '🔥 [K-슬랭] "폼 미쳤다 / 텐션 올려!"',
      '💬 [실전 뉘앙스] "방금 그 카운트만 반 박자 천천히 다시 가볼게요"',
      "💡 [생존 팁] 외국인 원데이 K-POP 댄스 클래스 예약 & 촬영 매너",
    ],
    baseVideoUrl: "https://storage.k-soulmate.internal/ep-04-master-130s.mp4",
    status: "GENERATED",
    complianceRisk: false,
  },
  {
    id: 5,
    no: 5,
    title: "010 번호 없이 성수 팝업 1등으로 들어가는 법",
    place: "성수동 팝업스토어",
    memberId: "M2",
    narrativeSituation:
      "한국 번호가 없어 태블릿 앞에서 멘붕에 빠진 이든과 외국인 팬을 구출하는 오픈런 대소동",
    kMemeSlang: '🔥 [K-밈] "오픈런 성공적 / 대기 0분 실화냐"',
    realNuance:
      '💬 [실전 뉘앙스] "저 한국 번호 없는데 글로벌 이메일 웨이팅으로 걸어주실 수 있나요?"',
    survivalTip:
      "💡 [생존 팁] 캐치테이블 우측 하단 Global 버튼 & 10:30 워크인 골든타임",
    expressions: [
      '🔥 [K-밈] "오픈런 성공적 / 대기 0분 실화냐"',
      '💬 [실전 뉘앙스] "저 한국 번호 없는데 글로벌 이메일 웨이팅으로 걸어주실 수 있나요?"',
      "💡 [생존 팁] 캐치테이블 우측 하단 Global 버튼 & 10:30 워크인 골든타임",
    ],
    baseVideoUrl: null,
    status: "SCRIPTED",
    complianceRisk: false,
  },
  {
    id: 6,
    no: 6,
    title: "청담 클리닉, 호구 안 잡히고 똑똑하게 상담받기",
    place: "청담 뷰티·웰니스",
    memberId: "M3",
    narrativeSituation:
      "화려한 청담 클리닉 상담실에서 추가 과금 유도 없이 부가세 포함 정찰제와 저자극 진정 케어만 똑똑하게 골라내는 위하오의 실전 돌파기",
    kMemeSlang: '🔥 [K-슬랭] "피부에서 광이 나네 / 수분 충전 완료"',
    realNuance:
      '💬 [실전 뉘앙스] "부가세(VAT) 포함된 정찰제 금액 맞나요? 자극 없는 진정 위주로 해주세요"',
    survivalTip:
      "💡 [생존 팁] 외국인 바가지 방지 사전 문진 메모 4항목 체크리스트",
    expressions: [
      '🔥 [K-슬랭] "피부에서 광이 나네 / 수분 충전 완료"',
      '💬 [실전 뉘앙스] "부가세(VAT) 포함된 정찰제 금액 맞나요? 자극 없는 진정 위주로 해주세요"',
      "💡 [생존 팁] 외국인 바가지 방지 사전 문진 메모 4항목 체크리스트",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: true,
  },
  {
    id: 7,
    no: 7,
    title: "올리브영N 성수에서 길 잃은 외국인 구출작전",
    place: "성수 뷰티 클래스",
    memberId: "M2",
    narrativeSituation:
      "수천 개 화장품 매대 앞에서 길을 잃은 외국인 팬에게 이든이 2~3층 피부진단 코너부터 공략하는 로컬 동선을 전수하는 구출 작전",
    kMemeSlang: '🔥 [K-밈] "내 인생템 찾았다 / 쟁여템(쟁여두고 쓰는 템)"',
    realNuance:
      '💬 [실전 뉘앙스] "민감성인데 요즘 한국에서 제일 잘 나가는 진정 앰플이 뭐예요?"',
    survivalTip:
      "💡 [생존 팁] 1층 매대 대신 2~3층 피부진단 코너 먼저 가는 동선",
    expressions: [
      '🔥 [K-밈] "내 인생템 찾았다 / 쟁여템(쟁여두고 쓰는 템)"',
      '💬 [실전 뉘앙스] "민감성인데 요즘 한국에서 제일 잘 나가는 진정 앰플이 뭐예요?"',
      "💡 [생존 팁] 1층 매대 대신 2~3층 피부진단 코너 먼저 가는 동선",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: true,
  },
  {
    id: 8,
    no: 8,
    title: "보컬 부스 안에서 찾은 진짜 내 목소리",
    place: "성수 녹음실",
    memberId: "M3",
    narrativeSituation:
      "발음 강박에 갇혀 있던 위하오가 엔지니어에게 모니터 볼륨을 요청하고 감정으로 고음을 터뜨린 뒤 다 같이 코인노래방으로 향하는 밤",
    kMemeSlang: '🔥 [K-슬랭] "고음 찢었다 / 소름 돋았어"',
    realNuance:
      '💬 [실전 뉘앙스] "모니터 볼륨 조금만 올려주시고 한 테이크만 더 갈게요"',
    survivalTip: "💡 [생존 팁] 한국 코인노래방(코노) 서비스 시간 받는 숨은 공식",
    expressions: [
      '🔥 [K-슬랭] "고음 찢었다 / 소름 돋았어"',
      '💬 [실전 뉘앙스] "모니터 볼륨 조금만 올려주시고 한 테이크만 더 갈게요"',
      "💡 [생존 팁] 한국 코인노래방(코노) 서비스 시간 받는 숨은 공식",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: false,
  },
  {
    id: 9,
    no: 9,
    title: '"안 맵다"는 한국 식당 사장님의 말을 믿지 마라',
    place: "성수동 분식·한식당",
    memberId: "M5",
    narrativeSituation:
      "'전혀 안 매워요'라는 사장님 말을 믿었다가 불타는 떡볶이에 눈물 흘린 아이만이 지후의 간장 베이스 주문 공식과 쿨피스로 기사회생하는 이야기",
    kMemeSlang: '🔥 [K-밈] "맵찔이(매운 거 못 먹는 사람) 살려주세요"',
    realNuance:
      '💬 [실전 뉘앙스] "사장님, 고춧가루랑 후추 아예 빼고 간장 베이스로 안 맵게 가능할까요?"',
    survivalTip:
      "💡 [생존 팁] 한국 '순한맛=신라면급'의 진실과 쿨피스 긴급 처방법",
    expressions: [
      '🔥 [K-밈] "맵찔이(매운 거 못 먹는 사람) 살려주세요"',
      '💬 [실전 뉘앙스] "사장님, 고춧가루랑 후추 아예 빼고 간장 베이스로 안 맵게 가능할까요?"',
      "💡 [생존 팁] 한국 '순한맛=신라면급'의 진실과 쿨피스 긴급 처방법",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: false,
  },
  {
    id: 10,
    no: 10,
    title: "성수 네컷사진관에서 고데기 쓰다 시간 다 간 썰",
    place: "성수동 포토부스",
    memberId: "M4",
    narrativeSituation:
      "파우더룸 고데기와 머리띠 고르느라 바쁜 하루토가 10초 타이머 카운트다운에 허둥지둥하다 오히려 자연스러운 인생네컷을 건지는 에피소드",
    kMemeSlang: '🔥 [K-밈] "인생샷 건졌다 / 건진 컷 있어?"',
    realNuance:
      '💬 [실전 뉘앙스] "우리 리모컨 누르는 타이밍 맞춰서 하나 둘 셋 하면 찍자!"',
    survivalTip:
      "💡 [생존 팁] 성수 포토부스 노웨이팅 시간대(11시/19시 이후) & QR 영상 저장법",
    expressions: [
      '🔥 [K-밈] "인생샷 건졌다 / 건진 컷 있어?"',
      '💬 [실전 뉘앙스] "우리 리모컨 누르는 타이밍 맞춰서 하나 둘 셋 하면 찍자!"',
      "💡 [생존 팁] 성수 포토부스 노웨이팅 시간대(11시/19시 이후) & QR 영상 저장법",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: false,
  },
  {
    id: 11,
    no: 11,
    title: "콘서트 끝나고 밤 11시, 다섯 명의 서울 탈출 대작전",
    place: "올림픽공원 ➔ 성수",
    memberId: null,
    narrativeSituation:
      "2만 명이 동시에 쏟아져 나온 올림픽공원 야간 콘서트 직후, 지후의 인솔로 몽촌토성역 우회 루트와 심야 택시 호출 포인트를 돌파하는 5인의 대작전",
    kMemeSlang: '🔥 [K-밈] "올콘(전 회차 관람) 완료 / 퇴근길 전쟁"',
    realNuance:
      '💬 [실전 뉘앙스] "올림픽공원역 말고 몽촌토성역 쪽으로 걸어가자, 거기가 훨씬 빨라!"',
    survivalTip:
      "💡 [생존 팁] 심야 택시 안 잡힐 때 2정거장 이동 후 호출 & 심야 N버스 탑승법",
    expressions: [
      '🔥 [K-밈] "올콘(전 회차 관람) 완료 / 퇴근길 전쟁"',
      '💬 [실전 뉘앙스] "올림픽공원역 말고 몽촌토성역 쪽으로 걸어가자, 거기가 훨씬 빨라!"',
      "💡 [생존 팁] 심야 택시 안 잡힐 때 2정거장 이동 후 호출 & 심야 N버스 탑승법",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: false,
  },
  {
    id: 12,
    no: 12,
    title: "교과서엔 없는 우리만의 서울 생존기",
    place: "성수동 루프탑 파티",
    memberId: null,
    narrativeSituation:
      "교과서 문장 대신 직접 부딪히며 배운 K-밈과 생존 꿀팁으로 서울 패치를 완료한 다섯 멤버가 성수 루프탑에서 팬들을 초대하는 피날레",
    kMemeSlang: '🔥 [K-밈] "오운완 / 서울 패치 100% 완료"',
    realNuance:
      '💬 [실전 뉘앙스] "처음엔 다 서툴렀지만, 이제 서울에서 너희가 막히면 우리가 다 해결해 줄게!"',
    survivalTip:
      "💡 [생존 팁] 5인 5색 서울 로컬 성지순례 마스터 맵 무료 배포 연결",
    expressions: [
      '🔥 [K-밈] "오운완 / 서울 패치 100% 완료"',
      '💬 [실전 뉘앙스] "처음엔 다 서툴렀지만, 이제 서울에서 너희가 막히면 우리가 다 해결해 줄게!"',
      "💡 [생존 팁] 5인 5색 서울 로컬 성지순례 마스터 맵 무료 배포 연결",
    ],
    baseVideoUrl: null,
    status: "PLANNING",
    complianceRisk: false,
  },
];

const COMPLIANCE_ITEMS_SEED: ComplianceItem[] = [
  {
    code: "JP-01",
    label: "특정상거래법",
    detail: "일본 소비자에게 유상 판매 시 사업자명·소재지·연락처·반품 조건 등의 표시 의무. 한국 법인이 일본향으로 판매해도 적용.",
    blockAt: "BEFORE_PUBLISH",
    ownerRole: "유키",
  },
  {
    code: "JP-02",
    label: "경품표시법 (현상 제한)",
    detail: "팬덤명 공모의 상품. 일반 현상은 상품 최고액 상한이 있고 초과 설계는 위반. '반드시 당첨' 표시 금지.",
    blockAt: "BEFORE_PUBLISH",
    ownerRole: "유키",
  },
  {
    code: "JP-03",
    label: "개인정보보호법",
    detail: "팬클럽 가입 시 이용 목적 특정·통지, 제3자 제공 제한. 한국 서버 저장은 국경 이전에 해당해 동의·폴리시 기재 필요.",
    blockAt: "BEFORE_PUBLISH",
    ownerRole: "유키",
  },
  {
    code: "JP-04",
    label: "약기법 · 의료광고 가이드라인",
    detail: "제3·6·7화 뷰티·클리닉 회차. 효과효능 표현 불가, 시술 전후 비교 표현 원칙 불가. 촬영 전 표현집 작성 필수.",
    blockAt: "BEFORE_PUBLISH",
    ownerRole: "유키",
  },
  {
    code: "JP-05",
    label: "초상권 · 저작권",
    detail: "협력 매장 스태프 초상 사용 동의, 매장명 노출 범위, BGM 라이선스. 촬영 전 동의서 취득.",
    blockAt: "AT_LAUNCH",
    ownerRole: "유코",
  },
  {
    code: "JP-06",
    label: "AI 생성물 표시",
    detail: "플랫폼마다 AI 생성 라벨 필요 여부가 다름. 각 채널 정책 확인 후 설명란 기재.",
    blockAt: "AT_LAUNCH",
    ownerRole: "유코",
  },
  {
    code: "JP-07",
    label: "LINE 발송 한도",
    detail: "무료 플랜은 월 발송 통수 상한이 있어 주간 발송에는 유료 플랜 필요. 계약 시 최신 조건 확인.",
    blockAt: "AT_LAUNCH",
    ownerRole: "유키",
  },
];

const ORIGINS_SEED: Origin[] = [
  {
    id: 1,
    no: 1,
    memberId: "M1",
    title: "새벽 4시의 옥상",
    releaseOrder: 1,
    releaseAt: "2주 전",
    durationSec: 180,
    originCity: "서울 · 노량진 고시원 / 마포 옥상",
    keyProp: "이어폰 한쪽이 끊긴 유선 이어폰, 접힌 악보 뒷면",
    colorStart: "#2B3442",
    colorEnd: "#F3EDE2",
    lack: "법학전문대학원 준비 3년 차. 아버지의 기대와 자신의 목소리 사이에서 숨이 막혀 잠들지 못하던 밤.",
    turningPoint: "새벽 4시 옥상 난간 너머로 들려온 버스킹 보컬의 서툰 고음. 처음으로 남의 노래가 아닌 내 숨소리를 들었다.",
    choice: "아버지에게 처음으로 '음악을 배우고 싶다'고 말한다. 돌아온 건 반대였다. 시험을 포기하는 게 아니라 자기 몫의 하루를 조금 다르게 쓰겠다는 말도 통하지 않는다. 그는 말을 거두지 않는다. 반대를 안고, 새벽 수업을 등록한다.",
    supportPoint: "응원은 그가 이겼기 때문이 아니라, 허락 없이도 시작했기 때문에 생긴다.",
    arrivalBeat: "B7 실사 디졸브 — 성수동 카페 문을 열고 들어서는 지후의 등 뒤로 네 명의 그림자가 겹친다.",
    episodeLink: 11,
    sensitive: true,
    status: "SCRIPTED",
    beats: [
      { id: 1, originId: 1, code: "B1", startSec: 0, endSec: 15, content: "새벽 3시 50분, 형광등 불빛 아래 놓인 수험서와 한쪽만 나오는 유선 이어폰 클로즈업", direction: "회청색(#2B3442) 로우키 조명, 시계 초침 소리만 강조", done: true },
      { id: 2, originId: 1, code: "B2", startSec: 15, endSec: 45, content: "책장을 넘기다 멈춘 손끝. 창밖은 아직 어둡고 방 안 공기는 무겁게 가라앉아 있다", direction: "인물 정면 대신 뒷모습과 어깨선 중심, 좁은 방의 답답한 프레이밍", done: true },
      { id: 3, originId: 1, code: "B3", startSec: 45, endSec: 75, content: "잠기지 않는 숨을 고르며 옥상 계단을 한 칸씩 올라가는 발걸음", direction: "발소리와 호흡음, 계단참 창문으로 새어드는 푸른 새벽빛", done: false },
      { id: 4, originId: 1, code: "B4", startSec: 75, endSec: 115, content: "옥상 문을 열자 멀리 한강변에서 바람을 타고 들려오는 어쿠스틱 기타와 날것의 보컬 소리", direction: "SAFE-01/02 준수: 난간에서 두 걸음 물러선 중앙 위치, 시선은 아래가 아닌 수평선 여명", done: false },
      { id: 5, originId: 1, code: "B5", startSec: 115, endSec: 145, content: "아버지에게 처음으로 '음악을 배우고 싶다'고 말한다. 돌아온 건 반대였다. 시험을 포기하는 게 아니라 자기 몫의 하루를 조금 다르게 쓰겠다는 말도 통하지 않는다. 그는 말을 거두지 않는다. 반대를 안고, 새벽 수업을 등록한다.", direction: "문 열린 틈으로만. 대화는 설득이 아니라 통보에 가깝게. 아버지가 이기고, 그는 그래도 간다. 두 사람 얼굴 동시 노출 금지", done: false },
      { id: 6, originId: 1, code: "B6", startSec: 145, endSec: 170, content: "연습실. 첫 수업. 박자를 놓치고 웃는다", direction: "\"허락받은 문\"이 아니라 \"혼자 연 문\". 밝은 아이보리. 이 편에서 처음으로 얼굴 전체가 나오는 컷", done: false },
      { id: 7, originId: 1, code: "B7", startSec: 170, endSec: 178, content: "애니메이션 속 성수동 골목를 걷는 지후의 뒷모습이 실사 캐릭터 시트 컷으로 매치컷 디졸브", direction: "검은 테일러드 블레이저와 아이보리 터틀넥 고정 의상 매칭", done: false },
      { id: 8, originId: 1, code: "B8", startSec: 178, endSec: 180, content: "타이틀 카드: K-SOULMATE ORIGIN #1 한지후 — 그리고 4개국 상담 안내 자막", direction: "SAFE-07 준수: 엔딩 크레딧 상담 안내 번호 3초 고정 노출", done: false },
    ],
    channelScripts: [
      {
        id: 1,
        originId: 1,
        channelCode: "JP",
        narration: `あの頃、僕の夜はいつも午前4時に終わっていました。\n机の上には分厚いテキストと、片方だけ音が鳴るイヤホン。\n誰かの期待に応えることだけが、正しい道だと思っていました。\n屋上の扉を開けた瞬間、遠くから誰かの歌声が風に揺れて届きました。\n上手い歌じゃなかった。でも、生きている息の音がしました。\nポケットの中のメモの裏に、初めて自分の言葉を書き留めました。\n遅すぎる始まりかもしれない。それでも、僕の声で息をしたかったんです。`,
        voStatus: "IN_PROGRESS",
      },
      {
        id: 2,
        originId: 1,
        channelCode: "US",
        narration: `4 AM. Law school prep books stacked to the ceiling.\nEveryone had a plan for Jihu — except Jihu.\nOne working earbud. Same loop every night.\nThen he steps out onto the roof, and hears a voice cutting through the cold air.\nNot perfect. Just real.\nHe flips over a folded sheet in his pocket and writes his first four bars.\nAt twenty-two, he trades the safe road for a basement mic.\nThat's how our leader started.`,
        voStatus: "TODO",
      },
      {
        id: 3,
        originId: 1,
        channelCode: "KR",
        narration: `새벽 네 시까지 불이 꺼지지 않던 작은 방이 있었습니다.\n한쪽만 들리는 이어폰을 꽂고, 정해진 답을 외우던 시절이었습니다.\n옥상 바람 속에서 우연히 들려온 서툰 노랫소리가 발걸음을 멈추게 했습니다.\n접힌 종이 뒷면에 처음으로 내 문장을 적었습니다.\n스물둘, 가장 늦었다고 생각한 나이에 첫 보컬 레슨실 문을 열었습니다.\n다섯 명의 목소리를 하나로 모으는 리더, 한지후의 시작입니다.`,
        voStatus: "IN_PROGRESS",
      },
    ],
    safetyChecks: [
      { id: 1, originId: 1, code: "SAFE-01", rule: "옥상 난간 아래를 내려다보는 부감(하이앵글) 샷 절대 금지 — 시선은 항상 수평선·하늘·먼 도시 불빛을 향한다.", done: true },
      { id: 2, originId: 1, code: "SAFE-02", rule: "난간 끝에 서거나 기대는 구도 금지 — 옥상 중앙 벤치나 문 옆 벽면에서 최소 두 걸음 이상 떨어진 위치만 허용한다.", done: true },
      { id: 3, originId: 1, code: "SAFE-03", rule: "자해·극단적 선택을 암시하는 대사·독백·소품(약병, 유서 등) 일체 금지 — 갈등의 원인은 '진로와 목소리의 부재'로 명확히 한정한다.", done: false },
      { id: 4, originId: 1, code: "SAFE-04", rule: "어두운 푸른빛(#2B3442) 구간은 전체 180초 중 전반 75초(B1~B3)를 넘기지 않으며, B4부터 반드시 여명빛(#F3EDE2)이 유입되어야 한다.", done: false },
      { id: 5, originId: 1, code: "SAFE-05", rule: "위기 상황을 미화하거나 극적인 구원 서사로 과장하지 않는다 — 전환점은 '우연히 들려온 버스킹 노랫소리와 자신이 적은 한 줄의 가사'로 담백하게 묘사한다.", done: false },
      { id: 6, originId: 1, code: "SAFE-06", rule: "배경음악(BGM)에 심장박동 효과음이나 불안을 자극하는 불협화음 사용 금지 — 무반주 바람 소리에서 어쿠스틱 피아노 단선율로 전환한다.", done: false },
      { id: 7, originId: 1, code: "SAFE-07", rule: "영상 설명란 및 B8 엔딩 카드에 4개국(KR·JP·US·CN) 정신건강 상담·도움 안내 문구를 필수로 표기한다.", done: false },
      { id: 8, originId: 1, code: "SAFE-08", rule: "발행 전 총괄 프로듀서 및 일본/글로벌 컴플라이언스 담당자(유키) 교차 검수 서명을 완료한다.", done: false },
    ],
  },
  {
    id: 2,
    no: 2,
    memberId: "M4",
    title: "교복 주머니 속 한국어 단어장",
    releaseOrder: 2,
    releaseAt: "1주 전",
    durationSec: 180,
    originCity: "도쿄 · 시모키타자와 전철역 / 작은 레코드숍",
    keyProp: "모서리가 닳은 수첩형 한국어 단어장, 편도 항공권",
    colorStart: "#4A586E",
    colorEnd: "#F6E4C8",
    lack: "졸업 진로 희망서에 끝내 빈칸으로 남겨둔 한 줄. 남들처럼 평범하게 흘러가는 것이 두려웠던 열아홉.",
    turningPoint: "시모키타자와 중고 레코드숍에서 우연히 들은 한국 인디 발라드. 뜻도 모른 채 발음 기호를 적어 내려간 밤.",
    choice: "주머니 속 단어장 첫 페이지에 적어둔 문장 '아이스 아메리카노 한 잔 주세요'를 외우며 서울행 비행기에 오른다.",
    supportPoint: "서툰 발음으로 한 음절씩 진심을 전할 때 먼저 손 내밀어 주고 싶은 막내.",
    arrivalBeat: "B7 실사 디졸브 — 성수동 카페 2층 창가 앞에 서서 숨을 고르는 하루토(시즌1 제1화 첫 컷 직결).",
    episodeLink: 1,
    sensitive: false,
    status: "STORYBOARDED",
    beats: [
      { id: 9, originId: 2, code: "B1", startSec: 0, endSec: 15, content: "비 내리는 도쿄 저녁 전철 창문에 비친 하루토의 얼굴과 빈 진로 희망서", direction: "차분한 블루그레이(#4A586E) 수채 톤, 전철 덜컹거리는 리듬", done: true },
      { id: 10, originId: 2, code: "B2", startSec: 15, endSec: 45, content: "친구들과 헤어진 뒤 혼자 걷는 골목길, 주머니 속에서 구겨진 진로 종이", direction: "우산 사이로 스치는 네온 반사광, 부드러운 셀 셰이딩", done: true },
      { id: 11, originId: 2, code: "B3", startSec: 45, endSec: 75, content: "비 피하듯 들어간 작은 레코드숍, 스피커에서 흘러나오는 따뜻한 한국어 보컬", direction: "레코드 바늘 클로즈업, 공간 색온도가 조금씩 따뜻해짐", done: true },
      { id: 12, originId: 2, code: "B4", startSec: 75, endSec: 115, content: "책상 스탠드 불빛 아래에서 작은 수첩에 히라가나로 한국어 발음을 또박또박 적는 손", direction: "단어장 첫 줄 '아이스 아메리카노 한 잔 주세요' 클로즈업", done: true },
      { id: 13, originId: 2, code: "B5", startSec: 115, endSec: 145, content: "나리타 공항 출국장, 손에 쥔 편도 항공권과 데님 재킷 주머니 속 단어장", direction: "아침 햇살이 쏟아지는 공항 유리창, 설렘과 긴장이 교차하는 표정", done: false },
      { id: 14, originId: 2, code: "B6", startSec: 145, endSec: 170, content: "성수동 카페 문 앞에서 단어장을 한 번 더 확인하고 고개를 드는 하루토", direction: "복숭아빛 햇살(#F6E4C8), 뒤에 서서 미소 짓는 지후의 실루엣", done: false },
      { id: 15, originId: 2, code: "B7", startSec: 170, endSec: 178, content: "문을 여는 애니 컷에서 시즌1 제1화 성수동 카페 실사 첫 프레임으로 디졸브", direction: "라이트 워시드 데님 재킷 + 흰 티셔츠 고정 의상 일치", done: false },
      { id: 16, originId: 2, code: "B8", startSec: 178, endSec: 180, content: "타이틀 카드: K-SOULMATE ORIGIN #2 하루토 — 제1화에서 이어집니다", direction: "단어장 일러스트와 함께 로고 페이드인", done: false },
    ],
    channelScripts: [
      {
        id: 4,
        originId: 2,
        channelCode: "JP",
        narration: `進路希望調査の紙が、ずっと白紙のままでした。\n雨の下北沢で、偶然耳にした韓国の歌がありました。\n意味は分からなかったけれど、なぜか胸の奥が温かくなったんです。\nその夜から、小さな単語帳にひとつずつ発音を書き始めました。\n最初のページに書いたのは「アイスアメリカーノを一杯ください」。\nポケットにそのノートを入れて、僕はソウル行きの飛行機に乗りました。`,
        voStatus: "DONE",
      },
      {
        id: 5,
        originId: 2,
        channelCode: "US",
        narration: `Blank career form in his backpack. Rainy night in Tokyo.\nHaruto ducks into a tiny record shop and hears a Korean melody that stops him cold.\nHe doesn't know a single word yet.\nSo he buys a pocket notebook and writes phonetic lines until sunrise.\nPage one: how to order an iced Americano in Seoul.\nOne-way ticket in hand — watch how Episode 1 begins.`,
        voStatus: "IN_PROGRESS",
      },
      {
        id: 6,
        originId: 2,
        channelCode: "KR",
        narration: `진로 희망서를 빈칸으로 남겨두던 도쿄의 열아홉 살이 있었습니다.\n비 오는 날 작은 레코드숍에서 들은 한국 노래 한 곡이 시작이었습니다.\n모서리가 닳은 작은 단어장에 매일 밤 한국어 문장을 적었습니다.\n첫 페이지에 적힌 문장은 「아이스 아메리카노 한 잔 주세요」.\n그 수첩 하나를 데님 재킷 주머니에 넣고 성수동 카페 문 앞에 섰습니다.`,
        voStatus: "DONE",
      },
    ],
    safetyChecks: [],
  },
  {
    id: 3,
    no: 3,
    memberId: "M2",
    title: "멜버른 지하철의 거울",
    releaseOrder: 3,
    releaseAt: "D-3",
    durationSec: 180,
    originCity: "멜버른 · 플린더스 스트리트 역 지하 통로",
    keyProp: "밑창이 닳은 댄스 부츠, 은색 체인 목걸이",
    colorStart: "#1E242B",
    colorEnd: "#E5A93C",
    lack: "어디에서도 완전히 현지인도, 완전히 한국인도 아니었던 경계인의 고독. 말보다 몸이 먼저 반응하던 소년.",
    turningPoint: "심야 지하철 스크린도어 유리에 비친 자신의 프리스타일 댄스 영상을 본 서울 프로듀서의 DM 한 통.",
    choice: "익숙한 크루와 거리를 뒤로하고, 진짜 자기 이름을 걸 무대를 찾아 서울 성수동 연습실로 향한다.",
    supportPoint: "무대 위에서는 누구보다 날카롭지만 한국어 앞에서는 금세 솔직해지는 반전 매력.",
    arrivalBeat: "B7 실사 디졸브 — 성수동 팝업스토어 줄 앞에서 크롭 가죽 재킷 깃을 세우는 이든(시즌1 제5화 직결).",
    episodeLink: 5,
    sensitive: false,
    status: "SCRIPTED",
    beats: [
      { id: 17, originId: 3, code: "B1", startSec: 0, endSec: 15, content: "막차가 끊긴 멜버른 지하철 플랫폼, 유리창에 비친 이든의 그림자와 부츠 발끝", direction: "차가운 다크 슬레이트(#1E242B), 지하철 환풍구 바람 소리", done: true },
      { id: 18, originId: 3, code: "B2", startSec: 15, endSec: 45, content: "영어 이름과 한국 이름 사이에서 잠시 멈칫하는 출석부 장면 회상", direction: "빠른 컷 전환, 주변 소음이 페이드아웃되며 내면의 고립감 표현", done: true },
      { id: 19, originId: 3, code: "B3", startSec: 45, endSec: 75, content: "이어폰을 꽂고 검은 유리창을 거울 삼아 터뜨리는 강렬한 프리스타일 댄스", direction: "은색 체인 목걸이의 흔들림과 발구름 타격감 강조", done: false },
      { id: 20, originId: 3, code: "B4", startSec: 75, endSec: 115, content: "숨을 몰아쉬며 앉은 벤치에서 울리는 휴대폰 화면 — 서울에서 온 캐스팅 메시지", direction: "휴대폰 화면의 따뜻한 앰버 라이트가 얼굴을 비춤", done: false },
      { id: 21, originId: 3, code: "B5", startSec: 115, endSec: 145, content: "멜버른 크루들과 주먹 인사를 나누고 더플백 하나를 메고 공항으로 향하는 새벽", direction: "가로등 불빛(#E5A93C)이 길게 이어지는 새벽 도로", done: false },
      { id: 22, originId: 3, code: "B6", startSec: 145, endSec: 170, content: "서울 연습실 거울 앞에서 다른 네 멤버와 처음으로 호흡을 맞추는 순간", direction: "거울 속 혼자였던 그림자가 다섯 명으로 채워지는 구도", done: false },
      { id: 23, originId: 3, code: "B7", startSec: 170, endSec: 178, content: "성수동 골목으로 걸어 나오는 애니 컷이 실사 이든의 클로즈업으로 매치컷 디졸브", direction: "블랙 크롭 가죽 바이커 재킷 + 카고 팬츠 고정 의상 일치", done: false },
      { id: 24, originId: 3, code: "B8", startSec: 178, endSec: 180, content: "타이틀 카드: K-SOULMATE ORIGIN #3 이든 박 — D-3", direction: "96 BPM 붐뱁 킥 비트와 함께 타이틀 인", done: false },
    ],
    channelScripts: [
      {
        id: 7,
        originId: 3,
        channelCode: "JP",
        narration: `夜のメルボルン。最終電車が過ぎたホームのガラスが、僕の最初の鏡でした。\n言葉で説明するより、ビートに身体を乗せる方がずっと正直になれたから。\nすり減ったブーツの底だけが、僕の時間を知っていました。\nあの日届いたソウルからのメッセージが、ガラスの向こうの世界を開きました。\nひとりだった鏡の中に、今は4人の仲間がいます。`,
        voStatus: "IN_PROGRESS",
      },
      {
        id: 8,
        originId: 3,
        channelCode: "US",
        narration: `Midnight in Melbourne. Last train's gone.\nJust me, scuffed combat boots, and the dark subway glass for a mirror.\nGrowing up between two languages, dance was the only one that never asked where I was from.\nThen one DM from Seoul changed the whole beat.\nPacked one bag, kept the silver chain, and landed in Seongsu.\nWatch what happens next.`,
        voStatus: "IN_PROGRESS",
      },
      {
        id: 9,
        originId: 3,
        channelCode: "KR",
        narration: `막차가 떠난 멜버른 지하철 유리창이 첫 연습실 거울이었습니다.\n두 개의 언어 사이에서 망설일 때마다 말 대신 춤으로 대답했습니다.\n밑창이 닳은 부츠 하나로 버틴 밤 끝에 서울에서 연락이 도착했습니다.\n혼자 비치던 거울 속에 이제 다섯 명의 팀이 함께 서 있습니다.\nK-soulmate의 센터 댄서, 이든 박의 이야기입니다.`,
        voStatus: "TODO",
      },
    ],
    safetyChecks: [],
  },
  {
    id: 4,
    no: 4,
    memberId: "M3",
    title: "타이베이 비 오는 화실의 카세트",
    releaseOrder: 4,
    releaseAt: "+1주",
    durationSec: 180,
    originCity: "타이베이 · 단수이 강변 오래된 화실",
    keyProp: "수채 물감 묻은 카세트 플레이어, 슬레이트 그레이 울 코트",
    colorStart: "#3D4F53",
    colorEnd: "#D9C3B0",
    lack: "건축 디자인 전공생으로 도면만 그리던 날들. 정해진 선 안에서는 자신의 진짜 색을 찾을 수 없었던 답답함.",
    turningPoint: "비가 쏟아지던 화실 창가에서 어머니의 오래된 카세트 테이프에 자신의 허밍을 겹쳐 녹음해 본 오후.",
    choice: "제도판 위에 연필을 내려놓고, 목소리로 공간과 감정을 그리기 위해 서울행 오디션 영상을 보낸다.",
    supportPoint: "섬세한 눈빛과 부드러운 미소 뒤에 누구보다 단단한 예술가적 고집을 지닌 보컬.",
    arrivalBeat: "B7 실사 디졸브 — 성수동 편집숍 행거 사이에서 코트 자락을 정리하는 위하오(시즌1 제2화 직결).",
    episodeLink: 2,
    sensitive: false,
    status: "PLANNING",
    beats: [
      { id: 25, originId: 4, code: "B1", startSec: 0, endSec: 15, content: "타이베이의 빗방울이 맺힌 화실 유리창과 자로 반듯하게 그어진 건축 도면", direction: "청회색(#3D4F53) 수채 배경, 빗소리와 연필 사각거리는 소리", done: true },
      { id: 26, originId: 4, code: "B2", startSec: 15, endSec: 45, content: "틀린 선 하나를 지우다 멈춘 손. 완벽한 도면 위에서도 채워지지 않는 공허한 눈빛", direction: "고양이 눈매 특유의 섬세한 시선 처리, 정적인 카메라 워크", done: false },
      { id: 27, originId: 4, code: "B3", startSec: 45, endSec: 75, content: "화실 구석 선반에서 발견한 낡은 카세트 플레이어의 재생 버튼을 누르는 손가락", direction: "테이프 릴이 돌아가는 아날로그 질감과 따뜻한 노이즈", done: false },
      { id: 28, originId: 4, code: "B4", startSec: 75, endSec: 115, content: "빗소리에 맞춰 낮게 허밍을 시작하자 차가웠던 화실 공기가 웜 베이지 톤으로 물드는 순간", direction: "목소리 파장에 맞춰 창밖 비가 그치고 석양빛(#D9C3B0)이 스며듦", done: false },
      { id: 29, originId: 4, code: "B5", startSec: 115, endSec: 145, content: "도면 통 대신 작은 마이크와 카세트를 가방에 챙겨 화실 문을 나서는 위하오", direction: "슬레이트 그레이 오버사이즈 울 코트가 바람에 부드럽게 흔들림", done: false },
      { id: 30, originId: 4, code: "B6", startSec: 145, endSec: 170, content: "서울 성수동 쇼룸 거울 앞에서 한국어로 첫 문장을 연습하며 미소 짓는 모습", direction: "따뜻한 실내 조명, 작은 실버 이어 스터드 반짝임", done: false },
      { id: 31, originId: 4, code: "B7", startSec: 170, endSec: 178, content: "편집숍 옷걸이를 넘기는 애니 손끝이 시즌1 제2화 실사 장면으로 매치컷 디졸브", direction: "슬레이트 그레이 울 코트 + 화이트 셔츠 고정 의상 일치", done: false },
      { id: 32, originId: 4, code: "B8", startSec: 178, endSec: 180, content: "타이틀 카드: K-SOULMATE ORIGIN #4 린위하오 — 제2화와 함께 보기", direction: "잔잔한 피아노 아르페지오 마무리", done: false },
    ],
    channelScripts: [
      {
        id: 10,
        originId: 4,
        channelCode: "JP",
        narration: `台北の雨の日、僕はいつも定規で真っ直ぐな線ばかり引いていました。\n正しい図面を描いても、そこには僕の温度がありませんでした。\n古いアトリエで見つけたカセットに、雨音と自分のハミングを重ねた午後。\n初めて、線の外側に自分の色が見えた気がしました。\n図面を閉じて向かったソウルで、僕の新しい歌が始まります。`,
        voStatus: "TODO",
      },
      {
        id: 11,
        originId: 4,
        channelCode: "US",
        narration: `Rainy afternoon in Taipei. Straight lines on an architecture board.\nWeihao knew how to draw a room, but he couldn't breathe inside it.\nThen he hits record on an old cassette player by the window and hums over the rain.\nOne take. Warm, effortless, real.\nHe traded blueprints for a mic in Seoul — and found his voice.`,
        voStatus: "TODO",
      },
      {
        id: 12,
        originId: 4,
        channelCode: "KR",
        narration: `타이베이의 비 오는 화실에서 매일 반듯한 도면만 그리던 시절이 있었습니다.\n자로 그은 선 안에서는 내 진짜 색깔을 찾기 어려웠습니다.\n오래된 카세트 테이프에 빗소리와 허밍을 함께 녹음하던 날,\n선 밖으로 번져 나가는 목소리의 온도를 처음 알게 되었습니다.\nK-soulmate의 리드보컬, 린위하오의 시작입니다.`,
        voStatus: "TODO",
      },
    ],
    safetyChecks: [],
  },
  {
    id: 5,
    no: 5,
    memberId: "M5",
    title: "쿠알라룸푸르 야시장의 비트박스",
    releaseOrder: 5,
    releaseAt: "+2주",
    durationSec: 180,
    originCity: "쿠알라룸푸르 · 부킷빈탕 야시장 루프탑",
    keyProp: "검은 리스트밴드, 3개 국어 라임 노트",
    colorStart: "#2A2438",
    colorEnd: "#F29F4B",
    lack: "야시장 스피커 소리 뒤에 가려져 있던 독학 비트메이커. 세 가지 언어로 가사를 써도 들어줄 무대가 없던 밤.",
    turningPoint: "갑작스러운 스콜로 정전이 된 야시장 골목에서, 아이만의 무반주 비트박스와 랩이 사람들의 발걸음을 붙잡은 순간.",
    choice: "검은 리스트밴드를 고쳐 차고, 자신의 박자를 가장 넓게 울릴 수 있는 서울 성수동 스튜디오로 날아간다.",
    supportPoint: "어떤 박자 앞에서도 주눅 들지 않는 에너지와 3개 국어를 넘나드는 영리한 리듬감.",
    arrivalBeat: "B7 실사 디졸브 — 성수동 댄스 트레이닝룸에서 리스트밴드를 조이며 웃는 아이만(시즌1 제4화 직결).",
    episodeLink: 4,
    sensitive: false,
    status: "PLANNING",
    beats: [
      { id: 33, originId: 5, code: "B1", startSec: 0, endSec: 15, content: "열대야의 쿠알라룸푸르 야시장 상공, 네온사인과 빗방울이 섞이는 딥 바이올렛 밤하늘", direction: "딥 인디고 바이올렛(#2A2438), 시장의 활기찬 앰비언스 사운드", done: true },
      { id: 34, originId: 5, code: "B2", startSec: 15, endSec: 45, content: "작은 선풍기 돌아가는 옥상 방에서 말레이어·영어·중국어·한국어 단어를 섞어 라임을 적는 손", direction: "검은 리스트밴드 클로즈업, 펜 끝으로 책상을 두드리는 리듬", done: false },
      { id: 35, originId: 5, code: "B3", startSec: 45, endSec: 75, content: "열대 스콜이 쏟아지며 골목 천막 조명이 일제히 꺼지는 정전의 순간", direction: "빗소리만 남는 1.5초의 정적 후 아이만의 첫 킥 비트박스 시작", done: false },
      { id: 36, originId: 5, code: "B4", startSec: 75, endSec: 115, content: "스마트폰 손전등 불빛들이 하나둘 켜지며 아이만의 무반주 프리스타일 주위로 모이는 사람들", direction: "따뜻한 오렌지 골드(#F29F4B) 조명이 화면을 가득 채움", done: false },
      { id: 37, originId: 5, code: "B5", startSec: 115, endSec: 145, content: "라임 노트 마지막 줄에 한국어로 '박자에 맞춰 볼게요'를 적고 가방을 닫는 아이만", direction: "차콜 블랙 오버사이즈 후디와 와이드 팬츠 실루엣", done: false },
      { id: 38, originId: 5, code: "B6", startSec: 145, endSec: 170, content: "서울 연습실 문을 열고 들어와 네 멤버와 하이라이트 비트를 주고받는 장면", direction: "경쾌한 카메라 패닝, 다섯 명의 에너지가 합쳐지는 컷", done: false },
      { id: 39, originId: 5, code: "B7", startSec: 170, endSec: 178, content: "연습실 거울 앞에서 손목 리스트밴드를 당기는 애니 컷이 시즌1 제4화 실사로 디졸브", direction: "차콜 블랙 후디 + 검은 리스트밴드 고정 의상 일치", done: false },
      { id: 40, originId: 5, code: "B8", startSec: 178, endSec: 180, content: "타이틀 카드: K-SOULMATE ORIGIN #5 아이만 — 5인의 프리퀄 완결", direction: "다섯 멤버의 상징 오브제가 한 화면에 모이며 엔딩", done: false },
    ],
    channelScripts: [
      {
        id: 13,
        originId: 5,
        channelCode: "JP",
        narration: `クアラルンプールの夜市。スコールで街の明かりが消えた夜がありました。\n3つの言葉で書いたライムノートを握りしめて、僕は自分の息だけでビートを刻みました。\nひとつ、またひとつとスマホのライトが集まって、路地がステージに変わった瞬間。\nノートの最後のページに、韓国語で「リズムに合わせてみます」と書きました。\nそのビートを連れて、今ソウルにいます。`,
        voStatus: "TODO",
      },
      {
        id: 14,
        originId: 5,
        channelCode: "US",
        narration: `Tropical storm hits Bukit Bintang. Power goes out across the night market.\nNo speakers, no backing track — just Aiman, his black wristband, and a notebook full of trilingual bars.\nHe drops a beatbox groove in the dark, and fifty phone lights turn the alley into a stage.\nNext stop: Seongsu-dong.\nLet's match the beat.`,
        voStatus: "TODO",
      },
      {
        id: 15,
        originId: 5,
        channelCode: "KR",
        narration: `쿠알라룸푸르 야시장에 갑작스러운 스콜로 정전이 찾아온 밤이 있었습니다.\n반주도 조명도 꺼진 골목에서 아이만은 자기 숨소리로 첫 비트를 만들었습니다.\n휴대폰 불빛들이 하나둘 모여 작은 골목이 첫 무대가 되었습니다.\n라임 노트 마지막 장에 적었던 한국어 문장, 「박자에 맞춰 볼게요」.\n다섯 번째 조각, 래퍼 아이만의 시작입니다.`,
        voStatus: "TODO",
      },
    ],
    safetyChecks: [],
  },
];

export function createInitialSeedState(): ConsoleStoreState {
  const ep1Narrations: Record<string, string> = {
    JP: `오늘, 처음으로 혼자 주문했어요.\n형은 밖에 나가 있었어요. 저 혼자였어요.\n카운터까지 걸어가는 동안, 손이 조금 떨렸어요.\n「얼음은 적게 넣어 주세요」\n연습한 그 문장이, 제 입에서 나왔어요.\n컵을 받았을 때 —\n아, 왠지 조금 자랑스러웠어요.\n형은 밖에서 웃고 있었어요.`,
    US: `Okay so — watch this.\nHyung dips. Leaves him ALONE.\nJust him, the counter, and pure pressure.\nBarista's like "... you good?"\nAnd he says it. Clean.\n「얼음은 적게」— ICE. LESS.\nMan said it PERFECT. First try. No help.\nOkay okay okay. That's my boy.`,
    KR: `혼자 주문에 성공했습니다.\n오늘 배운 표현은 「얼음은 적게 넣어 주세요」입니다.\n성수동 ○○카페에서 실제로 통하는 문장입니다.\n다음 화는 편의점입니다. 훨씬 어렵습니다.`,
    CN: "",
  };

  const channelVersions: ChannelVersion[] = [];
  let verId = 1;
  for (const ep of EPISODES_SEED) {
    for (const ch of CHANNELS_SEED) {
      let status: ChannelVersion["status"] = "TODO";
      let voStatus: ChannelVersion["voStatus"] = "TODO";
      if (ep.no === 1 && ch.active) {
        status = "DONE";
        voStatus = "DONE";
      } else if (ep.no === 2 && ch.code === "JP") {
        status = "DONE";
        voStatus = "DONE";
      } else if (ep.no === 2 && (ch.code === "US" || ch.code === "KR")) {
        status = "IN_PROGRESS";
        voStatus = "IN_PROGRESS";
      } else if (ep.no === 3 && ch.code === "JP") {
        status = "IN_PROGRESS";
        voStatus = "DONE";
      }

      channelVersions.push({
        id: verId++,
        episodeId: ep.id,
        channelCode: ch.code,
        narration: ep.no === 1 ? ep1Narrations[ch.code] ?? "" : "",
        voStatus,
        bgmTrackId: ch.bgmTracks[0] ?? null,
        cutCount: ch.cutCount,
        totalSec: ch.totalSec,
        status,
        publishedUrl:
          ep.no === 1 && ch.active
            ? `https://social.k-soulmate.internal/${ch.code.toLowerCase()}/ep-01`
            : null,
        publishedAt:
          ep.no === 1 && ch.active ? "2026-10-20T09:00:00.000Z" : null,
      });
    }
  }

  const complianceChecks: ComplianceCheck[] = [];
  let chkId = 1;
  for (const ep of EPISODES_SEED) {
    for (const item of COMPLIANCE_ITEMS_SEED) {
      const done =
        ep.no === 1 ||
        (ep.no === 2 && item.blockAt === "BEFORE_PUBLISH");
      complianceChecks.push({
        id: chkId++,
        episodeId: ep.id,
        itemCode: item.code,
        done,
        owner: item.ownerRole ?? "",
        note: null,
      });
    }
  }

  return {
    members: MEMBERS_SEED,
    channels: CHANNELS_SEED,
    episodes: EPISODES_SEED,
    channelVersions,
    runs: [
      { id: 1, episodeId: 1, model: "seedance-2.0", purpose: "base", attempts: 59, accepted: 44, credits: 1350, createdAt: "2026-10-18T10:00:00.000Z" },
      { id: 2, episodeId: 1, model: "seedance-2.0", purpose: "retry", attempts: 2, accepted: 2, credits: 60, createdAt: "2026-10-19T14:00:00.000Z" },
      { id: 3, episodeId: 2, model: "seedance-2.0", purpose: "base", attempts: 61, accepted: 46, credits: 1410, createdAt: "2026-10-22T11:00:00.000Z" },
      { id: 4, episodeId: 3, model: "seedance-2.5", purpose: "base", attempts: 68, accepted: 44, credits: 1720, createdAt: "2026-10-25T16:00:00.000Z" },
      { id: 5, episodeId: 4, model: "seedance-2.0", purpose: "base", attempts: 52, accepted: 40, credits: 1100, createdAt: "2026-10-27T09:00:00.000Z" },
    ],
    budget: {
      month: "2026-11",
      plan: "ultra",
      creditCap: 9400,
      creditUsed: 5640,
      claudeSeats: 2,
      costUsd: 350,
    },
    complianceItems: COMPLIANCE_ITEMS_SEED,
    complianceChecks,
    missions: [
      { id: 1, episodeId: 1, type: "expression", body: "성수동 카페에서 실제로 쓰는 테이크아웃 표현 추천", votes: 48, status: "ADOPTED" },
      { id: 2, episodeId: 2, type: "expression", body: "편집숍에서 사이즈 교환 요청할 때 자연스러운 한마디", votes: 31, status: "COLLECTING" },
      { id: 3, episodeId: 3, type: "fandom_name", body: "K-soulmate 공식 팬덤명 1차 아이디어 응모", votes: 92, status: "COLLECTING" },
    ],
    fandomCandidates: [
      { id: 1, name: "오롯", reason: "모자람 없이 온전한 다섯 명의 하모니", votes: 142, checkTm: true, checkDup: true, checkWord: true, checkPron: true, checkChant: true, status: "SHORTLIST" },
      { id: 2, name: "이음", reason: "한국어 표현으로 세계 팬들의 마음을 잇다", votes: 118, checkTm: true, checkDup: true, checkWord: true, checkPron: true, checkChant: true, status: "CANDIDATE" },
      { id: 3, name: "가온", reason: "세상의 중심에서 함께 성장하는 메이트", votes: 95, checkTm: true, checkDup: false, checkWord: true, checkPron: true, checkChant: true, status: "CANDIDATE" },
      { id: 4, name: "새김", reason: "매일 세 문장씩 마음에 새기는 기록", votes: 84, checkTm: true, checkDup: true, checkWord: true, checkPron: false, checkChant: true, status: "CANDIDATE" },
      { id: 5, name: "한결", reason: "처음부터 끝까지 한결같은 응원", votes: 63, checkTm: true, checkDup: true, checkWord: true, checkPron: true, checkChant: false, status: "CANDIDATE" },
    ],
    gauges: [
      { id: 1, label: "하루토 얼굴 공개", threshold: 50, current: 0, unlocked: false },
    ],
    origins: ORIGINS_SEED,
    snsEpisodes: INITIAL_SNS_EPISODES,
    snsQuestions: INITIAL_SNS_QUESTIONS,
    snsTopicVotes: INITIAL_SNS_TOPIC_VOTES,
    snsUgcList: INITIAL_SNS_UGC,
    snsEngagements: INITIAL_SNS_ENGAGEMENT,
    season2Episodes: INITIAL_SEASON2_EPISODES,
    season2Devices: INITIAL_SEASON2_DEVICES,
    releasePhases: INITIAL_RELEASE_PHASES,
  };
}

const STORAGE_KEY = "k_soulmate_console_store_v1";
export const KSOULMATE_SCHEMA_V4_MEME_PERSONA =
  "KSOULMATE_SCHEMA_V4_MEME_PERSONA";

export function loadStore(): ConsoleStoreState {
  if (typeof window === "undefined") {
    return createInitialSeedState();
  }
  try {
    const schemaVer = window.localStorage.getItem(
      KSOULMATE_SCHEMA_V4_MEME_PERSONA
    );
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || schemaVer !== "true") {
      const seeded = createInitialSeedState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      window.localStorage.setItem(KSOULMATE_SCHEMA_V4_MEME_PERSONA, "true");
      return seeded;
    }
    const parsed = JSON.parse(raw) as ConsoleStoreState;
    let mutated = false;

    if (
      !parsed.origins ||
      !Array.isArray(parsed.origins) ||
      parsed.origins.length === 0 ||
      parsed.origins[0]?.choice !== ORIGINS_SEED[0].choice
    ) {
      parsed.origins = ORIGINS_SEED;
      mutated = true;
    }

    if (
      !parsed.snsEpisodes ||
      !Array.isArray(parsed.snsEpisodes) ||
      parsed.snsEpisodes.length < 18
    ) {
      parsed.snsEpisodes = INITIAL_SNS_EPISODES;
      mutated = true;
    }

    if (
      !parsed.snsQuestions ||
      !Array.isArray(parsed.snsQuestions) ||
      parsed.snsQuestions.length === 0
    ) {
      parsed.snsQuestions = INITIAL_SNS_QUESTIONS;
      mutated = true;
    }

    if (
      !parsed.snsTopicVotes ||
      !Array.isArray(parsed.snsTopicVotes) ||
      parsed.snsTopicVotes.length === 0
    ) {
      parsed.snsTopicVotes = INITIAL_SNS_TOPIC_VOTES;
      mutated = true;
    }

    if (
      !parsed.snsUgcList ||
      !Array.isArray(parsed.snsUgcList) ||
      parsed.snsUgcList.length === 0
    ) {
      parsed.snsUgcList = INITIAL_SNS_UGC;
      mutated = true;
    }

    if (
      !parsed.snsEngagements ||
      !Array.isArray(parsed.snsEngagements) ||
      parsed.snsEngagements.length < 18
    ) {
      parsed.snsEngagements = INITIAL_SNS_ENGAGEMENT;
      mutated = true;
    }

    if (
      !parsed.season2Episodes ||
      !Array.isArray(parsed.season2Episodes) ||
      parsed.season2Episodes.length < 10
    ) {
      parsed.season2Episodes = INITIAL_SEASON2_EPISODES;
      mutated = true;
    }

    if (
      !parsed.season2Devices ||
      !Array.isArray(parsed.season2Devices) ||
      parsed.season2Devices.length < 4
    ) {
      parsed.season2Devices = INITIAL_SEASON2_DEVICES;
      mutated = true;
    }

    if (
      !parsed.releasePhases ||
      !Array.isArray(parsed.releasePhases) ||
      parsed.releasePhases.length < 5
    ) {
      parsed.releasePhases = INITIAL_RELEASE_PHASES;
      mutated = true;
    }

    if (Array.isArray(parsed.members)) {
      const m1 = parsed.members.find((m) => m.id === "M1");
      if (
        !m1 ||
        !m1.animeSheetStatus ||
        (!m1.animeSheetUrl && m1.animeSheetStatus !== "NONE") ||
        !m1.domainAnchorBadge
      ) {
        parsed.members = parsed.members.map((m) => {
          const def = DEFAULT_MEMBER_ANIME_SHEETS[m.id];
          const seedMember = MEMBERS_SEED.find((sm) => sm.id === m.id);
          return {
            ...m,
            animeSheetUrl: m.animeSheetUrl ?? def?.animeSheetUrl ?? null,
            animeSheetQuadrant:
              m.animeSheetQuadrant !== undefined
                ? m.animeSheetQuadrant
                : def?.animeSheetQuadrant ?? null,
            animeSheetStatus: m.animeSheetStatus ?? def?.animeSheetStatus ?? "NONE",
            animeSheetLabel: m.animeSheetLabel ?? def?.animeSheetLabel ?? null,
            domainAnchorBadge:
              m.domainAnchorBadge ?? seedMember?.domainAnchorBadge,
            domainAnchorDesc:
              m.domainAnchorDesc ?? seedMember?.domainAnchorDesc,
            personaLabel: m.personaLabel ?? seedMember?.personaLabel,
          };
        });
        mutated = true;
      }
    }

    if (Array.isArray(parsed.episodes)) {
      const ep1 = parsed.episodes.find((e) => e.no === 1);
      if (!ep1 || !ep1.kMemeSlang || ep1.title !== EPISODES_SEED[0].title) {
        parsed.episodes = EPISODES_SEED.map((seedEp) => {
          const existing = parsed.episodes.find((e) => e.no === seedEp.no);
          return {
            ...seedEp,
            status: existing?.status ?? seedEp.status,
            baseVideoUrl: existing?.baseVideoUrl ?? seedEp.baseVideoUrl,
          };
        });
        mutated = true;
      }
    }

    if (mutated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return createInitialSeedState();
  }
}

export function saveStore(state: ConsoleStoreState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}
