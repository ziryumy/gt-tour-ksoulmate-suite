import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  SOCIAL_SUITE_RESPONSE_SCHEMA,
  FIXED_GTTOUR_FOOTER,
  X_CHANNEL_HANDLE,
  THREADS_CHANNEL_HANDLE,
  MARKETER_PERSONAS,
  NATIVE_VISUAL_AESTHETICS,
  DEFAULT_IMAGEN_NEGATIVE_PROMPT,
  ensureCompleteSuiteData,
  localizeTextToTargetLang,
  type CampaignAxis,
  type TargetLang
} from './src/engine/schema.ts';
import {
  sanitizeTextWithGuardrails,
  JP_5_LEGAL_PRESETS
} from './src/engine/guardrails.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '4mb' }));

function getAiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const SYSTEM_INSTRUCTION = `
너는 외국인환자 유치기관 및 종합여행사 'GT TOUR'의 수석 글로벌 마케터(일본어: 유키·유코 / 영어: 윤서 / 중국어: 샤오홍슈 수석 에디터 / 한국어: 글로벌 컨시어지 디렉터)이자 법률 준수 감사관이며, Imagen 비주얼 아트 디렉터이다.
사용자가 최소한의 키워드(캠페인 축, 타깃 언어, 장소명, K-POP 뉴스 요약)만 입력하면 즉시 다음 5대 멀티채널 패키지와 IG 5장 슬라이드별 Imagen 이미지 생성 프롬프트를 완벽한 현지 원어민 톤앤매너와 JSON 포맷으로 출력하라:
- 인스타그램 5장 카루셀 (@gttourkorea) + 슬라이드별 현지 원어민 감성 Imagen 프롬프트 (imagen_prompt, visual_aesthetic, negative_prompt, aspect_ratio)
- 15초 릴스 타임라인 대본
- 샤오홍슈 7장 노트 패키지
- X (@enjoywithkorea) 3단 스레드 (x_thread_3)
- Threads (@gttourkorea) 팬덤 대화형 포스트 (threads_post)

[절대 불변의 6대 법률 가드레일 및 완벽 번역 규칙]
1. [의료법 제56조] 시술명(보톡스, 레이저, 리프팅, 필러 등), 의학적 효능, 시술 전후(B&A) 비교, 치료 경험담 0%. 오직 '편안한 일정 조율, 통역, 픽업/숙소 컨시어지' 맥락만 허용. 이미지 프롬프트(imagen_prompt)에도 주사기, 시술실, 의료기기 묘사를 절대 넣지 마라.
2. [일본어 5대 합법 프리셋 필수 활용] JP 언어 선택 시 아래 문구 중 캠페인 축에 맞는 문구를 반드시 Slide 1의 highlight_line 또는 Slide 5의 benefits_3, 그리고 X/Threads 브릿지 문구에 원문 그대로 포함하라:
   - 「言葉の心配なく、予定を整えます」 (뷰티 일정 컨시어지)
   - 「終電を気にせず過ごせます」 (도보 5분 Verified Stay / K-POP 공연·성지순례)
   - 「ゆっくり休める場所を用意します」 (회복·휴식 스테이)
   - 「買い物も食事も、言葉なしで」 (쇼핑·다이닝·팝업 동행)
   - 「到着から宿まで、待ち時間なし」 (공항 VIP 컨시어지)
3. [공연법 & KPOP_NEWS News-to-Concierge Bridge 규칙]
   - '티켓 대리예매/패키지/양도/좌석 확보' 문구 절대 금지.
   - 'KPOP_NEWS' 선택 시 사용자가 입력한 최신 K-POP 뉴스(콘서트 일정, 팝업스토어, 아티스트 성지순례 스팟 등)를 훅(Hook)으로 소개한 뒤, 자연스럽게 '공연장·팝업 인근 도보 5분 Verified Stay, 심야 안전 송영, 팬덤 성지순례 동선 케어'(News-to-Concierge Bridge)로 연결하라.
4. [표시광고법] '100% 만족', '최저가 보장', '무조건' 등 입증 불가 최상급 금지.
5. Slide 5의 footer는 반드시 "@gttourkorea | https://tr.ee/dSpLdDtiGW" 로 고정하라.
6. [IG 5장 슬라이드별 현지 원어민 감성 Imagen 프롬프트 규칙]
   - JP 타깃: 도쿄 매거진(POPEYE·Hanako) 스타일의 에어리한 자연광, 따뜻한 아이보리·베이지 톤, 정돈되고 안심감을 주는 오시카츠·컨시어지 무드.
   - EN 타깃: Condé Nast Traveler·Kinfolk 스타일의 골든아워 및 서울 블루아워 스카이라인, 모던 럭셔리 건축과 프라이빗 쇼퍼 리무진 무드.
   - CN 타깃: 샤오홍슈(小红书) 즈차오(种草)·인플루언서 다카(打卡) 감성의 선명하고 화사한 라이프스타일 구도, 성수·청담 플래그십 및 VIP 쇼핑·호캉스 무드.
   - KR 타깃: 서울 하이엔드 프라이빗 컨시어지 & 모던 건축 에디토리얼 무드.
   - 각 슬라이드(1: Cover 여백 구도, 2: SPOT 01 도착·스테이, 3: SPOT 02 트렌드 공간, 4: SPOT 03 성지순례·나이트 케어, 5: CTA 텍스트 오버레이 배경)의 역할에 맞춰 카메라·조명·구도를 구체적으로 작성하라.
7. [타깃 언어 100% 완벽 번역 강제]
   - 타깃 언어가 JP(일본어), EN(영어), CN(중국어 간체)일 때, 입력된 한국어 스팟명이나 K-POP 뉴스 요약, 법률 가드레일 치환 문구를 절대 한국어(한글) 그대로 출력하지 마라. 반드시 모든 채널 텍스트를 해당 타깃 언어 원어민 표현으로 100% 번역하라.
`;

