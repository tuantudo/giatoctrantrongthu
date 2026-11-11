# GIATOC MODULAR SYSTEM ARCHITECTURE FOUNDATION
**Path:** `docs/architecture/GIATOC_MODULAR_SYSTEM_ARCHITECTURE.md`
**Date:** 2026-09-17
**STATUS:** [PROPOSED]

---

## 1. Executive Summary
Tài liệu này thiết lập nền tảng kiến trúc module hóa cho dự án Giatoc. Mục tiêu cốt lõi là chuyển đổi Giatoc thành một "ngôi nhà lắp ráp" (Composable System): có thể thêm, thay thế, sửa hoặc nâng cấp một cấu kiện (module) với *blast radius* (phạm vi ảnh hưởng) được kiểm soát nghiêm ngặt, bảo vệ sự nguyên vẹn của toàn bộ hệ thống Di sản.

## 2. Architectural Problem
**Vấn đề:** Các dự án trước đây thường gộp chung Meaning (Ngữ nghĩa), Ontology (Cấu trúc dữ liệu), và Experience (Giao diện) thành một khối (Monolith). Nếu muốn thay đổi giao diện (từ Tạp chí sang Di thư), ta có nguy cơ phải đập bỏ toàn bộ backend và cơ sở dữ liệu. 
**Thách thức:** Làm sao để tháo một mảng tường (Giao diện cũ) và thay bằng mảng tường mới (Silent UI) mà không làm sập móng (Genealogy Data) hay mái nhà (Domain Contract)?

## 3. Current-State Findings
- **[OBSERVED]** Kiến trúc hiện hành đang tồn tại sự kết dính chặt chẽ giữa Frontend UI (DESIGN-001) và Backend/API. 
- **[OBSERVED]** Database Schema đang đóng vai trò là một "implicit contract" (hợp đồng ngầm định), khiến bất kỳ thay đổi nào ở UI cũng đòi hỏi truy vấn SQL phải thay đổi theo.
- **[EVIDENCE]** Báo cáo Audit trước đó cho thấy "Ấn phẩm số" (Experience) đã làm thay đổi hoàn toàn "Di thư" (Meaning).
- **[INFERENCE]** Blast radius của hệ thống hiện tại rất lớn. Việc tách `Thư gửi Clara` thành một Ontology riêng đang gặp khó khăn vì Frontend logic chứa quá nhiều Domain logic.

## 4. Architectural Principles
1. **Separation of Meaning and Experience:** Ý nghĩa di sản (Core) phải hoàn toàn độc lập với cách hiển thị (UI).
2. **Contract-First Development:** Mọi giao tiếp giữa các thành phần phải thông qua Public Contract, không thông qua Internal Implementation hay DB schema.
3. **Controlled Blast Radius:** Sửa cục bộ phải ở lại cục bộ.
4. **No Shared Mutable Global State:** Các module không sửa chéo dữ liệu của nhau.

## 5. System Layers
Hệ thống được chia thành 4 lớp độc lập:
1. **CORE:** Ý nghĩa (Meaning), Heritage Model, Ontology gốc (Bất biến theo thời đại).
2. **DOMAIN MODULES:** Các cụm nghiệp vụ độc lập quản lý cấu trúc dữ liệu và logic (Genealogy, Archive, Narrative).
3. **EXPERIENCE MODULES:** Các lớp trình bày/giao diện (Tạp chí MẠCH, Di thư UI, Cây gia phả UI). Có thể tháo lắp/thay thế.
4. **INFRASTRUCTURE:** Database (MariaDB), File Storage (NAS), Hosting (Vercel), Network (Cloudflare). 

## 6. Proposed Module Map
Các Bounded Modules được đề xuất:
- **Module `Genealogy`:** Quản lý Person, Family, Relationship.
- **Module `Archive`:** Quản lý tài liệu gốc, Media, Scan.
- **Module `Narrative`:** Quản lý Story, Bài viết (MẠCH).
- **Module `Testament`:** Quản lý Di thư, Thư gửi Clara.
- **Module `Access & Governance`:** Quản lý danh tính (Public/Member/Owner).

