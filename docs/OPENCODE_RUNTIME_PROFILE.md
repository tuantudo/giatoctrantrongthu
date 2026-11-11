# OPENCODE RUNTIME PROFILE

*Version: 2026-10-05 | Dựa trên REPORT_OPENCODE_RUNTIME_CAPABILITY_AUDIT_v0.1 và security reports v0.1/v0.2.*

## 1. Identity

OpenCode là **AI coding agent runtime** open-source (TUI + Desktop + SDK), primary role trong AIOS: **Tech Lead / Systems Engineer / Forensic Research / QA**.

## 2. What it provides (CURRENT)

- Agents: primary + subagents, markdown+frontmatter, per-agent model/tools/permission.
- Skills: SKILL.md on-demand, chuẩn Agent Skills (portable với Claude/Gemini/OpenClaw/Hermes).
- Commands: slash-command markdown templates.
- MCP: ~25 servers configured (code, browser, research, VCS, comms, design, vault, memory).
- Plugins: 4 (policy bridge, compaction context, custom tools, notification) + 2 TUI plugins.
- Sessions: persisted sqlite, resume được, compaction tự động.
- LSP: bật.
- Permission: native allow/ask/deny cho bash/edit/webfetch/external_directory; project policy v0.1 loaded.
- Model routing: provider config + per-agent model; local ollama backup đã khai báo.
- SDK: @opencode-ai/sdk, headless server mode.

## 3. What it lacks (MISSING — cần Human quyết định)

- ASK gate observable trong headless/auto-approve session.
- Permission keys cho MCP tools.
- Deny cho interpreter flags (`node -e`, `python3 -c`).
- Durable multi-agent scheduler / mission workflow engine.
- Model fallback chain config.
- Event bus chuẩn xuất ra AIOS.
- Canonical executive memory schema.

## 4. Where it fits in AIOS

```
Human (final authority)
 AIOS Constitution / Policy Core
  Mission Control (ChatGPT/Orchestrator)
   ├── AGY  → meaning/ontology/IA (không code DB)
   ├── OpenCode → code/research/QA/infra-verification (THIS RUNTIME)
   ├── Cline → UI/UX/frontend/browser QA
   └── DSH/OpenClaw → dispatch/supervision runtime
```

OpenCode KHÔNG thay AGY, KHÔNG định nghĩa lại Core, KHÔNG deploy production.

## 5. Portability commitments

- Shared skills → `~/.agents/skills/` (planned, Human decision).
- MCP servers → runtime-agnostic, reuse qua Claude Code/Gemini CLI/Cline/OpenClaw.
- Agent personas → giữ trong project repo, sync semantics qua AGENTS.md.

## 6. Security posture (link)

- Native permission = enforcement boundary cho bash/edit (deny verified, ask advisory trong auto-approve session).
- Secrets phải nằm ngoài workspace & ngoài agent-readable path (xem REPORT_OPENCODE_SECURITY_v0.2 §11).
- MCP arbitrary-exec tools (serena.execute_shell_command) chưa có permission rule — Human decision: deny/gate/remove.

## 7. Operating invariants

1. Pilot: project-local, không auto-approve globally.
2. Mọi ASK/DENY boundary phải verified bằng matrix sau mỗi config change.
3. Không rely vào permission.ask plugin hook (dead hook — documented).
4. Không rely vào MCP tools để enforce security; dùng plugin tool.execute.before throw + native deny.
5. Handoff protocol 10 mục bắt buộc khi kết task.
