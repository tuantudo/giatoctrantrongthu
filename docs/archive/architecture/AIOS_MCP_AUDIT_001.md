# AIOS MCP AUDIT 001

## 1. Executive Summary

Báo cáo này lập bản đồ toàn bộ MCP (Model Context Protocol) server đang được cấu hình trong hệ thống OpenCode hiện tại. Mục tiêu: thiết kế Context Least Privilege sau này.

**Tổng kết:**
- **CONFIGURED:** 19 MCP servers (trong `opencode.jsonc`)
- **EXPOSED (connected + tools available):** 17 MCP servers
- **NOT EXPOSED:** 2 MCP servers (figma, illustrator)
- **Remote:** 2 (figma, illustrator)
- **Local:** 17 (spawn qua stdio)

---

## 2. Configuration Sources

| Source | Path | Role |
|--------|------|------|
| Primary config | `~/.config/opencode/opencode.jsonc` | Active configuration — MCP definitions |
| Secondary config | `~/.config/opencode/opencode.json` | Backup/override — has 2 additional MCPs (aios-working-memory, figma) |
| AIOS MCP dir | `~/.aios/mcp/` | Custom MCP servers (knowledge-graph) |
| AIOS communication | `~/.aios/communication/` | Gateway scripts (slack-gateway.js) |
| Plugins | `~/.config/opencode/plugins/` | MCP policy bridge, custom tools |

**Config Merge Rule:** `opencode.jsonc` is the primary config (loaded by OpenCode). `opencode.json` appears to be a backup/older config. The system is currently using `opencode.jsonc`.

---

## 3. Full MCP Inventory

### Legend

| Field | Meaning |
|-------|---------|
| NAME | MCP server identifier |
| SOURCE | Which config file defines it |
| TYPE | `local` (stdio spawn) or `remote` (HTTP) |
| STATUS | `ENABLED` (connected, tools available) or `DISABLED` or `NOT_EXPOSED` |
| TOOLS | Number of tools exposed (from current session) |
| AGENTS | Which agents have access (global = all agents) |
| CLASSIFICATION | VERIFIED / CONFIGURED / ENABLED / EXPOSED / UNKNOWN |

---

### 3.1 aios-gmail

| Field | Value |
|-------|-------|
| NAME | `aios-gmail` |
| SOURCE | `opencode.jsonc` (line 254) |
| TYPE | local (Python stdio) |
| COMMAND | `/Users/tuantq/Workspace/02_AIOS/.venv/bin/python -m aios.integrations.gmail.mcp_server` |
| ENVIRONMENT | `PYTHONPATH=/Users/tuantq/Workspace/02_AIOS`, `AIOS_RUNTIME_ID=opencode` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 7 (gmail_draft_delete, gmail_draft_list, gmail_draft_send, gmail_fetch_email, gmail_list_labels, gmail_list_threads, gmail_send_email) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.2 aios-working-memory

| Field | Value |
|-------|-------|
| NAME | `aios-working-memory` |
| SOURCE | `opencode.json` (line 39) — NOT in primary `opencode.jsonc` |
| TYPE | remote (HTTP) |
| URL | `http://127.0.0.1:8765/mcp` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 4 (create_memory, delete_memory, list_memories, search_memories) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |
| NOTE | Defined in `opencode.json` but tools are available — may be loaded from secondary config or running independently |

---

### 3.3 bitwarden

| Field | Value |
|-------|-------|
| NAME | `bitwarden` |
| SOURCE | `opencode.jsonc` (line 334) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @bitwarden/mcp-server` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 59 (bitwarden_* — comprehensive vault management) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.4 context7

| Field | Value |
|-------|-------|
| NAME | `context7` |
| SOURCE | `opencode.jsonc` (line 388) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @upstash/context7-mcp` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 2 (query-docs, resolve-library-id) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.5 exa

