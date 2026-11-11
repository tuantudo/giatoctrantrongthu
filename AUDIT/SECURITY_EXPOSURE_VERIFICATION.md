# GIATOCTRANTRONGTHU — BATCH 2: SECURITY EXPOSURE VERIFICATION

- **Repository:** `giatoctrantrongthu` (`/Users/tuantq/Projects/Personal/giatoctrantrongthu`)
- **Ngày xác minh:** `2026-10-31`
- **Vai trò:** Security Verification Auditor
- **Chế độ thực thi:** **STRICT READ-ONLY (Không sửa mã nguồn/cấu hình, không khởi chạy server, không gọi webhook, không dò quét production, không in giá trị bí mật)**
- **Chuẩn trạng thái bằng chứng:**
  `DOCUMENTED` · `CONFIGURED` · `OBSERVED` · `TESTED` · `PROVEN` · `PARTIAL` · `FAILED` · `BLOCKED` · `UNKNOWN`

---

## 1. Executive Summary

Báo cáo này thực hiện xác minh độc lập ở cấp độ mã nguồn, chuỗi thực thi middleware, lịch sử Git và cấu hình triển khai đối với 6 nghi vấn bảo mật nêu ra sau Batch 1. Mọi nhận định đều phân tách rạch ròi giữa **Working Tree cục bộ** và **Git `HEAD` (`42a7ed2`)**, giữa **Local Exposure** và **Production Exposure**, cũng như giữa **Potential Vulnerability** và **Confirmed Exploitation** (không có bất kỳ bằng chứng khai thác thực tế nào được ghi nhận).

### Tổng kết kết quả kiểm định

- **8 phát hiện được XÁC MINH (`PROVEN` / `OBSERVED` trên codebase local):**
  1. `CF-01`: Trong bản working tree chưa commit (`server/index.js:28`), `express.static(path.join(__dirname, '..'))` thực sự đăng ký toàn bộ thư mục gốc repository làm static root **trước** cả session middleware (`L34`) và các router xác thực (`L214–241`).
  2. `CF-02`: Regex `SENSITIVE_PATH` (`server/index.js:21–27`) bỏ sót **5 nhóm tài nguyên nhảy cảm/nội bộ trên working tree local** (`cookies_dev.txt`, `revert_pass.js` cùng 54 root scripts, thư mục dữ liệu cá nhân `./~/Desktop/Garmin_Forensic_Audit/`, thư riêng `content/mach/thu-gui-clara/`, và `data/mach.json`), đồng thời ném lỗi `URIError` không bắt (`HTTP 500`) khi gặp chuỗi `%` sai quy cách.
  3. `CF-03`: Kể cả khi file trên đĩa bị chặn, **7 API đọc dữ liệu trong `server/index.js` (`L244, L293, L366, L421, L471, L488, L505`) hoàn toàn không gắn middleware xác thực**, cho phép truy xuất không cần đăng nhập toàn bộ hồ sơ `PUBLISHED` trong bảng `people`, `families`, `memories`, `timeline`, `stories`, `media`, `person_media` và `calendar_events`.
  4. `CF-04`: Tầng xác thực mới trên working tree có **4 điểm yếu kỹ thuật**: (a) `POST /api/member/login` (`server/member.js:129–166`) không gắn `loginLimiter` nhưng lại fallback sang xác thực bảng `admin_users` (`L147`); (b) `GET /api/auth/me/identity` (`server/auth.js:129–151`) trả nguyên dòng `SELECT * FROM accounts` làm rò rỉ trường `password_hash` vào JSON cho phiên đăng nhập hiện tại; (c) `SESSION_SECRET` có giá trị dự phòng cứng (`server/index.js:36`); và (d) nhánh `DEV_AUTO_LOGIN` trên `GET /login` (`server/member.js:30–52`) kích hoạt nếu thiếu `NODE_ENV` kèm cờ `DEV_AUTO_LOGIN=true`.
  5. `CF-05`: Bản `HEAD` đã commit (`42a7ed2`, `HEAD:server/index.js:112–151`) **chưa hề có xác thực (`requireAuth`) trên các API ghi/xóa** (`POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`) và bật `app.use(cors())` toàn cục.
  6. `CF-06`: Tồn tại mật khẩu dev/provisioning dạng plaintext dành cho tài khoản test local trong 3 script chưa track (`revert_pass.js` ở root, `server/dev_setup_onboarding.js`, `scripts/test_p01_onboarding.js`), chưa từng đi vào Git history.
  7. `CF-07`: `.github/workflows/instant-sync.yml:20` (đã commit từ `b67254d`) chứa trực tiếp một URL Google Apps Script `/exec` dạng fallback văn bản rõ trong lịch sử Git.
  8. `CF-08`: Ranh giới `.gitignore` và lịch sử Git có hai chiều rủi ro: (a) Working tree chưa ignore `server/data/genealogy.json`, `data/mach.json`, `content/mach/thu-gui-clara/Thư gửi Clara - 008.md`, `./~`, và `revert_pass.js`; (b) Trong lịch sử Git đã từng commit `content/mach/thu-gui-clara/001..007.md` (hiện vẫn tracked ở `HEAD` và không có rule chặn trong `vercel.json`), `data/genealogy.json` (gỡ ở `776b642`), và một bản cũ của `server/family_archive.db` (tại commit `224c18e`, gỡ ở `c136b8f`).
- **3 giả thuyết phụ bị BÁC BỎ (`PROVEN FALSE` bằng phân tích mã nguồn & thư viện):**
  1. `RF-01`: **Bác bỏ** giả định rằng `.env.local`, `server/.env`, `GIADINHONGTHU.ged`, `server/family_archive.db` hoặc file tĩnh `server/data/genealogy.json` có thể tải trực tiếp qua `express.static('..')` (tất cả đều bị chặn bởi `SENSITIVE_PATH` ở `L23` hoặc bởi `dotfiles: 'deny'` của `send@1.2.1` ở `L28`).
  2. `RF-02`: **Bác bỏ** khả năng vượt `SENSITIVE_PATH` + `express.static` bằng path traversal (`..`) hoặc double URL-encoding (`%2573erver`), do `send@1.2.1` chỉ giải mã URL đúng một lần và khóa cứng `UP_PATH_REGEXP`.
  3. `RF-03`: **Bác bỏ** giả định rằng bản commit `HEAD` (`42a7ed2`) chứa `express.static('..')`. Kiểm tra `git show HEAD:server/index.js` chứng minh `HEAD` chỉ phục vụ tĩnh duy nhất thư mục `server/assets/images`; lỗi mở static toàn repo chỉ xuất hiện trong bản sửa đổi chưa commit trên máy local.
- **6 hạng mục giữ trạng thái `UNKNOWN` / `BLOCKED`:** Kiểm thử HTTP runtime trực tiếp trên `127.0.0.1` (`NOT TESTED` / `BLOCKED` do cách ly mạng sandbox và không tự bật server), phiên bản code thực tế đang chạy trên Synology NAS, cấu hình định tuyến Cloudflare Tunnel / WebStation Nginx, trạng thái Public/Private của repo GitHub & file tĩnh trên Vercel, trạng thái hoạt động hiện tại của Google Apps Script webhook, và nội dung chi tiết bên trong blob lịch sử `224c18e:server/family_archive.db`.

---

## 2. Scope & Methodology

1. **Phân tích tĩnh toàn tuyến (Static Code & Config Inspection — `OBSERVED` / `PROVEN`):**
   - Đọc trực tiếp từng dòng: `server/index.js` (`535` dòng) đối chiếu với `HEAD:server/index.js` (`336` dòng), `server/member.js` (`350` dòng), `server/auth.js` (`261` dòng), `server/foundation.js` (`98` dòng), `server/package.json`, `vercel.json`, `.vercel/project.json`, `.gitignore`, `.opencode/.gitignore`, `opencode.jsonc`, `src/js/ui/data.js`, `src/js/ui/discourse.js`, `PROJECT_ARCHITECTURE.md`, `docs/archive/infrastructure/family-site-deployment-topology-v1.md`, và `docs/archive/infrastructure/nas-runtime-readiness-v1.md`.
   - Đọc trực tiếp mã nguồn thư viện đã cài đặt trong `server/node_modules/`: `express@5.2.1`, `serve-static@2.2.1` (`index.js` L37–208), và `send@1.2.1` (`index.js` L61, L114–120, L430–471, L807–885) để xác minh chính xác cơ chế `dotfiles`, URL decoding, `fallthrough`, và chống path traversal.
