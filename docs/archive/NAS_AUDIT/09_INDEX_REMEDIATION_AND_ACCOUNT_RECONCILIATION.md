# 09 INDEX REMEDIATION AND ACCOUNT RECONCILIATION

## 1. Mission
Thực hiện Account Topology Reconciliation để đồng bộ hóa cấu hình tài khoản (Account) với cấu hình lập chỉ mục (Indexing Topology). Xác định rõ tình trạng của các tài khoản và nguyên nhân gây kẹt trạng thái Indexing, từ đó đề xuất Remediation Plan an toàn nhất mà không phá vỡ dữ liệu.

## 2. Human Historical Context
*Dựa trên thông tin do Tuấn cung cấp (Human-Provided Fact):*
1. Tuấn từng sử dụng account `tuantudo`, account này từng đồng bộ với thiết bị điện thoại.
2. Do lo ngại bảo mật, Tuấn bỏ account `tuantudo` và chuyển sang `tuandzain`.
3. Cấu hình Indexing cũ của Synology Drive vẫn còn tham chiếu đến `/homes/tuantudo`.
4. Cả `/homes/tuantudo` và `/homes/tuandzain` đều báo trạng thái "Re-indexing needed" trên DSM.

## 3. Current Account Topology
*Dựa trên kiểm tra Read-Only qua SSH:*
- **Account `tuantudo` (Legacy):** Thư mục `/volume1/homes/tuantudo` vẫn tồn tại nhưng **chống rỗng (0 bytes data)**, chỉ chứa thư mục metadata `@eaDir`. Đây hoàn toàn là một thư mục ma (Legacy).
- **Account `tuandzain` (Current):** Thư mục `/volume1/homes/tuandzain` là tài khoản đang hoạt động, có dữ liệu (có cấu trúc .ssh, .npm, và các thư mục sync).

## 4. Current Indexing Topology
*Dựa trên Human-Provided Evidence (Kiểm tra DSM Universal Search/Drive):*
- **DRIVE TEAM FOLDER:**
  - `/TUAN_ATLAS`: Indexing Scope = Filename | Status = Finished
  - `/TUAN_FORGE`: Indexing Scope = Filename | Status = Checking
- **SYNOLOGY DRIVE:**
  - `/homes/tuantudo`: Indexing Scope = Filename | Status = Re-indexing needed
  - `/homes/tuandzain`: Indexing Scope = Filename | Status = Re-indexing needed

## 5. Evidence
- **OBSERVED:** `/volume1/homes/tuantudo` = 0 bytes, chỉ có metadata.
- **OBSERVED:** `/volume1/homes/tuandzain` = Active (User shell, data present).
- **HUMAN-PROVIDED:** Trạng thái indexing báo lỗi `Re-indexing needed` tại cả 2 thư mục home.
- **DOCUMENTED:** Synology Drive sử dụng 1 database chung để track các Indexed Folders. Khi cấu hình chứa một đường dẫn lỗi hoặc một legacy sync task bị kẹt, toàn bộ tiến trình có thể bị đình trệ.

## 6. Legacy Configuration
- Thư mục: `/volume1/homes/tuantudo`
- Trạng thái Synology Drive: Có khả năng vẫn còn tồn tại các Sync Task hoặc Team Folder setting cũ trỏ vào đây từ thời account này còn active trên điện thoại.
- Trạng thái Index: Đang được Universal Search / Drive cố gắng re-index nhưng có thể bị kẹt do conflict về permission của account đã bị disable/bỏ trống.

## 7. Current Configuration
- Thư mục: `/volume1/homes/tuandzain`
- Đây là user đang sở hữu data, nhưng việc indexing bị ảnh hưởng lây chuyền ("Re-indexing needed") từ Legacy Configuration.

## 8. Index Health
- **TUAN_ATLAS:** Healthy (Finished).
- **TUAN_FORGE:** Checking (Đang xử lý, health chưa xác định hoàn toàn cho đến khi Finished).
- **HOMES:** Unhealthy (Bị kẹt ở `Re-indexing needed`). Không được hiểu nhầm đây là data corruption hay security breach. Đây đơn thuần là lỗi tiến trình Indexing của DSM.

## 9. Root-Cause Assessment
- **OBSERVED:** `/homes/tuantudo` không còn dữ liệu. DSM báo lỗi re-index cho cả 2 thư mục homes.
- **INFERENCE:** Cấu hình indexing còn lưu dấu account cũ `tuantudo` và trạng thái `Re-indexing needed` hiện tại phù hợp với việc topology account đã thay đổi (bỏ account cũ). Tiến trình re-index cho thư mục `homes` bị kẹt có khả năng cao là do sự tồn tại của cấu hình legacy này (cơ chế causal cụ thể chưa được chứng minh trực tiếp nhưng có độ tương quan mạnh).
- **UNKNOWN:** Chưa rõ `tuantudo` có bị kẹt bởi một Sync Task cụ thể trên Synology Drive Admin Console hay không.

## 10. Remediation Plan
*Kế hoạch khắc phục (Chỉ thực thi khi có lệnh của Tuấn):*
- **STEP 1:** Xác nhận lại trên DSM GUI (Synology Drive Admin Console) xem có Sync Task nào đang gắn với `tuantudo` không.
- **STEP 2:** Xác định thư mục thực sự cần index. (`/homes/tuandzain` là CẦN, `/homes/tuantudo` là KHÔNG CẦN).
- **STEP 3:** Vô hiệu hóa (Disable) thư mục `/homes/tuantudo` khỏi danh sách Indexed Folder của Synology Drive / Universal Search (Chỉ xóa cấu hình index, không xóa thư mục).
- **STEP 4:** Re-index riêng cho thư mục CURRENT (`/homes/tuandzain`). Không re-index toàn bộ NAS.
- **STEP 5:** Đợi tiến trình chuyển sang trạng thái Finished.
- **STEP 6:** Chạy Retrieval Re-test.

## 11. Retrieval Re-test Plan
Sau khi Index Health = Finished, tiến hành test các keyword sau bằng Universal Search:
1. `NPK` -> (Kỳ vọng: SEARCHABLE / PARTIALLY SEARCHABLE)
2. `logo` -> (Kỳ vọng: SEARCHABLE)
3. `PVCFC` -> (Kỳ vọng: SEARCHABLE)
4. `Đà Lạt` -> (Kỳ vọng: PARTIALLY SEARCHABLE)
5. `iPhone` -> (Kỳ vọng: INDEX ERROR hoặc NOT SEARCHABLE qua Universal Search nếu không dùng Photos)

## 12. Risks
- Xóa nhầm cấu hình của `tuandzain` nếu thao tác vội vã. (Mitigation: Thực hiện từng bước, verify GUI).
- Không tự động dọn dẹp file trong `tuantudo` vì read-only discipline.

## 13. Human Approval Required
Tuấn cần trực tiếp thực hiện hoặc phê duyệt cho Agent thực hiện việc gỡ bỏ cấu hình legacy trên Synology Drive Admin Console. Không có bất kỳ lệnh tự động xóa / re-index nào được phép chạy nếu chưa có lệnh `PROCEED`.