*Ghi chú:* Tách riêng `Narrative` và `Testament` vì tính chất sinh mệnh (lifecycle) và ý nghĩa (meaning) của chúng hoàn toàn khác nhau, dù chúng cùng chứa văn bản.

## 7. Module Boundaries
- **Quyền sở hữu (Ownership):** Module nào tạo ra thực thể thì module đó sở hữu. Ví dụ: `Genealogy` sở hữu `Person`. `Testament` sở hữu lá thư, nhưng chỉ tham chiếu (reference) `Person` qua ID, KHÔNG được sửa đổi `Person`.
- **Change Boundary:** Đổi cấu trúc lá thư không được làm ảnh hưởng đến cấu trúc gia phả.

## 8. Module Contracts
Mô tả ví dụ một Contract của Module `Genealogy`:
- **Module ID:** `MOD-GENEALOGY`
- **Purpose:** Quản lý lưới tọa độ con người trong gia tộc.
- **Owns:** Cấu trúc Person, Cấu trúc Relationship.
- **Does Not Own:** Hình ảnh (thuộc Archive), Câu chuyện (thuộc Narrative).
- **Public Interface:** `getPerson(id)`, `getAncestors(id)`.
- **Allowed Dependencies:** `MOD-ARCHIVE` (để lấy link ảnh đại diện).
- **Forbidden Dependencies:** `MOD-TESTAMENT` (Gia phả không cần biết ai viết di thư gì).
- **Khả năng thay thế:** Hoàn toàn có thể thay đổi DB từ MariaDB sang GraphDB bên dưới mà các module khác gọi `getPerson(id)` không bị ảnh hưởng.

## 9. Dependency Rules
- **FORBIDDEN:** Experience/UI → gọi trực tiếp SQL / Database.
- **FORBIDDEN:** Module A → thao tác trực tiếp bảng DB của Module B.
- **FORBIDDEN:** Domain logic nằm trong UI Component.
- **ALLOWED:** Experience/UI → gọi Application Contract (API) của Domain Module.
- **ALLOWED:** Module A → gọi Public Interface của Module B.

## 10. Data Ownership Rules
- **Single Source of Truth:** Thực thể `Person` chỉ có một bản gốc tại `Genealogy`. Mọi nơi khác dùng `personId` để tham chiếu.
- **Reference vs Snapshot:** Dùng **Reference (ID)** cho các dữ liệu cần đồng bộ (Tên người, ngày sinh). Dùng **Snapshot** cho các dữ liệu mang tính lịch sử (Bản in PDF của một di thư tại thời điểm năm 2026 không được tự động đổi tên người nếu năm 2050 gia phả cập nhật, vì di thư phải giữ nguyên lịch sử).

## 11. Interface/API Contract Principles
- **Consumer-driven:** Người tiêu thụ (Consumer như UI) phụ thuộc vào Contract (VD: JSON format đã chốt), không phụ thuộc vào việc backend viết bằng Node.js hay Python.
- Bảng DB schema **TUYỆT ĐỐI KHÔNG** được đem làm API Response. Phải có lớp Mapper/DTO ở giữa.

## 12. Composition Model
Quy trình lắp ráp hệ thống:
`DOMAIN MODULES` (cung cấp Data & Contract) → `APPLICATION COMPOSITION` (Gắn kết các module, kiểm tra Access) → `EXPERIENCE MODULES` (Render UI).
Mọi state chia sẻ (nếu có) phải được quản lý ở lớp Application Composition, các Domain Modules hoạt động độc lập (Stateless interaction).

## 13. Change / Blast-Radius Model

