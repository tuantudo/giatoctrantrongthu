# MASTHEAD / LOGO / RESPONSIVE SYSTEM AUDIT & FIX

## 1. Các lỗi đã phát hiện & Root Cause

### Lỗi 1: Duplicated Tagline
- **Root Cause:** Implementer (Cline) không nhận diện được tagline đã tồn tại dạng vector trong file `logoGiaToc_ngang.svg` nên tự render thêm thẻ `<span class="tagline">TỪ 1872 ĐẾN CHÚNG TA</span>` bên dưới.
- **Tình trạng:** Đã FIX (Commit `28fc5cf`). Giữ nguyên Full Logo Artwork, không cho phép HTML render đè.

### Lỗi 2: White Background / White Frame
- **Root Cause:** Do CSS Global của dự án áp dụng rule chung cho TẤT CẢ thẻ `img` (để tạo hiệu ứng "Archival mount effect"):
  ```css
  img, .profile-avatar, .author-avatar, .member-avatar {
      border-radius: 0 !important;
      border: 1px solid var(--border);
      padding: 4px;
      background: #fff;
  }
  ```
- **Tình trạng:** Logo SVG bản chất có nền trong suốt (transparent) và fill màu `#231f20`. Nhưng vì chịu ảnh hưởng của class CSS global trên nên bị bao bọc bởi một cái khung trắng và viền.

### Lỗi 3: Thiếu Responsive Art Direction
- **Root Cause:** Masthead đang chỉ dùng 1 phiên bản `logoGiaToc_ngang.svg` ép hiển thị cho mọi kích thước màn hình.
- **Tình trạng:** Chưa truyền tải được semantic của 3 loại tài sản thương hiệu ở các bối cảnh viewport khác nhau.

---

## 2. Thay Đổi Implementation

### A. Triệt Tiêu White Frame
Đã thêm CSS override (cưỡng chế vô hiệu hóa hiệu ứng thẻ ảnh lưu trữ) dành riêng cho Logo Masthead:
```css
img.editorial-logo {
    border: none !important;
    padding: 0 !important;
    background: transparent !important;
}
```

### B. Responsive Art Direction (Hệ thống 3 Logo)
Sử dụng thẻ `<picture>` HTML5 để phân luồng (Art Direction) tài sản thay vì bóp méo 1 tài sản bằng CSS.

**Logo Asset Semantics — LOCKED:**

1. `logoGiaToc_original.svg`
   - Full identity / full nameplate (vector artwork, no text element).
   - Là logo chính khi không gian cho phép.
   - Ưu tiên dùng trên desktop/wide layouts.

2. `logoGiaToc_ngang.svg`
   - Full identity / full nameplate dạng ngang (vector artwork, no text element).
   - Dùng khi không gian hẹp hơn nhưng vẫn cần hiển thị đầy đủ nhận diện.
   - Đây là variant responsive cho không gian hẹp — KHÔNG PHẢI icon-only.
   - Có thể dùng trên tablet, constrained desktop hoặc các layout có chiều ngang hạn chế.

3. `logoGiaToc.svg`
   - Icon-only (chỉ biểu trưng, không text).
   - KHÔNG coi đây là mobile logo mặc định.
   - KHÔNG tự động chuyển sang icon-only chỉ vì viewport <640px.
   - Chủ yếu dùng cho favicon.
   - Chỉ dùng ở những vị trí đặc biệt thực sự yêu cầu icon-only.

**Responsive Rule:**

```
original full logo
→ nếu không gian không đủ
→ ngang full logo
→ chỉ khi một context thực sự bắt buộc icon-only
→ icon-only
```

**Implementation:**

1. **WIDE DESKTOP (Viewport ≥ 1024px)**
   - **Asset:** `logoGiaToc_original.svg` (Full Identity dọc)
   - **Quy tắc:** Màn hình đủ rộng, Nameplate được nâng height lên `160px` và padding hào phóng (`3rem`) tạo sự uy nghiêm tối đa.

2. **TABLET / MOBILE (Viewport < 1024px)**
   - **Asset:** `logoGiaToc_ngang.svg` (Full Identity ngang)
   - **Quy tắc:** Giữ nguyên identity đầy đủ với height `80px`. Mobile vẫn ưu tiên full identity nếu `logoGiaToc_ngang.svg` còn hiển thị được một cách hợp lý.

3. **ICON-ONLY (Favicon / Special Context Only)**
   - **Asset:** `logoGiaToc.svg`
   - **Quy tắc:** Chỉ dùng cho favicon hoặc context thực sự bắt buộc icon-only. Không phải mobile logo mặc định.

**IMPORTANT:**
- Không crop logo.
- Không tách text khỏi logo.
- Không thêm tagline HTML nếu tagline đã nằm trong artwork.
- Không dùng icon-only để giải quyết vấn đề layout một cách máy móc.
- Đây là art-direction/identity rule, không phải breakpoint rule cứng.

---

## 3. Browser Verification
- **Lỗi Tagline:** Đã xóa tận gốc trong codebase (không quay lại).
- **Lỗi Khung Trắng:** Nền trong suốt hoàn toàn, hòa nhập vào màu nền (`var(--bg)`) của Masthead/Header.
- **Logo Semantic:** Trình duyệt tự động swap file SVG dựa trên độ rộng cửa sổ (không dùng JS, chuẩn Editorial HTML architecture).

## 4. Những Gì KHÔNG Thay Đổi
- Giữ nguyên `logoGiaToc_ngang.svg` làm gốc cho Tablet.
- Tuyệt đối không can thiệp (edit) vector nội dung bên trong các file SVG.
- Không thay đổi Homepage Modules hoặc đụng chạm framework, Auth, Database.
- Dải Navigation và cấu trúc tổng thể "Masthead -> Nav -> Content" (kiểu Tia Sáng) được bảo toàn nguyên vẹn.
