# CURRENT STATE

## 1. Trạng Thái Tổng Quan (Overview)
Hệ thống vừa trải qua quá trình Khảo cổ Kiến trúc (Architecture Archaeology) và Reset Kiến trúc cho AIOS. Mọi tài liệu Audit cũ đã được đóng băng (Archived) để giảm Cognitive Load. Hệ thống chuyển sang vận hành dựa trên Capability Model.

## 2. NAS Data Landscape
- **Phân mảnh (Fragmentation):** Tồn tại sự phân mảnh nghiêm trọng. Dữ liệu thô (Raw dumps từ Flashdrives), Dữ liệu đang xử lý (Active Workspace), và Dữ liệu hệ thống đang nằm chung tại `/volume1/homes/tuandzain`.
- **Trùng lặp (Duplicates):** Hơn 34,000 nhóm file trùng lặp đã được phát hiện (Phase 2). Tâm chấn sinh ra duplicate là do sao chép lung tung giữa `homes` và `TUAN_FORGE`.
- **T-DOS Conformance:** Hệ thống đang bị vi phạm T-DOS do `homes` được dùng làm trạm Dumping Ground, trong khi `TUAN_FORGE` lại bị dùng làm nơi lưu trữ thay vì xử lý.

## 3. Synology Indexing Status
- **Universal Search:** Quá trình lập chỉ mục cho `TUAN_ATLAS` đã (Finished), `TUAN_FORGE` đang (Checking).
- **Lỗi Index:** Thư mục `homes` bị lỗi `Re-indexing needed` do vướng mắc với tài khoản cũ (Legacy Account `tuantudo`).
- **Năng lực:** Xác nhận Synology lập chỉ mục tên file (Filename) cực tốt, nhưng năng lực Semantic Search/Content Indexing cho Agent sử dụng qua API vẫn là một Ẩn số (UNKNOWN/NOT TESTED).

## 4. AIOS Current State
- **Mô hình Vận hành:** Chuyển đổi thành công từ mô hình phụ thuộc Runtime (Ví dụ: OpenCode = Coder) sang mô hình Capability-first (Mission → Capability → Runtime).
- **Tooling:** Số lượng tool không bị cắt giảm mù quáng theo con số, mà được map vào Capability Ontology. MCP là một phương thức cung cấp Capability, không phải là định nghĩa của Capability.

## 5. Migration Missions Đang Mở
- **NAS Flashdrive Migration:** Di dời các ổ `FLASHDRIVE-*` từ `homes` vào `FORGE/01_INBOX`. (Đang bị HOLD chờ Human Approval để tháo gỡ Synology Drive Sync).
- **Legacy Account Cleanup:** Xóa/gỡ tài khoản `tuantudo` khỏi Indexing settings để khôi phục sức khỏe cho Universal Search. (Đang chờ Human Execution).

## 6. Blockers Thực Tế
- Chưa có API mở/rõ ràng từ Synology để AIOS Agent có thể chọc vào (Query Interpreter).
- Quyết định loại trừ (Exempt) Active Workspace khỏi T-DOS Pipeline cần xác nhận chính thức từ Human để gỡ HOLD cho việc dọn dẹp `homes`.
