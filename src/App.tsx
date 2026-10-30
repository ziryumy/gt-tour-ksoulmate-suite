import React, { useState, useMemo, useEffect } from 'react';
import {
  JP_5_LEGAL_PRESETS,
  BANNED_RULES,
  scanRiskWords,
  sanitizeTextWithGuardrails,
  auditSuiteCompliance
} from './engine/guardrails';
import {
  toStrictSchema,
  exportImagenToolPayload,
  buildSlideImagenPrompts,
  localizeTextToTargetLang,
  parseBridgePayload,
  INITIAL_DEMO_SUITE,
  MARKETER_PERSONAS,
  NATIVE_VISUAL_AESTHETICS,
  DEFAULT_IMAGEN_NEGATIVE_PROMPT,
  FIXED_GTTOUR_FOOTER,
  X_CHANNEL_HANDLE,
  THREADS_CHANNEL_HANDLE,
  buildCompleteSuiteFallback,
  ensureCompleteSuiteData,
  type CampaignAxis,
  type TargetLang
} from './engine/schema';
import {
  AlertTriangle,
  Copy,
  Check,
  Download,
  Upload,
  Sparkles,
  FileJson,
  Layers,
  Film,
  BookOpen,
  Wand2,
  X,
  MessageSquare,
  AtSign,
  Radio,
  Camera,
  Image as ImageIcon,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Code2,
  FolderKanban,
  ArrowRightLeft,
  Share2,
  MessageCircleQuestion
} from 'lucide-react';
import KSoulmateApp, { type KSoulmateExportPayload } from './ksoulmate/KSoulmateApp';
import SosCopilotWorkspace, { type SosToStudioBridgePayload } from './components/SosCopilotWorkspace';
import {
  buildFacebookGroupPresets,
  type FacebookGroupPreset
} from './engine/sosCopilot';
import {
  renderMagazineSlideCanvasDataUrl
} from './engine/magazineCanvasRenderer';

declare global {
  interface Window {
    GTTOUR_BRIDGE?: {
      importPayload: (jsonString: string) => void;
      exportJSON: (mode?: 'STRICT' | 'FULL' | 'IMAGEN') => string;
      exportImagenPayload: () => ReturnType<typeof exportImagenToolPayload>;
      getGuardrails: () => typeof BANNED_RULES;
      getJpPresets: () => typeof JP_5_LEGAL_PRESETS;
    };
  }
}

const SAMPLE_CAMPAIGNS: Record<
  CampaignAxis,
  { spots: string; memo: string; jpPresetId: string; kpopNews?: string }
> = {
  K_BEAUTY: {
    spots: '청담 프라이빗 라운지, 성수 플래그십 스토어, 한남 브런치 다이닝',
    memo: '공항 도착 즉시 전용 리무진 픽업 및 일본어 전담 매니저 동행 강조',
    jpPresetId: 'jp_preset_1',
    kpopNews: ''
  },
  STAY: {
    spots: '올림픽공원 도보 5분 Verified 호텔, 잠실 한강뷰 라운지, 청담 심야 다이닝',
    memo: '공연 관람일 심야 귀가 동선 케어 및 막차 걱정 없는 전용 송영 차량 지원',
    jpPresetId: 'jp_preset_2',
    kpopNews: ''
  },
  HOTPLACE: {
    spots: '성수 디자이너 쇼룸, 압구정 도산공원 디저트 카페, 한남동 바이닐 바',
    memo: '웨이팅 등록·메뉴 주문·택스리펀드까지 언어 장벽 없는 1:1 쇼핑·미식 동행',
    jpPresetId: 'jp_preset_4',
    kpopNews: ''
  },
  KPOP_NEWS: {
    spots:
      'KSPO DOME 도보 5분 Verified 스테이, 성수 K-POP 공식 팝업스토어, 용산 하이브 인근 아티스트 성지순례 카페',
    memo: '공연 관람일 도보 5분 숙소 체크인, 심야 안전 송영 및 팬덤 성지순례 전용차량 동선 케어',
    jpPresetId: 'jp_preset_2',
    kpopNews: 'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정'
  }
};

type PreviewTab = 'IG_5' | 'FB_5' | 'REELS_15' | 'XHS_7' | 'X_THREAD' | 'THREADS';

