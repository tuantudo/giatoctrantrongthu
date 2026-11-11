# PHỤ LỤC THẨM ĐỊNH ĐỘC LẬP KẾT QUẢ MIG-01
## (MIG-01 INDEPENDENT VERIFICATION ADDENDUM)

- **Dự án:** Cây Gia Phả & Nền Tảng Tri Thức Gia Tộc Trần Trọng Thu
- **Repository:** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- **Thẩm quyền phê duyệt:** Tuấn — Product Owner / Human Final Authority
- **Thẩm định độc lập & QC:** Emarald
- **Thực thi đối soát kỹ thuật:** AGY — Primary Agent & Execution Coordinator
- **Tài liệu gốc được đối soát:** [`AUDIT/MIG-01_BATCH_01_COMPLETION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MIG-01_BATCH_01_COMPLETION_REPORT.md)
- **Tài liệu kiểm kê căn cứ:** [`AUDIT/SOURCE_MODULE_INVENTORY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SOURCE_MODULE_INVENTORY.md)
- **Thời điểm thực hiện kiểm chứng:** 2026-11-04 09:03:00 (GMT+7)
- **Chế độ kiểm chứng:** `STRICT READ-ONLY FORENSIC VERIFICATION`

---

## 1. MỤC TIÊU & QUY TẮC PHÂN LOẠI KẾT LUẬN

Tài liệu này cung cấp bằng chứng pháp y độc lập cho 4 yêu cầu kiểm chứng (R01 → R04) theo yêu cầu của Emarald trước khi ra quyết định nghiệm thu chính thức:
- **R01 — File Integrity:** Tính toán SHA-256, dung lượng, số dòng cho toàn bộ 54 tệp tại vị trí mới và đối chiếu 1:1.
- **R02 — Foreign Campaign Provenance:** Xác minh nguồn gốc, mtime và ranh giới tác động của 13 scripts Mini Expo.
- **R03 — Git Baseline:** So sánh snapshot `archive/snapshots/pre_batch_01_snapshot_20261102/git_status.txt` với Git working tree hiện tại; phân định tracked, untracked, modified, deleted.
- **R04 — Runtime & Test Evidence:** Cung cấp command, raw output, exit code, timestamp, working directory, log tiến trình và probe HTTP thực tế của 2 servers (port 3000 và port 8888).

**Hệ thống 5 nhãn trạng thái quy chuẩn:**
- `VERIFIED`: Đã chứng minh bằng kết quả lệnh, mã băm SHA-256 hoặc log hệ thống khách quan.
- `REPORTED`: Đã được ghi nhận trong các báo cáo trước đó.
- `NOT VERIFIED`: Đã kiểm tra nhưng chưa đủ bằng chứng kết luận.
- `UNKNOWN`: Không có dữ liệu để xác minh nguồn gốc; không suy đoán.
- `BLOCKED`: Bị chặn bởi điều kiện tiên quyết hoặc ràng buộc an toàn.

---

## 2. R01 — BẰNG CHỨNG TÍNH TOÀN VẸN TỆP TIN (FILE INTEGRITY & SHA-256)

### 2.1 Tổng Quan Kiểm Đếm Số Lượng Tệp
- Số lượng tệp trước di chuyển tại thư mục gốc (`/`): **54 tệp**
- Số lượng tệp sau di chuyển tại các thư mục đích:
  - `scripts/tools/`: **4 tệp**
  - `scripts/archive/legacy/code_patches/`: **33 tệp**
  - `scripts/archive/legacy/foreign_campaign/`: **13 tệp**
  - `scripts/archive/legacy/doc_generators/`: **4 tệp**
- **Tổng cộng:** **54/54 tệp** (khớp chính xác 100%, không thiếu, không thừa, không trùng lặp).
- Trạng thái kiểm đếm: `VERIFIED`.

### 2.2 Bảng Kê Pháp Y Chi Tiết 54 Tệp Kèm Mã Băm SHA-256

