# GIATOCTRANTRONGTHU — BATCH 1: PRE-CLEANUP SAFETY & CLASSIFICATION REVIEW

- **Repository:** `giatoctrantrongthu` (`/Users/tuantq/Projects/Personal/giatoctrantrongthu`)
- **Ngày kiểm định:** `2026-10-31`
- **Vai trò:** Repository Safety Auditor (Độc lập rà soát lại `AUDIT/REPOSITORY_AUDIT.md`)
- **Chế độ thực thi:** **STRICT READ-ONLY (Human Gate Active — Chưa thực hiện backup, chưa move/delete/edit bất kỳ file nào)**
- **Chuẩn trạng thái bằng chứng áp dụng:**
  `DOCUMENTED` · `CONFIGURED` · `OBSERVED` · `TESTED` · `PROVEN` · `PARTIAL` · `FAILED` · `BLOCKED` · `UNKNOWN`

---

## 1. Executive Summary

Đợt rà soát an toàn độc lập này kiểm định lại toàn bộ hiện trạng Git, mức độ rủi ro mất dữ liệu trên working tree, rủi ro lộ lọt dữ liệu nhạy cảm, và tính xác thực của từng đề xuất phân loại trong báo cáo trước (`AUDIT/REPOSITORY_AUDIT.md`) trước khi Tuấn phê duyệt bất kỳ thao tác dọn dẹp nào.

### Kết luận trọng tâm

1. **Hiện trạng Git thực tế đã thay đổi nhẹ so với báo cáo cũ (`PROVEN`):**
   - Nhánh hiện tại là `main` tại commit `42a7ed2f229ac0d9a6630126d4da058e55acf50b` (đồng bộ `origin/main`), **`0` file staged**, **`86` thay đổi unstaged trên file đã track** (`21` Modified ` M`, `65` Deleted ` D`), **`556` file untracked (`??`)**, tổng cộng **`642` mục thay đổi** trên `git status -uall` (tăng `+1` so với con số `641` của báo cáo cũ do sự xuất hiện của chính file `AUDIT/REPOSITORY_AUDIT.md`), cùng **`29` mục gitignored (`!!`)** đang tồn tại trên đĩa.
2. **Phát hiện rủi ro mất dữ liệu nghiêm trọng nếu thực thi nguyên văn kế hoạch `DELETE` của báo cáo cũ (`PROVEN` / `BLOCKED`):**
   - Báo cáo cũ xếp **`./~/Desktop/Garmin_Forensic_Audit/` (25 file dữ liệu sức khỏe/giấc ngủ Garmin cá nhân)** và **15 script thuộc dự án `MINI EXPO CÂY CÀ PHÊ NĂM 2026` (`OneDrive-PVCFC`)** vào nhóm `JUNK` (`DELETE`). Cả `40` file này đều là **untracked (`??`)**, không có trong Git history, và sandbox hiện `BLOCKED` không thể kiểm chứng bản gốc ngoài workspace còn đầy đủ hay không. Xóa thẳng tại chỗ có nguy cơ **mất vĩnh viễn dữ liệu sức khỏe cá nhân và script công việc của Tuấn**.
   - Báo cáo cũ ghi nhầm số lượng script ở root là `37` script vá lỗi (`52` tổng cộng), trong khi thực tế trên đĩa có **`40` script ngoài nhóm PVCFC (`55` tổng cộng)** — tất cả đều `??` untracked, trong đó có cả script kiểm tra DB (`test_media_assoc.py`, `test_relationships.py`), script sinh báo cáo audit (`create_grammar_audit.py`), và script đụng tới cấu hình IDE toàn cục (`patch_global_mcp.js`, `patch_vscode_mcp.js`).
   - Báo cáo cũ đề xuất xóa `root node_modules/` (`puppeteer@25.10.0`) và xóa `src/js/app-v2.js` + `src/css/prototype.css` mà chưa xử lý việc `package.json` gốc hiện **chưa khai báo `puppeteer`** (xóa ngay sẽ làm hỏng `scripts/ui_vnext_qa.mjs`) và `prototype/design-001-public/index.html` vẫn đang trỏ đường dẫn cứng tới `src/js/app-v2.js` và `src/css/prototype.css` (vốn đang mang sửa đổi ` M` chưa commit).
3. **Phát hiện 3 rủi ro lộ dữ liệu nhạy cảm mới chưa từng được báo cáo cũ cảnh báo (`PROVEN`):**
   - **Lỗ hổng phơi bày file tĩnh trên Express (`server/index.js` dòng 21–28):** `express.static(path.join(__dirname, '..'))` phục vụ toàn bộ thư mục gốc dự án; biểu thức chặn `SENSITIVE_PATH` chỉ chặn `cookie\.txt` (số ít) nên **bỏ lọt `cookies_dev.txt` (số nhiều)**, đồng thời **không chặn** `/~/Desktop/Garmin_Forensic_Audit/...`, `/content/mach/thu-gui-clara/...` (thư riêng gia đình), `/data/mach.json` (gồm cả 8 bức Thư gửi Clara), và `/revert_pass.js` (chứa mật khẩu test dạng rõ).
   - **Hardcoded Webhook URL trong Git (`PROVEN`):** `.github/workflows/instant-sync.yml` chứa trực tiếp URL thực thi Google Apps Script (`https://script.google.com/macros/s/AKfycb...BMEEgA/exec`) ngay trong mã nguồn đã commit.
   - **Bẫy `.gitignore` ngược chiều (`PROVEN`):** `server/data/genealogy.json` (223 nhân vật gia phả thật) và `./~` **chưa được gitignore** (dễ bị `git add .` đẩy nhầm lên GitHub), trong khi `.opencode/package.json` & `.opencode/package-lock.json` lại **đang bị `.opencode/.gitignore` chặn** (sẽ bị thiếu nếu commit `.opencode/`).

---

## 2. Current Git State

Kết quả kiểm tra trực tiếp bằng các lệnh read-only (`git --no-optional-locks ...`) tại thời điểm chạy Batch 1:

| Hạng mục Git Metadata | Giá trị xác minh thực tế | Trạng thái bằng chứng |
|---|---|---|
| **Current Branch** | `main` (`14` nhánh local tổng cộng: `main` + `5` nhánh `architecture/*` + `7` nhánh `design/*` + `1` nhánh `feature/*`) | `PROVEN` (`git branch -vv`) |
| **HEAD Commit** | `42a7ed2f229ac0d9a6630126d4da058e55acf50b` — `feat: Deploy DESIGN-001 Revision with real production data API` | `PROVEN` (`git rev-parse HEAD`) |
| **Upstream Tracking** | `origin/main` (`git@github.com:tuantudo/giatoctrantrongthu.git`) — **ahead 0, behind 0** so với ref local `origin/main` *(lưu ý: không chạy `git fetch` mạng trong chế độ read-only)* | `OBSERVED` / `PARTIAL` (local ref) |
| **Staged Changes (`index` vs `HEAD`)** | **`0` files** (`git diff --cached --name-status` rỗng) | `PROVEN` |
| **Unstaged Modified Tracked Files (` M`)** | **`21` files** (`1,233 insertions(+), 10,518 deletions(-)` tính gộp cùng `65` file ` D`) | `PROVEN` (`git diff --stat`) |
| **Unstaged Deleted Tracked Files (` D`)** | **`65` files** (xóa khỏi vị trí cũ trên working tree, chưa xóa khỏi Git index): **`62/65` file** đã được dời nguyên vẹn 100% SHA-256 sang vị trí untracked mới (`docs/archive/`, `scripts/archive/`, `archive/`); chỉ **`3/65` file** bị xóa thực sự trên đĩa (`.opencode/agents/data-reviewer.json`, `.opencode/agents/visual-reviewer.json`, `server/server.log` — cả 3 vẫn còn nguyên trong `HEAD`) | `PROVEN` (đối chiếu SHA-256 `git show HEAD:<path>`) |
| **Deleted in Index (`D `)** | **`0` files** | `PROVEN` |
| **Untracked Files (`??`, `-uall`)** | **`556` files** (bao gồm `2` đường dẫn chứa khoảng trắng: `assets/logoGiaToc_ ngang.svg` và `content/mach/thu-gui-clara/Thư gửi Clara - 008.md`) | `PROVEN` (`git status -z -uall`) |
| **Tổng dòng `git status --porcelain=v1 -uall`** | **`642` mục** (`21` ` M` + `65` ` D` + `556` `??`) | `PROVEN` |
| **Files Tracked trong Git Index (`git ls-files`)** | **`400` files** (`335` file đang hiện diện trên đĩa: `314` clean + `21` ` M`; `65` file đang vắng mặt tại đường dẫn cũ ` D`) | `PROVEN` |
| **Ignored Entries hiện diện trên đĩa (`!!`)** | **`29` mục khớp quy tắc ignore** (gồm 4 cây `node_modules/`, `GIADINHONGTHU.ged`, `server/family_archive.db`, `.env.local`, `server/.env`, `cookies_dev.txt`, `server.log`, `.vercel/`, `prototype/.vercel/`, 6 file `.playwright-mcp/*.log`, `archive/temp_outputs/server_8084.log`, 2 thư mục `__pycache__/`, 4 file `.DS_Store`, `chatbot-app/.env.example`, và 3 file `.opencode/{.gitignore,package.json,package-lock.json}`) | `PROVEN` (`git status --ignored=matching`) |
| **Submodule / Merge / Rebase / Stash State** | `.gitmodules`: **Không tồn tại** · `MERGE_HEAD` / `rebase-*` / `CHERRY_PICK_HEAD` / `BISECT_LOG`: **Không có** · `git stash list`: **Rỗng `(empty)`** | `PROVEN` |

### Danh sách đầy đủ `21` file Tracked đang bị sửa đổi chưa commit (` M`)

1. Cấu hình & Tài liệu gốc (`6` files): `.gitignore`, `AGENTS.md`, `README.md`, `package.json`, `vercel.json`, `index.html`.
2. Admin Control Room (`4` files): `admin/index.html`, `admin/css/admin.css`, `admin/js/admin.js`, `admin/js/api.js`.
3. Backend Express (`4` files): `server/.env.example`, `server/index.js`, `server/package.json`, `server/package-lock.json`.
4. Frontend & Core (`3` files): `src/js/core/lunar-engine.js`, `src/js/app-v2.js`, `src/css/prototype.css`.
5. Brand, Assets, Docs & Tooling (`4` files): `assets/images/logoGiaToc_ngang.svg`, `brand/README.md`, `docs/README.md`, `scripts/build_mach.py`.

---

## 3. Comparison With Previous Audit (`AUDIT/REPOSITORY_AUDIT.md`)

Đối chiếu độc lập từng số liệu và nhận định của `AUDIT/REPOSITORY_AUDIT.md` với thực tế trên đĩa hiện tại:

| Hạng mục đối chiếu | Báo cáo cũ (`REPOSITORY_AUDIT.md`) | Kết quả xác minh độc lập (Batch 1) | Đánh giá sai lệch & Ý nghĩa an toàn |
|---|---|---|---|
| **Tổng mục `git status -uall`** | `641` (`21 M`, `65 D`, `555 ??`) | **`642`** (`21 M`, `65 D`, **`556 ??`**) | `PROVEN`: Chênh lệch đúng `+1` file untracked là `AUDIT/REPOSITORY_AUDIT.md` được tạo ở cuối đợt trước. Không có biến động ngầm nào khác. |
| **Số script `.py`/`.js` lẻ ở Root** | Ghi `52` file (`15` PVCFC + `37` script vá lỗi một lần tại Mục 8.3 & 10.2) | **`55` file** (`15` PVCFC + **`40`** script dự án/agent) | `PROVEN`: Báo cáo cũ đếm sai tiêu đề Mục 8.3 (`37` thay vì `40`) và không tách riêng các script kiểm tra DB (`test_media_assoc.py`, `test_relationships.py`), script chứa mật khẩu test (`revert_pass.js`) và script sửa cấu hình máy host (`patch_global_mcp.js`, `patch_vscode_mcp.js`). |
| **Số file trong `scripts/`** | Ghi `9 files + 46 trong scripts/archive/` (Mục 2.4 & 7) | **`7` file cấp 1 + `47` file trong `scripts/archive/`** (+ `1` file `.pyc` bị ignore trong `scripts/__pycache__/`) | `PROVEN`: Cần dùng số liệu chuẩn `7 + 47` khi kiểm kê đối khớp trước/sau di chuyển. |
| **Trạng thái Git của `.opencode/package*.json`** | Liệt kê trong Mục 6.1 (`ACTIVE` / `KEEP`) như file cấu hình chuẩn có thể commit ngay | **Đang bị gitignore (`!!`)** bởi `.opencode/.gitignore` (dòng 2–3 chặn `package.json` và `package-lock.json`) | `PROVEN`: Nếu commit `.opencode/` mà không xử lý `.opencode/.gitignore`, repo sẽ mất khai báo dependency `@opencode-ai/plugin@1.18.34`. |
| **Phân loại `./~` (Garmin) & `15` script PVCFC** | Xếp vào `JUNK` → `DELETE` | **Đổi sang `BLOCKED` / `RELOCATE OUTSIDE REPO`** | `BLOCKED`: Dữ liệu sức khỏe cá nhân & script dự án ngoài chưa commit, không được xóa mù khi chưa kiểm chứng bản sao ngoài repo. |
| **Phân loại `40` root scripts** | Xếp toàn bộ vào `JUNK` → `DELETE` | **Đổi `39` file sang `ARCHIVE` (cách ly không thực thi), `1` file (`revert_pass.js`) cần xóa/ẩn mật khẩu** | `PROVEN`: Toàn bộ `40` file chỉ tồn tại trong working tree (`??`), xóa đi sẽ mất dấu vết lịch sử dựng UI vNEXT / Member Space. |
| **Phân loại `root node_modules/` (`puppeteer`)** | Đưa vào Mục 8.6 `JUNK Candidates` | **Đổi sang `ACTIVE (LOCAL QA)` / `BLOCKED` cho tới khi ghi `puppeteer` vào `package.json`** | `PROVEN`: Root hiện chưa có `devDependencies` lẫn `package-lock.json`; xóa ngay làm gãy `scripts/ui_vnext_qa.mjs`. |
| **Phân loại `prototype/assets/images/mach/issue-01/*`** | Đưa vào `JUNK` (`DELETE`) vì trùng SHA-256 | **Đổi sang `CONDITIONAL ARCHIVE / BLOCKED` chờ xác nhận Vercel project `"prototype"`** | `OBSERVED`: Cả 10 ảnh đều `tracked=True` trong Git và `prototype/.vercel/project.json` trỏ tới một project Vercel riêng tên `"prototype"`. |
| **Phương án Backup Pha 0 (Mục 13)** | Đề xuất nén `tar/zip` toàn bộ working tree (trừ `node_modules`) ra ngoài repo | **Đánh giá KHÔNG AN TOÀN nếu gom chung một gói** | `PROVEN`: Sẽ gom lẫn `.env.local`, `server/.env`, `cookies_dev.txt`, `GIADINHONGTHU.ged`, `family_archive.db` và dữ liệu Garmin vào bản nén không phân tầng bảo mật. |

---

## 4. Working Tree Preservation Assessment (Task B)

Phân rã chính xác toàn bộ **`556` file untracked (`??`)**, **`21` file modified (` M`)**, **`65` file deleted (` D`)**, và **`29` mục ignored (`!!`)** theo đúng 11 nhóm bảo toàn:

| Nhóm (Task B) | Tracked Modified (` M`) | Tracked Deleted (` D`) | Untracked (`??`) | Ignored trên đĩa (`!!`) | Nguy cơ mất dữ liệu nếu Cleanup sai |
|---|---:|---:|---:|---:|---|
| **1. Source code đang phát triển / Prototypes** | `6` (`admin/*` [4], `app-v2.js`, `prototype.css`) | `1` (`src/js/app.js` → đã có bản sao ở `archive/legacy_frontend/app.js`) | `36` (`admin/login.html`, `admin/js/login.js`, `src/js/member-app.js`, `chatbot-app/*` [30], `prototype/design-001-public/*` [3]) | `5` (`chatbot-app/node_modules/`, `chatbot-app/.env.example`, `prototype/.vercel/`, `design-playground/.DS_Store`) | **RẤT CAO** đối với `admin/login.html` & `admin/js/login.js` (chỉ có trên working tree, mất là hỏng trang đăng nhập Admin!). |
| **2. UI System vNEXT** | `2` (`index.html`, `src/js/core/lunar-engine.js`) | `0` | `29` (`src/css/foundation/*` [5], `src/js/ui/*` [24]) | `0` | **CỰC KỲ NGHIÊM TRỌNG (`CRITICAL`)**: 100% kiến trúc giao diện mới (`29` module CSS/JS) chưa hề tồn tại trong Git `HEAD`. |
| **3. Backend & Member Space** | `4` (`server/index.js`, `server/package*.json`, `server/.env.example`) | `1` (`server/server.log`) | `19` (`auth.js`, `foundation.js`, `member.js`, `member_*.html` [7], `db_reset.js`, `db_seed.js`, `dev_setup_onboarding.js`, `nas_migrate.js`, `verify_mvp.js`, `create_admin_user.js`, `setup_db.js`, `test_mariadb.js`, `README-admin.md`) | `3` (`server/node_modules/`, `server/.env`, `server.log`) | **CỰC KỲ NGHIÊM TRỌNG (`CRITICAL`)**: Toàn bộ hệ thống đăng nhập, phân quyền và 6 mặt phẳng Member Space chỉ đang nằm trên đĩa local. |
| **4. AIOS Governance / Config** | `3` (`.gitignore`, `AGENTS.md`, `package.json`, `vercel.json` tính ở mục 1/4) *(tổng 4 file root config/gov)* | `2` (`.opencode/agents/{data,visual}-reviewer.json` — đã thay bằng `.md`) | `19` (`.aios/*` [2], `.clinerules`, `opencode.jsonc`, `.opencode/agents/*.md` [9], `.opencode/skills/*/SKILL.md` [6] — *2 skill cũ đã tracked*) | `4` (`.opencode/node_modules/`, `.opencode/package.json`, `.opencode/package-lock.json`, `.opencode/.gitignore`) | **CAO**: Cả hợp đồng AIOS cứng lẫn cấu hình bảo mật `opencode.jsonc` đều chưa vào Git; riêng `.opencode/package*.json` đang bị tự ignore. |
| **5. Documentation & Brand Specs** | `3` (`README.md`, `docs/README.md`, `brand/README.md`) | `0` | `50` (`brand/01..05*.md`, `BRAND_GOVERNANCE_v0.1.md`, `docs/architecture/*` mới, `docs/database/*`, `docs/design/*`, `docs/security/*`, `docs/AGENT_OS.md`, `docs/SOURCE_MAP.md`...) | `2` (`docs/.DS_Store`, `docs/architecture/.DS_Store`) | **CAO**: Toàn bộ hiến chương thương hiệu (`brand/01..05`) và đặc tả DB/UI vNEXT mới chỉ nằm ở working tree. |
| **6. Historical Reports, Archives & Audits** | `0` | `46` (tài liệu cũ ở `docs/{architecture,design,infrastructure,missions,product}/` & SQL `database/migrations/*` — **100% đã có bản sao y hệt SHA-256 trong `docs/archive/` và `archive/legacy_database/`**) | `236` (`AUDIT/REPOSITORY_AUDIT.md` [1], 5 báo cáo khảo cổ root, `docs/archive/*` [120], `docs/audit/*` [85], `docs/research/*` [7], `docs/FINAL_REPORT_*.md` [4], `archive/*` [14]) | `1` (`archive/temp_outputs/server_8084.log`) | **TRUNG BÌNH – CAO**: `115` báo cáo audit/research mới trong `docs/audit/`, `docs/research/` và 5 báo cáo khảo cổ ở root chưa từng được commit vào Git. |
| **7. Assets, Media & Content** | `1` (`assets/images/logoGiaToc_ngang.svg`) | `0` | `6` (`assets/ASSET_MANIFEST.json`, `assets/images/mach/thu-gui-clara/008.jpg`, `content/mach/thu-gui-clara/Thư gửi Clara - 008.md`, và 3 file SVG đặt sai cấp `assets/logoGiaToc_*`) | `0` | **RẤT CAO** đối với **Thư gửi Clara số 008** (`Thư gửi Clara - 008.md` + `008.jpg`) và `assets/ASSET_MANIFEST.json` — đây là tác phẩm gia đình & manifest gốc chưa có trong Git! |
| **8. Database & Data Snapshots** | `0` | `0` | `10` (`data/mach.json` [20 bài], `server/data/{genealogy,mach,media,person_media}.json`, `server/calendars/*.ics` [4], `server/schema_update.sql`) | `1` (`server/family_archive.db` — 413 KB) | **RẤT CAO**: `server/family_archive.db` chứa dữ liệu đang chạy local; `server/data/*` và `server/calendars/*` là bộ hạt giống duy nhất cho backend hiện tại (bản ở root đã bị xóa từ commit `776b642`). |
| **9. Scripts & Tests** | `1` (`scripts/build_mach.py`) | `15` (`check_js.py`, `fix_html.py`... ở root — **100% đã có bản sao y hệt SHA-256 trong `scripts/archive/` và `archive/temp_outputs/patch_css.sh`**) | `94` (`15` script PVCFC + `40` root scripts + `33` file mới trong `scripts/archive/` + `4` script mới ở `scripts/` [`nas_audit.py`, `phase2_cartography.py`, `test_p01_onboarding.js`, `ui_vnext_qa.mjs`] + `2` file test không có — *2 file `tests/*.py` đã tracked*) | `3` (`node_modules/` root, `scripts/__pycache__/`, `tests/__pycache__/`) | **CAO** đối với `ui_vnext_qa.mjs`, `test_p01_onboarding.js` và `15` script PVCFC (chưa rõ bản lưu bên OneDrive). |
| **10. Personal / Sensitive Files** | `0` | `0` | `25` (`~/Desktop/Garmin_Forensic_Audit/HEALTH_DATA/raw/**` — 25 files `.fit`/`.BIN`/`.TXT`) | `4` (`.env.local`, `GIADINHONGTHU.ged`, `cookies_dev.txt`, `.vercel/`) | **NGHIÊM TRỌNG**: Dữ liệu sức khỏe cá nhân Garmin (`25` file) và phả hệ gốc `GIADINHONGTHU.ged` tuyệt đối không được xóa mù và cũng không được đẩy lên Git công khai/bản backup thiếu kiểm soát. |
| **11. Unclassified / Misc Artifacts** | `0` | `0` | `32` (`.playwright-mcp/*.{yml,png}` [27], `.tmp-cg/ref.png` [1], `shots/01-home.png` [1], `IDENTITY.md`, `SOUL.md`, `USER.md`) | `7` (`.DS_Store` root + 6 file `.playwright-mcp/console-*.log`) | **THẤP** (sau khi xác minh không có tài liệu nào tham chiếu). |
| **TỔNG ĐỐI KHỚP TOÀN REPO** | **`21`** *(gộp đúng 21 file ` M`)* | **`65`** | **`556`** | **`29` mục khớp ignore** | **Tổng `git status -uall` = `21 + 65 + 556 = 642` (Khớp 100%).** |

> *(Lưu ý đối khớp cột ` M`: `vercel.json` thuộc nhóm Cấu hình gốc cùng `.gitignore`, `AGENTS.md`, `package.json`, nên tổng số file ` M` trên toàn bảng là chính xác `21`: `6 [Nhóm 1: 4 admin + app-v2 + prototype.css] + 2 [Nhóm 2] + 4 [Nhóm 3] + 4 [Nhóm 4: .gitignore, AGENTS.md, package.json, vercel.json] + 3 [Nhóm 5] + 1 [Nhóm 7] + 1 [Nhóm 9] = 21`).*

### Trả lời trực diện 5 câu hỏi Bảo toàn (Task B)

1. **Những gì đang tồn tại CHỈ trong working tree/local disk mà CHƯA có trong Git `HEAD` (`42a7ed2`)?**
   - Toàn bộ `556` file untracked (`??`), phần nội dung sửa đổi mới của `21` file ` M`, và các file dữ liệu/môi trường đang gitignored (`server/family_archive.db`, `GIADINHONGTHU.ged`, `.env.local`, `server/.env`, `.opencode/package*.json`). Đáng chú ý nhất là: **toàn bộ UI System vNEXT (`29` file), Backend Auth/Member Space (`19` file), Admin Login (`2` file), AIOS Governance (`19` file), Brand Constitution (`7` file mới), Thư gửi Clara số 008 (`2` file), `ASSET_MANIFEST.json`, `data/mach.json` (bản 20 bài), `server/data/*.json` (4 file), `server/calendars/*.ics` (4 file), và >120 tài liệu thiết kế/kiểm toán mới**.
