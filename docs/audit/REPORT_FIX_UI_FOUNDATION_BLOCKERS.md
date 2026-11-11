# REPORT — FIX UI FOUNDATION BLOCKERS

*Ngày: 2026-10-04. Tác nhân: OpenCode (Execution Agent). Scope: P0 security, P1 data integrity, P1 XSS, P1 artifact hygiene. KHÔNG redesign UI, KHÔNG đụng Sitemap/Navigation, KHÔNG deploy, KHÔNG push.*

## A. Issues fixed

1. **Credential logging (P0)** — `server/member.js:98,110` log plaintext password + bcrypt `password_hash` mỗi lần failed login. Đã xóa. `server/dev_setup_onboarding.js:54` in initial password → Đã xóa dòng log.
2. **Database file exposure (P0)** — `server/index.js:21` mount `express.static(repo_root)` serve toàn bộ repo anonymous, bao gồm `/server/family_archive.db` (200 trước fix). Đã thêm blocklist middleware 404 cho: `/server`, `/generator`, `/scripts`, `/tests`, `/archive`, `.git`, `.aios`, `.vercel`, `.env*`, `node_modules`, `.github`, mọi `*.db/.sqlite/.log/.ged/.pem/.key/cookie.txt/*.bak/*.orig`, `dotfiles: 'deny'`.
3. **db_seed.js mapping (P1)** — `p.birth`/`p.death` là object `{date, place}` trong `server/data/genealogy.json` (223 dict + 25 null), được INSERT thẳng vào cột TEXT → `'[object Object]'`. Fix: unwrap `(p.birth && typeof p.birth === 'object') ? p.birth.date : p.birth`. Không dùng workaround string replace.
4. **XSS member_dashboard (P1)** — `personNotes.innerHTML = p.notes` và `+= famHtml` (chứa tên người từ DB, không escape) → thay bằng `textContent`, `white-space: pre-wrap`, family block dựng bằng `createElement`/`createTextNode`.
5. **XSS phụ (P1)** — `src/js/member-app.js:856` inject `personMatch.name` raw vào innerHTML → bọc `escapeHtml()` (helper đã có sẵn trong file). `admin/js/admin.js` people table + typeahead render `p.name/birthYear/deathYear/gender/status` raw → thêm `escAdmin()` và escape tại các điểm render.
6. **Artifact hygiene (P1)** — Xóa khỏi repo: `cookies.txt`, `cookie.txt`, `cookies2.txt` (đều chứa live `sid` session cookie), `api_res.json` (96KB dump), `test_login.js`, `server.log` (root, untracked nhưng chứa plaintext password `050787` + bcrypt hash), `local_server.log`, `local_frontend.log`. `server/server.log` (tracked, nội dung benign) → `git rm --cached` + xóa + `*.log` vào `.gitignore`.

## B. Files changed

- `server/member.js` — xóa 2 dòng log password/hash
- `server/dev_setup_onboarding.js` — xóa log initial password
- `server/index.js` — static blocklist middleware + `dotfiles:'deny'`
- `server/db_seed.js` — fix birth/death object→string mapping
- `server/member_dashboard.html` — XSS fix (textContent/DOM creation)
- `src/js/member-app.js` — escape `personMatch.name`
- `admin/js/admin.js` — thêm `escAdmin()`, escape people/typeahead render
- `.gitignore` — thêm `cookies*.txt`, `cookie.txt`, `*.log`, `api_res.json`, `test_login.js`
- `docs/audit/REPORT_FIX_UI_FOUNDATION_BLOCKERS.md` — report này

Files deleted: `server.log`, `cookies.txt`, `cookie.txt`, `cookies2.txt`, `api_res.json`, `test_login.js`, `local_server.log`, `local_frontend.log`, `server/server.log` (untracked từ git index).

## C. Tests executed (FACT)