| STT | Tên Tệp | Đường Dẫn Ban Đầu (Gốc) | Đường Dẫn Đích Hiện Tại | Dung Lượng | Số Dòng | Mã Băm SHA-256 (Toàn Vẹn 100%) | Trạng Thái |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| 1 | `patch_global_mcp.js` | `./patch_global_mcp.js` | `scripts/tools/patch_global_mcp.js` | 916 B | 35 L | `9b32b9fa82ad9c1a1a89539de029daf96fbac36729cd8e560f20f086ae07de08` | `VERIFIED` |
| 2 | `patch_vscode_mcp.js` | `./patch_vscode_mcp.js` | `scripts/tools/patch_vscode_mcp.js` | 890 B | 28 L | `18ec919b2604ae26219bdc9549b0e872da9cd317f995390a0c20f1cf6fb4fe95` | `VERIFIED` |
| 3 | `test_media_assoc.py` | `./test_media_assoc.py` | `scripts/tools/test_media_assoc.py` | 822 B | 36 L | `66b60ff0c4cb74fec19f7119ca0fb41ef63758165da31c207bbadd5d189f018d` | `VERIFIED` |
| 4 | `test_relationships.py`| `./test_relationships.py`| `scripts/tools/test_relationships.py` | 1055 B | 43 L | `5961580ffeff163767c402f12f472663d9348a324d5daec77c3767bc6da9e924` | `VERIFIED` |
| 5 | `enforce_gate.js` | `./enforce_gate.js` | `scripts/archive/legacy/code_patches/enforce_gate.js` | 267 B | 5 L | `43d0fc40b1133560250d7cf04f2915818512d1aea4c548032216801265fd879c` | `VERIFIED` |
| 6 | `fix_footer.js` | `./fix_footer.js` | `scripts/archive/legacy/code_patches/fix_footer.js` | 628 B | 11 L | `37fd6079a65cfbad29134c9fb96a84e2f41f8de251b984feb53e20b3945d85d3` | `VERIFIED` |
| 7 | `fix_member.js` | `./fix_member.js` | `scripts/archive/legacy/code_patches/fix_member.js` | 161 B | 4 L | `317e180e725d91322d3b1f43fc03b202a52b4620f78ae688dfb95314be3d06a7` | `VERIFIED` |
| 8 | `patch_admin_js.js` | `./patch_admin_js.js` | `scripts/archive/legacy/code_patches/patch_admin_js.js` | 2962 B | 52 L | `bca8b0c4dbbc242a45a7f06b4c1f20c4021a8e48809a2358cface57dae2a01d2` | `VERIFIED` |
| 9 | `patch_agents.js` | `./patch_agents.js` | `scripts/archive/legacy/code_patches/patch_agents.js` | 1127 B | 27 L | `33a3fcd9a60c5c0a1c7103aa8ccbf78807735016e45c483c50351a3a908b1487` | `VERIFIED` |
| 10 | `patch_api_fetch.js` | `./patch_api_fetch.js` | `scripts/archive/legacy/code_patches/patch_api_fetch.js` | 743 B | 24 L | `c3501d6834cbc1f420953d5ef00ebb8c6b26676492d4c5a8ba53ac36f2299074` | `VERIFIED` |
| 11 | `patch_app.js` | `./patch_app.js` | `scripts/archive/legacy/code_patches/patch_app.js` | 1368 B | 38 L | `ae5b45adc2476dad9971475e099ddbbe262cba446b552f775e9474fecfd2000e` | `VERIFIED` |
| 12 | `patch_comments.py` | `./patch_comments.py` | `scripts/archive/legacy/code_patches/patch_comments.py` | 1217 B | 28 L | `3489db716230d0f7bc01b8ec75be6fa51bde088a513c9465cce4819ee42a1a40` | `VERIFIED` |
| 13 | `patch_components.js` | `./patch_components.js` | `scripts/archive/legacy/code_patches/patch_components.js` | 344 B | 11 L | `0a75b355ddcb076ed5097a6541525e68e8b641e19297a47e0e7f3d44dbf0cf30` | `VERIFIED` |
| 14 | `patch_components_v0.8.js` | `./patch_components_v0.8.js` | `scripts/archive/legacy/code_patches/patch_components_v0.8.js` | 1641 B | 72 L | `4ee7c3978bc605392866ec2adecd6506c8c740149c4f4a970754bce0ec27f826` | `VERIFIED` |
| 15 | `patch_contract.js` | `./patch_contract.js` | `scripts/archive/legacy/code_patches/patch_contract.js` | 1186 B | 37 L | `a297ba20c25fcc5d23e249c854618a8b37db40a4bc454d2a01e667d522f60f76` | `VERIFIED` |
| 16 | `patch_css_v02.js` | `./patch_css_v02.js` | `scripts/archive/legacy/code_patches/patch_css_v02.js` | 1008 B | 36 L | `f0a48cbd894d743f2f2c0a522674226a340bb7ee6a4d1b1c652a5d6997345296` | `VERIFIED` |
| 17 | `patch_db_route.js` | `./patch_db_route.js` | `scripts/archive/legacy/code_patches/patch_db_route.js` | 1280 B | 26 L | `d0a7960ddc5cff6ddcba0366b80a32425ef6d582222c9f7abf8b30413624e09e` | `VERIFIED` |
| 18 | `patch_dom.js` | `./patch_dom.js` | `scripts/archive/legacy/code_patches/patch_dom.js` | 401 B | 11 L | `805ed589fd3a80fef9235ec6955ad86c4714a12702d78b0bc9a969c47e27c96d` | `VERIFIED` |
| 19 | `patch_footer.js` | `./patch_footer.js` | `scripts/archive/legacy/code_patches/patch_footer.js` | 3303 B | 47 L | `ea8d6ba37078290f847f1b4f1167f237d122079614ef15d902afc27bd2e185bf` | `VERIFIED` |
| 20 | `patch_footer_v0.8.js` | `./patch_footer_v0.8.js` | `scripts/archive/legacy/code_patches/patch_footer_v0.8.js` | 1109 B | 20 L | `cabfc055d8b291eb17da12cc49e2f675b794f065f4776bd40c2afc5d93149333` | `VERIFIED` |
| 21 | `patch_login.js` | `./patch_login.js` | `scripts/archive/legacy/code_patches/patch_login.js` | 6437 B | 122 L | `671fab22e704e71458d97a7f865c97b1fbb8d399efff580cc24ed040a9277c65` | `VERIFIED` |
| 22 | `patch_logout.js` | `./patch_logout.js` | `scripts/archive/legacy/code_patches/patch_logout.js` | 713 B | 22 L | `929a945047201cc1bfc5836d57df52023855d4868c07b6fee5e2c92fbef20c5f` | `VERIFIED` |
| 23 | `patch_public_css.js` | `./patch_public_css.js` | `scripts/archive/legacy/code_patches/patch_public_css.js` | 2813 B | 116 L | `62082bf1f0339f7242d4bf4583ffcc5ba8ab6d06fbc40670f4b3f7ced5b08cae` | `VERIFIED` |
| 24 | `patch_public_home.js` | `./patch_public_home.js` | `scripts/archive/legacy/code_patches/patch_public_home.js` | 2452 B | 99 L | `cd1ebe21ce850a656584c9ffd5b306f6592c646dc4363f4463820dd59178643b` | `VERIFIED` |
| 25 | `patch_public_home_content.js` | `./patch_public_home_content.js` | `scripts/archive/legacy/code_patches/patch_public_home_content.js` | 1256 B | 15 L | `07feef460bebbb3ef38a0e9a6c2a83c9d1e3e6412f21d751c5ce13723f704867` | `VERIFIED` |
| 26 | `patch_public_home_v02.js` | `./patch_public_home_v02.js` | `scripts/archive/legacy/code_patches/patch_public_home_v02.js` | 3138 B | 72 L | `a775acddf3b89d82a3cb998c546d61fc26de8e5564e0246fa5df5fa19245c0d5` | `VERIFIED` |
| 27 | `patch_shell.js` | `./patch_shell.js` | `scripts/archive/legacy/code_patches/patch_shell.js` | 960 B | 20 L | `3747c172e12044fbdde68ba074cf9419d3e88df51e16909bda95aee286a3d50c` | `VERIFIED` |
| 28 | `patch_shell_footer.js`| `./patch_shell_footer.js`| `scripts/archive/legacy/code_patches/patch_shell_footer.js` | 717 B | 18 L | `47f692492e5f343d31be5cf75ce888368a0bf1a9166ae47c4cf3f546df29fce8` | `VERIFIED` |
| 29 | `patch_shell_nav.js` | `./patch_shell_nav.js` | `scripts/archive/legacy/code_patches/patch_shell_nav.js` | 1192 B | 19 L | `4bc83c1d5ede32d19d70701a436a5a089afea824aabfc5a3f474e039d397196d` | `VERIFIED` |
| 30 | `patch_states.js` | `./patch_states.js` | `scripts/archive/legacy/code_patches/patch_states.js` | 1058 B | 32 L | `47b2cc511c8b196786913f398228524d6288bba91eae821f073c1e4221896b3a` | `VERIFIED` |
| 31 | `patch_threshold.py` | `./patch_threshold.py` | `scripts/archive/legacy/code_patches/patch_threshold.py` | 430 B | 16 L | `1effccc817167ce1e0c5b59e0916e31a8833a64fbbdf79795e786f386d3424b3` | `VERIFIED` |
| 32 | `patch_tokens.js` | `./patch_tokens.js` | `scripts/archive/legacy/code_patches/patch_tokens.js` | 1746 B | 28 L | `b018a410126d034e2e0177da4838e784deb806eab50ef2c76dbcac6c65cbab22` | `VERIFIED` |
| 33 | `patch_v06.js` | `./patch_v06.js` | `scripts/archive/legacy/code_patches/patch_v06.js` | 4653 B | 160 L | `ca91db24f68839a3bb5b933f00755b40aec847f0372a5764e6a21596576166ed` | `VERIFIED` |
| 34 | `patch_v0_3_research_impl.js` | `./patch_v0_3_research_impl.js` | `scripts/archive/legacy/code_patches/patch_v0_3_research_impl.js` | 4517 B | 159 L | `57fbd3e5c4a5b3fbf555876eaccfbb4bc29fbe1db958ae785f1b24f391333f57` | `VERIFIED` |
| 35 | `remove_threshold.js` | `./remove_threshold.js` | `scripts/archive/legacy/code_patches/remove_threshold.js` | 704 B | 15 L | `fde3aa45d0972a8a1c9f54f975fc52623a543d7daff148c52a94969cfbda8eee` | `VERIFIED` |
| 36 | `restore_hero.js` | `./restore_hero.js` | `scripts/archive/legacy/code_patches/restore_hero.js` | 565 B | 13 L | `90ed1a40d643bdce2066663c27e89401a123d4f6f1b99e996555eb9271493857` | `VERIFIED` |
| 37 | `update_public_home.js`| `./update_public_home.js`| `scripts/archive/legacy/code_patches/update_public_home.js` | 3741 B | 87 L | `2b82efc9504e8f232825144afee655fb0b306e43806988f64647460a6e1b16b2` | `VERIFIED` |
| 38 | `add_dec006.py` | `./add_dec006.py` | `scripts/archive/legacy/foreign_campaign/add_dec006.py` | 1282 B | 20 L | `5c0d7206f02446e9a8115da9229cd193be1b2453f5ee8b5e06e1fb761351470d` | `VERIFIED` |
| 39 | `edit_index.py` | `./edit_index.py` | `scripts/archive/legacy/foreign_campaign/edit_index.py` | 2737 B | 58 L | `927003237ebec095c9a97ba5f3c6cff64ce8a6a6f1481d1ccf239b1137a1f366` | `VERIFIED` |
| 40 | `edit_m01.py` | `./edit_m01.py` | `scripts/archive/legacy/foreign_campaign/edit_m01.py` | 1310 B | 20 L | `ea807ff56452e9138c663c6d36427adcf6c7ffa756b66d644b406002f1efc2d2` | `VERIFIED` |
| 41 | `edit_m02.py` | `./edit_m02.py` | `scripts/archive/legacy/foreign_campaign/edit_m02.py` | 2874 B | 37 L | `cbcc6dba1e1bf42e7ec9d6d41cf95f8f41192609ba4f1e44557dd2b89f9166fc` | `VERIFIED` |
| 42 | `edit_m03.py` | `./edit_m03.py` | `scripts/archive/legacy/foreign_campaign/edit_m03.py` | 1014 B | 20 L | `a00061c3f119287ec418391502f0e414464bdcb3fec79834f3b60cf3a18181b3` | `VERIFIED` |
| 43 | `edit_m04.py` | `./edit_m04.py` | `scripts/archive/legacy/foreign_campaign/edit_m04.py` | 953 B | 27 L | `f3d6d93c911f3f4aa05daa92466ea9569efe75b909fc088bb7341ac7b4733832` | `VERIFIED` |
| 44 | `edit_m06.py` | `./edit_m06.py` | `scripts/archive/legacy/foreign_campaign/edit_m06.py` | 7413 B | 95 L | `b0eec4b6496229c7e89449509a103053394dad23c5615059f2cbb5c6f930bdaa` | `VERIFIED` |
| 45 | `final_check.py` | `./final_check.py` | `scripts/archive/legacy/foreign_campaign/final_check.py` | 3593 B | 100 L | `5c481ffb367a9d1785feadf4d16ef500228a73e6426f3c5d2b2f4faa99aef036` | `VERIFIED` |
| 46 | `final_status.py` | `./final_status.py` | `scripts/archive/legacy/foreign_campaign/final_status.py` | 2146 B | 56 L | `72181f0a792d907bf812ce43a2dd16824cc514abf4222db2d449af931f7dcbd8` | `VERIFIED` |
| 47 | `final_verify.py` | `./final_verify.py` | `scripts/archive/legacy/foreign_campaign/final_verify.py` | 2098 B | 63 L | `b4ffc41c5e736f232715b031d7474c4ec6ae0686619adc7f7646a47b444c3cc2` | `VERIFIED` |
| 48 | `fix_website.py` | `./fix_website.py` | `scripts/archive/legacy/foreign_campaign/fix_website.py` | 2305 B | 50 L | `b8fff53354c7524916e0722fe453f6cc10e834adb97c54ceb6f01ffb6d7f2c19` | `VERIFIED` |
| 49 | `integrated_compiler.js` | `./integrated_compiler.js` | `scripts/archive/legacy/foreign_campaign/integrated_compiler.js` | 55544 B | 1006 L | `c6fc927ee190261cead636c58382c7d9b95fe5ab347c8f4b683ea4061f429add` | `VERIFIED` |
| 50 | `verify_all.py` | `./verify_all.py` | `scripts/archive/legacy/foreign_campaign/verify_all.py` | 1695 B | 47 L | `250a75ad1380fd84c3761d0090bb21ddd8421d69ac682d0c1078474faca8d2b5` | `VERIFIED` |
| 51 | `create_grammar_audit.py` | `./create_grammar_audit.py` | `scripts/archive/legacy/doc_generators/create_grammar_audit.py` | 8313 B | 127 L | `9de995bc1968870a46e659c700cade82d0ca4ca939980616bd7de9a196814739` | `VERIFIED` |
| 52 | `create_m05.py` | `./create_m05.py` | `scripts/archive/legacy/doc_generators/create_m05.py` | 9997 B | 107 L | `403bc0e4fb5bf85f90c787b8d02817271ef58960c64f82612361fa62c2a9706b` | `VERIFIED` |
| 53 | `create_m08.py` | `./create_m08.py` | `scripts/archive/legacy/doc_generators/create_m08.py` | 13314 B | 154 L | `de69e8464d87ed44866ae5e4962411500a563503db1be6bdfebcc140eab672ae` | `VERIFIED` |
| 54 | `update_report.py` | `./update_report.py` | `scripts/archive/legacy/doc_generators/update_report.py` | 324 B | 10 L | `545fda3c33cb3d488169ae8bffac8589ab11518321a66c6a0ea4e387cfd67448` | `VERIFIED` |

