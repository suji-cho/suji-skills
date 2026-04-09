# suji-kb

Claude Code 세션을 아카이브하고 구조화된 logbook을 생성하는 통합 Knowledge Base 스킬.

## When to use

- 세션 끝에 "KB 저장해줘", "세션 정리"
- `/suji-kb`

## 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-kb` | 세션 종료: archive + 분류 + logbook + commit |
| `/suji-kb init` | 세션 중: 프로젝트 선택 + 산출물 경로 확정 |
| `/suji-kb logbook` | 미처리 세션 일괄 triage + logbook |
| `/suji-kb search <키워드>` | SQLite FTS 검색 |
| `/suji-kb ingest <파일>` | 소스 투입 → wiki 페이지 생성/갱신 |
| `/suji-kb query <질문>` | wiki + SQLite 기반 답변 |
| `/suji-kb lint` | wiki 건강 점검 |

## Logbook 3단계

| 등급 | 기준 | 내용 |
|------|------|------|
| **Full** | 의사결정/기획/설계/리서치 포함 | 7섹션 (배경~콘텐츠시드) |
| **Light** | 단순 구현/버그 수정/루틴 | 한 줄 요약 + 변경 목록 |
| **Meta** | 메시지 5개 미만, 실질 내용 없음 | frontmatter만 |

핵심: **내용 성격**으로 판단. 짧더라도 결정이 있으면 Full.

## KB 구조

```
~/Workspace/sujicho-kb/
├── raw/sessions/       ← .jsonl 원본 (Hook 자동)
├── raw/sources/        ← wiki용 외부 소스
├── sessions/           ← 마크다운 변환본
├── projects/           ← 프로젝트별 logbook
├── wiki/               ← 정제된 지식 페이지
├── scripts/            ← 변환/인덱싱 도구
└── index.db            ← SQLite FTS
```

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-report` | logbooks 데이터 → 성과 리포트 |
| `/suji-insights` | KB 패턴 감지 → Memory/CLAUDE.md 승격 |
| `/suji-pitch` | report 소재 → 경영진 설득 덱 |
| `/suji-reflect` | KB=사실 기록, reflect=사고 분해 (별개) |

## 관련 문서

- 설계: `~/Workspace/sujicho-kb/design.md`
- 저장소 README: `~/Workspace/sujicho-kb/README.md`
