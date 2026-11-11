# BÁO CÁO BÀN GIAO TÁI CẤU TRÚC MASTER COMPLETION PLAN
## DỰ ÁN: CÂY GIA PHẢ GIATỘC TRẦN TRỌNG THU — HỆ THỐNG DI SẢN SỐ

**Kính gửi:** Tuấn (Human Final Authority) & Emarald (Analysis & Governance)  
**Người thực hiện:** AGY (Execution Coordinator)  
**Thời gian hoàn thành:** 01/11/2026 11:45 (GMT+7)  
**Tài liệu tái cấu trúc:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (Phiên bản `v2.0`)  
**Chế độ thực thi:** DOCUMENT EDITING ONLY  

---

## 1. NHỮNG NỘI DUNG ĐÃ THAY ĐỔI (WHAT CHANGED)

1. **Chuyển trục điều phối tối cao từ "Phase kỹ thuật" sang "6 Năng lực Di sản số P1–P6":**  
   Toàn bộ cấu trúc của Master Plan không còn bị dẫn dắt bởi việc hoàn thành từng task kỹ thuật rời rạc (quét an ninh trên giấy, migration database nội bộ), mà được tổ chức xoay quanh mục tiêu xây dựng 6 năng lực bảo tồn và tiếp nối di sản lâu dài theo Hiến chương UNESCO 2003.
2. **Xác lập Bản chất Di sản số và loại bỏ các định vị sai lệch:**  
   Khẳng định dứt khoát: *CÂY GIA PHẢ GIATỘC TRẦN TRỌNG THU là một Hệ thống Di sản số của dòng họ*. Website `giatoctrantrongthu.com` chỉ là cổng truy cập và tương tác, không phải toàn bộ di sản. Loại bỏ hoàn toàn các định vị cũ như "Ấn phẩm số", "Website xuất bản nội dung", hay coi "Vibecode Lab" là đích đến.
3. **Tái cấu trúc lộ trình từ 6 Phase cũ thành 5 Giai đoạn Sản phẩm (Stages):**  
   Đưa việc khắc phục các lỗi trực tiếp trên website đang phát hành (Lỗi 404 trang Đăng nhập, lỗi không hiển thị 20 bài viết MẠCH) lên ưu tiên số 1 (**Stage 1**); kết nối Cây phả đồ từ Lab sang website thật (**Stage 4**); kiểm chứng hạ tầng NAS truyền đời (**Stage 5**).
4. **Chuẩn hóa hệ thống nhãn nhận thức & Bằng chứng (Epistemic & Evidence Taxonomy):**  
   Áp dụng chuẩn 9 nhãn: `[DOCUMENTED]`, `[CONFIGURED]`, `[OBSERVED]`, `[TESTED]`, `[PROVEN]`, `[PARTIAL]`, `[FAILED]`, `[BLOCKED]`, `[UNKNOWN]`. Xóa bỏ hoàn toàn việc đánh đồng "có cấu hình" hoặc "HTTP 200" với "dữ liệu đã chính xác".

---

## 2. CẤU TRÚC MASTER PLAN MỚI (NEW PLAN STRUCTURE)

Tệp `AUDIT/MASTER_COMPLETION_PLAN.md` (v2.0) gồm 11 phần chuẩn mực:
- **Phần 1 — Bản Chất Sản Phẩm & Định Vị Chiến Lược:** Tuyên ngôn di sản số, các định vị bị cấm, nguyên tắc bảo tồn UNESCO 2003.
- **Phần 2 — Hệ Thống 6 Năng Lực Sản Phẩm Cốt Lõi (P1 – P6):** Định nghĩa chi tiết P1 (Data Fidelity), P2 (Relational Integrity), P3 (Access & Privacy), P4 (Infrastructure Connectivity), P5 (Product Experience), P6 (Operational Reliability).
- **Phần 3 — Hiện Trạng Sản Phẩm Đối Soát Theo Bằng Chứng:** Bảng ma trận đối soát hiện trạng thực tế kèm nhãn bằng chứng kỹ thuật.
- **Phần 4 — Lộ Trình Hoàn Thiện: 5 Giai Đoạn Sản Phẩm (Stages):**
  - *Stage 1:* Restore Public Heritage Experience (Phục vụ P5).
  - *Stage 2:* Verify Data & Relational Contracts (Phục vụ P1, P2).
  - *Stage 3:* Establish Access & Privacy Engine (Phục vụ P3).
  - *Stage 4:* Integrate the Heritage Experience (Phục vụ P1, P2, P3, P5).
  - *Stage 5:* Verify Infrastructure & Operational Continuity (Phục vụ P1, P4, P6).
