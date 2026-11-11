# REPORT — CLINE RUNTIME CAPABILITY STACK v0.1

*Ngày: 2026-10-05. Pass: DISCOVER → VET → PROPOSE → VERIFY. Không sửa application logic, genealogy, database/schema, production code. Không deploy. Không push. Không cài package hệ thống.*

**Nhãn:** `[FACT]` = kiểm chứng trực tiếp trong máy/metadata · `[VERIFIED]` = chạy runtime xác nhận · `[OBSERVATION]` = nhận định từ bằng chứng · `[WEB RESEARCH]` = docs chính thức · `[INFERENCE]` = suy luận · `[PROPOSAL]` = đề xuất · `[NOT VERIFIED]` = chưa xác minh · `[HUMAN GATE]` = cần Tuấn quyết.

> **[OBSERVATION] Xung đột ranh giới ghi:** `.clinerules` quy định `docs/` là surface DENIED, nhưng Human trực tiếp yêu cầu ghi `docs/audit/REPORT_CLINE_RUNTIME_CAPABILITY_v0.1.md`. Lệnh Human ưu tiên cao hơn rule file tĩnh → file được tạo theo lệnh Human. Ghi nhận mâu thuẫn để Tuấn sửa `.clinerules` nếu muốn thống nhất. Không tự sửa `.clinerules`.

---

## 1. EXECUTIVE SUMMARY

**[FACT]** Cline chạy dạng **Cline CLI 3.0.68** (`/opt/homebrew/bin/cline` → `node_modules/cline`), `@cline/core` **0.0.90**, hub daemon `ws://127.0.0.1:25463/hub` healthy (pid 6508, uptime 13h58m). `globalState.json` ghi `clineVersion: 4.1.22` — state dùng chung với IDE extension, khác version CLI `[OBSERVATION]`.

**Kết luận trọng yếu:**

1. **[VERIFIED]** Cline đã chạy đúng dạng **"Agent OS lite"**: rules nạp vào context, file-based hooks bắn thật (`tool_call` fired), MCP 6 server live, subagent + team primitives có mặt trong session này.
2. **[VERIFIED]** Cline dùng **open standard `SKILL.md`** qua `./.agents/skills/` và CLI `npx skills` — **cùng format** `.opencode/skills/` của OpenCode. Portable skill là khả thi, không lý thuyết.
3. **[FACT]** Gap quan trọng nhất: project có **0 project skill** (`cline skill list` → "No project skills found"). Toàn bộ skill stack AIOS (mach-forensic, source-trace, ontology-audit, ia-sitemap, governance-audit, source-brief) **chưa hiện diện trong Cline**.
4. **[FACT]** Gap thứ hai: native browser tool **bị tắt** (`browserSettings.disableToolUse: true`). Browser QA phải đi qua plugin `agent-browser` hoặc MCP `playwright` (cả hai đã cài).
5. **[FACT]** Model routing chỉ ở mức **plan/act tách provider**; **không có per-role model routing** ở file config.

**Định vị:** Cline = **EXECUTION / INTERACTION RUNTIME** — quyền cao nhất ở lớp thực thi, không có authority về ontology/meaning/core `[PROPOSAL]`.

---

## 2. CURRENT CAPABILITY INVENTORY

