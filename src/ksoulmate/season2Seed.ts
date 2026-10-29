import type {
  ReleasePhaseItem,
  Season2Episode,
  Season2IdentityCheck,
  Season2ParticipationDevice,
  TourProductBridge,
} from "./types";

/**
 * B1 「관객 서른 명」 5인 캐릭터 일치 검수 게이트 (AC-20) 초기 상태
 */
export const INITIAL_B1_IDENTITY_CHECKS: Season2IdentityCheck[] = [
  {
    memberId: "M1",
    checkpointLabel: "한지후 (M1 · 리더/메인보컬) — 좌상단(Ji-min) 애니 시트 ↔ 쇼케이스 실사",
    outfitMatchNote: "아이보리 니트 조끼 + 화이트 셔츠 → 쇼케이스 스테이지 네이비 파이핑 재킷 전환 일치",
    faceMatchNote: "21세 179cm 성인 비율, 차분한 눈매 및 좌측 가르마 흑발 100% 매칭",
    matched: true,
  },
  {
    memberId: "M2",
    checkpointLabel: "이든 박 (M2 · 리드보컬) — 우상단(Eden) 애니 시트 ↔ 쇼케이스 실사",
    outfitMatchNote: "차콜 후드 집업 + 헤드폰 → 쇼케이스 어반 스트릿 레이어드 재킷 전환 일치",
    faceMatchNote: "22세 181cm 웨이브 브라운 헤어, 밝은 눈웃음 및 턱선 비율 일치",
    matched: true,
  },
  {
    memberId: "M3",
    checkpointLabel: "린 위하오 (M3 · 메인댄서) — 좌하단(Yu-hao) 애니 시트 ↔ 쇼케이스 실사",
    outfitMatchNote: "올블랙 크롭 재킷 + 실버 체인 → 쇼케이스 시그니처 블랙 수트 100% 일치",
    faceMatchNote: "23세 183cm 실버그레이 헤어, 날카로운 콧날과 냉미남 눈매 일치",
    matched: true,
  },
  {
    memberId: "M4",
    checkpointLabel: "사토 하루토 (M4 · 서브보컬/비주얼) — 파일럿 3/5 보류 시트 ↔ 쇼케이스 실사",
    outfitMatchNote: "베이지 가디건 + 체크 셔츠 → 쇼케이스 파스텔 트위드 셔츠 (등신대 성인 보정 확인 필수)",
    faceMatchNote: "20세 176cm 성인 비율 재검증 필요 (파일럿 소년화 이슈 해소 및 AC-20 READY 전환 시 통과)",
    matched: false,
  },
  {
    memberId: "M5",
    checkpointLabel: "아이만 (M5 · 래퍼/막내) — 우하단(Aiman) 애니 시트 ↔ 쇼케이스 실사",
    outfitMatchNote: "타탄 체크 오버셔츠 + 데님 → 쇼케이스 골드 포인트 프레피 봄버 전환 일치",
    faceMatchNote: "20세 177cm 건강한 브라운 피부톤, 반달 눈웃음 및 흑갈색 컬 헤어 일치",
    matched: true,
  },
];

/**
 * PART C (C1~C3) 공통 및 회차별 GT TOUR 3대 투어 상품 브릿지 생성기
 */
export function buildPartCTourProducts(
  episodeCode: "C1" | "C2" | "C3",
  cityName: string,
  venueName: string,
  localSpot: string,
  staySpot: string
): TourProductBridge[] {
  return [
    {
      code: "SHUTTLE",
      nameKo: "공연 정착 셔틀",
      badge: `${episodeCode} · CONCERT SETTLEMENT SHUTTLE`,
      targetAxis: "KPOP_NEWS",
      summary: `[${cityName} 투어 전용] ${venueName} 공연 종료 직후 심야 미아 방지 정시 출발 리무진 & 도보 5분 정착 지원 셔틀`,
      includedBenefits: [
        `${venueName} 전용 픽업 존 정시 출발 (종연 후 25분 내 탑승 보장)`,
        `해외 팬 전용 다국어(JP/EN/CN) 인솔 매니저 탑승 및 캐리어 적재`,
        `${staySpot} 로비 앞 무정차 직행 안심 드롭`,
      ],
      spots: [
        `${venueName} (${episodeCode} 실사 투어 공연장)`,
        `${localSpot} (K-Soulmate 성지순례 코스)`,
        `${staySpot} (도보 5분 Verified 정착 스테이)`,
      ],
      priceTierNote: "Pre-secured Block · 편도/왕복 정시 보장 패스",
    },
    {
      code: "NIGHT_PACKAGE",
      nameKo: "콘서트 나잇 패키지",
      badge: `${episodeCode} · CONCERT NIGHT PACKAGE`,
      targetAxis: "STAY",
      summary: `[${cityName} 올인원 나잇] 공연장 인접 Verified Stay 1박 + 심야 애프터 다이닝 성지순례 + 레이트 체크아웃 패키지`,
      includedBenefits: [
        `${staySpot} 사전 블록 객실 확정 (여성/해외 팬 안심 보안 층 배정)`,
        `공연 후 ${localSpot} 심야 뒷풀이 다이닝 웨이팅 제로 사전 예약`,
        `익일 13:00 레이트 체크아웃 & 웰니스 모닝 키트 제공`,
      ],
      spots: [
        `${staySpot} (${cityName} Verified Stay)`,
        `${localSpot} (멤버 방문 애프터 다이닝 스팟)`,
        `${venueName} 백스테이지 투어 동선`,
      ],
      priceTierNote: "Pre-secured 1박 2일 · 숙박+심야이동+다이닝 결합(티켓 비포함 합법 패키지)",
    },
    {
      code: "VVIP_TRANSFER",
      nameKo: "VVIP 송영",
      badge: `${episodeCode} · VVIP PRIVATE TRANSFER`,
      targetAxis: "K_BEAUTY",
      summary: `[${cityName} 1:1 프라이빗] 공항/역사 영접부터 멤버 성지순례 코스·청담/해운대 웰니스 케어·공연장 Door-to-Door 전담 의전`,
      includedBenefits: [
        `항공편/KTX 도착 연동 전용 VIP 밴(Sprinter/Carnival Hi-Limousine) 단독 배차`,
        `1:1 원어민 전담 컨시어지 통역 동행 & ${localSpot} 프라이빗 예약`,
        `투어 전후 프라이빗 스파·헤어메이크업 케어 및 수하물 호텔 선발송`,
      ],
      spots: [
        `${venueName} VIP 드롭오프 라운지`,
        `${localSpot} 프라이빗 VVIP 코스`,
        `${staySpot} 스위트 & 웰니스 라운지`,
      ],
      priceTierNote: "1:1 Bespoke Concierge · 전 일정 전용 차량 & 통역 컨시어지",
    },
  ];
}

/**
 * 시즌 2 데뷔 서사 10화 시나리오 (PART A: A1~A3 / PART B: B1~B4 / PART C: C1~C3)
 */
