# PUBLIC HOME COMPOSITION RECONSTRUCTION v0.8

## 1. Objective
Chuyển giao Ngữ pháp Thị giác (Design Grammar) và Hệ thống Cấu trúc (Composition) từ V0 sang V1 nhằm khôi phục sự bề thế, điểm nhấn và nhịp điệu của trang chủ, đồng thời tuân thủ tuyệt đối Kiến trúc Ngữ nghĩa (Semantic Architecture) khắt khe của V1.

## 2. Human Constraints
- Giữ nguyên Semantic Architecture: Gate-only Public Home.
- Không khôi phục Navigation cũ (Chỉ có Home Icon + Login).
- Không rò rỉ nội dung MẠCH, Gia phả, Ký ức.
- Không sử dụng số liệu `228 nhân vật` hay `[DRAFT]`.
- Xóa bỏ Footer cũ (chứa link đến các trang nội bộ).

## 3. V0 Design Principles Transferred
- **Graphic Anchor:** Đưa SVG Logo ngang trở lại làm Masthead khổng lồ.
- **Split Hierarchy:** Tái sử dụng bố cục chia 2 cột để tạo tương phản không gian.
- **Publication Rhythm:** Tái sử dụng viền kẻ đôi (`3px double`), khoảng trắng lớn và cấu trúc canh giữa.

## 4. V0 Principles Deliberately Not Restored
- **Content Density:** KHÔNG tái tạo các Grid chứa bài viết MẠCH/Ký ức vì vi phạm luật Cổng Thông Tin.
- **Publication Nav:** KHÔNG khôi phục các thẻ tab trên Navigation Bar.

## 5. New Public Home Composition
```text
┌─────────────────────────────────────────────────────────────┐
│ NAV: [ Home Icon ]                              [ Đăng nhập ] │
├─────────────────────────────────────────────────────────────┤
│ 1. GRAPHIC ANCHOR: Masthead (Logo SVG Lớn + Double Border)  │
├─────────────────────────────────────────────────────────────┤
│ 2. ORIENTATION: Identity (Căn giữa, Text tĩnh lặng)         │
├─────────────────────────────────────────────────────────────┤
│ 3. COMMUNICATION: Tiếng nói của gia tộc (Full width)        │
├─────────────────────────────────────────────────────────────┤
│ 4. SPLIT COMPOSITION (Lưới 2 Cột Đối Xứng)                  │
│    [ Về gia tộc ]         │    [ Người trong gia tộc ]      │
├─────────────────────────────────────────────────────────────┤
│ FOOTER (Minimal, Không có link MẠCH/Gia phả)                │
└─────────────────────────────────────────────────────────────┘
```

## 6. Graphic Anchor
Thẻ H1 text khô khan đã được thay thế/ẩn đi (chỉ dùng cho Screen Reader `sr-only`). Trọng tâm thị giác tuyệt đối thuộc về khối `.gi-masthead` với logo đồ họa (max-width 600px), thiết lập ngay lập tức tính chất "Thiết chế" của website.

## 7. Information Hierarchy
- Masthead Logo -> Brand Name.
- Identity -> Mục đích cốt lõi của website.
- Tiếng nói -> Tiếng nói ra bên ngoài.
- Khối Cột Trái -> Giải thích nguồn gốc.
- Khối Cột Phải -> Lối vào thực sự (Action).

## 8. Visual Hierarchy
1. Mắt nhìn vào Masthead (Lớn nhất, trung tâm).
2. Trôi qua dòng Identity mỏng manh (Tạo khoảng nghỉ).
3. Đọc Section `01 - Tiếng nói` (Khối content trải dài đầu tiên).
4. Dừng lại ở ngã rẽ 2 cột (Split Composition) tạo ra sức ép bắt buộc phải chọn hành động (Khám phá text hay Bấm vào Gate).

## 9. Split / Non-linear Composition
Bố cục tuyến tính 1 cột nhàm chán của V1 đã bị phá vỡ. Việc đặt `Về gia tộc` và `Người trong nhà` cạnh nhau tạo ra một sự so sánh hoàn hảo: "Gia tộc này là ai" đặt cạnh "Nếu bạn thuộc về gia tộc này, hãy bước vào". Đây là một Compositional Device, không vi phạm IA.

## 10. Typography
Giữ vững Brand Governance: 100% Serif (Times New Roman), scale lớn, không viền đứt, không đổ bóng. Section Marker (`01`, `02`, `03`) dùng font-weight dày và màu Accent để tạo nhịp.

## 11. Spatial Rhythm
Sự co giãn Không gian (Spatial Tension):
- Nén (Nav) -> Nở (Masthead) -> Khoảng tĩnh (Identity) -> Trải rộng (Tiếng nói) -> Chia cắt (Split Grid) -> Đóng (Footer).

## 12. Responsive Composition
Trên Mobile (375px - 768px): Masthead tự động thu nhỏ, Khối Split Grid tự động Fallback về 1 cột dọc (Stacking). Nhịp điệu vẫn được bảo tồn nhờ các đường kẻ ngang.

## 13. Semantic Integrity
- Không có trang nào bị leak.
- Footer đã được làm sạch (Minimal).
- V0 Draft Copy và Statistics đã bị loại bỏ.
- Cửa vào Member Gate giữ nguyên cấu trúc URL `/login`.

## 14. Regression QA
- Family Threshold/Identity vẫn tồn tại? YES (Dưới dạng `gi-identity`).
- H1 hợp lệ? YES (`.sr-only` dành cho SEO/Screen Reader).
- MẠCH/Genealogy leak? NO.
- Prototype DESIGN-001 leak? NO.
- Old footer leak? NO.
- ContextBar leak? NO.
- Dashed borders / Drop shadows? NO.

## 15. Screenshot QA
(Mắt người dùng)
- **First Glance:** Masthead vững chãi như một tờ báo/kỷ yếu.
- **Second Glance:** Chạy theo các Marker `01, 02, 03`.
- **Action:** Nút bấm "Vào không gian của gia tộc" trong luồng cột phải hiện ra cực kỳ rõ ràng như cánh cửa.

## 16. Before / After Assessment
- **Before:** Một trang Word tuyến tính, rỗng tuếch, không có trọng lượng. Đọc xong không biết bấm vào đâu.
- **After:** Một ấn phẩm đồ họa tĩnh lặng, bề thế, có nhịp nghỉ, có sự dẫn dắt rõ rệt từ Identity đến Action. Mọi thứ tuân thủ Semantic.

## 17. Remaining Design Gaps
Sản phẩm hiện tại đã đạt trạng thái **DESIGN-READY** về mặt Cấu trúc. Giai đoạn tiếp theo (Graphic Design Detail) phụ thuộc vào Art Director để:
- Tinh chỉnh Micro-typography (khoảng cách từng chữ).
- Thay thế nội dung thật khi có source.
- Thêm các Graphic Treatment tinh xảo nếu cần.

## 18. Human Review Required
Quyền quyết định phê duyệt bản Reconstruction này hoàn toàn thuộc về Human Authority.
