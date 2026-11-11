# DSH AIOS REGISTRATION & ONBOARDING

**Mission:** DSH AIOS REGISTRATION & ONBOARDING FOUNDATION
**Agent:** AGY (AIOS Architecture / Governance)
**Status:** DSH = AIOS REGISTERED / TRAINEE (Not Project-Ready)

---

## 1. DSH IDENTITY & INSTALLATION EVIDENCE
- **Identity:** DeepSeek Harness (DSH)
- **Version:** `0.1.1-rc.2` [VERIFIED]
- **Installation Path:** `/opt/homebrew/bin/dsh` [VERIFIED]
- **Configuration Path:** `~/.dsh/` (chứa profiles, sessions, storages, settings.yaml) [VERIFIED]

## 2. RUNTIME CAPABILITY AUDIT
Dựa trên kết quả chạy lệnh `dsh --dump-default-config` và kiểm tra file hệ thống:

- **Runtime Model:** Profile-based orchestration (web, headless, tui) sử dụng Cordis plugin system. [VERIFIED]
- **Provider/Model Support:** NVIDIA NIM (Nemotron 3), Ollama (Gemma 4, Qwen3). [VERIFIED]
- **Agent/Subagent Mechanism:** Hỗ trợ mạnh mẽ qua các plugin `subagent-spawn-in-process`, `subagent-fork-in-process`, `tool-subagent`. [VERIFIED]
- **Workflow / Parallel Execution:** Có plugin `workflow-worker-thread`, `tool-workflow`, hỗ trợ Fan-out. [VERIFIED]
- **Pipeline / Background Execution:** Hỗ trợ background mode (`continuable`, `one-shot`). [VERIFIED]
- **Tool System:** Rất phong phú (`tool-bash`, `tool-fs`, `tool-str-replace-editor`, `tool-todo`, `tool-goal`, `tool-ralph`). [VERIFIED]
- **Plugin System:** Dựa trên kiến trúc `Cordis` package bundles. [VERIFIED]
- **MCP Support:** [UNKNOWN] (Không tìm thấy plugin MCP native trong bản dump mặc định).
- **Permission / Sandbox:** Có hệ thống phân quyền rõ ràng (`read-only`, `workspace-write`, `danger-full-access`) và User Approval policy. [VERIFIED]
- **Session / State Persistence:** Hỗ trợ qua `session-checkpoint-policy`, `spill-local`, `tool-result-pruner`. [VERIFIED]
- **Skill Mechanism:** Có plugin `@deepseek-ai/dsh-skill` và `tool-skill`. [VERIFIED]
- **Hooks / Adapters:** Cordis patching system (dsh-profile.yml, cordis.patch.yml). [VERIFIED]
- **Failure / Interruption Handling:** Có `timeout-policy` và `approval` gate. [INFERRED]
- **Khả năng phối hợp với AGY/OpenCode/Cline:** [INFERRED] (Có subagent framework, nhưng cần adapter để wrap AGY/OpenCode thành DSH tool).

## 3. AIOS REGISTRATION & CLASSIFICATION
DSH chính thức được nhận diện trong AIOS:
- **AIOS Registration:** Đã cập nhật vào `.aios/PROJECT_CONTRACT.json` (Layer: Runtimes).
- **Runtime Classification:** Orchestration Runtime / Execution Coordination Layer.
- **Execution Surface:** CLI / Headless Subprocess / Background Worker.
- **Role:** Trainee Orchestrator (Dự bị).
- **Permission Boundary:** `workspace-write` (bị giới hạn, không có quyền `danger-full-access` trên production).

## 4. DSH ONBOARDING PACKAGE
Để DSH hiểu và tuân thủ luật của AIOS/Giatoc, cần cung cấp cho DSH các instruction sau (qua profile `agent-instructions`):
- **Core Constraints:** DSH là execution resource, không phải Final Authority.
- **Handoff:** Mọi kết luận mang tính kiến trúc phải trình lên ChatGPT Orchestrator.
- **Scope Discipline:** Chỉ thực thi parallel workflow hoặc bash tools trong giới hạn task được giao. Không vượt rào.

## 5. SKILLS BINDINGS (CORE REQUIRED)
DSH cần được trang bị các skill quản lý workflow thay vì skill code trực tiếp:
- `workflow-execution`
- `mission-decomposition`
- `subagent-coordination`
- `evidence-collection`
- `aios-governance-compliance`
*(Không cấp skill thay đổi production hay DB migration cho DSH orchestration role).*

## 6. PLUGINS / INTEGRATIONS CLASSIFICATION
- **CORE REQUIRED:** `fs-sandbox`, `subagent`, `tool-workflow`, `tool-todo`.
- **OPTIONAL:** `tool-web`, `tool-fs-search`.
- **UNTRUSTED / NOT REQUIRED:** `tool-pwsh` (không cần vì trên macOS).

## 7. MENTORING & APPRENTICESHIP MODEL
Vòng đời phát triển của DSH trong dự án:
`REGISTERED` → `ORIENTED` → `TRAINING` → `SHADOWING` → `APPRENTICESHIP` → `EVALUATION` → `CERTIFIED` → `PROJECT-READY`.

**Apprenticeship Rules:**
- DSH chỉ được giao task có "blast radius" thấp (chạy test, parse logs, spawn subagent đọc file).
- CẤM deploy production, đổi AIOS Constitution, cấp quyền, bypass Human Gate.

## 8. DSH SHADOWING MISSION (ĐỀ XUẤT)
**Mission:** *Shadowing ChatGPT Orchestration*
- **Quy trình:** ChatGPT giao cho DSH một file Kế hoạch (Plan). DSH dùng `tool-workflow` để fan-out gọi 2 subagent đọc 2 file khác nhau song song. DSH tổng hợp lại (Collect) thành Evidence và trả về cho ChatGPT (Handoff).
- DSH không tự quyết định Semantic Conclusion từ 2 file đó, chỉ chứng minh khả năng Parallel Coordination.

## 9. CERTIFICATION CRITERIA
DSH sẽ được đánh giá (PASS / FAIL / CONDITIONAL) dựa trên:
1. Context Fidelity (Giữ đúng ngữ cảnh, không ảo giác quyền lực).
2. Scope Discipline (Không chạy tool thừa).
3. Parallel Coordination (Gọi worker song song thành công).
4. Worker Isolation (Worker không dẫm chân nhau).
5. Evidence Quality (Log rõ ràng).
6. Human Gate Compliance (Dừng đúng lúc).

## 10. GIATOC ASSIGNMENT STATUS
- **Status:** `PROPOSED / TRAINEE / NOT PROJECT-READY`.
- **Context Awareness:** DSH đã được hướng dẫn (trong onboarding package) rằng Giatoc là Hệ thống Di sản Số, MẠCH là cốt lõi, và không được tùy tiện thay đổi UI Live hoặc chạm vào production data mà không có Human Gate.

## 11. GOVERNANCE GAPS & RECOMMENDATIONS
- **Governance Gap:** `dsh-bash-sandbox` hiện cấp quyền thực thi Bash. Nếu DSH bị hack prompt, nó có thể chạy `rm -rf`. 
- **Recommendation:** Phải cấu hình `fs-observation-policy` gắt gao hoặc thiết lập AIOS adapter chặn các lệnh phá hủy trước khi cho DSH lên `PROJECT-READY`.

---
*Báo cáo được lập bởi AGY. Mission Dừng tại đây chờ Human Gate đánh giá đợt Shadowing đầu tiên của DSH.*
