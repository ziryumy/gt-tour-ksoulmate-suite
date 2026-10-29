import { Type, type Schema } from '@google/genai';

export type CampaignAxis = 'HOTPLACE' | 'STAY' | 'K_BEAUTY' | 'KPOP_NEWS';
export type TargetLang = 'JP' | 'EN' | 'CN' | 'KR';

export const FIXED_GTTOUR_FOOTER = '@gttourkorea | https://tr.ee/dSpLdDtiGW';
export const X_CHANNEL_HANDLE = '@enjoywithkorea';
export const THREADS_CHANNEL_HANDLE = '@gttourkorea';

export const MARKETER_PERSONAS: Record<TargetLang, { name: string; role: string; tone: string }> = {
  JP: {
    name: '유키·유코 (Yuki & Yuko)',
    role: '일본 인바운드 & K-POP 팬덤 수석 마케터',
    tone: '정중하고 안심감을 주는 도쿄 에디토리얼·오시카츠(推し活) 톤 & 일본어 5대 합법 프리셋 필수 반영'
  },
  EN: {
    name: '윤서 (Yoonseo)',
    role: '글로벌 영어권 K-컬처 & 컨시어지 수석 마케터',
    tone: '세련되고 트렌디한 글로벌 K-POP 팬덤 & 럭셔리 트래블 컨시어지 톤'
  },
  CN: {
    name: '샤오홍슈 수석 에디터 (XHS Chief Editor)',
    role: '중화권 한류·즈차오(种草) 콘텐츠 디렉터',
    tone: '감각적인 샤오홍슈 7장 노트 및 콘서트·성지순례(打卡) 동선 정리 톤'
  },
  KR: {
    name: '글로벌 컨시어지 디렉터',
    role: 'GT TOUR 한류·인바운드 브랜드 총괄',
    tone: '트렌디한 한류 뉴스 브리핑 & 공연법 100% 준수 안심 스테이·송영 컨시어지 톤'
  }
};

// 한국어 스팟명·K-POP 뉴스·가드레일 치환 문구를 JP/EN/CN 타깃 원어민 언어로 완벽히 번역하는 사전
const KOREAN_TO_TARGET_DICTIONARY: Array<{
  kr: string;
  JP: string;
  EN: string;
  CN: string;
}> = [
  // 1. 가드레일 치환 전체 문구 (긴 문장 우선 매칭)
  {
    kr: '프라이빗 뷰티 클리닉 일정 조율 및 전담 통역 컨시어지',
    JP: 'プライベート・ビューティースケジュール調整＆専任通訳コンシェルジュ',
    EN: 'Private Beauty Clinic Scheduling & 1:1 Interpreter Concierge',
    CN: '私密美学日程协调与1对1专职翻译管家'
  },
  {
    kr: '맞춤형 웰니스·뷰티 방문 스케줄링 및 픽업 케어',
    JP: 'オーダーメイド・ウェルネス訪問スケジューリング＆専用車送迎ケア',
    EN: 'Bespoke Wellness & Beauty Visit Scheduling with Private Pickup',
    CN: '定制健康美学预约规划与专车接送服务'
  },
  {
    kr: '프리미엄 K-뷰티 라운지 예약 및 편안한 휴식 스테이 연계',
    JP: 'プレミアムK-ビューティーラウンジ予約＆ゆったり休めるステイ',
    EN: 'Premium K-Beauty Lounge Booking & Relaxing Verified Stay',
    CN: '高端K-Beauty空间预约与舒适休养酒店'
  },
  {
    kr: '프리미엄 K-뷰티 라운지 예약 및 편안한 휴식 스테이',
    JP: 'プレミアムK-ビューティーラウンジ予約＆ゆったり休めるステイ',
    EN: 'Premium K-Beauty Lounge Booking & Relaxing Verified Stay',
    CN: '高端K-Beauty空间预约与舒适休养酒店'
  },
  {
    kr: '1:1 전담 통역 동행 및 뷰티 컨시어지 일정 케어',
    JP: '1:1専任通訳同行＆ビューティーコンシェルジュ日程ケア',
    EN: '1:1 Dedicated Interpreter & Beauty Concierge Itinerary Care',
    CN: '1对1专职翻译陪同与美学管家日程服务'
  },
  {
    kr: '방문부터 숙소 복귀까지 막힘없는 웰니스 동선 가이드',
    JP: '訪問からホテル帰着までスムーズなウェルネス動線ガイド',
    EN: 'Seamless Wellness Route Guide from Visit to Hotel Return',
    CN: '从探访到返回酒店的全程无缝健康美学动线指南'
  },
  {
    kr: '회복과 휴식에 집중할 수 있는 안심 스테이 환경 제공',
    JP: '回復と休息に集中できる安心のステイ環境を提供',
    EN: 'Serene & Restorative Verified Stay Environment',
    CN: '提供专注于恢复与休息的安心住宿环境'
  },
  {
    kr: '공연 관람일 도보 5분 Verified 숙소 및 심야 안전 송영 케어',
    JP: '公演観覧日の徒歩5分Verifiedホテル＆深夜安心送迎ケア',
    EN: '5-Min Walk Verified Stay on Show Day & Late-Night Safe Drop-Off',
    CN: '演出当日步行5分钟严选酒店及深夜安全专车接送'
  },
  {
    kr: '공연장 인접 스테이 체크인 및 관람 전후 다이닝 동선 케어',
    JP: '会場隣接ホテルチェックイン＆観覧前後のダイニング動線ケア',
    EN: 'Venue-Adjacent Stay Check-In & Pre/Post-Show Dining Route Care',
    CN: '演出场馆毗邻酒店入住及观演前后餐饮动线规划'
  },
  {
    kr: '막차 걱정 없는 공연장 도보권 숙소 확보 및 전용 차량 이동',
    JP: '終電を気にせず過ごせる会場徒歩圏ホテル確保＆専用車移動',
    EN: 'Walkable Venue Stay with Zero Last-Train Worry & Private Van Transfer',
    CN: '无需担心末班车的场馆步行圈酒店预订及专车接送'
  },
  {
    kr: '검증된 현지 전담 매니저의 세심한 1:1 밀착 케어',
    JP: '厳選された現地専任マネージャーによる丁寧な1:1サポート',
    EN: 'Attentive 1:1 Care by Verified Local Dedicated Managers',
    CN: '严选当地专职管家细致入微的1对1贴心服务'
  },
  {
    kr: '투명하고 합리적인 정찰제 컨시어지 플랜',
    JP: '透明で安心の定額コンシェルジュプラン',
    EN: 'Transparent Fixed-Rate Private Concierge Plan',
    CN: '透明合理的固定价格私人管家方案'
  },
  {
    kr: '체계적인 사전 동선 설계를 통한 안정적인',
    JP: '体系的な事前動線設計によるスムーズな',
    EN: 'Well-Orchestrated Pre-Planned Route for a Reliable',
    CN: '通过系统化事前动线规划打造的安心'
  },

  // 2. K-POP 뉴스 & 성지순례 샘플 스팟/요약 문구 (통문장 매칭)
  {
    kr: 'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정',
    JP: 'KSPO DOME ワールドツアー公演＆聖水（ソンス）公式ポップアップストア開催決定',
    EN: 'KSPO DOME World Tour Concert & Seongsu Official Pop-Up Store Confirmed',
    CN: 'KSPO DOME 世界巡回演唱会及圣水洞官方快闪店正式官宣'
  },
  {
    kr: 'KSPO DOME 도보 5분 Verified 스테이',
    JP: 'KSPO DOME 徒歩5分 Verifiedステイ',
    EN: 'KSPO DOME 5-Min Walk Verified Stay',
    CN: 'KSPO DOME 步行5分钟严选酒店'
  },
  {
    kr: '성수 K-POP 공식 팝업스토어',
    JP: '聖水（ソンス）K-POP公式ポップアップストア',
    EN: 'Seongsu Official K-POP Pop-Up Store',
    CN: '圣水洞K-POP官方快闪店'
  },
  {
    kr: '용산 하이브 인근 아티스트 성지순례 카페',
    JP: '龍山（ヨンサン）HYBE周辺・アーティスト聖地巡礼カフェ',
    EN: 'Yongsan HYBE Area Artist Pilgrimage Cafe',
    CN: '龙山HYBE周边艺人同款打卡咖啡厅'
  },
  {
    kr: '청담 프라이빗 라운지',
    JP: '清潭（チョンダム）プライベートラウンジ',
    EN: 'Cheongdam Private Lounge',
    CN: '清潭洞私密贵宾室'
  },
  {
    kr: '성수 플래그십 스토어',
    JP: '聖水（ソンス）フラッグシップストア',
    EN: 'Seongsu Flagship Store',
    CN: '圣水洞品牌旗舰店'
  },
  {
    kr: '한남 브런치 다이닝',
    JP: '漢南（ハンナム）ブランチダイニング',
    EN: 'Hannam Brunch Dining',
    CN: '汉南洞露台早午餐'
  },
  {
    kr: '올림픽공원 도보 5분 Verified 호텔',
    JP: 'オリンピック公園・徒歩5分Verifiedホテル',
    EN: 'Olympic Park 5-Min Walk Verified Hotel',
    CN: '奥林匹克公园步行5分钟严选酒店'
  },
  {
    kr: '잠실 한강뷰 라운지',
    JP: '蚕室（チャムシル）漢江ビューラウンジ',
    EN: 'Jamsil Hangang River-View Lounge',
    CN: '蚕室汉江景致贵宾室'
  },
  {
    kr: '청담 심야 다이닝',
    JP: '清潭（チョンダム）深夜ダイニング',
    EN: 'Cheongdam Late-Night Fine Dining',
    CN: '清潭洞深夜私享餐厅'
  },
  {
    kr: '성수 디자이너 쇼룸',
    JP: '聖水（ソンス）デザイナーズショールーム',
    EN: 'Seongsu Designer Showroom',
    CN: '圣水洞设计师买手店'
  },
  {
    kr: '압구정 도산공원 디저트 카페',
    JP: '狎鴎亭（アックジョン）島山公園デザートカフェ',
    EN: 'Apgujeong Dosan Park Dessert Cafe',
    CN: '狎鸥亭岛山公园甜品咖啡厅'
  },
  {
    kr: '한남동 바이닐 바',
    JP: '漢南洞（ハンナムドン）ヴァイナルバー',
    EN: 'Hannam-dong Vinyl Lounge Bar',
    CN: '汉南洞黑胶音乐吧'
  },
  {
    kr: 'KSPO DOME 도보 5분 호텔',
    JP: 'KSPO DOME 徒歩5分ホテル',
    EN: 'KSPO DOME 5-Min Walk Hotel',
    CN: 'KSPO DOME 步行5分钟酒店'
  },
  {
    kr: '올림픽공원 심야 라운지',
    JP: 'オリンピック公園・深夜ラウンジ',
    EN: 'Olympic Park Late-Night Lounge',
    CN: '奥林匹克公园深夜休闲吧'
  },
  {
    kr: '잠실 롯데타워 다이닝',
    JP: '蚕室（チャムシル）ロッテタワーダイニング',
    EN: 'Jamsil Lotte Tower Sky Dining',
    CN: '蚕室乐天塔景观餐厅'
  },

  // 3. 주요 지역명 및 K-POP 성지순례 단어 조각 매칭
  { kr: '월드투어 콘서트', JP: 'ワールドツアー公演', EN: 'World Tour Concert', CN: '世界巡回演唱会' },
  { kr: '앙코르 콘서트', JP: 'アンコール公演', EN: 'Encore Concert', CN: '安可演唱会' },
  { kr: '콘서트', JP: 'コンサート', EN: 'Concert', CN: '演唱会' },
  { kr: '팬미팅', JP: 'ファンミーティング', EN: 'Fan Meeting', CN: '粉丝见面会' },
  { kr: '공식 팝업스토어', JP: '公式ポップアップストア', EN: 'Official Pop-Up Store', CN: '官方快闪店' },
  { kr: '팝업스토어', JP: 'ポップアップストア', EN: 'Pop-Up Store', CN: '快闪店' },
  { kr: '팝업', JP: 'ポップアップ', EN: 'Pop-Up', CN: '快闪店' },
  { kr: '성지순례 카페', JP: '聖地巡礼カフェ', EN: 'Pilgrimage Cafe', CN: '同款打卡咖啡厅' },
  { kr: '성지순례', JP: '聖地巡礼（推し活）', EN: 'K-POP Pilgrimage', CN: '爱豆同款打卡' },
  { kr: '생일카페', JP: 'センイルカフェ', EN: 'Birthday Cafe', CN: '生咖应援' },
  { kr: '아티스트', JP: 'アーティスト', EN: 'Artist', CN: '艺人' },
  { kr: '하이브', JP: 'HYBE', EN: 'HYBE', CN: 'HYBE' },
  { kr: '더현대 서울', JP: 'ザ・現代ソウル', EN: 'The Hyundai Seoul', CN: '首尔现代百货' },
  { kr: '용산', JP: '龍山（ヨンサン）', EN: 'Yongsan', CN: '龙山' },
  { kr: '청담동', JP: '清潭洞（チョンダムドン）', EN: 'Cheongdam-dong', CN: '清潭洞' },
  { kr: '청담', JP: '清潭（チョンダム）', EN: 'Cheongdam', CN: '清潭洞' },
  { kr: '압구정로데오', JP: '狎鴎亭ロデオ', EN: 'Apgujeong Rodeo', CN: '狎鸥亭罗德奥' },
  { kr: '압구정', JP: '狎鴎亭（アックジョン）', EN: 'Apgujeong', CN: '狎鸥亭' },
  { kr: '도산공원', JP: '島山公園（トサン公園）', EN: 'Dosan Park', CN: '岛山公园' },
  { kr: '성수동', JP: '聖水洞（ソンスドン）', EN: 'Seongsu-dong', CN: '圣水洞' },
  { kr: '성수', JP: '聖水（ソンス）', EN: 'Seongsu', CN: '圣水洞' },
  { kr: '한남동', JP: '漢南洞（ハンナムドン）', EN: 'Hannam-dong', CN: '汉南洞' },
  { kr: '한남', JP: '漢南（ハンナム）', EN: 'Hannam', CN: '汉南洞' },
  { kr: '올림픽공원', JP: 'オリンピック公園', EN: 'Olympic Park', CN: '奥林匹克公园' },
  { kr: '잠실', JP: '蚕室（チャムシル）', EN: 'Jamsil', CN: '蚕室' },
  { kr: '강남', JP: '江南（カンナム）', EN: 'Gangnam', CN: '江南' },
  { kr: '신사동', JP: '新沙洞（シンサドン）', EN: 'Sinsa-dong', CN: '新沙洞' },
  { kr: '가로수길', JP: 'カロスキル', EN: 'Garosu-gil', CN: '林荫道' },
  { kr: '홍대', JP: '弘大（ホンデ）', EN: 'Hongdae', CN: '弘大' },
  { kr: '연남동', JP: '延南洞（ヨンナムドン）', EN: 'Yeonnam-dong', CN: '延南洞' },
  { kr: '명동', JP: '明洞（ミョンドン）', EN: 'Myeongdong', CN: '明洞' },
  { kr: '익선동', JP: '益善洞（イクソンドン）', EN: 'Ikseon-dong', CN: '益善洞' },
  { kr: '북촌', JP: '北村（プクチョン）', EN: 'Bukchon', CN: '北村' },
  { kr: '서촌', JP: '西村（ソチョン）', EN: 'Seochon', CN: '西村' },
  { kr: '여의도', JP: '汝矣島（ヨイド）', EN: 'Yeouido', CN: '汝矣岛' },
  { kr: '인스파이어 아레나', JP: 'インスパイア・アリーナ', EN: 'INSPIRE Arena', CN: 'INSPIRE 迎仕柏综艺馆' },
  { kr: '고척돔', JP: '高尺（コチョク）スカイドーム', EN: 'Gocheok Sky Dome', CN: '高尺天空巨蛋' },
  { kr: '프라이빗 라운지', JP: 'プライベートラウンジ', EN: 'Private Lounge', CN: '私密贵宾室' },
  { kr: '플래그십 스토어', JP: 'フラッグシップストア', EN: 'Flagship Store', CN: '品牌旗舰店' },
  { kr: '브런치 다이닝', JP: 'ブランチダイニング', EN: 'Brunch Dining', CN: '露台早午餐' },
  { kr: '디자이너 쇼룸', JP: 'デザイナーズショールーム', EN: 'Designer Showroom', CN: '设计师买手店' },
  { kr: '디저트 카페', JP: 'デザートカフェ', EN: 'Dessert Cafe', CN: '甜品咖啡厅' },
  { kr: '심야 다이닝', JP: '深夜ダイニング', EN: 'Late-Night Dining', CN: '深夜餐厅' },
  { kr: '한강뷰 라운지', JP: '漢江ビューラウンジ', EN: 'Hangang View Lounge', CN: '汉江景致贵宾室' },
  { kr: '뷰티 클리닉', JP: 'ビューティーラウンジ', EN: 'Beauty Clinic', CN: '美学中心' },
  { kr: '웰니스·뷰티', JP: 'ウェルネス＆ビューティー', EN: 'Wellness & Beauty', CN: '健康与美学' },
  { kr: '컨시어지', JP: 'コンシェルジュ', EN: 'Concierge', CN: '私人管家' },
  { kr: '전담 통역', JP: '専任通訳', EN: 'Dedicated Interpreter', CN: '专职翻译' },
  { kr: '일정 조율', JP: 'スケジュール調整', EN: 'Schedule Coordination', CN: '日程协调' },
  { kr: '픽업 케어', JP: '専用車送迎ケア', EN: 'Private Pickup Care', CN: '专车接送服务' },
  { kr: '휴식 스테이', JP: '休息ステイ', EN: 'Relaxing Stay', CN: '休养住宿' },
  { kr: '스테이', JP: 'ステイ', EN: 'Stay', CN: '住宿' },
  { kr: '라운지', JP: 'ラウンジ', EN: 'Lounge', CN: '贵宾室' },
  { kr: '쇼룸', JP: 'ショールーム', EN: 'Showroom', CN: '买手店' },
  { kr: '스토어', JP: 'ストア', EN: 'Store', CN: '精品店' },
  { kr: '다이닝', JP: 'ダイニング', EN: 'Dining', CN: '餐厅' },
  { kr: '호텔', JP: 'ホテル', EN: 'Hotel', CN: '酒店' },
  { kr: '카페', JP: 'カフェ', EN: 'Cafe', CN: '咖啡厅' },
  { kr: '도보 5분', JP: '徒歩5分', EN: '5-Min Walk', CN: '步行5分钟' },
  { kr: '인근', JP: '周辺', EN: 'Area', CN: '周边' },
  { kr: '연계', JP: '', EN: '', CN: '' },
  { kr: '및', JP: '＆', EN: '&', CN: '与' }
];

