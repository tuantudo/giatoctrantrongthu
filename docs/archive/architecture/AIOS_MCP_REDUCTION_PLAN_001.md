# AIOS MCP REDUCTION PLAN 001

**Mission:** AIOS-MCP-REDUCTION-001
**Role:** AGY (Context Architect)
**Date:** 2026-09-20

## 1. Executive Summary

Kế hoạch giảm MCP context từ 19 servers / ~234 tools xuống mức tối thiểu cần thiết theo nguyên tắc **Context Least Privilege**. Mỗi MCP được phân loại thành 5 nhóm: CORE, AGENT-SCOPED, MISSION-SCOPED, DISABLE CANDIDATE, UNKNOWN.

**Target:** Giảm context cost từ ~234 tools xuống ~40-50 tools cho typical coding session.

---

## 2. Per-MCP Analysis

### 2.1 bitwarden

| Field | Value |
|-------|-------|
| MCP Name | `bitwarden` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 59 |
| Capability | Secrets management (vault CRUD, org groups/members) |
| Current Users | All agents (global) |
| Context Cost | **HIGH** — 59 tool schemas injected into every prompt |
| Security Risk | **HIGH** — full vault access, send/create/delete credentials |
| Overlap | None — unique capability |
| Proposed Scope | **AGENT-SCOPED → main only** |
| Reason | Only main agent interacts with Human for credential ops. Subagents should never access vault. |
| Evidence Source | OBSERVED (opencode.jsonc:334, MCP_AUDIT_001:S2) |

### 2.2 aios-gmail

| Field | Value |
|-------|-------|
| MCP Name | `aios-gmail` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 7 |
| Capability | Gmail: fetch, send, draft, delete, list labels/threads |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 7 tool schemas |
| Security Risk | **HIGH** — send_email, gmail_draft_delete are destructive |
| Overlap | None — unique capability |
| Proposed Scope | **MISSION-SCOPED** — only when email mission active |
| Reason | Email ops are rare. No coding mission needs Gmail. Only Orchestrator-initiated email tasks. |
| Evidence Source | OBSERVED (opencode.jsonc:254, MCP_AUDIT_001:S9) |

### 2.3 serena

| Field | Value |
|-------|-------|
| MCP Name | `serena` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 29 |
| Capability | Code intelligence: LSP, symbols, references, hover, call hierarchy |
| Current Users | All agents (global) |
| Context Cost | **HIGH** — 29 tool schemas |
| Security Risk | **MEDIUM** — read-only code analysis, no mutation |
| Overlap | Partial overlap with native LSP tool (OpenCode built-in) |
| Proposed Scope | **AGENT-SCOPED → main, reviewer** |
| Reason | Only main and reviewer need deep code intelligence. Plan/architect/researcher don't inspect code symbols. |
| Evidence Source | OBSERVED (opencode.jsonc:407, CAPABILITY_MATRIX:serena) |

### 2.4 playwright

| Field | Value |
|-------|-------|
| MCP Name | `playwright` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 27 |
| Capability | Browser automation, PDF capture, page interaction |
| Current Users | All agents (global) |
| Context Cost | **HIGH** — 27 tool schemas |
| Security Risk | **MEDIUM** — can navigate arbitrary URLs, capture screenshots |
| Overlap | OVERLAP with `puppeteer` (7 tools) |
| Proposed Scope | **AGENT-SCOPED → main** (disable puppeteer) |
| Reason | Playwright is superior (PDF caps, more tools). Puppeteer is redundant. Only main needs browser for testing. |
| Evidence Source | OBSERVED (opencode.jsonc:288, CAPABILITY_MATRIX:"REPLACE puppeteer") |

### 2.5 github

| Field | Value |
|-------|-------|
| MCP Name | `github` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 26 |
| Capability | GitHub API: issues, PRs, repos, search, code |
| Current Users | All agents (global) |
| Context Cost | **HIGH** — 26 tool schemas |
| Security Risk | **HIGH** — push, create PR, modify issues |
| Overlap | None — unique capability for remote repo |
| Proposed Scope | **AGENT-SCOPED → main, researcher** |
| Reason | Main handles git operations. Researcher needs repo search. Others don't need GitHub API. Token currently empty — may be non-functional. |
| Evidence Source | OBSERVED (opencode.jsonc:300, MCP_AUDIT_001:S3) |

