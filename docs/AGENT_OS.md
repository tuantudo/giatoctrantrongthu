# GIATOC AGENT OS — CONTRACT v0.1

## Authority hierarchy

- **TUẤN** = Final Authority (Human).
- **EMARALD** = Strategic / Analysis Authority.
- **OPENCODE** = Forensic / Research / Audit agent + controlled execution runtime (theo approved brief).
- **CLINE** = Implementation / Execution Authority (UI/frontend, browser QA).

OpenCode KHÔNG phải Final Authority và KHÔNG được tự quyết: genealogy truth, ontology changes, brand meaning, public content authority, IA canonicalization, governance policy. Mọi thay đổi các mục này → [HUMAN GATE].

## Roles (project agents, `.opencode/agents/`)

| Agent | Role | Writes? | Model routing |
|---|---|---|---|
| forensic-researcher | inventory / trace / evidence | NO | fast (gemini-3.8-flash) |
| ontology-auditor | entity/lifecycle/contradiction | NO | strong (gemini-3.1-pro) |
| architecture-auditor | routes/IA/boundaries | NO | strong |
| governance-auditor | AIOS/SoT/Human Gate compliance | NO | strong |
| source-brief-builder | evidence → brief cho executor | NO | strong |
| implementer | thực thi approved brief | project files | strong |
| qa | regression/acceptance checks | NO | fast |
| data-reviewer | genealogy data review | NO | fast |
| visual-reviewer | UI/UX review vs canonical system | NO | fast |

## Skills (on-demand, `.opencode/skills/`)

mach-forensic-audit, source-trace, ontology-audit, ia-sitemap-audit, governance-audit, source-brief, data-integrity-gate, mach-publication.

## Routing policy

- FAST/cheap: glob/grep/find/read/JSON/route inventory/mechanical comparison.
- MEDIUM: code analysis, dependency mapping (gemini-3.8-flash agents).
- STRONG: ontology/contradiction/authority/governance/synthesis (gemini-3.1-pro agents).
- VERY STRONG: chỉ khi evidence đã đầy đủ.
- **Subagents chỉ dùng khi task thực sự song song hóa được.** Không fan-out mặc định.

## Discovery permissions vs Implementation permissions

Discovery (read/grep/glob/git status/diff/local inspection) = AUTO, không hỏi.
Implementation (edit/commit/network mutation/cp/mv/npm install) = ASK hoặc theo approved brief.
Destructive/prod/secrets = DENY. Xem `opencode.jsonc` + `docs/security/OPENCODE_SECURITY_POLICY_v0.1.md`.
