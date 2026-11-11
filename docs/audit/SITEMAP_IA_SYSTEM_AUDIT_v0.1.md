# SITEMAP / IA SYSTEM AUDIT v0.1

## 1. Executive Summary
Bản audit này thực hiện phân tích độc lập Kiến trúc Thông tin (IA) và Sitemap của Gia Tộc Trần Trọng Thu. Hệ thống đang trải qua quá trình "sitemap drift" (trôi dạt kiến trúc) do việc chuyển đổi một phần từ kiến trúc Hash-Routing (Legacy SPA) sang Dynamic Express Routing. 

Nguyên nhân cốt lõi là việc **đồng nhất hóa (conflate)** giữa URL Routing (cơ chế kỹ thuật) và Domain Model (không gian thông tin). Bản báo cáo này tái cấu trúc lại Canonical IA nhằm định hình lại ranh giới Public/Member và bảo tồn các không gian cốt lõi.

## 2. Audit Scope
- Nguồn 1: `archive/legacy_frontend/index.html` (Bản prototype SPA dùng `#/`).
- Nguồn 2: `server/member.js`, `server/auth.js` (Bản Express Dynamic Routes).
- Nguồn 3: `src/js/app-v2.js`, `src/js/member-app.js` (Frontend Router).
- Nguồn 4: Các tài liệu Governance & Architecture (`brand/`, `docs/`).

## 3. Legacy Sitemap Reconstruction
Dựa trên `archive/legacy_frontend/index.html`, kiến trúc thông tin ban đầu sử dụng Single Page App (hash-routes).

**LEGACY INFORMATION ARCHITECTURE**
```text
ROOT (Public Access Default)
├── #/ (Trang Chủ)
├── #/gia-pha (Cây Phả Đồ)
│   ├── #/gia-pha/nhan-vat
│   ├── #/gia-pha/gia-dinh
│   ├── #/gia-pha/dong-thoi-gian
│   └── #/gia-pha/ky-uc
├── #/mach (Mạch - Bài viết)
├── #/tu-lieu (Kho Tư Liệu)
├── #/lich (Lịch Gia Tộc)
└── #/tim-kiem (Tìm kiếm)
```

| Legacy node | Type | Parent | Destination / State | Access | Evidence |
|---|---|---|---|---|---|
| `#/` | Home View | `ROOT` | Trang chủ tích hợp | `[UNKNOWN]` (Giả định Public) | `index.html` nav |
| `#/gia-pha` | Domain Space | `ROOT` | Không gian phả hệ | `[UNKNOWN]` | `index.html` nav |
| `#/mach` | Domain Space | `ROOT` | Tự sự / Tạp chí | `[UNKNOWN]` | `index.html` nav |
| `#/tu-lieu` | Domain Space | `ROOT` | Kho media | `[UNKNOWN]` | `index.html` nav |
| `#/lich` | Domain Space | `ROOT` | Lịch sự kiện | `[UNKNOWN]` | `index.html` nav |

*Nhận xét:* Bản Legacy coi tất cả mọi thứ là các trang nằm ngang hàng nhau trên thanh điều hướng, không có ranh giới Access (Public/Member) rõ ràng.

## 4. Current Dynamic Route Reconstruction
Dựa trên mã nguồn `server/`, hệ thống hiện tại sử dụng Express Routing.

**CURRENT ROUTE MAP**

| Route | Surface | Function | Parent | Access | Source | Status |
|---|---|---|---|---|---|---|
| `/` | Public Home | Gate / Entry | None | Public | `server/auth.js` | `[OBSERVED]` |
| `/login` | Auth | Authentication | None | Public | `server/auth.js` | `[OBSERVED]` |
| `/me` | Dashboard | Member Lobby | None | Member | `server/member.js` | `[OBSERVED]` |
| `/me/mach` | Domain Space | Tự sự (Not Available) | `/me` | Member | `server/member.js` | `[OBSERVED]` |
| `/me/clara` | Domain Space | Tự sự nội bộ | `/me` | Member | `server/member.js` | `[OBSERVED]` |
| `/me/tree` | Domain Space | Phả đồ tổng | `/me` | Member | `server/member.js` | `[OBSERVED]` |
| `/me/tree/person/:id` | Detail State | Hồ sơ nhân vật | `/me/tree` | Member | `server/member.js` | `[OBSERVED]` |
| `/me/family-spaces` | Domain Space | Nhánh gia đình | `/me` | Member | `server/member.js` | `[OBSERVED]` |

## 5. Legacy → Dynamic Mapping

