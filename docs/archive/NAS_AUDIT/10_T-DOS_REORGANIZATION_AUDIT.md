# 10 T-DOS REORGANIZATION AUDIT

## 1. Executive Summary
- **Mục tiêu:** Đối chiếu tình trạng vật lý hiện tại của NAS với triết lý vòng đời dữ liệu T-DOS (INPUT → FORGE → AUDIT → CLEAN → ATLAS → KNOWLEDGE).
- **OBSERVED:** NAS đang lệch khỏi T-DOS ở 3 điểm chính:
  1. Hàng trăm ngàn file (Input/Raw Data) đang kẹt lại ở `/volume1/homes/tuandzain` thay vì đi vào `FORGE/01_INBOX`.
  2. `TUAN_FORGE` đang bị biến thành storage dài hạn (chứa các thư mục như `03_CORE`, `ChiLinh`, `_DEPRECATED`) thay vì đóng vai trò Processing Pipeline thuần túy.
  3. Dữ liệu chưa qua xử lý (Raw data, Duplicate) đang lọt vào `TUAN_ATLAS` (Ví dụ: Thư mục `FAMILYSEARCH` nằm ngang hàng với `Assets`).

## 2. T-DOS Conformance Matrix

| Current Location | Current Role | T-DOS Stage | Status | Evidence | Proposed Action |
|---|---|---|---|---|---|
| `homes/tuandzain/HINH ANH FAMILY` | Raw Backup | 01_INBOX | FORGE CANDIDATE | OBSERVED (Nằm ngoài pipeline) | Đưa vào FORGE/01_INBOX để xử lý |
| `homes/tuandzain/FLASHDRIVE-*` | Raw Backup | 01_INBOX | FORGE CANDIDATE | OBSERVED (Tên thư mục thể hiện dump copy) | Đưa vào FORGE/01_INBOX |
| `TUAN_FORGE/03_CORE` | Long-term Storage | N/A | NON-CONFORMING | OBSERVED (Không thuộc T-DOS chuẩn) | Phân tích để đưa sang ATLAS hoặc CLEAN |
| `TUAN_FORGE/ChiLinh` | Project Storage | N/A | NON-CONFORMING | OBSERVED (Nằm ngang hàng pipeline) | Đưa vào FORGE/02_SORT |
| `TUAN_ATLAS/FAMILYSEARCH` | Raw/Mixed Data | N/A | NON-CONFORMING | OBSERVED (Nằm ngoài chuẩn ATLAS) | Đưa ngược về FORGE để Audit lại |
| `TUAN_FORGE/05_DUP` | Garbage/Hold | 05_DUP | CONFORMING | OBSERVED | Giữ nguyên (KEEP) |
| `TUAN_ATLAS/Assets` | Clean Library | ATLAS | CONFORMING | OBSERVED | Giữ nguyên, rà soát bên trong |

## 3. Homes/Tuandzain Analysis
Dựa trên Data Inventory Phase 2 (chứa ~324k files tại `homes`):
- **Raw Input / Dump Backups:**
  - `FLASHDRIVE-TUANTUDO1`, `FLASHDRIVE-TUANTUDO2`, `MAC_SYNC_WORKSPACE`.
  - *Inference:* Đây là dữ liệu chưa qua sàng lọc. *Proposed:* FORGE CANDIDATE (01_INBOX).
- **Personal Photo Projects:**
  - `HINH ANH FAMILY`, `Dulichcunggiadinh2024`, `Queminh2024`.
  - *Inference:* Dữ liệu này có thể đã được người dùng sort sơ bộ, nhưng chưa đi qua T-DOS. *Proposed:* FORGE CANDIDATE (02_SORT).
- **System / Temporary:**
  - `.npm`, `.vscode-server`, `.ssh`.
  - *Inference:* System files của user đang hoạt động. *Proposed:* CONFORMING (Để yên tại homes).

## 4. Forge Conformance
- **01_INBOX - 06_QUARANTINE:** *OBSERVED* Cấu trúc chuẩn 6 bước đang tồn tại.
- **Sự cố lệch T-DOS:**
  - Thư mục `TUAN_FORGE` đang bị biến thành Dumping Ground. Các thư mục dự án (`ChiLinh`), dữ liệu được cho là quan trọng (`03_CORE`), và dữ liệu lỗi thời (`_DEPRECATED`) đang nằm ngang hàng với Pipeline.
  - *Inference:* Pipeline xử lý bị tắc nghẽn, người dùng tạo thêm các thư mục phụ để chứa dữ liệu không biết để đâu.