export const INITIAL_SEASON2_EPISODES: Season2Episode[] = [
  // ==================== PART A: A1 ~ A3 (100% 애니메이션) ====================
  {
    id: 201,
    no: 1,
    code: "A1",
    part: "PART_A",
    partLabel: "PART A · 데뷔 전야 (100% 애니메이션)",
    title: "성수동 지하 1층의 메트로놈",
    subtitle: "5개의 서로 다른 박자가 하나의 BPM으로 맞춰지는 첫 밤",
    logline:
      "시즌 1의 서울 적응기를 마친 5인이 성수동 지하 연습실에 모여 데뷔 쇼케이스 D-30 카운트다운에 돌입하지만, 각자의 국적과 음악적 습관 차이로 첫 합주부터 불협화음이 터져 나온다.",
    format: "ANIME_100",
    formatLabel: "100% 애니메이션 (2D 작화 · B1~B6 톤)",
    emotionCurve: "긴장(45) ➔ 충돌(75) ➔ 첫 공명(65)",
    emotionIntensity: 68,
    emotionKeyword: "불협화음 끝의 첫 정박(Beat)",
    place: "성수동 연무장길 지하 연습실 & 새벽 한강 나들목",
    durationSec: 120,
    leadMemberIds: ["M1", "M3", "M2"],
    expressions: ["박자 맞춰볼까", "다시 한 번만 더", "끝까지 가보자"],
    status: "PUBLISHED",
    releasePhase: "Phase 2",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:30",
        visualType: "ANIME",
        sceneTitle: "D-30 카운트다운 보드와 128 BPM 메트로놈",
        description:
          "성수동 지하 연습실 벽면에 걸린 'DEBUT SHOWCASE D-30'. 한지후(M1)가 메트로놈을 켜자 위하오(M3)의 날카로운 발소리가 공기를 가른다.",
        done: true,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:30 ~ 01:05",
        visualType: "ANIME",
        sceneTitle: "0.2초의 어긋남 — 위하오와 이든의 충돌",
        description:
          "칼군무 정박을 고집하는 위하오(M3)와 그루브를 타는 이든(M2)의 호흡이 부딪히며 연습실 음악이 멈춘다.",
        done: true,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:05 ~ 01:40",
        visualType: "ANIME",
        sceneTitle: "메트로놈을 끄고 숨소리로 맞춘 첫 합",
        description:
          "지후(M1)가 기계음을 끄고 '서로의 숨소리를 먼저 듣자'며 무반주 아카펠라와 스텝만으로 5인의 첫 정박을 완성한다.",
        done: true,
      },
      {
        id: 4,
        code: "S4",
        timeRange: "01:40 ~ 02:00",
        visualType: "ANIME",
        sceneTitle: "성수동 새벽 안개 속 다섯 개의 그림자",
        description:
          "새벽 4시 연습실을 나선 5인이 성수대교 북단 나들목에서 캔커피를 부딪히며 '다시 한 번만 더'를 외친다.",
        done: true,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "聖水洞(ソンスドン)の地下練習室。デビューショーケースまであと30日。5人の異なる鼓動が、メトロノームなしでも一つに重なった最初の夜。「もう一度だけ、最後まで行こう」",
        voStatus: "DONE",
      },
      {
        channelCode: "US",
        narration:
          "Thirty days until our first showcase in a basement studio in Seongsu. Five different rhythms clashing at 3 AM—until we turned off the metronome and listened to each other breathe.",
        voStatus: "DONE",
      },
      {
        channelCode: "KR",
        narration:
          "성수동 지하 1층, 데뷔 쇼케이스까지 남은 시간은 단 30일. 서로 달랐던 다섯 개의 박자가 기계를 끄고 숨소리를 맞춘 순간 처음으로 하나가 되었습니다.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 202,
    no: 2,
    code: "A2",
    part: "PART_A",
    partLabel: "PART A · 데뷔 전야 (100% 애니메이션)",
    title: "새벽 세 시의 보컬 부스",
    subtitle: "하루토의 흔들리는 한국어 발음과 아이만의 녹음실 노트",
    logline:
      "데뷔곡 가이드 녹음 날, 일본인 멤버 하루토(M4)와 말레이시아 멤버 아이만(M5)이 한국어 받침 발음과 감정 전달의 벽에 부딪혀 자책하자, 지후(M1)가 성수동 옥상에서 특별한 발음 특훈을 시작한다.",
    format: "ANIME_100",
    formatLabel: "100% 애니메이션 (2D 작화 · 감성 웜톤)",
    emotionCurve: "위축(40) ➔ 위로(60) ➔ 돌파(82)",
    emotionIntensity: 76,
    emotionKeyword: "서툰 발음에 담긴 진심",
    place: "성수동 사운드 스튜디오 & 서울숲 야경 루프탑",
    durationSec: 120,
    leadMemberIds: ["M4", "M5", "M1"],
    expressions: ["괜찮아 천천히 해", "내 목소리로 전할게", "진심은 통하니까"],
    status: "REVIEWED",
    releasePhase: "Phase 2",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:35",
        visualType: "ANIME",
        sceneTitle: "붉은 녹음 램프와 열두 번째 NG",
        description:
          "부스 안에서 한국어 가사 여백에 빼곡히 히라가나와 알파벳 발음 기호를 적어 내려가는 하루토(M4)와 아이만(M5).",
        done: true,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:35 ~ 01:15",
        visualType: "ANIME",
        sceneTitle: "서울숲 루프탑에서 나눈 따뜻한 유자차",
        description:
          "지후(M1)가 '정확한 발음보다 왜 이 단어를 부르는지가 먼저'라며 각자의 모국어로 먼저 감정을 말해 보게 한다.",
        done: true,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:15 ~ 02:00",
        visualType: "ANIME",
        sceneTitle: "원테이크 오케이 사인과 하이라이트 화음",
        description:
          "다시 들어간 보컬 부스. 하루토의 맑은 미성과 아이만의 중저음 랩이 겹치며 프로듀서 부스에서 첫 OK 사인이 떨어진다.",
        done: true,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "午前3時のレコーディングブース。韓国語の発音に悩むハルトに、ジフが手渡したのは温かい柚子茶でした。「ゆっくりでいい、心は必ず伝わるから」",
        voStatus: "DONE",
      },
      {
        channelCode: "US",
        narration:
          "3 AM inside the vocal booth. When Haruto and Aiman struggled with Korean lyrics, Ji-hu reminded them: perfection doesn't move hearts, honesty does.",
        voStatus: "DONE",
      },
      {
        channelCode: "KR",
        narration:
          "새벽 세 시의 녹음실. 열두 번의 NG 끝에 주저앉은 하루토와 아이만에게 지후가 건넨 한마디. '괜찮아 천천히 해, 진심은 통하니까.'",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 203,
    no: 3,
    code: "A3",
    part: "PART_A",
    partLabel: "PART A · 데뷔 전야 (100% 애니메이션)",
    title: "이름 없는 다섯 명의 밤 (A3 성장 투표)",
    subtitle: "쇼케이스 전야, 2D 애니메이션 세계의 마지막 밤과 팬 참여 성장 투표",
    logline:
      "첫 쇼케이스를 단 하루 앞둔 밤, 5인은 연습실 거울 앞에서 각자의 오리진 소품(볼펜·어학노트·이어폰·사전·운동화)을 모아 두고 내일 무대 문을 여는 순간 새로운 현실(실사)로 나아갈 것을 맹세한다.",
    format: "ANIME_100",
    formatLabel: "100% 애니메이션 피날레 + [A3 성장 투표] 장치",
    emotionCurve: "고요(50) ➔ 결의(85) ➔ 전율(92)",
    emotionIntensity: 90,
    emotionKeyword: "애니메이션의 끝, 실사 데뷔의 문턱",
    place: "성수동 연습실 & 쇼케이스장 백스테이지 암전 복도",
    durationSec: 135,
    leadMemberIds: ["M1", "M2", "M3", "M4", "M5"],
    expressions: ["내일 무대에서 만나", "우리를 기억해 줘", "지금 시작이야"],
    status: "REVIEWED",
    releasePhase: "Phase 2",
    participationDeviceCode: "A3_VOTE",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:40",
        visualType: "ANIME",
        sceneTitle: "오리진 5대 소품의 원형 배치",
        description:
          "연습실 마룻바닥 중앙에 놓인 오리진 5편의 상징 소품 5개. 각자의 결핍이었던 물건이 이제 5인의 연결고리가 된다.",
        done: true,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:40 ~ 01:30",
        visualType: "ANIME",
        sceneTitle: "[참여 장치 ①] A3 성장 투표 — 쇼케이스 킬링 파트 & 앵콜 구성 결정",
        description:
          "글로벌 팬들이 투표로 선정한 성장 서사 파트가 B1 쇼케이스 무대 세트리스트에 실제 반영되는 인터랙티브 브릿지.",
        done: true,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:30 ~ 02:15",
        visualType: "ANIME",
        sceneTitle: "백스테이지 철문이 열리며 쏟아지는 화이트 스포트라이트 (B1 직결)",
        description:
          "암전된 백스테이지 복도 끝, 철문이 열리며 눈부신 백색 실사 조명이 2D 작화 윤곽선을 녹여내며 B1 제1프레임으로 이어진다.",
        done: true,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "アニメーションで描かれた練習生の日々は、今夜で幕を閉じます。扉の向こうは、30人の観客が待つリアルなステージ。あなたの『A3成長投票』が明日の初舞台を決めます。",
        voStatus: "DONE",
      },
      {
        channelCode: "US",
        narration:
          "Tonight is our final night in animation. Beyond that stage door awaits a real spotlight and our very first audience. Cast your A3 Growth Vote to shape our debut stage.",
        voStatus: "DONE",
      },
      {
        channelCode: "KR",
        narration:
          "애니메이션으로 기록된 연습실의 시간은 오늘 밤으로 끝납니다. 저 무대 문이 열리면, 진짜 우리의 얼굴과 목소리가 시작됩니다. [A3 성장 투표]로 첫 무대를 함께 완성해 주세요.",
        voStatus: "DONE",
      },
    ],
  },

  // ==================== PART B: B1 ~ B4 (애니 ➔ 실사 전환 및 첫 1위) ====================
  {
    id: 204,
    no: 4,
    code: "B1",
    part: "PART_B",
    partLabel: "PART B · 애니➔실사 전환 & 데뷔 (Hybrid/Live)",
    title: "관객 서른 명",
    subtitle: "[핵심 전환점] 성수동 소극장 쇼케이스 첫 프레임 — 2D 작화가 실사 5인으로 깨어나는 순간",
    logline:
      "비 내리는 평일 저녁 성수동 소극장. 텅 빈 객석 걱정에 눈을 감고 무대에 오른 다섯 멤버가 첫 조명을 받으며 눈을 뜨는 순간, 2D 애니메이션이 100% 실사 프레임으로 전환되고 객석의 서른 명이 든 슬로건과 마주한다.",
    format: "HYBRID_TRANSITION",
    formatLabel: "애니 ➔ 실사 매치컷 전환 (AC-20 게이트 연동)",
    emotionCurve: "두려움(40) ➔ 전환 쇼크(95) ➔ 벅찬 감동(98)",
    emotionIntensity: 98,
    emotionKeyword: "2D에서 실사로 깨어난 서른 명의 기적",
    place: "성수동 언더스탠드에비뉴 블랙박스 소극장",
    durationSec: 150,
    leadMemberIds: ["M1", "M2", "M3", "M4", "M5"],
    expressions: ["와줘서 정말 고마워", "이 순간을 잊지 않을게", "우리의 첫 페이지"],
    status: "SCRIPTED",
    releasePhase: "Phase 3",
    isTransitionPoint: true,
    b1TransitionFrameSpec: {
      timecode: "00:28.12 (Frame #852 — B1 쇼케이스 첫 프레임)",
      animeLastFrameDesc:
        "암전 속 마이크 스탠드를 잡은 5인의 2D 작화 클로즈업 (B1~B6 설정 시트 등신대 비율 100% 고정, 눈을 감은 호흡 컷)",
      liveFirstFrameDesc:
        "핀스포트라이트 점등과 동시에 눈을 뜨는 5인의 4K 실사 마스터 샷 (실사 캐릭터 시트 의상·헤어·이목구비 1:1 매치컷 디졸브 18프레임)",
      lightingMatchRule:
        "2D 작화 하이라이트(#2A2520 ➔ #FFF3D1)와 실사 무대 텅스텐 백라이트(3200K) 광원 각도 45° 일치",
      cameraLensSpec:
        "35mm Anamorphic 아나모픽 플레어 브릿지 — 작화 외곽선이 빛 번짐 속에 녹아들며 실사 피부 질감으로 전환",
      verified: true,
    },
    identityChecks: INITIAL_B1_IDENTITY_CHECKS,
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:28",
        visualType: "ANIME",
        sceneTitle: "암전된 무대 위 다섯 번의 심장 소리 (2D 애니메이션 마지막 시퀀스)",
        description:
          "빗소리가 들리는 소극장 무대 뒤. 아무도 오지 않았을지도 모른다는 두려움 속에 다섯 멤버가 대형을 갖추고 눈을 감는다.",
        done: true,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:28 ~ 00:45",
        visualType: "TRANSITION_MATCHCUT",
        sceneTitle: "★ [애니 ➔ 실사 전환 프레임] 쇼케이스 첫 스포트라이트 점등 (AC-20)",
        description:
          "지후(M1)의 첫 숨소리와 함께 핀조명이 켜지며 2D 애니메이션이 5인의 실사(Live-Action) 얼굴과 무대 의상으로 경계 없이 전환된다.",
        done: true,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "00:45 ~ 01:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "객석을 채운 서른 개의 손글씨 슬로건",
        description:
          "눈부신 조명 너머로 보이는 서른 명의 첫 팬들. 일본·미국·한국에서 날아온 서른 명이 한국어로 따라 부르는 첫 후렴구.",
        done: true,
      },
      {
        id: 4,
        code: "S4",
        timeRange: "01:45 ~ 02:30",
        visualType: "LIVE_ACTION",
        sceneTitle: "서른 명과 함께 찍은 첫 실사 단체 사진",
        description:
          "무대 아래로 내려와 관객 서른 명 한 사람 한 사람과 눈을 맞추며 '와줘서 정말 고마워'를 건네는 실사 엔딩.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "雨の聖水洞(ソンスドン)、小さな劇場。照明が灯ったその瞬間、アニメーションだった5人がリアルな姿で目を覚ます。客席にいた30人の最初のファン、ここから本当の物語が始まります。",
        voStatus: "DONE",
      },
      {
        channelCode: "US",
        narration:
          "A rainy evening in Seongsu. As the first stage light hits at 00:28, 2D animation dissolves into living, breathing reality—facing thirty fans who believed in us before the world knew our name.",
        voStatus: "DONE",
      },
      {
        channelCode: "KR",
        narration:
          "비 내리는 성수동 소극장, 첫 스포트라이트가 켜지는 00분 28초. 그림이었던 다섯 소년이 살아 숨 쉬는 실사로 눈을 뜹니다. 객석을 지켜준 단 서른 명의 첫 관객, 우리의 진짜 데뷔가 시작됩니다.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 205,
    no: 5,
    code: "B2",
    part: "PART_B",
    partLabel: "PART B · 애니➔실사 전환 & 데뷔 (Hybrid/Live)",
    title: "첫 음악방송 대기실 3평의 우주",
    subtitle: "이름표가 붙은 3평 대기실과 인이어 너머로 들려온 첫 응원법",
    logline:
      "실사 데뷔 직후 첫 생방송 음악프로그램에 출연한 5인. 복도 끝 3평짜리 좁은 대기실에서 긴장으로 손을 떨던 멤버들이 생방송 무대 위 인이어를 뚫고 들어온 팬들의 3음절 응원법 함성에 전율한다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 (방송국 백스테이지 & 생방송 무대)",
    emotionCurve: "설렘(60) ➔ 극도의 긴장(80) ➔ 해방감(90)",
    emotionIntensity: 86,
    emotionKeyword: "인이어를 뚫고 들어온 첫 함성",
    place: "상암동 디지털미디어시티 방송국 대기실 & 공개홀",
    durationSec: 120,
    leadMemberIds: ["M2", "M3", "M5"],
    expressions: ["떨리지만 즐기자", "무대 찢고 올게", "목소리 들려?"],
    status: "SCRIPTED",
    releasePhase: "Phase 3",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:40",
        visualType: "LIVE_ACTION",
        sceneTitle: "A4 용지에 인쇄된 대기실 이름표 앞 셀카",
        description:
          "복도 맨 끝 3평 대기실 문에 붙은 'K-Soulmate' 종이 이름표를 어루만지는 이든(M2)과 아이만(M5).",
        done: true,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:40 ~ 01:25",
        visualType: "LIVE_ACTION",
        sceneTitle: "스탠바이 5초 전, 위하오가 잡아준 떨리는 손",
        description:
          "카메라 빨간 불이 들어오기 직전, 긴장한 막내 아이만의 어깨를 꽉 잡아주는 위하오(M3).",
        done: true,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:25 ~ 02:00",
        visualType: "LIVE_ACTION",
        sceneTitle: "인이어를 뚫고 터져 나온 팬들의 첫 공식 응원법",
        description:
          "생방송 사후녹화 현장에 모인 팬들의 우렁찬 3음절 응원법에 5인이 무대 위에서 처음으로 활짝 웃는다.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "初めての音楽番組、廊下の奥の小さな控室。緊張で震えていた5人のイヤモニを突き抜けて届いたのは、ファンの皆さんが揃えてくれた初めての掛け声でした。",
        voStatus: "IN_PROGRESS",
      },
      {
        channelCode: "US",
        narration:
          "A tiny green room at the end of the broadcast station hall. Our hands were shaking until the live cameras rolled—and your fanchants thundered straight through our in-ears.",
        voStatus: "IN_PROGRESS",
      },
      {
        channelCode: "KR",
        narration:
          "상암동 방송국 복도 맨 끝 3평짜리 대기실. 떨리던 손끝이 무대 위 빨간 카메라 불빛과 만나는 순간, 인이어를 뚫고 들어온 건 여러분의 첫 응원법이었습니다.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 206,
    no: 6,
    code: "B3",
    part: "PART_B",
    partLabel: "PART B · 애니➔실사 전환 & 데뷔 (Hybrid/Live)",
    title: "세 개의 언어로 적힌 편지 (B3 팬레터 공모)",
    subtitle: "데뷔 첫 주 슬럼프를 깨운 글로벌 팬레터 낭독회와 엔딩 크레딧 헌정",
    logline:
      "치열한 데뷔 첫 주 활동 후 체력 고갈과 낮은 음원 순위에 지쳐가던 밤, 숙소 우편함에 도착한 일본어·영어·한국어 손편지 상자를 열고 5인이 직접 팬레터를 낭독하며 다시 일어선다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 + [B3 팬레터 공모] 참여 장치",
    emotionCurve: "지침(35) ➔ 눈물(78) ➔ 연대(94)",
    emotionIntensity: 91,
    emotionKeyword: "바다를 건너온 손글씨의 온도",
    place: "성수동 K-Soulmate 숙소 거실 & 한강 뚝섬 유원지",
    durationSec: 135,
    leadMemberIds: ["M1", "M4", "M2"],
    expressions: ["편지 다 읽었어", "울지 않기로 해", "네 덕분에 버텨"],
    status: "PLANNING",
    releasePhase: "Phase 3",
    participationDeviceCode: "B3_FANLETTER",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "새벽 귀가길 현관 앞에 쌓인 첫 팬레터 박스",
        description:
          "비에 젖지 않게 비닐로 감싸진 3개국(JP/US/KR) 항공 우편 봉투들을 안고 거실에 모이는 5인.",
        done: false,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:45 ~ 01:35",
        visualType: "LIVE_ACTION",
        sceneTitle: "[참여 장치 ②] B3 팬레터 공모 당선작 멤버 육성 낭독",
        description:
          "하루토(M4)는 일본 팬의 편지를, 이든(M2)은 미국 팬의 편지를, 지후(M1)는 한국 팬의 편지를 직접 읽으며 눈시울을 붉힌다.",
        done: false,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:35 ~ 02:15",
        visualType: "LIVE_ACTION",
        sceneTitle: "참여 팬 전원 닉네임 엔딩 크레딧 롤링 & 답장 엽서 작성",
        description:
          "멤버들이 직접 손글씨로 답장 문구를 적고, 공모 참여 팬들의 이름이 B3 엔딩 크레딧에 영구 등재된다.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "デビュー1週目の夜、疲れ果てた5人の元に届いた3ヶ国語のファンレター。『B3ファンレター公募』で選ばれたあなたの手紙を、メンバーが直接声に出して読み上げます。",
        voStatus: "TODO",
      },
      {
        channelCode: "US",
        narration:
          "Letters written in three languages arrived at our dorm just when exhaustion hit hardest. In Episode B3, the members read your submitted fan letters aloud.",
        voStatus: "TODO",
      },
      {
        channelCode: "KR",
        narration:
          "데뷔 첫 주의 끝자락, 지친 어깨를 일으켜 세운 건 바다를 건너온 세 개의 언어였습니다. [B3 팬레터 공모]에 보내주신 여러분의 진심을 다섯 멤버가 직접 읽습니다.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 207,
    no: 7,
    code: "B4",
    part: "PART_B",
    partLabel: "PART B · 애니➔실사 전환 & 데뷔 (Hybrid/Live)",
    title: "서른 명에서 만 명으로, 첫 1위의 밤 (B4 응원 게이지 MAX)",
    subtitle: "응원 게이지 100% 달성 해금 — 음악방송 첫 1위 트로피와 눈물의 무반주 앵콜",
    logline:
      "글로벌 팬덤의 응원 게이지가 마침내 100%(최대치)에 도달한 날, K-Soulmate가 음악방송 첫 1위 후보에 올라 기적 같은 트로피를 거머쥐고 B1 쇼케이스의 서른 명을 호명하며 앵콜 무대를 부른다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 클라이맥스 + [B4 응원 게이지 최대치]",
    emotionCurve: "집결(85) ➔ 폭발(100) ➔ 환희의 합창(100)",
    emotionIntensity: 100,
    emotionKeyword: "응원 게이지 100% 폭발 · 첫 1위 트로피",
    place: "여의도 공개홀 생방송 무대 & 루프탑 애프터 라이브",
    durationSec: 150,
    leadMemberIds: ["M1", "M2", "M3", "M4", "M5"],
    expressions: ["우리가 해냈어", "이 트로피는 너희 거야", "영원히 함께 가자"],
    status: "PLANNING",
    releasePhase: "Phase 3",
    participationDeviceCode: "B4_GAUGE",
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "[참여 장치 ③] B4 응원 게이지 100% 돌파 & 실시간 집계 화면",
        description:
          "전 세계 4채널 팬들의 응원 게이지가 임계치 100%를 돌파하며 1위 발표 카운트다운이 시작된다.",
        done: false,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:45 ~ 01:35",
        visualType: "LIVE_ACTION",
        sceneTitle: "첫 1위 호명과 리더 한지후의 3개국어 수상 소감",
        description:
          "트로피를 품에 안은 지후(M1)가 '성수동 비 오던 밤 서른 명으로 시작해 주신 여러분께 바칩니다'라며 눈물의 소감을 전한다.",
        done: false,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:35 ~ 02:30",
        visualType: "LIVE_ACTION",
        sceneTitle: "응원 게이지 MAX 리워드: 무반주 풀버전 라이브 & 전국투어 선언",
        description:
          "마이크를 객석으로 향한 떼창 앵콜 후, '이제 우리가 여러분이 있는 도시로 찾아갑니다'라며 PART C 전국투어를 선언한다.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "応援ゲージ100%達成の瞬間、ついに掴んだ初の1位トロフィー。30人から始まった奇跡が1万人の合唱へと変わった夜。そして5人は全国ツアーへと旅立ちます。",
        voStatus: "TODO",
      },
      {
        channelCode: "US",
        narration:
          "Support Gauge at 100% MAX. From thirty people in a basement theater to our very first #1 trophy! Watch the uncut encore unlocked by your support.",
        voStatus: "TODO",
      },
      {
        channelCode: "KR",
        narration:
          "응원 게이지 100% 달성! 서른 명의 관객으로 시작했던 다섯 소년이 마침내 첫 1위 트로피를 들어 올립니다. 그리고 이제, 여러분을 만나러 전국투어(PART C)를 떠납니다.",
        voStatus: "DONE",
      },
    ],
  },

  // ==================== PART C: C1 ~ C3 (100% 실사 전국투어 · GT TOUR 3대 투어 상품 직결) ====================
  {
    id: 208,
    no: 8,
    code: "C1",
    part: "PART_C",
    partLabel: "PART C · 실사 전국투어 & GT TOUR 결합",
    title: "서울 앵콜 & 성수-한강 나이트 콘서트 투어",
    subtitle: "[전국투어 개막 · 서울] 올림픽공원 야외 스테이지 & 성수 Verified 나잇 코스",
    logline:
      "전국투어의 첫 포문을 여는 서울 콘서트. 해외에서 입국한 수많은 글로벌 팬들이 심야 귀가 걱정 없이 공연의 여운을 이어갈 수 있도록 성수-잠실-한강을 잇는 나이트 투어 동선이 펼쳐진다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 전국투어 (GT TOUR 3대 상품 연동)",
    emotionCurve: "개막 흥분(85) ➔ 서울 야경 몰입(92) ➔ 안심 여운(90)",
    emotionIntensity: 92,
    emotionKeyword: "서울의 밤을 달리는 투어 개막",
    place: "서울 올림픽공원 벨로드롬 & 성수-뚝섬 한강 나이트 루트",
    durationSec: 135,
    leadMemberIds: ["M1", "M2", "M3"],
    expressions: ["서울의 밤은 이제 시작이야", "조심히 들어가", "내일 또 만나자"],
    status: "PLANNING",
    releasePhase: "Phase 4",
    tourProducts: buildPartCTourProducts(
      "C1",
      "서울(Seoul)",
      "올림픽공원 핸드볼/벨로드롬 스테이지",
      "성수 연무장길 심야 다이닝 & 뚝섬 한강 야경 스팟",
      "성수·잠실 도보 5분 Verified 안심 스테이"
    ),
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "서울 투어 오프닝 & 성수동 성지순례 데이 코스",
        description:
          "공연 전 낮 시간, 멤버들이 직접 추천한 성수동 연습실 인근 카페와 서울숲 성지순례 코스를 따라 걷는 글로벌 팬들.",
        done: false,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:45 ~ 01:30",
        visualType: "LIVE_ACTION",
        sceneTitle: "서울 야외 스테이지 피날레 & 밤 10시 심야 퇴근길",
        description:
          "화려한 서울 밤하늘 아래 펼쳐진 2시간의 라이브. 공연 직후 멤버들이 해외 팬들의 안전한 심야 귀가를 챙기는 안내 멘트.",
        done: false,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:30 ~ 02:15",
        visualType: "LIVE_ACTION",
        sceneTitle: "[GT TOUR 브릿지] 공연 정착 셔틀 · 콘서트 나잇 패키지 · VVIP 송영",
        description:
          "종연 직후 대기 중인 전용 리무진 셔틀과 도보 5분 Verified 스테이, 심야 한강 애프터 다이닝으로 이어지는 무결점 투어 경험.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "全国ツアー幕開けのソウル公演！終演後の深夜移動も心配無用。GT TOURの『公演定着シャトル』『コンサートナイトパッケージ』『VVIP送迎』で、聖水洞の聖地巡礼から徒歩5分ステイまで安心サポート。",
        voStatus: "TODO",
      },
      {
        channelCode: "US",
        narration:
          "Kickoff of our Nationwide Tour in Seoul! From daytime pilgrimage spots in Seongsu to post-concert late-night transfers and Verified Stays with GT TOUR.",
        voStatus: "TODO",
      },
      {
        channelCode: "KR",
        narration:
          "전국투어의 첫 도시 서울! 낮에는 성수동 오리진 성지순례, 밤에는 뜨거운 콘서트와 GT TOUR 안심 정착 셔틀·나잇 패키지로 완벽한 서울의 밤을 완성합니다.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 209,
    no: 9,
    code: "C2",
    part: "PART_C",
    partLabel: "PART C · 실사 전국투어 & GT TOUR 결합",
    title: "부산 바다 앞의 버스킹과 팬 투표 다음 도시 (C2 도시 추천)",
    subtitle: "[전국투어 중반 · 부산] 광안리 드론 라이트 스테이지 & [C2 다음 도시 추천] 투표",
    logline:
      "서울을 넘어 부산 광안리 해변 특설 무대로 향한 5인. 파도 소리와 함께하는 어쿠스틱 유닛 무대를 선보이며, 글로벌 팬들의 실시간 투표(C2 다음 도시 추천)로 다음 투어 행선지와 GT TOUR 사전 블록 노선을 결정한다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 전국투어 + [C2 다음 도시 추천] & GT TOUR 연동",
    emotionCurve: "청량(80) ➔ 낭만(93) ➔ 기대감(96)",
    emotionIntensity: 94,
    emotionKeyword: "부산 밤바다와 팬이 정하는 다음 행선지",
    place: "부산 광안리 해변 특설 스테이지 & 해운대 더베이 요트 코트",
    durationSec: 135,
    leadMemberIds: ["M2", "M4", "M5"],
    expressions: ["바다 보러 같이 갈래?", "다음 도시는 어디야?", "네가 부르면 어디든 가"],
    status: "PLANNING",
    releasePhase: "Phase 4",
    participationDeviceCode: "C2_CITY",
    tourProducts: buildPartCTourProducts(
      "C2",
      "부산(Busan)",
      "부산 광안리 오션 특설 스테이지 & 벡스코 오디토리움",
      "해운대 프라이빗 요트 투어 & 광안대교 오션뷰 다이닝",
      "해운대·광안리 오션프론트 도보 5분 Verified 스테이"
    ),
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "KTX 부산역 도착 & 광안리 골든아워 사운드체크",
        description:
          "노을 지는 광안대교를 배경으로 이든(M2)의 어쿠스틱 기타와 하루토(M4)의 보컬이 울려 퍼지는 해변 사운드체크.",
        done: false,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:45 ~ 01:35",
        visualType: "LIVE_ACTION",
        sceneTitle: "[참여 장치 ④] C2 다음 도시 추천 — 팬 투표로 결정되는 피날레 투어지",
        description:
          "제주·강릉·전주·경주 중 팬들이 가장 많이 투표한 도시로 다음 정착 셔틀과 콘서트 나잇 패키지 사전 블록이 오픈된다.",
        done: false,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:35 ~ 02:15",
        visualType: "LIVE_ACTION",
        sceneTitle: "[GT TOUR 브릿지] 부산 오션뷰 콘서트 나잇 패키지 & KTX/김해공항 VVIP 송영",
        description:
          "김해공항·부산역 픽업부터 광안리 공연장 셔틀, 해운대 오션뷰 Verified 스테이까지 원스톱 연결.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "釜山(プサン)・広安里の海辺で響くアコースティックライブ！『C2次の都市推薦』投票で次のツアー都市が決まります。釜山駅・金海空港からのGT TOUR VVIP送迎＆海雲台ステイも完備。",
        voStatus: "TODO",
      },
      {
        channelCode: "US",
        narration:
          "Ocean breeze and sunset stages at Gwangalli Beach, Busan! Vote in the C2 Next City Recommendation to choose our next stop, backed by GT TOUR's oceanfront Night Package.",
        voStatus: "TODO",
      },
      {
        channelCode: "KR",
        narration:
          "부산 광안리 밤바다를 수놓은 전국투어 두 번째 챕터! [C2 다음 도시 추천] 투표로 우리가 향할 다음 도시를 직접 선택해 주세요.",
        voStatus: "DONE",
      },
    ],
  },
  {
    id: 210,
    no: 10,
    code: "C3",
    part: "PART_C",
    partLabel: "PART C · 실사 전국투어 & GT TOUR 결합",
    title: "우리의 계절은 끝나지 않는다 (전국투어 그랜드 피날레)",
    subtitle: "[전국투어 완결 · 제주 & 서울 돔] 5인의 서사 완성과 글로벌 팬 정착 투어의 완성",
    logline:
      "팬 투표(C2)로 선정된 제주 산굼부리 선셋 스테이지와 서울 피날레 앵콜을 잇는 시즌 2 최종화. 각기 다른 도시에서 출발했던 5인의 소년이 전 세계 팬들이 언제든 찾아올 수 있는 '서울의 소울메이트'로 자리 잡으며 다음 시즌을 예고한다.",
    format: "LIVE_ACTION_100",
    formatLabel: "100% 실사 피날레 (GT TOUR 3대 상품 마스터 패키지)",
    emotionCurve: "여정의 회고(85) ➔ 대합창(99) ➔ 새로운 약속(100)",
    emotionIntensity: 100,
    emotionKeyword: "시즌 2 대단원 · 끝나지 않는 우리의 계절",
    place: "제주 노형 슈퍼마르셰/산굼부리 스테이지 & 서울 앵콜 돔",
    durationSec: 165,
    leadMemberIds: ["M1", "M2", "M3", "M4", "M5"],
    expressions: ["언제든 한국으로 와", "우리가 여기 있을게", "다시 만날 우리의 계절"],
    status: "PLANNING",
    releasePhase: "Phase 4",
    tourProducts: buildPartCTourProducts(
      "C3",
      "제주·서울 그랜드 피날레(Jeju & Seoul)",
      "제주 선셋 아레나 & 서울 피날레 돔 스테이지",
      "제주 프라이빗 오션 웰니스 & 성수-청담 아티스트 성지순례 마스터 루트",
      "제주 독채 풀빌라 & 서울 청담·성수 5성급 Verified 스테이"
    ),
    beats: [
      {
        id: 1,
        code: "S1",
        timeRange: "00:00 ~ 00:55",
        visualType: "LIVE_ACTION",
        sceneTitle: "오리진 5개 도시(서울·LA·상하이·오사카·쿠알라룸푸르)에서 제주·서울까지",
        description:
          "오리진 5편과 시즌 1~2의 모든 순간이 파노라마처럼 교차하며 무대 위 5인의 실사 클로즈업으로 모인다.",
        done: false,
      },
      {
        id: 2,
        code: "S2",
        timeRange: "00:55 ~ 01:55",
        visualType: "LIVE_ACTION",
        sceneTitle: "[GT TOUR 마스터 브릿지] 글로벌 팬 정착 셔틀 · 콘서트 나잇 · VVIP 송영 통합 운영",
        description:
          "전 세계 어디서 출발하든 인천/김포/제주공항 도착 순간부터 공연장 셔틀, 숙소, 웰니스까지 GT TOUR가 책임지는 상시 투어 루트.",
        done: false,
      },
      {
        id: 3,
        code: "S3",
        timeRange: "01:55 ~ 02:45",
        visualType: "LIVE_ACTION",
        sceneTitle: "커튼콜: '언제든 한국으로 와, 우리가 여기 있을게'",
        description:
          "무대 조명이 꺼진 뒤에도 끝나지 않는 팬들의 떼창과 시즌 3 월드투어 티저 쿠키 영상.",
        done: false,
      },
    ],
    channelScripts: [
      {
        channelCode: "JP",
        narration:
          "5つの都市から始まった物語は、ソウルと済州を結ぶグランドフィナーレへ。「いつでも韓国へ来て、僕たちがここにいるから」GT TOURの3大ツアーパッケージで、あなたの聖地巡礼はいつでも現実になります。",
        voStatus: "TODO",
      },
      {
        channelCode: "US",
        narration:
          "From five distant cities to our Grand Finale across Korea. 'Come to Korea anytime—we'll be right here.' Experience the full K-Soulmate route with GT TOUR's 3 signature packages.",
        voStatus: "TODO",
      },
      {
        channelCode: "KR",
        narration:
          "다섯 개의 도시에서 출발해 서른 명의 관객을 만나고, 전국투어 그랜드 피날레에 도착하기까지. '언제든 한국으로 와, 우리가 여기 있을게.' GT TOUR 3대 투어 패키지와 함께 우리의 계절은 계속됩니다.",
        voStatus: "DONE",
      },
    ],
  },
];