| Legacy space | Current route | Relationship | Problem | Recommendation |
|---|---|---|---|---|
| `#/` (Trang chủ) | `/` (Public Home) | SPLIT | `/` chỉ làm Gate, đẩy Lobby vào `/me`. Rất tốt, tách bạch Access Boundary. | Giữ nguyên sự tách biệt. |
| `#/gia-pha` | `/me/tree` | MOVED | Trở thành không gian Member. | Preserve `/me/tree`. |
| `#/gia-pha/nhan-vat` | `/me/tree/person/:id` | REPLACED | Chuyển từ List View sang Detail State của `tree`. Chính xác về mặt Entity. | Preserve. |
| `#/mach` | `/me/mach` | MOVED | Đã đưa vào Member Auth, đang ở trạng thái NotAvailable. | Cần xây dựng UI. |
| `[None]` | `/me/clara` | NEW | Clara được tách riêng khỏi MẠCH. | Phân định rõ MẠCH vs Clara. |
| `#/tu-lieu` | `[LOST]` | LOST | Không có dynamic route `/me/tu-lieu`. | Phải bổ sung lại. |
| `#/lich` | `[LOST]` / `:8080/#/lich` | LOST | Không có dynamic route. Bị bỏ lại ở frontend cũ. | Phải bổ sung lại. |
| `#/tim-kiem` | `[LOST]` | LOST | Không có Global Search. | Xác định Search là Utility. |

## 6. What Was Lost

| Lost element | Legacy evidence | Current state | Severity |
|---|---|---|---|
| Tư liệu (Media Archive) | Có tab `#tu-lieu` | Biến mất khỏi Dynamic Route | High |
| Lịch (Calendar) | Có tab `#lich` | Biến mất (chỉ còn api feed) | High |
| Khả năng tìm kiếm | Có nút `#tim-kiem` | Biến mất | Medium |
| Cảm giác "Một căn nhà chung" | Mọi thứ nằm ở `#` | Phân mảnh: Public `/`, Auth `/login`, Member `/me/...` | Medium |

## 7. Root Causes of IA / Sitemap Drift

1. **[FACT]** **Dynamic route được thiết kế trước IA:** Các route `/me/mach`, `/me/tree` được tạo ra để phục vụ việc chuyển đổi Backend/Auth trước khi có một bản quy hoạch Sitemap tổng thể.
2. **[OBSERVATION]** **`/me` trở thành container vật lý:** Thay vì chỉ là một Access Control Context (User Session), `/me` đang bị biến thành một "Thư mục" (Directory) chứa tất cả mọi thứ.
3. **[INFERENCE]** **Lịch và Tư liệu bị bỏ rơi:** Vì quá trình chuyển đổi tập trung vào `Tree` và `MẠCH`, hai không gian `Lịch` và `Tư liệu` chưa được viết Dynamic Route, dẫn đến việc bị đứt gãy khỏi Navigation.
4. **[OBSERVATION]** **Route hierarchy không phản ánh information hierarchy:** Việc đặt `/me/family-spaces` ngang hàng với `/me/tree` gây bối rối, vì "Nhánh gia đình" (Family Spaces) thực chất là một cách tổ chức cục bộ của Phả hệ (Tree).

## 8. Domain Model vs Route Model

**[FACT]** Hệ thống có 5 Information Domains cốt lõi (Domain Model):
1. Phả hệ (Genealogy)
2. Ký ức & Tự sự (MẠCH / Clara)
3. Tư liệu (Media/Archives)
4. Sự kiện (Calendar/Lịch)
5. Hành chính (Tài khoản/Spaces)

**[HYPOTHESIS]** Route Model không bắt buộc phải map 1:1 với Domain Model, nhưng Navigation Model phải tôn trọng Domain Model. Ví dụ: Người dùng không cần biết họ đang ở `/me/tree`, họ chỉ cần biết họ đang ở không gian "Gia phả".

## 9. Access / Boundary Matrix

Dựa trên Brand Docs và Security requirements:

| Space (Domain) | Public | Member | Private | Auth required | Notes |
|---|---:|---:|---:|---:|---|
| **Public Home** | X | - | - | Không | Chỉ đóng vai trò Gate / Identity. |
| **Gia Phả (Tree)** | - | X | - | Có | Mọi thành viên đều xem được Cây tổng. |
| **Hồ sơ cá nhân** | - | X | - | Có | Thành viên xem chéo được hồ sơ chung. |
| **MẠCH** | - | X | - | Có | Tạp chí nội bộ (Editorial). |
| **Clara** | - | X | - | Có | Tự sự thầm kín (Intimate). |
| **Tư Liệu** | - | X | - | Có | Kho media. |
| **Lịch** | - | X | - | Có | Lịch cúng giỗ, sinh nhật. |
| **Family Spaces**| - | - | X | Có | Không gian nhánh (Private branch). |