| Capability | Current | Source | Status |
|---|---|---|---|
| **Model** | cline-pass → `muse-spark-1.3` / `mimo-v2.6-flash`; Cline model `moonshotai/kimi-k3` (1M ctx); API `gpt-5.6-sol` | `~/.cline/data/settings/globalState.json` | VERIFIED config / NOT VERIFIED runtime |
| **Model routing** | plan ≠ act provider; `-P/-m/-k` flags; `--thinking` | `globalState.json`, `cline --help` | VERIFIED plan/act / NOT VERIFIED per-role |
| **Fallback** | `--retries` default 6; compaction `agentic\|basic\|off` | `cline --help` | VERIFIED flag / NOT VERIFIED model-tier |
| **Context/token** | compaction `agentic`; kimi-k3 ctx 1,048,576 / maxTokens 943,718; 4 checkpoint sessions | `globalState.json`, `checkpoint-scratch/` | VERIFIED |
| **Agents/Roles** | **không có** role file project-level; role nằm trong text `.clinerules` + `AGENTS.md` | `.clinerules`, `AGENTS.md` (81 dòng) | FACT |
| **Subagents** | `use_subagents`, read-only, context tách, không nested | [WEB RESEARCH] `features/subagents` | NOT VERIFIED |
| **Teams** | `team_spawn_teammate`, `team_task`, `team_run_task`, `team_send_message`, `team_status`, `team_create_outcome`, `spawn_agent` | session tools | VERIFIED tools / NOT VERIFIED `--team-name` flag |
| **Skills (project)** | **0 skill** | `cline skill list` | VERIFIED = RỖNG |
| **Skills (global)** | `microsoft-foundry` → `~/.agents/skills/` | `cline skill list -g` | VERIFIED |
| **Skills (plugin)** | `agent-browser` skill từ official plugin | `~/.cline/plugins/_installed/official/agent-browser-*` | FACT |
| **Rules (project)** | `.clinerules` là **1 file** (không phải dir); không `.cline/rules/`; không `.clinerules/rules/` | `ls -la` | FACT |
| **Rules (portable)** | `AGENTS.md` (81 dòng) + `~/.agents/AGENTS.md` | file system + [WEB RESEARCH] | FACT |
| **MCP** | `context7`, `playwright`, `filesystem`, `memory`, `sequential-thinking`, `figma`(disabled) | `cline_mcp_settings.json` | VERIFIED |
| **Plugins** | 1 official: `agent-browser-b96ba1011a40` | `~/.cline/plugins/_installed/official/` | VERIFIED |
| **Hooks** | file-based; `.cline/hooks/` **tồn tại nhưng rỗng**; `.clinerules/hooks/` chưa có | file system + [VERIFIED] | VERIFIED mechanism / **NOT CONFIGURED** |
| **Browser** | native tool **DISABLED** (`disableToolUse: true`) | `globalState.json` | FACT = TẮT |
| **Terminal** | `run_commands`; `executeSafeCommands` auto-approve `true`, `executeAllCommands` `false` | `globalState.json` + session | VERIFIED |
| **Filesystem** | `read_files`/`editor`/`search_codebase` + `filesystem/*` + MCP `filesystem` | session + MCP config | VERIFIED |
| **Git** | qua terminal; `--worktree`; payload mang commit hash | `cline --help`, hooks schema | VERIFIED capability |
| **Memory** | MCP `memory` (knowledge graph) | MCP config + session | VERIFIED |
| **QA / Visual** | `agent-browser` skill + `playwright` MCP | plugin + MCP | VERIFIED có / NOT VERIFIED chưa chạy pass |
| **Marketplace** | `cline plugin install` (official keyword/npm/git/URL/path); `npx skills add <owner/repo>` | `cline plugin/skill --help` | VERIFIED lệnh tồn tại |
| **Auto-approve** | `autoApprovalSettings.enabled: true` (maxRequests 20) **nhưng** `global-settings.toolAutoApprove: false` | `globalState.json` + `global-settings.json` | FACT = **MÂU THUẪN** (§8) |

---

## 3. CLINE ARCHITECTURE [FACT]

- **1. Model:** provider/keys ở `~/.cline/data/settings/providers.json` (7,139 bytes, perm 600). Plan mode và Act mode có provider/model **riêng biệt**. Model 1M-token `kimi-k3` đã khai. Không có layer fallback theo model-tier.
- **2. Agent:** primitives gồm `use_subagents` (research read-only) + team tools (coordinator/delegate/mailbox/mission-log/outcome). **Không có file khai báo role** — role = prompt text.
- **3. Knowledge/Behavior:** `.clinerules` (file), `AGENTS.md`, global `~/.agents/AGENTS.md`, global Rules dir `~/Documents/Cline/Rules`, skills qua `.agents/skills/` + `npx skills`.
- **4. Tool:** (a) native host tools (editor/filesystem/terminal/browser), (b) MCP (6), (c) plugins (`agent-browser`), (d) slash commands (`/` → skill, `/team`).
- **5. Control:** auto-approval matrix (version 16), plan/act gate, **file-based hooks** (10 event), hook control output (`cancel`/`review`/`contextModification`), non-interactive approval refusal.
- **6. Execution:** terminal, filesystem, browser (tắt), checkpoint (`checkpoint-scratch`), `--worktree`, `schedule`, `kanban`, `hub`, `dashboard`, ACP, `connect` channels.
- **7. Ecosystem:** official plugin marketplace + `npx skills` cross-agent — `cline skill list -g` báo `Agents: Antigravity, Antigravity CLI, Cline, Codex, Cursor +3 more` `[VERIFIED]`.
- **8. AIOS integration:** mapping qua `.clinerules` (persona + authority boundary) và `AGENTS.md` (roster, orchestration protocol, handoff, human gate). **Không có capability registry machine-readable.**

**[OBSERVATION]** Kiến trúc Cline hiện **nhân văn (prompt-based) hơn cơ cấu (structural)**: mọi thứ AIOS cần — role, evidence tag, handoff, human gate — đang nằm trong **prose rule** chứ không trong **executable config**. Đây là khác biệt chính với Agent OS mà OpenCode vừa build.

---

## 4. AGENT / ROLE CAPABILITY

