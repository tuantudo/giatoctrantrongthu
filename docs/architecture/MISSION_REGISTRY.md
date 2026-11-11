# MISSION REGISTRY

Danh mục các Nhiệm vụ (Missions) được định nghĩa sẵn. Các Mission này là khuôn mẫu (Templates) để Agent thực thi.

## 1. NAS_FLASHDRIVE_MIGRATION
- **PURPOSE:** Đưa dữ liệu thô từ ổ đĩa cắm ngoài (đang lạc lõng ở `homes`) vào đúng quy trình T-DOS `01_INBOX`.
- **ROLE:** Migration Engineer.
- **REQUIRED CAPABILITIES:** `filesystem.read`, `filesystem.move`, `validation.architectural`.
- **AUTHORIZED ACTIONS:** Đọc cấu trúc file, tạo lệnh di dời (`mv`).
- **FORBIDDEN ACTIONS:** Xóa (`rm`), Đổi quyền (`chmod`), Tự tắt Sync của Synology Drive.
- **VALIDATION:** File gốc biến mất, File đích tồn tại với cấu trúc không đổi. Không có file nào mất dữ liệu (size = 0).
- **HUMAN GATE:** (1) Yêu cầu Human tắt Sync trước khi chạy. (2) Yêu cầu Human duyệt file manifest trước khi Move.
- **STATUS:** DRAFT.

## 2. LEGACY_ACCOUNT_CLEANUP
- **PURPOSE:** Gỡ bỏ các tài khoản cũ (`tuantudo`) khỏi danh sách index để khôi phục sức khỏe cho Universal Search.
- **ROLE:** NAS Administrator.
- **REQUIRED CAPABILITIES:** Không có API công khai.
- **AUTHORIZED ACTIONS:** Tạo hướng dẫn cho Human làm trên GUI.
- **FORBIDDEN ACTIONS:** Tự ý chạy script can thiệp vào Database ngầm của DSM.
- **VALIDATION:** Trạng thái "Re-indexing needed" biến mất trên GUI.
- **HUMAN GATE:** Yêu cầu Human tự thực thi trên GUI.
- **STATUS:** DRAFT.

## 3. ARCHITECTURE_KNOWLEDGE_CONSOLIDATION
- **PURPOSE:** Đóng băng lịch sử, thu gọn bề mặt tri thức (Working Knowledge Surface) để giảm Cognitive Load cho Hệ thống và Human.
- **ROLE:** Architecture Authority / Synthesis Agent.
- **REQUIRED CAPABILITIES:** `filesystem.read`, `filesystem.write`, `validation.architectural`.
- **AUTHORIZED ACTIONS:** Đọc tài liệu, Move tài liệu cũ vào Archive, Viết tài liệu Current_*.
- **FORBIDDEN ACTIONS:** Delete (Xóa bằng chứng), Đổi cấu hình NAS, Thay đổi code GiaToc.
- **VALIDATION:** Không còn tài liệu trùng lặp. Đọc file Current_* là hiểu ngay trạng thái hệ thống.
- **HUMAN GATE:** Báo cáo sau khi hoàn tất.
- **STATUS:** COMPLETED.