// 한국어가 섞인 스팟명/문구를 타깃 언어(JP, EN, CN)로 완벽히 현지화하는 함수
export function localizeTextToTargetLang(text: string, lang: TargetLang): string {
  if (!text || lang === 'KR') return text;

  let result = text.trim();

  for (const entry of KOREAN_TO_TARGET_DICTIONARY) {
    if (result.includes(entry.kr)) {
      const targetStr = entry[lang];
      if (lang === 'EN') {
        result = result.replaceAll(entry.kr, ` ${targetStr} `);
      } else {
        result = result.replaceAll(entry.kr, targetStr);
      }
    }
  }

  // 조사 및 남은 한글 어미 정리 (JP/EN/CN일 때 한글 잔여물 제거)
  if (/[가-힣]/.test(result)) {
    result = result.replace(/[가-힣]+/g, '').trim();
  }

  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/^[·&\-\s]+|[·&\-\s]+$/g, '')
    .trim();

  if (!result) {
    if (lang === 'JP') return 'ソウル・K-POP聖地＆コンシェルジュスポット';
    if (lang === 'EN') return 'Seoul Curated K-POP & Concierge Spot';
    if (lang === 'CN') return '首尔精选K-POP打卡与管家站点';
  }

  return result;
}

export const DEFAULT_IMAGEN_NEGATIVE_PROMPT =
  'text overlay, watermark, logo, signature, medical syringe, injection needle, surgical room, clinical procedure, before and after comparison, concert ticket stub, barcode, celebrity close-up portrait, chaotic crowd, low resolution, blurry, distorted anatomy';

export const NATIVE_VISUAL_AESTHETICS: Record<
  TargetLang,
  {
    name: string;
    badge: string;
    lightingStyle: string;
    cameraSpec: string;
    colorPalette: string;
    culturalPoint: string;
  }
> = {
  JP: {
    name: 'Tokyo Airy Editorial & Oshikatsu Aesthetic',
    badge: 'JP 도쿄 매거진 자연광 · 안심 감성',
    lightingStyle:
      'Soft diffused morning sunlight, airy high-key natural illumination, gentle shadow falloff',
    cameraSpec: 'Fujifilm GFX 100S, 50mm f/2.0 lens, POPEYE & Hanako magazine editorial style',
    colorPalette: 'Warm ivory, soft oat beige, muted pastel sage, and clean white negative space',
    culturalPoint:
      '청결하고 정돈된 프라이빗 공간감, 일본 여성 타깃이 선호하는 뽀샤시한 자연광과 차분한 안심 호스피탈리티 무드'
  },
  EN: {
    name: 'Kinfolk & Condé Nast Luxury Twilight',
    badge: 'EN 글로벌 럭셔리 트래블 · 시네마틱 감성',
    lightingStyle:
      'Golden hour architectural glow transitioning into ambient Seoul twilight, cinematic depth',
    cameraSpec: 'Leica SL2-S, 35mm Summilux f/1.4, Condé Nast Traveler & Kinfolk editorial look',
    colorPalette: 'Deep architectural charcoal, warm amber gold, champagne neutral, twilight blue',
    culturalPoint:
      '글로벌 럭셔리 여행객이 선호하는 프라이빗 쇼퍼드리븐 리무진, 서울 스카이라인 파노라마, 모던 건축 미학'
  },
  CN: {
    name: 'Xiaohongshu High-Aesthetic Da-Ka (种草打卡)',
    badge: 'CN 샤오홍슈 즈차오 · 인플루언서 포토존 감성',
    lightingStyle:
      'Crisp glossy editorial daylight, vibrant micro-contrast, luminous lifestyle atmosphere',
    cameraSpec: 'Hasselblad X2D 100C, 38mm f/2.5, luxury lifestyle influencer campaign photography',
    colorPalette: 'Rich espresso, alabaster marble, warm rosewood, vibrant city lights',
    culturalPoint:
      '샤오홍슈(小红书) 저장·공유를 부르는 트렌디한 성수·청담 플래그십 건축미와 하이엔드 VIP 쇼핑·호캉스 구도'
  },
  KR: {
    name: 'Seoul High-End Private Concierge Editorial',
    badge: 'KR 서울 프리미엄 컨시어지 · 모던 건축 감성',
    lightingStyle:
      'Balanced architectural daylight with refined warm interior accent lighting',
    cameraSpec: 'Phase One IQ4 150MP, 45mm tilt-shift architectural & hospitality photography',
    colorPalette: 'Modern slate navy, warm limestone, brushed brass, crisp gallery white',
    culturalPoint:
      '도보 5분 Verified Stay의 쾌적한 접근성과 전용 리무진 Door-to-Door 프로토콜을 보여주는 정제된 비주얼'
  }
};

export interface SlideImagenSpec {
  slide_no: number;
  slide_role: 'COVER' | 'SPOT_01' | 'SPOT_02' | 'SPOT_03' | 'CTA';
  visual_aesthetic: string;
  imagen_prompt: string;
  negative_prompt: string;
  aspect_ratio: '4:5' | '1:1' | '3:4' | '9:16';
  imagen_model: string;
  composition_guide: string;
}

