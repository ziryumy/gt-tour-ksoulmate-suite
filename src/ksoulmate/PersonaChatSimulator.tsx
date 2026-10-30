import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Volume2,
  MapPin,
  Sparkles,
  ExternalLink,
  Smartphone,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Compass,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import type { Member } from "./types";

export type ChatPlatformSkin = "LINE" | "WHATSAPP" | "WEB_IP";
export type ChatLanguage = "JP" | "EN" | "KR" | "CN";

export interface PersonaChatMessage {
  id: string;
  sender: "FAN" | "MEMBER";
  memberId: string;
  timestamp: string;
  text: string;
  memeOrSlangTag?: string;
  koreanPhrase?: string;
  pronunciationTip?: string;
  localMapCard?: {
    title: string;
    routeSummary: string;
    passCode: string;
    passName: string;
    spot: string;
  };
}

interface PersonaChatSimulatorProps {
  members: Member[];
  onExportToGtStudio?: (payload: {
    episodeNo: number;
    episodeTitle: string;
    place: string;
    expressions: string[];
    complianceRisk: boolean;
    channelCode: string;
    narration: string;
    memberName?: string;
  }) => void;
}

const PERSONA_TABS = [
  {
    id: "M1",
    tabLabel: "M1 한지후 · 무심한 츤데레 로컬 해결사",
    shortRole: "심야 이동·막차·로컬 시스템 총괄",
    anchorBadge: "🚇 Anchor 1: 심야 이동·막차·로컬 시스템 총괄",
    greetingByLang: {
      JP: "まだ会場の前？タクシー捕まらないから、 올림픽공원역じゃなくて몽촌토성역（モンチョントソン駅）の方へ5分歩いて。地図送っておいた。",
      EN: "Still stuck outside the dome? Don't wait at Olympic Park Station. Walk 5 mins toward Mongchontoseong Station—I already pinned the pickup spot for you.",
      KR: "아직 공연장 앞이야? 거기 택시 안 잡혀. 올림픽공원역 말고 몽촌토성역 쪽으로 5분만 걸어나와. 지도 찍어놨어.",
      CN: "还在场馆外面？那边打不到车的，别去奥林匹克公园站，往梦村土城站走5分钟，我把定位发你了。",
    },
  },
  {
    id: "M2",
    tabLabel: "M2 이든 박 · 하이텐션 성수 인사이더 친구",
    shortRole: "성수·한남 웨이팅·키오스크·짐 보관",
    anchorBadge: "🔥 Anchor 2: 성수·한남 웨이팅·키오스크·짐 보관",
    greetingByLang: {
      JP: "Yo! 聖水（ソンス）のポップアップ着いた？010番号なくても大丈夫！タブレット右下の『Global』ボタンを押してメール登録すれば1位で入れるよ🔥",
      EN: "Yo! Made it to Seongsu? No 010 Korean number? No stress! Tap the 'Global' button at the bottom-right of the CatchTable kiosk and use your email! 🔥",
      KR: "Yo! 성수 팝업 도착했어? 010 번호 없어도 멘붕 금지! 태블릿 우측 하단 'Global' 버튼 누르고 이메일 입력하면 오픈런 1등 가능이야 🔥",
      CN: "Yo！到圣水洞快闪店了吗？没有010韩国手机号也别慌！点平板右下角的Global按钮用邮箱就能排第一名🔥",
    },
  },
  {
    id: "M3",
    tabLabel: "M3 린위하오 · 다정한 청담 뷰티·감성 멘토",
    shortRole: "청담 K-뷰티·웰니스·약국·호구 방지",
    anchorBadge: "💄 Anchor 3: 청담 K-뷰티·웰니스·약국·호구 방지",
    greetingByLang: {
      JP: "清潭（チョンダム）のサロンやクリニック、緊張するよね。僕が作った『正面・横顔・肌トーン3枚シート』と『VAT込み定額チェック文』を見せれば安心だよ✨",
      EN: "Nervous at a Cheongdam salon or clinic? Just show them my 3-photo reference sheet and ask if VAT is included in the fixed price. You'll glow! ✨",
      KR: "청담 숍이나 클리닉 갈 때 긴장되지? 내가 정리해둔 '정면·옆모습·피부톤 3장 공식'이랑 '부가세(VAT) 포함 정찰제 확인 문장'만 보여주면 호구 안 잡혀 ✨",
      CN: "去清潭洞做造型或皮肤管理很紧张吧？把我的『正侧颜3张参考图公式』和『含税明码标价确认句』拿给店长看就稳了✨",
    },
  },
  {
    id: "M4",
    tabLabel: "M4 하루토 · 공감 100% 다정한 막내 메이트",
    shortRole: "로컬 식당·카페·오시카츠 성지순례",
    anchorBadge: "🍱 Anchor 4: 로컬 식당·카페·오시카츠 성지순례",
    greetingByLang: {
      JP: "今日ソウル氷点下なのに、ジフ兄さんまたアイスアメリカーノ飲んでる…これが韓国の『얼죽아（オルジュガ）』なんだって！一緒に聖水のセンカ回ろう☕",
      EN: "It's freezing in Seoul today, and Ji-hu hyung is still drinking iced Americano... They call it 'Eol-juk-a'! Let's hit the Seongsu birthday cafes together ☕",
      KR: "오늘 영하 5도인데 지후 형 또 아이스 아메리카노 마시고 있어… 이게 한국의 '얼죽아'래! 우리 같이 성수 생일카페(센카) 투어 가자 ☕",
      CN: "今天首尔零下5度，智厚哥居然还在喝冰美式…这就是韩国的『冻死也要喝冰美式(얼죽아)』！我们一起去圣水洞逛应援咖啡厅吧☕",
    },
  },
  {
    id: "M5",
    tabLabel: "M5 아이만 · 유쾌한 3개국어 할랄·맵찔이 구조대",
    shortRole: "할랄·비건·맵기 방어·다문화 생존",
    anchorBadge: "🌍 Anchor 5: 할랄·비건·맵기 방어·다문화 생존",
    greetingByLang: {
      JP: "韓国の社長さんの『全然辛くないよ』は絶対信じちゃダメ😂！『唐辛子粉とコショウを全部抜いて醤油ベースにしてください』って一緒に言ってみよう！",
      EN: "Never trust a Korean restaurant owner's 'Not spicy at all'! 😂 Say: 'No chili powder or pepper, soy-sauce base please!' and keep Coolpis ready!",
      KR: "한국 사장님의 '전혀 안 매워요'는 절대 믿으면 안 돼 😂! '고춧가루랑 후추 아예 빼고 간장 베이스로 해주세요'라고 말하면 맵찔이도 완벽 생존이야!",
      CN: "千万别信韩国老板说的『一点都不辣』😂！跟我念：『请完全不要放辣椒粉和胡椒，做成酱油口味』，再配一瓶Coolpis就得救啦！",
    },
  },
] as const;

