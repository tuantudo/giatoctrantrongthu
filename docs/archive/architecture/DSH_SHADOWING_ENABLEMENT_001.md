# DSH SHADOWING ENABLEMENT #001

**Mission:** DSH SHADOWING ENABLEMENT #001
**Agent:** AGY (DSH Mentor / AIOS Enablement Architect)
**Status:** DSH = READY FOR SHADOWING (Not Project-Ready, Not Certified)

---

## 1. CURRENT DSH STATE
- **Identity:** DeepSeek Harness (DSH)
- **Runtime:** Orchestration Runtime / Execution Coordination Layer
- **Execution Surface:** CLI / Headless Subprocess
- **Current State:** AIOS REGISTERED / TRAINEE (Not Project-Ready)
- **Current Restrictions:** Không quyền truy cập Production, không Final Authority, không quyền sửa Kiến trúc / Cấu hình AIOS.

## 2. REQUIRED CAPABILITY SET (MINIMUM SAFE CAPABILITY)
DSH chỉ được cấp phép một tập hợp tính năng tối thiểu để Shadowing:
- Nhận Mission Context & Assignment.
- Đọc Project State và các tài liệu liên quan (Read-Only workspace).
- Nhận Task từ ChatGPT Orchestrator.
- Spawn worker/subagent.
- Truyền context cho worker.
- Chạy worker song song (Parallel execution).
- Giữ scope của worker (Worker isolation).
- Thu thập kết quả thực thi (Execution result) và Bằng chứng (Evidence).
- Phát hiện Worker Failure / Interruption.
- Báo cáo Execution State và Handoff cho Orchestrator.
*(Không cấp quyền write production code, không tự bypass permission).*

## 3. REQUIRED SKILLS
**Đã có trong AIOS:**
- `workflow-execution`
- `evidence-collection`

**Đề xuất Bindings cho DSH (Cần khởi tạo placeholder):**
- `mission-context`: Hiểu mục tiêu và giới hạn.
- `assignment-context`: Hiểu quyền hạn của từng Agent.
- `subagent-coordination`: Điều phối Agent con.
- `parallel-execution`: Chạy đa luồng song song an toàn.
- `context-handoff`: Trả context sạch sẽ cho Orchestrator.
- `execution-reporting`: Báo cáo đúng định dạng.
- `failure-handling`: Bắt lỗi và dừng an toàn.
- `scope-discipline`: Không chạy vượt quyền.
- `human-gate-awareness`: Nhận diện biên giới cần con người.
- `aios-governance-compliance`: Tuân thủ AIOS Constitution.

## 4. INSTRUCTION / AGENTS.md REQUIREMENTS
DSH phải được nạp bộ Instruction Layer tĩnh với các quy tắc sống còn:
- **Identity:** DSH là Execution Coordination Layer, không phải Decision Maker.
- **Authority:** CẤM quyết định Final Architecture, Governance, Human Gate.
- **Operating Principle:** `Dispatch → Execute → Collect → Report`. DSH KHÔNG ĐƯỢC `Decide → Authorize → Canonicalize`.
- **Giatoc Context:**
  - Giatoc là Hệ thống Di sản Số (Digital Heritage).
  - MẠCH là cốt lõi (Core Meaning), không phải CMS thường.
  - Phân biệt rõ: Meaning ≠ Ontology ≠ Experience ≠ App ≠ Infrastructure.
  - UI hiện tại (app-v2.js) là LIVE. Cấm restore `app.js` cũ.
- **Governance:** `Global Deny > Local Allow`. Nếu gặp Human Gate, Conflict Context, hoặc Thiếu Evidence -> **STOP / ASK / REPORT**. Không suy diễn (hallucinate).

## 5. TOOL / PLUGIN / MCP REVIEW
- **REQUIRED FOR SHADOWING:** `tool-workflow`, `subagent-spawn-in-process`, `fs-sandbox` (Read-only mode priority).
- **OPTIONAL:** `tool-fs-search`, `tool-todo`.
- **UNTRUSTED / BLOCKED:** `tool-bash`, `dsh-bash-sandbox` (Rủi ro cực cao, có thể vô tình xóa file). DSH chỉ được cấp quyền gọi Bash thông qua một AIOS Adapter giới hạn, hoặc Sandbox bắt buộc ở mức an toàn nhất.
- **UNKNOWN:** MCP support (chưa verify native integration).

