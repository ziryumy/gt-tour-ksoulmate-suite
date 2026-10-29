import { sanitizeTextWithGuardrails } from './guardrails';
import { FIXED_GTTOUR_FOOTER, type CampaignAxis, type TargetLang } from './schema';

export type RevenuePassId = 'NIGHT_SOS' | 'ZERO_WAIT' | 'BEAUTY_CARE' | 'FIRST_SEOUL';

export interface PreSecuredPassSpec {
  id: RevenuePassId;
  code: string;
  badge: string;
  axis: CampaignAxis;
  krTitle: string;
  krSubtitle: string;
  slotNotice: string;
  priceTag: string;
  defaultSpots: string[];
  titles: Record<TargetLang, string>;
  pitchLines: Record<TargetLang, string>;
  selfCheckoutLines: Record<TargetLang, string>;
}

export const PRE_SECURED_PASS_LINK = 'https://tr.ee/dSpLdDtiGW';

export const PRE_SECURED_REVENUE_PASSES: PreSecuredPassSpec[] = [
  {
    id: 'NIGHT_SOS',
    code: 'PASS 01 · [NIGHT-SOS]',
    badge: '콘서트 심야 귀가 & 도보 5분 스테이',
    axis: 'KPOP_NEWS',
    krTitle: '콘서트 당일 사전 확보된 도보 5분 Verified Stay & 정시 출발 안심 리무진 패스',
    krSubtitle: '22:30 공연 종료 후 택시 전쟁·막차 불안 없이 도보 5분 체크인 또는 정시 출발 전용 리무진 탑승',
    slotNotice: '공연일 기준 사전 블록된 객실·리무진 슬롯 한정 운영 (실시간 수배 없음)',
    priceTag: 'Pre-secured Slot Pass',
    defaultSpots: [
      'KSPO DOME 도보 5분 Verified 스테이',
      '성수 K-POP 공식 팝업스토어',
      '올림픽공원 정시 출발 안심 리무진 존'
    ],
    titles: {
      JP: '① [NIGHT-SOS] コンサート当日・事前確保済み徒歩5分Verified Stay＆定刻出発安心リムジンパス',
      EN: '① [NIGHT-SOS] Concert Day Pre-Secured 5-Min Walk Verified Stay & On-Time Safe Limousine Pass',
      CN: '① [NIGHT-SOS] 演唱会当日预先锁定步行5分钟严选酒店 & 准点发车安心礼宾专车通行证',
      KR: '① [NIGHT-SOS] 콘서트 당일 사전 확보된 도보 5분 Verified Stay & 정시 출발 안심 리무진 패스'
    },
    pitchLines: {
      JP: '当日の夜に現地でタクシーを探して苦労するのではなく、あらかじめ確保されたGT TOUR専用スロット（会場徒歩5分Verifiedホテル＆終연後定刻出発リムジン）を事前におさえておきませんか？言葉の心配なく、予定を整えます。',
      EN: 'Instead of struggling on-site in the late-night crowd after the encore, claim a pre-secured GT TOUR dedicated slot—featuring a 5-min walk Verified Stay and an on-time departure limousine waiting right outside the venue.',
      CN: '与其在散场深夜现场焦急苦等出租车，不如提前锁定 GT TOUR 预先留好的专属名额（场馆步行5分钟认证酒店 & 散场准点发车礼宾专车），安全丝滑回程。',
      KR: '실시간으로 현장에서 심야 택시와 막차 때문에 고생하지 마시고, 미리 확보된 GT TOUR 전용 슬롯(공연장 도보 5분 Verified Stay & 정시 출발 안심 리무진 패스)을 선점하세요.'
    },
    selfCheckoutLines: {
      JP: 'スタッフとの長いチャットやり取りは不要です。下記の専用リンクからご希望の公演日・乗車枠を直接選んで30秒でセルフ予約を完了してください 👉 https://tr.ee/dSpLdDtiGW',
      EN: 'No need for long back-and-forth DM chats—simply pick your concert date and claim your pre-secured slot directly via our self-checkout link in 30 seconds 👉 https://tr.ee/dSpLdDtiGW',
      CN: '无需繁琐的私信人工沟通，直接点击下方自助预约链接，选择您的观演日期即可30秒锁定专属名额 👉 https://tr.ee/dSpLdDtiGW',
      KR: '직원과의 긴 채팅 대기 없이, 아래 셀프 체크아웃 링크에서 원하시는 공연 일정과 슬롯을 직접 선택해 즉시 선점하세요 👉 https://tr.ee/dSpLdDtiGW'
    }
  },
  {
    id: 'ZERO_WAIT',
    code: 'PASS 02 · [ZERO-WAIT]',
    badge: '성수·한남 웨이팅 제로 & 짐 보관',
    axis: 'HOTPLACE',
    krTitle: '성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스',
    krSubtitle: '한국 휴대폰 번호 없이도 인기 쇼룸·브런치 우선 입장 + 쇼핑백·캐리어 전용 밴 안전 보관',
    slotNotice: '성수·한남·도산 제휴 파트너 타임슬롯 사전 확보 완료',
    priceTag: 'Pre-secured Slot Pass',
    defaultSpots: [
      '성수 디자이너 쇼룸',
      '한남 브런치 다이닝',
      '압구정 도산공원 디저트 카페'
    ],
    titles: {
      JP: '② [ZERO-WAIT] 聖水・漢南提携スポット事前予約代行＆専用車荷物預かりパス',
      EN: '② [ZERO-WAIT] Seongsu & Hannam Partner Priority Booking & Private Van Luggage Storage Pass',
      CN: '② [ZERO-WAIT] 圣水·汉南合作热门店提前预约代办 & 专车行李寄存通行证',
      KR: '② [ZERO-WAIT] 성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스'
    },
    pitchLines: {
      JP: '韓国の電話番号がなくて現地で行列に並んで時間を無駄にする代わりに、事前確保されたGT TOUR専用枠（聖水・漢南の人気スポット優先予約＆専用車でのスーツケース・買い物袋お預かりパス）を先取りしてください。',
      EN: 'Don’t waste precious hours standing in line without a Korean phone number—secure a pre-reserved GT TOUR slot for Seongsu & Hannam hotplaces complete with private van luggage & shopping bag storage.',
      CN: '无需因为没有韩国手机号而在现场漫长排队，提前锁定 GT TOUR 预先保留的圣水·汉南热门店预约名额，更有专车全程为您寄存行李与购物袋。',
      KR: '실시간으로 현장에서 한국 번호 인증과 긴 웨이팅으로 고생하지 마시고, 미리 확보된 GT TOUR 전용 슬롯(성수·한남 제휴 스팟 사전 예약 & 전용 차량 짐 보관 패스)을 선점하세요.'
    },
    selfCheckoutLines: {
      JP: '個別DMでの順番待ち確認は不要です。下記リンクから訪問希望日とエリア枠を選んで直接お申し込みください 👉 https://tr.ee/dSpLdDtiGW',
      EN: 'Skip the DM wait—select your preferred date and Seongsu/Hannam time block directly via our self-checkout page 👉 https://tr.ee/dSpLdDtiGW',
      CN: '无需等待人工客服回复，直接点击下方链接选择您的探店日期与时段，一键完成自助锁定 👉 https://tr.ee/dSpLdDtiGW',
      KR: '직원과의 긴 채팅 대신, 아래 셀프 체크아웃 링크에서 방문 희망일과 성수·한남 타임슬롯을 직접 선택해 신청하세요 👉 https://tr.ee/dSpLdDtiGW'
    }
  },
  {
    id: 'BEAUTY_CARE',
    code: 'PASS 03 · [BEAUTY-CARE]',
    badge: '청담 웰니스 사전 문진 & 전담 통역 픽업',
    axis: 'K_BEAUTY',
    krTitle: '청담 웰니스 사전 문진 번역 시트 제공 & 전담 통역 픽업 패스',
    krSubtitle: '방문 전 원어민 사전 문진 시트로 소통 오류 차단 + 1:1 전담 매니저 동행 및 숙소 안심 복귀',
    slotNotice: '청담·압구정 프라이빗 라운지 사전 블록 슬롯 및 전담 통역 배정',
    priceTag: 'Pre-secured Slot Pass',
    defaultSpots: [
      '청담 프라이빗 라운지',
      '성수 플래그십 스토어',
      '한남 브런치 다이닝'
    ],
    titles: {
      JP: '③ [BEAUTY-CARE] 清潭ウェルネス事前問診翻訳シート提供＆専任通訳ピックアップパス',
      EN: '③ [BEAUTY-CARE] Cheongdam Wellness Pre-Visit Translated Intake Sheet & 1:1 Interpreter Pickup Pass',
      CN: '③ [BEAUTY-CARE] 清潭洞健康美学事前问诊翻译表 & 1对1专职翻译专车接送通行证',
      KR: '③ [BEAUTY-CARE] 청담 웰니스 사전 문진 번역 시트 제공 & 전담 통역 픽업 패스'
    },
    pitchLines: {
      JP: '現地で専門用語が伝わらず不安な思いをする前に、あらかじめ確保されたGT TOUR専用枠（事前日本語問診シート作成＋1:1専任通訳同行＋ホテルまでのプライベート送迎パス）をご予約ください。言葉の心配なく、予定を整えます。',
      EN: 'Avoid miscommunication or rushed consultations on-site—reserve a pre-secured GT TOUR slot that includes a pre-translated wellness intake sheet, 1:1 dedicated interpreter accompaniment, and private hotel drop-off.',
      CN: '不必担心在现场因专业术语沟通不畅而焦虑，提前锁定 GT TOUR 专属名额（包含事前中文问诊需求表 + 1对1专职翻译陪同 + 酒店专车接送服务）。',
      KR: '실시간으로 현장에서 언어 장벽과 동선 문제로 고생하지 마시고, 미리 확보된 GT TOUR 전용 슬롯(청담 웰니스 사전 문진 번역 시트 & 1:1 전담 통역 픽업 패스)을 선점하세요.'
    },
    selfCheckoutLines: {
      JP: '長いチャット相談なしで、下記リンクからご希望の日時スロットと事前問診シートを直接選択してセルフ申請できます 👉 https://tr.ee/dSpLdDtiGW',
      EN: 'No lengthy chat required—choose your preferred Cheongdam slot and submit your pre-visit preferences directly at 👉 https://tr.ee/dSpLdDtiGW',
      CN: '无需冗长私信咨询，直接点击下方自助通道选择您的清潭洞预约时段并勾选需求表 👉 https://tr.ee/dSpLdDtiGW',
      KR: '직원과의 긴 채팅 대신, 아래 셀프 체크아웃 링크에서 희망 일정과 사전 문진 옵션을 직접 선택해 신청하세요 👉 https://tr.ee/dSpLdDtiGW'
    }
  },
  {
    id: 'FIRST_SEOUL',
    code: 'PASS 04 · [FIRST-SEOUL]',
    badge: '공항 VIP 리무진 & 호텔 짐 직배송',
    axis: 'STAY',
    krTitle: '항공편 연동 공항 VIP 리무진 노웨이팅 픽업 & 호텔 짐 직배송 패스',
    krSubtitle: '입국 즉시 대기 없는 전용 리무진 탑승 또는 캐리어 호텔 직배송 후 두 손 가볍게 첫 일정 시작',
    slotNotice: '인천(ICN)·김포(GMP) 항공편 도착 시간 연동 사전 배차 슬롯',
    priceTag: 'Pre-secured Slot Pass',
    defaultSpots: [
      '인천·김포공항 VIP 리무진 픽업 존',
      '올림픽공원 도보 5분 Verified 호텔',
      '잠실 한강뷰 라운지'
    ],
    titles: {
      JP: '④ [FIRST-SEOUL] 便名連動・空港VIPリムジン待ち時間ゼロ送迎＆ホテル荷物直送パス',
      EN: '④ [FIRST-SEOUL] Flight-Synced Airport VIP Limousine Zero-Wait Pickup & Hotel Luggage Direct Delivery Pass',
      CN: '④ [FIRST-SEOUL] 航班联动机场VIP礼宾专车零等待接机 & 行李直达酒店通行证',
      KR: '④ [FIRST-SEOUL] 항공편 연동 공항 VIP 리무진 노웨이팅 픽업 & 호텔 짐 직배송 패스'
    },
    pitchLines: {
      JP: '重いスーツケースを引いて空港鉄道の階段やバス乗り場で消耗せず、あらかじめ確保されたGT TOUR専用枠（フライト連動VIPリムジン迎え＆ホテルへの荷物直送パス）で到着直後から身軽にソウル旅を始めましょう。',
      EN: 'Don’t haul heavy suitcases up subway stairs after a long flight—claim a pre-secured GT TOUR Airport VIP Limousine & Direct Hotel Luggage Delivery slot so you can start exploring Seoul hands-free.',
      CN: '下飞机后无需拖着沉重行李箱挤地铁或排队等大巴，提前锁定 GT TOUR 航班联动VIP礼宾专车接机与行李直达酒店通行证，落地即刻轻松开启首尔行程。',
      KR: '실시간으로 공항 현장에서 무거운 캐리어를 끌고 대중교통과 씨름하지 마시고, 미리 확보된 GT TOUR 전용 슬롯(항공편 연동 공항 VIP 리무진 픽업 & 호텔 짐 직배송 패스)을 선점하세요.'
    },
    selfCheckoutLines: {
      JP: 'フライト便名と到着日を入力するだけ！スタッフとのやり取りなしで下記リンクから今すぐ専用枠を確定できます 👉 https://tr.ee/dSpLdDtiGW',
      EN: 'Just enter your flight number and arrival date—lock in your airport VIP pickup & luggage pass directly without waiting for a chat reply 👉 https://tr.ee/dSpLdDtiGW',
      CN: '只需选择您的抵达日期与航班时段，无需等待客服回复，点击下方链接即可自助锁定接机与行李直达名额 👉 https://tr.ee/dSpLdDtiGW',
      KR: '직원과의 긴 채팅 없이, 아래 셀프 체크아웃 링크에서 입국 항공편 일정과 픽업 슬롯을 직접 선택해 신청하세요 👉 https://tr.ee/dSpLdDtiGW'
    }
  }
];

