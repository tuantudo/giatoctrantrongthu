# EDITORIAL MASTHEAD / NAMEPLATE DESIGN BRIEF v0.2

## 1. Product Direction: Online Publication Model

`giatoctrantrongthu` ngay từ đầu được định hướng phát triển như một **Online Publication / Ấn phẩm số / Hồ sơ sống** về một dòng họ. 

Dự án này không đơn thuần là một "web app gia phả" (genealogy application) hay phần mềm quản trị thông tin. Về lâu dài, hệ thống có thể bao gồm: câu chuyện, lịch sử, nhân vật, tư liệu, MẠCH, gia phả, timeline, hồ sơ, và các chuyên đề/collections. (Lưu ý: Không biến những khả năng tương lai này thành feature implementation hiện tại).

Định hướng Editorial này yêu cầu các quyết định thiết kế (đặc biệt là Header/Identity) không được quay lại pattern của SaaS, Dashboard hay Web-app, mà phải tuân thủ cảm giác của một ấn phẩm/tài liệu lưu trữ thực thụ.

---

## 2. Research & Editorial Patterns

Nhằm thiết lập một ngôn ngữ thiết kế ấn phẩm, chúng ta đã tiến hành khảo sát cách xử lý Identity của `tiasang.com.vn` cũng như một số hệ thống xuất bản lớn (The Atlantic, The New York Times, TIME, The Economist). 

### A. Research Evidence
Những gì thực sự quan sát được từ các publication:
- **Tia Sáng:** Logo được đặt ở trung tâm. Thanh điều hướng (Chuyên đề, Diễn đàn...) nằm tách biệt ở dòng dưới. Các tiện ích (Ngày tháng, Tìm kiếm) nằm ở hai bên logo.
- **The New York Times / The Atlantic:** Sử dụng typography cỡ lớn làm logo, chiếm vùng không gian ngang hoàn toàn riêng biệt. Menu nằm bên dưới, thường được giới hạn bởi các đường kẻ ngang (hairlines / double borders).
- Các hệ thống này đều dành một không gian rộng rãi (whitespace) xung quanh tên thương hiệu/ấn phẩm.

### B. Editorial Pattern
Từ research trên, rút ra các pattern thiết kế ấn phẩm có thể áp dụng:
- **Identity Zone độc lập:** Danh tính (Identity) luôn có một vùng thị giác riêng biệt, không bị hòa tan vào các UI controls (như nút search, settings).
- **Hierarchy cao nhất:** Masthead / Nameplate đóng vai trò là điểm neo thị giác chính và có thứ bậc cao nhất.
- **Navigation Separation:** Hệ thống điều hướng (Navigation) được tách lớp khỏi Identity.
- Cấu trúc trang tạo ra cảm giác một ấn phẩm, tài liệu lưu trữ thông qua việc sử dụng typography có chân, khoảng trắng (whitespace), các đường phân tách (rules), và tỷ lệ (proportion) mang tính kinh điển.

---

## 3. Project Design Decision (Quyết định của Owner)

Dựa trên định hướng Online Publication và các Editorial Pattern đã phân tích, Owner đã đưa ra Quyết định Thiết kế (Design Decision) chính thức cho dự án:

> **Logo `Gia Tộc Trần Trọng Thu` phải được xử lý như măng-xét / masthead / nameplate của một publication và CHỐT đặt ở TRUNG TÂM (Centered).**

Việc đặt centered masthead là quyết định thiết kế riêng của project này, được informed bởi editorial research để phù hợp nhất với cảm giác "hồ sơ sống của một dòng họ".

---

## 4. 3-Layer Architecture Concept

Kiến trúc Header mới sẽ được phân tách thành 3 lớp phân cấp theo trục dọc nhằm tuân thủ tuyệt đối concept:
`IDENTITY ↓ NAVIGATION ↓ CONTENT`

