import type {
  ChannelVersion,
  ComplianceCheck,
  ComplianceItem,
  EpisodeStatus,
  FandomCandidate,
  GenerationRun,
  Member,
  Origin,
  OriginStatus,
  Season2Episode,
  SnsEpisode,
  SnsStatus,
} from "./types";
import {
  EPISODE_STATUS_ORDER,
  ORIGIN_STATUS_ORDER,
  SNS_STATUS_ORDER,
} from "./types";
import { SNS_BANNED_WORDS } from "./snsSeed";

/**
 * 1. 길이 검증 규칙 (SPEC 5.1)
 */
export function validateChannelLength(input: {
  cutCount: number | null;
  totalSec: number | null;
  targetCutCount: number;
  targetTotalSec: number;
  targetAvgCutSec: number;
}) {
  const { cutCount, totalSec, targetTotalSec, targetAvgCutSec } = input;
  const warnings: string[] = [];

  if (!cutCount || !totalSec || cutCount <= 0 || totalSec <= 0) {
    return {
      avgCutSec: null as number | null,
      hasWarning: true,
      warnings: ["컷 수와 총 길이(초)를 1 이상의 값으로 입력해 주세요."],
    };
  }

  const rawAvg = totalSec / cutCount;
  const avgCutSec = Number(rawAvg.toFixed(2));
  const isAvgCutWarning = Math.abs(rawAvg - targetAvgCutSec) > 0.3001;
  const isTotalSecWarning = Math.abs(totalSec - targetTotalSec) > 3;

  if (isAvgCutWarning) {
    warnings.push(
      `평균 컷 길이(${avgCutSec}초)가 채널 규격(${targetAvgCutSec}초 ±0.3초)을 벗어났습니다.`
    );
  }
  if (isTotalSecWarning) {
    warnings.push(
      `총 길이(${totalSec}초)가 채널 규격(${targetTotalSec}초 ±3초)을 벗어났습니다.`
    );
  }

  return {
    avgCutSec,
    hasWarning: isAvgCutWarning || isTotalSecWarning,
    warnings,
  };
}

/**
 * 2. 발행 게이트 규칙 (SPEC 5.2)
 */
export function canPublish(input: {
  episodeId: number;
  complianceRisk: boolean;
  versions: ChannelVersion[];
  checks: ComplianceCheck[];
  items: ComplianceItem[];
}) {
  const activeChannelOrder = ["JP", "US", "KR"];
  const incompleteChannels: string[] = [];

  for (const code of activeChannelOrder) {
    const ver = input.versions.find(
      (v) => v.episodeId === input.episodeId && v.channelCode === code
    );
    if (!ver || ver.status !== "DONE") {
      incompleteChannels.push(code);
    }
  }

  const beforePublishCodes = new Set(
    input.items.filter((i) => i.blockAt === "BEFORE_PUBLISH").map((i) => i.code)
  );

  const incompleteChecks: string[] = [];
  for (const itemCode of beforePublishCodes) {
    if (itemCode === "JP-04" && !input.complianceRisk) continue;
    const chk = input.checks.find(
      (c) => c.episodeId === input.episodeId && c.itemCode === itemCode
    );
    if (!chk || !chk.done) {
      incompleteChecks.push(itemCode);
    }
  }

  incompleteChecks.sort();
  const ok = incompleteChannels.length === 0 && incompleteChecks.length === 0;

  if (ok) {
    return {
      canPublish: true,
      incompleteChannels: [],
      incompleteChecks: [],
      reason: null as string | null,
    };
  }

  const parts: string[] = [];
  if (incompleteChannels.length > 0) {
    parts.push(`미완성 채널: ${incompleteChannels.join(", ")}`);
  }
  if (incompleteChecks.length > 0) {
    parts.push(`미완료 검수: ${incompleteChecks.join(", ")}`);
  }

  return {
    canPublish: false,
    incompleteChannels,
    incompleteChecks,
    reason: `발행할 수 없습니다. ${parts.join(" / ")}`,
  };
}

/**
 * 3. 크레딧 임계치 규칙 (SPEC 5.3)
 */