export interface InboundSampleQuestion {
  id: string;
  passId: RevenuePassId;
  categoryLabel: string;
  buttonTitle: string;
  questionByLang: Record<TargetLang, string>;
}

export const INBOUND_SAMPLE_QUESTIONS: InboundSampleQuestion[] = [
  {
    id: 'sample_night_sos',
    passId: 'NIGHT_SOS',
    categoryLabel: '심야 콘서트 귀가 불안',
    buttonTitle: '① 콘서트 심야 귀가·숙소 걱정',
    questionByLang: {
      JP: 'KSPO DOMEのコンサートが夜22時半に終わるのですが、韓国語ができず深夜タクシーの乗車拒否や終電が心配です。会場近くで安全に帰れる方法はありますか？',
      EN: 'The KSPO DOME concert ends around 10:30 PM and I am worried about missing the last subway or getting rejected by late-night taxis. What is the safest way to get back to a hotel?',
      CN: 'KSPO DOME 演唱会晚上10点半才结束，不会韩语很担心深夜打不到车或者错过末班地铁，请问场馆附近有安全的住宿或回程方式吗？',
      KR: 'KSPO DOME 콘서트가 밤 10시 반 넘어서 끝나는데, 외국인이라 심야 택시 잡기도 무섭고 막차 끊길까 봐 걱정돼요. 안전하게 귀가하거나 묵을 방법이 있을까요?'
    }
  },
  {
    id: 'sample_zero_wait',
    passId: 'ZERO_WAIT',
    categoryLabel: '한국 번호 없는 핫플 웨이팅',
    buttonTitle: '② 한국 번호 없는 핫플 웨이팅',
    questionByLang: {
      JP: '聖水（ソンス）や漢南（ハンナム）の人気カフェやポップアップに行きたいのですが、韓国の電話番号（010）がなくてCATCHTABLEの現場待機ができません。荷物も多いのですがどうすればいいですか？',
      EN: 'I want to visit popular cafes and pop-up stores in Seongsu and Hannam, but kiosks require a Korean 010 phone number for waiting and I also have shopping bags and luggage.',
      CN: '想去圣水洞和汉南洞的网红咖啡厅与快闪店，但没有韩国010手机号无法在现场排号机登记，而且带着行李箱很不方便，该怎么办？',
      KR: '성수동이랑 한남동 핫플 쇼룸·브런치 가고 싶은데 한국 010 번호가 없어서 현장 웨이팅 기계 등록이 안 돼요. 쇼핑 짐도 많은데 어떻게 해야 하나요?'
    }
  },
  {
    id: 'sample_beauty_care',
    passId: 'BEAUTY_CARE',
    categoryLabel: '뷰티/웰니스 통역 걱정',
    buttonTitle: '③ 청담 뷰티·웰니스 통역 걱정',
    questionByLang: {
      JP: '清潭（チョンダム）でK-ビューティー・ウェルネス体験をしたいのですが、韓国語で細かい希望を伝えられるか不安です。外国人向けのぼったくりや帰りの移動も心配です。',
      EN: 'I want to book a K-Beauty and wellness session in Cheongdam, but I am anxious about explaining my exact preferences in Korean and getting back to my hotel comfortably afterward.',
      CN: '想去清潭洞体验K-Beauty健康美学管理，但不会韩语很怕沟通不清楚诉求，也担心价格不透明和做完之后的回酒店交通问题。',
      KR: '청담동 프라이빗 뷰티·웰니스 라운지에 가보고 싶은데 외국어 소통이 안 돼서 원하는 스타일을 정확히 전달할 수 있을지, 방문 후 숙소 복귀는 어떨지 걱정됩니다.'
    }
  },
  {
    id: 'sample_first_seoul',
    passId: 'FIRST_SEOUL',
    categoryLabel: '공항 짐 이동 부담',
    buttonTitle: '④ 공항 도착 직후 짐 이동·픽업',
    questionByLang: {
      JP: '仁川空港に午前中に到着してすぐ聖水やコンサート会場に向かいたいのですが、大きなスーツケース2個を持って移動するのが大変です。ホテルまで荷物を送るか専用車で移動できますか？',
      EN: 'I arrive at Incheon Airport in the morning and want to head straight to Seongsu before hotel check-in, but carrying two large suitcases on the train seems exhausting.',
      CN: '早班机抵达仁川机场后想直接去圣水洞逛街再去演唱会，但拖着两个大行李箱坐地铁太累了，请问有接机或行李直达酒店的方法吗？',
      KR: '오전 비행기로 인천공항에 도착해서 호텔 체크인 전에 바로 성수동과 공연장으로 가고 싶은데, 큰 캐리어 2개를 끌고 이동하기가 너무 막막해요.'
    }
  }
];

export interface SosMacroPattern {
  id: string;
  code: string;
  passId: RevenuePassId;
  category: 'CONCERT_NIGHT' | 'HOTPLACE_WAIT' | 'BEAUTY_INTERPRET' | 'AIRPORT_LUGGAGE';
  titleKo: string;
  keywords: string[];
  selfTipByLang: Record<TargetLang, string>;
}

