# ĐẶC TẢ KIẾN TRÚC SẢN PHẨM MỤC TIÊU (PHASE 2D - PART 3)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Architecture:** AGY (Chief Orchestrator & Integration Authority)  
**Tài liệu tham chiếu:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md), `AUDIT/FAMILYSEARCH-REFERENCE-MAP.md`  
**Thời điểm hoàn thành:** 06/11/2026  

---

## 1. NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC MỤC TIÊU (CORE ARCHITECTURAL PRINCIPLES)

1. **Bảo Tồn Tuyệt Đối Kiến Trúc PUBLIC/MẠCH Hiện Hữu:**
   - Trang nhất đối ngoại (`#/`) và Tạp chí MẠCH (`#/mach`) là bộ mặt văn hóa không thể xâm phạm của dòng họ. Kiến trúc mới không thay thế, không làm xáo trộn mà đóng vai trò hậu phương vững chắc cung cấp dữ liệu an toàn.
2. **Kiến Trúc Hướng Module Hóa Cao Độ (High Cohesion & Low Coupling):**
   - Mọi phân hệ nghiệp vụ phả hệ phải được đóng gói thành các Pure Domain Cores độc lập, giao tiếp với bên ngoài qua hợp đồng giao diện rõ ràng (APIs / Services), không phụ thuộc vào hạ tầng hiển thị.
3. **Cơ Chế Phân Quyền Huyết Thống Đa Tầng (Relational Identity & ReBAC):**
   - Quyền hạn của người dùng được xác định dựa trên vị trí huyết thống thực tế của họ trên Cây Gia Phả (Relationship-Based Access Control), bảo đảm sự tôn nghiêm và tính bảo mật của từng chi nhánh gia đình.

---

## 2. BỐN NHÓM MODULE CỐT LÕI CỦA KIẾN TRÚC MỤC TIÊU

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TỔNG THỂ KIẾN TRÚC SẢN PHẨM MỤC TIÊU                            │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ 1. CORE GENEALOGY        │ 2. EVIDENCE & KNOWLEDGE  │ 3. USER EXPERIENCE (UX)          │
│   ├── Person             │   ├── Sources & Citation │   ├── 6-Layer Person Profile     │
│   ├── Relationship       │   ├── Primary Evidence   │   ├── 3-Tier Me-Centric Tree     │
│   ├── Family Unit        │   ├── Media Archive (185)│   ├── Archival List Search       │
│   ├── Branch / Lineage   │   ├── Editorial (MẠCH)   │   ├── Ancestral Lunar Calendar   │
│   ├── Life Events        │   └── Clara Letters (8)  │   └── Family Timeline & Map      │
│   └── Places & Geography │                          │                                  │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ 4. GOVERNANCE & CONTROL (ADMIN CONTROL CENTER v2.1)                                    │
│   ├── Identity Mapping & ReBAC Engine     ├── Proposal Review Lifecycle (TP-003)       │
│   ├── Privacy Protection & PII Conceal    ├── Dispute & Resolution Engine (TP-024)     │
│   ├── Anti-CSRF & Security Boundaries     └── Audit Log & Safe Rollback Engine         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### PHÂN HỆ 1: CORE GENEALOGY (LÕI PHẢ HỆ HỌC)

#### 1.1 Module Person (Cá Nhân)
- **Trách nhiệm nghiệp vụ:** Quản lý danh tính phả hệ của từng thành viên trong dòng họ (223 cá nhân hiện hữu).
- **Sở hữu dữ liệu:** Bảng `people` trong CSDL SQLite (`id`, `name`, `gender`, `birth_date`, `death_date`, `status`, `payload`).
- **Phụ thuộc:** `domain/genealogy`.
- **Ranh giới API / UI:** `GET /api/people/:id`, `PATCH /api/people/:id` (Admin); kết xuất thẻ nhân vật và trang chi tiết.
- **Yêu cầu bảo mật:** Không hiển thị ngày sinh/ngày mất của người còn sống cho khách vãng lai.
- **Yêu cầu kiểm thử:** Kiểm tra bóc tách niên đại GEDCOM không bị lỗi parse; kiểm tra tính toán tuổi thọ chính xác.

