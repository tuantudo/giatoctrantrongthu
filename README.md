# GIATỘC — FAMILY DIGITAL INSTITUTION
**Hệ thống số hóa & Lưu trữ sống của Gia tộc Trần Trọng Thu**

Repository này chứa toàn bộ mã nguồn, dữ liệu phả hệ, tài liệu kiến trúc và tài nguyên quản trị của dự án **Cây Gia Phả — Gia tộc Trần Trọng Thu**.

---

## 1. BẢN ĐỒ ĐIỀU HƯỚNG DỰ ÁN (PROJECT SITEMAP)

```text
                                README.md (Bạn đang ở đây)
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
 [QUẢN TRỊ & THẨM QUYỀN]            [KẾ HOẠCH & TIẾN ĐỘ]                [THIẾT KẾ & TRI THỨC]
    AGENTS.md                    MASTER_COMPLETION_PLAN.md               BRAND_GOVERNANCE.md
    (Hệ thống AIOS)               (Lộ trình hoàn thành v4.0)               (Bộ nhận diện thương hiệu)
        │                                   │                                   │
        ├─ USER.md (Chỉ thị của Tuấn)       ├─ CANONICAL_DOCUMENT_REGISTRY.md   ├─ UI System vNEXT
        ├─ CONTRIBUTING.md (Quy trình)      ├─ REPOSITORY_MAP.md (Phân quyền)   ├─ docs/HELP.md (FAQ)
        └─ .clinerules (Luật Cline)         └─ PRODUCT_HISTORY.md (6 Thời kỳ)   └─ CHANGE_GOVERNANCE.md
```

---

## 2. BẮT ĐẦU TỪ ĐÂU?

