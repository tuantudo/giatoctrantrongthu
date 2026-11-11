# OPENCODE SECURITY POLICY v0.1 — GIA TỘC

*Trạng thái: CURRENT (đang áp dụng trong `opencode.jsonc` project-level). Áp dụng cho repository `/Users/tuantq/Projects/Personal/giatoctrantrongthu`.*

## 1. Nguyên tắc

LOW FRICTION + STRONG BOUNDARY. Human không phải firewall. Firewall là: Permission + Credential isolation + Filesystem boundary. Human chỉ là FINAL AUTHORITY cho hành động có hậu quả thật.

```
NORMAL WORK     → AUTO
SENSITIVE WORK  → ASK
DANGEROUS WORK  → DENY
```

## 2. Trust boundaries

- Project boundary: `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- Secrets boundary: `*.env*`, keys, cookies, GEDCOM private, credentials — KHÔNG được read/edit/expose.
- Network boundary: localhost = allow; external = ask; production mutation = deny.
- DB boundary: SQLite local dev = allow; MariaDB/NAS = read-only reconnaissance, mutation deny.
- Git boundary: history inspection = allow; commit = ask; push = deny.

## 3. ALLOW (không hỏi)

- Đọc source/docs trong project (`read`, `glob`, `grep`, `list`, `lsp`)
- `pwd, ls, find, rg, grep, cat, head, tail, wc, tree, which, echo, mkdir, touch`
- `git status/diff/log/show/branch/rev-parse/grep/add/fetch`
- `npm test*`, `npm run *`
- `node server/*.js`, `node scripts/*.js`, `node --check*`
- `python3 generator/*`, `python3 scripts/*`, `python3 -m http.server*`
- `curl *localhost*`, `curl *127.0.0.1*`
- Edit file trong project (trừ protected paths)
- Local server, local SQLite dev DB, tạo/sửa docs

## 4. ASK (Human được hỏi)

- `git commit`, `git checkout`, `git switch`, `git reset`, `git restore`, `git stash`, `git remote*`
- `npm install*`, `npm ci*`, `pip install*` (dependency mới)
- `node*`, `nodejs*`, `python*`, `python3*`, `npx*`, `npm*` (khi chưa match pattern allow cụ thể — tức arbitrary interpreter execution: `node -e`, `python3 -c`, script ngoài server/scripts)
- `cp*`, `mv*`, `ln*`, `rm *`
- `curl` ra ngoài localhost
- `gh*`, `vercel*`, `ssh*`, `scp*`, `rsync*`
- Edit `opencode.jsonc`, `.aios/PROJECT_CONTRACT.json`
- DB write ngoài local dev DB, deploy staging, đổi security config / MCP config

## 5. DENY (tuyệt đối)

- `git push*` (kể cả `--force`), `git reset --hard`, `git reset --merge`, `git clean`, `git rebase`, `git branch -D`, `git remote set-url`
- `sudo`, `shutdown`, `reboot`
- `rm -rf`, `rm -r`, `rm -f /...`
- `wget`, `npm publish`, `vercel --prod`, `gh repo delete`, `gh pr merge`
- `*DROP TABLE*`, `*DROP DATABASE*`, `*TRUNCATE TABLE*`; `*DELETE FROM*` → ask
- Read/edit: `*.env*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*id_rsa*`, `*id_ed25519*`, `*credentials*`, `*cookies*`, `cookie*`, `*secret*`, `*token*`, `*.ged`, `node_modules`
- `cat/head/tail/grep` trực tiếp target file secret cũng deny

## 6. Sensitive files (protected)

`server/.env`, `.env.local`, `cookie*.txt`/`cookies*.txt`, `GIADINHONGTHU.ged`, bất kỳ SSH private key, credential file. Không để nội dung các file này xuất hiện trong agent output.

## 7. Project boundary

Agent tự chủ trong `/Users/tuantq/Projects/Personal/giatoctrantrongthu`. `external_directory` = ask mọi nơi khác. KHÔNG mặc định sửa: `~/Documents`, `~/Desktop`, `~/Downloads`, `~/Library`, `~/.ssh`, `~/.aws`, `~/.docker`, `~/.kube`, `~/.gnupg`.

**Lưu ý:** global config (`~/.config/opencode/opencode.jsonc`) hiện vẫn có `edit`/`external_directory` allow cho `~/Projects/Personal/**`. Project config override trong phạm vi project; ngoài project ranh giới phụ thuộc global. Siết global là Human Decision (ảnh hưởng các project khác).

## 8. Git policy

- Inspect: allow
- `git add`: allow
- `git commit`: **ASK** (human review trước khi commit)
- `git push`: **DENY**
- Remote URL change, credential helper manipulation: **DENY**

## 9. Network policy

- localhost / 127.0.0.1: allow
- External web/docs (webfetch/websearch tools): allow theo tool policy
- External `curl/wget`: ask / wget deny
- External mutation (`gh`, `vercel`, `ssh`): ask; production mutation: deny

## 10. Database policy

- NAS = source of truth (canonical). SQLite local = dev working copy. MariaDB = runtime DB.
- Local SQLite: agent allow read/write trong mission dev; destructive ops có pattern ask/deny.
- MariaDB/NAS: reconnaissance READ-ONLY. Agent credential nên chỉ có SELECT (credential isolation ở mức DB user — ngoài phạm vi permission config). Mutation production: DENY.

## 11. MCP policy

| Server/Tool | Phân loại | Chính sách |
|---|---|---|
| `serena.*` (read/list/search memory) | READ-ONLY | allow |
| `serena.write_memory/rename_memory` | LOCAL ACTION | allow trong project |
| `serena.safe_delete_symbol/delete_memory` | DESTRUCTIVE | ask |
| `git.*` (status/diff/log/show) | READ-ONLY | allow |
| `git.git_add/git_commit` | LOCAL ACTION | add allow / commit ask |
| `git.git_reset` | ? | ask (config hiện: tương đương bash reset → ask qua global) |
| `aios-gmail.gmail_send` | EXTERNAL ACTION | **ASK bắt buộc (built-in human approval)** |
| `aios-gmail.gmail_draft` | LOCAL ACTION | allow |
| `aios-working-memory.*` | LOCAL ACTION | allow |

Quy tắc: MCP tool có external effect hoặc destructive PHẢI có ask/deny. Agent KHÔNG được tự: deploy production, publish package, gửi external message, sửa external repo, sửa cloud infrastructure nếu không qua Human Gate.

## 12. Agent profiles

| Role | Permission |
|---|---|
| EXPLORE | read/search only, không edit/write/bash mutation |
| ARCHITECT | read/search/docs edit trong project, không production |
| BUILDER | read/edit/local bash/test/build/local DB trong project boundary |
| DB-RECON | read DB metadata + read-only SQL, không write/schema |
| DEPLOY | restricted, external effect → Human Gate, production → deny |

Profile read-only đã có sẵn: `data-reviewer`, `visual-reviewer` (deny write/edit/bash) trong `.opencode/agents/`.

## 13. Known limitations

1. **Interpreter indirection**: `node server/x.js` / `python3 generator/x.py` được allow → script đó vẫn có thể đọc `.env`. Permission layer không audit được nội dung runtime. Mitigation: scripts trong repo phải được review; arbitrary exec (`node -e`, `python3 -c`, script ngoài allowlist) = ask.
2. **`cat*`/`grep*` allow** có thể target file secret — đã thêm deny patterns cho `.env/key/pem/cookie`, nhưng pattern glob không cover 100% path encoding (vd `cat ./server/../server/.env`).
3. **MCP tool enforcement**: coverage ask/deny cho từng MCP tool phụ thuộc OpenCode version; một số tool description đã tự gate (`gmail_send`), nhưng KHÔNG phải tất cả — cần test thực tế (xem REPORT).
4. **Global config vẫn nới `~/Projects/Personal/**`** — đồng bộ global cần Human Decision.
5. **Hak5-style bypass** (vd `bash -c "cat server/.env"`) không bị chặn bởi pattern — `bash*` hiện không có rule riêng → rơi vào `*: ask` (OK).

## 14. Verification evidence

Xem `docs/audit/REPORT_OPENCODE_SECURITY_v0.1.md`.