### 4.1 Thực trạng `[FACT]`
- **Không tồn tại** file role nào cho Cline tại `.cline/`, `.clinerules/`, `.agents/`. `.cline/` chỉ có `hooks/` rỗng.
- Role chỉ là **văn bản** trong `.clinerules`: *"BẠN LÀ CLINE - BẠN KHÔNG PHẢI ORCHESTRATOR..."*, quyền: Frontend/HTML/CSS/Interaction/Browser QA.
- `AGENTS.md` định nghĩa roster (AGY / OpenCode / Cline / DSH / Cline CLI) dưới dạng **tài liệu hướng dẫn**, không phải cấu hình.

### 4.2 Delegation `[VERIFIED / NOT VERIFIED]`

| Cơ chế | Trạng thái | Ghi chú |
|---|---|---|
| Subagents (`use_subagents`) | `[NOT VERIFIED]` | read-only: đọc/search/command read-only; **không** edit/browser/MCP/nested |
| Team (`team_*`) | `[VERIFIED]` có trong session | task board + mailbox + mission log |
| `cline --team-name` | `[NOT VERIFIED]` | **KHÔNG xuất hiện** trong `cline --help` 3.0.68 — docs có thể mới hơn CLI |
| `spawn_agent` | `[VERIFIED]` | sub-agent system prompt riêng, blocking |
| `team_create_outcome` | `[VERIFIED]` | yêu cầu `current_state`, `boundary_analysis`, `interface_proposal` — **gần giống handoff protocol** |

### 4.3 Đánh giá `[INFERENCE]`
**[OBSERVATION]** Team primitives có `mission_log` + `outcome` + `requiredSections` — **tương đồng ý chí** với Handoff Protocol 10 mục của `AGENTS.md`. Nhưng **chưa có cấu hình nào map 2 thứ này vào nhau.**

---

## 5. SKILLS

### 5.1 Thực tại `[VERIFIED]`
```
$ cline skill list
No project skills found.
Try listing global skills with -g

$ cline skill list -g
Global Skills
  microsoft-foundry  ~/.agents/skills/microsoft-foundry
  Agents: Antigravity, Antigravity CLI, Cline, Codex, Cursor +3 more
  Source: microsoft/azure-skills
```

### 5.2 Discovery mechanism `[VERIFIED]`
- **[FACT]** Cline discover project skill tại **`./.agents/skills/<name>/SKILL.md`** — xác minh bằng probe (skill xuất hiện với `Source: local`). `./.clinerules/skills/` → "No project skills found."
- **[FACT]** Global skills tại `~/.agents/skills/`. Lệnh `cline skill` **forward sang `npx skills`** — open skills CLI (`add/install/list/remove/find/use`), scope `-g`/`-p`, flag `--agent` (vd `--agent cline`, `*` = all).

### 5.3 Format `[VERIFIED]`
Cline yêu cầu `SKILL.md` với frontmatter `name` (trùng tên dir) + `description`. Đây **chính xác** format OpenCode đang dùng:
```yaml
---
name: source-trace
description: Trace the authority and origin of a piece of content/UI/route back to its source of truth.
---
```
→ **không trùng lặp, không cần convert.**

### 5.4 Progressive loading `[WEB RESEARCH]`

| Level | Khi nào | Token |
|---|---|---|
| Frontmatter | luôn (startup) | ~100/skill |
| SKILL.md body | khi trigger | < 5k |
| Bundled `docs/` `scripts/` `templates/` | theo yêu cầu | effectively unlimited |

### 5.5 Skill OpenCode — cơ hội tái dùng `[FACT]`

| Skill | `.opencode/skills/` | Khuyến nghị |
|---|---|---|
| `mach-forensic-audit` | có | `[PROPOSAL]` tái dùng → `.agents/skills/` |
| `source-trace` | có | tương tự |
| `ontology-audit` | có | tương tự |
| `ia-sitemap-audit` | có | tương tự |
| `governance-audit` | có | tương tự |
| `source-brief` | có | tương tự |
| `mach-publication` | có | `[PROPOSAL]` optional |
| `data-integrity-gate` | có | `[PROPOSAL]` optional (liên quan DB → giới hạn) |

**[PROPOSAL]** Nguyên tắc **1 file skill, N runtime đọc** — không duplicate. `[NOT VERIFIED]` OpenCode có accept symlink ngược từ `.agents/skills/` hay không, cần kiểm riêng.

---

## 6. MCP `[VERIFIED]`

File: `~/.cline/data/settings/cline_mcp_settings.json`

