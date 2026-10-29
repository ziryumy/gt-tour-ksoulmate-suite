# 애니메이션 캐릭터 시트 프롬프트

**검증 상태**: 하루토 1명 테스트 완료. **판정 3/5 — 그대로는 사용 불가.**

---

## 1. 검증 결과 (하루토, 텍스트→애니 신규 생성 방식)

| 항목 | 결과 |
|---|---|
| 의상 재현 | **5/5** — 데님 재킷·흰 티·크림 팬츠·흰 스니커 3뷰 일치 |
| 색감 | 일치 (데님 블루·크림·애시브라운) |
| 헤어 | 색 계열 일치, 애니가 더 갈색이고 조금 더 뾰족함 |
| **얼굴 동일성** | **3/5 — 애니가 13~15세로 보임. 실사는 20세** |
| 렌더 품질 | 깨끗함. 단 3뷰가 아니라 클로즈업 2개 붙은 4패널로 나옴 |

**결론**: 옷은 같은데 사람이 동생처럼 읽힌다. "같은 인물"이 아니라 "같은 옷 입은 다른 사람"이 된다.

**원인**:
1. 텍스트만으로 새로 그려서 실사 시트와 독립 생성됨
2. `boyish` / `youthful` 이 애니메이션 문법에서 12세로 해석됨

---

## 2. 사용하지 말 것 — 텍스트→애니 신규 생성

```
~~anime character reference sheet, Japanese young man, age 20, boyish, youthful...~~
```
이 방식은 실사 시트와 무관한 인물을 만든다. **사용 금지.**

---

## 3. 사용할 것 — 실사 시트를 입력으로 넣고 변환

이미지는 두 장 이상 받는 모델 계열을 쓴다. 실사 시트를 **참조 이미지**로 넣고 스타일만 바꾼다.

```
Image 1 is the character reference sheet of an existing character.
Convert this exact character into a Japanese TV animation key-visual style.

CRITICAL — preserve identity, not just costume:
- Same face structure, same age, same height proportion as Image 1
- This character is 20 years old, not a child. Use 8-head body proportion,
  a longer face shape, a defined jawline, and eyes rendered SMALLER relative to the face.
- Do NOT soften or round the face. Do NOT enlarge the eyes.
- Same hair silhouette and colour as Image 1.

Style: cel-shaded 2D animation, clean confident line art, two-tone shadow,
modern Japanese TV animation key-visual quality.

Composition: THREE distinct views in one horizontal row —
(1) full-body front, (2) full-body three-quarter side, (3) head-and-shoulders close-up.
Not four panels. Not two close-ups.

Keep the fixed outfit exactly: {{OUTFIT_SPEC}}

Background: flat light grey. No text, no logo, no watermark.
```

---

## 4. 나이를 애니 문법으로 번역하는 스펙

20세를 애니메이션에서 20세로 보이게 하려면 아래를 명시해야 한다. 이게 핵심이다.

| 신호 | 실사에서 | 애니에서 (명시할 것) |
|---|---|---|
| 신장 비율 | 실제 175cm | **8등신** (7등신 이하 금지) |
| 얼굴형 | 성인 | **긴 얼굴형, 각진 턱선** (둥근 얼굴 금지) |
| 눈 | 자연스러운 크기 | **얼굴 대비 작게**. 큰 눈 = 아동 |
| 목 | — | 길게 |
| 어깨 | — | 넓게, 골격 보이게 |
| 금지어 | — | `boyish`, `youthful`, `cute`, `chibi`, `kawaii` |

---

## 5. 남은 작업

- [ ] 변환 방식으로 하루토 재시도 → 4/5 이상 확인
- [ ] 통과 시 M1·M2·M3·M5 동일 방식 적용
- [ ] 5장 완성 후 `data/members.json`의 `animeSheetUrl` 채우기

**5장이 다 채워지기 전에는 앱에 실사화(변신) 기능을 만들지 않는다.**

---

## 6. 왜 이게 중요한가

애니메이션 → 실사화를 시즌 구조로 쓰기로 했다면, **2D와 실사가 같은 사람으로 읽혀야** 한다. 이 연결이 안 되면 "변신"이 아니라 "교체"가 되고, 성장 서사가 성립하지 않는다.

부수 효과 하나: 애니메이션에서는 전신·표정이 자유롭다. 1화 시나리오의 "하관만, 눈 1프레임만" 같은 샷 제약이 **애니 구간에서는 필요 없어진다.** 감춤의 강도는 올라가고 연출은 풀린다.