2. **Kiểm chứng biểu thức chính quy & Git Metadata trong bộ nhớ (`TESTED` — Zero Side-Effects):**
   - Chạy kiểm thử đơn vị trong bộ nhớ (`node -e`) đối với chính xác biểu thức `SENSITIVE_PATH` và `decodeURIComponent()` trên 23 mẫu đường dẫn biên (số ít/số nhiều, mã hóa `%`, mã hóa kép, dấu `/` cuối, dotfile, malformed URI).
   - Chạy `git --no-optional-locks check-ignore -v` và `git --no-optional-locks log --all` để xác minh chính xác trạng thái ignore và lịch sử xuất hiện trong Git của từng đường dẫn nhạy cảm.
3. **Kiểm tra HTTP Local (`NOT TESTED` / `BLOCKED`):**
   - Thử kiểm tra kết nối TCP nội bộ tới `127.0.0.1` (`3000`, `3001`, `3100`, `5173`, `8000`, `8080`, `8084`) trong môi trường sandbox nhận mã `errno=1 (Operation not permitted)` do chính sách cách ly socket của sandbox. Tuân thủ nghiêm ngặt Mục 4.C & Mục 6: **không tự khởi động server mới, không chạm DB**, ghi nhận phần kiểm thử HTTP động là `NOT TESTED` (`BLOCKED` bởi sandbox network policy) và chứng minh hành vi dựa trên mã nguồn thực tế của `server/index.js` + `serve-static@2.2.1` + `send@1.2.1`.

---

## 3. Express Middleware Execution Order

Bảng dưới đây tái dựng **chính xác thứ tự đăng ký và thực thi tuần tự** từ trên xuống dưới trong `server/index.js` (bản working tree hiện tại, chạy trên `express@5.2.1`):

| Thứ tự | Vị trí (`File:Line`) | Đăng ký Middleware / Router | Đường dẫn áp dụng | Hành vi thực tế khi khớp / không khớp |
|---:|---|---|---|---|
| **1** | `server/index.js:13` | `app.use(express.json())` | Mọi request (`*`) | Parse JSON body; gọi `next()`. |
| **2** | `server/index.js:17` | `app.use('/assets/images', publicCors, express.static(path.join(__dirname, 'assets/images')))` | `/assets/images/*` | Static root #1 = `<REPO>/server/assets/images` (**thư mục này hiện không tồn tại trên đĩa local**). Mặc định `dotfiles: 'ignore'`, `fallthrough: true` → không tìm thấy file nên luôn gọi `next()` rơi xuống Bước 3 & 4! |
| **3** | `server/index.js:22–27` | Custom `SENSITIVE_PATH` Guard | Mọi request (`*`) | Gọi `SENSITIVE_PATH.test(decodeURIComponent(req.path))`. Nếu `true` → **trả ngay `404` rỗng (`res.status(404).end()`)**, chặn trước khi tới Bước 4. Nếu `decodeURIComponent` lỗi → ném `URIError` (`500`). Ngược lại gọi `next()`. |
| **4** | `server/index.js:28` | `app.use(express.static(path.join(__dirname, '..'), { dotfiles: 'deny', index: 'index.html' }))` | Mọi `GET` / `HEAD` (`*`) | **Static root #2 = `<REPO>` (`/Users/tuantq/Projects/Personal/giatoctrantrongthu`)**. Chạy **TRƯỚC** khi khởi tạo `req.session` và **TRƯỚC** mọi kiểm tra đăng nhập! Nếu file tồn tại trên đĩa và không chứa thành phần tên bắt đầu bằng `.` → **phục vụ thẳng `200 OK`**. Nếu là thư mục thiếu dấu `/` cuối → trả **`301` redirect**. Nếu là dotfile hoặc không tồn tại (`fallthrough: true`) → gọi `next()`. |
| **5** | `server/index.js:34–46` | `app.use(session({ name: 'sid', ... }))` | Mọi request chưa kết thúc ở Bước 3–4 | Khởi tạo/đọc cookie phiên `sid` (`httpOnly: true`, `sameSite: 'lax'`, `secure: NODE_ENV === 'production'`). |
| **6** | `server/index.js:214` | `app.use('/api/auth/login', adminCors, loginLimiter)` | `/api/auth/login` | Áp CORS quản trị (`ADMIN_ORIGIN`) + giới hạn 10 lần / 15 phút **chỉ riêng cho cổng Admin login**. |
| **7** | `server/index.js:215` | `app.use('/api/auth', adminCors, createAuthRouter(dbAccessor))` | `/api/auth/{login,logout,me,me/identity}` | Xử lý đăng nhập Admin (`admin_users`) và tra cứu phiên. |
| **8** | `server/index.js:216` | `app.use('/api/admin/users', adminCors, requireAuth, requireOwner, ...)` | `/api/admin/users/*` | Yêu cầu đồng thời `req.session.userId` (`401`) và `req.session.role === 'owner'` (`403`). |
| **9** | `server/index.js:220` | `app.get('/api/admin/database/schema', adminCors, requireAuth, requireOwner, ...)` | `/api/admin/database/schema` | Yêu cầu `requireAuth` + `requireOwner` (chỉ liệt kê bảng khi `client === 'sqlite3'`). |
| **10** | `server/index.js:241` | `app.use('/', createMemberRouter(dbAccessor))` (`server/member.js`) | `/login`, `/logout`, `/api/member/*`, `/me`, `/me/*` | `/login`, `/logout`, `POST /api/member/login` là public (không có `loginLimiter`); `/api/member/profile`, `/api/member/change-password`, `/me`, `/me/tree`, `/me/tree/person/:id`, `/me/mach`, `/me/clara`, `/me/family-spaces` đều gắn `requireAccount` (chuyển hướng `302 -> /login` nếu chưa có `req.session.accountId`). |
| **11** | `server/index.js:244–363` | Public & Admin CRUD Routes | `/api/{people,stories,edges,events}` & `/api/admin/content/*` | **Đọc công khai không cần auth:** `GET /api/people` (có `publicCors`), `GET /api/stories`. **Chặn cứng `403`:** `GET /api/edges`, `GET /api/events`. **Cần `requireAuth`:** `GET /api/admin/content/{people,stories,edges,events}` và các lệnh ghi `POST /api/{people,stories,edges,events}`, `DELETE /api/edges`. |
| **12** | `server/index.js:366–527` | Public Web Adapters | `/api/{genealogy,mach,media,person_media}.json`, `/api/calendars/:filename` | **Hoàn toàn không có middleware xác thực**; truy vấn trực tiếp DB và trả JSON/ICS ra HTTP. |

---

## 4. Static Exposure Verification

### 4.1. Phân tích chi tiết hai vị trí `express.static()` (`OBSERVED` / `PROVEN`)

1. **Vị trí 1 (`server/index.js:17`):**
   - Mã nguồn: `app.use('/assets/images', publicCors, express.static(path.join(__dirname, 'assets/images')));`
   - Đường dẫn thực tế sau `path.join`: `/Users/tuantq/Projects/Personal/giatoctrantrongthu/server/assets/images`.
   - Hiện trạng local: Thư mục `server/assets/images` **không tồn tại** (`OBSERVED`), nên mọi request `/assets/images/...` ở local đều đi xuyên qua middleware này (`fallthrough: true`), qua Bước 3 (`SENSITIVE_PATH` không chặn `/assets/images/...`), rồi được phục vụ bởi **Vị trí 2** từ `/Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/images/...` (nhưng lúc này **mất header `publicCors`** vì `publicCors` chỉ gắn ở `L17`!).
2. **Vị trí 2 (`server/index.js:28`):**
   - Mã nguồn: `app.use(express.static(path.join(__dirname, '..'), { dotfiles: 'deny', index: 'index.html' }));`
   - Đường dẫn thực tế sau `path.resolve`: `/Users/tuantq/Projects/Personal/giatoctrantrongthu` — tức **toàn bộ thư mục gốc của repository**.
   - Khác biệt phiên bản Express `5.2.1` (`serve-static@2.2.1` + `send@1.2.1` — `PROVEN` qua đọc `server/node_modules/send/index.js:458–470, 807–816` và `serve-static/index.js:50, 85, 114–121`):
     - Hàm `containsDotFile(parts)` kiểm tra mọi thành phần đường dẫn có `part.length > 1 && part[0] === '.'`.
     - Khi đặt `{ dotfiles: 'deny' }` nhưng giữ mặc định `fallthrough: true`, `send` phát sự kiện lỗi `403` trước khi emit `'file'`; `serve-static` thấy `forwardError === false` và `err.statusCode < 500` nên **không trả `403` ngay mà gọi `next()`**. Do phía sau không có route nào khớp `/.env.local` hay `/.opencode/...`, Express trả về `404 Not Found` cuối tuyến — **tức các dotfile/dot-folder thực sự được bảo vệ không bị đọc nội dung**.