| Field | Value |
|-------|-------|
| NAME | `exa` |
| SOURCE | `opencode.jsonc` (line 377) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y exa-mcp-server` |
| ENVIRONMENT | `EXA_API_KEY=""` (empty) |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 2 (web_fetch_exa, web_search_exa) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |
| NOTE | API key is empty string — may fail at runtime |

---

### 3.6 filesystem

| Field | Value |
|-------|-------|
| NAME | `filesystem` |
| SOURCE | `opencode.jsonc` (line 266) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @modelcontextprotocol/server-filesystem ~/Obsidian` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 14 (filesystem_* — read/write/search for ~/Obsidian) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |
| SCOPE | Scoped to `~/Obsidian` directory only |

---

### 3.7 github

| Field | Value |
|-------|-------|
| NAME | `github` |
| SOURCE | `opencode.jsonc` (line 300) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @modelcontextprotocol/server-github` |
| ENVIRONMENT | `GITHUB_PERSONAL_ACCESS_TOKEN=""` (empty) |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 26 (github_* — issues, PRs, repos, search) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |
| NOTE | Token is empty — may fail at runtime |

---

### 3.8 knowledge-graph

| Field | Value |
|-------|-------|
| NAME | `knowledge-graph` |
| SOURCE | `opencode.jsonc` (line 396) |
| TYPE | local (tsx stdio) |
| COMMAND | `/Users/tuantq/.aios/mcp/knowledge-graph/node_modules/.bin/tsx /Users/tuantq/.aios/mcp/knowledge-graph/src/mcp/index.ts` |
| ENVIRONMENT | `KG_VAULT_PATH=/Users/tuantq/Obsidian`, `KG_DATA_DIR=/Users/tuantq/.aios/data/knowledge-graph` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 14 (kg_add_communities, kg_add_observations, kg_add_records, kg_community, kg_communities, kg_delete_community, kg_delete_entities, kg_delete_observations, kg_open_nodes, kg_read_graph, kg_search, kg_search_entities, kg_search_relations, kg_update_community) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.9 memory

| Field | Value |
|-------|-------|
| NAME | `memory` |
| SOURCE | `opencode.jsonc` (line 311) |
| TYPE | local (bash stdio) |
| COMMAND | `bash /Users/tuantq/.config/opencode/scripts/mcp-memory.sh` → runs `npx -y @modelcontextprotocol/server-memory` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 9 (memory_create_entities, memory_create_relations, memory_delete_entities, memory_delete_observations, memory_delete_relation, memory_open_nodes, memory_search, memory_search_nodes, memory_update_entities) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.10 playwright

| Field | Value |
|-------|-------|
| NAME | `playwright` |
| SOURCE | `opencode.jsonc` (line 288) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @playwright/mcp --caps pdf --user-data-dir ~/.cache/ms-playwright-mcp` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 27 (playwright_* — browser automation, PDF capture) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.11 puppeteer

| Field | Value |
|-------|-------|
| NAME | `puppeteer` |
| SOURCE | `opencode.jsonc` (line 318) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @modelcontextprotocol/server-puppeteer` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 7 (puppeteer_* — browser automation) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.12 react-spectrum

| Field | Value |
|-------|-------|
| NAME | `react-spectrum` |
| SOURCE | `opencode.jsonc` (line 351) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @react-spectrum/mcp@latest` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 9 (react-spectrum_* — Spectrum design system docs) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.13 sequential-thinking

| Field | Value |
|-------|-------|
| NAME | `sequential-thinking` |
| SOURCE | `opencode.jsonc` (line 326) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @modelcontextprotocol/server-sequential-thinking` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 1 (sequentialthinking) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.14 serena

| Field | Value |
|-------|-------|
| NAME | `serena` |
| SOURCE | `opencode.jsonc` (line 407) |
| TYPE | local (binary stdio) |
| COMMAND | `/Users/tuantq/.local/bin/serena start-mcp-server --enable-web-dashboard False --enable-gui-log-window False` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 29 (serena_* — code intelligence, LSP operations) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.15 slack

| Field | Value |
|-------|-------|
| NAME | `slack` |
| SOURCE | `opencode.jsonc` (line 367) |
| TYPE | local (node stdio) |
| COMMAND | `node /Users/tuantq/.aios/communication/slack-gateway.js` |
| ENVIRONMENT | `AIOS_RUNTIME_ID=opencode` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 14 (slack_* — channels, messages, reactions, users) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.16 spectrum-design-data

| Field | Value |
|-------|-------|
| NAME | `spectrum-design-data` |
| SOURCE | `opencode.jsonc` (line 359) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @adobe/spectrum-design-data-mcp` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 8 (spectrum-design-data_* — component data) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.17 adobe-express-developer

