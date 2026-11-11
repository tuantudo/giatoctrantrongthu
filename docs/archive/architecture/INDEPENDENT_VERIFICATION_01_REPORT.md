# INDEPENDENT VERIFICATION 01 — Giatoc Tran Trong Thu

**Verifier:** Cline (independent, không tham gia build AIOS V2, không đụng OpenCode's work)
**Mission:** Independent verification — OpenCode có bỏ sót vấn đề nào khiến Giatoc chưa đóng được không
**Date:** 2026-09-15 ~14:00 (UTC+7)
**Mode:** READ-ONLY. Không sửa code, không restart, không deploy, không commit/push, không sửa production, không sửa AIOS.
**Inputs:** `PRODUCTION_WIRING_AUDIT.md`, `PRODUCTION_RECOVERY_01_REPORT.md`, `GIATOC_INVESTIGATION_01_REPORT.md`, `DESIGN_001_CLEAN_BASELINE_VERIFICATION.md`, `PROJECT_STATE.md`, `credential-exposure-audit-v1.md`, repo state, live network checks, git internals (`.git/index`, `.git/objects`, `.git/logs/HEAD`), GitHub API.

**Phân loại:** VERIFIED (tự kiểm trực tiếp) / OBSERVED (thấy trên hệ thống, chưa test runtime) / INFERRED (suy luận có căn cứ) / UNKNOWN.

---

## 1. TRẢ LỜI 8 CÂU HỎI

### Q1. Production URL có hoạt động không? — **VERIFIED: LIVE**

| Check | Kết quả |
|---|---|
| `https://giatoctrantrongthu.com` | HTTP/2 **200**, **91,191 bytes** — khớp chính xác local `index.html` (91,191 B) |
| Cache-buster | live = repo: `app.js?v=20260914_0102`, `main.css?v=20260914_0103` (identical) |
| `last-modified` | Sep 14 18:05 UTC; `server: Vercel`; HSTS on |
| `www.` | 307 redirect |
| `/design-playground` | 308 → 200 |
| `/admin` | 200 (public reachable — xem Q7.3) |
| Git | local main == origin/main == **0eae852** (GitHub API: "cleanup: remove DESIGN-001…", 2026-09-14T17:47:52Z = 00:47 +07 hôm nay) |

Deployed production == repo HEAD == remote. Không có drift.

### Q2. API domain có trả dữ liệu thật không? — **VERIFIED: LIVE (8/8)**

| Endpoint | HTTP | Content-Length | Khớp recovery report |
|---|---|---|---|
| genealogy.json | 200 | 115,554 | ✓ |
| mach.json | 200 | 581,051 | ✓ |
| media.json | 200 (3/3 retry) | 107,315 | ✓ |
| person_media.json | 200 | 23,920 | ✓ |
| CAL_01/02/03/04.ics | 200 | 25,136 / 25,404 / 6,033 / 1,096 | ✓ |
| Headers | `x-powered-by: Express`, `cf-ray` (SIN/HKG) — Cloudflare proxy + origin sống | | |

Content: genealogy parse được **228 people / 68 families**; CAL_01 chứa **118 `BEGIN:VEVENT`** — dữ liệu thật, không phải stub.

### Q3. Frontend có consume dữ liệu thật không? — **VERIFIED: CÓ**

`src/js/app.js` gọi trực tiếp `https://api.giatoctrantrongthu.com/api/*` cho toàn bộ: genealogy, mach, media, person_media, 4 ICS feeds (CAL_FEEDS). Deployed HTML == repo HEAD (Q1) nên code chạy production chính là code đã kiểm.

---

### Q4. Discrepancy giữa audit cũ (530) và production hiện tại (200)? — **VERIFIED: discrepancy có thật; ROOT CAUSE UNKNOWN**

- Audit (sáng nay) ghi 8/8 endpoint HTTP 530 (error 1033 — origin/tunnel chết).
- Recovery 09:28–09:29 và Investigation 13:45 và verification này (~14:00): tất cả 200.
- **Không tài liệu nào ghi giờ chạy audit** → không xác định được window downtime. Không có quyền đọc Cloudflare Tunnel logs / NAS logs.
- **INFERRED:** tunnel/origin flapped rồi tự hồi phục (giống hiện tượng transient — OBSERVED 1 lần: probe `media.json` đầu tiên của verification này trả rỗng, 3 retry sau đều 200).
- **UNKNOWN:** nguyên nhân gốc outage; tần suất flap.

### Q5. Dependency nào khiến production fragile dù đang UP? — **VERIFIED/OBSERVED**

| # | Fragility | Evidence | Level |
|---|---|---|---|
| F-a | Không static fallback trên Vercel | `/data/genealogy.json` → **404** (tự curl); app.js fetch fail-silent (`.catch(() => ({}))`) → API chết = site renders rỗng | VERIFIED |
| F-b | Single path: mọi data qua 1 CF Tunnel → NAS | kiến trúc + audit; không có monitoring/alerting nào trong repo | VERIFIED (design), UNKNOWN (uptime thực) |
| F-c | **DB credentials nằm trong git ở HEAD hiện tại** | `.git/index` track `server/.env` → blob `69c3823` (114 B) **chứa `DB_PASSWORD`** (giải mã zlib trực tiếp) — xem Q7.2 | VERIFIED |
| F-d | **Admin CRUD API không có authentication** | `server/index.js`: chỉ `cors()` + `express.json()` + static; grep authorization/token/Bearer → 0 hit; POST/DELETE `/api/people|stories|edges|events` mở trên domain public | VERIFIED (code-level) |
| F-e | `git` CLI blocked (Xcode license) | gặp trực tiếp khi verification; cả 4 doc OpenCode cùng ghi | VERIFIED |
| F-f | `FETCH_HEAD` Sep 7 (stale fetch — không ảnh hưởng production) | `.git/FETCH_HEAD` mtime | OBSERVED |

### Q6. Issue nào đã report nhưng CHƯA được verify?

| Item | Report gốc | Trạng thái verify độc lập |
|---|---|---|
| NAS / Node / MariaDB "VERIFIED OK (inferred)" | Recovery + Investigation | Vẫn là **INFERRED** (dữ liệu thật trả về ⇒ origin sống — không đụng trực tiếp được NAS). Không ai verify trực tiếp process/MariaDB. |
| Root cause outage 530 | Recovery §8 | **UNKNOWN** (Q4) |
| `server/.env` trong git history | Wiring Audit + Investigation ghi **UNKNOWN** | **ĐÃ GIẢI QUYẾT BỞI VERIFICATION NÀY: CONFIRMED — blob chứa DB_PASSWORD đang nằm trong cây commit tại HEAD 0eae852 (đã push GitHub)** (Q7.2) |
| Design playground "not verified for full functionality" | Investigation §2.4 | Vẫn UNKNOWN (chỉ verify HTTP 200 + router render được; không test interactive) |
| E2E FAIL "People — lưu mất payload" (PROJECT_STATE, Sep 8) | PROJECT_STATE | **MÂU THẪN VỚI CODE HIỆN TẠI**: handler POST `/api/people` (server/index.js:117-146) đọc `payload` hiện có từ DB rồi merge trước khi `ON DUPLICATE KEY UPDATE ... payload=VALUES(payload)` → payload KHÔNG bị wipe trong code. `server/index.js` mtime Sep 8 00:59, PROJECT_STATE.md Sep 8 01:02 — matrix có thể stale hoặc bug nằm ở layer khác. **UNKNOWN (cần test E2E có kiểm soát mới kết luận được)** |
| Mạch FAIL "lưu mất metadata" | PROJECT_STATE | **OBSERVED (partial)**: schema `stories` chỉ có 6 cột (id,title,author,content,status,updatedAt) — **không có cột nào lưu linkedPeople/images/metadata khác**; API POST stories chỉ nhận 6 field → mọi metadata khác admin nhập bị drop âm thầm. `REPLACE INTO` không phải nguyên nhân (không có cột để mất). |
| Quan hệ FAIL (edges ghi / public đọc families+payload) | PROJECT_STATE | **VERIFIED (code-level)**: `/api/genealogy.json` (index.js:202+) chỉ đọc `people`, `families`, payload — **không hề đọc bảng `edges`** dù admin POST/DELETE edges (index.js:162-176) |

---

### Q7. Issue nào OpenCode có thể bỏ sót?

| # | Finding | Classification |
|---|---|---|
| S-1 | **`GIATOC_INVESTIGATION_01_REPORT.md` (chưa commit, 1/4 doc hôm nay) nhúng DB password PLAINTEXT vào §2.3.** Nếu commit 4 doc này, secret được chính thức đẩy vào git history của repo GitHub `tuantudo/giatoctrantrongthu` | **VERIFIED** (grep: `DB_PASSWORD` 1 hit, password present trong doc) |
| S-2 | `server/.env` **đang được track trong git index tại HEAD hiện tại** — không chỉ "was previously committed". Wiring Audit/Investigation ghi UNKNOWN vì git CLI block; verification này đọc thẳng `.git/index` + giải mã blob → **CONFIRMED credentials trong commit đã push lên GitHub** | **VERIFIED** |
| S-3 | **API write endpoints (POST/DELETE people/stories/edges/events) hoàn toàn không auth**, public qua `api.giatoctrantrongthu.com`. Docs chỉ ghi "Admin Control Room chưa có Authentication" (UI-level) — không ai nêu rõ **API-level** exposure: bất kỳ ai biết endpoint đều mutate được DB production | **VERIFIED (code-level)** |
| S-4 | Metadata stories không có chỗ lưu (schema 6 cột) — UI admin có ô linkedPeople/images nhưng server drop | **OBSERVED** |
| S-5 | `PROJECT_STATE.md` (Sep 8) đã stale so với code hiện tại (People-merge logic) — matrix này đang được dùng làm baseline ra quyết định hôm nay | **OBSERVED** |
| S-6 | admin.* thực tế redirect **307** (docs ghi "301/302") — trivial | OBSERVED |
| S-7 | Rotation MariaDB password bị BLOCKED từ Sep 8 vì "NAS offline" — **NAS hiện online (Q2)** ⇒ điều kiện rotate đã thoả, nhưng không ai reopen việc này | **INFERRED** |

### Q8. Việc nào thực sự cần Human action?

1. **Xcode license** (`sudo xcodebuild -license agree`) — chặn mọi git operation local, đang cản mọi runtime.
2. **Quyết định xử lý secret** (S-1 + S-2 + F-c): rotate MariaDB password (NAS đang online), redact password khỏi `GIATOC_INVESTIGATION_01_REPORT.md` TRƯỚC khi commit, `git rm --cached server/.env` + BFG scrub history.
3. **Quyết định auth cho Admin API** (S-3) — đây là code change production.
4. **Ưu tiên E2E Control Loop** (đúng như PROJECT_STATE NEXT ACTION đang chờ): sửa đọc/ghi edges ↔ payload, schema metadata stories.
5. **Chấp thuận/loon fallback + tunnel monitoring** (đã ghi FOLLOW-UP trong recovery report — chưa ai quyết).

---

## 2. TRẠNG THÁI CUỐI

| Hạng mục | Trạng thái | Căn cứ |
|---|---|---|
| **Production read-path** (frontend + API + data) | **DONE** | Q1–Q3: 200/200/real data, deployed == HEAD == remote, verify độc lập hôm nay |
| **Mission "đóng Giatoc"** | **NOT DONE** | (a) secret trong git HEAD + sắp được commit thêm qua doc chứa password (S-1/S-2); (b) admin API không auth (S-3); (c) E2E write-path chưa xong + PROJECT_STATE stale (Q6); (d) 4 docs chưa commit; (e) root-cause outage UNKNOWN |
| **BLOCKED** | **BLOCKED (Human-only)** | git CLI (Xcode license); Cloudflare Tunnel / NAS logs (không có access); rotate password & scrub history (quyền Owner); auth decision (code production) |
| **NEXT ACTION** | theo thứ tự | (1) Human: `sudo xcodebuild -license agree`; (2) Redact password trong `GIATOC_INVESTIGATION_01_REPORT.md` §2.3 **trước khi commit**; (3) Human: rotate MariaDB password + `git rm --cached server/.env` + BFG; (4) Owner quyết: auth cho admin API + thứ tự E2E (edges-sync, stories metadata); (5) sau đó mới commit 4 docs + close |

**Ghi chú trung thực:** mọi kết luận ở đây dựa trên code + git internals + network checks đọc-được; không có test mutation nào được chạy (chạy sẽ vi phạm READ-ONLY). Claim "NAS/Node/MariaDB LIVE" của recovery vẫn chỉ chắc đến mức *inferred qua dữ liệu trả về*.

**END OF INDEPENDENT VERIFICATION** — no files modified except this report.
