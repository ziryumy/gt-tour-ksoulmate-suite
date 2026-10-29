# SPEC.md — K-soulmate 콘텐츠 운영 콘솔

버전 1.0 · 2026-10-27 · 이 문서가 제품의 단일 진실 원천입니다.

---

## 0. 제품 정의

### 0.1 한 문장
5인조 AI 아이돌 콘텐츠를 **12화 × 4채널**로 재조립·검수·발행하는 내부 운영 콘솔.

### 0.2 왜 필요한가
한 화를 만들면 채널 3~4개 버전이 생깁니다. 각 버전은 **대본·보이스·BGM·컷수·길이가 전부 다릅니다.** 12화 × 4채널이면 최대 48개 버전이고, 생성 크레딧·법규 검수·발행 상태가 각각 따로 붙습니다. 스프레드시트로는 감당이 안 됩니다.

### 0.3 사용자
| 사용자 | 하는 일 |
|---|---|
| 유코 (유입·팬클럽) | 파이프라인 운영, 채널 버전 편집, 발행 |
| 유키 (전환·수익) | 크레딧·예산 관리, B2B 제작 상태 |
| 가영 (중화권) | CN 채널 (Phase 2) |

### 0.4 비목표 (Phase 1에서 만들지 않음)
- AI 생성 API 호출 (기록만 함)
- 결제 / 회원가입 / 로그인
- 공개 팬페이지 (Phase 2)
- 실제 영상 렌더링·업로드
- 다국어 UI (한국어만)

---

## 1. 핵심 개념 — 이 도메인을 이해하려면

### 1.1 베이스 1본, 채널별 재조립
화면(영상)은 **1본**을 공유합니다. 채널마다 다시 만드는 것은 4가지입니다.

| 고정 (바꾸지 않음) | 가변 (채널마다 다름) |
|---|---|
| 베이스 영상 | 나레이션 대본 |
| 5인 캐릭터 시트 | 나레이션 보이스(V.O.) |
| 오늘의 한국어 3표현 | BGM 트랙 |
| 멤버의 한국어 대사 원음 | 편집 호흡 (컷수·컷길이·총길이) |
| 장소·의상·순서 | 자막 |

**앱에서 중요한 것**: 고정/가변을 화면에서 시각적으로 구분해야 합니다. 고정 항목은 편집 불가(회색), 가변 항목만 입력 가능.

### 1.2 채널 규격은 절대값
| 채널 | 총길이 | 컷 수 | 평균 컷 | 리듬 기준 |
|---|---|---|---|---|
| JP (일본 LINE) | 90초 | 24 | 3.8초 | 문장 호흡 — 대본이 컷 길이를 정함 |
| US (미국 TikTok) | 60초 | 32 | 1.9초 | 비트 — BGM에 먼저 컷을 맞춤 |
| KR (한국 Instagram) | 90초 | 18 | 5.0초 | 자막 가독 |
| CN (중화권 샤오홍슈) | 88초 | 22 | 4.0초 | 하단 자막 영역 확보 |

**검증 규칙**: 컷 수 ÷ 총길이 = 평균 컷. 이 값이 규격과 ±0.3초 이상 벌어지면 경고.

### 1.3 작업 순서가 채널마다 다름
- **JP**: 대본 → V.O. → 컷 → BGM
- **US**: BGM → 비트 마커 → 컷 → V.O.
- **KR/CN**: 자막 → 컷 → V.O. → BGM

앱의 채널 편집 화면은 **이 순서대로 섹션을 배치**해야 합니다. 폼 순서가 곧 워크플로우입니다.

---

## 2. 정보 구조

```
대시보드 ─┬─ 캐릭터 락 (5인)
          ├─ 에피소드 보드 (12화) ─ 에피소드 상세 ─ 채널 버전 (×4)
          ├─ 크레딧·예산
          ├─ 컴플라이언스
          └─ 참여 관리
```

전역 내비게이션: 좌측 사이드바, 고정. 현재 위치 강조.

---

## 3. 데이터 모델

Prisma 스키마 기준. 필드명은 그대로 사용하세요.