export function evaluateCreditUsage(creditUsed: number, creditCap: number) {
  const safeCap = creditCap > 0 ? creditCap : 1;
  const usageRatio = creditUsed / safeCap;
  const usagePercent = Number((usageRatio * 100).toFixed(1));
  const remainingCredits = Math.max(0, creditCap - creditUsed);

  let alertLevel: "normal" | "warning" | "blocker" = "normal";
  let alertMessage: string | null = null;

  if (usageRatio >= 0.9) {
    alertLevel = "blocker";
    alertMessage = `이번 달 크레딧 사용률이 ${usagePercent}% (${creditUsed.toLocaleString()} / ${creditCap.toLocaleString()})로 위험 임계치(90%)를 도달·초과했습니다. 재생성을 중단하고 잔여 크레딧(${remainingCredits.toLocaleString()})을 점검하세요.`;
  } else if (usageRatio >= 0.8) {
    alertLevel = "warning";
    alertMessage = `이번 달 크레딧 사용률이 ${usagePercent}% (${creditUsed.toLocaleString()} / ${creditCap.toLocaleString()})로 경고 임계치(80%)를 넘었습니다.`;
  }

  return {
    creditUsed,
    creditCap,
    usageRatio,
    usagePercent,
    remainingCredits,
    alertLevel,
    alertMessage,
  };
}

export function calculateEpisodeCreditStats(
  episode: { id: number; no: number; title: string },
  runs: GenerationRun[],
  threshold = 0.75
) {
  const epRuns = runs.filter((r) => r.episodeId === episode.id);
  const totalAttempts = epRuns.reduce((acc, r) => acc + r.attempts, 0);
  const totalAccepted = epRuns.reduce((acc, r) => acc + r.accepted, 0);
  const totalCredits = epRuns.reduce((acc, r) => acc + r.credits, 0);

  if (totalAttempts === 0) {
    return {
      episodeId: episode.id,
      episodeNo: episode.no,
      episodeTitle: episode.title,
      totalAttempts: 0,
      totalAccepted: 0,
      adoptionPercent: null as number | null,
      isLowAdoption: false,
      totalCredits: 0,
    };
  }

  const adoptionRate = totalAccepted / totalAttempts;
  return {
    episodeId: episode.id,
    episodeNo: episode.no,
    episodeTitle: episode.title,
    totalAttempts,
    totalAccepted,
    adoptionPercent: Number((adoptionRate * 100).toFixed(1)),
    isLowAdoption: adoptionRate < threshold,
    totalCredits,
  };
}

/**
 * 4. 팬덤명 5대 조건 규칙 (SPEC 5.4)
 */
export const FANDOM_CHECK_META: Array<{
  key: "checkTm" | "checkDup" | "checkWord" | "checkPron" | "checkChant";
  label: string;
  tooltip: string;
}> = [
  {
    key: "checkTm",
    label: "상표",
    tooltip: "한·일·미 상표권 저촉 여부가 없어야 합니다",
  },
  {
    key: "checkDup",
    label: "중복",
    tooltip: "기존 아이돌 팬덤명과 중복되지 않아야 합니다",
  },
  {
    key: "checkWord",
    label: "부적절어",
    tooltip: "4개국 언어에서 부정적 의미·속어가 없어야 합니다",
  },
  {
    key: "checkPron",
    label: "발음",
    tooltip: "한·일·영·중 화자 모두 발음하기 쉬워야 합니다",
  },
  {
    key: "checkChant",
    label: "3음절",
    tooltip: "3음절 이내로 끊어 부를 수 있어야 합니다",
  },
];

export function canShortlist(
  cand: Pick<
    FandomCandidate,
    "checkTm" | "checkDup" | "checkWord" | "checkPron" | "checkChant"
  >
): boolean {
  return Boolean(
    cand.checkTm &&
      cand.checkDup &&
      cand.checkWord &&
      cand.checkPron &&
      cand.checkChant
  );
}

/**
 * 5. 오리진 5편 단계 전이 및 발행 게이트 규칙 (SPEC 10.4, AC-19, AC-20)
 */
