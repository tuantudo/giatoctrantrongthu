# V0 VISUAL FORENSIC / COMPOSITION ANALYSIS v0.6

## 1. PHƯƠNG PHÁP NGHIÊN CỨU
- **Target:** `prototype/design-001-public/index.html` (Nguồn gốc thực sự của runtime V0 `localhost:8080`).
- **Nhiệm vụ:** Phân tích giải phẫu học (Anatomy) cấu trúc trình bày, không can thiệp vào CSS hay Code.
- **Tiêu điểm:** Composition, Focal Point, Visual Hierarchy.

## 2. V0 COMPOSITION MAP (BẢN ĐỒ THỊ GIÁC)

Dưới đây là cấu trúc khung nhìn từ trên xuống dưới của V0:

```text
┌─────────────────────────────────────────────────────────┐
│ UTILITY STRIP (Ngày tháng, Icon công cụ, Member link)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MASTHEAD (LOGO ĐỒ HOẠ SVG LỚN NGANG)                    │
│ [ ABSOLUTE FOCAL POINT ]                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ STICKY PUBLICATION NAVIGATION                           │
│ (Trang chủ | MẠCH | Tư liệu | Gia phả | Lịch ...)       │
├─────────────────────────────────────────────────────────┤
│ INTRODUCTION                                            │
│ - Headline: Gia Tộc TTT là ai?                          │
│ - Draft Copy + Thống kê                                 │
├─────────────────────────────────────────────────────────┤
│ CHOOSE YOUR PATH (BỐ CỤC 2 CỘT / SPLIT LAYOUT)          │
│ ┌───────────────────────┐ ┌───────────────────────────┐ │
│ │ Hướng 1: Công Khai    │ │ Hướng 2: Thành viên       │ │
│ │ (Khám phá gia tộc)    │ │ (Vào cửa Member Space)    │ │
│ └───────────────────────┘ └───────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ CURATED CONTENT (MẠCH Tuyển chọn, Ký ức, Tư liệu)       │
│ (Tạo chiều sâu và độ đặc cho trang)                     │
├─────────────────────────────────────────────────────────┤
│ COLOPHON / FOOTER                                       │
└─────────────────────────────────────────────────────────┘
```

## 3. PHÂN TÍCH VÌ SAO V0 "TỐT" (THE "WHY")

Sự không hài lòng của Human đối với V1 không nằm ở kích thước font chữ, mà nằm ở **sự mất mát về Cấu trúc (Composition)** do quá trình chuyển đổi. V0 sở hữu những yếu tố phân cấp thị giác xuất sắc mà V1 đã đánh mất:

### A. The Focal Point (Điểm neo thị giác)
V0 dùng một **Masthead (Logo SVG đồ họa lớn)** chiếm trọn bề ngang. Nó hoạt động như măng-sét của một tờ báo lớn (Editorial Masthead). Mắt người dùng bị hút vào đó ngay lập tức. 
Trong khi đó, V1 chỉ dùng một thẻ `<h1>Gia Tộc Trần Trọng Thu</h1>` text thuần túy. Dù có to đến đâu, một dòng text không tạo được sức nặng thị giác (Visual Weight) bằng một Masthead đồ họa.

### B. The Structural Rhythm (Nhịp điệu cấu trúc)
V0 xếp chồng 3 lớp: `Utility Strip` (Mỏng) -> `Masthead` (Dày đặc) -> `Sticky Nav` (Mỏng). Sự tương phản Dày-Mỏng này tạo ra cảm giác của một **Ấn phẩm/Thiết chế (Institution/Magazine)** rất vững chãi.
V1 gom tất cả vào một `GlobalNav` dạng App Header mỏng dính. Trang bị mất "trọng tâm" ở phần đầu.

### C. The Split Hierarchy (Phân cấp hành động rõ ràng)
V0 sử dụng bố cục **2 cột (Choose Your Path)** đặt cạnh nhau: Hướng 1 (Công khai) và Hướng 2 (Thành viên). Bố cục này tạo ra sự so sánh trực quan (Contrast & Grouping), giúp não bộ người dùng xử lý ngay lập tức: "Tôi thuộc nhóm nào?".
V1 xếp chồng mọi thứ theo chiều dọc (Sequential), khiến các phần (Về gia tộc -> Người trong nhà) có vẻ như là những khối văn bản trôi nổi bằng vai phải lứa, không có sự ưu tiên.

### D. Density & Balance (Mật độ và Cân bằng khoảng trắng)
V0 ở dưới cùng có các khối `Curated Content` (MẠCH, Ký ức). Mặc dù về mặt Semantic, Human đã cấm mang nội dung này ra ngoài Public Home (để biến nó thành Cổng/Gate thuần túy). NHƯNG về mặt **Thị giác (Visual)**, sự biến mất của các khối này ở V1 để lại một khoảng trắng khổng lồ không có điểm tựa. V1 quá "loãng" so với sự bề thế của V0.

## 4. KẾT LUẬN (FORENSIC VERDICT)
Nguyên nhân gốc rễ: **Semantic Constraints của V1 đã vô tình tước đoạt toàn bộ vũ khí Thị giác (Visual Tools) của V0.**
- Lệnh "Chỉ dùng Icon và Đăng nhập" làm mất Sticky Nav.
- Lệnh "Không đưa MẠCH/Gia phả ra Public" làm mất vùng Curated Content.
- V1 đã ngoan ngoãn làm theo Semantic, nhưng lại không có một cơ chế Bù đắp Thị giác (Visual Compensation) nào để duy trì sự bề thế của một "Cổng Gia Tộc".

## STOP
Báo cáo hoàn tất. Không đề xuất code fix. Đợi lệnh Human.
