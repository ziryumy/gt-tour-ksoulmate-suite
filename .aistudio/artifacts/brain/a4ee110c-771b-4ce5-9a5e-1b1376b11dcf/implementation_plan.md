# GT TOUR AI Social Suite Core Engine

외국인환자 유치기관 및 종합여행사 **GT TOUR**의 글로벌 마케팅 콘텐츠 생성 및 법률 준수(의료법·공연법·표시광고법) 감사 워크스페이스입니다. Antigravity 표준 모듈 아키텍처와 완벽히 호환되며, 최소한의 키워드(캠페인 축, 타깃 언어, 장소/스팟명) 입력만으로 원어민 마케터 톤앤매너가 반영된 인스타그램 5장 카루셀, 15초 릴스 대본, 샤오홍슈 7장 패키지(CN)를 구조화된 JSON과 시각적 카드 프리뷰로 동시에 생성·편집·교환합니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 전달해 주신 **4대 핵심 코드 규격(가드레일 엔진, 구조화 스키마 엔진, Express 백엔드 라우터, React 듀얼 워크스페이스 UI)**이 모두 준비되었습니다.
>
> **⚠️ 지금 바로 코드를 빌드하려면:**
> 아래 채팅 입력창(`Revise` 모드) 대신, **이 계획서 카드 하단 또는 우측 상단에 있는 파란색 [Proceed] (승인 및 빌드 시작) 버튼을 마우스로 클릭**해 주세요! `[Proceed]` 버튼을 클릭하시는 즉시 계획 모드가 종료되며 전체 파일 생성 및 서버 실행이 완료됩니다.

- **확정 사항 1 (법률 가드레일 엔진)**: `JP_5_LEGAL_PRESETS` 5종, `BANNED_RULES` 12종(의료법 제56조 / 공연법 / 표시광고법), `scanRiskWords`, `sanitizeTextWithGuardrails` 함수를 가드레일 모듈에 그대로 탑재합니다.
- **확정 사항 2 (구조화 스키마 & Strict 추출기)**: `SOCIAL_SUITE_RESPONSE_SCHEMA` 및 `toStrictSchema(fullOutput)` 추출 함수를 스키마 모듈에 그대로 탑재합니다.
- **확정 사항 3 (Express 백엔드 라우터 & 서버 사이드 강제 정화)**: `POST /api/generate-suite` 엔드포인트에서 `spots`와 `customMemo`를 `sanitizeTextWithGuardrails`로 정화한 뒤 `SYSTEM_INSTRUCTION`과 함께 Gemini 모델을 호출하고, 감지된 위험 단어를 `compliance_check.detected_risk_words`에 병합하여 반환합니다.
- **확정 사항 4 (React 듀얼 워크스페이스 & 실시간 양방향 동기화)**: 좌측 파라미터 및 실시간 법률 감사 스캐너(위험 키워드 테스트 로더 및 1-Click 일괄 치환 포함) + 우측 멀티탭(인스타 5장 카루셀 인라인 에디터 / 15초 릴스 대본 / 샤오홍슈 7장 노트) 및 Strict/Full Schema JSON Inspector 양방향 동기화 워크스페이스를 그대로 구현합니다.

---

### 1. Overview & Core Concept

- **What It Does**:
  - **원어민 마케터 페르소나 엔진**: 타깃 언어별로 최적화된 수석 마케터 페르소나(일본어 `JP`: 유키·유코 / 영어 `EN`: 윤서 / 중국어 `CN`: 샤오홍슈 수석 에디터 / 한국어 `KR`: 글로벌 컨시어지 디렉터)가 현지 SNS 문법과 감성에 맞는 카피를 작성합니다.
  - **6대 법률 가드레일 & 이중 정화 파이프라인**:
    - **클라이언트 실시간 스캔 + 서버 사이드 강제 정화**: 입력 단계에서 금지어를 감지·치환할 뿐 아니라, 서버 요청 시에도 `sanitizeTextWithGuardrails`를 통해 위험 단어를 합법 컨시어지 문구로 자동 정화하고 감지 이력을 `compliance_check.detected_risk_words`에 보존합니다.
    - **일본어 5대 합법 프리셋(`JP_5_LEGAL_PRESETS`) 필수 탑재**: `JP` 선택 시 Slide 1의 `highlight_line` 또는 Slide 5의 `benefits_3`에 선택된 프리셋 원문을 반드시 포함합니다.
    - **고정 푸터 강제**: Slide 5의 `footer`는 항상 `@gttourkorea | https://tr.ee/dSpLdDtiGW`로 고정됩니다.