- **Phần 5 — Bảng Phân Rã Công Việc & Ánh Xạ Task (Execution Backlog):** Ánh xạ đầy đủ Task ID cũ và các task bổ sung vào P1–P6.
- **Phần 6 — Sơ Đồ Phụ Thuộc Chiến Lược & Đường Găng (Critical Path):** Cập nhật chuỗi công việc quyết định tiến độ sản phẩm.
- **Phần 7 — Danh Mục Quyết Định Sản Phẩm (Decision Register):** DEC-01 đến DEC-08 với phân định trạng thái duyệt nghiêm ngặt.
- **Phần 8 — Danh Mục Rủi Ro & Rào Cản (Risk & Blocker Register):** RSK-01 đến RSK-07.
- **Phần 9 — Các Chốt Chặn Phê Duyệt Của Tuấn (Human Approval Gates):** GATE-01 đến GATE-06 (ghi nhận GATE-03 đã duyệt).
- **Phần 10 — Mạng Lưới Tài Liệu Phụ Trợ (Document Hierarchy):** Phân tầng 5 cấp tài liệu quản trị.
- **Phần 11 — Bảng Kiểm Kê Nghiệm Thu Phát Hành (Final DoD Checklist):** 10 tiêu chuẩn định lượng đóng dự án.

---

## 3. BẢNG MAPPING GIỮA P1–P6 VÀ CÁC TASK CŨ

| Năng Lực Sản Phẩm | Các Task Kỹ Thuật Ánh Xạ | Vai Trò Đóng Góp Vào Năng Lực Di Sản |
|---|---|---|
| **P1 — Data Fidelity** | `TASK-07`, `TASK-08`, `TASK-08B` *(Mới)*, `TASK-09`, `TASK-10`, `TASK-18` | Bảo toàn dữ liệu GEDCOM gốc; đối soát chênh lệch 223 vs 228 người; khôi phục 173 ảnh `person_media`; chuẩn hóa DDL CSDL. |
| **P2 — Relational Integrity** | `TASK-09`, `TASK-14`, `TASK-18` | Tính toán thế hệ, thế thứ, nhánh nội ngoại, quan hệ dâu rể, bảo toàn cấu trúc thân tộc đa thế hệ. |
| **P3 — Access & Privacy** | `TASK-01`, `TASK-03`, `TASK-04`, `TASK-05`, `TASK-06`, `TASK-11`, `TASK-15`, `TASK-16`, `TASK-17` | Phân định Recognition vs Disclosure; phân quyền ReBAC; Dynamic Field-Masking che mờ thông tin người sống; chống IDOR & Scraping. |
| **P4 — Infrastructure** | `TASK-21` | Xác minh luồng dữ liệu từ NAS ra Máy chủ API (`api.giatoctrantrongthu.com`) và Cổng Web Vercel (`giatoctrantrongthu.com`). |
| **P5 — Product Experience** | `TASK-06B` *(Mới)*, `TASK-06C` *(Mới)*, `TASK-12`, `TASK-13`, `TASK-16`, `TASK-18`, `TASK-19` | Bảo toàn trang nhất; sửa lỗi Vercel 404; hiển thị 20 bài viết MẠCH; tích hợp Cây phả đồ tương tác và Hồ sơ nhân vật vào web live. |
| **P6 — Operational Reliability**| `TASK-01`, `TASK-02`, `TASK-05`, `TASK-10`, `TASK-19`, `TASK-20`, `TASK-21`, `TASK-22`, `TASK-23` | Hệ thống bảo mật, ổn định; tự động sao lưu dữ liệu; quy trình phục hồi dưới 5 phút; quy trình cập nhật phả hệ lâu dài. |

---

## 4. PHÂN LOẠI XỬ LÝ CÁC TASK (KEEP, REVISE, RESEQUENCE, MERGE, DEFER)

- **KEEP (Giữ nguyên nội hàm kỹ thuật):**  
  - `TASK-01` (Fix Static Root)
  - `TASK-02` (Fix URI Crash)
  - `TASK-03` (Fix Write APIs)
  - `TASK-05` (Remove Secret Scripts)
  - `TASK-07` (Backup & Fix Seed Script)
  - `TASK-08` (Reseed SQLite Media)
  - `TASK-09` (Fix Stories Query)
  - `TASK-10` (Canonical Schema DDL)
  - `TASK-14` (Relation Engine)
  - `TASK-16` (Node-based API)
  - `TASK-17` (Fix IDOR Route)
  - `TASK-19` (E2E Verification)
  - `TASK-20` (Prod Environment Setup)
  - `TASK-23` (Release V1.0.0 Tag)