### 4.2. Kiểm định kỹ thuật biểu thức `SENSITIVE_PATH` (`server/index.js:21–27`) (`TESTED` / `PROVEN`)

Biểu thức hiện tại:
```js
const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|archive|\.git|\.aios|\.vercel|\.env|node_modules|\.github)(\/|$)|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env)(\?|#|$)|cookie\.txt|.*\.bak|.*\.orig/i;
```

Kiểm tra 6 khía cạnh kỹ thuật theo yêu cầu:

1. **Singular vs Plural Filenames (`FAILED` — Lỗ hổng thật):**
   - Nhánh `cookie\.txt` chỉ khớp số ít (`cookie.txt`) và thiếu neo đầu `(^|\/)` (nên chặn nhầm cả `/mycookie.txt`, nhưng **bỏ lọt hoàn toàn `/cookies_dev.txt`**, `cookies.txt`!).
2. **Danh sách thư mục nhạy cảm theo cơ chế Deny-list thay vì Allow-list (`FAILED` — Lỗ hổng thật):**
   - Chỉ liệt kê 11 tên thư mục (`server`, `generator`, `scripts`, `tests`, `archive`, `.git`, `.aios`, `.vercel`, `.env`, `node_modules`, `.github`).
   - **Bỏ lọt hoàn toàn** các thư mục và file ở root không nên public: `/~/` (dữ liệu Garmin cá nhân), `/content/` (nguồn Markdown gốc gồm Thư gửi Clara), `/data/` (`data/mach.json`), `/AUDIT/`, `/docs/`, `/brand/`, `/chatbot-app/`, `/prototype/`, `/design-playground/`, `opencode.jsonc`, và toàn bộ `55` file `.py`/`.js` ở root (gồm `/revert_pass.js`).
3. **Nested Paths (`PROVEN` hoạt động đúng cho các tên đã liệt kê):**
   - Nhờ `(^|\/)...(\/|$)`, cả `/server/data/genealogy.json` lẫn `/chatbot-app/node_modules/...` đều khớp và bị chặn `404`.
   - Tuy nhiên đối với `/.env.local`: nhánh 1 yêu cầu `/.env(\/|$)` và nhánh 2 yêu cầu đuôi `\.env$`, nên **`SENSITIVE_PATH` KHÔNG chặn `/.env.local`** (`PASSED_TO_STATIC` — may mắn được lớp thứ hai là `dotfiles: 'deny'` ở `L28` chặn lại!).
4. **URL Encoding & Malformed URI (`PARTIAL` — Chống được single/double encode nhưng dính lỗi `500`):**
   - Single-encode như `/%73erver/data/genealogy.json`: `decodeURIComponent(req.path)` giải mã thành `/server/data/genealogy.json` → bị `SENSITIVE_PATH` chặn `404` (`TESTED`).
   - Double-encode như `/%2573erver/data/genealogy.json`: Đi qua `SENSITIVE_PATH` (vì mới giải mã thành `/%73erver/...`), nhưng bên trong `send@1.2.1` (`send/index.js:879`), `send` cũng chỉ gọi `decodeURIComponent` **đúng 1 lần** trên `req.path` gốc, nên tìm thư mục tên nghĩa đen `%73erver` trên đĩa → `ENOENT` → `404` (**không bị bypass** — `PROVEN`).
   - Chuỗi `%` không hợp lệ (ví dụ `/%E0%A4%A`): `decodeURIComponent(req.path)` tại `L23` không bọc `try/catch`, gây ném ngoại lệ đồng bộ `URIError: URI malformed` trả về HTTP `500` (`TESTED`).
5. **Path Normalization & Path Traversal (`PROVEN` không vượt được ra ngoài static root):**
   - `send@1.2.1` kiểm tra `UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/` sau khi giải mã URL (`send/index.js:61, 431`), từ chối mọi nỗ lực `..` truy xuất ngược ra ngoài `<REPO>`.
   - Trường hợp gắn dấu `/` sau tên file nhạy cảm (ví dụ `/GIADINHONGTHU.ged/`): đi lọt qua nhánh `.*\.ged$` của `SENSITIVE_PATH` (`TESTED`), nhưng khi xuống `send` đọc filesystem sẽ gặp lỗi không phải thư mục (`ENOTDIR`) và trả `404`, không lộ nội dung file (`PROVEN`).
6. **Directory Existence Probing (`OBSERVED`):**
   - Do `serve-static` bật mặc định `redirect: true` (`serve-static/index.js:53, 181–207`), truy vấn `HEAD /~` hoặc `HEAD /content/mach/thu-gui-clara` (không có `/` cuối) sẽ nhận `301 Moved Permanently` tới đường dẫn có `/`, làm lộ sự tồn tại của thư mục con không nằm trong `SENSITIVE_PATH`.

---

## 5. Private Data Access Matrix

Đánh giá chi tiết từng mục trong 9 nhóm dữ liệu bắt buộc (phân biệt rõ truy cập **qua Static File** và truy cập **qua Route API thay thế** trên codebase hiện tại):