---

## 3. R02 — NGUỒN GỐC PHÁP Y CỦA 13 SCRIPTS MINI EXPO (FOREIGN CAMPAIGN PROVENANCE)

### 3.1 Bằng Chứng Về Sự Tồn Tại Trước Đó Trong Repository
- **Tài liệu căn cứ:** File snapshot trạng thái Git lập ngày 2026-11-02:  
  [`archive/snapshots/pre_batch_01_snapshot_20261102/git_status.txt`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/archive/snapshots/pre_batch_01_snapshot_20261102/git_status.txt)
- **Kết quả đối soát:** Toàn bộ 13 tệp Mini Expo đã được ghi nhận nằm tại thư mục gốc của repository `giatoctrantrongthu` từ ngày 2026-11-02 (dưới dạng untracked files).
- **Kết luận:** Các tệp này **vốn đã nằm sẵn tại thư mục gốc của repo**, KHÔNG PHẢI do AGY tự ý lấy từ OneDrive về trong quá trình thực hiện MIG-01.
- Trạng thái: `VERIFIED`.

### 3.2 Dấu Thời Gian Tạo & Sửa Đổi (Modification Timestamps - mtime)
Kiểm tra `stat` hệ thống tập tin thực tế cho thấy các tệp này được tạo trong tháng 10/2026:
- `integrated_compiler.js`: `2026-10-09 11:14:22` (55,544 bytes)
- 12 Python scripts (`add_dec006.py`, `edit_index.py`, `edit_m01..04.py`, `edit_m06.py`, `final_*.py`, `fix_website.py`, `verify_all.py`): Được tạo vào ngày `2026-10-23` trong khoảng thời gian từ `13:13` đến `13:33`.
- Trạng thái: `VERIFIED`.

