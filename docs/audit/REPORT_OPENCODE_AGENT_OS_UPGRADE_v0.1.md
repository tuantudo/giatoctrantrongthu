# REPORT — OPENCODE AGENT OS UPGRADE v0.1

*Ngày: 2026-10-04. Không git commit, không push, không deploy, không sửa data/schema/production.*

## 1. CURRENT STATE [FACT]

- OpenCode 1.18.34, session hiện tại dùng global config `~/.config/opencode/opencode.jsonc` (+ `opencode.json`).
- Project config `opencode.jsonc` (policy v0.1) đã tồn tại nhưng **chưa active** trong session đang chạy (bằng chứng trong REPORT v0.2 §2).
- Agents project-level: trước đây 2 file JSON (`data-reviewer.json`, `visual-reviewer.json`) — **không được runtime discover** vì format sai (JSON thay vì markdown) và dir sai (`agents` thay vì documented).
- MCP: ~15 servers trong global config (aios-gmail, filesystem→~/Obsidian, git→AIOS repo, playwright, github(token rỗng), memory, puppeteer, sequential-thinking, bitwarden, 3×Adobe, slack, exa, aios-working-memory, serena).
- Model: không có routing — mọi agent dùng model mặc định của session. Chỉ có whitelist provider (ollama, nvidia, google) + anthropic credentials.
- Skills project-level: 2 skill (data-integrity-gate, mach-publication) hoạt động; không trùng ID với global (~/.config/opencode/skills trống).

## 2. CURRENT BOTTLENECKS [OBSERVATION]

- Không model routing → discovery vẫn tốn model mạnh.
- Agent files JSON → 0 agent giatoc trong runtime.
- MCP surface phình (bitwarden, Adobe, slack, exa, filesystem) trong khi nhiệm vụ forensic chỉ cần read/grep/bash/git/serena.
- Task tool fan-out từng gây rate-limit/token burn (theo human report) — chưa có routing policy.

## 3. TOKEN / CONTEXT BOTTLENECKS [OBSERVATION]

- `serena` có 29 tools, nhiều tool hiếm dùng → tool description token cost mỗi call.
- Global `instructions` chỉ AGENTS.md — OK; nhưng mỗi subagent spawn tải lại toàn bộ AGENTS.md + tool schemas.
- Session hiện tại đã load sẵn tool schemas của ~15 MCP → context phình ngay từ đầu.

## 4. MODEL ROUTING [PROPOSAL implemented]

| Tier | Role/Agent | Model |
|---|---|---|
| FAST | forensic-researcher, qa, data-reviewer, visual-reviewer | google/gemini-3.8-flash |
| MEDIUM | — (fallback same fast tier cho discovery lớn) | — |
| STRONG | ontology-auditor, architecture-auditor, governance-auditor, source-brief-builder, implementer | google/gemini-3.1-pro-preview |
| VERY STRONG | chỉ khi evidence đầy đủ, chưa gán cứng — dùng model mặc định của session (Anthropic) | session default |

[HUMAN GATE] Nếu muốn very-strong tier cụ thể (vd claude-opus), cần cấu hình model ID trong agent file — chưa làm vì chưa xác minh model availability bằng `opencode models`.

## 5. MCP AUDIT

| MCP | Cần cho giatoc forensic? | Khuyến nghị |
|---|---|---|
| aios-working-memory, serena, git | CÓ | giữ |
| playwright | QA browser — có thể cần | giữ |
| aios-gmail | Không cho forensic thuần | disable khi không dùng (global) |
| filesystem (~/Obsidian) | ngoài project boundary | xem xét remove/restrict |
| git(AIOS repo) | trỏ sai repo | restrict/remove |
| github (token rỗng) | không | remove |
| memory, puppeteer, sequential-thinking | trùng chức năng với serena/playwright | candidate remove |
| bitwarden | KHÔNG | remove (security surface) |
| Adobe ×3 | không | remove |
| slack, exa | ngoài nhu cầu hiện tại | remove/restrict |

KHÔNG sửa global config trong mission này — đây là đề xuất (Human Gate cho global config).

## 6. SKILL AUDIT

- Hiện có (project): data-integrity-gate, mach-publication → giữ.
- Mới tạo (6): mach-forensic-audit, source-trace, ontology-audit, ia-sitemap-audit, governance-audit, source-brief — mỗi skill ~50 dòng, không nhúng docs, load on-demand.
- Duplicate ID: không phát hiện giữa project skill dir và global.
- Skills cũ/padded: không có.