export function canAdvanceOrigin(input: {
  origin: Origin;
  targetStatus: OriginStatus;
  member: Member | undefined;
}): {
  ok: boolean;
  reason: string | null;
} {
  const { origin, targetStatus, member } = input;
  const targetIdx = ORIGIN_STATUS_ORDER.indexOf(targetStatus);
  const animatedIdx = ORIGIN_STATUS_ORDER.indexOf("ANIMATED");
  const reviewedIdx = ORIGIN_STATUS_ORDER.indexOf("REVIEWED");

  // 1) 민감 소재 안전 게이트 (SAFE-01~08): REVIEWED 또는 PUBLISHED 단계로 진입 시
  if (origin.sensitive && targetIdx >= reviewedIdx) {
    const incompleteSafety = origin.safetyChecks.filter((s) => !s.done);
    if (incompleteSafety.length > 0) {
      const firstIncomplete = incompleteSafety[0];
      const shortRule = firstIncomplete.rule.split(" — ")[0];
      const codeList = incompleteSafety.map((s) => s.code).join(", ");
      return {
        ok: false,
        reason: `${firstIncomplete.code}(${shortRule}) 미완료 — 민감 소재 안전 규칙 ${incompleteSafety.length}건(${codeList})을 모두 체크해야 검수/발행 단계로 이동할 수 있습니다.`,
      };
    }
  }

  // 2) 애니 시트 게이트: ANIMATED 이상 단계로 진입하려면 멤버의 유효한 애니 시트 확정 필요
  if (targetIdx >= animatedIdx) {
    const sheetStatus =
      member?.animeSheetStatus ??
      (member?.id === "M4"
        ? "HOLD"
        : member?.animeSheetUrl
        ? "READY"
        : "NONE");

    if (!member || !member.animeSheetUrl || sheetStatus === "NONE") {
      return {
        ok: false,
        reason: `애니 시트 미제작 — ${
          member ? `${member.nameKo}(${member.id})` : origin.memberId
        }의 애니메이션 캐릭터 시트가 아직 제작되지 않았습니다 (prompts/character-anime.md 참조).`,
      };
    }
    if (sheetStatus === "HOLD") {
      return {
        ok: false,
        reason: `애니 시트 미제작(보류) — ${member.nameKo}(${member.id})의 애니 시트는 파일럿 판정 3/5(연령감 하향/보류)로 그대로 사용 불가 상태입니다. 시트 상태를 '제작완료(READY)'로 확정하거나 시트를 교체한 후 진행하세요.`,
      };
    }
  }

  // 3) 3채널 나레이션 완료 게이트: REVIEWED 또는 PUBLISHED 단계로 진입 시 JP/US/KR 대본 확인
  if (targetIdx >= reviewedIdx) {
    const requiredChannels = ["JP", "US", "KR"];
    const emptyChannels = requiredChannels.filter((code) => {
      const sc = origin.channelScripts.find((s) => s.channelCode === code);
      return !sc || sc.narration.trim().length === 0;
    });
    if (emptyChannels.length > 0) {
      return {
        ok: false,
        reason: `3채널 나레이션 미작성 채널(${emptyChannels.join(
          ", "
        )})이 있습니다.`,
      };
    }
  }

  return { ok: true, reason: null };
}

/**
 * 6. 시즌 2 데뷔 서사 (10화) 단계 전이 및 B1(애니➔실사 전환점) · AC-20 캐릭터 일치 검수 게이트
 */
