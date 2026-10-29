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
  { id: 1, no: 1, title: "아이스 아메리카노 한 잔 주세요", place: "성수동 카페 (2층 창가)", memberId: "M4", expressions: ["아이스 아메리카노 한 잔 주세요", "얼음은 적게 넣어 주세요", "여기서 마시고 갈게요"], baseVideoUrl: "https://storage.k-soulmate.internal/ep-01-master-130s.mp4", status: "PUBLISHED", complianceRisk: false },
  { id: 2, no: 2, title: "이거 다른 색 있어요?", place: "성수동 편집숍", memberId: "M3", expressions: ["이거 다른 색 있어요?", "한 사이즈 크게 주세요", "입어봐도 돼요?"], baseVideoUrl: "https://storage.k-soulmate.internal/ep-02-master-130s.mp4", status: "REVIEWED", complianceRisk: false },
  { id: 3, no: 3, title: "여기 스타일 좀 바꿔 주세요", place: "협력 · K-pop 헤어메이크업 스튜디오", memberId: "M4", expressions: ["이렇게 스타일링해 주세요", "너무 짧지 않게 해 주세요", "사진처럼 해 주실 수 있어요?"], baseVideoUrl: "https://storage.k-soulmate.internal/ep-03-master-130s.mp4", status: "EDITED", complianceRisk: true },
  { id: 4, no: 4, title: "이 동작 다시 알려 주세요", place: "협력 · K-pop 댄스 트레이닝", memberId: "M5", expressions: ["이 동작 다시 알려 주세요", "조금 천천히 해 주세요", "박자에 맞춰 볼게요"], baseVideoUrl: "https://storage.k-soulmate.internal/ep-04-master-130s.mp4", status: "GENERATED", complianceRisk: false },
  { id: 5, no: 5, title: "여기 줄이에요?", place: "성수동 팝업스토어", memberId: "M2", expressions: ["여기 줄 서는 거예요?", "이거 아직 재고 있어요?", "몇 시까지 해요?"], baseVideoUrl: null, status: "SCRIPTED", complianceRisk: false },
  { id: 6, no: 6, title: "제 피부 고민은요", place: "협력 · 프리미엄 피부과·안티에이징", memberId: "M3", expressions: ["여기서 상담받을 수 있나요?", "제 피부 타입이 어떻게 되나요?", "관리 후 주의할 점이 있나요?"], baseVideoUrl: null, status: "PLANNING", complianceRisk: true },
  { id: 7, no: 7, title: "제 피부 타입 설명해 주세요", place: "협력 · 1:1 뷰티 클래스", memberId: "M2", expressions: ["제 피부는 어떤 타입인가요?", "이 단계는 어떻게 하는 거예요?", "집에서도 이렇게 하면 되나요?"], baseVideoUrl: null, status: "PLANNING", complianceRisk: true },
  { id: 8, no: 8, title: "이 부분 다시 불러 주세요", place: "협력 · K-pop 보컬 트레이닝", memberId: "M3", expressions: ["이 부분 다시 불러 주세요", "숨을 어디서 쉬어야 해요?", "조금 더 감정을 넣어 볼게요"], baseVideoUrl: null, status: "PLANNING", complianceRisk: false },
  { id: 9, no: 9, title: "덜 맵게 해 주세요", place: "성수동 한식당", memberId: "M5", expressions: ["덜 맵게 해 주세요", "뭐가 제일 맛있어요?", "물 좀 더 주시겠어요?"], baseVideoUrl: null, status: "PLANNING", complianceRisk: false },
  { id: 10, no: 10, title: "사진 한 장 찍어 주세요", place: "성수동 사진관", memberId: "M4", expressions: ["여기서 사진 찍어도 돼요?", "한 장만 더 찍어 주세요", "이거 받을 수 있어요?"], baseVideoUrl: null, status: "PLANNING", complianceRisk: false },
  { id: 11, no: 11, title: "5인 합류 · 성수동 전역 미션", place: "성수동 전역", memberId: null, expressions: ["각자 미션 수행", "다섯 명 동시 주문", "합격 판정"], baseVideoUrl: null, status: "PLANNING", complianceRisk: false },
  { id: 12, no: 12, title: "첫 한국어 발표", place: "성수동 (실내)", memberId: null, expressions: ["5분 스피치", "자기소개", "앞으로의 목표"], baseVideoUrl: null, status: "PLANNING", complianceRisk: false },
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
    season2Episodes: INITIAL_SEASON2_EPISODES,
    season2Devices: INITIAL_SEASON2_DEVICES,
    releasePhases: INITIAL_RELEASE_PHASES,
  };
}

const STORAGE_KEY = "k_soulmate_console_store_v1";

export function loadStore(): ConsoleStoreState {
  if (typeof window === "undefined") {
    return createInitialSeedState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createInitialSeedState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
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
      if (!m1 || !m1.animeSheetStatus || (!m1.animeSheetUrl && m1.animeSheetStatus !== "NONE")) {
        parsed.members = parsed.members.map((m) => {
          const def = DEFAULT_MEMBER_ANIME_SHEETS[m.id];
          if (!def) return m;
          return {
            ...m,
            animeSheetUrl: m.animeSheetUrl ?? def.animeSheetUrl,
            animeSheetQuadrant:
              m.animeSheetQuadrant !== undefined
                ? m.animeSheetQuadrant
                : def.animeSheetQuadrant,
            animeSheetStatus: m.animeSheetStatus ?? def.animeSheetStatus,
            animeSheetLabel: m.animeSheetLabel ?? def.animeSheetLabel,
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