2. **Những gì đã bị xóa khỏi working tree (` D`) nhưng vẫn còn trong Git history?**
   - Toàn bộ `65` file ` D` đều còn nguyên vẹn 100% trong commit `HEAD` (`42a7ed2`). Hơn nữa, **`62/65` file** thực chất chưa hề mất trên đĩa mà đã nằm y hệt từng byte tại `docs/archive/`, `scripts/archive/`, `archive/legacy_database/`, `archive/legacy_frontend/app.js` và `archive/temp_outputs/patch_css.sh`. Chỉ `3` file bị xóa hẳn khỏi đĩa (`.opencode/agents/{data,visual}-reviewer.json` và `server/server.log`) và đều khôi phục tức thì được bằng `git show HEAD:<path>`.
3. **Những gì có nguy cơ mất vĩnh viễn nếu thực hiện cleanup thiếu kiểm soát?**
   - Bất kỳ thao tác xóa nhầm nào vào nhóm `556` file `??` hoặc `21` file ` M` trước khi tạo snapshot an toàn đều **không thể khôi phục bằng Git**. Nguy hiểm nhất là: (a) Xóa `./~` (mất dữ liệu sức khỏe Garmin cá nhân), (b) Xóa `15` script PVCFC (nếu chưa lưu bên OneDrive), (c) Chạy `git checkout -- .` hoặc `git reset --hard` hoặc `git clean -fd` (sẽ thổi bay toàn bộ UI vNEXT, Member Space, Clara 008 và AIOS Governance).
4. **Những nhóm chứa dữ liệu cá nhân, credentials, secrets hoặc thông tin riêng tư?**
   - Xem bảng chi tiết tại **Mục 5** ngay bên dưới (gồm 9 hạng mục từ mức `CRITICAL` đến `MEDIUM`).
5. **Những dữ liệu KHÔNG ĐƯỢC đưa vào bản backup thông thường hoặc commit lên Git?**
   - **Tuyệt đối không commit lên Git:** `.env.local`, `server/.env`, `cookies_dev.txt`, `GIADINHONGTHU.ged`, `server/family_archive.db`, `revert_pass.js` (chứa mật khẩu test), và `./~/Desktop/Garmin_Forensic_Audit/**`.
   - **Cần Tuấn quyết định chính sách riêng tư trước khi commit:** `server/data/genealogy.json` (`195 KB`, chứa thông tin 223 thành viên dòng họ — trước đây commit `776b642` từng gỡ JSON tĩnh khỏi root để chuyển vào DB, hiện `server/data/genealogy.json` đang ở trạng thái `??` không có `.gitignore` che chắn!) và `content/mach/thu-gui-clara/*.md` + `data/mach.json` (7 bài đầu đã nằm trong Git history, bài `008` đang `??`).

---

## 5. Sensitive Data Risk

*(Tuân thủ nguyên tắc bảo mật: Chỉ ghi nhận đường dẫn, kích thước, trạng thái Git và bản chất rủi ro — **tuyệt đối không đọc/in giá trị bí mật** ra báo cáo).*

| Đường dẫn | Kích thước | Trạng thái Git hiện tại | Loại dữ liệu nhạy cảm | Mức độ rủi ro & Phát hiện an toàn quan trọng |
|---|---:|---|---|---|
| `.env.local` | `1,383 B` | `IGNORED` (`!!`) | Biến môi trường / token kết nối local (Vercel/Cloud) | **CRITICAL** — Đã được `.gitignore` và `opencode.jsonc` chặn đọc, nhưng dễ bị gom nhầm nếu dùng lệnh `tar`/`cp` toàn thư mục để backup. |
| `server/.env` | `297 B` | `IGNORED` (`!!`) | Cấu hình DB credentials & `SESSION_SECRET` của Backend | **CRITICAL** — Đã được `.gitignore`, `opencode.jsonc`, và `SENSITIVE_PATH` của Express bảo vệ. Phải giữ nguyên tại chỗ, không đưa vào backup thường. |
| `cookies_dev.txt` | `131 B` | `IGNORED` (`!!`) | Cookie phiên đăng nhập local | **HIGH (`EXPOSED IN EXPRESS`)** — `PROVEN`: Trong `server/index.js` dòng 21, regex `SENSITIVE_PATH` chỉ chặn `cookie\.txt` (số ít), **KHÔNG chặn `cookies_dev.txt` (số nhiều)** khi `express.static('..')` chạy! |
| `revert_pass.js` | `1,128 B` | **UNTRACKED (`??`)** | Chứa chuỗi mật khẩu test dạng rõ của tài khoản `tuantq` gọi tới `/api/member/login` và `/api/member/change-password` | **HIGH (`UNIGNORED + EXPOSED IN EXPRESS`)** — `PROVEN`: Không nằm trong `.gitignore` (dễ bị commit nhầm) và không bị `SENSITIVE_PATH` của Express chặn khi phục vụ static từ `..`. |
| `.github/workflows/instant-sync.yml` | `638 B` | **TRACKED (`CLEAN`)** | Hardcoded fallback Google Apps Script Webhook URL (`https://script.google.com/macros/s/AKfycb...BMEEgA/exec`) | **HIGH (`ALREADY IN GIT`)** — `PROVEN`: Bất kỳ ai có quyền đọc repo đều thấy URL kích hoạt webhook đồng bộ lịch Google của gia đình. Cần chuyển hoàn toàn vào GitHub Actions Secret ở đợt sửa cấu hình. |
| `GIADINHONGTHU.ged` | `73,799 B` | `IGNORED` (`!!`) | Tập tin GEDCOM phả hệ gốc đầy đủ (ngày sinh, nơi sinh, quan hệ huyết thống cá nhân) | **CRITICAL (PII gốc)** — Đã được `.gitignore` (`*.ged`), `opencode.jsonc` và `SENSITIVE_PATH` bảo vệ. Không đọc nội dung, không xóa, không đưa vào Git. |
| `server/family_archive.db` | `413,696 B` | `IGNORED` (`!!`) | Cơ sở dữ liệu SQLite chứa 223 hồ sơ thành viên + bảng `admin_users` & `accounts` (password hashes) | **CRITICAL (DB + Auth Hashes)** — Đã được `.gitignore` và `SENSITIVE_PATH` bảo vệ. Phải giữ tách biệt khỏi các gói backup mã nguồn. |
| `~/Desktop/Garmin_Forensic_Audit/**` | `693,537 B` (25 files) | **UNTRACKED (`??`)** | Dữ liệu sinh trắc học, giấc ngủ (`Sleep/*.FIT`), vận động (`Activity/*.fit`), thiết bị cá nhân của Tuấn | **HIGH (`UNIGNORED + EXPOSED IN EXPRESS`)** — `PROVEN`: Chưa có trong `.gitignore` và **không bị `SENSITIVE_PATH` hay `dotfiles: 'deny'` chặn** trên Express (`/~/Desktop/...` tải được qua HTTP!). |
| `server/data/genealogy.json`, `data/mach.json`, `content/mach/thu-gui-clara/*` | `3.05 MiB` gộp | **UNTRACKED (`??`)** (riêng Clara 001–007 đã Tracked) | Dữ liệu 223 nhân vật dòng họ & 8 bức thư riêng tư gửi các con/cháu (`Thư gửi Clara`) | **HIGH (`PRIVACY BOUNDARY`)** — `PROVEN`: Dù UI vNEXT đã khóa `/me/tree` và `/me/clara` sau màn hình `/login`, middleware `express.static('..')` ở `server/index.js` dòng 28 vẫn cho phép truy cập thẳng `/data/mach.json` và `/content/mach/thu-gui-clara/...` không cần đăng nhập! Đồng thời `server/data/genealogy.json` đang `??` không có `.gitignore`. |
| `.playwright-mcp/*` & `archive/temp_outputs/tmp_renderHome_old.txt` | `1.08 MiB` | `27` file `??` + `6` file `.log` `!!` | Ảnh chụp và cây DOM trang web chứa tên thật thành viên dòng họ | **LOW–MEDIUM** — `TESTED`: Quét nội dung xác nhận **không chứa** mã `@I...@` hay `Set-Cookie`/`gt_session`, chỉ chứa tên hiển thị trên giao diện mẫu. |

---

## 6. Classification Review (Task C — Rà soát độc lập 17 nhóm trọng điểm)

Áp dụng nghiêm ngặt nguyên tắc: **Không xóa script chỉ vì là one-shot · Không xóa file chỉ vì thiếu import trực tiếp · Không xóa báo cáo lịch sử vì cũ · Không xóa dữ liệu cá nhân vì đặt nhầm chỗ · Không coi trùng SHA-256 hay `node_modules` mặc nhiên là rác.**

### 6.1. Nhóm 1 — 15 scripts liên quan dự án `MINI EXPO CÂY CÀ PHÊ`
- **Paths (`15` files ở root):** `add_dec006.py`, `create_m05.py`, `create_m08.py`, `edit_index.py`, `edit_m01.py`, `edit_m02.py`, `edit_m03.py`, `edit_m04.py`, `edit_m06.py`, `final_check.py`, `final_status.py`, `final_verify.py`, `fix_website.py`, `integrated_compiler.js`, `verify_all.py`.
- **Trạng thái đối chiếu với Audit cũ:** **PHẢN BÁC ĐỀ XUẤT `DELETE` TRỰC TIẾP** → Đổi từ `JUNK` sang **`BLOCKED` (Relocate Outside Repo to PVCFC Project / External Quarantine)**.
- **Evidence:** `PROVEN` (không thuộc `giatoctrantrongthu` — cả 15 file đều thao tác trên `/Users/tuantq/Library/CloudStorage/OneDrive-PVCFC/TEAM DESIGN/2026/MINI EXPO CAY CA PHE NAM 2026/...`, `0` tham chiếu từ codebase Gia Tộc) + `BLOCKED` (tất cả 15 file đều là `??` untracked, không có trong Git; sandbox không được phép đọc thư mục OneDrive ngoài workspace để xác minh Tuấn đã lưu bản sao các script này bên đó chưa).
- **Risk nếu Move / Delete:** Move ra ngoài repo: **`NONE`** đối với runtime Gia Tộc. Delete tại chỗ: **`HIGH` (nguy cơ mất trắng 15 script tự động hóa của dự án công việc năm 2026 nếu chưa có bản lưu khác)**.
- **Confidence:** `HIGH` · **Điều kiện phê duyệt:** Tuấn xác nhận di chuyển nguyên cụm 15 file sang thư mục dự án PVCFC ngoài repo (hoặc xác nhận đã có bản gốc và cho phép xóa).

### 6.2. Nhóm 2 — Thư mục `./~/Desktop/Garmin_Forensic_Audit/`
- **Path:** `~/Desktop/Garmin_Forensic_Audit/HEALTH_DATA/raw/**` (`25` files `.fit`, `.BIN`, `.BAK`, `.TXT`, `693,537 bytes`, nằm trong thư mục tên nghĩa đen `~` ngay tại root repo).
- **Trạng thái đối chiếu với Audit cũ:** **BÁC BỎ HOÀN TOÀN ĐỀ XUẤT `DELETE`** → Đổi từ `JUNK` sang **`BLOCKED` (Personal Health Data — Must Relocate Outside Repo, Forbidden to Delete)**.
- **Evidence:** `PROVEN` (sinh ra do lỗi không expand `~` thành `/Users/tuantq`, chứa dữ liệu giấc ngủ và vận động cá nhân giai đoạn `2024-03` – `2025-04`) + `BLOCKED` (cả 25 file đều `??` untracked; không thể kiểm tra `/Users/tuantq/Desktop/Garmin_Forensic_Audit` từ trong sandbox xem dữ liệu gốc còn tồn tại ngoài Desktop không).
- **Risk nếu Move / Delete:** Move ra ngoài repo: **`NONE`** đối với runtime Gia Tộc (thậm chí còn vá được rủi ro phơi bày qua `express.static`). Delete tại chỗ: **`CRITICAL` (nguy cơ mất vĩnh viễn dữ liệu sức khỏe cá nhân không thể tái tạo)**.
- **Confidence:** `HIGH` · **Điều kiện phê duyệt:** Tuấn tự dời hoặc phê duyệt lệnh dời nguyên vẹn thư mục `./~` ra ngoài repo (kèm kiểm tra đối chiếu SHA-256 trước khi gỡ thư mục rỗng `./~`).

