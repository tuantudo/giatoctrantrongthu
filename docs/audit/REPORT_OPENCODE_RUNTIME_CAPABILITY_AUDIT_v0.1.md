# REPORT — OPENCODE RUNTIME CAPABILITY AUDIT v0.1 (RAPID)

*2026-10-05. Chỉ đọc/research, không cài đặt, không sửa config, không security audit lại. Nguồn: docs/P0, source local, awesome-opencode, agentskills.io, Gemini/Claude/OpenClaw docs.*

## 1. ĐÃ CÓ (trong OpenCode hiện tại, OBSERVED)

| Capability | Trạng thái project |
|---|---|
| Agents (primary/subagent, md+frontmatter) | 9 project agents + 5 global subagents |
| Skills (SKILL.md, on-demand) | 8 project skills |
| Commands | 7 global commands; project chưa có |
| MCP | ~25 servers: serena, git, github, playwright, puppeteer, exa, context7, gmail, slack, bitwarden, memory, kg, sequential-thinking, adobe/spectrum... |
| Plugins | aios-policy-bridge, compaction-context, custom-tools, notification |
| Hooks (tool.execute.before, session, permission events) | Dùng qua plugin; permission.ask dead hook (đã biết) |
| Permissions | Project policy v0.1 loaded; deny verified |
| Model routing | Provider config + per-agent model + ollama backup |
| Sessions/persistence/resume | sqlite + storage |
| Compaction | On |
| LSP | `"lsp": true` |
| TUI/Desktop/IDE/SDK | Cả 4 |
| Filesystem/bash/web tools | Native |
| Config hierarchy (default→global→project→agent) | Đang dùng 2 tầng |

## 2. THIẾU (gap so với workload AIOS)

| Gap | Ảnh hưởng AIOS workload | Nguồn lấp |
|---|---|---|
| MCP tool-level permission keys | serena shell, git mutation không gateable qua config | Plugin tool.execute.before deny / gỡ tool |
| Interpreter flag boundary (`node -e`, `python3 -c`) | indirect file read | Deny pattern + secrets ngoài workspace |
| Durable multi-agent scheduler / mission engine | dispatch lâu dài, handoff formal | OpenClaw/DSH layer hoặc workflow plugin |
| Model fallback chain / cost budget | reliability, chi phí | Provider config + LiteLLM auto-detect plugin |
| Canonical executive memory schema | working memory rời rạc | aios-working-memory formalize |
| Event bus / structured audit stream | AIOS reconciliation thiếu dữ liệu | Plugin output JSON → AIOS |
| Role-scoped MCP profiles | token overhead, nhầm quyền | config variants per mission |
| Shared skills phân phối chuẩn | skills project-bound | `~/.agents/skills` |
| Prompt/context versioning cho agents | drift giữa các session | OpenSpec-style spec docs |
| Browser QA assertions chuẩn | visual/QA không repeatable | Playwright MCP + qa skill |

## 3. NÊN TÍCH HỢP (integration candidates)

| Capability | Lý do | Độ ưu tiên |
|---|---|---|
| aios-policy-bridge → DENY-enforcing + audit JSON | có sẵn, chưa enforce ASK | P0 |
| `.agents/skills` shared layer | portability chuẩn chung | P0 |
| OpenClaw/DSH dispatch cho OpenCode | durable multi-agent | P1 |
| OpenSpec plugin | planning discipline | P1 |
| LiteLLM auto-detect plugin | model routing linh hoạt | P2 |
| aios-working-memory formalize | executive memory | P1 |
| exa/context7/playwright MCP profiles | research/QA surface | P0 (đã có — giữ) |
| Serena MCP | code intelligence | P0 (đã có) |

## 4. KHÔNG CẦN

| Candidate | Lý do |
|---|---|
| Oh-my-openagent / persona collections nguyên con | override roster, phá authority AIOS |
| Auto-approve/yolo | phá human gate |
| Memory MCP third-party lạ | giữ wm/kg nội bộ |
| TTS/visualizer/quote plugins | ngoài mission |
| Ontology tooling riêng trong OpenCode | thuộc AGY |
| Deploy automation plugin | thuộc Infra/Human gate |

## 5. Đối chiếu workload AIOS

| Workload | OpenCode fit | Ghi chú |
|---|---|---|
| Forensic research | ✅ PRIMARY | exa + git tracing + playwright |
| Source tracing | ✅ PRIMARY | git + grep + serena |
| Ontology audit | ⚠ SECONDARY | agent có, final authority AGY |
| Architecture audit | ✅ PRIMARY (tech) | ERD/RFC từ data |
| Governance audit | ⚠ SECONDARY | skill + policy bridge advisory |
| Source brief | ✅ PRIMARY | skill có sẵn |
| Coding | ✅ PRIMARY | core strength |
| QA | ✅ PRIMARY | qa agent + node --check + playwright |
| Browser/UI | ✅ PRIMARY | playwright/puppeteer MCP |
| Web research | ✅ PRIMARY | exa/context7/websearch |
| Multi-agent | ⚠ SECONDARY | subagents OK, thiếu durable scheduler |

## 6. Ecosystem snapshot (không cài)

- awesome-opencode: plugins (hooks Claude-style, Gemini auth, OpenRAG, OpenSpec, LiteLLM autodetect), clients (CodeWalk), agent collections.
- Skills chuẩn: agentskills.io; OpenCode đọc `.opencode/.claude/.agents/skills`.
- Agent collections: hiai-opencode (12 agents), opencode-agent-for-cowork.
- Orchestration: Micode, OpenCode Workspace/Worktree, Workaholic.
- OpenClaw/Hermes: delegate OpenCode/Codex/Claude như background workers (pattern tham khảo cho DSH).
- MCP registry: dùng chung registry.modelcontextprotocol.io; không có OpenCode-specific registry chính thức [UNVERIFIED].

---

## 7. KẾT LUẬN BẮT BUỘC

**PRIMARY ROLE**
Tech Lead / Systems Engineer / Forensic Research / Coding / QA / Documentation.

**SECONDARY ROLES**
Governance auditing, Ontology reviewing, Multi-agent coordination (cần supervisor ngoài), Infrastructure verification.

**TOP 10 CAPABILITIES TO ADD**
1. MCP tool-level deny/ask (qua plugin hook hoặc config key mới)
2. Interpreter flag deny (`node -e`, `python3 -c`)
3. Durable mission/scheduler layer (OpenClaw/DSH)
4. Model fallback chain + cost budget
5. Canonical executive memory schema (aios-working-memory)
6. Structured audit event stream → AIOS
7. Role-scoped MCP profiles per mission
8. Shared `.agents/skills` distribution
9. Agent prompt/context versioning (OpenSpec-style)
10. Repeatable browser QA assertion pack

**TOP 10 COMMUNITY INTEGRATIONS TO EVALUATE**
1. OpenSpec plugin
2. LiteLLM auto-detect
3. OpenRAG (local RAG)
4. Gitingest plugin
5. Openskills (skills manager)
6. CodeWalk Flutter client
7. Micode workflow
8. OpenClaw dispatcher
9. OpenHax Codex auth bridge
10. OpenCode Workspace (multi-agent)

**PORTABLE CAPABILITIES**
SKILL.md, MCP servers, agent md+frontmatter, commands md, model provider config, session concepts.

**AIOS-OWNED CAPABILITIES**
Core Meaning/MẠCH ontology, DATA_CONTRACT, genealogy data, mission registry, AIOS Policy Core, handoff protocol + Human Gate semantics, secrets boundary ngoài OpenCode permission.
