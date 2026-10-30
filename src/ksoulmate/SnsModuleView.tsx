import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Download,
  ExternalLink,
  MessageSquare,
  Vote,
  Inbox,
  BarChart3,
  Calendar,
  LayoutList,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  type ConsoleStoreState,
  type SnsEpisode,
  type SnsStatus,
  type SnsBeatCode,
  SNS_STATUS_LABELS,
  SNS_STATUS_ORDER,
} from "./types";
import { canAdvanceSns, scanSnsBannedWords } from "./rules";
import {
  INITIAL_SNS_EPISODES,
  INITIAL_SNS_QUESTIONS,
  INITIAL_SNS_TOPIC_VOTES,
  INITIAL_SNS_UGC,
  INITIAL_SNS_ENGAGEMENT,
  JIHU_THREE_PRINCIPLES,
  SNS_BANNED_WORDS,
} from "./snsSeed";

export type SnsSubTab =
  | "board"
  | "questions"
  | "topics"
  | "ugc"
  | "engage"
  | "calendar";

interface SnsModuleProps {
  store: ConsoleStoreState;
  setStore: React.Dispatch<React.SetStateAction<ConsoleStoreState>>;
  mode: "LIST" | "DETAIL" | "CARD" | "FULL";
  snsNo?: number;
  onNavigateList: () => void;
  onNavigateDetail: (no: number) => void;
  onNavigateCard: (no: number) => void;
  onExportToGtStudio?: (ep: SnsEpisode, channel: "IG" | "X" | "LINE") => void;
}

