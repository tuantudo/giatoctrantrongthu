# 13 HOMES LIFECYCLE MAP

## 1. Executive Summary
Báo cáo này phân tích vòng đời dữ liệu (T-DOS Lifecycle) của khu vực nhạy cảm nhất trên NAS: `/volume1/homes/tuandzain`. Kết quả kiểm tra Read-Only qua SSH cho thấy khu vực này đang đóng vai trò "nồi lẩu thập cẩm", chứa đồng thời: Dữ liệu Raw từ ổ cứng ngoài, Dữ liệu dự án cá nhân đã sort sơ bộ, Dữ liệu hệ thống của Synology, và Không gian làm việc (Workspace) đang active của người dùng & Agent. 

## 2. Homes Top-Level Inventory
*Phân tích Ownership (Quyền sở hữu) chỉ ra sự lai tạp giữa account cũ (`tuantudo`, `admin`) và mới (`tuandzain`):*
- **Raw Dumps:** `FLASHDRIVE-TUANTUDO1` (admin), `FLASHDRIVE-TUANTUDO2` (admin).
- **Personal Projects:** `Dulichcunggiadinh2024` (tuantudo), `Queminh2024` (tuantudo), `HINH ANH FAMILY` (tuantudo).
- **Sync/Workspace:** `MAC_SYNC_WORKSPACE` (tuantudo), `family-api` (tuandzain).
- **Standalone Documents:** Các file PDF sách cổ như `Thọ-Mai-gia-lễ...` (tuantudo).
- **System/Agent Data:** `Photos` (SynologyPhotos), `.vscode-server`, `.npm`, `nas_audit.py`, `phase2_cartography.py` (tuandzain).

## 3. Lifecycle Classification

| Thư mục / File | T-DOS Role | Vị trí T-DOS lý tưởng | Evidence | Confidence |
|---|---|---|---|---|
| `FLASHDRIVE-*` | RAW INPUT | `FORGE/01_INBOX` | Tên thư mục chỉ thị rõ ràng đây là bản copy thô từ thiết bị ngoại vi. | High |
| `Dulichcunggiadinh2024` | SORTED MATERIAL | `FORGE/02_SORT` | Tên thư mục phản ánh sự kiện/thời gian cụ thể (Đã có sự can thiệp phân loại của con người). | High |
| `HINH ANH FAMILY` | SORTED MATERIAL | `FORGE/02_SORT` | Nhóm dữ liệu theo chủ đề (Family), nhưng chưa đủ sạch để vào ATLAS. | High |
| `Các file PDF cổ` | AUDIT/CLEAN CANDIDATE | `FORGE/03_AUDIT` | File PDF độc lập, nội dung có giá trị lưu trữ (Gia lễ, Sách). | Medium |
| `Photos` | SYSTEM DATA | N/A (Gap) | Cấu trúc bắt buộc của ứng dụng Synology Photos. | High |
| `MAC_SYNC_WORKSPACE` | ACTIVE WORKSPACE | N/A (Gap) | Cấu hình đồng bộ Synology Drive với máy Mac. | High |
| `family-api`, `.vscode` | ACTIVE WORKSPACE | N/A (Gap) | Source code và Agent config đang chạy. | High |

## 4. Active Workspace Detection
Khu vực `homes` đang chứa các Active Workspace bao gồm: môi trường dev của Agent (`family-api`, code python, `.vscode-server`) và thư mục đồng bộ `MAC_SYNC_WORKSPACE`.
Việc di chuyển các thư mục này sẽ làm gãy đổ tiến trình làm việc của Tuấn và của chính Agent. 

## 5. Raw/Input Detection
Các thư mục `FLASHDRIVE` được chép thẳng vào `homes` thay vì `TUAN_FORGE/01_INBOX`. Lỗi này thường xảy ra khi người dùng cắm USB vào NAS và dùng tính năng USB Copy ném thẳng vào home directory cho tiện, thay vì tuân thủ quy trình T-DOS.

## 6. System/Application Data
Thư mục `Photos` là khu vực quản trị ngầm của Synology Photos (Personal Space). Dữ liệu trong này bị chi phối bởi Database riêng của Synology (nhận diện khuôn mặt, album). 

## 7. Duplicate / Fragmentation Relationship
Vì dữ liệu thô (FLASHDRIVE) và dữ liệu đã sort (HINH ANH FAMILY) nằm cạnh nhau trong `homes`, và có thể có bản sao ở `TUAN_FORGE/03_CORE` hoặc `TUAN_ATLAS`, đây chính là tâm chấn tạo ra hàng ngàn Duplicate Groups trong báo cáo Phase 2. Mọi nỗ lực Clean phải bắt đầu bằng việc dời các thư mục này vào đúng FORGE pipeline.

## 8. T-DOS Conformance
Về cơ bản, `/volume1/homes/tuandzain` đang vi phạm nghiêm trọng kiến trúc T-DOS. Kiến trúc quy định mọi dữ liệu thô phải vào FORGE, nhưng user đang dùng `homes` làm trạm trung chuyển (Dumping Ground) và kho lưu trữ (Archive) cùng lúc.

## 9. Architectural Gaps
T-DOS hiện tại **chưa có định nghĩa (Lifecycle Representation)** cho 2 loại dữ liệu sau:
1. **ACTIVE WORKSPACE:** (Nơi chứa source code, project đang code hằng ngày, thư mục sync Mac). Đưa vào ATLAS thì không đúng vì nó liên tục thay đổi (mutate). Đưa vào FORGE thì sai vì nó không phải là dữ liệu thô chờ xử lý. 
2. **SYSTEM/APPLICATION DATA:** Các thư mục do Synology quản lý (như `Photos` cá nhân, `Drive` metadata). T-DOS không thể can thiệp.
👉 *Đề xuất không di chuyển (KHÔNG MOVE) các vùng này cho đến khi T-DOS cập nhật kiến trúc để chứa chúng (Ví dụ: `TUAN_WORKSPACE`).*

## 10. Reorganization Candidates
*(Chỉ đưa vào diện chờ xử lý, không execute)*
- **Chuyển sang `FORGE/01_INBOX`:** Tất cả các thư mục `FLASHDRIVE-*`.
- **Chuyển sang `FORGE/02_SORT`:** `Dulichcunggiadinh2024`, `Queminh2024`, `HINH ANH FAMILY`.
- **Chuyển sang `FORGE/03_AUDIT`:** Các file PDF rời rạc nằm ở root `homes`.

## 11. UNKNOWN
Vẫn chưa rõ `MAC_SYNC_WORKSPACE` có chứa raw data nào cần nạp vào hệ thống T-DOS hay không, hay nó thuần túy là tài liệu làm việc tạm thời. (Cần Tuấn confirm).

---
`STOP — HUMAN GATE`