### 2.6 slack

| Field | Value |
|-------|-------|
| MCP Name | `slack` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 14 |
| Capability | Slack: channels, messages, reactions, users |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 14 tool schemas |
| Security Risk | **MEDIUM** — can post messages, react |
| Overlap | None — unique communication channel |
| Proposed Scope | **MISSION-SCOPED** — only when Slack reporting mission active |
| Reason | Communication is rare. No coding mission needs Slack. Only Orchestrator-initiated comms. |
| Evidence Source | OBSERVED (opencode.jsonc:367, CAPABILITY_MATRIX:"DISABLE除非needed") |

### 2.7 knowledge-graph

| Field | Value |
|-------|-------|
| MCP Name | `knowledge-graph` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 14 |
| Capability | Knowledge graph: entities, relations, communities, search |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 14 tool schemas |
| Security Risk | **LOW** — read/write to local Obsidian vault only |
| Overlap | OVERLAP with `memory` (9 tools) and `aios-working-memory` (4 tools) |
| Proposed Scope | **CORE** — keep global for knowledge missions |
| Reason | Primary knowledge management tool. Overlaps with memory but serves different purpose (structured graph vs flat entities). |
| Evidence Source | OBSERVED (opencode.jsonc:396, CAPABILITY_MATRIX:"Giữ knowledge-graph") |

### 2.8 memory

| Field | Value |
|-------|-------|
| MCP Name | `memory` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 9 |
| Capability | Flat entity/relation memory (create, search, delete) |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 9 tool schemas |
| Security Risk | **LOW** — local file-based memory |
| Overlap | OVERLAP with `knowledge-graph` (structured graph) |
| Proposed Scope | **DISABLE CANDIDATE** |
| Reason | knowledge-graph provides superior structured memory. memory is redundant. If knowledge-graph is CORE, memory is unnecessary. |
| Evidence Source | OBSERVED (opencode.jsonc:311, CAPABILITY_MATRIX:"DISABLE các MCP phụ") |

### 2.9 aios-working-memory

| Field | Value |
|-------|-------|
| MCP Name | `aios-working-memory` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 4 |
| Capability | Working memory: create, search, delete, list |
| Current Users | All agents (global) |
| Context Cost | **LOW** — 4 tool schemas |
| Security Risk | **MEDIUM** — localhost:8765 no auth |
| Overlap | OVERLAP with `memory` and `knowledge-graph` |
| Proposed Scope | **MISSION-SCOPED** — only when AIOS orchestration active |
| Reason | AIOS-specific working memory. Not needed for standalone coding missions. |
| Evidence Source | OBSERVED (opencode.json, MCP_AUDIT_001:3.2) |

### 2.10 puppeteer

| Field | Value |
|-------|-------|
| MCP Name | `puppeteer` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 7 |
| Capability | Browser automation (subset of playwright) |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 7 tool schemas |
| Security Risk | **MEDIUM** — browser automation |
| Overlap | FULL OVERLAP with `playwright` (playwright is superset) |
| Proposed Scope | **DISABLE CANDIDATE** |
| Reason | Playwright covers all puppeteer capabilities + PDF + more. Pure redundancy. |
| Evidence Source | OBSERVED (opencode.jsonc:318, CAPABILITY_MATRIX:"Tắt puppeteer") |

### 2.11 figma

| Field | Value |
|-------|-------|
| MCP Name | `figma` |
| Current Status | NOT EXPOSED (auth not completed) |
| Exposed/Global | N/A — not connected |
| Tool Count | 0 |
| Capability | Figma design file access |
| Current Users | None (not connected) |
| Context Cost | **NONE** — not connected |
| Security Risk | **UNKNOWN** — requires OAuth |
| Overlap | None — unique design tool |
| Proposed Scope | **MISSION-SCOPED** — only when Figma design mission active |
| Reason | Not currently functional. Keep config but only enable when needed. |
| Evidence Source | OBSERVED (opencode.jsonc:418, MCP_AUDIT_001:3.18) |

### 2.12 illustrator