| MCP | Transport | Bound | Disabled | Phân loại | Đánh giá |
|---|---|---|---|---|---|
| `context7` | stdio `@upstash/context7-mcp` | — | false | READ | USEFUL (docs) |
| `playwright` | stdio `@playwright/mcp@latest` | — | false | READ + EXECUTION (browser) | **USEFUL** — native browser đang tắt |
| `filesystem` | stdio `server-filesystem` | repo | false | READ/WRITE | **REDUNDANT** với native (scope hẹp là điểm cộng) |
| `memory` | stdio `mcp-memory.sh` | — | false | READ/WRITE | USEFUL (AIOS memory) |
| `sequential-thinking` | stdio | — | false | READ (no side effect) | OPTIONAL — model đã có internal thinking |
| `figma` | streamableHttp | — | **true** | EXTERNAL | OPTIONAL — đang tắt |

### Gap vs yêu cầu `[OBSERVATION]`

| Cần | Native Cline | MCP | Kết luận |
|---|---|---|---|
| filesystem | ✅ mạnh | `filesystem` | không cài mới |
| git | ✅ terminal + `--worktree` | — | không cài mới |
| browser/QA | ⚠️ **native tắt** | `playwright` + `agent-browser` | **đủ, không cài thêm** |
| web research | ✅ `web_search` enabled | — | không cài mới |
| memory | ❌ | `memory` | **giữ** |
| GitHub | ❌ | chưa có | `[HUMAN GATE]` |
| database | ❌ (đúng) | không có | **GIỮ NGUYÊN** — `.clinerules` cấm DB MCP |
| deployment | ❌ (đúng) | không có | **GIỮ NGUYÊN** — cấm Cloud Infra MCP |
| communication | ❌ | không có | không cần |

**[PROPOSAL] Không cài MCP mới.** Gap đã được native + `playwright` + `agent-browser` bù đủ. **[OBSERVATION]** Độ chồng lấn duy nhất: `filesystem` MCP ≈ native — `[HUMAN GATE]` nếu muốn disable để giảm tool schema token.

---

## 7. PLUGINS

### 7.1 Thực tại `[VERIFIED]`
- 1 plugin cài: `~/.cline/plugins/_installed/official/agent-browser-b96ba1011a40/` — chứa `package.json`, `index.ts`, `package/skills/agent-browser/`, `README.md`.
- Cung cấp skill `agent-browser` (skill này xuất hiện trong skill list của session).

### 7.2 Cài đặt `[VERIFIED]`
```
cline plugin install <source>   # official keyword | npm | git | URL | local path
cline plugin uninstall <name>
```
Không có marketplace list/search command riêng trong CLI `[OBSERVATION]` — duyệt qua docs/website.

### 7.3 Đánh giá `[PROPOSAL]`

| Plugin | Đánh giá | Lý do |
|---|---|---|
| `agent-browser` (đã cài) | **USEFUL** | Bù native browser bị tắt |
| Figma MCP | REDUNDANT (đã tắt) | Không liên quan scope |
| Plugin git/compose/DB | **RISKY** | Vi phạm boundary `.clinerules` (không DB, không cloud infra) |
| Plugin mới nói chung | **OPTIONAL** | Không cài thêm — native đã đủ, tránh dependency |

**Không cần cài thêm plugin nào cho pass này** `[PROPOSAL]`.

---

## 8. HOOKS

### 8.1 Cơ chế `[VERIFIED — documentation + source symbol, KHÔNG runtime test lần này]`

Hooks là **file-based** (không phải config JSON). Tên **file** = tên event, extension hỗ trợ: `.sh .bash .zsh .js .mjs .cjs .ts .mts .cts .py .ps1`.

Thư mục tìm kiếm `[FACT]`:
- Workspace: `.cline/hooks/`, `.clinerules/hooks/`
- Global: `~/Documents/Cline/Hooks/`, `~/.cline/hooks/`

10 file event `[FACT]`:

| File event | Internal event | Dùng cho |
|---|---|---|
| `TaskStart` | `agent_start` | context injection đầu task |
| `TaskResume` | `agent_resume` | resume |
| `TaskCancel` | `agent_abort` | cancel log |
| `TaskComplete` | `agent_end` | **completion / QA gate** |
| `TaskError` | `agent_error` | **error / decision log** |
| `PreToolUse` | `tool_call` | **destructive-action gate, evidence gate** |
| `PostToolUse` | `tool_result` | **evidence logging** |
| `UserPromptSubmit` | `prompt_submit` | **context injection** |
| `PreCompact` | *(undefined — chưa map)* | compaction |
| `SessionShutdown` | `session_shutdown` | handoff log |

Control output `[FACT]`: hook trả JSON (qua protocol `HOOK_CONTROL` trên stdout) với các field: `cancel`, `review`, `context`, `contextModification` (cap 50,000 chars), `errorMessage`, `overrideInput`, `systemPrompt`, `appendMessages`, `replaceMessages`.

SDK-level lifecycle hooks `[WEB RESEARCH]`: `beforeRun`, `afterRun`, `beforeModel`, `afterModel`, `beforeTool`, `afterTool`, `onEvent`. Hook policy: `mode` blocking/async, `timeoutMs`, `retries`, `failureMode` `fail_open`/`fail_closed`, `maxConcurrency`.

