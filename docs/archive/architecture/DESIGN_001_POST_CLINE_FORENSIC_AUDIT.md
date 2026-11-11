# DESIGN-001 POST-CLINE FORENSIC & SOURCE CLEANLINESS AUDIT

**Role:** AGY (Governance / QA)
**Target Commit:** `9166ed6`
**Target Environment:** Local Prototype (`/design-playground/`)

## 1. EXECUTIVE FINDING
Bản cập nhật Prototype Revision (DESIGN-001) đã xuất sắc tuân thủ các chỉ định về Information Architecture (Public vs Member boundary, Narrative mới, Sticky Nav, Reading Tools) theo chuẩn `DESIGN_001_REVISION_BRIEF`. Production boundary được bảo vệ an toàn tuyệt đối. Tuy nhiên, quá trình lặp lại (iteration) đã để lại một số rác phẩm (orphan directories) và sự trùng lặp dữ liệu nhỏ trong code JS (Semantic duplication) cần được dọn dẹp để đảm bảo Source Cleanliness.

## 2. CANONICAL SOURCE DETERMINATION
- **Canonical Prototype Entry Point:** `design-playground/index.html` (Hoạt động chính xác với Vanilla Hash Router và chia 10 view).
- **Mồ côi (Orphaned / Dead Directories):**
  - `design-playground/design-001/`
  - `design-playground/design-001-homepage/`
- **Tình trạng:** 2 thư mục này không còn được refer đến bởi bất kỳ asset hay HTML nào trong root `design-playground/`, do đó chúng trở thành Dead Artifacts.

## 3. DUPLICATE / DEAD ARTIFACT FINDINGS

| Artifact / Finding | Loại lỗi | Phân loại (Action) | Mức độ (Severity) | Bằng chứng (Evidence) |
|---|---|---|---|---|
| `design-001/` | Dead Directory | **DELETE-CANDIDATE** | LOW | Không được sử dụng trong commit 9166ed6. |
| `design-001-homepage/` | Dead Directory | **DELETE-CANDIDATE** | LOW | Không được sử dụng trong commit 9166ed6. |
| `SNAPSHOT_STORIES` array | Duplicated Data | **NEEDS-OWNER-DECISION** | MEDIUM | Mảng dữ liệu MẠCH bị hardcode 2 lần: Một lần tại `window.__D001_DATA.stories` (`prototype-data.js`) và lặp lại y hệt tại biến `SNAPSHOT_STORIES` (`prototype.js`). |
| `DESIGN_001_REVISION_TECHNICAL_IA_REVIEW.md` | Missing / Phantom Doc | **ARCHIVE / IGNORE** | LOW | Được refer trong instruction nhưng file không tồn tại trong commit history thực tế. |

## 4. DESIGN-001 IMPLEMENTATION INTEGRITY
- **Public / Member / Owner Boundary:** Tốt. Được phân tách rõ ràng bằng class `.path-public` và `.path-member`. Lớp Admin Control có cảnh báo rõ ràng `admin-note`.
- **Homepage Narrative:** Đã thiết lập chuẩn xác luồng: Giới thiệu (Intro) -> Định hướng (Paths) -> Nội dung nổi bật (Curated) -> Khám phá sâu (Deep).
- **Sticky Icon Nav & Tools:** Đã thêm `.util-strip` bám dính. Reading Tools (`.reading-tools`) xuất hiện đúng trong context chi tiết bài viết (Article). System tools (`chat-fab`, `backTop`) được bố trí dưới dạng Floating Action Button độc lập.
- **Responsive Behavior:** Đã cài đặt flex/grid có khả năng fallback tốt trên nhiều viewport.
- **Accidental Production Dependency:** KHÔNG CÓ. Code chỉ liên kết tới `css/prototype.css` và `js/prototype.js`.

## 5. SOURCE OF TRUTH (TRUY XUẤT NGUỒN GỐC)
- **Draft Copy:** Rất tốt. Giao diện sử dụng các cụm từ như `DRAFT COPY`, `PROTOTYPE — xác thực chưa được triển khai` để phân định rõ ràng giữa UI Presentation và Factual Source. Điều này ngăn chặn việc Owner nhầm lẫn giữa bản vẽ và hệ thống thật.
- **Semantic Duplication:** Như đã nêu trên, `prototype.js` và `prototype-data.js` đang dẫm chân lên nhau về định nghĩa data mock. `prototype.js` nên chỉ là Presentation Layer đọc từ `prototype-data.js`.

## 6. PRODUCTION BOUNDARY
- **Production `src/`:** KHÔNG BỊ CHẠM.
- **API / Database:** KHÔNG BỊ CHẠM.
- **Deployment:** KHÔNG XẢY RA.
- Prototype được nhốt (sandboxed) 100% bên trong `/design-playground/`.

## 7. ARCHITECTURE HYGIENE (ĐỘ SẠCH CỦA KIẾN TRÚC)
- Các component như Membership, Auth, Roles hoàn toàn được *mô phỏng rỗng (stubbed)* bằng các Hash Routes (VD: `#/tu-cach-thanh-vien`). 
- **Đánh giá Rủi ro:** Rất thấp. Việc giữ nguyên tắc "Không đụng chạm Backend/API" đã giúp prototype này vô hại với kiến trúc thật. Nó hoàn toàn sẵn sàng để bóc tách thành UI components khi bước sang giai đoạn Implementation.

## 8. GIT HYGIENE
- Commit `9166ed6` rất "sạch" xét theo Scope.
- Hiện có một số **Untracked files** trong root (như `patch2.py`, `preflight.js`, các biến thể logo cũ). Tuy nhiên, Cline đã có ý thức không `git add .` bừa bãi mà chỉ commit đúng các file thuộc `design-playground/` và `docs/`.

---

## 9. RECOMMENDED CLEANUP SEQUENCE
Để đảm bảo Source Cleanliness tuyệt đối trước khi sang bước tiếp theo, AGY đề xuất:
1. Xóa bỏ hoàn toàn 2 thư mục rác `design-001/` và `design-001-homepage/`.
2. Sửa file `js/prototype.js`: Xóa bỏ biến cục bộ `SNAPSHOT_STORIES` và gọi hàm fallback fallback về thẳng `window.__D001_DATA.stories`.

---
**DESIGN-001 FORENSIC AUDIT COMPLETE**
**CLEANUP REQUIRED:** YES (Orphan dirs & Data duplication)
**OWNER DECISIONS REQUIRED:** YES (Phê duyệt lệnh xóa rác và sửa js mockup)
**PRODUCTION TOUCHED:** NO

---

## 10. CLEANUP EXECUTION LOG
*Update: 2026-09-15*

Các hành động dọn dẹp đã được phê duyệt và thực thi thành công:
- **Orphan directories:** `design-playground/design-001/` và `design-playground/design-001-homepage/` đã được xác nhận không có reference nào và đã bị xóa (`git rm -r`).
- **Duplicate story data:** Biến `SNAPSHOT_STORIES` trong `design-playground/js/prototype.js` đã bị loại bỏ. Source of Truth duy nhất hiện tại là `window.__D001_DATA.stories` nằm tại `prototype-data.js`.
- **Verification:** Canonical prototype `design-playground/index.html` vẫn hoạt động tốt. 10 routes render bình thường, Javascript pass toàn bộ `node --check`. Không có mã production nào bị chạm tới.