#### 1.2 Module Relationship & Kinship (Quan Hệ & Thân Tộc)
- **Trách nhiệm nghiệp vụ:** Xác định liên kết hôn phối, liên kết cha-con, tính toán xưng hô chuẩn mực theo phong tục Việt Nam.
- **Sở hữu dữ liệu:** Bảng `families` và `edges`.
- **Phụ thuộc:** `domain/kinship`.
- **Ranh giới API / UI:** `DataService.kinshipPath(fromId, toId)`; hiển thị nhãn thế hệ (F0 $\to$ F4) và danh xưng (Bác, Chú, Cô, Dì...).
- **Yêu cầu kiểm thử:** 100% người trong cùng huyết thống tính được đường đi BFS về Cố Thu (`@I1@`).

#### 1.3 Module Family Unit (Đơn Vị Gia Đình Hạt Nhân)
- **Trách nhiệm nghiệp vụ:** Quản lý các cuộc hôn nhân (đơn hôn, đa thê, tái giá) và danh sách con cái theo từng người vợ/chồng.
- **Sở hữu dữ liệu:** Bảng `families` (68 gia đình hiện hữu).
- **Ranh giới:** Đảm bảo không nhầm lẫn con của vợ cả và vợ thứ trong các trường hợp lịch sử (`@I18@`, `@I32@`).

---

### PHÂN HỆ 2: EVIDENCE & KNOWLEDGE (KHO CHỨNG CỨ & TRI THỨC)

#### 2.1 Module Sources & Evidence (Tư Liệu Chứng Cứ Gốc)
- **Trách nhiệm nghiệp vụ:** Lưu trữ bản chụp văn tự chữ Nho, gia phả Hán Nôm, trích lục khai sinh, văn khế điền thổ, ảnh bia mộ làm bằng chứng cho các sự kiện sinh/tử.
- **Sở hữu dữ liệu:** Bảng `media` (loại `document`, `grave`) và bảng liên kết `evidence_links`.
- **Ranh giới:** Tích hợp trực tiếp vào Tầng 3 (Evidence) của Hồ sơ 6 tầng.

#### 2.2 Module Editorial & Publication (Ấn Phẩm MẠCH)
- **Trách nhiệm nghiệp vụ:** Quản lý không gian xuất bản các bài viết văn hóa, lịch sử và kỷ niệm dòng họ.
- **Sở hữu dữ liệu:** Tệp `data/mach.json` (12 bài công khai) và bảng `stories`.
- **Nguyên tắc an ninh:** Phân tách độc lập hoàn toàn khỏi Thư riêng tư Clara. 0 bài Clara nào được phép lọt vào luồng MẠCH.

#### 2.3 Module Sacred Private Space (Thư Riêng Tư Gửi Clara)
- **Trách nhiệm nghiệp vụ:** Lưu giữ 8 bức thư tâm huyết của Bác Tuấn gửi cháu gái Clara thuộc nhánh ông bà Hạnh Đào.
- **Sở hữu dữ liệu:** Tệp `data/private/clara.json`.
- **Cơ chế bảo mật P0:** Bảo vệ bằng token máy chủ, regex chặn tĩnh, chỉ tài khoản thuộc nhánh `A-HD` mới có quyền đọc.

---

### PHÂN HỆ 3: USER EXPERIENCE (TRẢI NGHIỆM NGƯỜI DÙNG ĐỒNG BỘ)

#### 3.1 6-Layer Person Profile (Hồ Sơ Nhân Vật 6 Tầng)
- **Trách nhiệm:** Trình diễn toàn diện cuộc đời một nhân vật qua 6 tầng mạch lạc:
  1. *Căn cước (Identity):* Tên gọi, danh xưng, năm sinh, năm mất, chân dung đại diện.
  2. *Thân tộc (Relations):* Bậc phụ mẫu, hôn phối, hậu duệ, vị trí thế hệ F0-F4.
  3. *Tư liệu (Evidence):* Văn bản chứng thực, ảnh chụp bia mộ, tài liệu lịch sử.
  4. *Ký ức (Memories):* Hồi ký, giai thoại, đoạn ghi âm, kỷ niệm gia đình.
  5. *Tranh biện (Disputes TP-024):* Ghi chú các dị bản, giả thuyết lịch sử đang thảo luận.
  6. *Đề xuất (Proposals TP-003):* Biểu mẫu nộp ý kiến hiệu đính cho Ban Quản Trị.

