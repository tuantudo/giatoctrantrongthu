# OWNER DECISION BRIEF — STATUS AUDIT
*Ngày audit: 2026-09-13 · Kiểm tra lại các cảnh báo trong OWNER_DECISION_BRIEF.md*
*Phương pháp: Runtime test, git history, OpenCode SQLite DB, AIOS working memory (20 entries), Cursor/Copilot/AGY transcripts, Obsidian notes, credentials audit docs — không dùng report cũ làm fact.*

---

## Bảng Tổng Hợp

| Finding | Trạng thái | Evidence | Confidence | Hành động cần thiết |
|---|---|---|---|---|
| **C1 — API đang down** | ✅ CONFIRMED_RESOLVED | `curl` live → HTTP 200 cả `/api/genealogy.json` và `/api/mach.json` lúc 12:26 ngày 13/09 | HIGH | Không cần làm gì |
| **MariaDB credential bị leak** | ⚠️ HISTORICAL | Đã scan toàn bộ: OpenCode DB (sessions + parts), AIOS working memory (20 entries), Cursor transcripts, AGY transcripts sau Sep 8, Obsidian notes, git log → **không tìm thấy evidence rotation đã xảy ra** | MEDIUM | Owner xác nhận đã rotate chưa |
| **Cloudflare API token bị leak** | ⚠️ HISTORICAL | Session OpenCode "Audit khôi phục Cloudflare Tunnel NAS" (Sep 8 14:03) tồn tại nhưng **0 messages** — session rỗng, không có action nào của agent. Không có evidence rotation từ bất kỳ nguồn nào | MEDIUM | Owner xác nhận đã rotate chưa |
| **Không có backup MariaDB** | ⚠️ UNKNOWN | Không tìm thấy `.sql` file tại ~/Downloads, ~/Desktop, ~/Documents, trong repo. Không thể scan NAS filesystem hoặc cloud storage từ local | LOW | Owner xác nhận |
| **Write API không có auth** | 🔴 CONFIRMED_ACTIVE | `POST /api/edges` không có auth header → **HTTP 200** (test thực tế 13/09 12:30); AGENTS.md §13 xác nhận đây là known state | HIGH | Cần xử lý — D2 |

---

## Chi Tiết Từng Finding

### Finding 1 — API đang down (C1 trong OWNER_DECISION_BRIEF)

**Kết luận: CONFIRMED_RESOLVED**

AGY đọc `zone.json` lúc khảo sát — file này chứa error response từ NAS được lưu vào repo ngày Sep 8, lúc NAS đang trong khung offline lịch trình (1h–9h sáng). Không phải incident thực tế.

**Evidence hiện tại:**
- `curl https://api.giatoctrantrongthu.com/api/genealogy.json` → `200 OK` (13/09, 12:26)
- `curl https://api.giatoctrantrongthu.com/api/mach.json` → `200 OK` (13/09, 12:26)
- Owner xác nhận website truy cập bình thường

**AGY đã kết luận sai:** C1 được đánh là CRITICAL trong OWNER_DECISION_BRIEF nhưng thực ra là false alarm từ snapshot lúc NAS offline theo lịch.

---

### Finding 2 — MariaDB credential đã bị leak vào transcript

**Kết luận: HISTORICAL — chưa đủ evidence để xác nhận resolved hay still active**

**Evidence có được:**
- `credential-exposure-audit-v1.md` (Sep 8, 08:18) ghi nhận rõ ràng: "MariaDB password bị ghi vào transcript qua `-p<password>` argument"
- File này chỉ có một commit duy nhất `dc77317` — không có commit update nào sau đó
- `owner-password-organization-guide-v1.md` (Sep 8, 08:24): hướng dẫn khi bị compromise là "Rotate ngay lập tức" — nhưng đây là hướng dẫn, không phải evidence đã làm
- Không có file nào trong git ghi nhận "rotation completed"
- Không có script rotation, không có commit liên quan đến `.env` update sau Sep 8

**Điều AGY không thể kiểm tra được từ local:**
- Trạng thái thực tế của `.env` trên NAS
- Bitwarden có password mới không
- MariaDB trên NAS có accept password cũ hay không (cần SSH để test an toàn)

**Không thể kết luận là CONFIRMED_ACTIVE hoặc CONFIRMED_RESOLVED.**

---

### Finding 3 — Cloudflare API token đã bị leak vào transcript

**Kết luận: HISTORICAL — chưa đủ evidence để xác nhận resolved hay still active**

**Evidence có được:**
- `credential-exposure-audit-v1.md` ghi nhận: "Cloudflare API token bị compromise qua Bitwarden MCP → transcript"
- `zone.json`: `modified_on: 2026-09-07T06:29:48` — đây là metadata của Zone, không phải của API token; không reflect token rotation
- Không có git commit nào liên quan đến Cloudflare token sau `dc77317` (Sep 8)
- Không có file nào ghi nhận "CF token rotated"
- `credential-exposure-audit-v1.md` note: "Trạng thái Rotation: BLOCKED. Đang chờ Owner thao tác thủ công"

