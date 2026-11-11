# GIATOC INTENT RECONCILIATION REPORT (PILOT)

**Status:** RECONCILIATION EXECUTED (Human Gate: APPROVED)
**Target:** Kiểm thử Cơ chế Intent Reconciliation trên dự án Giatoc.

---

## 1. HUMAN INTENT MỚI NHẤT (COGNITIVE STATE)
- Website phải trở thành **Live Product** (Dữ liệu thật, API thật, DB thật).
- **V1 Closure:** Không đòi hỏi sự hoàn hảo, nhưng phải đóng một vòng nhất quán để hệ thống bắt đầu "sống".
- Prototype chỉ là phương tiện, không phải đích đến. Chống duy trì indefinitely trạng thái placeholder/demo.
- MẠCH là phần lõi (Core Meaning), không được phép bị giảm cấp thành một CMS/Editorial workflow thông thường.
- UI, Features, Tech stack không được trói buộc Core; Hệ thống phải tiến hóa qua các Versions.

## 2. CURRENT PROJECT STATE (TRẠNG THÁI HIỆN TẠI)
- **Production State:** Đang kẹt ở lỗi JS (`app.js` syntax error), dùng CSS/HTML cũ.
- **Prototype State (DESIGN-001):** Rất hoàn thiện về mặt tĩnh (HTML/CSS) trong `design-playground/`. Dùng dữ liệu snapshot/hardcoded. Chưa đấu nối backend thật.
- **Data/API State:** API chưa được kết nối hoàn chỉnh vào luồng Public mới. Prototype dùng Fake/Snapshot Data thay vì Fetch từ Live API.
- **Architecture State:** Đã có tài liệu 2026 Workflow, phân lập Roles tốt, nhưng luồng Release (V1 Closure) chưa được kích hoạt.
- **Task State:** Tập trung làm đẹp Prototype (Design/IA tuning).
- **Document State:** Các tài liệu tập trung mô tả trạng thái tĩnh của Prototype, thiếu Context về "Live Data Integration" cho giai đoạn sát V1.

## 3. PHÂN TÍCH ĐỘ LỆCH (DRIFT ANALYSIS)
- **Intent vs Project State:** Intent muốn "Live Product" & "V1 Closure". Project State đang sa đà vào hoàn thiện Prototype (Design-001). **[DRIFT DETECTED]**
- **Intent vs Tasks:** Task hiện tại đang tối ưu hóa Prototype thay vì chuẩn bị kiến trúc Backend/API cho Production Live. **[DRIFT DETECTED]**
- **Intent vs Architecture:** Architecture định nghĩa MẠCH là "Core", nhưng các implementation guide hiện tại thiên về xử lý nó như Editorial Content (CMS). **[DRIFT DETECTED]**
- **Intent vs Documents:** Các tài liệu Design Brief chưa phản ánh mạnh mẽ quy tắc "V1 Closure" và ranh giới Version/Release. **[DRIFT DETECTED]**
- **Intent vs Agent Instructions:** Agents đang chờ lệnh "Làm prototype tiếp theo" thay vì "Bắt đầu State Transition sang Live". **[DRIFT DETECTED]**

## 4. PHÂN LOẠI DESIGN-001 (PROTOTYPE)
*Tuyệt đối KHÔNG tự kết luận đóng DESIGN-001. Dưới đây chỉ là phân loại trạng thái để Owner ra quyết định.*

- **Layout / Sticky Nav / IA Public-Member:** `VALID` (Bám sát Intent, đã review).
- **Hardcoded Snapshot Data (trong prototype):** `OBSOLETE_CANDIDATE` (Trái với Intent "Live Real Data". Agent đề xuất bỏ hardcode để chuẩn bị đấu API thật).
- **Các Task Cải thiện UI (CSS/Animations) bổ sung:** `DEFERRED` (Dời lại sau V1 Closure, ưu tiên tính năng Live trước).
- **Tách Data Fetching Logic (JS):** `CONFLICTING` (Hiện tại logic fetch chưa tồn tại, phụ thuộc hoàn toàn tĩnh. Ngược với Intent V1 Live).

**Khuyến nghị:**
DESIGN-001 có thể giữ nguyên cấu trúc HTML/CSS (`VALID`), nhưng luồng Dữ liệu (JS) cần được xếp hạng `OBSOLETE_CANDIDATE` để dọn đường cho việc đấu nối Real Data/API (Transition to Live).

---
*Báo cáo này cần Human Gate (Owner) kiểm duyệt để kích hoạt State Transition.*

---

## 5. OWNER DECISION LOG (HUMAN GATE)
- **Quyết định:** APPROVED cơ chế Intent Reconciliation (Project-Local).
- **Trạng thái DESIGN-001:** Chính thức đánh dấu Hardcoded Snapshot Data & logic tĩnh là `OBSOLETE`. Giữ lại HTML/CSS/IA/Visual decisions. 
- **Next State Transition:** Kích hoạt chuyển hướng `PROTOTYPE → REAL DATA INTEGRATION → E2E VERIFICATION → V1 RELEASE → LIVE`. Ưu tiên chấm dứt việc làm đẹp UI vô bổ, dồn lực đấu nối API/DB thật để V1 sống.
- **MẠCH:** Bảo toàn Core Meaning. Không đơn giản hóa thành CMS workflow. Mọi thay đổi ontology phải đi kèm reconciliation.