| Field | Value |
|-------|-------|
| MCP Name | `illustrator` |
| Current Status | NOT EXPOSED (Illustrator not running) |
| Exposed/Global | N/A — not connected |
| Tool Count | 0 |
| Capability | Adobe Illustrator automation |
| Current Users | None (not connected) |
| Context Cost | **NONE** — not connected |
| Security Risk | **MEDIUM** — hardcoded bearer token in config |
| Overlap | Partial overlap with `adobe-express-developer` for Adobe ecosystem |
| Proposed Scope | **MISSION-SCOPED** — only when Illustrator automation mission active |
| Reason | Not currently functional. Requires Illustrator running. Keep config for adobe-platform-engineer. |
| Evidence Source | OBSERVED (opencode.jsonc:422, MCP_AUDIT_001:3.19) |

### 2.13 react-spectrum

| Field | Value |
|-------|-------|
| MCP Name | `react-spectrum` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 9 |
| Capability | Adobe Spectrum design system documentation |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 9 tool schemas |
| Security Risk | **LOW** — read-only documentation |
| Overlap | Partial overlap with `spectrum-design-data` |
| Proposed Scope | **AGENT-SCOPED → adobe-platform-engineer** |
| Reason | Only Adobe agent needs Spectrum design docs. Other agents never reference Spectrum. |
| Evidence Source | OBSERVED (opencode.jsonc:351, CAPABILITY_MATRIX:"KEEP Cline only") |

### 2.14 spectrum-design-data

| Field | Value |
|-------|-------|
| MCP Name | `spectrum-design-data` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 8 |
| Capability | Spectrum component data (tokens, icons, components) |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 8 tool schemas |
| Security Risk | **LOW** — read-only data |
| Overlap | OVERLAP with `react-spectrum` (both Spectrum docs) |
| Proposed Scope | **AGENT-SCOPED → adobe-platform-engineer** |
| Reason | Same as react-spectrum. Both are Adobe-only tools. |
| Evidence Source | OBSERVED (opencode.jsonc:359, CAPABILITY_MATRIX:"KEEP Cline only") |

### 2.15 adobe-express-developer

| Field | Value |
|-------|-------|
| MCP Name | `adobe-express-developer` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 2 |
| Capability | Adobe Express Add-on SDK documentation |
| Current Users | All agents (global) |
| Context Cost | **LOW** — 2 tool schemas |
| Security Risk | **LOW** — read-only documentation |
| Overlap | None — unique Express SDK docs |
| Proposed Scope | **AGENT-SCOPED → adobe-platform-engineer** |
| Reason | Only Adobe agent needs Express SDK docs. |
| Evidence Source | OBSERVED (opencode.jsonc:342) |

### 2.16 context7

| Field | Value |
|-------|-------|
| MCP Name | `context7` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 2 |
| Capability | Library documentation lookup (resolve-library-id, query-docs) |
| Current Users | All agents (global) |
| Context Cost | **LOW** — 2 tool schemas |
| Security Risk | **LOW** — read-only docs |
| Overlap | None — unique library doc resolution |
| Proposed Scope | **CORE** — keep global |
| Reason | Essential for any coding mission. Low cost, high value. Every agent may need to look up library docs. |
| Evidence Source | OBSERVED (opencode.jsonc:388) |

### 2.17 exa

| Field | Value |
|-------|-------|
| MCP Name | `exa` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 2 |
| Capability | Web search and fetch via Exa API |
| Current Users | All agents (global) |
| Context Cost | **LOW** — 2 tool schemas |
| Security Risk | **LOW** — read-only web |
| Overlap | OVERLAP with native `websearch` and `webfetch` tools |
| Proposed Scope | **DISABLE CANDIDATE** |
| Reason | API key is empty (MCP_AUDIT_001). Native websearch/webfetch already available. Redundant. |
| Evidence Source | OBSERVED (opencode.jsonc:377, MCP_AUDIT_001:EXA_API_KEY="") |

### 2.18 filesystem