export function SnsModuleView({
  store,
  setStore,
  mode,
  snsNo = 1,
  onNavigateList,
  onNavigateDetail,
  onNavigateCard,
  onExportToGtStudio,
}: SnsModuleProps) {
  const snsEpisodes = store.snsEpisodes ?? INITIAL_SNS_EPISODES;
  const snsQuestions = store.snsQuestions ?? INITIAL_SNS_QUESTIONS;
  const snsTopicVotes = store.snsTopicVotes ?? INITIAL_SNS_TOPIC_VOTES;
  const snsUgcList = store.snsUgcList ?? INITIAL_SNS_UGC;
  const snsEngagements = store.snsEngagements ?? INITIAL_SNS_ENGAGEMENT;

  const [subTab, setSubTab] = useState<SnsSubTab>("board");
  const [memberFilter, setMemberFilter] = useState<string>("ALL");
  const [statusErrors, setStatusErrors] = useState<Record<number, string>>({});
  const [activeCopyChannel, setActiveCopyChannel] = useState<
    "IG" | "X" | "LINE"
  >("IG");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionHandle, setNewQuestionHandle] = useState("@seoul_fan");
  const [newQuestionEp, setNewQuestionEp] = useState("E1");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentEp =
    snsEpisodes.find((e) => e.no === snsNo) ?? snsEpisodes[0];

  const handleTransitionStatus = (
    targetNo: number,
    targetStatus: SnsStatus
  ) => {
    const ep = snsEpisodes.find((e) => e.no === targetNo);
    if (!ep) return;
    const gate = canAdvanceSns({ sns: ep, targetStatus });
    if (!gate.ok) {
      setStatusErrors((prev) => ({
        ...prev,
        [targetNo]: gate.reason ?? "단계 이동 차단",
      }));
      return;
    }
    setStatusErrors((prev) => {
      const next = { ...prev };
      delete next[targetNo];
      return next;
    });
    setStore((prev) => ({
      ...prev,
      snsEpisodes: (prev.snsEpisodes ?? INITIAL_SNS_EPISODES).map((item) =>
        item.no === targetNo ? { ...item, status: targetStatus } : item
      ),
    }));
  };

  const renderStatusControl = (
    ep: SnsEpisode,
    compact = false
  ) => {
    const idx = SNS_STATUS_ORDER.indexOf(ep.status);
    const prevSt = idx > 0 ? SNS_STATUS_ORDER[idx - 1] : null;
    const nextSt =
      idx < SNS_STATUS_ORDER.length - 1 ? SNS_STATUS_ORDER[idx + 1] : null;
    const err = statusErrors[ep.no];

    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={!prevSt}
            onClick={(e) => {
              e.stopPropagation();
              if (prevSt) handleTransitionStatus(ep.no, prevSt);
            }}
            className="inline-flex items-center gap-0.5 rounded-[3px] border border-zinc-200 bg-white px-1.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            {!compact && <span>이전</span>}
          </button>

          <select
            aria-label={`SNS ${ep.code} 단계 선택`}
            value={ep.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              handleTransitionStatus(ep.no, e.target.value as SnsStatus)
            }
            className={`rounded-[3px] border px-2 py-1 text-[11px] font-semibold focus:border-[#1F5E63] focus:outline-none ${
              ep.status === "PUBLISHED"
                ? "border-[#1F5E63] bg-[#1F5E63] text-white"
                : ep.status === "REVIEWED"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : ep.status === "CARD_READY"
                ? "border-[#1F5E63]/40 bg-[#1F5E63]/10 text-[#1F5E63]"
                : "border-zinc-300 bg-white text-zinc-800"
            }`}
          >
            {SNS_STATUS_ORDER.map((st) => (
              <option
                key={st}
                value={st}
                className="bg-white text-zinc-900 font-normal"
              >
                {SNS_STATUS_LABELS[st]} ({st})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!nextSt}
            onClick={(e) => {
              e.stopPropagation();
              if (nextSt) handleTransitionStatus(ep.no, nextSt);
            }}
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

  // Canvas drawing for 1080x1350 SOS Card
  useEffect(() => {
    if ((mode !== "CARD" && mode !== "FULL") || !canvasRef.current || !currentEp) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = "#FAF8F5";
    ctx.fillRect(0, 0, W, H);

    // Top Header Band
    ctx.fillStyle = currentEp.card.accentColor || "#1F5E63";
    ctx.fillRect(0, 0, W, 220);

    // Top Tag
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(
      `K-SOULMATE SEOUL SOS CARD · #${currentEp.no} (${currentEp.code})`,
      64,
      78
    );

    // Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(currentEp.card.headline, 64, 152);

    // Place & Member Info
    const member = store.members.find((m) => m.id === currentEp.memberId);
    ctx.fillStyle = "#27272A";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(
      `장소: ${currentEp.place}   |   주인공: ${
        member ? `${member.nameKo}(${member.id})` : currentEp.memberId
      } + 한지후(M1)`,
      64,
      285
    );

    // Helper wrapText
    const drawWrappedBox = (
      title: string,
      body: string,
      y: number,
      boxHeight: number,
      bgColor: string,
      borderColor: string,
      titleColor: string
    ) => {
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.fillRect(64, y, W - 128, boxHeight);
      ctx.strokeRect(64, y, W - 128, boxHeight);

      ctx.fillStyle = titleColor;
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(title, 96, y + 48);

      ctx.fillStyle = "#18181B";
      ctx.font = "28px sans-serif";
      const words = body.split(" ");
      let line = "";
      let lineY = y + 98;
      const maxW = W - 192;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW) {
          ctx.fillText(line, 96, lineY);
          line = w;
          lineY += 42;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, 96, lineY);
    };

    // 1. 현실 장벽 (BLOCK)
    drawWrappedBox(
      "01. 서울 생활 현실 장벽 (BLOCK)",
      currentEp.card.problemText,
      325,
      195,
      "#FFFFFF",
      "#E4E4E7",
      "#71717A"
    );

    // 2. 오늘의 한국어 SOS 문장
    ctx.fillStyle = "#1F5E63";
    ctx.fillRect(64, 550, W - 128, 250);
    ctx.fillStyle = "#A7F3D0";
    ctx.font = "bold 25px sans-serif";
    ctx.fillText("02. 바로 보여주는 한국어 SOS 한 문장", 96, 602);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(`"${currentEp.card.koreanPhrase}"`, 96, 672);

    ctx.fillStyle = "#E4E4E7";
    ctx.font = "italic 26px monospace";
    ctx.fillText(`[발음] ${currentEp.card.pronunciation}`, 96, 735);

    // 3. 현실 해결 팁 (SOLVE)
    drawWrappedBox(
      "03. 서울 생활 해결 가이드 (SOLVE)",
      currentEp.card.solutionTip,
      830,
      205,
      "#FFFFFF",
      "#1F5E63",
      "#1F5E63"
    );

    // 4. 한지후의 한마디 & 독자 질문 (ASK)
    drawWrappedBox(
      `04. 한지후(M1)의 무심한 한마디  —  "${currentEp.card.jihuQuote}"`,
      `💬 독자 질문: ${currentEp.card.askPrompt}`,
      1065,
      185,
      "#F4F4F5",
      "#D4D4D8",
      "#27272A"
    );

    // Footer
    ctx.fillStyle = "#71717A";
    ctx.font = "bold 22px monospace";
    ctx.fillText(
      "K-SOULMATE × GT TOUR CONCIERGE  |  1080×1350 (4:5) SAVE CARD",
      64,
      1305
    );
  }, [mode, currentEp, store.members]);

  const handleDownloadCardPng = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ksoulmate-sos-${currentEp.code.toLowerCase()}-1080x1350.png`;
    a.click();
  };

  // --- 화면 C: 1080×1350 SOS 카드 스튜디오 (/sns/[no]/card) ---
  const renderCardStudioSection = () => (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateDetail(currentEp.no)}
              className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{currentEp.code} 상세로</span>
            </button>
            <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
              1080×1350 SOS 카드
            </span>
            <h1 className="text-base font-bold text-zinc-900">
              [{currentEp.code}] {currentEp.title} — 저장용 카드뉴스 스튜디오
            </h1>
          </div>
          <button
            type="button"
            onClick={handleDownloadCardPng}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#17494d]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>1080×1350 PNG 내보내기</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 좌측: 1080x1350 캔버스 실시간 미리보기 */}
          <div className="lg:col-span-6 rounded-[8px] border border-zinc-200 bg-zinc-900 p-4 flex flex-col items-center">
            <div className="mb-2 flex w-full items-center justify-between text-[11px] text-zinc-300">
              <span className="font-mono font-semibold">
                미리보기 규격: 1080 × 1350 px (4:5 비율)
              </span>
              <span className="rounded-[2px] bg-emerald-900/60 px-2 py-0.5 text-emerald-200">
                저장 유도형 SOS 카드
              </span>
            </div>
            <canvas
              ref={canvasRef}
              className="w-full max-w-[420px] rounded-[4px] border border-zinc-700 shadow-lg"
              style={{ aspectRatio: "4 / 5" }}
            />
          </div>

          {/* 우측: 카드 문구 실시간 편집 */}
          <div className="lg:col-span-6 space-y-3 rounded-[8px] border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-bold text-zinc-900">
              SOS 카드 문구 실시간 편집 (수정 즉시 좌측 캔버스 반영)
            </h2>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600">
                  카드 헤드라인
                </label>
                <input
                  type="text"
                  value={currentEp.card.headline}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              card: { ...item.card, headline: val },
                            }
                          : item
                      ),
                    }));
                  }}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600">
                  현실 장벽 요약 (BLOCK)
                </label>
                <textarea
                  rows={2}
                  value={currentEp.card.problemText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              card: { ...item.card, problemText: val },
                            }
                          : item
                      ),
                    }));
                  }}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600">
                    오늘의 한국어 SOS 문장
                  </label>
                  <input
                    type="text"
                    value={currentEp.card.koreanPhrase}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStore((prev) => ({
                        ...prev,
                        snsEpisodes: (
                          prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                        ).map((item) =>
                          item.no === currentEp.no
                            ? {
                                ...item,
                                card: { ...item.card, koreanPhrase: val },
                              }
                            : item
                        ),
                      }));
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs font-bold text-[#1F5E63]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600">
                    로마자 발음 가이드
                  </label>
                  <input
                    type="text"
                    value={currentEp.card.pronunciation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStore((prev) => ({
                        ...prev,
                        snsEpisodes: (
                          prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                        ).map((item) =>
                          item.no === currentEp.no
                            ? {
                                ...item,
                                card: { ...item.card, pronunciation: val },
                              }
                            : item
                        ),
                      }));
                    }}
                    className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 font-mono text-xs text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600">
                  현실 해결 가이드 (SOLVE)
                </label>
                <textarea
                  rows={3}
                  value={currentEp.card.solutionTip}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              card: { ...item.card, solutionTip: val },
                            }
                          : item
                      ),
                    }));
                  }}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600">
                  한지후(M1)의 무심한 한마디
                </label>
                <input
                  type="text"
                  value={currentEp.card.jihuQuote}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              card: { ...item.card, jihuQuote: val },
                            }
                          : item
                      ),
                    }));
                  }}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600">
                  마지막 컷 독자 질문 (ASK)
                </label>
                <input
                  type="text"
                  value={currentEp.card.askPrompt}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              card: { ...item.card, askPrompt: val },
                            }
                          : item
                      ),
                    }));
                  }}
                  className="mt-1 w-full rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  if (mode === "CARD") {
    return renderCardStudioSection();
  }

  // --- 화면 B: SNS 연재 단건 상세 (/sns/[no]) ---
  const renderDetailSection = () => {
    const member = store.members.find((m) => m.id === currentEp.memberId);
    const activeCopy =
      currentEp.channelCopies.find((c) => c.channel === activeCopyChannel) ??
      currentEp.channelCopies[0];
    const detectedBanned = scanSnsBannedWords(
      [
        currentEp.card.headline,
        currentEp.card.problemText,
        currentEp.card.solutionTip,
        ...currentEp.channelCopies.map((c) => c.copyText),
      ].join(" ")
    );

    return (
      <div className="space-y-4">
        {/* 상단 네비게이션 & 상태 제어 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onNavigateList}
              className="inline-flex items-center gap-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>18편 보드로</span>
            </button>
            <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-xs font-bold text-white">
              {currentEp.code} (#{currentEp.no}/18)
            </span>
            {currentEp.isMuslimEpisode && (
              <span className="rounded-[2px] border border-emerald-400 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                무슬림 문화 존중 (REL-01~06 필수)
              </span>
            )}
            <h1 className="text-base font-bold text-zinc-900">
              {currentEp.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateCard(currentEp.no)}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17494d]"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>1080×1350 SOS 카드 스튜디오</span>
            </button>
            {renderStatusControl(currentEp)}
          </div>
        </div>

        {/* 요약 메타 & 한지후 3원칙 */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-[8px] border border-zinc-200 bg-white p-3.5 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-zinc-900">
                주인공: {member?.nameKo} ({currentEp.memberId} ·{" "}
                {member?.nationality}) + 해결: 한지후 (M1)
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                Week {currentEp.releaseWeek} ({currentEp.releaseDay}요일 발행) ·
                장소: {currentEp.place}
              </span>
            </div>
            <div className="rounded-[4px] border border-zinc-200 bg-zinc-50 p-2.5">
              <div className="text-[11px] font-semibold text-zinc-500">
                외국인 현실 장벽 (Barrier)
              </div>
              <p className="mt-0.5 text-zinc-800">{currentEp.barrier}</p>
            </div>
            <div className="rounded-[4px] border border-[#1F5E63]/30 bg-[#1F5E63]/5 p-2.5">
              <div className="text-[11px] font-semibold text-[#1F5E63]">
                한지후(M1)의 개입 방식 (생색 없는 행동)
              </div>
              <p className="mt-0.5 font-medium text-zinc-900">
                {currentEp.jihuAction}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[8px] border border-zinc-200 bg-white p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <ShieldCheck className="h-4 w-4 text-[#1F5E63]" />
              <span>한지후(M1) 캐릭터 연출 3원칙</span>
            </div>
            <div className="space-y-1.5">
              {JIHU_THREE_PRINCIPLES.map((p) => (
                <div
                  key={p.code}
                  className="rounded-[4px] border border-zinc-100 bg-zinc-50 px-2.5 py-1.5"
                >
                  <div className="font-semibold text-zinc-800">{p.title}</div>
                  <div className="text-[11px] text-zinc-600">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 아이만 I1~I3 전용: 무슬림 종교 묘사 규칙 REL-01~06 검수 게이트 */}
        {currentEp.isMuslimEpisode && (
          <section className="rounded-[8px] border border-emerald-300 bg-emerald-50/60 p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-emerald-950">
                  무슬림 종교·문화 묘사 안전 게이트 (REL-01 ~ REL-06)
                </h2>
                <p className="text-xs text-emerald-800">
                  아이만 종교 에피소드(I1~I3)는 아래 6개 항목이 모두 체크되어야
                  검수(REVIEWED) 및 발행(PUBLISHED) 단계로 이동할 수 있습니다.
                </p>
              </div>
              <span className="rounded-[2px] bg-emerald-800 px-2 py-0.5 font-mono text-xs font-bold text-white">
                완료 {currentEp.muslimChecks.filter((c) => c.done).length} /{" "}
                {currentEp.muslimChecks.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {currentEp.muslimChecks.map((chk) => (
                <label
                  key={chk.code}
                  className={`flex cursor-pointer items-start gap-2 rounded-[6px] border p-2.5 text-xs transition-colors ${
                    chk.done
                      ? "border-emerald-300 bg-white text-zinc-900"
                      : "border-amber-300 bg-amber-50 text-amber-950"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={chk.done}
                    onChange={() => {
                      setStore((prev) => ({
                        ...prev,
                        snsEpisodes: (
                          prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                        ).map((item) =>
                          item.no === currentEp.no
                            ? {
                                ...item,
                                muslimChecks: item.muslimChecks.map((m) =>
                                  m.code === chk.code
                                    ? { ...m, done: !m.done }
                                    : m
                                ),
                              }
                            : item
                        ),
                      }));
                    }}
                    className="mt-0.5 h-4 w-4 accent-[#1F5E63]"
                  />
                  <div>
                    <span className="font-mono font-bold text-[#1F5E63]">
                      {chk.code}
                    </span>{" "}
                    <span>{chk.rule}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* 6비트 세로 타임라인 (hook → block → appear → solve → sos → ask) */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                6비트 세로 타임라인 (hook → block → appear → solve → sos → ask)
              </h2>
              <p className="text-xs text-zinc-500">
                30초 숏폼/릴스 및 6장 카드뉴스 공통 서사 호흡입니다. 6개 비트가
                모두 완료되어야 카드완성(CARD_READY) 단계로 전이됩니다.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-[#1F5E63]">
              완료 비트: {currentEp.beats.filter((b) => b.done).length} / 6
            </span>
          </div>

          <div className="space-y-2">
            {currentEp.beats.map((beat, idx) => (
              <div
                key={beat.code}
                className="flex flex-col gap-2 rounded-[6px] border border-zinc-200 bg-zinc-50/70 p-3 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-2 sm:w-52 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setStore((prev) => ({
                        ...prev,
                        snsEpisodes: (
                          prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                        ).map((item) =>
                          item.no === currentEp.no
                            ? {
                                ...item,
                                beats: item.beats.map((b) =>
                                  b.code === beat.code
                                    ? { ...b, done: !b.done }
                                    : b
                                ),
                              }
                            : item
                        ),
                      }));
                    }}
                    className="text-[#1F5E63]"
                    title="비트 완료 토글"
                  >
                    {beat.done ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                  <div>
                    <div className="font-mono text-xs font-bold text-zinc-900">
                      {beat.label}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500">
                      컷 #{idx + 1} · {beat.secRange}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={beat.sceneDesc}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStore((prev) => ({
                      ...prev,
                      snsEpisodes: (
                        prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                      ).map((item) =>
                        item.no === currentEp.no
                          ? {
                              ...item,
                              beats: item.beats.map((b) =>
                                b.code === beat.code
                                  ? { ...b, sceneDesc: val }
                                  : b
                              ),
                            }
                          : item
                      ),
                    }));
                  }}
                  className="flex-1 rounded-[4px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 채널 원고 3탭 (IG / X / LINE) & 금지어 15개 실시간 차단 */}
        <section className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                채널별 캡션 원고 3탭 (IG · X · LINE) & 과장 금지어 15개 필터
              </h2>
              <p className="text-xs text-zinc-500">
                관광 홍보성 과장 표현({SNS_BANNED_WORDS.slice(0, 6).join(", ")}{" "}
                등 15개)이 감지되면 검수·발행이 즉시 차단됩니다.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {(["IG", "X", "LINE"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setActiveCopyChannel(ch)}
                  className={`rounded-[4px] px-3 py-1 text-xs font-bold ${
                    activeCopyChannel === ch
                      ? "bg-[#1F5E63] text-white"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {ch} 원고
                </button>
              ))}
            </div>
          </div>

          {detectedBanned.length > 0 ? (
            <div className="flex items-center gap-2 rounded-[6px] border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>
                금지어 감지됨 ({detectedBanned.join(", ")}) — 삭제 전까지
                검수/발행 단계로 이동할 수 없습니다.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-[6px] border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                과장·홍보 금지어 15개 전수 통과 (0건 감지 · 담백한 서사 톤 유지)
              </span>
            </div>
          )}

          {activeCopy && (
            <div className="space-y-2">
              <textarea
                rows={4}
                value={activeCopy.copyText}
                onChange={(e) => {
                  const val = e.target.value;
                  setStore((prev) => ({
                    ...prev,
                    snsEpisodes: (
                      prev.snsEpisodes ?? INITIAL_SNS_EPISODES
                    ).map((item) =>
                      item.no === currentEp.no
                        ? {
                            ...item,
                            channelCopies: item.channelCopies.map((c) =>
                              c.channel === activeCopy.channel
                                ? { ...c, copyText: val }
                                : c
                            ),
                          }
                        : item
                    ),
                  }));
                }}
                className="w-full rounded-[4px] border border-zinc-300 p-3 text-xs leading-relaxed text-zinc-900"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-zinc-500">
                  해시태그: {activeCopy.hashtags}
                </span>
                {onExportToGtStudio && (
                  <button
                    type="button"
                    onClick={() =>
                      onExportToGtStudio(currentEp, activeCopy.channel)
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#1F5E63] bg-[#1F5E63]/10 px-3 py-1.5 text-xs font-bold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white"
                  >
                    <span>
                      [{activeCopy.channel}] 원고로 GT TOUR 스튜디오 캠페인 연동
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  };

  if (mode === "DETAIL") {
    return renderDetailSection();
  }

  // --- 화면 A: SNS 연재 18편 메인 보드 & 양방향 4장치 + 캘린더 (/sns) ---
  const filteredEpisodes = snsEpisodes.filter((ep) =>
    memberFilter === "ALL" ? true : ep.memberId === memberFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[2px] bg-[#1F5E63] px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
              M7 · SNS 18편
            </span>
            <h1 className="text-base font-bold text-zinc-900">
              SNS 연재 18편 — 외국인 서울 적응기 & 양방향 SOS 카드
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            이든(E1~E4) · 위하오(W1~W4) · 하루토(H1~H4) · 아이만(A1~A3 · 무슬림
            I1~I3) 18편 보드와 6비트 타임라인, 1080×1350 카드, 양방향 4장치를
            운영합니다.
          </p>
        </div>
      </div>

      {/* 6개 서브탭 네비게이션 */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-2.5">
        {(
          [
            {
              key: "board",
              label: "18편 보드 (E·W·H·A·I)",
              icon: LayoutList,
            },
            {
              key: "questions",
              label: `질문 보드 (${snsQuestions.length})`,
              icon: MessageSquare,
            },
            {
              key: "topics",
              label: `투표 관리 (${snsTopicVotes.length})`,
              icon: Vote,
            },
            {
              key: "ugc",
              label: `팬 제보 큐 (${snsUgcList.length})`,
              icon: Inbox,
            },
            {
              key: "engage",
              label: "회수 대시보드 (저장비율)",
              icon: BarChart3,
            },
            {
              key: "calendar",
              label: "9주 발행 캘린더",
              icon: Calendar,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-[#1F5E63] text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 서브탭 1: 18편 보드 */}
      {subTab === "board" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "ALL", label: "전체 18편" },
                { id: "M2", label: "M2 이든 (E1~E4)" },
                { id: "M3", label: "M3 위하오 (W1~W4)" },
                { id: "M4", label: "M4 하루토 (H1~H4)" },
                { id: "M5", label: "M5 아이만 (A1~A3 · I1~I3)" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMemberFilter(f.id)}
                  className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold ${
                    memberFilter === f.id
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] text-zinc-500">
              발행 완료:{" "}
              {snsEpisodes.filter((e) => e.status === "PUBLISHED").length} / 18편
            </span>
          </div>

          <div className="overflow-x-auto rounded-[8px] border border-zinc-200 bg-white">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                  <th className="py-2.5 pl-3.5 pr-2">코드</th>
                  <th className="px-2 py-2.5">멤버</th>
                  <th className="px-2 py-2.5">제목 · 장소</th>
                  <th className="px-2 py-2.5">외국인 장벽 & 지후 솔루션</th>
                  <th className="px-2 py-2.5">오늘의 SOS 문장</th>
                  <th className="px-2 py-2.5">카드</th>
                  <th className="py-2.5 pl-2 pr-3.5">단계 이동 (버튼/드롭다운)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredEpisodes.map((ep) => {
                  const member = store.members.find(
                    (m) => m.id === ep.memberId
                  );
                  return (
                    <tr
                      key={ep.code}
                      onClick={() => onNavigateDetail(ep.no)}
                      className={`cursor-pointer transition-colors hover:bg-zinc-50 ${
                        ep.isMuslimEpisode ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td className="py-2.5 pl-3.5 pr-2 font-mono font-bold text-[#1F5E63]">
                        <div>{ep.code}</div>
                        <div className="text-[10px] font-normal text-zinc-400">
                          W{ep.releaseWeek}·{ep.releaseDay}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 whitespace-nowrap">
                        <div className="font-semibold text-zinc-900">
                          {member?.nameKo ?? ep.memberId}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          + 한지후(M1)
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                          <span>{ep.title}</span>
                          {ep.isMuslimEpisode && (
                            <span className="rounded-[2px] border border-emerald-400 bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-900">
                              REL-01~06
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {ep.place}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 max-w-xs">
                        <div className="line-clamp-1 text-zinc-700">
                          장벽: {ep.barrier}
                        </div>
                        <div className="line-clamp-1 text-[11px] text-[#1F5E63]">
                          지후: {ep.jihuAction}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 max-w-[200px]">
                        <div className="font-semibold text-zinc-900 line-clamp-1">
                          "{ep.card.koreanPhrase}"
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          6비트 {ep.beats.filter((b) => b.done).length}/6 완료
                        </div>
                      </td>
                      <td
                        className="px-2 py-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onNavigateCard(ep.no)}
                          className="inline-flex items-center gap-1 rounded-[3px] border border-[#1F5E63]/40 bg-[#1F5E63]/10 px-2 py-1 text-[11px] font-semibold text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>1080×1350</span>
                        </button>
                      </td>
                      <td
                        className="py-2.5 pl-2 pr-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderStatusControl(ep, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 서브탭 2: 질문 보드 */}
      {subTab === "questions" && (
        <div className="space-y-3">
          <div className="rounded-[8px] border border-zinc-200 bg-white p-3.5 space-y-2.5">
            <h2 className="text-sm font-bold text-zinc-900">
              양방향 장치 1 — 6비트 마지막 컷(ASK) 팬 질문 수집 & 한지후 답글
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={newQuestionEp}
                onChange={(e) => setNewQuestionEp(e.target.value)}
                className="rounded-[4px] border border-zinc-300 px-2 py-1.5 text-xs"
              >
                {snsEpisodes.map((ep) => (
                  <option key={ep.code} value={ep.code}>
                    {ep.code} · {ep.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newQuestionHandle}
                onChange={(e) => setNewQuestionHandle(e.target.value)}
                placeholder="@fan_handle"
                className="w-32 rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs"
              />
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="외국인 팬이 댓글로 남긴 서울 생활 질문을 입력하세요..."
                className="flex-1 min-w-[220px] rounded-[4px] border border-zinc-300 px-2.5 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newQuestionText.trim()) return;
                  setStore((prev) => ({
                    ...prev,
                    snsQuestions: [
                      {
                        id: Date.now(),
                        episodeCode: newQuestionEp,
                        fanHandle: newQuestionHandle || "@anon_fan",
                        lang: "JP",
                        question: newQuestionText.trim(),
                        jihuReply:
                          "다음 회차 카드 하단 SOS 팁으로 정리해서 올려둘게.",
                        replied: false,
                        pinned: false,
                      },
                      ...(prev.snsQuestions ?? INITIAL_SNS_QUESTIONS),
                    ],
                  }));
                  setNewQuestionText("");
                }}
                className="rounded-[4px] bg-[#1F5E63] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17494d]"
              >
                질문 등록
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {snsQuestions.map((q) => (
              <div
                key={q.id}
                className="rounded-[8px] border border-zinc-200 bg-white p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1F5E63]">
                    [{q.episodeCode}] {q.fanHandle} ({q.lang})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStore((prev) => ({
                        ...prev,
                        snsQuestions: (
                          prev.snsQuestions ?? INITIAL_SNS_QUESTIONS
                        ).map((item) =>
                          item.id === q.id
                            ? { ...item, replied: !item.replied }
                            : item
                        ),
                      }));
                    }}
                    className={`rounded-[3px] px-2 py-0.5 text-[11px] font-semibold ${
                      q.replied
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {q.replied ? "답글 완료" : "답글 대기"}
                  </button>
                </div>
                <p className="font-semibold text-zinc-900">Q. {q.question}</p>
                <p className="rounded-[4px] bg-zinc-50 p-2 text-zinc-700">
                  <span className="font-bold text-[#1F5E63]">지후 답글:</span>{" "}
                  {q.jihuReply}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 서브탭 3: 투표 관리 */}
      {subTab === "topics" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {snsTopicVotes.map((tv) => {
            const total = tv.votesA + tv.votesB || 1;
            const pctA = Math.round((tv.votesA / total) * 100);
            const pctB = 100 - pctA;
            return (
              <div
                key={tv.id}
                className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1F5E63]">
                    {tv.weekLabel}
                  </span>
                  <span
                    className={`rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold ${
                      tv.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {tv.status === "OPEN" ? "투표 진행중" : `마감 (${tv.adoptedEpisodeCode} 반영)`}
                  </span>
                </div>
                <p className="font-bold text-zinc-900">{tv.question}</p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStore((prev) => ({
                        ...prev,
                        snsTopicVotes: (
                          prev.snsTopicVotes ?? INITIAL_SNS_TOPIC_VOTES
                        ).map((item) =>
                          item.id === tv.id
                            ? { ...item, votesA: item.votesA + 1 }
                            : item
                        ),
                      }));
                    }}
                    className="w-full rounded-[4px] border border-zinc-200 p-2 text-left hover:border-[#1F5E63]"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>A. {tv.optionA}</span>
                      <span className="font-mono">{pctA}% ({tv.votesA})</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStore((prev) => ({
                        ...prev,
                        snsTopicVotes: (
                          prev.snsTopicVotes ?? INITIAL_SNS_TOPIC_VOTES
                        ).map((item) =>
                          item.id === tv.id
                            ? { ...item, votesB: item.votesB + 1 }
                            : item
                        ),
                      }));
                    }}
                    className="w-full rounded-[4px] border border-zinc-200 p-2 text-left hover:border-[#1F5E63]"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>B. {tv.optionB}</span>
                      <span className="font-mono">{pctB}% ({tv.votesB})</span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 서브탭 4: 팬 제보 큐 */}
      {subTab === "ugc" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {snsUgcList.map((u) => (
            <div
              key={u.id}
              className="rounded-[8px] border border-zinc-200 bg-white p-4 space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-zinc-900">
                  {u.submitter} ({u.nationality}) → {u.episodeTarget}
                </span>
                <select
                  value={u.status}
                  onChange={(e) => {
                    const nextSt = e.target.value as typeof u.status;
                    setStore((prev) => ({
                      ...prev,
                      snsUgcList: (prev.snsUgcList ?? INITIAL_SNS_UGC).map(
                        (item) =>
                          item.id === u.id ? { ...item, status: nextSt } : item
                      ),
                    }));
                  }}
                  className="rounded-[3px] border border-zinc-300 px-2 py-0.5 text-[11px] font-semibold"
                >
                  <option value="PENDING">검토 대기 (PENDING)</option>
                  <option value="ADOPTED">에피소드 채택 (ADOPTED)</option>
                  <option value="REJECTED">보류 (REJECTED)</option>
                </select>
              </div>
              <p className="text-zinc-800">{u.story}</p>
              <div className="rounded-[4px] bg-zinc-50 px-2.5 py-1.5 text-[11px] text-[#1F5E63] font-medium">
                크레딧 기록: {u.creditNote}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 서브탭 5: 회수 대시보드 (저장비율 Save Rate) */}
      {subTab === "engage" && (
        <div className="overflow-x-auto rounded-[8px] border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                <th className="py-2.5 pl-3.5 pr-2">회차 코드</th>
                <th className="px-2 py-2.5">에피소드 제목</th>
                <th className="px-2 py-2.5">노출 조회수</th>
                <th className="px-2 py-2.5">카드 저장수 (Saves)</th>
                <th className="px-2 py-2.5">공유수 (Shares)</th>
                <th className="px-2 py-2.5">질문 댓글수</th>
                <th className="py-2.5 pl-2 pr-3.5">저장비율 (Save Rate)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {snsEngagements.map((eng) => {
                const ep = snsEpisodes.find((e) => e.code === eng.episodeCode);
                return (
                  <tr key={eng.episodeCode} className="hover:bg-zinc-50">
                    <td className="py-2 pl-3.5 pr-2 font-mono font-bold text-[#1F5E63]">
                      {eng.episodeCode}
                    </td>
                    <td className="px-2 py-2 font-medium text-zinc-900">
                      {ep?.title}
                    </td>
                    <td className="px-2 py-2 font-mono">
                      {eng.views.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 font-mono font-bold text-zinc-900">
                      {eng.saves.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 font-mono">
                      {eng.shares.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 font-mono">
                      {eng.questionComments}건
                    </td>
                    <td className="py-2 pl-2 pr-3.5">
                      <span className="rounded-[2px] bg-[#1F5E63]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#1F5E63]">
                        {eng.saveRatePercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 서브탭 6: 9주 발행 캘린더 */}
      {subTab === "calendar" && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((week) => {
            const weekEps = snsEpisodes.filter((e) => e.releaseWeek === week);
            return (
              <div
                key={week}
                className="rounded-[8px] border border-zinc-200 bg-white p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                  <span className="font-mono font-bold text-zinc-900">
                    Week {week} (화·금 주 2회)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {weekEps.length}편 배정
                  </span>
                </div>
                <div className="space-y-1.5">
                  {weekEps.map((ep) => (
                    <div
                      key={ep.code}
                      onClick={() => onNavigateDetail(ep.no)}
                      className="flex cursor-pointer items-center justify-between rounded-[4px] border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 hover:border-[#1F5E63]"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#1F5E63]">
                          [{ep.releaseDay}] {ep.code}
                        </span>{" "}
                        <span className="font-medium text-zinc-900">
                          {ep.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {SNS_STATUS_LABELS[ep.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL 모드일 때: 선택 회차 상세(6비트 & REL-01~06 & 3채널 원고) + 1080×1350 SOS 카드 스튜디오 연속 표시 */}
      {mode === "FULL" && (
        <div className="space-y-6 pt-4 border-t-2 border-dashed border-[#1F5E63]/30">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-[#1F5E63]/30 bg-[#1F5E63]/5 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                M7 상세 & 카드 통합 프리뷰
              </span>
              <span className="text-xs font-bold text-zinc-900">
                클릭 없이 바로 확인하는 6비트 타임라인 · 무슬림 REL-01~06 · 1080×1350 카드 스튜디오
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-semibold text-zinc-600 mr-1">
                회차 빠른 선택:
              </span>
              {snsEpisodes.map((ep) => (
                <button
                  key={ep.code}
                  type="button"
                  onClick={() => onNavigateDetail(ep.no)}
                  className={`rounded-[3px] px-2 py-0.5 font-mono text-[11px] font-bold transition-colors ${
                    currentEp.no === ep.no
                      ? "bg-[#1F5E63] text-white"
                      : ep.isMuslimEpisode
                      ? "border border-emerald-400 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {ep.code}
                </button>
              ))}
            </div>
          </div>

          {renderDetailSection()}

          <div className="pt-4 border-t border-zinc-200">
            {renderCardStudioSection()}
          </div>
        </div>
      )}
    </div>
  );
}

