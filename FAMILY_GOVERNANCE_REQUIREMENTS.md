# QUY CHẾ QUẢN TRỊ GIA ĐÌNH & YÊU CẦU PHÂN QUYỀN
## FAMILY GOVERNANCE REQUIREMENTS

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 05  
**Ngày ban hành:** 2026-11-11  

---

## 1. NĂM NGUYÊN TẮC QUẢN TRỊ NỀN TẢNG (THE 5 GOVERNANCE PILLARS)

1. **Nguyên tắc Đương sự (Subject Access Right):**
   - Bất kỳ thành viên nào được nhắc đến trong phả hệ đều có quyền tiếp cận toàn bộ hồ sơ 6 tầng liên quan trực tiếp đến bản thân và cha mẹ ruột của mình.
   - Thành viên có quyền yêu cầu đính chính thông tin cá nhân chưa chính xác thông qua cơ chế đề xuất (`proposals`).

2. **Nguyên tắc Quản lý Gia đình (Family Stewardship):**
   - Thông tin chung của gia đình mặc định do Người quản lý gia đình (Family Steward) hoặc người được dòng họ ủy quyền trông coi, bảo tồn.
   - Mọi thay đổi dữ liệu chính thức vào CSDL phả hệ cốt lõi (`people`, `families`) bắt buộc phải được người quản lý gia đình xem xét, đối chiếu với gia phả gốc và bia mộ trước khi phê chuẩn.

3. **Nguyên tắc Bất Bình Đẳng Chức Năng (Non-Uniform Functional Roles):**
   - Không áp dụng bình đẳng cào bằng giữa các vai trò gia đình.
   - Người lớn tuổi, bậc trưởng thượng có vai trò làm chứng, cung cấp hồi ức và lời kể; người trẻ có kỹ năng công nghệ hỗ trợ số hóa và nhập liệu; Người quản lý gia tộc giữ quyền phê duyệt cuối cùng.

4. **Nguyên tắc Tách biệt Thẩm quyền Kỹ thuật & Di sản (Technical vs Heritage Authority):**
   - **Thẩm quyền Kỹ thuật (Technical Admin):** Cài đặt server, sao lưu CSDL, quản trị mạng, vá lỗi bảo mật, cấp tài khoản hệ thống.
   - **Thẩm quyền Di sản (Heritage Steward):** Thẩm định câu chuyện, xác minh quan hệ huyết thống, quyết định công bố tư liệu kỷ niệm của dòng tộc.
   - Người nắm chìa khóa kỹ thuật không đồng nghĩa với việc có toàn quyền quyết định về văn hóa và di sản gia đình.

5. **Nguyên tắc Phân định 5 Cấp Độ Quyền Hạn (5-Tier Operation Rights):**
   - **Đọc (Read):** Khám phá phả đồ, xem kho di ảnh chung, đọc bài viết công bố trên MẠCH.
   - **Đóng góp (Contribute):** Gửi đề xuất đính chính, tải lên ảnh kỷ niệm, viết câu chuyện ký ức (lưu vào hàng đợi kiểm duyệt `PENDING`).
   - **Chỉnh sửa (Edit / Curate):** Biên tập lại nội dung câu chuyện, chuẩn hóa chính tả tiếng Việt, gắn nhãn nhân vật cho ảnh.
   - **Phê duyệt (Approve):** Ra quyết định chấp thuận đưa đề xuất vào CSDL chính thức.
   - **Công bố (Publish):** Đưa tư liệu từ trạng thái nội bộ chi nhánh sang trạng thái toàn gia tộc.

