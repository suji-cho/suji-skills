# suji-performance

분기 성과 문서를 작성하는 스킬. suji-report가 집계한 데이터를 입력으로 받아, ERP 성장 피드백과 AX 사례 테이블을 만든다.

## 위치

```
/suji-report (집계) → /suji-performance (성과 문서) → ERP / AX / Confluence
```

## 사용법

```
/suji-performance                    대화형 — 어떤 문서를 쓸지 물어봄
/suji-performance growth [2026-Q1]   ERP 성장 피드백
/suji-performance ax [2026-Q1]       AX 사례 테이블
```

"OKR 써야 해", "성과 피드백 써야 해", "AX 정리해야 해" 등으로도 트리거된다.

## 워크플로우

### growth (ERP 성장 피드백)

1. suji-report 분기 리포트 확인
2. 사용자에게 이번 분기 OKR/KR 요청
3. ERP 양식 확인, 데일리/월간 전수 스캔
4. OKR 기준으로 업무 매핑
5. 가이드라인 적용하여 초안 작성 (Ralph Loop 체크리스트 11항목)
6. 사용자 검토 후 저장

### ax (AX 사례 테이블)

1. 기존 AX 초안 + suji-report + KB logbook 수집
2. Confluence 컬럼 형식으로 테이블 작성
3. 사용자 검토 후 저장

## 내장 가이드라인

톤, 프레이밍, 구조, 지표, 표현 변형 등 성과 문서 작성 규칙이 SKILL.md에 내장되어 있다. 핵심 원칙:

- 비용(만원) 제외, 시간/배수로만 표현
- "AI Agent로 ~" 접두어, Before→After 압축 지표
- 생산성 N% 달성 패턴
- 비교 표현 금지, 조직 내 참고 자료 톤
- 항목별 동사 변형 (복붙 느낌 방지)

## 저장 경로

```
~/Workspace/work/outputs/drafts/yyyymmdd_성장피드백_{분기}.md
~/Workspace/work/outputs/drafts/yyyymmdd_AX사례_{분기}.md
```

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-report` | 입력 소스 (분기 리포트) |
| `/suji-confluence-publish` | Confluence 업로드 시 공통 규칙 |
