# FLEET INVENTORY - GIATOC PROJECT

> **Cập nhật:** 2026-10-05 13:19 GMT+7
> **Host:** TUAN-PRO (macOS 27.0.1 arm64)
> **Orchestrator:** OpenClaw Gateway 2026.9.8
> <!-- project: github.com/tuantudo/giatoctrantrongthu -->

---

## FLEET STATUS SUMMARY

| Metric | Count |
|--------|-------|
| **Total Entries** | 10 |
| **READY** | 8 |
| **STANDBY** | 1 (Cline VS Code) |
| **UNKNOWN** | 1 (Microsoft Copilot GUI) |
| **BLOCKED** | 0 |
| **RETIRED** | 0 |

---

## FLEET MATRIX

| # | Agent / Runtime | Surface | Version | Trạng thái | Control Path | Authority (AGENTS.md) |
|---|----------------|---------|---------|------------|--------------|----------------------|
| 1 | **OpenClaw** | Gateway/Host | 2026.9.8 (fc23bc8) | ✅ **READY** | Native session | Orchestrator / Mission Control |
| 2 | **OpenCode** | CLI (ACP) | 1.18.15 | ✅ **READY** | `opencode` / ACP | Tech Lead / Systems Engineer |
| 3 | **Hermes** | CLI | v0.20.1 (2026.8.13) | ✅ **READY** | `hermes` | Agent Runtime |
| 4 | **DSH** | CLI | 0.1.1-rc.2 | ✅ **READY** | `dsh` | Orchestration Runtime (Trainee) |
| 5 | **Cline** | CLI | 3.0.68 | ✅ **READY** | `cline` | Experience Architect / Web UI |
| 6 | **Cline** | VS Code | Extension | ⚠️ **STANDBY** | VS Code extension | Experience Architect (IDE surface) |
| 7 | **Codex** | CLI | 0.155.1 | ✅ **READY** | `codex` | External Coding Agent |
| 8 | **AGY** | CLI | 1.2.16 | ✅ **READY** | `agy` | Heritage / Product Architect |
| 9 | **GitHub Copilot** | CLI | 1.0.91 | ✅ **READY** | `copilot -p "<prompt>"` / `gh copilot -p "<prompt>"` | Coding Assistant Worker |
| 10 | **Microsoft 365 Copilot** | GUI App | 1.2609.2301 | ❓ **UNKNOWN** | ❌ No CLI | N/A (Productivity Assistant) |

---

## GITHUB COPILOT CLI - DETAILS (ENTRY #9)

### Verification Evidence
```bash
$ which copilot
/opt/homebrew/bin/copilot

$ copilot --version
GitHub Copilot CLI 1.0.91.

$ gh copilot --version
GitHub Copilot CLI 1.0.91.

$ gh auth status
github.com
  ✓ Logged in to github.com account tuantudo (keyring)
  - Token scopes: 'admin:public_key', 'gist', 'read:org', 'repo'
```

### Capabilities
| Capability | Status | Command Example |
|------------|--------|-----------------|
| Non-interactive prompt | ✅ | `copilot -p "explain this function"` |
| Code explanation | ✅ | `copilot explain <file>` |
| Shell command suggestion | ✅ | `copilot suggest "list large files"` |
| Interactive chat | ✅ | `copilot` (REPL) |
| File editing | ✅ | `copilot edit <file>` |
| Workflow automation | ✅ | `copilot workflow` |
| Memories (persistent context) | ✅ | `copilot memories` |
| MCP server management | ✅ | `copilot mcp` |

### Control Paths
| Method | Command | Use Case |
|--------|---------|----------|
| **Direct CLI** | `copilot -p "prompt"` | Quick one-shot, scripting |
| **Via gh** | `gh copilot -p "prompt"` | When gh context needed |
| **Interactive** | `copilot` | Multi-turn conversation |
| **Explain** | `copilot explain <file>` | Code understanding |
| **Suggest** | `copilot suggest "task"` | Shell command generation |

### Authentication
- **Provider:** GitHub (via `gh auth`)
- **Account:** `tuantudo`
- **Token Scopes:** `admin:public_key`, `gist`, `read:org`, `repo`
- **Project Access:** ✅ Full repo access via `repo` scope

### Integration Notes
- **Installed via:** `brew install --cask copilot-cli` (v1.0.73 in Caskroom, binary reports 1.0.91)
- **Binary location:** `/opt/homebrew/Caskroom/copilot-cli/1.0.73/copilot`
- **Shell completions:** bash, zsh, fish installed
- **No separate auth needed** - uses existing `gh` credential
- **Ready for subagent spawn** via ACP or direct CLI invocation

---

## MICROSOFT 365 COPILOT - DETAILS (ENTRY #10)

### Status: UNKNOWN / NOT USABLE FOR AUTOMATION

| Check | Result |
|-------|--------|
| CLI executable | ❌ None found |
| `microsoft-copilot` command | ❌ Not exist |
| `ms-copilot` command | ❌ Not exist |
| GUI App | ✅ `/Applications/Microsoft 365 Copilot.app` (v1.2609.2301) |
| App CLI args | ❌ Launches GUI only, no `--help`/`-p` |
| npm packages | `@microsoft/agents-m365copilot` (SDK only) |
| Automation path | ❌ None (Electron/WebView, no CLI interface) |

> **Conclusion:** Microsoft 365 Copilot chỉ tồn tại dưới dạng GUI app. Không thể dùng làm fleet worker cho automation. Giữ entry để tracking, không assign task.

---

## READINESS CRITERIA

| Criteria | Threshold |
|----------|-----------|
| **READY** | Installed + Authenticated + Reachable + Controllable (CLI non-interactive) + Project-accessible |
| **STANDBY** | Installed + Reachable but missing auth or control path |
| **UNKNOWN** | Present but cannot verify automation capability |
| **BLOCKED** | Known blocker (auth expired, version conflict, permission denied) |
| **RETIRED** | Explicitly removed from fleet |

---

## CHANGE LOG

| Date | Change | By |
|------|--------|----|
| 2026-10-05 | Initial fleet inventory created | OpenClaw (Orchestrator) |
| 2026-10-05 | Added GitHub Copilot CLI (verified READY) | OpenClaw |
| 2026-10-05 | Documented Microsoft 365 Copilot as UNKNOWN | OpenClaw |

---

## NEXT ACTIONS

- [ ] Verify Cline VS Code extension authentication → promote to READY
- [ ] Test GitHub Copilot CLI as subagent worker on a coding task
- [ ] Consider removing Microsoft 365 Copilot entry if not needed for tracking
- [ ] Add fleet inventory sync to heartbeat/automation

---

*File này được maintain bởi Orchestrator (OpenClaw). Cập nhật khi fleet thay đổi.*