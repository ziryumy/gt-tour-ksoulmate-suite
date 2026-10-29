export interface RiskDetection {
  word: string;
  lawCategory: '의료법 제56조' | '공연법' | '표시광고법';
  reason: string;
  replacement: string;
  pattern?: RegExp;
}

export interface JpLegalPreset {
  id: string;
  category: 'K_BEAUTY' | 'STAY' | 'HOTPLACE' | 'KPOP_NEWS' | 'ALL';
  label: string;
  jpCopy: string;
  krMeaning: string;
}

// 일본어 5대 합법 프리셋 (절대 불변 기준)
export const JP_5_LEGAL_PRESETS: JpLegalPreset[] = [
  {
    id: 'jp_preset_1',
    category: 'K_BEAUTY',
    label: '뷰티 일정 컨시어지',
    jpCopy: '言葉の心配なく、予定を整えます',
    krMeaning: '언어 걱정 없이 일정을 조율해 드립니다'
  },
  {
    id: 'jp_preset_2',
    category: 'KPOP_NEWS',
    label: '도보 5분 Verified Stay (공연·성지순례)',
    jpCopy: '終電を気にせず過ごせます',
    krMeaning: '막차 걱정 없이 머무실 수 있습니다'
  },
  {
    id: 'jp_preset_3',
    category: 'STAY',
    label: '회복·휴식 스테이',
    jpCopy: 'ゆっくり休める場所を用意します',
    krMeaning: '편안히 쉴 수 있는 공간을 준비합니다'
  },
  {
    id: 'jp_preset_4',
    category: 'HOTPLACE',
    label: '쇼핑·다이닝·팝업 동행',
    jpCopy: '買い物も食事も、言葉なしで',
    krMeaning: '쇼핑도 식사도 언어 장벽 없이'
  },
  {
    id: 'jp_preset_5',
    category: 'ALL',
    label: '공항 VIP 컨시어지',
    jpCopy: '到着から宿まで、待ち時間なし',
    krMeaning: '도착부터 숙소까지 대기 시간 없이'
  }
];

// 금지어 사전 및 합법 컨시어지 대체 문구 매핑 (뒤에 붙는 클리닉/센터/스테이/패키지/보장 등 복합 명사까지 하나로 흡수하는 정규식 포함)
export const BANNED_RULES: RiskDetection[] = [
  // 1. 의료법 제56조 위반 키워드
  {
    word: '보톡스',
    lawCategory: '의료법 제56조',
    reason: '시술명 직접 명시 금지',
    replacement: '프라이빗 뷰티 클리닉 일정 조율 및 전담 통역 컨시어지',
    pattern: /보톡스(?:\s*(?:클리닉|센터|의원|병원|피부과|성형외과|시술|주사|케어|라운지|패키지|스테이))*/g
  },
  {
    word: '레이저',
    lawCategory: '의료법 제56조',
    reason: '의료기기/시술명 언급 금지',
    replacement: '맞춤형 웰니스·뷰티 방문 스케줄링 및 픽업 케어',
    pattern: /레이저(?:\s*(?:센터|클리닉|의원|병원|피부과|성형외과|시술|케어|라운지|패키지|스테이))*/g
  },
  {
    word: '리프팅',
    lawCategory: '의료법 제56조',
    reason: '시술명 및 의학적 효능 암시 금지',
    replacement: '프리미엄 K-뷰티 라운지 예약 및 편안한 휴식 스테이',
    pattern: /리프팅(?:\s*(?:스테이|클리닉|센터|의원|병원|피부과|성형외과|시술|케어|라운지|패키지|연계))*/g
  },
  {
    word: '필러',
    lawCategory: '의료법 제56조',
    reason: '시술명 직접 명시 금지',
    replacement: '1:1 전담 통역 동행 및 뷰티 컨시어지 일정 케어',
    pattern: /필러(?:\s*(?:클리닉|센터|의원|병원|피부과|성형외과|시술|주사|케어|라운지|패키지|스테이))*/g
  },
  {
    word: '전후 비교',
    lawCategory: '의료법 제56조',
    reason: '시술 전후(B&A) 비교 광고 금지',
    replacement: '방문부터 숙소 복귀까지 막힘없는 웰니스 동선 가이드',
    pattern: /(?:시술\s*)?전후\s*비교(?:\s*(?:사진|후기|리뷰|광고|케어|가이드))*/g
  },
  {
    word: '치료 효과',
    lawCategory: '의료법 제56조',
    reason: '의학적 효능 보장 금지',
    replacement: '회복과 휴식에 집중할 수 있는 안심 스테이 환경 제공',
    pattern: /치료\s*효과(?:\s*(?:보장|입증|최고|완벽|후기|제공))*/g
  },

  // 2. 공연법 위반 키워드 (K-POP 콘서트·팬미팅·페스티벌 가드레일)
  {
    word: '티켓 대리예매',
    lawCategory: '공연법',
    reason: '부정 판매 및 대리예매 알선 금지',
    replacement: '공연 관람일 도보 5분 Verified 숙소 및 심야 안전 송영 케어',
    pattern: /(?:공연\s*|콘서트\s*|팬미팅\s*)?티켓\s*대리\s*예매(?:\s*(?:패키지|알선|대행|서비스|포함|지원))*/g
  },
  {
    word: '티켓 패키지',
    lawCategory: '공연법',
    reason: '승인되지 않은 티켓 끼워팔기 금지',
    replacement: '공연장 인접 스테이 체크인 및 관람 전후 다이닝 동선 케어',
    pattern: /(?:공연\s*|콘서트\s*|팬미팅\s*)?티켓\s*패키지(?:\s*(?:상품|포함|제공|예약|특가))*/g
  },
  {
    word: '티켓 양도',
    lawCategory: '공연법',
    reason: '암표 및 불법 양도 오인 표현 금지',
    replacement: '막차 걱정 없는 공연장 도보권 숙소 확보 및 전용 차량 이동',
    pattern: /(?:공연\s*|콘서트\s*|팬미팅\s*)?티켓\s*양도(?:\s*(?:패키지|알선|지원|포함|대행))*/g
  },

  // 3. 표시광고법 위반 키워드
  {
    word: '100% 만족',
    lawCategory: '표시광고법',
    reason: '입증 불가 절대적 표현 금지',
    replacement: '검증된 현지 전담 매니저의 세심한 1:1 밀착 케어',
    pattern: /100%\s*만족(?:\s*(?:보장|확신|약속|책임|케어|플랜))*/g
  },
  {
    word: '최저가 보장',
    lawCategory: '표시광고법',
    reason: '배타적 최상급 표현 금지',
    replacement: '투명하고 합리적인 정찰제 컨시어지 플랜',
    pattern: /최저가\s*보장(?:\s*(?:패키지|특가|혜택|플랜|포함|약속))*/g
  },
  {
    word: '무조건',
    lawCategory: '표시광고법',
    reason: '과장 광고 소지 표현',
    replacement: '체계적인 사전 동선 설계를 통한 안정적인',
    pattern: /무조건(?:\s*(?:보장|가능|성공|확정))?/g
  }
];

