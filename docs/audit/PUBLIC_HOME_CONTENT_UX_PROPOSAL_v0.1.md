# PUBLIC HOME — CONTENT & UX/UI PROPOSAL v0.1

## 1. Executive Summary
Báo cáo này đề xuất chiến lược Nội dung (Content) và Trải nghiệm (UX/UI) cho Public Home của Gia Tộc Trần Trọng Thu. Mục tiêu tối thượng là phá vỡ cảm giác "Tài liệu hệ thống" (Documentation) hay "Trang đích tiếp thị" (Landing Page), để trả Public Home về đúng bản chất: **Cánh Cổng của một Thiết chế Gia tộc**. Đề xuất đưa ra 3 Concept trải nghiệm khác nhau để Human Authority (Tuấn) xem xét và chốt định hướng trước khi tiến hành code.

## 2. Evidence / Current Understanding
Dựa trên `brand/01_BRAND_CONSTITUTION.md` và `brand/02_BRAND_NARRATIVE.md`:
- **[FACT]** GIATỘC là một thiết chế văn hóa/kho lưu trữ gia đình.
- **[FACT]** Public Home là ranh giới phân định Trong/Ngoài. Tuyệt đối không rò rỉ dữ liệu Genealogy, Clara, MẠCH.
- **[FACT]** Gia tộc hiện chưa có public statement (Sự vắng mặt này là một Deliberate Silence).

## 3. Current Problem
**Tại sao các phương án trước đây (có đánh số 01, 02, 03) lại thất bại?**
- **Lỗi Content:** Sử dụng ngôn ngữ giải thích hệ thống ("Đây là không gian chính thức trên mạng..."). Homepage đang tự giới thiệu nó là một "website", thay vì giới thiệu nó là một "Gia tộc".
- **Lỗi Information Architecture (IA):** Tổ chức thông tin theo luồng tính năng (Voice -> About -> Gate). Người dùng có cảm giác đang đọc một bản hướng dẫn sử dụng.
- **Lỗi UX / Mental Model:** Trộn lẫn hành trình của người ngoài và người trong thành một danh sách tuyến tính. Nó triệt tiêu cảm giác "Không gian" (Spatial feel) và "Bước qua ngưỡng cửa" (Threshold).

## 4. Audience Model
### 4.1 Outsider (Người ngoài)
- **Thấy gì đầu tiên:** Tên Gia Tộc (Identity). Uy nghi, rõ ràng.
- **Nhận ra điều gì:** Đây không phải một blog cá nhân hay mạng xã hội. Đây là một thực thể có tổ chức, có ranh giới và có tính lịch sử.
- **Hành động:** Đọc thông điệp (nếu có). Cảm nhận sự tĩnh lặng. Rời đi với sự tôn trọng.

### 4.2 Family Member (Người trong nhà)
- **Dấu hiệu nhận diện:** Sự quen thuộc của Tên Gia Tộc và thiết kế tĩnh lặng, không ồn ào.
- **Cảm giác thuộc về:** "Đây là nhà mình, dữ liệu của mình được bảo vệ sau cánh cổng này."
- **Hành động:** Tìm thấy Cửa vào (Member Gate) ngay lập tức mà không có cảm giác đang bấm vào một nút "Đăng ký/Đăng nhập SaaS".

## 5. Homepage Role
Homepage không phải là nơi giữ chân (retention). Homepage là một **Bia đá (Monument)** và **Bức tường (Boundary)**. Giao tiếp ít nhất có thể, nhưng mỗi từ phải có trọng lượng ngàn cân.

## 6. Content Strategy
- **Identity:** `Gia Tộc Trần Trọng Thu`. (Bắt buộc).
- **Subtitle:** `Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.` (Rất tốt, giữ nguyên).
- **Outward Voice:** Không cố gắng lấp liếm sự trống trải. Im lặng là một thông điệp.
- **Inward Gate:** Không gọi là "Tính năng đăng nhập". Nó là "Lối vào".
- **[CONTENT GAP]:** Hiện tại dự án chưa có một câu chuyện lịch sử hay Tuyên ngôn thực sự của gia tộc. Không được tự bịa. Khuyến nghị: Dùng sự tối giản để bù đắp content gap.

