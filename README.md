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