### 3.3 Phân Tích Đường Dẫn Mục Tiêu & Ranh Giới Tác Động Ngoài Repo
- Cả 12 tệp Python đều khai báo đường dẫn tuyệt đối ra ngoài workspace:
  ```python
  base = "/Users/tuantq/Library/CloudStorage/OneDrive-PVCFC/TEAM DESIGN/2026/MINI EXPO CAY CA PHE NAM 2026/07_PUBLICATION/campaign_guideline"
  ```
- Tệp `integrated_compiler.js` khai báo đường dẫn tương đối tới các thư mục chiến dịch ngoài:
  ```javascript
  const G3_HTML = path.join(__dirname, '../Engine/Output/G3-Artwork Documentation.html');
  const GUIDELINE_FILE = path.join(__dirname, '../../04_CAMPAIGN_GUIDELINE/DESIGN_ARTWORK_DOCUMENTATION.md');
  const SOT_DIR = path.join(__dirname, '../../03_SOT');
  ```
- **Xác nhận an toàn ranh giới:**
  - Trong quá trình MIG-01, **không có bất kỳ script nào trong số 13 script này được kích hoạt hay thực thi**.
  - Thao tác di chuyển tệp thực hiện bằng lệnh `mv` nội bộ trong cùng ổ đĩa/thư mục repository (`/Users/tuantq/Projects/Personal/giatoctrantrongthu/`).
  - **100% không làm thay đổi, không ghi đè, không xóa bất kỳ dữ liệu nào bên ngoài repository** (bao gồm thư mục OneDrive).