| Change (Sự thay đổi) | Expected Blast Radius (Phạm vi) | Must Remain Stable (Phải giữ nguyên) | Verification (Kiểm chứng) |
|---|---|---|---|
| Thay giao diện Cây Gia Phả | Chỉ thư mục Frontend UI | API Contract, Genealogy Domain | Visual QA, Contract E2E |
| Tách `Di Thư` thành DB riêng | Domain `Testament` + DB Migration| Experience UI (Vẫn nhận data như cũ) | Integration, DB Verify |
| Thêm hệ thống Search mới | Khởi tạo Module `Search` riêng | Không module nào bị sập | Unit, E2E |
| Đổi MariaDB sang PostgreSQL| Infrastructure Layer (DB Drivers)| Domain logic, API Contract, Frontend UI | Integration Test |
| Thay thiết kế trang chủ | Module Experience `Home` | Tất cả Data & Backend | Visual QA |

## 14. Versioning Model
- **UI Versioning:** Thay UI V1 → V2 không yêu cầu đổi API nếu Contract không đổi. Module UI V2 được triển khai song song, switch router là xong.
- **Contract Versioning:** Nếu `Genealogy Contract` đổi từ `v1` sang `v2` (Ví dụ: Đổi cấu trúc `Person`), phải cung cấp Endpoint `v2`, giữ `v1` chạy song song (Backwards Compatibility) cho đến khi Experience Module cập nhật.

## 15. Add / Replace / Remove Module
- **ADD:** Cắm một module mới (Ví dụ: `Event`). Khai báo Contract. Các module khác không bị ảnh hưởng.
- **REPLACE:** Viết một Implementation mới (Ví dụ: Viết lại API Gia phả bằng Rust thay vì Node.js). Chỉ cần Implementation mới tuân thủ đúng Contract cũ, việc swap diễn ra tức thời ở Proxy/Gateway layer.
- **REMOVE:** Xác định (Dependency Check) không có Consumer nào đang gọi tới Module đó. Xóa router. Xóa mã.

## 16. Verification Model
- **Unit Verification:** Xác nhận logic nội bộ của 1 Module.
- **Contract Verification:** Đảm bảo API trả ra đúng cấu trúc đã cam kết với UI.
- **Integration Verification:** Đảm bảo Module A gọi đúng Module B.
- **Quy tắc:** Pass test của 1 Module không có nghĩa là toàn bộ Hệ thống đúng. Phải qua E2E Verification. Sự toàn vẹn Di sản (Heritage Ontology) cần Human Verification độc lập.

## 17. Agent Boundaries (Dưới góc nhìn Modular)
- **AIOS-AGENT-AGY:** Làm chủ thiết kế `CORE` và `DOMAIN MODULE CONTRACTS`. Đảm bảo các ranh giới Module phản ánh đúng Ý nghĩa Di sản.
- **AIOS-AGENT-OC:** Làm chủ `INFRASTRUCTURE` và `APPLICATION/DOMAIN IMPLEMENTATION`. Viết API đáp ứng Contract, quản lý DB Migration an toàn.
- **AIOS-AGENT-CLINE:** Làm chủ `EXPERIENCE MODULES`. Đảm bảo UI tôn trọng Contract của Backend mà không cần biết Backend chạy Database gì.

## 18. Open Questions
- Mô hình Database hiện tại ở MariaDB có đủ linh hoạt để tách `MẠCH` và `Testament` thành 2 cụm riêng rẽ chưa, hay đang dính chung 1 bảng `Articles`?
- Việc chứng thực quyền (Governance) của Tuấn khi soạn thảo sẽ được tách thành Module Identity riêng, hay dựa vào Auth của Obsidian / Cloudflare?

## 19. Human Decisions Required
1. Phê duyệt ranh giới 5 Module: `Genealogy`, `Archive`, `Narrative`, `Testament`, `Governance`.
2. Quyết định chiến lược Snapshot vs Reference cho Di thư. Lá thư lưu giữ tên người theo đúng thời điểm viết (Snapshot), hay cập nhật theo gia phả (Reference)? (Khuyến nghị của kiến trúc sư AGY: Snapshot cho Di thư).

## 20. Proposed Next State
Sau khi Human phê duyệt tài liệu này, nó sẽ chuyển trạng thái sang `[CANONICAL]`. Từ đó, bất kỳ Agent nào đụng vào code Giatoc đều phải tuân theo ranh giới Module này, ngăn chặn vĩnh viễn việc UI thao túng Database.