### 6.3. Nhóm 3 — "37" (thực tế là `40`) one-shot patch/fix & diagnostic scripts ở Root
- **Paths (`40` files ở root, tất cả đều `??` untracked):**
  - *35 script sửa/vá trực tiếp mã nguồn project:* `enforce_gate.js`, `fix_footer.js`, `fix_member.js`, `patch_admin_js.js`, `patch_agents.js`, `patch_api_fetch.js`, `patch_app.js`, `patch_comments.py`, `patch_components.js`, `patch_components_v0.8.js`, `patch_contract.js`, `patch_css_v02.js`, `patch_db_route.js`, `patch_dom.js`, `patch_footer.js`, `patch_footer_v0.8.js`, `patch_login.js`, `patch_logout.js`, `patch_public_css.js`, `patch_public_home.js`, `patch_public_home_content.js`, `patch_public_home_v02.js`, `patch_shell.js`, `patch_shell_footer.js`, `patch_shell_nav.js`, `patch_states.js`, `patch_threshold.py`, `patch_tokens.js`, `patch_v06.js`, `patch_v0_3_research_impl.js`, `remove_threshold.js`, `restore_hero.js`, `update_public_home.js`, `update_report.py`, `create_grammar_audit.py`.
  - *2 script sửa cấu hình MCP ngoài repo trên máy Tuấn:* `patch_global_mcp.js`, `patch_vscode_mcp.js`.
  - *2 script truy vấn kiểm tra SQLite:* `test_media_assoc.py`, `test_relationships.py`.
  - *1 script test đổi mật khẩu có chứa credential dev dạng rõ:* `revert_pass.js`.
- **Trạng thái đối chiếu với Audit cũ:** **ĐIỀU CHỈNH TRỌNG YẾU** — Sửa số lượng từ `37` thành **`40`**; đổi phân loại của `39/40` file từ `JUNK` (`DELETE`) sang **`ARCHIVE` (`archive/scripts/root-session-patches/`)**; riêng `revert_pass.js` xếp **`BLOCKED` (Credential Hygiene Required)**.
- **Evidence:** `PROVEN` (0 file nào được import bởi runtime, HTML, `package.json` hay CI; tuy nhiên cả `40` file đều `??` chưa từng vào Git, ghi lại lịch sử tiến hóa các bản vá của UI vNEXT/Member Space, và 2 file `test_*.py` là công cụ chẩn đoán dữ liệu).
- **Risk nếu Move / Delete:** Move vào `archive/scripts/` (nơi đã nằm trong `SENSITIVE_PATH` của Express!): **`NONE`** với runtime, đồng thời giúp chặn truy cập HTTP qua `express.static` và tránh chạy nhầm ở root. Delete ngay lúc này: **`MEDIUM` (mất hoàn toàn lịch sử provenance của đợt code chưa commit vì không thể khôi phục từ Git)**.
- **Confidence:** `HIGH` · **Điều kiện phê duyệt:** Phê duyệt dời 39 file vào `archive/scripts/root-session-patches/` và Tuấn quyết định xóa hoặc che mật khẩu trong `revert_pass.js`.

### 6.4. Nhóm 4 — `.playwright-mcp/`, `.tmp-cg/`, `shots/`
- **Paths:** `.playwright-mcp/` (`27` file `.yml`/`.png` `??` + `6` file `.log` `!!`, `1.05 MiB`), `.tmp-cg/ref.png` (`852 KB`, `??`), `shots/01-home.png` (`35 KB`, `??`).
- **Trạng thái đối chiếu với Audit cũ:** **ĐỒNG THUẬN `JUNK` (`DELETE`) đối với `.playwright-mcp/`**, nhưng hạ `.tmp-cg/ref.png` và `shots/01-home.png` xuống **`ARCHIVE` hoặc `JUNK` có xác nhận của Tuấn** (nếu Tuấn muốn giữ ảnh tham chiếu thiết kế `ref.png`). Tuy nhiên xét thuần kỹ thuật, cả 3 đều không có bất kỳ liên kết nào trong toàn bộ mã nguồn và tài liệu (`0` reference hits — `PROVEN`).
- **Evidence:** `PROVEN` (`0` tham chiếu trong toàn bộ `.md`, `.html`, `.js`, `.css`, `.json`; `.playwright-mcp/` mang dấu thời gian phiên debug tự động `2026-10-04T13:45Z`–`16:22Z`).
- **Risk nếu Move / Delete:** Runtime risk = **`NONE`**. Không khôi phục được từ Git (`??`), nhưng `.playwright-mcp/` thuần túy là dump phiên trình duyệt tự động. Riêng `.tmp-cg/ref.png` (`852 KB`) cần xác nhận không phải ảnh mẫu thiết kế Tuấn tự đặt vào.
- **Confidence:** `.playwright-mcp/` & `shots/01-home.png`: `HIGH` (`JUNK`); `.tmp-cg/ref.png`: `MEDIUM` (`UNKNOWN` nguồn gốc người tạo — hỏi Tuấn trước khi xóa).

### 6.5. Nhóm 5 — `chatbot-app/` và 4 thư mục `node_modules/`
- **Paths & Phân loại chi tiết từng cây:**
  1. `chatbot-app/` (31 file mã nguồn/config, `??` untracked, trong đó `chatbot-app/.env.example` bị `.gitignore` chặn): **`ARCHIVE`** (`PROVEN` — prototype Next.js 16 độc lập, `route.ts` chỉ stream chuỗi văn bản tĩnh gán cứng, `0` kết nối tới Express hay DB thật).
  2. `chatbot-app/node_modules/` (~30,649 files, `456.47 MiB`, `!!` gitignored): **`JUNK` (Re-creatable Artifact — Safe `DELETE`)** (`PROVEN` — `chatbot-app/package.json` và `chatbot-app/package-lock.json` `651 KB` đều hiện diện đầy đủ, tái tạo được 100% bằng `npm ci` bất cứ lúc nào). *(Ghi chú đính chính: `chatbot-app/.next` KHÔNG tồn tại trên đĩa).*
  3. `server/node_modules/` (~2,199 files, `21.40 MiB`, `!!` gitignored): **`ACTIVE` (`KEEP`)** (`PROVEN` — runtime dependency trực tiếp của `npm run dev` / `server/index.js`).
  4. `.opencode/node_modules/` (~3,651 files, `52.34 MiB`, `!!` gitignored): **`ACTIVE` (`KEEP`)** (`CONFIGURED` / `OBSERVED` — phục vụ `@opencode-ai/plugin@1.18.34` cho môi trường agent OpenCode; đặc biệt phải giữ vì `.opencode/package.json` đang bị `.opencode/.gitignore` chặn!).
  5. `node_modules/` ở root: Xem chi tiết tại Nhóm 6 ngay dưới đây (**KHÔNG ĐƯỢC XÓA NGAY**).
- **Risk nếu Move / Delete:** Dời `chatbot-app/` (31 file code) vào `archive/prototypes/chatbot-app/` và xóa `chatbot-app/node_modules/` có rủi ro runtime = **`NONE`**, nhưng do cả 31 file code đều `??` untracked nên **chỉ xóa `chatbot-app/node_modules/`**, tuyệt đối giữ nguyên 31 file mã nguồn + `package-lock.json` (và lưu ý cứu `chatbot-app/.env.example` khỏi quy tắc `.env*` nếu muốn track bản archive).

### 6.6. Nhóm 6 — `root node_modules/` và `puppeteer`
- **Path:** `node_modules/` tại root (`25` packages cấp 1, `2,268` files, `23.29 MiB`, `!!` gitignored; gói chính: `puppeteer@25.10.0`, `puppeteer-core@25.10.0`, `@puppeteer/browsers@3.2.2`, `chromium-bidi@17.0.2`, `ws@8.21.3`).
- **Trạng thái đối chiếu với Audit cũ:** **PHẢN BÁC XẾP VÀO `JUNK` Ở THỜI ĐIỂM HIỆN TẠI** → Đổi sang **`ACTIVE (QA Dependency)` / `BLOCKED` (Forbidden to Delete Until Declared in `package.json`)**.
- **Evidence:** `PROVEN` — `scripts/ui_vnext_qa.mjs` import trực tiếp `puppeteer` từ `node_modules/` gốc, nhưng `package.json` gốc hiện **không có trường `dependencies` hay `devDependencies`** và **không có `package-lock.json`**.
- **Risk nếu Delete ngay:** **`HIGH` đối với quy trình Visual QA** — Xóa `node_modules/` lúc này làm hỏng `scripts/ui_vnext_qa.mjs` và mất phiên bản chính xác `puppeteer@25.10.0` đang tương thích trên máy.
- **Điều kiện phê duyệt:** Giữ nguyên `node_modules/`; chỉ dọn/cài lại ở pha chỉnh sửa config sau khi đã ghi `"puppeteer": "^25.10.0"` vào `devDependencies` của `package.json`.

### 6.7. Nhóm 7 — `prototype/` và `design-playground/`
- **Paths:**
  - `prototype/` (`17` files: `12` file đã tracked trong Git gồm `prototype/index.html`, `.gitignore`, và `10` ảnh MẠCH; `3` file `??` trong `prototype/design-001-public/`; `2` file `!!` trong `prototype/.vercel/` với `projectName: "prototype"`).
  - `design-playground/` (`10` files: `9` file đã tracked trong Git gồm `index.html`, `css/prototype.css`, `js/{prototype,prototype-data,router,system}.js`, `data/genealogy-snapshot.json`, `assets/logoGiaToc*.svg`; `1` file `.DS_Store` `!!`).
- **Trạng thái đối chiếu với Audit cũ:** **`ARCHIVE` CÓ ĐIỀU KIỆN (`BLOCKED BY GOVERNANCE & VERCEL CHECK`)**.
- **Evidence:** `OBSERVED` / `CONFIGURED`:
  1. Không được mount vào runtime chính (`index.html`, `server/index.js`, `admin/`), nhưng `index.html` dòng 15 có comment dẫn chiếu `prototype/design-001-public/`.
  2. `design-playground/` đang được khai báo cứng là `execution_surfaces` của `Cline` trong **`.aios/PROJECT_CONTRACT.json`** và **`.clinerules`** (`CONFIGURED` — thuộc **Human Gate** bắt buộc của Tuấn!).
  3. `prototype/.vercel/project.json` cho thấy `prototype/` từng được liên kết với một project Vercel riêng tên `"prototype"` (`OBSERVED`; trạng thái còn chạy online hay đã xóa trên Vercel là `UNKNOWN`).
  4. `prototype/design-001-public/index.html` tham chiếu đường dẫn tương đối gốc `src/css/prototype.css` và `src/js/app-v2.js` nên tự bản thân thư mục đó không tự chạy độc lập nếu thiếu `src/`.
- **Risk nếu Move / Delete:** Move `design-playground/` mà chưa sửa `PROJECT_CONTRACT.json` + `.clinerules` sẽ làm lệch hợp đồng phân quyền AIOS (**`MEDIUM–HIGH` governance risk**). Xóa `prototype/assets/images/mach/issue-01/` khi Vercel project `"prototype"` còn dùng sẽ làm vỡ ảnh trang demo đó.
- **Confidence:** `HIGH` · **Điều kiện phê duyệt:** Tuấn phê duyệt Human Gate cập nhật `PROJECT_CONTRACT.json` + `.clinerules` và xác nhận project Vercel `"prototype"` còn dùng hay không trước khi gom cả hai vào `archive/prototypes/`.

