# 16 ARCHITECTURE DEFENSE

## 1. CLAIM-BY-CLAIM DEFENSE

| ID | Claim (từ Report #15) | Classification | Evidence Source | Evidence Strength | Reasoning | Risk of Overreach | Verdict |
|---|---|---|---|---|---|---|---|
| C01 | "Sự đứt gãy hiện tại không phải là lỗi người dùng, mà là biểu hiện của Sự tiến hóa chồng chéo." | INFERENCE | Sự tồn tại của Active Workspace/System Data trong `homes`. | Strong | `homes` chứa code, sync folder, và dữ liệu thô chồng lên nhau, chứng tỏ NAS đang gánh nhiều role ngoài lưu trữ. | Medium | VALIDATED |
| C02 | "Kiến trúc không còn là một sơ đồ thư mục phẳng, mà là một hệ thống 8 tầng." | PROPOSED | Tổng hợp từ T-DOS, GiaToc Web, Synology. | N/A | Mô hình 8 tầng là nỗ lực phân tách các concern, nhưng chưa được Tuấn phê duyệt. | High | NOT VALIDATED |
| C03 | "T-DOS chỉ bao phủ Layer B (Lifecycle) của Dữ liệu tĩnh (Static Assets)." | INFERENCE / PROPOSED | T-DOS gốc ghi "Mọi dữ liệu". | Weak | Gò ép T-DOS vào "Static Assets" là AGY tự diễn giải để chừa chỗ cho Active Workspace. T-DOS gốc không có ngoại lệ này. | High | OVERREACH |
| C04 | "Agent không làm File Manager... mà làm Query Interpreter." | PROPOSED | Báo cáo #08 (Retrieval Capability). | N/A | Dựa trên giả định API của Synology mở. | High | NOT VALIDATED |

## 2. DEFEND THE 8-LAYER MODEL
**Mô hình 8 tầng (8-Layer Model) hoàn toàn là một PROPOSED MODEL, chưa phải kiến trúc chính thức.**
- **A. PHYSICAL STORAGE:** Tồn tại. *DOCUMENTED* & *OBSERVED* (Filesystem `/volume1/`).
- **B. DATA LIFECYCLE (T-DOS):** Tồn tại. *DOCUMENTED* (`T-DOS.md`).
- **C. DATA MANAGEMENT / INDEX:** Tồn tại. *HUMAN-PROVIDED* (Universal Search / Drive GUI).
- **D. CANONICAL DATA / DATABASE:** *INFERENCE* (GiaToc cần DB) & *PROPOSED* (Tách biệt Entity khỏi File).
- **E. KNOWLEDGE:** Tồn tại. *DOCUMENTED* (Obsidian / Notes).
- **F. APPLICATION:** Tồn tại. *DOCUMENTED* (Website GiaToc).
- **G. SOURCE CODE / DEVELOPMENT:** Tồn tại. *OBSERVED* (`.vscode-server`, `family-api` đang chạy).
- **H. HUMAN GOVERNANCE:** Tồn tại. *DOCUMENTED* (Human Gate / Approval Pipeline).
- **Nhận định rủi ro:** Chồng lấn lớn nhất đang xảy ra ở Layer A, B, và G (`homes` vừa là Storage, vừa chịu quy tắc T-DOS, vừa là Dev Workspace). AGY đã tự phát minh ra khái niệm "Cấu trúc 8 tầng" để giải tỏa áp lực này, nhưng chưa có văn bản T-DOS nào phê duyệt.

## 3. DEFEND THE T-DOS REASSESSMENT
- **OLD PRINCIPLE:** *"Mọi dữ liệu trong đời sống... đều phải đi qua FORGE trước khi được chấp nhận vào ATLAS."*
- **NEW EVIDENCE:** Thư mục `homes/tuandzain` chứa Source code, System App Data, Sync Folder.
- **INTERPRETATION:** Các dữ liệu này liên tục thay đổi (mutate), nếu ép vào FORGE (xử lý tuyến tính) hoặc ATLAS (lưu trữ tĩnh) đều phá vỡ cấu trúc. Suy ra T-DOS dường như sinh ra chỉ để quản trị Dữ liệu tĩnh/Tài sản (Static Assets/Archives).
- **PROPOSED EXTENSION:** T-DOS cần miễn trừ các "Active Data" khỏi luồng FORGE->ATLAS.
- **HUMAN DECISION REQUIRED:** Tuấn có đồng ý sửa đổi T-DOS v1.0 để cập nhật ngoại lệ (Exception) này không?

## 4. DEFEND SYNOLOGY ROLE
- **Universal Search:** *HUMAN-PROVIDED*. Đã xác nhận Indexing Scope = Filename. (Không có bằng chứng nào xác nhận Full-text content index đang chạy cho FORGE/ATLAS, chỉ biết "Filename" đang Checking/Finished).
- **Synology Photos:** *DOCUMENTED* (Có specs) và *OBSERVED* (Có folder `Photos`), nhưng *NOT TESTED* (Chưa rõ Face Recognition có bật không).
- **Semantic Search:** *NOT AVAILABLE* natively. Synology không tự hiểu ngữ nghĩa "ảnh ba".
- **Canonicality:** *NOT AVAILABLE* natively. Synology không biết đâu là bản gốc.
- **Đánh giá sai trong #08:** Report #08 đánh giá "Content Search = DOCUMENTED (Not Configured)", điều này chính xác. AGY không tự biến Documented thành Tested.

## 5. DEFEND DATABASE / NAS / GIATOC MODEL
- **Conceptual Model:** (File -> NAS -> T-DOS -> Entity -> DB -> App). Đây hoàn toàn là **PROPOSED ARCHITECTURE** (Kiến trúc đề xuất).
- **Claim "Database không nên hard-code filesystem path":** Đây là **PROPOSED**. Dù chuẩn mực kỹ thuật (Best Practices) ủng hộ việc tách Entity ID khỏi Storage Path, nhưng không có tài liệu nào của Tuấn chỉ thị điều này. Việc AGY tuyên bố nó như một kết luận kiến trúc là Overreach.

## 6. REASSESS REPORT #14 (EXECUTION MANIFEST)

| ID | Original Decision | Still Valid? | Architecture Impact | New Status | Reason |
|---|---|---|---|---|---|
| 001, 002 | `FLASHDRIVE-*` -> `01_INBOX` | Có | Migrate Raw Dumps vào T-DOS | HOLD | Chờ chốt T-DOS v2 (Xử lý các thiết bị Sync). |
| 003, 004, 005 | Projects -> `02_SORT` | Có | Phân loại dữ liệu gia đình | HOLD | Chờ định nghĩa rõ Active Workspace vs Sorted Material. |
| 006, 007 | `MAC_SYNC...`, `family-api` -> NO MOVE | Có | Bảo vệ môi trường Dev | KEEP | Vẫn đúng, không thuộc T-DOS tĩnh. |
| 008 | `Photos`, `.npm` -> NO MOVE | Có | Bảo vệ App/System Data | KEEP | Vẫn đúng, T-DOS không quản lý OS. |
| 009, 010 | `03_CORE`, `ChiLinh` -> NO MOVE | Có | Dữ liệu đang Active/Study | KEEP | Chờ định hướng Workspace Domain. |
| 011 | `FAMILYSEARCH` -> NO MOVE | Có | Root Domain Skeleton | KEEP | Chờ Data Migration thực tế. |
| 012 | `_DEPRECATED` -> NO MOVE | Có | Legacy Backup Dump | KEEP | Chờ Tuấn chọn Option (Archive hay Inbox). |
| 013 | `05_DUP` -> NO MOVE | Có | Rác/Duplicate | KEEP | Workflow chưa thay đổi. |
| 014 | PDFs -> `03_AUDIT` | Có | Chờ Clean/Canonicalize | HOLD | Chờ hoàn tất Index Remediation. |

## 7. ARCHITECTURAL OVERREACH
*Các câu AGY đi quá xa giới hạn chứng cứ:*
1. *"Việc phân tách rạch ròi 8 tầng kiến trúc này là bắt buộc..."* -> Áp đặt kiến trúc mà không có approval.
2. *"T-DOS chỉ quản trị vòng đời của Static Assets."* -> Tự ý sửa đổi/giới hạn phạm vi của T-DOS v1.0.
3. *"Agent không đóng vai trò File Manager... Agent đóng vai trò Query Interpreter"* -> Tự chuyển đổi chức năng của AIOS dựa trên giả định Synology API hoàn hảo, bỏ qua trường hợp API bị đóng kín.
4. *"Database không cần lưu trữ file blob. Nó chỉ lưu trữ Entity..."* -> Đóng vai trò DB Architect khi chưa có tài liệu GiaToc DB.

## 8. EVIDENCE REQUIRED BEFORE ARCHITECTURE BASELINE
1. **API Exposure:** Synology API có cho phép Python/REST query kết quả Universal Search và Photos từ Local Network/SSH không? (Nếu không, ý tưởng "Agent là Query Interpreter" phá sản, bắt buộc phải dùng SQLite/Indexer tự chế).
2. **GiaToc DB Schema:** Bảng thiết kế CSDL của website GiaToc hiện tại đang lưu file như thế nào? (Cần biết để thiết kế Conceptual Model).

## 9. FINAL ARCHITECTURAL STATUS
**Trạng thái:** **READY WITH CORRECTIONS (B)**
Các báo cáo hiện tại rất tốt về mặt lập hồ sơ dữ liệu vật lý, nhưng phần Kiến trúc (Architecture) cần rút lại các PROPOSED MODEL thành "Tùy chọn thiết kế" (Design Options) thay vì áp đặt như sự thật (Facts). Mọi đề xuất [HOLD] ở Bảng 14 sẽ được đóng băng hoàn toàn.

## 10. HUMAN GATE

**1. T-DOS Scope Amendment**
- *QUESTION:* T-DOS v1.0 quy định "Mọi dữ liệu phải qua FORGE". Tuấn có đồng ý bổ sung ngoại lệ chính thức cho Active Workspace (Code, Sync) và System Data không?
- *WHY:* Nếu không, `homes/tuandzain` bị tính là vi phạm T-DOS. Nếu có, T-DOS sẽ chính thức chỉ quản trị "Dữ liệu Lưu trữ / Tài sản".
- *OPTIONS:* (A) Bổ sung ngoại lệ. (B) Giữ nguyên v1.0 và buộc mọi thứ vào FORGE.
- *CONSEQUENCE:* Sẽ định đoạt số phận của `MAC_SYNC_WORKSPACE` và `family-api`.

**2. The 8-Layer Architecture Model**
- *QUESTION:* Tuấn có phê duyệt Mô hình 8 Tầng (tách biệt Storage, Lifecycle, Index, Database, App) làm Kiến trúc nền tảng mới không?
- *WHY:* AGY đã tự suy luận mô hình này. Cần Approval để nó trở thành Source of Truth.
- *OPTIONS:* (A) Approve. (B) Reject. (C) Modify.
- *CONSEQUENCE:* Nếu Approve, NAS sẽ chỉ làm Data Substrate, Database sẽ không chôn chặt path, và Agent sẽ không cần tự build DB Full-text search.

---
`STOP — WAIT FOR ARCHITECTURE REVIEW`