| Nhóm & Đường dẫn kiểm tra | Tồn tại trên đĩa | Trạng thái Git | Nằm trong Static Root (`..`)? | Lớp chặn Static (`L23` / `L28`) | Route API khác phục vụ cùng dữ liệu? | Yêu cầu Auth thực tế | Kết luận khả năng truy cập trên Local Server (nếu chạy) |
|---|---|---|---|---|---|---|---|
| **1. Cookie:** `cookies_dev.txt` | **CÓ** (`131 B`) | `IGNORED` (`!!`, `0` commit lịch sử) | **CÓ** (`/cookies_dev.txt`) | **KHÔNG BỊ CHẶN** (`SENSITIVE_PATH` chỉ chặn `cookie.txt` số ít; không phải dotfile) | Không | **Không** | **`EXPOSED LOCALLY (200 OK)`** (`PROVEN` bằng code trace; HTTP động `NOT TESTED`) |
| **2. Test Credential:** `revert_pass.js` | **CÓ** (`1,128 B`) | `UNTRACKED` (`??`, chưa ignore, `0` commit lịch sử) | **CÓ** (`/revert_pass.js`) | **KHÔNG BỊ CHẶN** | Không | **Không** | **`EXPOSED LOCALLY (200 OK)`** (`PROVEN` bằng code trace; HTTP động `NOT TESTED`) |
| **3. Garmin:** `~/Desktop/Garmin_Forensic_Audit/**` (`25` files) | **CÓ** (`693,537 B`) | `UNTRACKED` (`??`, chưa ignore, `0` commit lịch sử) | **CÓ** (`/~/Desktop/...` hoặc `/%7E/Desktop/...`) | **KHÔNG BỊ CHẶN** (thư mục tên `~` không phải dotfile và không có trong `SENSITIVE_PATH`) | Không | **Không** | **`EXPOSED LOCALLY (200 OK)`** cho toàn bộ 25 file `.fit`/`.BIN`/`.TXT` (`PROVEN` bằng code trace) |
| **4. Private Letters:** `content/mach/thu-gui-clara/*.md` (`8` files) | **CÓ** (`7` bài + bài `008.md`) | Bài `001`–`007`: **`TRACKED` (`CLEAN`)**; Bài `008`: **`UNTRACKED` (`??`)** | **CÓ** (`/content/mach/thu-gui-clara/...`) | **KHÔNG BỊ CHẶN** | Giao diện chính thức `/me/clara` có `requireAccount`, và `GET /api/mach.json` phục vụ từ bảng `stories` (nếu đã seed) **không cần auth** | Trang `/me/clara`: **Có**; File gốc `/content/...` & `/api/mach.json`: **Không** | **`EXPOSED LOCALLY (200 OK)`** qua đường dẫn file tĩnh `/content/mach/thu-gui-clara/...` vượt qua cổng `/me/clara` (`PROVEN`) |
| **5. Compiled Content:** `data/mach.json` | **CÓ** (`1,434,816 B` — 20 bài) | `UNTRACKED` (`??`, chưa ignore; từng có 5 commit cũ trước `776b642`) | **CÓ** (`/data/mach.json`) | **KHÔNG BỊ CHẶN** | `GET /api/mach.json` (`server/index.js:421` — đọc từ DB, hiện SQLite chỉ có 1 bài mẫu nhưng MariaDB seed đủ 19 bài) | **Không** (cả `/data/mach.json` lẫn `/api/mach.json` đều không kiểm tra session) | **`EXPOSED LOCALLY (200 OK)`** — tải trọn toàn bộ nội dung 12 bài MẠCH + **8 bức Thư gửi Clara** (`PROVEN`) |
| **6. Genealogy Snapshot:** `server/data/genealogy.json` | **CÓ** (`195,082 B` — 223 người) | `UNTRACKED` (`??`, **chưa ignore**; bản cũ `data/genealogy.json` từng có 4 commit) | Có mặt vật lý nhưng dưới `/server/` | **BỊ CHẶN (`404`)** tại `L23` bởi `(^|\/)server(\/|$)` | **CÓ:** `GET /api/genealogy.json` (`L366`) và `GET /api/people` (`L244`) đọc cùng dữ liệu đã seed từ SQLite/MariaDB! | File `/server/data/genealogy.json`: Chặn `404`; nhưng `/api/genealogy.json` & `/api/people`: **Không cần auth!** | File JSON tĩnh **KHÔNG truy cập được (`404`)**, nhưng **nội dung phả hệ `PUBLISHED` (223 người) TRUY CẬP ĐƯỢC CÔNG KHAI** qua `GET /api/genealogy.json` & `GET /api/people` (`PROVEN`) |
| **7. GEDCOM:** `GIADINHONGTHU.ged` | **CÓ** (`73,799 B`) | `IGNORED` (`!!` bởi `*.ged`, `0` commit lịch sử) | Có mặt vật lý ở root | **BỊ CHẶN (`404`)** tại `L23` bởi `.*\.ged(\?|#|$)` | Không có API nào đọc trực tiếp file `.ged` (chỉ đọc phần đã trích xuất vào DB qua `/api/genealogy.json`) | File `.ged` bị khóa hoàn toàn trên HTTP | **`PROTECTED (404)`** đối với file `.ged` gốc (`PROVEN` — bác bỏ lo ngại tải trực tiếp `.ged`) |
| **8. SQLite Database:** `server/family_archive.db` | **CÓ** (`413,696 B`) | `IGNORED` (`!!`, nhưng **từng bị commit tại `224c18e`** rồi gỡ ở `c136b8f`) | Dưới `/server/` | **BỊ CHẶN KÉP (`404`)** tại `L23` bởi cả `/server/` lẫn `.*\.db$` | Các bảng public được trích xuất qua `/api/*`, còn bảng nhạy cảm `admin_users` / `accounts` không lộ qua public API (trừ lỗi `me/identity` lộ hash của chính mình) | File `.db` nhị phân bị khóa hoàn toàn trên HTTP | **`PROTECTED (404)`** đối với file nhị phân SQLite trên HTTP (`PROVEN`) |
| **9. Environment:** `.env.local` & `server/.env` | **CÓ** (`.env.local`: `1,383 B`; `server/.env`: `297 B`) | `IGNORED` (`!!` bởi `.env*`, `0` commit lịch sử) | Có mặt vật lý | `server/.env`: **Chặn `404` ở `L23`** (`/server/` + `\.env$`); `.env.local`: lọt `L23` nhưng **BỊ CHẶN ở `L28`** bởi `{ dotfiles: 'deny' }` (`send` `containsDotFile` → fallthrough `404`) | Không | Bị khóa hoàn toàn trên HTTP | **`PROTECTED (404)`** cho cả hai file `.env*` (`PROVEN` — song `.env.local` chỉ đang dựa vào 1 lớp `dotfiles: 'deny'`, nên bổ sung vào `SENSITIVE_PATH` để phòng thủ chiều sâu) |

---

## 6. Authentication Boundary

Đối chiếu thiết kế kiến trúc **3 không gian (Public Gate · Member Space · Admin Control Room)** với mã thực thi trong `server/`:

1. **Ranh giới Trang HTML của Member Space (`PROVEN` hoạt động đúng ở tầng HTML shell):**
   - Toàn bộ 6 route đọc nội bộ (`/me`, `/me/tree`, `/me/tree/person/:id`, `/me/mach`, `/me/clara`, `/me/family-spaces`) và `/me/change-password` trong `server/member.js` (`L187, L277–335`) đều gắn middleware `requireAccount` (kiểm tra `req.session.accountId` có tồn tại trong bảng `accounts`, nếu không redirect `302 -> /login`).
   - Đồng thời, các file HTML gốc `server/member_*.html` nằm trong thư mục `server/` nên bị `SENSITIVE_PATH` chặn `404` nếu truy cập thẳng `/server/member_tree.html`.
2. **Đứt gãy nghiêm trọng giữa Cổng HTML (Đóng) và Tầng Dữ liệu API / Static (Mở toang) (`PROVEN`):**
   - Trong khi `index.html` mới (UI System vNEXT) thu hẹp trang công khai thành cổng định danh tối giản và đẩy Cây Gia Phả, MẠCH, Thư gửi Clara vào sau đăng nhập (`/me/*`), **tầng dữ liệu phía dưới vẫn giữ nguyên mô hình Public mở của thế hệ trước**:
     - `GET /api/people` (`server/index.js:244`, mở cả `Access-Control-Allow-Origin: *`), `GET /api/genealogy.json` (`L366`), `GET /api/media.json` (`L471`), `GET /api/person_media.json` (`L488`), `GET /api/stories` (`L293`), `GET /api/mach.json` (`L421`), và `GET /api/calendars/:filename` (`L505`) **không yêu cầu bất kỳ session cookie nào**.
     - Trên working tree local, ngay cả khi bảng `stories` trong SQLite đang chỉ có 1 dòng mẫu khiến `/api/mach.json` chưa trả về bài Clara, người truy cập không cần đăng nhập vẫn có thể đọc trực tiếp `/data/mach.json` và `/content/mach/thu-gui-clara/*.md` qua `express.static('..')`!
3. **Bốn điểm yếu trong cơ chế Xác thực & Quản lý Phiên trên Working Tree (`PROVEN`):**
   - **Bypass Rate Limit đăng nhập Admin qua cổng Member (`server/member.js:129–160` vs `server/index.js:214`):** `loginLimiter` (10 lần / 15 phút) chỉ gắn vào `/api/auth/login`. Trong khi đó `POST /api/member/login` không có rate limiter nào, không bị ràng buộc `adminCors`, nhưng tại `member.js:147–160` lại thực hiện truy vấn và `bcrypt.compare` trực tiếp vào bảng `admin_users` (nếu thành công còn gán luôn `req.session.userId = adminUser.id` — tức cấp quyền Admin `requireAuth`!).
   - **Rò rỉ `password_hash` trong API định danh (`server/auth.js:129–151`):** `GET /api/auth/me/identity` chạy `SELECT * FROM accounts WHERE id = ?` và trả nguyên đối tượng `account` (bao gồm cột `password_hash`) về trình duyệt.
   - **Fallback `SESSION_SECRET` tĩnh (`server/index.js:36`):** Nếu biến môi trường `SESSION_SECRET` bị bỏ sót, server không dừng khởi động mà tự dùng chuỗi cứng `'dev-only-insecure-secret'`, cho phép giả mạo chữ ký cookie `sid`.
   - **Cờ `DEV_AUTO_LOGIN` (`server/member.js:30–52`):** Kiểm tra `const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;`. Nếu môi trường triển khai quên đặt `NODE_ENV=production` và tồn tại `DEV_AUTO_LOGIN=true`, mọi truy cập `GET /login` sẽ tự động cấp phiên đăng nhập hợp lệ cho tài khoản mặc định mà không cần mật khẩu.
4. **Cảnh báo đặc biệt về trạng thái `HEAD` (`42a7ed2`) (`PROVEN`):**
   - Trong `HEAD:server/index.js` (`L112–151`), chưa có `auth.js`, nên các route ghi/xóa dữ liệu gốc (`POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`) **hoàn toàn không có xác thực**.

---

## 7. Credential & Webhook Assessment

*(Tuân thủ kỷ luật bảo mật: Không in mật khẩu, không in chuỗi hash, không in toàn bộ URL webhook, không gửi bất kỳ request thử nghiệm nào tới endpoint xác thực hay webhook).*