| Field | Value |
|-------|-------|
| NAME | `adobe-express-developer` |
| SOURCE | `opencode.jsonc` (line 342) |
| TYPE | local (npx stdio) |
| COMMAND | `npx -y @adobe/express-developer-mcp@latest --yes` |
| STATUS | **EXPOSED** — tools visible in current session |
| TOOLS | 2 (adobe-express-developer_* — Express Add-on SDK docs) |
| AGENTS | global (all agents) |
| CLASSIFICATION | EXPOSED |

---

### 3.18 figma

| Field | Value |
|-------|-------|
| NAME | `figma` |
| SOURCE | `opencode.jsonc` (line 418) AND `opencode.json` (line 44) |
| TYPE | **remote** (HTTP) |
| URL | `https://mcp.figma.com/mcp` |
| STATUS | **NOT EXPOSED** — no tools visible in current session |
| TOOLS | 0 (not connected) |
| AGENTS | global (if connected) |
| CLASSIFICATION | CONFIGURED but NOT_EXPOSED |
| NOTE | Remote MCP — requires OAuth authentication. Tools not appearing suggests auth not completed. |

---

### 3.19 illustrator

| Field | Value |
|-------|-------|
| NAME | `illustrator` |
| SOURCE | `opencode.jsonc` (line 422) |
| TYPE | **remote** (HTTP) |
| URL | `http://localhost:18412/v1/mcp` |
| HEADERS | `Authorization: Bearer ilst_afc3c7c0892dd507467a57b31022d88e1225a89b70fe6f8ac92182ce4f6330a8` |
| STATUS | **NOT EXPOSED** — no tools visible in current session |
| TOOLS | 0 (not connected) |
| AGENTS | global (if connected) |
| CLASSIFICATION | CONFIGURED but NOT_EXPOSED |
| NOTE | Requires Adobe Illustrator running locally with MCP plugin active. Port 18412 must be listening. |

---

## 4. Summary Matrix

| # | NAME | SOURCE | TYPE | STATUS | TOOLS | AGENTS |
|---|------|--------|------|--------|-------|--------|
| 1 | aios-gmail | jsonc | local | EXPOSED | 7 | global |
| 2 | aios-working-memory | json | remote | EXPOSED | 4 | global |
| 3 | bitwarden | jsonc | local | EXPOSED | 59 | global |
| 4 | context7 | jsonc | local | EXPOSED | 2 | global |
| 5 | exa | jsonc | local | EXPOSED | 2 | global |
| 6 | filesystem | jsonc | local | EXPOSED | 14 | global |
| 7 | github | jsonc | local | EXPOSED | 26 | global |
| 8 | knowledge-graph | jsonc | local | EXPOSED | 14 | global |
| 9 | memory | jsonc | local | EXPOSED | 9 | global |
| 10 | playwright | jsonc | local | EXPOSED | 27 | global |
| 11 | puppeteer | jsonc | local | EXPOSED | 7 | global |
| 12 | react-spectrum | jsonc | local | EXPOSED | 9 | global |
| 13 | sequential-thinking | jsonc | local | EXPOSED | 1 | global |
| 14 | serena | jsonc | local | EXPOSED | 29 | global |
| 15 | slack | jsonc | local | EXPOSED | 14 | global |
| 16 | spectrum-design-data | jsonc | local | EXPOSED | 8 | global |
| 17 | adobe-express-developer | jsonc | local | EXPOSED | 2 | global |
| 18 | figma | jsonc+json | remote | NOT_EXPOSED | 0 | global |
| 19 | illustrator | jsonc | remote | NOT_EXPOSED | 0 | global |

