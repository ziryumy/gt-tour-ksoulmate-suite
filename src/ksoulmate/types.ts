export type EpisodeStatus =
  | "PLANNING"
  | "SCRIPTED"
  | "GENERATED"
  | "EDITED"
  | "REVIEWED"
  | "PUBLISHED";

export type VersionStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

export type AnimeSheetQuadrant = "TL" | "TR" | "BL" | "BR" | null;
export type AnimeSheetStatus = "READY" | "HOLD" | "NONE";

export interface Member {
  id: string;
  nameKo: string;
  nameJa: string | null;
  nameZh: string | null;
  nationality: string;
  position: string;
  age: number;
  heightCm: number;
  photoSheetUrl: string;
  animeSheetUrl: string | null;
  animeSheetQuadrant?: AnimeSheetQuadrant;
  animeSheetStatus?: AnimeSheetStatus;
  animeSheetLabel?: string | null;
  outfitSpec: string;
  faceSpec: string;
  voiceProfile: string | null;
  channelCode: string | null;
  locked: boolean;
  domainAnchorBadge?: string;
  domainAnchorDesc?: string;
  personaLabel?: string;
}

export interface Channel {
  code: string; // "JP" | "US" | "KR" | "CN"
  label: string;
  narratorId: string;
  tone: string;
  totalSec: number;
  cutCount: number;
  avgCutSec: number;
  rhythmBasis: string;
  workflowOrder: string[];
  bgmTracks: string[];
  active: boolean;
}

export interface Episode {
  id: number;
  no: number;
  title: string;
  place: string;
  memberId: string | null;
  expressions: string[];
  narrativeSituation?: string;
  kMemeSlang?: string;
  realNuance?: string;
  survivalTip?: string;
  baseVideoUrl: string | null;
  status: EpisodeStatus;
  complianceRisk: boolean;
}

export interface ChannelVersion {
  id: number;
  episodeId: number;
  channelCode: string;
  narration: string;
  voStatus: VersionStatus;
  bgmTrackId: string | null;
  cutCount: number | null;
  totalSec: number | null;
  status: VersionStatus;
  publishedUrl: string | null;
  publishedAt: string | null;
}

export interface GenerationRun {
  id: number;
  episodeId: number;
  model: string;
  purpose: string;
  attempts: number;
  accepted: number;
  credits: number;
  createdAt: string;
}

export interface BudgetMonth {
  month: string;
  plan: string;
  creditCap: number;
  creditUsed: number;
  claudeSeats: number;
  costUsd: number;
}

export interface ComplianceItem {
  code: string;
  label: string;
  detail: string;
  blockAt: "BEFORE_PUBLISH" | "AT_LAUNCH";
  ownerRole?: string;
}

export interface ComplianceCheck {
  id: number;
  episodeId: number;
  itemCode: string;
  done: boolean;
  owner: string | null;
  note: string | null;
}

export interface Mission {
  id: number;
  episodeId: number;
  type: "expression" | "fandom_name";
  body: string;
  votes: number;
  status: "COLLECTING" | "ADOPTED" | "REJECTED";
}

export interface FandomCandidate {
  id: number;
  name: string;
  reason: string;
  votes: number;
  checkTm: boolean;
  checkDup: boolean;
  checkWord: boolean;
  checkPron: boolean;
  checkChant: boolean;
  status: "CANDIDATE" | "SHORTLIST" | "ADOPTED";
}

export interface Gauge {
  id: number;
  label: string;
  threshold: number;
  current: number;
  unlocked: boolean;
}

export type OriginStatus =
  | "PLANNING"
  | "SCRIPTED"
  | "STORYBOARDED"
  | "ANIMATED"
  | "REVIEWED"
  | "PUBLISHED";

export interface OriginBeat {
  id: number;
  originId: number;
  code: string; // "B1"~"B8"
  startSec: number;
  endSec: number;
  content: string;
  direction: string;
  done: boolean;
}

export interface OriginScript {
  id: number;
  originId: number;
  channelCode: string; // "JP" | "US" | "KR"
  narration: string;
  voStatus: VersionStatus;
}

export interface OriginSafety {
  id: number;
  originId: number;
  code: string; // "SAFE-01"~"SAFE-08"
  rule: string;
  done: boolean;
}

export interface Origin {
  id: number;
  no: number; // 1~5
  memberId: string; // "M1"~"M5"
  title: string;
  releaseOrder: number; // 공개 순서 1~5
  releaseAt: string; // "2주 전", "1주 전", "D-3", "+1주", "+2주"
  durationSec: number; // 180
  originCity: string;
  keyProp: string;
  colorStart: string;
  colorEnd: string;
  lack: string;
  turningPoint: string;
  choice: string;
  supportPoint: string;
  arrivalBeat: string;
  episodeLink: number; // 시즌1 연결 회차
  sensitive: boolean; // M1만 true
  status: OriginStatus;
  beats: OriginBeat[];
  channelScripts: OriginScript[];
  safetyChecks: OriginSafety[];
}

