# 15 ARCHITECTURE EVOLUTION RECONCILIATION

## 1. Executive Summary
- **Mục tiêu:** Tái dựng lịch sử tiến hóa kiến trúc (Architecture Archaeology) của hệ thống NAS và T-DOS, nhằm giải thích lý do hình thành cấu trúc hiện tại và đối chiếu với nhận thức kiến trúc mới của Tuấn.
- **Phát hiện cốt lõi (Core Finding):** Hệ thống đã tiến hóa từ một Ổ cứng mạng lưu trữ lạnh (Cold Storage) thành Xương sống dữ liệu (Data Substrate) của toàn bộ hệ sinh thái Gia Tộc. Sự đứt gãy hiện tại (như dữ liệu tồn đọng ở `homes`, thư mục chạy sai vòng đời) không phải là lỗi người dùng, mà là biểu hiện của **Sự tiến hóa chồng chéo (Architectural Overlap)** giữa các tầng: Physical Storage, T-DOS Lifecycle, Synology Indexing, và Canonical Database. Việc phân tách rạch ròi 8 tầng kiến trúc này là bắt buộc để không phát minh lại bánh xe.

## 2. Architecture History
- **NAS v0 (Cold Storage Era):** Được sử dụng thuần túy làm nơi lưu trữ vật lý, chứa các bản sao lưu thô (dump) từ Flashdrive, Google Drive, OneDrive cá nhân. Cấu trúc lúc này phản ánh đúng nguồn gốc vật lý của thiết bị lưu trữ.
- **NAS v1 (T-DOS Era):** Hình thành triết lý T-DOS (Tuấn Data Operating System). Áp dụng quy trình công nghiệp: `INPUT → FORGE → AUDIT → CLEAN → ATLAS → KNOWLEDGE`. NAS chuyển mình thành một Pipeline xử lý dữ liệu.
- **NAS v2 (Synology Discovery Era - Hiện tại):** Nhận thức mới nảy sinh khi phát hiện hệ điều hành Synology (DSM) sở hữu các công cụ quản trị dữ liệu cực mạnh (Universal Search, Synology Drive, Photos) hoạt động ngầm. Việc gò ép mọi thứ vào T-DOS Folder Taxonomy bắt đầu sinh ra xung đột (như thư mục `homes/tuandzain` chứa Active Workspace và System Data không thể nhét vào FORGE/ATLAS).
- **GiaToc Integration Era (Tương lai):** NAS không chỉ lưu trữ file, mà đóng vai trò Data Substrate cung cấp Media Files cho hệ thống GiaToc Database và Website. Đòi hỏi phân tách giữa Storage Representation (Folder) và Entity Presentation (Web).

## 3. Decision Timeline
- **Milestone 1:** *Định nghĩa T-DOS Pipeline*
  - **Date:** Quá khứ.
  - **Decision:** Tạo cấu trúc FORGE (6 bước) và ATLAS (3 vùng).
  - **Consequences:** Chuẩn hóa được luồng đi của dữ liệu thô, nhưng để lại khoảng trống cho Active Workspace và System Data.
- **Milestone 2:** *NAS Audit Phase 1 & 2*
  - **Date:** Tháng 6/2025 - 9/2026.
  - **Decision:** Quét toàn bộ NAS để tìm Duplicate và lập Data Inventory.
  - **Consequences:** Phát hiện sự phân mảnh khổng lồ (hơn 34k duplicate groups) do vòng đời dữ liệu bị kẹt giữa `homes` và `FORGE`.
- **Milestone 3:** *Phát hiện Synology Indexing (Phase 2.5)*
  - **Date:** 19/09/2026.
  - **Decision:** HUMAN (Tuấn) kiểm tra trực tiếp GUI của Universal Search.
  - **Consequences:** Xác nhận Synology đã cấu hình Indexed Folders, đánh đổ giả định "NAS chỉ là ổ cứng ngu ngốc". Account cũ `tuantudo` được phát hiện là nguyên nhân gây kẹt Re-indexing.

