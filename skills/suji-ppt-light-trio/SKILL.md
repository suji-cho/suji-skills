---
name: suji-ppt-light-trio
description: 라이트(흰색) 배경 + 주황(#E8500F) 주조색 + 스카이블루(#2E72C8)·에메랄드(#1FA968) 서브 2색의 글로벌 파트너 제안용 PPTX를 생성합니다. 중첩 보더 카드가 시그니처. '/suji-ppt-light-trio'로 호출할 때만 활성화됩니다.
---

# 글로벌 파트너 제안용 라이트 트라이오 PPTX 생성

`suji-ppt-dark-trio`의 라이트 버전. 해외 파트너사 소개·제안 톤을 **밝고 신뢰감 있는 라이트 배경**으로 전달한다. 같은 3색 시스템·중첩 보더·이탤릭 금지 정체성을 유지하되, 흰 배경 가독성을 위해 3색을 살짝 진하게 조정한다. 자매 스킬:

- `suji-ppt-dark-trio` (다크 + 동일 3색, **다크 글로벌 파트너 제안**)
- `suji-ppt-light-purple` (라이트 + 인디고 단색, **공식 기업 제안**)
- `suji-ppt-dark-orange` (다크 + 주황 단일, **CEO 단정 보고**)
- **본 스킬** (라이트 + 주황 주조 + 블루·에메랄드 서브 + 중첩 보더, **라이트 글로벌 파트너 제안**)

네 스킬이 동일 패턴 카탈로그(A~T)를 공유. 본 스킬은 dark-trio와 패턴(U~Z)·구조를 100% 공유하고 **색·명도 토큰만 라이트로 반전**한다.

## 본 스킬의 3대 정체성 (절대 규칙)

1. **3색 시스템 (라이트 조정색)** — 주황(주조) + 스카이블루(서브1) + 에메랄드(서브2). 흰 배경 가독성 위해 다크보다 살짝 진하게. 이 외 액센트 금지.
2. **중첩 보더 카드** — 모든 박스에 옅은 회색 보더 + 안쪽으로 갈수록 **살짝 어두워지는** 명도 단계(다크와 반대 방향). 보더 없는 솔리드 카드 금지.
3. **이탤릭 미사용** — 강조는 **색과 굵기로만**. `italic: true` 절대 금지.

## 워크플로우

```
1. 시나리오 설계 → 2. 레이아웃 선택 → 3. PPTX 생성
```

**Phase 1과 2 사이에 반드시 사용자 확인.** "기획서를 검토해주세요. 확인되면 생성하겠습니다."

---

## Phase 1: 시나리오 설계

`suji-ppt-dark-trio`와 동일 (사용자 인터뷰 → 구조 설계 → 패턴 선택 → 텍스트 아트). 청중은 주로 해외 파트너사·리셀러·SI·투자자. 분량 기본 25-40장.

### 구조 / 패턴 선택

dark-trio와 동일한 패턴 카탈로그(A~T) + trio 고유 패턴(U~Z). 아래 표는 dark-trio SKILL.md와 동일하므로 그대로 사용하고, **색·명도·로고만 본 SKILL.md의 라이트 토큰으로 교체**한다.

| 패턴 | 용도 |
|------|------|
| U. 깔끔한 라이트 표지 | 글로우 없이 대형 타이포 + 보더 알약 라벨 (이탤릭 X) |
| V. AI Solution 디바이더 | "HANCOM AI SOLUTION 0N" 알약 + 거대 제목, 가운데 정렬 |
| W. 듀얼 컬러 비교 | 스카이블루(Open) vs 주황(Commercial) 헤더 + 내부 항목 박스 |
| X. 워크플로우 노드 캔버스 | 옅은 배경 캔버스 + 3색 카테고리 노드 |
| Y. KPI 카드 | 에메랄드 큰 숫자 + 주황 증감률 |
| Z. 클로징 메시지 | 가운데 메시지 + 양쪽 원 노드 (주황 HANCOM ↔ 블루 PARTNER) |

---

## Phase 2: PPTX 생성

### Step 0: 이미지 리소스 준비

dark-trio와 동일 (원본 스캔 → 리사이즈/라운딩 → 해상도 prefix → 사용자 확인). `/document-skills:pptx` 호출.

### 슬라이드 설정

```javascript
pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
```

### 폰트

**Pretendard**. **이탤릭 절대 금지** — 강조는 색·굵기로만. 텍스트 기본색이 다크(차콜)인 점만 dark-trio와 다름.

| 역할 | 크기 | fontFace | 색상 |
|------|------|----------|------|
| 표지 대형 타이포 | 54~72pt | FONT.exbold/black | `#16181D` 차콜 |
| 표지 부제 | 22~24pt | FONT.medium | `#5A6470` |
| 디바이더 거대 제목 | 44~54pt | FONT.exbold | `#16181D` (키워드만 주황) |
| AI Solution 알약 라벨 | 13pt | FONT.exbold | `#E8500F` |
| 메인 헤드라인 | 28~38pt | FONT.exbold | `#16181D` (키워드만 주황) |
| 듀얼 카드 헤더 | 16pt | FONT.exbold | `#FFFFFF` (배경이 색) |
| KPI 큰 숫자 | 42~46pt | FONT.exbold | `#1FA968` 에메랄드(조정) |
| KPI 증감률 | 14pt | FONT.bold | `#E8500F` 주황(조정) |
| 카드 한글 큰 타이틀 | 20pt | FONT.exbold | `#16181D` |
| 카드 내 헤딩 | 16~18pt | FONT.exbold | `#16181D` |
| 슬라이드 부제 | 13~16pt | FONT.regular | `#5A6470` |
| 본문 | 11~15pt | FONT.regular/medium | `#16181D` 또는 `#5A6470` |
| 영문 라벨 / 챕터 칩 | 8~13pt | FONT.exbold | `#16181D` 또는 `#939BA5` |
| 캡션·메타 | 11~12pt | FONT.regular | `#939BA5` |
| 출처/footnote | 8pt | FONT.regular | `#B0B7C0` |

### 색상 (3색 라이트 조정 + 중첩 + 보더)

```javascript
const COLOR = {
  bg:        "FFFFFF",  // 흰색 — 기본 슬라이드 배경
  // 중첩 명도 (라이트 — 안쪽으로 갈수록 살짝 어둡게, 다크와 반대)
  lv0:       "F7F9FB",  // 최외곽 컨테이너 (아키텍처/캔버스 바탕) — 흰색에 가깝게, 면보다 보더로 구분
  lv1:       "FFFFFF",  // 메인 카드 (흰색, 보더로 구분)
  lv2:       "F6F8FA",  // 카드 안 항목 박스
  lv3:       "EDF0F4",  // 항목 안 서브 박스
  // 보더 (옅은 회색 — 안쪽일수록 진하게)
  bd1:       "E3E7EC",  // 메인 카드 보더
  bd2:       "D3D9E0",  // 항목 박스 보더
  bd3:       "C2CAD3",  // 서브 박스 보더
  // 3색 시스템 (라이트 조정색 — 흰 배경 가독성)
  primary:   "E8500F",  // 주황(조정) — 주조색. 헤드라인 키워드, Commercial, 증감률, 강조
  secondary: "2E72C8",  // 스카이블루(조정) — 서브1. Open Core, 듀얼 좌측, 코어
  tertiary:  "1FA968",  // 에메랄드(조정) — 서브2. KPI 숫자, 성장, Growing, 액션 노드
  // 듀얼/노드 헤더 배경에는 원색을 써도 됨 (배경색이라 가독성 무관)
  primaryRaw:   "FC5E20",  // 헤더 바·노드 배경용 원색 주황 (선택)
  secondaryRaw: "4A8FE0",  // 헤더 바·노드 배경용 원색 블루 (선택)
  tertiaryRaw:  "34C77B",  // 헤더 바·노드 배경용 원색 에메랄드 (선택)
  // 강조 박스 배경 (라이트)
  primaryTint:  "FFF3EE",  // 주황빛 옅은 배경 — 강조 항목
  // 텍스트
  text:      "16181D",  // 차콜 — 헤드라인·본문 기본
  textSub:   "5A6470",  // 미디엄 그레이 — 부제·본문 보조
  textDim:   "939BA5",  // 라이트 그레이 — 캡션·라벨
  textMeta:  "B0B7C0",  // 더 옅은 그레이 — footnote
};
```

**규칙**:
- **액센트는 주황·스카이블루·에메랄드 3색만** (라이트 조정색). 그 외 색 금지.
- **텍스트로 쓰는 색은 조정색**(primary/secondary/tertiary), **배경 면(헤더 바·노드)은 원색(Raw)도 가능** — 색 면 위 흰 텍스트는 원색이 더 선명.
- 본문 텍스트는 `#16181D`(차콜) 또는 `#5A6470`만.
- 주황이 주조색. 블루·에메랄드는 서브.
- 메인 헤드라인은 차콜, 키워드 1개만 주황 강조.

### 카드 스타일 (시그니처 — 중첩 보더, 라이트)

모든 카드는 `ROUNDED_RECTANGLE` + **옅은 회색 보더**. 라이트는 안쪽으로 갈수록 배경이 **살짝 어두워지고**(흰색→옅은 회색) 보더가 진해져 중첩 깊이감.

**메인 카드 (레벨 1)** — 흰색 + 보더
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "FFFFFF" },
  line: { color: "E3E7EC", width: 0.75 },
  rectRadius: 0.08,
});
```

**카드 안 항목 박스 (레벨 2)** — 옅은 회색
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: cardX + 0.18, y: itemY, w: cardW - 0.36, h: 0.5,
  fill: { color: "F6F8FA" },
  line: { color: "D3D9E0", width: 0.75 },
  rectRadius: 0.05,
});
```