interface DemoScenario {
  id: string;
  buttonLabel: string;
  memberId: string;
  messages: PersonaChatMessage[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "DEMO_JIHU_NIGHT",
    buttonLabel: "🚇 시나리오 1: 지후 × KSPO돔 심야 콘서트 택시·막차 탈출 SOS",
    memberId: "M1",
    messages: [
      {
        id: "d1-1",
        sender: "FAN",
        memberId: "M1",
        timestamp: "23:12",
        text: "지후 오빠, 지금 KSPO돔 콘서트 끝났는데 밤 11시 반이라 택시도 안 잡히고 사람에 깔릴 것 같아요😭 올콘 뛰고 숙소 못 가는 거 아니겠죠?",
      },
      {
        id: "d1-2",
        sender: "MEMBER",
        memberId: "M1",
        timestamp: "23:12",
        text: "올콘하느라 고생했네. 거기 올림픽공원역 입구는 지금 2만 명 몰려서 40분 넘게 걸려. 당황하지 말고 한얼교 건너서 '몽촌토성역 1번 출구' 쪽으로 7분만 걸어나와.",
        memeOrSlangTag: '🔥 [K-밈] "올콘(전 회차 관람) 완료 / 퇴근길 전쟁"',
        koreanPhrase: "올림픽공원역 말고 몽촌토성역 쪽으로 걸어가자, 거기가 훨씬 빨라!",
        pronunciationTip: "Ol-lim-pik-gong-won-yeok mal-go Mong-chon-to-seong-yeok jjog-eu-ro geol-eo-ga-ja!",
        localMapCard: {
          title: "한지후의 심야 콘서트 탈출 우회 루트 & 안심 귀가 맵",
          routeSummary: "KSPO돔 → 한얼교 도보 7분 → 몽촌토성역 1번 출구 픽업존 (대기 0분)",
          passCode: "NIGHT-SOS",
          passName: "도보 5분 Verified Stay & 정시 출발 안심 리무진 패스",
          spot: "올림픽공원 KSPO돔 ➔ 몽촌토성역 1번 출구",
        },
      },
      {
        id: "d1-3",
        sender: "FAN",
        memberId: "M1",
        timestamp: "23:14",
        text: "헐 진짜 몽촌토성역 쪽으로 걸어나오니까 길이 뻥 뚫려 있어요!! 택시 기사님께는 뭐라고 말하면 승차거부 안 당해요?",
      },
      {
        id: "d1-4",
        sender: "MEMBER",
        memberId: "M1",
        timestamp: "23:14",
        text: "무작정 손 흔들지 말고 호출 앱 쓰거나, 내가 밑에 적어둔 문장 그대로 보여드려. 숙소 들어갈 때까지 톡 켜둘 테니까 도착하면 도착했다고 남겨.",
        memeOrSlangTag: '🔥 [로컬 생존] "승차거부 제로 & 안심 귀가 완료"',
        koreanPhrase: "기사님, 성수역 사거리까지 미터기로 가주세요. 카드 결제할게요.",
        pronunciationTip: "Gi-sa-nim, Seong-su-yeok sa-geo-ri-kka-ji mi-teo-gi-ro ga-ju-se-yo.",
      },
    ],
  },
  {
    id: "DEMO_EDEN_POPUP",
    buttonLabel: "🔥 시나리오 2: 이든 × 010 번호 없이 성수 팝업 오픈런 & 얼죽아 티키타카",
    memberId: "M2",
    messages: [
      {
        id: "d2-1",
        sender: "FAN",
        memberId: "M2",
        timestamp: "10:25",
        text: "이든, 성수 팝업 줄 어떻게 서?! 앞에 태블릿에 010 한국 전화번호 입력하라는데 나 해외 유심이라 번호가 없어!! 그리고 너무 추워🥶",
      },
      {
        id: "d2-2",
        sender: "MEMBER",
        memberId: "M2",
        timestamp: "10:25",
        text: "워워 진정해 브로! 태블릿 화면 우측 하단에 작은 지구본 모양 'Global' 버튼 보여? 그거 누르면 010 번호 없이 이메일로 바로 대기 걸 수 있어! 지금 10시 25분이면 오픈런 골든타임 성공적이야 🔥",
        memeOrSlangTag: '🔥 [K-밈] "오픈런 성공적 / 대기 0분 실화냐"',
        koreanPhrase: "저 한국 번호 없는데 글로벌 이메일 웨이팅으로 걸어주실 수 있나요?",
        pronunciationTip: "Jeo han-guk beon-ho eom-neun-de geul-lo-beol i-me-il we-i-ting-eu-ro geol-eo-ju-sil su in-na-yo?",
        localMapCard: {
          title: "이든의 성수 연무장길 010-Free 웨이팅 & 짐보관 맵",
          routeSummary: "성수역 3번 출구 Lugstay 짐보관 → 연무장길 팝업 Global 이메일 웨이팅",
          passCode: "ZERO-WAIT",
          passName: "성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스",
          spot: "성수동 연무장길 팝업스토어 & 카페거리",
        },
      },
      {
        id: "d2-3",
        sender: "FAN",
        memberId: "M2",
        timestamp: "10:27",
        text: "와 대기 2번 걸었어!! 근데 옆에 한국 사람들 영하 5도인데 다 아이스 커피 마셔ㅋㅋ 나도 '얼죽아' 도전해볼까?",
      },
      {
        id: "d2-4",
        sender: "MEMBER",
        memberId: "M2",
        timestamp: "10:27",
        text: "하하하 발음 폼 미쳤다!! '얼죽아(얼어 죽어도 아이스 아메리카노)' 완전 한국 패치 끝났는데? 배 탈 나니까 사장님께 이 한마디만 덧붙여서 주문해!",
        memeOrSlangTag: '🔥 [K-밈] "얼죽아 (얼어 죽어도 아이스 아메리카노)"',
        koreanPhrase: "사장님, 아이스 아메리카노에 얼음은 살짝만 넣어주세요!",
        pronunciationTip: "Sa-jang-nim, a-i-seu a-me-ri-ka-no-e eol-eum-eun sal-jjak-man neo-eo-ju-se-yo!",
      },
    ],
  },
  {
    id: "DEMO_WEIHAO_BEAUTY",
    buttonLabel: "💄 시나리오 3: 위하오 × 청담 아이돌 헤메코 3장 공식 & 클리닉 정찰제",
    memberId: "M3",
    messages: [
      {
        id: "d3-1",
        sender: "FAN",
        memberId: "M3",
        timestamp: "14:10",
        text: "위하오 오빠, 지금 청담동 헤어메이크업 숍이랑 피부과 왔는데 한국말로 내 얼굴형에 맞게 해달라고 말하기 너무 민망해요… 호구 잡힐까 봐 무섭기도 하고요 😢",
      },
      {
        id: "d3-2",
        sender: "MEMBER",
        memberId: "M3",
        timestamp: "14:10",
        text: "민망해할 필요 전혀 없어! 나도 처음엔 손바닥에 적어 갔는걸. 원장님께 정면·옆모습·피부톤 사진 3장을 보여주면서 이 문장 그대로 읽어드려 봐. 오늘 완전 아이돌 재질 될 거야 ✨",
        memeOrSlangTag: '🔥 [K-밈] "오늘 완전 아이돌 재질인데? / 피부에서 광이 나네"',
        koreanPhrase: "이 사진 느낌으로 제 얼굴형에 맞게 시스루 뱅만 살려주세요. 클리닉은 부가세(VAT) 포함 정찰제 맞나요?",
        pronunciationTip: "I sa-jin neu-kkim-eu-ro je eol-gul-hyeong-e mat-ge si-seu-ru baeng-man sal-lyeo-ju-se-yo.",
        localMapCard: {
          title: "린위하오의 청담 K-뷰티 호구 방지 & 택스리펀드 체크 시트",
          routeSummary: "청담 사거리 인증 헤메코 숍 → 정찰제 웰니스 클리닉 → 여권 즉시 면세(Tax Refund)",
          passCode: "BEAUTY-CARE",
          passName: "청담 웰니스 사전 문진 번역 시트 제공 & 전담 통역 픽업 패스",
          spot: "청담동 K-뷰티 스트리트 & 성수 플래그십",
        },
      },
    ],
  },
  {
    id: "DEMO_AIMAN_SPICY",
    buttonLabel: "🌍 시나리오 4: 아이만·하루토 × 성수 분식집 '맵찔이' 고춧가루 제로 주문",
    memberId: "M5",
    messages: [
      {
        id: "d4-1",
        sender: "FAN",
        memberId: "M5",
        timestamp: "18:05",
        text: "아이만!! 식당 사장님이 '순한맛이라 하나도 안 맵다'고 해서 시켰는데 입에서 불이 나요🔥🔥 사이다 마셔도 더 매운데 어떡해?!",
      },
      {
        id: "d4-2",
        sender: "MEMBER",
        memberId: "M5",
        timestamp: "18:05",
        text: "아이고!! 한국 사장님의 '안 맵다 = 신라면 맵기'라는 걸 잊었구나 😂 탄산 마시면 혀가 더 따가워! 당장 '쿨피스(복숭아 유산균 음료)' 시키고, 다음 메뉴는 이렇게 주문해!",
        memeOrSlangTag: '🔥 [K-밈] "맵찔이(매운 거 못 먹는 사람) 살려주세요"',
        koreanPhrase: "사장님, 고춧가루랑 후추 아예 빼고 간장 베이스로 안 맵게 가능할까요? 그리고 쿨피스 하나 주세요!",
        pronunciationTip: "Sa-jang-nim, go-chut-ga-ru-rang hu-chu a-ye ppae-go gan-jang be-i-seu-ro an maep-ge ga-neung-hal-kka-yo?",
        localMapCard: {
          title: "아이만·하루토의 성수 할랄·논스파이시 & 오시카츠 성지순례 맵",
          routeSummary: "성수 간장베이스 로제분식 → 서울숲 센카(생일카페) 골목 → 영수증 비번/와이파이 가이드",
          passCode: "ZERO-WAIT",
          passName: "성수·한남 제휴 스팟 사전 예약 대행 & 다문화 안심 케어 패스",
          spot: "성수동 서울숲 카페거리 & 로컬 분식점",
        },
      },
    ],
  },
];