### 8.2 Thực trạng project `[FACT]`
- `.cline/hooks/` **tồn tại nhưng RỖNG** (tạo 4 Oct 20:02).
- `.clinerules/hooks/` **không tồn tại**.
- → **Cline đã CÓ hook nhưng project CHƯA cấu hình hook nào.**

### 8.3 Đề xuất hook cho AIOS `[PROPOSAL]` — CONTROL WITHOUT FRICTION

| Hook | Event | Mục đích | Friction |
|---|---|---|---|
| Context injection | `UserPromptSubmit` | inject evidence-tag convention + role đang phục vụ | thấp — thêm context |
| **Evidence gate** | `PostToolUse` | log kết quả edit/grep vào handoff log (append-only, không block) | thấp |
| **Destructive-action gate** | `PreToolUse` | `cancel=true` khi phát hiện `rm -rf`, `git push --force`, `git reset --hard`, deploy | **chỉ chặn cái thật sự nguy hiểm** |
| Handoff log | `TaskComplete` | ghi objective/files/evidence vào `docs/audit/` log | thấp |
| Decision log | `TaskError` | log lỗi + retry state | thấp |
| Completion/QA gate | `TaskComplete` | **`review=true`** nếu task có edit nhưng không có file evidence → báo Tuấn | trung bình |

**[PROPOSAL] KHÔNG** biến Cline thành security cage: **không** hook before/after model, **không** hook mọi tool call (token/log noise), **không** `fail_closed` ở PreToolUse với pattern rộng. Chỉ **2 hook thực sự**: `PreToolUse` (destructive gate hẹp) + `TaskComplete` (evidence/QA gate). `[HUMAN GATE]` trước khi bật `cancel=true`.

---

## 9. MODEL / PROVIDER

### 9.1 Cấu hình hiện tại `[FACT — từ globalState.json]`

| Scope | Provider | Model |
|---|---|---|
| Plan mode (Cline Pass) | `cline-pass` | `cline-free/mimo-v2.6-flash` |
| Act mode (Cline Pass) | `cline-pass` | `cline-free/mimo-v2.6-flash` |
| Plan mode (Cline model) | — | `moonshotai/kimi-k3` (ctx 1,048,576 / maxTokens 943,718; in $1.675, out $9.38, cache-read $0.1943) |
| Act mode (Cline model) | — | `moonshotai/kimi-k3` |
| Plan/Act API | — | `gpt-5.6-sol` |
| OpenRouter act | `cline-openrouter` | `cline-free/muse-spark-1.3-contributor` |
| Session mode | — | `"act"` |
| Parallel tool calling | — | `enabled: true` |
| Reasoning effort | CLI `--thinking none\|low\|medium\|high\|xhigh` | default = provider |

### 9.2 Khả năng routing `[FACT / NOT VERIFIED]`

| Khả năng | Trạng thái |
|---|---|
| Plan ≠ Act model | **FACT** — đã tách `planMode*` / `actMode*` |
| Chọn model/provider per session | **FACT** — `-P <provider> -m <model> -k <key>` |
| Reasoning effort per session | **FACT** — `--thinking` |
| **Fallback / auto model-tier** | **NOT VERIFIED** — chỉ có `--retries` (mistake retry, **không** fallback model) |
| **Per-role model** | **NOT VERIFIED / có thể không hỗ trợ ở config file** — không tìm thấy cấu hình model-per-role |
| Cost/context implication | kimi-k3 cache-read $0.1943 — prompt caching hỗ trợ `[FACT]` |

### 9.3 Đề xuất routing `[PROPOSAL]`
**Không hard-code model ID chưa xác minh.** `[HUMAN GATE]`: nếu muốn tier FAST/STRONG cho Cline, cần (a) xác minh model availability bằng `cline config` / `cline auth` (yêu cầu TTY), (b) quyết định phân bổ tier theo role. **Đề xuất tối giản: dùng `cline-pass` free tier (`mimo-v2.6-flash`) cho plan/discovery, `kimi-k3` 1M context cho act/đọc lớn** — nhưng **chưa đổi gì**, vì đây là global state, thuộc diện config máy cá nhân.

---

## 10. BROWSER / EXECUTION