### 7.1. Đánh giá `revert_pass.js` (và các script liên quan)

| Tiêu chí xác minh | Kết quả kiểm chứng | Bằng chứng & Vị trí |
|---|---|---|
| **Có chứa credential dạng plaintext không?** | **CÓ (`PROVEN`)** | `revert_pass.js` dòng `15` và dòng `22` chứa tên đăng nhập quản trị/thành viên chính và 2 giá trị mật khẩu plaintext (`oldPassword` / `newPassword`) dùng để gọi `http://localhost:3000/api/member/login` và `/api/member/change-password`. *(Phát hiện bổ sung: `server/dev_setup_onboarding.js:44` và `scripts/test_p01_onboarding.js:24,31,38` cũng chứa giá trị mật khẩu khởi tạo tạm thời dựa trên ngày sinh cho môi trường test local).* |
| **Credential thuộc loại nào?** | Mật khẩu tài khoản ứng dụng nội bộ ở môi trường phát triển/kiểm thử local (`Application test/provisioned user password`) | `OBSERVED` tại `revert_pass.js:12–23` và `server/dev_setup_onboarding.js:43–48`. Mức độ trùng lặp với mật khẩu thật ngoài đời hoặc trên NAS là `UNKNOWN` (chỉ Tuấn xác nhận được). |
| **Đang được code sử dụng hay chỉ là script lịch sử?** | **Script thử nghiệm lịch sử độc lập (`PROVEN`)** | `0` lệnh `require`/`import` hay script npm nào gọi `revert_pass.js`. Riêng `server/dev_setup_onboarding.js` vẫn đang được gọi trong lệnh `npm run db:seed` (`package.json:12`). |
| **Có nằm trong vùng phơi bày của Static Middleware không?** | **`revert_pass.js`: CÓ (`PROVEN`)** · 2 file còn lại: **KHÔNG (`404`)** | `revert_pass.js` đặt ngay tại root nên đi xuyên qua `SENSITIVE_PATH` và được `express.static('..')` phục vụ. Hai file kia nằm trong `server/` và `scripts/` nên bị `SENSITIVE_PATH` chặn `404`. |
| **Có xuất hiện trong Git history không?** | **KHÔNG (`PROVEN`)** | `git log --all -- revert_pass.js server/dev_setup_onboarding.js scripts/test_p01_onboarding.js` trả về **`0` commit**. Tuy nhiên cả 3 đều đang ở trạng thái `??` **không được `.gitignore` bảo vệ**. |

### 7.2. Đánh giá `.github/workflows/instant-sync.yml`

| Tiêu chí xác minh | Kết quả kiểm chứng | Bằng chứng & Vị trí |
|---|---|---|
| **Khai báo qua Secret hay trực tiếp?** | **CẢ HAI — Có fallback plaintext trực tiếp (`PROVEN`)** | `.github/workflows/instant-sync.yml:20` viết biểu thức `${{ secrets.GAS_SYNC_WEBHOOK_URL \|\| 'https://script.google.com/macros/s/<REDACTED>/exec' }}`. Việc gắn toán tử `\|\|` với chuỗi URL đầy đủ làm mất hoàn toàn tác dụng bảo mật của `secrets.GAS_SYNC_WEBHOOK_URL`. |
| **Có nằm trong Git history không?** | **CÓ (`PROVEN`)** | Đã được commit vào lịch sử nhánh `main` từ commit `b67254d` (*Add GitHub Actions workflow for instant Google Calendar sync*) và hiện vẫn nằm trong `HEAD` (`42a7ed2`). |
| **Có dấu hiệu là endpoint thực thi hành động không?** | **CÓ (`OBSERVED`)** | Hậu tố `/exec` của `script.google.com/macros/s/...` là Web App thực thi hàm `doGet()` trên Google Apps Script để chủ động đồng bộ lịch Google Calendar khi workflow gọi `curl -L`. Không yêu cầu header xác thực nào trong lệnh `curl` tại dòng `20`. |
| **Webhook hiện còn hoạt động không?** | **`UNKNOWN` / `BLOCKED`** | Tuyệt đối không gọi thử URL theo quy tắc Read-Only. Ngoài ra trigger `paths: ['calendars/**']` hiện không tự kích hoạt nữa vì thư mục `calendars/` ở root đã bị xóa từ commit `776b642`, nhưng bất kỳ ai biết URL trong Git history vẫn có thể gọi trực tiếp nếu Web App trên Google của Tuấn chưa thu hồi/đổi URL. |

---

## 8. Git Privacy Boundary

Kết quả đối chiếu thực tế bằng `git check-ignore -v`, `git status -uall` và `git log --all` trên toàn bộ các vùng dữ liệu nhạy cảm:

| Vùng dữ liệu / Cấu hình | Quy tắc Ignore hiện tại (`git check-ignore -v`) | Đã từng nằm trong Git History (`--all`)? | Hiện trạng trong Working Tree | Rủi ro nếu chạy `git add .` & Đánh giá Ranh giới Riêng tư |
|---|---|---|---|---|
| `.env.local` & `server/.env` | **ĐÃ IGNORE** (`.gitignore:26:.env*`) + `opencode.jsonc` chặn đọc/sửa | **Không (`0` commit)** | Chỉ nằm trên đĩa local (`!!`) | **An toàn trước `git add .`**. *(Lưu ý phụ: quy tắc `.env*` cũng vô tình chặn luôn `chatbot-app/.env.example`, trong khi `server/.env.example` đã tracked từ trước nên không bị ảnh hưởng).* |
| `cookies_dev.txt` | **ĐÃ IGNORE** (`.gitignore:31:cookies*.txt`) + `opencode.jsonc` chặn đọc | **Không (`0` commit)** | Chỉ nằm trên đĩa local (`!!`) | **An toàn trước `git add .`** (chỉ rủi ro ở tầng Express static local như nêu tại Mục 5). |
| `GIADINHONGTHU.ged` | **ĐÃ IGNORE** (`.gitignore:23:*.ged`) + `opencode.jsonc` chặn đọc/sửa | **Không (`0` commit)** | Chỉ nằm trên đĩa local (`!!`) | **An toàn trước `git add .`**. |
| `server/family_archive.db` | **ĐÃ IGNORE** (`.gitignore:27:server/family_archive.db`) | **CÓ TRONG LỊCH SỬ CŨ (`PROVEN`)**: Từng bị commit tại `224c18e` và xóa khỏi tracking tại `c136b8f` | Bản hiện tại chỉ nằm trên đĩa local (`!!`), nhưng **blob cũ vẫn còn trong `.git/objects`** | Bản mới an toàn trước `git add .`, nhưng nếu repo GitHub là Public (hoặc chia sẻ `.git`), bất kỳ ai clone repo đều trích xuất lại được bản DB tại commit `224c18e`. |
| `server/data/genealogy.json` (`223` người) & `server/calendars/*.ics` (`4` files) | **CHƯA IGNORE (`rc=1`)** | `server/data/genealogy.json`: `0` commit; **nhưng** `data/genealogy.json` và `calendars/*` ở root **đã từng có 4–5 commit** trước khi gỡ ở `776b642` | `UNTRACKED` (`??`) | **NGUY CƠ CAO KHI `git add .`**: Sẽ đưa toàn bộ dữ liệu phả hệ 223 thành viên trở lại Git index. Cần Tuấn chốt chính sách: repo Private được phép giữ seed JSON hay phải ignore giống `.ged`? |
| `content/mach/thu-gui-clara/*` (`8` bài) & `data/mach.json` / `server/data/mach.json` | **CHƯA IGNORE (`rc=1`)** | Bài `001`–`007` **ĐANG TRACKED TRONG `HEAD`** (`3cf3f57`, `7d29623`, `0f06af5`); `data/mach.json` từng có 5 commit cũ; bài `008.md` + `008.jpg` chưa từng commit (`0` commit) | `001`–`007`: `CLEAN`; `008.md`, `008.jpg`, `data/mach.json`, `server/data/mach.json`: `??` | **NGUY CƠ RẤT CAO**: `git add .` sẽ đẩy thêm bức thư riêng `008.md` và `data/mach.json` lên Git (và nếu push `main` sẽ tự động xuất bản tĩnh lên Vercel CDN!). |
| `~/Desktop/Garmin_Forensic_Audit/**` (`25` files) | **CHƯA IGNORE (`rc=1`)** | **Không (`0` commit)** | `UNTRACKED` (`??`) | **NGUY CƠ NGHIÊM TRỌNG KHI `git add .`**: Sẽ commit toàn bộ 25 file dữ liệu sức khỏe/giấc ngủ cá nhân của Tuấn vào Git! |
| `revert_pass.js` (và 54 root scripts khác) | **CHƯA IGNORE (`rc=1`)** *(trong `.gitignore:36` chỉ chặn `test_login.js`)* | **Không (`0` commit)** | `UNTRACKED` (`??`) | **NGUY CƠ CAO KHI `git add .`**: Sẽ đẩy mật khẩu test dạng rõ trong `revert_pass.js` và 15 script dự án PVCFC vào Git! |
| `.opencode/package.json` & `package-lock.json` | **ĐANG BỊ IGNORE NGƯỢC** bởi `.opencode/.gitignore:2–3` | **Không (`0` commit)** | Chỉ nằm trên đĩa local (`!!`) | Không gây lộ dữ liệu, nhưng làm mất tính tái lập môi trường OpenCode khi clone repo mới. |

