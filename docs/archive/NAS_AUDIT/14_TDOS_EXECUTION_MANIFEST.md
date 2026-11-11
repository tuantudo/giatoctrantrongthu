# 14 T-DOS EXECUTION MANIFEST

## 1. Executive Summary
Bản kế hoạch thực thi (Execution Manifest) này định nghĩa chính xác hành động điều phối vật lý cho từng cụm dữ liệu trên NAS dựa trên 13 báo cáo Audit trước đó. Mọi quyết định đều tuân thủ nguyên lý T-DOS: Dữ liệu thô phải vào FORGE, Dữ liệu sạch mới được vào ATLAS.
Các nhóm dữ liệu ngoài luồng (Workspace, System) được nhận diện và KHÓA LẠI (NO MOVE). Không có bất kỳ lệnh thao tác tệp tin nào được phép chạy cho đến khi vượt qua Human Gate.

## 2. Execution Manifest Matrix

| ID | Current Path | Data Role | Current State | Target Path | T-DOS Stage | Evidence | Preconditions | Risk | Rollback | Approval |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | `homes/.../FLASHDRIVE-TUANTUDO1` | Raw Input | Floating in homes | `TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1` | 01_INBOX | Tên thư mục / Phase 1 Audit | Gỡ cấu hình Synology Drive Sync nếu có | Gãy kết nối Sync | Move ngược lại | REQUIRED |
| 002 | `homes/.../FLASHDRIVE-TUANTUDO2` | Raw Input | Floating in homes | `TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2` | 01_INBOX | Tên thư mục / Phase 1 Audit | Gỡ cấu hình Synology Drive Sync nếu có | Gãy kết nối Sync | Move ngược lại | REQUIRED |
| 003 | `homes/.../Dulichcunggiadinh2024` | Sorted Material | Floating in homes | `TUAN_FORGE/02_SORT/Dulichcunggiadinh2024` | 02_SORT | Tên có cấu trúc sự kiện/thời gian | Cần xác nhận không phải Active Album | Mất index trên app ngoài | Move ngược lại | REQUIRED |
| 004 | `homes/.../Queminh2024` | Sorted Material | Floating in homes | `TUAN_FORGE/02_SORT/Queminh2024` | 02_SORT | Tên sự kiện | Xác nhận Active Status | Tương tự | Move ngược lại | REQUIRED |
| 005 | `homes/.../HINH ANH FAMILY` | Sorted Material | Floating in homes | `TUAN_FORGE/02_SORT/HINH ANH FAMILY` | 02_SORT | Đã chia theo chủ đề | Xác nhận Active Status | Tương tự | Move ngược lại | REQUIRED |
| 006 | `homes/.../MAC_SYNC_WORKSPACE` | Active Workspace | Active Sync | **[NO MOVE]** | N/A | Tên thư mục / Mtime | N/A | N/A | N/A | N/A |
| 007 | `homes/.../family-api`, `.vscode` | Active Dev | Active Workspace | **[NO MOVE]** | N/A | Cấu trúc code, thư viện | N/A | N/A | N/A | N/A |
| 008 | `homes/.../Photos`, `.npm` | System/App Data | Managed by App | **[NO MOVE]** | N/A | Cấu trúc bắt buộc của DSM | N/A | N/A | N/A | N/A |
| 009 | `TUAN_FORGE/03_CORE` | Workspace | In Pipeline | **[NO MOVE]** | UNKNOWN | Chứa thư mục `PERSONAL` | N/A | N/A | N/A | N/A |
| 010 | `TUAN_FORGE/ChiLinh` | Active Study | In Pipeline | **[NO MOVE]** | WORKSPACE | Toàn bộ tài liệu PDF MBA | N/A | N/A | N/A | N/A |
| 011 | `TUAN_ATLAS/FAMILYSEARCH` | Skeleton/Domain | In Library | **[NO MOVE]** | N/A | Rỗng chờ dữ liệu 2026 | N/A | N/A | N/A | N/A |
| 012 | `TUAN_FORGE/_DEPRECATED` | Legacy Backup | In Pipeline | **[NO MOVE]** | N/A | Chứa `$RECYCLE.BIN`, ổ Windows cũ | Tuấn chọn 1 trong 2 options | N/A | N/A | REQUIRED |
| 013 | `TUAN_FORGE/05_DUP` | Duplicates | Conforming | **[NO MOVE]** | 05_DUP | Thuộc T-DOS pipeline chuẩn | Không xóa, giữ nguyên | N/A | N/A | N/A |
| 014 | Root homes PDFs (`Thọ-Mai-gia-lễ...`) | Canonical Candidate | Floating | `TUAN_FORGE/03_AUDIT/` | 03_AUDIT | File PDF có giá trị thư viện cao | N/A | Thấp | Move ngược lại | REQUIRED |

## 3. Human Gate

*Dưới đây là các quyết định duy nhất yêu cầu Human Authority (Tuấn) phê duyệt trước khi Agent có thể phát sinh bất kỳ lệnh nào:*

1. **Phê duyệt Batch [001, 002] (Raw Input):** 
   Anh có đồng ý move các ổ Flashdrive từ `homes` sang `FORGE/01_INBOX` không? Đã tháo Sync trên Synology Drive chưa?

2. **Phê duyệt Batch [003, 004, 005] (Sorted Material):** 
   Các folder hình ảnh gia đình này có đang được xem/quản lý liên tục trên app nào không (Active Status)? Nếu không, có đồng ý chuyển chúng vào `FORGE/02_SORT` để chờ đưa vào ATLAS?

3. **Phê duyệt Batch [014] (Các file PDF cổ ở homes):** 
   Có đồng ý move vào cổng `FORGE/03_AUDIT` để duyệt trước khi thả vào ATLAS Documents?

4. **Định đoạt Item [012] (`_DEPRECATED`):** 
   Đây là bãi rác Windows cũ (Legacy Raw Backup). Anh chọn Option 1 (Di chuyển sang `ATLAS/Archive` làm kho lưu trữ vĩnh viễn), hay Option 2 (Đẩy về `FORGE/01_INBOX` để lọc rác giữ ngọc)? 

*(Mọi Items đánh dấu **[NO MOVE]** đã được khóa cứng vì nằm ngoài khả năng xử lý của vòng đời T-DOS hiện tại, không yêu cầu phán quyết).*

---
`STOP — HUMAN GATE`