| Capability | Trạng thái | Bằng chứng |
|---|---|---|
| Native browser tool | **TẮT** | `browserSettings.disableToolUse: true` |
| Browser auto-approve | bật | `autoApprovalSettings.actions.useBrowser: true` |
| Browser qua MCP | **VERIFIED** | `playwright` MCP enabled + `playwright__*` tools hiện diện trong session |
| Browser qua plugin | **VERIFIED** | `agent-browser` plugin + skill |
| Terminal | **VERIFIED** | `run_commands`; auto-approve `executeSafeCommands: true`, `executeAllCommands: false` |
| Non-interactive session | **VERIFIED** | tool cần approval → *"requires an interactive session"* → chặn trong session non-interactive |
| Filesystem | **VERIFIED** | `read_files`, `editor`, `search_codebase`, `filesystem/*` |
| Git | VERIFIED (capability) | terminal + `--worktree` flag; workspaceInfo mang `latestGitCommitHash`/`latestGitBranchName` |
| Checkpoints | **VERIFIED** | `~/.cline/data/checkpoint-scratch/` — 4 session (index + pathspec) |
| Local server / testing | **NOT VERIFIED** | không phát hiện test runner config riêng — dùng terminal |
| Deployment/infrastructure | **CẤM** | `.clinerules` §3 |

---

## 11. COMMUNITY ECOSYSTEM `[WEB RESEARCH]`

Nguồn: `docs.cline.bot` (Rules, Skills, Plugins, Subagents, Agent Teams, SDK Plugins, Multi-Agent Teams) + symbol thực tế trong package.

| Capability | Nguồn | Đánh giá |
|---|---|---|
| Rules cross-tool (`.cursorrules`, `.windsurfrules`, `AGENTS.md`, `~/.agents/AGENTS.md`) | official docs | **USEFUL** — portable |
| Conditional rules (`paths:` frontmatter) | official docs | **USEFUL** — giảm context noise |
| Skills qua `npx skills` (open standard, cross-agent) | official docs + CLI | **USEFUL** — mở khoá portable skill |
| Skills community (vd `vercel-labs/agent-skills`, `microsoft/azure-skills`) | `npx skills add/find` | **OPTIONAL** — chỉ cài khi cần thật |
| Subagents research | official docs | **USEFUL** — nhưng read-only, chưa verify |
| Agent Teams (CLI) | official docs | **USEFUL** — nhưng flag `--team-name` chưa thấy trong CLI 3.0.68 |
| Plugin SDK (tools/hooks/commands/rules/events) | official docs | **OPTIONAL** — quá mức cho pass này |
| Official plugin marketplace | `cline plugin install` | **OPTIONAL** |
| MCP marketplace | official | **OPTIONAL** — native đã đủ |
| QA / browser / forensic skills (community) | chưa survey cụ thể | `[NOT VERIFIED]` |
| Claude / Codex compatible skills | `Agents:` label xác nhận Codex + Cline đọc cùng skill | **USEFUL** |

**[PROPOSAL]** Không cài community package nào trong pass này. **Caveat:** việc survey sâu community adoption (`skills add/find`, GitHub repo stars) **chưa làm** — nằm ngoài rapid profile, `[NOT VERIFIED]`.

---

## 12. AGY CAPABILITY COVERAGE

| Agy capability | Cline equivalent | Coverage | Ghi chú |
|---|---|---|---|
| Forensic codebase research | `search_codebase` + `read_files` + subagents | **Cao** `[VERIFIED tools]` | Cần skill đóng gói workflow |
| Legacy reconstruction | terminal + filesystem + web_search | **Cao** | Cần skill |
| Source tracing | `search_codebase` + `read_files` | **Trung bình–Cao** | `source-trace` skill chưa có ở Cline |
| Ontology audit | **không có native** — chỉ đọc `.aios/` + docs | **Trung bình** | Cần skill + rule (ontology = Human Gate) |
| IA / sitemap audit | browser (playwright) + filesystem | **Cao** | Cần skill |
| Governance audit | đọc `PROJECT_CONTRACT.json` + rules | **Trung bình** | Cần skill |
| Source brief | docs writer | **Cao** | Cần skill |
| QA | `playwright` MCP + `agent-browser` + terminal | **Cao** `[VERIFIED tools]` | Cần skill |

**[OBSERVATION]** Cline **không có capability nào Agy có mà Cline tool-level không làm được** — thiếu hoàn toàn là **skill/rule layer đóng gói workflow**, không phải tool.

**[PROPOSAL]** Xây local skills thay vì phụ thuộc Agy. Không cài dependency Agy.

---

## 13. OPENCODE AGENT OS COMPATIBILITY

### A. Dùng trực tiếp `[PROPOSAL]`
- Toàn bộ 8 skill `.opencode/skills/` (format `name`+`description` = format Cline) → copy/symlink sang `.agents/skills/`.

### B. Chuyển thành Cline Skill `[PROPOSAL]`
- `mach-forensic-audit`, `source-trace`, `ontology-audit`, `ia-sitemap-audit`, `governance-audit`, `source-brief` → **cần có ở Cline** (gap chính).