### Layer 1: Utility / Meta Strip (Lớp phụ trợ)
- Là dải nằm trên cùng, cung cấp ngữ cảnh thời gian hoặc tiện ích nhỏ.
- **Không phải** là nơi chứa Identity.

### Layer 2: Masthead / Nameplate (Lớp danh tính)
- Khu vực trung tâm của header. Đây là điểm neo thị giác chính của toàn bộ trang web.
- Nơi chứa logo/tên gia tộc.

### Layer 3: Editorial Navigation (Lớp điều hướng)
- Chứa các liên kết nội dung (Trang Chủ, Gia Phả, Mạch, Tư Liệu...).
- Là một editorial index/navigation, tách biệt hoàn toàn khỏi lớp danh tính bên trên.

---

## 5. Masthead / Nameplate Guidelines

Logo chính thức đã được xác nhận: `logoGiaToc_ngang.svg`.
Trong không gian Masthead (Layer 2), phải đảm bảo:

- **Vị trí:** Logo được đặt **CENTERED** (Canh giữa).
- **Hierarchy & Scale:** Scale đủ lớn để trở thành điểm neo thị giác (nhưng KHÔNG "phóng to logo" một cách máy móc. Scale phải hài hòa với typography, proportion và whitespace).
- **Whitespace:** Không gian xung quanh logo phải đủ rộng để tạo độ "thở" đĩnh đạc.
- **Không cạnh tranh:** KHÔNG đặt logo ngang hàng với menu. KHÔNG để thanh search, icon account, nút settings hay bất kỳ UI controls nào nằm sát hoặc cạnh tranh trực tiếp sự chú ý với logo. KHÔNG biến logo thành một icon nhỏ của navbar.

---

## 6. Implementation Guidance (Dành cho Cline)

Brief này là nền tảng để triển khai UI ở Phase sau. Khi nhận task implementation, Cline cần tuân thủ:

- **Kiến trúc Header:** Masthead phải centered, Identity tách biệt Navigation, Navigation nằm dưới Masthead.
- **Tính toàn vẹn kỹ thuật:** Không phá vỡ các hash routes hiện tại, không đập bỏ SPA để migrate sang framework khác (vd: Next.js).
- **Phạm vi tác động:** Chỉ refactor kiến trúc HTML/CSS của header để tạo ra "identity zone". Không redesign các phần content bên dưới ngoài phạm vi masthead. Không thay đổi Brand colors hay favicon.
- **Bảo toàn dữ liệu:** Không thay đổi cơ chế Auth hay Member architecture.

### [PROPOSAL / PLACEHOLDER] - Dữ liệu chưa xác nhận
Các thông tin meta text / nội dung phụ trợ sau đây chỉ là **Ví dụ minh họa (Placeholder)**, chưa được Owner xác nhận là Brand Truth:
- Câu slogan: *"TỪ 1872 ĐẾN CHÚNG TA"*
- Định dạng hiển thị ngày tháng (ví dụ: *Chủ nhật, 13/9/2026*).

Cline KHÔNG tự biến các proposal này thành design truth nếu chưa có lệnh trực tiếp từ Owner. Cấu trúc DOM đề xuất (chỉ mang tính tham khảo cấu trúc, không code ngay):

```html
<header class="editorial-header">
   <!-- Layer 1: Utility/Meta -->
   <div class="header-meta-strip">
       <!-- [PROPOSAL] Date / Meta -->
   </div>
   
   <!-- Layer 2: Masthead/Nameplate -->
   <div class="header-nameplate">
       <a href="#/">
           <img src="assets/images/logoGiaToc_ngang.svg" class="editorial-logo" alt="Gia Tộc Trần Trọng Thu">
       </a>
   </div>
   
   <!-- Layer 3: Editorial Navigation -->
   <nav class="header-nav-layer">
       <ul>
           <li><a href="#/gia-pha">Gia Phả</a></li>
           <!-- Các route giữ nguyên -->
       </ul>
   </nav>
</header>
```