export function PersonaChatSimulator({
  members,
  onExportToGtStudio,
}: PersonaChatSimulatorProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("M1");
  const [platformSkin, setPlatformSkin] = useState<ChatPlatformSkin>("LINE");
  const [lang, setLang] = useState<ChatLanguage>("JP");
  const [messages, setMessages] = useState<PersonaChatMessage[]>(
    DEMO_SCENARIOS[0].messages
  );
  const [inputText, setInputText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const activePersona =
    PERSONA_TABS.find((p) => p.id === selectedMemberId) ?? PERSONA_TABS[0];
  const activeMember =
    members.find((m) => m.id === selectedMemberId) ?? members[0];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSelectPersona = (memberId: string) => {
    setSelectedMemberId(memberId);
    const matchingDemo = DEMO_SCENARIOS.find((d) => d.memberId === memberId);
    if (matchingDemo) {
      setMessages(matchingDemo.messages);
    } else {
      const p = PERSONA_TABS.find((t) => t.id === memberId) ?? PERSONA_TABS[0];
      setMessages([
        {
          id: `init-${memberId}-${Date.now()}`,
          sender: "MEMBER",
          memberId,
          timestamp: "방금",
          text: p.greetingByLang[lang],
          memeOrSlangTag: '🔥 [K-밈] "얼죽아 (얼어 죽어도 아이스 아메리카노)"',
          koreanPhrase: "사장님, 얼음은 살짝만 넣어주세요!",
          pronunciationTip: "Sa-jang-nim, eol-eum-eun sal-jjak-man neo-eo-ju-se-yo!",
          localMapCard: {
            title: "하루토의 성수 카페 & 센카(생일카페) 로컬 생존 맵",
            routeSummary: "성수역 4번 출구 카페거리 → 영수증 하단 화장실 도어락 별표(*) 확인",
            passCode: "ZERO-WAIT",
            passName: "성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스",
            spot: "성수동 카페거리 (2층 창가)",
          },
        },
      ]);
    }
  };

  const handleRunDemoScenario = (demo: DemoScenario) => {
    setSelectedMemberId(demo.memberId);
    setMessages(demo.messages);
  };

  const handlePlayVoice = (msg: PersonaChatMessage) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeakingMsgId(msg.id);
      setTimeout(() => setSpeakingMsgId(null), 2200);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const textToRead = msg.koreanPhrase || msg.text;
      const utter = new SpeechSynthesisUtterance(textToRead);
      utter.lang = "ko-KR";
      utter.rate = 0.95;
      utter.onstart = () => setSpeakingMsgId(msg.id);
      utter.onend = () => setSpeakingMsgId(null);
      utter.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msg.id);
      window.speechSynthesis.speak(utter);
      setTimeout(() => setSpeakingMsgId(null), 4000);
    } catch {
      setSpeakingMsgId(null);
    }
  };

  const buildSmartFallbackReply = (
    userText: string,
    memberId: string
  ): PersonaChatMessage => {
    const lower = userText.toLowerCase();
    const nowStr = new Date().toTimeString().slice(0, 5);

    if (
      lower.includes("얼죽아") ||
      lower.includes("아이스") ||
      lower.includes("카페")
    ) {
      return {
        id: `reply-${Date.now()}`,
        sender: "MEMBER",
        memberId,
        timestamp: nowStr,
        text:
          memberId === "M1"
            ? "얼죽아 발음 자연스럽네. 영하에도 아이스 마시는 게 서울 국룰이지. 카페 영수증 버리지 마, 맨 밑에 화장실 도어락 비밀번호(*표 필수)랑 와이파이 적혀 있으니까."
            : "와 '얼죽아' 완벽하게 쓰는 거 보니까 이미 서울 로컬 다 됐는데?! 🔥 차가운 거 급하게 마시면 배 아프니까 사장님께 '얼음은 살짝만 넣어주세요'라고 해봐!",
        memeOrSlangTag: '🔥 [K-밈] "얼죽아 (얼어 죽어도 아이스 아메리카노)"',
        koreanPhrase: "사장님, 아이스 아메리카노에 얼음은 살짝만 넣어주세요",
        pronunciationTip: "Sa-jang-nim, eol-eum-eun sal-jjak-man neo-eo-ju-se-yo",
        localMapCard: {
          title: "성수 로컬 카페 생존 팁 & 도어락 별표(*) 가이드",
          routeSummary: "영수증 하단 비번 확인 → 숫자 입력 후 반드시 [ * ] 별표 누르기",
          passCode: "ZERO-WAIT",
          passName: "성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스",
          spot: "성수동 카페거리",
        },
      };
    }

    if (
      lower.includes("고춧가루") ||
      lower.includes("맵") ||
      lower.includes("매워") ||
      lower.includes("떡볶이") ||
      lower.includes("할랄")
    ) {
      return {
        id: `reply-${Date.now()}`,
        sender: "MEMBER",
        memberId,
        timestamp: nowStr,
        text: "완벽해!! 그냥 '덜 맵게 해주세요'라고 하면 한국 식당에서는 신라면 맵기로 나와 😂 꼭 '고춧가루랑 후추 아예 빼고 간장 베이스로 해주세요'라고 말해야 진짜 안 매워! 편의점에선 뒷면 알레르기 박스(돼지고기/쇠고기) 3초 확인 잊지 마!",
        memeOrSlangTag: '🔥 [K-밈] "맵찔이(매운 거 못 먹는 사람) 구조 완료"',
        koreanPhrase: "사장님, 고춧가루랑 후추 아예 빼고 간장 베이스로 안 맵게 가능할까요?",
        pronunciationTip: "Go-chut-ga-ru-rang hu-chu a-ye ppae-go gan-jang be-i-seu-ro he-ju-se-yo",
        localMapCard: {
          title: "성수 할랄·논스파이시 안심 식당 & 편의점 3초 판독 가이드",
          routeSummary: "분식집 간장베이스 주문 → 매울 땐 탄산 대신 쿨피스(유산균) 처방",
          passCode: "ZERO-WAIT",
          passName: "성수·한남 제휴 스팟 사전 예약 대행 & 다문화 안심 패스",
          spot: "성수동 분식·한식당",
        },
      };
    }

    if (
      lower.includes("콘서트") ||
      lower.includes("택시") ||
      lower.includes("막차") ||
      lower.includes("kspo") ||
      lower.includes("올림픽")
    ) {
      return {
        id: `reply-${Date.now()}`,
        sender: "MEMBER",
        memberId,
        timestamp: nowStr,
        text: "콘서트 끝난 직후 올림픽공원역은 전쟁터야. 거기 서 있지 말고 한얼교 건너서 '몽촌토성역 1번 출구' 쪽으로 도보 7분만 걸어나와. 거기서 택시 부르거나 사전 확보된 NIGHT-SOS 리무진 타면 대기 0분이야.",
        memeOrSlangTag: '🔥 [K-밈] "올콘 완료 / 퇴근길 전쟁 탈출"',
        koreanPhrase: "올림픽공원역 말고 몽촌토성역 1번 출구 쪽으로 걸어가자!",
        pronunciationTip: "Ol-lim-pik-gong-won-yeok mal-go Mong-chon-to-seong-yeok jjog-eu-ro ga-ja!",
        localMapCard: {
          title: "KSPO돔 심야 콘서트 우회 루트 & 안심 귀가 맵",
          routeSummary: "KSPO돔 → 한얼교 도보 7분 → 몽촌토성역 1번 출구 픽업",
          passCode: "NIGHT-SOS",
          passName: "도보 5분 Verified Stay & 정시 출발 안심 리무진 패스",
          spot: "올림픽공원 KSPO돔 ➔ 몽촌토성역",
        },
      };
    }

    if (
      lower.includes("팝업") ||
      lower.includes("웨이팅") ||
      lower.includes("010") ||
      lower.includes("줄")
    ) {
      return {
        id: `reply-${Date.now()}`,
        sender: "MEMBER",
        memberId,
        timestamp: nowStr,
        text: "성수 팝업 태블릿 앞에서 010 번호 없다고 당황하지 마! 우측 하단 'Global' 버튼 누르면 해외 이메일로 웨이팅 알림 똑같이 와. 무거운 캐리어는 성수역 3번 출구 럭스테이에 맡기고 가볍게 뛰어 🔥",
        memeOrSlangTag: '🔥 [K-밈] "오픈런 성공적 / 대기 0분 실화냐"',
        koreanPhrase: "저 한국 번호 없는데 글로벌 이메일 웨이팅으로 걸어주실 수 있나요?",
        pronunciationTip: "Jeo han-guk beon-ho eom-neun-de geul-lo-beol i-me-il we-i-ting ga-neung-hal-kka-yo?",
        localMapCard: {
          title: "성수 팝업 010-Free 이메일 웨이팅 & 짐보관 동선",
          routeSummary: "성수역 3번 출구 짐보관 → 캐치테이블 우측 하단 Global 전환",
          passCode: "ZERO-WAIT",
          passName: "성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스",
          spot: "성수동 연무장길 팝업스토어",
        },
      };
    }

    // Default persona-tailored response
    return {
      id: `reply-${Date.now()}`,
      sender: "MEMBER",
      memberId,
      timestamp: nowStr,
      text: `${activeMember?.nameKo ?? "멤버"}가 바로 확인했어! "${userText}" — 진짜 한국인 친구랑 대화하는 것처럼 텐션 좋은데? 서울에서 막히는 순간 있으면 언제든 톡 남겨, 내 도메인 앵커 루트로 바로 구출해 줄게 ✨`,
      memeOrSlangTag: '🔥 [K-슬랭] "폼 미쳤다 / 오늘 완전 아이돌 재질인데?"',
      koreanPhrase: "천천히 둘러보고 부를게요 / 이거 한 치수 큰 거 재고 있나요?",
      pronunciationTip: "Cheon-cheon-hi dul-leo-bo-go bu-reul-ge-yo",
      localMapCard: {
        title: `${activeMember?.nameKo ?? "K-Soulmate"}의 실시간 서울 로컬 성지순례 맵`,
        routeSummary: activeMember?.domainAnchorDesc ?? "성수·청담·올림픽공원 무장애 로컬 동선",
        passCode: "BEAUTY-CARE",
        passName: "청담 웰니스 사전 문진 번역 시트 제공 & 전담 통역 픽업 패스",
        spot: "성수동 · 청담동 로컬 스팟",
      },
    };
  };

  const handleSendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim();
    if (!text || isGenerating) return;

    const nowStr = new Date().toTimeString().slice(0, 5);
    const fanMsg: PersonaChatMessage = {
      id: `fan-${Date.now()}`,
      sender: "FAN",
      memberId: selectedMemberId,
      timestamp: nowStr,
      text,
    };

    setMessages((prev) => [...prev, fanMsg]);
    if (!overrideText) setInputText("");
    setIsGenerating(true);

    try {
      const prompt = `당신은 K-Soulmate 보이그룹 멤버 '${activeMember?.nameKo}(${activePersona.tabLabel})'입니다.
전문 도메인 앵커: ${activeMember?.domainAnchorBadge} (${activeMember?.domainAnchorDesc})
응답 언어 설정: ${lang} (한국어 핵심 표현과 발음 가이드는 반드시 함께 제시)

팬의 메시지: "${text}"

반드시 아래 JSON 형식으로만 답하세요:
{
  "replyText": "멤버의 성격(츤데레/하이텐션/다정/막내/유쾌)과 도메인 앵커 지식이 살아있는 다정한 1:1 답장 (2~3문장)",
  "memeOrSlangTag": "🔥 [K-밈] 또는 🔥 [K-슬랭] 한 줄",
  "koreanPhrase": "팬이 현장에서 바로 쓸 수 있는 한국어 실전 문장 1개",
  "pronunciationTip": "위 한국어 문장의 로마자 발음 가이드",
  "mapTitle": "추천 로컬 생존 루트 제목",
  "routeSummary": "구체적인 역/출구/돌파 방법 1줄 요약"
}`;

      let parsedJson: {
        replyText?: string;
        memeOrSlangTag?: string;
        koreanPhrase?: string;
        pronunciationTip?: string;
        mapTitle?: string;
        routeSummary?: string;
      } | null = null;

      // 1차: 서버 프록시 (/api/gemini) 호출 시도
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const rawText = data.text || "";
          parsedJson = JSON.parse(rawText);
        }
      } catch {
        // ignore and try client or fallback
      }

      // 2차: 클라이언트 키가 있는 경우 직접 호출 시도
      if (!parsedJson) {
        const clientKey =
          (typeof window !== "undefined" &&
            window.localStorage.getItem("GT_GEMINI_API_KEY")) ||
          import.meta.env.VITE_GEMINI_API_KEY ||
          "";
        if (clientKey) {
          const ai = new GoogleGenAI({ apiKey: clientKey });
          const resp = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          if (resp.text) {
            parsedJson = JSON.parse(resp.text);
          }
        }
      }

      if (parsedJson && parsedJson.replyText) {
        const aiMsg: PersonaChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "MEMBER",
          memberId: selectedMemberId,
          timestamp: new Date().toTimeString().slice(0, 5),
          text: parsedJson.replyText,
          memeOrSlangTag:
            parsedJson.memeOrSlangTag || '🔥 [K-밈] "폼 미쳤다 / 로컬 패치 완료"',
          koreanPhrase:
            parsedJson.koreanPhrase || "사장님, 얼음은 살짝만 넣어주세요!",
          pronunciationTip:
            parsedJson.pronunciationTip ||
            "Sa-jang-nim, eol-eum-eun sal-jjak-man neo-eo-ju-se-yo!",
          localMapCard: {
            title:
              parsedJson.mapTitle ||
              `${activeMember?.nameKo}의 로컬 성지순례 & SOS 맵`,
            routeSummary:
              parsedJson.routeSummary ||
              activeMember?.domainAnchorDesc ||
              "성수·청담·올림픽공원 로컬 우회 루트",
            passCode:
              selectedMemberId === "M1"
                ? "NIGHT-SOS"
                : selectedMemberId === "M3"
                ? "BEAUTY-CARE"
                : "ZERO-WAIT",
            passName:
              selectedMemberId === "M1"
                ? "도보 5분 Verified Stay & 정시 출발 안심 리무진 패스"
                : selectedMemberId === "M3"
                ? "청담 웰니스 사전 문진 번역 시트 제공 & 전담 통역 픽업 패스"
                : "성수·한남 제휴 스팟 사전 예약 대행 & 전용 차량 짐 보관 패스",
            spot: "서울 성수·청담·올림픽공원 로컬 거점",
          },
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          buildSmartFallbackReply(text, selectedMemberId),
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        buildSmartFallbackReply(text, selectedMemberId),
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // 플랫폼 스킨별 스타일
  const skinHeaderClass =
    platformSkin === "LINE"
      ? "bg-[#06C755] text-white"
      : platformSkin === "WHATSAPP"
      ? "bg-[#075E54] text-white"
      : "bg-[#1F5E63] text-white";

  const skinBodyClass =
    platformSkin === "LINE"
      ? "bg-[#8CABD9]/35"
      : platformSkin === "WHATSAPP"
      ? "bg-[#ECE5DD]"
      : "bg-zinc-100";

  const skinFanBubbleClass =
    platformSkin === "LINE"
      ? "bg-[#85E249] text-zinc-900"
      : platformSkin === "WHATSAPP"
      ? "bg-[#DCF8C6] text-zinc-900"
      : "bg-[#1F5E63] text-white";

  return (
    <div className="space-y-4">
      {/* 상단 전략 헤더 & 플랫폼 스킨 / 언어 전환 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[3px] bg-emerald-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
              체험형 IP · LIVE AI PERSONA
            </span>
            <h2 className="text-base font-bold text-zinc-900">
              인터랙티브 1:1 AI 페르소나 라이브 채팅 & 여행 SOS 스튜디오 (LINE · WhatsApp · Web)
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            가상 아이돌의 일방적 시청 한계를 넘어, 팬이 5인 멤버(5대 페인포인트 도메인 앵커)와 1:1로 K-밈·슬랭 롤플레잉과 실시간 한국 여행 SOS 상담을 경험합니다.
          </p>
        </div>

        {/* 플랫폼 스킨 3종 & 언어 4종 전환 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[6px] border border-zinc-200 bg-zinc-50 p-0.5">
            {(
              [
                { key: "LINE", label: "🟢 LINE 공식계정 뷰" },
                { key: "WHATSAPP", label: "💬 WhatsApp 뷰" },
                { key: "WEB_IP", label: "🌐 Web 체험형 IP 뷰" },
              ] as const
            ).map((sk) => (
              <button
                key={sk.key}
                type="button"
                onClick={() => setPlatformSkin(sk.key)}
                className={`rounded-[4px] px-2.5 py-1 text-xs font-bold transition-colors ${
                  platformSkin === sk.key
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {sk.label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-[6px] border border-zinc-200 bg-zinc-50 p-0.5">
            {(["JP", "EN", "KR", "CN"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-[4px] px-2 py-1 font-mono text-xs font-bold transition-colors ${
                  lang === l
                    ? "bg-[#1F5E63] text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 멤버 페르소나 5인 선택 탭 (5대 도메인 앵커 연동) */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {PERSONA_TABS.map((p) => {
          const m = members.find((item) => item.id === p.id);
          const isSelected = selectedMemberId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPersona(p.id)}
              className={`flex flex-col justify-between rounded-[8px] border p-2.5 text-left transition-all ${
                isSelected
                  ? "border-2 border-[#1F5E63] bg-[#1F5E63]/5 shadow-2xs"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {m && (
                  <img
                    src={m.photoSheetUrl}
                    alt={m.nameKo}
                    className="h-9 w-9 shrink-0 rounded-full border border-zinc-200 object-cover object-top"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-zinc-900">
                    {p.tabLabel}
                  </div>
                  <div className="truncate text-[10px] font-semibold text-[#1F5E63]">
                    {p.anchorBadge}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 시나리오 원클릭 데모 버튼 4종 */}
      <div className="rounded-[8px] border border-amber-200 bg-amber-50/60 p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            <span>
              시나리오 원클릭 데모 4종 (클릭 즉시 K-밈 티키타카 + 현지 SOS 해결 + 성지순례 맵 시연)
            </span>
          </span>
          <span className="font-mono text-[11px] text-amber-800">
            Gemini API 실시간 응답 + 50대 매크로 도메인 앵커 탑재
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_SCENARIOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => handleRunDemoScenario(demo)}
              className="rounded-[6px] border border-amber-300 bg-white px-2.5 py-2 text-left text-xs font-semibold text-zinc-900 hover:border-[#1F5E63] hover:bg-[#1F5E63]/5 transition-colors"
            >
              {demo.buttonLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 라이브톡 창 (좌측 채팅 시뮬레이터 + 우측 도메인 앵커 & 롤플레잉 코칭 보드) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 좌측 7컬럼: 메신저 스킨 채팅창 */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-[10px] border border-zinc-300 bg-white shadow-xs">
          {/* 메신저 상단 상태바 */}
          <div
            className={`flex items-center justify-between px-4 py-3 ${skinHeaderClass}`}
          >
            <div className="flex items-center gap-2.5">
              {activeMember && (
                <img
                  src={activeMember.photoSheetUrl}
                  alt={activeMember.nameKo}
                  className="h-9 w-9 rounded-full border-2 border-white/80 object-cover object-top"
                />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold">
                    {activePersona.tabLabel}
                  </span>
                  <span className="rounded-[2px] bg-black/25 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                    {platformSkin} · {lang}
                  </span>
                </div>
                <div className="text-[11px] opacity-90">
                  {activeMember?.domainAnchorBadge}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>실시간 1:1 접속중</span>
            </div>
          </div>

          {/* 메시지 스크롤 영역 */}
          <div
            ref={chatScrollRef}
            className={`h-[420px] overflow-y-auto p-4 space-y-3.5 ${skinBodyClass}`}
          >
            {messages.map((msg) => {
              const isFan = msg.sender === "FAN";
              const m =
                members.find((item) => item.id === msg.memberId) ??
                activeMember;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isFan ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isFan && m && (
                    <img
                      src={m.photoSheetUrl}
                      alt={m.nameKo}
                      className="h-8 w-8 shrink-0 rounded-full border border-zinc-300 bg-white object-cover object-top"
                    />
                  )}

                  <div
                    className={`max-w-[82%] space-y-2 rounded-[10px] p-3 text-xs shadow-2xs ${
                      isFan
                        ? skinFanBubbleClass
                        : "border border-zinc-200 bg-white text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                      <span className="font-bold">
                        {isFan ? "나 (외국인 팬)" : `${m?.nameKo} (${m?.id})`}
                      </span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* 멤버 답장 내 K-밈/슬랭 & 실전 발음 & 음성 코칭 박스 */}
                    {!isFan && (msg.memeOrSlangTag || msg.koreanPhrase) && (
                      <div className="rounded-[6px] border border-[#1F5E63]/25 bg-[#1F5E63]/5 p-2.5 space-y-1.5 text-zinc-900">
                        {msg.memeOrSlangTag && (
                          <div className="font-bold text-[#1F5E63]">
                            {msg.memeOrSlangTag}
                          </div>
                        )}
                        {msg.koreanPhrase && (
                          <div className="rounded-[4px] bg-white px-2.5 py-1.5 border border-zinc-200">
                            <div className="font-bold text-zinc-900">
                              💬 실전 한마디: "{msg.koreanPhrase}"
                            </div>
                            {msg.pronunciationTip && (
                              <div className="font-mono text-[10px] text-zinc-500 mt-0.5">
                                [발음] {msg.pronunciationTip}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-0.5">
                          <button
                            type="button"
                            onClick={() => handlePlayVoice(msg)}
                            className={`inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              speakingMsgId === msg.id
                                ? "bg-emerald-600 text-white"
                                : "bg-[#1F5E63] text-white hover:bg-[#17494d]"
                            }`}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>
                              {speakingMsgId === msg.id
                                ? "원어민 보이스 재생 중..."
                                : "멤버 보이스로 발음 듣기 (TTS)"}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 멤버 답장 내 무료 로컬 성지순례 지도 & SOS 패스 카드 */}
                    {!isFan && msg.localMapCard && (
                      <div className="rounded-[6px] border border-emerald-300 bg-emerald-50/80 p-2.5 space-y-1.5 text-zinc-900">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-950">
                            <Compass className="h-3.5 w-3.5 text-emerald-700" />
                            <span>{msg.localMapCard.title}</span>
                          </span>
                          <span className="rounded-[2px] bg-emerald-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                            {msg.localMapCard.passCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-900">
                          📍 {msg.localMapCard.routeSummary}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-emerald-200/80 pt-1.5">
                          <span className="text-[10px] font-semibold text-emerald-800">
                            연결 패스: {msg.localMapCard.passName}
                          </span>
                          {onExportToGtStudio && (
                            <button
                              type="button"
                              onClick={() =>
                                onExportToGtStudio({
                                  episodeNo: 11,
                                  episodeTitle: `[1:1 AI 페르소나 SOS] ${msg.localMapCard!.title}`,
                                  place: msg.localMapCard!.spot,
                                  expressions: [
                                    msg.memeOrSlangTag ?? "K-밈 실전 표현",
                                    msg.koreanPhrase ?? msg.text,
                                    msg.localMapCard!.routeSummary,
                                  ],
                                  complianceRisk: selectedMemberId === "M3",
                                  channelCode: lang === "JP" ? "JP" : "KR",
                                  narration: `${msg.text} | ${msg.localMapCard!.routeSummary}`,
                                  memberName: `${m?.nameKo} (${m?.id})`,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-[3px] bg-emerald-800 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-950"
                            >
                              <span>GT TOUR 캠페인 생성</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-zinc-600 bg-white/90 rounded-[8px] px-3 py-2 w-fit border border-zinc-200">
                <Sparkles className="h-3.5 w-3.5 text-[#1F5E63] animate-spin" />
                <span>
                  {activeMember?.nameKo}({activeMember?.id})가 도메인 앵커 지식으로 답장을 작성 중입니다...
                </span>
              </div>
            )}
          </div>

          {/* 하단 원클릭 밈·SOS 칩 & 메시지 입력창 */}
          <div className="border-t border-zinc-200 bg-white p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-zinc-500">
                빠른 대화 테스트:
              </span>
              {[
                "얼죽아 도전할래!",
                "사장님 고춧가루 빼주세요",
                "지후 오빠, KSPO돔 끝났는데 택시가 안 잡혀요😭",
                "이든, 010 번호 없이 성수 팝업 줄 어떻게 서?",
                "청담 숍에서 사진 보여주기 민망할 때 뭐라고 해?",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="rounded-full border border-zinc-300 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700 hover:border-[#1F5E63] hover:bg-[#1F5E63]/10 hover:text-[#1F5E63]"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder={`${activeMember?.nameKo}에게 K-밈("얼죽아", "핏 미쳤다")이나 서울 여행 SOS 고민을 보내보세요...`}
                className="flex-1 rounded-[6px] border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-[#1F5E63] focus:outline-none"
              />
              <button
                type="button"
                disabled={isGenerating || !inputText.trim()}
                onClick={() => handleSendMessage()}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#1F5E63] px-4 py-2 text-xs font-bold text-white hover:bg-[#17494d] disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
                <span>전송</span>
              </button>
            </div>
          </div>
        </div>

        {/* 우측 5컬럼: 선택된 멤버의 도메인 앵커 명세 & 3대 인터랙티브 기능 가이드 */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-[10px] border border-[#1F5E63]/30 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div>
                <span className="rounded-[2px] bg-[#1F5E63] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                  선택된 페르소나 도메인 앵커
                </span>
                <h3 className="mt-1 text-sm font-bold text-zinc-900">
                  {activePersona.tabLabel}
                </h3>
              </div>
              {activeMember && (
                <img
                  src={activeMember.photoSheetUrl}
                  alt={activeMember.nameKo}
                  className="h-12 w-12 rounded-[6px] border border-zinc-200 object-cover object-top"
                />
              )}
            </div>

            <div className="rounded-[6px] border border-emerald-200 bg-emerald-50/70 p-3 space-y-1 text-xs">
              <div className="font-bold text-emerald-950">
                {activeMember?.domainAnchorBadge}
              </div>
              <p className="text-emerald-900 leading-relaxed">
                {activeMember?.domainAnchorDesc}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-zinc-900">
                인터랙티브 3대 핵심 작동 메커니즘
              </div>
              <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-2.5 space-y-1">
                <div className="font-semibold text-zinc-900">
                  1) 실전 K-밈·슬랭 롤플레잉 & 원어민 보이스 코칭
                </div>
                <p className="text-[11px] text-zinc-600">
                  교과서 문장 대신 에피소드 속 밈("얼죽아", "폼 미쳤다", "사장님 고춧가루 빼주세요")을 채팅으로 치면 멤버가 자기 성격대로 칭찬하고 발음 팁·음성(TTS)으로 받아쳐 줍니다.
                </p>
              </div>
              <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-2.5 space-y-1">
                <div className="font-semibold text-zinc-900">
                  2) 실시간 한국 여행 SOS 1:1 상담 (5대 도메인 앵커)
                </div>
                <p className="text-[11px] text-zinc-600">
                  심야 콘서트 귀가(지후), 010 없는 팝업 웨이팅(이든), 청담 헤메코·클리닉 정찰제(위하오), 로컬 식당·센카(하루토), 할랄·맵찔이 방어(아이만)를 현지인 친구 말투로 즉각 해결합니다.
                </p>
              </div>
              <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-2.5 space-y-1">
                <div className="font-semibold text-zinc-900">
                  3) 무료 성지순례 맵 배포 ➔ GT TOUR 수익 패스 전환
                </div>
                <p className="text-[11px] text-zinc-600">
                  대화 중 자연스럽게 무료 로컬 성지순례 지도와 사전 확보된 4대 안심 패스(NIGHT-SOS, ZERO-WAIT, BEAUTY-CARE, FIRST-SEOUL)를 연결합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