### C. Chuyển thành Cline Rule `[PROPOSAL]`
- Evidence tagging convention (`[FACT] [OBSERVATION] [INFERENCE] [PROPOSAL] [HUMAN GATE]`)
- Trusted authority order (Human > AGENTS.md > docs/architecture > docs/audit > .aios > README)
- Cấm canonicalize IA/sitemap, cấm resurrect proposal cũ
→ rule thay vì skill vì **always-on**, không cần trigger.

### D. Subagent / team role `[PROPOSAL]`
- Cline **không nên** tạo 9 agent như OpenCode. Subagent read-only phù hợp: `forensic-researcher`, `qa`.
- Team role (nếu dùng `--team-name`) hợp với: coordinator + implementer + qa.
- **[PROPOSAL] chỉ 5–8 role** — xem §15.

### E. Gọi qua MCP `[PROPOSAL]`
- Không có capability nào **bắt buộc** phải qua MCP. memory/context7/playwright đã đủ.

### F. Không đưa vào Cline `[PROPOSAL]`
- `data-reviewer`, `visual-reviewer` (OpenCode-specific, browser đã có plugin/MCP)
- `ontology-auditor`/`governance-auditor` **như agent** (ontology = Human Gate, không nên là autonomous agent)
- `mach-publication`, `data-integrity-gate` (liên quan DB/publication — ngoài scope `.clinerules`)

**[OBSERVATION]** OpenCode skill **không duplicate** với Cline — nên dùng chung 1 file. Lock-in tránh được bằng cách đặt ở `.agents/skills/` (được Cline/Codex/Cursor/Antigravity đọc) và để `.opencode/skills/` tham chiếu `[NOT VERIFIED]`.

---

## 14. CAPABILITY GAPS

| # | Gap | Mức độ | Loại | Đề xuất |
|---|---|---|---|---|
| G1 | **0 project skill** | **CAO** | missing | Tạo `.agents/skills/` với 6 skill portable |
| G2 | **No role file** — role chỉ là prose | **CAO** | missing | Rule phân tầng + role prompts trong skill |
| G3 | **Native browser TẮT** | TRUNG bình | config | Khi cần browser native → bật `[HUMAN GATE]`; hiện có MCP/plugin |
| G4 | **Hooks chưa cấu hình** (dir rỗng) | TRUNG bình | missing | 2 hook: destructive gate + evidence gate |
| G5 | **Không có capability registry** | TRUNG bình | missing | Chỉ docs — `[HUMAN GATE]` vì `.aios/` DENIED |
| G6 | **Không model fallback / per-role model** | THẤP | missing | Ghi nhận; `[HUMAN GATE]` |
| G7 | `.clinerules` là **file** thay vì dir — không phân được conditional paths | THẤP | mismatch | Rule chuyển sang `.clinerules/rules/*.md` với `paths:` |
| G8 | Auto-approve **mâu thuẫn** (`enabled:true` vs `toolAutoApprove:false`) | THẤP | config | `[HUMAN GATE]` — không tự đổi global |
| G9 | Community skill/marketplace **chưa survey** | THẤP | scope | Để pass sau |
| G10 | `--team-name` **không thấy** ở CLI 3.0.68 | THẤP | version | `[NOT VERIFIED]` |

---


## 15. RECOMMENDED STACK `[PROPOSAL]`

Nguyên tắc: **không thêm dependency, chỉ cấu hình capability đã có.** Không cài MCP mới, không cài plugin mới, không cài package hệ thống.

| Lớp | Giữ nguyên | Thêm / Đổi | Vì sao |
|---|---|---|---|
| **Model** | `cline-pass` free + `kimi-k3` 1M ctx | không đổi | đã đủ cho discovery/act; per-role routing `[NOT VERIFIED]` |
| **Rules** | `.clinerules` (persona/authority) + `AGENTS.md` (roster/protocol) | tách rule luôn-on sang `.clinerules/rules/*.md` với `paths:` | G7 — mở khoá conditional loading, giảm context noise |
| **Skills** | — | **tạo `.agents/skills/`** với 6 skill portable | **G1 = gap lớn nhất** |
| **MCP** | `playwright`, `memory`, `context7`, `sequential-thinking` | không thêm; `[HUMAN GATE]` nếu disable `filesystem` | native đã đủ (§6) |
| **Plugins** | `agent-browser` | không thêm | bù native browser đang tắt |
| **Hooks** | — | **2 hook**: `PreToolUse` (destructive gate hẹp) + `TaskComplete` (evidence gate) | G4 — control without friction (§8.3) |
| **Browser** | MCP `playwright` + plugin `agent-browser` | giữ native **tắt** | đã có 2 đường thay thế; bật native = `[HUMAN GATE]` |
| **Execution** | terminal, filesystem, checkpoint, `--worktree` | không thêm | VERIFIED |
| **Teams** | `team_*` tools có sẵn | **không dùng** trong pass này | `--team-name` `[NOT VERIFIED]` ở CLI 3.0.68 |
| **Registry** | chỉ docs (`docs/AGENT_OS.md`) | không tạo machine-readable registry | G5 + `.aios/` DENIED → `[HUMAN GATE]` |

