---
name: suji-ppt-dark-trio
description: 다크 배경 + 주황(#DD5C28) 주조색 + 스카이블루(#4A8FE0)·에메랄드(#34C77B) 서브 2색의 글로벌 파트너 제안용 PPTX를 생성합니다. 중첩 보더 카드가 시그니처. '/suji-ppt-dark-trio'로 호출할 때만 활성화됩니다.
---

# 글로벌 파트너 제안용 다크 트라이오 PPTX 생성

해외 파트너사 소개·제안 톤(다크 배경 + 주황 주조 + 스카이블루·에메랄드 서브 2색 + 중첩 보더 카드)의 PPTX를 생성한다. 신뢰도와 한컴 정체성(주황)을 유지하면서, 서브 2색으로 듀얼 비교·KPI·노드 카테고리를 색-코딩한다. 자매 스킬:

- `suji-ppt-dark-orange` (다크 + 주황 단일, **CEO 단정 보고**)
- `suji-ppt-light-purple` (라이트 + 인디고, **공식 기업 제안**)
- `bundo-ppt-ember` (다크 + 주황 다채로움, **컨퍼런스 활기**)
- **본 스킬** (다크 + 주황 주조 + 블루·에메랄드 서브 + 중첩 보더, **글로벌 파트너 제안**)

네 스킬이 동일 패턴 카탈로그(A~T)를 공유하므로 콘텐츠 구조는 호환된다. 본 스킬은 거기에 trio 고유 패턴(U~Z)을 추가한다.

## 본 스킬의 3대 정체성 (절대 규칙)

1. **3색 시스템** — 주황(주조) + 스카이블루(서브1) + 에메랄드(서브2). 이 외의 액센트 색 금지.
2. **중첩 보더 카드** — 모든 박스에 옅은 보더 + 안쪽으로 갈수록 밝아지는 명도 4단계. 솔리드 단색 카드 금지.
3. **이탤릭 미사용** — 강조는 **색과 굵기로만**. `italic: true` 절대 금지 (dark-orange/PDF 원본과 다른 본 스킬의 핵심 차별점).

## 워크플로우 (3-Phase Cycle · Double Diamond 기반)

```
시작 → 범위 명시 프롬프트: "오늘 어떤 결정에 대한 피드백이 필요한가요?"
        ↓
[Phase 1] 시나리오 설계 + 와이어프레임  — 메시지·구조·내러티브
        ↓ [Gate 1: 메시지·구조 OK? → 자가 비평 3줄 동봉]
[Phase 2] PPTX 생성 (시안)            — 시각화·레이아웃·패턴
        ↓ [Gate 2: 디자인 OK? → 자가 비평 3줄 동봉]
[Phase 3] 정교화 (Polish)             — 폰트·색·여백·아이콘·자간
        ↓ [Gate 3: 디테일 OK?]
   완료
```

**각 Phase 종료 시 사용자 확인 의무.** 시안 제출 시 "자가 비평 루틴"(아래) 3줄 동봉.

근거: UK Design Council Double Diamond (1st gate = 문제·메시지 / 2nd gate = 해법·디자인) + Google Design Critique 범위 명시 + Stanford d.school I Like/I Wish/What If. 상세 방법론: `~/Workspace/work/outputs/research/20260529_design_improvement_methodology.md`

---

## Phase 1: 시나리오 설계

### 사용자 인터뷰

**먼저 1줄로 범위 명시**: "오늘 어떤 결정에 대한 피드백이 필요한가요?" — Google Design Critique 원칙. 범위 밖 의견은 별도 백로그로 분리.

이어서 파악할 것: **주제**, **청중**(주로 해외 파트너사·리셀러·SI·투자자), **목표**(제휴·라이선스·파일럿), **분량** (기본 25-40장), **기존 콘텐츠**

### 구조 설계

```
1. 표지 (U — 글로우 없는 깔끔한 다크 + 대형 타이포, 이탤릭 X)
2. 목차 (C — PART 01/02/03 챕터별 인덱스)
3. 섹션 디바이더 (V — "HANCOM AI SOLUTION 0N" 알약 라벨 + 거대 제목)
4~N. [챕터 반복]:
   - 내용 슬라이드 3-7장 (좌상단 챕터 칩 + 헤더 + 중첩 보더 카드 그리드)
   - 듀얼 비교(W) / KPI(Y) / 워크플로우 노드(X) 등 trio 패턴 활용
N+1. 요약/결론
N+2. 클로징 메시지 (Z — 주황↔블루 원 노드)
N+3. 감사합니다 (P)
```

### 패턴 선택

`references/layout-patterns.md`의 인덱스(A~T)에서 용도에 맞는 패턴을 선택하고, 색·보더 토큰은 본 SKILL.md의 매핑을 적용한다.

| 카테고리 | 패턴 | 용도 |
|---------|------|------|
| 오프닝/클로징 | A, B, P + **U, Z** | 표지, 소개, 마무리 |
| 네비게이션 | C, D + **V** | 목차, 섹션 디바이더 |
| 데이터/통계 | G, N, R + **Y** | 숫자 설득, 벤치마크, KPI 카드 |
| 비교/대조 | F, H, S + **W** | 문제→해결, 듀얼 컬러 비교 |
| 프로세스/플로우 | E, K + **X** | 타임라인, 워크플로우 노드 캔버스 |
| 피처/제품 | L, M, Q | 개요, 기능 나열, 미니카드 그리드 |
| 아이콘/그리드 | I, J | Use case, 로고 |
| 중첩 구조 | **U-arch** | 시스템 아키텍처(컨테이너▸섹션▸항목▸서브 4단 중첩) |

**trio 고유 패턴 (U~Z)** — 아래 "trio 시그니처 패턴" 섹션 참조:

| 패턴 | 용도 |
|------|------|
| U. 깔끔한 다크 표지 | 글로우 없이 대형 타이포 + 보더 알약 라벨 (이탤릭 X) |
| V. AI Solution 디바이더 | "HANCOM AI SOLUTION 0N" 알약 + 거대 제목, 가운데 정렬 |
| W. 듀얼 컬러 비교 | 스카이블루(Open) vs 주황(Commercial) 헤더 + 내부 항목 박스 |
| X. 워크플로우 노드 캔버스 | 다크 캔버스 + 3색 카테고리 노드 (주황 트리거·블루 코어·에메랄드 액션) |
| Y. KPI 카드 | 에메랄드 큰 숫자 + 주황 증감률 + 영문 라벨 |
| Z. 클로징 메시지 | 가운데 메시지 + 양쪽 원 노드 (주황 HANCOM ↔ 블루 PARTNER) |

### 텍스트 아트 작성

해당 패턴의 예제를 참고하여 실제 콘텐츠를 넣은 텍스트 아트를 작성한다. `deck-plan.md`로 저장하고 사용자 확인을 받는다.

---

## Phase 2: PPTX 생성

### Step 0: 이미지 리소스 준비

`suji-ppt-dark-orange` SKILL.md의 "Step 0" 절차와 동일 (원본 스캔 → 리사이즈/라운딩 → 해상도 prefix). 완료 후 사용자에게 이미지 목록 확인.

`/document-skills:pptx` 스킬을 호출하여 pptxgenjs로 생성한다.

### 슬라이드 설정

```javascript
pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
```

### 폰트

**Pretendard**. 단일 패밀리, weight만 다름. **이탤릭 절대 금지** — 강조는 색·굵기로만.

```javascript
const FONT = {
  black:    "Pretendard Black",     // 거대 타이포 표지의 한 단어
  exbold:   "Pretendard ExtraBold", // 헤드라인 기본
  bold:     "Pretendard Bold",
  semibold: "Pretendard SemiBold",
  medium:   "Pretendard Medium",
  regular:  "Pretendard Regular",
};
```

**모듈러 스케일 1.25 (base 18pt)**: 9 / 12 / 14 / 18 / 22 / 28 / 36 / 44 / 56 / 70 / 88pt. 모든 폰트 사이즈는 이 스케일에 스냅.

| 역할 | 크기 (스케일) | fontFace | 색상 |
|------|------|----------|------|
| 표지 대형 타이포 | **70pt** | FONT.exbold/black | `#FFFFFF` |
| 표지 부제 | **22pt** | FONT.medium | `#B0BEC5` |
| THANK YOU 클로징 | **88pt** | FONT.exbold | `#FFFFFF` |
| 디바이더 거대 제목 | **56pt** | FONT.exbold | `#FFFFFF` (키워드만 주황) |
| 메인 헤드라인 | **28pt** | FONT.exbold | `#FFFFFF` (키워드만 주황) |
| 카드 내 큰 타이틀 | **22pt** | FONT.exbold | `#FFFFFF` |
| KPI 큰 숫자 | **36~56pt** | FONT.exbold | `#34C77B` 에메랄드 |
| 카드 내 헤딩 | **18pt** | FONT.exbold/semibold | `#FFFFFF` |
| 듀얼 카드 헤더 | **14pt** | FONT.semibold | `#FFFFFF` (배경이 색) |
| KPI 증감률 / 부제 | **14pt** | FONT.bold | `#DD5C28` 주황 또는 `#B0BEC5` |
| 본문 | **12 ~ 14pt** | FONT.regular/medium | `#FFFFFF` 또는 `#B0BEC5` |
| 영문 라벨 / 챕터 칩 | **10 ~ 12pt** | FONT.bold | `#FFFFFF` 또는 `#8A8F99` |
| 캡션·메타 | **10 ~ 12pt** | FONT.regular | `#8A8F99` |
| 출처/footnote | **9pt** | FONT.regular | `#7A7F8A` (WCAG AA 4.5:1) |

### 색상 (3색 시스템 + 중첩 4단 + 보더)

```javascript
const COLOR = {
  bg:        "000000",  // 검정 — 기본 슬라이드 배경
  // 중첩 명도 4단계 (안쪽으로 갈수록 밝게)
  lv0:       "121217",  // 최외곽 컨테이너 (아키텍처/캔버스 바탕)
  lv1:       "1A1A22",  // 메인 카드
  lv2:       "23232E",  // 카드 안 항목 박스
  lv3:       "2C2C38",  // 항목 안 서브 박스
  // 보더 (옅은 흰색을 다크에 합성한 근사 hex — 안쪽일수록 진하게)
  bd1:       "2E2E38",  // 메인 카드 보더 (≈ white 8%)
  bd2:       "3A3A45",  // 항목 박스 보더 (≈ white 12%)
  bd3:       "45454F",  // 서브 박스 보더 (≈ white 16%)
  // 3색 시스템
  primary:   "DD5C28",  // 주황 — 주조색. 헤드라인 키워드, Commercial, 증감률, 강조
  secondary: "4A8FE0",  // 스카이블루 — 서브1. Open Core, 듀얼 비교 좌측, 파트너/코어
  tertiary:  "34C77B",  // 에메랄드 — 서브2. KPI 숫자, 성장·긍정, Growing, 액션 노드
  // 텍스트
  text:      "FFFFFF",  // 흰색 — 헤드라인·본문 기본
  textSub:   "B0BEC5",  // 라이트 블루그레이 — 부제·본문 보조
  textDim:   "8A8F99",  // 미디엄 그레이 — 캡션·라벨·메타
  textMeta:  "7A7F8A",  // WCAG AA 4.5:1 (footnote/source용)  // 다크 그레이 — footnote
};
```

**규칙**:
- **액센트는 주황·스카이블루·에메랄드 3색만.** 그 외 색(빨강·노랑·보라 등) 금지.
- **주황이 주조색** — 슬라이드의 핵심 강조는 주황. 블루·에메랄드는 서브 역할(분류·비교).
- 본문 텍스트는 `#FFFFFF` 또는 `#B0BEC5`만.
- 슬라이드당 액센트 색은 역할이 명확할 때만 (주황=강조/Commercial, 블루=Open/분류, 에메랄드=수치/성장).
- 메인 헤드라인은 흰색, 키워드 1개만 주황 강조 가능.

### 카드 스타일 (본 스킬 시그니처 — 중첩 보더)

모든 카드는 `ROUNDED_RECTANGLE` + **옅은 보더**. 안쪽으로 갈수록 배경이 밝아지고 보더가 진해져 중첩 깊이감을 만든다.

**메인 카드 (레벨 1)**
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "1A1A22" },
  line: { color: "2E2E38", width: 0.75 },
  rectRadius: 0.08,
});
```

**카드 안 항목 박스 (레벨 2)** — 중첩 1단
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: cardX + 0.18, y: itemY, w: cardW - 0.36, h: 0.5,
  fill: { color: "23232E" },
  line: { color: "3A3A45", width: 0.75 },
  rectRadius: 0.05,
});
```

