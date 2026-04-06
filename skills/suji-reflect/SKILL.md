---
name: suji-reflect
description: 세션 복기 — 무의식적 판단을 의식적으로 분해하여 artifact.md + thinking.md를 생성
---

# /suji-reflect

대화를 복기하고, artifact.md + thinking.md를 생성한다. 세션 중간이든 끝이든 아무 때나 호출 가능.

## 목적

"나는 내가 하는 일을 자각하기 힘들다."
이 스킬은 대화에서 사용자가 무의식적으로 한 판단을 의식적으로 분해한다.
템플릿을 채우는 도구가 아니라, 대화를 통한 인터뷰가 핵심이다.

## 저장 경로

`~/Workspace/personal/thinking_helper/reflect/yyyymmdd_제목/`

## 워크플로우

### Step 1: 날것 덤프

사용자에게 묻는다:
"이 세션에서 떠오르는 것들을 자유롭게 던져줘. 단어, 느낌, 고민 아무거나."

사용자가 패스하면 Claude가 세션에서 사용자가 내린 판단들을 나열하고 시작점을 제안한다.

### Step 2: 엮기

흩어진 조각들 사이의 연결고리를 찾아서 보여준다.
"여기서 내가 보는 연결고리는 ..."

### Step 3: 인터뷰

5가지 분해 방법을 활용하여 질문으로 파고든다:

1. **거울** — 선택을 비춰주기. "너 이거 골랐어, 왜인지 같이 보자"
2. **대비** — 두 개를 나란히 놓기. 서로 다른 것을 비교하면 무의식적 기준이 드러남
3. **안 한 것 짚기** — 한 것보다 안 한 것이 더 많은 걸 말해줄 때가 있음
4. **느낌 먼저, 이유 나중에** — "이건 아닌데"라는 느낌이 오는 순간을 포착
5. **반복 패턴 누적** — 이전 thinking.md가 있으면 읽고 연결

**인터뷰 규칙:**
- 질문은 한 번에 하나씩
- 사용자가 다른 주제로 갈 때, "도망"이라고 성급하게 프레이밍하지 않는다. 리뷰 중 떠오르는 것을 바로 처리하고 돌아오는 것이 사용자의 자연스러운 사고 방식일 수 있다
- "모르겠다"는 유효한 답이다. 억지로 이유를 만들지 않는다
- 사용자가 "충분하다" 또는 "정리하자"고 하면 Step 4로 넘어간다

### Step 4: 정리

인터뷰 결과를 아래 템플릿으로 정리한다.
**생성 전 반드시 내용을 보여주고 승인받는다.**

승인 후 파일을 생성한다:
```bash
mkdir -p ~/Workspace/personal/thinking_helper/reflect/yyyymmdd_제목/
```

### artifact.md 템플릿

```markdown
# Artifact: {session title}
Date: {yyyymmdd}
Session: {1줄 요약}

## 산출물 목록
- {tangible output — code, document, config, design decision, anything created}

## 주요 결정사항
- {decision}: {what was decided and why}

## 변경된 파일
- {file path}: {what changed}
```

### thinking.md 템플릿

```markdown
# Thinking: {session title}
Date: {yyyymmdd}
Tags: {사고 패턴 태그 — e.g., #scope-control, #trade-off, #bias, #reframe}

## 전제 (내가 깔고 들어간 것)
- {premise}: {검증되었는가? 맞았는가?}

## 갈림길 (대안이 있었던 순간)
### 갈림길 1: {무엇에 대한 선택이었나}
- 선택한 것: {A}
- 포기한 것: {B, C}
- 왜 이걸 골랐나: {이유}
- 무의식적이었나: {예/아니오}

## 발견 (이번에 알게 된 것)
- {사고 습관, 편향, 강점, 맹점 등}

## 다음에 다르게 할 것
- {구체적 행동 변화}
```

## Edge Cases

- **판단이 거의 없는 세션** (순수 디버깅 등): artifact.md만 생성, thinking.md는 "실행 위주 세션" 한 줄
- **하루에 여러 세션**: 폴더명 제목으로 구분
- **여러 주제를 다룬 세션**: 갈림길을 주제별로 분리
- **사용자가 인터뷰를 원하지 않을 때**: Claude가 세션을 복기하여 초안을 제시, 사용자가 수정

## 핵심 규칙

- 파일 생성 전 반드시 내용을 보여주고 승인받는다
- 디자인/콘텐츠는 사용자 확인 없이 변경 불가
- KB(sujicho-kb)와는 별개 시스템이다. KB는 세션 아카이브, 이것은 사고 분해
