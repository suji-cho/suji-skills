# /suji-reflect

세션 복기 스킬. 무의식적 판단을 의식적으로 분해하여 기록한다.

## 사용법

아무 때나 `/suji-reflect`를 호출한다. 세션 중간이든 끝이든 상관없음.

## 워크플로우

1. **날것 덤프** — 머릿속에 떠오르는 단어/고민을 자유롭게 던진다
2. **엮기** — Claude가 흩어진 조각들의 연결고리를 찾아준다
3. **인터뷰** — 질문을 통해 무의식적 판단을 파고든다
4. **정리** — artifact.md + thinking.md로 기록한다

## 산출물

| 파일 | 역할 |
|------|------|
| `artifact.md` | 이 세션에서 뭘 만들었는가 |
| `thinking.md` | 이 세션에서 어떻게 생각했는가 (암묵지 분해) |

## 저장 경로

```
~/Workspace/personal/thinking_helper/reflect/yyyymmdd_제목/
├── artifact.md
└── thinking.md
```

## 분해 방법

1. **거울** — 선택을 비춰주기
2. **대비** — 두 개를 나란히 놓기
3. **안 한 것 짚기** — 하지 않은 선택이 말해주는 것
4. **느낌 먼저, 이유 나중에** — 직감 포착
5. **반복 패턴 누적** — 이전 기록과 연결

## 관련 문서

- 설계 문서: `~/Workspace/personal/thinking_helper/design/20260406_session-reflection-system.md`
- KB(sujicho-kb)와는 별개 시스템
