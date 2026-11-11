# ART DIRECTION V1: THE LIVING CHRONICLE (BIÊN NIÊN SỬ SỐNG ĐỘNG)

## 1. Art Direction Premise
Gia Tộc Trần Trọng Thu không phải là một cơ sở dữ liệu. Nó là một **Biên niên sử sống động**.
Trải nghiệm thị giác phải mang lại cảm giác lật giở một kho lưu trữ quý giá của gia đình: trang nghiêm, tĩnh lặng, chính xác về mặt lịch sử nhưng vẫn chứa đựng hơi ấm của ký ức con người.

## 2. Emotional Character
**"Solemnity & Warmth" (Trang nghiêm & Ấm áp)**
Tôn kính quá khứ mà không trở nên lạnh lẽo. Dữ liệu (ngày tháng, phả hệ) được trình bày với sự lạnh lùng của khoa học lưu trữ, nhưng những câu chuyện và chân dung lại tỏa ra hơi ấm của dòng máu.

## 3. Typography Direction
Sự tương phản cực đại (Extreme Contrast):
- **Display (EB Garamond):** Rất lớn, mỏng, thanh lịch (dùng cho Tên người, Tiêu đề). Tạo cảm giác vĩ đại của thời gian.
- **Metadata (Inter):** Rất nhỏ (11-12px), in hoa, khoảng cách chữ siêu rộng (tracking `0.1em`). Trông như những dòng chữ được dập chìm trên các thẻ hồ sơ lưu trữ (`BORN 1872`, `FSID: G5X4-48S`).

## 4. Image Direction
**"The Archival Mount" (Khung ảnh lồng giấy)**
Hình ảnh không bao giờ tràn viền một cách vô tội vạ. Mọi bức ảnh (chân dung, tư liệu) đều được "mount" (đóng khung) bằng một đường viền hairline, có padding bên trong màu giấy ngà, mô phỏng cách các bức ảnh cũ được dán vào album gia đình.

## 5. Composition Direction
**"The Ledger & The Novel" (Sổ sách & Tiểu thuyết)**
- Bố cục thông tin định danh (Person, Tree) tuân theo cấu trúc Sổ sách (Ledger): sử dụng các đường kẻ ngang/dọc kéo dài, căn lề trái tuyệt đối, cột dữ liệu rõ ràng.
- Bố cục kể chuyện (Story) tuân theo cấu trúc Tiểu thuyết: cột text hẹp ở giữa trang, khoảng trắng mênh mông hai bên, dồn sự tập trung tuyệt đối vào văn bản.

## 6. Graphic Language
- **The Red Seal (Dấu triện đỏ):** Màu đỏ sơn mài (`#8A2D23`) chỉ được dùng như một con dấu xác thực. Nó xuất hiện dưới dạng các chấm tròn nhỏ chỉ báo trạng thái (Active/Live) hoặc đường gạch chân mỏng ở các Navigation đang được chọn.
- **Hairline Rules:** Mọi đường phân cách đều mỏng 1px, màu xám nhạt (`#E8E6DF`). Không dùng box che phủ, chỉ dùng line để phân chia.

## 7. Motion Direction
**"The Quiet Reveal" (Sự xuất hiện tĩnh lặng)**
Không có các animation trượt (slide) hay nảy (bounce) kiểu app. Chuyển trang (Page Transition) sử dụng hiệu ứng Fade-in chậm rãi (0.4s), mang cảm giác mực từ từ hiện lên trên mặt giấy. Hover effect chỉ đổi màu chữ hoặc độ đậm viền, không phóng to (no scale).

## 8. Design Signatures (Recognition Points)
1. **The Book Running Head:** Thanh Navigation trên cùng không giống menu app, mà giống tiêu đề đầu trang của một cuốn sách (chữ nhỏ, serif, viền dưới mảnh).
2. **The Typographic Extremes:** Sự đứng cạnh nhau của Tên Cụ Tổ cực to (Serif) và Metadata cực nhỏ (Sans-serif, All-caps).
3. **The Padded Photograph:** Mọi bức ảnh đều có khoảng không (padding) giữa viền hình và viền khung.
4. **The Chop:** Các chấm hoặc gạch đỏ sậm (Sơn mài) làm tín hiệu thị giác.

## 9. Implementation Priorities (V1)
1. (P0) Thay đổi Global CSS để tích hợp Typography Scale mới và Motion "Quiet Reveal".
2. (P1) Thiết kế lại Homepage thành một bìa sách đích thực, không phải là một Dashboard nút bấm.
3. (P1) Nâng cấp Person Page để áp dụng "Archival Mount" cho ảnh chân dung.
4. (P1) Tinh chỉnh Global Navigation thành Running Head.
