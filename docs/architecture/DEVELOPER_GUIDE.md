# HƯỚNG DẪN KỸ THUẬT PHÁT TRIỂN HỆ THỐNG (DEVELOPER GUIDE)
**Dự án:** Nền tảng Gia Tộc Trần Trọng Thu · **Phiên bản:** v2.0.1 (Architecture Baseline)  
**Phân loại:** Engineering Standards & Developer Runbook

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Hệ thống được thiết kế theo mô hình **Hybrid Edge & Self-Hosted Sovereign Cloud**:

```text
[ Khách & Thành Viên Dòng Tộc ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│                   VERCEL EDGE CDN                      │
│ - Host tĩnh: /, /index.html, /lab.html, /help.html     │
│ - Static Assets: /src/css/**, /src/js/**, /assets/**   │
│ - Mock Fixtures: /fixtures/**                          │
│ - Help & Recovery: 100% Edge Decoupled                 │
└──────────────────────────────────┬─────────────────────┘
                                   │ (Rewrites qua vercel.json)
                                   ▼
┌────────────────────────────────────────────────────────┐
│             CLOUDFLARE TUNNEL (EDGE PROXY)             │
│ Ingress: https://api.giatoctrantrongthu.com            │
└──────────────────────────────────┬─────────────────────┘
                                   │ (Encrypted Tunnel)
                                   ▼
┌────────────────────────────────────────────────────────┐
│           SYNOLOGY NAS (Mạng Nội Bộ / Tailscale)       │
│ - Express Node.js Server (:3000)                       │
│ - MariaDB Database (:3306)                             │
│ - Private Media Storage (/assets/private/**)           │
│ - Scheduled Hardware Rest: 01:00 – 09:05 hàng ngày     │
└────────────────────────────────────────────────────────┘
```

---

## 2. KHỞI TẠO VÀ CHẠY MÔI TRƯỜNG CỤC BỘ (LOCAL SETUP)

### 2.1. Yêu cầu Hệ thống
- **Node.js:** `>= 18.0.0` (Khuyến nghị Node.js v20.x hoặc v22.x LTS).
- **Trình duyệt hiện đại:** Chrome, Firefox, Safari, Edge hỗ trợ ES Modules Native.

### 2.2. Chạy Frontend Độc lập (Không phụ thuộc Backend)
Để thử nghiệm giao diện công khai và phòng Lab trên dữ liệu mẫu:
```bash
# Cách 1: Dùng python3 built-in
python3 -m http.server 8080

# Cách 2: Dùng npx serve
npx serve . -p 8080
```
- Mở trình duyệt: `http://localhost:8080/` (Trang chủ công khai).
- Mở phòng Lab: `http://localhost:8080/lab.html` (Môi trường test responsive đa thiết bị).
- Mở trợ giúp: `http://localhost:8080/help.html`.

### 2.3. Chạy Backend Express Server Cục bộ
```bash
# Khởi chạy Express server port 3000
node server/index.js
```

---

## 3. CẤU TRÚC MÃ NGUỒN (SOURCE CODE ORGANIZATION)

```text
├── assets/                    # Tài nguyên tĩnh nhận diện (SVG, Favicon, ảnh MẠCH, avatars)
│   ├── ASSET_MANIFEST.json    # Single Source of Truth cho tài nguyên thương hiệu
│   └── images/
├── docs/                      # Tài liệu kiến trúc, kiểm toán, thiết kế và cẩm nang
│   ├── architecture/          # Tài liệu kiến trúc kỹ thuật & Codebase Health
│   ├── content/               # 4 Tài liệu Content Governance (Registries & Maps)
│   ├── design/                # Design System Spec & Audit (Zero-Radius 2D Planar)
│   └── product/               # User Task Map, User Guide & Product Specs
├── fixtures/                  # Dữ liệu giả lập chuẩn (Synthetic Fixtures) cho offline testing
├── server/                    # Backend Node.js Express server
│   ├── data/                  # Dữ liệu JSON (genealogy, mach, media, person_media)
│   ├── migrations/            # Script DDL SQL (MariaDB & SQLite)
│   └── index.js               # Express API gateway & session handlers
├── src/
│   ├── css/
│   │   └── foundation/        # Hệ thống CSS duy nhất (tokens, layout, components, states)
│   └── js/
│       ├── domain/            # LÕI THUẬT TOÁN ĐÓNG BĂNG (Archive, Calendar, Genealogy, Kinship)
│       ├── platform/          # Adapters dữ liệu (HTTP, Mock, Session)
│       └── ui/                # Thành phần giao diện người dùng (Components, Shell, Pages)
└── tests/                     # Bộ kiểm thử tự động Node.js Native
```

---

## 4. QUY TẮC THIẾT KẾ VÀ TIÊU CHUẨN MÃ NGUỒN (DESIGN & CODE INVARIANTS)

1. **Brand Governance v0.1 — 2D Planar, Zero Radius:**
   - Mọi nút bấm, khung thẻ, ô nhập liệu, modal, ảnh đại diện **BẮT BUỘC** có `border-radius: 0`.
   - Tuyệt đối cấm hiệu ứng đổ bóng giả 3D (`box-shadow: none`), cấm làm mờ kính (`backdrop-filter: none`).
   - Bảng màu chuẩn: Đỏ sơn mài `#881337`, Vàng hoàng kim `#b45309`, Giấy dó `#f6f4f0`, Mực than `#1a1a1a`.
   - Kiểu chữ: Times New Roman / Noto Serif cho tiêu đề và nội dung đọc; Sans-serif cho nhãn metadata.

2. **Lõi Thuật toán Thuần túy (Pure Domain Layer — `src/js/domain/`):**
   - Vùng cấm bất biến: Không chứa bất kỳ tham chiếu nào tới DOM (`document`, `window`, `localStorage`).
   - 100% hàm thuần túy (pure functions), nhận dữ liệu đầu vào và trả về kết quả dự đoán được.

3. **Ngắt liên kết Trợ giúp (Edge Decoupling):**
   - Tuyến đường `/help` và `/help/recovery` phục vụ tĩnh từ Vercel Edge qua `help.html` và `help-recovery.html`. Không được tạo rewrite tới API tunnel của NAS.

4. **Động cơ Quản lý Giờ nghỉ Máy chủ (4-State NAS Engine):**
   - 01:00 – 09:00: `SCHEDULED_REST` (Máy chủ nghỉ đêm để bảo vệ phần cứng).
   - 09:00 – 09:05: `RECOVERING` (Đang khởi động và kiểm tra tính sẵn sàng).
   - 09:05 – 01:00: `AVAILABLE` (Sẵn sàng phục vụ đầy đủ).
   - Mất kết nối ngoài giờ: `OFFLINE` (Sự cố kết nối bất thường, không hẹn giờ mở lại sai lệch).

---

## 5. HỆ THỐNG KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITES)

Trước khi commit mã nguồn, bắt buộc chạy các lệnh kiểm thử sau và đảm bảo 100% tests PASS:

```bash
# 1. Kiểm thử Động cơ Giờ nghỉ NAS & Banner UX
node tests/test_server_schedule.mjs

# 2. Kiểm thử Tích hợp Trải nghiệm Thành viên & ReBAC Guardrails
node tests/test_member_experience_system.mjs

# 3. Kiểm thử Toàn bộ Lõi Thuật toán Phả hệ, Niên biểu, Ký ức & Tư liệu
node --test tests/test_domain_*.mjs

# 4. Kiểm thử Kho Tư liệu Ảnh & Tìm kiếm Phả hệ
node tests/test_family_gallery.mjs
node tests/test_batch_ui_03_deep_qa.mjs
```