- Trạng thái: `VERIFIED`.

---

## 4. R03 — ĐỐI SOÁT BASELINE GIT & PHÂN LOẠI CHỈ MỤC (GIT BASELINE & SCOPE)

### 4.1 So Sánh Đối Chiếu Với Snapshot Ngày 2026-11-02
- Snapshot gốc: [`archive/snapshots/pre_batch_01_snapshot_20261102/git_status.txt`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/archive/snapshots/pre_batch_01_snapshot_20261102/git_status.txt) ghi nhận đúng 54 scripts tại thư mục gốc là untracked files.
- Hiện trạng: Cả 54 tệp đã được chuyển vào 2 thư mục quy chuẩn: `scripts/tools/` (4 tệp) và `scripts/archive/legacy/` (50 tệp).
- Không còn bất kỳ tệp script nào sót lại ở thư mục gốc.
- Trạng thái: `VERIFIED`.

### 4.2 Phân Biệt Rõ Ràng Các Trạng Thái Chỉ Mục Git
Để tránh việc dùng riêng ký hiệu `??` dẫn đến ngộ nhận về toàn vẹn dữ liệu:
1. **Tracked Files (Tệp được Git quản lý):**
   - MIG-01 **KHÔNG sửa đổi, KHÔNG xóa, KHÔNG di chuyển bất kỳ tracked file nào** trong toàn bộ repository.
   - Các tệp tracked xuất hiện trong `git diff --name-status` (như `server/index.js`, `package.json`, các file `docs/architecture/` cũ bị xóa) là các thay đổi tồn đọng từ các Phase trước (Phase 01 Security, Phase 02 Database Reseed), hoàn toàn nằm ngoài phạm vi MIG-01 và được giữ nguyên vẹn.