export default function App() {
  const [axis, setAxis] = useState<CampaignAxis>('K_BEAUTY');
  const [lang, setLang] = useState<TargetLang>('JP');
  const [spotsInput, setSpotsInput] = useState(
    '청담 프라이빗 라운지, 성수 플래그십 스토어, 한남 브런치 다이닝'
  );
  const [customMemo, setCustomMemo] = useState(
    '공항 도착 즉시 전용 리무진 픽업 및 일본어 전담 매니저 동행 강조'
  );
  const [kpopNewsSummary, setKpopNewsSummary] = useState(
    'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정'
  );
  const [selectedJpPreset, setSelectedJpPreset] = useState(JP_5_LEGAL_PRESETS[0].id);

  const [activeTab, setActiveTab] = useState<PreviewTab>('IG_5');
  const [schemaMode, setSchemaMode] = useState<'STRICT' | 'FULL' | 'IMAGEN'>('FULL');
  const [loading, setLoading] = useState(false);
  const [slideGeneratingMap, setSlideGeneratingMap] = useState<Record<number, boolean>>({});
  const [slideErrorMap, setSlideErrorMap] = useState<Record<number, string | null>>({});
  const [imagenPipelineAlert, setImagenPipelineAlert] = useState<string | null>(null);
  const [batchGeneratingImages, setBatchGeneratingImages] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [suiteData, setSuiteData] = useState<any>(() =>
    ensureCompleteSuiteData(INITIAL_DEMO_SUITE)
  );

  // 접기/펼치기(Collapsible) UI 상태 — 기술적인 항목들은 기본적으로 모두 숨김 처리
  const [openSlidePromptMap, setOpenSlidePromptMap] = useState<Record<number, boolean>>({});
  const [showStudioDirectionDetail, setShowStudioDirectionDetail] = useState(false);
  const [showTechnicalJsonPanel, setShowTechnicalJsonPanel] = useState(false);
  const [openErrorDetailMap, setOpenErrorDetailMap] = useState<Record<number, boolean>>({});

  // 통합 마스터 워크스페이스 전환 상태 (GT TOUR Studio <-> K-Soulmate 운영 콘솔 <-> SOS 상담 코파일럿)
  const [activeWorkspace, setActiveWorkspace] = useState<
    'GT_STUDIO' | 'K_SOULMATE' | 'SOS_COPILOT'
  >('K_SOULMATE');
  const [exportedKSoulmateInfo, setExportedKSoulmateInfo] = useState<KSoulmateExportPayload | null>(null);
  const [exportedSosInfo, setExportedSosInfo] = useState<SosToStudioBridgePayload | null>(null);

  // 페이스북 그룹 자동 발행 프리셋 상태
  const [selectedFbGroupIdx, setSelectedFbGroupIdx] = useState<number>(0);
  const [customFbGroupOverride, setCustomFbGroupOverride] = useState<FacebookGroupPreset | null>(null);

  // JSON Import 모달 및 토스트 상태
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [bridgeInputJson, setBridgeInputJson] = useState('');
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [copiedFlag, setCopiedFlag] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3800);
  };

  const toggleSlidePromptDetail = (idx: number) => {
    setOpenSlidePromptMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 내부 자동 표현 정화 감지 (UI에는 노출하지 않고 내부 처리에 활용)
  const detectedRisks = useMemo(() => {
    return scanRiskWords(`${spotsInput} ${customMemo} ${kpopNewsSummary}`);
  }, [spotsInput, customMemo, kpopNewsSummary]);

  // 좌측 파라미터 기준 즉시 프리뷰 동기화 헬퍼 (내부에서 자동으로 안전 문구로 치환 처리)
  const syncPreviewWithParams = (
    nextAxis: CampaignAxis,
    nextLang: TargetLang,
    nextSpotsStr: string,
    nextJpPresetId: string,
    nextMemo: string,
    nextNews: string = kpopNewsSummary,
    detectedWordsList: string[] = []
  ) => {
    const presetObj =
      JP_5_LEGAL_PRESETS.find((p) => p.id === nextJpPresetId) || JP_5_LEGAL_PRESETS[0];
    const cleanSpots = sanitizeTextWithGuardrails(nextSpotsStr).sanitizedText;
    const cleanNews = sanitizeTextWithGuardrails(nextNews).sanitizedText;
    const spotsArr = cleanSpots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const built = buildCompleteSuiteFallback({
      axis: nextAxis,
      lang: nextLang,
      spots: spotsArr,
      jpPresetCopy: presetObj.jpCopy,
      customMemo: sanitizeTextWithGuardrails(nextMemo).sanitizedText,
      kpopNewsSummary: cleanNews,
      detectedRisks: detectedWordsList
    });
    setSuiteData(built);
  };

  // 컨시어지 표준 표현 자동 정돈 핸들러 (내부 자동 처리)
  const handleOneClickSanitize = () => {
    const cleanSpots = sanitizeTextWithGuardrails(spotsInput);
    const cleanMemo = sanitizeTextWithGuardrails(customMemo);
    const cleanNews = sanitizeTextWithGuardrails(kpopNewsSummary);
    const mergedDetected = Array.from(
      new Set([
        ...cleanSpots.detectedWords,
        ...cleanMemo.detectedWords,
        ...cleanNews.detectedWords
      ])
    );
    setSpotsInput(cleanSpots.sanitizedText);
    setCustomMemo(cleanMemo.sanitizedText);
    setKpopNewsSummary(cleanNews.sanitizedText);
    syncPreviewWithParams(
      axis,
      lang,
      cleanSpots.sanitizedText,
      selectedJpPreset,
      cleanMemo.sanitizedText,
      cleanNews.sanitizedText,
      mergedDetected
    );
    triggerToast('입력 문구가 프리미엄 컨시어지 표준 표현으로 자동 다듬어졌습니다.');
  };

  // 캠페인 축 변경 시 추천 샘플 및 프리뷰 즉시 업데이트
  const handleAxisSelect = (nextAxis: CampaignAxis) => {
    setAxis(nextAxis);
    const preset = SAMPLE_CAMPAIGNS[nextAxis];
    if (preset) {
      const nextNews = preset.kpopNews || kpopNewsSummary;
      setSpotsInput(preset.spots);
      setCustomMemo(preset.memo);
      setSelectedJpPreset(preset.jpPresetId);
      if (preset.kpopNews) {
        setKpopNewsSummary(preset.kpopNews);
      }
      syncPreviewWithParams(
        nextAxis,
        lang,
        preset.spots,
        preset.jpPresetId,
        preset.memo,
        nextNews
      );
    }
  };

  // 언어 변경 시 프리뷰 즉시 업데이트
  const handleLangSelect = (nextLang: TargetLang) => {
    setLang(nextLang);
    syncPreviewWithParams(
      axis,
      nextLang,
      spotsInput,
      selectedJpPreset,
      customMemo,
      kpopNewsSummary
    );
  };

  // 일본어 대표 슬로건 프리셋 선택 시 즉시 동기화
  const handleJpPresetSelect = (presetId: string) => {
    setSelectedJpPreset(presetId);
    syncPreviewWithParams(
      axis,
      lang,
      spotsInput,
      presetId,
      customMemo,
      kpopNewsSummary
    );
  };

  // K-Soulmate 운영 콘솔 -> GT TOUR 스튜디오 양방향 브릿지 핸들러 (시즌 1·2 및 PART C 3대 투어 상품 지원)
  const handleExportFromKSoulmate = (payload: KSoulmateExportPayload) => {
    // 1. 타깃 언어 매핑 (JP -> JP, US -> EN, CN -> CN, KR -> KR)
    const langMap: Record<string, TargetLang> = {
      JP: 'JP',
      US: 'EN',
      CN: 'CN',
      KR: 'KR'
    };
    const mappedLang: TargetLang = langMap[payload.channelCode] || 'JP';

    // 2. 캠페인 테마(Axis) 자동 매핑 (PART C 투어 상품이 있으면 해당 상품 축 우선 적용)
    let mappedAxis: CampaignAxis = 'HOTPLACE';
    if (payload.tourProduct) {
      mappedAxis = payload.tourProduct.targetAxis;
    } else if (payload.complianceRisk) {
      mappedAxis = 'K_BEAUTY';
    } else if (/K-pop|댄스|보컬|트레이닝|팝업|아이돌|쇼케이스|음악방송|투어/i.test(`${payload.place} ${payload.episodeTitle}`)) {
      mappedAxis = 'KPOP_NEWS';
    } else if (/스테이|숙소|호텔|한옥/i.test(`${payload.place} ${payload.episodeTitle}`)) {
      mappedAxis = 'STAY';
    }

    // 3. 일본어 합법 프리셋 매핑
    const mappedJpPreset =
      mappedAxis === 'K_BEAUTY'
        ? 'jp_preset_1'
        : mappedAxis === 'KPOP_NEWS' || mappedAxis === 'STAY'
        ? 'jp_preset_2'
        : 'jp_preset_4';
    const presetObj =
      JP_5_LEGAL_PRESETS.find((p) => p.id === mappedJpPreset) || JP_5_LEGAL_PRESETS[0];

    // 4. 주요 스팟 3곳 구성 (PART C 투어 상품 스팟 또는 에피소드 장소 + 한국어 표현 체험 스팟 + 인근 Verified 스테이)
    const cleanPlace = sanitizeTextWithGuardrails(payload.place).sanitizedText;
    const expr1 = payload.expressions[0] || payload.episodeTitle;
    const expr2 = payload.expressions[1] || '현장 실전 한국어 미션';
    const expr3 = payload.expressions[2] || '성수 로컬 컨시어지 케어';

    const spot1 = payload.tourProduct
      ? sanitizeTextWithGuardrails(payload.tourProduct.spots[0]).sanitizedText
      : `${cleanPlace} (K-Soulmate ${payload.episodeCode || `제${payload.episodeNo}화`} 스팟)`;
    const spot2 = payload.tourProduct
      ? sanitizeTextWithGuardrails(payload.tourProduct.spots[1]).sanitizedText
      : `성수 로컬 성지순례 코스 (${expr1})`;
    const spot3 = payload.tourProduct
      ? sanitizeTextWithGuardrails(payload.tourProduct.spots[2]).sanitizedText
      : `성수·청담 도보 5분 Verified 스테이`;
    const nextSpotsStr = `${spot1}, ${spot2}, ${spot3}`;

    // 5. 핵심 카피 및 뉴스 요약 구성
    const narrationOneLine = payload.narration
      ? payload.narration.replace(/\n+/g, ' ').trim()
      : `${payload.episodeTitle} — 「${expr1}」, 「${expr2}」, 「${expr3}」`;
    const epTag = payload.episodeCode
      ? `시즌2 ${payload.episodeCode}`
      : `제${payload.episodeNo}화`;
    const nextNews = payload.tourProduct
      ? `[K-Soulmate ${epTag} · ${payload.tourProduct.nameKo}] ${payload.tourProduct.summary}`
      : `[K-Soulmate ${epTag} · ${payload.memberName || '5인 전원'}] ${payload.episodeTitle} @ ${cleanPlace}`;
    const nextMemo = sanitizeTextWithGuardrails(
      payload.tourProduct
        ? `[K-Soulmate ${epTag} × GT TOUR ${payload.tourProduct.nameKo}] ${payload.tourProduct.summary} | 혜택: ${payload.tourProduct.includedBenefits.join(' · ')} | 오늘의 3표현: 「${expr1}」 · 「${expr2}」 · 「${expr3}」`
        : `[K-Soulmate ${epTag} ${payload.channelCode} 연동] ${payload.episodeTitle} (${cleanPlace}) | 오늘의 3표현: 「${expr1}」 · 「${expr2}」 · 「${expr3}」 | 대본: ${narrationOneLine}`
    ).sanitizedText;

    // 6. 기본 Suite 생성 후 5개 슬라이드 카피에 K-Soulmate 에피소드·투어 상품 정밀 매핑
    const baseSuite = buildCompleteSuiteFallback({
      axis: mappedAxis,
      lang: mappedLang,
      spots: [spot1, spot2, spot3],
      jpPresetCopy: presetObj.jpCopy,
      customMemo: nextMemo,
      kpopNewsSummary: nextNews
    });

    const locTitle = localizeTextToTargetLang(payload.episodeTitle, mappedLang);
    const locPlace = localizeTextToTargetLang(cleanPlace, mappedLang);
    const locNarration = payload.narration
      ? localizeTextToTargetLang(narrationOneLine.slice(0, 110), mappedLang)
      : '';

    const headlineByLang: Record<TargetLang, string> = payload.tourProduct
      ? {
          JP: `【K-Soulmate ${epTag} 連動】${localizeTextToTargetLang(payload.tourProduct.nameKo, 'JP')}・完全安心ガイド`,
          EN: `[K-Soulmate ${epTag} Tour] ${localizeTextToTargetLang(payload.tourProduct.nameKo, 'EN')} Concierge`,
          CN: `【K-Soulmate ${epTag} 巡演联动】${localizeTextToTargetLang(payload.tourProduct.nameKo, 'CN')}专属礼宾`,
          KR: `[K-Soulmate ${epTag} 투어 연동] GT TOUR ${payload.tourProduct.nameKo}`
        }
      : {
          JP: `[K-Soulmate ${epTag}] ${locPlace}聖地巡礼 — 「${payload.episodeTitle}」`,
          EN: `[K-Soulmate ${epTag}] ${locPlace} Pilgrimage — "${payload.episodeTitle}"`,
          CN: `[K-Soulmate ${epTag}] ${locPlace}同款打卡 — 「${payload.episodeTitle}」`,
          KR: `[K-Soulmate ${epTag}] ${cleanPlace} 성지순례 — 「${payload.episodeTitle}」`
        };

    const subByLang: Record<TargetLang, string> = {
      JP: locNarration
        ? `${locNarration} | 今日の韓国語3表現＆GT TOUR専任コンシェルジュ同行`
        : `今日の韓国語表現「${expr1}」を現地で体験！予約・移動・通訳までGT TOURが一括サポート`,
      EN: locNarration
        ? `${locNarration} | Real Korean phrases & GT TOUR 1:1 private concierge`
        : `Try "${expr1}" on-site in Seoul with GT TOUR's seamless private concierge`,
      CN: locNarration
        ? `${locNarration} | 今日韩语3句表达 & GT TOUR 1:1专属管家陪同`
        : `在首尔现场体验「${expr1}」！预约、专车与中文管家由GT TOUR全程安排`,
      KR: locNarration
        ? `${narrationOneLine.slice(0, 110)} | 오늘의 한국어 3표현 & GT TOUR 1:1 전담 컨시어지`
        : `오늘의 표현 「${expr1}」 현장 미션 코스부터 전용차량·숙소까지 GT TOUR 원스톱 케어`
    };

    const updatedSlides = baseSuite.slides_5.map((s: any, idx: number) => {
      if (idx === 0) {
        return {
          ...s,
          badge: payload.tourProduct ? payload.tourProduct.badge : s.badge,
          headline: headlineByLang[mappedLang],
          sub: subByLang[mappedLang]
        };
      }
      if (idx === 1) {
        return {
          ...s,
          spot_name: `Spot 1. ${localizeTextToTargetLang(spot1, mappedLang)}`,
          row1_loc: `${locPlace} (${epTag} ${payload.memberName || ''})`,
          row2_point: payload.tourProduct
            ? localizeTextToTargetLang(payload.tourProduct.includedBenefits[0] || payload.tourProduct.summary, mappedLang)
            : mappedLang === 'JP'
            ? `韓国語ミッション01「${expr1}」実践スポット・事前予約＆通訳同行`
            : mappedLang === 'EN'
            ? `Korean Mission 01 "${expr1}" on-site experience & priority booking`
            : mappedLang === 'CN'
            ? `韩语任务01「${expr1}」同款打卡点 · 提前预约与翻译陪同`
            : `오늘의 표현 01 「${expr1}」 현장 미션 스팟 · 사전 예약 및 통역 동행`,
          row3_tip: s.row3_tip
        };
      }
      if (idx === 2) {
        return {
          ...s,
          spot_name: `Spot 2. ${localizeTextToTargetLang(spot2, mappedLang)}`,
          row1_loc: `${locPlace} 인근 성지순례 동선`,
          row2_point: payload.tourProduct
            ? localizeTextToTargetLang(payload.tourProduct.includedBenefits[1] || payload.tourProduct.summary, mappedLang)
            : mappedLang === 'JP'
            ? `韓国語ミッション02「${expr2}」＆「${expr3}」ローカル体験`
            : mappedLang === 'EN'
            ? `Korean Mission 02 "${expr2}" & "${expr3}" local experience`
            : mappedLang === 'CN'
            ? `韩语任务02「${expr2}」&「${expr3}」本地深度体验`
            : `오늘의 표현 02 「${expr2}」 & 「${expr3}」 로컬 성지순례 동선`,
          row3_tip: s.row3_tip
        };
      }
      if (idx === 3) {
        return {
          ...s,
          row2_point: payload.tourProduct
            ? localizeTextToTargetLang(payload.tourProduct.includedBenefits[2] || payload.tourProduct.summary, mappedLang)
            : mappedLang === 'JP'
            ? `${epTag}「${locTitle}」コース連携・徒歩5分Verifiedステイ＆深夜送迎`
            : mappedLang === 'EN'
            ? `${epTag} "${locTitle}" route + 5-min walk Verified Stay & late-night transfer`
            : mappedLang === 'CN'
            ? `${epTag}「${locTitle}」路线联动 · 步行5分钟认证住宿与深夜专车接送`
            : `${epTag} 「${payload.episodeTitle}」 코스 연계 도보 5분 Verified 스테이 & 심야 안전 송영`
        };
      }
      if (idx === 4 && payload.tourProduct) {
        return {
          ...s,
          benefits_3: payload.tourProduct.includedBenefits.map((b) =>
            localizeTextToTargetLang(b, mappedLang)
          )
        };
      }
      return s;
    });

    const rebuiltPrompts = buildSlideImagenPrompts({
      axis: mappedAxis,
      lang: mappedLang,
      spot1,
      spot2,
      spot3,
      newsHeadline: nextNews
    });
    const finalSlides = updatedSlides.map((s: any, idx: number) => ({
      ...s,
      visual_aesthetic: rebuiltPrompts[idx]?.visual_aesthetic || s.visual_aesthetic,
      imagen_prompt: rebuiltPrompts[idx]?.imagen_prompt || s.imagen_prompt,
      negative_prompt: rebuiltPrompts[idx]?.negative_prompt || s.negative_prompt
    }));

    setAxis(mappedAxis);
    setLang(mappedLang);
    setSelectedJpPreset(mappedJpPreset);
    setSpotsInput(nextSpotsStr);
    setCustomMemo(nextMemo);
    setKpopNewsSummary(nextNews);
    setSuiteData({
      ...baseSuite,
      slides_5: finalSlides
    });
    setExportedKSoulmateInfo(payload);
    setExportedSosInfo(null);
    setActiveTab('IG_5');
    setActiveWorkspace('GT_STUDIO');
    triggerToast(
      payload.tourProduct
        ? `시즌 2 ${payload.episodeCode} [${payload.tourProduct.nameKo}] 투어 상품이 GT TOUR 스튜디오 5대 채널 기획안으로 즉시 연동되었습니다.`
        : `K-Soulmate ${epTag} 「${payload.episodeTitle}」(${payload.channelCode}) 데이터가 GT TOUR 스튜디오로 매핑되었습니다.`
    );
  };

  // SOS 상담 & 수익 전환 코파일럿 -> GT TOUR 스튜디오 5장 슬라이드 & 전 채널 브릿지 핸들러
  const handleExportFromSosCopilot = (payload: SosToStudioBridgePayload) => {
    const mappedAxis = payload.passSpec.axis;
    const mappedLang = payload.lang;
    const mappedJpPreset =
      mappedAxis === 'K_BEAUTY'
        ? 'jp_preset_1'
        : mappedAxis === 'KPOP_NEWS' || mappedAxis === 'STAY'
        ? 'jp_preset_2'
        : 'jp_preset_4';
    const presetObj =
      JP_5_LEGAL_PRESETS.find((p) => p.id === mappedJpPreset) || JP_5_LEGAL_PRESETS[0];

    const [spot1, spot2, spot3] = payload.passSpec.defaultSpots;
    const nextSpotsStr = `${spot1}, ${spot2}, ${spot3}`;
    const cleanQuestion = sanitizeTextWithGuardrails(payload.question).sanitizedText;
    const nextNews = `[외국인 SOS 인바운드 해결] ${payload.conversionResult.matchedPatternTitle}`;
    const nextMemo = sanitizeTextWithGuardrails(
      `[SOS 고민] ${cleanQuestion.slice(0, 90)} | [해결 패스] ${payload.passSpec.krTitle} | [핵심 팁] ${payload.conversionResult.stage1_empathy_tip.slice(0, 100)}`
    ).sanitizedText;

    const baseSuite = buildCompleteSuiteFallback({
      axis: mappedAxis,
      lang: mappedLang,
      spots: [spot1, spot2, spot3],
      jpPresetCopy: presetObj.jpCopy,
      customMemo: nextMemo,
      kpopNewsSummary: nextNews
    });

    const passTitleLocalized = payload.passSpec.titles[mappedLang];
    const updatedSlides = baseSuite.slides_5.map((s: any, idx: number) => {
      if (idx === 0) {
        return {
          ...s,
          badge: payload.passSpec.code,
          headline:
            mappedLang === 'JP'
              ? `【韓国旅行SOS解決】${payload.passSpec.badge}・完全ガイド`
              : mappedLang === 'EN'
              ? `[Seoul Travel SOS Solved] ${ passTitleLocalized.replace(/^①|②|③|④\s*/, '') }`
              : mappedLang === 'CN'
              ? `【首尔旅行SOS救急】${passTitleLocalized.replace(/^①|②|③|④\s*/, '')}`
              : `[서울 여행 SOS 완벽 해결] ${payload.passSpec.krTitle}`,
          sub: payload.conversionResult.stage1_empathy_tip.slice(0, 120)
        };
      }
      if (idx === 1) {
        return {
          ...s,
          row2_point: payload.conversionResult.stage1_empathy_tip.slice(0, 115)
        };
      }
      if (idx === 2) {
        return {
          ...s,
          row2_point: payload.conversionResult.stage2_pass_pitch.slice(0, 115)
        };
      }
      if (idx === 4) {
        return {
          ...s,
          benefits_3: [
            payload.conversionResult.stage1_empathy_tip.slice(0, 65),
            passTitleLocalized,
            payload.conversionResult.stage3_checkout_cta.slice(0, 75)
          ]
        };
      }
      return s;
    });

    const rebuiltPrompts = buildSlideImagenPrompts({
      axis: mappedAxis,
      lang: mappedLang,
      spot1,
      spot2,
      spot3,
      newsHeadline: nextNews
    });

    const finalSlides = updatedSlides.map((s: any, idx: number) => ({
      ...s,
      visual_aesthetic: rebuiltPrompts[idx]?.visual_aesthetic || s.visual_aesthetic,
      imagen_prompt: rebuiltPrompts[idx]?.imagen_prompt || s.imagen_prompt,
      negative_prompt: rebuiltPrompts[idx]?.negative_prompt || s.negative_prompt
    }));

    setAxis(mappedAxis);
    setLang(mappedLang);
    setSelectedJpPreset(mappedJpPreset);
    setSpotsInput(nextSpotsStr);
    setCustomMemo(nextMemo);
    setKpopNewsSummary(nextNews);
    setSuiteData({
      ...baseSuite,
      slides_5: finalSlides,
      caption: `${payload.conversionResult.stage1_empathy_tip}\n\n${payload.conversionResult.stage2_pass_pitch}\n\n${payload.conversionResult.stage3_checkout_cta}\n\n${FIXED_GTTOUR_FOOTER}`
    });
    setExportedSosInfo(payload);
    setExportedKSoulmateInfo(null);
    setCustomFbGroupOverride(null);
    setActiveTab('IG_5');
    setActiveWorkspace('GT_STUDIO');
    triggerToast(
      `SOS 상담 고민(${payload.conversionResult.matchedPatternCode})이 01. 캠페인 기본 설정 및 5장 슬라이드 기획안으로 즉시 변환되었습니다.`
    );
  };

  // 서버 콘텐츠 생성 호출 (입력값은 내부에서 자동 정화하여 전송)
  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    const presetObj =
      JP_5_LEGAL_PRESETS.find((p) => p.id === selectedJpPreset) || JP_5_LEGAL_PRESETS[0];
    const cleanSpots = sanitizeTextWithGuardrails(spotsInput);
    const cleanMemo = sanitizeTextWithGuardrails(customMemo);
    const cleanNews = sanitizeTextWithGuardrails(kpopNewsSummary);

    // 입력창에도 정화된 표현을 조용히 반영
    if (cleanSpots.detectedWords.length > 0) setSpotsInput(cleanSpots.sanitizedText);
    if (cleanMemo.detectedWords.length > 0) setCustomMemo(cleanMemo.sanitizedText);
    if (cleanNews.detectedWords.length > 0) setKpopNewsSummary(cleanNews.sanitizedText);

    const spotsList = cleanSpots.sanitizedText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allDetected = Array.from(
      new Set([
        ...cleanSpots.detectedWords,
        ...cleanMemo.detectedWords,
        ...cleanNews.detectedWords
      ])
    );

    try {
      const res = await fetch('/api/generate-suite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          axis,
          lang,
          spots: spotsList,
          selectedJpPresetId: selectedJpPreset,
          customMemo: cleanMemo.sanitizedText,
          kpopNewsSummary: cleanNews.sanitizedText
        })
      });
      const data = await res.json();
      const guaranteed = ensureCompleteSuiteData(data, {
        axis,
        lang,
        spots: spotsList,
        jpPresetCopy: presetObj.jpCopy,
        customMemo: cleanMemo.sanitizedText,
        kpopNewsSummary: cleanNews.sanitizedText,
        detectedRisks: allDetected
      });
      setSuiteData(guaranteed);
      if (lang === 'CN' && activeTab === 'IG_5') {
        setActiveTab('XHS_7');
      }
      triggerToast(`${lang} 5대 채널 콘텐츠 패키지 생성이 완료되었습니다.`);
    } catch (_err: any) {
      const fallbackSuite = ensureCompleteSuiteData(null, {
        axis,
        lang,
        spots: spotsList,
        jpPresetCopy: presetObj.jpCopy,
        customMemo: cleanMemo.sanitizedText,
        kpopNewsSummary: cleanNews.sanitizedText,
        detectedRisks: allDetected
      });
      setSuiteData(fallbackSuite);
      triggerToast(`${lang} 5대 채널 콘텐츠 패키지 생성이 완료되었습니다.`);
    } finally {
      setLoading(false);
    }
  };

  // 상태 업데이트 및 내부 감사 동기화 공통 헬퍼
  const applySuiteUpdate = (nextSuite: any) => {
    const audit = auditSuiteCompliance(
      nextSuite,
      suiteData?.compliance_check?.detected_risk_words || []
    );
    nextSuite.compliance_check = {
      medical_law_passed: audit.medical_law_passed,
      performance_law_passed: audit.performance_law_passed,
      advertising_law_passed: audit.advertising_law_passed,
      detected_risk_words: audit.detected_risk_words
    };
    setSuiteData(nextSuite);
  };

  // 슬라이드 인라인 편집 -> 실시간 양방향 동기화 핸들러
  const handleSlideEdit = (slideIndex: number, field: string, value: any) => {
    if (!suiteData) return;
    const updatedSlides = [...suiteData.slides_5];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      [field]: field === 'footer' ? FIXED_GTTOUR_FOOTER : value
    };
    applySuiteUpdate({ ...suiteData, slides_5: updatedSlides });
  };

  // Slide 5의 benefits_3 배열 개별 항목 인라인 편집
  const handleBenefitEdit = (slideIndex: number, benefitIdx: number, value: string) => {
    if (!suiteData) return;
    const currentBenefits = Array.isArray(suiteData.slides_5[slideIndex]?.benefits_3)
      ? [...suiteData.slides_5[slideIndex].benefits_3]
      : ['', '', ''];
    currentBenefits[benefitIdx] = value;
    handleSlideEdit(slideIndex, 'benefits_3', currentBenefits);
  };

  // 캡션 인라인 편집
  const handleCaptionEdit = (value: string) => {
    if (!suiteData) return;
    applySuiteUpdate({ ...suiteData, caption: value });
  };

  // 15초 릴스 대본 인라인 편집
  const handleReelsEdit = (cutIndex: number, field: string, value: string) => {
    if (!suiteData || !Array.isArray(suiteData.reels_15s)) return;
    const updatedReels = [...suiteData.reels_15s];
    updatedReels[cutIndex] = { ...updatedReels[cutIndex], [field]: value };
    applySuiteUpdate({ ...suiteData, reels_15s: updatedReels });
  };

  // 샤오홍슈 7장 인라인 편집
  const handleXhsSlideEdit = (pageIndex: number, field: string, value: string) => {
    if (!suiteData?.xiaohongshu_7?.slides_7) return;
    const updatedPages = [...suiteData.xiaohongshu_7.slides_7];
    updatedPages[pageIndex] = { ...updatedPages[pageIndex], [field]: value };
    applySuiteUpdate({
      ...suiteData,
      xiaohongshu_7: {
        ...suiteData.xiaohongshu_7,
        slides_7: updatedPages
      }
    });
  };

  // X (@enjoywithkorea) 3단 스레드 인라인 편집
  const handleXTweetEdit = (tweetIndex: number, value: string) => {
    if (!suiteData?.x_thread_3?.tweets) return;
    const updatedTweets = [...suiteData.x_thread_3.tweets];
    updatedTweets[tweetIndex] = { ...updatedTweets[tweetIndex], content: value };
    applySuiteUpdate({
      ...suiteData,
      x_thread_3: {
        ...suiteData.x_thread_3,
        handle: X_CHANNEL_HANDLE,
        tweets: updatedTweets
      }
    });
  };

  const handleXHashtagsEdit = (value: string) => {
    if (!suiteData?.x_thread_3) return;
    const tags = value
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));
    applySuiteUpdate({
      ...suiteData,
      x_thread_3: {
        ...suiteData.x_thread_3,
        trend_hashtags: tags
      }
    });
  };

  // Threads (@gttourkorea) 인라인 편집
  const handleThreadsEdit = (
    field: 'topic_tag' | 'body_text' | 'engagement_question' | 'concierge_bridge',
    value: string
  ) => {
    if (!suiteData?.threads_post) return;
    applySuiteUpdate({
      ...suiteData,
      threads_post: {
        ...suiteData.threads_post,
        handle: THREADS_CHANNEL_HANDLE,
        [field]: value
      }
    });
  };

  // IG 5장 전체 이미지 프롬프트 복사용 포맷 문자열
  const formattedAllImagenPrompts = useMemo(() => {
    if (!suiteData?.slides_5) return '';
    return suiteData.slides_5
      .map(
        (s: any, i: number) =>
          `[SLIDE 0${i + 1} · ${s.type?.toUpperCase()} | ${s.aspect_ratio || '4:5'}]\n- Aesthetic: ${s.visual_aesthetic || ''}\n- Prompt: ${s.imagen_prompt || ''}\n- Negative Prompt: ${s.negative_prompt || DEFAULT_IMAGEN_NEGATIVE_PROMPT}`
      )
      .join('\n\n========================================\n\n');
  }, [suiteData]);

  // 개별 슬라이드 원어민 감성 이미지 프롬프트 재조합 핸들러
  const handleResetSlideImagenPrompt = (slideIndex: number) => {
    if (!suiteData?.slides_5) return;
    const cleanSpots = sanitizeTextWithGuardrails(spotsInput).sanitizedText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const spot1 = localizeTextToTargetLang(cleanSpots[0] || '청담 프라이빗 라운지', lang);
    const spot2 = localizeTextToTargetLang(cleanSpots[1] || '성수 플래그십 스토어', lang);
    const spot3 = localizeTextToTargetLang(cleanSpots[2] || '한남 브런치 다이닝', lang);
    const newsHeadline = localizeTextToTargetLang(
      sanitizeTextWithGuardrails(kpopNewsSummary).sanitizedText,
      lang
    );

    const rebuiltSpecs = buildSlideImagenPrompts({
      axis,
      lang,
      spot1,
      spot2,
      spot3,
      newsHeadline
    });
    const targetSpec = rebuiltSpecs[slideIndex];
    if (!targetSpec) return;

    const updatedSlides = [...suiteData.slides_5];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      visual_aesthetic: targetSpec.visual_aesthetic,
      imagen_prompt: targetSpec.imagen_prompt,
      negative_prompt: targetSpec.negative_prompt,
      composition_guide: targetSpec.composition_guide
    };
    applySuiteUpdate({ ...suiteData, slides_5: updatedSlides });
    triggerToast(`Slide 0${slideIndex + 1}의 ${lang} 비주얼 프롬프트가 재조합되었습니다.`);
  };

  // 전체 5장 슬라이드 화면 비율 일괄 변경 핸들러
  const handleGlobalAspectRatioChange = (nextRatio: '4:5' | '1:1' | '3:4') => {
    if (!suiteData?.slides_5) return;
    const updatedSlides = suiteData.slides_5.map((s: any) => ({
      ...s,
      aspect_ratio: nextRatio
    }));
    applySuiteUpdate({ ...suiteData, slides_5: updatedSlides });
    triggerToast(`5장 슬라이드 이미지 비율이 ${nextRatio}로 변경되었습니다.`);
  };

  // 다중 폴백(Multi-Stage Smart Fallback) 실사 매거진 이미지 생성 파이프라인 (에러 원천 차단)
  // 1차: imagen-3.0-generate-002 -> 2차: gemini-2.5-flash-image -> 3차: Pollinations AI & 고화질 에디토리얼 큐레이션 + Canvas 매거진 타이포그래피 합성
  const runDualSlideImagePipeline = async (
    slide: any,
    slideIndex: number = 0
  ): Promise<{
    imageUrl: string;
    sourceModel: string;
    primaryErrorNotice: string | null;
  }> => {
    const rawPrompt = String(slide.imagen_prompt || '').trim();
    const { sanitizedText: cleanPrompt } = sanitizeTextWithGuardrails(rawPrompt);
    const negativePrompt = slide.negative_prompt || DEFAULT_IMAGEN_NEGATIVE_PROMPT;
    const rawRatio = slide.aspect_ratio || '4:5';

    let serverImageUrl: string | undefined;
    let serverSourceModel: string | undefined;

    try {
      const res = await fetch('/api/generate-slide-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagen_prompt: cleanPrompt,
          negative_prompt: negativePrompt,
          aspect_ratio: rawRatio
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.ok && data?.imageUrl) {
          // 1차/2차에서 실제 base64 사진이 반환된 경우 즉시 사용
          if (String(data.imageUrl).startsWith('data:image/')) {
            return {
              imageUrl: data.imageUrl,
              sourceModel: data.sourceModel || 'imagen-3.0-generate-002',
              primaryErrorNotice: null
            };
          }
          serverImageUrl = data.imageUrl;
          serverSourceModel = data.sourceModel;
        }
      }
    } catch {
      // 정적 배포 환경 또는 네트워크 예외 시 즉시 3차 매거진 캔버스 합성 엔진으로 진행
    }

    // 3차 스마트 폴백: Pollinations AI + 테마별 에디토리얼 화보 + Canvas 타이포그래피 오버레이 합성 (100% 성공 보장)
    const composed = await renderMagazineSlideCanvasDataUrl({
      slideIndex,
      slide,
      axis,
      lang,
      baseImageUrl: serverImageUrl,
      sourceModel: serverSourceModel
    });

    return {
      imageUrl: composed.imageUrl,
      sourceModel: composed.sourceModel,
      primaryErrorNotice: null
    };
  };

  // 개별 슬라이드 실사 이미지 생성 호출 핸들러 (에러 원천 차단)
  const handleGenerateSlideImage = async (slideIndex: number) => {
    if (!suiteData?.slides_5?.[slideIndex]) return;
    const slide = suiteData.slides_5[slideIndex];
    setSlideGeneratingMap((prev) => ({ ...prev, [slideIndex]: true }));
    setSlideErrorMap((prev) => ({ ...prev, [slideIndex]: null }));
    setImagenPipelineAlert(null);

    try {
      const result = await runDualSlideImagePipeline(slide, slideIndex);
      const updatedSlides = [...suiteData.slides_5];
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        generated_image_url: result.imageUrl,
        imagen_source: result.sourceModel,
        imagen_fallback_notice: null
      };
      applySuiteUpdate({ ...suiteData, slides_5: updatedSlides });
      triggerToast(`Slide 0${slideIndex + 1} 매거진 화보 이미지가 생성되었습니다.`);
    } catch {
      const composed = await renderMagazineSlideCanvasDataUrl({
        slideIndex,
        slide,
        axis,
        lang
      });
      const updatedSlides = [...suiteData.slides_5];
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        generated_image_url: composed.imageUrl,
        imagen_source: composed.sourceModel,
        imagen_fallback_notice: null
      };
      applySuiteUpdate({ ...suiteData, slides_5: updatedSlides });
      triggerToast(`Slide 0${slideIndex + 1} 매거진 화보 이미지가 생성되었습니다.`);
    } finally {
      setSlideGeneratingMap((prev) => ({ ...prev, [slideIndex]: false }));
    }
  };

  // 5장 전체 슬라이드 실사 이미지 일괄 생성 핸들러 (100% 성공 보장)
  const handleBatchGenerateAllSlideImages = async () => {
    if (!suiteData?.slides_5) return;
    setBatchGeneratingImages(true);
    setImagenPipelineAlert(null);
    setSlideErrorMap({});

    try {
      const updatedSlides = [...suiteData.slides_5];
      for (let idx = 0; idx < updatedSlides.length; idx++) {
        setSlideGeneratingMap((prev) => ({ ...prev, [idx]: true }));
        const slide = updatedSlides[idx];
        try {
          const result = await runDualSlideImagePipeline(slide, idx);
          updatedSlides[idx] = {
            ...updatedSlides[idx],
            generated_image_url: result.imageUrl,
            imagen_source: result.sourceModel,
            imagen_fallback_notice: null
          };
          applySuiteUpdate({ ...suiteData, slides_5: [...updatedSlides] });
        } catch {
          const composed = await renderMagazineSlideCanvasDataUrl({
            slideIndex: idx,
            slide,
            axis,
            lang
          });
          updatedSlides[idx] = {
            ...updatedSlides[idx],
            generated_image_url: composed.imageUrl,
            imagen_source: composed.sourceModel,
            imagen_fallback_notice: null
          };
          applySuiteUpdate({ ...suiteData, slides_5: [...updatedSlides] });
        } finally {
          setSlideGeneratingMap((prev) => ({ ...prev, [idx]: false }));
        }
      }
      triggerToast('5장 슬라이드 매거진 화보 이미지가 모두 생성되었습니다.');
    } finally {
      setBatchGeneratingImages(false);
    }
  };

  // X 3단 스레드 전체 복사용 포맷 문자열
  const formattedXThreadText = useMemo(() => {
    if (!suiteData?.x_thread_3?.tweets) return '';
    const tweetsText = suiteData.x_thread_3.tweets
      .map((t: any, idx: number) => `[Tweet ${idx + 1}/3]\n${t.content}`)
      .join('\n\n---\n\n');
    const tagsText = (suiteData.x_thread_3.trend_hashtags || []).join(' ');
    return `${tweetsText}\n\n${tagsText}`.trim();
  }, [suiteData]);

  // Threads 포스트 전체 복사용 포맷 문자열
  const formattedThreadsText = useMemo(() => {
    if (!suiteData?.threads_post) return '';
    const tp = suiteData.threads_post;
    return `${tp.body_text}\n\n${tp.engagement_question}\n\n${tp.concierge_bridge}`.trim();
  }, [suiteData]);

  // 페이스북 그룹 자동 발행 프리셋 목록 계산
  const fbGroupPresets = useMemo(() => {
    const spotsArr = spotsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const headline =
      suiteData?.slides_5?.[0]?.headline ||
      'GT TOUR 서울 프라이빗 컨시어지 & Verified Stay';
    return buildFacebookGroupPresets({
      axis,
      lang,
      spots: spotsArr.length > 0 ? spotsArr : ['성수', '청담', '올림픽공원'],
      headline
    });
  }, [axis, lang, spotsInput, suiteData]);

  const activeFbGroupPreset: FacebookGroupPreset = useMemo(() => {
    if (customFbGroupOverride && customFbGroupOverride.lang === lang) {
      return customFbGroupOverride;
    }
    return fbGroupPresets[selectedFbGroupIdx] || fbGroupPresets[0];
  }, [customFbGroupOverride, fbGroupPresets, selectedFbGroupIdx, lang]);

  // JSON 출력 문자열 계산 (Strict vs Full Suite vs Imagen Tool Payload)
  const displayedJson = useMemo(() => {
    if (!suiteData) return '';
    if (schemaMode === 'STRICT') {
      return JSON.stringify(toStrictSchema(suiteData), null, 2);
    }
    if (schemaMode === 'IMAGEN') {
      return JSON.stringify(exportImagenToolPayload(suiteData), null, 2);
    }
    return JSON.stringify(suiteData, null, 2);
  }, [suiteData, schemaMode]);

  // JSON Import 실행
  const handleBridgeImport = () => {
    setBridgeError(null);
    try {
      const result = parseBridgePayload(bridgeInputJson);
      if (result.type === 'SUITE_DATA') {
        setSuiteData(result.payload);
        setAxis(result.payload.campaign_meta.axis as CampaignAxis);
        setLang(result.payload.campaign_meta.lang as TargetLang);
        triggerToast('캠페인 데이터가 프리뷰에 반영되었습니다.');
      } else {
        const nextAxis = result.payload.axis as CampaignAxis;
        const nextLang = result.payload.lang as TargetLang;
        const nextNews = result.payload.kpopNewsSummary || kpopNewsSummary;
        setAxis(nextAxis);
        setLang(nextLang);
        setSpotsInput(result.payload.spots);
        setSelectedJpPreset(result.payload.selectedJpPresetId);
        setCustomMemo(result.payload.customMemo);
        setKpopNewsSummary(nextNews);
        syncPreviewWithParams(
          nextAxis,
          nextLang,
          result.payload.spots,
          result.payload.selectedJpPresetId,
          result.payload.customMemo,
          nextNews
        );
        triggerToast('캠페인 설정 프리셋이 적용되었습니다.');
      }
      setShowBridgeModal(false);
      setBridgeInputJson('');
    } catch (e: any) {
      setBridgeError(e.message || '데이터 형식을 확인해 주세요.');
    }
  };

  // JSON 파일 다운로드
  const handleDownloadJson = () => {
    if (!displayedJson) return;
    const blob = new Blob([displayedJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gttour_${axis.toLowerCase()}_${lang.toLowerCase()}_${schemaMode.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('데이터 파일을 저장했습니다.');
  };

  // 전역 브릿지 API 유지
  useEffect(() => {
    window.GTTOUR_BRIDGE = {
      importPayload: (jsonString: string) => {
        const res = parseBridgePayload(jsonString);
        if (res.type === 'SUITE_DATA') setSuiteData(res.payload);
      },
      exportJSON: (mode: 'STRICT' | 'FULL' | 'IMAGEN' = 'FULL') => {
        if (!suiteData) return '{}';
        if (mode === 'STRICT') return JSON.stringify(toStrictSchema(suiteData), null, 2);
        if (mode === 'IMAGEN') return JSON.stringify(exportImagenToolPayload(suiteData), null, 2);
        return JSON.stringify(suiteData, null, 2);
      },
      exportImagenPayload: () => exportImagenToolPayload(suiteData),
      getGuardrails: () => BANNED_RULES,
      getJpPresets: () => JP_5_LEGAL_PRESETS
    };
  }, [suiteData]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2 max-w-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="break-words">{toastMsg}</span>
        </div>
      )}

      {/* 최상단 통합 마스터 헤더 (Unified Workspace Switcher - 3 Core Workspaces) */}
      <div className="sticky top-0 z-50 min-h-12 bg-[#0F172A] text-white border-b border-slate-800 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2563EB] text-[11px] font-black tracking-tighter shrink-0">
            GT
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-white truncate">
            GT TOUR × K-Soulmate Unified Suite
          </span>
          <span className="hidden 2xl:inline-block text-[11px] text-slate-400 border-l border-slate-700 pl-2.5">
            글로벌 6대 채널 스튜디오 · K-Soulmate 운영 콘솔 · 양방향 SOS 수익 전환 코파일럿
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setActiveWorkspace('GT_STUDIO')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeWorkspace === 'GT_STUDIO'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>✨ GT TOUR 크리에이티브 스튜디오</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspace('K_SOULMATE')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeWorkspace === 'K_SOULMATE'
                  ? 'bg-[#1F5E63] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 shrink-0" />
              <span>🗂️ K-Soulmate 콘텐츠 운영 콘솔 (M1~M7 전체 화면)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspace('SOS_COPILOT')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeWorkspace === 'SOS_COPILOT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <MessageCircleQuestion className="w-3.5 h-3.5 shrink-0" />
              <span>💬 양방향 SOS 상담 & 수익 전환 코파일럿</span>
            </button>
          </div>
        </div>
      </div>

      {/* 워크스페이스 2: K-Soulmate 콘텐츠 운영 콘솔 (8개 화면 & AC-01~AC-15 원본 100% 보존) */}
      {activeWorkspace === 'K_SOULMATE' ? (
        <div className="flex-1">
          <KSoulmateApp onExportToGtStudio={handleExportFromKSoulmate} />
        </div>
      ) : activeWorkspace === 'SOS_COPILOT' ? (
        /* 워크스페이스 3: 양방향 SOS 상담 & 수익 전환 코파일럿 (사전 확보 4대 패스 & 50대 매크로) */
        <SosCopilotWorkspace
          initialLang={lang}
          onExportToStudio={handleExportFromSosCopilot}
          onTriggerToast={triggerToast}
        />
      ) : (
        <>
          {/* Top Navigation Bar (Strict 3-Zone Contract) */}
          <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between gap-8 shrink-0">
            {/* Zone 1: Single-line Brand Title */}
            <a
              href="#top"
              className="text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
            >
              GT TOUR Content Studio
            </a>

            {/* Zone 2: Concise Single-Line Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
              <button
                onClick={() => setActiveTab('IG_5')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Instagram (@gttourkorea)
              </button>
              <button
                onClick={() => setActiveTab('FB_5')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Facebook (그룹 자동발행)
              </button>
              <button
                onClick={() => setActiveTab('REELS_15')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                15s Reels
              </button>
              <button
                onClick={() => setActiveTab('XHS_7')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Xiaohongshu
              </button>
              <button
                onClick={() => setActiveTab('X_THREAD')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                X (@enjoywithkorea)
              </button>
              <button
                onClick={() => setActiveTab('THREADS')}
                className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Threads (@gttourkorea)
              </button>
            </nav>

            {/* Zone 3: Collapsible Technical Tools Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveWorkspace('SOS_COPILOT')}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-600/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageCircleQuestion className="w-3.5 h-3.5" />
                <span>SOS 상담 코파일럿</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveWorkspace('K_SOULMATE')}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-[#1F5E63]/30 bg-[#1F5E63]/10 text-[#1F5E63] hover:bg-[#1F5E63] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>K-Soulmate 불러오기</span>
              </button>
              <button
                onClick={() => setShowTechnicalJsonPanel((prev) => !prev)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  showTechnicalJsonPanel
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{showTechnicalJsonPanel ? '고급 데이터 창 닫기' : '고급 / JSON 데이터 보기'}</span>
              </button>
            </div>
          </header>

          {/* Main 2-Column Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
            {/* Left Panel: Clean Campaign Setup */}
            <aside className="bg-white p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-tight text-slate-900">
                    01. 캠페인 기본 설정
                  </h2>
                  <button
                    onClick={() => setShowBridgeModal(true)}
                    className="text-xs font-medium text-slate-500 hover:text-[#2563EB] flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    프리셋 불러오기
                  </button>
                </div>

                {/* K-Soulmate 연동 배너 (브릿지로 넘어온 경우 표시) */}
                {exportedKSoulmateInfo && (
                  <div className="rounded-lg border border-[#1F5E63]/30 bg-[#1F5E63]/5 p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#1F5E63] flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" />
                        {exportedKSoulmateInfo.tourProduct
                          ? `시즌2 ${exportedKSoulmateInfo.episodeCode} · [${exportedKSoulmateInfo.tourProduct.nameKo}] 투어 상품 연동됨`
                          : `K-Soulmate ${exportedKSoulmateInfo.episodeCode || `제${exportedKSoulmateInfo.episodeNo}화`} 연동됨`}{" "}
                        ({exportedKSoulmateInfo.channelCode} → {lang})
                      </span>
                      <button
                        type="button"
                        onClick={() => setExportedKSoulmateInfo(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      「{exportedKSoulmateInfo.episodeTitle}」 · {exportedKSoulmateInfo.place}
                    </p>
                    {exportedKSoulmateInfo.tourProduct && (
                      <p className="text-[11px] font-medium text-[#1F5E63]">
                        혜택: {exportedKSoulmateInfo.tourProduct.includedBenefits.join(' · ')}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      오늘의 표현: {exportedKSoulmateInfo.expressions.map((e) => `「${e}」`).join(' ')}
                    </p>
                  </div>
                )}

                {/* SOS 상담 코파일럿 연동 배너 (브릿지로 넘어온 경우 표시) */}
                {exportedSosInfo && (
                  <div className="rounded-lg border border-emerald-600/30 bg-emerald-50/60 p-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <MessageCircleQuestion className="w-3.5 h-3.5" />
                        SOS 상담 고민 연동됨 ({exportedSosInfo.conversionResult.matchedPatternCode} · {exportedSosInfo.passSpec.code})
                      </span>
                      <button
                        type="button"
                        onClick={() => setExportedSosInfo(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {exportedSosInfo.conversionResult.matchedPatternTitle}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      연결 패스: {exportedSosInfo.passSpec.krTitle}
                    </p>
                  </div>
                )}

            {/* 4-Axis Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                캠페인 테마
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'K_BEAUTY', label: 'K-뷰티 · 웰니스' },
                    { id: 'STAY', label: '프리미엄 스테이' },
                    { id: 'HOTPLACE', label: '서울 핫플레이스' },
                    { id: 'KPOP_NEWS', label: 'K-POP 뉴스 · 성지순례' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAxisSelect(item.id)}
                    className={`py-2 px-2.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      axis === item.id
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPOP_NEWS Dedicated Input */}
            {axis === 'KPOP_NEWS' && (
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2">
                <label className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  K-POP 최신 뉴스 · 공연 · 팝업 이슈
                </label>
                <textarea
                  rows={2}
                  value={kpopNewsSummary}
                  onChange={(e) => setKpopNewsSummary(e.target.value)}
                  placeholder="예: KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정"
                  className="w-full text-xs p-2 border border-blue-200 rounded bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] text-slate-500">추천 예시:</span>
                  <button
                    onClick={() => {
                      const news =
                        'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정';
                      const spots =
                        'KSPO DOME 도보 5분 Verified 스테이, 성수 K-POP 공식 팝업스토어, 용산 하이브 인근 아티스트 성지순례 카페';
                      setKpopNewsSummary(news);
                      setSpotsInput(spots);
                      syncPreviewWithParams(
                        'KPOP_NEWS',
                        lang,
                        spots,
                        selectedJpPreset,
                        customMemo,
                        news
                      );
                    }}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-[#2563EB] cursor-pointer"
                  >
                    KSPO DOME & 성수 팝업
                  </button>
                  <button
                    onClick={() => {
                      const news =
                        '인스파이어 아레나 앙코르 콘서트 및 더현대 서울 공식 팝업스토어';
                      const spots =
                        '인스파이어 아레나 전용차량 송영 스테이, 더현대 서울 공식 팝업스토어, 한남동 아티스트 성지순례 다이닝';
                      setKpopNewsSummary(news);
                      setSpotsInput(spots);
                      syncPreviewWithParams(
                        'KPOP_NEWS',
                        lang,
                        spots,
                        selectedJpPreset,
                        customMemo,
                        news
                      );
                    }}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-[#2563EB] cursor-pointer"
                  >
                    인스파이어 아레나 & 더현대 팝업
                  </button>
                </div>
              </div>
            )}

            {/* Target Language & Persona */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                타깃 언어 및 에디터 톤앤매너
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { code: 'JP', label: '일본어 (JP)' },
                  { code: 'EN', label: '영어 (EN)' },
                  { code: 'CN', label: '중국어 (CN)' },
                  { code: 'KR', label: '한국어 (KR)' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLangSelect(item.code as TargetLang)}
                    className={`py-2 px-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      lang === item.code
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-700">
                  {MARKETER_PERSONAS[lang].name}
                </span>
                <span aria-hidden="true">·</span>
                <span>{MARKETER_PERSONAS[lang].tone}</span>
              </div>
            </div>

            {/* Spot Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                주요 코스 / 스팟 3곳 (쉼표로 구분)
              </label>
              <textarea
                rows={2}
                value={spotsInput}
                onChange={(e) => setSpotsInput(e.target.value)}
                placeholder="예: 청담 프라이빗 라운지, 성수 플래그십 스토어, 한남 브런치 다이닝"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB] bg-white"
              />
            </div>

            {/* Custom Concierge Memo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  강조할 컨시어지 서비스 포인트 (선택)
                </label>
                {detectedRisks.length > 0 && (
                  <button
                    onClick={handleOneClickSanitize}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    컨시어지 표준 표현으로 자동 다듬기
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
                placeholder="예: 공항 전용 리무진 픽업, 도보 5분 호텔 체크인, 전담 통역 매니저 동행"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#2563EB] bg-white"
              />
            </div>
          </div>

          {/* JP Slogan Presets (Clean marketing presentation without legal jargon) */}
          {lang === 'JP' && (
            <div className="border-t border-slate-200 pt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800">
                  02. 일본어 대표 컨시어지 슬로건 선택
                </h2>
                <span className="text-[11px] text-slate-400">클릭 시 즉시 적용</span>
              </div>
              <div className="space-y-2">
                {JP_5_LEGAL_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleJpPresetSelect(preset.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedJpPreset === preset.id
                        ? 'border-[#2563EB] bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{preset.label}</span>
                      <span className="text-[11px] text-[#2563EB] font-medium">
                        {preset.category}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#0F172A] mt-0.5">
                      「{preset.jpCopy}」
                    </div>
                    <div className="text-[11px] text-slate-500">{preset.krMeaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? '5대 채널 원어민 콘텐츠 생성 중...'
                : '글로벌 5대 채널 콘텐츠 생성하기'}
            </span>
          </button>
        </aside>

        {/* Right Panel: Content & Image Studio (with optional collapsible JSON drawer) */}
        <main
          className={`p-6 grid grid-cols-1 ${
            showTechnicalJsonPanel ? 'xl:grid-cols-2' : 'max-w-4xl mx-auto w-full'
          } gap-6 overflow-y-auto`}
        >
          {/* Column 1: Visual Card Preview & Inline Editor (5 Channel Tabs) */}
          <section className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg flex-wrap">
                <button
                  onClick={() => setActiveTab('IG_5')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'IG_5'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  인스타그램 5장
                </button>
                <button
                  onClick={() => setActiveTab('FB_5')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'FB_5'
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  페이스북 (Facebook)
                </button>
                <button
                  onClick={() => setActiveTab('REELS_15')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'REELS_15'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  15초 릴스
                </button>
                <button
                  onClick={() => setActiveTab('XHS_7')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'XHS_7'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  샤오홍슈 7장
                </button>
                <button
                  onClick={() => setActiveTab('X_THREAD')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'X_THREAD'
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  X (@enjoywithkorea)
                </button>
                <button
                  onClick={() => setActiveTab('THREADS')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'THREADS'
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  Threads (@gttourkorea)
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-32 bg-white border border-slate-200 rounded-lg p-4 animate-pulse space-y-3"
                  >
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : activeTab === 'IG_5' || activeTab === 'FB_5' ? (
              <div className="space-y-3">
                {/* 페이스북 (Facebook) 탭 전용: [페이스북 그룹 자동 발행 프리셋] 패널 */}
                {activeTab === 'FB_5' && activeFbGroupPreset && (
                  <div className="p-4 bg-white border border-blue-200 rounded-lg space-y-3.5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#2563EB] font-bold">
                          <Share2 className="w-3.5 h-3.5" />
                          <span>페이스북 그룹 자동 발행 프리셋 ({lang} 타깃 커뮤니티)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          5장 슬라이드 이미지와 함께 글로벌 한류·서울 여행 페이스북 그룹에 즉시 발행할 수 있는 정보형 본문 및 첫 댓글 고정 링크입니다.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const fullFbPack = `${activeFbGroupPreset.groupPostTitle}\n\n${activeFbGroupPreset.groupPostBody}\n\n---\n[첫 댓글 고정용]\n${activeFbGroupPreset.firstCommentPin}`;
                          navigator.clipboard.writeText(fullFbPack);
                          triggerToast('페이스북 그룹 제목 + 본문 + 첫 댓글 세트가 복사되었습니다.');
                        }}
                        className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>그룹 발행 세트 전체 복사</span>
                      </button>
                    </div>

                    {/* 타깃 페이스북 그룹 프리셋 선택 버튼 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {fbGroupPresets.map((preset, gIdx) => {
                        const isSelected = selectedFbGroupIdx === gIdx;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setSelectedFbGroupIdx(gIdx);
                              setCustomFbGroupOverride(null);
                            }}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-[#2563EB] bg-blue-50/60 text-slate-900'
                                : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-bold text-slate-900 truncate">
                              {preset.groupName}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <span>{preset.memberScale}</span>
                              <span>·</span>
                              <span className="text-[#2563EB] font-medium">
                                {preset.bestTimeSlot}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* 그룹 포스트 제목 / 본문 / 첫 댓글 인라인 편집 */}
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-600">
                            그룹 포스트 헤드라인 (어그로·광고 차단 우회 정보형 훅)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activeFbGroupPreset.groupPostTitle);
                              triggerToast('페이스북 그룹 제목이 복사되었습니다.');
                            }}
                            className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                          >
                            제목 복사
                          </button>
                        </div>
                        <input
                          value={activeFbGroupPreset.groupPostTitle}
                          onChange={(e) =>
                            setCustomFbGroupOverride({
                              ...activeFbGroupPreset,
                              groupPostTitle: e.target.value
                            })
                          }
                          className="w-full font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-600">
                            그룹 포스트 본문 (5장 슬라이드 요약 & 동선 가이드)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activeFbGroupPreset.groupPostBody);
                              triggerToast('페이스북 그룹 본문이 복사되었습니다.');
                            }}
                            className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                          >
                            본문 복사
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={activeFbGroupPreset.groupPostBody}
                          onChange={(e) =>
                            setCustomFbGroupOverride({
                              ...activeFbGroupPreset,
                              groupPostBody: e.target.value
                            })
                          }
                          className="w-full text-slate-800 leading-relaxed bg-slate-50/70 border border-slate-200 rounded p-2.5 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-emerald-800">
                            자동 첫 댓글 고정 문구 (사전 확보 패스 & 셀프 체크아웃 링크)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activeFbGroupPreset.firstCommentPin);
                              triggerToast('페이스북 첫 댓글 고정 문구가 복사되었습니다.');
                            }}
                            className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                          >
                            첫 댓글 복사
                          </button>
                        </div>
                        <input
                          value={activeFbGroupPreset.firstCommentPin}
                          onChange={(e) =>
                            setCustomFbGroupOverride({
                              ...activeFbGroupPreset,
                              firstCommentPin: e.target.value
                            })
                          }
                          className="w-full font-medium text-emerald-900 bg-emerald-50/50 border border-emerald-200 rounded px-3 py-1.5 focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Compact Image Generation Bar (Technical details collapsed by default) */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                        슬라이드 비주얼 생성
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="text-xs text-slate-600">
                        {NATIVE_VISUAL_AESTHETICS[lang]?.badge}
                      </span>
                      <button
                        onClick={() => setShowStudioDirectionDetail((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-[#2563EB] flex items-center gap-0.5 cursor-pointer ml-1"
                      >
                        <span>비주얼 가이드 설정</span>
                        {showStudioDirectionDetail ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                        {(['4:5', '1:1', '3:4'] as const).map((ratio) => {
                          const activeRatio = suiteData.slides_5?.[0]?.aspect_ratio || '4:5';
                          return (
                            <button
                              key={ratio}
                              onClick={() => handleGlobalAspectRatioChange(ratio)}
                              className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                                activeRatio === ratio
                                  ? 'bg-white text-slate-900 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {ratio}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleBatchGenerateAllSlideImages}
                        disabled={batchGeneratingImages}
                        className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>
                          {batchGeneratingImages
                            ? '5장 이미지 생성 중...'
                            : '5장 이미지 일괄 생성'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Visual Direction Details */}
                  {showStudioDirectionDetail && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <p className="leading-relaxed">
                        <strong className="text-slate-800">
                          {NATIVE_VISUAL_AESTHETICS[lang]?.name}
                        </strong>{' '}
                        — {NATIVE_VISUAL_AESTHETICS[lang]?.culturalPoint}
                      </p>
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <span className="text-[11px] text-slate-500">
                          촬영 무드: {NATIVE_VISUAL_AESTHETICS[lang]?.cameraSpec}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(formattedAllImagenPrompts);
                              triggerToast('5장 전체 이미지 프롬프트가 복사되었습니다.');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            5장 프롬프트 전체 복사
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {suiteData.slides_5?.map((slide: any, idx: number) => {
                  const isCover = idx === 0 || String(slide.type).toLowerCase() === 'cover';
                  const isCta = idx === 4 || String(slide.type).toLowerCase() === 'cta';
                  const isBody = !isCover && !isCta;
                  const isSlideGenerating = Boolean(slideGeneratingMap[idx]);
                  const isPromptOpen = Boolean(openSlidePromptMap[idx]);

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 hover:border-slate-300 transition-colors"
                    >
                      {/* Slide Header */}
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800">
                          SLIDE 0{slide.slide_no || idx + 1} ·{' '}
                          {isCover ? '커버 슬라이드' : isCta ? '마무리 안내 (CTA)' : `추천 코스 0${idx}`}
                        </span>
                        <input
                          value={isBody ? slide.spot_badge || `SPOT 0${idx}` : slide.badge || ''}
                          onChange={(e) =>
                            handleSlideEdit(
                              idx,
                              isBody ? 'spot_badge' : 'badge',
                              e.target.value
                            )
                          }
                          className="text-right text-xs text-[#2563EB] font-semibold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 focus:border-[#2563EB] focus:outline-none"
                        />
                      </div>

                      {/* Cover Slide Fields */}
                      {isCover && (
                        <div className="space-y-2.5">
                          <div>
                            <span className="block text-xs font-medium text-slate-500 mb-1">
                              메인 헤드라인
                            </span>
                            <input
                              value={slide.headline || ''}
                              onChange={(e) => handleSlideEdit(idx, 'headline', e.target.value)}
                              className="w-full font-bold text-sm text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-[#2563EB] mb-1">
                              핵심 하이라이트 문구
                            </span>
                            <input
                              value={slide.highlight_line || ''}
                              onChange={(e) =>
                                handleSlideEdit(idx, 'highlight_line', e.target.value)
                              }
                              className="w-full text-sm text-[#2563EB] font-bold bg-blue-50/50 border border-blue-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-slate-500 mb-1">
                              보조 설명 카피
                            </span>
                            <input
                              value={slide.sub || ''}
                              onChange={(e) => handleSlideEdit(idx, 'sub', e.target.value)}
                              className="w-full text-xs text-slate-700 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Body Slide Fields */}
                      {isBody && (
                        <div className="space-y-2.5">
                          <div>
                            <span className="block text-xs font-medium text-slate-500 mb-1">
                              스팟 타이틀
                            </span>
                            <input
                              value={slide.title || ''}
                              onChange={(e) => handleSlideEdit(idx, 'title', e.target.value)}
                              className="w-full font-bold text-sm text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="block text-slate-500 mb-1">
                                위치 및 이동 안내
                              </span>
                              <input
                                value={slide.row1_loc || ''}
                                onChange={(e) => handleSlideEdit(idx, 'row1_loc', e.target.value)}
                                className="w-full text-slate-800 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="block text-slate-500 mb-1">
                                주요 포인트
                              </span>
                              <input
                                value={slide.row2_point || ''}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'row2_point', e.target.value)
                                }
                                className="w-full text-slate-800 font-medium bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="block text-slate-500 mb-1">
                                방문 팁
                              </span>
                              <input
                                value={slide.row3_tip || ''}
                                onChange={(e) => handleSlideEdit(idx, 'row3_tip', e.target.value)}
                                className="w-full text-slate-700 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Slide Fields */}
                      {isCta && (
                        <div className="text-xs space-y-2.5">
                          <div className="space-y-1.5">
                            <span className="block text-xs font-medium text-slate-500">
                              주요 혜택 3가지
                            </span>
                            {[0, 1, 2].map((bIdx) => (
                              <div key={bIdx} className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-[#2563EB] shrink-0">
                                  0{bIdx + 1}
                                </span>
                                <input
                                  value={slide.benefits_3?.[bIdx] || ''}
                                  onChange={(e) => handleBenefitEdit(idx, bIdx, e.target.value)}
                                  className="w-full text-xs font-medium text-slate-800 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="block text-xs font-medium text-slate-500 mb-1">
                                행동 유도 문구 (CTA)
                              </span>
                              <input
                                value={slide.cta_button || ''}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'cta_button', e.target.value)
                                }
                                className="w-full text-xs font-bold text-[#2563EB] bg-blue-50/50 border border-blue-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="block text-xs font-medium text-slate-500 mb-1">
                                댓글 키워드
                              </span>
                              <input
                                value={slide.trigger_keyword || ''}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'trigger_keyword', e.target.value)
                                }
                                className="w-full text-xs font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                            <span>하단 고정 링크</span>
                            <span className="font-mono font-semibold text-slate-700">
                              {slide.footer || FIXED_GTTOUR_FOOTER}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Clean Image Action Bar + Collapsible Prompt Settings */}
                      <div className="mt-2 pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => toggleSlidePromptDetail(idx)}
                            className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {isPromptOpen ? '이미지 프롬프트 설정 접기' : '이미지 프롬프트 상세 보기'}
                            </span>
                            {isPromptOpen ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleGenerateSlideImage(idx)}
                            disabled={isSlideGenerating}
                            className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                            <span>
                              {isSlideGenerating ? '이미지 생성 중...' : '이미지 생성'}
                            </span>
                          </button>
                        </div>

                        {/* Collapsible Technical Prompt Editor (Only shown when user clicks to expand) */}
                        {isPromptOpen && (
                          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-[11px] font-semibold text-slate-600">
                                슬라이드 비주얼 디렉션 & 프롬프트 설정
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleResetSlideImagenPrompt(idx)}
                                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  감성 재조합
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(slide.imagen_prompt || '');
                                    triggerToast(
                                      `Slide 0${idx + 1} 프롬프트가 클립보드에 복사되었습니다.`
                                    );
                                  }}
                                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  프롬프트 복사
                                </button>
                              </div>
                            </div>

                            <div>
                              <span className="block text-[11px] text-slate-500 mb-1">
                                비주얼 무드 요약
                              </span>
                              <input
                                value={slide.visual_aesthetic || ''}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'visual_aesthetic', e.target.value)
                                }
                                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>

                            <div>
                              <span className="block text-[11px] text-slate-500 mb-1">
                                상세 이미지 생성 프롬프트
                              </span>
                              <textarea
                                rows={3}
                                value={slide.imagen_prompt || ''}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'imagen_prompt', e.target.value)
                                }
                                className="w-full font-mono text-[11px] text-slate-800 leading-relaxed bg-white border border-slate-200 rounded p-2 focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>

                            <div>
                              <span className="block text-[11px] text-slate-500 mb-1">
                                제외 요소 (Negative Prompt)
                              </span>
                              <input
                                value={slide.negative_prompt || DEFAULT_IMAGEN_NEGATIVE_PROMPT}
                                onChange={(e) =>
                                  handleSlideEdit(idx, 'negative_prompt', e.target.value)
                                }
                                className="w-full font-mono text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-2.5 py-1 focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Rendered Slide Image Preview */}
                        {slide.generated_image_url && (
                          <div className="pt-1">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                              <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">
                                  슬라이드 0{idx + 1} 생성 이미지 ({slide.aspect_ratio || '4:5'})
                                </span>
                                <a
                                  href={slide.generated_image_url}
                                  download={`gttour_slide_0${idx + 1}_${lang.toLowerCase()}.png`}
                                  className="text-[#2563EB] font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  이미지 저장
                                </a>
                              </div>
                              <div className="overflow-hidden rounded border border-slate-200 bg-slate-900 flex items-center justify-center max-h-96">
                                <img
                                  src={slide.generated_image_url}
                                  alt={`Slide 0${idx + 1} Preview`}
                                  referrerPolicy="no-referrer"
                                  className="max-h-88 w-auto object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Caption Inline Editor (Instagram & Facebook Shared Feed Caption) */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {activeTab === 'FB_5'
                        ? '페이스북 공식 페이지 & 피드 본문 캡션 (@gttourkorea)'
                        : '인스타그램 본문 캡션 (@gttourkorea)'}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(suiteData.caption || '');
                        triggerToast(
                          activeTab === 'FB_5'
                            ? '페이스북 본문 캡션이 복사되었습니다.'
                            : '인스타그램 캡션이 복사되었습니다.'
                        );
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      캡션 복사
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={suiteData.caption || ''}
                    onChange={(e) => handleCaptionEdit(e.target.value)}
                    className="w-full text-xs text-slate-700 leading-relaxed p-2.5 bg-slate-50/70 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            ) : activeTab === 'REELS_15' ? (
              <div className="space-y-3">
                {suiteData.reels_15s?.map((cut: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-slate-200 rounded-lg space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-[#2563EB]">
                        {cut.time_range} · {cut.phase}
                      </span>
                      <span className="text-[11px] text-slate-400">릴스 장면 0{i + 1}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">화면 연출 가이드</span>
                      <input
                        value={cut.visual_direction || ''}
                        onChange={(e) =>
                          handleReelsEdit(i, 'visual_direction', e.target.value)
                        }
                        className="w-full text-slate-800 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">나레이션 대본</span>
                      <input
                        value={cut.narration || ''}
                        onChange={(e) => handleReelsEdit(i, 'narration', e.target.value)}
                        className="w-full font-semibold text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">화면 자막</span>
                      <input
                        value={cut.on_screen_text || ''}
                        onChange={(e) => handleReelsEdit(i, 'on_screen_text', e.target.value)}
                        className="w-full text-[#2563EB] font-medium bg-blue-50/50 border border-blue-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'XHS_7' ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="block text-xs font-medium text-slate-500">
                    샤오홍슈 노트 제목
                  </span>
                  <input
                    value={suiteData.xiaohongshu_7?.note_title || ''}
                    onChange={(e) =>
                      applySuiteUpdate({
                        ...suiteData,
                        xiaohongshu_7: {
                          ...suiteData.xiaohongshu_7,
                          note_title: e.target.value
                        }
                      })
                    }
                    className="w-full text-sm font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                {suiteData.xiaohongshu_7?.slides_7?.map((page: any, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-800">슬라이드 0{page.page_no}</span>
                      <input
                        value={page.section_tag || ''}
                        onChange={(e) => handleXhsSlideEdit(i, 'section_tag', e.target.value)}
                        className="text-right text-[#2563EB] font-semibold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 focus:border-[#2563EB] focus:outline-none"
                      />
                    </div>
                    <input
                      value={page.main_copy || ''}
                      onChange={(e) => handleXhsSlideEdit(i, 'main_copy', e.target.value)}
                      className="w-full font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                    />
                    <input
                      value={page.detail_bullet || ''}
                      onChange={(e) => handleXhsSlideEdit(i, 'detail_bullet', e.target.value)}
                      className="w-full text-slate-700 bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : activeTab === 'X_THREAD' ? (
              /* X (@enjoywithkorea) 3-Tweet Thread Studio */
              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>X 공식 채널 스레드</span>
                      <span className="font-mono text-xs text-[#2563EB]">
                        {suiteData.x_thread_3?.handle || X_CHANNEL_HANDLE}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      트윗 1 (이슈 하이라이트) ➔ 트윗 2 (방문 팁 & 추천 동선) ➔ 트윗 3 (컨시어지 안내)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(formattedXThreadText);
                      triggerToast('X (@enjoywithkorea) 3단 스레드 전체가 복사되었습니다.');
                    }}
                    className="px-3 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    3단 스레드 전체 복사
                  </button>
                </div>

                {suiteData.x_thread_3?.tweets?.map((tweet: any, idx: number) => {
                  const roleLabel =
                    idx === 0
                      ? '트윗 01 · 최신 이슈 & 하이라이트'
                      : idx === 1
                        ? '트윗 02 · 방문 팁 & 성지순례 동선'
                        : '트윗 03 · 도보 5분 스테이 & 전용 송영 안내';

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-slate-200 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-[#2563EB]">{roleLabel}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400">
                            {(tweet.content || '').length}자
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(tweet.content || '');
                              triggerToast(`트윗 0${idx + 1} 텍스트를 복사했습니다.`);
                            }}
                            className="text-xs font-semibold text-slate-700 hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            복사
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        value={tweet.content || ''}
                        onChange={(e) => handleXTweetEdit(idx, e.target.value)}
                        className="w-full text-xs text-slate-800 leading-relaxed p-2.5 bg-slate-50/70 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  );
                })}

                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">추천 해시태그</span>
                    <button
                      onClick={() => {
                        const tagsStr = (suiteData.x_thread_3?.trend_hashtags || []).join(' ');
                        navigator.clipboard.writeText(tagsStr);
                        triggerToast('해시태그가 복사되었습니다.');
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      해시태그 복사
                    </button>
                  </div>
                  <input
                    value={(suiteData.x_thread_3?.trend_hashtags || []).join(' ')}
                    onChange={(e) => handleXHashtagsEdit(e.target.value)}
                    className="w-full text-xs text-[#2563EB] bg-slate-50/70 border border-slate-200 rounded px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            ) : (
              /* Threads (@gttourkorea) Studio */
              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Threads 공식 채널 포스트</span>
                      <span className="font-mono text-xs text-[#2563EB]">
                        {suiteData.threads_post?.handle || THREADS_CHANNEL_HANDLE}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      친근한 대화체 본문 + 댓글 참여 질문 + 컨시어지 안내 링크
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(formattedThreadsText);
                      triggerToast('Threads (@gttourkorea) 포스트 전체가 복사되었습니다.');
                    }}
                    className="px-3 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    포스트 전체 복사
                  </button>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">
                      대표 토픽 태그
                    </span>
                    <input
                      value={suiteData.threads_post?.topic_tag || ''}
                      onChange={(e) => handleThreadsEdit('topic_tag', e.target.value)}
                      className="w-full text-xs font-bold text-[#2563EB] bg-blue-50/50 border border-blue-200 rounded px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-500">포스트 본문</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            suiteData.threads_post?.body_text || ''
                          );
                          triggerToast('Threads 본문이 복사되었습니다.');
                        }}
                        className="text-xs text-slate-600 hover:text-[#2563EB] cursor-pointer"
                      >
                        본문만 복사
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={suiteData.threads_post?.body_text || ''}
                      onChange={(e) => handleThreadsEdit('body_text', e.target.value)}
                      className="w-full text-xs text-slate-800 leading-relaxed p-2.5 bg-slate-50/70 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#2563EB] mb-1">
                      댓글 참여 유도 질문
                    </span>
                    <textarea
                      rows={2}
                      value={suiteData.threads_post?.engagement_question || ''}
                      onChange={(e) =>
                        handleThreadsEdit('engagement_question', e.target.value)
                      }
                      className="w-full text-xs font-semibold text-slate-900 p-2.5 bg-blue-50/40 border border-blue-200 rounded focus:bg-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-1">
                      컨시어지 안내 & 프로필 링크
                    </span>
                    <textarea
                      rows={2}
                      value={suiteData.threads_post?.concierge_bridge || ''}
                      onChange={(e) => handleThreadsEdit('concierge_bridge', e.target.value)}
                      className="w-full text-xs text-slate-700 p-2.5 bg-slate-50/70 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Column 2: Collapsible Technical JSON Inspector (Only shown when showTechnicalJsonPanel is true) */}
          {showTechnicalJsonPanel && (
            <section className="flex flex-col h-full min-h-[540px]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2 flex-wrap">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg flex-wrap">
                  <button
                    onClick={() => setSchemaMode('STRICT')}
                    className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      schemaMode === 'STRICT'
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Strict JSON
                  </button>
                  <button
                    onClick={() => setSchemaMode('FULL')}
                    className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      schemaMode === 'FULL'
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Full Suite JSON
                  </button>
                  <button
                    onClick={() => setSchemaMode('IMAGEN')}
                    className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      schemaMode === 'IMAGEN'
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Imagen Payload
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-mono font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export .json
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(displayedJson);
                      setCopiedFlag(true);
                      triggerToast('JSON 데이터가 복사되었습니다.');
                      setTimeout(() => setCopiedFlag(false), 1800);
                    }}
                    className="px-3.5 py-1.5 bg-[#0F172A] text-white text-xs font-mono font-medium rounded-lg hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedFlag ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[#0F172A] text-slate-100 rounded-lg border border-slate-800 flex flex-col overflow-hidden">
                <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FileJson className="w-3.5 h-3.5 text-blue-400" />
                    {schemaMode} DATA VIEW
                  </span>
                  <button
                    onClick={() => setShowTechnicalJsonPanel(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    닫기 ✕
                  </button>
                </div>
                <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed select-all">
                  {displayedJson}
                </pre>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Modal: Preset JSON Import */}
      {showBridgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-bold text-slate-900">프리셋 데이터 불러오기</h3>
              </div>
              <button
                onClick={() => setShowBridgeModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() =>
                  setBridgeInputJson(
                    JSON.stringify(
                      {
                        axis: 'KPOP_NEWS',
                        lang: 'JP',
                        kpopNewsSummary:
                          'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정',
                        spots: [
                          'KSPO DOME 도보 5분 Verified 스테이',
                          '성수 K-POP 공식 팝업스토어',
                          '용산 하이브 인근 아티스트 성지순례 카페'
                        ],
                        selectedJpPresetId: 'jp_preset_2',
                        customMemo: '공연 관람일 도보 5분 숙소 및 심야 안전 송영 케어'
                      },
                      null,
                      2
                    )
                  )
                }
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
              >
                K-POP 성지순례 예시 불러오기
              </button>
            </div>

            <textarea
              rows={8}
              value={bridgeInputJson}
              onChange={(e) => setBridgeInputJson(e.target.value)}
              placeholder='{"axis": "KPOP_NEWS", "lang": "JP", "spots": ["KSPO DOME 도보 5분 호텔", "성수 팝업스토어", "용산 성지순례 카페"]}'
              className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-100 rounded-lg border border-slate-700 focus:outline-none focus:border-[#2563EB]"
            />

            {bridgeError && (
              <div className="text-xs text-[#DC2626] font-medium">{bridgeError}</div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBridgeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleBridgeImport}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