**TOTAL TOOLS EXPOSED:** ~234 (across 17 connected MCP servers)

---

## 5. Globally Exposed MCPs

**ALL 17 connected MCP servers are exposed globally.** Every agent (main, plan, architect, reviewer, researcher, adobe-platform-engineer) has access to all 234 MCP tools.

No per-agent MCP scoping is configured.

---

## 6. Agent-MCP Mapping

| Agent | MCP Access | Scoping |
|-------|-----------|---------|
| main (default) | ALL 17 MCPs | NONE — global |
| plan | ALL 17 MCPs | NONE — global |
| architect | ALL 17 MCPs | NONE — global |
| reviewer | ALL 17 MCPs | NONE — global |
| researcher | ALL 17 MCPs | NONE — global |
| adobe-platform-engineer | ALL 17 MCPs | NONE — global |
| task (subagent) | ALL 17 MCPs | NONE — global |

---

## 7. Security Observations

| # | Finding | Risk | Classification |
|---|---------|------|----------------|
| S1 | All MCPs exposed globally — no per-agent scoping | HIGH | OBSERVED |
| S2 | `bitwarden` (59 tools) exposed to all agents | HIGH | OBSERVED |
| S3 | `github` token empty — may fail or use cached auth | MEDIUM | OBSERVED |
| S4 | `exa` API key empty — may fail at runtime | MEDIUM | OBSERVED |
| S5 | `illustrator` has hardcoded bearer token in config | MEDIUM | OBSERVED |
| S6 | `filesystem` scoped to `~/Obsidian` only | LOW | OBSERVED |
| S7 | `aios-working-memory` on localhost:8765 — no auth | MEDIUM | OBSERVED |
| S8 | `slack` gateway runs as local node process | LOW | OBSERVED |
| S9 | `aios-gmail` has full email access (send, delete, draft) | HIGH | OBSERVED |
| S10 | No MCP tool count limits per agent | MEDIUM | OBSERVED |

---

## 8. Recommendations for Context Least Privilege

| # | Recommendation | Priority |
|---|---------------|----------|
| R1 | Scope `bitwarden` to only `main` agent (or Human-only) | HIGH |
| R2 | Scope `aios-gmail` to only agents that need email | HIGH |
| R3 | Scope `slack` to only agents that need communication | HIGH |
| R4 | Scope `github` to only agents that need repo access | MEDIUM |
| R5 | Scope `playwright`/`puppeteer` to agents that need browser | MEDIUM |
| R6 | Scope `illustrator`/`react-spectrum`/`spectrum-design-data` to `adobe-platform-engineer` only | MEDIUM |
| R7 | Remove empty API keys (`exa`, `github`) or configure them | LOW |
| R8 | Add auth to `aios-working-memory` localhost endpoint | MEDIUM |
| R9 | Audit `serena` 29 tools — not all agents need code intelligence | MEDIUM |

---

## 9. Evidence Classification

| Claim | Classification |
|-------|---------------|
| 19 MCP servers configured in opencode.jsonc | CONFIGURED |
| 17 MCP servers connected with tools | EXPOSED |
| 2 MCP servers configured but not connected | CONFIGURED, NOT_EXPOSED |
| All MCPs exposed globally to all agents | OBSERVED |
| No per-agent MCP scoping exists | OBSERVED |
| ~234 total tools exposed | EXPOSED |
| bitwarden has 59 tools | EXPOSED |
| serena has 29 tools | EXPOSED |
| playwright has 27 tools | EXPOSED |
| github has 26 tools | EXPOSED |
| illustrator token hardcoded | OBSERVED |
| exa/github API keys empty | OBSERVED |

---

`STOP — MCP AUDIT COMPLETE`