**항목 안 서브 박스 (레벨 3)** — 더 옅은 회색
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: itemX + 0.12, y: subY, w: itemW - 0.24, h: 0.32,
  fill: { color: "EDF0F4" },
  line: { color: "C2CAD3", width: 0.5 },
  rectRadius: 0.04,
});
```

**최외곽 컨테이너 (레벨 0)** — 옅은 회색 바탕
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "F2F4F7" },
  line: { color: "E3E7EC", width: 0.75 },
  rectRadius: 0.1,
});
```

**주황 강조 박스** (특정 항목 강조)
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "FFF3EE" },        // 주황빛 옅은 배경
  line: { color: "FC5E20", width: 1 }, // 주황 보더 (원색)
  rectRadius: 0.05,
});
// 텍스트는 주황(조정) #E8500F
```

**보더 규칙**:
- 모든 카드·박스에 보더 필수 (보더 없는 솔리드 카드 금지)
- 중첩 레벨에 맞는 배경+보더 페어 (lv1+bd1, lv2+bd2, lv3+bd3)
- 라이트는 명도가 **안쪽으로 갈수록 어두워짐**(다크와 반대) — `흰색 → F6F8FA → EDF0F4`
- pptxgenjs 그림자(`shadow`)는 선택 — 라이트에선 카드에 미세 그림자가 깊이감을 더함:
  ```javascript
  shadow: { type: "outer", color: "1A2A4A", opacity: 0.05, blur: 4, offset: 1, angle: 90 }
  ```

### 챕터 칩 헤더

dark-trio와 동일 구조, 색만 라이트로:
```javascript
// 챕터 번호 칩
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.40, y: 0.42, w: 0.50, h: 0.30,
  fill: { color: "F6F8FA" }, line: { color: "D3D9E0", width: 0.75 }, rectRadius: 0.04,
});
slide.addText("02", { x: 0.40, y: 0.42, w: 0.50, h: 0.30, fontSize: 12, fontFace: FONT.exbold, color: "16181D", align: "center", valign: "middle", margin: 0 });
// 섹션 라벨
slide.addText("Software Architecture", { x: 1.02, y: 0.42, w: 6.5, h: 0.30, fontSize: 13, fontFace: FONT.exbold, color: "939BA5", charSpacing: 1.5, valign: "middle", margin: 0 });
// 메인 헤드라인 (키워드만 주황, 이탤릭 X)
slide.addText([
  { text: "From Data Extraction to ", options: { color: "16181D" } },
  { text: "Accessibility", options: { color: "E8500F" } },
], { x: 0.40, y: 0.92, w: 12.53, h: 0.70, fontSize: 32, fontFace: FONT.exbold, margin: 0 });
```

### 반복 요소

```javascript
// 로고 (우상단). 기본 = 검은색 워드마크(라이트 배경). 컬러/다크 면 위에는 hnc-logo-white.png 사용
slide.addImage({ path: "assets/hnc-logo-black.png", x: 11.7, y: 0.47, w: 1.0, h: 0.22 });
```

---

## trio 시그니처 패턴 (라이트)

dark-trio SKILL.md의 U~Z 패턴 코드와 **구조 동일**. 아래 색 치환만 적용:

| dark 토큰 | → light 토큰 |
|-----------|-------------|
| `bg 000000` | `FFFFFF` |
| `text FFFFFF` | `16181D` (차콜) |
| `textSub B0BEC5` | `5A6470` |
| `textDim 8A8F99` | `939BA5` |
| `lv0 121217 / lv1 1A1A22 / lv2 23232E / lv3 2C2C38` | `F7F9FB / FFFFFF / F6F8FA / EDF0F4` |
| `bd1 2E2E38 / bd2 3A3A45 / bd3 45454F` | `E3E7EC / D3D9E0 / C2CAD3` |
| 텍스트 주황 `DD5C28` (다크 톤다운) | `E8500F` |
| 텍스트 블루 `4A8FE0` | `2E72C8` |
| 텍스트 에메랄드 `34C77B` | `1FA968` |
| 강조 박스 배경 `2A1810` | `FFF3EE` |

**색 면(헤더 바·원 노드·워크플로우 노드) 배경**은 원색(`FC5E20 / 4A8FE0 / 34C77B`)을 써도 됨 — 그 위 흰 텍스트가 더 선명. 텍스트·아이콘·얇은 선으로 쓰는 색만 조정색 사용.

### 예: U. 라이트 표지

```javascript
slide.background = { color: "FFFFFF" };
// 보더 알약 라벨
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.64, y: 2.30, w: 3.4, h: 0.42,
  fill: { color: "FFFFFF" }, line: { color: "D3D9E0", width: 0.75 }, rectRadius: 0.21,
});
slide.addText("GLOBAL PARTNERSHIP PROPOSAL", {
  x: 0.64, y: 2.30, w: 3.4, h: 0.42,
  fontSize: 11, fontFace: FONT.exbold, color: "E8500F", charSpacing: 2, align: "center", valign: "middle", margin: 0,
});
// 대형 타이포 (차콜, 이탤릭 X)
slide.addText("HANCOM Solutions", { x: 0.60, y: 2.85, w: 11, h: 1.2, fontSize: 64, fontFace: FONT.exbold, color: "16181D", margin: 0 });
// 부제
slide.addText("Integrated AI · Data · Workflow Automation", { x: 0.64, y: 4.15, w: 11, h: 0.6, fontSize: 22, fontFace: FONT.medium, color: "5A6470", margin: 0 });
```

### 예: Y. KPI 카드 (라이트)

```javascript
function kpiCard(x, label, value, unit, delta) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 2.6, w: 3.95, h: 1.7,
    fill: { color: "FFFFFF" }, line: { color: "E3E7EC", width: 0.75 }, rectRadius: 0.08,
    shadow: { type: "outer", color: "1A2A4A", opacity: 0.05, blur: 4, offset: 1, angle: 90 },
  });
  slide.addText(label, { x: x+0.3, y: 2.8, w: 3.4, h: 0.3, fontSize: 12, fontFace: FONT.bold, color: "939BA5", charSpacing: 1, margin: 0 });
  slide.addText([
    { text: value, options: { fontSize: 44 } },
    { text: unit || "", options: { fontSize: 26 } },
  ], { x: x+0.3, y: 3.15, w: 3.4, h: 0.7, fontFace: FONT.exbold, color: "1FA968", margin: 0 });  // 에메랄드 조정
  slide.addText(delta, { x: x+0.3, y: 3.85, w: 3.4, h: 0.3, fontSize: 14, fontFace: FONT.bold, color: "E8500F", margin: 0 });  // 주황 조정
}
```

### 예: Z. 클로징 원 노드 (라이트)

```javascript
slide.background = { color: "FFFFFF" };
// 메시지 (차콜 + 키워드 조정색, 이탤릭 X)
slide.addText([
  { text: "With ", options: { color: "16181D" } },
  { text: "#1 global technology", options: { color: "1FA968" } },
  { text: " proven through open source,\nwe build the global ", options: { color: "16181D" } },
  { text: "PDF Intelligence", options: { color: "E8500F" } },
  { text: " business together.", options: { color: "16181D" } },
], { x: 1.4, y: 2.3, w: 10.5, h: 1.6, fontSize: 34, fontFace: FONT.exbold, align: "center", lineSpacingMultiple: 1.3, margin: 0 });
// 원 노드는 원색 면 + 흰 텍스트
slide.addShape(pres.shapes.OVAL, { x: 4.3, y: 4.6, w: 1.5, h: 1.5, fill: { color: "FC5E20" }, line: { type: "none" } });
slide.addText("HANCOM", { x: 4.3, y: 4.6, w: 1.5, h: 1.5, fontSize: 15, fontFace: FONT.exbold, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
slide.addShape(pres.shapes.LINE, { x: 5.95, y: 5.35, w: 1.4, h: 0, line: { color: "34C77B", width: 2.5 } });
slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 4.6, w: 1.5, h: 1.5, fill: { color: "4A8FE0" }, line: { type: "none" } });
slide.addText("GLOBAL\nPARTNER", { x: 7.5, y: 4.6, w: 1.5, h: 1.5, fontSize: 14, fontFace: FONT.exbold, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
```

나머지 패턴(V 디바이더, W 듀얼 비교, X 노드 캔버스, U-arch 중첩 아키텍처)은 dark-trio SKILL.md의 코드에서 위 색 치환 표를 적용한다.

---

### 이미지 정책 / 라운딩 / 미니카드

dark-trio와 동일. 미니카드 보더는 `line: { color: "E3E7EC", width: 0.75 }`, 아이콘 색은 3색 조정색(주황 `#E8500F`·블루 `#2E72C8`·에메랄드 `#1FA968`).

### QA

`/document-skills:pptx`의 QA 절차. PPTX → 이미지 변환 후 서브에이전트 검수.

**본 스킬 우선 체크**:
- 액센트가 주황·스카이블루·에메랄드 **3색만** 쓰였는지 (텍스트는 조정색, 색 면은 원색 허용)
- **이탤릭이 하나도 없는지** (`italic: true` 발견 시 즉시 제거)
- 모든 카드·박스에 **보더가 있는지** (보더 없는 솔리드 카드 금지)
- 중첩 박스의 배경 명도가 안쪽으로 갈수록 **어두워지는지** (흰색 < F6F8FA < EDF0F4)
- 본문 텍스트가 `#16181D` 또는 `#5A6470`만 쓰였는지 (라이트 배경 가독성)
- 주황이 주조색으로 가장 눈에 띄는지
- 흰 배경에서 에메랄드·블루가 조정색(`1FA968`·`2E72C8`)으로 충분히 진한지 — 원색을 텍스트로 쓰면 연해서 위반

---

## 자매 스킬과의 관계

| 스킬 | 톤 | 배경 | 액센트 | 카드 | 용도 |
|------|---|------|--------|------|------|
| `suji-ppt-dark-trio` | 다크 | #000000 | 주황+블루+에메랄드 (원색) | 중첩 보더 (안쪽 밝게) | 다크 파트너 제안 |
| `suji-ppt-light-purple` | 라이트 | #FFFFFF | 인디고 단색 | 그레이 #F0F0F0 | 공식 기업 제안 |
| `suji-ppt-dark-orange` | 다크 | #000000 | 주황 단독 | 솔리드 | CEO 단정 보고 |
| **`suji-ppt-light-trio`** | **라이트** | **#FFFFFF** | **주황+블루+에메랄드 (조정색)** | **중첩 보더 (안쪽 어둡게)** | **라이트 파트너 제안** |

dark-trio와 패턴·구조 100% 공유, 색·명도 토큰만 라이트 반전. 같은 콘텐츠를 다크/라이트 두 톤으로 낼 때 두 스킬을 짝으로 사용.

## 참조 파일

| 파일 | 용도 |
|------|------|
| `references/layout-patterns.md` | 패턴 A-T 인덱스 + 텍스트 아트 예제 (자매 스킬 공통). 색·보더·폰트는 본 SKILL.md 라이트 토큰으로 오버라이드하고 **이탤릭은 모두 정자체로 변환** |
| `assets/hnc-logo-black.png` | 검은색 워드마크 + 주황 H — **라이트 배경 기본** (1200×264, 비율 4.55:1) |
| `assets/hnc-logo-white.png` | 흰색 워드마크 + 주황 H — 컬러·다크 면 위 예외용 |
