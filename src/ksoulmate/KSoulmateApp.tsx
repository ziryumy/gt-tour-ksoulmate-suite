import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Film,
  Coins,
  ShieldAlert,
  HeartHandshake,
  Menu,
  X,
  Lock,
  Unlock,
  Copy,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  ArrowLeft,
  Award,
  PlusCircle,
  RotateCcw,
  ExternalLink,
  CheckSquare,
  Square,
  Sparkles,
  ZoomIn,
  Upload,
  Grid,
} from "lucide-react";
import {
  type ConsoleStoreState,
  type Episode,
  type EpisodeStatus,
  type VersionStatus,
  type Member,
  type Origin,
  type OriginStatus,
  type AnimeSheetQuadrant,
  type AnimeSheetStatus,
  type Season2Episode,
  type Season2Part,
  type Season2ParticipationDevice,
  type ReleasePhaseItem,
  type TourProductBridge,
  EPISODE_STATUS_LABELS,
  EPISODE_STATUS_ORDER,
  ORIGIN_STATUS_LABELS,
  ORIGIN_STATUS_ORDER,
  VERSION_STATUS_LABELS,
  PURPOSE_LABELS,
  formatDateDot,
} from "./types";
import {
  validateChannelLength,
  canPublish,
  evaluateCreditUsage,
  calculateEpisodeCreditStats,
  canShortlist,
  canAdvanceOrigin,
  canAdvanceSeason2Episode,
  FANDOM_CHECK_META,
} from "./rules";
import {
  createInitialSeedState,
  loadStore,
  saveStore,
  COMPOSITE_ANIME_SHEET_URL,
  DEFAULT_MEMBER_ANIME_SHEETS,
} from "./seedData";
import {
  INITIAL_RELEASE_PHASES,
  INITIAL_SEASON2_DEVICES,
  INITIAL_SEASON2_EPISODES,
} from "./season2Seed";

type RouteView =
  | { page: "dashboard" }
  | { page: "members" }
  | { page: "origins" }
  | { page: "originDetail"; originNo: number }
  | { page: "episodes" }
  | { page: "episodeDetail"; episodeNo: number; channelCode?: string }
  | { page: "channelEdit"; episodeNo: number; channelCode: string }
  | { page: "season2" }
  | { page: "season2Detail"; code: Season2Episode["code"] }
  | { page: "credits" }
  | { page: "compliance" }
  | { page: "engagement" };

type BadgeVariant =
  | "default"
  | "teal"
  | "tealSolid"
  | "amber"
  | "red"
  | "emerald"
  | "muted";

function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "border-zinc-300 bg-zinc-100 text-zinc-700",
    teal: "border-[#1F5E63]/30 bg-[#1F5E63]/10 text-[#1F5E63]",
    tealSolid: "border-[#1F5E63] bg-[#1F5E63] text-white",
    amber: "border-amber-300 bg-amber-50 text-amber-800",
    red: "border-red-300 bg-red-50 text-red-700",
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-800",
    muted: "border-zinc-200 bg-zinc-50 text-zinc-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[11px] font-medium leading-tight rounded-[2px] select-none whitespace-nowrap ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

function EpisodeStatusBadge({ status }: { status: EpisodeStatus }) {
  const map: Record<EpisodeStatus, BadgeVariant> = {
    PLANNING: "default",
    SCRIPTED: "default",
    GENERATED: "teal",
    EDITED: "teal",
    REVIEWED: "amber",
    PUBLISHED: "tealSolid",
  };
  return <Badge variant={map[status]}>{EPISODE_STATUS_LABELS[status]}</Badge>;
}

function VersionStatusBadge({ status }: { status: VersionStatus }) {
  const map: Record<VersionStatus, BadgeVariant> = {
    TODO: "default",
    IN_PROGRESS: "amber",
    DONE: "tealSolid",
    BLOCKED: "red",
  };
  return <Badge variant={map[status]}>{VERSION_STATUS_LABELS[status]}</Badge>;
}

function OriginStatusBadge({ status }: { status: OriginStatus }) {
  const map: Record<OriginStatus, BadgeVariant> = {
    PLANNING: "default",
    SCRIPTED: "default",
    STORYBOARDED: "teal",
    ANIMATED: "teal",
    REVIEWED: "amber",
    PUBLISHED: "tealSolid",
  };
  return <Badge variant={map[status]}>{ORIGIN_STATUS_LABELS[status]}</Badge>;
}

const QUADRANT_BG_POSITION: Record<"TL" | "TR" | "BL" | "BR", string> = {
  TL: "0% 0%",
  TR: "100% 0%",
  BL: "0% 100%",
  BR: "100% 100%",
};

const QUADRANT_SHORT_LABELS: Record<"TL" | "TR" | "BL" | "BR", string> = {
  TL: "Ji-min (좌상단 0% 0%)",
  TR: "Eden (우상단 100% 0%)",
  BL: "Yu-hao (좌하단 0% 100%)",
  BR: "Aiman (우하단 100% 100%)",
};

function getMemberAnimeStatus(member: Member | undefined): AnimeSheetStatus {
  if (!member) return "NONE";
  if (member.animeSheetStatus) return member.animeSheetStatus;
  if (!member.animeSheetUrl) return "NONE";
  if (member.id === "M4") return "HOLD";
  return "READY";
}

function AnimeSheetStatusBadge({
  member,
  compact = false,
}: {
  member: Member | undefined;
  compact?: boolean;
}) {
  const st = getMemberAnimeStatus(member);
  if (st === "READY") {
    return (
      <Badge variant="emerald">
        <CheckCircle2 className="h-3 w-3 text-emerald-700" />
        {compact ? "제작완료 (READY)" : "제작완료 (READY / COMPLETED)"}
      </Badge>
    );
  }
  if (st === "HOLD") {
    return (
      <Badge variant="amber">
        <AlertTriangle className="h-3 w-3 text-amber-700" />
        {compact ? "파일럿 3/5 (보류)" : "파일럿 판정 3/5 (보류 · HOLD)"}
      </Badge>
    );
  }
  return <Badge variant="muted">애니 시트 미제작 (NONE)</Badge>;
}