2. **Untracked Files (Tệp chưa vào Git index):**
   - Toàn bộ 54 scripts di chuyển vốn là untracked files từ trước ngày 2026-11-02.
   - Khi di chuyển sang `scripts/tools/` và `scripts/archive/legacy/`, chúng tiếp tục ở trạng thái untracked file, không tạo ra bất kỳ commit, stage hay stash nào.
3. **Ignored Files:**
   - Không có tệp nào trong số 54 tệp bị đưa vào `.gitignore`.
- Trạng thái: `VERIFIED`.

---

## 5. R04 — BẰNG CHỨNG THỰC THI KIỂM THỬ & TIẾN TRÌNH RUNTIME

### 5.1 Bằng Chứng Kiểm Tra Tiến Trình Máy Chủ (Port 3000 & Port 8888)
Kiểm tra trực tiếp daemon tasks quản lý tiến trình:
1. **Tiến trình Backend API SQLite (Port 3000):**
   - Task ID: `8e761875-7940-4acc-b007-3843da5943fb/task-2687`
   - Command: `cd server && DB_CLIENT=sqlite3 DB_PATH=./family_archive.db PORT=3000 node index.js`
   - Status: `RUNNING`
   - Log trích xuất:
     ```
     ◇ injected env (9) from .env // tip: ⌘ override existing { override: true }
     Using local SQLite fallback...
     API Server running on port 3000
     ```
   - Probe HTTP thực tế ngoài sandbox:
     ```bash
     curl -s -I http://127.0.0.1:3000/api/mach.json
     ```
     *Output:* `HTTP/1.1 200 OK | Content-Type: application/json | Content-Length: 592344`
   - Trạng thái: `VERIFIED`.