### 6.8. Nhóm 8 — Các thế hệ Frontend cũ (`app.js`, `app-v2.js`, `prototype.css`, `main.css`, `member-app.js`, `member_baseline.html`)
- **Phân tích từng thành phần (`PROVEN` / `OBSERVED`):**
  1. `src/js/app.js`: Đã ` D` khỏi `src/js/` và nằm nguyên vẹn 100% SHA-256 tại `archive/legacy_frontend/app.js` (`??`), đồng thời còn trong `HEAD` → **`ARCHIVE` (Đã dời xong trên đĩa, chờ commit)**.
  2. `server/member_baseline.html` (`91 KB`, `??`) & `src/js/member-app.js` (`134 KB`, `??`): Cặp HTML/JS của Member SPA cũ; `server/member.js` không còn route nào gọi `member_baseline.html`, và UI vNEXT không import `member-app.js`. **CẢNH BÁO BẢO TOÀN:** Cả 2 file đều là **`??` untracked (chưa từng vào Git!)**, nên **TUYỆT ĐỐI KHÔNG XÓA**, chỉ dời bảo toàn sang **`ARCHIVE` (`archive/legacy-v1-spa/`)**.
  3. `src/css/main.css` (`138 KB`, `TRACKED CLEAN`): Không còn HTML active nào nạp (`index.html`, `admin/*.html`, 6 file `server/member_*.html` đều không nạp; `server/member_tree.html` chỉ nhắc tên trong comment HTML). Tuy nhiên `brand/manifest.json` và `docs/SOURCE_MAP.md` vẫn còn ghi chú lịch sử tới `src/css/main.css` → **`ARCHIVE` (`archive/legacy-v1-spa/main.css`)**.
  4. `src/js/app-v2.js` (`13 KB`, **` M` modified**) & `src/css/prototype.css` (`16 KB`, **` M` modified**): **ĐÍNH CHÍNH QUAN TRỌNG SO VỚI AUDIT CŨ!** Báo cáo cũ đề xuất xóa 2 file này ở `src/` vì đã có bản trùng SHA-256 ở `prototype/design-001-public/`. Thực tế: (a) cả hai đang mang thay đổi chưa commit (` M`), (b) nhánh production hiện tại trên `origin/main` (`42a7ed2`) vẫn đang chạy giao diện này, và (c) `prototype/design-001-public/index.html` nhúng `<script src="src/js/app-v2.js">` và `<link href="src/css/prototype.css">`! Do đó xếp **`ARCHIVE — BLOCKED UNTIL vNEXT DEPLOY & HTML REWRITE`** (giữ yên hoặc chỉ dời đồng bộ khi sửa đường dẫn trong `prototype/design-001-public/index.html` trên nhánh staging riêng).

### 6.9. Nhóm 9 — `admin/js/mockData.js`
- **Path:** `admin/js/mockData.js` (`2,045 B`, `TRACKED CLEAN`).
- **Evidence:** `PROVEN` — Chứa dữ liệu giả lập 4 nhân vật mẫu (`p1`..`p4`) lưu `localStorage`; quét toàn bộ `admin/*.html`, `admin/js/*.js` và toàn repo xác nhận **`0` lệnh `import` tĩnh hay động** (chỉ được nhắc tên trong tài liệu `PROJECT_ROADMAP.md` và `OWNER_DECISION_BRIEF.md`). Đã có trong Git `HEAD`.
- **Classification:** **`ARCHIVE`** (`archive/legacy-admin/mockData.js`). Move risk: **`NONE`**. Delete risk: **`LOW`** (khôi phục được từ Git, nhưng chuyển vào `archive/` đúng chuẩn hơn xóa).

### 6.10. Nhóm 10 — `server/create_schema.js` và `server/setup_db.js`
- **Paths:**
  - `server/create_schema.js` (`1,215 B`, `TRACKED CLEAN`): Tạo bảng cũ `events` & `images` trên MySQL với đường dẫn mẫu cứng `/volume1/web/web_images/family.jpg`. `0` tham chiếu từ `package.json`, `server/*.js`, hay CI (`PROVEN`).
  - `server/setup_db.js` (`1,278 B`, **`??` UNTRACKED**): Tạo bảng SQLite rút gọn (`authors` và `series` chỉ có cột `id`), bị thay thế hoàn toàn bởi `server/db_reset.js` (`npm run db:reset`). Chỉ được nhắc trong `docs/audit/REPORT_LOCAL_DB_RUNTIME.md` (`PROVEN`).
- **Classification:** **`ARCHIVE`** (`archive/legacy-database/`).
- **Risk nếu Move / Delete:** Move risk = **`NONE`** (thậm chí giảm rủi ro dev chạy nhầm `setup_db.js` làm lệch schema SQLite). lưu ý `setup_db.js` là `??` untracked nên **chỉ Move vào `archive/`, không Delete**.

### 6.11. Nhóm 11 — Các Historical Reports (ở Root & trong `docs/`)
- **Paths & Hiện trạng Git chính xác (`OBSERVED` / `PROVEN`):**
  - *6 file ở Root đã Tracked (`CLEAN`):* `DOCUMENTATION_AUDIT.md`, `FINAL_REPORT.md`, `PROJECT_ARCHITECTURE.md`, `PROJECT_DECISIONS.md`, `PROJECT_ROADMAP.md`, `PROJECT_STATE.md`.
  - *5 file ở Root đang Untracked (`??`):* `ARCHITECTURE_CONFLICTS.md`, `CURRENT_SCHEMA_MAP.md`, `GIATOC_ARCHAEOLOGY_EVIDENCE_INDEX.md`, `GIATOC_DATA_ARCHAEOLOGY.md`, `MEDIA_DEPENDENCY_MAP.md`.
  - *Trong `docs/`:* `docs/FINAL_REPORT_*.md` (3 files `??`), `docs/REPORT_LOGIN_FIX.md` (`??`), `docs/audit/**` (85 files `??`), `docs/research/**` (7 files `??`), `docs/archive/**` (120 files `??` — gồm 44 file dời từ `docs/` cũ).
- **Kiểm tra tham chiếu chéo (`PROVEN`):**
  - `docs/HELP.md` hiện đang liên kết trực tiếp tới các đường dẫn ở root: `PROJECT_DECISIONS.md`, `PROJECT_ARCHITECTURE.md`, `PROJECT_STATE.md`, `CURRENT_SCHEMA_MAP.md`, `GIATOC_DATA_ARCHAEOLOGY.md`, `ARCHITECTURE_CONFLICTS.md`!
  - Đặc biệt, **`PROJECT_DECISIONS.md`** chứa sổ quyết định kiến trúc của Tuấn (`D01`–`D09`) vẫn đang có hiệu lực quản trị cao nhất; **`docs/audit/GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md`** và **`docs/audit/GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md`** là hai văn bản hợp nhất kiến trúc gần nhất.
- **Classification:**
  - `PROJECT_DECISIONS.md` + 2 file Consolidation Audit: **`ACTIVE` (`KEEP` cho tới khi nội dung được tích hợp nguyên vẹn vào `ARCHITECTURE.md` chuẩn)**.
  - 10 báo cáo lịch sử còn lại ở root + các `REPORT_*.md` / `FINAL_REPORT_*.md`: **`ARCHIVE` (`docs/archive/`)**, **NHƯNG chỉ được Move đồng thời với bước cập nhật liên kết trong `docs/HELP.md`** để không tạo thêm broken links, và **tuyệt đối không Delete** (vì phần lớn đang `??` chưa vào Git!).

### 6.12. Nhóm 12 — Các Duplicate Assets (18 nhóm trùng SHA-256 trên toàn Workspace)
Áp dụng nguyên tắc **không xóa chỉ vì trùng SHA-256**, kiểm tra từng cụm cho kết quả phân tách rõ rệt (`PROVEN`):
1. **Cụm PHẢI GIỮ (`ACTIVE` — trùng SHA-256 nhưng khác vai trò ngữ nghĩa / đường dẫn runtime):**
   - `assets/images/logoGiaToc.svg` ↔ `assets/images/logoGiaToc_favicon.svg` (`1,312 B`, cùng SHA `9dbb03c39b0f19b3`): **CẢ HAI ĐỀU ĐANG ĐƯỢC SỬ DỤNG!** `ASSET_MANIFEST.json` khai báo cả hai (`brand.logoIcon` và `brand.favicon`), còn `admin/index.html` & `admin/login.html` nạp trực tiếp `/assets/images/logoGiaToc_favicon.svg`. **Cấm xóa!**
   - `design-playground/assets/logoGiaToc.svg` & `design-playground/assets/logoGiaToc_ngang.svg`: Đang được `design-playground/index.html` nạp trực tiếp bằng đường dẫn tương đối `assets/logoGiaToc*.svg`. **Giữ đi kèm `design-playground/`!**
   - `docs/audit/evidence/inner_site_v0.1/_me_1440.png` ↔ `_me_change-password_1440.png`: Minh chứng kiểm thử hai URL khác nhau cùng redirect về màn hình đổi mật khẩu lần đầu. **Giữ nguyên làm bằng chứng audit!**
2. **Cụm CHỜ XÁC NHẬN (`BLOCKED` / `CONDITIONAL`):**
   - `prototype/assets/images/mach/issue-01/*` (`10` files, `18.07 MiB`, `TRACKED CLEAN`): Xem Nhóm 7 — chỉ xóa/gỡ sau khi Tuấn xác nhận Vercel project `"prototype"` không còn chạy độc lập (lúc đó `prototype/index.html` vốn đã dùng `../assets/images/mach/issue-01/Mo-to-ho-Tran.jpg`).
   - `src/js/app-v2.js` & `src/css/prototype.css` ↔ `prototype/design-001-public/*`: Xem Nhóm 8 — đang ` M` và đang được `prototype/design-001-public/index.html` gọi tới.
3. **Cụm ĐỦ BẰNG CHỨNG ĐỀ XUẤT `JUNK` (`DELETE` an toàn):**
   - **3 file SVG đặt nhầm ở `assets/` (ngoài `assets/images/`), tất cả đều `??` untracked và `0` tham chiếu thực tế:**
     - `assets/logoGiaToc_ ngang.svg` (`26,518 B`, lỗi dư khoảng trắng trong tên file, `0` tham chiếu toàn repo, trùng 100% với `assets/images/logoGiaToc_ngang.svg`).
     - `assets/logoGiaToc_icon.svg` (`1,312 B`, `0` tham chiếu toàn repo, trùng 100% với `assets/images/logoGiaToc.svg`).
     - `assets/logoGiaToc_original.svg` (`28,160 B`, trùng 100% với `assets/images/logoGiaToc_original.svg`; toàn bộ 13 tham chiếu trong repo và `ASSET_MANIFEST.json` đều gọi `/assets/images/logoGiaToc_original.svg`, `0` nơi nào gọi `/assets/logoGiaToc_original.svg`).

### 6.13. Nhóm 13 — `GIADINHONGTHU.ged`
- **Path:** `GIADINHONGTHU.ged` tại root (`73,799 B`, `IGNORED` `!!`; lưu ý `archive/legacy_gedcom/GIADINHONGTHU.ged` **không tồn tại** trên đĩa).
- **Evidence:** `OBSERVED` + `CONFIGURED` (`.gitignore` chặn `*.ged`, `opencode.jsonc` chặn đọc/sửa, `generator/export_genealogy_json.py` & `generate_calendar_feeds.py` hỗ trợ nạp file GEDCOM nguồn) + `UNKNOWN` (chưa rõ đây là bản GEDCOM chuẩn mới nhất của Tuấn hay bản trên OneDrive mới hơn).
- **Classification:** **`UNKNOWN` / `ACTIVE PRIVATE SOURCE` (`KEEP IN PLACE — DO NOT DELETE, DO NOT COMMIT, DO NOT READ`)**.

### 6.14. Nhóm 14 — `.github/workflows/instant-sync.yml`
- **Path:** `.github/workflows/instant-sync.yml` (`638 B`, `TRACKED CLEAN`).
- **Evidence:** `CONFIGURED` + `OBSERVED` — Trigger khi push nhánh `main` có thay đổi `calendars/**` (thư mục `calendars/` ở root hiện đã bị dời sang `server/calendars/` từ commit `776b642`, nên workflow hiện nằm im không kích hoạt), đồng thời chứa URL Google Apps Script `/exec` gán cứng trong file. Trạng thái Google Calendar của dòng họ còn dùng webhook này hay không là `UNKNOWN`.
- **Classification:** **`UNKNOWN` (`KEEP` nguyên trạng cho tới khi Tuấn xác nhận tắt hẳn hay cập nhật sang `server/calendars/**` + chuyển URL vào GitHub Secret)**.