export type Season2Part = "PART_A" | "PART_B" | "PART_C";

export type Season2Format =
  | "ANIME_100"
  | "HYBRID_TRANSITION"
  | "LIVE_ACTION_100";

export type TourProductCode = "SHUTTLE" | "NIGHT_PACKAGE" | "VVIP_TRANSFER";

export interface Season2IdentityCheck {
  memberId: string; // "M1" ~ "M5"
  checkpointLabel: string;
  outfitMatchNote: string;
  faceMatchNote: string;
  matched: boolean;
}

export interface Season2Beat {
  id: number;
  code: string; // "S1" ~ "S4"
  timeRange: string;
  visualType: "ANIME" | "TRANSITION_MATCHCUT" | "LIVE_ACTION";
  sceneTitle: string;
  description: string;
  done: boolean;
}

export interface TourProductBridge {
  code: TourProductCode;
  nameKo: string;
  badge: string;
  targetAxis: "STAY" | "KPOP_NEWS" | "HOTPLACE" | "K_BEAUTY";
  summary: string;
  includedBenefits: string[];
  spots: [string, string, string];
  priceTierNote: string;
}

export type Season2DeviceCode =
  | "A3_VOTE"
  | "B3_FANLETTER"
  | "B4_GAUGE"
  | "C2_CITY";

export interface Season2Episode {
  id: number;
  no: number; // 1 ~ 10
  code: "A1" | "A2" | "A3" | "B1" | "B2" | "B3" | "B4" | "C1" | "C2" | "C3";
  part: Season2Part;
  partLabel: string;
  title: string;
  subtitle: string;
  logline: string;
  format: Season2Format;
  formatLabel: string;
  emotionCurve: string;
  emotionIntensity: number; // 1 ~ 100
  emotionKeyword: string;
  place: string;
  durationSec: number;
  leadMemberIds: string[];
  expressions: [string, string, string];
  status: EpisodeStatus;
  releasePhase: "Phase 2" | "Phase 3" | "Phase 4";
  isTransitionPoint?: boolean; // B1 === true
  b1TransitionFrameSpec?: {
    timecode: string;
    animeLastFrameDesc: string;
    liveFirstFrameDesc: string;
    lightingMatchRule: string;
    cameraLensSpec: string;
    verified: boolean;
  };
  identityChecks?: Season2IdentityCheck[];
  tourProducts?: TourProductBridge[];
  participationDeviceCode?: Season2DeviceCode;
  beats: Season2Beat[];
  channelScripts: {
    channelCode: "JP" | "US" | "KR";
    narration: string;
    voStatus: VersionStatus;
  }[];
}

export interface Season2ParticipationDevice {
  id: number;
  code: Season2DeviceCode;
  episodeCode: "A3" | "B3" | "B4" | "C2";
  episodeTitle: string;
  title: string;
  mechanismLabel: string;
  description: string;
  currentCount: number;
  targetCount: number;
  unit: string;
  status: "ACTIVE" | "UNLOCKED" | "COLLECTING";
  rewardRule: string;
  gtTourLinkNote: string;
  options: {
    id: string;
    label: string;
    subLabel: string;
    count: number;
    isLeading?: boolean;
  }[];
}

export interface ReleasePhaseItem {
  id: number;
  phase: "Phase 0" | "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4";
  title: string;
  period: string;
  contentScope: string;
  visualFormat: string;
  coreGoal: string;
  participationHook: string;
  gtTourProduct: string;
  linkedRoutePage: "origins" | "episodes" | "season2";
  linkedEpisodeCodes: string[];
  status: "DONE" | "ACTIVE" | "UPCOMING";
}

export type SnsStatus =
  | "PLANNING"
  | "SCRIPTED"
  | "CARD_READY"
  | "REVIEWED"
  | "PUBLISHED";

export type SnsBeatCode =
  | "hook"
  | "block"
  | "appear"
  | "solve"
  | "sos"
  | "ask";

export interface SnsBeat {
  id: number;
  code: SnsBeatCode;
  label: string;
  secRange: string;
  sceneDesc: string;
  done: boolean;
}

export interface SnsCard {
  headline: string;
  problemText: string;
  solutionTip: string;
  koreanPhrase: string;
  pronunciation: string;
  jihuQuote: string;
  askPrompt: string;
  accentColor: string;
}

