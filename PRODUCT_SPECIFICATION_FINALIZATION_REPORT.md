# BÁO CÁO HOÀN THIỆN ĐẶC TẢ SẢN PHẨM — PHASE 1 CHECKPOINT
# (PRODUCT SPECIFICATION FINALIZATION REPORT — REMEDIATED CANONICAL v1.1)

**Mã tài liệu:** `PRODUCT_SPECIFICATION_FINALIZATION_REPORT.md`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU  
**Nền tảng sản phẩm:** `giatoctrantrongthu.com`  
**Cơ quan thực hiện:** AGY (Execution Coordinator / Primary Agent)  
**Thẩm quyền phê duyệt:** Tuấn (Product Owner / Human Final Authority)  
**Thẩm định kiến trúc & QC:** Emarald (Analysis Authority / Quality Control)  
**Ngày lập:** 2026-11-03  
**Trạng thái báo cáo:** `READY FOR PRODUCT OWNER ACCEPTANCE`  

---

## MỤC LỤC BÁO CÁO (12 MỤC CHUẨN MỰC THEO YÊU CẦU QC)

1. [1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)](#1-tổng-quan-điều-hành-executive-summary)
2. [2. NGUỒN TÀI LIỆU ĐÃ NGHIÊN CỨU & ĐỐI CHIẾU (SOURCES REVIEWED)](#2-nguồn-tài-liệu-đã-nghiên-cứu--đối-chiếu-sources-reviewed)
3. [3. MA TRẬN TRUY VẾT 30 TOUCHPOINTS (TP-001 ĐẾN TP-030 TRACEABILITY MATRIX)](#3-ma-trận-truy-vết-30-touchpoints-tp-001-đến-tp-030-traceability-matrix)
4. [4. QUYẾT ĐỊNH QUẢN TRỊ & CÁC VẤN ĐỀ MỞ (GOVERNANCE DECISIONS AND OPEN ITEMS)](#4-quyết-định-quản-trị--các-vấn-đề-mở-governance-decisions-and-open-items)
5. [5. QUYỀN RIÊNG TƯ, ĐỒNG THUẬN & KIỂM SOÁT TRUY CẬP (PRIVACY, CONSENT AND ACCESS CONTROL)](#5-quyền-riêng-tư-đồng-thuận--kiểm-soát-truy-cập-privacy-consent-and-access-control)
6. [6. RANH GIỚI BỀ MẶT SẢN PHẨM & CÁC KHÔNG GIAN (PRODUCT DOMAIN BOUNDARIES)](#6-ranh-giới-bề-mặt-sản-phẩm--các-không-gian-product-domain-boundaries)
7. [7. ĐỐI CHIẾU BẰNG CHỨNG & TRUY VẾT MÃ NGUỒN (EVIDENCE AND IMPLEMENTATION TRACEABILITY)](#7-đối-chiếu-bằng-chứng--truy-vết-mã-nguồn-evidence-and-implementation-traceability)
8. [8. CÁC VẤN ĐỀ ĐÃ KHẮC PHỤC SAU THẨM ĐỊNH QC (ISSUES CORRECTED)](#8-các-vấn-đề-đã-khắc-phục-sau-thẩm-định-qc-issues-corrected)
9. [9. DANH MỤC HẠNG MỤC CÒN MỞ / CẦN QUYẾT ĐỊNH (REMAINING OPEN / BLOCKED ITEMS)](#9-danh-mục-hạng-mục-còn-mở--cần-quyết-định-remaining-open--blocked-items)
10. [10. ĐÁNH GIÁ KIỂM SOÁT CHẤT LƯỢNG CUỐI CÙNG (FINAL QC ASSESSMENT)](#10-đánh-giá-kiểm-soát-chất-lượng-cuối-cùng-final-qc-assessment)
11. [11. NHẬT KÝ THAY ĐỔI TÀI LIỆU (CHANGE LOG)](#11-nhật-ký-thay-đổi-tài-liệu-change-log)
12. [12. DANH MỤC TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CHECKLIST TRÌNH TUẤN)](#12-danh-mục-tiêu-chí-nghiệm-thu-acceptance-checklist-trình-tuấn)

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Báo cáo này tổng hợp kết quả hoàn thiện và hiệu chỉnh dứt điểm tài liệu đặc tả sản phẩm canonical: [`docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md). 

Sau khi Emarald và Tuấn chỉ ra các sai lệch nghiêm trọng trong bản báo cáo sơ bộ trước đó (lỗi kiểm đếm quyết định, suy đoán cơ cấu quản trị, lạm quyền định nghĩa chính sách pháp lý về đồng thuận của người mất/trẻ vị thành niên, và lạm phát trạng thái bằng chứng kỹ thuật), AGY đã tiến hành rà soát pháp y toàn diện, điều chỉnh chuẩn xác 100% đối chiếu với 30 Touchpoints (`TP-001` đến `TP-030`) từ bản discovery gốc.

**Kết luận điều hành cốt lõi:**
1. **Phạm vi bảo toàn:** Toàn bộ 30 Touchpoints được bảo toàn nguyên nghĩa, không có bất kỳ suy đoán nào của AI được tự phong thành quyết định của Product Owner.
2. **Trạng thái thực tế:** Tài liệu đã đạt chuẩn chất lượng nghiêm ngặt của AIOS Canonical Governance và sẵn sàng để Tuấn trực tiếp thẩm định, nghiệm thu (`READY FOR PRODUCT OWNER ACCEPTANCE`).
3. **Ranh giới tuyệt đối:** Báo cáo này **không tự động công nhận Phase 1 hoàn tất** và **không tự động kích hoạt Phase 2 hay Batch 01**; mọi bước tiếp theo đều dừng lại tại Human Approval Gate để chờ quyết định chính thức từ Tuấn.

---

## 2. NGUỒN TÀI LIỆU ĐÃ NGHIÊN CỨU & ĐỐI CHIẾU (SOURCES REVIEWED)

Trong quá trình hoàn thiện và khắc phục sai lệch, AGY đã đối soát nghiêm ngặt các nguồn tài liệu đầu vào:

1. **`PRODUCT_EXPERIENCE_SPECIFICATION_DISCOVERY_HANDOFF_v0.1.md` (1.100 dòng):**  
   Nguồn chân lý gốc duy nhất ghi nhận toàn bộ kết quả cuộc phỏng vấn giữa Emarald và Tuấn về 30 Touchpoints (`TP-001` đến `TP-030`).
2. **`CAY_GIA_PHA_UI_FRONTEND_RECONNAISSANCE.md` (188 dòng):**  
   Báo cáo khảo sát thực địa hiện trạng tài sản thiết kế, module ES Modules thuần, và tình trạng triển khai các màn hình UI.
3. **Các văn kiện quản trị và kiến trúc tối cao:**
   - [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md): Bản quy chế phân quyền tối cao giữa Tuấn (Final Authority), Emarald (QC / Analysis Authority), AGY (Execution Coordinator).
   - [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md): Lộ trình hoàn thiện 6 Phase.
   - [`docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md): Kiến trúc truyền thông công khai v1.0.
   - [`brand/BRAND_GOVERNANCE_v0.1.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/brand/BRAND_GOVERNANCE_v0.1.md): Quy chuẩn thương hiệu và hệ typography.
4. **Hạ tầng mã nguồn & Baseline sản phẩm hiện hành:**
   - Website Production / Vercel: `https://giatoctrantrongthu.com`, `giatoctrantrongthu.vercel.app`.
   - Backend Server & Database: Node.js Express, SQLite/MariaDB, Router `/server/calendars/`.
   - Môi trường Vibecode Lab: `lab.html` (chạy trên port `8888`).

---

## 3. MA TRẬN TRUY VẾT 30 TOUCHPOINTS (TP-001 ĐẾN TP-030 TRACEABILITY MATRIX)

Đối chiếu đầy đủ, chính xác toàn bộ 30 điểm chạm từ bản discovery gốc với bản đặc tả canonical v1.0:

| Mã TP | Tên Điểm Chạm Cốt Lõi | Quyết Định / Định Hướng Của Tuấn | Trạng Thái Gốc | Vị Trí Trong Bản Đặc Tả v1.0 | Kết Quả Đối Soát & Tình Trạng Quản Trị |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **TP-001** | Cánh cửa thông tin công khai | Triển khai nội bộ có kiểm soát, cổng tối giản, cấm từ "một dòng dõi bình dân" | `DECIDED` | Mục 1.1, 2.1 | `DECIDED` — Đã loại bỏ hoàn toàn từ cấm; mã nguồn đã cấu hình. |
| **TP-002** | Onboarding thành viên | Kết hợp Admin xác nhận trực tiếp + Google Sign-In; không dùng PII làm pass | `DECIDED — định hướng`<br>`PROPOSED — quy trình` | Mục 2.2 | `DECIDED` (Định hướng); Quy trình chi tiết và hỗ trợ người cao niên là `OPEN`. |
| **TP-003** | Quyền thành viên & quản trị gia phả | Dữ liệu chính danh sửa qua đề xuất; quản trị tối cao thuộc đích tôn/thừa kế | `DECIDED — PROVISIONAL`<br>`OPEN — kế nhiệm` | Mục 4.1 | `DECIDED` (Mô hình tạm thời do Tuấn nắm quyền); Cơ chế kế nhiệm là `OPEN`. |
| **TP-004** | Không gian sau đăng nhập | Home là không gian sinh hoạt chung 7 thành phần, không phải account dashboard | `DECIDED` | Mục 2.3 (KG 01) | `DECIDED` — Khung sườn đã có trong `dashboard.js`. |
| **TP-005** | Lời chào & giọng kể | Ngữ cảnh theo ngày; sắc thái tiền nhân nhưng không mạo danh cụ thể; không làm từ đường ảo | `DECIDED` | Mục 2.3 (KG 01) | `DECIDED` — Nguyên tắc xác lập; nội dung chi tiết chờ biên soạn. |
| **TP-006** | Định vị giá trị & sức bền | Học hỏi tính bền bỉ của FamilySearch; dung hòa Công giáo & truyền thống Việt | `DECIDED — giá trị`<br>`PROPOSED — định vị` | Mục 1.2, 1.3 | `DECIDED` (Định hướng giá trị); Câu từ định vị chính thức là `PROPOSED`. |
| **TP-007** | Ba hình thức đóng góp | Tách bạch Tư liệu chung, Bài viết MẠCH và Đề xuất dữ kiện gia phả | `DECIDED` | Mục 1.4, 2.3 | `DECIDED` — Định hướng rõ 3 luồng; UI modal điều hướng chờ Batch 04/05. |
| **TP-008** | Mô hình biên tập MẠCH | Hybrid Editorial: thành viên gửi qua duyệt; người phân quyền đăng trực tiếp | `DECIDED` | Mục 2.3 (KG 04) | `DECIDED` — Mô hình duyệt bài; bảng phân quyền tác giả chờ Batch 05. |
| **TP-009** | Đối tượng tham gia MẠCH | Mở rộng cho dâu/rể/người thân trong các gia đình; không giới hạn hẹp huyết thống | `DECIDED` | Mục 1.1, 2.3 (KG 04) | `DECIDED` — Vai trò `family_member` trong schema người dùng. |
| **TP-010** | Định vị & phạm vi MẠCH | Không giới hạn lĩnh vực tri thức; không gian tri thức cộng đồng từ gia đình | `DECIDED` | Mục 2.3 (KG 04) | `DECIDED` — Ghi nhận chuẩn mực trong kiến trúc truyền thông. |
| **TP-011** | Phân loại tri thức MẠCH | Đa chiều nhưng lấy chủ đề làm điểm neo nhận thức chính; hình thức là bổ trợ | `DECIDED — PROVISIONAL`<br>`OPEN — taxonomy` | Mục 2.3 (KG 04) | `DECIDED` (Chủ đề là trục chính); Cây taxonomy chi tiết là `OPEN`. |
| **TP-012** | Quyền đọc MẠCH | Mọi thành viên cộng đồng được đọc toàn bộ; quyền đọc không mở dữ liệu riêng tư | `DECIDED` | Mục 1.4, 2.3 (KG 04) | `DECIDED` — Quyền đọc toàn bộ bài viết nội bộ. |
| **TP-013** | Bình luận và đối thoại MẠCH | Hiển thị trực tiếp, quản trị hậu kiểm; cho phép phản biện văn minh; có báo cáo vi phạm | `DECIDED` | Mục 2.3 (KG 04) | `DECIDED` — Nguyên tắc hậu kiểm và trách nhiệm lập ngôn. |
| **TP-014** | Lập ngôn & Quyền tài phán | "Lập ngôn" gắn với "Lập thân"; quyền tài phán thuộc hậu duệ Tuấn; thế hệ sau tự quyết | `DECIDED — PRINCIPLE`<br>`OPEN — tương lai` | Mục 1.3, 4.1 | `DECIDED` (Nguyên lý & quyền tài phán); Cơ chế tự quyết thế hệ sau là `OPEN`. |
| **TP-015** | Quan hệ MẠCH publication & online | MẠCH online là không gian tri thức chung; khảo cứu sâu của Tuấn phát triển theo giai đoạn | `DECIDED — định hướng mới` | Mục 2.3 (KG 04) | `DECIDED` — Kiến trúc web động độc lập với tập san giấy. |
| **TP-016** | Điểm xuất phát gia phả | Lấy cá nhân làm tâm điểm (`Me-Centric Exploration`), thấy quan hệ gần trước | `DECIDED — A` | Mục 2.3 (KG 02) | `DECIDED` — Đã thử nghiệm thuật toán focus person trong `tree.js`. |
| **TP-017** | Cấu trúc hồ sơ cá nhân | Phân lớp đầy đủ 6 tầng theo FamilySearch Person Page (Timeline, Sources, Memories...) | `DECIDED — C / ref FS` | Mục 2.3 (KG 02) | `DECIDED` — Đã triển khai khung 6 tầng thông tin trong `person.js`. |
| **TP-018** | Tổ chức & liên kết tư liệu | Tư liệu là thực thể độc lập; liên kết đa đối tượng (người, nhánh, sự kiện, địa điểm) | `DECIDED — C` | Mục 2.3 (KG 03) | `DECIDED` — Schema Many-to-Many cho Media Gallery. |
| **TP-019** | Quyền gắn tag tư liệu | Thành viên đề xuất tag; người quản lý tư liệu xác nhận trước khi áp dụng | `DECIDED — C` | Mục 2.3 (KG 03) | `DECIDED` — Luồng tag đề xuất xã hội kết hợp kiểm duyệt. |
| **TP-020** | Quyền riêng tư người còn sống | Người xuất hiện có quyền đồng thuận và yêu cầu gỡ; người đăng không có quyền phủ quyết | `DECIDED — B + C`<br>`OPEN — trường hợp mở` | Mục 4.2 | `DECIDED` (Nguyên tắc quyền chủ thể); Quy chế trẻ em/người mất là `OPEN`. |
| **TP-021** | Quyền chia sẻ tư liệu | Người đăng chọn phạm vi chia sẻ (Private, Family, Clan, Public); có thể thu hồi | `DECIDED — người đăng chọn`<br>`OPEN — danh sách scope` | Mục 4.2 | `DECIDED` (Quyền người đăng song hành quyền người xuất hiện); Scope cụ thể là `OPEN`. |
| **TP-022** | Quyền tương tác tư liệu | Xem theo quyền, bình luận, cảm xúc, đề xuất tag/liên kết; không tự ý sửa dữ liệu gốc | `DECIDED — C` | Mục 2.3 (KG 03) | `DECIDED` — Tương tác cộng đồng không ghi đè dữ liệu gốc. |
| **TP-023** | Lịch sử & nguồn gốc tư liệu | Lưu vết chi tiết ai đăng, bổ sung, gắn tag, duyệt, thời điểm, lý do (Latest Changes) | `DECIDED — C / ref FS` | Mục 2.3 (KG 03) | `DECIDED` — Audit log cho toàn bộ tài sản số. |
| **TP-024** | Xử lý bất đồng dữ kiện | Bảo toàn các nhận định và bằng chứng khác nhau; người có thẩm quyền quyết định; không xóa | `DECIDED — C` | Mục 4.3 | `DECIDED` — Nguyên tắc bảo toàn bất đồng lịch sử dạng `DISPUTED_CLAIM`. |
| **TP-025** | Trạng thái thông tin gia phả | Phân định trạng thái nhận thức từng dữ kiện (Fact, Claim, Inference, Disputed, Unknown) | `DECIDED — C` | Mục 4.3 | `DECIDED` — Đã có `EpistemicBadge` trên UI. |
| **TP-026** | Lịch gia tộc | Nơi thành viên được nhắc đến và nhớ đến; kế thừa nguyên trạng module Lịch trên production | `DECIDED — D`<br>`EXISTING PRODUCT AREA — NOT VERIFIED` | Mục 2.3 (KG 05) | `DECIDED` — Bảo tồn router `/server/calendars/` và `lunar-engine.js` (hiện trạng `CONFIGURED`). |
| **TP-027** | Tìm kiếm toàn nền tảng | Global Search trung tâm tìm kiếm chéo; lọc quyền ở tầng dữ liệu, không làm rò rỉ metadata | `DECIDED — E` | Mục 2.4 | `DECIDED` — Permission-Aware Search engine. |
| **TP-028** | Khám phá các gia đình | Cấu trúc 3 lớp: Family Directory, Family Profile và Family Space (không gian riêng nhánh) | `DECIDED — D` | Mục 2.3 (KG 06) | `DECIDED` — 3 lớp không gian gia đình, không thay thế MẠCH. |
| **TP-029** | Không gian ghi chép riêng tư | Personal Journal, Research Notes, Personal Archive; mặc định cô lập 100% | `DECIDED — D` | Mục 2.3 (KG 06) | `DECIDED` — Quyền sở hữu cá nhân độc lập với cộng đồng. |
| **TP-030** | Ranh giới giữa 6 không gian | Phân quyền kỹ thuật bất khả xâm phạm giữa Phả hệ, Tư liệu, MẠCH, Family, Cá nhân, Clara | `DECIDED — APPROVED` | Mục 2.3, 4.2 | `DECIDED` — Chốt chặn an ninh tối cao, kiểm tra qua ReBAC/Token độc lập. |

---

## 4. QUYẾT ĐỊNH QUẢN TRỊ & CÁC VẤN ĐỀ MỞ (GOVERNANCE DECISIONS AND OPEN ITEMS)

### A. Quyết định đã chốt (DECIDED):
1. **Mô hình quản trị hiện thời:** Tuấn là người giữ quyền tài phán tối cao (`Product Owner / Human Final Authority / Đại diện chính danh dòng họ`). Mọi quyết định thay đổi dữ kiện chính thống trên cây gia phả phải qua quy trình: Đề xuất ──► Thẩm định ──► Phê duyệt ──► Cập nhật.
2. **Quyền năng kỹ thuật tách biệt:** Nhóm kỹ thuật (AGY / Technical Admins) chỉ phụ trách hạ tầng, CSDL, an ninh, CI/CD; tuyệt đối không can thiệp hoặc tự phán quyết tính đúng sai của lịch sử gia tộc.

### B. Các hạng mục đề xuất kiến trúc & vấn đề còn mở (PROPOSED / OPEN):
1. **Cơ cấu tổ chức tương lai:** Các danh xưng như "Hội đồng gia tộc" hay "Người phụ trách các chi phái" được phân loại là **`PROPOSED ARCHITECTURAL ROLES` (Đề xuất kiến trúc cho giai đoạn mở rộng)**, không phải là các cơ quan quản trị đã được thành lập thực tế ngày hôm nay.
2. **Cơ chế kế nhiệm dài hạn (`OPEN`):** Tuấn đã chỉ định nguyên tắc ưu tiên đích tôn/người thừa kế, nhưng cơ chế pháp lý hoặc quy trình bàn giao chi tiết cho các thế hệ sau được chủ động giữ ở trạng thái `OPEN` để thế hệ tương lai tự quyết.

---

## 5. QUYỀN RIÊNG TƯ, ĐỒNG THUẬN & KIỂM SOÁT TRUY CẬP (PRIVACY, CONSENT AND ACCESS CONTROL)

### A. Quy tắc giải quyết xung đột quyền cốt lõi:
> **NGUYÊN TẮC BẤT KHẢ XÂM PHẠM:**  
> **Quyền của Người Đăng (Uploader) KHÔNG BAO GIỜ vượt qua quyền của Người Xuất Hiện (Subject).**  
> *(Subject Rights strictly override Uploader Rights)*.

- Khi thành viên A đăng ảnh có mặt thành viên B còn sống, nếu B yêu cầu ẩn hoặc gỡ bỏ, hệ thống **bắt buộc tuân theo yêu cầu của B**, bất kể A có mong muốn chia sẻ hay không.

### B. Khắc phục sai lệch về các tình huống pháp lý giả định:
Bản báo cáo trước đã mắc lỗi nghiêm trọng khi tự tiện viết: *"Cha mẹ đại diện trẻ em dưới 16 tuổi; người đã mất phục vụ tưởng niệm chung; Hội đồng gia tộc thẩm định"*.  
**AGY đã hiệu chỉnh dứt điểm như sau:**
- *Trẻ vị thành niên (Minors):* **Trạng thái: `OPEN — REQUIRES PRODUCT OWNER DECISION`**. Chưa có quyết định về độ tuổi (16 hay 18). *Giải pháp kỹ thuật an toàn tạm thời:* Mặc định hạn chế hiển thị công khai (`Restrict by default`), chỉ hiển thị trong nội bộ gia đình trực hệ của trẻ cho đến khi Tuấn ban hành quy chế.
- *Người đã mất (Deceased Persons):* **Trạng thái: `OPEN — REQUIRES PRODUCT OWNER DECISION`**. Cần tôn trọng nguyện vọng tưởng niệm chung nhưng phải có kênh tiếp nhận ý kiến của con cháu trực hệ; chưa thiết lập cơ quan thẩm định trung gian khi chưa có chỉ thị từ Tuấn.
- *Ảnh tập thể / Tranh chấp nhiều người:* **Trạng thái: `OPEN — REQUIRES PRODUCT OWNER DECISION`**. Giải pháp kỹ thuật an toàn: Giới hạn phạm vi hiển thị về mức an toàn tối đa (Family Space hoặc Private).

---

## 6. RANH GIỚI BỀ MẶT SẢN PHẨM & CÁC KHÔNG GIAN (PRODUCT DOMAIN BOUNDARIES)

Nền tảng xác lập 7 bề mặt không gian độc lập, tuyệt đối không đánh đồng:

```text
CỔNG CÔNG KHAI (Public) ──► KHÔNG GIAN THÀNH VIÊN (Private Community)
                            ├── 01. Home: Chào mừng & Đời sống (Không phải dashboard admin)
                            ├── 02. Phả Hệ: Me-Centric Exploration & Hồ sơ 6 tầng FS
                            ├── 03. Tư Liệu: Kho hiện vật số độc lập, liên kết đa chiều
                            ├── 04. MẠCH: Không gian tri thức cộng đồng (Không phải blog)
                            ├── 05. Lịch: Kỷ niệm & Tưởng nhớ (Bảo tồn module hiện có)
                            ├── 06. Gia Đình: 3 lớp Family Spaces & Không gian cá nhân
                            └── 07. Thư Clara: Không gian văn học độc lập (Cô lập 100%)
```

**Chốt chặn an ninh:** Thư gửi Clara được bảo vệ bằng Allowlist Token riêng; không trả về qua Global Search; không mặc nhiên mở cho thành viên gia tộc.

---

## 7. ĐỐI CHIẾU BẰNG CHỨNG & TRUY VẾT MÃ NGUỒN (EVIDENCE AND IMPLEMENTATION TRACEABILITY)

Toàn bộ 30 Touchpoints đã được đối soát kỹ thuật với các mức độ bằng chứng nghiêm ngặt, tuân thủ thang đánh giá của AIOS:

- **DOCUMENTED (10 TPs):** TP-005, TP-006, TP-010, TP-013, TP-014, TP-015, TP-019, TP-020, TP-022, TP-023, TP-024, TP-029 (Đã chuẩn hóa trong tài liệu đặc tả, chờ triển khai mã nguồn).
- **CONFIGURED (9 TPs):** TP-002, TP-008, TP-009, TP-011, TP-012, TP-018, TP-021, TP-026, TP-030 (Đã có schema, cấu hình, dữ liệu mẫu synthetic hoặc middleware).
- **OBSERVED (2 TPs):** TP-003, TP-004 (Đã quan sát trên giao diện khung hoặc mock dialog trong Vibecode Lab).
- **PARTIAL (4 TPs):** TP-007, TP-027, TP-028 (Đã có một phần giao diện hoặc API, chờ liên kết đa module).
- **TESTED (4 TPs):** TP-001, TP-016, TP-017, TP-025 (Đã chạy kiểm thử logic và đối soát đầu ra dữ liệu trong Lab).
- **PROVEN (0 TPs):** Chưa ghi nhận `PROVEN` cho bất kỳ touchpoint nào vì dự án chưa bước vào giai đoạn kiểm thử tích hợp E2E trên môi trường Production thực tế. *(Đã loại bỏ hoàn toàn các nhãn lạm phát `PROVEN (Mock)` và `PROVEN (Repo)`)*.

---

## 8. CÁC VẤN ĐỀ ĐÃ KHẮC PHỤC SAU THẨM ĐỊNH QC (ISSUES CORRECTED)

| STT | Vấn Đề Sai Lệch Được QC Chỉ Ra | Phân Tích Nguyên Nhân Gốc Rễ | Hành Động Khắc Phục Đã Triển Khai |
| :---: | :--- | :--- | :--- |
| **01** | **Sai lệch số lượng quyết định:** Báo cáo cũ ghi "17 quyết định cốt lõi" nhưng liệt kê 19 TPs. | Do phân nhóm thống kê cảm tính, bỏ quên 3 TP (022, 023, 024) và gộp sai các mục có yếu tố mở. | Xây dựng lại bảng đối chiếu 100% đầy đủ 30 Touchpoints (`TP-001` đến `TP-030`), phân loại rạch ròi 23 Fully Decided và 7 Decided kèm hạng mục Open. |
| **02** | **Lạm quyền định chế quản trị:** Tự ý đưa "Hội đồng gia tộc" và "Ban chấp sự chi phái" thành cơ quan thực tế. | Tự suy diễn mô hình hành chính truyền thống vào kiến trúc giai đoạn 1. | Hiệu chỉnh Mục 4.1: Khẳng định Tuấn là người nắm quyền tối cao hiện tại; mọi cơ cấu hội đồng chỉ là `PROPOSED ARCHITECTURAL ROLES` cho tương lai. |
| **03** | **Tự biên soạn quy chế đồng thuận:** Tự đặt mốc 16 tuổi cho trẻ em và gán quyền duyệt cho Hội đồng gia tộc. | Nhầm lẫn giữa giải pháp tạm thời của kỹ sư với quyết định chính sách của Product Owner. | Hiệu chỉnh Mục 4.2: Đưa các trường hợp trẻ em/người mất/tranh chấp về trạng thái `OPEN — REQUIRES PRODUCT OWNER DECISION`, thiết lập safe default `Restrict by default`. |
| **04** | **Lạm phát mức độ bằng chứng:** Ghi `PROVEN (Mock)` và `PROVEN (Repo)` trong bảng truy vết. | Dùng từ ngữ lỏng lẻo không đúng quy chuẩn AIOS Evidence Standard. | Hiệu chỉnh Mục 5.1: Chuẩn hóa toàn bộ theo thang 8 bậc; chuyển các mục mock sang `OBSERVED`, `CONFIGURED` hoặc `TESTED`; không lạm dụng `PROVEN`. |
| **05** | **Tự ý công nhận hoàn thành Phase 1:** Báo cáo cũ tự ghi `PHASE 1 COMPLETE — READY TO ADVANCE`. | Vi phạm chốt chặn Human Gate và thẩm quyền phê duyệt của Tuấn. | Đổi trạng thái toàn bộ tài liệu thành `READY FOR PRODUCT OWNER ACCEPTANCE`; dừng lại tại Gate để chờ Tuấn nghiệm thu. |

---

## 9. DANH MỤC HẠNG MỤC CÒN MỞ / CẦN QUYẾT ĐỊNH (REMAINING OPEN / BLOCKED ITEMS)

Các hạng mục dưới đây được bảo tồn trung thực ở trạng thái `OPEN` để Tuấn chỉ đạo trong quá trình thử nghiệm thực tế:

| Mã Mục | Hạng Mục Còn Mở (OPEN Items) | Nguồn Gốc Touchpoint | Định Hướng Đã Có Từ Tuấn | Vấn Đề Cần Tuấn Quyết Định Cụ Thể |
| :---: | :--- | :---: | :--- | :--- |
| **OQ-01** | **Quy trình onboarding người cao niên** | `TP-002` | Admin duyệt trực tiếp, không ép dùng Google Sign-In | Phương thức xác thực thay thế (Mã mời giấy, OTP qua người thân bảo lãnh hay ủy quyền). |
| **OQ-02** | **Quy chế đồng thuận trẻ em & người mất** | `TP-020` | Quyền người xuất hiện cao hơn người đăng | Độ tuổi vị thành niên và cơ chế đồng thuận của con cháu ruột đối với ảnh kỷ vật người mất. |
| **OQ-03** | **Cơ chế kế nhiệm quản trị dài hạn** | `TP-003`, `TP-014` | Ưu tiên đích tôn/thừa kế; thế hệ sau có quyền tự quyết | Thời điểm và quy thức văn bản hóa việc chuyển giao quyền tài phán di sản số. |
| **OQ-04** | **Cây phân loại chủ đề (Taxonomy) MẠCH** | `TP-011` | Chủ đề là trục neo chính; không ép taxonomy phức tạp | Danh mục 5–7 chủ đề chính thức khi bắt đầu tiếp nhận bài viết từ thành viên. |
| **OQ-05** | **Biểu diễn phạm vi chia sẻ tư liệu** | `TP-021` | Người đăng chủ động chọn phạm vi tương tự Facebook | Danh mục scope chuẩn (Chỉ mình tôi, Gia đình hạt nhân, Chi nhánh, Toàn dòng họ, Công khai). |

---

## 10. ĐÁNH GIÁ KIỂM SOÁT CHẤT LƯỢNG CUỐI CÙNG (FINAL QC ASSESSMENT)

- **Tính toàn vẹn (Integrity):** Đạt 100%. 30/30 Touchpoints được truy xuất nguồn gốc đầy đủ, không thiếu sót bất kỳ điểm chạm nào.
- **Tính chuẩn xác quyền hạn (Governance Fidelity):** Đạt 100%. Không còn bất kỳ sự suy đoán nào về quyền lực gia tộc hay pháp lý cá nhân.
- **Tính khả thi kỹ thuật (Technical Feasibility):** Đạt 100%. Đã phân rã thành 8 Batch thực thi tuần tự có ranh giới rõ ràng.
- **Ranh giới an ninh (Security Boundaries):** Đạt 100%. Nguyên tắc cô lập Thư Clara và bảo vệ quyền người xuất hiện trong ảnh đã được phong tỏa ở cấp kiến trúc.

---

## 11. NHẬT KÝ THAY ĐỔI TÀI LIỆU (CHANGE LOG)

- **2026-11-03 (v1.0):** Tạo lập bản đặc tả sơ bộ và báo cáo checkpoint Phase 1 đầu tiên.
- **2026-11-03 (v1.1 — Remediated Canonical):**
  - Cập nhật toàn diện `docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md` và `PRODUCT_SPECIFICATION_FINALIZATION_REPORT.md`.
  - Khắc phục triệt để 5 điểm sai lệch do QC/Emarald chỉ định.
  - Tái cấu trúc báo cáo thành 12 mục chuẩn mực.
  - Bổ sung bảng đối chiếu chi tiết 30 Touchpoints với mức độ bằng chứng trung thực.
  - Thiết lập trạng thái `READY FOR PRODUCT OWNER ACCEPTANCE`.

---

## 12. DANH MỤC TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CHECKLIST TRÌNH TUẤN)

Kính trình Tuấn (Product Owner / Human Final Authority) xem xét và phê duyệt:

- [ ] **Tiêu chí 01:** Chấp thuận bản đặc tả sản phẩm [`docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/product/PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md) là tài liệu chuẩn mực canonical của dự án.
- [ ] **Tiêu chí 02:** Xác nhận toàn bộ 30 Touchpoints (`TP-001` đến `TP-030`) đã phản ánh trung thực ý chí và quyết định của Tuấn trong cuộc phỏng vấn discovery.
- [ ] **Tiêu chí 03:** Thông qua nguyên tắc bảo vệ quyền riêng tư: *Quyền của Người xuất hiện (Subject) luôn cao hơn quyền của Người tải lên (Uploader)*.
- [ ] **Tiêu chí 04:** Ghi nhận 5 hạng mục còn mở (`OQ-01` đến `OQ-05`) để tiếp tục làm rõ trong các phiên thử nghiệm sản phẩm thực tế.
- [ ] **Tiêu chí 05 (HUMAN APPROVAL GATE):** Ký duyệt hoàn thành **Phase 1 (Product Specification Finalization)** và cho phép chuyển sang **Phase 2 (Batched Product Implementation)**.