/**
 * VIII장 참여 설계 4대 장치 (A3 성장 투표, B3 팬레터 공모, B4 응원 게이지 최대치, C2 다음 도시 추천)
 */
export const INITIAL_SEASON2_DEVICES: Season2ParticipationDevice[] = [
  {
    id: 1,
    code: "A3_VOTE",
    episodeCode: "A3",
    episodeTitle: "A3 「이름 없는 다섯 명의 밤」",
    title: "① A3 성장 투표 (쇼케이스 킬링 파트 & 유닛 결정)",
    mechanismLabel: "VIII-1 · 팬 투표 기반 세트리스트 결정",
    description:
      "PART A(100% 애니) 마지막 화에서 팬들이 직접 B1 실사 데뷔 쇼케이스의 킬링 파트 센터와 어쿠스틱 유닛 조합을 투표로 결정합니다.",
    currentCount: 14820,
    targetCount: 15000,
    unit: "표",
    status: "ACTIVE",
    rewardRule: "1위 득표 안이 B1 「관객 서른 명」 쇼케이스 첫 실사 무대 연출에 100% 반영",
    gtTourLinkNote: "투표 참여 팬 대상 성수동 쇼케이스 성지순례 코스 디지털 패스 발급",
    options: [
      {
        id: "opt_a3_1",
        label: "한지후(M1) × 사토 하루토(M4) 새벽 한강 어쿠스틱 브릿지",
        subLabel: "보컬 합 중심 · 감성 웜톤 조명",
        count: 6420,
        isLeading: true,
      },
      {
        id: "opt_a3_2",
        label: "린 위하오(M3) × 아이만(M5) 무반주 메트로놈 댄스 브레이크",
        subLabel: "퍼포먼스 중심 · 핀스포트라이트 연출",
        count: 5190,
      },
      {
        id: "opt_a3_3",
        label: "이든 박(M2) 주도 5인 전원 아카펠라 오프닝",
        subLabel: "A1 합주 서사 회수 · 현장 라이브 호흡",
        count: 3210,
      },
    ],
  },
  {
    id: 2,
    code: "B3_FANLETTER",
    episodeCode: "B3",
    episodeTitle: "B3 「세 개의 언어로 적힌 편지」",
    title: "② B3 팬레터 공모 (3개국 손편지 멤버 실사 낭독회)",
    mechanismLabel: "VIII-2 · JP/EN/KR 팬 사연 회수 & 크레딧 헌정",
    description:
      "실사 데뷔 후 첫 슬럼프를 겪는 B3 에피소드에서 멤버들이 직접 읽을 글로벌 팬레터를 공모합니다. 채택된 편지는 본편 보이스오버 및 엔딩 크레딧에 수록됩니다.",
    currentCount: 412,
    targetCount: 500,
    unit: "통",
    status: "COLLECTING",
    rewardRule: "언어권별 베스트 3통 본편 실사 낭독 + 참여자 전원 B3 엔딩 크레딧 영구 등재",
    gtTourLinkNote: "당선 팬 방한 시 성수 숙소 인근 카페 성지순례 & 웰니스 케어 바우처 연계",
    options: [
      {
        id: "opt_b3_jp",
        label: "[JP 채택 후보] 「雨の大阪から、ハルトと5人の初舞台へ」",
        subLabel: "오사카 팬 @haru_soul · 일본어 손편지 검수 완료",
        count: 184,
        isLeading: true,
      },
      {
        id: "opt_b3_en",
        label: "[US 채택 후보] \"Your 3 AM studio light kept me going in LA\"",
        subLabel: "LA 팬 @eden_verse · 영어 팬레터 검수 완료",
        count: 136,
      },
      {
        id: "opt_b3_kr",
        label: "[KR 채택 후보] 「성수동 소극장 서른 명 중 한 명이었던 날의 기록」",
        subLabel: "서울 팬 @seongsu_30 · 한국어 손편지 검수 완료",
        count: 92,
      },
    ],
  },
  {
    id: 3,
    code: "B4_GAUGE",
    episodeCode: "B4",
    episodeTitle: "B4 「서른 명에서 만 명으로, 첫 1위의 밤」",
    title: "③ B4 응원 게이지 최대치 (100% MAX 1위 앵콜 & 투어 해금)",
    mechanismLabel: "VIII-3 · 글로벌 통합 응원 게이지 MAX 언락",
    description:
      "시즌 1(50% 얼굴 공개)에서 시작된 응원 게이지가 시즌 2 B4에서 100% 최대치에 도달하면, 첫 1위 무반주 풀버전 앵콜 영상과 PART C 실사 전국투어 패키지가 동시 해금됩니다.",
    currentCount: 96,
    targetCount: 100,
    unit: "%",
    status: "ACTIVE",
    rewardRule: "100% 달성 시 B4 무삭제 앵콜 디렉터스 컷 + PART C 3대 투어 상품 프리오더 오픈",
    gtTourLinkNote: "게이지 100% 달성 즉시 GT TOUR [공연 정착 셔틀 / 나잇 패키지 / VVIP 송영] 연동 활성화",
    options: [
      {
        id: "opt_b4_1",
        label: "JP 채널 응원 합산 기여도",
        subLabel: "도쿄·오사카 팬덤 스트리밍 & 댓글 미션",
        count: 42,
        isLeading: true,
      },
      {
        id: "opt_b4_2",
        label: "US/Global 채널 응원 합산 기여도",
        subLabel: "북미·동남아 릴스/쇼츠 챌린지 참여",
        count: 31,
      },
      {
        id: "opt_b4_3",
        label: "KR 채널 현장 응원 & 투표 기여도",
        subLabel: "생방송 문자 투표 & 쇼케이스 인증",
        count: 23,
      },
    ],
  },
  {
    id: 4,
    code: "C2_CITY",
    episodeCode: "C2",
    episodeTitle: "C2 「부산 바다 앞의 버스킹과 다음 도시」",
    title: "④ C2 다음 도시 추천 (전국투어 정착 도시 & GT TOUR 노선 투표)",
    mechanismLabel: "VIII-4 · 투어 행선지 팬 결정 & 사전 수요 확보",
    description:
      "PART C 실사 전국투어 중 글로벌 팬들이 직접 방문하고 싶은 다음 한국 도시를 투표합니다. 득표 1위 도시는 C3 피날레 투어지 및 GT TOUR 사전 예약 블록 상품으로 즉시 편성됩니다.",
    currentCount: 8940,
    targetCount: 10000,
    unit: "표",
    status: "ACTIVE",
    rewardRule: "1위 도시 C3 피날레 촬영지 확정 + 해당 도시 GT TOUR 3대 투어 상품 즉시 런칭",
    gtTourLinkNote: "투표 데이터를 기반으로 숙소 블록(Verified Stay) 및 리무진 셔틀 대수 사전 확정",
    options: [
      {
        id: "opt_c2_jeju",
        label: "제주 (Jeju) — 산굼부리 선셋 스테이지 & 오션 독채 스테이",
        subLabel: "직항 노선(JP/CN) 연동 · 프라이빗 웰니스 선호도 1위",
        count: 3890,
        isLeading: true,
      },
      {
        id: "opt_c2_gangneung",
        label: "강릉·양양 (Gangneung) — 동해 비치 서프 버스킹 & KTX 직결 셔틀",
        subLabel: "서울역 KTX 1시간 50분 · 해변 카페 성지순례",
        count: 2740,
      },
      {
        id: "opt_c2_gyeongju",
        label: "경주·전주 (Heritage) — 한옥 스테이 나잇 & 야간 고궁 라이브",
        subLabel: "글로벌 한옥 Verified Stay 선호 팬덤 집중 투표",
        count: 2310,
      },
    ],
  },
];

