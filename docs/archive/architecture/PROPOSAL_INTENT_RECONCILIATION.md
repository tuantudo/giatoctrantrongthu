# PROPOSAL: HUMAN INTENT → STATE RECONCILIATION → PROJECT EVOLUTION

**Status:** CANONICAL (Project-Local Governance Mechanism - Approved by Owner)
**Context:** Cơ chế xử lý độ trễ giữa Nhận thức (Cognitive State) và Trạng thái dự án (Project State) nhằm đảm bảo hệ thống tiến hóa theo đúng ý định mà không rơi vào Project Drift.

---

## 1. CORE INSIGHT & PRINCIPLE
- **Cognitive State ≠ Project State:** Sự tiến hóa nhận thức của Owner nhanh hơn thực thi là bình thường. Không được đồng nhất suy nghĩ với trạng thái dự án.
- **Human Gate (Chốt chặn con người):** Agent có quyền *thu thập, cấu trúc, phát hiện độ lệch, phân tích tác động, báo cáo và đề xuất*. Agent **tuyệt đối không có quyền**: *canonicalize ý định, định nghĩa lại Core, đóng task quản trị, sửa kiến trúc gốc, hoặc tự ý code* khi chưa có Governance Quyết định từ Owner.
- Cầu toàn là một quá trình, không phải một trạng thái hoàn hảo ngay lập tức. Prototype chỉ là phương tiện, không phải đích đến.

## 2. PHÂN LẬP 4 TẦNG: INTENT ≠ DECISION ≠ STATE ≠ EVIDENCE
Agent cấm suy luận `Intent = State` hoặc `Decision = Implementation completed`. Phải duy trì chuỗi:
1. **HUMAN INTENT:** Điều Owner muốn, nhận ra, ưu tiên. (VD: "Giatoc không thể mãi là placeholder.")
2. **DECISION:** Quyết định chính thức hệ thống sẽ làm gì. (VD: "V1 phải được đấu nối real data và đưa vào trạng thái live.")
3. **PROJECT STATE:** Trạng thái thực sự hiện tại của hệ thống. (VD: "Frontend hiện đang gọi API thật X, database Y.")
4. **EVIDENCE:** Bằng chứng chứng minh State. (VD: HTTP response, DB verification, commit hash, runtime screenshot).

## 3. INTENT LIFECYCLE (VÒNG ĐỜI Ý ĐỊNH)
Một ý định được Owner chấp nhận chưa đủ để trở thành Canonical Architecture. Nó phải qua vòng đời:
`[REFLECTION]` → `[STRUCTURED_INTENT]` → `[OWNER_ACCEPTED]` → `[RECONCILIATION_REQUIRED]` → `[RECONCILIATION_REVIEWED]` → `[CANONICAL_DECISION]` → `[STATE_TRANSITION]`

## 4. RECONCILIATION ĐỨNG TRƯỚC IMPLEMENTATION
**Workflow bắt buộc:**
`Intent` → `Impact Analysis` → `Reconciliation Report` → `Owner Review` → `Decision` → `State Transition` → `Task Transition` → `Implementation`
*Cấm Agent tự động bỏ qua Reconciliation để lao vào Code.*

## 5. CONTEXT BOOTSTRAP (PROJECTION)
Không tạo ra "Siêu file" lưu trữ toàn bộ sự thật. Thay vào đó, sử dụng khái niệm **Current Context Projection / Bootstrap Manifest**:
- Nó chỉ là bản chiếu (Projection) tổng hợp trạng thái tại một thời điểm để Agent bootstrap.
- Không phải Canonical Database.
- Phải rõ: Canonical source thật sự nằm đâu, Projection tạo khi nào, phát hiện stale ra sao. Agent cấm dùng Projection Stale làm Authority.

## 6. QUẢN LÝ ĐỘ LỆCH (DRIFT MANAGEMENT)
### Task Reconciliation
Không mặc định Intent mới = Task cũ vô giá trị. Phân loại Task:
- `VALID`: Vẫn đúng hướng.
- `STALE`: Bị tụt hậu, cần update context.
- `CONFLICTING`: Ngược với Intent mới.
- `OBSOLETE_CANDIDATE`: Đề xuất loại bỏ (Chưa phải Obsolete, chờ Owner chốt).
- `DEFERRED`: Dời lại version sau.
- `BLOCKED`: Đang kẹt.
- `DONE` / `IN_PROGRESS`: (In Progress chỉ dành cho task *thực sự* đang chạy).

### Document Drift Detection (Sổ cái độ lệch - DRIFT_LEDGER)
Khi có Intent mới, Agent tạo **Reconciliation Report** chỉ rõ trạng thái tài liệu (Valid, Stale, Conflicting, Missing) kèm Recommended action.
*Cấm tự động rewrite (sửa đổi hàng loạt) các tài liệu canonical.*

## 7. KIẾN TRÚC LÕI & VỎ (CORE VS EVOLVABLE)
- **STABLE / PROTECTED (Core):** Meaning, foundational principles, authorial intent, constitutional constraints.
- **EVOLVABLE (Vỏ):** UI, UX, IA implementation, API, DB schema, framework, runtime, workflow, release structure.
*Lưu ý: Một layer không mặc nhiên stable chỉ vì hiện tại gọi nó là Core. Boundary có thể thay đổi nhưng phải qua Governance.*

## 8. VERSION & RELEASE MODEL
- **VERSION:** Trạng thái của Product/System.
- **RELEASE:** Một lần đưa Version/Capability ra ngoài.
- **LIVE:** Trạng thái Operational thực tế.
- **V1 Closure:** Bắt buộc không phải là "Hoàn thành vĩnh viễn" hay "Hoàn hảo". Nó là việc đóng một vòng phát triển đủ nhất quán để sản phẩm bước vào đời sống thật. 

## 9. PROVENANCE (TRUY XUẤT NGUỒN GỐC)
Mỗi sự chuyển giao trạng thái phải được gắn Metadata (Machine-readable):
- `intent_id`, `decision_id` (nếu có), `project_id`
- `source`, `timestamp`, `owner_confirmation`
- `affected_layer`, `status`
- `supersedes`, `superseded_by`
- `linked_reconciliation`, `linked_tasks`, `linked_state_transition`, `evidence_refs`
*(Phân biệt rõ: Source vs Interpretation vs Decision vs Evidence. Chat transcript không phải Canonical Database).*

## 10. AIOS IMPLICATION ASSESSMENT
Vấn đề Intent Reconciliation có phải là AIOS Primitive không? Đánh giá theo 2 tầng:
1. **PROJECT-LOCAL MECHANISM:** Triển khai trước tại Giatoc làm Pilot để chứng minh tính hiệu quả.
2. **POTENTIAL AIOS PRIMITIVE (GLOBAL CANDIDATE):** Chỉ đề xuất làm Global Primitive nếu chứng minh được: Vấn đề xuất hiện ở multi-project; Ontology, Lifecycle, Provenance, và Protocol có thể tổng quát hóa. Không nhồi nhét Giatoc-specific semantics vào AIOS Core.
*Kết luận hiện tại: REQUIRES FURTHER VALIDATION.*
