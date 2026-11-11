# GIATỘC PRODUCT EVOLUTION AUDIT v0.1

## 0. Executive Summary
Dự án Giatộc đang trải qua một bước ngoặt chuyển đổi (Product Evolution) cực kỳ quan trọng: chuyển từ một website cây gia phả tĩnh mang tính quảng bá cộng đồng (Public-first Tree Viewer) sang một **Family Information System** thực thụ với không gian bảo mật dành riêng cho thành viên nội bộ, kết hợp cùng một phân hệ xuất bản báo chí (MẠCH) hướng ra công chúng. 

Tài liệu này xác định lại ranh giới sản phẩm, chỉ ra những "tàn dư" (legacy assumptions) không còn phù hợp, và làm căn cứ gốc cho việc định hình lại IA (Sitemap v0.2) cũng như UI system trong giai đoạn tới.

## 1. Audit Scope
- Khảo sát sự thay đổi Product Intent từ phiên bản D001 Prototype cũ sang định hướng hiện tại.
- Phân tách rạch ròi 3 trạng thái: Quyết định cũ (Legacy Intent) → Hiện trạng Code (Current Implementation) → Định hướng Sản phẩm đúng (Current Human Decisions).
- Đánh giá kiến trúc dữ liệu (Data Architecture / SoT) và kiến trúc thông tin (IA).

## 2. Sources Examined
- **Website public hiện tại**: `index.html` (D001 Prototype)
- **Repository**: `src/js/app-v2.js`, `src/js/member-app.js`, `server/member.js`, `server/index.js`
- **Architecture Docs**: `ERD_v0.1.md`, `SITEMAP_v0.1.md`, `REPORT_LOCAL_DB_RUNTIME.md`
- **Current Human Decisions**: Các chỉ thị trực tiếp trong Mission Prompt hiện tại.

## 3. Legacy Product State (State A)
*Trạng thái của lần Publish trước (Static Prototype).*
- **Product Intent**: Tạo ra một trải nghiệm Interactive Family Tree mở cho tất cả mọi người. `[LEGACY INTENT]`
- **Audience**: Khách vãng lai và thành viên chung một không gian trải nghiệm.
- **Content Model**: `Genealogy = Content`. Hồ sơ Person là đơn vị nội dung cốt lõi và được hiển thị tự do.
- **Genealogy Role**: Là "nhân vật chính", điểm nhấn của toàn bộ website public.
- **MẠCH Role**: Chỉ là một module/tab phụ ngang hàng với Gia phả, Ký ức, Tư liệu.
- **Data Source**: Phụ thuộc 100% vào file tĩnh `genealogy.json`.

## 4. Current Implementation State (State B)
*Code runtime và Database hiện tại đang làm gì.* `[IMPLEMENTATION]`
- **Authentication**: Đã triển khai thành công `accounts`, cookie session. Có bức tường Auth vững chắc ngăn cách Public và Member.
- **Database (Runtime)**: Đã chuyển đổi hoàn toàn sang DB động (SQLite ở local). Không còn API nào frontend đọc trực tiếp từ JSON tĩnh.
- **Member Space**: Đã hình thành `/me` (Dashboard chứa Identity cá nhân) và `/me/tree` (bọc lại SPA cũ).
- **Public Shell**: File `index.html` vẫn chứa các Navigation Links cũ (`#/gia-pha`, `#/tu-lieu`) như một di sản chưa kịp dọn dẹp.

## 5. Current Human Decisions (State C)
*Quyết định định hướng hiện tại của Human Authority. Đây là **Source of Truth cho thiết kế UI/IA sắp tới**.* `[CURRENT DECISION]`
- **DECISION 01 (Public)**: Public *chỉ* có MẠCH (Tập san di sản). Tuyệt đối không phát minh ra Public Genealogy/Tree/Person. Mọi dấu vết gia phả public cũ là Legacy/Obsolete.
- **DECISION 02 (Member)**: Authentic Member mới được truy cập thế giới dữ liệu gia tộc (Genealogy, Memories, Media).
- **DECISION 03 (Member-owned Data)**: Thành viên có không gian tự quản lý dữ liệu cá nhân (Personal Space). Không đơn thuần chỉ là hiển thị Person record.
- **DECISION 04 (MẠCH)**: MẠCH là lớp xuất bản (Publication Layer).
- **DECISION 05 (Database SoT)**: NAS (MariaDB) là Source of Truth. SQLite là Local Dev Runtime. `genealogy.json` chỉ là file seed/projection (Import artifact).
- **DECISION 06 (Identity)**: Account (Tài khoản) ≠ Person (Node gia phả).