// 50대 외국인 인바운드 고충 패턴 데이터베이스 (API 비용 $0 · 0.1초 즉시 매칭용)
export const SOS_50_MACRO_PATTERNS: SosMacroPattern[] = [
  // [A] CONCERT_NIGHT (P01 ~ P13: 13개 패턴 -> NIGHT_SOS)
  {
    id: 'P01',
    code: 'SOS-01',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: 'KSPO DOME 심야 종료 후 택시 승차거부 & 막차 불안',
    keywords: ['kspo', '올림픽공원', '콘서트', '막차', '택시', '심야', '22시', '10시', '終電', 'タクシー', 'concert', 'late'],
    selfTipByLang: {
      JP: 'ご安心ください！KSPO DOME終演直後はオリンピック公園駅（5号線・9号線急行）の4番出口ではなく、徒歩8分の「夢村土城（モンチョントソン）駅（8号線）」方面へ歩くと混雑を半分以上回避でき、蚕室（チャムシル）駅まで4分で移動できます。',
      EN: 'Great question! Right after a KSPO DOME show, skip the crowded Olympic Park Station Exit 4 and walk 8 minutes toward Mongchontoseong Station (Line 8)—you will avoid the bottleneck and reach Jamsil in 4 minutes.',
      CN: '完全理解您的担忧！KSPO DOME散场时奥运公园站4号口非常拥挤，建议步行8分钟前往8号线「梦村土城站」乘车，4分钟即可直达蚕室商圈，避开人潮。',
      KR: '걱정 마세요! KSPO DOME 공연 직후에는 혼잡한 올림픽공원역 4번 출구 대신 도보 8분 거리의 8호선 몽촌토성역 방면으로 이동하시면 인파를 피해 잠실역까지 4분 만에 빠져나갈 수 있습니다.'
    }
  },
  {
    id: 'P02',
    code: 'SOS-02',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '고척 스카이돔 콘서트 종료 후 1호선 구일역 인파 병목',
    keywords: ['고척', '고척돔', '구일역', 'gocheok', '高尺', '1호선', '돔'],
    selfTipByLang: {
      JP: '高尺（コチョク）スカイドーム終演後は九一（クイル）駅の入場規制が30分以上続きます。歩道橋を渡って大通り向かいの「東洋未来大学バス停」から新道林（シンドリム）駅行きのバスに乗ると10分で2号線に乗り換えられます。',
      EN: 'After a Gocheok Sky Dome concert, Guil Station has a 30+ minute entry queue. Cross the pedestrian bridge to Dongyang Mirae Univ. bus stop and hop on any bus toward Sindorim Station (Line 2) in just 10 minutes.',
      CN: '高尺巨蛋散场后九一站通常限流30分钟以上。建议走天桥到对面「东洋未来大学」公交站，搭乘前往新道林站（2号线）的巴士，10分钟即可丝滑换乘。',
      KR: '고척 스카이돔 종료 직후 구일역은 진입 대기만 30분 이상 걸립니다. 육교를 건너 동양미래대학 정류장에서 신도림역(2호선) 방향 버스를 타시면 10분 만에 쾌적하게 이동하실 수 있습니다.'
    }
  },
  {
    id: 'P03',
    code: 'SOS-03',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '인스파이어 아레나(영종도) 공연 후 서울 복귀 교통편 부재',
    keywords: ['인스파이어', '영종도', 'inspire', 'arena', '셔틀', '인천'],
    selfTipByLang: {
      JP: 'インスパイア・アリーナは仁川空港エリアにあるため、終演後は公式無料シャトルで「空港貨物庁舎駅」または「仁川空港第2ターミナル」へ移動し、空港鉄道（AREX）ソウル駅行きの最終列車（23:30頃）に乗るのが最も確実な自力ルートです。',
      EN: 'Since Inspire Arena is on Yeongjong Island, take the venue shuttle to Incheon Airport Terminal 2 and catch the AREX train to Seoul Station (runs until ~11:38 PM) rather than waiting in the 2-hour taxi line.',
      CN: 'Inspire Arena位于仁川永宗岛，散场后最稳妥的自助方式是搭乘场馆接驳车至仁川机场T2航站楼，换乘AREX机场快线回首尔站（末班车约23:38）。',
      KR: '인스파이어 아레나는 영종도에 위치해 택시 대기가 매우 깁니다. 현장 셔틀로 인천공항 제2터미널로 이동한 뒤 공항철도(AREX, 막차 약 23:38)를 이용하시면 서울역까지 막힘없이 복귀할 수 있습니다.'
    }
  },
  {
    id: 'P04',
    code: 'SOS-04',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '여성 1인 관람객 심야 귀가 치안 & 안전 동선 고민',
    keywords: ['혼자', '여자', '여성', '1인', '안전', '무서', '치안', '一人', '女性', 'solo', 'safe', 'alone'],
    selfTipByLang: {
      JP: 'お一人での深夜移動は心細いですよね。ソウルでは大通り沿いの24時間営業コンビニ（CU・GS25）前が防犯カメラと照明で最も明るく安全です。配車アプリ「k.ride（外国人カード対応）」を使う際もコンビニ前を指定すると安心です。',
      EN: 'Traveling solo at night can feel stressful! Always wait in front of a brightly lit 24-hour convenience store (CU or GS25) on the main avenue, and use the global "k.ride" app which accepts overseas credit cards with no cash needed.',
      CN: '一个人深夜散场确实容易紧张！建议始终在大马路旁灯火通明的24小时便利店（CU或GS25）门口等车，并使用支持海外信用卡的「k.ride」打车软件，行程轨迹可实时分享。',
      KR: '혼자 심야에 이동하실 때는 대로변의 밝은 24시간 편의점(CU·GS25) 앞을 픽업 포인트로 잡으시면 CCTV와 조명이 확보되어 안전합니다. 해외카드 결제가 되는 k.ride 앱을 활용하면 더욱 편리합니다.'
    }
  },
  {
    id: 'P05',
    code: 'SOS-05',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '앙코르 연장(23시 이후)으로 인한 지하철 막차 놓침 대비',
    keywords: ['앙코르', '연장', '23시', '11시', '자정', '밤늦게', 'アンコール', 'encore', 'midnight'],
    selfTipByLang: {
      JP: 'アンコールが長引いて23時半を過ぎた場合、地下鉄は平日24時・週末23時50分頃に終了します。その場合はソウル深夜バス（Nバス：N13、N30など）が0時から運行しており、交通カード（T-money）でそのまま乗車可能です。',
      EN: 'If the encore runs past 11:30 PM, remember that Seoul subways close earlier on weekends (~11:50 PM). Look for the "N-Bus" (Owl Night Bus routes like N13 or N30) at main bus stops—they run all night with your T-money card.',
      CN: '如果安可延长到23点半以后，请注意首尔周末地铁末班车较早（约23:50）。此时可在主干道公交站搭乘首尔夜间猫头鹰巴士（N开头巴士，如N13、N30），直接刷T-money卡即可乘车。',
      KR: '앙코르가 길어져 23시 30분이 넘어가면 주말 지하철 막차가 일찍 끊깁니다. 이때는 대로변 중앙차로 정류장에서 심야 올빼미 버스(N버스)를 타시면 티머니 카드로 주요 거점까지 이동할 수 있습니다.'
    }
  },
  {
    id: 'P06',
    code: 'SOS-06',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '공연장 코인로커(물품보관소) 조기 마감 시 응원봉·짐 보관',
    keywords: ['코인로커', '물품보관', '보관함', '사물함', 'ロッカー', 'locker', '응원봉'],
    selfTipByLang: {
      JP: '会場内のコインロッカーは開演4時間前に満杯になりますが、地下鉄駅の改札内にある「T-Luggage」または公式アプリの「또타라커（Tota Locker）」を使うと、周辺駅の空きロッカーを事前に確認・予約できます。',
      EN: 'Venue lockers fill up 4 hours before showtime! Instead, check the subway lockers one stop away (like Bangi Station or Hanyang Univ. Station) via the Seoul Metro "Tota Locker" app where 60% of lockers remain open.',
      CN: '场馆内的储物柜通常在开演前4小时就满了！建议在演前一站地铁站（如芳荑站、梦村土城站）站内使用「Tota Locker」智能储物柜，空位率高且取物不用排队。',
      KR: '공연장 내부 물품보관소는 공연 4시간 전에 마감되므로, 한 정거장 전 지하철역(방이역·몽촌토성역 등) 개찰구 인근의 또타라커(Tota Locker)를 이용하시면 대기 없이 보관하실 수 있습니다.'
    }
  },
  {
    id: 'P07',
    code: 'SOS-07',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '우천·폭설 시 콘서트 관람 후 택시 배차 불가 사태',
    keywords: ['비', '우천', '눈', '폭설', '날씨', '추위', '雨', '雪', 'rain', 'snow'],
    selfTipByLang: {
      JP: '雨や雪の日の終演後はアプリ配車の倍率が跳ね上がります。会場から地下鉄で2駅だけ移動した「総合運動場駅」や「石村（ソクチョン）駅」のカフェに入って15分待ってから配車を呼ぶと、乗車成功率が3倍高まります。',
      EN: 'On rainy or snowy concert nights, taxi apps surge and fail near the stadium. Ride the subway just 2 stops to Seokchon or Sports Complex Station first, then hail a ride from a warm cafe with 3x faster matching.',
      CN: '雨雪天散场在场馆门口几乎叫不到车。建议先搭地铁坐2站到「石村站」或「综合运动场站」，在温暖的便利店旁叫车，接单成功率会提升3倍以上。',
      KR: '비나 눈이 오는 날 공연장 바로 앞에서는 택시 배차가 거의 불가능합니다. 지하철로 딱 2정거장(석촌역·종합운동장역)만 이동한 뒤 호출하시면 배차 성공률이 3배 이상 높아집니다.'
    }
  },
  {
    id: 'P08',
    code: 'SOS-08',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '공연 종료 후 밤 11시에 식사 가능한 인근 심야 식당 찾기',
    keywords: ['야식', '심야식당', '저녁', '밥', '고기', '배고', '夜食', '深夜食堂', 'late dinner'],
    selfTipByLang: {
      JP: '終演後の23時以降にお食事なら、オリンピック公園からタクシー5分の「芳荑洞（パンイドン）食べ横丁」が24時間営業の焼肉・クッパ店が多く、コンサート帰りのファンにも一番人気の安全エリアです。',
      EN: 'Looking for a late-night meal after 11 PM? Head to the Bangi-dong Food Alley (5 mins from Olympic Park)—it is packed with 24-hour K-BBQ and warm soup spots where concert fans safely gather.',
      CN: '散场后23点想吃夜宵，推荐距离奥林匹克公园仅5分钟车程的「芳荑洞美食街」，这里有大量24小时营业的韩牛烤肉与汤饭店，安全且热闹。',
      KR: '공연 종료 후 밤 11시 이후 식사는 올림픽공원에서 5분 거리인 방이동 먹자골목이 24시간 감자탕·구이·국밥집이 밀집해 있어 가장 안전하고 든든합니다.'
    }
  },
  {
    id: 'P09',
    code: 'SOS-09',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '잠실 실내체육관·주경기장 공연 후 종합운동장역 혼잡 회피',
    keywords: ['잠실', '실내체육관', '주경기장', '종합운동장', 'jamsil', '蚕室'],
    selfTipByLang: {
      JP: '蚕室（チャムシル）室内体育館の終演後は2号線・総合運動場駅が大変混雑します。西門側から徒歩9分の9号線「三成中央（サムソンチュンアン）駅」へ歩くと、座って江南・汝矣島方面へ帰れます。',
      EN: 'After a Jamsil Indoor Stadium show, Sports Complex Station (Line 2) is packed. Walk 9 minutes west to Samseong Jungang Station (Line 9) for a calm, seated ride toward Gangnam or Yeouido.',
      CN: '蚕室室内体育馆散场后2号线综合运动场站人山人海。建议从西门步行9分钟前往9号线「三成中央站」，无需排队即可舒适乘车前往江南或汝矣岛。',
      KR: '잠실 실내체육관 공연 직후에는 2호선 종합운동장역 대신 서문 방향 도보 9분 거리의 9호선 삼성중앙역이나 신천 먹자골목 방면으로 이동하시면 훨씬 쾌적합니다.'
    }
  },
  {
    id: 'P10',
    code: 'SOS-10',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '현장 MD(굿즈) 오전 줄서기 후 공연 시작 전 체력 방전',
    keywords: ['굿즈', 'md', '줄서기', '체력', '대기', '휴식', 'グッズ', 'merch', 'line'],
    selfTipByLang: {
      JP: '午前中からMD（グッズ）列に並ぶと開演前に体力が尽きてしまいますよね。会場から地下鉄1駅の「遁村洞（トゥンチョンドン）駅」や「夢村土城駅」周辺の大型ベーカリーカフェなら、コンセント完備でゆっくり2〜3時間休めます。',
      EN: 'Lining up for MD merch in the morning drains your stamina before the show! Recharge for 2–3 hours at the spacious bakery cafes near Mongchontoseong Station where power outlets and seating are plentiful.',
      CN: '早上排MD周边很容易在开演前体力透支！建议排完周边后到梦村土城站附近的大型烘焙咖啡厅休息充电2~3小时，恢复体力再进场。',
      KR: '오전부터 MD 줄서기로 지치셨다면 공연장 내부보다 도보권인 몽촌토성역 앞 대형 베이커리 카페에서 휴대폰 충전과 휴식을 취하신 뒤 입장하시는 것이 좋습니다.'
    }
  },
  {
    id: 'P11',
    code: 'SOS-11',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '일산 킨텍스(KINTEX) 페스티벌·콘서트 후 서울 도심 복귀',
    keywords: ['킨텍스', '일산', 'kintex', 'gtx', '대화역'],
    selfTipByLang: {
      JP: 'KINTEX（一山）での公演後は、新しく開通した「GTX-A（キンテックス駅）」を利用するとソウル駅までわずか16分で到着します！3号線の対話（テファ）駅より圧倒的に速くて快適です。',
      EN: 'For KINTEX events in Ilsan, take the newly opened GTX-A high-speed train from KINTEX Station—it gets you straight to Seoul Station in just 16 minutes instead of the 1-hour Line 3 subway ride!',
      CN: '一山KINTEX演出结束后，强烈推荐搭乘新开通的「GTX-A高速铁路（KINTEX站）」，只需16分钟即可直达首尔站，比3号线地铁快3倍！',
      KR: '일산 킨텍스 공연 후에는 새로 개통된 GTX-A 킨텍스역을 이용하시면 서울역까지 단 16분 만에 주파할 수 있어 3호선 대화역보다 압도적으로 빠릅니다.'
    }
  },
  {
    id: 'P12',
    code: 'SOS-12',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '양일(토·일) 올콘 관람객을 위한 공연장 도보 5분 숙소 동선',
    keywords: ['양일', '올콘', '연박', '도보', '호텔', '숙소', '両日', '徒歩', 'walkable hotel'],
    selfTipByLang: {
      JP: '土日両日参戦（オールコン）なら、移動時間をゼロにする会場徒歩5〜10分圏（オリンピックパークテルや蚕室・芳荑エリア）のVerifiedホテル拠点が最強です。昼のグッズ購入後に一度部屋でシャワーと仮眠が取れます。',
      EN: 'Attending both Saturday and Sunday shows? Staying within a 5–10 minute walk of the venue lets you drop off your merch, shower, and nap right before soundcheck without any commute stress.',
      CN: '如果周末两场连看（全勤），强烈建议住在场馆步行5~10分钟圈内的认证酒店，买完周边还能回房间休息补妆，彻底告别深夜通勤疲惫。',
      KR: '토·일 양일 관람(올콘) 시에는 공연장 도보 5~10분권 Verified 숙소를 거점으로 잡으셔야 낮 시간 굿즈 수령 후 객실에서 휴식하고 최상의 컨디션으로 관람할 수 있습니다.'
    }
  },
  {
    id: 'P13',
    code: 'SOS-13',
    passId: 'NIGHT_SOS',
    category: 'CONCERT_NIGHT',
    titleKo: '보조배터리 방전 시 공연장 인근 긴급 대여 포인트',
    keywords: ['배터리', '충전', '보조배터리', '방전', 'バッテリー', '充電', 'battery', 'charge'],
    selfTipByLang: {
      JP: '撮影や連絡でスマホの充電が切れそうな時は、地下鉄駅構内やコンビニ（CU・GS25）にある「충전돼지（チュンジョンデジ）」のQRコードをスキャンすれば、海外クレカ決済ですぐモバイルバッテリーをレンタルできます。',
      EN: 'Phone dying before the encore? Scan the "Chungjeon Dwaeji" power bank kiosk inside any subway station or CU/GS25 convenience store—it accepts international cards and can be returned at any branch.',
      CN: '手机快没电时，在地铁站内或任何一家CU/GS25便利店扫描「充电猪（충전돼지）」共享充电宝机柜，支持海外卡支付，异地便利店均可归还。',
      KR: '공연 전후 보조배터리가 방전되었다면 지하철역이나 인근 CU·GS25 편의점의 충전돼지 기기에서 QR 스캔으로 즉시 대여 후 숙소 앞 편의점에 반납하실 수 있습니다.'
    }
  },

  // [B] HOTPLACE_WAIT (P14 ~ P26: 13개 패턴 -> ZERO_WAIT)
  {
    id: 'P14',
    code: 'SOS-14',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '한국 010 번호가 없어 캐치테이블(CatchTable) 현장 웨이팅 불가',
    keywords: ['010', '번호', '캐치테이블', 'catchtable', '웨이팅', '대기', '電話番号', 'waiting', 'number'],
    selfTipByLang: {
      JP: '韓国の010番号がない場合は、店頭タブレットの右下にある「Global / English・日本語」ボタンをタップすると、電話番号の代わりにメールアドレスで順番待ち登録ができる店舗が増えています！また「CatchTable Global」アプリなら事前予約も可能です。',
      EN: 'No Korean 010 number? Tap the "Global / English" button on the bottom-right of the store’s CatchTable tablet to register with your email instead, or book ahead via the "CatchTable Global" app!',
      CN: '没有韩国010手机号时，点击门店排号平板右下角的「Global / 中文」按钮，即可用电子邮箱代替手机号取号！也可以提前下载「CatchTable Global」国际版预约。',
      KR: '한국 010 번호가 없으실 때는 매장 태블릿 우측 하단의 Global(다국어) 버튼을 누르시면 이메일 주소로 웨이팅 알림을 받으실 수 있으며, 캐치테이블 글로벌 앱에서도 사전 확인이 가능합니다.'
    }
  },
  {
    id: 'P15',
    code: 'SOS-15',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '성수동 팝업스토어 사전예약 매진 시 현장 워크인 골든타임',
    keywords: ['성수', '팝업', '워크인', '매진', '성수동', 'ポップアップ', '聖水', 'popup', 'seongsu'],
    selfTipByLang: {
      JP: '聖水（ソンス）の人気ポップアップは事前予約が完売していても、平日はオープン30分前（10:30）、週末はオープン1時間前（10:00）に現地待機列へ並べば「第1陣ウォークイン枠」でほぼ確実に入場できます。',
      EN: 'Even if a Seongsu pop-up store is sold out online, arriving 30 minutes before opening on weekdays (10:30 AM) gets you into the first walk-in batch with minimal wait.',
      CN: '圣水洞热门快闪店即使线上预约售罄，工作日只需在开门前30分钟（10:30）到达现场排队，通常都能顺利进入第一批现场Walk-in名额。',
      KR: '성수동 인기 팝업스토어는 온라인 사전예약이 마감되었더라도 평일 오픈 30분 전(10:30)에 방문하시면 1차 현장 워크인 타임슬롯으로 빠르게 입장하실 수 있습니다.'
    }
  },
  {
    id: 'P16',
    code: 'SOS-16',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '성수·한남 쇼룸 투어 중 무거운 쇼핑백과 캐리어 보관 장소',
    keywords: ['쇼핑백', '성수 짐', '한남 짐', '보관', '캐리어 보관', '荷物預かり', 'shopping bag'],
    selfTipByLang: {
      JP: '聖水駅2番・3番出口の改札内ロッカーは午前中で埋まりますが、聖水駅から徒歩3分の「カフェ併設荷物預かりスポット（Lugstay提携店）」を使えばスーツケースも大きな買い物袋も1日預けられます。',
      EN: 'Seongsu Station lockers fill up by 11 AM, so use a "Lugstay" partner cafe 3 minutes from Exit 3 where you can drop off oversized suitcases and shopping bags for the afternoon.',
      CN: '圣水站地铁柜中午前就会满，建议使用圣水站3号口步行3分钟的「Lugstay」合作咖啡店寄存服务，大件行李箱与购物袋都能安心寄存。',
      KR: '성수역·한남역 지하철 보관함이 만석일 때는 인근 럭스테이(Lugstay) 제휴 카페에 캐리어와 쇼핑백을 맡기거나 전용 차량 짐 보관 서비스를 활용하시면 두 손 가볍게 다닐 수 있습니다.'
    }
  },
  {
    id: 'P17',
    code: 'SOS-17',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '성수·압구정 유명 베이커리(소금빵·베이글) 품절 전 구매 팁',
    keywords: ['베이글', '소금빵', '베이커리', '디저트', '품절', '빵', 'ベーグル', '塩パン', 'bakery', 'bagel'],
    selfTipByLang: {
      JP: '聖水・狎鴎亭の有名ベーグルや塩パン店は、イートイン列（2時間待ち）と「テイクアウト専用列（15分待ち）」が分かれています！テイクアウト列で受け取って近くのソウルの森公園で食べるのが現地通の裏技です。',
      EN: 'At famous Seongsu & Apgujeong bagel or salt-bread spots, the dine-in line takes 2 hours, but the "Takeout Only" queue moves in 15 minutes! Grab takeout and enjoy a picnic at nearby Seoul Forest.',
      CN: '圣水洞与狎鸥亭的网红贝果、海盐面包店，堂食排队往往要2小时，但「外带专用通道（Take-out）」只需15分钟！建议买外带去旁边的首尔林公园野餐拍照。',
      KR: '성수·압구정 유명 베이글·소금빵 매장은 매장 식사 줄(2시간)과 포장 전용 줄(15분)이 분리되어 있습니다. 테이크아웃 줄을 이용해 서울숲 피크닉으로 즐기시면 대기 시간을 아낄 수 있습니다.'
    }
  },
  {
    id: 'P18',
    code: 'SOS-18',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '외국인 1인 여행객을 위한 혼밥(1인 식사) 환영 한남·성수 맛집',
    keywords: ['혼밥', '1인 식사', '1인분', '혼자 밥', 'おひとり様', '一人飯', 'solo dining'],
    selfTipByLang: {
      JP: '韓国の焼肉店は2人前からの注文が多いですが、聖水・漢南の「1人しゃぶしゃぶ」「釜飯（ソッパプ）定食」「プレミアム韓牛ユッケビビンバ」専門店ならお一人様でも気兼ねなく歓迎されます！',
      EN: 'While traditional K-BBQ often requires a 2-portion minimum, Seongsu & Hannam’s artisanal "Sotbap" (pot rice) and Hanwoo Yukhoe Bibimbap dining spots have counter seating designed for solo travelers!',
      CN: '韩国传统烤肉店大多要求2人份起订，但在圣水洞与汉南洞的「精致釜饭（Sotbap）」、「韩牛生拌牛肉拌饭」及个人小火锅店，都非常欢迎一人食旅客！',
      KR: '성수·한남에서 1인 식사(혼밥)를 하실 때는 바 테이블이 갖춰진 프리미엄 솥밥 다이닝이나 한우 육회비빔밥·1인 샤브샤브 전문점을 선택하시면 웨이팅도 빠르고 대접받으며 식사할 수 있습니다.'
    }
  },
  {
    id: 'P19',
    code: 'SOS-19',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '디자이너 브랜드 플래그십 스토어 즉시 택스리펀드(Tax Refund) 방법',
    keywords: ['택스리펀', '면세', '여권', '환급', 'tax refund', 'タックスリファンド', '免税'],
    selfTipByLang: {
      JP: '聖水・漢南の主要デザイナーズフラッグシップストアでは、お会計時にパスポート原本を提示すると、その場で税金分（約7〜8%）が差し引かれる「即時還付（Immediate Tax Refund）」が1件15,000ウォン以上から適用されます！',
      EN: 'Bring your physical passport when shopping in Seongsu & Hannam! Most flagship stores offer "Immediate Tax Refund" right at the register for purchases over 15,000 KRW, deducting ~7% instantly.',
      CN: '在圣水洞与汉南洞的设计师品牌旗舰店购物满15,000韩元时，结账出示护照原件即可享受「现场即时退税（Immediate Tax Refund）」，直接立减约7%~8%！',
      KR: '성수·한남 주요 디자이너 플래그십 스토어에서는 실물 여권을 제시하시면 15,000원 이상 결제 시 현장에서 세금이 즉시 차감되는 즉시환급(Immediate Tax Refund)을 받으실 수 있습니다.'
    }
  },
  {
    id: 'P20',
    code: 'SOS-20',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '비 오는 날 야외 줄서기 없이 즐기는 성수·한남 실내 복합 공간',
    keywords: ['실내', '비오는날 성수', '복합문화', '편집숍', '室内', 'indoor'],
    selfTipByLang: {
      JP: '雨の日に外で並ばずに楽しむなら、聖水の「LCDC SEOUL」や漢南の「リウム美術館＋サウンド漢南」ルートがおすすめです。1つの建物内でカフェ・セレクトショップ・展示まで完結します。',
      EN: 'On a rainy day, head to multi-story cultural complexes like LCDC SEOUL in Seongsu or Leeum Museum + Sound Hannam—you can enjoy specialty coffee, curated shops, and exhibitions all under one roof.',
      CN: '下雨天不想在户外排队，推荐圣水洞的「LCDC SEOUL」或汉南洞的「三星美术馆Leeum + Sound Hannam」，在同一栋空间内即可逛完买手店、展览与咖啡厅。',
      KR: '비 오는 날 야외 웨이팅이 부담스러우실 때는 성수 LCDC SEOUL이나 한남동 복합 쇼룸 라운지를 선택하시면 한 건물 안에서 편집숍·전시·브런치를 쾌적하게 즐기실 수 있습니다.'
    }
  },
  {
    id: 'P21',
    code: 'SOS-21',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '용산 하이브(HYBE) 인근 아티스트 성지순례 카페 & 맛집 동선',
    keywords: ['용산', '하이브', 'hybe', '성지순례', '생일카페', '생카', '龍山', '聖地巡礼'],
    selfTipByLang: {
      JP: '龍山（ヨンサン）HYBE社屋周辺の聖地巡礼カフェやセンイルカフェを回る際は、新龍山駅1番出口から裏路地（アモーレパシフィック裏手）の「龍理団キル（ヨンリダンギル）」へ抜けると、徒歩5分圏内に人気店が密集しています。',
      EN: 'When visiting HYBE in Yongsan for artist pilgrimage cafes, take Sinyongsan Station Exit 1 and walk through the "Yongnidan-gil" backstreets behind Amorepacific—all top spots are within a 5-minute walk.',
      CN: '去龙山HYBE大楼周边打卡艺人同款餐厅与应援咖啡厅时，从新龙山站1号口出站，穿行至爱茉莉太平洋大厦后方的「龙理团路」，步行5分钟内即可串联所有热门点。',
      KR: '용산 하이브 인근 아티스트 성지순례 카페와 맛집을 돌 때는 신용산역 1번 출구에서 용리단길 골목으로 진입하시면 도보 5분 내에 핵심 스팟들을 한 번에 연결할 수 있습니다.'
    }
  },
  {
    id: 'P22',
    code: 'SOS-22',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '해외 신용카드 결제 오류 대비 & 와우패스/티머니 활용법',
    keywords: ['카드', '결제', '현금', '환전', '와우패스', '티머니', 'wowpass', 'カード', '両替'],
    selfTipByLang: {
      JP: '韓国のカフェやキオスクは99%カード決済ですが、まれに海外発行カードが弾かれる端末があります。主要駅にある「WOWPASS」機械でカードを1枚作っておけば、プリペイド決済・T-money交通カード・円両替が1枚で完結します。',
      EN: 'While 99% of Seoul spots are cashless, some self-order kiosks reject foreign chip cards. Grabbing a "WOWPASS" card at any major station gives you a local Korean payment chip + T-money transit card in one.',
      CN: '首尔99%的门店支持刷卡，但部分自助点餐机可能刷不了海外芯片卡。建议在主要地铁站自助机办一张「WOWPASS」，兼具韩国本地刷卡、T-money交通卡与换汇功能。',
      KR: '간혹 무인 키오스크에서 해외 발행 카드가 인식되지 않을 때는 와우패스(WOWPASS)나 애플페이·컨택리스 결제를 요청하시면 막힘없이 결제하실 수 있습니다.'
    }
  },
  {
    id: 'P23',
    code: 'SOS-23',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '한남동 바이닐 바(LP 바) & 루프탑 라운지 저녁 노웨이팅 시간대',
    keywords: ['바이닐', 'lp바', '루프탑', '칵테일', '바', '한남동 밤', 'バー', 'vinyl', 'rooftop'],
    selfTipByLang: {
      JP: '漢南洞（ハンナムドン）の人気ヴァイナルバーやルーフトップラウンジは20時以降に満席になります。夕暮れ時の17:30〜18:15に入店すれば、待ち時間ゼロで窓側の特等席からソウルの夜景を楽しめます。',
      EN: 'Hannam-dong’s iconic vinyl bars and rooftop lounges fill up by 8 PM. Arrive during the golden hour between 5:30 PM and 6:15 PM to walk right in and snag the best sunset-to-night-view seats.',
      CN: '汉南洞的人气黑胶音乐吧与露台酒廊通常在20点后满座。建议在傍晚17:30~18:15之间入场，零等待即可坐到景观最佳的靠窗座位。',
      KR: '한남동 인기 바이닐 바와 루프탑 라운지는 저녁 8시 이후 웨이팅이 길어지므로, 일몰 직전인 17:30~18:15 사이에 입장하시면 대기 없이 메인 좌석을 선점하실 수 있습니다.'
    }
  },
  {
    id: 'P24',
    code: 'SOS-24',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '비건·할랄·알레르기 맞춤 주문이 필요한 외국인 다이닝 소통',
    keywords: ['비건', '할랄', '알레르기', '채식', '돼지고기', '맵지않게', 'vegan', 'halal', 'allergy', '辛い'],
    selfTipByLang: {
      JP: '辛いものが苦手な方やアレルギーがある場合は、注文時に「안 맵게 해주세요（辛くしないでください）」「땅콩/새우 빼주세요（ピーナッツ/エビを抜いてください）」と書いたメモ画面を見せると確実に対応してもらえます。',
      EN: 'For dietary needs or spice control, show the staff a Korean note reading "안 맵게 해주세요 (No spice please)" or "고기 육수 빼주세요 (No meat broth please)"—Hannam and Seongsu bistros are very accommodating!',
      CN: '如果不吃辣或有饮食禁忌，点餐时出示韩语提示「안 맵게 해주세요（请做成不辣）」或「돼지고기 빼주세요（请不要放猪肉）」，圣水与汉南的餐厅都会贴心配合。',
      KR: '매운 음식 조절이나 알레르기·비건 요청이 필요하실 때는 주문 전 한국어 요청 카드(안 맵게 해주세요 / 특정 식재료 제외)를 제시하시면 정확하게 조리해 드립니다.'
    }
  },
  {
    id: 'P25',
    code: 'SOS-25',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '더현대 서울(여의도) 팝업스토어 & 식당가 웨이팅 단축 공식',
    keywords: ['더현대', '여의도', '백화점', 'the hyundai', '現代百貨店'],
    selfTipByLang: {
      JP: 'ザ・現代ソウル（汝矣島）は10:30の開店と同時に地下2階（B2）のポップアップ待機タブレットへ直行し、先に番号を発券してから6階のレストラン街もアプリ登録しておくと、待ち時間を3時間以上短縮できます。',
      EN: 'At The Hyundai Seoul, enter directly via the underground Yeouido Station walkway at 10:30 AM sharp—register at the B2 pop-up kiosk first, then immediately join the 6F dining waitlist on your phone.',
      CN: '逛汝矣岛现代百货（The Hyundai Seoul）时，建议10:30准时从地铁地下连廊直达B2层先取快闪店号，同时在手机登记6楼餐厅排号，可节省3小时以上排队时间。',
      KR: '더현대 서울 방문 시에는 10시 30분 오픈과 동시에 여의도역 지하 무빙워크로 B2층에 직행해 팝업 웨이팅을 먼저 걸고 6층 식당가를 연동 등록하시면 동선이 3시간 단축됩니다.'
    }
  },
  {
    id: 'P26',
    code: 'SOS-26',
    passId: 'ZERO_WAIT',
    category: 'HOTPLACE_WAIT',
    titleKo: '성수동 감성 사진관·네컷사진 피크타임 대기 회피 & 보정 팁',
    keywords: ['사진관', '인생네컷', '포토부스', '촬영', 'プリクラ', '写真館', 'photo booth'],
    selfTipByLang: {
      JP: '聖水（ソンス）のコンセプトフォトブースは14時〜17時が最も混み合います。午前11時台または19時以降に行くと待ち時間なしでヘアアイロン備え付けのメイクルームまでゆったり使えます。',
      EN: 'Seongsu’s themed photo studios peak between 2 PM and 5 PM. Visit around 11 AM or after 7 PM to use the complimentary hair styling tools and private booths with zero wait.',
      CN: '圣水洞的主题人生四格照相馆在下午14~17点最拥挤。建议上午11点或晚上19点后前往，无需排队即可免费使用店内的卷发棒与补妆间。',
      KR: '성수동 컨셉 포토부스와 사진관은 오후 2시~5시가 가장 혼잡하므로 오전 11시경이나 저녁 7시 이후에 방문하시면 파우더룸 고데기까지 여유롭게 이용하실 수 있습니다.'
    }
  },

  // [C] BEAUTY_INTERPRET (P27 ~ P38: 12개 패턴 -> BEAUTY_CARE)
  {
    id: 'P27',
    code: 'SOS-27',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '청담 웰니스·뷰티 방문 시 전문 용어 소통 오류 및 통역 불안',
    keywords: ['통역', '청담', '뷰티', '웰니스', '상담', '말이 안통', '通訳', '清潭', 'beauty', 'interpreter'],
    selfTipByLang: {
      JP: '言葉の壁で細かいニュアンスが伝わらないのは一番不安ですよね。訪問前に「希望するケア部位・避けたい成分・予算上限・滞在可能時間」を箇条書きにした事前問診メモを用意しておくと、カウンセリングの正確さが劇的に上がります。',
      EN: 'Worried about nuances getting lost in translation? Preparing a structured 4-point intake note (Target area, Skin sensitivity, Budget cap, and Time limit) before your appointment prevents any misunderstanding.',
      CN: '完全理解您担心语言不通导致效果不符！建议在到店前准备好包含「期望改善重点、敏感成分、预算上限、可用时长」的四项事前问诊表，沟通准确率可大幅提升。',
      KR: '청담 웰니스·뷰티 라운지 방문 전 희망 부위, 민감도, 예산 상한, 가용 시간을 정리한 사전 문진 시트를 준비해 가시면 상담 오차 없이 정확한 맞춤형 케어를 받으실 수 있습니다.'
    }
  },
  {
    id: 'P28',
    code: 'SOS-28',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '외국인 대상 바가지 요금 걱정 없는 투명한 정찰제 확인법',
    keywords: ['가격', '정찰제', '바가지', '비용', '추가금', '料金', '定額', 'price', 'overcharge'],
    selfTipByLang: {
      JP: '外国人価格の上乗せを防ぐには、予約確定の段階で「付加価値税（VAT 10%）込みの総額表記か」「追加オプションの強要がない定額制（Fixed-Rate）か」を明文化されたシートで確認しておくのが鉄則です。',
      EN: 'To avoid surprise tourist markups, always verify before arrival that the quote is a transparent Fixed-Rate inclusive of the 10% VAT with zero pressured add-ons.',
      CN: '为避免外国人溢价或现场隐形消费，预约时务必确认是否为「含10%增值税的透明一口价（Fixed-Rate）」且无强制推销项目。',
      KR: '외국인 대상 추가 요금 걱정 없이 이용하시려면 방문 전 부가세(VAT 10%) 포함 여부와 정찰제(Fixed-Rate) 기준표가 사전 확정된 제휴 라운지를 선택하시는 것이 가장 확실합니다.'
    }
  },
  {
    id: 'P29',
    code: 'SOS-29',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '청담 K-POP 아이돌 헤어·메이크업 살롱 스타일링 사진 전달 팁',
    keywords: ['헤어', '메이크업', '살롱', '아이돌 메이크업', '샵', '청담 샵', 'ヘアメイク', 'makeup', 'hair'],
    selfTipByLang: {
      JP: '清潭（チョンダム）のK-POPアイドル担当サロンでは、なりたいアイドル写真の「正面・横顔・リップの色味」の3枚を保存して見せ、さらに「普段自分のメイクで一番気に入っている写真」を1枚見せると似合わせ度が100%になります！',
      EN: 'When visiting a Cheongdam idol hair & makeup salon, bring 3 reference photos (front, side profile, and lip tone) plus 1 photo of yourself on your best makeup day so the artist can tailor the look to your features!',
      CN: '在清潭洞爱豆同款妆造室做造型时，建议准备3张参考图（正面、侧面轮廓、唇色特写）以及1张自己平时最满意的生活照，化妆师就能为您量身定制最适合的爱豆妆容！',
      KR: '청담 아이돌 헤어·메이크업 샵 방문 시에는 원하는 레퍼런스 사진 3장(정면·측면·색조)과 평소 본인이 가장 마음에 들었던 셀카 1장을 함께 보여주시면 맞춤 완성도가 극대화됩니다.'
    }
  },
  {
    id: 'P30',
    code: 'SOS-30',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '퍼스널컬러 진단 시 일본어/영어/중국어 톤 명칭 매칭 팁',
    keywords: ['퍼스널컬러', '웜톤', '쿨톤', '진단', 'パーソナルカラー', 'personal color'],
    selfTipByLang: {
      JP: '韓国のパーソナルカラー診断は「春ライト・夏ミュート・秋ディープ・冬ブライト」のように12〜16分類と非常に細かいです。普段使っているコスメポーチをそのまま持参すると、手持ちコスメの仕分けまでしてもらえます！',
      EN: 'Korean personal color analysis uses a detailed 16-season system (like Summer Mute or Spring Light). Bring your everyday makeup pouch—the consultant will test and sort every product you already own!',
      CN: '韩国的个人色彩测试分为超细致的12~16季型（如夏柔色、春浅色）。强烈建议随身带上您平时常用的化妆包，色彩师会现场帮您逐一鉴别手头的化妆品！',
      KR: '퍼스널컬러 진단 시 평소 쓰시는 파우치 속 립·섀도우 제품들을 그대로 지참하시면, 16타입 정밀 진단과 함께 소장 화장품 매칭 점검까지 한 번에 받으실 수 있습니다.'
    }
  },
  {
    id: 'P31',
    code: 'SOS-31',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '뷰티·웰니스 케어 직후 대중교통 노출 없이 프라이빗 숙소 복귀',
    keywords: ['복귀', '붓기', '마스크', '프라이빗 복귀', '관리 후', '다운타임', '帰りの移動', 'aftercare'],
    selfTipByLang: {
      JP: 'ウェルネス・ビューティーケア直後は肌が敏感になっており、紫外線や地下鉄の人混みを避けるのがベストです。深めのバケットハットとUVマスクを用意し、ドア・ツー・ドアの専用車でホテルへ直帰する動線をおすすめします。',
      EN: 'Right after a wellness or beauty session, your skin needs rest away from UV rays and crowded subways. Bring a deep bucket hat and take a direct door-to-door private transfer back to your hotel.',
      CN: '做完健康美学护理后肌肤较为娇嫩，最忌讳暴晒与拥挤地铁。建议准备一顶深檐渔夫帽，并通过点对点专车直接返回酒店休息。',
      KR: '웰니스·뷰티 케어 직후에는 자외선과 대중교통 인파를 피하시는 것이 좋습니다. 챙이 깊은 모자를 준비하시고 도어 투 도어 전용 차량으로 숙소까지 바로 복귀하시는 동선을 추천합니다.'
    }
  },
  {
    id: 'P32',
    code: 'SOS-32',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '프리미엄 헤드스파(두피 웰니스) 예약 및 전후 스타일링 동선',
    keywords: ['헤드스파', '두피', '스파', '마사지', 'ヘッドスパ', 'head spa', 'scalp'],
    selfTipByLang: {
      JP: '清潭・江南のプレミアムヘッドスパは施術後にブロー仕上げまで含まれていますが、その後に写真撮影やディナー予定がある場合は予約時に「簡単なカールスタイリング希望」と伝えておくとそのままお出かけできます。',
      EN: 'Cheongdam’s luxury head spas include a blow-dry finish, and if you mention your evening dinner or photo plans in advance, they will add light waves so you are camera-ready right after!',
      CN: '清潭洞的高端头皮SPA包含吹风造型服务，如果护理后有拍照或晚餐安排，提前备注「希望简单卷发打理」即可美美出街。',
      KR: '청담 프리미엄 헤드스파는 케어 후 드라이 마무리가 포함되어 있으며, 다음 일정이 화보 촬영이나 다이닝이라면 사전에 가벼운 스타일링 요청을 메모해 두시면 더욱 편리합니다.'
    }
  },
  {
    id: 'P33',
    code: 'SOS-33',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '민감성 피부·특정 성분 제외 요청을 위한 사전 체크리스트',
    keywords: ['민감성', '성분', '트러블', '알러지', '敏感肌', 'sensitive skin'],
    selfTipByLang: {
      JP: '敏感肌の方は、普段合わない成分（アルコール、高濃度ビタミンC、特定のピーリング成分など）を英語名または韓国語メモで事前に渡しておくと、刺激ゼロの鎮静・保湿中心プログラムに組み替えてもらえます。',
      EN: 'If you have sensitive skin, list any ingredients you avoid (like high-acid peels or fragrance) on a pre-visit sheet so the specialist can customize a soothing barrier-care program.',
      CN: '敏感肌旅客只需提前在问诊表上注明需要避开的成分（如高浓度果酸、酒精等），护理师就会为您定制温和舒缓的专属方案。',
      KR: '민감성 피부이신 경우 피하고 싶은 성분이나 평소 자극을 느꼈던 케어 유형을 사전 문진표에 체크해 전달하면 저자극 진정 중심 프로그램으로 안전하게 조정됩니다.'
    }
  },
  {
    id: 'P34',
    code: 'SOS-34',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '동반인(친구·어머니)과 함께 방문 시 대기 라운지 및 동시 진행 여부',
    keywords: ['동반', '엄마', '어머니', '친구랑', '2인', '같이', '母娘', '友達と', '2 people', 'together'],
    selfTipByLang: {
      JP: 'お母様やご友人と2名同時進行をご希望の場合は、2ベッド完備のプライベートルーム枠を事前指定するのがポイントです。片方が待機する場合も清潭のラウンジならお茶を楽しみながら同じ空間で過ごせます。',
      EN: 'Booking for two (like a mother-daughter trip or with a friend)? Request a dual-bed private suite in advance so you can enjoy your wellness session side-by-side at the exact same time.',
      CN: '与妈妈或闺蜜两人同行时，建议提前锁定双人私密包间名额，即可在同一时段并排享受护理，无需一人漫长等待。',
      KR: '어머니나 친구와 2인 동시 방문 시에는 2베드 프라이빗 룸 슬롯을 사전 지정하시면 대기 시간 없이 같은 공간에서 동시에 편안하게 케어받으실 수 있습니다.'
    }
  },
  {
    id: 'P35',
    code: 'SOS-35',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '짧은 2박 3일 일정 내 청담 웰니스 + 성수 쇼핑 3시간 압축 코스',
    keywords: ['2박3일', '짧은 일정', '반나절', '스케줄 조율', '弾丸', 'short trip'],
    selfTipByLang: {
      JP: '2泊3日の弾丸旅行なら、午前10時に清潭（チョンダム）でウェルネス体験を終え、永東（ヨンドン）大橋を渡ってタクシー10分の聖水（ソンス）へ移動する「清潭→聖水ゴールデンルート」が移動ロスゼロで最も効率的です！',
      EN: 'On a tight 3-day trip? Pair a 10 AM Cheongdam wellness session with a 10-minute ride across Yeongdong Bridge straight into Seongsu—it is the most time-efficient golden route in Seoul.',
      CN: '3天2晚紧凑行程最推荐「上午10点清潭洞美学护理 → 跨过永东大桥10分钟车程直达圣水洞」的黄金动线，零绕路串联两大核心区！',
      KR: '짧은 일정에는 오전 10시 청담 웰니스 방문 후 영동대교만 건너면 10분 만에 도착하는 성수 플래그십 스토어 코스로 묶으시면 이동 시간 낭비가 전혀 없습니다.'
    }
  },
  {
    id: 'P36',
    code: 'SOS-36',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '히잡 착용·여성 전용 프라이빗 룸이 필요한 글로벌 고객 케어',
    keywords: ['프라이빗 룸', '여성 전용', '히잡', '독실', '1인실', '個室', 'private room', 'hijab'],
    selfTipByLang: {
      JP: '完全個室（1人用プライベートルーム）および女性専任スタッフ対応をご希望の場合は、事前問診シートの「Private Room Only」項目にチェックを入れておけば、他のお客様と顔を合わせない動線で案内されます。',
      EN: 'Need a 100% enclosed single private room and female-only staff (including for hijab-wearing guests)? Simply check the "Private Suite & Female Specialist" option on your pre-visit sheet.',
      CN: '如需完全独立的单人私密包间及全女性护理师服务，只需在事前预约表中勾选「Private Suite」选项，全程零打扰。',
      KR: '완전 독립된 1인 프라이빗 룸과 여성 전담 인력 배정이 필요하신 경우 사전 문진 시트에 체크해 두시면 입실부터 퇴실까지 완벽히 분리된 동선으로 안내됩니다.'
    }
  },
  {
    id: 'P37',
    code: 'SOS-37',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '올리브영·성수 뷰티 플래그십 스토어 맞춤형 스킨케어 쇼핑 리스트',
    keywords: ['올리브영', '화장품 쇼핑', '스킨케어', '플래그십', 'オリーブヤング', 'olive young', 'skincare'],
    selfTipByLang: {
      JP: '聖水（ソンス）の「オリーブヤングN聖水」など大型フラッグシップ店では、1階で迷うより先に2〜3階の肌診断コーナーとランキング棚をチェックし、パスポート提示で即時免税を受けるのが賢い買い方です。',
      EN: 'At mega flagship stores like Olive Young N Seongsu, head straight to the 2nd floor skin-type curation zones first and use your passport at checkout for instant tax-free pricing.',
      CN: '逛圣水洞Olive Young N等大型美妆旗舰店时，建议直接上2楼按肤质分区与实时榜单选购，结账出示护照即可直接减免税费。',
      KR: '성수 대형 뷰티 플래그십 스토어 방문 시에는 사전 문진에서 확인한 본인 피부 타입 키워드(진정·장벽·수분)에 맞춰 큐레이션 존을 먼저 들르시면 실패 없는 쇼핑이 가능합니다.'
    }
  },
  {
    id: 'P38',
    code: 'SOS-38',
    passId: 'BEAUTY_CARE',
    category: 'BEAUTY_INTERPRET',
    titleKo: '출국 당일 오전 청담 웰니스 케어 후 공항 직행 스케줄링',
    keywords: ['출국 당일', '마지막날', '귀국 전', '帰国日', 'last day'],
    selfTipByLang: {
      JP: '帰国日の午前中に清潭でリフレッシュする場合は、フライト出発の4時間前までにケアを終えるスケジュールを組み、スーツケースは専用車に積んでそのまま空港へ直行すると時間をフル活用できます。',
      EN: 'Scheduling a final-day Cheongdam wellness session? Book a slot that finishes 4 hours before your flight and keep your luggage in your private pickup vehicle for a direct ride to the airport.',
      CN: '返程当天上午安排清潭洞护理时，建议选择在航班起飞前4小时结束的时段，行李直接放在接送专车上，做完护理即可直奔机场。',
      KR: '출국 당일 오전에 청담 웰니스 라운지를 방문하실 때는 비행기 출발 4시간 전 종료 슬롯으로 잡으시고 캐리어를 픽업 차량에 실어 바로 공항으로 이동하시면 마지막 날까지 여유롭습니다.'
    }
  },

  // [D] AIRPORT_LUGGAGE (P39 ~ P50: 12개 패턴 -> FIRST_SEOUL)
  {
    id: 'P39',
    code: 'SOS-39',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '오전 비행기 인천공항 도착 후 호텔 체크인(15시) 전 캐리어 이동 부담',
    keywords: ['공항', '인천공항', '오전 도착', '캐리어', '체크인 전', '짐 배송', '仁川空港', 'スーツケース', 'airport', 'luggage', 'suitcase'],
    selfTipByLang: {
      JP: '午前便で仁川空港に到着した場合、重いスーツケースを持って地下鉄に乗る必要はありません！空港からホテルへ荷物を直送するか、到着ゲート前でお出迎えする専用リムジンに荷物を預ければ、到着直後から手ぶらで聖水や会場へ直行できます。',
      EN: 'Arriving on a morning flight? Don’t drag heavy suitcases onto the subway before 3 PM hotel check-in—use direct airport-to-hotel luggage delivery or a VIP pickup van so you can head straight to Seongsu hands-free.',
      CN: '早班机抵达仁川机场后，完全不必拖着大行李箱去挤地铁！通过机场行李直达酒店服务或专车接机寄存，落地即可空手直奔圣水洞或演唱会现场。',
      KR: '오전 항공편으로 인천공항 도착 후 15시 체크인 전까지 무거운 캐리어를 끌고 다닐 필요 없이, 호텔 짐 직배송 및 공항 VIP 리무진 픽업을 활용하시면 도착 즉시 두 손 가볍게 첫 일정을 시작하실 수 있습니다.'
    }
  },
  {
    id: 'P40',
    code: 'SOS-40',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '심야 항공편(22시 이후) 인천공항 입국 시 서울 호텔 안전 이동',
    keywords: ['심야 도착', '밤 비행기', '연착', '입국 지연', '深夜便', 'late flight'],
    selfTipByLang: {
      JP: '22時以降の深夜便で仁川空港に到着すると、入国審査後に空港鉄道や一般リムジンバスが終了していることがあります。フライト便名連動の事前予約リムジンなら、万が一飛行機が遅延しても追加待機料なしでゲート前でお迎えします。',
      EN: 'Landing at Incheon after 10 PM? Immigration lines can make you miss the last AREX train. A flight-synced pre-booked VIP limousine tracks your flight number and waits for you even if your plane is delayed.',
      CN: '搭乘22点以后的深夜航班抵达仁川机场，通关后往往已错过末班机场快线。提前锁定与航班号联动的VIP接机专车，即使航班延误司机会免费等候并安全送达酒店。',
      KR: '밤 10시 이후 심야 항공편 입국 시에는 수하물 수령 후 공항철도 막차가 끊길 수 있습니다. 항공편 번호가 연동되는 사전 배차 VIP 리무진을 이용하시면 연착 시에도 대기 걱정 없이 호텔까지 안심 이동합니다.'
    }
  },
  {
    id: 'P41',
    code: 'SOS-41',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '출국일 오전 11시 호텔 체크아웃 후 밤 비행기까지 짐 보관 & 공항 이동',
    keywords: ['체크아웃 후', '밤 비행기 출국', '공항 배송', '서울역 도심공항', 'チェックアウト後', 'after checkout'],
    selfTipByLang: {
      JP: '最終日の11時チェックアウト後、夜便まで時間がある場合は「ソウル駅都心空港ターミナル」で事前搭乗手続きをするか、ホテルから空港へ荷物を直送して最後まで手ぶらでショッピングを楽しむのがベストです。',
      EN: 'Checking out at 11 AM with a late-night flight home? Either use the Seoul Station City Airport Terminal or send your suitcases straight from your hotel to the airport so your final afternoon is 100% hands-free.',
      CN: '返程日11点退房后如果是晚班机，可将行李直接从酒店寄送至机场或预约专车送机，最后半天依然可以空手轻松逛街购物。',
      KR: '출국일 오전 11시 호텔 체크아웃 후 밤 비행기까지 시간이 남으실 때는 호텔→공항 짐 직배송 또는 전용 리무진 레이트 픽업을 이용해 마지막 순간까지 두 손 가볍게 여행하실 수 있습니다.'
    }
  },
  {
    id: 'P42',
    code: 'SOS-42',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '3~4인 친구 그룹 및 대형 캐리어 4개 이상 탑승 가능한 전용 밴 배차',
    keywords: ['3인', '4인', '대형 캐리어', '점보택시', '밴', '스타리아', '카니발', '大型スーツケース', '4 people', 'large luggage'],
    selfTipByLang: {
      JP: '3〜4名様で28インチの大型スーツケースが4個以上ある場合、一般の中型タクシーには乗り切れません。最初から荷物スペースが広い専用VIPバン（Staria / Carnivalリムジン）を事前確保しておくと1台で快適に移動できます。',
      EN: 'Standard Seoul taxis cannot fit 3–4 passengers with four 28-inch suitcases! Pre-securing a spacious VIP limousine van (Staria/Carnival) lets your whole group and all luggage travel together comfortably.',
      CN: '3~4人同行且带有4个以上28寸大行李箱时，普通出租车后备箱无法装下。提前锁定宽敞的VIP礼宾商务车（Staria/Carnival），全员与大件行李可一车舒适直达。',
      KR: '3~4인 일행이 대형 캐리어 4개 이상을 소지하신 경우 일반 중형 택시에는 적재가 불가능합니다. 처음부터 적재 공간이 넉넉한 전용 VIP 리무진 밴을 사전 확보하시면 한 대로 편안하게 이동합니다.'
    }
  },
  {
    id: 'P43',
    code: 'SOS-43',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '김포공항(GMP) 입국 후 성수·강남·올림픽공원 최단 루트',
    keywords: ['김포공항', '김포', 'gmp', '金浦空港', 'gimpo'],
    selfTipByLang: {
      JP: '金浦（キンポ）空港から江南・蚕室・オリンピック公園方面へは、地下鉄9号線の「急行（Express）」に乗ると約38分で直통移動できます！ただしスーツケースが大きい場合は通勤ラッシュ時間帯を避けて専用車を使うのが快適です。',
      EN: 'From Gimpo Airport (GMP), Subway Line 9 Express goes straight to Gangnam and Olympic Park in ~38 minutes! If you have heavy bags during rush hour, a direct VIP pickup saves you the crowded transfer.',
      CN: '从金浦机场（GMP）前往江南、蚕室与奥林匹克公园，搭乘地铁9号线「急行（Express）」列车约38分钟直达；若携带大件行李，预约专车接机可免去早晚高峰拥挤。',
      KR: '김포공항 입국 후 강남·잠실·올림픽공원 방면은 9호선 급행열차가 빠르지만, 캐리어가 크거나 출퇴근 시간대라면 항공편 연동 VIP 픽업 차량으로 환승 없이 바로 이동하시는 것이 훨씬 쾌적합니다.'
    }
  },
  {
    id: 'P44',
    code: 'SOS-44',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '여행 중간 호텔 변경(강북→강남/잠실) 시 캐리어 호텔 간 당일 배송',
    keywords: ['호텔 이동', '숙소 변경', '호텔 간', '강남 이동', 'ホテル移動', 'hotel transfer'],
    selfTipByLang: {
      JP: '旅行の途中でホテルを移動する日（例：明洞・弘大→江南・蚕室）は、午前に元ホテルへ荷物を預けて新ホテルへ直送手配すれば、日中の観光時間を1分も無駄にせず夜そのまま新ホテルへチェックインできます。',
      EN: 'Switching hotels mid-trip (e.g., from Hongdae to Gangnam/Jamsil)? Arrange a morning hotel-to-hotel luggage transfer so you can sightsee all day and check right into your new hotel at night.',
      CN: '行程中途更换酒店（如从弘大/明洞换到江南/蚕室）时，上午退房将行李直接转运至新酒店，白天即可空手游玩，晚上直接回新酒店办理入住。',
      KR: '여행 중 숙소를 옮기시는 날에는 오전에 기존 호텔에서 새 호텔로 짐 직배송을 신청해 두시면 낮 일정을 빈손으로 소화하고 저녁에 새 호텔로 바로 체크인하실 수 있습니다.'
    }
  },
  {
    id: 'P45',
    code: 'SOS-45',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '부모님·어린이 동반 가족 여행객을 위한 노웨이팅 도어 투 도어 픽업',
    keywords: ['부모님', '가족', '아이', '효도', '어린이', '유모차', '家族旅行', '両親', 'family', 'parents'],
    selfTipByLang: {
      JP: 'ご両親やお子様連れのソウル旅行では、地下鉄の長い階段や乗り換え移動が一番の負担になります。空港ゲートからホテル正面玄関まで直結するVIPリムジンなら、ご家族全員が疲れ知らずで旅を楽しめます。',
      EN: 'Traveling with parents or young kids? Seoul subway transfers involve long stairs and walkways—a door-to-door airport VIP limousine keeps the whole family relaxed from arrival to hotel check-in.',
      CN: '带父母或小朋友家庭出游首尔时，地铁换乘的漫长台阶最消耗体力。选择从机场到达口直达酒店大门的VIP礼宾专车，让全家人轻松舒适开启旅程。',
      KR: '부모님이나 아이를 동반한 가족 여행에서는 공항철도 환승 계단 이동이 큰 부담이 됩니다. 입국 게이트부터 호텔 로비까지 도어 투 도어로 연결되는 VIP 리무진 픽업으로 편안하게 모실 수 있습니다.'
    }
  },
  {
    id: 'P46',
    code: 'SOS-46',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '인천공항 유심(USIM)/와이파이 수령 후 픽업 기사님 미팅 포인트',
    keywords: ['유심', '이심', 'esim', '와이파이', '미팅 포인트', '게이트', '出口', 'meeting point', 'sim'],
    selfTipByLang: {
      JP: '仁川空港では入国ゲートを出てすぐの「4番出口（T1）」または「3番出口（T2）」横でeSIM開通やSIM受け取りを済ませるのが最もスムーズです。事前予約リムジンならネームボードを持ってゲート前でお待ちします。',
      EN: 'At Incheon Airport, pick up your SIM/Wi-Fi right beside Exit 4 (Terminal 1) or Exit 3 (Terminal 2)—your pre-assigned VIP chauffeur will be waiting right at the arrival gate with a personalized name board.',
      CN: '在仁川机场出关后，T1航站楼4号口或T2航站楼3号口旁即可快速领取SIM卡/Wi-Fi，预约好的VIP专车司机会举着您的专属姓名牌在出口迎候。',
      KR: '인천공항 입국장 게이트(T1 4번 출구 / T2 3번 출구 인근)에서 로밍·유심 확인 직후 전용 네임보드를 든 VIP 전담 기사님과 즉시 미팅하여 대기 없이 출발하실 수 있습니다.'
    }
  },
  {
    id: 'P47',
    code: 'SOS-47',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '공연 굿즈·화장품 대량 구매로 늘어난 수하물 공항 이동 해결',
    keywords: ['수하물 초과', '짐 늘어남', '박스', '대량 구매', '荷物が増えた', 'extra baggage'],
    selfTipByLang: {
      JP: 'コンサートグッズやコスメ購入で帰国時にスーツケース＋段ボール箱まで増えた場合、バスへの積み込み制限にかかることがあります。専用リムジン送迎なら増えたお荷物も余裕でホテルから空港出発階まで運べます。',
      EN: 'Loaded up on K-POP merch and K-Beauty boxes before flying home? Airport buses restrict extra boxes, whereas a private VIP limousine loads all your extra bags right to the departure drop-off.',
      CN: '买了大量演唱会周边与美妆礼盒导致返程行李激增时，机场大巴通常会限制件数，预约专属VIP送机商务车可轻松装下所有行李箱与打包纸箱直达出发层。',
      KR: '콘서트 굿즈와 뷰티 쇼핑으로 출국 시 캐리어 외에 박스와 쇼핑백이 크게 늘어났을 때도 전용 VIP 리무진을 이용하시면 수량 제한 걱정 없이 공항 출국장 바로 앞까지 편하게 이동합니다.'
    }
  },
  {
    id: 'P48',
    code: 'SOS-48',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '새벽 비행기(06~08시 출발) 탑승을 위한 새벽 4시 서울→인천공항 이동',
    keywords: ['새벽 비행기', '조조 비행기', '새벽 공항', '早朝便', 'early morning flight'],
    selfTipByLang: {
      JP: '朝6〜8時発の早朝フライトの場合、午前4時台は空港鉄道がまだ動いていません。前夜のうちに定刻配車確定の早朝VIPリムジンを押さえておけば、ホテル玄関から45分で仁川空港へ余裕を持って到着できます。',
      EN: 'Catching a 6–8 AM early morning flight? Trains aren’t running at 4 AM, so pre-securing a guaranteed 4 AM hotel-pickup limousine gets you to Incheon Airport in 45 minutes with zero stress.',
      CN: '搭乘早上6~8点的早班机返程，凌晨4点地铁尚未运营。提前锁定准点发车的凌晨VIP送机专车，从酒店门口45分钟即可安心抵达仁川机场。',
      KR: '오전 6~8시 출발 조조 항공편은 새벽 4시경 이동해야 하므로 대중교통 이용이 어렵습니다. 사전 확정된 정시 배차 VIP 리무진으로 호텔 로비에서 공항까지 45분 만에 안전하게 도착하세요.'
    }
  },
  {
    id: 'P49',
    code: 'SOS-49',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '첫 한국 방문 외국인을 위한 공항→호텔→성수 원스톱 브리핑 케어',
    keywords: ['첫 한국', '첫 서울', '초행길', '길찾기', '初めての韓国', '初渡韓', 'first time in korea'],
    selfTipByLang: {
      JP: '初めてのソウル旅行なら、Googleマップよりも「NAVERマップ（日本語対応）」アプリを入れておくと徒歩ルートも地下鉄の乗り換え号車まで正確に表示されます！さらに初日の空港送迎を確保しておけば迷う心配はゼロです。',
      EN: 'First time in Seoul? Download "NAVER Map" (set to English) instead of Google Maps for hyper-accurate walking and subway exit directions, and start Day 1 smoothly with a pre-booked airport pickup.',
      CN: '第一次来首尔自由行，强烈建议下载「NAVER Map（支持中文）」代替谷歌地图，连地铁几号门换乘都标得一清二楚！搭配首日接机与行李直达服务即可零迷路开局。',
      KR: '첫 서울 방문이시라면 다국어를 지원하는 네이버 지도(NAVER Map) 앱을 설치해 두시고, 첫날 공항 픽업과 호텔 짐 직배송 패스를 연동하시면 길 헤맬 걱정 없이 완벽한 첫 일정을 시작할 수 있습니다.'
    }
  },
  {
    id: 'P50',
    code: 'SOS-50',
    passId: 'FIRST_SEOUL',
    category: 'AIRPORT_LUGGAGE',
    titleKo: '택시나 매장에 휴대폰·여권 분실 시 외국인 긴급 대처 가이드',
    keywords: ['분실', '택시 분실', '여권 분실', '지갑', '잊어버', '忘れ物', '紛失', 'lost', 'passport'],
    selfTipByLang: {
      JP: '万が一タクシーや店舗で忘れ物をした場合は、決済したカード明細の「承認番号（승인번호）」または領収書があれば、韓国観光公社の24時間多言語ホットライン（1330）経由でドライバーにすぐ連絡が取れます！',
      EN: 'Left something in a taxi or cafe? Keep your card receipt or approval number and dial "1330" (Korea Travel Hotline, 24/7 multilingual)—they can trace the taxi driver via T-money/card records right away!',
      CN: '万一在出租车或店内遗落物品，只要保留刷卡小票或支付记录，拨打韩国旅游发展局24小时中文热线「1330」，即可通过刷卡单号快速联系到当班司机！',
      KR: '택시나 매장에 소지품을 두고 내리셨을 때는 카드 결제 영수증(승인번호)을 확보한 뒤 24시간 다국어 관광통역안내전화 1330 또는 전담 컨시어지 핫라인을 통해 즉시 위치 추적이 가능합니다.'
    }
  }
];

