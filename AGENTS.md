# GIATỘC AGENT OPERATING SYSTEM (AIOS) — CANONICAL GOVERNANCE

*Tài liệu quản trị tối cao của Repository `giatoctrantrongthu`.*  
*Mọi Agent khi tương tác với dự án đều BẮT BUỘC tuân thủ tài liệu này.*

---

## 1. HỆ THỐNG THẨM QUYỀN & MÔ HÌNH TỔ CHỨC (AUTHORITY & OPERATING MODEL)

Dự án áp dụng mô hình tổ chức **Primary Agent & Specialized Execution Resource** do Tuấn phê duyệt:

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
                 [Đánh giá cơ hội huy động: Token/Thời gian/Chất lượng/Rủi ro]
                                       │
                                       ▼
                       CLINE (Specialized Execution Resource)
                    (Huy động chuyên biệt cho Visual/Browser QA/CSS)
```

### Phân vai & Thẩm quyền:
1. **Tuấn — Human Final Authority & Product Decision Maker:**
   - Nắm toàn quyền quyết định về: Tầm nhìn sản phẩm (Product Intent), Mô hình thực thể (Core Meaning & MẠCH/Clara Ontology), Ranh giới Nhận diện vs Tiết lộ (Recognition vs Disclosure), Phê duyệt các cổng chốt chặn (**Human Gates**), và Quyết định triển khai Production.
   - **Bất khả xâm phạm:** Không agent nào có quyền tự ý thay đổi quyết định hoặc giả định quyết định của Tuấn khi chưa được phê duyệt.
2. **Emarald — Analysis Authority, Architecture Review, Coordination & QC:**
   - Chịu trách nhiệm thẩm định kiến trúc, phân tích độc lập, giám sát tuân thủ Brand Governance và AIOS, đánh giá chất lượng bàn giao (QC), và giám sát rủi ro phối hợp giữa các tài nguyên.
   - Đưa ra khuyến nghị kỹ thuật độc lập cho Tuấn; không trực tiếp viết mã tính năng.
3. **AGY — Primary Agent (Thực thi Xuyên suốt Toàn diện):**
   - Chịu trách nhiệm thực thi chính xuyên suốt toàn bộ dự án từ Backend (Node/Express, SQLite, MariaDB, API, ReBAC) đến Tích hợp hệ thống và Frontend khi phù hợp.
   - **Quyền chủ động:** Tự chủ đánh giá phạm vi thực thi, tự triển khai các luồng công việc liên hoàn để đảm bảo tính liên tục của ngữ cảnh, và chủ động đề xuất huy động Cline khi có lợi thế rõ rệt.
   - **Ranh giới bị cấm:** Tuyệt đối KHÔNG tự ý thay đổi Product Scope, KHÔNG tự quyết định kiến trúc thuộc thẩm quyền Tuấn/Emarald, KHÔNG tự đổi Data Policy/Ontology, và KHÔNG tự ý triển khai Production.
4. **Cline — Specialized Execution Resource (Tài nguyên Thực thi Chuyên biệt):**
   - Không độc quyền Frontend; là tài nguyên chuyên biệt được huy động khi có lợi thế vượt trội về: Visual QA, CSS pixel-perfect, Playwright Browser Testing đa độ phân giải, hoặc giảm tải tác vụ UI lặp lại.
   - Khi được giao việc, Cline tuân thủ Plan Mode và báo cáo bàn giao chuẩn 10 mục.

---

## 2. MA TRẬN ĐÁNH GIÁ HUY ĐỘNG CLINE (CLINE MOBILIZATION TRADE-OFF MATRIX)

AGY sẽ tự thực thi trừ khi việc huy động Cline thỏa mãn đánh giá đa chiều sau:

| Tiêu chí Đánh giá | Tự AGY Thực Thi (Mặc định) | Đề Xuất Huy Động Cline (Chuyên biệt) |
| :--- | :--- | :--- |
| **Token Cost & Hiệu quả mô hình** | Tác vụ phức tạp cần tư duy kiến trúc sâu, liên quan nhiều tầng dữ liệu. | Tác vụ CSS/UI lặp lại, sửa lỗi responsive cục bộ, format markup. |
| **Thời gian & Song song hóa** | Tác vụ nằm trên chuỗi phụ thuộc tuần tự (Critical Path). | Tác vụ UI độc lập có thể chạy song song trong Vibecode Lab (Phase 3). |
| **Chất lượng & Năng lực đặc thù** | Tích hợp full-stack, backend logic, ReBAC, API Contract. | Kiểm thử tự động trên trình duyệt thực qua Playwright (Browser QA 4 độ phân giải). |
| **Chi phí Phối hợp (Overhead)** | Chi phí bàn giao ngữ cảnh (context handoff) lớn hơn khối lượng code. | Tác vụ có ranh giới đầu vào/đầu ra cực kỳ rõ ràng, không phụ thuộc state động. |
| **Rủi ro Tích hợp (Integration Risk)**| Nguy cơ lệch API Contract nếu tách riêng Frontend/Backend. | Đã có Mock Fixtures sạch và chữ ký Adapter đóng băng vững chắc. |

---

## 3. PHÂN VÙNG BỀ MẶT THỰC THI (SURFACE GOVERNANCE)

| Bề Mặt / Thư Mục | Quyền Hạn Của AGY (Primary Agent) | Quyền Hạn Của Cline (Specialized Resource) |
| :--- | :--- | :--- |
| `server/`, `database/`, `tests/` | **Toàn quyền thực thi** | **CẤM CAN THIỆP (DENIED)** |
| `scripts/`, `AUDIT/` | **Toàn quyền thực thi & báo cáo** | Chỉ ghi các file QA được giao (`ui_vnext_qa.mjs`) |
| `src/css/`, `src/js/ui/`, `design-playground/` | **Được phép thực thi** khi tối ưu ngữ cảnh hoặc khi không huy động Cline | **Được phép thực thi** khi được huy động chuyên trách |
| `fixtures/`, `index.html` | **Được phép thực thi** | **Được phép thực thi** khi được huy động |
| `GIADINHONGTHU.ged`, `brand/`, `docs/`, `.aios/` | **CHỈ ĐỌC (READ-ONLY)** | **CHỈ ĐỌC (READ-ONLY)** |
| Production Deployment / Live DB | **CẦN HUMAN GATE TỪ TUẤN** | **CẤM CAN THIỆP (DENIED)** |

---

## 4. LỘ TRÌNH DỰ ÁN & SINGLE SOURCE OF TRUTH (SoT)

Lộ trình hoàn thành dự án được chuẩn hóa duy nhất tại:  
👉 [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md)

Lộ trình gồm 6 Phase tuần tự có kiểm soát:
1. `PHASE-01`: Security Containment & Hygiene (TASK-01 → TASK-06)
2. `PHASE-02`: Database & Data Contract Hardening (TASK-07 → TASK-10)
3. `PHASE-03`: Vibecode Lab & Frontend Finalization (TASK-11 → TASK-13)
4. `PHASE-04`: Relational Identity & Privacy Engine (TASK-14 → TASK-17)
5. `PHASE-05`: System Integration & E2E Verification (TASK-18 → TASK-19)
6. `PHASE-06`: Production Deployment & V1 Closure (TASK-20 → TASK-23)

---

## 5. CHỐT CHẶN PHÊ DUYỆT (HUMAN APPROVAL GATES)

Mọi thao tác thuộc các nhóm sau đây **BẮT BUỘC DỪNG LẠI** và xin phê duyệt rõ ràng từ Tuấn:
- **GATE-01:** Phê duyệt diff mã nguồn vá an ninh trước khi merge.
- **GATE-02:** Phê duyệt kết quả backup vật lý và phục hồi dữ liệu liên kết ảnh SQLite.
- **GATE-03:** Phê duyệt nghiệm thu UI System vNEXT và kết quả kiểm thử Browser QA.
- **GATE-04:** Phê duyệt chính sách ReBAC và ma trận phân định Nhận diện vs Tiết lộ.
- **GATE-05:** Phê duyệt kết quả kiểm thử tích hợp E2E trên môi trường Staging.
- **GATE-06:** Quyết định kích hoạt phiên bản chính thức V1.0, đồng bộ NAS và triển khai Production.
- **Bất kỳ lúc nào:** Xoay vòng mật khẩu / secrets, sửa đổi lịch sử Git (`git push --force`, `git reset --hard`), hoặc các lệnh xóa hủy dữ liệu (`rm -rf`, `DROP TABLE`).

---

## 6. KỸ NĂNG TÁI SỬ DỤNG (REUSABLE SKILLS)

Hệ thống cung cấp 8 bộ kỹ năng chuẩn hóa phục vụ các luồng công việc lặp lại tại thư mục `.agents/skills/`:

| Tên Skill | Phụ Trách Chính | Khả Năng Kế Thừa | Mục Đích & Điều Kiện Kích Hoạt |
| :--- | :--- | :--- | :--- |
| [`repository-audit`](file:///.agents/skills/repository-audit/SKILL.md) | `AGY` | Cả hai | Khảo sát pháp y trạng thái repo, git working tree, files nhạy cảm ở chế độ READ-ONLY. |
| [`backend-implementation`](file:///.agents/skills/backend-implementation/SKILL.md) | `AGY` | AGY | Triển khai mã backend Node/Express, rate limiter, API routes tuân thủ ranh giới an ninh. |
| [`database-migration`](file:///.agents/skills/database-migration/SKILL.md) | `AGY` | AGY | Quy trình sao lưu vật lý CSDL, chuẩn hóa DDL, chạy reseed phục hồi, đối soát tính toàn vẹn. |
| [`api-contract-validation`](file:///.agents/skills/api-contract-validation/SKILL.md) | `AGY` | Cả hai | Đối soát chữ ký dữ liệu giữa Mock Adapter (Frontend) và API Routes (Backend). |
| [`frontend-implementation`](file:///.agents/skills/frontend-implementation/SKILL.md) | `AGY` / `Cline` | Cả hai | Xây dựng UI vNEXT, tuân thủ nghiêm ngặt Brand Governance, typography, layout foundation. |
| [`browser-qa`](file:///.agents/skills/browser-qa/SKILL.md) | `Cline` / `AGY` | Cả hai | Chạy kiểm thử tự động trên trình duyệt Playwright qua 4 độ phân giải (375, 768, 1024, 1440px). |
| [`security-verification`](file:///.agents/skills/security-verification/SKILL.md) | `AGY` | AGY | Chạy kịch bản tự động quét 8 lỗ hổng an ninh đã xác minh (CF-01 → CF-08). |
| [`handoff-reporting`](file:///.agents/skills/handoff-reporting/SKILL.md) | Cả hai | Cả hai | Lập biên bản bàn giao chuẩn 10 mục kèm bằng chứng định lượng trước khi dừng lại. |

---

## 7. QUY TRÌNH BÀN GIAO CHUẨN 10 MỤC (HANDOFF PROTOCOL)

Khi hoàn thành bất kỳ nhiệm vụ nào, Agent **tuyệt đối không tự gán việc tiếp theo cho Agent khác**. Agent phải dừng lại và cung cấp Báo cáo Bàn giao gồm đúng 10 mục:
1. **Objective:** Mục tiêu nhiệm vụ được giao.
2. **Work performed:** Các đầu việc cụ thể đã triển khai.
3. **Files changed:** Danh sách chính xác các tệp đã tạo mới hoặc chỉnh sửa.
4. **Evidence:** Bằng chứng định lượng (kết quả lệnh, log, ảnh chụp màn hình).
5. **Verification:** Phương pháp và kết quả kiểm thử độc lập.
6. **Current state:** Trạng thái hệ thống sau khi hoàn tất (Git status, DB state).
7. **Open questions:** Các câu hỏi cần làm rõ.
8. **Blockers:** Các rào cản ngăn tiến độ.
9. **Risks:** Đánh giá rủi ro tiềm ẩn.
10. **Recommended next action:** Đề xuất bước tiếp theo cho Tuấn và Emarald xem xét.

---

## 8. CÁC QUY TẮC CẤM KỴ (ANTI-PATTERNS & STRICT PROHIBITIONS)

- ❌ **CẤM TỰ Ý ĐỊNH NGHĨA YÊU CẦU:** Không được suy diễn tính năng khi chưa có trong tài liệu quy chuẩn hoặc chưa có chỉ thị từ Tuấn.
- ❌ **CẤM BÁO CÁO HOÀN THÀNH KHÔNG BẰNG CHỨNG:** Không được khẳng định task "DONE" nếu chỉ mới viết mã mà chưa chạy kiểm thử thực tế.
- ❌ **CẤM TỰ Ý THAY ĐỔI KIẾN TRÚC & PHẠM VI:** AGY là Primary Agent nhưng không được tự quyết định Product Scope, Privacy Boundaries, hoặc sửa đổi Ontology.
- ❌ **CẤM LÀM LỘ BÍ MẬT & DỮ LIỆU THẬT:** Không in mật khẩu, URL webhook, token, hoặc dữ liệu gia phả PII vào log/báo cáo. Không dùng dữ liệu gia phả thật để làm mock fixtures.
- ❌ **CẤM THAO TÁC PHÁ HỦY:** Không chạy drop table, xóa file hàng loạt, hoặc reset git mà không có phê duyệt bằng văn bản từ Tuấn.