export interface SnsChannelCopy {
  channel: "IG" | "X" | "LINE";
  copyText: string;
  hashtags: string;
  status: VersionStatus;
}

export interface SnsMuslimCheck {
  id: number;
  code: string; // "REL-01" ~ "REL-06"
  rule: string;
  done: boolean;
}

export interface SnsEpisode {
  id: number;
  no: number; // 1 ~ 18
  code: string; // E1~E4, W1~W4, H1~H4, A1~A3, I1~I3
  memberId: "M2" | "M3" | "M4" | "M5";
  helperMemberId: "M1";
  title: string;
  place: string;
  barrier: string;
  jihuAction: string;
  isMuslimEpisode: boolean;
  status: SnsStatus;
  releaseWeek: number;
  releaseDay: "화" | "금";
  beats: SnsBeat[];
  card: SnsCard;
  channelCopies: SnsChannelCopy[];
  muslimChecks: SnsMuslimCheck[];
}

export interface SnsQuestion {
  id: number;
  episodeCode: string;
  fanHandle: string;
  lang: "JP" | "EN" | "CN" | "KR";
  question: string;
  jihuReply: string;
  replied: boolean;
  pinned: boolean;
}

export interface SnsTopicVote {
  id: number;
  weekLabel: string;
  question: string;
  optionA: string;
  votesA: number;
  optionB: string;
  votesB: number;
  status: "OPEN" | "CLOSED";
  adoptedEpisodeCode: string | null;
}

export interface SnsUgc {
  id: number;
  submitter: string;
  nationality: string;
  episodeTarget: string;
  story: string;
  status: "PENDING" | "ADOPTED" | "REJECTED";
  creditNote: string;
}

export interface SnsEngagement {
  episodeCode: string;
  views: number;
  saves: number;
  shares: number;
  questionComments: number;
  saveRatePercent: number;
}

export const SNS_STATUS_LABELS: Record<SnsStatus, string> = {
  PLANNING: "기획",
  SCRIPTED: "6비트대본",
  CARD_READY: "카드완성",
  REVIEWED: "검수",
  PUBLISHED: "발행",
};

export const SNS_STATUS_ORDER: SnsStatus[] = [
  "PLANNING",
  "SCRIPTED",
  "CARD_READY",
  "REVIEWED",
  "PUBLISHED",
];

export interface ConsoleStoreState {
  members: Member[];
  channels: Channel[];
  episodes: Episode[];
  channelVersions: ChannelVersion[];
  runs: GenerationRun[];
  budget: BudgetMonth;
  complianceItems: ComplianceItem[];
  complianceChecks: ComplianceCheck[];
  missions: Mission[];
  fandomCandidates: FandomCandidate[];
  gauges: Gauge[];
  origins: Origin[];
  snsEpisodes?: SnsEpisode[];
  snsQuestions?: SnsQuestion[];
  snsTopicVotes?: SnsTopicVote[];
  snsUgcList?: SnsUgc[];
  snsEngagements?: SnsEngagement[];
  season2Episodes?: Season2Episode[];
  season2Devices?: Season2ParticipationDevice[];
  releasePhases?: ReleasePhaseItem[];
}

export const ORIGIN_STATUS_LABELS: Record<OriginStatus, string> = {
  PLANNING: "기획",
  SCRIPTED: "대본",
  STORYBOARDED: "콘티",
  ANIMATED: "애니생성",
  REVIEWED: "검수",
  PUBLISHED: "발행",
};

export const ORIGIN_STATUS_ORDER: OriginStatus[] = [
  "PLANNING",
  "SCRIPTED",
  "STORYBOARDED",
  "ANIMATED",
  "REVIEWED",
  "PUBLISHED",
];

export const EPISODE_STATUS_LABELS: Record<EpisodeStatus, string> = {
  PLANNING: "기획",
  SCRIPTED: "대본",
  GENERATED: "생성",
  EDITED: "편집",
  REVIEWED: "검수",
  PUBLISHED: "발행",
};

export const EPISODE_STATUS_ORDER: EpisodeStatus[] = [
  "PLANNING",
  "SCRIPTED",
  "GENERATED",
  "EDITED",
  "REVIEWED",
  "PUBLISHED",
];

export const VERSION_STATUS_LABELS: Record<VersionStatus, string> = {
  TODO: "대기",
  IN_PROGRESS: "진행중",
  DONE: "완료",
  BLOCKED: "차단",
};

export const PURPOSE_LABELS: Record<string, string> = {
  base: "베이스 생성",
  collection: "집합 컷",
  retry: "재생성",
};

export function formatDateDot(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}