---

## 9. Production Deployment Boundary

Đối chiếu `vercel.json`, `.vercel/project.json`, `PROJECT_ARCHITECTURE.md`, `docs/archive/infrastructure/family-site-deployment-topology-v1.md`, `nas-runtime-readiness-v1.md` và `server/index.js` (tuyệt đối không truy cập hay dò quét hạ tầng thật):

### 9.1. Kiến trúc triển khai theo thiết kế & cấu hình trong Repo (`DOCUMENTED` + `CONFIGURED`)

1. **Tầng Frontend — Vercel Edge Network (`CONFIGURED`):**
   - `.vercel/project.json` liên kết repo gốc với project Vercel `gionghotrantrongthu` (`DOCUMENTED` tên miền `giatoctrantrongthu.com` & `admin.giatoctrantrongthu.com`; ngoài ra `prototype/.vercel/project.json` liên kết với một project riêng tên `prototype`).
   - `vercel.json` (`49` dòng) chỉ cấu hình: (a) `cleanUrls: true`, (b) `redirects` đưa `Host: admin.giatoctrantrongthu.com` tại `/` về `/admin`, và (c) security/cache headers cho `/admin/(.*)`, `/data/(.*)`, `/calendars/(.*)`.
   - **Xác nhận quan trọng (`PROVEN` trong repo config):** Trong `vercel.json` **KHÔNG CÓ bất kỳ cấu hình `rewrites` / reverse proxy nào** nối `/login`, `/logout`, `/me/*` hoặc `/api/*` sang `https://api.giatoctrantrongthu.com`, và cũng **KHÔNG CÓ cấu hình `outputDirectory` hay chặn đường dẫn `/content/*`**.
2. **Tầng Backend & Database — Synology NAS DS223j + Cloudflare Tunnel / WebStation (`DOCUMENTED`):**
   - Theo `PROJECT_ARCHITECTURE.md` và `nas-runtime-readiness-v1.md`: Node.js chạy trên Synology NAS (cổng nội bộ `127.0.0.1:3000`, kết nối MariaDB 10 tại `127.0.0.1:3306`), đứng sau WebStation (Nginx Reverse Proxy) và Cloudflare Tunnel dưới tên miền `https://api.giatoctrantrongthu.com`.

### 9.2. Đánh giá khả năng phơi bày trên Production (`OBSERVED` vs `UNKNOWN`)

1. **Trên Vercel (`giatoctrantrongthu.com`):**
   - Vì Vercel phục vụ tĩnh trực tiếp nhánh được deploy (theo tài liệu là `main` tại `42a7ed2`) mà không giới hạn thư mục con (`outputDirectory`), **mọi file đã commit trong Git `HEAD` — bao gồm `content/mach/thu-gui-clara/001..007.md` — về mặt cấu hình (`CONFIGURED`) đều nằm trong phạm vi xuất bản tĩnh của Vercel**. Trạng thái thực tế đang phản hồi trên domain live hiện tại được giữ ở mức **`UNKNOWN`** (do tuân thủ quy tắc không gửi request kiểm tra lên production).
   - Đồng thời, nếu ai đó vô tình chạy `git add . && git commit && git push origin main` từ working tree hiện tại, **cả 25 file Garmin cá nhân, `revert_pass.js`, `data/mach.json`, `Thư gửi Clara - 008.md` và `server/data/genealogy.json` sẽ tự động được đẩy lên Vercel Edge CDN**, đồng thời làm hỏng nút `/login` (`404`) trên trang chủ!
2. **Trên Synology NAS (`api.giatoctrantrongthu.com`):**
   - **Không có bằng chứng local nào cho phép kết luận NAS đang phơi bày static root (`UNKNOWN`):**
     - Trường hợp 1: Nếu NAS đang chạy bản `HEAD` (`42a7ed2`) hoặc bản cũ hơn → như đã chứng minh tại Mục 1 (`RF-03`), `HEAD:server/index.js` **không có** `express.static('..')` (nên không có lỗi lộ static root, **nhưng lại mang rủi ro nghiêm trọng `CF-05` là thiếu xác thực trên các API ghi/xóa `POST/DELETE /api/{people,stories,edges}` nếu bản đó đang chạy thật!**).
     - Trường hợp 2: Nếu bản `server/index.js` trên working tree đã từng được chép thủ công (`scp`/`rsync`) lên NAS → phạm vi lộ phụ thuộc hoàn toàn vào hai yếu tố `UNKNOWN` từ local: (a) thư mục cha `..` của `server/` trên NAS (`/volume1/web/...`) chứa những file gì, và (b) Nginx / Cloudflare Tunnel chuyển tiếp toàn bộ `/*` vào port `3000` hay chỉ chuyển tiếp `/api/*` + `/assets/images/*`.
   - Ngược lại, đối với các route `/api/people`, `/api/genealogy.json`, `/api/stories`, `/api/mach.json`: **cả bản `HEAD` lẫn bản working tree đều mở công khai không cần đăng nhập (`OBSERVED` trong cả 2 phiên bản code)**; nếu `api.giatoctrantrongthu.com/api/*` đang mở ra Internet đúng như thiết kế của `admin/js/api.js` và `app-v2.js`, dữ liệu trong các bảng này được thiết kế trả về không qua xác thực.

---

## 10. Confirmed Findings

Tổng hợp 8 phát hiện đã được xác minh chắc chắn trong phạm vi kiểm tra cho phép:

1. **`[CF-01]` Over-broad Static Root trên Working Tree (`PROVEN` — Local Codebase):**
   - **Vị trí:** `server/index.js:28`.
   - **Nội dung:** `express.static(path.join(__dirname, '..'))` gắn toàn bộ thư mục gốc repository làm thư mục web tĩnh và chạy ở bước #4 trước cả `session` (`L34`) lẫn các router xác thực (`L214–241`).
2. **`[CF-02]` Lỗ hổng danh sách chặn `SENSITIVE_PATH` & Lỗi `URIError` không bắt (`PROVEN` — Local Codebase):**
   - **Vị trí:** `server/index.js:21–27`.
   - **Nội dung:** Để lọt truy cập HTTP không cần đăng nhập vào `cookies_dev.txt`, `revert_pass.js` (cùng 54 root scripts), `./~/Desktop/Garmin_Forensic_Audit/**`, `content/mach/thu-gui-clara/**`, `data/mach.json`, `opencode.jsonc`, `AUDIT/**`; đồng thời ném `URIError` (`500`) khi `req.path` chứa mã `%` không hợp lệ.
3. **`[CF-03]` Bất đối xứng Ranh giới Riêng tư giữa Giao diện (`/me/*` khóa) và API Dữ liệu (`/api/*` mở công khai) (`PROVEN` — Local & `HEAD` Codebase):**
   - **Vị trí:** `server/index.js:244, 293, 366, 421, 471, 488, 505` và `src/js/ui/data.js:7–16`.
   - **Nội dung:** Dù UI vNEXT đã đưa Gia Phả, MẠCH và Thư gửi Clara vào vùng thành viên đăng nhập, cả 7 endpoint dữ liệu (`GET /api/people`, `/api/stories`, `/api/genealogy.json`, `/api/mach.json`, `/api/media.json`, `/api/person_media.json`, `/api/calendars/:filename`) đều không kiểm tra phiên đăng nhập và không tách biệt phạm vi dữ liệu `Clara` khỏi `MẠCH`.