```prisma
model Member {
  id            String   @id            // "M1" ~ "M5"
  nameKo        String                  // "한지후"
  nameJa        String?
  nameZh        String?
  nationality   String                  // "한국" | "영어권(호주교포)" | "중화권" | "일어권" | "말레이시아"
  position      String                  // "리더 · 메인보컬"
  age           Int
  heightCm      Int
  photoSheetUrl String                  // 실사 캐릭터 시트 (검증 완료)
  animeSheetUrl String?                 // 애니 시트 (미완성인 멤버는 null)
  outfitSpec    String                  // 고정 의상 (영문 프롬프트 문장)
  faceSpec      String                  // 얼굴 고정 조건 (영문)
  voiceProfile  String?                 // TTS 프로필 ID
  channelCode   String?                 // 주 담당 채널
  locked        Boolean  @default(true) // 아이덴티티 락 확정 여부
  episodes      Episode[]
}

model Channel {
  code          String  @id            // "JP" | "US" | "KR" | "CN"
  label         String                 // "일본 · LINE"
  narratorId    String                 // Member.id
  tone          String                 // "일기체 · 1인칭 · 과거 회상"
  totalSec      Int                    // 90 / 60 / 90 / 88
  cutCount      Int                    // 24 / 32 / 18 / 22
  avgCutSec     Float                  // 3.8 / 1.9 / 5.0 / 4.0
  rhythmBasis   String
  workflowOrder String[]               // ["script","vo","cut","bgm"]
  bgmTracks     String[]               // 라이브러리 트랙 ID 3개
  active        Boolean @default(true) // CN은 Phase2 전까지 false
  versions      ChannelVersion[]
}

model Episode {
  id            Int      @id @default(autoincrement())
  no            Int      @unique        // 1..12
  title         String
  place         String
  memberId      String
  expressions   String[]                // 오늘의 한국어 3표현
  baseVideoUrl  String?
  status        EpisodeStatus @default(PLANNING)
  complianceRisk Boolean  @default(false) // 3·6·7화 true
  member        Member   @relation(...)
  versions      ChannelVersion[]
  runs          GenerationRun[]
  missions      Mission[]
}

enum EpisodeStatus { PLANNING SCRIPTED GENERATED EDITED REVIEWED PUBLISHED }

model ChannelVersion {
  id           Int     @id @default(autoincrement())
  episodeId    Int
  channelCode  String
  narration    String   @default("")   // 채널별 대본 (재창작)
  voStatus     VersionStatus @default(TODO)
  bgmTrackId   String?
  cutCount     Int?
  totalSec     Int?
  status       VersionStatus @default(TODO)
  publishedUrl String?
  publishedAt  DateTime?
  @@unique([episodeId, channelCode])
}

enum VersionStatus { TODO IN_PROGRESS DONE BLOCKED }

model GenerationRun {
  id          Int      @id @default(autoincrement())
  episodeId   Int
  model       String              // "seedance-2.0" | "seedance-2.5" | "fast"
  purpose     String              // "base" | "collection" | "retry"
  attempts    Int      @default(1)
  accepted    Int      @default(0) // 채택된 컷 수
  credits     Int      @default(0)
  createdAt   DateTime @default(now())
}

model BudgetMonth {
  month        String  @id           // "2026-11"
  plan         String                // "ultra" | "plus" | "starter"
  creditCap    Int                   // 승인된 상한
  creditUsed   Int     @default(0)
  claudeSeats  Int     @default(2)
  costUsd      Float   @default(0)
}

model ComplianceItem {
  code      String  @id            // "JP-01" ~ "JP-07"
  label     String
  detail    String
  blockAt   String                 // "BEFORE_PUBLISH" | "AT_LAUNCH"
  checks    ComplianceCheck[]
}

model ComplianceCheck {
  id         Int    @id @default(autoincrement())
  episodeId  Int
  itemCode   String
  done       Boolean @default(false)
  owner      String?
  note       String?
  @@unique([episodeId, itemCode])
}

model Mission {
  id         Int    @id @default(autoincrement())
  episodeId  Int
  type       String          // "expression" | "fandom_name"
  body       String
  votes      Int    @default(0)
  status     String @default("COLLECTING") // COLLECTING | ADOPTED | REJECTED
}

model FandomCandidate {
  id        Int     @id @default(autoincrement())
  name      String
  reason    String
  votes     Int     @default(0)
  checkTm   Boolean @default(false)  // 상표
  checkDup  Boolean @default(false)  // 중복
  checkWord Boolean @default(false)  // 부적절어
  checkPron Boolean @default(false)  // 발음
  checkChant Boolean @default(false) // 3음절 이내
  status    String  @default("CANDIDATE") // CANDIDATE | SHORTLIST | ADOPTED
}

model Gauge {
  id        Int    @id @default(autoincrement())
  label     String            // "하루토 얼굴 공개"
  threshold Int               // 50
  current   Int    @default(0)
  unlocked  Boolean @default(false)
}
```