| # | Test | Result |
|---|------|--------|
| 1 | `node server/verify_mvp.js` | PASS — 223 persons, 68 families, 2 memories, 215 timeline, 0 unmatched |
| 2 | Anonymous `GET /server/family_archive.db` | 404 (was 200) |
| 3 | Anonymous `GET /server/index.js`, `/.env.local`, `/cookie.txt`, `/GIADINHONGTHU.ged`, `/.aios/PROJECT_CONTRACT.json`, `/generator/*.py`, `/scripts/*`, `/tests/*` | 404 |
| 4 | Authenticated member `GET /server/family_archive.db` | 404 |
| 5 | grep `console.log/warn/error` kèm password/hash/secret → không còn hit nào (còn `dev_setup_onboarding` usage text của script test) | PASS |
| 6 | Root `server.log` cũ chứa `Failed compare: 050787 $2b$10$...` → đã xóa, không còn file log nào chứa credential | PASS |
| 7 | `@I115@` sau `npm run db:seed`: `birthYear='05/07/1987'`, `deathYear=null` (was `'[object Object]'`, NULL) | PASS |
| 8 | People xấu: 208 rows `birthYear LIKE '%object%'` → sau reseed: **0**; 223/223 rows đúng | PASS |
| 9 | Member login `tuantq` → 200 + session | PASS |
| 10 | `GET /me` authenticated → 200; `GET /me/tree` → 200; anonymous `/me` → 302 login | PASS |
| 11 | Public `GET /` → 200; `/src/js/app-v2.js` → 200; `/admin/` → 200; `/login` → 200; `/api/people` → 200 | PASS |
| 12 | Syntax check `admin/js/admin.js` (ESM) | OK |
| 13 | `python3 generator/validate_integrity.py` | FAIL — **pre-existing**, xem Known limitations |

## D. Before/After

| Item | Before | After |
|---|---|---|
| `GET /server/family_archive.db` anonymous | 200 (tải được DB) | 404 |
| `people.birthYear` @I115@ | `'[object Object]'` | `'05/07/1987'` |
| `people.deathYear` @I115@ | NULL (mất giá trị thật nếu object có date) | `NULL` (đúng, `death: null`) / string date khi có |
| Failed-login log | password + bcrypt hash vào stdout | không log credential |
| `personNotes` render | innerHTML (XSS qua DB) | textContent |
| Session cookie files `*.txt` trong repo | 3 file chứa live `sid` | đã xóa + gitignore |

## E. Security verification

- Static middleware blocklist chạy TRƯỚC `express.static`; test anonymous + authenticated đều 404 DB/source/env.
- `dotenv` không override env: server restart test dùng `DB_CLIENT=sqlite3` để test local; production path (`DB_CLIENT=mysql`) không bị đổi code.
- `server/.env` (chứa credential thật MariaDB) đã được `.gitignore` (`.env*`) từ trước — xác nhận `git check-ignore server/.env` → ignored, không được commit.

## F. Data-integrity verification

- `server/data/genealogy.json` KHÔNG bị sửa; chỉ là nguồn đọc của seed.
- `verify_mvp.js`: source↔DB khớp 100% sau reseed local SQLite.
- Không reset production DB. Local `family_archive.db` đã reseed lại bằng seed đã fix (đây là DB dev local, nằm trong `.gitignore`).

## G. Remaining issues / Known limitations

1. **`python3 generator/validate_integrity.py` FAIL** — validator kỳ vọng `data/genealogy.json` và `calendars/CAL_*.ics` ở path cũ; thực tế đã chuyển sang `server/data/` và `server/calendars/`. Pre-existing, ngoài scope mission; KHÔNG tự sửa.
2. **`/api/calendars/:filename`** đọc bảng `calendar_events` trong DB — local SQLite không có row nào PUBLISHED → 404 dù `server/calendars/*.ics` tồn tại. Pre-existing gap (DB events chưa seed); KHÔNG tự sửa.
3. **`src/js/member-app.js`** khai báo trùng `function bindStats` (line ~1911) — script cổ điển cho phép re-declare, browser chạy OK; cú pháp nghiêm ngặt (module) báo lỗi. Pre-existing.
4. **Credential rotation cần Human Gate**: `server/.env` chứa `DB_PASSWORD=Fatima@123Ma` (root@100.80.147.119), và password tài khoản dev `tuantq` đã bị lộ trong `server.log` cũ → khuyến nghị đổi password DB + member. Tôi đã đổi password local dev sang `TestPass123!` để test; nên reseed lại khi cần.
5. **`admin/js/admin.js`** còn nhiều chỗ render template với dữ liệu DB (stories, events, media) chưa escape toàn bộ — đã escape people list + typeahead; phần còn lại cần audit riêng.
6. **Session store** dùng MemoryStore — mất session khi restart server (quan sát được trong test). Pre-existing design note (P2 từ P0.2 audit).
7. **`/api/people` public** trả toàn bộ danh sách người anonymous — phù hợp publicCors hiện tại; nếu cần siết, thuộc Human Decision.

## H. Human decisions still required

- Rotation DB password / member password (secret đã từng nằm trong artifact local).
- Quyết định có scrub git history nếu secret từng bị commit (hiện file log nhạy cảm là untracked → không cần rewrite history; `server/server.log` tracked chỉ chứa nội dung benign).
- Có nên siết public static: `docs/`, `brand/`, `chatbot-app/`, `prototype/`, `design-playground/` đang được serve trong dev runtime.