4. **`[CF-04]` Khiếm khuyết bảo vệ Auth/Session trên Working Tree (`PROVEN` — Local Codebase):**
   - **Vị trí:** `server/member.js:30–52, 129–166`, `server/auth.js:129–151`, `server/index.js:36, 214`.
   - **Nội dung:** (a) `POST /api/member/login` thiếu `loginLimiter` nhưng cho phép thử mật khẩu trực tiếp trên cả `accounts` lẫn `admin_users` và cấp luôn `req.session.userId` của Admin; (b) `GET /api/auth/me/identity` trả nguyên `account.password_hash` trong JSON; (c) fallback cứng `'dev-only-insecure-secret'`; (d) cơ chế `DEV_AUTO_LOGIN` khi thiếu `NODE_ENV`.
5. **`[CF-05]` Thiếu hoàn toàn Authentication trên các API Ghi/Xóa trong bản Commit `HEAD` (`42a7ed2`) (`PROVEN` — Git `HEAD`):**
   - **Vị trí:** `HEAD:server/index.js:112–151`.
   - **Nội dung:** Trong phiên bản đang lưu ở `HEAD` trên nhánh `main`, `POST /api/people`, `POST /api/stories`, `POST /api/edges` và `DELETE /api/edges` không có bất kỳ middleware xác thực nào.
6. **`[CF-06]` Mật khẩu Test / Provisioning dạng Plaintext trong 3 Script Untracked (`PROVEN` — Local Filesystem):**
   - **Vị trí:** `revert_pass.js:15,22`, `server/dev_setup_onboarding.js:44`, `scripts/test_p01_onboarding.js:24,31,38`.
   - **Nội dung:** Chứa mật khẩu test/khởi tạo dạng rõ cho tài khoản `tuantq` (riêng `revert_pass.js` nằm ngay trong vùng phục vụ của `express.static('..')`). Chưa từng đi vào Git history.
7. **`[CF-07]` Hardcoded Google Apps Script Webhook URL trong lịch sử Git (`PROVEN` — Git Repository):**
   - **Vị trí:** `.github/workflows/instant-sync.yml:20` (commit `b67254d` → `HEAD` `42a7ed2`).
   - **Nội dung:** URL thực thi `/exec` được ghi thẳng làm giá trị dự phòng sau toán tử `||`, vô hiệu hóa ý nghĩa bảo vệ của GitHub Secret.
8. **`[CF-08]` Hổng Ranh giới Riêng tư trong `.gitignore`, Vercel Static Config & Git Object History (`PROVEN` — Git Repository):**
   - **Vị trí:** `.gitignore`, `vercel.json`, commit `224c18e`, `0f06af5`.
   - **Nội dung:** (a) `./~` (Garmin), `revert_pass.js`, `server/data/genealogy.json`, `data/mach.json`, `Thư gửi Clara - 008.md` chưa được ignore (rủi ro cao nếu chạy `git add .`); (b) 7 bài `content/mach/thu-gui-clara/001..007.md` đang tracked trong `HEAD` mà không có quy tắc chặn trên `vercel.json`; (c) lịch sử `.git` vẫn còn lưu blob nhị phân cũ của `server/family_archive.db` (commit `224c18e`) và `data/genealogy.json` (trước `776b642`).

---

## 11. Potential Findings

Các nguy cơ tiềm tàng phụ thuộc vào điều kiện môi trường hoặc cấu hình triển khai bên ngoài chưa được xác nhận:

1. **`[PF-01]` Nguy cơ API Ghi/Xóa không xác thực đang tồn tại trên NAS Production (`POTENTIAL — CRITICAL IF HEAD DEPLOYED`):**
   - Nếu Synology NAS hiện đang chạy mã nguồn tương đương `HEAD` (`42a7ed2`) hoặc bản trước khi viết `server/auth.js` (vốn đang `??` untracked ở local!), thì bất kỳ client nào gọi tới `https://api.giatoctrantrongthu.com/api/{people,stories,edges}` đều có thể ghi đè hoặc xóa dữ liệu trên MariaDB mà không cần đăng nhập.
2. **`[PF-02]` Nguy cơ truy cập trực tiếp các bài `Thư gửi Clara` (`001`–`007`) qua Vercel Static Hosting (`POTENTIAL — HIGH`):**
   - Vì `content/mach/thu-gui-clara/*.md` nằm trong nhánh `main` (`42a7ed2`) và `vercel.json` không chặn `/content/*`, các file Markdown gốc này có khả năng đang truy cập được bằng URL trực tiếp trên domain Vercel dù giao diện web không hiển thị link.
3. **`[PF-03]` Nguy cơ rò rỉ dữ liệu từ lịch sử Git nếu Repository GitHub đang ở chế độ Public (`POTENTIAL — HIGH`):**
   - Nếu `github.com/tuantudo/giatoctrantrongthu` là Public repo, người ngoài có thể đọc URL webhook trong `instant-sync.yml`, đọc 7 bức Thư gửi Clara, và khôi phục `data/genealogy.json` cũng như `server/family_archive.db` từ các commit lịch sử `eb3adb0` / `224c18e`.
4. **`[PF-04]` Mất header CORS trên `/assets/images/*` khi chạy Local (`POTENTIAL — LOW`):**
   - Do `server/assets/images` không tồn tại nên request rơi xuống static root thứ hai không có `publicCors`, có thể gây lỗi tải ảnh nếu kiểm thử frontend khác port ở local.

---

## 12. UNKNOWN / BLOCKED

1. **`[UB-01]` Runtime HTTP `HEAD` Test trên `127.0.0.1` (`NOT TESTED` / `BLOCKED`):** Sandbox chặn kết nối socket loopback (`EPERM`) và lệnh liệt kê tiến trình (`ps`), đồng thời quy tắc Read-Only cấm tự khởi chạy server mới.
2. **`[UB-02]` Phiên bản mã nguồn & bố cục thư mục thực tế đang chạy trên Synology NAS (`UNKNOWN` / `BLOCKED`):** Không truy cập SSH/NAS theo quy định.
3. **`[UB-03]` Quy tắc định tuyến của Cloudflare Tunnel & Synology WebStation Nginx (`UNKNOWN`):** Không rõ chỉ proxy `/api/*` + `/assets/images/*` hay proxy toàn bộ `/*` về port `3000`.
4. **`[UB-04]` Chế độ hiển thị (Public vs Private) của GitHub Repository & trạng thái thực tế của Vercel CDN (`UNKNOWN`):** Không dò quét bên ngoài.
5. **`[UB-05]` Trạng thái hoạt động và quyền ghi của Google Apps Script Webhook URL (`UNKNOWN` / `BLOCKED`):** Tuyệt đối không gửi request tới webhook.
6. **`[UB-06]` Phạm vi tái sử dụng của mật khẩu trong `revert_pass.js` và dữ liệu bên trong blob lịch sử `224c18e:server/family_archive.db` (`UNKNOWN` / `PARTIAL`):** Cần Tuấn xác nhận mật khẩu đó chỉ là chuỗi nháp local hay từng đặt cho tài khoản thật.

---

## 13. Recommended Containment Actions (Chỉ Đề Xuất — Chưa Thực Hiện)

### `P0` — Nguy cơ truy cập / can thiệp dữ liệu nhạy cảm cần Containment khẩn cấp
1. **`[P0-1]` Kiểm tra ngay phiên bản `server/index.js` đang chạy trên Synology NAS (Do Tuấn / OpenCode thực hiện có phê duyệt):**
   - Xác minh ngay trên NAS xem `api.giatoctrantrongthu.com` đã có middleware `requireAuth` trên `POST/DELETE /api/{people,stories,edges,events}` chưa (vì trên Git `HEAD` `42a7ed2` hiện **chưa có**!). Nếu chưa có, cần ưu tiên cập nhật lớp bảo vệ auth cho API ghi/xóa ngay lập tức.
2. **`[P0-2]` Loại bỏ hoàn toàn `express.static(path.join(__dirname, '..'))` khỏi `server/index.js` (`L21–28`):**
   - Thay cơ chế **Deny-list trên toàn repo root** bằng **Allow-list tường minh chỉ phục vụ đúng các thư mục giao diện công khai được phép**: `/src/css`, `/src/js`, `/assets`, `/admin`, `/robots.txt`, và route cụ thể `GET /` → `res.sendFile(root/index.html)`. Khi đó mọi file khác ở root (`cookies_dev.txt`, `revert_pass.js`, `./~`, `content/`, `data/`, `AUDIT/`, `docs/`, `opencode.jsonc`) tự động trở nên bất khả xâm phạm qua HTTP mà không còn phụ thuộc vào regex dễ sót!