export function canAdvanceSeason2Episode(input: {
  episode: Season2Episode;
  targetStatus: EpisodeStatus;
  members: Member[];
  b1Episode?: Season2Episode;
}): {
  ok: boolean;
  reason: string | null;
} {
  const { episode, targetStatus, members, b1Episode } = input;
  const targetIdx = EPISODE_STATUS_ORDER.indexOf(targetStatus);
  const generatedIdx = EPISODE_STATUS_ORDER.indexOf("GENERATED");
  const reviewedIdx = EPISODE_STATUS_ORDER.indexOf("REVIEWED");

  // 1) B1 「관객 서른 명」 (애니 ➔ 실사 전환점) 전용 AC-20 캐릭터 일치 & 쇼케이스 첫 프레임 게이트
  if (episode.code === "B1" && targetIdx >= generatedIdx) {
    // 1-a) 5인 멤버 전원 애니 시트 READY 확인 (AC-20)
    const holdOrNoneMembers = members.filter((m) => {
      const st =
        m.animeSheetStatus ??
        (m.id === "M4" ? "HOLD" : m.animeSheetUrl ? "READY" : "NONE");
      return st !== "READY" || !m.animeSheetUrl;
    });
    if (holdOrNoneMembers.length > 0) {
      const names = holdOrNoneMembers
        .map((m) => `${m.nameKo}(${m.id})`)
        .join(", ");
      return {
        ok: false,
        reason: `[AC-20 캐릭터 시트 게이트 차단] ${names}의 애니 시트가 아직 '제작완료(READY)' 상태가 아닙니다. B1 「관객 서른 명」 애니➔실사 전환 생성 전 5인 전원의 애니 시트를 확정하세요.`,
      };
    }

    // 1-b) [애니 ➔ 실사 전환 프레임 (B1 쇼케이스 첫 프레임)] 검증 여부
    if (episode.b1TransitionFrameSpec && !episode.b1TransitionFrameSpec.verified) {
      return {
        ok: false,
        reason: `[B1 쇼케이스 첫 프레임 미검증] '애니 ➔ 실사 전환 프레임 (B1 쇼케이스 첫 프레임 · ${episode.b1TransitionFrameSpec.timecode})' 매치컷 디졸브 검수 체크를 먼저 완료해 주세요.`,
      };
    }

    // 1-c) 5인 멤버별 애니➔실사 캐릭터 일치 검수 체크리스트 (identityChecks)
    const unmatchedChecks = (episode.identityChecks ?? []).filter(
      (chk) => !chk.matched
    );
    if (unmatchedChecks.length > 0) {
      const ids = unmatchedChecks.map((c) => c.memberId).join(", ");
      return {
        ok: false,
        reason: `[AC-20 캐릭터 일치 검수 미완료] B1 쇼케이스 전환 프레임에서 멤버(${ids})의 애니 시트 ↔ 실사 시트 일치 검수가 완료되지 않았습니다 (${
          (episode.identityChecks?.length ?? 5) - unmatchedChecks.length
        }/${episode.identityChecks?.length ?? 5} 완료).`,
      };
    }
  }

  // 2) PART A (A1~A3 · 100% 애니메이션) 생성 단계 진입 시 담당 멤버 애니 시트 READY 확인
  if (episode.part === "PART_A" && targetIdx >= generatedIdx) {
    const leadMembers = members.filter((m) =>
      episode.leadMemberIds.includes(m.id)
    );
    const notReadyLeads = leadMembers.filter((m) => {
      const st =
        m.animeSheetStatus ??
        (m.id === "M4" ? "HOLD" : m.animeSheetUrl ? "READY" : "NONE");
      return st !== "READY" || !m.animeSheetUrl;
    });
    if (notReadyLeads.length > 0) {
      const names = notReadyLeads.map((m) => `${m.nameKo}(${m.id})`).join(", ");
      return {
        ok: false,
        reason: `[AC-20 PART A 작화 게이트 차단] 주연 멤버 ${names}의 애니 시트가 보류(HOLD) 또는 미제작 상태입니다.`,
      };
    }
  }

  // 3) PART B (B2~B4) 및 PART C (C1~C3) 검수/발행 진입 시 B1 전환점 선행 검수 확인
  if (
    episode.code !== "B1" &&
    (episode.part === "PART_B" || episode.part === "PART_C") &&
    targetIdx >= reviewedIdx &&
    b1Episode
  ) {
    const b1Unmatched = (b1Episode.identityChecks ?? []).some((c) => !c.matched);
    const b1FrameUnverified =
      b1Episode.b1TransitionFrameSpec &&
      !b1Episode.b1TransitionFrameSpec.verified;
    if (b1Unmatched || b1FrameUnverified) {
      return {
        ok: false,
        reason: `[B1 전환점 선행 게이트 미완료] 실사 전환 기준점인 B1 「관객 서른 명」의 애니➔실사 전환 프레임 및 5인 일치 검수(AC-20)를 먼저 완료해야 이후 실사 회차를 검수/발행할 수 있습니다.`,
      };
    }
  }

  // 4) 3채널(JP/US/KR) 대본 확인 (검수/발행 단계)
  if (targetIdx >= reviewedIdx) {
    const emptyCh = (["JP", "US", "KR"] as const).filter((code) => {
      const sc = episode.channelScripts.find((s) => s.channelCode === code);
      return !sc || sc.narration.trim().length === 0;
    });
    if (emptyCh.length > 0) {
      return {
        ok: false,
        reason: `3채널 독립 대본 미작성 채널(${emptyCh.join(", ")})이 있습니다.`,
      };
    }
  }

  return {
    ok: true,
    reason: null,
  };
}