## 4. Current Architecture Model
Dựa trên nhận thức mới, kiến trúc không còn là một sơ đồ thư mục phẳng, mà là một hệ thống 8 tầng (8 Layers):
- **A. PHYSICAL STORAGE:** Ổ cứng NAS, File, Folder (`/volume1/`).
- **B. DATA LIFECYCLE (T-DOS):** Governance layer quản lý trạng thái sạch/bẩn của dữ liệu (FORGE, ATLAS).
- **C. DATA MANAGEMENT / INDEX:** Lớp truy hồi do Synology đảm nhiệm (Universal Search, Photos, Drive).
- **D. CANONICAL DATA / DATABASE:** Lớp thực thể (Entities, IDs, Relationships) quản lý tính chính thống, phục vụ dự án Gia Tộc.
- **E. KNOWLEDGE:** Lớp tri thức (Notes, Obsidian) diễn giải dữ liệu.
- **F. APPLICATION:** Website GiaToc (Lớp trình diễn/Web UI).
- **G. SOURCE CODE / DEVELOPMENT:** Môi trường code (Git, Agent Workspace, `.vscode-server`).
- **H. HUMAN GOVERNANCE:** Lớp quyền lực tối cao của Tuấn (Approve, Migrate, Kiến trúc).

## 5. T-DOS Principle Assessment

| Principle | Status | Evidence | Interpretation |
|---|---|---|---|
| `INPUT → FORGE → AUDIT → CLEAN → ATLAS` | **KEEP** | OBSERVED (Cấu trúc FORGE/ATLAS vẫn tồn tại) | Vẫn đúng tuyệt đối cho dòng chảy của **Dữ liệu tĩnh (Static Assets)**. Nhưng nó chỉ bao phủ Layer B (Lifecycle). |
| `Mọi dữ liệu bắt đầu ở FORGE` | **EXTEND** | OBSERVED (`homes` chứa Workspace) | Cần mở rộng: Chỉ đúng với "Dữ liệu lưu trữ/Tài sản". Không áp dụng cho Active Workspace hay System Data. |
| `ATLAS không chứa Raw Data` | **KEEP** | DOCUMENTED | Vẫn là quy tắc vàng để bảo vệ Clean Library. |

## 6. Synology Capability Reassessment

| Capability | Native | Tested | T-DOS Role | Custom Layer Needed |
|---|---|---|---|---|
| Full-text & Filename Search | Có (Universal Search) | HUMAN-PROVIDED | Core Search Engine | Không cần tự build SQLite Indexer. Chỉ cần Query Translator. |
| Photo Recognition (Face/Tags) | Có (Synology Photos) | DOCUMENTED | Visual Entity Engine | Không cần build lại bằng OpenCV/AIOS. |
| Indexed Folders config | Có | HUMAN-PROVIDED | Boundary Controller | Không cần T-DOS can thiệp, chỉ cần quản trị GUI. |

## 7. NAS / T-DOS / Database / GiaToc Relationship
**Conceptual Relationship Flow:**
1. **STORAGE (NAS):** File vật lý `/volume1/TUAN_ATLAS/Assets/Family/OngBa.jpg` nằm trên đĩa.
2. **LIFECYCLE (T-DOS):** Đảm bảo file `OngBa.jpg` là bản duy nhất (Canonical), sạch sẽ, không trùng lặp (nằm trong ATLAS).
3. **INDEXING (Synology):** Quét EXIF, nhận diện khuôn mặt "Ông Bà" và lập chỉ mục tìm kiếm tốc độ cao.
4. **ENTITY (Database):** Bảng `PERSON` có ID `P001`, trường `avatar_path` trỏ về NAS.
5. **APPLICATION (Website GiaToc):** Render giao diện cây gia phả, gọi API load ảnh từ NAS để hiển thị cho User.

## 8. Architectural Gaps
*Chỉ ghi nhận khoảng trống có Evidence rõ ràng:*
- **Active Workspace Gap:** T-DOS thiếu định nghĩa cho dữ liệu liên tục thay đổi (Git, Code, Sync folder). Hệ quả: Thư mục `ChiLinh`, `MAC_SYNC_WORKSPACE` bị Agent hiểu lầm là rác cần đưa vào `02_SORT`.
- **System Data Gap:** T-DOS thiếu quy định cho metadata của ứng dụng (Thư mục `Photos`, `.npm`).
- **Canonical Gap:** T-DOS chia folder `05_DUP` nhưng chưa có hệ thống Database để định danh đâu là bản Canonical thực sự giữa hàng vạn file trùng.

## 9. Superseded Assumptions
- *Giả định cũ:* "NAS là hệ thống lưu trữ tĩnh, T-DOS phải tự lo mọi thứ từ tìm kiếm đến phân loại." -> **ĐÃ BỊ LOẠI BỎ (SUPERSEDED)** bởi khám phá về sức mạnh của Synology Universal Search.
- *Giả định cũ:* "Mọi thứ trên NAS đều phải nhét vào cấu trúc FORGE hoặc ATLAS." -> **ĐÃ BỊ LOẠI BỎ (SUPERSEDED)** bởi sự thừa nhận tồn tại của tầng Active Workspace và System Data.