## 6. Product Evolution (Tóm tắt Tiến hóa)
*Từ một "Bảo tàng mở" trở thành một "Cơ quan lưu trữ nội bộ có xuất bản chọn lọc".*

**Giatộc không phải là:** `[INFERENCE]`
- Một trang web xem cây gia phả công cộng (Public tree viewer).
- Một mạng xã hội chung chung.
- Một Bảng điều khiển SaaS (SaaS Dashboard) cứng nhắc khô khan.

**Giatộc thực sự là:** `[INFERENCE]`
- Một **Hệ thống Thông tin Gia tộc (Family Information System)** được đóng kín để bảo vệ di sản nội bộ, nơi con cháu tương tác và đóng góp.
- Một **Tòa soạn Di sản (Editorial Publication)** mang tên MẠCH để kể chuyện ra bên ngoài.

## 7. Legacy → Current Mapping

| Legacy Concept | Old Intent | Evidence | Current Implementation | Current Human Decision | Status | Reason |
|---|---|---|---|---|---|---|
| Public Tree | Mở công khai | `index.html` có route `#/gia-pha` | Vẫn còn link trong code HTML | Public chỉ có MẠCH | OBSOLETE | Đóng cửa bảo vệ dữ liệu nội bộ (DECISION 01) |
| Public Media | Khoe hình ảnh cổ | `index.html` có `#/tu-lieu` | Vẫn còn link trong code HTML | Chuyển vào Member Space | OBSOLETE | Bảo vệ quyền riêng tư (DECISION 01) |
| Dashboard User | Chỉ là Viewer | Code legacy thiếu User Entity | Đã có `accounts` | Account quản lý Member-owned data | CHANGE | Trao quyền sở hữu dữ liệu (DECISION 03) |
| Json DB | Dùng làm DB chính | Code cũ fetch JSON | API fetch qua `dbAccessor` (SQLite) | NAS là SoT, SQLite là Runtime | OBSOLETE | Chuyển sang Data-driven (DECISION 05) |

## 8. Public Layer Audit
- **Thực trạng**: Website public hiện tại (`index.html`) là một **PLACEHOLDER** `[FACT]`. Lời hứa của website (Wording, Navigation) đang hứa hẹn cho người dùng xem Gia phả, Ký ức, Tư liệu... nhưng đây là những `[LEGACY INTENT]` đã bị loại bỏ theo Quyết định số 01.
- **Kết luận**: Các thành phần điều hướng (Nav) tới `#gia-pha`, `#tu-lieu`, `#lich` trên trang chủ phải bị loại bỏ trong UI/Sitemap tiếp theo.

## 9. Member Layer Audit
- **Thực trạng**: Member Space đang bị phân mảnh. Trang `/me` (Dashboard) đang đóng vai trò "Identity/Home surface", trong khi trang `/me/tree` lại bê nguyên cái xác của Legacy SPA cũ nhúng vào `[FACT]`.
- **Đánh giá**: Cách làm `/me/tree` mang tính chất Implementation-only (để đảm bảo không mất tính năng trong MVP) chứ chưa phải là một Member Product Experience hoàn chỉnh `[INFERENCE]`.

## 10. Identity Model Audit
- Mô hình Account ≠ Person đã được phản ánh chính xác trong ERD `[FACT]` và đã có Code Backend (bảng `identity_mappings`) `[FACT]`. Mô hình này phù hợp hoàn toàn với Product Direction.

## 11. Genealogy Model Audit
- Genealogy data không còn là Content tự do. Nó là Core Data thuộc về hệ thống (Canonical).

## 12. Member-Owned Data Audit
- `[OPEN QUESTION]`: Hiện tại chưa có Data Structure / UI cụ thể để người dùng quản lý dữ liệu cá nhân của mình. Nó mới chỉ dừng ở mức định hướng (Decision 03) và ERD có đề xuất `FamilySpace` / `Memory` có Author. Cần thiết kế Sitemap v0.2 để làm rõ.

## 13. MẠCH / Publication Audit
- Lớp MẠCH đang được đặt chung trong Public shell nhưng chưa phản ánh đúng vai trò "Cửa sổ duy nhất" của Giatộc ra công chúng. UI của MẠCH vẫn đang dùng chung CSS với các phần legacy.