**항목 안 서브 박스 (레벨 3)** — 중첩 2단
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: itemX + 0.12, y: subY, w: itemW - 0.24, h: 0.32,
  fill: { color: "2C2C38" },
  line: { color: "45454F", width: 0.5 },
  rectRadius: 0.04,
});
```

**최외곽 컨테이너 (레벨 0)** — 아키텍처/캔버스 바탕
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "121217" },
  line: { color: "2E2E38", width: 0.75 },
  rectRadius: 0.1,
});
```

**주황 강조 박스** (특정 항목 강조 — Document Solution 등)
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: "2A1810" },        // 주황빛 도는 어두운 배경
  line: { color: "DD5C28", width: 1 }, // 주황 보더
  rectRadius: 0.05,
});
// 텍스트는 흰색
```

**보더 규칙**:
- 모든 카드·박스에 보더 필수 (보더 없는 솔리드 카드 금지 — 본 스킬 정체성)
- 중첩 레벨에 맞는 배경+보더 페어 사용 (lv1+bd1, lv2+bd2, lv3+bd3)
- 보더 width는 0.5~0.75pt로 은은하게 (1pt는 주황 강조 박스만)

### 챕터 칩 헤더 (모든 내용 슬라이드 공통)

좌상단 **챕터 칩 + 섹션 라벨 + 헤드라인** 구조.

```javascript
// 1. 챕터 번호 칩 (보더 포함)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.40, y: 0.42, w: 0.50, h: 0.30,
  fill: { color: "23232E" }, line: { color: "3A3A45", width: 0.75 }, rectRadius: 0.04,
});
slide.addText("02", {
  x: 0.40, y: 0.42, w: 0.50, h: 0.30,
  fontSize: 12, fontFace: FONT.exbold, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0,
});
// 2. 섹션 라벨
slide.addText("Software Architecture", {
  x: 1.02, y: 0.42, w: 6.50, h: 0.30,
  fontSize: 13, fontFace: FONT.exbold, color: "8A8F99",
  charSpacing: 1.5, valign: "middle", margin: 0,
});
// 3. 메인 헤드라인 (키워드만 주황, 이탤릭 X)
slide.addText([
  { text: "From Data Extraction to ", options: { color: "FFFFFF" } },
  { text: "Accessibility", options: { color: "DD5C28" } },
], {
  x: 0.40, y: 0.92, w: 12.53, h: 0.70,
  fontSize: 32, fontFace: FONT.exbold, margin: 0,
});
```

### 반복 요소

```javascript
// 로고 (우상단). 기본 = 흰색 워드마크(다크 배경). 흰 카드/라이트 면 위에는 hnc-logo-black.png 사용
slide.addImage({ path: "assets/hnc-logo-white.png", x: 11.7, y: 0.47, w: 1.0, h: 0.22 });
```

---

## trio 시그니처 패턴

### U. 깔끔한 다크 표지 (글로우 없음, 이탤릭 없음)

```javascript
slide.background = { color: "000000" };
// 보더 알약 라벨
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.64, y: 2.30, w: 3.4, h: 0.42,
  fill: { color: "000000" }, line: { color: "3A3A45", width: 0.75 }, rectRadius: 0.21,
});
slide.addText("GLOBAL PARTNERSHIP PROPOSAL", {
  x: 0.64, y: 2.30, w: 3.4, h: 0.42,
  fontSize: 11, fontFace: FONT.exbold, color: "DD5C28",
  charSpacing: 2, align: "center", valign: "middle", margin: 0,
});
// 대형 타이포 (흰색, 이탤릭 X)
slide.addText("HANCOM Solutions", {
  x: 0.60, y: 2.85, w: 11, h: 1.2,
  fontSize: 64, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});