## 10. Decisions That Remain Valid
- Nguyên tắc nạp dữ liệu rác qua `01_INBOX`.
- Nguyên tắc bảo vệ sự thuần khiết của `TUAN_ATLAS`.
- Nguyên tắc không xóa Duplicate ngay lập tức mà gom về `05_DUP`.

## 11. Decisions Requiring Future Migration
- Dữ liệu rác/ổ cứng cũ (`_DEPRECATED`, `FLASHDRIVE`) đang kẹt ở `homes` và `TUAN_FORGE` cần được Migrate vào luồng INBOX.
- Cấu trúc thư mục của Database GiaToc cần được thiết kế lại để fetch data theo ID thực thể (Entity) thay vì hard-code đường dẫn folder.

## 12. Migration Governance
*Nguyên tắc quản trị Mọi sự di chuyển dữ liệu (Migration) từ nay về sau:*
1. **DISCOVERY:** Phân tích nội dung vật lý thực tế (Như Report #12 Target Profile).
2. **IMPACT ANALYSIS:** Đánh giá rủi ro gãy Sync, chết Link.
3. **MIGRATION PLAN:** Lập Manifest (Như Report #14).
4. **EXECUTION:** (Chỉ chạy khi có lệnh).
5. **VALIDATION:** Kiểm tra lại Index và Database.
6. **DEPRECATION:** Xóa cấu hình cũ (Như legacy account `tuantudo`).

## 13. Impact on NAS
- NAS không cần chạy các scripts Python nặng nề để hash và lập chỉ mục tự chế nữa (tiết kiệm CPU/RAM cho ARM). NAS được giải phóng để làm đúng nhiệm vụ Storage & Native Indexing.

## 14. Impact on GiaToc Database
- Database không cần lưu trữ file blob. Nó chỉ lưu trữ Entity (Person ID, Event ID) và trỏ URI/Path về các Canonical Assets nằm trong `TUAN_ATLAS`.

## 15. Impact on GiaToc Website
- Giao diện Website sẽ nhẹ hơn, đóng vai trò tiêu thụ (consume) API từ Database và load Media trực tiếp từ NAS (hoặc CDN cache).

## 16. Impact on AIOS / Agents
- Agent không đóng vai trò File Manager "chạy việc vặt" gom file bằng tay nữa. Agent đóng vai trò **Query Interpreter**: Dịch yêu cầu NLP của người dùng thành câu lệnh gọi Synology API để truy xuất kết quả.

## 17. Open Questions
1. Việc tương tác với Synology API (để Agent gọi Universal Search/Photos) có khả thi bằng REST/Python không, hay Synology đóng kín API này?
2. Tuấn sẽ cấp một thư mục riêng biệt (Ví dụ: `TUAN_WORKSPACE`) cho Active Data để tách biệt hoàn toàn khỏi T-DOS Lifecycle chứ?

## 18. Recommendations
- **DOCUMENTED:** Tận dụng tối đa Synology Drive và Universal Search thay vì tự build SQLite (Đề xuất dựa trên Specs của Synology).
- **INFERENCE:** Tài khoản `tuantudo` gây lỗi index cần được tháo bỏ khỏi GUI của Drive Admin Console.
- **PROPOSED:** T-DOS Lifecycle (Bảng 14_TDOS_EXECUTION_MANIFEST) nên được **HOLD** (Đóng băng) đối với các thư mục đang Sync, chỉ execute nhóm dữ liệu Raw Input tĩnh. Bổ sung thêm vùng `ACTIVE WORKSPACE` vào triết lý T-DOS.

## 19. HUMAN GATE

*Để hoàn thiện Architecture Reconciliation, Tuấn cần quyết định:*
1. Xác nhận sự tồn tại hợp pháp của lớp **ACTIVE WORKSPACE** và **SYSTEM DATA** (Nằm ngoài FORGE và ATLAS). 
2. Chấp thuận nguyên tắc: **Agent sẽ tương tác với Synology Native API** để tìm kiếm (nếu khả thi) thay vì tự build Semantic DB bằng SQLite/JSON.
3. Đánh giá lại Bảng kê `14_TDOS_EXECUTION_MANIFEST` dưới lăng kính mới này: Giữ nguyên quyết định [NO MOVE] đối với Workspace, chỉ Migrate dứt điểm đám ổ cứng Raw cũ.

---
`STOP — ARCHITECTURE HUMAN GATE`