### 15.1 Danh sách 6 skill đề xuất `[PROPOSAL]`

Đặt tại `.agents/skills/<ten>/SKILL.md`, format `name` + `description` (**cùng format** `.opencode/skills/` — tái dùng, không duplicate §5.5):

1. `source-trace` — truy nguồn nội dung/route về SoT
2. `ontology-audit` — đối chiếu MẠCH ontology, **chỉ đọc**, mọi mâu thuẫn → `[HUMAN GATE]`
3. `ia-sitemap-audit` — IA/sitemap vs routes thực tế
4. `governance-audit` — `PROJECT_CONTRACT.json` + rules compliance
5. `source-brief` — evidence → brief cho executor
6. `mach-forensic-audit` — inventory/trace/evidence tổng hợp

*(Để lại `data-integrity-gate`, `mach-publication` — liên quan DB/publication, ngoài scope `.clinerules` §1–2.)*

### 15.2 Role model — 5 role `[PROPOSAL]`

Không tạo 20 agent. Role = skill + rule text (Cline **không** có file role → §4.1):

| Role | Purpose | Input | Output | Tools | Forbidden | Escalation | Evidence |
|---|---|---|---|---|---|---|---|
| **Research / Forensic** | inventory, trace, evidence | câu hỏi + scope | report `[FACT]` + `file:line` | read, grep, search, web | edit/write任何 | phát hiện mâu thuẫn SoT | mỗi claim 1 tag + đường dẫn |
| **Architecture / Ontology** | audit routes/IA/ontology | `.aios/`, `docs/architecture/` | phát hiện + phân loại | read-only | canonicalize IA, đổi ontology | **bắt buộc** `[HUMAN GATE]` | dẫn nguồn văn bản gốc |
| **Implementation** | thực thi brief đã approve | brief + surface `src/css/`, `src/js/ui/`, `index.html` | diff tối giản | read, edit (trong surface) | `server/`, `src/js/core/`, `api/`, `docs/`, `.aios/`, `brand/` | ra ngoài surface | `git diff` + verify |
| **QA / Browser** | regression/acceptance | tiêu chí | PASS/FAIL/UNKNOWN | browser, terminal, read | sửa source | fail không reproduce được | screenshot hoặc `getComputedStyle` |
| **Documentation / Source brief** | ghi report | evidence đã có | brief/report | read, write trong `docs/audit/` | tự assign task khác | 10 mục Handoff thiếu | nhãn `[FACT]`/`[INFERENCE]` |

**Không tách Data review / Visual review** thành role riêng — đã nằm trong QA và Ontology `[PROPOSAL]`.

---

## 16. INTEGRATION PLAN `[PROPOSAL]`

Thứ tự theo giá trị tăng dần / rủi ro tăng dần. **Không thực thi trong pass này** — mọi bước là đề xuất.

| # | Hành động | Vị trí | Gate | Gap đóng |
|---|---|---|---|---|
| **I1** | Tạo 6 skill portable | `.agents/skills/*/SKILL.md` | **Tự thực thi được** (trong surface) | G1 |
| **I2** | Tách rule always-on + conditional `paths:` | `.clinerules/rules/*.md` | cần Tuấn duyệt nội dung rule | G2, G7 |
| **I3** | Viết role prompts vào skill (không tạo file role mới) | kèm I1 | đi kèm I1 | G2 |
| **I4** | 2 hook: destructive gate + evidence gate | `.cline/hooks/PreToolUse`, `.cline/hooks/TaskComplete` | **`[HUMAN GATE]`** trước khi bật `cancel=true` | G4 |
| **I5** | Ghi capability map dạng docs (không registry machine-readable) | `docs/AGENT_OS.md` § Roles/Skills (bổ sung Cline) | `[HUMAN GATE]` vì `docs/` DENIED với Cline | G5 |
| **I6** | Quyết định bật native browser | `~/.cline/data/settings/globalState.json` | **`[HUMAN GATE]`** — config máy cá nhân | G3 |
| **I7** | Quyết định disable `filesystem` MCP (tiết kiệm token) | `cline_mcp_settings.json` | **`[HUMAN GATE]`** | — |
| **I8** | Survey community skills/marketplace | `npx skills find` | pass sau | G9 |
| **I9** | Xác minh `--team-name` / per-role model | `cline config` (cần TTY) | `[NOT VERIFIED]` → để pass sau | G6, G10 |

**Không làm:** cài MCP/plugin/package mới · sửa genealogy/database/schema · deploy · push · đổi global machine config ngoài gate.

---