### 6.15. Nhóm 15 — `.nojekyll`
- **Path:** `.nojekyll` (`0 B`, `TRACKED CLEAN`).
- **Evidence:** `OBSERVED` (`0` tham chiếu trong repo; cờ chuẩn của GitHub Pages ngăn Jekyll bỏ qua thư mục bắt đầu bằng `_`) + `UNKNOWN` (GitHub Pages có còn được bật song song với Vercel để phục vụ feed `.ics` cho `instant-sync.yml` hay không là `UNKNOWN` từ local).
- **Classification:** **`UNKNOWN` (`KEEP` — file 0 byte hoàn toàn vô hại, không xóa khi chưa xác minh trạng thái GitHub Pages trên repo GitHub)**.

### 6.16. Nhóm 16 — `scripts/rebuild_mach_issue01.py`
- **Path:** `scripts/rebuild_mach_issue01.py` (`11,955 B`, `TRACKED CLEAN`).
- **Evidence:** `OBSERVED` (`ISSUE_01_DIR = "/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS/ISSUE_01/CANONICAL"`, đồng bộ bài viết từ kho Obsidian của Tuấn sang `content/mach/` và `data/mach.json`) + `UNKNOWN` (sandbox không kiểm tra được kho Obsidian ngoài workspace và chưa rõ Tuấn còn đồng bộ một chiều từ Obsidian sang repo hay đã biên tập trực tiếp trong `content/mach/`).
- **Classification:** **`UNKNOWN` / `POTENTIAL ACTIVE AUTHORING TOOL` (`KEEP` trong `scripts/`)**.

### 6.17. Nhóm 17 — Các file ảnh `007.png` và `007.jpg` (kèm `008.jpg`)
- **Paths trong `assets/images/mach/thu-gui-clara/`:**
  - `007.png` (`23,600,903 B` / `22.51 MiB`, `PNG 5616x3744`, `TRACKED CLEAN`).
  - `007.jpg` (`6,151,277 B` / `5.87 MiB`, `JPEG 5616x3744`, `TRACKED CLEAN`).
  - `008.jpg` (`823,119 B`, `JPEG 1024x1024`, **`??` UNTRACKED**).
- **Evidence:** `PROVEN` / `PARTIAL`:
  1. `007.png` là **`ACTIVE` (`PROVEN`)**: Được nhúng trực tiếp trong `content/mach/thu-gui-clara/Thư gửi Clara, Rina, Tina, Tin và Tito - 007.md` (`![](Images/007.png)`), khai báo cứng trong `scripts/build_mach.py`, `data/mach.json` và `server/data/mach.json`. Xóa hoặc đổi tên `007.png` ngay lập tức làm vỡ ảnh bài Clara số 007 và làm fail trình biên dịch `scripts/build_mach.py`!
  2. `008.jpg` là **`ACTIVE UNCOMMITTED` (`PROVEN`)**: Ảnh minh họa cho bài mới `Thư gửi Clara - 008.md` (`??`) và đã được biên dịch vào `data/mach.json` (bài thứ 20). **Tuyệt đối phải giữ và đưa vào diện bảo toàn ưu tiên!**
  3. `007.jpg` có cùng kích thước điểm ảnh gốc máy ảnh DSLR `5616x3744` với `007.png`, đã tracked trong Git, chỉ được nhắc thoáng qua trong báo cáo cũ `docs/ux/MACH_01_IMPLEMENTATION_REPORT.md` và không được gọi bởi bất kỳ file Markdown/JSON/code active nào. Tuy nhiên, nếu chưa so sánh thị giác trực tiếp hai bức ảnh thì không kết luận mù quáng rằng `007.jpg` không phải một khung hình tư liệu khác cùng buổi chụp (`PARTIAL`).
- **Classification:** `007.png` & `008.jpg` → **`ACTIVE` (`KEEP`)**; `007.jpg` → **`UNKNOWN` (`KEEP` chờ Tuấn đối chiếu bằng mắt trên VS Code xem có trùng nội dung ảnh với `007.png` không)**.

---

## 7. Runtime & Dependency Risk (Task D)

Kiểm tra toàn diện chuỗi phụ thuộc tĩnh/động (`import`, `<script>`, `<link>`, CSS `@import`/`url()`, Express `sendFile`/`static`/routes, `vercel.json`, `package.json`, GitHub Actions) trên các bề mặt đang hoạt động (`TESTED = NO` cho full server boot để đảm bảo 0 side-effect trên SQLite/session; `PROVEN` bằng phân tích tĩnh mã nguồn + AST/syntax check):

### 7.1. Các đường dẫn nhạy cảm ĐANG ĐƯỢC SỬ DỤNG TRỰC TIẾP (Cấm di chuyển hoặc đổi tên trong đợt Cleanup vật lý)

| Bề mặt Runtime / Tooling | Đường dẫn phụ thuộc bắt buộc phải giữ nguyên | Hậu quả nếu di chuyển / xóa |
|---|---|---|
| `index.html` (Public Gate) | `/src/css/foundation/foundation.css`, `/src/js/ui/boot-public.js`, `/assets/ASSET_MANIFEST.json`, `/assets/images/logoGiaToc*.svg`, route `/login` | Trắng trang chủ công khai hoặc mất nhận diện thương hiệu. |
| `src/css/foundation/foundation.css` | `./tokens.css`, `./layout.css`, `./components.css`, `./states.css` | Vỡ toàn bộ bố cục & kiểu chữ trên cả Public lẫn Member Space. |
| `src/js/ui/*` (24 ES Modules) | Toàn bộ 24 file trong `src/js/ui/` + các endpoint `/api/member/profile`, `/api/genealogy.json`, `/api/media.json`, `/api/person_media.json`, `/api/mach.json` | Lỗi `ERR_ABORTED 404` ES Module trên trình duyệt (vì không dùng bundler nên đường dẫn file chính là URL runtime!). |
| `server/index.js` & `server/member.js` | `./auth`, `./foundation`, `./member`, `server/member_{dashboard,tree,person,mach,clara,spaces}.html`, `server/family_archive.db`, `..` (static root) | Crash tiến trình Node Express lúc khởi động hoặc lỗi 500/404 khi vào `/me/*`. |
| `server/db_reset.js`, `db_seed.js`, `nas_migrate.js` | `server/data/{genealogy,mach,media,person_media}.json`, `server/calendars/CAL_01..04*.ics`, `server/schema_update.sql` | Hỏng lệnh `npm run db:reset`, `npm run db:seed` và script nạp DB. |
| `admin/index.html` & `admin/login.html` | `/assets/images/logoGiaToc_favicon.svg`, `/admin/css/admin.css`, `/admin/js/{admin,login,api}.js` | Hỏng giao diện quản trị hoặc mất trang đăng nhập Admin. |
| `scripts/build_mach.py` & `tests/*` | `content/mach/issue-01/*.md`, `content/mach/thu-gui-clara/*.md`, `assets/images/mach/**`, `data/mach.json` | Hỏng trình biên dịch MẠCH và bộ kiểm thử Markdown. |
| `scripts/ui_vnext_qa.mjs` | `node_modules/puppeteer` (ở root), `docs/audit/evidence/ui_vnext/` | Không chạy được kiểm thử giao diện tự động (`ERR_MODULE_NOT_FOUND: puppeteer`). |

### 7.2. Cảnh báo Tương tác Chéo khi Move/Delete các Candidate `ARCHIVE` & `JUNK`

1. **Rủi ro Deploy Production (`index.html` + `vercel.json` vs `server/member.js`) — `PROVEN`:**
   - Trên `origin/main` (`42a7ed2`), Vercel đang phục vụ trang tĩnh cũ (`app-v2.js`). Bản `index.html` mới trên working tree chuyển nút hành động chính sang `/login` (do `server/member.js` xử lý), nhưng `vercel.json` chưa có cấu hình `rewrites` sang `https://api.giatoctrantrongthu.com`. **Mọi commit chuẩn hóa cấu trúc có chứa `index.html` mới BẮT BUỘC phải nằm trên nhánh riêng, tuyệt đối chưa merge/push vào `main` trước khi giải quyết routing Vercel ↔ NAS.**
2. **Rủi ro Liên kết Tài liệu nội bộ (`docs/HELP.md`, `docs/README.md`) — `PROVEN`:**
   - Nếu dời 10 file báo cáo ở root (`PROJECT_ARCHITECTURE.md`, `PROJECT_STATE.md`, `CURRENT_SCHEMA_MAP.md`...) vào `docs/archive/` mà không đồng thời cập nhật `docs/HELP.md`, file `docs/HELP.md` sẽ phát sinh thêm 6 broken links mới.
3. **Rủi ro AIOS Contract khi chạm vào `design-playground/` — `CONFIGURED`:**
   - `.aios/PROJECT_CONTRACT.json` và `.clinerules` đang cấp quyền ghi cho Cline tại `design-playground/`. Nếu dời thư mục này vào `archive/prototypes/design-playground/`, bắt buộc phải cập nhật đồng bộ hai file cấu hình quản trị dưới sự phê duyệt của Tuấn.
4. **Kiểm chứng Runtime động (`Full App / Live NAS DB`) — `BLOCKED = NEEDS APPROVAL` (`TESTED = NO`):**
   - Trong Batch 1 không khởi chạy server hay kết nối MariaDB trên NAS để đảm bảo tuyệt đối nguyên tắc không tạo side-effect (log, session, lockfile DB).

---

## 8. Proposed Preservation Strategy (Đề xuất — Chưa thực hiện trong Batch 1)

Để khắc phục triệt để nhược điểm của cả `git stash` lẫn việc copy/nén mù toàn bộ thư mục, chiến lược bảo toàn trước khi dọn dẹp (Batch 2) được đề xuất theo **5 Tầng Tách Biệt (5-Tier Segregated Preservation)**:

| Tầng dữ liệu | Phạm vi áp dụng | Phương án bảo toàn an toàn được đề xuất | Lý do KHÔNG dùng `git stash` hay `cp/tar` toàn bộ |
|---|---|---|---|
| **Tầng 1 — Git HEAD & Deleted Tracked Files (`65` files ` D`)** | Toàn bộ trạng thái gốc `42a7ed2` (bao gồm 65 file ` D` và bản gốc trước sửa của 21 file ` M`) | Gắn một Git tag nội bộ nhẹ `safety/pre-cleanup-head-42a7ed2` trỏ thẳng vào `42a7ed2` (0 byte tốn thêm, khôi phục bất kỳ file tracked nào trong 1 lệnh). | `62/65` file ` D` vốn đã có bản sao trên đĩa và `65/65` đều nằm vĩnh viễn trong object database của `.git`. |
| **Tầng 2 — Dữ liệu Cá nhân & Dự án Ngoại lai đặt nhầm (`40` files `??`)** | `./~/Desktop/Garmin_Forensic_Audit/**` (25 files) & 15 script `MINI EXPO CÂY CÀ PHÊ` ở root | **Di chuyển cách ly ra ngoài repo (`mv` có kiểm tra bảng băm SHA-256 trước & sau)** về đúng thư mục cá nhân / thư mục dự án PVCFC do Tuấn chỉ định trên máy Mac, **trước khi** chạm vào Git hay xóa bất cứ thứ gì. | Không được đưa dữ liệu sức khỏe cá nhân hay code công ty PVCFC vào lịch sử Git của Gia Tộc, và tuyệt đối không xóa tại chỗ. |
| **Tầng 3 — Working Tree của Dự án Gia Tộc (`21` file ` M` + `~480` file `??` thuộc dự án)** | UI vNEXT, Backend/Member Space, Admin Login, AIOS config, Brand, Clara 008, Assets, Docs, Archives & 39 root patch scripts (đã gom vào vùng lưu trữ tĩnh) | Tạo một **nhánh snapshot cục bộ riêng biệt** (ví dụ `safety/working-tree-snapshot-20261031` — **CHỈ LƯU LOCAL, KHÔNG PUSH LÊN `origin`**) sau khi đã tách Tầng 2, loại trừ `revert_pass.js` (hoặc biên tập bỏ mật khẩu test) và Tuấn xác nhận có cho phép snapshot local chứa `server/data/genealogy.json` hay không. Song song, xuất 1 file `git diff HEAD` thuần văn bản cho 21 file ` M`. | `git stash -u` sẽ làm biến mất file trên working tree và rất dễ xung đột không lối thoát khi `stash pop` trên 642 thay đổi chồng chéo. Nhánh Git local giữ nguyên lịch sử có kiểm soát mà không làm hỏng `main`. |
| **Tầng 4 — Secrets, GEDCOM & Local SQLite DB (`Ignored Critical Files`)** | `.env.local`, `server/.env`, `GIADINHONGTHU.ged`, `server/family_archive.db`, `.opencode/package*.json` | **Giữ nguyên bất biến tại chỗ (Freeze In-Place)** trong suốt quá trình cleanup (không lệnh move/clean nào được chạm vào các đường dẫn này). Nếu Tuấn muốn lưu bản sao dự phòng cho riêng `family_archive.db` và `GIADINHONGTHU.ged`, chỉ chép riêng 2 file đó vào thư mục bảo mật cá nhân của Tuấn ngoài repo với quyền `chmod 600`. | Đóng gói chung `.env*`, `.ged`, `.db` vào một file `.zip`/`.tar` backup mã nguồn thông thường sẽ làm phát tán secrets và password hashes ra ngoài vùng bảo vệ của `.gitignore` / `opencode.jsonc`. |
| **Tầng 5 — Artifacts tái tạo được (`Re-creatable`)** | `chatbot-app/node_modules/` (`456.47 MiB`), `scripts/__pycache__/`, `tests/__pycache__/` | Không cần sao lưu; kiểm tra sự tồn tại của `chatbot-app/package-lock.json` (`PROVEN`) trước khi dọn. *(Riêng `root node_modules/` và `server/node_modules/` & `.opencode/node_modules/` được **GIỮ NGUYÊN**, không xóa ở đợt đầu).* | Sao lưu >30,000 file `node_modules` vừa chậm vừa vô nghĩa và dễ lỗi symlink trên macOS. |