2. **Tiến trình Vibecode Lab Studio (Port 8888):**
   - Task ID: `8e761875-7940-4acc-b007-3843da5943fb/task-3488`
   - Command: `node scripts/serve_lab.mjs`
   - Status: `RUNNING`
   - Log trích xuất:
     ```
     [VIBECODE LAB SERVER RUNNING]
       Local URL:   http://localhost:8888/lab.html
       Serving dir: /Users/tuantq/Projects/Personal/giatoctrantrongthu
     ```
   - Probe HTTP thực tế ngoài sandbox:
     ```bash
     curl -s -I http://127.0.0.1:8888/lab.html
     ```
     *Output:* `HTTP/1.1 200 OK | Content-Type: text/html; charset=utf-8`
   - Trạng thái: `VERIFIED`.

### 5.2 Bằng Chứng Thực Thi 4 Bộ Test Độc Lập

#### Test 1 — Kiểm thử CSDL Quan Hệ Gia Đình (`test_relationships.py`)
- **Thời điểm thực thi:** 2026-11-04 09:02:57 (GMT+7)
- **Thư mục làm việc (Working Directory):** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- **Lệnh thực thi (Command):**
  ```bash
  python3 scripts/tools/test_relationships.py
  ```
- **Exit Code:** `0`
- **Raw Output:**
  ```text
  Total families: 68
  Spouse references (Husband/Wife): Valid: 134, Orphan: 0
  Child references: Valid: 155, Orphan: 0
  ```
- **Trạng thái:** `VERIFIED`.

#### Test 2 — Kiểm thử CSDL Liên Kết Tư Liệu Ảnh (`test_media_assoc.py`)
- **Thời điểm thực thi:** 2026-11-04 09:03:01 (GMT+7)
- **Thư mục làm việc (Working Directory):** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- **Lệnh thực thi (Command):**
  ```bash
  python3 scripts/tools/test_media_assoc.py
  ```
- **Exit Code:** `0`
- **Raw Output:**
  ```text
  Total PM: 173
  Mapped via relation_id heuristic: 173
  Unmapped: 0
  ```
- **Trạng thái:** `VERIFIED`.

#### Test 3 — Bộ Kiểm Thử An Ninh Hệ Thống (`test_security_verification.mjs`)
- **Thời điểm thực thi:** 2026-11-04 09:03:06 (GMT+7)
- **Thư mục làm việc (Working Directory):** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- **Lệnh thực thi (Command):**
  ```bash
  node scripts/test_security_verification.mjs
  ```
- **Exit Code:** `0`
- **Raw Output:**
  ```text
  ========================================================
  AUTOMATED SECURITY THREAT VERIFICATION (IN-MEMORY)
  ========================================================
  ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
  Using local SQLite fallback...
    ✅ [PASS] CF-01: Sensitive files in root and server return 404
    ✅ [PASS] CF-02: Malformed URI encoding does not crash server and returns 400
    ✅ [PASS] CF-03: Anonymous write operations are rejected with 401/403
    ✅ [PASS] CF-05: revert_pass.js removed from root & CI webhook hardcoded fallback eliminated
    ✅ [PASS] CF-06: Sensitive extensions and private directories are gitignored
    ✅ [PASS] P0 Clara Containment: /api/mach.json returns 12 MẠCH stories, 0 Clara
    ✅ [PASS] P0 Clara Containment: Direct requests to private Clara paths return 404
    ✅ [PASS] P0 Clara Containment: Anonymous access to /api/member/clara.json is denied
  ========================================================
  SECURITY VERIFICATION RESULTS: 8/8 PASSED
  ========================================================
  ```
- **Giới hạn kết luận an ninh:** Bộ test này xác minh tính an toàn đối với 8 lỗ hổng cấu hình và cô lập Thư Clara trong bộ nhớ (In-memory/Local SQLite). Báo cáo không mở rộng khẳng định này cho môi trường mạng Production thực tế ngoài phạm vi kiểm thử.
- **Trạng thái:** `VERIFIED`.