## 6. WORKER INTEGRATION STATUS
**[INTEGRATION GAP]**
- DSH hiện là một Runtime độc lập. Việc DSH gọi trực tiếp các AIOS Agents (AGY, OpenCode, Cline - vốn đang được ChatGPT điều khiển) chưa có native adapter.
- **Đề xuất:** Cần một CLI/MCP Adapter hoặc một "Proxy Tool" để DSH có thể trigger các Agent này, HOẶC giả lập các Agent này dưới dạng Native Subagents của DSH trong quá trình Shadowing. 
- *Hiện tại: DSH biết cần gọi ai, nhưng việc gọi chưa đảm bảo hoạt động xuyên suốt.*

## 7. GIATOC CONTEXT PACKAGE (MINIMAL)
Để DSH tham gia Shadowing, nó chỉ được nạp:
1. `AGENTS.md` (Role của AGY, OpenCode, Cline).
2. `.aios/PROJECT_CONTRACT.json` (Phân quyền).
3. `.aios/PROJECT_STATE.json` (Biết đang hướng tới V1 Closure).
4. `DSH_SHADOWING_ENABLEMENT_001.md` (Giới hạn của chính nó).

## 8. SHADOWING PROTOCOL
`CHATGPT` (Master Orchestrator) → `MISSION` → `DSH` (Execution Coordinator) → `FAN-OUT` → `[AGY / OPENCODE / CLINE]` → `COLLECT` → `EVIDENCE` → `DSH HANDOFF` → `CHATGPT` → `RECONCILIATION` → `HUMAN GATE`.
*(DSH tuyệt đối không được tự ý diễn dịch Mission sang một kiến trúc khác).*

## 9. FAILURE PROTOCOL
- **Worker Failure / Timeout:** Báo cáo ngay cho Orchestrator, không tự retry vô hạn.
- **Context Conflict / Missing Evidence:** Tạo REPORT UNKNOWN, không tự bịa data.
- **Permission Denied:** Báo cáo BLOCKED, không tự bypass.
- **Tool Failure:** Ghi log lỗi vào Evidence và Handoff.

## 10. EVIDENCE CONTRACT
Handoff Report của DSH bắt buộc có các trường (Machine-readable schema):
- `MISSION_ID`
- `ASSIGNMENT_ID`
- `WORKER_TARGETS`
- `TASK_EXECUTION_STATUS` (PASS/FAIL)
- `EVIDENCE_COLLECTED` (Logs, File diffs)
- `ERRORS`
- `UNKNOWN_STATES`
- `HANDOFF_RECOMMENDATION`

## 11. SECURITY BOUNDARY
- **Permission Cứng:** `workspace-write` + `approval: ask`.
- **Cấm ngặt:** `danger-full-access`.
- DSH không được cấp bất kỳ Production Credential, Deployment Credential, hay Unrestricted Shell nào. 
- Các thao tác thay đổi AIOS Governance đều bị chặn ở cấp file-system sandbox.

## 12. READINESS CHECKLIST (DSH SHADOWING READY)
- [x] Minimal Capability Set định nghĩa rõ ràng `[PASS]`
- [x] Instruction Layer & Context Package đóng gói thành công `[PASS]`
- [x] Shadowing & Failure Protocols thiết lập xong `[PASS]`
- [x] Security Boundaries (Workspace-write/Ask) được khóa chặt `[PASS]`
- [ ] Worker Integration (Adapter AGY/OpenCode/Cline -> DSH) `[PARTIAL/BLOCKED]`
- [ ] Tool Bash Untrusted Risk (Cần sandbox cứng hơn) `[PARTIAL]`

## 13. MISSING COMPONENTS
- **INTEGRATION GAP:** Thiếu cầu nối trực tiếp để DSH có thể Spawn AGY, OpenCode, Cline theo chuẩn AIOS. 
- **SKILL STUBS:** Các skill `parallel-execution`, `subagent-coordination` cần được tạo file `.md` vật lý cho DSH đọc.

## 14. HUMAN GATES
- Human Gate (Tuấn) cần phê duyệt việc sử dụng Adapter nào để DSH có thể nói chuyện với các ChatGPT Agents.
- Bất kỳ thay đổi quyền Bash nào cho DSH cũng cần Human duyệt.

## 15. RECOMMENDED NEXT STATE
Giữ DSH ở trạng thái **READY FOR SHADOWING**. Không cấp thêm quyền. Chờ Orchestrator (ChatGPT) giả lập một test mission nhỏ (chỉ đọc file tĩnh) để DSH thực tập Fan-out và Collect Evidence mà không đụng tới Code.