- **REVISE (Hiệu chỉnh ngữ cảnh & phạm vi theo Di sản số):**  
  - `TASK-06` (Chặn dữ liệu nhạy cảm trên Vercel gắn với cấu hình Rewrite).
  - `TASK-15` (ReBAC Engine: Phải bám sát nguyên tắc UNESCO bảo vệ người sống, tuân thủ Decision Register của Tuấn).
  - `TASK-18` (Tích hợp Frontend: Chuyển từ "tích hợp Lab" sang "kế thừa module từ Lab vào cổng web thật kết nối với 228 người từ Live API").
  - `TASK-21` (Đồng bộ NAS: Bổ sung đo kiểm kết nối thực tế và kịch bản phục hồi thảm họa).
- **RESEQUENCE (Thay đổi thứ tự thực hiện):**  
  - `TASK-04` (Rate-limiting đăng nhập): Chuyển từ Phase 1 cũ sang **Stage 3** (cùng đợt kích hoạt cổng Đăng nhập thật), nhường ưu tiên Stage 1 cho việc sửa lỗi 404 và hiển thị MẠCH.
- **DEFER (Tạm hoãn):**  
  - `TASK-22` (Dọn dẹp repo diện rộng): Hoãn sang giai đoạn sau cùng của Stage 5, không để việc dọn file rác cản trở tiến độ hoàn thiện cổng di sản.
- **NEW (Bổ sung nhiệm vụ then chốt bị thiếu trước đây):**  
  - `TASK-06B`: Cấu hình Vercel Rewrite trong `vercel.json` để xóa bỏ triệt để lỗi 404 cho `/login`, `/me`, `/me/tree`.
  - `TASK-06C`: Sửa lỗi hiển thị danh sách 20 bài viết tư liệu MẠCH trên giao diện web live.
  - `TASK-08B`: Đối soát dữ liệu phả hệ: GEDCOM gốc `GIADINHONGTHU.ged` vs Dữ liệu API (Làm rõ chênh lệch 223 vs 228 nhân vật).

---

## 5. CÁC QUYẾT ĐỊNH ĐÃ DUYỆT ĐƯỢC BẢO TOÀN (APPROVED DECISIONS)

1. **DEC-01 (APPROVED):** Bản chất sản phẩm là Hệ thống Di sản số của dòng họ theo Hiến chương UNESCO 2003; áp dụng triết lý Relational Identity & Community Privacy.
2. **DEC-02 (APPROVED):** Giữ cấu trúc CSDL vật lý hiện tại, tiến hành hardening và chuẩn hóa DDL; tuyệt đối không đập đi xây lại schema.
3. **DEC-08 (APPROVED):** Hoãn việc viết lại lịch sử Git (Git History Rewrite bằng BFG) sang giai đoạn sau V1.0, tạm thời bảo vệ bằng quy tắc ignore.
4. **GATE-03 (APPROVED):** Ghi nhận Tuấn đã chính thức phê duyệt nghiệm thu kết quả Browser QA giao diện vNEXT trong Lab tại artifact `PHASE_03_EXECUTION_RECONCILIATION.md`.

---

## 6. CÁC QUYẾT ĐỊNH CÒN MỞ (PENDING HUMAN DECISION)

Bảo toàn tính độc lập, tuyệt đối không tự nâng trạng thái khi chưa có văn bản phê duyệt của Tuấn:
1. **DEC-03 (`PENDING HUMAN DECISION`):** Ranh giới Nhận diện (Recognition Boundary) — Thành viên thấy toàn bộ cấu trúc cây phả hệ dòng họ hay chỉ thấy trong phạm vi Chi/Nhánh của mình?
2. **DEC-04 (`PENDING HUMAN DECISION`):** Ranh giới Tiết lộ Đời tư (Disclosure Boundary) — Thông tin chi tiết người sống chỉ mở cho gia đình hạt nhân trực hệ hay mở cho toàn bộ người trong cùng Chi/Nhánh?
3. **DEC-05 (`PENDING HUMAN DECISION`):** Mô hình hóa Chi/Nhánh — Tuấn cung cấp danh sách chính thức hay thuật toán tự tính toán theo Cụ Khởi Tổ?
4. **DEC-06 (`PROPOSED`):** Quy tắc Bảo vệ Người Đã Khuất — Tiền nhân mất trên 50 năm tự động coi là tư liệu lịch sử được công khai trang trọng hay bảo vệ đồng nhất như người sống?
5. **DEC-07 (`PENDING HUMAN DECISION`):** Hạ tầng Lưu trữ Trung tâm Dài hạn — NAS là Source of Truth duy nhất hay Cơ sở dữ liệu Cloud làm SoT runtime và NAS làm kho lưu trữ gốc offline?

---

## 7. ĐIỂM MÂU THUẪN & THIẾU BẰNG CHỨNG CẦN LƯU Ý (EVIDENCE GAPS)