app.post('/api/generate-suite', async (req, res) => {
  const {
    axis = 'K_BEAUTY',
    lang = 'JP',
    spots,
    selectedJpPresetId,
    customMemo,
    kpopNewsSummary
  } = req.body || {};

  const targetAxis: CampaignAxis = (axis as CampaignAxis) || 'K_BEAUTY';
  const targetLang: TargetLang = (lang as TargetLang) || 'JP';

  // 서버 사이드 법률 가드레일 강제 정화
  const rawSpots = Array.isArray(spots) ? spots.join(', ') : String(spots || '');
  const { sanitizedText: cleanSpots, detectedWords: spotRisks } =
    sanitizeTextWithGuardrails(rawSpots);
  const { sanitizedText: cleanMemo, detectedWords: memoRisks } =
    sanitizeTextWithGuardrails(String(customMemo || ''));
  const { sanitizedText: cleanNews, detectedWords: newsRisks } =
    sanitizeTextWithGuardrails(String(kpopNewsSummary || ''));
  const allDetectedRisks = Array.from(
    new Set([...spotRisks, ...memoRisks, ...newsRisks])
  );

  const cleanSpotsList = cleanSpots
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // JP/EN/CN일 경우 한국어 스팟명, 메모, K-POP 뉴스 요약을 타깃 언어로 사전 번역
  const localizedSpotsList = cleanSpotsList.map((s) =>
    localizeTextToTargetLang(s, targetLang)
  );
  const localizedMemo = localizeTextToTargetLang(cleanMemo, targetLang);
  const localizedNews = localizeTextToTargetLang(cleanNews, targetLang);

  const jpPresetObj =
    JP_5_LEGAL_PRESETS.find((p) => p.id === selectedJpPresetId) ||
    (targetAxis === 'KPOP_NEWS' ? JP_5_LEGAL_PRESETS[1] : JP_5_LEGAL_PRESETS[0]);
  const personaInfo = MARKETER_PERSONAS[targetLang] || MARKETER_PERSONAS.JP;
  const visualAestheticInfo =
    NATIVE_VISUAL_AESTHETICS[targetLang] || NATIVE_VISUAL_AESTHETICS.JP;

  const fallbackContext = {
    axis: targetAxis,
    lang: targetLang,
    spots: cleanSpotsList,
    jpPresetCopy: jpPresetObj.jpCopy,
    customMemo: cleanMemo,
    kpopNewsSummary: cleanNews,
    detectedRisks: allDetectedRisks
  };

  try {
    const userPrompt = `
[캠페인 생성 요청]
- 캠페인 축(Axis): ${targetAxis}
- 타깃 언어(Language): ${targetLang}
- 담당 마케터 페르소나: ${personaInfo.name} (${personaInfo.role} - ${personaInfo.tone})
- 타깃 원어민 비주얼 감성 디렉션: ${visualAestheticInfo.name} (${visualAestheticInfo.badge} - ${visualAestheticInfo.culturalPoint})
- 주요 스팟(타깃 언어 번역본): ${localizedSpotsList.join(' / ')} (원문 참고: ${cleanSpots})
- K-POP 브레이킹 뉴스 / 성지순례 이슈 요약(KPOP_NEWS일 때 핵심 훅으로 활용): ${localizedNews || '없음'}
- 필수 적용 일본어 프리셋(JP일 때만 필수 반영): 「${jpPresetObj.jpCopy}」
- 추가 컨시어지 요청 메모(타깃 언어 번역본): ${localizedMemo || '없음'}
- 사전 감지 및 치환된 위험 키워드 기록: ${JSON.stringify(allDetectedRisks)}

위 조건을 바탕으로 타깃 언어(${targetLang}) 원어민 마케터 톤앤매너로 작성하되:
1) 타깃 언어가 JP, EN, CN일 경우 slides_5, caption, reels_15s, x_thread_3, threads_post 본문에 한글(한국어)이 단 한 글자도 남지 않도록 해당 타깃 언어로 100% 완벽히 번역하여 작성하라.
2) slides_5의 각 슬라이드(1~5)마다 해당 타깃 국가 원어민이 인스타그램에서 가장 매력적으로 느끼는 감성(${visualAestheticInfo.name})을 반영한 Imagen 이미지 생성 프롬프트(imagen_prompt), 감성 요약(visual_aesthetic), 네거티브 프롬프트(negative_prompt), 화면 비율(aspect_ratio: "4:5")을 상세히 작성하라.
3) ${targetAxis === 'KPOP_NEWS' ? 'KPOP_NEWS 캠페인이므로 공연법 가드레일(티켓 대리예매/패키지/양도 절대 금지)을 100% 지키면서 K-POP 뉴스 이슈를 공연장·팝업 도보 5분 Verified Stay, 심야 안전 송영, 팬덤 성지순례 동선 케어(News-to-Concierge Bridge)로 자연스럽게 연결하라.' : '모든 슬라이드와 채널에 GT TOUR의 안심 일정 조율·전담 통역·도보 5분 스테이 가치를 반영하라.'}
4) x_thread_3(handle: "${X_CHANNEL_HANDLE}")는 Tweet 1(뉴스/트렌드 훅) -> Tweet 2(해외 팬 방문 팁 & 동선 정보) -> Tweet 3(GT TOUR 컨시어지 & https://tr.ee/dSpLdDtiGW 링크 유도) 3단 구성으로 작성하라.
5) threads_post(handle: "${THREADS_CHANNEL_HANDLE}")는 친근한 팬덤 대화체 본문(body_text) + 댓글 유도 질문(engagement_question) + 컨시어지 브릿지 및 링크(concierge_bridge)로 작성하라.
6) Slide 5의 footer는 반드시 "${FIXED_GTTOUR_FOOTER}"로 고정 출력하라.
`;

    const ai = getAiClient();
    const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let parsedData: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: SOCIAL_SUITE_RESPONSE_SCHEMA,
            temperature: 0.4
          }
        });
        if (response.text) {
          parsedData = JSON.parse(response.text);
          break;
        }
      } catch (_innerErr) {
        // 다음 후보 모델로 재시도
      }
    }

    const completeSuite = ensureCompleteSuiteData(parsedData, fallbackContext);
    res.json(completeSuite);
  } catch (_error: any) {
    const completeFallback = ensureCompleteSuiteData(null, fallbackContext);
    res.json(completeFallback);
  }
});