// IG 5개 슬라이드별 현지 원어민 감성 중심 Imagen 프롬프트 생성기 (6대 법률 가드레일 비주얼 준수)
export function buildSlideImagenPrompts(params: {
  axis: CampaignAxis;
  lang: TargetLang;
  spot1: string;
  spot2: string;
  spot3: string;
  newsHeadline?: string;
}): SlideImagenSpec[] {
  const { axis, lang, spot1, spot2, spot3, newsHeadline = '' } = params;
  const aesthetic = NATIVE_VISUAL_AESTHETICS[lang] || NATIVE_VISUAL_AESTHETICS.JP;
  const isKpop = axis === 'KPOP_NEWS';

  // Slide 1: Cover Scene
  const coverSceneByAxis: Record<CampaignAxis, string> = {
    K_BEAUTY:
      'A serene, ultra-private wellness and beauty concierge lounge in Cheongdam, Seoul. Minimalist Korean travertine stone and warm oak interior, a ceramic tea service on a low table, soft sheer curtains filtering sunlight, and a sleek black VIP limousine visible through the glass courtyard entrance. Zero medical equipment, purely hospitality and relaxation.',
    STAY:
      'A high-floor Verified Stay luxury hotel suite in Seoul, just a 5-minute walk from Olympic Park. Floor-to-ceiling windows revealing a tranquil Seoul twilight skyline, crisp white linen bedding, warm indirect cove lighting, and a welcoming concierge welcome card on a marble side table.',
    HOTPLACE:
      'An iconic red-brick and architectural glass designer flagship building in Seongsu-dong, Seoul during golden hour. A sleek black VIP concierge van parked discreetly at the curb, tree-lined street with trendy café terraces, sophisticated editorial travel vibe.',
    KPOP_NEWS:
      `Architectural twilight view of a modern Seoul concert arena walkway (${newsHeadline || 'KSPO DOME & Seongsu Pop-Up district'}) glowing with soft pastel ambient lights, seamlessly leading to a warm 5-minute walk luxury hotel lobby entrance and waiting private black limousine. Calm, upscale post-show atmosphere with zero crowd chaos and no copyrighted logos.`
  };

  // Slide 2: SPOT 01 Scene
  const spot1Scene = isKpop
    ? `Exterior and lobby lounge of a 5-minute walk Verified Stay hotel near ${spot1} in Seoul. Warm welcoming entrance at blue hour, a dedicated black luxury van parked at the porte-cochère, plush lounge seating inside, evoking effortless post-concert return without subway crowds.`
    : `Curated arrival scene at ${spot1} in Seoul. A private chauffeur-driven black limousine opening its door in front of a refined modern Korean architectural entrance, warm welcoming interior glow, 1:1 private concierge hospitality mood.`;

  // Slide 3: SPOT 02 Scene
  const spot2Scene = isKpop
    ? `Trendy architectural pop-up store and lifestyle showroom space at ${spot2} in Seongsu, Seoul. Minimalist gallery-like display shelves, pastel and metallic spatial design, natural daylight pouring through industrial skylights, upscale shopping bags neatly carried with zero queue stress.`
    : `Interior editorial shot of ${spot2} in Seoul. Sunlight streaming across curated lifestyle displays, warm wood and stone textures, an inviting VIP seating corner with artisan coffee, effortless language-free shopping and dining atmosphere.`;

  // Slide 4: SPOT 03 Scene
  const spot3Scene = isKpop
    ? `Cozy yet sophisticated artist pilgrimage café and late-night dining terrace at ${spot3} in Seoul. Artisanal dessert and signature beverages on a marble table, warm ambient Edison and candle lighting, overlooking a peaceful Seoul neighborhood street at night with a private van waiting nearby.`
    : `Restorative evening atmosphere at ${spot3} in Seoul. A tranquil fine-dining terrace or 5-minute walk boutique hotel sanctuary with soft warm lamps, panoramic night view of the Han River and city lights, evoking complete peace of mind.`;

  // Slide 5: CTA Scene
  const ctaScene =
    'A minimalist luxury flat-lay and interior vignette inside a Seoul VIP concierge suite: a bespoke leather travel itinerary folio, a sleek room keycard on warm travertine stone, a cup of artisan tea, and soft blurred Seoul city lights through a window in the background. Generous clean negative space in the center and top for CTA benefit typography.';

  return [
    {
      slide_no: 1,
      slide_role: 'COVER',
      visual_aesthetic: `[${aesthetic.badge}] 커버 훅 — ${aesthetic.culturalPoint}`,
      imagen_prompt: `[Instagram 4:5 Cover Editorial] ${coverSceneByAxis[axis]} Style: ${aesthetic.name}. Lighting: ${aesthetic.lightingStyle}. Color Palette: ${aesthetic.colorPalette}. Camera: ${aesthetic.cameraSpec}. Composition: Rule-of-thirds with 35% clean upper negative space for cover headline typography. No text or watermarks.`,
      negative_prompt: DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: '4:5',
      imagen_model: 'imagen-3.0-generate-002',
      composition_guide: '상단 35% 텍스트 오버레이 여백 확보 · 아이레벨 광각 에디토리얼 샷'
    },
    {
      slide_no: 2,
      slide_role: 'SPOT_01',
      visual_aesthetic: `[${aesthetic.badge}] SPOT 01 (${spot1}) — 프라이빗 도착 & 도보 5분 안심 동선`,
      imagen_prompt: `[Instagram 4:5 Spot 01 Feature] ${spot1Scene} Style: ${aesthetic.name}. Lighting: ${aesthetic.lightingStyle}. Color Palette: ${aesthetic.colorPalette}. Camera: ${aesthetic.cameraSpec}. Composition: Architectural medium-wide shot highlighting door-to-door comfort and calm luxury. No text or watermarks.`,
      negative_prompt: DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: '4:5',
      imagen_model: 'imagen-3.0-generate-002',
      composition_guide: '건축 외관 및 VIP 리무진 도어투도어 구도 · 하단 정보 카드 여백 확보'
    },
    {
      slide_no: 3,
      slide_role: 'SPOT_02',
      visual_aesthetic: `[${aesthetic.badge}] SPOT 02 (${spot2}) — 대기·언어 장벽 없는 트렌드 공간 경험`,
      imagen_prompt: `[Instagram 4:5 Spot 02 Feature] ${spot2Scene} Style: ${aesthetic.name}. Lighting: ${aesthetic.lightingStyle}. Color Palette: ${aesthetic.colorPalette}. Camera: ${aesthetic.cameraSpec}. Composition: Eye-level lifestyle perspective with shallow depth of field and refined spatial details. No text or watermarks.`,
      negative_prompt: DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: '4:5',
      imagen_model: 'imagen-3.0-generate-002',
      composition_guide: '실내 자연광 채광 및 공간 디테일 포커스 · 4:5 세로 구도'
    },
    {
      slide_no: 4,
      slide_role: 'SPOT_03',
      visual_aesthetic: `[${aesthetic.badge}] SPOT 03 (${spot3}) — 여유로운 성지순례·다이닝 & 나이트 케어`,
      imagen_prompt: `[Instagram 4:5 Spot 03 Feature] ${spot3Scene} Style: ${aesthetic.name}. Lighting: ${aesthetic.lightingStyle}. Color Palette: ${aesthetic.colorPalette}. Camera: ${aesthetic.cameraSpec}. Composition: Intimate table-side and window-view composition conveying warmth, safety, and relaxation. No text or watermarks.`,
      negative_prompt: DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: '4:5',
      imagen_model: 'imagen-3.0-generate-002',
      composition_guide: '따뜻한 실내 무드 조명과 창밖 서울 야경의 조화 · 감성 클로즈업'
    },
    {
      slide_no: 5,
      slide_role: 'CTA',
      visual_aesthetic: `[${aesthetic.badge}] CTA 엔딩 카드 — 3대 컨시어지 혜택 가독성 극대화 배경`,
      imagen_prompt: `[Instagram 4:5 CTA Background] ${ctaScene} Style: ${aesthetic.name}. Lighting: ${aesthetic.lightingStyle}. Color Palette: ${aesthetic.colorPalette}. Camera: ${aesthetic.cameraSpec}. Composition: Minimalist editorial background with 60% soft low-contrast negative space for 3 benefit bullets and CTA button overlay. No text or watermarks.`,
      negative_prompt: DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: '4:5',
      imagen_model: 'imagen-3.0-generate-002',
      composition_guide: '중앙 60% 저대비 클린 영역 확보 (benefits_3 및 CTA 버튼 가독성 최적화)'
    }
  ];
}