function AnimeSheetQuadrantView({
  member,
  onClickZoom,
  className = "aspect-[4/3]",
  showOverlayBadge = true,
}: {
  member: Member;
  onClickZoom?: (e: React.MouseEvent) => void;
  className?: string;
  showOverlayBadge?: boolean;
}) {
  const status = getMemberAnimeStatus(member);
  const hasImage = Boolean(member.animeSheetUrl) && status !== "NONE";
  const quad = member.animeSheetQuadrant ?? null;

  if (!hasImage || !member.animeSheetUrl) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-zinc-100 text-center ${className}`}
      >
        <span className="px-2 text-[10px] font-medium text-zinc-400">
          애니 시트 미제작 (NONE)
        </span>
      </div>
    );
  }

  return (
    <div
      role={onClickZoom ? "button" : undefined}
      tabIndex={onClickZoom ? 0 : undefined}
      onClick={onClickZoom}
      onKeyDown={(e) => {
        if (onClickZoom && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClickZoom(e as unknown as React.MouseEvent);
        }
      }}
      className={`group/sheet relative w-full overflow-hidden bg-[#f5f3ef] ${
        onClickZoom ? "cursor-zoom-in" : ""
      } ${className}`}
      title="클릭하여 고해상도 애니 시트 확대 보기"
    >
      {quad ? (
        <div
          role="img"
          aria-label={`${member.nameKo} 애니메이션 캐릭터 시트 (${QUADRANT_SHORT_LABELS[quad]})`}
          className="h-full w-full transition-transform duration-200 group-hover/sheet:scale-[1.03]"
          style={{
            backgroundImage: `url("${member.animeSheetUrl}")`,
            backgroundSize: "200% 200%",
            backgroundPosition: QUADRANT_BG_POSITION[quad],
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : (
        <img
          src={member.animeSheetUrl}
          alt={`${member.nameKo} 애니메이션 캐릭터 시트`}
          className="h-full w-full object-contain transition-transform duration-200 group-hover/sheet:scale-[1.03]"
        />
      )}

      {showOverlayBadge && (
        <div className="pointer-events-none absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1">
          <span className=" truncate rounded-[2px] bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white">
            {quad ? `2x2 크롭 · ${QUADRANT_SHORT_LABELS[quad]}` : "단독 시트"}
          </span>
          {onClickZoom && (
            <span className="inline-flex items-center gap-0.5 rounded-[2px] bg-[#1F5E63]/90 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-90 group-hover/sheet:opacity-100">
              <ZoomIn className="h-2.5 w-2.5" />
              확대
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const CHANNEL_NARRATION_RULES: Record<
  string,
  { forbidden: string; required: string }
> = {
  JP: {
    forbidden: "감탄사(すごい！), 과장된 형용사, 설명하는 문장",
    required: "1인칭, 과거형 회상, 신체 감각(손·숨·목소리), 문장 사이 0.8~1.2초 여백",
  },
  US: {
    forbidden: "문어체, 긴 문장, 조용한 톤",
    required: '현재형, 감탄, 시청자에게 말 거는 호흡("watch this"), 하이햇 동기 컷 전환',
  },
  KR: {
    forbidden: "과장, 감성적 수사",
    required: "오늘의 표현 명시, 장소명, 다음 화 예고, 한 컷 5초 이상 유지",
  },
  CN: {
    forbidden: "일본어 대본 단순 번역",
    required: "감성적이되 짧은 문장, 화면 하단 자막 영역 확보 (1차 창작)",
  },
};

const WORKFLOW_STEP_TITLES: Record<string, string> = {
  script: "나레이션 대본",
  vo: "나레이션 보이스 (V.O.)",
  cut: "편집 호흡 (컷 수 · 총 길이)",
  bgm: "BGM 트랙 선택",
  subtitle: "자막 및 채널 버전 완료 확인",
  publish: "발행 (게이트 검증)",
};

export interface KSoulmateExportPayload {
  episodeNo: number;
  episodeTitle: string;
  place: string;
  expressions: string[];
  complianceRisk: boolean;
  channelCode: string;
  narration: string;
  memberName?: string;
  season?: 1 | 2;
  episodeCode?: string;
  tourProduct?: TourProductBridge;
}

export default function App({
  onExportToGtStudio,
}: {
  onExportToGtStudio?: (payload: KSoulmateExportPayload) => void;
} = {}) {
  const [store, setStore] = useState<ConsoleStoreState>(() => loadStore());
  const [route, setRoute] = useState<RouteView>({ page: "dashboard" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 멤버 상세 모달 상태
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);

  // 에피소드 및 오리진 상태 이동 에러 알림
  const [statusErrors, setStatusErrors] = useState<Record<number, string>>({});
  const [originStatusErrors, setOriginStatusErrors] = useState<
    Record<number, string>
  >({});
  const [season2StatusErrors, setSeason2StatusErrors] = useState<
    Record<string, string>
  >({});
  const [originChannelTab, setOriginChannelTab] = useState<string>("JP");
  const [season2PartFilter, setSeason2PartFilter] = useState<
    "ALL" | Season2Part
  >("ALL");
  const [season2ChannelTab, setSeason2ChannelTab] = useState<
    "JP" | "US" | "KR"
  >("JP");
  const [b1DissolvePct, setB1DissolvePct] = useState<number>(50);
  const [copiedHelpline, setCopiedHelpline] = useState<string | null>(null);
  const [animeLightbox, setAnimeLightbox] = useState<{
    memberId: string;
    viewMode: "QUADRANT" | "FULL_SHEET";
  } | null>(null);

  // 상태 변경 시 localStorage 영속화
  useEffect(() => {
    saveStore(store);
  }, [store]);

  const handleUpdateMemberAnimeSheet = (
    memberId: string,
    patch: Partial<
      Pick<
        Member,
        | "animeSheetUrl"
        | "animeSheetQuadrant"
        | "animeSheetStatus"
        | "animeSheetLabel"
      >
    >
  ) => {
    setStore((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, ...patch } : m
      ),
    }));
    setSelectedMember((prev) =>
      prev && prev.id === memberId ? { ...prev, ...patch } : prev
    );
  };

  const handleUploadMemberAnimeSheet = (
    memberId: string,
    file: File | undefined
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) return;
      handleUpdateMemberAnimeSheet(memberId, {
        animeSheetUrl: dataUrl,
        animeSheetQuadrant: null,
        animeSheetStatus: "READY",
        animeSheetLabel: `직접 업로드 (${file.name})`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetMemberAnimeSheet = (memberId: string) => {
    const def = DEFAULT_MEMBER_ANIME_SHEETS[memberId];
    if (!def) return;
    handleUpdateMemberAnimeSheet(memberId, {
      animeSheetUrl: def.animeSheetUrl,
      animeSheetQuadrant: def.animeSheetQuadrant,
      animeSheetStatus: def.animeSheetStatus,
      animeSheetLabel: def.animeSheetLabel,
    });
  };

  const handleExportEpisodeToGtStudio = (
    ep: Episode,
    preferredChannelCode?: string,
    overrideNarration?: string
  ) => {
    if (!onExportToGtStudio) return;
    const member = store.members.find((m) => m.id === ep.memberId);
    const fallbackChannel =
      member?.channelCode && member.channelCode !== "MY"
        ? member.channelCode
        : "JP";
    const targetChannel = preferredChannelCode || fallbackChannel;
    const ver =
      store.channelVersions.find(
        (v) => v.episodeId === ep.id && v.channelCode === targetChannel
      ) ??
      store.channelVersions.find(
        (v) => v.episodeId === ep.id && v.channelCode === "JP"
      );

    onExportToGtStudio({
      episodeNo: ep.no,
      episodeTitle: ep.title,
      place: ep.place,
      expressions: ep.expressions,
      complianceRisk: ep.complianceRisk,
      channelCode: targetChannel,
      narration:
        overrideNarration !== undefined
          ? overrideNarration
          : ver?.narration || "",
      memberName: member ? `${member.nameKo} (${member.id})` : "5인 전원",
    });
  };

  const handleExportOriginToGtStudio = (
    origin: Origin,
    preferredChannelCode?: string
  ) => {
    if (!onExportToGtStudio) return;
    const member = store.members.find((m) => m.id === origin.memberId);
    const targetChannel = preferredChannelCode || "JP";
    const sc =
      origin.channelScripts.find((s) => s.channelCode === targetChannel) ??
      origin.channelScripts[0];
    onExportToGtStudio({
      episodeNo: origin.episodeLink,
      episodeTitle: `[ORIGIN #${origin.no}] ${origin.title}`,
      place: origin.originCity,
      expressions: [origin.keyProp, origin.supportPoint, origin.choice],
      complianceRisk: origin.sensitive,
      channelCode: targetChannel,
      narration: sc?.narration || origin.choice,
      memberName: member
        ? `${member.nameKo} (${member.id})`
        : origin.memberId,
    });
  };

  const handleExportSeason2ToGtStudio = (
    ep: Season2Episode,
    tourProduct?: TourProductBridge,
    preferredChannelCode?: "JP" | "US" | "KR"
  ) => {
    if (!onExportToGtStudio) return;
    const targetChannel = preferredChannelCode || season2ChannelTab || "JP";
    const sc =
      ep.channelScripts.find((s) => s.channelCode === targetChannel) ??
      ep.channelScripts[0];
    const leadNames = ep.leadMemberIds
      .map((id) => store.members.find((m) => m.id === id)?.nameKo ?? id)
      .join("·");

    onExportToGtStudio({
      episodeNo: ep.no,
      episodeTitle: tourProduct
        ? `[시즌2 ${ep.code} · ${tourProduct.nameKo}] ${ep.title}`
        : `[시즌2 ${ep.code}] ${ep.title}`,
      place: tourProduct ? tourProduct.spots[0] : ep.place,
      expressions: ep.expressions,
      complianceRisk: tourProduct?.targetAxis === "K_BEAUTY",
      channelCode: targetChannel,
      narration: tourProduct
        ? `${tourProduct.summary} | 혜택: ${tourProduct.includedBenefits.join(" / ")} | ${sc?.narration ?? ep.logline}`
        : sc?.narration || ep.logline,
      memberName: leadNames || "5인 전원",
      season: 2,
      episodeCode: ep.code,
      tourProduct,
    });
  };

  const handleTransitionSeason2Status = (
    code: Season2Episode["code"],
    targetStatus: EpisodeStatus
  ): { ok: boolean; error?: string } => {
    const s2List = store.season2Episodes ?? INITIAL_SEASON2_EPISODES;
    const ep = s2List.find((e) => e.code === code);
    if (!ep) return { ok: false, error: "시즌 2 회차를 찾을 수 없습니다." };
    const b1Ep = s2List.find((e) => e.code === "B1");

    const gate = canAdvanceSeason2Episode({
      episode: ep,
      targetStatus,
      members: store.members,
      b1Episode: b1Ep,
    });

    if (!gate.ok) {
      const msg = gate.reason ?? "단계 이동 조건을 충족하지 못했습니다.";
      setSeason2StatusErrors((prev) => ({ ...prev, [code]: msg }));
      return { ok: false, error: msg };
    }

    setSeason2StatusErrors((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });

    setStore((prev) => ({
      ...prev,
      season2Episodes: (
        prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
      ).map((item) =>
        item.code === code ? { ...item, status: targetStatus } : item
      ),
    }));
    return { ok: true };
  };

  const handleResetSeed = () => {
    const seeded = createInitialSeedState();
    setStore(seeded);
    saveStore(seeded);
    setStatusErrors({});
    setOriginStatusErrors({});
    setSeason2StatusErrors({});
  };

  const handleTransitionOriginStatus = (
    originNo: number,
    targetStatus: OriginStatus
  ): { ok: boolean; error?: string } => {
    const origin = (store.origins ?? []).find((o) => o.no === originNo);
    if (!origin) return { ok: false, error: "오리진 편을 찾을 수 없습니다." };

    const member = store.members.find((m) => m.id === origin.memberId);
    const gate = canAdvanceOrigin({
      origin,
      targetStatus,
      member,
    });

    if (!gate.ok) {
      const msg =
        gate.reason ?? "단계 이동 조건을 충족하지 못했습니다.";
      setOriginStatusErrors((prev) => ({ ...prev, [originNo]: msg }));
      return { ok: false, error: msg };
    }

    setOriginStatusErrors((prev) => {
      const next = { ...prev };
      delete next[originNo];
      return next;
    });

    setStore((prev) => ({
      ...prev,
      origins: (prev.origins ?? []).map((o) =>
        o.no === originNo ? { ...o, status: targetStatus } : o
      ),
    }));
    return { ok: true };
  };

  const handleTransitionEpisodeStatus = (
    episodeNo: number,
    targetStatus: EpisodeStatus
  ): { ok: boolean; error?: string } => {
    const ep = store.episodes.find((e) => e.no === episodeNo);
    if (!ep) return { ok: false, error: "에피소드를 찾을 수 없습니다." };

    if (targetStatus === "PUBLISHED") {
      const gate = canPublish({
        episodeId: ep.id,
        complianceRisk: ep.complianceRisk,
        versions: store.channelVersions,
        checks: store.complianceChecks,
        items: store.complianceItems,
      });
      if (!gate.canPublish) {
        const msg =
          gate.reason ??
          "발행 조건(활성 3채널 완료 및 필수 컴플라이언스 검수)을 충족하지 못했습니다.";
        setStatusErrors((prev) => ({ ...prev, [episodeNo]: msg }));
        return { ok: false, error: msg };
      }
    }

    setStatusErrors((prev) => {
      const next = { ...prev };
      delete next[episodeNo];
      return next;
    });

    setStore((prev) => ({
      ...prev,
      episodes: prev.episodes.map((e) =>
        e.no === episodeNo ? { ...e, status: targetStatus } : e
      ),
    }));
    return { ok: true };
  };

  const handleCopyPrompt = async (member: Member, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${member.outfitSpec}\n${member.faceSpec}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedMemberId(member.id);
    setTimeout(() => {
      setCopiedMemberId((prev) => (prev === member.id ? null : prev));
    }, 2000);
  };

  const navItems = [
    {
      key: "dashboard" as const,
      label: "대시보드",
      subLabel: "오늘 할 일 · 요약",
      icon: LayoutDashboard,
    },
    {
      key: "members" as const,
      label: "캐릭터 락",
      subLabel: "5인 시트 · 프롬프트",
      icon: Users,
    },
    {
      key: "origins" as const,
      label: "오리진 5편",
      subLabel: "데뷔 전 서사 · 애니",
      icon: Sparkles,
    },
    {
      key: "episodes" as const,
      label: "시즌 1 (12화)",
      subLabel: "서울 적응 · 4채널",
      icon: Film,
    },
    {
      key: "season2" as const,
      label: "시즌 2 데뷔 서사 (10화)",
      subLabel: "PART A·B·C · 투어연동",
      icon: Award,
    },
    {
      key: "credits" as const,
      label: "크레딧",
      subLabel: "월 예산 · 채택률",
      icon: Coins,
    },
    {
      key: "compliance" as const,
      label: "컴플라이언스",
      subLabel: "일본 7항목 · 약기법",
      icon: ShieldAlert,
    },
    {
      key: "engagement" as const,
      label: "참여",
      subLabel: "게이지 · 팬덤명 · 미션",
      icon: HeartHandshake,
    },
  ];

  const isNavActive = (key: string) => {
    if (key === "origins") {
      return route.page === "origins" || route.page === "originDetail";
    }
    if (key === "episodes") {
      return (
        route.page === "episodes" ||
        route.page === "episodeDetail" ||
        route.page === "channelEdit"
      );
    }
    if (key === "season2") {
      return route.page === "season2" || route.page === "season2Detail";
    }
    return route.page === key;
  };

  // --- 서브 컴포넌트: 오리진 상태 컨트롤 (버튼/드롭다운 전용) ---
  const renderOriginStatusControl = (
    originNo: number,
    currentStatus: OriginStatus,
    compact = false
  ) => {
    const idx = ORIGIN_STATUS_ORDER.indexOf(currentStatus);
    const prevSt = idx > 0 ? ORIGIN_STATUS_ORDER[idx - 1] : null;
    const nextSt =
      idx < ORIGIN_STATUS_ORDER.length - 1
        ? ORIGIN_STATUS_ORDER[idx + 1]
        : null;
    const err = originStatusErrors[originNo];

    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={!prevSt}
            onClick={() =>
              prevSt && handleTransitionOriginStatus(originNo, prevSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            {!compact && <span>이전</span>}
          </button>

          <select
            aria-label={`오리진 #${originNo} 단계 선택`}
            value={currentStatus}
            onChange={(e) =>
              handleTransitionOriginStatus(
                originNo,
                e.target.value as OriginStatus
              )
            }
            className={`rounded-[3px] border px-2 py-1 text-[11px] font-semibold focus:border-[#1F5E63] focus:outline-none ${
              currentStatus === "PUBLISHED"
                ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                : currentStatus === "REVIEWED"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-zinc-300 bg-white text-zinc-800"
            }`}
          >
            {ORIGIN_STATUS_ORDER.map((st) => (
              <option
                key={st}
                value={st}
                className="bg-white text-zinc-900 font-normal"
              >
                {ORIGIN_STATUS_LABELS[st]} ({st})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!nextSt}
            onClick={() =>
              nextSt && handleTransitionOriginStatus(originNo, nextSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!compact && <span>다음</span>}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {err && (
          <div
            role="alert"
            className="flex items-start gap-1 rounded-[3px] border border-red-300 bg-red-50 px-2 py-1 text-[11px] text-red-800"
          >
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-600" />
            <span>{err}</span>
          </div>
        )}
      </div>
    );
  };

  // --- 서브 컴포넌트: 에피소드 상태 컨트롤 (버튼/드롭다운 전용) ---
  const renderEpisodeStatusControl = (
    episodeNo: number,
    currentStatus: EpisodeStatus,
    compact = false
  ) => {
    const idx = EPISODE_STATUS_ORDER.indexOf(currentStatus);
    const prevSt = idx > 0 ? EPISODE_STATUS_ORDER[idx - 1] : null;
    const nextSt =
      idx < EPISODE_STATUS_ORDER.length - 1
        ? EPISODE_STATUS_ORDER[idx + 1]
        : null;
    const err = statusErrors[episodeNo];

    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={!prevSt}
            onClick={() =>
              prevSt && handleTransitionEpisodeStatus(episodeNo, prevSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            {!compact && <span>이전</span>}
          </button>

          <select
            aria-label={`제${episodeNo}화 단계 선택`}
            value={currentStatus}
            onChange={(e) =>
              handleTransitionEpisodeStatus(
                episodeNo,
                e.target.value as EpisodeStatus
              )
            }
            className={`rounded-[3px] border px-2 py-1 text-[11px] font-semibold focus:border-[#1F5E63] focus:outline-none ${
              currentStatus === "PUBLISHED"
                ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                : currentStatus === "REVIEWED"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-zinc-300 bg-white text-zinc-800"
            }`}
          >
            {EPISODE_STATUS_ORDER.map((st) => (
              <option
                key={st}
                value={st}
                className="bg-white text-zinc-900 font-normal"
              >
                {EPISODE_STATUS_LABELS[st]} ({st})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!nextSt}
            onClick={() =>
              nextSt && handleTransitionEpisodeStatus(episodeNo, nextSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!compact && <span>다음</span>}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {err && (
          <div
            role="alert"
            className="flex items-start gap-1 rounded-[3px] border border-red-300 bg-red-50 px-2 py-1 text-[11px] text-red-800"
          >
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-600" />
            <span>{err}</span>
          </div>
        )}
      </div>
    );
  };

  // --- 화면 1: 대시보드 (/dashboard) ---
  const renderDashboard = () => {
    if (
      store.members.length === 0 &&
      store.episodes.length === 0 &&
      store.channels.length === 0
    ) {
      return (
        <div className="rounded-[8px] border border-zinc-200 bg-white p-6 text-xs text-zinc-600">
          아직 데이터가 없습니다. 상단 <code>시드 복원</code> 버튼을 눌러 데이터를 적재하세요.
        </div>
      );
    }

    const publishedCount = store.episodes.filter(
      (e) => e.status === "PUBLISHED"
    ).length;
    const creditUsage = evaluateCreditUsage(
      store.budget.creditUsed,
      store.budget.creditCap
    );

    const activeChannelCodes = new Set(
      store.channels.filter((c) => c.active).map((c) => c.code)
    );
    const inProgressEpIds = new Set(
      store.episodes
        .filter((e) =>
          ["SCRIPTED", "GENERATED", "EDITED", "REVIEWED"].includes(e.status)
        )
        .map((e) => e.id)
    );

    const incompleteVersions = store.channelVersions.filter(
      (v) =>
        activeChannelCodes.has(v.channelCode) &&
        inProgressEpIds.has(v.episodeId) &&
        v.status !== "DONE"
    );

    const beforePublishCodes = new Set(
      store.complianceItems
        .filter((i) => i.blockAt === "BEFORE_PUBLISH")
        .map((i) => i.code)
    );
    const blockedEpisodes = store.episodes.filter((ep) => {
      if (ep.status === "PUBLISHED" || !ep.complianceRisk) return false;
      const epChecks = store.complianceChecks.filter(
        (c) => c.episodeId === ep.id && beforePublishCodes.has(c.itemCode)
      );
      return epChecks.some((c) => !c.done);
    });

    const alertReasons: string[] = [];
    if (incompleteVersions.length > 0) {
      const list = incompleteVersions
        .map((v) => {
          const ep = store.episodes.find((e) => e.id === v.episodeId);
          return `${ep?.no}화(${v.channelCode})`;
        })
        .join(", ");
      alertReasons.push(
        `이번 주 발행 예정 회차 중 미완성 채널 버전이 ${incompleteVersions.length}건 있습니다: ${list}`
      );
    }
    if (creditUsage.alertLevel === "blocker") {
      alertReasons.push(
        `이번 달 크레딧 사용률이 ${creditUsage.usagePercent}% (${store.budget.creditUsed.toLocaleString()} / ${store.budget.creditCap.toLocaleString()})로 90% 위험 임계치를 넘었습니다.`
      );
    }
    if (blockedEpisodes.length > 0) {
      alertReasons.push(
        `공개 예정 회차 중 컴플라이언스(약기법 JP-04 등) 미완료로 발행 차단된 회차가 있습니다: ${blockedEpisodes
          .map((e) => `${e.no}화`)
          .join(", ")}`
      );
    }

    const recentRuns = [...store.runs]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return (
      <div className="space-y-4">
        {alertReasons.length > 0 && (
          <div
            role="alert"
            className="rounded-[8px] border border-red-300 bg-red-50 p-3.5 text-xs text-red-900"
          >
            <div className="flex items-center gap-2 font-bold text-red-800">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
              <span>운영 긴급 점검 필요 ({alertReasons.length}건)</span>
            </div>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-red-800">
              {alertReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {creditUsage.alertLevel === "warning" && (
          <div className="flex items-center gap-2 rounded-[8px] border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{creditUsage.alertMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">운영 대시보드</h1>
            <p className="text-xs text-zinc-500">
              오늘 처리할 채널 재조립 버전과 리소스 현황을 3초 안에 확인합니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-zinc-500">
              Members {store.members.length} · Episodes {store.episodes.length} ·
              Channels {store.channels.length} · Origins{" "}
              {(store.origins ?? []).length}
            </span>
            <button
              type="button"
              onClick={handleResetSeed}
              className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <RotateCcw className="h-3 w-3" />
              시드 초기화
            </button>
          </div>
        </div>

        {/* 4개 지표 카드 */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-[8px] border border-zinc-200 bg-white p-3.5">
            <div className="text-[11px] font-medium text-zinc-500">
              이번 주 발행 수
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-zinc-900">
                {publishedCount}본
              </span>
              <Badge variant="teal">누적 완료</Badge>
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              3채널(JP·US·KR) 동시 발행 기준
            </div>
          </div>

          <div className="rounded-[8px] border border-zinc-200 bg-white p-3.5">
            <div className="text-[11px] font-medium text-zinc-500">
              이번 주 목표
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-zinc-900">
                2본
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                25.3시간/주
              </span>
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              숏폼 15.7h + 참여 4.5h + 장편 5.1h
            </div>
          </div>

          <div className="rounded-[8px] border border-zinc-200 bg-white p-3.5">
            <div className="text-[11px] font-medium text-zinc-500">
              월 크레딧 사용률
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-zinc-900">
                {creditUsage.usagePercent}%
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {store.budget.creditUsed.toLocaleString()} /{" "}
                {store.budget.creditCap.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-[2px] bg-zinc-100">
              <div
                className={
                  creditUsage.alertLevel === "blocker"
                    ? "h-full bg-red-600"
                    : creditUsage.alertLevel === "warning"
                    ? "h-full bg-amber-500"
                    : "h-full bg-[#1F5E63]"
                }
                style={{ width: `${Math.min(100, creditUsage.usagePercent)}%` }}
              />
            </div>
          </div>

          <div className="rounded-[8px] border border-zinc-200 bg-white p-3.5">
            <div className="text-[11px] font-medium text-zinc-500">
              차단된 회차 수
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-red-700">
                {blockedEpisodes.length}화
              </span>
              <Badge variant={blockedEpisodes.length > 0 ? "amber" : "default"}>
                약기법 대상
              </Badge>
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              {blockedEpisodes.length > 0
                ? `검수 필요: ${blockedEpisodes.map((e) => `${e.no}화`).join(", ")}`
                : "차단된 위험 회차 없음"}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 이번 주 할 일 */}
          <section className="rounded-[8px] border border-zinc-200 bg-white lg:col-span-7">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">
                  이번 주 할 일 (미완성 채널 버전)
                </h2>
                <p className="text-[11px] text-zinc-500">
                  클릭 시 해당 회차·채널 재조립 편집 화면으로 이동합니다.
                </p>
              </div>
              <Badge variant="teal">{incompleteVersions.length}건</Badge>
            </div>

            {incompleteVersions.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                진행 중인 미완성 채널 버전이 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {incompleteVersions.map((ver) => {
                  const ep = store.episodes.find((e) => e.id === ver.episodeId)!;
                  const ch = store.channels.find(
                    (c) => c.code === ver.channelCode
                  )!;
                  return (
                    <div
                      key={ver.id}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs transition-colors hover:bg-zinc-50"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({
                            page: "channelEdit",
                            episodeNo: ep.no,
                            channelCode: ch.code,
                          })
                        }
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#1F5E63]">
                            제{ep.no}화
                          </span>
                          <span className="truncate font-medium text-zinc-900">
                            {ep.title}
                          </span>
                          {ep.complianceRisk && (
                            <Badge variant="amber">약기법</Badge>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                          <span className="font-mono font-semibold text-zinc-700">
                            [{ch.code}]
                          </span>
                          <span>{ch.label}</span>
                          <span>·</span>
                          <span>
                            규격 {ch.totalSec}초 / {ch.cutCount}컷
                          </span>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <EpisodeStatusBadge status={ep.status} />
                        <VersionStatusBadge status={ver.status} />
                        {onExportToGtStudio && (
                          <button
                            type="button"
                            onClick={() =>
                              handleExportEpisodeToGtStudio(
                                ep,
                                ch.code,
                                ver.narration
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63]/30 bg-[#1F5E63]/10 px-2 py-1 text-[10px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                            title="GT TOUR 크리에이티브 스튜디오로 테마·스팟·카피 내보내기"
                          >
                            <span>GT TOUR 스튜디오로 내보내기</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 최근 생성 기록 */}
          <section className="rounded-[8px] border border-zinc-200 bg-white lg:col-span-5">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">최근 생성 기록</h2>
                <p className="text-[11px] text-zinc-500">
                  최근 5건 (외부 생성 수동 기록)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoute({ page: "credits" })}
                className="text-[11px] font-medium text-[#1F5E63] hover:underline"
              >
                전체 보기
              </button>
            </div>
            <div className="divide-y divide-zinc-200">
              {recentRuns.map((run) => {
                const ep = store.episodes.find((e) => e.id === run.episodeId);
                return (
                  <div
                    key={run.id}
                    className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-zinc-800">
                          제{ep?.no ?? run.episodeId}화
                        </span>
                        <Badge variant="default">{run.model}</Badge>
                        <span className="text-[11px] text-zinc-500">
                          {PURPOSE_LABELS[run.purpose] ?? run.purpose}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-400">
                        시도 {run.attempts}회 · 채택 {run.accepted}컷 ·{" "}
                        {formatDateDot(run.createdAt)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right font-mono text-xs font-semibold text-zinc-900">
                      {run.credits.toLocaleString()} 크레딧
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 시즌 2 데뷔 서사 (10화) & VIII장 참여 설계 4대 장치 요약 */}
        {(() => {
          const s2List = store.season2Episodes ?? INITIAL_SEASON2_EPISODES;
          const devices = store.season2Devices ?? INITIAL_SEASON2_DEVICES;
          const phases = store.releasePhases ?? INITIAL_RELEASE_PHASES;
          const b1Ep = s2List.find((e) => e.code === "B1");
          const b1MatchedCount = (b1Ep?.identityChecks ?? []).filter(
            (c) => c.matched
          ).length;
          const b1Ready =
            b1MatchedCount === (b1Ep?.identityChecks?.length ?? 5) &&
            Boolean(b1Ep?.b1TransitionFrameSpec?.verified);

          return (
            <div className="space-y-4 pt-2">
              <section className="rounded-[8px] border border-[#1F5E63]/30 bg-white p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="tealSolid">시즌 2 통합 완료</Badge>
                      <h2 className="text-sm font-bold text-zinc-900">
                        시즌 2 데뷔 서사 (10화: PART A·B·C) & B1 전환 게이트 (AC-20)
                      </h2>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      PART A(A1~A3 애니) ➔ PART B(B1 「관객 서른 명」 애니➔실사 전환 ~ B4 첫 1위) ➔ PART C(C1~C3 실사 전국투어 & GT TOUR 3대 상품 직결)
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setRoute({ page: "season2Detail", code: "B1" })
                      }
                      className={`inline-flex items-center gap-1 rounded-[4px] border px-2.5 py-1 text-xs font-bold ${
                        b1Ready
                          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                          : "border-amber-400 bg-amber-50 text-amber-900"
                      }`}
                    >
                      <span>
                        B1 「관객 서른 명」 AC-20 일치 검수 ({b1MatchedCount}/5)
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoute({ page: "season2" })}
                      className="inline-flex items-center gap-1 rounded-[4px] bg-[#1F5E63] px-3 py-1 text-xs font-bold text-white hover:bg-[#17494d]"
                    >
                      <span>시즌 2 에피소드 보드 (10화) 열기</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* VIII장 참여 설계 4대 장치 미니 카드 */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {devices.map((dev) => {
                    const pct = Math.min(
                      100,
                      Math.round((dev.currentCount / dev.targetCount) * 100)
                    );
                    return (
                      <div
                        key={dev.code}
                        className="flex flex-col justify-between rounded-[6px] border border-zinc-200 bg-zinc-50/70 p-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                              {dev.episodeCode} 장치
                            </span>
                            <Badge
                              variant={
                                dev.status === "UNLOCKED" || pct >= 100
                                  ? "tealSolid"
                                  : "amber"
                              }
                            >
                              {pct}% ({dev.currentCount.toLocaleString()}
                              {dev.unit})
                            </Badge>
                          </div>
                          <div className="mt-1.5 font-bold text-zinc-900">
                            {dev.title}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500">
                            {dev.rewardRule}
                          </p>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-zinc-200/80 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              setRoute({
                                page: "season2Detail",
                                code: dev.episodeCode,
                              })
                            }
                            className="font-mono text-[11px] font-semibold text-[#1F5E63] hover:underline"
                          >
                            {dev.episodeCode} 상세 →
                          </button>
                          <button
                            type="button"
                            onClick={() => setRoute({ page: "engagement" })}
                            className="text-[11px] text-zinc-600 hover:underline"
                          >
                            참여 탭에서 관리
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* IX장 공개 페이즈 매핑 테이블 (Phase 0 ~ Phase 4) */}
              <section className="rounded-[8px] border border-zinc-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3">
                  <div>
                    <h2 className="text-xs font-bold text-zinc-900">
                      IX. 전체 공개 페이즈 매핑 테이블 (Phase 0 ~ Phase 4)
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                      오리진 5편(Phase 0) ➔ 시즌 1 12화(Phase 1) ➔ 시즌 2 PART A·B·C 10화 및 GT TOUR 3대 투어 상품 런칭(Phase 2~4) 로드맵
                    </p>
                  </div>
                  <Badge variant="teal">전 과정 연동 완료</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                        <th className="px-3 py-2.5 w-24">페이즈</th>
                        <th className="px-3 py-2.5">핵심 타이틀 & 기간</th>
                        <th className="px-3 py-2.5">콘텐츠 범위 & 비주얼 형식</th>
                        <th className="px-3 py-2.5">참여 장치 & 핵심 목표</th>
                        <th className="px-3 py-2.5">GT TOUR 수익 상품 매핑</th>
                        <th className="px-3 py-2.5 w-28 text-right">상태 / 이동</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {phases.map((ph) => (
                        <tr key={ph.id} className="hover:bg-zinc-50">
                          <td className="px-3 py-2.5 font-mono font-bold text-[#1F5E63]">
                            {ph.phase}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-bold text-zinc-900">
                              {ph.title}
                            </div>
                            <div className="font-mono text-[11px] text-zinc-500">
                              {ph.period}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-medium text-zinc-800">
                              {ph.contentScope}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {ph.visualFormat}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-[#1F5E63]">
                              {ph.participationHook}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {ph.coreGoal}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-[11px] font-medium text-zinc-800">
                            {ph.gtTourProduct}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <Badge
                                variant={
                                  ph.status === "DONE"
                                    ? "emerald"
                                    : ph.status === "ACTIVE"
                                    ? "tealSolid"
                                    : "amber"
                                }
                              >
                                {ph.status}
                              </Badge>
                              <button
                                type="button"
                                onClick={() =>
                                  setRoute({ page: ph.linkedRoutePage })
                                }
                                className="text-[11px] font-semibold text-[#1F5E63] hover:underline"
                              >
                                보드 열기 →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          );
        })()}
      </div>
    );
  };

  // --- 화면 2: 캐릭터 락 (/members) ---
  const renderMembers = () => {
    const orderedMembers = [...store.members].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    const readyAnimeCount = orderedMembers.filter(
      (m) => getMemberAnimeStatus(m) === "READY"
    ).length;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              캐릭터 락 레지스트리 (5인 · 실사 & 2x2 애니 시트)
            </h1>
            <p className="text-xs text-zinc-500">
              5인의 아이덴티티 고정 시트(M1~M5 고정 순서) 및 2x2 그리드 애니메이션 설정 시트(사분면 자동 크롭)를 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="tealSolid">
              실사 시트 {orderedMembers.filter((m) => m.locked).length}/5 확정
            </Badge>
            <Badge variant="emerald">
              애니 시트 {readyAnimeCount}/5 제작완료 (READY)
            </Badge>
            <button
              type="button"
              onClick={() =>
                setAnimeLightbox({ memberId: "M1", viewMode: "FULL_SHEET" })
              }
              className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
            >
              <Grid className="h-3 w-3" />
              <span>4인 합본 2x2 애니 시트 원본 보기</span>
            </button>
          </div>
        </div>

        {/* 2x2 그리드 캐릭터 매핑 안내 배너 */}
        <section className="rounded-[8px] border border-emerald-200 bg-emerald-50/50 p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">2x2 그리드 정밀 매핑 완료</Badge>
              <span className="font-semibold text-zinc-900">
                애니 시트 (B1~B6 작화 기준) 사분면(Quadrant) 할당 현황
              </span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500">
              클릭 시 고해상도 확대 · 개별 시트 업로드 · AC-20 상태 전환 지원
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: "M1", name: "한지후", quad: "좌측 상단 (Ji-min · 0% 0%)" },
              { id: "M2", name: "이든 박", quad: "우측 상단 (Eden · 100% 0%)" },
              { id: "M3", name: "린위하오", quad: "좌측 하단 (Yu-hao · 0% 100%)" },
              { id: "M5", name: "아이만", quad: "우측 하단 (Aiman · 100% 100%)" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setAnimeLightbox({
                    memberId: item.id,
                    viewMode: "QUADRANT",
                  })
                }
                className="flex items-center justify-between rounded-[4px] border border-emerald-200 bg-white px-2.5 py-1.5 text-left hover:border-[#1F5E63]"
              >
                <div>
                  <div className="font-bold text-zinc-900">
                    {item.id} {item.name}
                  </div>
                  <div className="font-mono text-[10px] text-emerald-700">
                    {item.quad}
                  </div>
                </div>
                <ZoomIn className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {orderedMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`group flex flex-col overflow-hidden rounded-[8px] bg-white text-left transition-colors hover:border-[#1F5E63] cursor-pointer ${
                member.locked
                  ? "border border-zinc-200"
                  : "border-2 border-dashed border-amber-400"
              }`}
            >
              <div className="grid grid-cols-2 border-b border-zinc-200 bg-zinc-100">
                <div className="relative aspect-[4/3] w-full overflow-hidden border-r border-zinc-200">
                  <img
                    src={member.photoSheetUrl}
                    alt={`${member.nameKo} 실사 캐릭터 시트`}
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="absolute left-2 top-2 flex items-center gap-1">
                    <span className="rounded-[2px] bg-zinc-900/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                      {member.id} 실사
                    </span>
                    {member.channelCode && (
                      <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                        {member.channelCode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <AnimeSheetQuadrantView
                    member={member}
                    className="h-full w-full"
                    onClickZoom={(e) => {
                      e.stopPropagation();
                      setAnimeLightbox({
                        memberId: member.id,
                        viewMode: "QUADRANT",
                      });
                    }}
                  />
                  <div className="pointer-events-none absolute right-2 top-2">
                    {member.locked ? (
                      <Badge variant="tealSolid">
                        <Lock className="h-3 w-3" /> 락 확정
                      </Badge>
                    ) : (
                      <Badge variant="amber">
                        <Unlock className="h-3 w-3" /> 락 미확정
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-3.5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="text-sm font-bold text-zinc-900">
                        {member.nameKo}
                      </h2>
                      <span className="text-[11px] text-zinc-400">
                        {member.nameJa} · {member.nameZh}
                      </span>
                    </div>
                    <AnimeSheetStatusBadge member={member} compact />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-600">
                    <span>{member.nationality}</span>
                    <span className="text-zinc-300">|</span>
                    <span className="font-medium text-zinc-800">
                      {member.position}
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span className="font-mono">
                      {member.age}세 · {member.heightCm}cm
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-1 font-mono text-[11px] text-zinc-500">
                    의상: {member.outfitSpec}
                  </p>
                </div>

                <div
                  className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-2.5 text-[11px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500">
                      시트 상태:
                    </span>
                    <select
                      value={getMemberAnimeStatus(member)}
                      onChange={(e) => {
                        const nextSt = e.target.value as AnimeSheetStatus;
                        const def = DEFAULT_MEMBER_ANIME_SHEETS[member.id];
                        handleUpdateMemberAnimeSheet(member.id, {
                          animeSheetStatus: nextSt,
                          animeSheetUrl:
                            nextSt === "NONE"
                              ? null
                              : member.animeSheetUrl ??
                                def?.animeSheetUrl ??
                                COMPOSITE_ANIME_SHEET_URL,
                        });
                      }}
                      className="rounded-[3px] border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800"
                    >
                      <option value="READY">제작완료 (READY)</option>
                      <option value="HOLD">3/5 보류 (HOLD)</option>
                      <option value="NONE">미제작 (NONE)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="font-semibold text-[#1F5E63] hover:underline"
                  >
                    상세 · 시트 설정 열기 →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 화면 3: 에피소드 보드 (/episodes) ---
  const renderEpisodes = () => {
    const channelOrder = ["JP", "US", "KR", "CN"];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              에피소드 보드 (시즌1 · 12화)
            </h1>
            <p className="text-xs text-zinc-500">
              12화의 제작 단계(버튼/드롭다운 이동), 담당 멤버, 오늘의 한국어 3표현 및 4채널 진행 현황을 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-[1px] bg-[#1F5E63]" />{" "}
              완료
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-[1px] bg-amber-500" />{" "}
              진행중
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-[1px] bg-zinc-200 border border-zinc-300" />{" "}
              대기/Phase2
            </span>
          </div>
        </div>

        {/* 데스크톱 테이블 */}
        <div className="hidden md:block overflow-x-auto rounded-[8px] border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                <th className="px-3 py-2.5 w-14">화</th>
                <th className="px-3 py-2.5">제목</th>
                <th className="px-3 py-2.5">장소</th>
                <th className="px-3 py-2.5 w-24">담당</th>
                <th className="px-3 py-2.5">오늘의 표현 (3개)</th>
                <th className="px-3 py-2.5 w-56">상태 이동 (버튼/드롭다운)</th>
                <th className="px-3 py-2.5 w-44">채널 진행 (4개 점)</th>
                <th className="px-3 py-2.5 w-44 text-right">스튜디오 브릿지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {store.episodes.map((ep) => {
                const member = store.members.find((m) => m.id === ep.memberId);
                return (
                  <tr
                    key={ep.id}
                    className={`transition-colors hover:bg-zinc-100/70 ${
                      ep.complianceRisk ? "bg-amber-50/70" : "bg-white"
                    }`}
                  >
                    <td className="px-3 py-2.5 font-mono font-bold text-zinc-900">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: "episodeDetail", episodeNo: ep.no })
                        }
                        className="hover:text-[#1F5E63] hover:underline"
                      >
                        제{ep.no}화
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: "episodeDetail", episodeNo: ep.no })
                        }
                        className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 hover:text-[#1F5E63] hover:underline text-left"
                      >
                        <span>{ep.title}</span>
                        {ep.complianceRisk && (
                          <Badge variant="amber">약기법</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-600">{ep.place}</td>
                    <td className="px-3 py-2.5">
                      {member ? (
                        <span className="font-medium text-zinc-800">
                          {member.nameKo}{" "}
                          <span className="font-mono text-[10px] text-zinc-400">
                            ({member.id})
                          </span>
                        </span>
                      ) : (
                        <span className="text-zinc-500">5인 전원</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {ep.expressions.map((expr, i) => (
                          <span
                            key={i}
                            className="rounded-[2px] border border-zinc-200 bg-white/80 px-1.5 py-0.5 text-[11px] text-zinc-700"
                          >
                            {expr}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {renderEpisodeStatusControl(ep.no, ep.status)}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {channelOrder.map((code) => {
                          const ver = store.channelVersions.find(
                            (v) =>
                              v.episodeId === ep.id && v.channelCode === code
                          );
                          const ch = store.channels.find(
                            (c) => c.code === code
                          );
                          const active = ch?.active ?? code !== "CN";
                          const st = ver?.status ?? "TODO";
                          const dotClass = !active
                            ? "bg-zinc-200 border-zinc-300"
                            : st === "DONE"
                            ? "bg-[#1F5E63] border-[#1F5E63]"
                            : st === "IN_PROGRESS"
                            ? "bg-amber-500 border-amber-600"
                            : st === "BLOCKED"
                            ? "bg-red-500 border-red-600"
                            : "bg-zinc-200 border-zinc-300";

                          return (
                            <button
                              key={code}
                              type="button"
                              disabled={!active}
                              onClick={() =>
                                setRoute({
                                  page: "channelEdit",
                                  episodeNo: ep.no,
                                  channelCode: code,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-[2px] px-1 py-0.5 text-[10px] font-mono text-zinc-700 hover:bg-zinc-200/70 disabled:cursor-not-allowed disabled:text-zinc-400"
                            >
                              <span
                                className={`inline-block h-2 w-2 rounded-[1px] border ${dotClass}`}
                              />
                              <span>{code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {onExportToGtStudio && (
                        <button
                          type="button"
                          onClick={() => handleExportEpisodeToGtStudio(ep)}
                          className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-1 text-[11px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                        >
                          <span>GT TOUR 스튜디오로 내보내기</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 리스트 (375px 대응) */}
        <div className="md:hidden space-y-2.5">
          {store.episodes.map((ep) => {
            const member = store.members.find((m) => m.id === ep.memberId);
            return (
              <div
                key={ep.id}
                className={`rounded-[8px] border p-3.5 ${
                  ep.complianceRisk
                    ? "border-amber-300 bg-amber-50/70"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRoute({ page: "episodeDetail", episodeNo: ep.no })
                    }
                    className="flex items-center gap-1.5"
                  >
                    <span className="font-mono text-xs font-bold text-[#1F5E63]">
                      제{ep.no}화
                    </span>
                    {ep.complianceRisk && <Badge variant="amber">약기법</Badge>}
                  </button>
                  {renderEpisodeStatusControl(ep.no, ep.status, true)}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRoute({ page: "episodeDetail", episodeNo: ep.no })
                  }
                  className="mt-1.5 block text-left"
                >
                  <h2 className="text-sm font-bold text-zinc-900 hover:text-[#1F5E63] hover:underline">
                    {ep.title}
                  </h2>
                  <div className="mt-0.5 text-xs text-zinc-600">
                    {ep.place} ·{" "}
                    {member ? `${member.nameKo} (${member.id})` : "5인 전원"}
                  </div>
                </button>
                <div className="mt-2 flex flex-wrap gap-1">
                  {ep.expressions.map((expr, i) => (
                    <span
                      key={i}
                      className="rounded-[2px] border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] text-zinc-700"
                    >
                      {expr}
                    </span>
                  ))}
                </div>
                {onExportToGtStudio && (
                  <div className="mt-2.5 border-t border-zinc-200/80 pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleExportEpisodeToGtStudio(ep)}
                      className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-1 text-[11px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                    >
                      <span>GT TOUR 스튜디오로 내보내기</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 공통 서브 컴포넌트: 채널 버전 편집기 (4.5) ---
  const ChannelEditorBlock = ({
    episodeNo,
    channelCode,
    showDedicatedButton = false,
  }: {
    episodeNo: number;
    channelCode: string;
    showDedicatedButton?: boolean;
  }) => {
    const episode = store.episodes.find((e) => e.no === episodeNo)!;
    const channel = store.channels.find((c) => c.code === channelCode)!;
    const version = store.channelVersions.find(
      (v) => v.episodeId === episode.id && v.channelCode === channel.code
    )!;
    const narrator =
      store.members.find((m) => m.id === channel.narratorId) ?? null;
    const episodeMember =
      store.members.find((m) => m.id === episode.memberId) ?? null;

    const [narration, setNarration] = useState(version.narration);
    const [voStatus, setVoStatus] = useState<VersionStatus>(version.voStatus);
    const [bgmTrackId, setBgmTrackId] = useState(
      version.bgmTrackId ?? channel.bgmTracks[0] ?? ""
    );
    const [cutCountInput, setCutCountInput] = useState(
      String(version.cutCount ?? channel.cutCount)
    );
    const [totalSecInput, setTotalSecInput] = useState(
      String(version.totalSec ?? channel.totalSec)
    );
    const [status, setStatus] = useState<VersionStatus>(version.status);
    const [publishedUrl, setPublishedUrl] = useState(
      version.publishedUrl ?? ""
    );
    const [isDirty, setIsDirty] = useState(false);
    const [toast, setToast] = useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      setNarration(version.narration);
      setVoStatus(version.voStatus);
      setBgmTrackId(version.bgmTrackId ?? channel.bgmTracks[0] ?? "");
      setCutCountInput(String(version.cutCount ?? channel.cutCount));
      setTotalSecInput(String(version.totalSec ?? channel.totalSec));
      setStatus(version.status);
      setPublishedUrl(version.publishedUrl ?? "");
      setIsDirty(false);
      setToast(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeNo, channelCode]);

    const parsedCutCount =
      cutCountInput.trim() === "" ? null : Number(cutCountInput);
    const parsedTotalSec =
      totalSecInput.trim() === "" ? null : Number(totalSecInput);

    const lengthValidation = validateChannelLength({
      cutCount: parsedCutCount,
      totalSec: parsedTotalSec,
      targetCutCount: channel.cutCount,
      targetTotalSec: channel.totalSec,
      targetAvgCutSec: channel.avgCutSec,
    });

    const publishGate = canPublish({
      episodeId: episode.id,
      complianceRisk: episode.complianceRisk,
      versions: store.channelVersions,
      checks: store.complianceChecks,
      items: store.complianceItems,
    });

    const commitSave = () => {
      setStore((prev) => ({
        ...prev,
        channelVersions: prev.channelVersions.map((v) =>
          v.episodeId === episode.id && v.channelCode === channel.code
            ? {
                ...v,
                narration,
                voStatus,
                bgmTrackId: bgmTrackId || null,
                cutCount: parsedCutCount ? Math.round(parsedCutCount) : null,
                totalSec: parsedTotalSec ? Math.round(parsedTotalSec) : null,
                status,
                publishedUrl: publishedUrl.trim() || null,
              }
            : v
        ),
      }));
      setIsDirty(false);
      setToast({ type: "success", text: "저장했습니다" });
    };

    // 5초 디바운스 자동 저장
    useEffect(() => {
      if (!isDirty) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        commitSave();
      }, 5000);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      isDirty,
      narration,
      voStatus,
      bgmTrackId,
      cutCountInput,
      totalSecInput,
      status,
      publishedUrl,
    ]);

    const handlePublish = () => {
      if (lengthValidation.hasWarning) {
        setToast({
          type: "error",
          text: `발행할 수 없습니다. ${lengthValidation.warnings.join(" ")}`,
        });
        return;
      }
      if (!publishGate.canPublish) {
        setToast({
          type: "error",
          text: publishGate.reason ?? "발행 게이트 조건을 만족하지 못했습니다.",
        });
        return;
      }
      if (!publishedUrl.trim()) {
        setToast({
          type: "error",
          text: "발행 게시물 URL을 입력해 주세요.",
        });
        return;
      }

      setStore((prev) => ({
        ...prev,
        channelVersions: prev.channelVersions.map((v) =>
          v.episodeId === episode.id && v.channelCode === channel.code
            ? {
                ...v,
                narration,
                voStatus,
                bgmTrackId: bgmTrackId || null,
                cutCount: parsedCutCount ? Math.round(parsedCutCount) : null,
                totalSec: parsedTotalSec ? Math.round(parsedTotalSec) : null,
                status: "DONE",
                publishedUrl: publishedUrl.trim(),
                publishedAt: new Date().toISOString(),
              }
            : v
        ),
        episodes: prev.episodes.map((e) =>
          e.id === episode.id ? { ...e, status: "PUBLISHED" } : e
        ),
      }));
      setIsDirty(false);
      setToast({
        type: "success",
        text: `제${episode.no}화 ${channel.code} 채널 발행을 완료했습니다.`,
      });
    };

    const ruleGuide = CHANNEL_NARRATION_RULES[channel.code] ?? {
      forbidden: "번역투 문장 금지",
      required: "채널 고유 호흡 준수",
    };
    const hasSeparateScriptStep = channel.workflowOrder.includes("script");

    const fixedMembers: Member[] = [];
    if (episodeMember) fixedMembers.push(episodeMember);
    if (narrator && (!episodeMember || narrator.id !== episodeMember.id)) {
      fixedMembers.push(narrator);
    }

    const renderScriptBlock = () => (
      <div className="space-y-2.5">
        <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 p-2.5 text-xs space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="font-semibold text-zinc-800">
              화법 규칙: {channel.tone}
            </span>
            <Badge variant="teal">독립 재창작 (번역 금지)</Badge>
          </div>
          <div className="text-[11px] text-red-700">
            <strong>금지:</strong> {ruleGuide.forbidden}
          </div>
          <div className="text-[11px] text-[#1F5E63]">
            <strong>필수:</strong> {ruleGuide.required}
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500">
            <span>{channel.code} 채널 나레이션 대본 (입력 시 5초 뒤 자동 저장)</span>
            <span className="font-mono">{narration.length}자</span>
          </div>
          <textarea
            rows={6}
            value={narration}
            onChange={(e) => {
              setNarration(e.target.value);
              setIsDirty(true);
            }}
            placeholder={`${channel.code} 채널 화법(${channel.tone})에 맞춘 나레이션 대본을 작성하세요...`}
            className="w-full rounded-[4px] border border-zinc-300 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-900 focus:border-[#1F5E63] focus:outline-none"
          />
        </div>
      </div>
    );

    const renderStep = (step: string, index: number) => {
      const stepNo = String(index + 1).padStart(2, "0");
      const stepTitle = WORKFLOW_STEP_TITLES[step] ?? step;

      switch (step) {
        case "script":
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">script</span>
              </div>
              {renderScriptBlock()}
            </div>
          );

        case "vo":
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                <span className="font-mono text-[11px] text-zinc-400">vo</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600">
                    V.O. 제작 상태
                  </label>
                  <select
                    value={voStatus}
                    onChange={(e) => {
                      setVoStatus(e.target.value as VersionStatus);
                      setIsDirty(true);
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900"
                  >
                    {(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as VersionStatus[]).map(
                      (st) => (
                        <option key={st} value={st}>
                          {VERSION_STATUS_LABELS[st]} ({st})
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-zinc-500">
                    보이스 프로필 (읽기 전용 · 고정)
                  </span>
                  <div className="mt-1 flex items-center justify-between rounded-[4px] border border-zinc-200 bg-zinc-100 px-2.5 py-1.5 font-mono text-xs text-zinc-600">
                    <span>
                      {narrator
                        ? `${narrator.nameKo} (${narrator.voiceProfile ?? "미지정"})`
                        : channel.narratorId}
                    </span>
                    <Badge variant="default">고정</Badge>
                  </div>
                </div>
              </div>

              {!hasSeparateScriptStep && (
                <div className="border-t border-zinc-100 pt-2.5">
                  {renderScriptBlock()}
                </div>
              )}
            </div>
          );

        case "cut":
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">
                  규격: {channel.totalSec}초 / {channel.cutCount}컷 / 평균{" "}
                  {channel.avgCutSec}초 (±0.3초)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600">
                    컷 수 (기준 {channel.cutCount}컷)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={cutCountInput}
                    onChange={(e) => {
                      setCutCountInput(e.target.value);
                      setIsDirty(true);
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600">
                    총 길이 초 (기준 {channel.totalSec}초)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1200}
                    value={totalSecInput}
                    onChange={(e) => {
                      setTotalSecInput(e.target.value);
                      setIsDirty(true);
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-zinc-500">
                    계산된 평균 컷 (읽기 전용 · 실시간)
                  </span>
                  <div
                    className={`mt-1 flex items-center justify-between rounded-[4px] border px-2.5 py-1.5 font-mono text-xs font-bold ${
                      lengthValidation.hasWarning
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-zinc-200 bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    <span>
                      {lengthValidation.avgCutSec !== null
                        ? `${lengthValidation.avgCutSec}초`
                        : "-"}
                    </span>
                    <span className="text-[10px] font-normal text-zinc-500">
                      목표 {channel.avgCutSec}초
                    </span>
                  </div>
                </div>
              </div>

              {lengthValidation.hasWarning && (
                <div className="flex items-start gap-2 rounded-[4px] border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <div>
                    <div className="font-semibold">
                      편집 호흡 규격 이탈 경고 (저장은 가능하나 발행은 차단됩니다)
                    </div>
                    <ul className="mt-0.5 list-disc pl-4 text-[11px] text-amber-800">
                      {lengthValidation.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );

        case "bgm":
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                <span className="text-[11px] text-zinc-400">
                  미리듣기 미지원 (Phase 1)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600">
                    라이브러리 트랙 (3종 중 선택)
                  </label>
                  <select
                    value={bgmTrackId}
                    onChange={(e) => {
                      setBgmTrackId(e.target.value);
                      setIsDirty(true);
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                  >
                    {channel.bgmTracks.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600">
                  리듬 기준: <strong>{channel.rhythmBasis}</strong>
                </div>
              </div>
            </div>
          );

        case "subtitle":
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                <VersionStatusBadge status={status} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-center text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={status === "DONE"}
                    onChange={(e) => {
                      setStatus(e.target.checked ? "DONE" : "IN_PROGRESS");
                      setIsDirty(true);
                    }}
                    className="h-4 w-4 accent-[#1F5E63]"
                  />
                  <span className="font-medium text-zinc-800">
                    자막 검수 및 싱크 배치 완료 (체크 시 DONE 전환)
                  </span>
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600">
                    채널 버전 전체 상태
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as VersionStatus);
                      setIsDirty(true);
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as VersionStatus[]).map(
                      (st) => (
                        <option key={st} value={st}>
                          {VERSION_STATUS_LABELS[st]} ({st})
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
          );

        case "publish": {
          const isPublishBlocked =
            !publishGate.canPublish || lengthValidation.hasWarning;
          return (
            <div
              key={step}
              className="rounded-[6px] border border-zinc-200 bg-white p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    STEP {stepNo}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{stepTitle}</h3>
                </div>
                {version.publishedAt && (
                  <span className="font-mono text-[11px] text-[#1F5E63]">
                    발행일: {formatDateDot(version.publishedAt)}
                  </span>
                )}
              </div>

              {!publishGate.canPublish && (
                <div className="flex items-start gap-2 rounded-[4px] border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <div>
                    <div className="font-bold">{publishGate.reason}</div>
                    <p className="mt-0.5 text-[11px] text-red-700">
                      활성 3개 채널(JP·US·KR) 모두 DONE 상태이고 발행 전 필수 컴플라이언스 검수가 완료되어야 발행 버튼이 활성화됩니다.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-zinc-600">
                    발행 게시물 URL (수동 입력)
                  </label>
                  <input
                    type="url"
                    value={publishedUrl}
                    onChange={(e) => {
                      setPublishedUrl(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder={`https://social.k-soulmate.internal/${channel.code.toLowerCase()}/ep-${String(
                      episode.no
                    ).padStart(2, "0")}`}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <button
                  type="button"
                  disabled={isPublishBlocked || !publishedUrl.trim()}
                  onClick={handlePublish}
                  className="inline-flex items-center justify-center rounded-[4px] bg-[#1F5E63] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#17494d] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                >
                  발행 확정
                </button>
              </div>
            </div>
          );
        }

        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-zinc-200 bg-zinc-50 px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-xs font-bold text-white">
              {channel.code}
            </span>
            <span className="text-xs font-bold text-zinc-900">
              {channel.label}
            </span>
            <span className="text-[11px] text-zinc-500">
              · 작업 순서:{" "}
              <strong className="font-mono text-[#1F5E63]">
                {channel.workflowOrder.join(" → ")}
              </strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onExportToGtStudio && (
              <button
                type="button"
                onClick={() =>
                  handleExportEpisodeToGtStudio(
                    episode,
                    channel.code,
                    narration
                  )
                }
                className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-1 text-[11px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
              >
                <span>GT TOUR 스튜디오로 내보내기</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
            {showDedicatedButton && (
              <button
                type="button"
                onClick={() =>
                  setRoute({
                    page: "channelEdit",
                    episodeNo: episode.no,
                    channelCode: channel.code,
                  })
                }
                className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <span>전용 편집 화면</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={commitSave}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1 text-xs font-semibold text-white hover:bg-[#17494d]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>저장</span>
            </button>
          </div>
        </div>

        {toast && (
          <div
            className={`flex items-center justify-between rounded-[4px] border px-3 py-2 text-xs font-medium ${
              toast.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-red-300 bg-red-50 text-red-900"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {toast.text}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-[11px] underline"
            >
              닫기
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            {channel.workflowOrder.map((step, i) => renderStep(step, i))}
          </div>

          <aside className="lg:col-span-4 space-y-3">
            <div className="rounded-[6px] border border-zinc-200 bg-zinc-100/80 p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-700">
                    고정 — 채널과 무관하게 동일
                  </span>
                </div>
                <Badge variant="default">편집 불가</Badge>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-semibold text-zinc-500">
                  베이스 영상 마스터 (130초 헤드룸)
                </div>
                <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px] text-zinc-600 break-all">
                  {episode.baseVideoUrl ?? "베이스 마스터 미등록 (생성 대기)"}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-zinc-500">
                  오늘의 한국어 3표현 (대사 원음 고정)
                </div>
                <div className="space-y-1">
                  {episode.expressions.map((expr, i) => (
                    <div
                      key={i}
                      className="rounded-[4px] border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700"
                    >
                      <span className="mr-1.5 font-mono text-[10px] text-zinc-400">
                        0{i + 1}
                      </span>
                      「{expr}」
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-zinc-500">
                  참여 캐릭터 시트 (회차 담당 · 채널 내레이터)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fixedMembers.map((m) => (
                    <div
                      key={m.id}
                      className="overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-50"
                    >
                      <div className="aspect-[4/3] w-full bg-zinc-200 overflow-hidden">
                        <img
                          src={m.photoSheetUrl}
                          alt={m.nameKo}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="p-1.5 text-[11px]">
                        <div className="font-bold text-zinc-800">
                          {m.nameKo}{" "}
                          <span className="font-mono text-[10px] text-zinc-500">
                            ({m.id})
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {episodeMember?.id === m.id && narrator?.id === m.id
                            ? "주인공 · 내레이터"
                            : episodeMember?.id === m.id
                            ? "회차 주인공"
                            : `${channel.code} 내레이터`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-[11px] text-zinc-500">
                장소 고정:{" "}
                <strong className="text-zinc-700">{episode.place}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  // --- 화면 4: 에피소드 상세 (/episodes/[no]) ---
  const renderEpisodeDetail = (episodeNo: number, initialChannel = "JP") => {
    const episode = store.episodes.find((e) => e.no === episodeNo);
    if (!episode) return null;

    const member = store.members.find((m) => m.id === episode.memberId);
    const activeTabCode =
      initialChannel && initialChannel !== "CN" ? initialChannel : "JP";

    const publishGate = canPublish({
      episodeId: episode.id,
      complianceRisk: episode.complianceRisk,
      versions: store.channelVersions,
      checks: store.complianceChecks,
      items: store.complianceItems,
    });

    const epRuns = store.runs.filter((r) => r.episodeId === episode.id);
    const totalRunCredits = epRuns.reduce((acc, r) => acc + r.credits, 0);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setRoute({ page: "episodes" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-[#1F5E63]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            에피소드 보드(12화)로 돌아가기
          </button>

          {publishGate.canPublish ? (
            <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>발행 가능 (3채널 완료 · 필수 검수 통과)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-900">
              <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
              <span>{publishGate.reason}</span>
            </div>
          )}
        </div>

        <header
          className={`rounded-[8px] border p-4 ${
            episode.complianceRisk
              ? "border-amber-300 bg-amber-50/60"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
                  제{episode.no}화
                </span>
                <h1 className="text-base font-bold text-zinc-900">
                  {episode.title}
                </h1>
                {episode.complianceRisk && (
                  <Badge variant="amber">약기법 필수 검수 회차</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                <span>장소: {episode.place}</span>
                <span className="text-zinc-300">|</span>
                <span>
                  담당 멤버:{" "}
                  <strong className="font-semibold text-zinc-800">
                    {member
                      ? `${member.nameKo} (${member.id} · ${member.position})`
                      : "5인 전원 합류"}
                  </strong>
                </span>
                {(store.origins ?? [])
                  .filter((o) => o.episodeLink === episode.no)
                  .map((linkedOrigin) => {
                    const om = store.members.find(
                      (m) => m.id === linkedOrigin.memberId
                    );
                    return (
                      <button
                        key={linkedOrigin.id}
                        type="button"
                        onClick={() =>
                          setRoute({
                            page: "originDetail",
                            originNo: linkedOrigin.no,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-[3px] border border-[#1F5E63]/40 bg-[#1F5E63]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1F5E63] hover:bg-[#1F5E63]/20"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>
                          오리진 보기: #{linkedOrigin.no} {linkedOrigin.title} (
                          {om?.nameKo ?? linkedOrigin.memberId})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {onExportToGtStudio && (
                  <button
                    type="button"
                    onClick={() =>
                      handleExportEpisodeToGtStudio(episode, activeTabCode)
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1 text-xs font-bold text-white hover:bg-[#17494d] shadow-xs"
                  >
                    <span>GT TOUR 스튜디오로 내보내기</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[11px] text-zinc-500">
                단계 이동 (버튼 / 드롭다운)
              </span>
              {renderEpisodeStatusControl(episode.no, episode.status)}
            </div>
          </div>
        </header>

        {/* 오늘의 표현 3개 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              <h2 className="text-xs font-bold text-zinc-900">
                오늘의 한국어 3표현
              </h2>
            </div>
            <Badge variant="default">고정 — 4채널 공통 원음</Badge>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {episode.expressions.map((expr, i) => (
              <div
                key={i}
                className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3"
              >
                <div className="font-mono text-[10px] font-semibold text-zinc-400">
                  표현 0{i + 1}
                </div>
                <div className="mt-1 text-xs font-semibold text-zinc-800">
                  「{expr}」
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4개 채널 탭 + 편집기 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="flex flex-wrap border-b border-zinc-200 bg-zinc-50 px-2 pt-2 gap-1">
            {store.channels.map((ch) => {
              const ver = store.channelVersions.find(
                (v) => v.episodeId === episode.id && v.channelCode === ch.code
              );
              const isDisabled = !ch.active || ch.code === "CN";
              const isSelected = activeTabCode === ch.code && !isDisabled;

              return (
                <button
                  key={ch.code}
                  type="button"
                  disabled={isDisabled}
                  onClick={() =>
                    !isDisabled &&
                    setRoute({
                      page: "episodeDetail",
                      episodeNo: episode.no,
                      channelCode: ch.code,
                    })
                  }
                  className={`inline-flex items-center gap-2 rounded-t-[4px] border-x border-t px-3.5 py-2 text-xs font-semibold transition-colors ${
                    isDisabled
                      ? "cursor-not-allowed border-transparent bg-zinc-100 text-zinc-400"
                      : isSelected
                      ? "-mb-px border-zinc-200 bg-white text-[#1F5E63]"
                      : "border-transparent bg-transparent text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span className="font-mono font-bold">{ch.code}</span>
                  <span className="hidden sm:inline text-[11px] font-normal">
                    {ch.label}
                  </span>
                  {isDisabled ? (
                    <Badge variant="muted">Phase 2</Badge>
                  ) : (
                    ver && <VersionStatusBadge status={ver.status} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="p-4">
            <ChannelEditorBlock
              episodeNo={episode.no}
              channelCode={activeTabCode}
              showDedicatedButton
            />
          </div>
        </section>

        {/* 하단 2열: 생성 기록 표 + 컴플라이언스 체크리스트 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="rounded-[8px] border border-zinc-200 bg-white lg:col-span-6">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">생성 기록</h2>
                <p className="text-[11px] text-zinc-500">
                  제{episode.no}화 외부 영상 생성 로그
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#1F5E63]">
                합계 {totalRunCredits.toLocaleString()} 크레딧
              </span>
            </div>
            {epRuns.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                아직 기록된 생성 로그가 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                      <th className="px-3 py-2">모델</th>
                      <th className="px-3 py-2">목적</th>
                      <th className="px-3 py-2 text-right">시도</th>
                      <th className="px-3 py-2 text-right">채택</th>
                      <th className="px-3 py-2 text-right">크레딧</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {epRuns.map((run) => (
                      <tr key={run.id}>
                        <td className="px-3 py-2 font-mono font-medium">
                          {run.model}
                        </td>
                        <td className="px-3 py-2 text-zinc-600">
                          {PURPOSE_LABELS[run.purpose] ?? run.purpose}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {run.attempts}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {run.accepted}
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-semibold">
                          {run.credits.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-[8px] border border-zinc-200 bg-white lg:col-span-6">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">
                  컴플라이언스 체크리스트 요약
                </h2>
                <p className="text-[11px] text-zinc-500">
                  일본 시장 7개 법규 검수 상태
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoute({ page: "compliance" })}
                className="text-[11px] font-medium text-[#1F5E63] hover:underline"
              >
                매트릭스에서 편집 →
              </button>
            </div>
            <div className="divide-y divide-zinc-200">
              {store.complianceItems.map((item) => {
                const chk = store.complianceChecks.find(
                  (c) => c.episodeId === episode.id && c.itemCode === item.code
                );
                const done = chk?.done ?? false;
                const isMandatoryYakgi =
                  item.code === "JP-04" && episode.complianceRisk;
                const isGreyYakgi =
                  item.code === "JP-04" && !episode.complianceRisk;

                return (
                  <div
                    key={item.code}
                    className={`flex items-center justify-between gap-2 px-4 py-2 text-xs ${
                      isMandatoryYakgi && !done
                        ? "bg-amber-50/70"
                        : isGreyYakgi
                        ? "bg-zinc-50 text-zinc-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {done ? (
                        <CheckSquare className="h-3.5 w-3.5 shrink-0 text-[#1F5E63]" />
                      ) : (
                        <Square className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      )}
                      <span className="font-mono text-[11px] font-semibold">
                        {item.code}
                      </span>
                      <span className="truncate font-medium">{item.label}</span>
                      {isMandatoryYakgi && (
                        <Badge variant="amber">약기법 필수</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isGreyYakgi ? (
                        <Badge variant="muted">일반 회차 (비대상)</Badge>
                      ) : (
                        <>
                          <Badge
                            variant={
                              item.blockAt === "BEFORE_PUBLISH"
                                ? "red"
                                : "default"
                            }
                          >
                            {item.blockAt === "BEFORE_PUBLISH"
                              ? "발행 전 필수"
                              : "런칭 시"}
                          </Badge>
                          <Badge variant={done ? "tealSolid" : "default"}>
                            {done ? "완료" : "미완료"}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  // --- 화면 5: 채널 전용 편집 (/episodes/[no]/channels/[code]) ---
  const renderChannelEditPage = (episodeNo: number, channelCode: string) => {
    const episode = store.episodes.find((e) => e.no === episodeNo);
    const channel = store.channels.find((c) => c.code === channelCode);
    if (!episode || !channel) return null;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              setRoute({
                page: "episodeDetail",
                episodeNo: episode.no,
                channelCode: channel.code,
              })
            }
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-[#1F5E63]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            제{episode.no}화 상세로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <EpisodeStatusBadge status={episode.status} />
            {episode.complianceRisk && <Badge variant="amber">약기법</Badge>}
          </div>
        </div>

        <div className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
                제{episode.no}화 · {channel.code}
              </span>
              <h1 className="text-base font-bold text-zinc-900">
                {episode.title} — {channel.label} 버전 편집
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 px-2 pt-2">
            {store.channels.map((ch) => {
              const ver = store.channelVersions.find(
                (v) => v.episodeId === episode.id && v.channelCode === ch.code
              );
              const isDisabled = !ch.active || ch.code === "CN";
              const isCurrent = ch.code === channel.code;

              if (isDisabled) {
                return (
                  <span
                    key={ch.code}
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-t-[4px] px-3.5 py-2 text-xs font-semibold text-zinc-400"
                  >
                    <span className="font-mono font-bold">{ch.code}</span>
                    <Badge variant="muted">Phase 2</Badge>
                  </span>
                );
              }

              return (
                <button
                  key={ch.code}
                  type="button"
                  onClick={() =>
                    setRoute({
                      page: "channelEdit",
                      episodeNo: episode.no,
                      channelCode: ch.code,
                    })
                  }
                  className={`inline-flex items-center gap-2 rounded-t-[4px] border-x border-t px-3.5 py-2 text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "-mb-px border-zinc-200 bg-white text-[#1F5E63]"
                      : "border-transparent text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span className="font-mono font-bold">{ch.code}</span>
                  <span className="hidden sm:inline text-[11px] font-normal">
                    {ch.label}
                  </span>
                  {ver && <VersionStatusBadge status={ver.status} />}
                </button>
              );
            })}
          </div>

          <div className="p-4">
            <ChannelEditorBlock
              episodeNo={episode.no}
              channelCode={channel.code}
            />
          </div>
        </div>
      </div>
    );
  };

  // --- 화면 6: 크레딧·예산 (/credits) ---
  const CreditsView = () => {
    const [creditInput, setCreditInput] = useState(
      String(store.budget.creditUsed)
    );
    const [epNo, setEpNo] = useState(3);
    const [model, setModel] = useState("seedance-2.0");
    const [purpose, setPurpose] = useState("retry");
    const [attempts, setAttempts] = useState("4");
    const [accepted, setAccepted] = useState("3");
    const [credits, setCredits] = useState("120");
    const [msg, setMsg] = useState<string | null>(null);

    const usage = evaluateCreditUsage(
      store.budget.creditUsed,
      store.budget.creditCap
    );
    const epStats = store.episodes.map((ep) =>
      calculateEpisodeCreditStats(ep, store.runs, 0.75)
    );
    const totalLogged = epStats.reduce((a, b) => a + b.totalCredits, 0);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              크레딧 · 예산 관리
            </h1>
            <p className="text-xs text-zinc-500">
              크레딧은 다음 달로 이월되지 않습니다. 월 단위 상한과 회차별 채택률(기준 75%)을 점검합니다.
            </p>
          </div>
          <Badge variant="amber">월 단위 리셋 · 이월 불가</Badge>
        </div>

        {usage.alertLevel !== "normal" && usage.alertMessage && (
          <div
            className={`flex items-start gap-2 rounded-[6px] border px-4 py-3 text-xs ${
              usage.alertLevel === "blocker"
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-bold">
                {usage.alertLevel === "blocker"
                  ? "크레딧 90% 초과 위험 경보"
                  : "크레딧 80% 도달 주의"}
              </div>
              <p className="mt-0.5">{usage.alertMessage}</p>
            </div>
          </div>
        )}

        {msg && (
          <div className="flex items-center justify-between rounded-[4px] border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900">
            <span>{msg}</span>
            <button
              type="button"
              onClick={() => setMsg(null)}
              className="text-[11px] underline"
            >
              닫기
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">
                이번 달 크레딧 게이지 ({store.budget.month})
              </span>
              <Badge
                variant={
                  usage.alertLevel === "blocker"
                    ? "red"
                    : usage.alertLevel === "warning"
                    ? "amber"
                    : "teal"
                }
              >
                {usage.usagePercent}% 사용
              </Badge>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xl font-bold text-zinc-900">
                {usage.creditUsed.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-500">
                / {usage.creditCap.toLocaleString()} 크레딧 (잔여{" "}
                {usage.remainingCredits.toLocaleString()})
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-[2px] bg-zinc-100">
              <div
                className={`h-full transition-all ${
                  usage.alertLevel === "blocker"
                    ? "bg-red-600"
                    : usage.alertLevel === "warning"
                    ? "bg-amber-500"
                    : "bg-[#1F5E63]"
                }`}
                style={{ width: `${Math.min(100, usage.usagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>0%</span>
              <span className="text-amber-600">80% 경고 (7,520)</span>
              <span className="text-red-600">90% 차단 (8,460)</span>
            </div>
          </section>

          <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">
                현재 요금제 구성
              </span>
              <Badge variant="tealSolid">
                {store.budget.plan.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Higgsfield 플랜</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ULTRA (승인 상한 9,400 크레딧)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Claude Team Standard</span>
                <span className="font-mono font-semibold text-zinc-900">
                  {store.budget.claudeSeats}석 ($20 × 2)
                </span>
              </div>
              <div className="flex justify-between">
                <span>월 계획 생성량</span>
                <span className="font-mono text-zinc-800">
                  약 416회 (숏폼4·참여4·장편1)
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">
                월 예산 요약
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                가정 환율 1,400원/$
              </span>
            </div>
            <div className="space-y-1 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>크레딧 비용 + Claude 비용</span>
                <span className="font-mono text-zinc-900">$310 + $40</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-1.5">
                <span className="font-semibold text-zinc-800">월 합계</span>
                <span className="font-mono text-sm font-bold text-[#1F5E63]">
                  $350 (약 49만 원)
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>연간 환산</span>
                <span className="font-mono">$4,200</span>
              </div>
            </div>
          </section>
        </div>

        {/* 수동 입력 + 생성 로그 추가 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                이번 달 크레딧 사용량 수동 동기화
              </h2>
              <p className="text-[11px] text-zinc-500">
                외부 대시보드에서 확인한 누적 크레딧 사용량을 수동 입력합니다.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[11px] font-medium text-zinc-600">
                  누적 사용 크레딧
                </label>
                <input
                  type="number"
                  min={0}
                  value={creditInput}
                  onChange={(e) => setCreditInput(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const val = Math.max(0, Math.round(Number(creditInput) || 0));
                  setStore((prev) => ({
                    ...prev,
                    budget: { ...prev.budget, creditUsed: val },
                  }));
                  setMsg(`이번 달 크레딧 사용량을 ${val.toLocaleString()}으로 업데이트했습니다.`);
                }}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#17494d]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>사용량 저장</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "60% 기본 (5,640)", val: 5640 },
                { label: "80% 경고 (7,520)", val: 7520 },
                { label: "90% 위험 (8,460)", val: 8460 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => {
                    setCreditInput(String(preset.val));
                    setStore((prev) => ({
                      ...prev,
                      budget: { ...prev.budget, creditUsed: preset.val },
                    }));
                    setMsg(`${preset.label} 상태로 즉시 변경했습니다.`);
                  }}
                  className="rounded-[3px] border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-700 hover:bg-zinc-100"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                회차별 생성 로그 기록 (크레딧 자동 합산)
              </h2>
              <p className="text-[11px] text-zinc-500">
                기록 시 해당 회차 생성 내역과 월 누적 크레딧에 동시에 반영됩니다.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-600">회차</label>
                <select
                  value={epNo}
                  onChange={(e) => setEpNo(Number(e.target.value))}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-xs"
                >
                  {store.episodes.map((e) => (
                    <option key={e.no} value={e.no}>
                      제{e.no}화
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-600">모델</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 font-mono text-xs"
                >
                  <option value="seedance-2.0">seedance-2.0</option>
                  <option value="seedance-2.5">seedance-2.5</option>
                  <option value="fast">fast</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-600">목적</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-xs"
                >
                  <option value="base">base</option>
                  <option value="collection">collection</option>
                  <option value="retry">retry</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-600">시도</label>
                <input
                  type="number"
                  min={1}
                  value={attempts}
                  onChange={(e) => setAttempts(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-600">채택</label>
                <input
                  type="number"
                  min={0}
                  value={accepted}
                  onChange={(e) => setAccepted(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-600">크레딧</label>
                <input
                  type="number"
                  min={1}
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2 py-1 font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const ep = store.episodes.find((e) => e.no === epNo)!;
                  const cVal = Math.max(1, Number(credits) || 0);
                  setStore((prev) => ({
                    ...prev,
                    runs: [
                      ...prev.runs,
                      {
                        id: Date.now(),
                        episodeId: ep.id,
                        model,
                        purpose,
                        attempts: Math.max(1, Number(attempts) || 1),
                        accepted: Math.max(0, Number(accepted) || 0),
                        credits: cVal,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                    budget: {
                      ...prev.budget,
                      creditUsed: prev.budget.creditUsed + cVal,
                    },
                  }));
                  setCreditInput(String(store.budget.creditUsed + cVal));
                  setMsg(`제${epNo}화 생성 기록(${cVal} 크레딧)을 추가했습니다.`);
                }}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#17494d]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>생성 로그 기록 및 차감</span>
              </button>
            </div>
          </div>
        </div>

        {/* 회차별 소모 표 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                회차별 생성 소모 및 채택률 표
              </h2>
              <p className="text-[11px] text-zinc-500">
                채택률이 기준값 75% 미만인 회차는 재생성 위험으로 강조됩니다.
              </p>
            </div>
            <div className="font-mono text-xs font-semibold text-zinc-700">
              회차 로그 합계: {totalLogged.toLocaleString()} 크레딧
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                  <th className="px-3.5 py-2.5 w-16">회차</th>
                  <th className="px-3.5 py-2.5">제목</th>
                  <th className="px-3.5 py-2.5 text-right">생성 횟수 (시도/채택)</th>
                  <th className="px-3.5 py-2.5 text-right">채택률 (기준 75%)</th>
                  <th className="px-3.5 py-2.5 text-right">소모 크레딧</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {epStats.map((st) => (
                  <tr
                    key={st.episodeId}
                    className={
                      st.isLowAdoption ? "bg-amber-50/80" : "bg-white"
                    }
                  >
                    <td className="px-3.5 py-2.5 font-mono font-bold">
                      제{st.episodeNo}화
                    </td>
                    <td className="px-3.5 py-2.5 font-medium">
                      <div className="flex items-center gap-2">
                        <span>{st.episodeTitle}</span>
                        {st.isLowAdoption && (
                          <Badge variant="amber">재생성 위험 (&lt;75%)</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono">
                      {st.totalAttempts > 0
                        ? `${st.totalAttempts}회 (${st.totalAccepted}컷 채택)`
                        : "-"}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono">
                      {st.adoptionPercent !== null ? (
                        <span
                          className={`font-semibold ${
                            st.isLowAdoption
                              ? "text-amber-800"
                              : "text-[#1F5E63]"
                          }`}
                        >
                          {st.adoptionPercent}%
                        </span>
                      ) : (
                        <span className="text-zinc-400">미실행</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-semibold">
                      {st.totalCredits > 0
                        ? `${st.totalCredits.toLocaleString()} 크레딧`
                        : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  // --- 화면 7: 컴플라이언스 (/compliance) ---
  const renderCompliance = () => {
    const beforePublishCodes = new Set(
      store.complianceItems
        .filter((i) => i.blockAt === "BEFORE_PUBLISH")
        .map((i) => i.code)
    );
    const riskBlocked = store.episodes.filter((ep) => {
      if (!ep.complianceRisk) return false;
      const epChecks = store.complianceChecks.filter(
        (c) => c.episodeId === ep.id && beforePublishCodes.has(c.itemCode)
      );
      return epChecks.some((c) => !c.done);
    });

    const toggleCheck = (episodeId: number, itemCode: string, done: boolean) => {
      setStore((prev) => ({
        ...prev,
        complianceChecks: prev.complianceChecks.map((c) =>
          c.episodeId === episodeId && c.itemCode === itemCode
            ? { ...c, done }
            : c
        ),
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              컴플라이언스 게이트 (일본 시장 7항목 × 12화)
            </h1>
            <p className="text-xs text-zinc-500">
              특정상거래법·경품표시법·개인정보보호법·약기법(JP-01~04) 미완료 시 해당 회차의 발행이 차단됩니다.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="amber">3·6·7화 약기법 필수</Badge>
            <Badge variant="red">발행 전 차단 4항목</Badge>
          </div>
        </div>

        {riskBlocked.length > 0 ? (
          <div className="flex items-center gap-2 rounded-[6px] border border-red-300 bg-red-50 px-4 py-3 text-xs font-bold text-red-900">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
            <span>
              발행 차단 중인 회차 (약기법 필수 대상):{" "}
              {riskBlocked.map((e) => `${e.no}화`).join(", ")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[6px] border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>3·6·7화 약기법 필수 회차의 발행 전 검수가 모두 완료되었습니다.</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-[8px] border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                <th className="px-3 py-2.5 w-64">법규 항목 (7종)</th>
                <th className="px-2 py-2.5 w-20 text-center">차단 시점</th>
                <th className="px-2 py-2.5 w-16 text-center">담당</th>
                {store.episodes.map((ep) => (
                  <th
                    key={ep.id}
                    className={`px-1.5 py-2.5 text-center font-mono ${
                      ep.complianceRisk
                        ? "bg-amber-100/70 text-amber-900 font-bold"
                        : "text-zinc-700"
                    }`}
                  >
                    <div>{ep.no}화</div>
                    {ep.complianceRisk && (
                      <div className="text-[9px] font-sans text-amber-800">
                        약기법
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {store.complianceItems.map((item) => {
                const isYakgiRow = item.code === "JP-04";
                return (
                  <tr key={item.code} className="hover:bg-zinc-50/70">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-[#1F5E63]">
                          {item.code}
                        </span>
                        <span className="font-semibold text-zinc-900">
                          {item.label}
                        </span>
                        {isYakgiRow && (
                          <Badge variant="amber">3·6·7화 필수</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-2">
                        {item.detail}
                      </p>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <Badge
                        variant={
                          item.blockAt === "BEFORE_PUBLISH" ? "red" : "default"
                        }
                      >
                        {item.blockAt === "BEFORE_PUBLISH"
                          ? "발행 전"
                          : "런칭 시"}
                      </Badge>
                    </td>
                    <td className="px-2 py-2.5 text-center text-[11px] text-zinc-600">
                      {item.ownerRole || "미지정"}
                    </td>
                    {store.episodes.map((ep) => {
                      const chk = store.complianceChecks.find(
                        (c) =>
                          c.episodeId === ep.id && c.itemCode === item.code
                      );
                      const done = chk?.done ?? false;
                      const isMandatory = isYakgiRow && ep.complianceRisk;
                      const isGrey = isYakgiRow && !ep.complianceRisk;

                      return (
                        <td
                          key={ep.id}
                          className={`px-1.5 py-2.5 text-center align-middle ${
                            isMandatory
                              ? done
                                ? "bg-emerald-50/70"
                                : "bg-amber-100/80"
                              : isGrey
                              ? "bg-zinc-100 text-zinc-300"
                              : ""
                          }`}
                        >
                          {isGrey ? (
                            <span className="font-mono text-[10px] text-zinc-400">
                              -
                            </span>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <input
                                type="checkbox"
                                checked={done}
                                onChange={(e) =>
                                  toggleCheck(ep.id, item.code, e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer accent-[#1F5E63]"
                              />
                              {isMandatory && (
                                <span
                                  className={`text-[9px] font-bold ${
                                    done ? "text-[#1F5E63]" : "text-red-700"
                                  }`}
                                >
                                  필수
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- 화면 8: 참여 관리 (/engagement) ---
  const renderEngagement = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              참여 관리 (응원 게이지 · 팬덤명 후보 · 미션 회수)
            </h1>
            <p className="text-xs text-zinc-500">
              팬 참여형 콘텐츠(편당 4.5시간)의 해금 게이지와 팬덤명 5대 검수 게이트를 운영합니다.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="teal">
              SHORTLIST{" "}
              {
                store.fandomCandidates.filter((c) => c.status === "SHORTLIST")
                  .length
              }
              건
            </Badge>
            <Badge variant="default">
              채택 미션{" "}
              {store.missions.filter((m) => m.status === "ADOPTED").length}건
            </Badge>
          </div>
        </div>

        {/* 1. 응원 게이지 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                1. 응원 게이지 (해금 트래커)
              </h2>
              <p className="text-[11px] text-zinc-500">
                임계값 달성 시 해금됨 상태로 전환됩니다. (기본 시드: 하루토 얼굴 공개 50%)
              </p>
            </div>
            <Badge variant="default">실시간 연동</Badge>
          </div>

          {store.gauges.map((g) => {
            const isUnlocked = g.unlocked || g.current >= g.threshold;
            return (
              <div
                key={g.id}
                className={`rounded-[6px] border p-3.5 space-y-2.5 ${
                  isUnlocked
                    ? "border-[#1F5E63] bg-[#1F5E63]/5"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <Unlock className="h-4 w-4 text-[#1F5E63]" />
                    ) : (
                      <Lock className="h-4 w-4 text-zinc-400" />
                    )}
                    <span className="text-sm font-bold text-zinc-900">
                      {g.label}
                    </span>
                    {isUnlocked ? (
                      <Badge variant="tealSolid">해금됨</Badge>
                    ) : (
                      <Badge variant="default">잠김 (목표 {g.threshold}%)</Badge>
                    )}
                  </div>
                  <div className="font-mono text-xs font-bold text-zinc-900">
                    현재 {g.current}% / 임계값 {g.threshold}%
                  </div>
                </div>

                <div className="relative h-3 w-full overflow-hidden rounded-[2px] bg-zinc-200">
                  <div
                    className={`h-full transition-all ${
                      isUnlocked ? "bg-[#1F5E63]" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, g.current)}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-0.5 bg-red-600"
                    style={{ left: `${Math.min(100, g.threshold)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[0, 25, 49, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() =>
                        setStore((prev) => ({
                          ...prev,
                          gauges: prev.gauges.map((item) =>
                            item.id === g.id
                              ? {
                                  ...item,
                                  current: pct,
                                  unlocked: pct >= item.threshold,
                                }
                              : item
                          ),
                        }))
                      }
                      className={`rounded-[3px] border px-2 py-1 font-mono text-[11px] font-medium ${
                        g.current === pct
                          ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {pct}%{pct === g.threshold ? " (해금 기준)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* 2. 팬덤명 후보 검수 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                2. 팬덤명 후보 검수 (5대 조건 게이트)
              </h2>
              <p className="text-[11px] text-zinc-500">
                상표·중복·부적절어·발음·3음절 이내 5개 검사를 모두 통과해야만 SHORTLIST로 올릴 수 있습니다.
              </p>
            </div>
            <Badge variant="default">그룹명은 미확정 (B-1 준수)</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                  <th className="px-3.5 py-2.5 w-24">후보명</th>
                  <th className="px-3.5 py-2.5">제안 이유</th>
                  <th className="px-3.5 py-2.5 w-16 text-right">득표</th>
                  <th className="px-3.5 py-2.5">
                    5개 검사 통과 여부 (클릭 시 전환)
                  </th>
                  <th className="px-3.5 py-2.5 w-28">현재 상태</th>
                  <th className="px-3.5 py-2.5 w-44 text-right">단계 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {store.fandomCandidates.map((cand) => {
                  const eligible = canShortlist(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-zinc-50">
                      <td className="px-3.5 py-2.5 font-bold text-zinc-900">
                        {cand.name}
                      </td>
                      <td className="px-3.5 py-2.5 text-zinc-600">
                        {cand.reason}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-semibold">
                        {cand.votes}표
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {FANDOM_CHECK_META.map((meta) => {
                            const passed = cand[meta.key];
                            return (
                              <button
                                key={meta.key}
                                type="button"
                                title={meta.tooltip}
                                onClick={() =>
                                  setStore((prev) => ({
                                    ...prev,
                                    fandomCandidates: prev.fandomCandidates.map(
                                      (item) => {
                                        if (item.id !== cand.id) return item;
                                        const next = {
                                          ...item,
                                          [meta.key]: !passed,
                                        };
                                        if (
                                          !canShortlist(next) &&
                                          next.status !== "CANDIDATE"
                                        ) {
                                          next.status = "CANDIDATE";
                                        }
                                        return next;
                                      }
                                    ),
                                  }))
                                }
                                className={`inline-flex items-center gap-1 rounded-[2px] border px-1.5 py-0.5 text-[11px] font-medium ${
                                  passed
                                    ? "border-[#1F5E63]/40 bg-[#1F5E63]/10 text-[#1F5E63]"
                                    : "border-red-300 bg-red-50 text-red-700"
                                }`}
                              >
                                {passed ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                                <span>{meta.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {!cand.checkChant && (
                          <div className="mt-1 text-[10px] text-red-600">
                            ※ 3음절 이내로 끊어 부를 수 있어야 합니다
                          </div>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <Badge
                          variant={
                            cand.status === "SHORTLIST" ? "tealSolid" : "default"
                          }
                        >
                          {cand.status}
                        </Badge>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={!eligible || cand.status === "SHORTLIST"}
                            title={
                              eligible
                                ? "SHORTLIST로 승격"
                                : "3음절 이내로 끊어 부를 수 있어야 합니다"
                            }
                            onClick={() =>
                              setStore((prev) => ({
                                ...prev,
                                fandomCandidates: prev.fandomCandidates.map(
                                  (item) =>
                                    item.id === cand.id && canShortlist(item)
                                      ? { ...item, status: "SHORTLIST" }
                                      : item
                                ),
                              }))
                            }
                            className="rounded-[3px] border border-[#1F5E63] bg-[#1F5E63] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#17494d] disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-400"
                          >
                            SHORTLIST
                          </button>
                          {cand.status !== "CANDIDATE" && (
                            <button
                              type="button"
                              onClick={() =>
                                setStore((prev) => ({
                                  ...prev,
                                  fandomCandidates: prev.fandomCandidates.map(
                                    (item) =>
                                      item.id === cand.id
                                        ? { ...item, status: "CANDIDATE" }
                                        : item
                                  ),
                                }))
                              }
                              className="rounded-[3px] border border-zinc-300 bg-white px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-100"
                            >
                              해제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. 미션 회수 트래커 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                3. 회차별 팬 미션 회수 트래커
              </h2>
              <p className="text-[11px] text-zinc-500">
                COLLECTING에서 ADOPTED(채택)로 전환된 미션은 해당 회차 엔딩 크레딧 등재 대상으로 표시됩니다.
              </p>
            </div>
            <Badge variant="teal">{store.missions.length}건</Badge>
          </div>
          <div className="divide-y divide-zinc-200">
            {store.missions.map((ms) => {
              const ep = store.episodes.find((e) => e.id === ms.episodeId);
              const isAdopted = ms.status === "ADOPTED";
              return (
                <div
                  key={ms.id}
                  className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs ${
                    isAdopted ? "bg-[#1F5E63]/5" : "bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#1F5E63]">
                        제{ep?.no ?? ms.episodeId}화
                      </span>
                      <Badge variant="default">
                        {ms.type === "expression" ? "표현 미션" : "팬덤명 공모"}
                      </Badge>
                      <span className="font-semibold text-zinc-900">
                        {ms.body}
                      </span>
                      {isAdopted && (
                        <Badge variant="tealSolid">
                          <Award className="h-3 w-3" /> 엔딩 크레딧 등재 대상
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      회차: {ep?.title} · 참여 투표 {ms.votes}건
                    </div>
                  </div>
                  <select
                    value={ms.status}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        missions: prev.missions.map((item) =>
                          item.id === ms.id
                            ? {
                                ...item,
                                status: e.target.value as
                                  | "COLLECTING"
                                  | "ADOPTED"
                                  | "REJECTED",
                              }
                            : item
                        ),
                      }))
                    }
                    className="rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold"
                  >
                    <option value="COLLECTING">수집중 (COLLECTING)</option>
                    <option value="ADOPTED">
                      채택됨 · 크레딧 대상 (ADOPTED)
                    </option>
                    <option value="REJECTED">보류 (REJECTED)</option>
                  </select>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. 시즌 2 참여 설계 4대 장치 (VIII장: A3 성장 투표, B3 팬레터 공모, B4 응원 게이지 최대치, C2 다음 도시 추천) */}
        <section className="rounded-[8px] border border-[#1F5E63]/30 bg-white p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="tealSolid">시즌 2 · VIII장 참여 설계</Badge>
                <h2 className="text-xs font-bold text-zinc-900">
                  4. 시즌 2 데뷔 서사 4대 인터랙티브 참여 장치 (A3 · B3 · B4 · C2)
                </h2>
              </div>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                팬들의 투표와 공모가 B1 쇼케이스 무대 연출, B3 팬레터 낭독, B4 첫 1위 무삭제 앵콜 해금, 그리고 C2/C3 전국투어 도시 및 GT TOUR 사전 예약 블록을 결정합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRoute({ page: "season2" })}
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17494d]"
            >
              <span>시즌 2 데뷔 서사 (10화) 보드로 이동</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {(store.season2Devices ?? INITIAL_SEASON2_DEVICES).map((dev) => {
              const pct = Math.min(
                100,
                Math.round((dev.currentCount / dev.targetCount) * 100)
              );
              const isMax = pct >= 100 || dev.status === "UNLOCKED";

              return (
                <div
                  key={dev.code}
                  className={`flex flex-col justify-between rounded-[8px] border p-4 space-y-3 ${
                    isMax
                      ? "border-[#1F5E63] bg-[#1F5E63]/5"
                      : "border-zinc-200 bg-zinc-50/60"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-[2px] bg-zinc-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                          {dev.episodeCode}
                        </span>
                        <span className="text-xs font-bold text-[#1F5E63]">
                          {dev.mechanismLabel}
                        </span>
                      </div>
                      <Badge variant={isMax ? "tealSolid" : "amber"}>
                        {isMax ? "목표 달성 · 해금됨" : `진행중 (${pct}%)`}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">
                        {dev.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                        {dev.description}
                      </p>
                    </div>

                    {/* 진행률 게이지 바 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-semibold text-zinc-700">
                          현재 {dev.currentCount.toLocaleString()}{dev.unit} / 목표{" "}
                          {dev.targetCount.toLocaleString()}{dev.unit}
                        </span>
                        <span className="font-bold text-[#1F5E63]">{pct}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-[2px] bg-zinc-200">
                        <div
                          className={`h-full transition-all ${
                            isMax ? "bg-[#1F5E63]" : "bg-amber-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* 세부 투표/공모 항목 리스트 (클릭 시 득표/수치 증가 시뮬레이션) */}
                    <div className="space-y-1.5 pt-1">
                      {dev.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`flex items-center justify-between gap-2 rounded-[4px] border px-2.5 py-2 text-xs ${
                            opt.isLeading
                              ? "border-[#1F5E63]/40 bg-white"
                              : "border-zinc-200 bg-white/80"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {opt.isLeading && (
                                <Badge variant="teal">1위 선두</Badge>
                              )}
                              <span className="truncate font-semibold text-zinc-900">
                                {opt.label}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-zinc-500">
                              {opt.subLabel}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs font-bold text-zinc-900">
                              {opt.count.toLocaleString()}
                              {dev.unit}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const step =
                                  dev.unit === "%"
                                    ? 2
                                    : dev.unit === "통"
                                    ? 15
                                    : 250;
                                setStore((prev) => ({
                                  ...prev,
                                  season2Devices: (
                                    prev.season2Devices ??
                                    INITIAL_SEASON2_DEVICES
                                  ).map((d) => {
                                    if (d.code !== dev.code) return d;
                                    const nextCurrent =
                                      d.unit === "%"
                                        ? Math.min(100, d.currentCount + step)
                                        : d.currentCount + step;
                                    return {
                                      ...d,
                                      currentCount: nextCurrent,
                                      status:
                                        nextCurrent >= d.targetCount
                                          ? "UNLOCKED"
                                          : d.status,
                                      options: d.options.map((o) =>
                                        o.id === opt.id
                                          ? { ...o, count: o.count + step }
                                          : o
                                      ),
                                    };
                                  }),
                                }));
                              }}
                              className="rounded-[3px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white"
                            >
                              +참여 반영
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-zinc-200 pt-2.5 text-[11px]">
                    <div className="text-zinc-700">
                      <strong className="text-zinc-900">해금 보상:</strong>{" "}
                      {dev.rewardRule}
                    </div>
                    <div className="text-[#1F5E63]">
                      <strong>GT TOUR 연동:</strong> {dev.gtTourLinkNote}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({
                            page: "season2Detail",
                            code: dev.episodeCode,
                          })
                        }
                        className="font-semibold text-[#1F5E63] hover:underline"
                      >
                        {dev.episodeTitle} 상세 화면 열기 →
                      </button>
                      {dev.code === "B4_GAUGE" && dev.currentCount < 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setStore((prev) => ({
                              ...prev,
                              season2Devices: (
                                prev.season2Devices ?? INITIAL_SEASON2_DEVICES
                              ).map((d) =>
                                d.code === "B4_GAUGE"
                                  ? {
                                      ...d,
                                      currentCount: 100,
                                      status: "UNLOCKED",
                                    }
                                  : d
                              ),
                            }))
                          }
                          className="rounded-[3px] bg-[#1F5E63] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#17494d]"
                        >
                          100% 최대치 즉시 달성(MAX 해금)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. IX장 공개 페이즈 매핑 테이블 (Phase 0 ~ Phase 4 상태 관리) */}
        <section className="rounded-[8px] border border-zinc-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                5. 공개 페이즈 매핑 테이블 (Phase 0 ~ Phase 4 · 상태 제어)
              </h2>
              <p className="text-[11px] text-zinc-500">
                오리진 5편(Phase 0), 시즌 1(Phase 1), 시즌 2 PART A·B·C(Phase 2~4)의 단계별 공개 상태와 GT TOUR 투어 상품 연동을 관리합니다.
              </p>
            </div>
            <Badge variant="teal">IX장 마스터 스케줄</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                  <th className="px-3.5 py-2.5 w-24">페이즈</th>
                  <th className="px-3.5 py-2.5">타이틀 · 운영 기간</th>
                  <th className="px-3.5 py-2.5">콘텐츠 · 비주얼 포맷</th>
                  <th className="px-3.5 py-2.5">연결 회차 & 참여 장치</th>
                  <th className="px-3.5 py-2.5">GT TOUR 비즈니스 연결</th>
                  <th className="px-3.5 py-2.5 w-36 text-right">페이즈 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {(store.releasePhases ?? INITIAL_RELEASE_PHASES).map((ph) => (
                  <tr key={ph.id} className="hover:bg-zinc-50">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-[#1F5E63]">
                      {ph.phase}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-bold text-zinc-900">{ph.title}</div>
                      <div className="font-mono text-[11px] text-zinc-500">
                        {ph.period}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-medium text-zinc-800">
                        {ph.contentScope}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {ph.visualFormat}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {ph.linkedEpisodeCodes.map((c) => (
                          <span
                            key={c}
                            className="rounded-[2px] border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] font-semibold text-[#1F5E63]">
                        {ph.participationHook}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-[11px] text-zinc-700">
                      {ph.gtTourProduct}
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <select
                        value={ph.status}
                        onChange={(e) => {
                          const nextSt = e.target.value as
                            | "DONE"
                            | "ACTIVE"
                            | "UPCOMING";
                          setStore((prev) => ({
                            ...prev,
                            releasePhases: (
                              prev.releasePhases ?? INITIAL_RELEASE_PHASES
                            ).map((item) =>
                              item.id === ph.id
                                ? { ...item, status: nextSt }
                                : item
                            ),
                          }));
                        }}
                        className="rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-zinc-800"
                      >
                        <option value="DONE">완료 (DONE)</option>
                        <option value="ACTIVE">운영중 (ACTIVE)</option>
                        <option value="UPCOMING">예정 (UPCOMING)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  // --- 화면 9: 오리진 시리즈 5편 목록 (/origins) ---
  const renderOrigins = () => {
    const origins = [...(store.origins ?? [])].sort(
      (a, b) => a.releaseOrder - b.releaseOrder
    );

    const timelineItems = [
      { label: "2주 전", sub: "M1 한지후", originNo: 1 },
      { label: "1주 전", sub: "M4 하루토", originNo: 2 },
      { label: "D-3", sub: "M2 이든 박", originNo: 3 },
      { label: "D-0", sub: "시즌1 제1화 런칭", episodeNo: 1 },
      { label: "+1주", sub: "M3 린위하오", originNo: 4 },
      { label: "+2주", sub: "M5 아이만", originNo: 5 },
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <h1 className="text-base font-bold text-zinc-900">
              오리진 시리즈 5편 (프리퀄 애니메이션 · 각 180초)
            </h1>
            <p className="text-xs text-zinc-500">
              다섯 멤버가 왜 성수동에 모였는지 보여주는 3분 애니메이션 프리퀄 시리즈입니다. 각 편 B7(170~178초)에서 실사 캐릭터 시트로 디졸브됩니다.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="tealSolid">총 {origins.length}편 (8비트 × 3채널)</Badge>
            <Badge variant="amber">M1 민감 소재 안전 게이트</Badge>
          </div>
        </div>

        {/* 공개 일정 타임라인 바 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900">
              공개 캘린더 (런칭 2주 전 ~ 런칭 +2주)
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              시즌1 1화 전후 프리퀄 배치
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
            {timelineItems.map((item, idx) => {
              const isLaunch = Boolean(item.episodeNo);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.originNo) {
                      setRoute({ page: "originDetail", originNo: item.originNo });
                    } else if (item.episodeNo) {
                      setRoute({
                        page: "episodeDetail",
                        episodeNo: item.episodeNo,
                      });
                    }
                  }}
                  className={`rounded-[6px] border p-2.5 text-left transition-colors ${
                    isLaunch
                      ? "border-[#1F5E63] bg-[#1F5E63]/10 hover:bg-[#1F5E63]/15"
                      : "border-zinc-200 bg-zinc-50 hover:border-[#1F5E63]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isLaunch ? "text-[#1F5E63]" : "text-zinc-700"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.originNo === 1 && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div className="mt-1 truncate text-xs font-semibold text-zinc-900">
                    {item.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5편 카드 그리드 */}
        <div className="grid grid-cols-1 gap-3.5">
          {origins.map((origin) => {
            const member = store.members.find((m) => m.id === origin.memberId);
            const doneBeats = origin.beats.filter((b) => b.done).length;
            const totalBeats = origin.beats.length;
            const linkedEp = store.episodes.find(
              (e) => e.no === origin.episodeLink
            );
            const safetyDoneCount = origin.safetyChecks.filter(
              (s) => s.done
            ).length;

            return (
              <div
                key={origin.id}
                className={`rounded-[8px] border p-4 transition-colors ${
                  origin.sensitive
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-[260px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
                        ORIGIN #{origin.no}
                      </span>
                      <Badge variant="default">
                        공개 {origin.releaseOrder}순위 ({origin.releaseAt})
                      </Badge>
                      <OriginStatusBadge status={origin.status} />
                      {origin.sensitive && (
                        <Badge variant="amber">
                          안전 검수 필요 ({safetyDoneCount}/
                          {origin.safetyChecks.length})
                        </Badge>
                      )}
                      <AnimeSheetStatusBadge member={member} compact />
                    </div>

                    <div className="flex flex-wrap items-baseline gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: "originDetail", originNo: origin.no })
                        }
                        className="text-left text-sm font-bold text-zinc-900 hover:text-[#1F5E63] hover:underline"
                      >
                        {origin.title}
                      </button>
                      <span className="text-xs text-zinc-600">
                        · {member?.nameKo} ({origin.memberId} · {member?.position}
                        ) · {origin.originCity}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed">
                      <strong className="text-zinc-900">응원 포인트:</strong>{" "}
                      {origin.supportPoint}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] text-zinc-500">
                      <span>
                        핵심 소품:{" "}
                        <strong className="text-zinc-700">
                          {origin.keyProp}
                        </strong>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        색채 전환:
                        <span
                          className="inline-block h-3 w-3 rounded-[2px] border border-zinc-300"
                          style={{ backgroundColor: origin.colorStart }}
                        />
                        <span className="font-mono">{origin.colorStart}</span>
                        <span>→</span>
                        <span
                          className="inline-block h-3 w-3 rounded-[2px] border border-zinc-300"
                          style={{ backgroundColor: origin.colorEnd }}
                        />
                        <span className="font-mono">{origin.colorEnd}</span>
                      </span>
                      <span>
                        비트 완료:{" "}
                        <strong className="font-mono text-[#1F5E63]">
                          {doneBeats}/{totalBeats}
                        </strong>
                      </span>
                      {linkedEp && (
                        <button
                          type="button"
                          onClick={() =>
                            setRoute({
                              page: "episodeDetail",
                              episodeNo: linkedEp.no,
                            })
                          }
                          className="font-semibold text-[#1F5E63] hover:underline"
                        >
                          시즌1 제{linkedEp.no}화({linkedEp.title}) 연결 →
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {renderOriginStatusControl(origin.no, origin.status)}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {onExportToGtStudio && (
                        <button
                          type="button"
                          onClick={() => handleExportOriginToGtStudio(origin)}
                          className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-1 text-xs font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                        >
                          <span>GT TOUR 스튜디오로 내보내기</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: "originDetail", originNo: origin.no })
                        }
                        className="inline-flex items-center gap-1 rounded-[4px] bg-[#1F5E63] px-3 py-1 text-xs font-semibold text-white hover:bg-[#17494d]"
                      >
                        <span>8비트 시트 · 3채널 대본 열기</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 화면 10: 오리진 상세 (/origins/[no]) ---
  const renderOriginDetail = (originNo: number) => {
    const origin = (store.origins ?? []).find((o) => o.no === originNo);
    if (!origin) return null;

    const member = store.members.find((m) => m.id === origin.memberId);
    const linkedEp = store.episodes.find((e) => e.no === origin.episodeLink);
    const currentScript =
      origin.channelScripts.find((s) => s.channelCode === originChannelTab) ??
      origin.channelScripts[0];

    const doneBeatsCount = origin.beats.filter((b) => b.done).length;
    const allSafetyDone =
      !origin.sensitive || origin.safetyChecks.every((s) => s.done);

    const HELPLINE_NOTICES: Record<string, { title: string; body: string }> = {
      KR: {
        title: "한국어 (KR) 상담 안내 문구",
        body: "마음이 힘들거나 누군가의 도움이 필요할 때, 혼자 견디지 마세요. 자살예방 상담전화 109 (24시간) / 정신건강 상담전화 1577-0199",
      },
      JP: {
        title: "일본어 (JP) 상담 안내 문구",
        body: "つらい気持ちや悩みをひとりで抱え込まないでください。よりそいホットライン 0120-279-338（24時間・通話料無料）/ いのちの電話 0570-783-556",
      },
      US: {
        title: "영어권 (US/Global) 상담 안내 문구",
        body: "If you or someone you know is struggling or in crisis, help is available. Call or text 988 (US & Canada) or visit findahelpline.com for free, confidential support.",
      },
      CN: {
        title: "중화권 (CN/TW) 상담 안내 문구",
        body: "如果您或身边的人正在经历心理困扰，请寻求专业帮助：台湾生命线 1995 / 安心专线 1925（24小时）· 希望24热线 400-161-9995",
      },
    };

    const handleCopyHelpline = async (lang: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedHelpline(lang);
      setTimeout(() => {
        setCopiedHelpline((prev) => (prev === lang ? null : prev));
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setRoute({ page: "origins" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-[#1F5E63]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            오리진 5편 목록으로 돌아가기
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {linkedEp && (
              <button
                type="button"
                onClick={() =>
                  setRoute({ page: "episodeDetail", episodeNo: linkedEp.no })
                }
                className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <span>
                  시즌1 연결 회차: 제{linkedEp.no}화 ({linkedEp.title})
                </span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* 상단 요약 헤더 */}
        <header
          className={`rounded-[8px] border p-4 ${
            origin.sensitive
              ? "border-amber-300 bg-amber-50/60"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
                  ORIGIN #{origin.no}
                </span>
                <h1 className="text-base font-bold text-zinc-900">
                  {origin.title}
                </h1>
                <OriginStatusBadge status={origin.status} />
                {origin.sensitive && (
                  <Badge variant={allSafetyDone ? "tealSolid" : "amber"}>
                    {allSafetyDone
                      ? "SAFE-01~08 안전 검수 완료"
                      : "안전 검수 필요 (SAFE-01~08)"}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                <span>
                  주인공:{" "}
                  <strong className="text-zinc-900">
                    {member
                      ? `${member.nameKo} (${member.id} · ${member.position})`
                      : origin.memberId}
                  </strong>
                </span>
                <span className="text-zinc-300">|</span>
                <span>출발 도시: {origin.originCity}</span>
                <span className="text-zinc-300">|</span>
                <span>
                  공개 시점: <strong>{origin.releaseAt}</strong> (런칭 순서{" "}
                  {origin.releaseOrder}번)
                </span>
                <span className="text-zinc-300">|</span>
                <span className="font-mono">{origin.durationSec}초 (8비트)</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              {onExportToGtStudio && (
                <button
                  type="button"
                  onClick={() =>
                    handleExportOriginToGtStudio(origin, originChannelTab)
                  }
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1 text-xs font-bold text-white hover:bg-[#17494d]"
                >
                  <span>GT TOUR 스튜디오로 내보내기</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="text-[11px] text-zinc-500">
                오리진 단계 이동 (버튼 / 드롭다운)
              </span>
              {renderOriginStatusControl(origin.no, origin.status)}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {/* 4단 서사 요약 카드 */}
            <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="text-xs font-bold text-zinc-900">
                  프리퀄 4단 서사 & 응원 포인트
                </h2>
                <span className="font-mono text-[11px] text-zinc-500">
                  결핍(B2) → 전환점(B4) → 선택(B5) → 도착(B6~B7)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3">
                  <div className="font-mono text-[10px] font-bold text-zinc-500">
                    01. 결핍 (LACK · B2)
                  </div>
                  <p className="mt-1 text-zinc-800 leading-relaxed">
                    {origin.lack}
                  </p>
                </div>
                <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3">
                  <div className="font-mono text-[10px] font-bold text-zinc-500">
                    02. 전환점 (TURNING POINT · B4)
                  </div>
                  <p className="mt-1 text-zinc-800 leading-relaxed">
                    {origin.turningPoint}
                  </p>
                </div>
                <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3">
                  <div className="font-mono text-[10px] font-bold text-zinc-500">
                    03. 선택 (CHOICE · B5)
                  </div>
                  <p className="mt-1 text-zinc-800 leading-relaxed">
                    {origin.choice}
                  </p>
                </div>
                <div className="rounded-[6px] border border-[#1F5E63]/30 bg-[#1F5E63]/5 p-3">
                  <div className="font-mono text-[10px] font-bold text-[#1F5E63]">
                    04. 팬 응원 포인트 (SUPPORT POINT)
                  </div>
                  <p className="mt-1 font-medium text-zinc-900 leading-relaxed">
                    {origin.supportPoint}
                  </p>
                </div>
              </div>
              <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
                <strong className="text-zinc-900">도착 엔딩 (B6~B7):</strong>{" "}
                {origin.arrivalBeat}
              </div>
            </section>

            {/* 8비트 타임라인 시트 (B1~B8) */}
            <section className="rounded-[8px] border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <div>
                  <h2 className="text-xs font-bold text-zinc-900">
                    8비트 타임라인 시트 (B1~B8 · 총 180초)
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    각 비트의 작화·연출 지시를 편집하고 완료 여부를 체크합니다.
                  </p>
                </div>
                <Badge variant="tealSolid">
                  완료 {doneBeatsCount} / {origin.beats.length}
                </Badge>
              </div>
              <div className="divide-y divide-zinc-200">
                {origin.beats.map((beat) => (
                  <div
                    key={beat.id}
                    className={`p-3.5 text-xs transition-colors ${
                      beat.done ? "bg-[#1F5E63]/5" : "bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={beat.done}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setStore((prev) => ({
                                ...prev,
                                origins: (prev.origins ?? []).map((o) =>
                                  o.id === origin.id
                                    ? {
                                        ...o,
                                        beats: o.beats.map((b) =>
                                          b.id === beat.id
                                            ? { ...b, done: checked }
                                            : b
                                        ),
                                      }
                                    : o
                                ),
                              }));
                            }}
                            className="h-4 w-4 accent-[#1F5E63]"
                          />
                          <span className="rounded-[2px] bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                            {beat.code}
                          </span>
                        </label>
                        <span className="font-mono text-[11px] font-semibold text-[#1F5E63]">
                          {beat.startSec}s ~ {beat.endSec}s (
                          {beat.endSec - beat.startSec}초)
                        </span>
                        {beat.code === "B7" && (
                          <Badge variant="teal">실사 디졸브 컷</Badge>
                        )}
                      </div>
                      <Badge variant={beat.done ? "tealSolid" : "default"}>
                        {beat.done ? "완료" : "진행 대기"}
                      </Badge>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-500">
                          장면 내용 (content)
                        </label>
                        <textarea
                          rows={2}
                          value={beat.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStore((prev) => ({
                              ...prev,
                              origins: (prev.origins ?? []).map((o) =>
                                o.id === origin.id
                                  ? {
                                      ...o,
                                      beats: o.beats.map((b) =>
                                        b.id === beat.id
                                          ? { ...b, content: val }
                                          : b
                                      ),
                                    }
                                  : o
                              ),
                            }));
                          }}
                          className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white p-2 text-xs text-zinc-900 focus:border-[#1F5E63] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-500">
                          연출 · 작화 지시 (direction)
                        </label>
                        <textarea
                          rows={2}
                          value={beat.direction}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStore((prev) => ({
                              ...prev,
                              origins: (prev.origins ?? []).map((o) =>
                                o.id === origin.id
                                  ? {
                                      ...o,
                                      beats: o.beats.map((b) =>
                                        b.id === beat.id
                                          ? { ...b, direction: val }
                                          : b
                                      ),
                                    }
                                  : o
                              ),
                            }));
                          }}
                          className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white p-2 text-xs text-zinc-700 focus:border-[#1F5E63] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3채널 나레이션 대본 편집 (JP / US / KR) */}
            <section className="rounded-[8px] border border-zinc-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 pt-2">
                <div className="flex gap-1">
                  {(["JP", "US", "KR"] as const).map((code) => {
                    const sc = origin.channelScripts.find(
                      (s) => s.channelCode === code
                    );
                    const isSelected = originChannelTab === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setOriginChannelTab(code)}
                        className={`inline-flex items-center gap-1.5 rounded-t-[4px] border-x border-t px-3.5 py-2 text-xs font-semibold ${
                          isSelected
                            ? "-mb-px border-zinc-200 bg-white text-[#1F5E63]"
                            : "border-transparent text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        <span className="font-mono font-bold">{code}</span>
                        {sc && <VersionStatusBadge status={sc.voStatus} />}
                      </button>
                    );
                  })}
                </div>
                <span className="pb-2 text-[11px] text-zinc-500">
                  3채널 모두 독립 대본 작성 필수 (번역 금지)
                </span>
              </div>

              {currentScript && (
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-800">
                      {currentScript.channelCode} 채널 오리진 나레이션 대본
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-zinc-600">
                        V.O. 상태:
                      </label>
                      <select
                        value={currentScript.voStatus}
                        onChange={(e) => {
                          const nextVo = e.target.value as VersionStatus;
                          setStore((prev) => ({
                            ...prev,
                            origins: (prev.origins ?? []).map((o) =>
                              o.id === origin.id
                                ? {
                                    ...o,
                                    channelScripts: o.channelScripts.map((s) =>
                                      s.channelCode === currentScript.channelCode
                                        ? { ...s, voStatus: nextVo }
                                        : s
                                    ),
                                  }
                                : o
                            ),
                          }));
                        }}
                        className="rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold"
                      >
                        {(
                          ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as VersionStatus[]
                        ).map((st) => (
                          <option key={st} value={st}>
                            {VERSION_STATUS_LABELS[st]} ({st})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={currentScript.narration}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStore((prev) => ({
                        ...prev,
                        origins: (prev.origins ?? []).map((o) =>
                          o.id === origin.id
                            ? {
                                ...o,
                                channelScripts: o.channelScripts.map((s) =>
                                  s.channelCode === currentScript.channelCode
                                    ? { ...s, narration: val }
                                    : s
                                ),
                              }
                            : o
                        ),
                      }));
                    }}
                    className="w-full rounded-[4px] border border-zinc-300 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-900 focus:border-[#1F5E63] focus:outline-none"
                  />
                </div>
              )}
            </section>

            {/* M1 전용: 민감 소재 안전 가이드 (SAFE-01~08) + 4개국 상담 안내 */}
            {origin.sensitive && (
              <section className="rounded-[8px] border border-amber-300 bg-amber-50/50 p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-700" />
                    <div>
                      <h2 className="text-xs font-bold text-amber-950">
                        민감 소재 안전 가이드 체크리스트 (SAFE-01 ~ SAFE-08)
                      </h2>
                      <p className="text-[11px] text-amber-800">
                        8개 항목 모두 체크(done = true)되어야만 검수(REVIEWED) 및 발행(PUBLISHED) 단계로 전이할 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <Badge variant={allSafetyDone ? "tealSolid" : "red"}>
                    {
                      origin.safetyChecks.filter((s) => s.done).length
                    }
                    /{origin.safetyChecks.length} 완료
                  </Badge>
                </div>

                <div className="space-y-2">
                  {origin.safetyChecks.map((chk) => (
                    <label
                      key={chk.id}
                      className={`flex items-start gap-2.5 rounded-[6px] border p-2.5 text-xs cursor-pointer select-none ${
                        chk.done
                          ? "border-emerald-300 bg-white text-zinc-900"
                          : "border-amber-300 bg-amber-100/60 text-amber-950"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={chk.done}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setStore((prev) => ({
                            ...prev,
                            origins: (prev.origins ?? []).map((o) =>
                              o.id === origin.id
                                ? {
                                    ...o,
                                    safetyChecks: o.safetyChecks.map((s) =>
                                      s.id === chk.id
                                        ? { ...s, done: checked }
                                        : s
                                    ),
                                  }
                                : o
                            ),
                          }));
                        }}
                        className="mt-0.5 h-4 w-4 accent-[#1F5E63]"
                      />
                      <div className="flex-1">
                        <span className="mr-1.5 font-mono font-bold text-[#1F5E63]">
                          {chk.code}
                        </span>
                        <span>{chk.rule}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* 4개국 상담 안내 문구 미리보기 & 복사 */}
                <div className="space-y-2 border-t border-amber-200 pt-3">
                  <div className="text-xs font-bold text-amber-950">
                    SAFE-07 필수: 4개국 상담 안내 문구 (엔딩 카드 & 설명란 복사)
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {Object.entries(HELPLINE_NOTICES).map(([lang, item]) => (
                      <div
                        key={lang}
                        className="rounded-[6px] border border-amber-200 bg-white p-2.5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-zinc-800">
                            {item.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyHelpline(lang, item.body)}
                            className="inline-flex items-center gap-1 rounded-[3px] border border-zinc-300 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100"
                          >
                            {copiedHelpline === lang ? (
                              <>
                                <Check className="h-3 w-3 text-[#1F5E63]" /> 복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> 복사
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* 우측 고정 영역: 애니 시트 상태 & 작화 톤 4원칙 */}
          <aside className="space-y-3 lg:col-span-4">
            <div className="rounded-[8px] border border-zinc-200 bg-zinc-100/80 p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-800">
                    고정 — 캐릭터 시트 & 작화 4원칙
                  </span>
                </div>
                <Badge variant="default">SPEC 10.2</Badge>
              </div>

              {member && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="font-semibold text-zinc-700">
                      {member.nameKo} ({member.id}) 애니 시트 상태
                    </span>
                    <AnimeSheetStatusBadge member={member} compact />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="overflow-hidden rounded-[4px] border border-zinc-200 bg-white">
                      <div className="aspect-[4/3] bg-zinc-100">
                        <img
                          src={member.photoSheetUrl}
                          alt={`${member.nameKo} 실사`}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="p-1.5 text-[10px] font-medium text-zinc-600">
                        실사 시트 (B7 디졸브 도착점)
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-[4px] border border-emerald-300 bg-white">
                      <AnimeSheetQuadrantView
                        member={member}
                        className="aspect-[4/3]"
                        onClickZoom={() =>
                          setAnimeLightbox({
                            memberId: member.id,
                            viewMode: "QUADRANT",
                          })
                        }
                      />
                      <div className="flex items-center justify-between px-1.5 py-1 text-[10px] font-semibold text-zinc-700">
                        <span>애니 시트 (B1~B6 작화 기준)</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAnimeLightbox({
                              memberId: member.id,
                              viewMode: "FULL_SHEET",
                            })
                          }
                          className="font-mono text-[9px] text-[#1F5E63] hover:underline"
                        >
                          2x2 원본
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 애니 시트 사분면 크롭 · 직접 업로드 · AC-20 게이트 상태 제어 패널 */}
                  <div className="rounded-[6px] border border-zinc-200 bg-white p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-800">
                        애니 시트 매핑 & AC-20 게이트 설정
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {member.animeSheetLabel ?? "기본 매핑"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div>
                        <label className="block text-[10px] font-medium text-zinc-500">
                          시트 판정 상태 (AC-20)
                        </label>
                        <select
                          value={getMemberAnimeStatus(member)}
                          onChange={(e) => {
                            const nextSt = e.target.value as AnimeSheetStatus;
                            const def = DEFAULT_MEMBER_ANIME_SHEETS[member.id];
                            handleUpdateMemberAnimeSheet(member.id, {
                              animeSheetStatus: nextSt,
                              animeSheetUrl:
                                nextSt === "NONE"
                                  ? null
                                  : member.animeSheetUrl ??
                                    def?.animeSheetUrl ??
                                    COMPOSITE_ANIME_SHEET_URL,
                            });
                          }}
                          className="mt-0.5 w-full rounded-[3px] border border-zinc-300 bg-white px-1.5 py-1 text-[11px] font-semibold text-zinc-800"
                        >
                          <option value="READY">
                            제작완료 (READY / 통과)
                          </option>
                          <option value="HOLD">
                            파일럿 3/5 보류 (HOLD / 차단)
                          </option>
                          <option value="NONE">미제작 (NONE / 차단)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-zinc-500">
                          2x2 사분면 크롭 영역
                        </label>
                        <select
                          value={member.animeSheetQuadrant ?? "SINGLE"}
                          onChange={(e) => {
                            const val = e.target.value;
                            const nextQuad: AnimeSheetQuadrant =
                              val === "SINGLE"
                                ? null
                                : (val as "TL" | "TR" | "BL" | "BR");
                            handleUpdateMemberAnimeSheet(member.id, {
                              animeSheetUrl: nextQuad
                                ? COMPOSITE_ANIME_SHEET_URL
                                : member.animeSheetUrl,
                              animeSheetQuadrant: nextQuad,
                              animeSheetStatus: "READY",
                              animeSheetLabel: nextQuad
                                ? `${QUADRANT_SHORT_LABELS[nextQuad]} · 2x2 시트`
                                : "단독 이미지 시트",
                            });
                          }}
                          className="mt-0.5 w-full rounded-[3px] border border-zinc-300 bg-white px-1.5 py-1 text-[11px] font-semibold text-zinc-800"
                        >
                          <option value="TL">좌상단 (Ji-min · 0% 0%)</option>
                          <option value="TR">우상단 (Eden · 100% 0%)</option>
                          <option value="BL">좌하단 (Yu-hao · 0% 100%)</option>
                          <option value="BR">우하단 (Aiman · 100% 100%)</option>
                          <option value="SINGLE">단독 이미지 (크롭 없음)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-[3px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2 py-1 text-[10px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors">
                        <Upload className="h-3 w-3" />
                        <span>개별 시트 업로드/변경</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadMemberAnimeSheet(
                              member.id,
                              e.target.files?.[0]
                            )
                          }
                        />
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setAnimeLightbox({
                              memberId: member.id,
                              viewMode: "QUADRANT",
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-[3px] border border-zinc-300 bg-zinc-50 px-2 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-100"
                        >
                          <ZoomIn className="h-3 w-3" />
                          <span>확대 보기</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetMemberAnimeSheet(member.id)}
                          className="inline-flex items-center gap-1 rounded-[3px] border border-zinc-300 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-600 hover:bg-zinc-100"
                          title="초기 2x2 사분면 매핑으로 복원"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>기본값</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-zinc-600">
                  색채 스크립트 (Color Script)
                </div>
                <div className="flex items-center justify-between rounded-[4px] border border-zinc-200 bg-white p-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-4 w-4 rounded-[2px] border border-zinc-300"
                      style={{ backgroundColor: origin.colorStart }}
                    />
                    <span className="font-mono text-[11px]">
                      {origin.colorStart} (결핍)
                    </span>
                  </div>
                  <span className="text-zinc-400">→</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-4 w-4 rounded-[2px] border border-zinc-300"
                      style={{ backgroundColor: origin.colorEnd }}
                    />
                    <span className="font-mono text-[11px]">
                      {origin.colorEnd} (도착)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-zinc-600">
                  작화·연출 4원칙 (전 편 공통)
                </div>
                <ul className="space-y-1 rounded-[4px] border border-zinc-200 bg-white p-2.5 text-[11px] text-zinc-700">
                  <li>
                    <strong>1. 성인 비율 유지:</strong> 20~24세 등신대 유지 (소년화 금지)
                  </li>
                  <li>
                    <strong>2. 색채 스크립트:</strong> 전반 채도 낮은 한색 → B4 이후 웜톤 전환
                  </li>
                  <li>
                    <strong>3. 핵심 소품 고정:</strong> {origin.keyProp}
                  </li>
                  <li>
                    <strong>4. B7 매치컷 디졸브:</strong> 170~178초에 실사 캐릭터 시트로 전환
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  // --- 서브 컴포넌트: 시즌 2 에피소드 상태 컨트롤 (AC-20 게이트 연동) ---
  const renderSeason2StatusControl = (
    code: Season2Episode["code"],
    currentStatus: EpisodeStatus,
    compact = false
  ) => {
    const idx = EPISODE_STATUS_ORDER.indexOf(currentStatus);
    const prevSt = idx > 0 ? EPISODE_STATUS_ORDER[idx - 1] : null;
    const nextSt =
      idx < EPISODE_STATUS_ORDER.length - 1
        ? EPISODE_STATUS_ORDER[idx + 1]
        : null;
    const err = season2StatusErrors[code];

    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={!prevSt}
            onClick={() =>
              prevSt && handleTransitionSeason2Status(code, prevSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            {!compact && <span>이전</span>}
          </button>

          <select
            aria-label={`시즌2 ${code} 단계 선택`}
            value={currentStatus}
            onChange={(e) =>
              handleTransitionSeason2Status(
                code,
                e.target.value as EpisodeStatus
              )
            }
            className={`rounded-[3px] border px-2 py-1 text-[11px] font-semibold focus:border-[#1F5E63] focus:outline-none ${
              currentStatus === "PUBLISHED"
                ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                : currentStatus === "REVIEWED"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-zinc-300 bg-white text-zinc-800"
            }`}
          >
            {EPISODE_STATUS_ORDER.map((st) => (
              <option
                key={st}
                value={st}
                className="bg-white text-zinc-900 font-normal"
              >
                {EPISODE_STATUS_LABELS[st]} ({st})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!nextSt}
            onClick={() =>
              nextSt && handleTransitionSeason2Status(code, nextSt)
            }
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!compact && <span>다음</span>}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {err && (
          <div
            role="alert"
            className="flex items-start gap-1 rounded-[3px] border border-red-300 bg-red-50 px-2 py-1 text-[11px] text-red-800 max-w-md"
          >
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-600" />
            <span>{err}</span>
          </div>
        )}
      </div>
    );
  };

  // --- 화면 11: 시즌 2 데뷔 서사 10화 보드 (/season2) ---
  const renderSeason2 = () => {
    const allEpisodes = [...(store.season2Episodes ?? INITIAL_SEASON2_EPISODES)].sort(
      (a, b) => a.no - b.no
    );
    const filteredEpisodes =
      season2PartFilter === "ALL"
        ? allEpisodes
        : allEpisodes.filter((e) => e.part === season2PartFilter);

    const b1Ep = allEpisodes.find((e) => e.code === "B1");
    const b1Checks = b1Ep?.identityChecks ?? [];
    const b1MatchedCount = b1Checks.filter((c) => c.matched).length;
    const b1FrameVerified = Boolean(b1Ep?.b1TransitionFrameSpec?.verified);
    const holdMembers = store.members.filter(
      (m) => getMemberAnimeStatus(m) !== "READY"
    );
    const isB1GateReady =
      b1MatchedCount === b1Checks.length &&
      b1FrameVerified &&
      holdMembers.length === 0;

    return (
      <div className="space-y-4">
        {/* 상단 타이틀 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="tealSolid">SEASON 2 · DEBUT NARRATIVE</Badge>
              <h1 className="text-base font-bold text-zinc-900">
                시즌 2 데뷔 서사 보드 (총 10화 · PART A·B·C 3부작)
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              PART A(A1~A3 애니메이션) ➔ PART B(B1 「관객 서른 명」 애니➔실사 전환 및 첫 1위) ➔ PART C(C1~C3 실사 전국투어 & GT TOUR 3대 상품 직결)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={isB1GateReady ? "emerald" : "amber"}>
              B1 AC-20 전환 게이트:{" "}
              {isB1GateReady
                ? "검수 통과 (READY)"
                : `검수 필요 (${b1MatchedCount}/5 일치)`}
            </Badge>
            <button
              type="button"
              onClick={() => setRoute({ page: "season2Detail", code: "B1" })}
              className="inline-flex items-center gap-1 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-2.5 py-1 text-xs font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
            >
              <span>★ B1 「관객 서른 명」 전환 프레임 & AC-20 검수 열기</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3부 구조(PART A / PART B / PART C) 아크 요약 카드 */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {[
            {
              part: "PART_A" as const,
              badge: "PART A · A1 ~ A3 (3화)",
              title: "데뷔 전야: 성수동 지하 연습실",
              format: "100% 2D 애니메이션 (2x2 애니 시트 작화 기준)",
              desc: "각기 다른 5개의 박자가 하나의 호흡으로 맞춰지는 성수동 연습실과 새벽 녹음실. A3에서 팬들의 [성장 투표]로 쇼케이스 무대 구성이 결정됩니다.",
              phase: "Phase 2",
              highlightCode: "A3" as const,
            },
            {
              part: "PART_B" as const,
              badge: "PART B · B1 ~ B4 (4화)",
              title: "애니 ➔ 실사 전환 & 음악방송 첫 1위",
              format: "B1 매치컷 전환 (애니➔실사) + B2~B4 100% 실사",
              desc: "B1 「관객 서른 명」 첫 스포트라이트에서 2D 작화가 5인의 실사로 깨어납니다. [B3 팬레터 공모]와 [B4 응원 게이지 MAX(100%)]로 첫 1위를 달성합니다.",
              phase: "Phase 3",
              highlightCode: "B1" as const,
            },
            {
              part: "PART_C" as const,
              badge: "PART C · C1 ~ C3 (3화)",
              title: "100% 실사 전국투어 & GT TOUR 수익 전환",
              format: "100% 실사 전국투어 (서울 ➔ 부산 ➔ 제주/피날레)",
              desc: "전국투어 현장을 GT TOUR 3대 투어 상품(① 공연 정착 셔틀 · ② 콘서트 나잇 패키지 · ③ VVIP 송영) 및 [C2 다음 도시 추천] 투표와 직결합니다.",
              phase: "Phase 4",
              highlightCode: "C1" as const,
            },
          ].map((arc) => {
            const isSelected = season2PartFilter === arc.part;
            return (
              <div
                key={arc.part}
                onClick={() =>
                  setSeason2PartFilter((prev) =>
                    prev === arc.part ? "ALL" : arc.part
                  )
                }
                className={`cursor-pointer rounded-[8px] border p-3.5 transition-colors ${
                  isSelected
                    ? "border-[#1F5E63] bg-[#1F5E63]/5"
                    : "border-zinc-200 bg-white hover:border-[#1F5E63]/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={isSelected ? "tealSolid" : "teal"}>
                    {arc.badge}
                  </Badge>
                  <span className="font-mono text-[11px] font-semibold text-zinc-500">
                    {arc.phase}
                  </span>
                </div>
                <h2 className="mt-2 text-sm font-bold text-zinc-900">
                  {arc.title}
                </h2>
                <div className="mt-1 font-mono text-[11px] font-semibold text-[#1F5E63]">
                  형식: {arc.format}
                </div>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                  {arc.desc}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px]">
                  <span className="text-zinc-500">
                    {isSelected ? "필터 적용중 (클릭 시 전체)" : "클릭하여 이 파트만 보기"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoute({
                        page: "season2Detail",
                        code: arc.highlightCode,
                      });
                    }}
                    className="font-bold text-[#1F5E63] hover:underline"
                  >
                    대표 회차({arc.highlightCode}) 열기 →
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* 10화 전체 감정 곡선(Emotional Curve) & 비주얼 전환 타임라인 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-zinc-900">
                시즌 2 전 회차(A1~C3) 감정 곡선 & 비주얼 포맷 전환 아크
              </h2>
              <p className="text-[11px] text-zinc-500">
                각 회차 막대를 클릭하면 해당 에피소드 상세 시나리오 및 전환/투어 연동 화면으로 이동합니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-500" />
                PART A (100% 애니)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600" />
                B1 (애니➔실사 전환점)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#1F5E63]" />
                PART B·C (100% 실사)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {allEpisodes.map((ep) => {
              const barColor =
                ep.code === "B1"
                  ? "bg-emerald-600"
                  : ep.part === "PART_A"
                  ? "bg-amber-500"
                  : "bg-[#1F5E63]";
              return (
                <button
                  key={ep.code}
                  type="button"
                  onClick={() =>
                    setRoute({ page: "season2Detail", code: ep.code })
                  }
                  className={`group flex flex-col justify-between rounded-[6px] border p-2.5 text-left transition-all hover:border-[#1F5E63] ${
                    ep.code === "B1"
                      ? "border-emerald-400 bg-emerald-50/40"
                      : "border-zinc-200 bg-zinc-50/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-zinc-900">
                        {ep.code}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#1F5E63]">
                        {ep.emotionIntensity}%
                      </span>
                    </div>
                    <div className="mt-1 truncate text-[11px] font-semibold text-zinc-800 group-hover:text-[#1F5E63]">
                      {ep.title}
                    </div>
                  </div>

                  <div className="my-2 flex h-16 items-end rounded-[3px] bg-zinc-200/70 p-1">
                    <div
                      className={`w-full rounded-[2px] transition-all ${barColor}`}
                      style={{ height: `${ep.emotionIntensity}%` }}
                    />
                  </div>

                  <div>
                    <div className="truncate font-mono text-[9px] text-zinc-500">
                      {ep.emotionCurve}
                    </div>
                    {ep.code === "B1" && (
                      <span className="mt-1 inline-block rounded-[2px] bg-emerald-700 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                        ★ 애니➔실사 전환
                      </span>
                    )}
                    {ep.participationDeviceCode && (
                      <span className="mt-1 inline-block rounded-[2px] bg-amber-600 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                        참여: {ep.participationDeviceCode}
                      </span>
                    )}
                    {ep.part === "PART_C" && !ep.participationDeviceCode && (
                      <span className="mt-1 inline-block rounded-[2px] bg-[#1F5E63] px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                        GT TOUR 3종 연동
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 파트 필터 탭 바 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { key: "ALL", label: "전체 10화 (A1~C3)" },
                { key: "PART_A", label: "PART A · A1~A3 (100% 애니메이션)" },
                {
                  key: "PART_B",
                  label: "PART B · B1~B4 (애니➔실사 전환 & 첫 1위)",
                },
                {
                  key: "PART_C",
                  label: "PART C · C1~C3 (실사 전국투어 & GT TOUR 3대 상품)",
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSeason2PartFilter(tab.key)}
                className={`rounded-[4px] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  season2PartFilter === tab.key
                    ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-zinc-500">
            표시중: {filteredEpisodes.length}화
          </span>
        </div>

        {/* 인터랙티브 테이블 (데스크톱) */}
        <div className="overflow-x-auto rounded-[8px] border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                <th className="px-3 py-2.5 w-20">코드</th>
                <th className="px-3 py-2.5 w-64">제목 · 장소</th>
                <th className="px-3 py-2.5">로그라인 (Logline)</th>
                <th className="px-3 py-2.5 w-44">비주얼 형식 · 감정 곡선</th>
                <th className="px-3 py-2.5 w-48">특수 게이트 / 투어·참여 장치</th>
                <th className="px-3 py-2.5 w-52">제작 단계 (AC-20 연동)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredEpisodes.map((ep) => (
                <tr
                  key={ep.code}
                  className={
                    ep.code === "B1"
                      ? "bg-emerald-50/40 hover:bg-emerald-50/80"
                      : ep.part === "PART_C"
                      ? "bg-[#1F5E63]/[0.02] hover:bg-zinc-50"
                      : "hover:bg-zinc-50"
                  }
                >
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center rounded-[2px] bg-zinc-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                        {ep.code}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        제{ep.no}화 · {ep.releasePhase}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <button
                      type="button"
                      onClick={() =>
                        setRoute({ page: "season2Detail", code: ep.code })
                      }
                      className="text-left font-bold text-zinc-900 hover:text-[#1F5E63] hover:underline"
                    >
                      {ep.title}
                    </button>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      장소: {ep.place}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ep.leadMemberIds.map((mId) => (
                        <span
                          key={mId}
                          className="rounded-[2px] border border-zinc-300 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] font-semibold text-zinc-700"
                        >
                          {mId}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {ep.logline}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {ep.expressions.map((expr, i) => (
                        <span
                          key={i}
                          className="rounded-[2px] bg-[#1F5E63]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#1F5E63]"
                        >
                          「{expr}」
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Badge
                      variant={
                        ep.format === "HYBRID_TRANSITION"
                          ? "emerald"
                          : ep.format === "ANIME_100"
                          ? "amber"
                          : "teal"
                      }
                    >
                      {ep.format === "HYBRID_TRANSITION"
                        ? "애니 ➔ 실사 전환"
                        : ep.format === "ANIME_100"
                        ? "100% 애니메이션"
                        : "100% 실사"}
                    </Badge>
                    <div className="mt-1.5 font-mono text-[11px] font-semibold text-zinc-800">
                      {ep.emotionCurve}
                    </div>
                    <div className="mt-0.5 text-[10px] text-zinc-500">
                      {ep.emotionKeyword}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top space-y-1.5">
                    {ep.code === "B1" && (
                      <button
                        type="button"
                        onClick={() =>
                          setRoute({ page: "season2Detail", code: "B1" })
                        }
                        className="flex w-full items-center justify-between rounded-[4px] border border-emerald-400 bg-emerald-100/70 px-2 py-1 text-left text-[11px] font-bold text-emerald-950 hover:bg-emerald-200/70"
                      >
                        <span>★ B1 첫 프레임 & AC-20 검수</span>
                        <span className="font-mono">{b1MatchedCount}/5</span>
                      </button>
                    )}
                    {ep.participationDeviceCode && (
                      <div className="rounded-[4px] border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900">
                        참여 장치: {ep.participationDeviceCode}
                      </div>
                    )}
                    {ep.tourProducts && ep.tourProducts.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-[#1F5E63]">
                          GT TOUR 3대 상품 원클릭 연동:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ep.tourProducts.map((tp) => (
                            <button
                              key={tp.code}
                              type="button"
                              onClick={() =>
                                handleExportSeason2ToGtStudio(ep, tp, "JP")
                              }
                              className="inline-flex items-center gap-1 rounded-[3px] border border-[#1F5E63]/40 bg-[#1F5E63]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                              title={`${tp.nameKo} 상품을 GT TOUR 스튜디오로 즉시 내보내기`}
                            >
                              <span>{tp.nameKo}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setRoute({ page: "season2Detail", code: ep.code })
                      }
                      className="inline-block text-[11px] font-semibold text-[#1F5E63] hover:underline"
                    >
                      상세 시나리오 · 컷/대본 열기 →
                    </button>
                  </td>
                  <td className="px-3 py-3 align-top">
                    {renderSeason2StatusControl(ep.code, ep.status, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 인터랙티브 카드 그리드 (10화 상세 카드 뷰) */}
        <section className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.code}
              className={`flex flex-col justify-between rounded-[8px] border bg-white p-4 space-y-3 ${
                ep.code === "B1"
                  ? "border-2 border-emerald-500"
                  : ep.part === "PART_C"
                  ? "border-[#1F5E63]/50"
                  : "border-zinc-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[2px] bg-zinc-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                      {ep.code} (제{ep.no}화)
                    </span>
                    <Badge
                      variant={
                        ep.format === "HYBRID_TRANSITION"
                          ? "emerald"
                          : ep.format === "ANIME_100"
                          ? "amber"
                          : "teal"
                      }
                    >
                      {ep.formatLabel}
                    </Badge>
                  </div>
                  <EpisodeStatusBadge status={ep.status} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {ep.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#1F5E63]">
                    {ep.subtitle}
                  </p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {ep.logline}
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-[6px] border border-zinc-100 bg-zinc-50 p-2.5 text-[11px]">
                  <div>
                    <span className="text-zinc-400">감정 곡선:</span>{" "}
                    <span className="font-mono font-semibold text-zinc-800">
                      {ep.emotionCurve}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400">배경 장소:</span>{" "}
                    <span className="font-medium text-zinc-800">{ep.place}</span>
                  </div>
                </div>

                {/* PART C 3대 투어 상품 브릿지 버튼 (카드 내 바로 실행) */}
                {ep.tourProducts && ep.tourProducts.length > 0 && (
                  <div className="rounded-[6px] border border-[#1F5E63]/30 bg-[#1F5E63]/5 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#1F5E63]">
                        GT TOUR 스튜디오 3대 투어 상품 데모 연동
                      </span>
                      <Badge variant="tealSolid">PART C 수익 브릿지</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                      {ep.tourProducts.map((tp) => (
                        <button
                          key={tp.code}
                          type="button"
                          onClick={() =>
                            handleExportSeason2ToGtStudio(ep, tp, "JP")
                          }
                          className="flex items-center justify-between rounded-[4px] border border-[#1F5E63]/40 bg-white px-2.5 py-1.5 text-left text-[11px] font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                        >
                          <span>{tp.nameKo}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                {renderSeason2StatusControl(ep.code, ep.status, true)}
                <button
                  type="button"
                  onClick={() =>
                    setRoute({ page: "season2Detail", code: ep.code })
                  }
                  className="inline-flex items-center gap-1 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#17494d]"
                >
                  <span>
                    {ep.code === "B1"
                      ? "B1 전환 프레임 · AC-20 검수 열기"
                      : ep.part === "PART_C"
                      ? "투어 상품 브릿지 · 상세 열기"
                      : "시나리오 · 대본 상세 열기"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  };

  // --- 화면 12: 시즌 2 데뷔 서사 회차별 상세 화면 (/season2/[code]) ---
  const renderSeason2Detail = (code: Season2Episode["code"]) => {
    const allEpisodes = store.season2Episodes ?? INITIAL_SEASON2_EPISODES;
    const ep = allEpisodes.find((e) => e.code === code) ?? allEpisodes[0];
    const currentScript =
      ep.channelScripts.find((s) => s.channelCode === season2ChannelTab) ??
      ep.channelScripts[0];

    const identityChecks = ep.identityChecks ?? [];
    const matchedCount = identityChecks.filter((c) => c.matched).length;
    const allIdentityMatched =
      identityChecks.length > 0 && matchedCount === identityChecks.length;
    const readyMemberCount = store.members.filter(
      (m) => getMemberAnimeStatus(m) === "READY"
    ).length;

    const linkedDevice = ep.participationDeviceCode
      ? (store.season2Devices ?? INITIAL_SEASON2_DEVICES).find(
          (d) => d.code === ep.participationDeviceCode
        )
      : undefined;

    return (
      <div className="space-y-4">
        {/* 상단 네비게이션 & 회차 빠른 전환 바 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRoute({ page: "season2" })}
              className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>시즌 2 보드(10화)로</span>
            </button>
            <div className="flex flex-wrap gap-1">
              {allEpisodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() =>
                    setRoute({ page: "season2Detail", code: item.code })
                  }
                  className={`rounded-[3px] px-2 py-1 font-mono text-[11px] font-bold transition-colors ${
                    item.code === ep.code
                      ? "bg-[#1F5E63] text-white"
                      : item.code === "B1"
                      ? "border border-emerald-400 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {item.code}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onExportToGtStudio && (
              <button
                type="button"
                onClick={() =>
                  handleExportSeason2ToGtStudio(
                    ep,
                    ep.tourProducts?.[0],
                    season2ChannelTab
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17494d]"
              >
                <span>GT TOUR 스튜디오로 이 회차 내보내기</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 에피소드 마스터 헤더 카드 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[2px] bg-zinc-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  SEASON 2 · {ep.code} (제{ep.no}화)
                </span>
                <Badge variant="teal">{ep.partLabel}</Badge>
                <Badge
                  variant={
                    ep.format === "HYBRID_TRANSITION"
                      ? "emerald"
                      : ep.format === "ANIME_100"
                      ? "amber"
                      : "tealSolid"
                  }
                >
                  {ep.formatLabel}
                </Badge>
                <Badge variant="default">{ep.releasePhase}</Badge>
              </div>
              <h1 className="text-lg font-bold text-zinc-900">{ep.title}</h1>
              <p className="text-xs font-semibold text-[#1F5E63]">
                {ep.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              {renderSeason2StatusControl(ep.code, ep.status)}
            </div>
          </div>

          <p className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 leading-relaxed">
            <strong className="text-zinc-900">로그라인 (Logline):</strong>{" "}
            {ep.logline}
          </p>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4 text-xs">
            <div className="rounded-[6px] border border-zinc-200 p-2.5">
              <div className="text-[11px] text-zinc-400">감정 곡선 · 밀도</div>
              <div className="mt-0.5 font-mono font-bold text-zinc-900">
                {ep.emotionCurve} ({ep.emotionIntensity}%)
              </div>
              <div className="text-[11px] text-[#1F5E63]">
                {ep.emotionKeyword}
              </div>
            </div>
            <div className="rounded-[6px] border border-zinc-200 p-2.5">
              <div className="text-[11px] text-zinc-400">주요 촬영/배경 장소</div>
              <div className="mt-0.5 font-semibold text-zinc-900">
                {ep.place}
              </div>
              <div className="font-mono text-[11px] text-zinc-500">
                러닝타임 {ep.durationSec}초
              </div>
            </div>
            <div className="rounded-[6px] border border-zinc-200 p-2.5">
              <div className="text-[11px] text-zinc-400">주연/참여 멤버</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {ep.leadMemberIds.map((mId) => {
                  const m = store.members.find((item) => item.id === mId);
                  return (
                    <span
                      key={mId}
                      className="rounded-[2px] bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white"
                    >
                      {mId} {m?.nameKo}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[6px] border border-zinc-200 p-2.5">
              <div className="text-[11px] text-zinc-400">
                오늘의 핵심 한국어 3표현
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {ep.expressions.map((expr, i) => (
                  <span
                    key={i}
                    className="rounded-[2px] bg-[#1F5E63]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#1F5E63]"
                  >
                    「{expr}」
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ★ B1 「관객 서른 명」 전용: [애니 ➔ 실사 전환 프레임 (B1 쇼케이스 첫 프레임)] & [캐릭터 시트 일치 검수 게이트 (AC-20)] */}
        {ep.code === "B1" && ep.b1TransitionFrameSpec && (
          <section className="rounded-[8px] border-2 border-emerald-600 bg-white p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="emerald">
                    RULE 3 · B1 전환점 & AC-20 안전 게이트
                  </Badge>
                  <h2 className="text-sm font-bold text-zinc-900">
                    [애니 ➔ 실사 전환 프레임 (B1 쇼케이스 첫 프레임)] & 5인 캐릭터 일치 검수 게이트 (AC-20)
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-zinc-600">
                  B1 「관객 서른 명」의 쇼케이스 첫 스포트라이트 점등 순간(00:28.12), 2D 애니메이션이 5인 실사로 매치컷 디졸브됩니다. 5인 전원의 애니 시트(READY) 및 실사 일치 검수가 완료되어야만 생성(GENERATED) 및 발행 단계로 진행할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    ep.b1TransitionFrameSpec.verified &&
                    allIdentityMatched &&
                    readyMemberCount === 5
                      ? "tealSolid"
                      : "red"
                  }
                >
                  {ep.b1TransitionFrameSpec.verified &&
                  allIdentityMatched &&
                  readyMemberCount === 5
                    ? "AC-20 전환 게이트 통과 완료"
                    : `게이트 잠김 (일치 ${matchedCount}/5 · 시트 READY ${readyMemberCount}/5)`}
                </Badge>
                <button
                  type="button"
                  onClick={() => {
                    // 5인 전원 애니 시트 READY + B1 일치 체크 일괄 완료
                    setStore((prev) => ({
                      ...prev,
                      members: prev.members.map((m) => ({
                        ...m,
                        animeSheetStatus: "READY",
                        animeSheetUrl:
                          m.animeSheetUrl ?? COMPOSITE_ANIME_SHEET_URL,
                      })),
                      season2Episodes: (
                        prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
                      ).map((item) =>
                        item.code === "B1" && item.b1TransitionFrameSpec
                          ? {
                              ...item,
                              b1TransitionFrameSpec: {
                                ...item.b1TransitionFrameSpec,
                                verified: true,
                              },
                              identityChecks: (item.identityChecks ?? []).map(
                                (chk) => ({ ...chk, matched: true })
                              ),
                            }
                          : item
                      ),
                    }));
                    setSeason2StatusErrors((prev) => {
                      const next = { ...prev };
                      delete next.B1;
                      return next;
                    });
                  }}
                  className="rounded-[4px] bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  M4 성인 비율 승인 & 5인 전원 AC-20 일괄 확정
                </button>
              </div>
            </div>

            {/* 1) 애니 ➔ 실사 전환 프레임 (B1 쇼케이스 첫 프레임) 인터랙티브 디졸브 비교 뷰어 */}
            <div className="rounded-[8px] border border-zinc-200 bg-zinc-900 p-4 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="rounded-[2px] bg-emerald-500 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-950">
                    B1 SHOWCASE FIRST FRAME
                  </span>
                  <h3 className="mt-1 text-sm font-bold">
                    애니 ➔ 실사 전환 프레임 ({ep.b1TransitionFrameSpec.timecode})
                  </h3>
                </div>
                <label className="inline-flex items-center gap-2 rounded-[4px] border border-emerald-400/50 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ep.b1TransitionFrameSpec.verified}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setStore((prev) => ({
                        ...prev,
                        season2Episodes: (
                          prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
                        ).map((item) =>
                          item.code === "B1" && item.b1TransitionFrameSpec
                            ? {
                                ...item,
                                b1TransitionFrameSpec: {
                                  ...item.b1TransitionFrameSpec,
                                  verified: checked,
                                },
                              }
                            : item
                        ),
                      }));
                    }}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <span>B1 쇼케이스 첫 프레임 매치컷 검수 완료</span>
                </label>
              </div>

              {/* 디졸브 슬라이더 컨트롤 */}
              <div className="flex flex-wrap items-center gap-3 rounded-[6px] bg-zinc-800 px-3 py-2 text-xs">
                <span className="font-mono text-[11px] text-amber-300">
                  0% (2D 애니 마지막 프레임)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={b1DissolvePct}
                  onChange={(e) => setB1DissolvePct(Number(e.target.value))}
                  className="flex-1 accent-emerald-400 cursor-pointer"
                />
                <span className="font-mono text-[11px] text-emerald-300">
                  100% (B1 쇼케이스 실사 첫 프레임)
                </span>
                <span className="rounded-[3px] bg-zinc-950 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  디졸브 {b1DissolvePct}%
                </span>
              </div>

              {/* 5인 멤버 동시 디졸브 프리뷰 그리드 */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {store.members.map((m) => (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-[6px] border border-zinc-700 bg-zinc-950"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {/* 하단 레이어: 2D 애니 시트 (사분면 자동 크롭) */}
                      <div className="absolute inset-0">
                        <AnimeSheetQuadrantView
                          member={m}
                          className="h-full w-full"
                          showOverlayBadge={false}
                        />
                      </div>
                      {/* 상단 레이어: 실사 쇼케이스 시트 (b1DissolvePct 투명도 연동) */}
                      <img
                        src={m.photoSheetUrl}
                        alt={`${m.nameKo} 실사 전환 프레임`}
                        className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-150"
                        style={{ opacity: b1DissolvePct / 100 }}
                      />
                      <div className="pointer-events-none absolute inset-x-1.5 top-1.5 flex items-center justify-between">
                        <span className="rounded-[2px] bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                          {m.id} {m.nameKo}
                        </span>
                        <span className="rounded-[2px] bg-emerald-600/90 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                          {b1DissolvePct < 30
                            ? "2D 작화"
                            : b1DissolvePct > 70
                            ? "4K 실사"
                            : "매치컷"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px] text-zinc-300">
                <div className="rounded-[4px] border border-zinc-700 bg-zinc-800/70 p-2.5">
                  <div className="font-bold text-amber-300">
                    전환 직전 (2D 애니메이션 마지막 컷)
                  </div>
                  <p className="mt-1">{ep.b1TransitionFrameSpec.animeLastFrameDesc}</p>
                </div>
                <div className="rounded-[4px] border border-zinc-700 bg-zinc-800/70 p-2.5">
                  <div className="font-bold text-emerald-300">
                    전환 직후 (B1 쇼케이스 실사 첫 프레임)
                  </div>
                  <p className="mt-1">{ep.b1TransitionFrameSpec.liveFirstFrameDesc}</p>
                </div>
              </div>
            </div>

            {/* 2) 5인 멤버별 캐릭터 시트 일치 검수 게이트 (AC-20) 체크리스트 */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-zinc-900">
                  캐릭터 시트 일치 검수 게이트 (AC-20) — 멤버별 2x2 애니 시트 ↔ 실사 쇼케이스 시트 대조
                </h3>
                <span className="font-mono text-[11px] text-zinc-500">
                  5인 모두 체크(matched = true) 및 시트 상태 READY 필수
                </span>
              </div>

              <div className="space-y-2">
                {identityChecks.map((chk) => {
                  const member = store.members.find(
                    (m) => m.id === chk.memberId
                  );
                  const memberSheetSt = member
                    ? getMemberAnimeStatus(member)
                    : "NONE";
                  const isPass = chk.matched && memberSheetSt === "READY";

                  return (
                    <div
                      key={chk.memberId}
                      className={`flex flex-col justify-between gap-3 rounded-[6px] border p-3 text-xs sm:flex-row sm:items-center ${
                        isPass
                          ? "border-emerald-300 bg-emerald-50/40"
                          : "border-amber-300 bg-amber-50/60"
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-2 font-bold text-zinc-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={chk.matched}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setStore((prev) => ({
                                  ...prev,
                                  season2Episodes: (
                                    prev.season2Episodes ??
                                    INITIAL_SEASON2_EPISODES
                                  ).map((item) =>
                                    item.code === "B1"
                                      ? {
                                          ...item,
                                          identityChecks: (
                                            item.identityChecks ?? []
                                          ).map((c) =>
                                            c.memberId === chk.memberId
                                              ? { ...c, matched: checked }
                                              : c
                                          ),
                                        }
                                      : item
                                  ),
                                }));
                              }}
                              className="h-4 w-4 accent-[#1F5E63]"
                            />
                            <span>{chk.checkpointLabel}</span>
                          </label>
                          {member && (
                            <AnimeSheetStatusBadge member={member} compact />
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-600">
                          <strong>의상 연속성:</strong> {chk.outfitMatchNote}
                        </div>
                        <div className="text-[11px] text-zinc-600">
                          <strong>이목구비·등신대 비율:</strong>{" "}
                          {chk.faceMatchNote}
                        </div>
                      </div>

                      {member && (
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={memberSheetSt}
                            onChange={(e) => {
                              const nextSt = e.target.value as AnimeSheetStatus;
                              handleUpdateMemberAnimeSheet(member.id, {
                                animeSheetStatus: nextSt,
                                animeSheetUrl:
                                  nextSt === "NONE"
                                    ? null
                                    : member.animeSheetUrl ??
                                      COMPOSITE_ANIME_SHEET_URL,
                              });
                            }}
                            className="rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-800"
                          >
                            <option value="READY">시트 READY</option>
                            <option value="HOLD">시트 HOLD (차단)</option>
                            <option value="NONE">시트 NONE (차단)</option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              setAnimeLightbox({
                                memberId: member.id,
                                viewMode: "QUADRANT",
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100"
                          >
                            <ZoomIn className="h-3 w-3" />
                            <span>시트 확대</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ★ PART C (C1~C3) 전용: [GT TOUR 스튜디오 3대 투어 상품 데모 연동] (공연 정착 셔틀 / 콘서트 나잇 패키지 / VVIP 송영) */}
        {ep.tourProducts && ep.tourProducts.length > 0 && (
          <section className="rounded-[8px] border-2 border-[#1F5E63] bg-white p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="tealSolid">
                    RULE 4 · PART C 투어 상품 브릿지
                  </Badge>
                  <h2 className="text-sm font-bold text-zinc-900">
                    [GT TOUR 스튜디오 투어 상품 데모 연동] — {ep.code} 전국투어 3대 핵심 패스
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-zinc-600">
                  버튼 클릭 시 해당 에피소드의 서사·도시 스팟·투어 혜택이 GT TOUR 크리에이티브 스튜디오의 5장 카드뉴스 및 5대 채널 캠페인으로 즉시 변환됩니다 (공연법 준수: 티켓 비포함 합법 컨시어지).
                </p>
              </div>
              <Badge variant="teal">원클릭 스튜디오 직결</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
              {ep.tourProducts.map((tp, idx) => (
                <div
                  key={tp.code}
                  className="flex flex-col justify-between rounded-[8px] border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-3 hover:border-[#1F5E63]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                        상품 0{idx + 1} · {tp.code}
                      </span>
                      <Badge variant="default">축: {tp.targetAxis}</Badge>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {tp.nameKo}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {tp.summary}
                    </p>

                    <div className="space-y-1 border-t border-zinc-200/80 pt-2">
                      <div className="text-[10px] font-bold text-zinc-500">
                        포함 컨시어지 혜택 (3대 보장):
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-zinc-700">
                        {tp.includedBenefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 border-t border-zinc-200/80 pt-2">
                      <div className="text-[10px] font-bold text-zinc-500">
                        연동 투어 동선 (3 Spots):
                      </div>
                      <div className="text-[11px] font-medium text-[#1F5E63]">
                        {tp.spots.join(" ➔ ")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-zinc-200 pt-2.5">
                    <div className="font-mono text-[10px] text-zinc-500">
                      {tp.priceTierNote}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleExportSeason2ToGtStudio(
                          ep,
                          tp,
                          season2ChannelTab
                        )
                      }
                      className="flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-2 text-xs font-bold text-white hover:bg-[#17494d] transition-colors"
                    >
                      <span>
                        [GT TOUR 스튜디오 투어 상품 데모 연동] ({tp.nameKo})
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 연결된 VIII장 참여 장치 (A3, B3, B4, C2 해당 회차인 경우) */}
        {linkedDevice && (
          <section className="rounded-[8px] border border-amber-300 bg-amber-50/50 p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="amber">VIII장 참여 장치 연동 회차</Badge>
                <h2 className="text-xs font-bold text-zinc-900">
                  {linkedDevice.title} — 현재{" "}
                  {linkedDevice.currentCount.toLocaleString()}
                  {linkedDevice.unit} / 목표{" "}
                  {linkedDevice.targetCount.toLocaleString()}
                  {linkedDevice.unit}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRoute({ page: "engagement" })}
                className="text-xs font-bold text-[#1F5E63] hover:underline"
              >
                참여 관리 탭에서 상세 투표/공모 운영 →
              </button>
            </div>
            <p className="text-xs text-zinc-700">{linkedDevice.description}</p>
          </section>
        )}

        {/* 시나리오 씬 비트 (S1~S4) & 3채널 독립 나레이션 대본 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">
                  회차 시퀀스 비트 (Scene Beats)
                </h2>
                <p className="text-[11px] text-zinc-500">
                  각 시퀀스의 비주얼 타입(ANIME / TRANSITION_MATCHCUT / LIVE_ACTION) 및 연출 지시
                </p>
              </div>
              <Badge variant="default">{ep.beats.length}개 시퀀스</Badge>
            </div>

            <div className="space-y-2.5">
              {ep.beats.map((beat) => (
                <div
                  key={beat.id}
                  className={`rounded-[6px] border p-3 text-xs space-y-1.5 ${
                    beat.visualType === "TRANSITION_MATCHCUT"
                      ? "border-emerald-400 bg-emerald-50/50"
                      : beat.done
                      ? "border-zinc-200 bg-zinc-50/70"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={beat.done}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setStore((prev) => ({
                            ...prev,
                            season2Episodes: (
                              prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
                            ).map((item) =>
                              item.code === ep.code
                                ? {
                                    ...item,
                                    beats: item.beats.map((b) =>
                                      b.id === beat.id
                                        ? { ...b, done: checked }
                                        : b
                                    ),
                                  }
                                : item
                            ),
                          }));
                        }}
                        className="h-4 w-4 accent-[#1F5E63]"
                      />
                      <span className="rounded-[2px] bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                        {beat.code}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#1F5E63]">
                        {beat.timeRange}
                      </span>
                    </div>
                    <Badge
                      variant={
                        beat.visualType === "TRANSITION_MATCHCUT"
                          ? "emerald"
                          : beat.visualType === "ANIME"
                          ? "amber"
                          : "teal"
                      }
                    >
                      {beat.visualType}
                    </Badge>
                  </div>
                  <div className="font-bold text-zinc-900">
                    {beat.sceneTitle}
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    {beat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
              <div>
                <h2 className="text-xs font-bold text-zinc-900">
                  3채널 독립 나레이션 대본 (JP / US / KR)
                </h2>
                <p className="text-[11px] text-zinc-500">
                  단순 번역 금지 · 채널별 정서와 호흡에 맞춘 독립 대본
                </p>
              </div>
              <div className="flex gap-1">
                {(["JP", "US", "KR"] as const).map((chCode) => (
                  <button
                    key={chCode}
                    type="button"
                    onClick={() => setSeason2ChannelTab(chCode)}
                    className={`rounded-[4px] px-2.5 py-1 font-mono text-xs font-bold ${
                      season2ChannelTab === chCode
                        ? "bg-[#1F5E63] text-white"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {chCode}
                  </button>
                ))}
              </div>
            </div>

            {currentScript && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800">
                    [{currentScript.channelCode}] 채널 보이스오버 대본
                  </span>
                  <select
                    value={currentScript.voStatus}
                    onChange={(e) => {
                      const nextVo = e.target.value as VersionStatus;
                      setStore((prev) => ({
                        ...prev,
                        season2Episodes: (
                          prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
                        ).map((item) =>
                          item.code === ep.code
                            ? {
                                ...item,
                                channelScripts: item.channelScripts.map((s) =>
                                  s.channelCode === currentScript.channelCode
                                    ? { ...s, voStatus: nextVo }
                                    : s
                                ),
                              }
                            : item
                        ),
                      }));
                    }}
                    className="rounded-[4px] border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold"
                  >
                    {(
                      ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as VersionStatus[]
                    ).map((st) => (
                      <option key={st} value={st}>
                        {VERSION_STATUS_LABELS[st]} ({st})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={6}
                  value={currentScript.narration}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      season2Episodes: (
                        prev.season2Episodes ?? INITIAL_SEASON2_EPISODES
                      ).map((item) =>
                        item.code === ep.code
                          ? {
                              ...item,
                              channelScripts: item.channelScripts.map((s) =>
                                s.channelCode === currentScript.channelCode
                                  ? { ...s, narration: val }
                                  : s
                              ),
                            }
                          : item
                      ),
                    }));
                  }}
                  className="w-full rounded-[4px] border border-zinc-300 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-900 focus:border-[#1F5E63] focus:outline-none"
                />

                {onExportToGtStudio && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleExportSeason2ToGtStudio(
                          ep,
                          ep.tourProducts?.[0],
                          currentScript.channelCode
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-3 py-1.5 text-xs font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors"
                    >
                      <span>
                        [{currentScript.channelCode}] 대본으로 GT TOUR 스튜디오 캠페인 생성
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900">
      {/* 모바일 상단 바 (375px ~ 767px) */}
      <header className="md:hidden sticky top-12 z-30 flex items-center justify-between border-b border-zinc-200 bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-[#1F5E63]" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            K-soulmate 운영 콘솔
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-[4px] border border-zinc-200 p-1.5 text-zinc-700 hover:bg-zinc-100"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* 모바일 드로어 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-50 flex w-60 flex-col border-r border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-[#1F5E63]">
                  K-soulmate
                </p>
                <p className="text-sm font-bold text-zinc-900">
                  콘텐츠 운영 콘솔
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[4px] p-1 text-zinc-500 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setRoute({ page: item.key });
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                      active
                        ? "bg-[#1F5E63] text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-white" : "text-zinc-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{item.label}</div>
                      <div
                        className={`truncate text-[10px] ${
                          active ? "text-zinc-200" : "text-zinc-400"
                        }`}
                      >
                        {item.subLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* 데스크톱 고정 좌측 사이드바 */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:top-12 md:bottom-0 md:left-0 border-r border-zinc-200 bg-white z-20">
        <div className="border-b border-zinc-200 px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-[2px] bg-[#1F5E63]" />
            <span className="text-[11px] font-semibold tracking-wider text-[#1F5E63]">
              K-SOULMATE
            </span>
          </div>
          <h1 className="mt-0.5 text-sm font-bold text-zinc-900">
            콘텐츠 운영 콘솔
          </h1>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            5인 · 오리진 5편 · 시즌1(12화) · 시즌2(10화)
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2.5 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setRoute({ page: item.key })}
                className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#1F5E63] text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-white" : "text-zinc-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate leading-snug">{item.label}</div>
                  <div
                    className={`truncate text-[10px] leading-tight ${
                      active ? "text-zinc-200" : "text-zinc-400"
                    }`}
                  >
                    {item.subLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 px-4 py-2.5 text-[11px] text-zinc-500 space-y-0.5">
          <div className="flex items-center justify-between">
            <span>운영 단계</span>
            <span className="font-mono font-semibold text-zinc-700">
              Phase 0 ~ 4 통합
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>주당 기준 공수</span>
            <span className="font-mono text-zinc-700">25.3시간</span>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="md:pl-56">
        <main className="mx-auto max-w-6xl px-3.5 py-4 sm:px-5 sm:py-5">
          {route.page === "dashboard" && renderDashboard()}
          {route.page === "members" && renderMembers()}
          {route.page === "origins" && renderOrigins()}
          {route.page === "originDetail" &&
            renderOriginDetail(route.originNo)}
          {route.page === "episodes" && renderEpisodes()}
          {route.page === "episodeDetail" &&
            renderEpisodeDetail(route.episodeNo, route.channelCode)}
          {route.page === "channelEdit" &&
            renderChannelEditPage(route.episodeNo, route.channelCode)}
          {route.page === "season2" && renderSeason2()}
          {route.page === "season2Detail" &&
            renderSeason2Detail(route.code)}
          {route.page === "credits" && <CreditsView />}
          {route.page === "compliance" && renderCompliance()}
          {route.page === "engagement" && renderEngagement()}
        </main>
      </div>

      {/* 멤버 상세 모달 */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3.5"
          onClick={() => setSelectedMember(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[8px] border border-zinc-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-xs font-bold text-white">
                  {selectedMember.id}
                </span>
                <h3 className="text-sm font-bold text-zinc-900">
                  {selectedMember.nameKo} ({selectedMember.nameJa} ·{" "}
                  {selectedMember.nameZh})
                </h3>
                {selectedMember.locked ? (
                  <Badge variant="tealSolid">락 확정</Badge>
                ) : (
                  <Badge variant="amber">락 미확정</Badge>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded-[4px] p-1 text-zinc-500 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-800">
                    실사 캐릭터 시트 원본 (검증 완료)
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {selectedMember.nationality} · {selectedMember.position} ·{" "}
                    {selectedMember.age}세 · {selectedMember.heightCm}cm
                  </span>
                </div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-100">
                  <img
                    src={selectedMember.photoSheetUrl}
                    alt={`${selectedMember.nameKo} 실사 캐릭터 시트`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-[6px] border border-zinc-200 bg-zinc-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    생성 고정 프롬프트 (outfitSpec + faceSpec)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyPrompt(selectedMember, e)}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#17494d]"
                  >
                    {copiedMemberId === selectedMember.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> 복사 완료
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> 프롬프트 복사
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-500">
                      고정 의상 (outfitSpec)
                    </div>
                    <p className="mt-0.5 rounded-[4px] border border-zinc-200 bg-white p-2 font-mono text-[11px] text-zinc-800">
                      {selectedMember.outfitSpec}
                    </p>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-500">
                      얼굴 고정 조건 (faceSpec)
                    </div>
                    <p className="mt-0.5 rounded-[4px] border border-zinc-200 bg-white p-2 font-mono text-[11px] text-zinc-800">
                      {selectedMember.faceSpec}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[6px] border border-zinc-200 p-3.5 text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-zinc-900">
                      애니메이션 캐릭터 시트 (B1~B6 작화 기준)
                    </span>
                    <p className="text-[11px] text-zinc-500">
                      {selectedMember.animeSheetLabel ??
                        "2x2 그리드 설정 시트 매핑"}
                    </p>
                  </div>
                  <AnimeSheetStatusBadge member={selectedMember} />
                </div>

                <div className="overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-100">
                  <AnimeSheetQuadrantView
                    member={selectedMember}
                    className="aspect-[16/10]"
                    onClickZoom={() =>
                      setAnimeLightbox({
                        memberId: selectedMember.id,
                        viewMode: "QUADRANT",
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      애니 시트 상태 (AC-20 오리진 게이트 연동)
                    </label>
                    <select
                      value={getMemberAnimeStatus(selectedMember)}
                      onChange={(e) => {
                        const nextSt = e.target.value as AnimeSheetStatus;
                        const def =
                          DEFAULT_MEMBER_ANIME_SHEETS[selectedMember.id];
                        handleUpdateMemberAnimeSheet(selectedMember.id, {
                          animeSheetStatus: nextSt,
                          animeSheetUrl:
                            nextSt === "NONE"
                              ? null
                              : selectedMember.animeSheetUrl ??
                                def?.animeSheetUrl ??
                                COMPOSITE_ANIME_SHEET_URL,
                        });
                      }}
                      className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                    >
                      <option value="READY">
                        제작완료 (READY / COMPLETED)
                      </option>
                      <option value="HOLD">
                        파일럿 3/5 보류 (HOLD — 게이트 차단)
                      </option>
                      <option value="NONE">
                        미제작 (NONE — 게이트 차단)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      2x2 그리드 사분면 크롭 위치
                    </label>
                    <select
                      value={selectedMember.animeSheetQuadrant ?? "SINGLE"}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextQuad: AnimeSheetQuadrant =
                          val === "SINGLE"
                            ? null
                            : (val as "TL" | "TR" | "BL" | "BR");
                        handleUpdateMemberAnimeSheet(selectedMember.id, {
                          animeSheetUrl: nextQuad
                            ? COMPOSITE_ANIME_SHEET_URL
                            : selectedMember.animeSheetUrl,
                          animeSheetQuadrant: nextQuad,
                          animeSheetStatus: "READY",
                          animeSheetLabel: nextQuad
                            ? `${QUADRANT_SHORT_LABELS[nextQuad]} · 2x2 시트`
                            : "단독 이미지 시트",
                        });
                      }}
                      className="mt-1 w-full rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                    >
                      <option value="TL">
                        좌측 상단 (Ji-min · 0% 0%) — 한지후(M1)
                      </option>
                      <option value="TR">
                        우측 상단 (Eden · 100% 0%) — 이든 박(M2)
                      </option>
                      <option value="BL">
                        좌측 하단 (Yu-hao · 0% 100%) — 린위하오(M3)
                      </option>
                      <option value="BR">
                        우측 하단 (Aiman · 100% 100%) — 아이만(M5)
                      </option>
                      <option value="SINGLE">단독 이미지 (크롭 없음)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#17494d]">
                      <Upload className="h-3.5 w-3.5" />
                      <span>개별 캐릭터 시트 이미지 업로드/변경</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleUploadMemberAnimeSheet(
                            selectedMember.id,
                            e.target.files?.[0]
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleResetMemberAnimeSheet(selectedMember.id)
                      }
                      className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>기본 매핑 복원</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAnimeLightbox({
                        memberId: selectedMember.id,
                        viewMode: "FULL_SHEET",
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-[#1F5E63] hover:bg-zinc-100"
                  >
                    <Grid className="h-3.5 w-3.5" />
                    <span>4인 합본 2x2 시트 전체 확대</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 고해상도 애니 시트 확대 보기 라이트박스 모달 (개별 사분면 크롭 & 2x2 합본 원본 전환) */}
      {animeLightbox &&
        (() => {
          const lbMember =
            store.members.find((m) => m.id === animeLightbox.memberId) ??
            store.members[0];
          const quad = lbMember?.animeSheetQuadrant ?? null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3.5"
              onClick={() => setAnimeLightbox(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[8px] border border-zinc-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
                      {lbMember.id}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {lbMember.nameKo} — 애니 시트 (B1~B6 작화 기준) 고해상도 뷰어
                    </h3>
                    <AnimeSheetStatusBadge member={lbMember} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setAnimeLightbox({
                          ...animeLightbox,
                          viewMode: "QUADRANT",
                        })
                      }
                      className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold ${
                        animeLightbox.viewMode === "QUADRANT"
                          ? "bg-[#1F5E63] text-white"
                          : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      개별 캐릭터 크롭 확대
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnimeLightbox({
                          ...animeLightbox,
                          viewMode: "FULL_SHEET",
                        })
                      }
                      className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold ${
                        animeLightbox.viewMode === "FULL_SHEET"
                          ? "bg-[#1F5E63] text-white"
                          : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      4인 합본 2x2 원본 전체 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnimeLightbox(null)}
                      className="ml-1 rounded-[4px] p-1 text-zinc-500 hover:bg-zinc-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  {/* 멤버 빠른 전환 탭 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-zinc-200 bg-zinc-50 p-2">
                    <div className="flex flex-wrap gap-1.5">
                      {store.members.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            setAnimeLightbox({
                              memberId: m.id,
                              viewMode: animeLightbox.viewMode,
                            })
                          }
                          className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors ${
                            m.id === lbMember.id
                              ? "bg-zinc-900 text-white"
                              : "bg-white text-zinc-700 border border-zinc-200 hover:border-[#1F5E63]"
                          }`}
                        >
                          {m.id} {m.nameKo}
                        </button>
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {lbMember.animeSheetLabel ?? "사분면 자동 크롭"}
                    </span>
                  </div>

                  {animeLightbox.viewMode === "QUADRANT" ? (
                    <div className="overflow-hidden rounded-[6px] border border-zinc-200 bg-[#f5f3ef]">
                      <AnimeSheetQuadrantView
                        member={lbMember}
                        className="aspect-[16/10] w-full"
                        showOverlayBadge={false}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative overflow-hidden rounded-[6px] border border-zinc-200 bg-[#f5f3ef]">
                        <img
                          src={COMPOSITE_ANIME_SHEET_URL}
                          alt="4인 애니메이션 캐릭터 설정 시트 2x2 원본"
                          className="h-auto w-full object-contain"
                        />
                        {/* 2x2 사분면 가이드 오버레이 */}
                        <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
                          {(
                            [
                              {
                                q: "TL",
                                id: "M1",
                                label: "좌상단 (Ji-min) → M1 한지후",
                              },
                              {
                                q: "TR",
                                id: "M2",
                                label: "우상단 (Eden) → M2 이든 박",
                              },
                              {
                                q: "BL",
                                id: "M3",
                                label: "좌하단 (Yu-hao) → M3 린위하오",
                              },
                              {
                                q: "BR",
                                id: "M5",
                                label: "우하단 (Aiman) → M5 아이만",
                              },
                            ] as const
                          ).map((cell) => {
                            const isSelected = quad === cell.q;
                            return (
                              <div
                                key={cell.q}
                                className={`flex items-end justify-start p-2 transition-colors ${
                                  isSelected
                                    ? "border-2 border-[#1F5E63] bg-[#1F5E63]/10"
                                    : "border border-dashed border-zinc-400/50"
                                }`}
                              >
                                <span
                                  className={`rounded-[3px] px-2 py-0.5 font-mono text-[11px] font-bold ${
                                    isSelected
                                      ? "bg-[#1F5E63] text-white"
                                      : "bg-zinc-900/75 text-white"
                                  }`}
                                >
                                  {cell.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
