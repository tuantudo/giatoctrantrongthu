# REPORT — AIOS RUNTIME ↔ PROJECT AGENT OS RECON v0.1

*2026-10-05. Forensic recon, KHÔNG sửa/migrate/duplicate. Hai nơi khảo sát: `/Users/tuantq/Workspace/02_AIOS` và `/Users/tuantq/Projects/Personal/giatoctrantrongthu`.*

---

## A. AIOS hiện có Runtime Management gì? [FACT/EVIDENCE]

| Thành phần | Evidence |
|---|---|
| `Registry/RUNTIME_REGISTRY.yaml` — danh sách runtime (RID-OPENCODE, RID-AGY, RID-DSH, RID-HERMES, OpenClaw…), status, version, binary, config_path | OBSERVED, local |
| `AIOS_RUNTIME_CAPABILITY_MATRIX.md` v0.1 — ma trận capability × runtime (NATIVE/SUPPORTED/REMOVED/UNVERIFIED) | OBSERVED |
| `AIOS_CAPABILITY_REGISTRY.md` v0.1 — capability thuộc AIOS, runtime chỉ là provider | OBSERVED |
| `Architecture/AIOS_RUNTIME_ADAPTER_CONTRACT_v0.1.md` — chuẩn hóa AuthorizationRequest giữa runtime adapter ↔ policy core | OBSERVED (draft) |
| Governance launchers: `aios opencode`, `aios dsh`, `aios hermes` (AGENTS.md) | OBSERVED trong docs; [NOT VERIFIED] runtime thật |
| `aios-policy.yaml` + `authorize_canonical` — policy core advisory/enforcement qua bridge | OBSERVED |

→ AIOS quản lý runtime ở tầng: **inventory, capability profile, provider, verification status, launcher, policy adapter contract**.

## B. Source of Truth nằm ở đâu?

- [FACT] Registry/RUNTIME_REGISTRY.yaml tự khai authority là `Boot/AIOS_BOOT.md` + `06_AIOS_COMPONENTS.md`.
- [FACT] `00_AIOS_SOURCE_OF_TRUTH.md` đặt AIOS ở đỉnh hierarchy; project AGENTS.md trích dẫn ngược.
- [INFERENCE] Runtime management SoT = AIOS registry; **role assignment & project config SoT = project** (project AGENTS.md, `.opencode/agents/`, `.aios/PROJECT_CONTRACT.json`).
- [NOT VERIFIED] Không có document nào định nghĩa rõ "project config override global runtime config đến đâu" → ranh giới load-bearing chưa canonical.

## C. Project Agent OS quản lý gì?

[FACT] trong repo giatoctrantrongthu:
- `docs/AGENT_OS.md` (role/governance), `.opencode/agents/*.md` ×9 (forensic, ontology, architecture, governance, source-brief, implementer, qa, data-review, visual-review), `.opencode/skills/*` ×8, `opencode.jsonc` (permission policy v0.1, load verified), per-agent `model` tiering (FAST/STRONG).
- MCP/project skills thuộc project boundary.
- → Project quản lý: **role assignment, agent/skill roster, permissions, model tiering, workflow, governance của project**.

## D. Hai tầng có overlap không?

[FACT] Có overlap structal ở: runtime inventory (AIOS đăng ký RID-OPENCODE, project cũng chạy OpenCode), model providers (AIOS matrix khai NVIDIA NIM/Ollama; project khai ollama/gemini), capability claims (AIOS registry vs project skills), verification status (AIOS matrix UNVERIFIED ô nhiều; project đã verify deny rules).

## E. Overlap là cùng dữ liệu hay khác semantics?

[INFERENCE] Khác semantics:
- AIOS matrix = **khả năng của runtime nói chung** (native/supported/removed), evidence-labeled, versioned.
- Project config = **cách runtime được cấu hình cho workload cụ thể** (role, model tier, permission pattern).
- [EVIDENCE] Dùng chung danh từ ("capability", "model providers", "policy bridge") nhưng giá trị khác nhau: AIOS nói OpenCode mcp=NATIVE; project nói MCP nào enabled cho session này. → **CÙNG KHÁI NIỆM, KHÁC TRỤC** (capability × instantiation).