- **Hiểu hệ thống phân quyền & luật cho AI Agent:** Đọc [`AGENTS.md`](AGENTS.md) và [`docs/AGENT_GOVERNANCE.md`](docs/AGENT_GOVERNANCE.md).
- **Xem các chỉ thị bất khả xâm phạm của Tuấn (Owner):** Đọc [`USER.md`](USER.md).
- **Tra cứu tài liệu quy chuẩn duy nhất (Single SoT) cho từng chủ đề:** Đọc [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](docs/CANONICAL_DOCUMENT_REGISTRY.md).
- **Xem bản đồ thư mục, phân quyền sở hữu và luồng dữ liệu:** Đọc [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md).
- **Nắm bắt tiến độ và danh sách task cần thực hiện:** Đọc [`AUDIT/MASTER_COMPLETION_PLAN.md`](AUDIT/MASTER_COMPLETION_PLAN.md).
- **Tìm hiểu 6 thời kỳ lịch sử tiến hóa của sản phẩm:** Đọc [`docs/PRODUCT_HISTORY.md`](docs/PRODUCT_HISTORY.md).
- **Quy trình thực hiện thay đổi và các chốt chặn Human Gates:** Đọc [`docs/CHANGE_GOVERNANCE.md`](docs/CHANGE_GOVERNANCE.md) và [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Tra cứu giải đáp thắc mắc và hướng dẫn vận hành:** Đọc [`docs/HELP.md`](docs/HELP.md).

---

## 3. CƠ CẤU PHÂN VAI & MÔ HÌNH VẬN HÀNH (PRIMARY AGENT MODEL)

- **Tuấn:** Human Final Authority / Product Decision Maker.
- **Emarald:** Analysis Authority / Architecture Review / Quality Control / Coordination.
- **AGY:** Primary Agent — Chịu trách nhiệm thực thi xuyên suốt toàn bộ dự án (Backend, Database, ReBAC, API, Tích hợp và Frontend khi phù hợp). Có quyền chủ động lựa chọn phạm vi thực thi và đề xuất huy động Cline.
- **Cline:** Specialized Execution Resource — Tài nguyên thực thi chuyên biệt (Visual QA, Playwright Browser Testing, CSS pixel-perfect), được huy động theo Ma trận Đánh giá Đa chiều.
- **OpenCode:** Specialized Execution Resource — Tài nguyên chuyên trách nạp dữ liệu và kịch bản backend khi được huy động.

Mọi thay đổi mã nguồn hoặc dữ liệu bắt buộc phải tuân thủ nghiêm ngặt **Human Approval Gates** được định nghĩa trong [`AGENTS.md`](AGENTS.md) và [`docs/CHANGE_GOVERNANCE.md`](docs/CHANGE_GOVERNANCE.md).

---

## 4. CẤU TRÚC WEBSITE CHÍNH THỨC (CANONICAL V1.0 SITEMAP)

- **Cổng đối ngoại (`/`):** Trang chủ khảo cứu 6 khu vực (`UI System vNEXT`), Thẻ Mời Thành Viên (`#/gia-pha`, `#/mach`, `#/tu-lieu`, `#/lich`) và cổng xác thực `/login`.
- **Không gian Thành viên (`/me/*` — yêu cầu phiên đăng nhập `ACTIVE`):**
  - `/me` — Không gian của tôi (Tổng quan cá nhân, sự kiện sắp tới, bài viết mới, tư liệu).
  - `/me/tree` — Cây phả đồ tương tác 3 thế hệ (`Me-Centric`) & Danh bạ 223 nhân vật.
  - `/me/tree/person/:id` — Hồ sơ nhân vật 2 cột, dữ kiện lịch sử, quan hệ huyết thống & biểu mẫu đề xuất bổ sung.
  - `/me/gallery` — Kho tư liệu di ảnh số hóa (185 tư liệu).
  - `/me/events` — Lịch giỗ Âm Dương chuẩn thiên văn UTC+7 & Niên biểu dòng họ.
  - `/me/mach?article=:slug` — Ấn phẩm khảo cứu nội bộ MẠCH.
  - `/me/clara?article=:slug` — Thư gửi Clara (Zero-Hint — cô lập tuyệt đối cho tài khoản được ủy quyền).
  - `/me/change-password` — Kích hoạt mật khẩu lần đầu & đổi mật khẩu chủ động.
- **Quản trị (`/admin` — Owner/Editor):** Tổng quan, Hộp thư Đề xuất (`#/inbox`), Quản lý Tài khoản Thành viên (`#/members`), Nhân sự, MẠCH, Sự kiện và CSDL.
- **Phòng Lab thẩm định (`lab.html`):** Môi trường thử nghiệm giao diện nội bộ trên dữ liệu giả lập (`Synthetic Fixtures`).

---

## 5. PHIÊN BẢN V2.0.1 (ARCHITECTURE & PRODUCT EVOLUTION)

Phiên bản `v2.0.1` hoàn thiện nền tảng theo chỉ đạo của Tuấn (Product Owner):
1. **Edge Decoupling cho Trung tâm Trợ giúp (`/help` & `/help/recovery`):**
   - Được biên dịch tĩnh (`help.html`, `help-recovery.html`) và phục vụ trực tiếp trên Vercel Edge CDN.
   - Hoàn toàn độc lập với máy chủ NAS nội bộ, loại bỏ triệt để lỗi Cloudflare Tunnel Error 1033.
2. **Động cơ Quản lý Giờ nghỉ Máy chủ NAS (4-State Engine):**
   - Hoạt động chính xác theo múi giờ `Asia/Ho_Chi_Minh` trong [`src/js/ui/server-schedule.js`](src/js/ui/server-schedule.js):
     * `SCHEDULED_REST` (01:00 – 09:00): Nghỉ định kỳ nhằm bảo vệ phần cứng và đĩa từ.
     * `RECOVERING` (09:00 – 09:05): Đánh thức thiết bị và kiểm tra kết nối.
     * `AVAILABLE` (09:05 – 01:00): Trực tuyến, sẵn sàng phục vụ đầy đủ.
     * `OFFLINE`: Gián đoạn bất thường ngoài khung giờ nghỉ.
3. **Chuẩn mực Thiết kế 2D Planar (Zero-Radius):**
   - Triệt để tuân thủ Brand Governance v0.1: `border-radius: 0`, không đổ bóng giả 3D, không làm mờ kính.
   - Đặc tả chuẩn hóa tại [`docs/design/DESIGN_SYSTEM_SPEC.md`](docs/design/DESIGN_SYSTEM_SPEC.md).
4. **Làm sạch Mã nguồn & Tối ưu Băng thông:**
   - Di chuyển 5.169 dòng dead CSS (`main.css`) vào `archive/legacy-stylesheets/`.

---

## 6. HỆ THỐNG TÀI LIỆU QUẢN TRỊ NỘI DUNG (CONTENT GOVERNANCE)

Mọi nội dung trên website đều có thể truy vết nguồn gốc và vị trí chỉnh sửa:
- **Bảng tra cứu nội dung toàn hệ thống:** [`docs/content/CONTENT_REGISTRY.md`](docs/content/CONTENT_REGISTRY.md)
- **Bảng tra cứu tư liệu hình ảnh & di ảnh:** [`docs/content/MEDIA_REGISTRY.md`](docs/content/MEDIA_REGISTRY.md)
- **Cẩm nang hướng dẫn chỉnh sửa nội dung dành cho Chủ quản:** [`docs/content/CONTENT_EDITING_GUIDE.md`](docs/content/CONTENT_EDITING_GUIDE.md)
- **Sơ đồ phụ thuộc dữ liệu & luồng phân phối:** [`docs/content/CONTENT_DEPENDENCY_MAP.md`](docs/content/CONTENT_DEPENDENCY_MAP.md)

---

## 7. CẨM NANG HƯỚNG DẪN DÀNH CHO CÁC ĐỐI TƯỢNG

- **Dành cho Bà con dòng họ (Thành viên sử dụng):** [`docs/product/USER_GUIDE.md`](docs/product/USER_GUIDE.md)
- **Dành cho Kỹ sư phần mềm (Lập trình viên):** [`docs/architecture/DEVELOPER_GUIDE.md`](docs/architecture/DEVELOPER_GUIDE.md)
- **Dành cho AI Agents (Quy tắc & Ranh giới):** [`docs/architecture/AGENT_GUIDE.md`](docs/architecture/AGENT_GUIDE.md)
- **Kiểm toán Sức khỏe Mã nguồn:** [`docs/architecture/CODEBASE_HEALTH.md`](docs/architecture/CODEBASE_HEALTH.md)

---

## 8. LỆNH KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITES)

```bash
# Kiểm thử động cơ giờ nghỉ máy chủ NAS
node tests/test_server_schedule.mjs

# Kiểm thử trải nghiệm thành viên & bảo vệ quyền riêng tư
node tests/test_member_experience_system.mjs

# Kiểm thử lõi thuật toán phả hệ, niên biểu & tư liệu
node --test tests/test_domain_*.mjs
```