---

## 4. 화면 요구사항

### 4.1 대시보드 `/dashboard`

**목적**: 오늘 뭘 해야 하는지 3초 안에 안다.

**구성 (위에서 아래로)**
1. **경고 배너** — 아래 중 하나라도 있으면 최상단에 빨간 배너
   - 이번 주 발행 예정인데 미완성 채널 버전이 있음
   - 이번 달 크레딧 사용률 90% 초과
   - 공개 예정 회차의 컴플라이언스 미완료
2. **4개 지표 카드** — 이번 주 발행 수 / 이번 주 목표(2본) / 월 크레딧 사용률 / 차단된 회차 수
3. **이번 주 할 일** — 미완성 채널 버전 목록 (에피소드 · 채널 · 상태). 클릭 시 해당 편집 화면
4. **최근 생성 기록** — 최근 5건 (모델 · 회차 · 소모 크레딧)

**빈 상태**: "아직 데이터가 없습니다. `npm run db:seed`를 실행하세요."

---

### 4.2 캐릭터 락 `/members`

**목적**: 5인의 아이덴티티를 한눈에 확인하고, 생성 프롬프트를 복사한다.

**구성**
- 카드 그리드 (2열, 375px에서는 1열)
- 카드마다: 실사 시트 썸네일 / 이름 + 국적 + 포지션 + 나이·키 / 락 배지 / 애니 시트 유무 배지
- 클릭 → 상세 패널(모달 또는 하단 시트)
  - 실사 시트 원본
  - 고정 의상 (영문)
  - 얼굴 고정 조건 (영문)
  - **프롬프트 복사 버튼** — `outfitSpec` + `faceSpec`을 합쳐 클립보드에 복사
  - 애니 시트가 없으면: "애니 시트 미제작" 안내 + `prompts/character-anime.md` 링크 텍스트

**규칙**
- `locked = false`인 멤버는 카드에 점선 테두리 + "락 미확정" 표시
- 5인은 항상 M1~M5 순서 고정 (정렬 옵션 없음)

---

### 4.3 에피소드 보드 `/episodes`

**목적**: 12화의 진행 상태를 한 화면에서 본다.

**구성**
- 표 또는 카드 리스트. 컬럼: 화 / 제목 / 장소 / 담당 / 오늘의 표현(3개) / 상태 / 채널 진행(4개 점)
- **상태 이동은 버튼 또는 드롭다운.** 드래그 금지.
  - 각 행 우측에 `◀ 이전` `다음 ▶` 버튼
  - 또는 상태 셀 클릭 시 드롭다운 (PLANNING → SCRIPTED → GENERATED → EDITED → REVIEWED → PUBLISHED)
- 컴플라이언스 위험 회차(3·6·7)는 행 배경 연한 주황 + "약기법" 배지
- 행 클릭 → `/episodes/[no]`

**상태 전이 규칙 (서버에서 강제)**
- PUBLISHED로 가려면: 채널 버전 3개(JP/US/KR)가 모두 `DONE` + 컴플라이언스 필수 항목 전부 `done`
- 위반 시: "발행할 수 없습니다. 미완성 채널: US, KR / 미완료 검수: JP-04" 처럼 **구체적으로** 알려줄 것

---

### 4.4 에피소드 상세 `/episodes/[no]`

**구성**
1. 헤더: 화번 · 제목 · 장소 · 담당 멤버 · 상태
2. 오늘의 표현 3개 (읽기 전용 카드)
3. **채널 탭 4개** — JP / US / KR / CN. CN은 "Phase 2" 배지 + 비활성
4. 탭 아래: 해당 채널 버전 편집 화면 (4.5)
5. 하단: 생성 기록 표 (모델 · 목적 · 시도 · 채택 · 크레딧)
6. 하단: 컴플라이언스 체크리스트 (4.7의 요약)

---

### 4.5 채널 버전 편집 `/episodes/[no]/channels/[code]`

**이 화면이 앱의 심장입니다.**

**구성 — 섹션 순서는 채널의 workflowOrder를 따름**

JP 예시 (script → vo → cut → bgm):
1. **나레이션 대본** (textarea, 크게) — 자동 저장, 5초 디바운스
   - 상단에 고정 안내: 화법 규칙 (`channel.tone`) + 금지/필수 항목
