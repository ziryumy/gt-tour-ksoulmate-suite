import { type CampaignAxis, type TargetLang, FIXED_GTTOUR_FOOTER, NATIVE_VISUAL_AESTHETICS } from './schema';

export interface MagazineSlideRenderInput {
  slideIndex: number;
  slide: any;
  axis: CampaignAxis;
  lang: TargetLang;
  baseImageUrl?: string;
  sourceModel?: string;
}

// 테마(Axis) 및 슬라이드 번호(1~5)별 고화질 서울 컨시어지·스테이·성수·콘서트 실사 화보 큐레이션 풀 (CORS 호환)
export const CURATED_EDITORIAL_PHOTOS: Record<CampaignAxis, string[]> = {
  K_BEAUTY: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1080&q=85'
  ],
  STAY: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1080&q=85'
  ],
  HOTPLACE: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1080&q=85'
  ],
  KPOP_NEWS: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1080&q=85',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1080&q=85'
  ]
};

export function buildPollinationsImageUrl(prompt: string, aspectRatio: string = '4:5', seed?: number): string {
  const width = 1080;
  const height = aspectRatio === '1:1' ? 1080 : aspectRatio === '3:4' ? 1440 : 1350;
  const cleanShortPrompt = String(prompt || 'Luxury Seoul concierge editorial photography, natural light, architectural interior')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 260);
  const resolvedSeed = seed ?? Math.floor(10000 + Math.random() * 89999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanShortPrompt)}?width=${width}&height=${height}&nologo=true&seed=${resolvedSeed}`;
}

function loadImageWithTimeout(url: string, timeoutMs: number = 3200): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = window.setTimeout(() => {
      img.src = '';
      reject(new Error('Image load timeout'));
    }, timeoutMs);

    img.onload = () => {
      window.clearTimeout(timer);
      resolve(img);
    };
    img.onerror = (err) => {
      window.clearTimeout(timer);
      reject(err);
    };
    img.src = url;
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number = 3
): string[] {
  const raw = String(text || '').trim();
  if (!raw) return [];

  // CJK(한국어/일본어/중국어) 포함 시 글자 단위 + 어절 하이브리드 줄바꿈
  const chars = Array.from(raw);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < chars.length; i++) {
    const testLine = currentLine + chars[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = chars[i];
      if (lines.length >= maxLines - 1) {
        const remaining = chars.slice(i).join('').trim();
        let lastLine = remaining;
        while (ctx.measureText(lastLine + '…').width > maxWidth && lastLine.length > 1) {
          lastLine = lastLine.slice(0, -1);
        }
        lines.push(lastLine.length < remaining.length ? `${lastLine}…` : lastLine);
        return lines;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  return lines.slice(0, maxLines);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function renderMagazineSlideCanvasDataUrl(
  input: MagazineSlideRenderInput
): Promise<{
  imageUrl: string;
  sourceModel: string;
}> {
  const { slideIndex, slide, axis, lang, baseImageUrl, sourceModel } = input;
  const aspectRatio = slide?.aspect_ratio || '4:5';
  const width = 1080;
  const height = aspectRatio === '1:1' ? 1080 : aspectRatio === '3:4' ? 1440 : 1350;

  // 만약 서버에서 직접 base64 실사 이미지를 받아온 경우 그대로 반환하거나 필요 시 캔버스 합성
  if (baseImageUrl && baseImageUrl.startsWith('data:image/') && !baseImageUrl.startsWith('data:image/svg')) {
    return {
      imageUrl: baseImageUrl,
      sourceModel: sourceModel || 'imagen-3.0-generate-002'
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallbackPool = CURATED_EDITORIAL_PHOTOS[axis] || CURATED_EDITORIAL_PHOTOS.K_BEAUTY;
    return {
      imageUrl: fallbackPool[slideIndex % fallbackPool.length],
      sourceModel: 'Magazine Editorial Renderer'
    };
  }

  // 1. 배경 실사 이미지 로드 시도 (1순위: 전달된 URL -> 2순위: 큐레이션 고화질 실사 화보 -> 3순위: Pollinations AI)
  const curatedPool = CURATED_EDITORIAL_PHOTOS[axis] || CURATED_EDITORIAL_PHOTOS.K_BEAUTY;
  const curatedUrl = curatedPool[slideIndex % curatedPool.length];
  const pollinationsUrl = buildPollinationsImageUrl(
    slide?.imagen_prompt || '',
    aspectRatio,
    (slideIndex + 1) * 13579 + Date.now() % 1000
  );

  let loadedImg: HTMLImageElement | null = null;
  let resolvedSource = sourceModel || 'Pollinations AI + Magazine Canvas';

  const candidateUrls = [curatedUrl, baseImageUrl, pollinationsUrl].filter(Boolean) as string[];
  for (const url of candidateUrls) {
    try {
      loadedImg = await loadImageWithTimeout(url, 2800);
      if (loadedImg) break;
    } catch {
      // 다음 후보 이미지 시도
    }
  }

  // 테마/언어별 에디토리얼 컬러 팔레트
  const palettes: Record<
    TargetLang,
    { bgTop: string; bgBottom: string; accent: string; pillBg: string; cardBg: string; textPrimary: string; textSecondary: string }
  > = {
    JP: {
      bgTop: '#231F1D',
      bgBottom: '#12100E',
      accent: '#D4B895',
      pillBg: 'rgba(255, 252, 247, 0.92)',
      cardBg: 'rgba(24, 20, 18, 0.78)',
      textPrimary: '#FFFFFF',
      textSecondary: '#E7DFD5'
    },
    EN: {
      bgTop: '#0F172A',
      bgBottom: '#090D16',
      accent: '#E2B857',
      pillBg: 'rgba(15, 23, 42, 0.90)',
      cardBg: 'rgba(15, 23, 42, 0.80)',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1'
    },
    CN: {
      bgTop: '#28151D',
      bgBottom: '#140A0E',
      accent: '#FB7185',
      pillBg: 'rgba(40, 21, 29, 0.90)',
      cardBg: 'rgba(26, 13, 19, 0.80)',
      textPrimary: '#FFF1F2',
      textSecondary: '#FECDD3'
    },
    KR: {
      bgTop: '#0F172A',
      bgBottom: '#0B1120',
      accent: '#60A5FA',
      pillBg: 'rgba(15, 23, 42, 0.90)',
      cardBg: 'rgba(15, 23, 42, 0.80)',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1'
    }
  };
  const pal = palettes[lang] || palettes.JP;

  // 2. 배경 렌더링 (고화질 실사 Cover Crop 또는 에디토리얼 라이팅 그라디언트)
  if (loadedImg) {
    const imgRatio = loadedImg.width / loadedImg.height;
    const canvasRatio = width / height;
    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawH = height;
      drawW = height * imgRatio;
      offsetX = -(drawW - width) / 2;
    } else {
      drawW = width;
      drawH = width / imgRatio;
      offsetY = -(drawH - height) / 2;
    }
    ctx.drawImage(loadedImg, offsetX, offsetY, drawW, drawH);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, pal.bgTop);
    bgGrad.addColorStop(1, pal.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. 매거진 에디토리얼 시네마틱 그라디언트 오버레이 (상단 & 하단 가독성 확보)
  const topVignette = ctx.createLinearGradient(0, 0, 0, height * 0.28);
  topVignette.addColorStop(0, 'rgba(10, 14, 24, 0.68)');
  topVignette.addColorStop(1, 'rgba(10, 14, 24, 0.0)');
  ctx.fillStyle = topVignette;
  ctx.fillRect(0, 0, width, height * 0.28);

  const bottomVignette = ctx.createLinearGradient(0, height * 0.42, 0, height);
  bottomVignette.addColorStop(0, 'rgba(10, 14, 24, 0.0)');
  bottomVignette.addColorStop(0.35, 'rgba(10, 14, 24, 0.58)');
  bottomVignette.addColorStop(1, 'rgba(10, 14, 24, 0.92)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(0, height * 0.42, width, height * 0.58);

  // 4. 매거진 프레임 보더 라인
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, 44, 44, width - 88, height - 88, 24);
  ctx.stroke();

  // 5. 상단 에디토리얼 헤더 배지
  const isCover = slideIndex === 0 || String(slide?.type).toLowerCase() === 'cover';
  const isCta = slideIndex === 4 || String(slide?.type).toLowerCase() === 'cta';
  const badgeText = isCover
    ? String(slide?.badge || `GT TOUR · ${axis} (${lang})`)
    : isCta
    ? 'GT TOUR VIP CONCIERGE'
    : String(slide?.spot_badge || `SPOT 0${slideIndex}`);

  ctx.font = '700 24px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = Math.min(width - 176, badgeMetrics.width + 52);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
  roundRectPath(ctx, 84, 84, badgeW, 54, 12);
  ctx.fill();
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = pal.accent;
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, 110, 111);

  // 우측 상단 슬라이드 번호 표시
  ctx.font = '700 22px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.textAlign = 'right';
  ctx.fillText(`0${slideIndex + 1} / 05`, width - 88, 111);
  ctx.textAlign = 'left';

  // 6. 하단 글래스모피즘 매거진 타이포그래피 카드 합성
  const cardX = 76;
  const cardW = width - 152;
  const cardH = isCta ? 430 : 380;
  const cardY = height - cardH - 76;

  ctx.fillStyle = pal.cardBg;
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const innerX = cardX + 44;
  const maxTextW = cardW - 88;
  let cursorY = cardY + 54;

  // 상단 감성 무드 태그
  const aestheticTag =
    NATIVE_VISUAL_AESTHETICS[lang]?.badge || 'SEOUL PRIVATE CONCIERGE EDITORIAL';
  ctx.font = '700 21px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
  ctx.fillStyle = pal.accent;
  ctx.fillText(aestheticTag, innerX, cursorY);
  cursorY += 46;

  if (isCover) {
    // 커버 슬라이드: 메인 헤드라인 + 핵심 하이라이트 + 보조 카피
    ctx.font = '800 40px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
    ctx.fillStyle = pal.textPrimary;
    const headlineLines = wrapCanvasText(ctx, slide?.headline || '', maxTextW, 2);
    for (const line of headlineLines) {
      ctx.fillText(line, innerX, cursorY);
      cursorY += 52;
    }

    if (slide?.highlight_line) {
      cursorY += 6;
      ctx.font = '700 30px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
      ctx.fillStyle = pal.accent;
      const hlLines = wrapCanvasText(ctx, slide.highlight_line, maxTextW, 1);
      for (const line of hlLines) {
        ctx.fillText(line, innerX, cursorY);
        cursorY += 42;
      }
    }

    if (slide?.sub) {
      cursorY += 6;
      ctx.font = '500 24px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
      ctx.fillStyle = pal.textSecondary;
      const subLines = wrapCanvasText(ctx, slide.sub, maxTextW, 2);
      for (const line of subLines) {
        ctx.fillText(line, innerX, cursorY);
        cursorY += 34;
      }
    }
  } else if (isCta) {
    // CTA 슬라이드: 3대 혜택 + 행동 유도 버튼
    ctx.font = '800 34px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
    ctx.fillStyle = pal.textPrimary;
    const ctaLines = wrapCanvasText(ctx, slide?.cta_button || 'GT TOUR Concierge', maxTextW, 1);
    for (const line of ctaLines) {
      ctx.fillText(line, innerX, cursorY);
      cursorY += 46;
    }

    const benefits: string[] = Array.isArray(slide?.benefits_3) ? slide.benefits_3 : [];
    ctx.font = '600 24px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
    ctx.fillStyle = pal.textSecondary;
    for (let b = 0; b < Math.min(3, benefits.length); b++) {
      const bLines = wrapCanvasText(ctx, `✓ ${benefits[b]}`, maxTextW, 1);
      if (bLines[0]) {
        ctx.fillText(bLines[0], innerX, cursorY);
        cursorY += 38;
      }
    }

    if (slide?.trigger_keyword) {
      cursorY += 6;
      ctx.font = '700 23px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
      ctx.fillStyle = pal.accent;
      const tkLines = wrapCanvasText(ctx, slide.trigger_keyword, maxTextW, 1);
      if (tkLines[0]) {
        ctx.fillText(tkLines[0], innerX, cursorY);
      }
    }
  } else {
    // 바디 슬라이드 (SPOT 01 ~ 03)
    ctx.font = '800 38px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
    ctx.fillStyle = pal.textPrimary;
    const titleLines = wrapCanvasText(ctx, slide?.title || '', maxTextW, 1);
    for (const line of titleLines) {
      ctx.fillText(line, innerX, cursorY);
      cursorY += 50;
    }

    const rows = [slide?.row1_loc, slide?.row2_point, slide?.row3_tip].filter(Boolean);
    ctx.font = '500 24px "Pretendard", "Noto Sans JP", "Noto Sans SC", sans-serif';
    ctx.fillStyle = pal.textSecondary;
    for (const r of rows) {
      const rLines = wrapCanvasText(ctx, `• ${r}`, maxTextW, 1);
      if (rLines[0]) {
        ctx.fillText(rLines[0], innerX, cursorY);
        cursorY += 38;
      }
    }
  }

  // 하단 고정 브랜드 푸터
  ctx.font = '600 20px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText(FIXED_GTTOUR_FOOTER, innerX, cardY + cardH - 30);

  return {
    imageUrl: canvas.toDataURL('image/jpeg', 0.92),
    sourceModel: resolvedSource
  };
}