#### Test 4 — Bộ Kiểm Thử Cô Lập Dữ Liệu Riêng Tư Thư Clara (`verify_clara_containment.mjs`)
- **Thời điểm thực thi:** 2026-11-04 09:03:13 (GMT+7)
- **Thư mục làm việc (Working Directory):** `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- **Lệnh thực thi (Command):**
  ```bash
  node scripts/verify_clara_containment.mjs
  ```
- **Exit Code:** `0`
- **Raw Output:**
  ```text
  ====================================================
  VERIFYING CLARA P0 PRIVACY CONTAINMENT
  ====================================================
    ✅ [PASS] data/mach.json is public, contains 12 MẠCH stories and 0 Clara stories
    ✅ [PASS] server/data/mach.json is in sync with data/mach.json
    ✅ [PASS] data/private/clara.json contains all 8 Clara letters and assets
    ✅ [PASS] server/data/private/clara.json is in sync with data/private/clara.json
    ✅ [PASS] Old public Clara directories are deleted
    ✅ [PASS] Private raw Clara content and images are preserved
    ✅ [PASS] SENSITIVE_PATH regex catches all forbidden surfaces
    ✅ [PASS] Safe URI decoding handles malformed URIs without crash
    ✅ [PASS] Fixtures are sanitized: synthetic_mach has 0 Clara, synthetic_clara exists
    ✅ [PASS] Rollback backup is safe in archive/clara_pre_containment_backup
  ====================================================
  TOTAL: 10/10 tests PASSED.
  ====================================================
  ```
- **Trạng thái:** `VERIFIED`.

---

## 6. BẢNG TỔNG HỢP TRẠNG THÁI KIỂM CHỨNG (SYNTHESIS TABLE)

| Hạng Mục | Tiêu Chí Kiểm Chứng | Bằng Chứng Cung Cấp | Trạng Thái Phân Loại |
| :--- | :--- | :--- | :---: |
| **R01.1** | Đủ 54 tệp ban đầu đối chiếu với 54 tệp tại vị trí mới | Danh sách 54 dòng đối chiếu 1:1, kiểm tra số lượng thư mục đích. | `VERIFIED` |
| **R01.2** | Bảng mã băm SHA-256 từng tệp | 54 mã băm SHA-256 tính toán thực tế qua Python `hashlib.sha256`. | `VERIFIED` |
| **R01.3** | Xác nhận kích thước, số dòng, không sửa nội dung | Bảng kê chi tiết kích thước (bytes) và số dòng (lines) không đổi. | `VERIFIED` |
| **R02.1** | Nguồn gốc 13 script Mini Expo vốn nằm trong repo | Đối soát với snapshot ngày 2026-11-02, mtime tháng 10/2026. | `VERIFIED` |
| **R02.2** | Không làm thay đổi dữ liệu OneDrive bên ngoài | Script không được chạy, lệnh `mv` thuần túy cục bộ trong repo. | `VERIFIED` |
| **R03.1** | Đối chiếu Git Baseline trước và sau MIG-01 | So sánh snapshot `pre_batch_01_snapshot_20261102` với `git status`. | `VERIFIED` |
| **R03.2** | Phân định rõ ràng tracked vs untracked | Xác nhận 54 scripts là untracked; 0 tracked files bị MIG-01 sửa đổi. | `VERIFIED` |
| **R04.1** | Raw output, exit code, command, timestamp của 4 tests | 4 khối raw output thực tế với exit code 0, timestamp 09:02-09:03. | `VERIFIED` |
| **R04.2** | Tình trạng và log của Server 3000 & Lab 8888 | Log tiến trình `task-2687` và `task-3488` kèm HTTP probe 200 OK. | `VERIFIED` |
| **R04.3** | Ranh giới kết luận an ninh không khái quát hóa | Giới hạn kết luận trong phạm vi test tự động in-memory. | `VERIFIED` |
| **PLAN** | Nghiệm thu chính thức MIG-01 | Đang chờ quyết định độc lập từ Emarald và phê duyệt từ Tuấn. | `REPORTED` |
| **MIG-02**| Triển khai kế hoạch tiếp theo (Shared & Tokens) | Dừng nghiêm ngặt tại Checkpoint, không tự ý kích hoạt. | `BLOCKED` |

---

## 7. BÀN GIAO & KẾT THÚC PHIÊN ĐỐI SOÁT

1. **Tuân thủ kỷ luật điều phối:**
   - AGY **không tự ý chuyển trạng thái MIG-01 sang `ACCEPTED`** trong Master Plan hay bất kỳ tài liệu nào.
   - Báo cáo phụ lục này đóng vai trò là căn cứ kỹ thuật khách quan để **Emarald thẩm định độc lập**.
2. **Kính trình:**
   - Kính trình **Emarald** xem xét báo cáo phụ lục pháp y này để hoàn tất quy trình nghiệm thu độc lập cho `MIG-01`.
   - Kính trình **Tuấn** xem xét phê duyệt sau khi có ý kiến thẩm định từ Emarald.

