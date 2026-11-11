# 17 ARCHITECTURE BASELINE CANDIDATE

## 1. ESTABLISHED ARCHITECTURE
*Những nguyên lý kiến trúc đã được chứng minh qua tài liệu (Documentation) và được Human phê duyệt (Source of Truth):*
- **T-DOS Lifecycle:** Hệ thống quản trị luồng xử lý dữ liệu qua 6 bước khép kín: `INPUT → FORGE → AUDIT → CLEAN → ATLAS → KNOWLEDGE`. 
- **T-DOS Golden Rule:** Mọi dữ liệu phải đi qua cửa ngõ `FORGE` trước khi được chấp thuận trở thành tài sản lưu trữ dài hạn tại `ATLAS`. `ATLAS` tuyệt đối không chứa dữ liệu thô (Raw Data).
- **Human Authority:** Tuấn nắm giữ quyền quyết định cuối cùng (Final Authority) trong mọi sự thay đổi về kiến trúc, di dời dữ liệu (migration), và phê duyệt (approval).

## 2. OBSERVED CURRENT STATE
*Thực trạng vật lý của hệ thống dựa trên bằng chứng kiểm toán (Filesystem Evidence):*
- **Physical Storage:** Ổ đĩa NAS (`/volume1/`) chứa cả dữ liệu của hệ sinh thái T-DOS (`TUAN_FORGE`, `TUAN_ATLAS`) và thư mục gốc của người dùng (`homes`).
- **Homes Fragmentation:** Thư mục `/volume1/homes/tuandzain` đang chứa một hỗn hợp (hybrid) nhiều loại vòng đời: Raw Backup (ổ USB cũ), System Data (`Photos`, `.npm`), Active Workspace (Code `.vscode`, `MAC_SYNC_WORKSPACE`), và Sorted Personal Projects (`ChiLinh`, `HINH ANH FAMILY`).
- **T-DOS Non-Conformance:** Khu vực `TUAN_FORGE` hiện đang bị dùng như Storage dài hạn (chứa `03_CORE`, `_DEPRECATED`) thay vì là trạm trung chuyển tuyến tính. Khu vực `TUAN_ATLAS` có sự xuất hiện của cấu trúc rỗng chưa chuẩn (`FAMILYSEARCH`).
- **Synology Native Indexing:** Synology Drive / Universal Search đã và đang chạy tiến trình lập chỉ mục cho `TUAN_ATLAS` (Finished), `TUAN_FORGE` (Checking), và `homes` (bị lỗi Re-indexing needed do tàn dư của tài khoản cũ `tuantudo`). Tính năng Face Recognition và Tags của Synology Photos tồn tại trên giấy (Documented) nhưng chưa được kiểm chứng độ phủ trên thực tế (Not Tested).

## 3. PROPOSED ARCHITECTURE
*Các kiến trúc mới đang được Agent (AGY) đề xuất, CHƯA được Tuấn phê duyệt:*
- **The 8-Layer Architecture Model:** Đề xuất phân tách hệ thống thành 8 tầng rạch ròi: (A) Physical Storage, (B) Lifecycle/T-DOS, (C) Data Management/Synology Index, (D) Canonical DB, (E) Knowledge, (F) Application/Web, (G) Source Code/Dev, (H) Human Governance.
- **T-DOS Scope Exception:** Đề xuất miễn trừ các vùng "Active Workspace" (Code, Sync folder) và "System Data" khỏi quy luật cưỡng chế của vòng đời T-DOS. 
- **Query Interpreter Agent Role:** Đề xuất AIOS/Agent không làm công nhân dọn rác (File Manager), mà đóng vai trò phiên dịch NLP sang API calls của Synology Native Search.
- **Abstract Database Pointers:** Đề xuất Database của dự án GiaToc chỉ lưu Entity ID thay vì hard-code đường dẫn file vật lý (Filesystem path) từ NAS.

## 4. SUPERSEDED ASSUMPTIONS
*Những giả định kiến trúc cũ đã bị bằng chứng mới đánh đổ:*
- **Assumption:** "NAS chỉ là ổ cứng mạng lưu trữ lạnh ngốc nghếch (Cold Storage), Agent phải tự làm mọi việc từ index đến tìm kiếm."
  -> **Superseded by:** Phát hiện về sức mạnh Native của Synology Universal Search & Photos.