// 실시간 금지어 스캐너 함수
export function scanRiskWords(input: string): RiskDetection[] {
  if (!input) return [];
  return BANNED_RULES.filter((rule) => {
    if (rule.pattern) {
      const regex = new RegExp(rule.pattern.source);
      return regex.test(input);
    }
    return input.includes(rule.word);
  });
}

// 중복 접미사 및 어색한 연결어를 자연스럽게 정리하는 후처리 함수
function polishSanitizedKorean(text: string): string {
  return text
    .replace(/스테이\s*연계\s*스테이/g, '스테이')
    .replace(/스테이\s*스테이/g, '스테이')
    .replace(/컨시어지\s*(?:클리닉|센터|패키지)/g, '컨시어지')
    .replace(/케어\s*(?:센터|클리닉|패키지|보장|포함)/g, '케어')
    .replace(/플랜\s*(?:보장|포함|패키지)/g, '플랜')
    .replace(/공연\s+공연/g, '공연')
    .replace(/케어\s+투명하고/g, '케어 및 투명하고')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// 개별 금지어 1건 자연스러운 정규식 치환 함수
export function replaceSingleRiskWord(input: string, word: string): string {
  if (!input) return '';
  const matchedRule = BANNED_RULES.find((r) => r.word === word);
  if (!matchedRule) return input;

  const regex = matchedRule.pattern
    ? new RegExp(matchedRule.pattern.source, 'g')
    : new RegExp(word, 'g');

  return polishSanitizedKorean(input.replace(regex, matchedRule.replacement));
}

// 원클릭 합법 문구 자동 치환 함수 (뒤에 붙는 클리닉/센터/스테이/패키지/보장 등 복합 명사까지 한 번에 매끄럽게 치환)
export function sanitizeTextWithGuardrails(input: string): {
  sanitizedText: string;
  detectedWords: string[];
} {
  let sanitizedText = input || '';
  const detectedWords: string[] = [];

  for (const rule of BANNED_RULES) {
    const checkRegex = rule.pattern
      ? new RegExp(rule.pattern.source, 'g')
      : new RegExp(rule.word, 'g');

    if (checkRegex.test(sanitizedText)) {
      detectedWords.push(rule.word);
      const replaceRegex = rule.pattern
        ? new RegExp(rule.pattern.source, 'g')
        : new RegExp(rule.word, 'g');
      sanitizedText = sanitizedText.replace(replaceRegex, rule.replacement);
    }
  }

  sanitizedText = polishSanitizedKorean(sanitizedText);

  return { sanitizedText, detectedWords };
}

// 전체 JSON 데이터 내부 인라인 편집 후 법률 준수 상태 재계산 유틸리티 (X & Threads 포함)
export function auditSuiteCompliance(suiteData: any, priorDetectedWords: string[] = []) {
  const serialized = JSON.stringify({
    slides_5: suiteData?.slides_5 || [],
    caption: suiteData?.caption || '',
    reels_15s: suiteData?.reels_15s || [],
    xiaohongshu_7: suiteData?.xiaohongshu_7 || {},
    x_thread_3: suiteData?.x_thread_3 || {},
    threads_post: suiteData?.threads_post || {}
  });

  const liveRisks = scanRiskWords(serialized);
  const medicalFailed = liveRisks.some((r) => r.lawCategory === '의료법 제56조');
  const performanceFailed = liveRisks.some((r) => r.lawCategory === '공연법');
  const advertisingFailed = liveRisks.some((r) => r.lawCategory === '표시광고법');

  const mergedDetectedWords = Array.from(
    new Set([...priorDetectedWords, ...liveRisks.map((r) => r.word)])
  );

  return {
    medical_law_passed: !medicalFailed,
    performance_law_passed: !performanceFailed,
    advertising_law_passed: !advertisingFailed,
    detected_risk_words: mergedDetectedWords,
    active_inline_risks: liveRisks
  };
}