---

## 9. Proposed Cleanup Decision List

Bảng tổng hợp quyết định an toàn cho toàn bộ các nhóm file/thư mục (Tuyệt đối **không đề xuất `DELETE`** đối với bất kỳ mục nào chưa đủ bằng chứng an toàn 100%):

| Path / Group | Current State | Proposed Class | Evidence | Move Risk | Delete Risk | Required Approval |
|---|---|---|---|---|---|---|
| `index.html`, `src/css/foundation/*` (5), `src/js/ui/*` (24), `src/js/core/{lunar-engine,ics-parser}.js` | `2` ` M` + `29` `??` + `1` `CLEAN` | `ACTIVE` | `PROVEN` (Entry point & đồ thị import trực tiếp của Public Gate + Member Space) | **HIGH** (Gãy URL ES Module / CSS) | **CRITICAL** (Mất toàn bộ UI vNEXT chưa commit) | Giữ nguyên (`KEEP`). Không move/delete. |
| `server/{index,auth,foundation,member}.js`, `server/member_{dashboard,tree,person,mach,clara,spaces}.html`, `server/package*.json`, `server/.env.example`, DB/ops scripts (8 files), `server/data/*` (4), `server/calendars/*` (4), `server/schema_update.sql` | `4` ` M` + `27` `??` + `2` `CLEAN` | `ACTIVE` | `PROVEN` (Runtime Express, Member SSR shells, DB seed/migration) | **HIGH** (Gãy `require`, `sendFile`, `npm run dev/db:*`) | **CRITICAL** (Mất toàn bộ Backend mới chưa commit) | Giữ nguyên (`KEEP`). Tuấn xác nhận chính sách Git cho `server/data/genealogy.json`. |
| `admin/{index,login}.html`, `admin/css/admin.css`, `admin/js/{admin,api,login}.js` | `4` ` M` + `2` `??` | `ACTIVE` | `PROVEN` (Admin SPA & trang Login mới) | **HIGH** (Gãy `/admin` & redirect `vercel.json`) | **CRITICAL** (`login.html` & `login.js` chỉ có trên working tree) | Giữ nguyên (`KEEP`). |
| `.aios/*`, `AGENTS.md`, `.clinerules`, `opencode.jsonc`, `.opencode/{agents,skills,package*}` | `1` ` M` + `19` `??` + `2` `CLEAN` + `3` `!!` | `ACTIVE` | `CONFIGURED` / `PROVEN` (Hệ quản trị & bảo mật AIOS) | **HIGH** (Phá vỡ ranh giới bảo mật Agent) | **CRITICAL** (Mất hợp đồng quản trị chưa commit) | Giữ nguyên (`KEEP`). Cần quyết định gỡ ignore `.opencode/package*.json`. |
| `brand/**` (10), `assets/ASSET_MANIFEST.json`, `assets/images/**` (trừ `007.jpg` đang chờ xem), `content/mach/**` (21, gồm Clara `008.md`), `data/mach.json` | `2` ` M` + `11` `??` + `228` `CLEAN` | `ACTIVE` | `PROVEN` (Tài sản thương hiệu, ảnh phả hệ, bài viết gốc MẠCH/Clara & manifest) | **HIGH** (Vỡ ảnh UI, gãy `build_mach.py`) | **CRITICAL** (Mất bài Clara 008 & Brand Constitution chưa commit) | Giữ nguyên (`KEEP`). |
| `scripts/{build_mach.py,generate-brand-css.mjs,test_p01_onboarding.js,ui_vnext_qa.mjs}`, `generator/*.py` (3), `tests/*.py` (2), `.github/workflows/validate-data.yml` | `1` ` M` + `2` `??` + `8` `CLEAN` | `ACTIVE` | `PROVEN` / `TESTED` (Build, QA & CI cốt lõi) | **MEDIUM** (Gãy CI & test imports) | **HIGH** (Mất công cụ build & QA) | Giữ nguyên (`KEEP`). Sửa path CI ở pha kỹ thuật riêng. |
| `node_modules/` (root — `puppeteer@25.10.0`), `server/node_modules/`, `.opencode/node_modules/` | `!!` (Gitignored trên đĩa) | `ACTIVE` | `PROVEN` (`server` chạy backend; root `puppeteer` chạy `ui_vnext_qa.mjs` nhưng chưa ghi vào `package.json`) | **HIGH** | **HIGH** với root `node_modules` (mất `puppeteer` chưa khai báo) | Giữ nguyên (`KEEP`) cho tới khi cập nhật `package.json`. |
| `~/Desktop/Garmin_Forensic_Audit/**` (25 files ở `./~`) | `25` `??` (Unignored!) | `BLOCKED` *(Relocate Outside Repo)* | `PROVEN` (Dữ liệu Garmin cá nhân đặt nhầm do lỗi `~`) + `BLOCKED` (Chưa kiểm chứng bản sao ngoài Desktop) | **NONE** (Khi dời ra ngoài repo) | **CRITICAL** (Nguy cơ mất vĩnh viễn dữ liệu sức khỏe cá nhân) | **Bắt buộc Tuấn phê duyệt & chỉ định thư mục đích ngoài repo** (Cấm `DELETE`). |
| `15` scripts dự án `MINI EXPO CÂY CÀ PHÊ` ở root (`add_dec006.py`, `create_m05.py`... `verify_all.py`) | `15` `??` | `BLOCKED` *(Relocate Outside Repo)* | `PROVEN` (Hardcode đường dẫn `OneDrive-PVCFC/.../MINI EXPO CAY CA PHE`) + `BLOCKED` (Chưa rõ bản lưu bên OneDrive) | **NONE** (Khi dời sang thư mục dự án PVCFC) | **HIGH** (Nguy cơ mất script công việc chưa lưu nơi khác) | **Bắt buộc Tuấn xác nhận** dời sang thư mục ngoài repo trước khi gỡ khỏi đây. |
| `39` root session patch/check scripts (`patch_*`, `fix_*`, `enforce_gate.js`, `test_media_assoc.py`, `test_relationships.py`, `create_grammar_audit.py`...) | `39` `??` | `ARCHIVE` | `PROVEN` (`0` runtime/build ref; nhưng chứa dấu vết lịch sử dựng vNEXT và chưa có trong Git) | **NONE** (Dời vào `archive/scripts/root-session-patches/`) | **MEDIUM** (Mất dấu vết lịch sử phát triển không khôi phục được từ Git) | Tuấn duyệt Move vào `archive/scripts/` (Không `DELETE`). |
| `revert_pass.js` (1 file ở root) | `1` `??` | `BLOCKED` *(Credential Scrub / Owner Delete)* | `PROVEN` (Script test local chứa mật khẩu test dạng rõ của `tuantq`, `0` ref) | **LOW** (Không được commit bản chứa mật khẩu) | **LOW** (Chỉ là script test đổi pass 35 dòng) | **Tuấn phê duyệt** xóa hoặc xóa chuỗi mật khẩu trước khi đưa vào `archive/scripts/`. |
| `server/member_baseline.html`, `src/js/member-app.js`, `src/css/main.css` | `2` `??` + `1` `CLEAN` | `ARCHIVE` | `PROVEN` (Member SPA cũ đã thay bằng `member_*.html` + `foundation.css`; `0` HTML active nạp) | **NONE** | **HIGH** với `member_baseline.html` & `member-app.js` (vì `??` chưa vào Git!) | Tuấn duyệt Move vào `archive/legacy-v1-spa/` (Cấm `DELETE`). |
| `src/js/app-v2.js` & `src/css/prototype.css` | `2` ` M` (Modified tracked) | `ARCHIVE` *(Blocked Until Deploy Gate)* | `PROVEN` (`index.html` mới không gọi, nhưng `origin/main` vẫn dùng và `prototype/design-001-public/index.html` vẫn trỏ tới `src/...`) | **MEDIUM** (Làm gãy `prototype/design-001-public/index.html` nếu chưa sửa link) | **HIGH** (Mất `182` dòng sửa đổi ` M` chưa commit) | Giữ yên cho tới khi chốt nhánh staging vNEXT & sửa link trong `prototype/`. |
| `admin/js/mockData.js` | `1` `CLEAN` | `ARCHIVE` | `PROVEN` (`0` lệnh import trong `admin/` và toàn repo; dữ liệu giả lập cũ) | **NONE** | **LOW** (Có trong Git `HEAD`) | Tuấn duyệt Move vào `archive/legacy-admin/`. |
| `server/create_schema.js` & `server/setup_db.js` | `1` `CLEAN` + `1` `??` | `ARCHIVE` | `PROVEN` (`0` runtime/script ref; schema sơ khai xung đột `db_reset.js`) | **NONE** | **MEDIUM** (`setup_db.js` là `??` chưa vào Git) | Tuấn duyệt Move vào `archive/legacy-database/`. |
| `chatbot-app/` (31 source files, **không tính** `node_modules`) & `chatbot-demo.html` | `30` `??` + `1` `!!` + `1` `CLEAN` | `ARCHIVE` | `PROVEN` (Prototype AI Chat độc lập trả lời gán cứng, `0` kết nối runtime) | **NONE** (`member_baseline.html` gọi `chatbot-demo.html` cũng cùng vào `archive/`) | **HIGH** (31 file `chatbot-app/` chưa từng được commit vào Git) | Tuấn duyệt Move vào `archive/prototypes/`. |
| `design-playground/` (9 tracked files) & `prototype/` (code/HTML) | `12+9` `CLEAN` + `3` `??` | `ARCHIVE` *(Needs Contract Gate)* | `OBSERVED` / `CONFIGURED` (`design-playground/` nằm trong `PROJECT_CONTRACT.json`; `prototype/` có `.vercel/project.json`) | **MEDIUM** (Cần cập nhật `PROJECT_CONTRACT.json` & `.clinerules`) | **MEDIUM** (`prototype/design-001-public/*` chưa vào Git) | **Human Gate của Tuấn**: duyệt sửa `PROJECT_CONTRACT.json` + xác nhận Vercel `"prototype"`. |
| `prototype/assets/images/mach/issue-01/*` (10 ảnh — `18.07 MiB`) & `prototype/.vercel/` | `10` `CLEAN` + `2` `!!` | `BLOCKED` *(Conditional Delete/Archive)* | `PROVEN` (Trùng 100% SHA-256 với `assets/images/mach/issue-01/*`) + `UNKNOWN` (Project Vercel `"prototype"` còn chạy online không) | **LOW** | **MEDIUM** (Nếu Vercel project `"prototype"` còn dùng thư mục này làm root) | Tuấn xác nhận đã ngưng Vercel `"prototype"` → khi đó mới được xóa bản trùng. |
| `10` Historical Reports ở Root (`ARCHITECTURE_CONFLICTS.md`, `CURRENT_SCHEMA_MAP.md`, `DOCUMENTATION_AUDIT.md`, `FINAL_REPORT.md`, `GIATOC_*`, `MEDIA_DEPENDENCY_MAP.md`, `PROJECT_{ARCHITECTURE,ROADMAP,STATE}.md`) + `docs/*REPORT*.md` + `scripts/{nas_audit,phase2_cartography}.py` | `5` `CLEAN` + `9` `??` | `ARCHIVE` | `PROVEN` (Tài liệu khảo cổ/báo cáo thời điểm; lưu ý `docs/HELP.md` đang link tới 6 file root) | **LOW–MEDIUM** (Phải cập nhật link trong `docs/HELP.md` cùng lúc) | **HIGH** (`9` file chưa từng vào Git!) | Tuấn duyệt Move vào `docs/archive/` & `archive/scripts/` kèm cập nhật link `docs/HELP.md`. *(Giữ `PROJECT_DECISIONS.md` ở `ACTIVE` cho tới khi hợp nhất xong `ARCHITECTURE.md`).* |
| `GIADINHONGTHU.ged`, `.env.local`, `server/.env`, `server/family_archive.db` | `!!` (Gitignored) | `UNKNOWN` / `ACTIVE PRIVATE` | `PROVEN` (Dữ liệu gốc nhạy cảm / DB / Secrets đang dùng local) | **CRITICAL** | **CRITICAL** | **Giữ nguyên tuyệt đối tại chỗ (`FREEZE`)**. Không xóa, không commit. |
| `.github/workflows/instant-sync.yml`, `.nojekyll`, `scripts/rebuild_mach_issue01.py`, `assets/images/mach/thu-gui-clara/007.jpg` | `4` `CLEAN` | `UNKNOWN` | `PARTIAL` / `UNKNOWN` (Phụ thuộc quy trình Google Calendar, GitHub Pages, Obsidian & kiểm tra mắt ảnh `007.jpg` vs `007.png`) | **LOW–MEDIUM** | **MEDIUM** | **Giữ nguyên (`KEEP`)** chờ Tuấn trả lời xác nhận từng mục. |
| `.tmp-cg/ref.png` (`852 KB`) & `archive/temp_outputs/*` (`10` files, `26 KB`) | `10` `??` + `1` `!!` | `ARCHIVE` / `UNKNOWN` | `OBSERVED` (`0` runtime ref, nhưng `patch_css.sh` là bản dời từ `HEAD:patch_css.sh` và `ref.png` chưa rõ người đặt) | **NONE** | **LOW–MEDIUM** (Mất dữ liệu benchmark CSV/JSON cũ nếu xóa) | Giữ yên trong `archive/temp_outputs/`; hỏi Tuấn về `.tmp-cg/ref.png` trước khi xóa. |
| **`chatbot-app/node_modules/`** (`456.47 MiB`), **`.playwright-mcp/**`** (`33` files), **`shots/01-home.png`**, **`cookies_dev.txt`**, **`server.log`**, **`scripts/__pycache__/`**, **`tests/__pycache__/`**, **4 file `.DS_Store`**, **`.cline/`** (rỗng), và **3 file SVG trùng đặt sai cấp** (`assets/logoGiaToc_ ngang.svg`, `assets/logoGiaToc_icon.svg`, `assets/logoGiaToc_original.svg`) | `!!` và `??` (`0` tracked files) | **`JUNK`** *(Đủ bằng chứng đề xuất `DELETE`)* | **`PROVEN`** (`0` tham chiếu trong toàn bộ code, HTML, CSS, manifest, scripts & docs; cache tái tạo được từ `package-lock.json` hoặc bản sao SVG lỗi đặt nhầm ngoài `assets/images/`) | **NONE** | **NONE** (Giải phóng ~`457.6 MiB` và vá luôn lỗ hổng lộ `cookies_dev.txt` qua Express) | Duyệt xóa an toàn trong Batch Cleanup sau khi Tuấn thông qua danh sách này. |
| `IDENTITY.md`, `SOUL.md`, `USER.md` (ở root) | `3` `??` | **`JUNK`** *(Hoặc `ARCHIVE` nếu muốn giữ mẫu)* | **`PROVEN`** (`100%` nội dung là boilerplate rỗng mặc định của OpenClaw chưa điền chữ nào của Tuấn hay dự án; xung đột với `AGENTS.md` + `.aios/`) | **NONE** | **NONE** | Tuấn duyệt xóa (hoặc cất ngoài repo nếu cần giữ template OpenClaw). |