3. **`[P0-3]` Khóa xác thực (`requireAccount` hoặc `requireAuth`) và tách phạm vi cho các API đọc dữ liệu nội bộ (`server/index.js`):**
   - Gắn kiểm tra phiên đăng nhập lên `/api/genealogy.json`, `/api/people`, `/api/media.json`, `/api/person_media.json`, `/api/stories`, `/api/mach.json` (phù hợp với quyết định kiến trúc đưa Gia Phả, MẠCH và Thư gửi Clara vào sau cổng `/login`), đồng thời tách riêng dữ liệu `Thư gửi Clara` khỏi `MẠCH` ở tầng API.
4. **`[P0-4]` Chặn xuất bản tĩnh thư mục `/content/*` và `/data/*` trên Vercel:**
   - Khi triển khai lên Vercel, cấu hình thư mục xuất bản tĩnh tách biệt hoặc chặn truy cập trực tiếp vào `/content/mach/thu-gui-clara/*` để người ngoài không thể tải file Markdown gốc qua CDN.

### `P1` — Credential, Session & Webhook cần xử lý
1. **`[P1-1]` Thu hồi / tạo lại URL triển khai Google Apps Script Webhook:**
   - Vào Google Apps Script quản lý lịch gia đình, hủy bản triển khai (Archive deployment) ứng với URL đã lộ trong commit `b67254d`, tạo Deployment mới (có kiểm tra khóa bí mật truyền kèm), lưu URL mới duy nhất trong GitHub Actions Secret `GAS_SYNC_WEBHOOK_URL`, và xóa bỏ hoàn toàn nhánh fallback `|| 'https://...'` trong `.github/workflows/instant-sync.yml`.
2. **`[P1-2]` Xử lý mật khẩu plaintext trong `revert_pass.js` và các script test onboarding:**
   - Xóa `revert_pass.js` (hoặc thay bằng đọc `process.env.TEST_PASSWORD`); đổi mật khẩu tài khoản `tuantq` trên local/NAS nếu chuỗi mật khẩu trong `revert_pass.js` trùng với bất kỳ mật khẩu đang dùng nào; chuyển giá trị mật khẩu khởi tạo trong `dev_setup_onboarding.js` / `test_p01_onboarding.js` sang biến môi trường test hoặc sinh ngẫu nhiên.
3. **`[P1-3]` Vá 4 lỗ hổng tầng Auth/Session (`server/member.js`, `server/auth.js`, `server/index.js`):**
   - Gắn `loginLimiter` vào `POST /api/member/login` (`server/member.js:129`).
   - Sửa `GET /api/auth/me/identity` (`server/auth.js:137`) thành `SELECT id, email, username, role, status, created_at FROM accounts WHERE id = ?` (loại bỏ tuyệt đối `password_hash`).
   - Bắt buộc `process.env.SESSION_SECRET` phải tồn tại khi `NODE_ENV === 'production'` (`process.exit(1)` nếu thiếu) và sửa điều kiện `DEV_AUTO_LOGIN` thành chỉ cho phép khi `process.env.NODE_ENV === 'development'` tường minh + lắng nghe trên `127.0.0.1`.

### `P2` — Git Privacy Boundary & Dữ liệu cá nhân cần điều chỉnh
1. **`[P2-1]` Dời ngay thư mục dữ liệu cá nhân `./~/Desktop/Garmin_Forensic_Audit/` và `15` script PVCFC ra ngoài repository** trước bất kỳ lệnh `git add` nào.
2. **`[P2-2]` Mở rộng `.gitignore` trước khi tạo bất kỳ commit/snapshot nào:**
   - Bổ sung chặn `~/` (phòng tái diễn lỗi unexpanded tilde), `.playwright-mcp/`, `.tmp-cg/`, `shots/`, và chốt với Tuấn việc ignore hay giữ `server/data/genealogy.json`, `data/mach.json`; đồng thời sửa `.env*` bằng ngoại lệ `!**/.env.example` và gỡ chặn `package.json`/`package-lock.json` trong `.opencode/.gitignore`.
3. **`[P2-3]` Đảm bảo repo GitHub `tuantudo/giatoctrantrongthu` ở chế độ `Private`:**
   - Do lịch sử `.git` đã chứa `content/mach/thu-gui-clara/001..007.md`, `data/genealogy.json` (trước `776b642`) và `server/family_archive.db` (tại `224c18e`), việc xác nhận repo GitHub đang là **Private** là điều kiện tiên quyết. Việc viết lại lịch sử Git (`git filter-repo`) thuộc Human Gate nên chỉ cân nhắc nếu repo từng ở chế độ Public.

### `P3` — Các vấn đề Hardening bổ sung
1. **`[P3-1]` Bọc `try/catch` cho `decodeURIComponent(req.path)`** (nếu còn giữ middleware kiểm tra đường dẫn) để trả `400 Bad Request` thay vì ném `URIError` (`500`).
2. **`[P3-2]` Đồng bộ thư mục ảnh `/assets/images` trong `server/index.js:17`** trỏ đúng tới `path.join(__dirname, '..', 'assets', 'images')` để giữ đúng `publicCors` khi phục vụ ảnh tĩnh.

---

## 14. Evidence Appendix

| Mã tham chiếu | Nguồn bằng chứng cụ thể | Phương pháp kiểm chứng | Trạng thái |
|---|---|---|---|
| `EV-01` | `server/index.js:17, 21–28, 34–46, 214–242` | Đọc mã nguồn trực tiếp & phân tích thứ tự middleware | `PROVEN` |
| `EV-02` | `HEAD:server/index.js:1–10, 112–151` (`git show HEAD:server/index.js`) | Đối chiếu mã nguồn bản commit `42a7ed2` với working tree | `PROVEN` |
| `EV-03` | `server/node_modules/serve-static/index.js:50, 85, 114–121, 181–207` & `server/node_modules/send/index.js:61, 431, 458–470, 807–816, 879–885` | Đọc mã nguồn thư viện cài đặt thực tế (`express@5.2.1`, `serve-static@2.2.1`, `send@1.2.1`) | `PROVEN` |
| `EV-04` | Kiểm thử `node -e` trên biểu thức `SENSITIVE_PATH` với 23 trường hợp đường dẫn | Thực thi hàm kiểm tra chuỗi thuần trong bộ nhớ (0 I/O) | `TESTED` / `PROVEN` |
| `EV-05` | `server/index.js:244–305, 366–527` & `src/js/ui/data.js:5–17` & `src/js/ui/discourse.js:12–20` | Đối chiếu khai báo route Express với tầng gọi API của Frontend vNEXT | `PROVEN` |
| `EV-06` | `server/member.js:10–62, 129–166, 277–345` & `server/auth.js:8–21, 31–156` & `server/foundation.js:67–93` | Đọc mã nguồn toàn bộ luồng đăng nhập Admin & Member | `PROVEN` |
| `EV-07` | `revert_pass.js:12–23`, `server/dev_setup_onboarding.js:43–48`, `scripts/test_p01_onboarding.js:24–40` | Quét mẫu có che mờ tự động (`REDACTED`) không trích xuất giá trị bí mật | `PROVEN` |
| `EV-08` | `.github/workflows/instant-sync.yml:17–21` & commit `b67254d` | Đọc file cấu hình CI & truy vết `git log --all` | `PROVEN` |
| `EV-09` | `.gitignore`, `.opencode/.gitignore`, `opencode.jsonc` & kết quả `git check-ignore -v` trên 15 đường dẫn đích | Thực thi `git --no-optional-locks check-ignore -v` & `git log --all` | `TESTED` / `PROVEN` |
| `EV-10` | `vercel.json`, `.vercel/project.json`, `PROJECT_ARCHITECTURE.md`, `docs/archive/infrastructure/{family-site-deployment-topology-v1,nas-runtime-readiness-v1}.md` | Đối chiếu cấu hình triển khai và tài liệu hạ tầng | `CONFIGURED` / `DOCUMENTED` |
| `EV-11` | Kiểm tra socket TCP nội bộ `127.0.0.1:{3000,3001,3100,5173,8000,8080,8084}` nhận `EPERM` do sandbox | Ghi nhận giới hạn môi trường, không tự khởi chạy ứng dụng | `NOT TESTED` / `BLOCKED` |