export const SOCIAL_SUITE_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  required: [
    'campaign_meta',
    'slides_5',
    'caption',
    'compliance_check',
    'reels_15s',
    'xiaohongshu_7',
    'x_thread_3',
    'threads_post'
  ],
  properties: {
    campaign_meta: {
      type: Type.OBJECT,
      required: ['axis', 'lang', 'new_biz_quota_safe', 'marketer_persona', 'applied_jp_preset'],
      properties: {
        axis: { type: Type.STRING, description: 'HOTPLACE | STAY | K_BEAUTY | KPOP_NEWS' },
        lang: { type: Type.STRING, description: 'JP | EN | CN | KR' },
        new_biz_quota_safe: { type: Type.BOOLEAN },
        marketer_persona: {
          type: Type.STRING,
          description: 'JP: 유키·유코 / EN: 윤서 / CN: 샤오홍슈 수석 에디터 / KR: 글로벌 컨시어지 디렉터'
        },
        applied_jp_preset: {
          type: Type.STRING,
          description: '적용된 일본어 5대 합법 프리셋 문구 (JP가 아닐 경우 N/A)'
        }
      }
    },
    slides_5: {
      type: Type.ARRAY,
      description:
        '인스타그램 5장 카루셀 배열. 반드시 길이 5 (1: cover, 2: body SPOT 01, 3: body SPOT 02, 4: body SPOT 03, 5: cta). 모든 텍스트와 각 슬라이드별 현지 원어민 감성 Imagen 이미지 생성 프롬프트(imagen_prompt, visual_aesthetic)를 빈 문자열 없이 100% 채울 것.',
      items: {
        type: Type.OBJECT,
        required: [
          'slide_no',
          'type',
          'badge',
          'headline',
          'highlight_line',
          'sub',
          'spot_badge',
          'title',
          'row1_loc',
          'row2_point',
          'row3_tip',
          'benefits_3',
          'cta_button',
          'trigger_keyword',
          'footer',
          'visual_aesthetic',
          'imagen_prompt',
          'negative_prompt',
          'aspect_ratio'
        ],
        properties: {
          slide_no: { type: Type.INTEGER, description: '1, 2, 3, 4, 5 순서' },
          type: { type: Type.STRING, description: '1번은 cover, 2~4번은 body, 5번은 cta' },
          badge: {
            type: Type.STRING,
            description: 'Slide 1 상단 배지 문구'
          },
          headline: {
            type: Type.STRING,
            description: 'Slide 1 메인 헤드라인 (타깃 언어로 필수 번역 입력)'
          },
          highlight_line: {
            type: Type.STRING,
            description:
              'Slide 1 핵심 하이라이트 문구. JP일 경우 일본어 5대 합법 프리셋 원문 필수 포함'
          },
          sub: {
            type: Type.STRING,
            description: 'Slide 1 보조 설명 문구 (타깃 언어로 필수 번역 입력)'
          },
          spot_badge: {
            type: Type.STRING,
            description: 'Slide 2는 SPOT 01, Slide 3은 SPOT 02, Slide 4는 SPOT 03'
          },
          title: {
            type: Type.STRING,
            description: 'Slide 2~4 각 스팟의 대표 타이틀 (반드시 타깃 언어로 번역하여 입력)'
          },
          row1_loc: {
            type: Type.STRING,
            description: 'Slide 2~4 위치 및 전용 송영/접근성 정보 (반드시 타깃 언어로 번역)'
          },
          row2_point: {
            type: Type.STRING,
            description: 'Slide 2~4 컨시어지 핵심 포인트 (반드시 타깃 언어로 번역)'
          },
          row3_tip: {
            type: Type.STRING,
            description: 'Slide 2~4 현지 인사이더 이용 팁 (반드시 타깃 언어로 번역)'
          },
          benefits_3: {
            type: Type.ARRAY,
            description: 'Slide 5의 핵심 혜택 3가지 문자열 배열 (반드시 타깃 언어로 3개 항목 채울 것)',
            items: { type: Type.STRING }
          },
          cta_button: {
            type: Type.STRING,
            description: 'Slide 5 행동 유도 버튼 문구 (타깃 언어로 필수 작성)'
          },
          trigger_keyword: {
            type: Type.STRING,
            description: 'Slide 5 댓글 자동응답 트리거 키워드 (타깃 언어로 필수 작성)'
          },
          footer: {
            type: Type.STRING,
            description: '항상 @gttourkorea | https://tr.ee/dSpLdDtiGW 고정'
          },
          visual_aesthetic: {
            type: Type.STRING,
            description:
              '슬라이드별 타깃 언어 원어민 감성 비주얼 디렉션 요약 (예: JP 도쿄 에디토리얼 자연광 감성 / EN 킨포크 트와일라잇 감성 / CN 샤오홍슈 즈차오 포토존 감성)'
          },
          imagen_prompt: {
            type: Type.STRING,
            description:
              'Imagen 3 툴 연동용 고해상도 이미지 생성 프롬프트 (카메라·조명·색감·구도·여백·6대 법률 가드레일 비주얼 준수 사항 포함)'
          },
          negative_prompt: {
            type: Type.STRING,
            description:
              'Imagen 생성 시 배제할 요소 (의료 시술 도구, 티켓 바코드, 워터마크, 텍스트 깨짐 등)'
          },
          aspect_ratio: {
            type: Type.STRING,
            description: '인스타그램 카루셀 권장 비율 (4:5 | 1:1 | 3:4)'
          }
        }
      }
    },
    caption: {
      type: Type.STRING,
      description:
        '원어민 톤앤매너 본문 + 댓글 트리거 + 프로필 링크(https://tr.ee/dSpLdDtiGW) + 현지 인기 해시태그 (타깃 언어로 100% 번역)'
    },
    compliance_check: {
      type: Type.OBJECT,
      required: [
        'medical_law_passed',
        'performance_law_passed',
        'advertising_law_passed',
        'detected_risk_words'
      ],
      properties: {
        medical_law_passed: { type: Type.BOOLEAN },
        performance_law_passed: { type: Type.BOOLEAN },
        advertising_law_passed: { type: Type.BOOLEAN },
        detected_risk_words: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    reels_15s: {
      type: Type.ARRAY,
      description: '15초 릴스 타임라인 대본 (0-3s Hook, 3-10s Body, 10-15s CTA)',
      items: {
        type: Type.OBJECT,
        required: ['time_range', 'phase', 'visual_direction', 'narration', 'on_screen_text'],
        properties: {
          time_range: { type: Type.STRING, description: '00:00-00:03 | 00:03-00:10 | 00:10-00:15' },
          phase: { type: Type.STRING, description: 'HOOK | BODY | CTA' },
          visual_direction: { type: Type.STRING },
          narration: { type: Type.STRING },
          on_screen_text: { type: Type.STRING }
        }
      }
    },
    xiaohongshu_7: {
      type: Type.OBJECT,
      description: '샤오홍슈 7장 패키지 (CN 타깃 시 풀 생성, 타 언어 시 요약본 제공)',
      required: ['enabled', 'note_title', 'slides_7', 'xhs_tags'],
      properties: {
        enabled: { type: Type.BOOLEAN },
        note_title: { type: Type.STRING },
        slides_7: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ['page_no', 'section_tag', 'main_copy', 'detail_bullet'],
            properties: {
              page_no: { type: Type.INTEGER },
              section_tag: { type: Type.STRING },
              main_copy: { type: Type.STRING },
              detail_bullet: { type: Type.STRING }
            }
          }
        },
        xhs_tags: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    x_thread_3: {
      type: Type.OBJECT,
      description:
        'X (@enjoywithkorea 전용) 3단 스레드: Tweet 1(K-POP/트렌드 브레이킹 뉴스 훅) -> Tweet 2(해외 팬 방문 팁 & 성지순례/스팟 동선 정보) -> Tweet 3(GT TOUR 도보 5분 Verified Stay·심야 안전 송영 컨시어지 & 프로필 링크 유도)',
      required: ['handle', 'tweets', 'trend_hashtags'],
      properties: {
        handle: {
          type: Type.STRING,
          description: '항상 @enjoywithkorea 고정'
        },
        tweets: {
          type: Type.ARRAY,
          description: '3단 트윗 배열 (반드시 길이 3)',
          items: {
            type: Type.OBJECT,
            required: ['tweet_no', 'role', 'content'],
            properties: {
              tweet_no: { type: Type.INTEGER, description: '1, 2, 3' },
              role: {
                type: Type.STRING,
                description: 'HOOK_BREAKING_NEWS | FAN_TIP_AND_ROUTE | CONCIERGE_BRIDGE_CTA'
              },
              content: {
                type: Type.STRING,
                description: '타깃 언어로 작성된 트윗 본문 (280자 이내, 공연법 준수)'
              }
            }
          }
        },
        trend_hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    },
    threads_post: {
      type: Type.OBJECT,
      description:
        'Threads (@gttourkorea 전용) 포스트: 스레드 특유의 친근하고 트렌디한 팬덤 대화체 본문 + 팬들의 댓글 참여를 유도하는 질문(Engagement Question) + 공연법 준수 컨시어지 브릿지 및 프로필 링크',
      required: [
        'handle',
        'topic_tag',
        'body_text',
        'engagement_question',
        'concierge_bridge'
      ],
      properties: {
        handle: {
          type: Type.STRING,
          description: '항상 @gttourkorea 고정'
        },
        topic_tag: {
          type: Type.STRING,
          description: 'Threads 대표 토픽 태그 (예: K-POP Tour · Seoul Concierge)'
        },
        body_text: {
          type: Type.STRING,
          description: '친근하고 트렌디한 팬덤 대화체 본문 (타깃 언어로 작성)'
        },
        engagement_question: {
          type: Type.STRING,
          description: '팬들의 댓글 참여를 유도하는 질문 (Engagement Question, 타깃 언어로 작성)'
        },
        concierge_bridge: {
          type: Type.STRING,
          description:
            '공연장·팝업 인근 도보 5분 Verified Stay·심야 송영 연결 문구 + 프로필 링크(https://tr.ee/dSpLdDtiGW)'
        }
      }
    }
  }
};

// X (@enjoywithkorea) 3단 스레드 및 Threads (@gttourkorea) 기본 생성 헬퍼
function buildXAndThreadsFallback(params: {
  axis: CampaignAxis;
  lang: TargetLang;
  spot1: string;
  spot2: string;
  spot3: string;
  newsHeadline: string;
  jpPreset: string;
}) {
  const { axis, lang, spot1, spot2, spot3, newsHeadline, jpPreset } = params;
  const isKpop = axis === 'KPOP_NEWS';

  if (lang === 'JP') {
    return {
      x_thread_3: {
        handle: X_CHANNEL_HANDLE,
        tweets: [
          {
            tweet_no: 1,
            role: 'HOOK_BREAKING_NEWS',
            content: isKpop
              ? `【韓国K-POP最新速報🇰🇷】${newsHeadline}✨ 渡韓予定のファンの皆さん、会場アクセスと聖地巡礼ルートはもうチェックしましたか？👇`
              : `【ソウル最新トレンド速報🇰🇷】今話題の「${spot1}」「${spot2}」「${spot3}」を1日で巡る黄金ルートを公開✨👇`
          },
          {
            tweet_no: 2,
            role: 'FAN_TIP_AND_ROUTE',
            content: `💡海外ファン向け動線TIP：\n① ${spot1}（混雑前の午前〜昼チェックイン＆周辺待機が快適）\n② ${spot2}（専用車移動なら荷物預かりのまま直行OK）\n③ ${spot3}（終演後・夜でも安心のエリア）`
          },
          {
            tweet_no: 3,
            role: 'CONCIERGE_BRIDGE_CTA',
            content: `「${jpPreset}」🌙\nGT TOURなら会場・ポップアップ徒歩5分圏内のVerified Stay手配＆深夜安全送迎・聖地巡礼の動線ケアまで一括サポート！\n🔗詳細：https://tr.ee/dSpLdDtiGW`
          }
        ],
        trend_hashtags: isKpop
          ? ['#KPOP渡韓', '#韓国ライブ遠征', '#ソウル聖地巡礼', '#推し活韓国', '#enjoywithkorea', '#GTTOUR']
          : ['#韓国旅行', '#ソウルトレンド', '#韓国ホテル', '#ソウルコンシェルジュ', '#enjoywithkorea', '#GTTOUR']
      },
      threads_post: {
        handle: THREADS_CHANNEL_HANDLE,
        topic_tag: isKpop ? 'K-POP遠征・推し活コンシェルジュ' : 'ソウル旅コンシェルジュ',
        body_text: isKpop
          ? `ねぇ聞いて…！今回のソウル遠征（${newsHeadline}）、終演後の地下鉄大混雑やポップアップ待機で体力削られたくないよね🥹✨\n\n会場から徒歩5分で帰れるVerifiedホテルと、聖地巡礼カフェ（${spot2}・${spot3}）まで専用車でスムーズに回れる動線があったら最高じゃない？`
          : `正直、ソウル旅行で一番疲れるのって「言葉の壁」と「移動・荷物問題」だったりしない？🥹✨\n\n「${spot1}」から「${spot2}」「${spot3}」まで、待ち時間ゼロで回れたら1日の充実度がぜんぜん違うよね！`,
        engagement_question: isKpop
          ? 'みんなが今回の渡韓・推し活で一番行きたい聖地スポットや会場はどこ？リプで教えて〜！💬👇'
          : 'みんなが次のソウル旅で絶対外せないエリアはどこ？コメントで教えてね💬👇',
        concierge_bridge: `「${jpPreset}」✨ 会場徒歩5分の厳選ステイ＆深夜送迎・聖地巡礼動線ケアはプロフィールのリンクからいつでも相談してね ➔ https://tr.ee/dSpLdDtiGW (@gttourkorea)`
      }
    };
  }

  if (lang === 'EN') {
    return {
      x_thread_3: {
        handle: X_CHANNEL_HANDLE,
        tweets: [
          {
            tweet_no: 1,
            role: 'HOOK_BREAKING_NEWS',
            content: isKpop
              ? `🚨 [K-POP SEOUL UPDATE] ${newsHeadline}! Flying into Seoul for the show & pop-ups? Here is the ultimate stress-free fan route thread 🧵👇`
              : `✨ [SEOUL INSIDER THREAD] Planning to visit ${spot1}, ${spot2}, and ${spot3}? Here is how to experience all 3 with zero waiting time 🧵👇`
          },
          {
            tweet_no: 2,
            role: 'FAN_TIP_AND_ROUTE',
            content: `📍 Overseas Fan Route Tips:\n1️⃣ ${spot1}: Beat the late-night crowd by securing a walkable stay nearby.\n2️⃣ ${spot2}: Store your merch & luggage in a private van while exploring.\n3️⃣ ${spot3}: Wrap up with late-night dining & safe drop-off.`
          },
          {
            tweet_no: 3,
            role: 'CONCIERGE_BRIDGE_CTA',
            content: `Skip the last-train panic after the encore! 🌙\nGT TOUR provides 5-Min Walk Verified Stays near venues, late-night private transfers & K-POP pilgrimage route care.\n🔗 Plan your route: https://tr.ee/dSpLdDtiGW`
          }
        ],
        trend_hashtags: isKpop
          ? ['#KPOPinSeoul', '#SeoulConcertTrip', '#KPOPPilgrimage', '#KoreaTravelTips', '#enjoywithkorea', '#GTTOUR']
          : ['#SeoulTravel', '#VisitKorea', '#SeoulConcierge', '#LuxurySeoul', '#enjoywithkorea', '#GTTOUR']
      },
      threads_post: {
        handle: THREADS_CHANNEL_HANDLE,
        topic_tag: isKpop ? 'K-POP Concert & Pilgrimage Concierge' : 'Seoul Travel Concierge',
        body_text: isKpop
          ? `Be honest—nothing hits harder than post-concert exhaustion when thousands of fans are crowding the subway station at 11 PM 😭✨\n\nWith ${newsHeadline} happening in Seoul, imagine walking just 5 minutes to your Verified Hotel or hopping into a private van straight after hitting ${spot2} and ${spot3}!`
          : `Unpopular opinion: You shouldn't spend half your Seoul trip figuring out taxi apps and luggage lockers 😭✨\n\nHitting ${spot1}, ${spot2}, and ${spot3} with a 1:1 bilingual concierge and private van feels like unlocking Seoul on VIP mode.`,
        engagement_question: isKpop
          ? 'Which K-POP concert venue, pop-up store, or artist spot is #1 on your Seoul bucket list this year? Drop it below! 💬👇'
          : 'Which Seoul neighborhood is at the top of your wishlist right now? Tell us in the replies! 💬👇',
        concierge_bridge: `Secure your 5-Min Walk Verified Stay, late-night concert drop-off & pilgrimage route care via our bio link ➔ https://tr.ee/dSpLdDtiGW (@gttourkorea)`
      }
    };
  }

  if (lang === 'CN') {
    return {
      x_thread_3: {
        handle: X_CHANNEL_HANDLE,
        tweets: [
          {
            tweet_no: 1,
            role: 'HOOK_BREAKING_NEWS',
            content: isKpop
              ? `🔥【首尔K-POP最新速报】${newsHeadline}！准备飞首尔看演出&打卡同款的宝子们，这份零踩雷动线攻略必看🧵👇`
              : `✨【首尔高定出行攻略】想一天轻松打卡 ${spot1}、${spot2}、${spot3}？这份零语言障碍动线请收好🧵👇`
          },
          {
            tweet_no: 2,
            role: 'FAN_TIP_AND_ROUTE',
            content: `💡海外粉丝动线建议：\n① ${spot1}：散场后地铁极度拥挤，提前锁定步行5分钟圈内酒店最省力\n② ${spot2}：周边快闪店血拼后可将战利品直接放进随行专车\n③ ${spot3}：打卡同款餐厅后专车安全护送回房`
          },
          {
            tweet_no: 3,
            role: 'CONCIERGE_BRIDGE_CTA',
            content: `拒绝散场后深夜打车难！🌙\nGT TOUR 提供演出场馆步行5分钟严选Verified酒店、深夜安全专车接送及爱豆同款打卡全程路线管家。\n🔗定制行程：https://tr.ee/dSpLdDtiGW`
          }
        ],
        trend_hashtags: isKpop
          ? ['#首尔演唱会', '#韩国追星攻略', '#KPOP圣地巡礼', '#首尔快闪店', '#enjoywithkorea', '#GTTOUR']
          : ['#首尔旅行', '#韩国自由行', '#首尔私人管家', '#首尔酒店', '#enjoywithkorea', '#GTTOUR']
      },
      threads_post: {
        handle: THREADS_CHANNEL_HANDLE,
        topic_tag: isKpop ? '首尔追星·演出现场安心管家' : '首尔私人定制管家',
        body_text: isKpop
          ? `说真的，去首尔看演出最崩溃的瞬间绝对是散场后一万个人在寒风里抢出租车吧😭✨\n\n这次 ${newsHeadline}，如果散场步行5分钟就能直接回严选酒店躺平，白天还能坐专车去 ${spot2} 和 ${spot3} 轻松打卡，幸福感真的拉满！`
          : `来首尔自由行最怕的就是预约不通、拎着大包小包找路😭✨\n\n把 ${spot1}、${spot2}、${spot3} 交给1对1中文管家和专属商务车，只管美美拍照真的太爽了！`,
        engagement_question: isKpop
          ? '今年你最想去首尔看哪场演唱会或打卡哪个爱豆同款地标？评论区聊聊！💬👇'
          : '下次来首尔你最想打卡哪个街区？在评论区告诉我吧！💬👇',
        concierge_bridge: `场馆步行5分钟严选酒店＋深夜安全接送＋同款打卡动线规划，点击主页链接立即咨询 ➔ https://tr.ee/dSpLdDtiGW (@gttourkorea)`
      }
    };
  }

  // KR
  return {
    x_thread_3: {
      handle: X_CHANNEL_HANDLE,
      tweets: [
        {
          tweet_no: 1,
          role: 'HOOK_BREAKING_NEWS',
          content: isKpop
            ? `🚨 [K-POP 서울 브레이킹 뉴스] ${newsHeadline}! 서울 원정 관람 및 팝업·성지순례를 준비 중인 글로벌 팬들을 위한 완벽 동선 타래 🧵👇`
            : `✨ [서울 프리미엄 컨시어지 노트] ${spot1} · ${spot2} · ${spot3}, 대기 시간 없이 하루 만에 완벽히 즐기는 동선 타래 🧵👇`
        },
        {
          tweet_no: 2,
          role: 'FAN_TIP_AND_ROUTE',
          content: `💡 글로벌 방문객 핵심 동선 TIP:\n1️⃣ ${spot1}: 공연·행사 직후 심야 대중교통 혼잡을 피하는 도보 5분권 동선 확보\n2️⃣ ${spot2}: 굿즈·쇼핑백은 전용 차량에 보관하고 두 손 가볍게 이동\n3️⃣ ${spot3}: 아티스트 성지순례 카페 & 심야 다이닝까지 막힘없는 연결`
        },
        {
          tweet_no: 3,
          role: 'CONCIERGE_BRIDGE_CTA',
          content: `공연 끝나고 막차 걱정 끝! 🌙\nGT TOUR가 [공연장·팝업 도보 5분 Verified Stay + 심야 안전 송영 + 팬덤 성지순례 동선 케어]를 전담 지원합니다.\n🔗 맞춤 동선 상담: https://tr.ee/dSpLdDtiGW`
        }
      ],
      trend_hashtags: isKpop
        ? ['#KPOP뉴스', '#서울콘서트스테이', '#성지순례투어', '#올림픽공원숙소', '#enjoywithkorea', '#GTTOUR']
        : ['#GTTOUR', '#서울컨시어지', '#프리미엄스테이', '#인바운드여행', '#enjoywithkorea']
    },
    threads_post: {
      handle: THREADS_CHANNEL_HANDLE,
      topic_tag: isKpop ? 'K-POP 성지순례 & 콘서트 스테이 컨시어지' : '서울 프라이빗 컨시어지',
      body_text: isKpop
        ? `솔직히 콘서트 앙코르까지 다 보고 나왔는데 밤 11시에 택시도 안 잡히고 지하철 인파에 갇히면 여운이고 뭐고 너무 힘들잖아요 😭✨\n\n이번 ${newsHeadline} 시즌에는 공연장 도보 5분 Verified 숙소에서 여유롭게 체크인하고, 낮에는 전용 차량으로 ${spot2} 팝업이랑 ${spot3} 성지순례 카페까지 편하게 돌아보세요!`
        : `서울 일정 짤 때 예약 전화 돌리고 짐 들고 이동하는 게 제일 지치지 않나요? 😭✨\n\n${spot1}부터 ${spot2}, ${spot3}까지 전담 통역 매니저와 전용 리무진으로 이어지는 1:1 컨시어지 동선을 경험해 보세요.`,
      engagement_question: isKpop
        ? '올해 여러분이 가장 가고 싶은 K-POP 콘서트장이나 최애 성지순례 스팟은 어디인가요? 댓글로 알려주세요! 💬👇'
        : '이번 서울 방문에서 가장 기대되는 스팟은 어디인가요? 댓글로 공유해 주세요! 💬👇',
      concierge_bridge: `공연장·팝업 도보 5분 Verified Stay & 심야 안전 송영·성지순례 동선 케어는 프로필 링크에서 바로 확인하세요 ➔ https://tr.ee/dSpLdDtiGW (@gttourkorea)`
    }
  };
}

// 언어 및 캠페인 축에 따른 완벽한 기본값 생성기 (빈칸 0% + JP/EN/CN 완벽 번역 + KPOP_NEWS 브릿지 보장)
export function buildCompleteSuiteFallback(params: {
  axis?: CampaignAxis;
  lang?: TargetLang;
  spots?: string[];
  jpPresetCopy?: string;
  customMemo?: string;
  kpopNewsSummary?: string;
  detectedRisks?: string[];
}) {
  const axis: CampaignAxis = params.axis || 'K_BEAUTY';
  const lang: TargetLang = params.lang || 'JP';
  const isKpop = axis === 'KPOP_NEWS';

  const defaultSpots = isKpop
    ? [
        'KSPO DOME 도보 5분 Verified 스테이',
        '성수 K-POP 공식 팝업스토어',
        '용산 하이브 인근 아티스트 성지순례 카페'
      ]
    : ['청담 프라이빗 라운지', '성수 플래그십 스토어', '한남 브런치 다이닝'];

  const rawSpots =
    Array.isArray(params.spots) && params.spots.filter(Boolean).length > 0
      ? params.spots.filter(Boolean)
      : defaultSpots;

  const krSpot1 = rawSpots[0] || defaultSpots[0];
  const krSpot2 = rawSpots[1] || defaultSpots[1];
  const krSpot3 = rawSpots[2] || defaultSpots[2];

  const rawNewsSummary =
    params.kpopNewsSummary ||
    'KSPO DOME 월드투어 콘서트 및 성수 공식 팝업스토어 오픈 확정';

  // 타깃 언어로 완벽히 번역된 스팟명 & 뉴스 헤드라인
  const spot1 = localizeTextToTargetLang(krSpot1, lang);
  const spot2 = localizeTextToTargetLang(krSpot2, lang);
  const spot3 = localizeTextToTargetLang(krSpot3, lang);
  const newsHeadline = localizeTextToTargetLang(rawNewsSummary, lang);

  // 샤오홍슈용 중국어 번역 스팟명
  const cnSpot1 = localizeTextToTargetLang(krSpot1, 'CN');
  const cnSpot2 = localizeTextToTargetLang(krSpot2, 'CN');
  const cnSpot3 = localizeTextToTargetLang(krSpot3, 'CN');

  const jpPreset =
    params.jpPresetCopy ||
    (isKpop ? '終電を気にせず過ごせます' : '言葉の心配なく、予定を整えます');
  const detectedRisks = params.detectedRisks || [];

  const socialChannels = buildXAndThreadsFallback({
    axis,
    lang,
    spot1,
    spot2,
    spot3,
    newsHeadline,
    jpPreset
  });

  const slideImagenSpecs = buildSlideImagenPrompts({
    axis,
    lang,
    spot1,
    spot2,
    spot3,
    newsHeadline
  });

  if (lang === 'JP') {
    return {
      campaign_meta: {
        axis,
        lang: 'JP',
        new_biz_quota_safe: true,
        marketer_persona: '유키·유코 (일본 인바운드 & K-POP 팬덤 수석 마케터)',
        applied_jp_preset: jpPreset
      },
      slides_5: [
        {
          ...slideImagenSpecs[0],
          slide_no: 1,
          type: 'cover',
          badge: isKpop ? 'GT TOUR · K-POP NEWS & CONCIERGE' : `GT TOUR · ${axis} CONCIERGE`,
          headline: isKpop
            ? `【K-POP渡韓速報】${newsHeadline}｜会場徒歩5分ステイ＆聖地巡礼ケア`
            : `初めてのソウル${axis === 'STAY' ? 'プレミアム滞在' : axis === 'HOTPLACE' ? 'トレンド散策' : 'ウェルネス旅'}、予約も移動もすべてお任せ`,
          highlight_line: `「${jpPreset}」`,
          sub: isKpop
            ? '公演日の徒歩5分Verifiedホテル・深夜安全送迎・ポップアップ＆聖地巡礼の動線コンシェルジュ'
            : '空港VIP送迎から専任通訳同行・厳選ステイ手配までGT TOURが一括サポート'
        },
        {
          ...slideImagenSpecs[1],
          slide_no: 2,
          type: 'body',
          spot_badge: 'SPOT 01',
          title: isKpop
            ? `${spot1} — 公演会場・イベント隣接Verified Stay`
            : `${spot1} — 専任コンシェルジュ予約＆同行`,
          row1_loc: `ソウル主要エリア（${spot1} · 専用リムジン送迎対応）`,
          row2_point: isKpop
            ? `「${jpPreset}」アンコール終了後も混雑知らずで徒歩5分圏内の厳選ホテルへ帰着`
            : `「${jpPreset}」事前ヒアリングから当日の日本語通訳同行までスムーズに手配`,
          row3_tip: 'スケジュール前後の荷物・グッズ預かり＆専用車移動で、待ち時間や移動疲れゼロ'
        },
        {
          ...slideImagenSpecs[2],
          slide_no: 3,
          type: 'body',
          spot_badge: 'SPOT 02',
          title: isKpop
            ? `${spot2} — 公式ポップアップ＆推し活ショッピング動線`
            : `${spot2} — 言葉の壁なしで楽しむトレンド体験`,
          row1_loc: `${spot2}（SPOT 01から専用車で約15分・直行ルート）`,
          row2_point: '「買い物も食事も、言葉なしで」現場ウェイティング登録や免税・注文も同行サポート',
          row3_tip: '購入したグッズやショッパーは専用車に預けて、手ぶらで次の聖地スポットへ移動可能'
        },
        {
          ...slideImagenSpecs[3],
          slide_no: 4,
          type: 'body',
          spot_badge: 'SPOT 03',
          title: isKpop
            ? `${spot3} — アーティスト聖地巡礼カフェ＆深夜送迎ケア`
            : `${spot3} — ゆったり休めるVerified Stay＆ダイニング`,
          row1_loc: `${spot3}（徒歩5分圏内の厳選ホテル連携エリア）`,
          row2_point: '「ゆっくり休める場所を用意します」推し活後の余韻を楽しめる落ち着いた空間を事前確保',
          row3_tip: '深夜の移動やホテルチェックイン手続きまで24時間日本語コンシェルジュデスクが安心ケア'
        },
        {
          ...slideImagenSpecs[4],
          slide_no: 5,
          type: 'cta',
          benefits_3: [
            `「${jpPreset}」会場・イベント徒歩5分圏内のVerified Stay手配`,
            '「到着から宿まで、待ち時間なし」空港〜会場〜聖地スポット専用車送迎',
            '「買い物も食事も、言葉なしで」ポップアップ＆聖地巡礼1:1日本語同行ケア'
          ],
          cta_button: 'プロフィールのリンクから渡韓・聖地巡礼プラン相談へ',
          trigger_keyword: isKpop ? '推し活日程' : 'ソウル日程',
          footer: FIXED_GTTOUR_FOOTER
        }
      ],
      caption: isKpop
        ? `【K-POP渡韓情報✨】${newsHeadline}に合わせてソウル遠征を計画中ですか？\n\nGT TOURなら「${jpPreset}」。\n「${spot1}」の会場徒歩5分Verified Stay手配から、「${spot2}」「${spot3}」を巡る聖地巡礼＆深夜の安全送迎まで専任コンシェルジュがすべてサポートします。\n\n📌 コメント欄に【推し活日程】と入力していただければ、遠征＆聖地巡礼動線ガイドをDMでお送りします！\n🔗 詳細・ご相談はプロフィールリンクから：https://tr.ee/dSpLdDtiGW\n\n#KPOP渡韓 #韓国ライブ遠征 #ソウル聖地巡礼 #推し活韓国 #GTTOUR #enjoywithkorea`
        : `韓国での「${spot1}」「${spot2}」「${spot3}」巡り、予約や移動のハードルで迷っていませんか？✨\n\nGT TOURなら「${jpPreset}」。\n空港からの専用車ピックアップから、各スポットのスケジュール調整・通訳同行、ゆっくり休めるVerified Stayまで専任コンシェルジュがすべて整えます。\n\n📌 コメント欄に【ソウル日程】と入力していただければ、オーダーメイド動線ガイドをDMでお送りします！\n🔗 詳細・ご相談はプロフィールリンクから：https://tr.ee/dSpLdDtiGW\n\n#韓国旅行 #ソウル旅行 #ソウルコンシェルジュ #韓国ホテル #GTTOUR #韓国女子旅`,
      compliance_check: {
        medical_law_passed: true,
        performance_law_passed: true,
        advertising_law_passed: true,
        detected_risk_words: detectedRisks
      },
      reels_15s: [
        {
          time_range: '00:00-00:03',
          phase: 'HOOK',
          visual_direction: isKpop
            ? 'コンサート会場の夜景ペンライト風景から徒歩5分ホテルへ快適に向かうVLOGカット'
            : '仁川空港到着ゲートから専用リムジンに乗り込む洗練されたVLOG視点カット',
          narration: isKpop
            ? `${newsHeadline}！ライブ後の終電や移動、まだ心配してる？`
            : '韓国でのスケジュール手配、まだ自分で全部調べてるの？',
          on_screen_text: `「${jpPreset}」✨`
        },
        {
          time_range: '00:03-00:10',
          phase: 'BODY',
          visual_direction: `${spot1} ➔ ${spot2} ➔ ${spot3} へのシームレスな専用車移動＆同行シーン`,
          narration: `${spot1}のステイ手配も、${spot2}や${spot3}の聖地巡礼ルートもすべて専任マネージャーにお任せ。`,
          on_screen_text: `01 ${spot1} ➔ 02 ${spot2} ➔ 03 ${spot3}`
        },
        {
          time_range: '00:10-00:15',
          phase: 'CTA',
          visual_direction: '夜景の見えるVerified Stay客室でくつろぐシーン＋プロフィールリンク誘導カード',
          narration: `コメントに「${isKpop ? '推し活日程' : 'ソウル日程'}」と送って、あなただけの専用プランを受け取ってね。`,
          on_screen_text: `コメント【${isKpop ? '推し活日程' : 'ソウル日程'}】｜@gttourkorea`
        }
      ],
      xiaohongshu_7: INITIAL_DEMO_XHS(cnSpot1, cnSpot2, cnSpot3),
      ...socialChannels
    };
  }

  if (lang === 'EN') {
    return {
      campaign_meta: {
        axis,
        lang: 'EN',
        new_biz_quota_safe: true,
        marketer_persona: '윤서 (Yoonseo · Global English Chief Marketer)',
        applied_jp_preset: 'N/A'
      },
      slides_5: [
        {
          ...slideImagenSpecs[0],
          slide_no: 1,
          type: 'cover',
          badge: isKpop ? 'GT TOUR · K-POP NEWS & CONCIERGE' : `GT TOUR · ${axis} CONCIERGE`,
          headline: isKpop
            ? `${newsHeadline} — 5-Min Walk Stay & K-POP Pilgrimage Concierge`
            : `Effortless Seoul ${axis === 'STAY' ? 'Verified Stay' : axis === 'HOTPLACE' ? 'Curated Hotspots' : 'Wellness & Beauty'} Concierge`,
          highlight_line: isKpop
            ? 'Zero Last-Train Stress · Venue-Adjacent Verified Stays & Private Van'
            : 'Zero Language Barrier, Seamless Private Transfers & Verified Stays',
          sub: 'From Incheon Airport VIP pickup to 1:1 bilingual interpreter & curated route care'
        },
        {
          ...slideImagenSpecs[1],
          slide_no: 2,
          type: 'body',
          spot_badge: 'SPOT 01',
          title: `${spot1} — Venue-Adjacent Verified Stay & Mobility Care`,
          row1_loc: `Prime Seoul District (${spot1} · Private Chauffeur Access)`,
          row2_point:
            'Walk back to your Verified Stay in 5 minutes or take a dedicated late-night shuttle with zero crowd stress',
          row3_tip: 'Luggage & official merch storage arranged in your private van throughout the day'
        },
        {
          ...slideImagenSpecs[2],
          slide_no: 3,
          type: 'body',
          spot_badge: 'SPOT 02',
          title: `${spot2} — Official Pop-Up & Tax-Free Shopping Route`,
          row1_loc: `${spot2} (15 mins via GT TOUR dedicated limousine)`,
          row2_point:
            'Enjoy pop-up stores and flagship boutiques without queue confusion or language hurdles',
          row3_tip: 'Your dedicated manager assists with on-site registration and instant tax-refund'
        },
        {
          ...slideImagenSpecs[3],
          slide_no: 4,
          type: 'body',
          spot_badge: 'SPOT 03',
          title: `${spot3} — Artist Pilgrimage Spot & Late-Night Dining`,
          row1_loc: `${spot3} (Connected to GT TOUR Verified Partner Hotels)`,
          row2_point:
            'Visit iconic artist pilgrimage cafes and unwind with late-night safe drop-off to your hotel',
          row3_tip: '24/7 English concierge desk ready for any show-day schedule adjustments'
        },
        {
          ...slideImagenSpecs[4],
          slide_no: 5,
          type: 'cta',
          benefits_3: [
            '5-Min Walk Verified Partner Hotels Near Major Concert Venues',
            'Door-to-Door Airport, Pop-Up & Late-Night Show Safe Van Transfer',
            '1:1 English Concierge for K-POP Pilgrimage & Dining Routes'
          ],
          cta_button: 'Tap Link in Bio for Your Custom Seoul Fan Route',
          trigger_keyword: isKpop ? 'KPOPTRIP' : 'SEOULVIP',
          footer: FIXED_GTTOUR_FOOTER
        }
      ],
      caption: isKpop
        ? `[K-POP SEOUL BRIEFING ✨] Heading to Seoul for ${newsHeadline}?\n\nSkip the late-night subway chaos! GT TOUR coordinates your 5-minute walk Verified Stay at ${spot1}, private van transfers to ${spot2} and ${spot3}, and 1:1 bilingual route care.\n\n📌 Comment [KPOPTRIP] below to get our Seoul Concert & Pilgrimage Route Guide via DM!\n🔗 Book via Link in Bio: https://tr.ee/dSpLdDtiGW\n\n#KPOPinSeoul #SeoulConcert #KoreaConcierge #SeoulItinerary #enjoywithkorea #GTTOUR`
        : `Planning your Seoul trip across ${spot1}, ${spot2}, and ${spot3}? Skip the stress of reservations and language barriers. ✨\n\nGT TOUR coordinates your private airport transfer, 1:1 bilingual concierge, and 5-minute walk Verified Stays so you can focus entirely on your experience.\n\n📌 Comment [SEOULVIP] below to receive our tailored Seoul route guide via DM!\n🔗 Book via Link in Bio: https://tr.ee/dSpLdDtiGW\n\n#SeoulTravel #KoreaConcierge #SeoulItinerary #LuxurySeoul #KoreaTrip #GTTOUR`,
      compliance_check: {
        medical_law_passed: true,
        performance_law_passed: true,
        advertising_law_passed: true,
        detected_risk_words: detectedRisks
      },
      reels_15s: [
        {
          time_range: '00:00-00:03',
          phase: 'HOOK',
          visual_direction: 'POV stepping out of the concert venue directly into a private luxury van',
          narration: isKpop
            ? `Flying to Seoul for ${newsHeadline}? Don't get stuck in post-show traffic!`
            : 'Still booking your Seoul wellness and hotspot itinerary the hard way?',
          on_screen_text: '5-Min Walk Verified Stay · Seamless Seoul Concierge ✨'
        },
        {
          time_range: '00:03-00:10',
          phase: 'BODY',
          visual_direction: `Smooth cuts of ${spot1}, pop-up visit at ${spot2}, and pilgrimage cafe at ${spot3}`,
          narration: `From ${spot1} check-in to ${spot2} and ${spot3}, our private concierge handles every detail.`,
          on_screen_text: `SPOT 01 ${spot1} ➔ SPOT 02 ${spot2} ➔ SPOT 03 ${spot3}`
        },
        {
          time_range: '00:10-00:15',
          phase: 'CTA',
          visual_direction: 'Relaxing inside a 5-min walk Verified Stay suite overlooking Seoul',
          narration: `Comment ${isKpop ? 'KPOPTRIP' : 'SEOULVIP'} and let GT TOUR plan your effortless trip.`,
          on_screen_text: `Comment [${isKpop ? 'KPOPTRIP' : 'SEOULVIP'}] | @gttourkorea`
        }
      ],
      xiaohongshu_7: INITIAL_DEMO_XHS(cnSpot1, cnSpot2, cnSpot3),
      ...socialChannels
    };
  }

  if (lang === 'CN') {
    return {
      campaign_meta: {
        axis,
        lang: 'CN',
        new_biz_quota_safe: true,
        marketer_persona: '샤오홍슈 수석 에디터 (XHS Chief Editor)',
        applied_jp_preset: 'N/A'
      },
      slides_5: [
        {
          ...slideImagenSpecs[0],
          slide_no: 1,
          type: 'cover',
          badge: isKpop ? 'GT TOUR · 首尔追星与管家速报' : `GT TOUR · 首尔私人管家`,
          headline: isKpop
            ? `【K-POP首尔速报】${newsHeadline}｜场馆步行5分钟酒店＆同款打卡全包`
            : `第一次来首尔？行程预约、专车接送与翻译全包！`,
          highlight_line: '「零语言障碍 · 场馆步行5分钟严选住宿与深夜专车接送」',
          sub: `串联 ${spot1} · ${spot2} · ${spot3} 的高定私人管家服务`
        },
        {
          ...slideImagenSpecs[1],
          slide_no: 2,
          type: 'body',
          spot_badge: 'SPOT 01',
          title: `${spot1} — 场馆毗邻严选住宿与散场安心接送`,
          row1_loc: `首尔核心区（${spot1} · 专属商务车直达）`,
          row2_point: '无需担心演出散场后末班车停运，步行5分钟回房或专车安全接送',
          row3_tip: '随行行李与周边商品可直接寄存于专车内，轻松开启下一站打卡'
        },
        {
          ...slideImagenSpecs[2],
          slide_no: 3,
          type: 'body',
          spot_badge: 'SPOT 02',
          title: `${spot2} — 官方快闪店与无障碍购物体验`,
          row1_loc: `${spot2}（距上一站仅15分钟车程）`,
          row2_point: '逛快闪店与买手店无需担心韩语沟通，管家全程协助取号、点单与现场退税',
          row3_tip: '为您规划最佳拍照与逛街动线，避开拥挤高峰期'
        },
        {
          ...slideImagenSpecs[3],
          slide_no: 4,
          type: 'body',
          spot_badge: 'SPOT 03',
          title: `${spot3} — 艺人同款打卡餐厅与步行5分钟严选酒店`,
          row1_loc: `${spot3}（毗邻GT TOUR严选Verified Stay合作酒店）`,
          row2_point: '为您预约艺人同款咖啡厅与安静舒适的用餐空间，夜间专车安全护送回酒店',
          row3_tip: '24小时中文管家在线响应，随时支援您的临时行程需求'
        },
        {
          ...slideImagenSpecs[4],
          slide_no: 5,
          type: 'cta',
          benefits_3: [
            '严选场馆步行5分钟可达品质酒店，夜间散场安心无忧',
            '仁川/金浦机场至快闪店、打卡点及酒店全程VIP专车接送',
            '1对1专职中文管家陪同，同款圣地巡礼与用餐预约零障碍'
          ],
          cta_button: '点击主页链接，免费定制您的首尔追星与出行方案',
          trigger_keyword: isKpop ? '首尔追星' : '首尔行程',
          footer: FIXED_GTTOUR_FOOTER
        }
      ],
      caption: isKpop
        ? `【首尔K-POP速报✨】${newsHeadline}！准备来首尔看演出、逛快闪店吗？\n\nGT TOUR 为您提供 ${spot1} 步行5分钟严选酒店预订、${spot2} 与 ${spot3} 专车串联打卡，以及深夜安全接送与1对1中文管家服务。\n\n📌 在评论区留言【首尔追星】，立即私信发送专属场馆住宿与同款打卡路线指南！\n🔗 主页链接预约咨询：https://tr.ee/dSpLdDtiGW\n\n#首尔演唱会 #韩国追星 #KPOP圣地巡礼 #首尔私人管家 #enjoywithkorea #GTTOUR`
        : `来首尔打卡 ${spot1}、${spot2}、${spot3}，还在为预约和交通头疼吗？✨\n\nGT TOUR 为您提供从机场VIP接机、1对1专职翻译陪同，到严选步行5分钟可达酒店的全程管家服务，让您零语言障碍畅游首尔！\n\n📌 在评论区留言【首尔行程】，立即私信发送专属定制路线指南！\n🔗 主页链接预约咨询：https://tr.ee/dSpLdDtiGW\n\n#首尔旅行 #韩国自由行 #首尔私人管家 #韩国探店 #首尔酒店 #GTTOUR`,
      compliance_check: {
        medical_law_passed: true,
        performance_law_passed: true,
        advertising_law_passed: true,
        detected_risk_words: detectedRisks
      },
      reels_15s: [
        {
          time_range: '00:00-00:03',
          phase: 'HOOK',
          visual_direction: '走出演出场馆或仁川机场即刻登上专属豪华商务车的第一视角镜头',
          narration: isKpop
            ? `${newsHeadline}！来首尔看演出还在担心散场打不到车吗？`
            : '来首尔旅行，还在自己熬夜做攻略订车吗？',
          on_screen_text: '场馆步行5分钟酒店 · 首尔私人管家全包体验 ✨'
        },
        {
          time_range: '00:03-00:10',
          phase: 'BODY',
          visual_direction: `${spot1} 入住 ➔ ${spot2} 快闪店打卡 ➔ ${spot3} 同款咖啡厅的流畅转场`,
          narration: `无论是 ${spot1} 住宿安排、${spot2} 探店，还是 ${spot3} 同款打卡，专属管家全程随行。`,
          on_screen_text: `01 ${spot1} ➔ 02 ${spot2} ➔ 03 ${spot3}`
        },
        {
          time_range: '00:10-00:15',
          phase: 'CTA',
          visual_direction: '在视野开阔的严选酒店客房内俯瞰首尔夜景＋主页链接引导卡',
          narration: `评论区留言“${isKpop ? '首尔追星' : '首尔行程'}”，马上领取你的1对1定制方案！`,
          on_screen_text: `评论留言【${isKpop ? '首尔追星' : '首尔行程'}】｜@gttourkorea`
        }
      ],
      xiaohongshu_7: INITIAL_DEMO_XHS(cnSpot1, cnSpot2, cnSpot3),
      ...socialChannels
    };
  }

  // KR 기본값
  return {
    campaign_meta: {
      axis,
      lang: 'KR',
      new_biz_quota_safe: true,
      marketer_persona: '글로벌 컨시어지 디렉터',
      applied_jp_preset: 'N/A'
    },
    slides_5: [
      {
        ...slideImagenSpecs[0],
        slide_no: 1,
        type: 'cover',
        badge: isKpop ? 'GT TOUR · K-POP NEWS & CONCIERGE' : `GT TOUR · ${axis} CONCIERGE`,
        headline: isKpop
          ? `[K-POP 브레이킹] ${newsHeadline} — 도보 5분 스테이 & 성지순례 케어`
          : '복잡한 예약과 이동 걱정 없는 프라이빗 서울 컨시어지',
        highlight_line: isKpop
          ? '「공연 관람일 도보 5분 Verified 숙소 · 심야 안전 송영 · 팬덤 성지순례 동선 케어」'
          : '「공항 도착부터 숙소 체크인까지, 대기 시간 제로 1:1 전담 케어」',
        sub: `${spot1} · ${spot2} · ${spot3} 맞춤 동선 설계 및 다국어 통역·전용 차량 지원`
      },
      {
        ...slideImagenSpecs[1],
        slide_no: 2,
        type: 'body',
        spot_badge: 'SPOT 01',
        title: isKpop
          ? `${spot1} — 공연장 인접 도보 5분 숙소 & 심야 송영 케어`
          : `${spot1} — 사전 일정 조율 및 전담 매니저 동행`,
        row1_loc: `서울 핵심 권역 (${spot1} · 전용 리무진 Door-to-Door 픽업)`,
        row2_point: isKpop
          ? '공연 종료 후 막차·택시 대란 걱정 없이 도보 5분 Verified 숙소 복귀 및 심야 전용차량 송영 지원'
          : '방문 전 스케줄 조율부터 현장 다국어 통역 동행까지 막힘없는 컨시어지 케어',
        row3_tip: '일정 전후 수하물·응원봉·굿즈 보관 및 전용 차량 대기로 이동 피로도 최소화'
      },
      {
        ...slideImagenSpecs[2],
        slide_no: 3,
        type: 'body',
        spot_badge: 'SPOT 02',
        title: isKpop
          ? `${spot2} — 공식 팝업스토어 & 럭키드로우 동선 케어`
          : `${spot2} — 웨이팅·언어 장벽 없는 라이프스타일 투어`,
        row1_loc: `${spot2} (SPOT 01에서 전용 차량 15분 이동)`,
        row2_point: '현장 웨이팅 등록, 다국어 통역, 택스리펀드까지 전담 매니저가 세심하게 동행 지원',
        row3_tip: '혼잡 시간대를 피한 프라이빗 추천 동선으로 여유로운 팝업 관람 가능'
      },
      {
        ...slideImagenSpecs[3],
        slide_no: 4,
        type: 'body',
        spot_badge: 'SPOT 03',
        title: isKpop
          ? `${spot3} — 아티스트 성지순례 코스 & 안심 다이닝`
          : `${spot3} — 편안한 휴식 다이닝 & 도보 5분 Verified Stay`,
        row1_loc: `${spot3} (GT TOUR 검증 도보 5분권 파트너 호텔 연계)`,
        row2_point: '아티스트 방문 성지순례 카페·다이닝 예약부터 심야 숙소 안전 귀가까지 책임 케어',
        row3_tip: '체크인부터 레이트 체크아웃 조율까지 24시간 전담 컨시어지 핫라인 운영'
      },
      {
        ...slideImagenSpecs[4],
        slide_no: 5,
        type: 'cta',
        benefits_3: [
          '공연 관람일 도보 5분 Verified 숙소 확보 및 심야 안전 송영 케어',
          '공항 픽업부터 팝업스토어·성지순례 스팟 간 전용 리무진 이동',
          '1:1 다국어 전담 매니저의 팬덤 성지순례·다이닝 일정 조율'
        ],
        cta_button: '프로필 링크에서 K-POP 성지순례 & 스테이 동선 상담하기',
        trigger_keyword: isKpop ? '성지순례동선' : '서울컨시어지',
        footer: FIXED_GTTOUR_FOOTER
      }
    ],
    caption: isKpop
      ? `[K-POP 뉴스 & 컨시어지 브리핑 ✨] ${newsHeadline} 소식 확인하셨나요?\n\nGT TOUR의 프라이빗 컨시어지로 ${spot1} 도보 5분 숙소부터 ${spot2}, ${spot3} 성지순례 전용 차량 동선과 심야 안전 송영까지 한 번에 준비하세요.\n\n📌 댓글에 [성지순례동선]을 남겨주시면 맞춤 공연장 숙소 & 성지순례 루트 가이드를 DM으로 보내드립니다!\n🔗 프로필 링크 바로가기: https://tr.ee/dSpLdDtiGW\n\n#GTTOUR #KPOP성지순례 #콘서트숙소 #올림픽공원스테이 #성수팝업 #enjoywithkorea`
      : `${spot1}, ${spot2}, ${spot3}까지 이어지는 완벽한 하루, 일정 조율과 이동은 GT TOUR에 맡기세요. ✨\n\n공항 VIP 픽업부터 1:1 전담 통역 매니저 동행, 도보 5분 거리의 Verified Stay 숙소까지 세심한 프라이빗 컨시어지 서비스를 제공합니다.\n\n📌 댓글에 [서울컨시어지]를 남겨주시면 맞춤 동선 가이드북을 DM으로 보내드립니다!\n🔗 프로필 링크 바로가기: https://tr.ee/dSpLdDtiGW\n\n#GTTOUR #서울컨시어지 #인바운드여행 #프리미엄스테이 #서울여행코스`,
    compliance_check: {
      medical_law_passed: true,
      performance_law_passed: true,
      advertising_law_passed: true,
      detected_risk_words: detectedRisks
    },
    reels_15s: [
      {
        time_range: '00:00-00:03',
        phase: 'HOOK',
        visual_direction: '공연장 야경과 응원봉 물결 컷에서 도보 5분 호텔 스위트룸으로 전환되는 샷',
        narration: isKpop
          ? `${newsHeadline}! 콘서트 끝나고 심야 귀가와 성지순례 동선, 어떻게 준비하셨나요?`
          : '서울 방문 일정, 아직도 복잡한 예약과 이동 때문에 고민이신가요?',
        on_screen_text: '공연장 도보 5분 Verified Stay · GT TOUR 컨시어지 ✨'
      },
      {
        time_range: '00:03-00:10',
        phase: 'BODY',
        visual_direction: `${spot1} 체크인 ➔ ${spot2} 팝업 투어 ➔ ${spot3} 성지순례 카페 컷 전환`,
        narration: `${spot1} 도보권 숙소부터 ${spot2}, ${spot3} 전용 차량 이동과 통역까지 1:1로 케어합니다.`,
        on_screen_text: `SPOT 01 ${spot1} ➔ SPOT 02 ${spot2} ➔ SPOT 03 ${spot3}`
      },
      {
        time_range: '00:10-00:15',
        phase: 'CTA',
        visual_direction: '도보 5분 Verified Stay 객실 야경 뷰 + 프로필 링크 안내 카드',
        narration: `댓글에 ${isKpop ? '성지순례동선' : '서울컨시어지'}을 남기고 나만의 맞춤 일정을 받아보세요.`,
        on_screen_text: `댓글 [${isKpop ? '성지순례동선' : '서울컨시어지'}] | @gttourkorea`
      }
    ],
    xiaohongshu_7: INITIAL_DEMO_XHS(cnSpot1, cnSpot2, cnSpot3),
    ...socialChannels
  };
}

function INITIAL_DEMO_XHS(cnSpot1: string, cnSpot2: string, cnSpot3: string) {
  return {
    enabled: true,
    note_title: `首尔${cnSpot1}×${cnSpot2}×${cnSpot3}✨零语言障碍的私人管家定制之旅｜GT TOUR`,
    slides_7: [
      {
        page_no: 1,
        section_tag: 'COVER · 定制管家',
        main_copy: '第一次来首尔看演出&逛街？住宿接送翻译全包！',
        detail_bullet: `从仁川机场VIP接机到 ${cnSpot1}、${cnSpot2}、${cnSpot3} 全动线无缝衔接`
      },
      {
        page_no: 2,
        section_tag: `SPOT 01 · ${cnSpot1}`,
        main_copy: `${cnSpot1} 场馆毗邻住宿与私密日程协调`,
        detail_bullet: '无需担心语言不通，1对1专职翻译陪同与日程精细规划'
      },
      {
        page_no: 3,
        section_tag: `SPOT 02 · ${cnSpot2}`,
        main_copy: `${cnSpot2} 官方快闪店&热门买手店免排队动线`,
        detail_bullet: '专车直达核心街区，退税与点餐全程贴心协助'
      },
      {
        page_no: 4,
        section_tag: `SPOT 03 · ${cnSpot3}`,
        main_copy: `${cnSpot3} 艺人同款打卡与静谧露台餐饮`,
        detail_bullet: '为您预订舒适放松的用餐环境，避开人潮安心享受'
      },
      {
        page_no: 5,
        section_tag: 'VERIFIED STAY · 安心住宿',
        main_copy: '精选步行5分钟可达的品质休养酒店',
        detail_bullet: '宽敞静谧客房+专属接送，不用担心末班车与夜间出行'
      },
      {
        page_no: 6,
        section_tag: 'VIP CONCIERGE · 管家服务',
        main_copy: '从抵达机场到入住酒店，零等待体验',
        detail_bullet: '行李托管、专车随行、多语言管家实时响应'
      },
      {
        page_no: 7,
        section_tag: 'CTA · 立即预约',
        main_copy: '评论区留言【首尔行程】获取1对1定制方案',
        detail_bullet: FIXED_GTTOUR_FOOTER
      }
    ],
    xhs_tags: [
      '#首尔旅行',
      '#韩国追星攻略',
      '#KPOP圣地巡礼',
      '#圣水洞探店',
      '#首尔演唱会住宿',
      '#首尔私人管家',
      '#GTTOUR'
    ]
  };
}

// Gemini 응답 또는 외부 JSON에 빈 필드가 있거나 한국어가 섞여 있을 경우 100% 타깃 언어로 채워주는 정규화 함수 (X, Threads & Imagen Spec 포함)
export function ensureCompleteSuiteData(
  raw: any,
  context?: {
    axis?: CampaignAxis;
    lang?: TargetLang;
    spots?: string[];
    jpPresetCopy?: string;
    customMemo?: string;
    kpopNewsSummary?: string;
    detectedRisks?: string[];
  }
) {
  const axis: CampaignAxis =
    (raw?.campaign_meta?.axis as CampaignAxis) || context?.axis || 'K_BEAUTY';
  const lang: TargetLang = (raw?.campaign_meta?.lang as TargetLang) || context?.lang || 'JP';

  const fallback = buildCompleteSuiteFallback({
    axis,
    lang,
    spots: context?.spots,
    jpPresetCopy:
      context?.jpPresetCopy ||
      (raw?.campaign_meta?.applied_jp_preset && raw.campaign_meta.applied_jp_preset !== 'N/A'
        ? raw.campaign_meta.applied_jp_preset
        : axis === 'KPOP_NEWS'
          ? '終電を気にせず過ごせます'
          : '言葉の心配なく、予定を整えます'),
    customMemo: context?.customMemo,
    kpopNewsSummary: context?.kpopNewsSummary,
    detectedRisks: context?.detectedRisks
  });

  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const rawSlides = Array.isArray(raw.slides_5) ? raw.slides_5 : [];

  const completeSlides = fallback.slides_5.map((fbSlide: any, idx: number) => {
    const s =
      rawSlides.find((item: any) => Number(item?.slide_no) === idx + 1) ||
      rawSlides[idx] ||
      {};

    const imagenFields = {
      slide_role: fbSlide.slide_role || (idx === 0 ? 'COVER' : idx === 4 ? 'CTA' : `SPOT_0${idx}`),
      visual_aesthetic: nonEmptyStr(s.visual_aesthetic, fbSlide.visual_aesthetic),
      imagen_prompt: nonEmptyStr(s.imagen_prompt, fbSlide.imagen_prompt),
      negative_prompt: nonEmptyStr(
        s.negative_prompt,
        fbSlide.negative_prompt || DEFAULT_IMAGEN_NEGATIVE_PROMPT
      ),
      aspect_ratio: nonEmptyStr(s.aspect_ratio, fbSlide.aspect_ratio || '4:5'),
      imagen_model: nonEmptyStr(s.imagen_model, fbSlide.imagen_model || 'imagen-3.0-generate-002'),
      composition_guide: nonEmptyStr(s.composition_guide, fbSlide.composition_guide || ''),
      generated_image_url:
        typeof s.generated_image_url === 'string' ? s.generated_image_url : ''
    };

    if (idx === 0) {
      return {
        slide_no: 1,
        type: 'cover',
        badge: nonEmptyTargetStr(s.badge, fbSlide.badge, lang),
        headline: nonEmptyTargetStr(s.headline || s.title, fbSlide.headline, lang),
        highlight_line: nonEmptyTargetStr(
          s.highlight_line || s.row2_point,
          fbSlide.highlight_line,
          lang
        ),
        sub: nonEmptyTargetStr(s.sub || s.row3_tip, fbSlide.sub, lang),
        ...imagenFields
      };
    }

    if (idx === 4) {
      const rawBenefits = Array.isArray(s.benefits_3)
        ? s.benefits_3.filter((b: any) => typeof b === 'string' && b.trim().length > 0)
        : [];
      const completeBenefits = [
        nonEmptyTargetStr(rawBenefits[0], fbSlide.benefits_3[0], lang),
        nonEmptyTargetStr(rawBenefits[1], fbSlide.benefits_3[1], lang),
        nonEmptyTargetStr(rawBenefits[2], fbSlide.benefits_3[2], lang)
      ];

      return {
        slide_no: 5,
        type: 'cta',
        benefits_3: completeBenefits,
        cta_button: nonEmptyTargetStr(
          s.cta_button || s.headline || s.title,
          fbSlide.cta_button,
          lang
        ),
        trigger_keyword: nonEmptyTargetStr(
          s.trigger_keyword || s.badge,
          fbSlide.trigger_keyword,
          lang
        ),
        footer: FIXED_GTTOUR_FOOTER,
        ...imagenFields
      };
    }

    return {
      slide_no: idx + 1,
      type: 'body',
      spot_badge: nonEmptyStr(s.spot_badge || s.badge, `SPOT 0${idx}`),
      title: nonEmptyTargetStr(s.title || s.headline, fbSlide.title, lang),
      row1_loc: nonEmptyTargetStr(s.row1_loc || s.sub, fbSlide.row1_loc, lang),
      row2_point: nonEmptyTargetStr(
        s.row2_point || s.highlight_line,
        fbSlide.row2_point,
        lang
      ),
      row3_tip: nonEmptyTargetStr(s.row3_tip, fbSlide.row3_tip, lang),
      ...imagenFields
    };
  });

  const rawReels = Array.isArray(raw.reels_15s) ? raw.reels_15s : [];
  const completeReels = fallback.reels_15s.map((fbCut: any, idx: number) => {
    const c = rawReels[idx] || {};
    return {
      time_range: nonEmptyStr(c.time_range, fbCut.time_range),
      phase: nonEmptyStr(c.phase, fbCut.phase),
      visual_direction: nonEmptyTargetStr(
        c.visual_direction,
        fbCut.visual_direction,
        lang
      ),
      narration: nonEmptyTargetStr(c.narration, fbCut.narration, lang),
      on_screen_text: nonEmptyTargetStr(c.on_screen_text, fbCut.on_screen_text, lang)
    };
  });

  const rawXhsSlides = Array.isArray(raw.xiaohongshu_7?.slides_7)
    ? raw.xiaohongshu_7.slides_7
    : [];
  const completeXhsSlides = fallback.xiaohongshu_7.slides_7.map((fbPage: any, idx: number) => {
    const p = rawXhsSlides[idx] || {};
    return {
      page_no: idx + 1,
      section_tag: nonEmptyTargetStr(p.section_tag, fbPage.section_tag, 'CN'),
      main_copy: nonEmptyTargetStr(p.main_copy, fbPage.main_copy, 'CN'),
      detail_bullet: nonEmptyTargetStr(p.detail_bullet, fbPage.detail_bullet, 'CN')
    };
  });

  // X (@enjoywithkorea) 3단 스레드 정규화
  const rawTweets = Array.isArray(raw.x_thread_3?.tweets) ? raw.x_thread_3.tweets : [];
  const completeTweets = fallback.x_thread_3.tweets.map((fbTweet: any, idx: number) => {
    const t =
      rawTweets.find((item: any) => Number(item?.tweet_no) === idx + 1) ||
      rawTweets[idx] ||
      {};
    return {
      tweet_no: idx + 1,
      role: nonEmptyStr(t.role, fbTweet.role),
      content: nonEmptyTargetStr(t.content, fbTweet.content, lang)
    };
  });

  // Threads (@gttourkorea) 포스트 정규화
  const rawThreads = raw.threads_post || {};
  const completeThreadsPost = {
    handle: THREADS_CHANNEL_HANDLE,
    topic_tag: nonEmptyTargetStr(
      rawThreads.topic_tag,
      fallback.threads_post.topic_tag,
      lang
    ),
    body_text: nonEmptyTargetStr(
      rawThreads.body_text,
      fallback.threads_post.body_text,
      lang
    ),
    engagement_question: nonEmptyTargetStr(
      rawThreads.engagement_question,
      fallback.threads_post.engagement_question,
      lang
    ),
    concierge_bridge: nonEmptyTargetStr(
      rawThreads.concierge_bridge,
      fallback.threads_post.concierge_bridge,
      lang
    )
  };

  return {
    campaign_meta: {
      axis,
      lang,
      new_biz_quota_safe: Boolean(raw.campaign_meta?.new_biz_quota_safe ?? true),
      marketer_persona: nonEmptyStr(
        raw.campaign_meta?.marketer_persona,
        fallback.campaign_meta.marketer_persona
      ),
      applied_jp_preset: nonEmptyStr(
        raw.campaign_meta?.applied_jp_preset,
        fallback.campaign_meta.applied_jp_preset
      )
    },
    slides_5: completeSlides,
    caption: nonEmptyTargetStr(raw.caption, fallback.caption, lang),
    compliance_check: {
      medical_law_passed: Boolean(raw.compliance_check?.medical_law_passed ?? true),
      performance_law_passed: Boolean(raw.compliance_check?.performance_law_passed ?? true),
      advertising_law_passed: Boolean(raw.compliance_check?.advertising_law_passed ?? true),
      detected_risk_words: Array.from(
        new Set([
          ...(Array.isArray(raw.compliance_check?.detected_risk_words)
            ? raw.compliance_check.detected_risk_words
            : []),
          ...(context?.detectedRisks || [])
        ])
      )
    },
    reels_15s: completeReels,
    xiaohongshu_7: {
      enabled: Boolean(raw.xiaohongshu_7?.enabled ?? true),
      note_title: nonEmptyTargetStr(
        raw.xiaohongshu_7?.note_title,
        fallback.xiaohongshu_7.note_title,
        'CN'
      ),
      slides_7: completeXhsSlides,
      xhs_tags:
        Array.isArray(raw.xiaohongshu_7?.xhs_tags) && raw.xiaohongshu_7.xhs_tags.length > 0
          ? raw.xiaohongshu_7.xhs_tags
          : fallback.xiaohongshu_7.xhs_tags
    },
    x_thread_3: {
      handle: X_CHANNEL_HANDLE,
      tweets: completeTweets,
      trend_hashtags:
        Array.isArray(raw.x_thread_3?.trend_hashtags) &&
        raw.x_thread_3.trend_hashtags.length > 0
          ? raw.x_thread_3.trend_hashtags
          : fallback.x_thread_3.trend_hashtags
    },
    threads_post: completeThreadsPost
  };
}

function nonEmptyStr(val: any, fallbackVal: string): string {
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.trim();
  }
  return fallbackVal;
}

// JP/EN/CN일 때 텍스트 내부에 남아있는 한국어 스팟명이나 치환 문구를 해당 타깃 언어로 자동 번역 후 반환
function nonEmptyTargetStr(val: any, fallbackVal: string, lang: TargetLang): string {
  const base = nonEmptyStr(val, fallbackVal);
  if (lang === 'KR') return base;
  if (/[가-힣]/.test(base)) {
    const localized = localizeTextToTargetLang(base, lang);
    return localized.length > 0 ? localized : fallbackVal;
  }
  return base;
}

// Strict Schema 추출기 (외부 자동화 파이프라인 연동용 - 프롬프트 필수 4키 구조 100% 일치)
export function toStrictSchema(fullOutput: any) {
  const complete = ensureCompleteSuiteData(fullOutput);

  const strictSlides = complete.slides_5.map((s: any, index: number) => {
    const slideNo = index + 1;
    if (slideNo === 1) {
      return {
        slide_no: 1,
        type: 'cover',
        badge: s.badge,
        headline: s.headline,
        highlight_line: s.highlight_line,
        sub: s.sub,
        visual_aesthetic: s.visual_aesthetic,
        imagen_prompt: s.imagen_prompt
      };
    }
    if (slideNo === 5) {
      return {
        slide_no: 5,
        type: 'cta',
        benefits_3: s.benefits_3,
        cta_button: s.cta_button,
        trigger_keyword: s.trigger_keyword,
        footer: FIXED_GTTOUR_FOOTER,
        visual_aesthetic: s.visual_aesthetic,
        imagen_prompt: s.imagen_prompt
      };
    }
    return {
      slide_no: slideNo,
      type: 'body',
      spot_badge: s.spot_badge,
      title: s.title,
      row1_loc: s.row1_loc,
      row2_point: s.row2_point,
      row3_tip: s.row3_tip,
      visual_aesthetic: s.visual_aesthetic,
      imagen_prompt: s.imagen_prompt
    };
  });

  return {
    campaign_meta: {
      axis: complete.campaign_meta.axis,
      lang: complete.campaign_meta.lang,
      new_biz_quota_safe: Boolean(complete.campaign_meta.new_biz_quota_safe)
    },
    slides_5: strictSlides,
    caption: complete.caption,
    compliance_check: {
      medical_law_passed: Boolean(complete.compliance_check.medical_law_passed),
      performance_law_passed: Boolean(complete.compliance_check.performance_law_passed),
      detected_risk_words: complete.compliance_check.detected_risk_words
    }
  };
}

// Antigravity Imagen Tool 연동 전용 배치 페이로드 추출기
export function exportImagenToolPayload(suiteData: any) {
  const complete = ensureCompleteSuiteData(suiteData);
  const lang = (complete.campaign_meta?.lang as TargetLang) || 'JP';
  const aesthetic = NATIVE_VISUAL_AESTHETICS[lang] || NATIVE_VISUAL_AESTHETICS.JP;

  return {
    tool_integration: 'ANTIGRAVITY_IMAGEN_BRIDGE_V1',
    channel: '@gttourkorea (Instagram 5-Slide Carousel)',
    campaign_meta: complete.campaign_meta,
    native_aesthetic_profile: aesthetic,
    imagen_config: {
      model: 'imagen-3.0-generate-002',
      fallback_model: 'gemini-3.1-flash-lite-image',
      default_aspect_ratio: '4:5',
      safety_filter_level: 'block_low_and_above',
      person_generation: 'allow_adult',
      legal_visual_guardrail_passed:
        complete.compliance_check.medical_law_passed &&
        complete.compliance_check.performance_law_passed
    },
    slide_requests: complete.slides_5.map((s: any, idx: number) => ({
      slide_no: idx + 1,
      slide_type: s.type,
      overlay_title: s.headline || s.title || s.cta_button,
      visual_aesthetic: s.visual_aesthetic,
      prompt: s.imagen_prompt,
      negative_prompt: s.negative_prompt || DEFAULT_IMAGEN_NEGATIVE_PROMPT,
      aspect_ratio: s.aspect_ratio || '4:5',
      composition_guide: s.composition_guide || ''
    }))
  };
}

// Antigravity Bridge API: 외부 JSON 주입(Import) 파서 및 정규화
export function parseBridgePayload(rawJson: string): {
  type: 'SUITE_DATA' | 'CAMPAIGN_INPUT';
  payload: any;
} {
  const parsed = JSON.parse(rawJson);

  if (parsed && (parsed.campaign_meta || Array.isArray(parsed.slides_5))) {
    return {
      type: 'SUITE_DATA',
      payload: ensureCompleteSuiteData(parsed)
    };
  }

  if (parsed && (parsed.axis || parsed.spots || parsed.lang)) {
    return {
      type: 'CAMPAIGN_INPUT',
      payload: {
        axis: parsed.axis || 'K_BEAUTY',
        lang: parsed.lang || 'JP',
        spots: Array.isArray(parsed.spots) ? parsed.spots.join(', ') : parsed.spots || '',
        selectedJpPresetId: parsed.selectedJpPresetId || 'jp_preset_1',
        customMemo: parsed.customMemo || '',
        kpopNewsSummary: parsed.kpopNewsSummary || ''
      }
    };
  }

  throw new Error(
    '유효한 Antigravity Bridge JSON 형식이 아닙니다. campaign_meta+slides_5 또는 axis+lang+spots 구조를 입력해 주세요.'
  );
}

export const INITIAL_DEMO_SUITE = buildCompleteSuiteFallback({
  axis: 'K_BEAUTY',
  lang: 'JP',
  spots: ['청담 프라이빗 라운지', '성수 플래그십 스토어', '한남 브런치 다이닝'],
  jpPresetCopy: '言葉の心配なく、予定を整えます'
});