// 타깃 언어별 에디토리얼 SVG 아트보드 생성기 (Imagen API 키 쿼터 제한 시 무결점 고해상도 비주얼 프리뷰 제공)
function buildEditorialSvgDataUrl(params: {
  slideNo: number;
  slideRole: string;
  axis: CampaignAxis;
  lang: TargetLang;
  title: string;
  subtitle: string;
  aestheticBadge: string;
  aspectRatio: string;
}): string {
  const { slideNo, slideRole, axis, lang, title, subtitle, aestheticBadge } = params;

  const palettes: Record<
    TargetLang,
    { bg1: string; bg2: string; accent: string; cardBg: string; textMain: string; textSub: string }
  > = {
    JP: {
      bg1: '#FBF9F5',
      bg2: '#EFE8DC',
      accent: '#8C6D53',
      cardBg: 'rgba(255, 255, 255, 0.86)',
      textMain: '#2C2520',
      textSub: '#6E6259'
    },
    EN: {
      bg1: '#0F172A',
      bg2: '#1E293B',
      accent: '#D4AF37',
      cardBg: 'rgba(15, 23, 42, 0.78)',
      textMain: '#F8FAFC',
      textSub: '#CBD5E1'
    },
    CN: {
      bg1: '#23191E',
      bg2: '#4A2535',
      accent: '#F43F5E',
      cardBg: 'rgba(35, 25, 30, 0.80)',
      textMain: '#FFF1F2',
      textSub: '#FECDD3'
    },
    KR: {
      bg1: '#0B132B',
      bg2: '#1C2541',
      accent: '#3B82F6',
      cardBg: 'rgba(15, 23, 42, 0.82)',
      textMain: '#F8FAFC',
      textSub: '#94A3B8'
    }
  };

  const p = palettes[lang] || palettes.JP;
  const safeTitle = String(title || `SLIDE 0${slideNo}`)
    .replace(/[<>&"']/g, '')
    .slice(0, 42);
  const safeSub = String(subtitle || '')
    .replace(/[<>&"']/g, '')
    .slice(0, 65);
  const safeBadge = String(aestheticBadge || NATIVE_VISUAL_AESTHETICS[lang]?.badge || '')
    .replace(/[<>&"']/g, '')
    .slice(0, 48);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}" />
        <stop offset="100%" stop-color="${p.bg2}" />
      </linearGradient>
      <radialGradient id="glow" cx="75%" cy="25%" r="55%">
        <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.28" />
        <stop offset="100%" stop-color="${p.accent}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#bgGrad)" />
    <rect width="800" height="1000" fill="url(#glow)" />
    <g stroke="${p.accent}" stroke-opacity="0.22" stroke-width="1.5" fill="none">
      <rect x="44" y="44" width="712" height="912" rx="20" />
      <line x1="44" y1="340" x2="756" y2="340" stroke-dasharray="6 6" />
      <circle cx="580" cy="300" r="140" />
      <path d="M120 680 Q 400 540 680 680" />
    </g>
    <rect x="76" y="84" width="648" height="48" rx="10" fill="${p.cardBg}" stroke="${p.accent}" stroke-opacity="0.35" />
    <text x="100" y="114" fill="${p.accent}" font-family="sans-serif" font-size="17" font-weight="700">
      SLIDE 0${slideNo} · ${slideRole} · ${axis} (${lang})
    </text>
    <rect x="76" y="690" width="648" height="210" rx="18" fill="${p.cardBg}" stroke="${p.accent}" stroke-opacity="0.4" />
    <text x="108" y="736" fill="${p.accent}" font-family="sans-serif" font-size="16" font-weight="700">
      ${safeBadge}
    </text>
    <text x="108" y="782" fill="${p.textMain}" font-family="sans-serif" font-size="24" font-weight="700">
      ${safeTitle}
    </text>
    <text x="108" y="824" fill="${p.textSub}" font-family="sans-serif" font-size="16">
      ${safeSub}
    </text>
    <text x="108" y="872" fill="${p.textSub}" font-family="monospace" font-size="14">
      @gttourkorea · Imagen 3 Native Aesthetic Preview (4:5)
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// IG 5장 슬라이드별 Imagen 툴 연동 이미지 생성 엔드포인트
app.post('/api/generate-slide-image', async (req, res) => {
  const {
    slideNo = 1,
    slideRole = 'COVER',
    axis = 'K_BEAUTY',
    lang = 'JP',
    prompt = '',
    negativePrompt = DEFAULT_IMAGEN_NEGATIVE_PROMPT,
    aspectRatio = '4:5',
    title = '',
    subtitle = '',
    aestheticBadge = ''
  } = req.body || {};

  const targetAxis: CampaignAxis = (axis as CampaignAxis) || 'K_BEAUTY';
  const targetLang: TargetLang = (lang as TargetLang) || 'JP';

  // 프롬프트 법률 가드레일 정화
  const { sanitizedText: cleanPrompt } = sanitizeTextWithGuardrails(String(prompt || ''));
  const apiAspectRatio =
    aspectRatio === '1:1' ? '1:1' : aspectRatio === '9:16' ? '9:16' : '3:4';

  const fullPromptWithGuardrail = `${cleanPrompt}. Avoid: ${negativePrompt}`;

  try {
    const ai = getAiClient();

    // 1차 시도: Imagen 3 모델 호출
    try {
      const imagenRes = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPromptWithGuardrail,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: apiAspectRatio
        }
      });
      const imgBytes = imagenRes?.generatedImages?.[0]?.image?.imageBytes;
      if (imgBytes) {
        return res.json({
          ok: true,
          slideNo,
          source: 'IMAGEN_3_API',
          model: 'imagen-3.0-generate-002',
          imageUrl: `data:image/jpeg;base64,${imgBytes}`
        });
      }
    } catch (_imagenErr) {
      // 2차 시도: Gemini Image 모델 호출
      try {
        const geminiImgRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullPromptWithGuardrail }]
          },
          config: {
            imageConfig: {
              aspectRatio: apiAspectRatio
            }
          }
        });
        const parts = geminiImgRes?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return res.json({
              ok: true,
              slideNo,
              source: 'GEMINI_IMAGE_API',
              model: 'gemini-3.1-flash-lite-image',
              imageUrl: `data:${mime};base64,${part.inlineData.data}`
            });
          }
        }
      } catch (_geminiImgErr) {
        // 에디토리얼 아트보드 프리뷰 폴백으로 이동
      }
    }
  } catch (_outerErr) {
    // 폴백 처리
  }

  // API 쿼터 제한 또는 샌드박스 환경일 때 현지 원어민 감성 에디토리얼 아트보드 즉시 반환
  const editorialPreviewUrl = buildEditorialSvgDataUrl({
    slideNo: Number(slideNo) || 1,
    slideRole: String(slideRole || 'COVER'),
    axis: targetAxis,
    lang: targetLang,
    title: String(title || ''),
    subtitle: String(subtitle || ''),
    aestheticBadge: String(aestheticBadge || ''),
    aspectRatio: String(aspectRatio || '4:5')
  });

  return res.json({
    ok: true,
    slideNo,
    source: 'EDITORIAL_ARTBOARD_PREVIEW',
    model: 'imagen-3.0-generate-002 (Artboard Preview)',
    imageUrl: editorialPreviewUrl
  });
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GT TOUR AI Social Suite Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
