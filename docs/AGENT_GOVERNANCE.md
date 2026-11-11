# QUY CHUẨN PHỐI HỢP TÁC NHÂN (AGENT GOVERNANCE & COORDINATION PROTOCOL)
**Hệ thống Quản trị Tri thức — CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU**

> **Trạng thái:** CANONICAL / ACTIVE  
> **Chủ quản:** AGY (Execution Coordinator & Primary Agent)  
> **Thẩm định:** Emarald (Analysis Authority)  
> **Phê duyệt:** Tuấn (Human Final Authority)  
> **Phiên bản:** v1.0 (02/11/2026)  
> **Phạm vi áp dụng:** BẮT BUỘC cho mọi AI Agent (AGY, Cline, OpenCode và các Agent tương lai) khi tương tác với kho mã nguồn `giatoctrantrongthu`.

---

## 1. THẨM QUYỀN VÀ MÔ HÌNH VẬN HÀNH (OPERATING MODEL)

Hệ thống hoạt động theo mô hình **Primary Agent & Specialized Execution Resource** do Tuấn phê duyệt tại `AGENTS.md`:

```text
                           TUẤN (Human Final Authority)
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
                EMARALD                                 ORCHESTRATION
    (Analysis / Architecture Review / QC)   (Task Alignment & Gate Check)
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                             AGY (Primary Agent)
                   (Chịu trách nhiệm thực thi xuyên suốt)
                                       │
                 [Đánh giá Ma trận Huy động: Token / Thời gian / Chất lượng / Rủi ro]
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
                 CLINE                                  OPENCODE
    (Visual / Browser QA / CSS)            (Backend / Data Reseed Specialist)
```

### Phân công chi tiết:
1. **Tuấn — Human Final Authority:** Nắm toàn quyền quyết định về tầm nhìn sản phẩm, mô hình thực thể (Ontology), ranh giới bảo mật riêng tư, phê duyệt các cổng chốt chặn (Human Gates) và quyết định phát hành production.
2. **Emarald — Analysis Authority & QC:** Thẩm định kiến trúc, phân tích độc lập, giám sát tuân thủ Brand Governance và AIOS, đánh giá chất lượng nghiệm thu; đưa ra khuyến nghị kỹ thuật cho Tuấn, không trực tiếp viết mã tính năng.
3. **AGY — Primary Agent & Execution Coordinator:** Chịu trách nhiệm thực thi chính xuyên suốt từ Backend (Node/Express, SQLite, MariaDB, API, ReBAC) đến Tích hợp hệ thống và Frontend khi phù hợp. Điều phối các tài nguyên chuyên trách khi có lợi thế rõ rệt.
4. **Cline — Specialized Execution Resource (Visual/QA):** Huy động chuyên trách cho Visual QA, CSS pixel-perfect, Playwright Browser Testing đa độ phân giải (375, 768, 1024, 1440px). Tuân thủ nghiêm ngặt `.clinerules`.
5. **OpenCode — Specialized Execution Resource (Data/Backend):** Huy động chuyên trách cho các tác vụ viết script phân tích dữ liệu, nạp dữ liệu lớn (bulk ingestion) hoặc chuẩn hóa DDL khi được AGY yêu cầu.

---

## 2. DANH SÁCH KIỂM TRA BẮT BUỘC TRƯỚC KHI THỰC THI (AGENT PRE-FLIGHT CHECKLIST)

Trước khi chạy bất kỳ công cụ hoặc câu lệnh nào làm thay đổi hệ thống, Agent **BẮT BUỘC** thực hiện 5 bước sau:

1. [ ] **Đọc tài liệu quản trị tối cao:** Đọc [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md) và [`USER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/USER.md) để nắm rõ thẩm quyền và ranh giới bị cấm.
2. [ ] **Xác định Tài liệu Quy chuẩn (SoT):** Tra cứu [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CANONICAL_DOCUMENT_REGISTRY.md) để tìm đúng tài liệu canonical duy nhất cho nhiệm vụ được giao.
3. [ ] **Kiểm tra Phân vùng Bề mặt (Surface Governance):** Đối chiếu với [`docs/REPOSITORY_MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/REPOSITORY_MAP.md) để chắc chắn thư mục mục tiêu thuộc quyền ghi của mình.
4. [ ] **Kiểm tra Chốt chặn Phê duyệt (Gate Check):** Đối chiếu với [`docs/CHANGE_GOVERNANCE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CHANGE_GOVERNANCE.md). Nếu task chạm vào CSDL, An ninh, Secrets hoặc Deployment, **DỪNG LẠI XIN LỆNH TỪ TUẤN**.
5. [ ] **Chụp trạng thái Git (Baseline Snapshot):** Ghi nhận trạng thái `git status` trước khi sửa đổi để đảm bảo kiểm soát được 100% diff sau khi hoàn tất.

---

## 3. CÁC QUY TẮC CẤM KỴ ĐỐI VỚI MỌI AGENT (STRICT PROHIBITIONS)

- ❌ **CẤM TỰ TẠO SOURCE OF TRUTH MỚI:** Không được tự ý tạo thêm các tài liệu kế hoạch, kiến trúc song song làm phân tán và xung đột tri thức.
- ❌ **CẤM TỰ Ý THAY ĐỔI NGỮ NGHĨA DOMAIN:** Tuyệt đối không thay đổi định nghĩa dòng họ, quan hệ phả hệ hoặc ranh giới nhận diện khi chưa có chỉ thị bằng văn bản từ Tuấn.
- ❌ **CẤM THAO TÁC CƠ SỞ DỮ LIỆU KHI CHƯA QUA GATE-02:** Tuyệt đối không tự ý chạy `npm run db:reset`, `npm run db:seed` hoặc câu lệnh `INSERT/UPDATE/DELETE/DROP` vào CSDL `server/family_archive.db`.
- ❌ **CẤM COMMIT, PUSH HOẶC DEPLOY TỰ ĐỘNG:** Mọi thay đổi mã nguồn phải được giữ ở working tree có kiểm soát hoặc branch riêng biệt; không tự tiện gộp vào `main` hoặc kích hoạt build Vercel.
- ❌ **CẤM LÀM LỘ BÍ MẬT & DỮ LIỆU ĐỜI TƯ (PII):** Không in thông tin căn cước, số điện thoại người còn sống, mật khẩu băm, hoặc nội dung thư riêng tư Clara vào logs hoặc báo cáo.

---

## 4. QUY TRÌNH BÀN GIAO CHUẨN 10 MỤC (STANDARD 10-POINT HANDOFF PROTOCOL)

Khi hoàn thành bất kỳ nhiệm vụ nào, Agent **tuyệt đối không tự gán việc tiếp theo cho Agent khác hoặc tự chuyển sang task tiếp theo**. Agent phải dừng lại và cung cấp Báo cáo Bàn giao gồm đúng 10 mục:

1. **Objective:** Mục tiêu cụ thể của nhiệm vụ vừa thực hiện.
2. **Work performed:** Các đầu việc cụ thể đã triển khai chi tiết.
3. **Files changed:** Danh sách chính xác các tệp đã tạo mới hoặc chỉnh sửa.
4. **Evidence:** Bằng chứng định lượng (kết quả lệnh, log kiểm thử, checksum SHA-256, ảnh chụp màn hình).
5. **Verification:** Phương pháp và kết quả kiểm thử độc lập đã chạy.
6. **Current state:** Trạng thái hệ thống sau khi hoàn tất (Git status, DB state).
7. **Open questions:** Các câu hỏi kỹ thuật hoặc nghiệp vụ cần làm rõ.
8. **Blockers:** Các rào cản ngăn tiến độ.
9. **Risks:** Đánh giá rủi ro tiềm ẩn đối với an ninh, dữ liệu hoặc trải nghiệm.
10. **Recommended next action:** Đề xuất bước tiếp theo cụ thể để Tuấn và Emarald xem xét phê duyệt.

---
*Tài liệu thuộc hệ thống quản trị tối cao GIATOC AIOS. Bắt buộc mọi Agent phải tuân thủ nghiêm ngặt.*