## 5. Atlas Conformance
- **Assets / Notes / Archive:** *OBSERVED* Cấu trúc cơ bản tuân thủ T-DOS.
- **Sự cố lệch T-DOS:**
  - *OBSERVED* `TUAN_ATLAS/FAMILYSEARCH` và các file PDF lẻ (`Thọ-Mai-gia-lễ...`) nằm tản mác ở ngoài hoặc lọt vào ATLAS.
  - *Inference:* Raw data đang lọt vào Clean Library. ATLAS đang bị sử dụng như một thư mục Backup thứ 2.

## 6. Legacy / Deprecated Areas
- **`TUAN_FORGE/_DEPRECATED`:** *Inference:* Khu vực chứa rác hoặc dữ liệu bỏ đi. *Proposed:* QUARANTINE CANDIDATE.
- **`TUAN_FORGE/03_CORE`:** *Inference:* Dữ liệu người dùng tự đánh giá là quan trọng (Core) nhưng lại để ở FORGE thay vì đưa qua ATLAS. *Proposed:* CLEAN CANDIDATE (Cần rà soát nội dung bên trong trước khi đưa vào ATLAS).
- **`TUAN_FORGE/ChiLinh`:** *Inference:* Dữ liệu thuộc Domain cá nhân/dự án. *Proposed:* FORGE CANDIDATE (Đẩy lại vào `02_SORT`).

## 7. Fragmentation Findings
- **Theo Location:** Cùng một domain "Gia đình" bị phân mảnh ở `homes/tuandzain/HINH ANH FAMILY` và `TUAN_FORGE/03_CORE` và `TUAN_ATLAS/FAMILYSEARCH`.
- **Theo Lifecycle:** Dữ liệu Raw nằm trộn lẫn với dữ liệu Clean ở `homes` và `ATLAS`.
- **Theo Provenance:** Các bản sao từ Flashdrive không được xử lý theo T-DOS mà được thả nổi ở `homes`. Báo cáo Phase 2 ghi nhận ~34,192 Duplicate Groups, chủ yếu do sự phân mảnh giữa `homes` và `FORGE/ATLAS`.

## 8. Proposed Reorganization
*Kế hoạch điều phối (Chỉ là đề xuất, CHƯA THỰC THI):*

- **BATCH 1:** Khắc phục Lệch chuẩn tại `TUAN_ATLAS`
  - *Current:* `TUAN_ATLAS/FAMILYSEARCH` -> *Target:* `TUAN_FORGE/03_AUDIT/FAMILYSEARCH`
  - *Reason:* Trả Raw/Mixed data về đúng FORGE pipeline để làm sạch.
  - *Risk:* Thấp.

- **BATCH 2:** Gỡ kẹt tại `TUAN_FORGE`
  - *Current:* `TUAN_FORGE/_DEPRECATED` -> *Target:* `TUAN_FORGE/06_QUARANTINE/_DEPRECATED`
  - *Current:* `TUAN_FORGE/ChiLinh` -> *Target:* `TUAN_FORGE/02_SORT/ChiLinh`
  - *Reason:* Đưa các thư mục nằm ngoài luồng vào lại 6 steps của T-DOS.

- **BATCH 3:** Điều phối Dữ liệu thô từ `homes`
  - *Current:* `homes/tuandzain/FLASHDRIVE-*` -> *Target:* `TUAN_FORGE/01_INBOX/FLASHDRIVE-*`
  - *Reason:* Đưa Raw Backup vào cổng nạp (INBOX) của T-DOS.

## 9. UNKNOWN / HUMAN DECISIONS REQUIRED
1. **`TUAN_FORGE/03_CORE`:** Bên trong chứa gì? Dữ liệu này đã đủ sạch để đưa vào `TUAN_ATLAS/Assets/Personal` chưa, hay phải đi qua `04_CLEAN`?
2. **`homes/tuandzain/MAC_SYNC_WORKSPACE`:** Tuấn có đang đồng bộ thư mục này active với máy Mac không? Nếu có, không được Move vào FORGE vì sẽ làm gãy cấu hình Synology Drive Sync của Mac.
3. **Các file PDF rác ở root `homes`:** Nên cho thẳng vào QUARANTINE hay FORGE/01_INBOX?

## 10. Execution Plan
- **Stage 1 (An Toàn nhất):** Khắc phục cấu trúc thư mục tại `TUAN_FORGE` (Nhét `ChiLinh`, `_DEPRECATED` vào các Stage tương ứng).
- **Stage 2 (Mức độ trung bình):** Trả dữ liệu sai vòng đời từ `TUAN_ATLAS` về lại `TUAN_FORGE`.
- **Stage 3 (Mức độ cao):** Migrate hàng loạt Backup từ `homes` sang `FORGE/01_INBOX`. Chờ Tuấn kiểm tra kỹ các sync task để không làm đứt gãy đồng bộ.

---
`STOP — HUMAN GATE`