- **Target Audience / Persona**: GT TOUR 글로벌 마케팅 팀, 인바운드 컨시어지 기획자, Antigravity 자동화 파이프라인 엔지니어.
- **Key Value**: 법적 리스크 제로(0%)를 보장하면서도 외부 파이프라인과 자유롭게 JSON을 주고받고(Import/Export), 시각적 카드뉴스 편집과 JSON 데이터를 실시간 양방향으로 동기화합니다.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **캠페인 파라미터 설정 & 위험 키워드 테스트 로드**: 상단 헤더의 `위험 키워드 테스트 로드 (가드레일 검증용)` 버튼 또는 좌측 패널에서 캠페인 축(`HOTPLACE` | `STAY` | `K_BEAUTY`), 타깃 언어(`JP` | `EN` | `CN` | `KR`), 스팟 키워드, 추가 메모를 입력합니다.
  2. **실시간 금지어 스캐너(`scanRiskWords`) & 1-Click 일괄 치환(`handleOneClickSanitize`)**: 입력창에 금지어가 감지되면 위반 법령, 위반 사유, 권장 치환 문구가 실시간 표시되며 `위험 키워드 합법 컨시어지 문구로 1-Click 일괄 치환` 버튼으로 즉시 정화됩니다.
  3. **시각적 프리뷰 인라인 편집 (`handleSlideEdit`)**: 생성된 인스타그램 5장 카루셀, 15초 릴스 대본, 샤오홍슈 7장 노트 프리뷰에서 텍스트를 직접 수정하면 JSON Inspector의 데이터와 실시간으로 즉시 동기화됩니다.
  4. **Strict / Full Suite 선택형 복사**: JSON Inspector에서 `Strict Schema (필수 4키)`와 `Full Suite (릴스+샤오홍슈 포함)` 모드를 전환하며 `Copy JSON` 버튼으로 즉시 복사합니다.

- **Visual Identity & Theme**:
  - **Color Palette**: 쿨 오프화이트(`#F8FAFC`) 캔버스, 크리스프 화이트(`#FFFFFF`) 패널, 슬레이트 보더(`#E2E8F0`), 딥 슬레이트(`#0F172A`) JSON 인스펙터, 로열 인디고(`#2563EB`) 액센트, 법률 감사 시맨틱 컬러(안전 `#16A34A`, 위반 위험 `#DC2626`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 4계층 모듈 분리 아키텍처**
  - *Chosen Approach*: 가드레일 엔진(`JP_5_LEGAL_PRESETS`, `BANNED_RULES`, `scanRiskWords`, `sanitizeTextWithGuardrails`), 스키마 엔진(`SOCIAL_SUITE_RESPONSE_SCHEMA`, `toStrictSchema`), Express 서버(`POST /api/generate-suite`), 프론트엔드 듀얼 워크스페이스를 명확히 분리합니다.
  - *Why*: 프론트엔드 사전 검열과 백엔드 서버 정화 및 Gemini 구조화 출력이 완전히 동일한 규칙으로 동작합니다.
- **Decision 2: 단일 원천 상태 기반 실시간 양방향 바인딩 (`handleSlideEdit` + `displayedJson`)**
  - *Chosen Approach*: 프리뷰 카드의 인라인 입력 필드와 JSON Inspector가 단일 `suiteData` 상태를 공유하여 수정 즉시 JSON 문자열이 재계산됩니다.
  - *Why*: 마케터의 시각적 편집과 엔지니어의 JSON 파이프라인 연동을 지연 없이 하나로 통합합니다.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                                    │
│  [GT TOUR | AI Social Suite Core Engine]      [위험 키워드 테스트 로드 버튼] │
└───────────────────────────────────────┬──────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
┌───────────────────────────────────────┐ ┌────────────────────────────────────┐
│     Left Panel: Campaign & Audit      │ │   Right Panel: Dual-Sync Studio    │
│                                       │ │                                    │
│ ┌───────────────────────────────────┐ │ │ ┌────────────────────────────────┐ │
│ │ 1. Campaign Parameters            │ │ │ │ Visual Studio Tabs             │ │
│ │  - Axis: HOTPLACE | STAY | BEAUTY │ │ │ │  - IG_5 (Inline Slide Editor)  │ │
│ │  - Lang: JP | EN | CN | KR        │ │ │ │  - REELS_15 (Timeline Script)  │ │
│ │  - spotsInput & customMemo        │ │ │ │  - XHS_7 (7-Page Note)         │ │
│ └─────────────────┬─────────────────┘ │ │ └───────────────▲────────────────┘ │
│                   ▼                   │ │                 │ handleSlideEdit  │
│ ┌───────────────────────────────────┐ │ │                 ▼                  │
│ │ 2. 6대 법률 가드레일 실시간 감사  │ │ │ ┌────────────────────────────────┐ │
│ │  - scanRiskWords(spots + memo)    │◄┼─┼─┤ Structured JSON Inspector      │ │
│ │  - handleOneClickSanitize         │ │ │ │  - STRICT: toStrictSchema()    │ │
│ │  - JP_5_LEGAL_PRESETS Pin         │ │ │ │  - FULL: Full Suite JSON       │ │
│ └─────────────────┬─────────────────┘ │ │ │  - 1-Click Copy JSON           │ │
│                   └──────────┬────────┘ │ └───────────────▲────────────────┘ │
└──────────────────────────────┼──────────┴─────────────────┼──────────────────┘
                               │ POST /api/generate-suite   │ Validated JSON
                               ▼                            │
┌───────────────────────────────────────────────────────────┴──────────────────┐
│                 Express Server + Schema & Gemini Engine                      │
│  - Pre-sanitizes spots & customMemo via sanitizeTextWithGuardrails           │
│  - Enforces SYSTEM_INSTRUCTION & SOCIAL_SUITE_RESPONSE_SCHEMA (temp: 0.4)    │
│  - Merges allDetectedRisks into compliance_check.detected_risk_words         │
└──────────────────────────────────────────────────────────────────────────────┘
```