- **Assumption:** "Name-based lifecycle mapping" (Cứ tên là `03_CORE` thì mặc định là sạch, `_DEPRECATED` thì mặc định là nhiễm độc/cách ly).
  -> **Superseded by:** Lệnh `ls` vật lý chứng minh `_DEPRECATED` là Archive Dump của ổ cứng cũ, `ChiLinh` là Active MBA Workspace.

## 5. ARCHITECTURAL CONFLICTS
*Các điểm mâu thuẫn không thể tự giải quyết nếu thiếu Human Authority:*
1. **The Workspace Paradox:** Nếu tuân thủ chặt T-DOS v1.0, thư mục `homes` chứa mã nguồn và file sync phải bị cưỡng chế dọn sạch. Nếu dọn sạch, công việc của Tuấn bị đứt gãy. Nếu không dọn, vi phạm T-DOS v1.0.
2. **The Retrieval Dilemma:** Chưa xác định được API của Synology có "mở" cho Python/Agent chọc vào query hay không. Nếu đóng, việc xây SQLite/Vector DB nội bộ là bắt buộc. Nếu mở, xây DB nội bộ là hành vi "phát minh lại bánh xe" (Over-engineering).
3. **The Canonical Definition:** Khi có 10 bản copy của một bức ảnh, NAS chứa file, nhưng ai/hệ thống nào có thẩm quyền chốt file nào là "Bản gốc" (Canonical) cho Website GiaToc?

## 6. HUMAN DECISION REGISTER
*Danh sách các quyết định cần sự phê duyệt của Human Authority:*

**DECISION 01: T-DOS V1.0 SCOPE AMENDMENT**
- **QUESTION:** Anh có đồng ý cập nhật T-DOS để loại trừ (exempt) "Active Workspace" và "System/App Data" khỏi luồng xử lý tĩnh của FORGE-ATLAS không?
- **OPTIONS:** (A) Đồng ý cập nhật. (B) Giữ nguyên, buộc mọi thứ về FORGE.
- **CONSEQUENCE:** Quyết định sẽ giải thoát (A) hoặc kết án (B) sự tồn tại hợp pháp của thư mục `homes/tuandzain`.
- **REVERSIBILITY:** High. Có thể thay đổi luật sau này.
- **RECOMMENDATION FOR REVIEW:** Chọn Option A (Approve Exception).

**DECISION 02: THE 8-LAYER ARCHITECTURE MODEL**
- **QUESTION:** Anh có phê duyệt Mô hình phân tách 8 Tầng (như đề xuất ở Mục 3) làm kim chỉ nam thiết kế mới cho toàn bộ dự án NAS & GiaToc không?
- **OPTIONS:** (A) Phê duyệt. (B) Từ chối. (C) Sửa đổi.
- **CONSEQUENCE:** Quyết định cách Agent tương tác với dữ liệu, cách Database lưu trữ đường dẫn, và cách Website load media.
- **REVERSIBILITY:** Low (Rất khó đảo ngược nếu Database đã thành hình).
- **RECOMMENDATION FOR REVIEW:** Chọn Option A (Approve).

**DECISION 03: INDEX REMEDIATION & ACCOUNT CLEANUP**
- **QUESTION:** Anh có cấp quyền cho Agent (hoặc anh sẽ tự làm trên DSM GUI) tháo gỡ thư mục `tuantudo` ra khỏi cấu hình Indexed Folders của Synology Drive không?
- **OPTIONS:** (A) Tuấn tự tháo trên GUI. (B) Agent viết script tháo.
- **CONSEQUENCE:** Giải phóng lỗi `Re-indexing needed` cho `homes`.
- **REVERSIBILITY:** High.
- **RECOMMENDATION FOR REVIEW:** Chọn Option A (An toàn nhất).

## 7. EXECUTION BLOCKERS
*Các vật cản ngăn chặn quá trình Migration (Điều phối file vật lý):*
1. **Thiếu T-DOS Amendment:** Không thể dọn dẹp `homes` khi chưa có luật miễn trừ.
2. **Thiếu Index Health:** Không thể Move các ổ đĩa `FLASHDRIVE` nếu Synology Drive Sync đang chạy ngầm và báo lỗi index.
3. **Thiếu API Exposure Status:** Chưa rõ năng lực gọi API từ Python vào DSM.

---
ARCHITECTURE BASELINE CANDIDATE
+
HUMAN DECISION REGISTER

`STOP — WAIT FOR HUMAN REVIEW`