/**
 * 7. M7 SNS 연재 18편 금지어 15개 스캔 및 발행 게이트 (REL-01~06 · 6비트 · 금지어 차단)
 */
export function scanSnsBannedWords(text: string): string[] {
  if (!text) return [];
  return SNS_BANNED_WORDS.filter((word) => text.includes(word));
}

export function canAdvanceSns(input: {
  sns: SnsEpisode;
  targetStatus: SnsStatus;
}): {
  ok: boolean;
  reason: string | null;
} {
  const { sns, targetStatus } = input;
  const targetIdx = SNS_STATUS_ORDER.indexOf(targetStatus);
  const cardReadyIdx = SNS_STATUS_ORDER.indexOf("CARD_READY");
  const reviewedIdx = SNS_STATUS_ORDER.indexOf("REVIEWED");

  // 1) CARD_READY 이상 진입 시 6비트(hook→block→appear→solve→sos→ask) 완료 확인
  if (targetIdx >= cardReadyIdx) {
    const incompleteBeats = sns.beats.filter((b) => !b.done);
    if (incompleteBeats.length > 0) {
      return {
        ok: false,
        reason: `6비트 타임라인 미완료(${incompleteBeats
          .map((b) => b.code.toUpperCase())
          .join(", ")}) — 6개 비트를 모두 확정해야 카드완성/검수/발행 단계로 이동할 수 있습니다.`,
      };
    }
  }

  // 2) REVIEWED 또는 PUBLISHED 진입 시 무슬림 종교 묘사 규칙(REL-01~06) 전수 체크 확인 (I1~I3)
  if (sns.isMuslimEpisode && targetIdx >= reviewedIdx) {
    const incompleteRel = sns.muslimChecks.filter((c) => !c.done);
    if (incompleteRel.length > 0) {
      return {
        ok: false,
        reason: `[무슬림 종교 묘사 게이트 차단] ${incompleteRel
          .map((c) => c.code)
          .join(", ")} 미완료 — 아이만 종교 에피소드(${
          sns.code
        })는 REL-01~06 6개 규칙을 모두 통과해야 검수/발행할 수 있습니다.`,
      };
    }
  }

  // 3) REVIEWED 또는 PUBLISHED 진입 시 3채널 원고(IG/X/LINE) 및 카드 텍스트 내 금지어 15개 검출 차단
  if (targetIdx >= reviewedIdx) {
    const allTexts = [
      sns.card.headline,
      sns.card.problemText,
      sns.card.solutionTip,
      sns.card.jihuQuote,
      ...sns.channelCopies.map((c) => c.copyText),
    ].join(" ");
    const detected = scanSnsBannedWords(allTexts);
    if (detected.length > 0) {
      return {
        ok: false,
        reason: `[SNS 과장·홍보 금지어 차단] 원고/카드에 금지어(${detected.join(
          ", "
        )})가 포함되어 있습니다. 담백한 생활 기록 톤으로 수정하세요.`,
      };
    }
  }

  return { ok: true, reason: null };
}


