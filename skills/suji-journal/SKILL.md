---
name: suji-journal
description: KB self/journal/에 일상 메모·일기를 기록. 대화 모드(talk)와 받아쓰기 모드(write) 선택 가능.
---

# /suji-journal

`~/Workspace/sujicho-kb/self/journal/`에 자유 형식 일기/메모를 기록한다.

## 서브커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-journal` | 모드 선택 후 시작 |
| `/suji-journal talk` | 대화 모드 바로 시작 |
| `/suji-journal write` | 받아쓰기 모드 바로 시작 |

## 저장 경로

`~/Workspace/sujicho-kb/self/journal/YYYY-MM-DD.md`

하루 1파일. 같은 날 여러 번 쓰면 기존 파일에 append.

## 모드

### talk — 대화 모드

Claude가 가볍게 물어보고, 대화를 통해 오늘의 기록을 함께 정리한다.

**시작:**
"오늘 어땠어? 떠오르는 거 아무거나."

**진행 규칙:**
- 질문은 한 번에 하나
- 가볍게. reflect처럼 파고들지 않는다
- 사용자가 짧게 답하면 짧게 받는다. 억지로 늘리지 않는다
- "충분해" 또는 "저장해" 하면 정리 단계로

**정리:**
대화 내용을 자연스러운 일기체로 정리한다. 사용자가 한 말의 톤과 표현을 최대한 살린다.
정리본을 보여주고 승인받은 후 저장.

### write — 받아쓰기 모드

사용자가 하는 말을 **그대로** 기록한다. 편집, 요약, 정리 하지 않는다.

**시작:**
"받아쓰기 시작. 끝나면 '저장해'라고 해줘."

**진행 규칙:**
- 사용자의 말을 그대로 기록한다
- 맞춤법 교정, 문장 다듬기, 구조화 하지 않는다
- 중간에 질문하지 않는다
- "저장해" 하면 저장 단계로

**저장:**
받아쓴 내용을 그대로 보여주고 확인 후 저장.

## 파일 포맷

```markdown
---
date: YYYY-MM-DD
tags: []
mode: talk | write
linked_reflects: []
linked_wiki: []
---

## HH:MM

{내용}
```

- `## HH:MM` 헤더로 시간 구분 (같은 날 여러 번 쓸 때)
- tags는 저장 직전에 자동 제안. 사용자가 수정/추가/스킵 가능

## 저장 플로우

1. 정리본(talk) 또는 받아쓴 내용(write)을 보여준다
2. tags 자동 제안: 내용에서 키워드 추출하여 2-3개 제안
3. 사용자 확인
4. 파일 저장:

```bash
# 오늘 파일이 이미 있으면 append
JOURNAL_PATH=~/Workspace/sujicho-kb/self/journal/$(date +%Y-%m-%d).md
```

- 파일이 없으면 frontmatter + 내용으로 신규 생성
- 파일이 있으면 `## HH:MM` 헤더와 내용만 append (frontmatter의 tags는 병합)

5. commit은 하지 않는다. `/suji-kb` 세션 종료 시 일괄 commit.

## self/ 존 규칙 (공통)

- 절대 비공개. publishable: false.
- 검열 없음. 솔직한 기록 우선.
- 대화 모드에서도 판단/조언/분석 하지 않는다. 기록이 목적.

## Edge Cases

- **세션 중간에 호출**: 작업 대화와 journal 내용이 섞이지 않게, journal 완료 후 원래 작업으로 돌아간다
- **reflect와 겹칠 때**: journal은 가볍게 기록, reflect는 깊게 분해. 사용자가 journal 중 패턴을 발견하면 reflect로 전환 제안 가능
- **빈 내용**: "별거 없었어" 도 유효한 기록. 억지로 채우지 않는다
