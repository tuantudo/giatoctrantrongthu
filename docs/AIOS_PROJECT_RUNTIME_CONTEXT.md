# AIOS ↔ PROJECT RUNTIME CONTEXT — 2026-10-05

*Nguồn: Human instruction. Ghi nhận working knowledge cho session này và các session sau.*

## Mô hình hai tầng (KHÔNG coi là duplicate)

```
AIOS (/Users/tuantq/Workspace/02_AIOS)
  ↓ global runtime/capability knowledge
PROJECT AGENT OS (giatoctrantrongthu)
  ↓ project-specific role/capability assignment
RUNTIME
  ↓ execution
```

- **AIOS trả lời:** "Runtime này CÓ THỂ làm gì?" — governance, runtime registry/profiles, shared capability knowledge, common protocols, provider ecosystem.
- **Project trả lời:** "Trong project này runtime được GIAO làm gì?" — agents, roles, skills, MCP, permissions, workflow, model tiering.
- **Runtime trả lời:** "Làm việc đó bằng capability nào?"

## Quy tắc

- KHÔNG merge hai tầng máy móc.
- KHÔNG xoá project-specific definitions.
- KHÔNG ép project giống global.
- KHÔNG tạo AIOS Capability Registry mới trong project.
- KHÔNG tạo Runtime Registry mới trong project nếu global AIOS đã có.
- Project-specific definitions được phép mở rộng global capability.

## Trạng thái hiện tại của project (OBSERVED 2026-10-05)

- Agents: forensic-researcher, ontology-auditor, architecture-auditor, governance-auditor, source-brief-builder, implementer, qa, data-reviewer, visual-reviewer.
- Skills: mach-forensic-audit, source-trace, ontology-audit, ia-sitemap-audit, governance-audit, source-brief.
- Đây là PROJECT IMPLEMENTATION, không phải global AIOS registry.
- Audit liên quan: `docs/audit/REPORT_AIOS_RUNTIME_PROJECT_RECON_v0.1.md`.