---

## 7. Concept A: THE MONUMENT (Tượng Đài Tĩnh Lặng)
- **Core Idea:** Biến Homepage thành một bức tường đá nguyên khối. Không có cuộn trang (No scroll).
- **Audience Interpretation:** Bề thế, bí ẩn, quyền lực và không thỏa hiệp.
- **Emotional Target:** Sự kính trọng tuyệt đối (Reverence).
- **Content Architecture:** Chỉ có Tên Gia Tộc, Subtitle và một khe hẹp (Login) ở góc dưới. Không có phần "Tiếng nói" hay "Về gia tộc".
- **UX Model:** Single viewport. Zero scroll.
- **Visual Composition:** H1 nằm chính giữa màn hình (Center aligned). Nút Login nhỏ, nằm khiêm tốn ở góc dưới cùng bên phải.
- **Strength:** Tối giản tột độ, giải quyết triệt để Content Gap. Tránh hoàn toàn cảm giác website.
- **Risk:** Quá trống trải, có thể khiến người ngoài không hiểu trang này dùng để làm gì.

## 8. Concept B: THE DICHOTOMY (Lưỡng Nghi / Bố Cục Rẽ Nhánh)
- **Core Idea:** Homepage có 2 nhịp. Nhịp 1 là Threshold. Nhịp 2 chia đôi thế giới thành Hướng Ngoại và Hướng Nội.
- **Audience Interpretation:** Gia tộc phân minh, rõ ràng, có đối thoại với thế giới nhưng cũng có kỷ luật nội bộ.
- **Emotional Target:** Sự an tâm và rõ ràng (Clarity & Safety).
- **Content Architecture:** [THRESHOLD] -> Cuộn -> [LEFT: OUTWARD SILENCE] | [RIGHT: INWARD GATE].
- **UX Model:** Bố cục chia cột (Split layout). Trái là thông điệp cho người ngoài, Phải là lối vào cho thành viên.
- **Visual Composition:** Lưới đối xứng. Typographic rules chia cắt không gian mạnh mẽ.
- **Strength:** Giải quyết hoàn hảo bài toán 2 tệp Audience mà không bị trộn lẫn.
- **Risk:** Cần duy trì sự cân bằng của lượng chữ ở 2 cột để không bị lệch bố cục.

## 9. Concept C: THE ARCHIVE ENTRANCE (Lối Vào Tàng Thư)
- **Core Idea:** Homepage đóng vai trò như một lời tựa (Foreword) của một cuốn Kỷ yếu lớn.
- **Audience Interpretation:** Cảm giác học thuật, lưu trữ, lịch sử lâu đời.
- **Emotional Target:** Sự sâu lắng (Reflection).
- **Content Architecture:** Một đoạn Institutional Statement (Về gia tộc) đặt làm trọng tâm. Cổng vào được tích hợp như một lời chú thích (Footnote) ở cuối trang.
- **UX Model:** Editorial reading flow. Đọc một mạch từ trên xuống.
- **Visual Composition:** Lưới văn bản hẹp (Reading measure). Căn trái (Left-aligned), khoảng trắng khổng lồ bên phải.
- **Strength:** Cực kỳ giống một ấn phẩm in ấn (Publication). Mang đậm chất Institutional.
- **Risk:** Yêu cầu phải có một đoạn Content cực kỳ chất lượng (Hiện tại đang bị CONTENT GAP).

---

## 10. Comparative Analysis
| Yếu tố | Concept A (Monument) | Concept B (Dichotomy) | Concept C (Archive) |
|---|---|---|---|
| Mức độ Tĩnh lặng | Rất cao | Trung bình | Cao |
| Tính định hướng User | Thấp | Rất cao (Chia 2 luồng) | Trung bình |
| Rủi ro thiếu Content | Không rủi ro | Thấp | **Rủi ro cao** |
| Hơi hướng | Bức tường / Bia đá | Không gian kiến trúc | Sách / Kỷ yếu |