// 부제 (라이트 그레이, 이탤릭 X)
slide.addText("Integrated AI · Data · Workflow Automation", {
  x: 0.64, y: 4.15, w: 11, h: 0.6,
  fontSize: 22, fontFace: FONT.medium, color: "B0BEC5", margin: 0,
});
```

**금지**: radial-gradient 글로우 배경, 궤도선, 이탤릭. 순수 검정 + 보더 알약 + 정자체.

### V. AI Solution 디바이더

```javascript
slide.background = { color: "000000" };
// 알약 라벨 (주황 보더 + 주황 텍스트)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.64, y: 2.55, w: 3.3, h: 0.44,
  fill: { color: "1A1208" }, line: { color: "DD5C28", width: 0.75 }, rectRadius: 0.22,
});
slide.addText("HANCOM AI SOLUTION 02", {
  x: 0.64, y: 2.55, w: 3.3, h: 0.44,
  fontSize: 13, fontFace: FONT.exbold, color: "DD5C28",
  charSpacing: 1.5, align: "center", valign: "middle", margin: 0,
});
// 거대 제목 (흰색 + 키워드 주황, 이탤릭 X)
slide.addText([
  { text: "2. ", options: { color: "FFFFFF" } },
  { text: "OpenDataLoader", options: { color: "DD5C28" } },
  { text: " PDF", options: { color: "FFFFFF" } },
], {
  x: 0.60, y: 3.15, w: 12, h: 1.1,
  fontSize: 54, fontFace: FONT.exbold, margin: 0,
});
// 부제
slide.addText("PDF Parsing Built for RAG", {
  x: 0.64, y: 4.35, w: 11, h: 0.6,
  fontSize: 26, fontFace: FONT.medium, color: "B0BEC5", margin: 0,
});
```

### W. 듀얼 컬러 비교 (스카이블루 Open vs 주황 Commercial)

```javascript
// 좌 카드: Open Core (스카이블루 헤더)
const dualW = 5.95, dualH = 3.0, gap = 0.43;
function dualCard(x, headerColor, headerText, items) {
  // 카드 (보더)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 2.5, w: dualW, h: dualH,
    fill: { color: "1A1A22" }, line: { color: "2E2E38", width: 0.75 }, rectRadius: 0.08,
  });
  // 헤더 바 (색상)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 2.5, w: dualW, h: 0.55, fill: { color: headerColor }, line: { type: "none" }, rectRadius: 0.08,
  });
  slide.addText(headerText, {
    x: x + 0.3, y: 2.5, w: dualW - 0.6, h: 0.55,
    fontSize: 16, fontFace: FONT.exbold, color: "FFFFFF", valign: "middle", margin: 0,
  });
  // 내부 항목 박스 (중첩 — lv2 + bd2)
  items.forEach((t, i) => {
    const iy = 3.25 + i * 0.62;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.25, y: iy, w: dualW - 0.5, h: 0.5,
      fill: { color: "23232E" }, line: { color: "3A3A45", width: 0.75 }, rectRadius: 0.05,
    });
    slide.addText(t, {
      x: x + 0.5, y: iy, w: dualW - 0.9, h: 0.5,
      fontSize: 14, fontFace: FONT.medium, color: "B0BEC5", valign: "middle", margin: 0,
    });
  });
}
dualCard(0.40, "4A8FE0", "OPEN CORE · Free", ["Apache 2.0 License", "OSS OCR / Table AI", "Free Auto-Tagging"]);
dualCard(0.40 + dualW + gap, "DD5C28", "COMMERCIAL · Enterprise", ["HANCOM OCR AI", "UA1 / UA2 Compliance", "Self-Hosted / SaaS"]);
```

### X. 워크플로우 노드 캔버스 (3색 카테고리)

```javascript
// 캔버스 (lv0 컨테이너)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.40, y: 2.3, w: 12.5, h: 4.4,
  fill: { color: "121217" }, line: { color: "2E2E38", width: 0.75 }, rectRadius: 0.1,
});
// 노드 — 카테고리별 색
const NODE = { trigger: "DD5C28", core: "4A8FE0", action: "34C77B" };
function node(x, y, color, label) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 1.5, h: 0.62,
    fill: { color }, line: { color: "FFFFFF", width: 0.5, transparency: 80 }, rectRadius: 0.08,
  });
  slide.addText(label, {
    x, y, w: 1.5, h: 0.62,
    fontSize: 11, fontFace: FONT.bold, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
  });
}
// 엣지(연결선)는 pres.shapes.LINE, color "3A3A45", width 1
node(0.8, 3.0, NODE.trigger, "⏱ Schedule");
node(0.8, 4.3, NODE.core, "{ } Script");
node(7.0, 3.65, NODE.action, "🔔 Notify");
// 범례 (우측, 3색 카테고리 설명)
```

**노드 색 매핑**: 트리거=주황, 코어(흐름제어)=스카이블루, 액션(실제작업)=에메랄드.

### Y. KPI 카드 (에메랄드 숫자 + 주황 증감률)

```javascript
function kpiCard(x, label, value, unit, delta, deltaColor) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: 2.6, w: 3.95, h: 1.7,
    fill: { color: "1A1A22" }, line: { color: "2E2E38", width: 0.75 }, rectRadius: 0.08,
  });
  slide.addText(label, {
    x: x + 0.3, y: 2.8, w: 3.4, h: 0.3,
    fontSize: 12, fontFace: FONT.bold, color: "8A8F99", charSpacing: 1, margin: 0,
  });
  slide.addText([
    { text: value, options: { fontSize: 44 } },
    { text: unit || "", options: { fontSize: 26 } },
  ], {
    x: x + 0.3, y: 3.15, w: 3.4, h: 0.7,
    fontFace: FONT.exbold, color: "34C77B", margin: 0,  // 에메랄드
  });
  slide.addText(delta, {
    x: x + 0.3, y: 3.85, w: 3.4, h: 0.3,
    fontSize: 14, fontFace: FONT.bold, color: deltaColor || "DD5C28", margin: 0,  // 주황
  });
}
kpiCard(0.40, "GitHub Stars", "21,132", "", "+985%");
```

**KPI 색 규칙**: 큰 숫자 = 에메랄드(성과), 증감률 = 주황(임팩트). 벤치마크 %처럼 비교용 숫자는 흰색도 가능.

### Z. 클로징 메시지 (주황↔블루 원 노드)

```javascript
slide.background = { color: "000000" };
slide.addText("CLOSING MESSAGE", {
  x: 0, y: 1.5, w: 13.33, h: 0.4,
  fontSize: 13, fontFace: FONT.bold, color: "8A8F99", charSpacing: 3, align: "center", margin: 0,
});
// 메시지 (흰색 + 키워드 색, 이탤릭 X)
slide.addText([
  { text: "With ", options: { color: "FFFFFF" } },
  { text: "#1 global technology", options: { color: "34C77B" } },
  { text: " proven through open source,\nwe build the global ", options: { color: "FFFFFF" } },
  { text: "PDF Intelligence", options: { color: "DD5C28" } },
  { text: " business together.", options: { color: "FFFFFF" } },
], {
  x: 1.4, y: 2.3, w: 10.5, h: 1.6,
  fontSize: 34, fontFace: FONT.exbold, align: "center", lineSpacingMultiple: 1.3, margin: 0,
});
// 원 노드 (주황 HANCOM ↔ 에메랄드 연결선 ↔ 블루 PARTNER)
slide.addShape(pres.shapes.OVAL, { x: 4.3, y: 4.6, w: 1.5, h: 1.5, fill: { color: "DD5C28" }, line: { type: "none" } });
slide.addText("HANCOM", { x: 4.3, y: 4.6, w: 1.5, h: 1.5, fontSize: 15, fontFace: FONT.exbold, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
slide.addShape(pres.shapes.LINE, { x: 5.95, y: 5.35, w: 1.4, h: 0, line: { color: "34C77B", width: 2.5 } });
slide.addShape(pres.shapes.OVAL, { x: 7.5, y: 4.6, w: 1.5, h: 1.5, fill: { color: "4A8FE0" }, line: { type: "none" } });
slide.addText("GLOBAL\nPARTNER", { x: 7.5, y: 4.6, w: 1.5, h: 1.5, fontSize: 14, fontFace: FONT.exbold, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
```

### U-arch. 중첩 박스 시스템 아키텍처 (4단 중첩)

컨테이너(lv0) ▸ 섹션(lv1) ▸ 항목(lv2) ▸ 서브(lv3). 각 단계 배경이 밝아지고 보더가 진해져 깊이감.

```javascript
// lv0 컨테이너
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 2.3, w: 12.5, h: 4.4, fill: { color: "121217" }, line: { color: "2E2E38", width: 0.75 }, rectRadius: 0.1 });
// lv1 섹션 (3열) — 섹션 제목은 3색 중 하나로 카테고리 구분
//   PORTAL=스카이블루, AGENT RUNTIME=주황, INTEGRATION HUB=에메랄드
// lv2 항목 박스 (보더 bd2)
// lv3 서브 박스 (보더 bd3, dim 텍스트)
// 강조 항목은 주황 보더 박스 (fill 2A1810 + line DD5C28)
```

섹션 제목 색으로 3색을 카테고리 구분에 활용. 강조 항목 1개만 주황 보더.

---

### 이미지 정책

- **`sizing` 옵션 사용 금지** — 비율 뒤틀림. x, y, w, h로 배치.
- 스크린샷은 사전 리사이즈 + 라운드 처리 (radius 20px, 폰 40px).

### 이미지 라운딩

```javascript
const sharp = require("sharp");
const w = 701, h = 573, radius = 20;
const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect rx="${radius}" ry="${radius}" width="${w}" height="${h}" fill="white"/></svg>`);
await sharp("input.png").composite([{input: mask, blend: "dest-in"}]).png().toFile("rounded.png");
```

### 미니카드 / 아이콘

`suji-ppt-dark-orange`의 미니카드·Lucide 아이콘 패턴 사용. 단:
- 카드에 보더 추가 (`line: { color: "2E2E38", width: 0.75 }`)
- 아이콘 색은 3색만: 주황(핵심), 스카이블루(분류), 에메랄드(성장/액션)

### QA

`/document-skills:pptx`의 QA 절차. PPTX → 이미지 변환 후 서브에이전트 검수.

**본 스킬 우선 체크**:
- 액센트가 주황·스카이블루·에메랄드 **3색만** 쓰였는지 (다른 색 있으면 위반)
- **이탤릭이 하나도 없는지** (`italic: true` 발견 시 즉시 제거 — 본 스킬 핵심 규칙)
- 모든 카드·박스에 **보더가 있는지** (보더 없는 솔리드 카드는 정체성 위반)
- 중첩 박스의 배경 명도가 안쪽으로 갈수록 밝아지는지 (lv0<lv1<lv2<lv3)
- 표지에 **글로우(그라데이션 원)가 없는지**
- 주황이 주조색으로 가장 눈에 띄는지 (블루·에메랄드가 주황보다 강하면 위계 깨짐)
- 본문 텍스트가 #FFFFFF 또는 #B0BEC5만 쓰였는지

---

## 자가 비평 루틴 (I Like / I Wish / What If)

각 Phase Gate에서 시안과 함께 자가 회고 3줄 동봉:

- **I Like** — 이 시안에서 의도대로 잘 풀린 강점 1가지
- **I Wish** — 이번 단계에서 다 못 다룬 한계 1가지
- **What If** — 다음 Phase에서 시도해볼 만한 대안 1가지

**원칙**: 비평자(AI)는 문제·관찰만 제시, 해법 강요 X. 사용자가 결정자(Pixar Braintrust 권한 없는 자문 원칙).

**예시** (DualLab Phase 2 시안 제출 시):
> - I Like: 14장 컴팩트로 미팅 시간 60-90분에 맞춤
> - I Wish: 6단계 워크플로우 분담을 미리 표기하지 않은 결정의 trade-off가 발표 시 어색할 수 있음
> - What If: 디바이더 제거로 12장까지 더 줄이면 핵심에 더 집중 가능

근거: Stanford d.school "I Like/I Wish/What If" — 비평자 감정·제안 분리로 수신자 방어 모드 회피.

---

## 자매 스킬과의 관계

| 스킬 | 톤 | 배경 | 액센트 | 카드 | 강조 | 용도 |
|------|---|------|--------|------|------|------|
| `suji-ppt-dark-orange` | 다크 | #000000 | 주황 단독 | 솔리드 #1A1A22 | 색 | CEO 단정 보고 |
| `suji-ppt-light-purple` | 라이트 | #FFFFFF | 인디고 | 그레이 #F0F0F0 | 색 | 공식 기업 제안 |
| `bundo-ppt-ember` | 다크 | #000000 | 주황+다채 | white 투명 | 색·이탤릭 | 컨퍼런스 활기 |
| **`suji-ppt-dark-trio`** | **다크** | **#000000** | **주황+블루+에메랄드** | **중첩 보더** | **색·굵기 (이탤릭 X)** | **글로벌 파트너 제안** |

같은 패턴 카탈로그(A~T)를 공유. trio는 U~Z 패턴 + 중첩 보더 카드 + 3색 시스템이 차별점.

## 참조 파일

| 파일 | 용도 |
|------|------|
| `references/layout-patterns.md` | 패턴 A-T 인덱스 + 텍스트 아트 예제 (자매 스킬 공통). 색·보더·폰트는 본 SKILL.md 토큰/규칙으로 오버라이드하고 **이탤릭은 모두 정자체로 변환** |
| `assets/hnc-logo-white.png` | 흰색 워드마크 + 주황 H — **다크 배경 기본** (1200×264, 비율 4.55:1) |
| `assets/hnc-logo-black.png` | 검은색 워드마크 + 주황 H — 흰 카드·라이트 면 위 예외용 |

## 방법론 리서치 (이론 근거)

| 파일 | 용도 |
|------|------|
| `~/Workspace/work/outputs/research/20260529_presentation_design_methodology.md` | 시각·내러티브·정보·전달 4축 원칙. Minto Pyramid·Duarte Story Arc·Tufte Data-Ink·Reynolds Presentation Zen 등 |
| `~/Workspace/work/outputs/research/20260529_design_improvement_methodology.md` | 비평·휴리스틱·이터레이션 개선 사이클. 본 스킬의 3-Phase + Gate + 자가 비평 루틴의 근거 |