## 10. Canonical Information Architecture

**[PROPOSAL] CANONICAL INFORMATION ARCHITECTURE**

```text
ROOT
├── PUBLIC GATE
│   ├── / (Identity & Threshold)
│   └── /login (Auth)
│
├── MEMBER SPACE (Yêu cầu Authentication)
│   ├── /me (Lobby / Bảng tin / Entrance)
│   │
│   ├── HỒ SƠ & PHẢ HỆ (Genealogy Domain)
│   │   ├── /me/tree (Cây phả đồ tổng)
│   │   └── /me/tree/person/:id (Hồ sơ chi tiết)
│   │
│   ├── KÝ ỨC & TỰ SỰ (Narrative Domain)
│   │   ├── /me/mach (Tạp chí gia tộc)
│   │   └── /me/clara (Khu vực tự sự riêng tư)
│   │
│   ├── DI SẢN BẢO TỒN (Archive Domain)
│   │   └── /me/tu-lieu (Kho hình ảnh, văn bản)
│   │
│   ├── THỜI GIAN (Temporal Domain)
│   │   └── /me/lich (Sự kiện, cúng giỗ)
│   │
│   └── KHÔNG GIAN NHÁNH (Private Domain)
│       └── /me/family-spaces (Dành riêng cho từng gia đình nhỏ)
│
└── SYSTEM UTILITY
    └── /me/change-password
```

## 11. Canonical Navigation Model

**[PROPOSAL]**
- **Global Nav (Masthead):** MẠCH / TƯ LIỆU / GIA PHẢ / LỊCH. (Luôn hiện diện trên cùng).
- **Utility Nav:** TÌM KIẾM (Search), USER PROFILE (Tài khoản/Logout). Đặt ở góc phải.
- **Contextual Nav:** (Ví dụ: Trong `/me/tree` sẽ có nút quay lại, hoặc breadcrumb).
- **Home Icon:** Click vào Logo luôn dẫn về `/me` (Nếu đã login) hoặc `/` (Nếu chưa login).

## 12. Public Home's Correct Role

**[OBSERVATION]**
Public Home (`/`) **KHÔNG PHẢI** là Landing Page của một SaaS product. Nó cũng không phải là "Trang Chủ" chứa các bài viết mới nhất (đó là vai trò của `/me` Lobby).

**[PROPOSAL]**
Public Home là **THRESHOLD (Cổng ranh giới)**.
- **Nhiệm vụ:** Trả lời "Đây là không gian của ai?" và "Làm sao để bước vào?".
- **Content:** Tên gia tộc, Historical Anchor (để xác thực danh tính), Thống kê số lượng (để chứng minh đây là kho lưu trữ có thật), và Lối vào (Gate).
- Giả định *"Home cần thêm Giuse / 150 năm / 5 thế hệ"* là **ĐÚNG**, vì nó cung cấp "Historical Anchor" (Điểm neo lịch sử) giúp định danh cộng đồng mà không biến trang web thành một bài viết About Us dài dòng.

## 13. Recommended Route Model

Giữ nguyên cấu trúc `/me/...` của backend hiện tại vì nó đảm bảo tính bảo mật (Auth middleware check theo prefix). Chỉ cần bổ sung các routes bị thiếu:
- Cần thêm: `router.get('/me/tu-lieu')`
- Cần thêm: `router.get('/me/lich')`

## 14. Migration / Consolidation Implications
- Các link `#/lich` hoặc `#/tu-lieu` ở client-side cần được đồng bộ với Express route.
- Nếu port 8080 đang chạy một Legacy app cho Lịch, cần nhúng nó vào `/me/lich` hoặc rewrite lại UI để dùng chung layout.

## 15. Open Questions
- **[HUMAN DECISION REQUIRED]** Tính năng Tìm Kiếm (Search) sẽ là một trang riêng `/me/search` hay là một UI Modal (Ctrl+K) hiển thị overlay trên mọi trang?
- **[HUMAN DECISION REQUIRED]** Family Spaces hiện tại là `/me/family-spaces`. Ai có quyền truy cập vào Family Spaces của người khác? Nếu là Private, cần có Authorization middleware riêng biệt.

## 16. Final Recommendation

Đình chỉ việc tranh luận về các route rời rạc. Áp dụng **CANONICAL INFORMATION ARCHITECTURE (Mục 10)** làm kim chỉ nam cho mọi thay đổi UI từ nay về sau. Không thêm bất kỳ Route nào cấp 1 (Root) ngoài `/` và `/login`. Mọi tài nguyên thuộc về dòng họ phải nằm sau ranh giới `/me/...`.