## 11. Recommended Direction
**[AGY PROPOSAL — HUMAN DECISION REQUIRED]**
Agy đề xuất chọn **Concept B (The Dichotomy)**.
*Lý do:* Giải quyết triệt để vấn đề phục vụ 2 nhóm Audience mà không biến trang thành tài liệu tuyến tính. Khối "Tiếng nói" (Trái) trở thành nơi lý tưởng để phô diễn "Deliberate Silence", trong khi Khối "Gate" (Phải) thực hiện xuất sắc chức năng đưa thành viên vào trong mà không cần một Nút CTA kiểu SaaS.

---

## 12. Content Architecture (Áp dụng cho Concept B)
1. **[IDENTITY]**
   - H1: Gia Tộc Trần Trọng Thu
   - Subtitle: Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.
2. **[OUTWARD PATH]**
   - Heading: Tiếng nói của gia tộc
   - Body: Gia tộc hiện chưa có điều muốn nói ra ngoài.
3. **[INWARD PATH]**
   - Heading: Người trong gia tộc
   - Action: Vào không gian của gia tộc
   - Hint: Dành riêng cho những người trong nhà.

## 13. UX Architecture
- **Header:** Chỉ chứa nút Đăng Nhập dự phòng và Home. Tên gia tộc ẩn đi để nhường sân khấu cho H1.
- **First Viewport:** 100% không gian dành cho IDENTITY. Người dùng buộc phải xác nhận mình đang ở đâu trước.
- **Scroll Viewport:** Người dùng cuộn xuống và ngay lập tức thấy ngã ba đường (OUTWARD vs INWARD). Họ sẽ tự biết mình thuộc về bên nào.
- **Footer:** Chạm đáy. Tối giản tuyệt đối.

## 14. Visual / UI Composition
*Mô phỏng Wireframe:*
```text
[ HEADER TỐI GIẢN - KHÔNG TRANH CHẤP ]
---------------------------------------------------------

               GIA TỘC TRẦN TRỌNG THU
   Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.

---------------------------------------------------------
(Cuộn chuột)

TIẾNG NÓI CỦA GIA TỘC            |  NGƯỜI TRONG GIA TỘC
                                 |
Gia tộc hiện chưa có điều        |  [ VÀO KHÔNG GIAN CỦA GIA TỘC ]
muốn nói ra ngoài.               |  
                                 |  Dành riêng cho những người 
                                 |  trong nhà.

---------------------------------------------------------
© 2026 Gia Tộc Trần Trọng Thu.
```
- **Typography-led:** Mọi khối đều là text Serif. Không dùng box nền xám.
- **Rule:** Cột trái và phải phân cách bằng khoảng trắng (Gutters), hoặc một đường kẻ dọc (Vertical Rule) mảnh bọc tính editorial.

## 15. Responsive / Mobile Behavior
Trên Mobile, layout Dichotomy bắt buộc phải cuộn dọc (Stack).
- Thứ tự: IDENTITY -> OUTWARD -> INWARD.
- Để tránh cảm giác "Linear Documentation" như bản cũ, Khối INWARD sẽ được bọc bởi Border ngang (Top/Bottom rules) để tạo cảm giác "Gate", tách biệt hoàn toàn về mặt thị giác so với khối OUTWARD phía trên.

## 16. Content Gaps
- Khối "Về gia tộc": Dự án hiện chưa có một Tuyên ngôn (Manifesto) hay lịch sử ngắn gọn nào đủ chất lượng để đưa ra Public. Các đoạn văn giải thích website đều bị loại bỏ vì phá vỡ sự trang nghiêm. Do đó, Agy đề xuất KHÔNG cố gắng viết khối "Về gia tộc" ở v0.1.

## 17. Open Questions for Tuấn
**[HUMAN DECISION REQUIRED]**
1. Anh Tuấn chọn Concept A, B, hay C?
2. Anh có đồng ý với Content Architecture của Concept B (lược bỏ khối "Về gia tộc" để giữ sự tĩnh lặng tuyệt đối) không?

## 18. Implementation Handoff
Chỉ khi Tuấn duyệt Proposal này, Agy mới tiến hành tạo các Spec kỹ thuật và triển khai code.
- Không đụng chạm Inner Site.
- Không sửa Database/Auth.
- Các Boundary đã được bảo toàn 100%.

*(End of Proposal)*