1. **Chênh lệch số lượng nhân vật phả hệ (223 vs 228):**
   - Các tài liệu audit trước ghi nhận SQLite có **223 cá nhân** (`[PROVEN]` trên local db cũ).
   - Website live và API `api.giatoctrantrongthu.com` hiện trả về **228 cá nhân** (`[PROVEN]` trên HTTP response).
   - *Biện pháp:* Bổ sung `TASK-08B` để trích xuất danh sách ID của cả hai nguồn, đối soát chi tiết 5 nhân vật chênh lệch đến từ đâu, báo cáo Tuấn trước khi đồng bộ.
2. **Hạ tầng vật lý của Máy chủ API (`api.giatoctrantrongthu.com`):**
   - Trạng thái: `[UNKNOWN]`. Đã chứng minh API đang hoạt động qua Cloudflare, nhưng chưa xác định được tiến trình Express này đang chạy trên NAS, trên VPS đám mây hay một container riêng.
   - *Biện pháp:* Khảo sát trong Stage 5, không giả định cấu hình.
3. **Ranh giới nội dung MẠCH:**
   - Bảo toàn nguyên tắc: MẠCH là không gian tư liệu, ký ức và diễn ngôn văn hóa gia tộc; không trộn lẫn MẠCH với thư riêng Clara, không tự ý sửa đổi triết lý biên tập của MẠCH.

---

## 8. KẾT QUẢ KIỂM TRA GIT DIFF

Đã kiểm tra bằng lệnh: `git status --porcelain | grep -v "^??"`:
- **Chỉ có duy nhất tệp `AUDIT/MASTER_COMPLETION_PLAN.md` được chỉnh sửa** trong các tệp kế hoạch theo đúng chỉ thị.
- Toàn bộ các tệp mã nguồn, CSS, HTML, database, GEDCOM, Vercel config, Cloudflare, NAS credentials **hoàn toàn nguyên vẹn 100%**.
- Không có thao tác `commit`, `push`, `reset`, `clean` hay `stash` nào được thực hiện.

---

## 9. XÁC NHẬN PHẠM VI THAY ĐỔI (COMPLIANCE VERIFICATION)

| Tiêu Chí Tuân Thủ | Yêu Cầu Chỉ Thị | Kết Quả Thực Hiện | Trạng Thái |
|---|---|---|:---:|
| Định vị Di sản số | Bắt buộc xác lập chuẩn UNESCO 2003 | Đã thể hiện xuyên suốt Phần 1, 2, 4, 11 | **ĐẠT** |
| Trục điều phối P1–P6 | Mọi task/stage phải ánh xạ về P1–P6 | Đã ánh xạ 100% tại Phần 2, 5, 6 | **ĐẠT** |
| Bảo toàn Task ID cũ | Giữ nguyên TASK-01 đến TASK-23 | Đã giữ đủ 23 task ID và ánh xạ chi tiết | **ĐẠT** |
| Quyết định chưa duyệt | Giữ nguyên PENDING HUMAN DECISION | DEC-03, 04, 05, 07 giữ nguyên trạng thái chờ | **ĐẠT** |
| Bảo toàn Human Gates | Giữ nguyên quyền phê duyệt của Tuấn | GATE-01 đến GATE-06 nguyên vẹn | **ĐẠT** |
| Phạm vi can thiệp file | Chỉ sửa duy nhất `MASTER_COMPLETION_PLAN.md` | Đã kiểm tra Git status xác nhận | **ĐẠT** |

---

## 10. NHỮNG VẤN ĐỀ CẦN TUẤN VÀ EMARALD QUYẾT ĐỊNH TIẾP THEO

1. **Phê duyệt Bản Kế Hoạch Tái Cấu Trúc Master Plan v2.0 (`AUDIT/MASTER_COMPLETION_PLAN.md`):**  
   Kính đề nghị Tuấn và Emarald thẩm định nội dung tệp kế hoạch vừa cập nhật và ban hành quyết định phê duyệt chính thức tại chốt chặn **`GATE-01`**.
2. **Cho phép chuyển từ chế độ DOCUMENT EDITING sang IMPLEMENTATION:**  
   Sau khi phê duyệt Master Plan v2.0, cho phép AGY bắt đầu triển khai **Stage 1 (Khôi phục trải nghiệm công khai)**:
   - Thực hiện `TASK-01`, `TASK-02`, `TASK-03`, `TASK-05` (Vá an ninh cấp bách mã nguồn).
   - Thực hiện `TASK-06B` (Cấu hình Vercel Rewrite giải quyết dứt điểm lỗi 404 cho `/login`, `/me`).
   - Thực hiện `TASK-06C` (Hiển thị 20 bài viết tư liệu MẠCH trên web live).

---

**TRẠNG THÁI HIỆN TẠI:**  
AGY đã hoàn tất toàn bộ công tác tái cấu trúc tài liệu, **DỪNG LẠI Ở CHẾ ĐỘ READ-ONLY**, và kính chờ sự thẩm định từ Tuấn và Emarald!