export interface SosConversionResult {
  matchedPatternId: string;
  matchedPatternCode: string;
  matchedPatternTitle: string;
  passId: RevenuePassId;
  lang: TargetLang;
  engineSource: 'SMART_MACRO_CACHE' | 'GEMINI_25_FLASH';
  stage1_empathy_tip: string;
  stage2_pass_pitch: string;
  stage3_checkout_cta: string;
}

const SMART_CACHE_STORAGE_KEY = 'gt_tour_sos_smart_cache_v1';

export function loadSosSmartCache(): Record<string, SosConversionResult> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SMART_CACHE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SosConversionResult>;
  } catch {
    return {};
  }
}

export function saveToSosSmartCache(key: string, result: SosConversionResult): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadSosSmartCache();
    current[key] = result;
    window.localStorage.setItem(SMART_CACHE_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore storage errors
  }
}

export function makeSosCacheKey(question: string, lang: TargetLang, passId: RevenuePassId): string {
  return `${lang}::${passId}::${question.trim().toLowerCase().slice(0, 120)}`;
}

// 50대 고충 패턴 중 최적 매크로를 찾고 3단계 수익 전환 답변을 즉시 조합하는 스마트 엔진 (API 비용 $0)
export function matchSosMacroPattern(params: {
  question: string;
  lang: TargetLang;
  selectedPassId: RevenuePassId;
  forcePatternId?: string;
}): SosConversionResult {
  const { question, lang, selectedPassId, forcePatternId } = params;
  const qLower = question.toLowerCase();

  let matched: SosMacroPattern | undefined;
  if (forcePatternId) {
    matched = SOS_50_MACRO_PATTERNS.find((p) => p.id === forcePatternId);
  }

  if (!matched) {
    let bestScore = -1;
    for (const pattern of SOS_50_MACRO_PATTERNS) {
      let score = pattern.passId === selectedPassId ? 3 : 0;
      for (const kw of pattern.keywords) {
        if (qLower.includes(kw.toLowerCase())) {
          score += 5;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        matched = pattern;
      }
    }
  }

  const finalPattern =
    matched ||
    SOS_50_MACRO_PATTERNS.find((p) => p.passId === selectedPassId) ||
    SOS_50_MACRO_PATTERNS[0];

  const passSpec =
    PRE_SECURED_REVENUE_PASSES.find((p) => p.id === selectedPassId) ||
    PRE_SECURED_REVENUE_PASSES.find((p) => p.id === finalPattern.passId) ||
    PRE_SECURED_REVENUE_PASSES[0];

  const stage1Clean = sanitizeTextWithGuardrails(
    finalPattern.selfTipByLang[lang] || finalPattern.selfTipByLang.JP
  ).sanitizedText;

  const stage2Clean = sanitizeTextWithGuardrails(
    passSpec.pitchLines[lang] || passSpec.pitchLines.JP
  ).sanitizedText;

  const stage3Clean = sanitizeTextWithGuardrails(
    passSpec.selfCheckoutLines[lang] || passSpec.selfCheckoutLines.JP
  ).sanitizedText;

  return {
    matchedPatternId: finalPattern.id,
    matchedPatternCode: finalPattern.code,
    matchedPatternTitle: finalPattern.titleKo,
    passId: passSpec.id,
    lang,
    engineSource: 'SMART_MACRO_CACHE',
    stage1_empathy_tip: stage1Clean,
    stage2_pass_pitch: stage2Clean,
    stage3_checkout_cta: stage3Clean
  };
}

// 페이스북 그룹 자동 발행 프리셋 데이터 구조 및 빌더
export interface FacebookGroupPreset {
  id: string;
  lang: TargetLang;
  axis: CampaignAxis;
  groupName: string;
  memberScale: string;
  bestTimeSlot: string;
  groupPostTitle: string;
  groupPostBody: string;
  firstCommentPin: string;
}

export function buildFacebookGroupPresets(params: {
  axis: CampaignAxis;
  lang: TargetLang;
  spots: string[];
  headline: string;
}): FacebookGroupPreset[] {
  const { axis, lang, spots, headline } = params;
  const spotSummary = spots.slice(0, 3).join(' · ');

  const groupPresetsByLang: Record<TargetLang, FacebookGroupPreset[]> = {
    JP: [
      {
        id: 'fb_jp_1',
        lang: 'JP',
        axis,
        groupName: '韓国旅行・ソウル推し活＆聖地巡礼コミュニティ (JP)',
        memberScale: '68,400+ Members',
        bestTimeSlot: '21:00 ~ 22:30 JST (日本ゴールデンタイム)',
        groupPostTitle: `【保存版】${headline} — 現地の移動・待機ゼロ動線まとめ`,
        groupPostBody: `韓国・ソウル訪問予定の方へ！\n今回のメインコース（${spotSummary}）を回る際、深夜の帰路や現地待機で時間をロスしないための実践ルートを5枚のスライドにまとめました。\n\n✅ スライド1〜4：現地スタッフ検証済みの回り方＆必須チェックポイント\n✅ スライド5：事前確保済みVerified Stay＆専用車送迎スロット案内\n\n言葉の心配なく、予定を整えます。`,
        firstCommentPin: `📌 スタッフとの長いチャットなしで、事前確保済みの専用パス（ホテル・送迎・優先予約枠）を直接選べるセルフ申請リンクはこちら 👉 ${FIXED_GTTOUR_FOOTER}`
      },
      {
        id: 'fb_jp_2',
        lang: 'JP',
        axis,
        groupName: '渡韓女子・ソウルカフェ＆ウェルネス情報交換会 (JP)',
        memberScale: '42,100+ Members',
        bestTimeSlot: '12:15 ~ 13:15 JST (ランチタイム)',
        groupPostTitle: `【ソウル現地レポ】${spotSummary} 失敗しない1日モデルコース`,
        groupPostBody: `初めてのエリアでも迷わない！${headline}\n韓国の010電話番号がなくてもスムーズに回れる事前手配のコツと、スーツケースや買い物袋を預けて身軽に動く方法をカードニュースで公開します。`,
        firstCommentPin: `📌 ご希望の日程枠を30秒でセルフ確保できる公式コンシェルジュリンク 👉 ${FIXED_GTTOUR_FOOTER}`
      }
    ],
    EN: [
      {
        id: 'fb_en_1',
        lang: 'EN',
        axis,
        groupName: 'Seoul Travel & Global K-POP Concert Goers Community',
        memberScale: '124,000+ Members',
        bestTimeSlot: '19:00 ~ 21:00 KST / Global Peak',
        groupPostTitle: `[Seoul Insider Guide] ${headline} — Zero-Wait Route & Safe Return`,
        groupPostBody: `Planning a trip to Seoul around ${spotSummary}?\nWe put together a 5-slide field guide covering exact subway/taxi bottlenecks to avoid, how to skip kiosks that require a Korean 010 number, and how to lock in a walkable Verified Stay.\n\nSwipe through the 5 slides above for the full route breakdown!`,
        firstCommentPin: `📌 Claim your pre-secured GT TOUR pass (5-min walk Verified Stay, Airport VIP Limo & Priority Hotplace Slots) directly via self-checkout 👉 ${FIXED_GTTOUR_FOOTER}`
      },
      {
        id: 'fb_en_2',
        lang: 'EN',
        axis,
        groupName: 'Expats & Solo Travelers in Korea (Tips & Concierge)',
        memberScale: '89,500+ Members',
        bestTimeSlot: '11:30 ~ 13:00 KST',
        groupPostTitle: `[3-Spot Curated Route] ${spotSummary} without Language Barriers`,
        groupPostBody: `Here is our updated 5-slide visual itinerary for ${headline}. Everything is pre-vetted so you can enjoy Seoul hands-free without stressing over late-night transfers or luggage storage.`,
        firstCommentPin: `📌 Book your pre-secured slot in 30 seconds (no lengthy DM chat needed) 👉 ${FIXED_GTTOUR_FOOTER}`
      }
    ],
    CN: [
      {
        id: 'fb_cn_1',
        lang: 'CN',
        axis,
        groupName: '首尔自由行·K-POP演唱会同款打卡互助社团 (TW/HK/Global)',
        memberScale: '95,200+ Members',
        bestTimeSlot: '20:30 ~ 22:30 CST',
        groupPostTitle: `【首尔保姆级攻略】${headline} — 零排队动线与深夜安全回程`,
        groupPostBody: `准备去首尔打卡（${spotSummary}）的朋友必看！\n整理了5张超详细实操图文：包含如何避开散场打车难、没有韩国010手机号如何丝滑探店、以及行李寄存与专车接送方案。`,
        firstCommentPin: `📌 无需私信排队等待人工回复，直接点击自助链接30秒锁定 GT TOUR 预先留好的专属名额 👉 ${FIXED_GTTOUR_FOOTER}`
      },
      {
        id: 'fb_cn_2',
        lang: 'CN',
        axis,
        groupName: '韩国圣水洞·清潭洞探店与美学生活分享群',
        memberScale: '53,800+ Members',
        bestTimeSlot: '12:30 ~ 14:00 CST',
        groupPostTitle: `【首尔私藏路线】${spotSummary} 一日丝滑行程单`,
        groupPostBody: `不想在现场浪费时间排队？这5张图文帮您一次性搞定 ${headline} 的核心预约技巧与步行5分钟严选住宿衔接方案。`,
        firstCommentPin: `📌 自助选择日期锁定专属通行证（含中文管家与专车接送）👉 ${FIXED_GTTOUR_FOOTER}`
      }
    ],
    KR: [
      {
        id: 'fb_kr_1',
        lang: 'KR',
        axis,
        groupName: '글로벌 방한 외국인 & K-POP 인바운드 트래블 라운지',
        memberScale: '58,000+ Members',
        bestTimeSlot: '20:00 ~ 21:30 KST',
        groupPostTitle: `[서울 인바운드 공식 가이드] ${headline} — 3대 핵심 동선 총정리`,
        groupPostBody: `서울 핵심 스팟(${spotSummary}) 방문 시 외국인 여행객이 가장 많이 겪는 심야 귀가·현장 웨이팅·통역 및 짐 이동 고민을 한 번에 해결하는 5장 카드뉴스 가이드입니다.`,
        firstCommentPin: `📌 실시간 채팅 대기 없이 사전 확보된 GT TOUR 전용 슬롯을 즉시 선점하세요 👉 ${FIXED_GTTOUR_FOOTER}`
      },
      {
        id: 'fb_kr_2',
        lang: 'KR',
        axis,
        groupName: '성수·청담·올림픽공원 핫플레이스 & 스테이 큐레이션 그룹',
        memberScale: '34,600+ Members',
        bestTimeSlot: '12:00 ~ 13:30 KST',
        groupPostTitle: `[큐레이션 코스] ${spotSummary} 무대기 컨시어지 루트`,
        groupPostBody: `${headline} 테마에 맞춘 5장 슬라이드 요약본입니다. 사전 확보된 도보 5분 Verified 스테이와 전용 리무진 패스로 쾌적한 일정을 완성하세요.`,
        firstCommentPin: `📌 사전 예약형 4대 수익 패스 셀프 체크아웃 링크 👉 ${FIXED_GTTOUR_FOOTER}`
      }
    ]
  };

  return groupPresetsByLang[lang] || groupPresetsByLang.JP;
}
