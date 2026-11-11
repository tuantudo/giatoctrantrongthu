# REPORT — OPENCODE SECURITY v0.1

*Ngày: 2026-10-04. Tác nhân: OpenCode. Không production mutation, không deploy, không push, không đổi credential.*

## 1. Before → After

| Rule | Before | After |
|---|---|---|
| `node*`, `python3*`, `npm*`, `npx*`, `bun*` | allow toàn bộ → arbitrary exec mở (chứng minh: `node -e` đọc được SQLite/.env trong session audit) | blanket `ask`; allow cụ thể cho `node server/*`, `node scripts/*`, `npm test*`, `npm run *`, `python3 generator/*` |
| `git commit*` | allow | **ask** |
| `git checkout/switch/reset/restore/stash/remote*` | allow/mix | ask |
| `git push*` | deny | deny (giữ) |
| `cp*`, `mv*` | allow | ask |
| `rm *` | ask | ask (giữ); `rm -r*` thêm deny |
| secrets read | `.env`, key, pem deny; thiếu `*.p12/*.pfx/*id_ed25519*/*credentials*/*cookies*/*secret*/*token*` | đầy đủ hơn |
| `cat/head/tail` target secret | allow (bypass) | deny patterns |
| `gh/vercel/ssh/scp/rsync` | không có rule | ask; `npm publish`, `vercel --prod`, `gh repo delete`, `gh pr merge` deny |
| SQL destructive (`DROP/TRUNCATE`) | không có | deny; `DELETE FROM` ask |
| Edit `opencode.jsonc` | cho phép | ask |
| `rename_memory`, safe delete MCP | không rõ | documented ask trong policy doc |

## 2. Files changed

- `opencode.jsonc` (project) — rewrite permission map theo 3 tầng ALLOW/ASK/DENY
- `docs/security/OPENCODE_SECURITY_POLICY_v0.1.md` — mới
- `docs/audit/REPORT_OPENCODE_SECURITY_v0.1.md` — mới

Không sửa global config `~/.config/opencode/opencode.jsonc` (tránh ảnh hưởng project khác — đề xuất Human xem xét riêng).

## 3. Security test matrix

| Action | Expected | Actual | Verdict |
|---|---|---|---|
| đọc source code | AUTO (read allow) | config merged: `read.* = allow` | VERIFIED (static) |
| edit file trong project | AUTO | `edit` allow trong boundary | VERIFIED (static) |
| `npm test` | AUTO | `npm test* = allow` | VERIFIED (static) |
| `npm run dev` | AUTO | `npm run * = allow` | VERIFIED (static) |
| `node -e "..."` (arbitrary) | ASK | `node* = ask`; không match allow cụ thể nào | VERIFIED (static) / NOT VERIFIED (runtime prompt) |
| `python3 -c` | ASK | `python3* = ask` | VERIFIED (static) / NOT VERIFIED (runtime) |
| `curl localhost:3000` | AUTO | `curl *localhost* = allow` | VERIFIED (static) |
| `curl https://external` | ASK | `curl* = ask` | VERIFIED (static) |
| `git status/diff/log` | AUTO | allow | VERIFIED (static) |
| `git commit` | ASK | `git commit* = ask` | VERIFIED (static) |
| `git push` | DENY | deny | VERIFIED (static) |
| `sudo` | DENY | deny | VERIFIED (static) |
| `rm -rf` | DENY | deny | VERIFIED (static) |
| `cat server/.env` | DENY | `cat */*/.env*` → wait, `cat */.env*` matches `server/.env`? pattern `cat */.env*`: `*`="server"? `cat server/.env` vs `cat */.env*` → `*`="server" then "/.env" ✓ deny | VERIFIED (static) |
| `read server/.env` (tool) | DENY | `*.env` deny | VERIFIED (static) |
| `DROP TABLE` | DENY | `*DROP TABLE*` deny | VERIFIED (static) |
| `vercel --prod` | DENY | deny | VERIFIED (static) |
| browser QA localhost | AUTO | no rule → `*: ask`? — member-app fetch qua browser, không qua bash | NOT VERIFIED |
| MCP `gmail_send` | ASK | tool tự gate approval | PARTIAL (doc) |
| MCP `safe_delete_symbol` | ASK | chưa có native enforcement proven | NOT VERIFIED |
| Runtime ask-prompt thực tế | ASK hiển thị cho Human | không test headless được trong session | **NOT VERIFIED** |

## 4. Failed tests / gaps

- Runtime behavior của các rule `ask`/`deny` chưa được quan sát trực tiếp (headless environment) → NOT VERIFIED, cần 1 phiên TUI thật để confirm prompt/deny.
- `node server/*.js` vẫn có thể đọc `.env` nếu script cố tình — permission layer không audit nội dung script (Known limitation, đúng bản chất boundary: scripts trong repo phải được review).
- Pattern SQL (`*DROP TABLE*`) chỉ bắt được khi command string chứa literal; SQL qua file `.sql` hoặc qua node mysql driver không match → database credential isolation vẫn là firewall chính.

## 5. Remaining risks

1. Global config vẫn allow `edit`/`external_directory` cho `~/Projects/Personal/**` → ngoài project này, agent các project khác có quyền rộng hơn mong muốn. Khuyến nghị siết global khi Human duyệt.
2. `cat*` allow + file secret deny patterns dùng glob → có đường vòng (vd `cat ./server//.env`? — `cat */.env*` vẫn match do `*`="./server/"? cần test thêm).
3. Approval fatigue có thể phát sinh nếu workflow hay gọi `node script ngoài server/scripts`, `cp/mv`, `npm install` → đó là intent của policy; nếu Human thấy phiền, cân nhắc allow thêm pattern cụ thể thay vì hạ toàn bộ về allow.

## 6. Human decisions required

- Có siết global `opencode.jsonc` về `ask` cho mọi thứ ngoài project hiện tại không?
- Rotate DB password / member password (đã tồn tại trong artifact local trước đây).
- Duyệt drift giữa chính sách và global config trong các project khác.