| Field | Value |
|-------|-------|
| MCP Name | `filesystem` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 14 |
| Capability | Filesystem operations scoped to ~/Obsidian |
| Current Users | All agents (global) |
| Context Cost | **MEDIUM** — 14 tool schemas |
| Security Risk | **LOW** — scoped to ~/Obsidian only |
| Overlap | Partial overlap with native Read/Write/Glob/Grep tools (but different scope) |
| Proposed Scope | **CORE** — keep global |
| Reason | Provides Obsidian-specific filesystem access. Native tools don't cover ~/Obsidian scope. Essential for knowledge management. |
| Evidence Source | OBSERVED (opencode.jsonc:266, MCP_AUDIT_001:3.6) |

### 2.19 sequential-thinking

| Field | Value |
|-------|-------|
| MCP Name | `sequential-thinking` |
| Current Status | EXPOSED |
| Exposed/Global | Global — all agents |
| Tool Count | 1 |
| Capability | Structured sequential reasoning |
| Current Users | All agents (global) |
| Context Cost | **LOW** — 1 tool schema |
| Security Risk | **LOW** — pure reasoning, no IO |
| Overlap | None — unique reasoning tool |
| Proposed Scope | **CORE** — keep global |
| Reason | Minimal context cost (1 tool). Provides structured reasoning capability. Useful for all agents. |
| Evidence Source | OBSERVED (opencode.jsonc:326) |

### 2.20 yaml-ls (Note: NOT in config — may be LSP)

| Field | Value |
|-------|-------|
| MCP Name | `yaml-ls` |
| Current Status | UNKNOWN — not found in opencode.jsonc MCP section |
| Exposed/Global | N/A |
| Tool Count | N/A |
| Capability | YAML language server (likely LSP, not MCP) |
| Current Users | N/A |
| Context Cost | N/A |
| Security Risk | N/A |
| Overlap | N/A |
| Proposed Scope | **UNKNOWN** |
| Reason | Not found in MCP config. May be an LSP server configured under `lsp` section, not MCP. Needs verification. |
| Evidence Source | UNKNOWN — not in opencode.jsonc MCP section |

---

## 3. Classification Summary

### 3.1 CORE (Keep Global)

| MCP | Tools | Context Cost | Reason |
|-----|-------|-------------|--------|
| context7 | 2 | LOW | Essential library docs for any coding |
| filesystem | 14 | MEDIUM | Obsidian filesystem access, unique scope |
| knowledge-graph | 14 | MEDIUM | Primary knowledge management |
| sequential-thinking | 1 | LOW | Structured reasoning, minimal cost |
| **TOTAL** | **31** | | |

### 3.2 AGENT-SCOPED

| MCP | Tools | Target Agent(s) | Context Cost | Reason |
|-----|-------|-----------------|-------------|--------|
| bitwarden | 59 | main | HIGH | Secrets only via main agent |
| serena | 29 | main, reviewer | HIGH | Code intelligence for review |
| playwright | 27 | main | HIGH | Browser testing via main |
| github | 26 | main, researcher | HIGH | Repo ops via main |
| react-spectrum | 9 | adobe-platform-engineer | MEDIUM | Adobe design docs |
| spectrum-design-data | 8 | adobe-platform-engineer | MEDIUM | Adobe component data |
| adobe-express-developer | 2 | adobe-platform-engineer | LOW | Adobe Express SDK |
| **TOTAL** | **160** | | | |

### 3.3 MISSION-SCOPED

| MCP | Tools | Trigger Mission | Context Cost | Reason |
|-----|-------|----------------|-------------|--------|
| aios-gmail | 7 | Email mission | MEDIUM | Rare email ops |
| slack | 14 | Communication mission | MEDIUM | Rare Slack ops |
| aios-working-memory | 4 | AIOS orchestration | LOW | AIOS-specific |
| figma | 0 | Figma design mission | NONE | Not connected |
| illustrator | 0 | Illustrator automation | NONE | Not connected |
| **TOTAL** | **25** | | | |

### 3.4 DISABLE CANDIDATE

| MCP | Tools | Reason | Evidence |
|-----|-------|--------|----------|
| memory | 9 | Overlap with knowledge-graph | CAPABILITY_MATRIX: "DISABLE" |
| puppeteer | 7 | Full overlap with playwright | CAPABILITY_MATRIX: "Tắt puppeteer" |
| exa | 2 | Empty API key + overlap with websearch | MCP_AUDIT_001: EXA_API_KEY="" |
| **TOTAL** | **18** | | |

