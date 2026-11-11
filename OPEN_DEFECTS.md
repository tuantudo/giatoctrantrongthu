# DANH MỤC LỖI TỒN TẠI & RỦI RO CHƯA ĐÓNG
## OPEN DEFECTS & EXTERNAL BLOCKERS REGISTER

**Phụ trách:** AGENT 06 (QA & Security Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. BẢNG DANH MỤC LỖI & RỦI RO (DEFECT LOG)

| Mã Lỗi / Vấn Đề | Mức Độ Nghiêm Trọng | Vị Trí / Bề Mặt | Mô Tả Hiện Tượng | Nguyên Nhân & Trạng Thái | Phương Án Xử Lý Khuyến Nghị |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **DEF-01** | `BLOCKER` (Production only) | Cloudflare WAF Edge | Người dùng đổi mật khẩu tại Production bị Cloudflare chặn lỗi 403 HTML (`Emergency Block API Mutations`). | Do WAF rule chưa bổ sung `/api/member/change-password` vào danh sách miễn trừ. Đang chờ Tuấn cập nhật trên Cloudflare Dashboard. | Cập nhật biểu thức WAF trên Cloudflare theo hướng dẫn tại `docs/audit/CHANGE_PASSWORD_SECURITY_REVIEW.md`. |
| **DEF-02** | `PENDING DEPLOY` | Synology NAS (`100.80.147.119`) | Mã nguồn backend và các trang HTML thành viên mới (`member_account.html`, `member_requests.html`...) chưa có trên NAS. | Chưa triển khai deploy lên Production NAS vì tuân thủ quy tắc đóng băng chờ Human Gate. | Sau khi Tuấn phê duyệt báo cáo, đồng bộ mã nguồn lên thư mục `/volume1/web/family-api/` trên NAS. |
| **DEF-03** | `ACCEPTABLE LIMITATION` | Kích thước tệp di ảnh | Chưa có cơ chế nén ảnh tự động trên client khi người dùng tải ảnh dung lượng lớn (> 10MB) từ điện thoại. | Giới hạn dung lượng upload hiện tại dựa vào cấu hình Express và Nginx trên NAS. | Sẽ bổ sung module canvas resize ảnh phía client trong đợt phát triển tiếp theo. |

---

## 2. KẾT LUẬN VỀ CHẤT LƯỢNG MÃ NGUỒN NỘI BỘ
- Không có lỗi nghiêm trọng (Critical/High) nào trong phạm vi mã nguồn cục bộ của repository.
- Toàn bộ các luồng công việc nội bộ đã vượt qua kiểm thử tự động 100%.
- Chỉ còn 2 rào cản ngoại vi (WAF Cloudflare và Deploy NAS) thuộc thẩm quyền phê duyệt của Tuấn tại Human Gate.

