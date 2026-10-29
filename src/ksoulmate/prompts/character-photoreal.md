# 실사 캐릭터 시트 생성 프롬프트

**검증 상태**: 5인 전원 완료. 컷 간 얼굴·의상 일치 확인.

## 공통 템플릿

```
Photorealistic K-pop idol character reference sheet, ONE single image,
clean light-grey seamless studio background, soft even three-point lighting,
three views arranged in one horizontal row:
(1) full-body FRONT view standing straight, arms relaxed
(2) full-body THREE-QUARTER SIDE view
(3) head-and-shoulders EXPRESSION close-up with {{EXPRESSION}}

Identical fixed outfit in every view.

Character: {{FACE_SPEC}}

Fixed outfit: {{OUTFIT_SPEC}}

Editorial Korean pop group styling, 85mm portrait lens look, crisp skin texture,
magazine quality detail. No text, no logo, no watermark, no props.
This is an entirely original fictional person and must not resemble any real celebrity.
```

## 치환값

| 멤버 | EXPRESSION | FACE_SPEC | OUTFIT_SPEC |
|---|---|---|---|
| M1 지후 | gentle confident half-smile | Korean man, 24, 182cm lean athletic. Soft dark-brown wavy hair falling over the brow, warm brown eyes, calm mature handsome, understated elegance | black tailored blazer open over ivory ribbed turtleneck, black straight trousers, black Chelsea boots, silver band ring |
| M2 이든 박 | cool slightly cocky smirk | Korean-Australian man, 22, 178cm compact dancer build. Jet-black hair with short undercut, narrow intense eyes, sharp defined jaw | black cropped leather biker jacket over black tee, black tapered cargo trousers, chunky combat boots, thin silver chain |
| M3 린위하오 | soft knowing smile | Taiwanese man, 23, 180cm slim elegant. Wavy honey-brown hair parted loosely, cat-shaped almond eyes with lifted outer corners, soft features | slate-grey oversized wool coat over crisp white shirt, dark indigo straight trousers, black loafers, small silver ear stud |
| M4 하루토 | bright open youthful grin | Japanese man, 20, 175cm slender. Fluffy ash-light-brown hair over forehead, large round friendly eyes, youthful features | light washed-blue denim jacket over white tee, cream straight trousers, white low-top sneakers |
| M5 아이만 | bold confident grin | Malaysian man (Chinese-Malay), 21, 176cm athletic. Warm tan skin, short textured dark curls with closely faded sides, thick brows | oversized charcoal hoodie hood-down, wide-leg black trousers, chunky grey-black sneakers, black wristband |

## 생성 설정

| 항목 | 값 |
|---|---|
| 종횡비 | 4:3 (가로) |
| 해상도 | 1024×768 이상 |
| 모델 | 품질 우선 모델 권장 |

## 주의

- "60% 닮은꼴" 식의 실존 인물 참조는 사용하지 않았다. 5인은 전부 오리지널 캐릭터다.
- 외부에서 유사성 이의가 제기되면 **시트 교체만으로 대응 가능한 구조**를 유지한다. 즉 얼굴 스펙을 한 곳(`data/members.json`의 `faceSpec`)에서만 관리한다.