2. **V.O.** — 상태 셀렉트(TODO/IN_PROGRESS/DONE) + 사용한 보이스 프로필 표시(읽기 전용)
3. **편집 호흡** — 컷 수(input) · 총 길이(input) · **계산된 평균 컷(읽기 전용, 실시간)**
   - 평균 컷이 규격 ±0.3초 벗어나면 인라인 경고
4. **BGM** — 라이브러리 트랙 3개 중 선택 (셀렉트) + 미리듣기는 없음(Phase 1)
5. **자막** — 완료 체크박스
6. **발행** — URL 입력 + 발행 버튼 (게이트 통과 시에만 활성)

**고정 항목 패널** (우측 사이드 또는 상단 접이식)
- 베이스 영상 링크 (읽기 전용)
- 오늘의 표현 3개 (읽기 전용)
- 캐릭터 시트 썸네일 2인 (읽기 전용)
- 라벨: "고정 — 채널과 무관하게 동일"

**필수 인터랙션**
- 저장되지 않은 변경이 있으면 이탈 시 확인
- 저장 성공 시 토스트: "저장했습니다"
- 실패 시: "저장하지 못했습니다. 다시 시도해 주세요."

---

### 4.6 크레딧·예산 `/credits`

**목적**: 크레딧이 이월되지 않는다는 사실을 매일 상기시킨다.

**구성**
1. **이번 달 게이지** — `creditUsed / creditCap`. 80% 주황, 90% 빨강
2. **요금제 카드** — 현재 플랜명 · 월 비용 · 크레딧 · Claude 좌석 수
3. **회차별 소모 표** — 회차 · 생성 횟수 · 채택률 · 소모 크레딧
   - 채택률 = `accepted / (attempts × 고유컷)` … 단순화: `accepted / attempts`
   - 채택률 75% 미만이면 행 강조 (재생성 위험)
4. **월 예산 요약** — 크레딧 비용 + Claude 비용 = 월 합계 (USD, 그리고 가정 환율 1,400원 적용 원화)
5. **입력**: 이번 달 크레딧 사용량 수동 입력 (외부 대시보드에서 확인한 값)

**계산 규칙** (`lib/rules/credits.ts`)
```
회차 크레딧 = Σ(GenerationRun.credits)
사용률 = BudgetMonth.creditUsed / BudgetMonth.creditCap
경고 임계: 0.8 / 0.9
```

---

### 4.7 컴플라이언스 `/compliance`

**목적**: 3·6·7화가 법적으로 위험하다는 걸 잊지 않게.

**구성**
- 일본 시장 7개 항목 × 12화 매트릭스 (체크박스 그리드)
- 항목: 특정상거래법 / 경품표시법 / 개인정보보호법 / 약기법·의료광고 / 초상권·저작권 / AI 생성물 표시 / LINE 발송 한도
- `blockAt = BEFORE_PUBLISH`인 항목(1~4)이 미완료면 해당 회차 발행 차단
- 3·6·7화는 약기법 항목이 **필수**로 표시 (회색 처리 불가)
- 상단 요약: "발행 차단 중인 회차: 3화, 6화"

---

### 4.8 참여 관리 `/engagement`

**구성 3블록**
1. **응원 게이지** — 라벨 · 현재/임계값 · 프로그레스 바 · 달성 시 "해금됨" 배지
   - 기본 시드: "하루토 얼굴 공개" 50%
2. **팬덤명 후보** — 표. 이름 / 이유 / 득표 / 5개 검사 통과 여부(아이콘 5개) / 상태
   - **SHORTLIST로 올리려면 5개 검사 전부 통과해야 함** (서버 강제)
   - 미통과 항목 툴팁: "3음절 이내로 끊어 부를 수 있어야 합니다"
3. **미션 회수** — 회차별 미션 목록. `COLLECTING` → `ADOPTED` 전환 시 크레딧 대상 표시

---

## 5. 규칙 엔진 (서버에서 강제)

### 5.1 길이 검증 `lib/rules/length.ts`
```
avgCut = totalSec / cutCount
if (|avgCut - channel.avgCutSec| > 0.3) → warning
if (totalSec !== channel.totalSec ± 3) → warning
```
경고는 저장을 막지 않음. **발행만 막음.**

### 5.2 발행 게이트 `lib/rules/compliance.ts`
```
canPublish(episode):
  1. active 채널 중 status !== DONE 인 것이 없어야 함
  2. blockAt = BEFORE_PUBLISH 인 ComplianceCheck 중 done = false 가 없어야 함
  3. 두 조건 모두 만족해야 true
```