## F. Inheritance/reference model hiện hữu không?

[FACT] Có một phần:
- AIOS launcher `aios opencode` → inject AGENTS.md global + policy bridge (kế thừa semantics global).
- OpenCode config merge default→global→project (project override global ở key trùng).
- Project AGENTS.md trích AIOS authority chain; project `.aios/PROJECT_CONTRACT.json` khai báo Human Gate.
[INFERENCE] Đây là pattern **global profile → project instantiation → runtime execution**, nhưng:
- Chưa có "Runtime Profile" object trong AIOS mà project reference tới (project không nói "tôi dùng profile X").
- Chưa có cơ chế project override được khai báo tường minh trong RUNTIME_REGISTRY.
→ Reference tồn tại, inheritance semantic chưa formalized.

## G. Contradiction thực tế nào không?

[NOT VERIFIED] chưa phát hiện contradiction runtime (project OpenCode config không chống lại launcher AIOS; cả hai đều trỏ cùng `~/.config/opencode/opencode.jsonc`).
[RISK tiềm ẩn] (INFERENCE):
- Nếu AIOS đổi launcher/policy core mà project pin version/behavior → drift.
- Nếu project tắt MCP/permission mà AIOS matrix claim "NATIVE verified" → capability claim sai lệch (matrix đã dùng UNVERIFIED cho nhiều ô, giảm rủi ro).
- Nếu hai nơi cùng chỉnh `opencode.jsonc` global → mâu thuẫn trách nhiệm ghi.

## H. Kiến trúc đề xuất (cùng tồn tại)

```
AIOS  → Runtime Profile / Capability (WHAT a runtime CAN do, evidence-labeled)
PROJECT → Runtime Role / Configuration (WHAT a project REQUIRES from a runtime)
RUNTIME → executes under merged config + policy bridge
```

1. AIOS sở hữu: RUNTIME_REGISTRY, capability matrix, policy core, launcher, verification status — **không** sở hữu role assignment.
2. Project sở hữu: agents/skills/MCP/permission patterns/model tiering/workflow — **không** sở hữu inventory runtime.
3. Project khai báo reference tới runtime profile bằng `runtime_id` (RID-…), không copy capability claims.
4. AIOS matrix ô capability = UNVERIFIED trừ khi project hoặc benchmark cung cấp evidence local → single direction of truth cho "verified".
5. Mỗi thay đổi config global có owner rõ: AIOS sửa global defaults; project sửa project override; governance sửa policy core.
6. Phát hiện drift bằng audit định kỳ (matrix vs `opencode.jsonc` hash vs RUNTIME_REGISTRY version).

## Đánh giá mô hình đề xuất của Human

Mô hình `AIOS → Runtime Profile/Capability`, `PROJECT → Runtime Role/Configuration`, `RUNTIME executes`:
- [INFERENCE] **PHÙ HỢP** với evidence hiện tại: registry + matrix (global) và project config (local) đã tồn tại đúng 2 slot đó; launcher + policy bridge là đường kế thừa thực tế.
- [EVIDENCE phản bác từng phần] Chưa có artifact "project → runtime profile reference" nên quan hệ hiện tại chỉ là implicit, chưa phải contract. Cần Human quyết định có formalize thành `runtime_id` field trong `PROJECT_CONTRACT.json` hay không.

## Kết luận

- KHÔNG mâu thuẫn cấu trúc; overlap hiện tại là cùng khái niệm khác trục (capability vs instantiation).
- Mâu thuẫn tiềm ẩn duy nhất: trách nhiệm ghi `~/.config/opencode/opencode.jsonc` (global) và claim capability chưa được attribution rõ.
- Không cần migrate/duplicate; cần formalize 1 field reference + 1 audit drift.