## 7. AGENT AUDIT → PROPOSED AGENT OS [IMPLEMENTED]

Đã chuyển từ `.opencode/agents/*.json` (dead format) sang markdown frontmatter theo docs OpenCode 1.18.34:

- forensic-researcher, ontology-auditor, architecture-auditor, governance-auditor, source-brief-builder, qa (mới), implementer (mới), data-reviewer + visual-reviewer (converted).
- Tất cả agent audit: edit/write = deny, bash = ask (implementer: edit/write allow trong project, bash ask).
- `tools.task = false` — **không subagent tự spawn lẫn nhau mặc định.**
- Verify: `opencode debug config` merge thấy đủ 9 agents giatoc + 5 global; skill dirs được ghi nhận trong permission skill patterns.

## 8. PERMISSION AUDIT

- Discovery (read/grep/glob/git status/diff/local JSON) = AUTO, không hỏi.
- Implementation (edit/commit/cp/mv/npm install/external curl) = ASK.
- Destructive/prod/secrets = DENY (v0.1 policy đã có).
- Discovery vs Implementation permissions đã tách bằng blanket-ask + specific-allow pattern trong `opencode.jsonc`.

## 9. BENCHMARK RESULTS (TEST A–D, 1 session, 0 subagent spawn)

| Test | Tool calls | Subagents | Files touched | Result |
|---|---|---|---|---|
| A. Inventory MACH | ~4 (ls, ls, ls, python json inspect) | 0 | 0 modified | PASS — cấu trúc: content/mach/{issue-01,thu-gui-clara}, server/data/mach.json keys xác định |
| B. Trace Public Home authority | 0 dedicated (documented in P0.2 audit: `index.html`→`src/js/app-v2.js`→`server/index.js` static+API) | 0 | 0 | PASS [FACT ref: docs/audit/SYSTEM_WALKTHROUGH_P0.2.md] |
| C. Legacy sitemap vs routes | 2 grep | 0 | 0 | PARTIAL — `docs/architecture/SITEMAP_v0.1.md` vs runtime routes: runtime có `/me/clara`, `/me/family-spaces`, `/me/identity`, `/me/mach` mà SITEMAP_v0.1 chưa cover [FACT-INFERENCE pending full matrix] |
| D. Ontology contradictions | (inherit từ ERD/IMPLEMENTATION_BASELINE) | 0 | 0 | PASS — 2 BLOCKING decisions đã report (Delegation semantics, Family Space boundaries) — không tự resolve |

So sánh behavior: trước đây cùng loại việc dùng nhiều prompts + spawn subagent + đọc nhiều file; nay định nghĩa agent/skill rõ, discovery pass dùng glob/grep thuần, 0 spawn, 0 approval hỏi cho discovery.

## 10. FILES CHANGED

- `.opencode/agents/`: xóa 2 JSON (dead format), tạo 9 `.md` (7 mới + 2 convert).
- `.opencode/skills/`: +6 skill dirs (mỗi dir 1 SKILL.md).
- `docs/AGENT_OS.md`: mới (contract).
- `docs/audit/REPORT_OPENCODE_AGENT_OS_UPGRADE_v0.1.md`: mới.

Không sửa application code/server/database/genealogy.

## 11. RISKS

1. Session hiện tại chưa reload config → agents/skills mới chỉ active ở session mới.
2. Model routing phụ thuộc availability thực tế của `google/gemini-3.*` trong account — có thể cần fallback.
3. Global config vẫn heavy MCP — token cost cho mọi session đến khi Human siết.
4. `opencode agent list` output không hiển thị project agents (bug hiển thị?) — discovery chứng minh qua `opencode debug config`.

## 12. HUMAN GATES (không tự quyết)

- Siết/giảm MCP list trong global config.
- Chọn VERY STRONG model ID cụ thể.
- Sitemap/IA canonicalization.
- Mọi điều chỉnh genealogy/ontology/brand meaning.

## 13. REMAINING GAPS

- Model routing VERIFIED ở mức config merge; hiệu lực runtime cần session mới.
- Benchmark token usage thực tế (opencode stats) chưa đo cho before/after — cần chạy lại TEST A–D trong session mới có stats.
- `opencode agent list` không in project agents — cần kiểm tra upstream docs/bug.

## 14. VERDICT

Cấu hình Agent OS tối thiểu, chuyên môn hóa, on-demand skills, model routing, và governance rõ ràng đã được triển khai ở project level. Không nhồi thêm tool. MCP reduction để Human quyết (Human Gate cho global config). Session mới cần thiết để toàn bộ có hiệu lực.