### 5.3 크레딧 `lib/rules/credits.ts`
```
usageRatio = creditUsed / creditCap
if (usageRatio >= 0.9) → blocker 배너
if (usageRatio >= 0.8) → warning 배너
```

### 5.4 팬덤명 `lib/rules/fandom.ts`
```
canShortlist(candidate) = checkTm && checkDup && checkWord && checkPron && checkChant
```

---

## 6. 수용 기준 (Acceptance Criteria)

각 항목은 **테스트 가능한 문장**입니다. 통과/실패를 명확히 판정할 수 있어야 합니다.

| ID | 기준 |
|---|---|
| AC-01 | `npm run db:seed` 실행 후 DB에 Member 5건, Episode 12건, Channel 4건이 존재한다 |
| AC-02 | `/members`에 5인 카드가 M1~M5 순서로 표시되고, 각 카드에 실사 시트 썸네일이 보인다 |
| AC-03 | 멤버 상세에서 "프롬프트 복사"를 누르면 `outfitSpec`+`faceSpec`이 클립보드에 들어간다 |
| AC-04 | `/episodes`에서 12화가 모두 보이고, 3·6·7화에 "약기법" 배지가 있다 |
| AC-05 | 에피소드 상태를 **버튼 또는 드롭다운으로만** 변경할 수 있다. 드래그 앤 드롭 코드가 존재하지 않는다 |
| AC-06 | 1화 상세에서 채널 탭 4개가 보이고, CN 탭은 "Phase 2" 배지와 함께 비활성이다 |
| AC-07 | JP 채널 편집 화면의 섹션 순서가 대본 → V.O. → 편집 호흡 → BGM이고, US는 BGM → 컷 → V.O. 순서다 |
| AC-08 | 컷 수 24, 총 길이 90을 입력하면 평균 컷이 3.75로 계산되어 표시된다. 컷 수를 10으로 바꾸면 경고가 뜬다 |
| AC-09 | 채널 버전 편집 후 새로고침해도 값이 유지된다 (자동 저장 또는 저장 버튼) |
| AC-10 | JP/US/KR 중 하나라도 DONE이 아니면 발행 버튼이 비활성이고, 사유가 구체적으로 표시된다 |
| AC-11 | 3화의 약기법 체크가 미완료면 발행이 차단된다 |
| AC-12 | 크레딧 사용률 90%에서 대시보드 상단에 빨간 배너가 뜬다 |
| AC-13 | 팬덤명 후보 중 5개 검사 중 하나라도 미통과면 SHORTLIST 버튼이 비활성이다 |
| AC-14 | 응원 게이지 50%에서 "해금됨" 상태로 바뀐다 |
| AC-15 | 375px 폭에서 사이드바가 접히고 표가 카드로 전환된다 |
| AC-16 | `npm run build`가 경고 없이 통과한다 |

---

## 7. 마일스톤

| 단계 | 범위 | 통과 기준 |
|---|---|---|
| **M1** | 스캐폴드 + Prisma + seed | AC-01 |
| **M2** | 조회 화면 (대시보드·멤버·에피소드 목록·상세) | AC-02 ~ AC-06 |
| **M3** | 쓰기 + 규칙 엔진 (채널 편집·길이·크레딧) | AC-07 ~ AC-09, AC-12 |
| **M4** | 게이트 + 참여 (발행 차단·컴플라이언스·팬덤명·게이지) | AC-10 ~ AC-14 |
| **M5** | 반응형 + 마감 (빈 상태·에러·로딩) | AC-15, AC-16 |

---

## 8. 디자인 방향

- **내부 도구입니다.** 마케팅 페이지가 아닙니다. 정보 밀도 우선.
- 기본 폰트: Pretendard 또는 system-ui
- 색: 중립 회색 기반 + 강조 1색(teal `#1F5E63`). 경고 amber, 차단 red
- 카드 반경 8px, 그림자 최소
- 표는 zebra 없이 hairline 구분선
- 상태 배지는 작고 각지게 (pill 아님)
- 아이콘: lucide-react

---

## 9. 시드 데이터

`data/` 폴더의 JSON을 그대로 읽어 넣으세요. **값을 바꾸지 마세요.**
`prisma/seed.ts`는 idempotent해야 합니다 (여러 번 실행해도 중복 생성 없음).