### 3.5 UNKNOWN

| MCP | Tools | Reason |
|-----|-------|--------|
| yaml-ls | N/A | Not found in MCP config — may be LSP |

---

## 4. Context Cost Projection

### Current State

| Category | MCPs | Tools | % of Total |
|----------|------|-------|-----------|
| EXPOSED (global) | 17 | ~234 | 100% |
| NOT EXPOSED | 2 | 0 | 0% |

### Proposed State

| Category | MCPs | Tools | % of Total |
|----------|------|-------|-----------|
| CORE (global) | 4 | 31 | 13% |
| AGENT-SCOPED | 7 | 160 | 68% |
| MISSION-SCOPED | 5 | 25 | 11% |
| DISABLE CANDIDATE | 3 | 18 | 8% |
| **TOTAL** | **19** | **234** | |

### Typical Coding Session (main agent)

| Before | After | Reduction |
|--------|-------|-----------|
| 234 tools | ~40 tools (CORE 31 + bitwarden 59 → main only, but context-aware) | ~83% |

**Note:** Agent-scoped tools are only injected when that specific agent is active. Mission-scoped tools are only injected when mission is triggered.

---

## 5. Proposed Target Architecture

```
┌─────────────────────────────────────────────────┐
│                   GLOBAL (CORE)                  │
│  context7, filesystem, knowledge-graph,          │
│  sequential-thinking                             │
│  → 31 tools always available                     │
├─────────────────────────────────────────────────┤
│               AGENT-SCOPED                       │
│  main:      bitwarden, playwright, github        │
│  reviewer:  serena                               │
│  researcher: github                              │
│  adobe-*:   react-spectrum, spectrum-data,       │
│             adobe-express                        │
│  → Tools injected per agent activation           │
├─────────────────────────────────────────────────┤
│              MISSION-SCOPED                      │
│  aios-gmail, slack, aios-working-memory,         │
│  figma, illustrator                              │
│  → Tools injected only when mission triggered    │
├─────────────────────────────────────────────────┤
│            DISABLE CANDIDATE                     │
│  memory, puppeteer, exa                          │
│  → Remove from config                            │
└─────────────────────────────────────────────────┘
```

---

## 6. Implementation Sequence

| Phase | Action | Risk | MCPs Affected |
|-------|--------|------|---------------|
| 1 | Disable puppeteer (full overlap with playwright) | LOW | puppeteer |
| 2 | Disable exa (empty API key, overlap with websearch) | LOW | exa |
| 3 | Disable memory (overlap with knowledge-graph) | LOW | memory |
| 4 | Agent-scope bitwarden → main only | MEDIUM | bitwarden |
| 5 | Agent-scope playwright → main only | MEDIUM | playwright |
| 6 | Agent-scope github → main, researcher | MEDIUM | github |
| 7 | Agent-scope adobe tools → adobe-platform-engineer | LOW | react-spectrum, spectrum-data, adobe-express |
| 8 | Mission-scope aios-gmail, slack, aios-working-memory | MEDIUM | aios-gmail, slack, aios-working-memory |
| 9 | Mission-scope figma, illustrator | LOW | figma, illustrator |

---

## 7. Evidence Classification

| Claim | Classification |
|-------|---------------|
| 19 MCP servers configured | OBSERVED |
| 17 MCP servers exposed globally | OBSERVED |
| 234 total tools exposed | OBSERVED |
| puppeteer full overlap with playwright | OBSERVED (tool lists) |
| memory overlap with knowledge-graph | OBSERVED (tool lists) |
| exa API key empty | OBSERVED (opencode.jsonc:380) |
| github token empty | OBSERVED (opencode.jsonc:308) |
| bitwarden 59 tools = highest context cost | OBSERVED |
| serena 29 tools = second highest | OBSERVED |
| playwright 27 tools = third highest | OBSERVED |
| yaml-ls not in MCP config | UNKNOWN |
| figma not connected (OAuth pending) | OBSERVED |
| illustrator not connected (Illustrator not running) | OBSERVED |
| No per-agent scoping exists | OBSERVED |
| Target ~40 tools for typical session | PROPOSED |

---

`STOP — MCP REDUCTION PLAN COMPLETE`
