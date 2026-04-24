# suji-meeting-refine

옵시디언 회의록 원본 → 결론 추출 + AI 정리 → Confluence 업로드 → TODO 수집. 원본 파일은 수정하지 않는다.

## When to use

- "회의록 정리해줘", "미팅 노트 올려줘"
- `/suji-meeting-refine`
- `/suji-meeting-refine ~/Workspace/work/hand-ons/meeting_minutes/20260408_팀회의.md`

## 옵시디언 경로

| 항목 | 경로 |
|------|------|
| 업무 회의록 | `~/Workspace/work/hand-ons/meeting_minutes/` |
| 개인 회의록 | `~/Workspace/personal/personal/` |
| 월간 TODO | `~/Workspace/work/hand-ons/work_minutes/2026/monthly_task/` |
| 파일명 규칙 | `yyyymmdd_제목.md` |

## 해시태그 → Confluence 폴더 매핑

| 해시태그 | 폴더 ID | 비고 |
|---------|---------|------|
| `#연구소` | `2071103484` | 업로드 |
| `#컨콜` | `1958019796` | 업로드 |
| `#팀` | `1491504659` | 업로드 |
| `#기타` | `2041840644` | 업로드 |
| `#개인` | - | **업로드 안 함** (TODO 수집만) |

## 워크플로우

1. **대상 파일 확인** — 지정 파일 또는 최근 수정 파일. 첫 줄 해시태그로 태그 추출
2. **결론 추출** — 결정사항, 액션아이템(@담당자), AI 한줄 요약
3. **AI 정리** — 원본 메모를 구조화 (중복 제거, 문맥 보완, 의미 불변)
4. **사용자 승인** — Confluence 업로드 내용을 보여주고 확인
5. **Confluence 업로드** — 결론 표 + AI 정리 + 원본 code block
6. **TODO 수집** — 액션 항목을 월간 TODO 파일에 추가 (중복 방지)

## Confluence 출력 포맷

```markdown
## 결론
| 구분 | 내용 |
|------|------|
| 결정 | (확정 사항) |
| 액션 | (액션 아이템 @담당자) |
| AI 요약 | (원본 메모 한줄 요약) |

## AI 정리
(구조화된 내용)

## 원본 메모
(옵시디언 원본 전체 — code block)
```

- 페이지 제목 = 옵시디언 파일명 (`.md` 제거)
- 같은 제목의 페이지가 있으면 업데이트

## 주의사항

- **옵시디언 원본 파일은 수정하지 않음**
- Confluence 업로드 내용은 사용자 승인 후 반영
- `#개인` 태그 파일은 Confluence 업로드 제외, TODO 수집만 진행
- 디자인/콘텐츠는 사용자 확인 없이 변경 불가

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-confluence-publish` | 드래프트 업로드 (제목/레이아웃 규칙 공유) |
| `/suji-daily-mbo` | 회의 항목의 작업내용과 연결 |
| `/suji-cto-weekly-report` | 연구소 회의 결과가 주간보고에 반영 |
