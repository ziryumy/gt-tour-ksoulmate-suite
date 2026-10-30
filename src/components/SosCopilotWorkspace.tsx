import React, { useState, useMemo, useEffect } from 'react';
import { sanitizeTextWithGuardrails } from '../engine/guardrails';
import { type TargetLang } from '../engine/schema';
import {
  PRE_SECURED_REVENUE_PASSES,
  PRE_SECURED_PASS_LINK,
  INBOUND_SAMPLE_QUESTIONS,
  SOS_50_MACRO_PATTERNS,
  matchSosMacroPattern,
  loadSosSmartCache,
  saveToSosSmartCache,
  makeSosCacheKey,
  type RevenuePassId,
  type PreSecuredPassSpec,
  type SosConversionResult
} from '../engine/sosCopilot';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Zap,
  Search,
  ArrowRight,
  ExternalLink,
  Database,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export interface SosToStudioBridgePayload {
  lang: TargetLang;
  question: string;
  passSpec: PreSecuredPassSpec;
  conversionResult: SosConversionResult;
}

interface SosCopilotWorkspaceProps {
  initialLang?: TargetLang;
  onExportToStudio: (payload: SosToStudioBridgePayload) => void;
  onTriggerToast: (msg: string) => void;
}

export default function SosCopilotWorkspace({
  initialLang = 'JP',
  onExportToStudio,
  onTriggerToast
}: SosCopilotWorkspaceProps) {
  const [lang, setLang] = useState<TargetLang>(initialLang);
  const [selectedPassId, setSelectedPassId] = useState<RevenuePassId>('NIGHT_SOS');
  const [questionInput, setQuestionInput] = useState<string>(
    INBOUND_SAMPLE_QUESTIONS[0].questionByLang[initialLang]
  );
  const [macroSearchQuery, setMacroSearchQuery] = useState('');
  const [macroCategoryFilter, setMacroCategoryFilter] = useState<
    'ALL' | 'CONCERT_NIGHT' | 'HOTPLACE_WAIT' | 'BEAUTY_INTERPRET' | 'AIRPORT_LUGGAGE'
  >('ALL');
  const [showMacroLibrary, setShowMacroLibrary] = useState(true);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [copiedStage, setCopiedStage] = useState<string | null>(null);
  const [cacheCount, setCacheCount] = useState<number>(0);

  // 현재 3단계 답장 상태
  const [conversionResult, setConversionResult] = useState<SosConversionResult>(() =>
    matchSosMacroPattern({
      question: INBOUND_SAMPLE_QUESTIONS[0].questionByLang[initialLang],
      lang: initialLang,
      selectedPassId: 'NIGHT_SOS',
      forcePatternId: 'P01'
    })
  );

  useEffect(() => {
    const cache = loadSosSmartCache();
    setCacheCount(Object.keys(cache).length);
  }, [conversionResult]);

  const currentPassSpec = useMemo(
    () =>
      PRE_SECURED_REVENUE_PASSES.find((p) => p.id === selectedPassId) ||
      PRE_SECURED_REVENUE_PASSES[0],
    [selectedPassId]
  );

  // 스마트 매크로 & 캐시 즉시 매칭 (API 비용 $0 · 0.1초)
  const handleRunSmartMacro = (
    nextQuestion: string = questionInput,
    nextLang: TargetLang = lang,
    nextPassId: RevenuePassId = selectedPassId,
    forcePatternId?: string
  ) => {
    const cleanQ = sanitizeTextWithGuardrails(nextQuestion).sanitizedText;
    const cacheKey = makeSosCacheKey(cleanQ, nextLang, nextPassId);
    const cache = loadSosSmartCache();

    if (!forcePatternId && cache[cacheKey]) {
      setConversionResult(cache[cacheKey]);
      onTriggerToast('스마트 캐시에서 검증된 3단계 수익 전환 답장을 0.1초 만에 불러왔습니다. (API 비용 $0)');
      return;
    }

    const matched = matchSosMacroPattern({
      question: cleanQ,
      lang: nextLang,
      selectedPassId: nextPassId,
      forcePatternId
    });
    setConversionResult(matched);
    saveToSosSmartCache(cacheKey, matched);
  };

  // 언어 변경 핸들러
  const handleLangChange = (nextLang: TargetLang) => {
    setLang(nextLang);
    // 만약 현재 입력창이 대표 샘플 중 하나라면 해당 언어 샘플로 자동 전환
    const matchedSample = INBOUND_SAMPLE_QUESTIONS.find((sq) =>
      Object.values(sq.questionByLang).some((txt) => txt.trim() === questionInput.trim())
    );
    const nextQ = matchedSample ? matchedSample.questionByLang[nextLang] : questionInput;
    if (matchedSample) {
      setQuestionInput(nextQ);
    }
    handleRunSmartMacro(nextQ, nextLang, selectedPassId, conversionResult.matchedPatternId);
  };

  // 4대 대표 질문 예시 원클릭 버튼 핸들러
  const handleSelectSampleQuestion = (sampleId: string) => {
    const sample = INBOUND_SAMPLE_QUESTIONS.find((s) => s.id === sampleId);
    if (!sample) return;
    const nextQ = sample.questionByLang[lang];
    setSelectedPassId(sample.passId);
    setQuestionInput(nextQ);
    handleRunSmartMacro(nextQ, lang, sample.passId);
    onTriggerToast(`[${sample.categoryLabel}] 질문과 사전 확보 패스가 즉시 매칭되었습니다.`);
  };

  // 4대 수익 패스 선택 핸들러
  const handleSelectPass = (passId: RevenuePassId) => {
    setSelectedPassId(passId);
    handleRunSmartMacro(questionInput, lang, passId);
  };

  // 50대 고충 패턴 라이브러리에서 원클릭 선택
  const handleSelectMacroPattern = (patternId: string) => {
    const pat = SOS_50_MACRO_PATTERNS.find((p) => p.id === patternId);
    if (!pat) return;
    setSelectedPassId(pat.passId);
    const matched = matchSosMacroPattern({
      question: questionInput,
      lang,
      selectedPassId: pat.passId,
      forcePatternId: pat.id
    });
    setConversionResult(matched);
    onTriggerToast(`[${pat.code}] "${pat.titleKo}" 매크로 템플릿이 적용되었습니다.`);
  };

  // 서버 (/api/sos-copilot-generate) 또는 클라이언트 SDK + 스마트 매크로 폴백 기반 3단계 수익 전환 답장 정밀 생성
  const handleGenerateWithGeminiFlash = async () => {
    const cleanQ = sanitizeTextWithGuardrails(questionInput).sanitizedText;
    if (!cleanQ.trim()) {
      onTriggerToast('외국인 고객의 댓글이나 DM 고민 내용을 먼저 입력해 주세요.');
      return;
    }

    setAiGenerating(true);
    try {
      let parsedData: {
        stage1_empathy_tip?: string;
        stage2_pass_pitch?: string;
        stage3_checkout_cta?: string;
      } | null = null;

      try {
        const response = await fetch('/api/sos-copilot-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: cleanQ,
            lang,
            passTitle: currentPassSpec.titles[lang],
            passPitchRef: currentPassSpec.pitchLines[lang],
            passCheckoutRef: currentPassSpec.selfCheckoutLines[lang],
            passLink: PRE_SECURED_PASS_LINK
          })
        });
        if (response.ok) {
          const parsed = await response.json();
          if (parsed?.ok) {
            parsedData = parsed;
          }
        }
      } catch {
        // 정적 배포 환경(Vercel)에서는 클라이언트 SDK 또는 스마트 매크로 폴백으로 전환
      }

      if (!parsedData) {
        const clientKey =
          (typeof window !== 'undefined' && window.localStorage.getItem('GT_GEMINI_API_KEY')) ||
          (import.meta as any).env?.VITE_GEMINI_API_KEY ||
          '';

        if (clientKey) {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: clientKey });
          const prompt = `Create a 3-stage concierge conversion reply in language [${lang}] for a foreign K-pop/Seoul traveler asking: "${cleanQ}".
Target Pass: ${currentPassSpec.titles[lang]}
Pitch Reference: ${currentPassSpec.pitchLines[lang]}
Checkout Reference: ${currentPassSpec.selfCheckoutLines[lang]}
Link: ${PRE_SECURED_PASS_LINK}
Respond strictly in JSON with keys: stage1_empathy_tip, stage2_pass_pitch, stage3_checkout_cta.`;

          const genRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });
          if (genRes.text) {
            parsedData = JSON.parse(genRes.text);
          }
        }
      }

      if (!parsedData) {
        throw new Error('Fallback to Smart Macro Engine');
      }

      const s1 = sanitizeTextWithGuardrails(
        parsedData.stage1_empathy_tip || conversionResult.stage1_empathy_tip
      ).sanitizedText;
      const s2 = sanitizeTextWithGuardrails(
        parsedData.stage2_pass_pitch || conversionResult.stage2_pass_pitch
      ).sanitizedText;
      let s3 = sanitizeTextWithGuardrails(
        parsedData.stage3_checkout_cta || conversionResult.stage3_checkout_cta
      ).sanitizedText;
      if (!s3.includes(PRE_SECURED_PASS_LINK)) {
        s3 = `${s3} 👉 ${PRE_SECURED_PASS_LINK}`;
      }

      const nextResult: SosConversionResult = {
        ...conversionResult,
        passId: selectedPassId,
        lang,
        engineSource: 'GEMINI_25_FLASH',
        stage1_empathy_tip: s1,
        stage2_pass_pitch: s2,
        stage3_checkout_cta: s3
      };

      setConversionResult(nextResult);
      saveToSosSmartCache(makeSosCacheKey(cleanQ, lang, selectedPassId), nextResult);
      onTriggerToast('Gemini 2.5 Flash 기반 3단계 수익 전환 답장이 생성 및 스마트 캐시에 저장되었습니다.');
    } catch (_err: any) {
      // 에러, 정적 호스팅 또는 쿼터 제한 시 즉시 50대 매크로 엔진으로 무중단 응답
      const fallback = matchSosMacroPattern({
        question: cleanQ,
        lang,
        selectedPassId
      });
      setConversionResult(fallback);
      saveToSosSmartCache(makeSosCacheKey(cleanQ, lang, selectedPassId), fallback);
      onTriggerToast('스마트 매크로 응대 엔진으로 3단계 수익 전환 답장을 즉시 생성했습니다.');
    } finally {
      setAiGenerating(false);
    }
  };

  // 전체 통합 답장 텍스트
  const fullCombinedReply = useMemo(() => {
    return `${conversionResult.stage1_empathy_tip}\n\n${conversionResult.stage2_pass_pitch}\n\n${conversionResult.stage3_checkout_cta}`.trim();
  }, [conversionResult]);

  const handleCopyText = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStage(key);
    onTriggerToast(`${label} 텍스트가 클립보드에 복사되었습니다.`);
    setTimeout(() => setCopiedStage(null), 2000);
  };

  // 50대 매크로 필터링
  const filteredMacros = useMemo(() => {
    return SOS_50_MACRO_PATTERNS.filter((item) => {
      if (macroCategoryFilter !== 'ALL' && item.category !== macroCategoryFilter) {
        return false;
      }
      if (!macroSearchQuery.trim()) return true;
      const q = macroSearchQuery.toLowerCase();
      return (
        item.titleKo.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [macroCategoryFilter, macroSearchQuery]);

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0F172A]">
      {/* 상단 서브 헤더: 하루 10분 무노동 수익 전환 워크플로우 요약 */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                ZERO-LABOR INBOUND REVENUE COPILOT
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-600">
                사전 정의 50대 고충 패턴 매크로 & Gemini 2.5 Flash 하이브리드 엔진
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              양방향 SOS 상담 & 사전 확보형 4대 수익 패스 전환 코파일럿
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>하루 10분 투자 · 24시간 실시간 채팅 노동 차단</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                50대 고충 매크로 탑재 · 스마트 캐시 {cacheCount}건 저장됨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 12컬럼 그리드 */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측 5컬럼: 1. 외국인 SOS 인바운드 입력창 + 2. 사전 확보형 4대 수익 패스 선택기 */}
        <div className="lg:col-span-5 space-y-6">
          {/* 섹션 1: 외국인 SOS 인바운드 입력창 & 언어 선택 */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  01. 외국인 SOS 인바운드 질문 & 언어 선택
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  댓글·DM으로 접수된 외국인 고민을 붙여넣거나 4대 대표 질문을 클릭하세요.
                </p>
              </div>
              {/* 타깃 언어 4종 선택 */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
                {(['JP', 'EN', 'CN', 'KR'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLangChange(l)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      lang === l
                        ? 'bg-[#0F172A] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* 4가지 대표 질문 예시 원클릭 버튼 */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 mb-2">
                대표 인바운드 질문 예시 (1-Click 자동 입력 & 패스 매칭)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INBOUND_SAMPLE_QUESTIONS.map((sq) => {
                  const isSelected = selectedPassId === sq.passId && questionInput === sq.questionByLang[lang];
                  return (
                    <button
                      key={sq.id}
                      type="button"
                      onClick={() => handleSelectSampleQuestion(sq.id)}
                      className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-[#2563EB] text-[#2563EB]'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">{sq.buttonTitle}</div>
                      <div className="text-[11px] font-normal text-slate-500 truncate mt-0.5">
                        {sq.categoryLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 인바운드 질문 텍스트 영역 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  외국인 댓글 / DM 원문 입력 ({lang})
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {questionInput.length} chars
                </span>
              </div>
              <textarea
                rows={4}
                value={questionInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuestionInput(val);
                  handleRunSmartMacro(val, lang, selectedPassId);
                }}
                placeholder="외국인이 남긴 댓글이나 DM 고민(심야 콘서트 귀가 불안, 한국 번호 없는 웨이팅, 뷰티 통역 걱정, 공항 짐 이동 등)을 입력하세요..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-none focus:border-[#2563EB] leading-relaxed"
              />
            </div>
          </section>

          {/* 섹션 2: 사전 확보형(Pre-secured) 4대 수익 패스 선택기 */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3.5 shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  02. 사전 예약형(Pre-secured) 4대 수익 패스 선택기
                </h2>
                <span className="text-[11px] font-semibold text-emerald-700">
                  실시간 수동 수배 없음 · 사전 블록 상품
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                고객의 질문에 맞춰 미리 확보된 4대 수익 패스 중 최적의 솔루션을 연결합니다.
              </p>
            </div>

            <div className="space-y-2.5">
              {PRE_SECURED_REVENUE_PASSES.map((pass) => {
                const active = selectedPassId === pass.id;
                return (
                  <button
                    key={pass.id}
                    type="button"
                    onClick={() => handleSelectPass(pass.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'border-[#2563EB] bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold font-mono ${
                          active ? 'text-[#2563EB]' : 'text-slate-700'
                        }`}
                      >
                        {pass.code}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {pass.badge}
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-bold text-slate-900 leading-snug">
                      {pass.titles[lang]}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                      {pass.krSubtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* 생성 액션 버튼 2종: 스마트 매크로 즉시 매칭 vs Gemini 2.5 Flash 맞춤 생성 */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleRunSmartMacro(questionInput, lang, selectedPassId)}
                className="py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>스마트 매크로 즉시 매칭 ($0)</span>
              </button>
              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleGenerateWithGeminiFlash}
                className="py-2.5 px-3 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {aiGenerating ? 'Gemini 2.5 생성 중...' : 'Gemini 2.5 맞춤 답장 생성'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* 우측 7컬럼: 3. 무노동 3단계 수익 전환 답장 + 4. 5대 채널 콘텐츠 브릿지 + 50대 고충 매크로 엔진 */}
        <div className="lg:col-span-7 space-y-6">
          {/* 섹션 3: 무노동 3단계 수익 전환 답장 카드 */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-[#2563EB]">
                    [{conversionResult.matchedPatternCode}]
                  </span>
                  <span>{conversionResult.matchedPatternTitle}</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-700">
                    {conversionResult.engineSource === 'GEMINI_25_FLASH'
                      ? 'Gemini 2.5 Flash 맞춤 생성됨'
                      : '스마트 매크로 & 캐시 즉시 매칭 ($0)'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  03. 무노동 3단계 수익 전환 답장 ({lang})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      fullCombinedReply,
                      'ALL_3_STAGES',
                      '3단계 통합 수익 전환 답장'
                    )
                  }
                  className="px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedStage === 'ALL_3_STAGES' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>3단계 답장 전체 복사</span>
                </button>
              </div>
            </div>

            {/* 1단계: 원어민 공감 & 100% 자동 해결 셀프 꿀팁 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2563EB]">
                    1단계 · 원어민 공감 & 100% 자동 해결 셀프 꿀팁
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (직원 추가 개입 없이 고객 스스로 즉시 해결하는 현지 동선 팁)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      conversionResult.stage1_empathy_tip,
                      'STAGE_1',
                      '1단계 셀프 꿀팁'
                    )
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                >
                  {copiedStage === 'STAGE_1' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>복사</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={conversionResult.stage1_empathy_tip}
                onChange={(e) =>
                  setConversionResult((prev) => ({
                    ...prev,
                    stage1_empathy_tip: sanitizeTextWithGuardrails(e.target.value)
                      .sanitizedText
                  }))
                }
                className="w-full text-xs p-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-[#2563EB] leading-relaxed"
              />
            </div>

            {/* 2단계: 사전 예약형 SOS 패스 제안 */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2563EB]">
                    2단계 · 사전 예약형 SOS 패스 제안 ({currentPassSpec.code})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (현장 고생 대신 사전 확보된 GT TOUR 전용 슬롯 선점 유도)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      conversionResult.stage2_pass_pitch,
                      'STAGE_2',
                      '2단계 SOS 패스 제안'
                    )
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                >
                  {copiedStage === 'STAGE_2' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>복사</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={conversionResult.stage2_pass_pitch}
                onChange={(e) =>
                  setConversionResult((prev) => ({
                    ...prev,
                    stage2_pass_pitch: sanitizeTextWithGuardrails(e.target.value)
                      .sanitizedText
                  }))
                }
                className="w-full text-xs p-3 bg-white rounded-lg border border-blue-200 focus:outline-none focus:border-[#2563EB] leading-relaxed"
              />
            </div>

            {/* 3단계: 셀프 체크아웃 & 예약 링크 유도 */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800">
                    3단계 · 셀프 체크아웃 & 예약 링크 유도
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    {PRE_SECURED_PASS_LINK}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      conversionResult.stage3_checkout_cta,
                      'STAGE_3',
                      '3단계 셀프 체크아웃 링크'
                    )
                  }
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  {copiedStage === 'STAGE_3' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>복사</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={conversionResult.stage3_checkout_cta}
                onChange={(e) =>
                  setConversionResult((prev) => ({
                    ...prev,
                    stage3_checkout_cta: sanitizeTextWithGuardrails(e.target.value)
                      .sanitizedText
                  }))
                }
                className="w-full text-xs p-3 bg-white rounded-lg border border-emerald-200 focus:outline-none focus:border-emerald-600 leading-relaxed"
              />
            </div>

            {/* 섹션 4: [이 상담 고민으로 5대 채널 콘텐츠 만들기] 원클릭 연동 브릿지 버튼 */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  내부 6대 가드레일 자동 통과 완료 · 이 질문을 소재로 카드뉴스·릴스·페북 그룹 콘텐츠를 즉시 생성합니다.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onExportToStudio({
                    lang,
                    question: questionInput,
                    passSpec: currentPassSpec,
                    conversionResult
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>이 상담 고민으로 5대 채널 콘텐츠 만들기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* 섹션 5: 스마트 캐시 & 50대 외국인 고충 매크로 응대 엔진 (API 비용 $0 템플릿 뱅크) */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  04. 스마트 캐시 & 사전 정의 50대 고충 패턴 매크로 엔진
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI API 비용 폭발 없이 자주 묻는 50가지 인바운드 고충 패턴을 0.1초 만에 매칭합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMacroLibrary((prev) => !prev)}
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                {showMacroLibrary ? '50대 패턴 목록 접기' : '50대 패턴 전체 펼치기'}
              </button>
            </div>

            {showMacroLibrary && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* 카테고리 필터 버튼 */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {(
                      [
                        { id: 'ALL', label: '전체 (50)' },
                        { id: 'CONCERT_NIGHT', label: '콘서트·심야귀가 (13)' },
                        { id: 'HOTPLACE_WAIT', label: '핫플·웨이팅·짐 (13)' },
                        { id: 'BEAUTY_INTERPRET', label: '청담 뷰티·통역 (12)' },
                        { id: 'AIRPORT_LUGGAGE', label: '공항·짐 직배송 (12)' }
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMacroCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          macroCategoryFilter === cat.id
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* 키워드 검색 */}
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={macroSearchQuery}
                      onChange={(e) => setMacroSearchQuery(e.target.value)}
                      placeholder="50대 고충 키워드 검색 (예: 고척돔, 010, 캐리어, 청담...)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                  {filteredMacros.map((pat) => {
                    const isSelected = conversionResult.matchedPatternId === pat.id;
                    return (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => handleSelectMacroPattern(pat.id)}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/70 text-[#2563EB]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              {pat.code}
                            </span>
                            <span className="font-semibold text-slate-900 truncate">
                              {pat.titleKo}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {pat.selfTipByLang[lang]}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-[#2563EB] font-bold">
                          <span>{pat.passId}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