#### 3.2 3-Tier Me-Centric Tree (Cây Phả Đồ 3 Thế Hệ)
- **Trách nhiệm:** Cho phép con cháu khám phá cây gia phả xuất phát từ chính mình hoặc một nhân vật được chọn làm tâm điểm.
- **Thiết kế:**
  - *Tier 1:* Bậc Phụ Mẫu (2 thẻ cha mẹ kèm nút đặt làm đương sự).
  - *Tier 2:* Đương Sự & Hôn Phối (Thẻ nổi bật ở giữa màn hình kèm nút xem hồ sơ 6 tầng).
  - *Tier 3:* Hậu Duệ Trực Hệ (Các thẻ con cái kèm nút mở rộng nhánh con cháu).
  - *Đường dẫn huyết thống (Breadcrumbs):* Hiển thị dòng dõi truyền nối liên tục từ Cố Thu đến đương sự.

#### 3.3 Ancestral Lunar Calendar (Lịch Âm Dương Gia Tộc)
- **Trách nhiệm:** Tự động đối soát và nhắc nhở ngày giỗ tổ, ngày giỗ các cụ theo lịch âm truyền thống, tích hợp danh sách sự kiện tròn năm (giỗ 50 năm, giỗ 100 năm).

---

### PHÂN HỆ 4: GOVERNANCE & CONTROL (TRUNG TÂM ĐIỀU HÀNH & BẢO MẬT)

#### 4.1 Identity Mapping & ReBAC Engine (Phân Quyền Dựa Trên Quan Hệ)
- **Trách nhiệm:** Ánh xạ tài khoản đăng nhập của người dùng vào một vị trí cá nhân trên Cây Phả Hệ (`identity_mappings`).
- **Ứng dụng:**
  - Hệ thống tự động biết người đang đăng nhập là con, cháu, hay em của ai để hiển thị danh xưng tôn ti chuẩn mực.
  - Tự động mở quyền truy cập các tư liệu riêng tư thuộc nhánh gia đình của mình.

#### 4.2 Proposal & Dispute Lifecycle (Vòng Đời Xử Lý Đề Xuất & Tranh Biện)
- **Quy trình chuẩn:**
  $$\text{Thành viên gửi đề xuất (Form TP-003)} \longrightarrow \text{Hộp thư chờ duyệt (Pending Inbox)} \longrightarrow \text{Ban Quản Trị thẩm định} \longrightarrow \text{Áp dụng vào CSDL hoặc Từ chối kèm lý do}$$
- **Tranh biện TP-024:** Cho phép lưu trữ song song nhiều giả thuyết lịch sử mà không phá vỡ tính toàn vẹn của phả hệ gốc.

#### 4.3 Anti-CSRF & Defense-in-Depth (Bảo Vệ Đa Tầng Toàn Diện)
- **Nhiệm vụ:**
  - Bổ sung middleware kiểm tra Anti-CSRF Token hoặc Double-Submit Cookie cho toàn bộ Express routes.
  - Đóng kín hai endpoint `/api/people` và `/api/genealogy.json` bằng middleware `requireAccount`.

---

## 3. TÍNH TƯƠNG THÍCH HOÀN HẢO VỚI PUBLIC/MẠCH HIỆN HỮU

Kiến trúc mục tiêu cam kết:
1. **Không phá vỡ Trang nhất đối ngoại (`index.html` / `public-home.js`):** Giữ nguyên vẹn 6 phân khu truyền thông đại chúng, thiết kế Masthead logo ngang và bảng màu di sản đỏ sơn mài `#8c1d1d`.
2. **Bảo tồn tính thiêng liêng của Cửa ngõ Gateway:** Khách ngoài họ truy cập các tuyến nội bộ chỉ thấy Thẻ Mời xác minh tư cách thành viên, bảo đảm 100% không rò rỉ dữ liệu.
3. **Ấn bản MẠCH hoạt động độc lập:** Tạp chí MẠCH tiếp tục là kênh xuất bản tri thức số chất lượng cao của dòng họ, vận hành song song và tương hỗ cùng Cây Phả Hệ.

