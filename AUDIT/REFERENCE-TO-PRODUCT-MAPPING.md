# BẢN ĐỒ ÁNH XẠ HỆ QUY CHIẾU FAMILYSEARCH VÀO SẢN PHẨM GIA TỘC (PHASE 2D - PART 2)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Strategy:** AGY (Chief Orchestrator & Integration Authority)  
**Căn cứ đối chiếu:** [`AUDIT/FAMILYSEARCH-REFERENCE-MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FAMILYSEARCH-REFERENCE-MAP.md), `AUDIT/MASTER_COMPLETION_PLAN.md`  
**Thời điểm hoàn thành:** 06/11/2026  

---

## 1. NGUYÊN TẮC ÁNH XẠ BỐN NHÓM QUYẾT ĐỊNH (FOUR-QUADRANT MAPPING)

Mọi chức năng học hỏi từ FamilySearch khi đối chiếu vào bài toán Gia Tộc Trần Trọng Thụ được phân loại dứt khoát vào 4 nhóm:
1. **[GIỮ NGUYÊN]:** Kế thừa nguyên vẹn logic hoặc cấu trúc chuẩn mực của FamilySearch vì đã tối ưu về mặt khoa học phả hệ.
2. **[CẢI TIẾN]:** Điều chỉnh và nâng cấp để phù hợp với văn hóa thờ phụng tổ tiên, xưng hô tôn ti trật tự của gia tộc Việt Nam.
3. **[BỔ SUNG MỚI]:** Xây dựng các năng lực đặc thù của dòng họ Trần Trọng Thu mà FamilySearch hoàn toàn không có.
4. **[KHÔNG ÁP DỤNG]:** Kiên quyết bác bỏ các cơ chế mở của FamilySearch có nguy cơ phá vỡ tính tôn nghiêm hoặc vi phạm quyền riêng tư.

---

## 2. MA TRẬN ÁNH XẠ CHI TIẾT 14 NHÓM CHỨC NĂNG

| STT | Phân hệ FamilySearch | Phân loại | Giải pháp & Thiết kế áp dụng cho Gia Tộc Trần Trọng Thụ | Lý do kiến trúc & Văn hóa gia tộc |
| :---: | :--- | :---: | :--- | :--- |
| **01** | **Person Profile** | **CẢI TIẾN** | Áp dụng mô hình **Hồ sơ 6 tầng (Person 6 Layers)**:<br>1. Căn cước (Identity)<br>2. Thân tộc (Relations)<br>3. Tư liệu chứng cứ (Evidence)<br>4. Ký ức văn hóa (Memories)<br>5. Tranh biện lịch sử TP-024 (Disputes)<br>6. Đề xuất hiệu đính TP-003 (Proposals) | FamilySearch chỉ có Vitals & Sources. Gia tộc Việt Nam cần thêm tầng Ký ức truyền khẩu và cơ chế Tranh biện ôn hòa khi có dị bản về năm sinh, quê quán tiền nhân. |
| **02** | **Family Relationships** | **GIỮ NGUYÊN** | Kế thừa chuẩn liên kết Cha-Mẹ-Con (`FAMC`) và Vợ-Chồng (`FAMS`), hỗ trợ đầy đủ các trường hợp đa thê/đa phu trong lịch sử gia tộc. | Chuẩn GEDCOM 5.5.1 của FamilySearch đã rất tối ưu và logic cho cấu trúc gia đình hạt nhân. |
| **03** | **Tree Visualization** | **CẢI TIẾN** | Thay vì cây toàn cầu vô tận, áp dụng mô hình **3-Tier Me-Centric Tree**:<br>- Tier 1: Bậc Phụ Mẫu (2 thẻ cha mẹ)<br>- Tier 2: Đương Sự & Hôn Phối (Tâm điểm)<br>- Tier 3: Hậu Duệ Trực Hệ (Các con)<br>- Kèm **Lineage Breadcrumbs** lần theo huyết thống về mốc Cố Thu (`@I1@`). | Tránh sự choáng ngợp. Tạo cảm giác ấm cúng, người dùng thấy người thân gần gũi với mình trước (`DEC-03`), sau đó mới mở rộng cây. |
| **04** | **Sources & Citations** | **CẢI TIẾN** | Tích hợp chứng cứ trực tiếp vào Tầng 3 (Evidence) của Hồ sơ cá nhân: đính kèm ảnh chụp văn tự chữ Nho, gia phả chép tay, trích lục khai sinh, ảnh bia mộ. | Bù đắp lỗ hổng thiếu thẻ `SOUR` trong file GEDCOM gốc. Nâng cao tính tin cậy học thuật cho phả hệ. |
| **05** | **Evidence & Research** | **CẢI TIẾN** | Chuyển hóa thành tính năng **Tranh Biện & Ghi Chú Lịch Sử TP-024 (Disputes)**, cho phép con cháu ghi nhận các giả thuyết khác nhau mà không làm hỏng dữ liệu gốc. | Tôn trọng sự thật lịch sử; không áp đặt chủ quan khi chưa có đủ chứng cứ xác đáng. |
| **06** | **Memories / Media** | **CẢI TIẾN** | Phân chia thành 3 không gian lưu trữ chuyên biệt:<br>1. Kho 185 ảnh tư liệu gia tộc (`Archive Domain`)<br>2. Không gian xuất bản MẠCH (`Editorial Domain`)<br>3. Không gian thiêng liêng Thư gửi Clara (`Clara Containment`) | FamilySearch gộp chung media vào một kho. Gia tộc cần phân định ranh giới giữa tư liệu chung và tài liệu riêng tư của từng chi nhánh. |
| **07** | **Timeline & Events** | **CẢI TIẾN** | Tích hợp sâu với **Lịch Âm Dương Gia Tộc (Calendar Domain)**, tự động quy đổi lịch mặt trăng để báo ngày giỗ tổ, ngày giỗ các cụ theo chu kỳ hàng năm. | Phả hệ Việt Nam gắn liền với phụng tự tổ tiên và ngày giỗ âm lịch, điều mà FamilySearch phương Tây không hỗ trợ tự nhiên. |
| **08** | **Places & Maps** | **BỔ SUNG** | Xây dựng bản đồ biên niên di cư: Tái hiện hành trình từ miền Bắc di cư vào miền Nam lập nghiệp qua các mốc địa danh lịch sử. | Thể hiện đúng câu chuyện cội nguồn và di sản mở cõi của dòng họ Trần Trọng Thu. |
| **09** | **Search & Discovery** | **CẢI TIẾN** | Xây dựng công cụ tra cứu **Archival List** với thuật toán Collation tiếng Việt (`localeCompare('vi')`) và khử dấu tổ hợp (NFD normalization). | Giúp các bậc cao niên dễ dàng gõ tên tìm kiếm người thân mà không bị lỗi bộ gõ tiếng Việt. |
| **10** | **Duplicate & Merge** | **BÁC BỎ (REJECT)** | **TUYỆT ĐỐI KHÔNG ÁP DỤNG HỢP NHẤT TỰ ĐỘNG.** | Mô hình crowd-sourced merge của FamilySearch thường xuyên làm hỏng dữ liệu phả hệ. Dữ liệu gia tộc được bảo toàn tập trung, chỉ sửa đổi qua Ban Quản Trị. |
| **11** | **Collaboration** | **CẢI TIẾN** | Thay vì cho sửa trực tiếp, áp dụng cơ chế **3 Hình Thức Đóng Góp Có Kiểm Duyệt (`DEC-05`)**:<br>1. Đóng góp ảnh tư liệu<br>2. Gửi bài viết MẠCH<br>3. Nộp phiếu đề xuất hiệu đính (Proposal Form TP-003). | Bảo đảm trật tự gia phong; ngăn ngừa việc người ngoài hoặc con cháu sơ suất làm sai lệch thông tin tiền nhân. |
| **12** | **Privacy & Permissions** | **BỔ SUNG MỚI** | Xây dựng ma trận bảo mật đa lớp:<br>- Cửa ngõ Gateway chặn toàn bộ khách vãng lai.<br>- Quyền Người Xuất Hiện cao hơn Người Tải Lên (`DEC-08`).<br>- Cô lập tuyệt đối Thư gửi Clara bằng token máy chủ (`DEC-09`). | Chính sách bảo mật của FamilySearch (mở toàn bộ người chết cho công chúng) không phù hợp với thuần phong mỹ tục và đạo hiếu Việt Nam. |
| **13** | **Change History** | **GIỮ NGUYÊN** | Ghi nhận Audit Log toàn bộ thao tác duyệt đề xuất, chỉnh sửa thông tin trong CSDL kèm khả năng rollback an toàn. | Đảm bảo tính minh bạch và truy vết trách nhiệm của Ban Quản Trị. |
| **14** | **User Management** | **BỔ SUNG MỚI** | Phân quyền gắn liền với danh tính gia phả (Identity Mapping): Liên kết tài khoản đăng nhập với chính vị trí của người đó trên cây phả hệ. | Giúp hệ thống tự động xác định quan hệ xưng hô của người dùng với toàn bộ 223 thành viên trong dòng họ. |

---

## 3. TỔNG KẾT CHIẾN LƯỢC SẢN PHẨM

Chiến lược phát triển sản phẩm của Gia Tộc Trần Trọng Thụ định vị rõ ràng:
- **Học hỏi FamilySearch ở tầng khoa học:** Tiếp thu cấu trúc chuẩn mực về quan hệ gia đình hạt nhân, chuẩn lưu trữ chứng cứ lịch sử và phương pháp trực quan hóa phả hệ.
- **Vượt trội FamilySearch ở tầng văn hóa & an ninh:** Xây dựng hệ thống mang đậm bản sắc hiếu đạo Việt Nam (Lịch âm dương ngày giỗ, xưng hô chuẩn mực, cây phả hệ Me-Centric ấm áp) và bảo vệ dữ liệu gia tộc khép kín, an toàn tuyệt đối.