## 14. Sitemap v0.1 Audit
- **Sitemap v0.1 dựa trên**: Hiện trạng Code Implementation (bảo tồn nguyên trạng). `[FACT]`
- **Sai lầm (Obsolete Assumption)**: Khẳng định Public có `#/tim-kiem` và Member Space bắt buộc phải nhảy qua `#` Hash Routing của Legacy SPA.
- **Route `/me`**: Đang là Identity Surface.
- **Route `/me/tree`**: Chỉ là Implementation Proposal tạm thời để tái sử dụng code cũ, KHÔNG nên là kiến trúc chuẩn.

## 15. Navigation Audit
- Public Navigation hiện tại sai với DECISION 01.
- Cần đập đi xây lại Global Navigation cho Public (chỉ giữ Home, MẠCH, Đăng nhập).

## 16. UI System v0.2 Audit
- **Vấn đề Mental Model**: UI ở `/me` đang mang hơi hướng SaaS Dashboard (Cards, Badges, Tables) `[INFERENCE]`. Điều này có thể gây khô khan, không phù hợp với cảm giác của một "Hệ thống Thông tin Gia đình" mang tính di sản.
- **Phân tách**: UI của MẠCH (Báo chí) và UI của Gia phả (Quản trị dữ liệu) đang bị trộn lẫn phong cách.

## 17. SoT / Data Architecture Audit
- Trong tài liệu `REPORT_LOCAL_DB_RUNTIME.md` (mục 2), đã khẳng định rõ ràng SQLite chỉ là **Local Dev Runtime**, NAS là **Source of Truth**, và `genealogy.json` chỉ là **Seed Source** `[FACT]`. Điều này **ALIGNED** tuyệt đối với DECISION 05. Không có xung đột thuật ngữ.

## 18. Conflicts & Obsolete Assumptions
1. **Lớn nhất**: Website Public hứa hẹn trải nghiệm phả hệ (Obsolete).
2. **UI Risk**: Member Space `/me/tree` bị kẹt trong kiến trúc Single Page Application cũ, dẫn tới URL và Navigation rối rắm.

## 19. Current Product Model v0.1 (Conceptual Candidate)

```text
                    GIATỘC
                       |
             +---------+---------+
             |                   |
    [ PUBLIC DOMAIN ]    [ SECURE MEMBER SPACE ]
             |                   |
      MẠCH (Publication)    FAMILY INFORMATION SYSTEM
             |                   |
       Editorial        +--------+--------+
        Content         |                 |
                        |                 |
                    IDENTITY         CANONICAL 
                    (Accounts)      GENEALOGY (Nodes)
                        |                 |
                  +-----+                 +-----+
                  |                             |
            Member-Owned                 Relationship
            Content (Memory)             Evidence
```
*Ghi chú: Lớp IdentityMapping đứng giữa Identity và Canonical Genealogy.* `[PROPOSAL]`

## 20. Open Questions
1. Member-owned data (Space) sẽ hiển thị ở đâu? Nằm trong Person detail hay tách ra một tab riêng trong `/me`?
2. Sự khác biệt cụ thể về Layout giữa việc đọc "MẠCH" ở Public và đọc "MẠCH" (Bản nội bộ) trong Member Space là gì?

## 21. Recommendations for Sitemap v0.2
- **Làm sạch Public**: Xóa bỏ mọi route rác (`#/gia-pha`, `#/tu-lieu`, v.v.) khỏi Public Sitemap.
- **Giết chết `/me/tree`**: Thay vì bọc lại Legacy SPA, hãy trải phẳng các route của thành viên thành URL thật (ví dụ: `/member/genealogy`, `/member/memories`) để thoát khỏi `#` hash hell.

## 22. Recommendations for UI v0.3
- Thoát khỏi phong cách SaaS. Tìm một ngôn ngữ thiết kế "Archive/Library" hoặc "Family Institution" để tạo cảm giác tôn nghiêm nhưng hiện đại.
- Thiết kế riêng Public Shell (Magazine style) và Member Shell (Application style).

## 23. Evidence Index
- `index.html`: Cung cấp bằng chứng về Public Routes cũ.
- `server/index.js` và `dbAccessor`: Bằng chứng về Runtime SQLite.
- Prompt Context: Source của mọi Quyết định con người (Human Decisions 01 - 06).
