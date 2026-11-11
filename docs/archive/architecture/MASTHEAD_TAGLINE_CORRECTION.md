# MASTHEAD TAGLINE CORRECTION

## 1. Lỗi Hiện Tại (Current Error)
Trong khu vực Masthead / Nameplate của trang chủ, dòng tagline `"TỪ 1872 ĐẾN CHÚNG TA"` đang bị hiển thị lặp lại 2 lần:
1. Nằm ẩn dưới dạng vector paths bên trong chính bức ảnh `logoGiaToc_ngang.svg`.
2. Bị render thêm bằng một thẻ HTML `<span>` ngay bên dưới ảnh logo.

## 2. Nguyên Nhân (Root Cause)
Khi implement "Editorial Publication Shell", Cline đã hiểu nhầm việc cấu trúc masthead bao gồm "Logo + Tagline" nghĩa là phải viết code HTML cho Tagline riêng lẻ. Cline không nhận thức được (hoặc không parse được) rằng chữ trong file SVG đã bị convert thành vector paths và artwork của SVG vốn dĩ **đã bao gồm toàn bộ cụm tên Gia tộc và Tagline**.

## 3. Logo Semantics — Owner Locked
Owner đã quy định ngữ nghĩa tuyệt đối (Invariant) của 3 logo assets:
- `logoGiaToc_original.svg`: Full identity (Biểu trưng + Tên "GIA TỘC TRẦN TRỌNG THU" + Tagline).
- `logoGiaToc_ngang.svg`: Full identity dạng ngang (Biểu trưng + Tên "GIA TỘC TRẦN TRỌNG THU" + Tagline).
- `logoGiaToc.svg`: Icon-only (Chỉ có biểu trưng, không text).

**Luật áp dụng:** Bất cứ khi nào sử dụng `_original` hoặc `_ngang`, cấm tuyệt đối việc render thêm thẻ HTML chứa Tagline hoặc Tên gia tộc bên cạnh, vì toàn bộ nội dung đó đã được khóa (locked) bên trong chính artwork của file SVG.

## 4. Phần Tử Dư Thừa Cần Loại Bỏ (Element to Remove)
Cần xóa ngay thẻ `<span class="tagline">TỪ 1872 ĐẾN CHÚNG TA</span>` nằm bên trong `<div class="header-nameplate">` của file `index.html`.

**Mã gốc hiện tại (Sai):**
```html
<div class="header-nameplate">
    <a href="#/" class="nameplate-link">
        <img src="assets/images/logoGiaToc_ngang.svg" class="editorial-logo" alt="Gia Tộc Trần Trọng Thu">
    </a>
    <span class="tagline">TỪ 1872 ĐẾN CHÚNG TA</span> <!-- PHẦN TỬ DƯ THỪA CẦN XÓA -->
</div>
```

**Mã mong muốn (Đúng):**
```html
<div class="header-nameplate">
    <a href="#/" class="nameplate-link">
        <img src="assets/images/logoGiaToc_ngang.svg" class="editorial-logo" alt="Gia Tộc Trần Trọng Thu">
    </a>
</div>
```

## 5. Acceptance Criteria (Tiêu chí nghiệm thu)
1. Trong file `index.html`, không còn thẻ `<span class="tagline">` bên trong class `.header-nameplate`.
2. Trên trình duyệt, Masthead chỉ hiển thị duy nhất MỘT tagline nằm nguyên bản bên trong artwork của logo.
3. Không thực hiện thay đổi CSS làm ảnh hưởng layout của logo hiện tại.
4. Artwork gốc của `logoGiaToc_ngang.svg` được giữ nguyên 100%, không bị sửa đổi text bên trong SVG.