---

## 10. UNKNOWN / BLOCKED Items

Tổng hợp đầy đủ **9 điểm đang ở trạng thái `BLOCKED` hoặc `UNKNOWN`** không được tự ý vượt qua nếu chưa có quyết định của Tuấn:

1. **`[BLOCKED — PERSONAL HEALTH DATA]` `./~/Desktop/Garmin_Forensic_Audit/**` (25 files):** Không thể kiểm tra ngoài sandbox xem `/Users/tuantq/Desktop/Garmin_Forensic_Audit` có đầy đủ 25 file `.fit`/`.BIN`/`.TXT` này chưa. Chặn mọi lệnh xóa; chỉ được di chuyển ra ngoài repo.
2. **`[BLOCKED — EXTERNAL PROJECT SCRIPTS]` 15 script `MINI EXPO CÂY CÀ PHÊ` ở root:** Không thể kiểm tra ngoài sandbox xem thư mục OneDrive PVCFC đã lưu các script này chưa. Chặn mọi lệnh xóa; chờ dời sang thư mục dự án PVCFC.
3. **`[BLOCKED — CREDENTIAL HYGIENE]` `revert_pass.js`:** Chứa mật khẩu test dạng rõ của user `tuantq`. Không được đưa nguyên trạng vào Git snapshot hay `archive/` nếu chưa xóa mật khẩu hoặc được Tuấn duyệt xóa file.
4. **`[BLOCKED — AIOS CONTRACT GATE]` Di chuyển `design-playground/`:** Bị khóa bởi `execution_surfaces.Cline` trong `.aios/PROJECT_CONTRACT.json` và `.clinerules` (Human Gate bắt buộc theo `AGENTS.md` §6).
5. **`[BLOCKED — PRODUCTION ROUTING & EXPRESS STATIC SECURITY]` Commit/Push lên `main` & cấu hình `server/index.js`:**
   - Chưa có rewrite `/login`, `/me/*`, `/api/*` trong `vercel.json` (push lên `main` sẽ làm lỗi 404 `/login` trên Vercel).
   - `express.static('..')` trong `server/index.js` đang để lộ `cookies_dev.txt`, `./~`, `/content/mach/thu-gui-clara/`, `/data/mach.json` và các script ở root.
6. **`[UNKNOWN — VERCEL SUBPROJECT]` `prototype/.vercel/project.json` (`projectName: "prototype"`):** Chưa rõ project `"prototype"` trên Vercel Dashboard còn đang chạy và phục vụ 10 bức ảnh trong `prototype/assets/images/mach/issue-01/*` hay đã ngưng sử dụng.
7. **`[UNKNOWN — PRIVACY POLICY FOR REPO DATA]` `server/data/genealogy.json` (`195 KB`, `??`):** GitHub repo `tuantudo/giatoctrantrongthu` là Private hay Public, và Tuấn có cho phép commit `server/data/genealogy.json` (chứa 223 hồ sơ nhân vật) vào nhánh snapshot/repo hay phải thêm `server/data/genealogy.json` vào `.gitignore` giống `GIADINHONGTHU.ged`?
8. **`[UNKNOWN — EXTERNAL WORKFLOWS]` `.github/workflows/instant-sync.yml`, `.nojekyll`, `scripts/rebuild_mach_issue01.py`:** Phụ thuộc vào trạng thái thực tế của Google Apps Script Calendar Sync, GitHub Pages và kho Obsidian cá nhân của Tuấn.
9. **`[UNKNOWN — VISUAL ASSET COMPARISON]` `assets/images/mach/thu-gui-clara/007.jpg` (`6.15 MB`) vs `007.png` (`23.6 MB`):** Cùng độ phân giải `5616x3744`, cần Tuấn mở xem trực tiếp xác nhận có phải cùng một bức ảnh trước khi quyết định giữ/nén/lưu trữ.

---

## 11. Human Approval Required (Danh mục Quyết định chờ Tuấn phê duyệt cho Batch tiếp theo)

Trước khi chuyển sang Batch 2 (Bảo toàn & Thực thi Cleanup có kiểm soát), xin Tuấn xem xét và cho quyết định trên **6 chốt chặn (Gates)** sau:

1. **Gate 1 — Xử lý 2 cụm dữ liệu cá nhân/ngoại lai đặt nhầm (`./~` Garmin 25 files & 15 scripts PVCFC):**
   - Tuấn đồng ý dời 2 cụm này ra thư mục ngoài repo (ví dụ `~/Desktop/Garmin_Forensic_Audit_From_GiatocRepo/` và một thư mục riêng cho `MiniExpo_CaPhe_Scripts/`), hay Tuấn xác nhận đã có đủ bản gốc ở ngoài và cho phép xóa?
2. **Gate 2 — Chính sách bảo mật dữ liệu gia phả khi tạo nhánh Snapshot Working Tree:**
   - Repo GitHub `tuantudo/giatoctrantrongthu` hiện đang để **Private** hay **Public**? Tuấn muốn `server/data/genealogy.json` được đưa vào nhánh snapshot Git nội bộ hay phải đưa vào `.gitignore` (chỉ lưu local giống `GIADINHONGTHU.ged`)?
3. **Gate 3 — Xác nhận nhóm `JUNK` an toàn (`~457.6 MiB`):**
   - Tuấn phê duyệt xóa nhóm `JUNK` đã chứng minh an toàn 100% gồm: `chatbot-app/node_modules/`, `.playwright-mcp/`, `shots/01-home.png`, `cookies_dev.txt`, `server.log`, `revert_pass.js`, `IDENTITY.md`, `SOUL.md`, `USER.md`, `.cline/`, 4 file `.DS_Store`, 2 thư mục `__pycache__/`, và 3 file SVG trùng đặt nhầm ở `assets/logoGiaToc_{ ngang,_icon,_original}.svg`? (Và xác nhận thêm `.tmp-cg/ref.png` có cần giữ không?)
4. **Gate 4 — Phê duyệt quy hoạch `ARCHIVE` & Cập nhật `.aios/PROJECT_CONTRACT.json`:**
   - Tuấn có đồng ý gom `design-playground/`, `prototype/`, `chatbot-app/` (chỉ mã nguồn), Frontend V1 (`member_baseline.html`, `member-app.js`, `main.css`), `mockData.js`, `create_schema.js`, `setup_db.js`, và `39` root patch scripts vào cây `archive/` chuẩn (kèm cập nhật đường dẫn `design-playground/` trong `.aios/PROJECT_CONTRACT.json` và `.clinerules`) không? Đồng thời project Vercel `"prototype"` còn dùng không?
5. **Gate 5 — Xác nhận 4 mục `UNKNOWN` vận hành:**
   - (a) `instant-sync.yml` + `.nojekyll` (còn đồng bộ Google Calendar qua GitHub Pages không?), (b) `scripts/rebuild_mach_issue01.py` (còn kéo bài từ Obsidian không?), (c) `007.jpg` vs `007.png` (có phải cùng một ảnh không?), và (d) gỡ dòng chặn `package.json`/`package-lock.json` trong `.opencode/.gitignore`?
6. **Gate 6 — Tách Task Khắc phục Lỗ hổng `express.static('..')` & Routing Deploy:**
   - Tuấn có muốn giao một task kỹ thuật riêng (sau khi chốt bảo toàn) để khóa chặt `SENSITIVE_PATH` / thu hẹp `express.static` trong `server/index.js` (chặn lộ `/content/mach/thu-gui-clara`, `/data/mach.json`, `cookies*.txt`) và thiết kế phương án routing giữa Vercel ↔ Synology NAS trước khi merge bất kỳ thay đổi nào vào `main`?