/**
 * IX장 공개 페이즈 매핑 테이블 (Phase 0 ~ Phase 4)
 */
export const INITIAL_RELEASE_PHASES: ReleasePhaseItem[] = [
  {
    id: 1,
    phase: "Phase 0",
    title: "프리런칭 · 오리진 시리즈 5편 & 캐릭터 락",
    period: "D-14 ~ D+14 (런칭 전후 4주)",
    contentScope: "오리진 5편 (M1 한지후 ~ M5 아이만 · 각 180초)",
    visualFormat: "2D 애니메이션 (B1~B6) ➔ B7 실사 시트 디졸브",
    coreGoal: "5인 서사 결핍·선택 공감 형성 및 AC-20 캐릭터 시트 락 완료",
    participationHook: "오리진 응원 포인트 공감 & SAFE-01~08 안전 가드레일",
    gtTourProduct: "오리진 출발 도시 ➔ 서울 성수 도착 성지순례 프리뷰",
    linkedRoutePage: "origins",
    linkedEpisodeCodes: ["ORIGIN-M1", "ORIGIN-M4", "ORIGIN-M2", "ORIGIN-M3", "ORIGIN-M5"],
    status: "DONE",
  },
  {
    id: 2,
    phase: "Phase 1",
    title: "시즌 1 · 서울 로컬 적응기 & 한국어 미션 12화",
    period: "Week 1 ~ Week 6 (주 2편 × 4채널)",
    contentScope: "시즌 1 제1화~제12화 (성수·청담·한강·홍대 60초 숏폼)",
    visualFormat: "실사 캐릭터 시트 기반 AI 숏폼 (편당 25컷 · 60초)",
    coreGoal: "실전 한국어 3표현 학습 + 하루토 얼굴 공개(50%) 응원 게이지",
    participationHook: "회차별 표현 미션 공모 & 팬덤명 5대 조건 게이트",
    gtTourProduct: "시즌 1 촬영지(성수·청담·한남) 핫플 & K-뷰티 데이 패스",
    linkedRoutePage: "episodes",
    linkedEpisodeCodes: ["S1-EP1", "S1-EP6", "S1-EP10", "S1-EP12"],
    status: "DONE",
  },
  {
    id: 3,
    phase: "Phase 2",
    title: "시즌 2 PART A · 데뷔 전야 성수동 지하 연습실 (A1~A3)",
    period: "Week 7 ~ Week 8",
    contentScope: "시즌 2 A1 「성수동 지하 1층의 메트로놈」 ~ A3 「이름 없는 다섯 명의 밤」",
    visualFormat: "100% 2D 애니메이션 (2x2 애니 설정 시트 정밀 연동)",
    coreGoal: "5인 합주·보컬 특훈 갈등 해소 및 실사 쇼케이스 기대감 극대화",
    participationHook: "[장치 ①] A3 성장 투표 (쇼케이스 킬링 파트 & 유닛 결정)",
    gtTourProduct: "성수동 연습실 골목 & 서울숲 루프탑 성지순례 워킹 투어",
    linkedRoutePage: "season2",
    linkedEpisodeCodes: ["A1", "A2", "A3"],
    status: "ACTIVE",
  },
  {
    id: 4,
    phase: "Phase 3",
    title: "시즌 2 PART B · 애니➔실사 전환 쇼케이스 & 첫 1위 (B1~B4)",
    period: "Week 9 ~ Week 11",
    contentScope: "시즌 2 B1 「관객 서른 명」 ~ B4 「서른 명에서 만 명으로, 첫 1위의 밤」",
    visualFormat: "B1 매치컷 전환 (애니➔실사) 후 B2~B4 100% 실사(Live-Action)",
    coreGoal: "AC-20 캐릭터 일치 게이트 통과, 실사 데뷔 안착 및 음악방송 첫 1위",
    participationHook: "[장치 ②] B3 팬레터 공모 & [장치 ③] B4 응원 게이지 최대치(100%)",
    gtTourProduct: "[NIGHT-SOS] 방송국 공개홀/쇼케이스 인접 도보 5분 Verified Stay",
    linkedRoutePage: "season2",
    linkedEpisodeCodes: ["B1", "B2", "B3", "B4"],
    status: "ACTIVE",
  },
  {
    id: 5,
    phase: "Phase 4",
    title: "시즌 2 PART C · 100% 실사 전국투어 & GT TOUR 수익 전환 (C1~C3)",
    period: "Week 12 ~ Week 14 (상시 투어 전환)",
    contentScope: "시즌 2 C1(서울) · C2(부산) · C3(제주/피날레)",
    visualFormat: "100% 실사 전국투어 다큐 & 콘서트 스테이지 필름",
    coreGoal: "콘텐츠 시청 팬덤을 실제 방한 투어 예약자(Pre-secured Pass)로 전환",
    participationHook: "[장치 ④] C2 다음 도시 추천 투표 (실시간 투어 노선 수요 확정)",
    gtTourProduct: "3대 투어 상품 직결: ① 공연 정착 셔틀 · ② 콘서트 나잇 패키지 · ③ VVIP 송영",
    linkedRoutePage: "season2",
    linkedEpisodeCodes: ["C1", "C2", "C3"],
    status: "UPCOMING",
  },
];