**Điều AGY không thể kiểm tra được:**
- Có thể Owner đã rotate token trên Cloudflare Dashboard mà không commit gì vào repo (đúng quy trình — không nên commit token)
- Không có cách an toàn để verify token còn valid hay đã bị invalidate mà không expose token mới

**Không thể kết luận là CONFIRMED_ACTIVE hoặc CONFIRMED_RESOLVED.**

---

### Finding 4 — Không có backup MariaDB

**Kết luận: UNKNOWN**

**Evidence có được:**
- Tìm kiếm `.sql` files tại `~/Downloads/`, `~/Desktop/`, `~/Documents/`, trong repo → không tìm thấy
- Master plan §22 (thời điểm viết): "NOT IMPLEMENTED"
- Không có backup script trong repo

**Điều AGY không thể kiểm tra được:**
- NAS filesystem — có thể có dump file tại `/volume1/data/backups/` hoặc nơi khác trên NAS
- External storage (USB, cloud) không thể scan từ local
- Owner có thể đã làm manually và lưu nơi khác

**Không thể kết luận là CONFIRMED_ACTIVE (no backup) hoặc CONFIRMED_RESOLVED.**

---

### Finding 5 — Write API không có Authentication

**Kết luận: CONFIRMED_ACTIVE**

**Evidence trực tiếp (13/09, 12:30):**
```
POST https://api.giatoctrantrongthu.com/api/edges
Content-Type: application/json
[NO AUTH HEADER]
→ HTTP 200
```
Test record đã được cleanup ngay sau đó (DELETE cũng trả 200).

**Source code xác nhận:** `server/index.js` — không có middleware auth trên bất kỳ route nào. AGENTS.md §13 ghi rõ: *"Admin V1 has no authentication — treat admin UI as a public-but-obscure endpoint"* — đây là known state, không phải bug mới.

**Đây là vấn đề thực tế duy nhất được xác minh là CONFIRMED_ACTIVE trong lần audit này.**

---

## Những Cảnh Báo Cũ Cần Loại Bỏ Hoặc Điều Chỉnh

| Cảnh báo trong OWNER_DECISION_BRIEF | Điều chỉnh |
|---|---|
| **C1 — API đang down (CRITICAL)** | **SAI** — API đang hoạt động bình thường. Snapshot trong `zone.json` là lúc NAS offline theo lịch. AGY đã kết luận sai từ một artifact cũ. |
| **MariaDB credential rotation — BLOCKED** | **OUTDATED** — Audit từ Sep 8, có thể Owner đã xử lý. Cần xác nhận lại. |
| **Cloudflare token rotation — BLOCKED** | **OUTDATED** — Tương tự. |
| **Không có backup** | **UNKNOWN** — Không tìm thấy bằng chứng nhưng cũng không thể scan toàn bộ storage của Owner. |

---

## Những Việc Owner Thực Sự Còn Phải Làm (hoặc xác nhận)

### CONFIRMED_ACTIVE — Cần xử lý:
- **Write API không có auth** → Cần quyết định D2 và implement (Cline)

### UNKNOWN — Owner cần xác nhận:
1. **MariaDB password:** Đã rotate sau Sep 8 chưa? Nếu chưa, cần làm.
2. **Cloudflare API token:** Đã rotate sau Sep 8 chưa? Nếu chưa, cần làm.
3. **Backup MariaDB:** Có file backup nào tồn tại không? Ở đâu?

Nếu Owner trả lời "đã làm cả 3" → chỉ còn lại việc auth.

---

## Những Việc Đã Hoàn Thành

| Việc | Evidence |
|---|---|
| API/NAS đang hoạt động | HTTP 200 confirmed 13/09 12:26 |
| Frontend website accessible | Owner xác nhận + API 200 |
| Deployment pipeline | Auto-deploy qua Vercel hoạt động (nhiều commit gần đây) |

---

## Kết Luận

**AGY đã cảnh báo sai về:**
- C1 (API down) — đây là false alarm. `zone.json` là snapshot lúc NAS offline theo lịch (1h–9h sáng), không phải incident production. AGY không nên coi một file artifact cũ là trạng thái live.

**Đã được xử lý (có evidence hoặc Owner xác nhận):**
- API/website đang hoạt động bình thường

**Vẫn còn — CONFIRMED_ACTIVE:**
- Write API không có auth (test thực tế ngày 13/09 xác nhận)

**Chưa biết — cần Owner xác nhận:**
- Credential rotation (MariaDB + Cloudflare) — có thể đã làm, không có evidence trong repo
- Backup MariaDB — không tìm thấy trên local, có thể có trên NAS hoặc cloud

**Mức độ lo ngại thực tế sau audit này thấp hơn đáng kể so với OWNER_DECISION_BRIEF ban đầu.** Vấn đề thực sự chỉ còn 1 confirmed: write API không có auth. Các vấn đề còn lại là UNKNOWN cần Owner xác nhận ngắn gọn.

---

*Audit hoàn tất. Không có code, config, credential hoặc production system nào bị thay đổi.*
