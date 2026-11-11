# OWNER DECISION BRIEF — giatoctrantrongthu.com
*Ngày: 2026-09-12 · Dựa trên: PROJECT_STATE, PROJECT_ARCHITECTURE, PROJECT_DECISIONS, Master Plan v1, Architecture Report, MCP Audit, source code, git history*

> **Mục đích:** Giúp Owner ra quyết định — không phải document thêm một kế hoạch.

---

## 1. EXECUTIVE SUMMARY

**Ta đang có gì?**
Một website phả hệ gia đình đang hoạt động: giao diện đẹp, 228 người trong database, 20 bài viết MẠCH, 4 ICS calendar feeds, deployment CI/CD qua Vercel + Cloudflare Tunnel + NAS. Kiến trúc 4 lớp đã đúng hướng. Design system chất lượng cao. Domain model và ontology được thiết kế nghiêm túc.

**Hệ thống đã trưởng thành đến đâu?**
- Frontend: ~80% — làm được nhiều, thiếu modularization
- Backend API: ~40% — routes có, không có auth, không có validation, data paths bị tách đôi
- Data: ~50% — có data thật nhưng inconsistent giữa hai nguồn
- Operations: ~20% — không có backup, không có monitoring, không có auth
- AI: 0% — chatbot MVP là hardcoded text, chưa có gì thật

**Vấn đề nguy hiểm nhất hiện nay?**
1. [THỰC TẾ] API đang down — `ECONNREFUSED 3306`. Website không load data. Cần Owner SSH vào NAS và fix.
2. [THỰC TẾ] Toàn bộ write API không có auth — bất kỳ ai biết URL có thể xóa/ghi dữ liệu gia phả.
3. [THỰC TẾ] Không có backup MariaDB — nếu NAS hỏng thì mất 228 records.

**Chatbot hiện tại thực sự làm được gì?**
[THỰC TẾ] `chatbot-app/src/app/api/chat/route.ts` — 22 dòng, stream một câu text cố định. Không có LLM, không có data thật, không có tool. Nó là một UI demo — đẹp, pattern đúng, nhưng chưa làm được gì thật.

**Điều gì KHÔNG nên làm lúc này?**
- Migrate toàn bộ website sang Next.js — không có lý do đủ thuyết phục
- Xây RAG/vector DB — 228 records + 20 articles fit trong context window
- Xây full membership/authentication system — trước khi backend stable
- Đưa AI vào production — trước khi có auth boundary

**Bước tiếp theo hợp lý nhất là gì?**
Owner fix NAS trong 30 phút → sau đó Cline fix auth + data integrity trong 1 sprint → sau đó AI endpoint đơn giản có thể làm.

---

## 2. SYSTEM REALITY

[THỰC TẾ]

```
Browser
  └─▶ Vercel CDN (giatoctrantrongthu.com)
        ├─ index.html + src/js/app.js (vanilla SPA, hash routing)
        └─ admin/ (Control Room, NO AUTH)
              │
              └─▶ fetch https://api.giatoctrantrongthu.com/*
                        │
                        └─▶ Cloudflare Zero Trust Tunnel
                                  │
                                  └─▶ NAS Synology DS223j (1GB RAM)
                                            ├─ Node.js Express (port 3000)
                                            │     server/index.js — 363 dòng
                                            │     NO AUTH, NO VALIDATION
                                            ├─ MariaDB 10 (port 3306)
                                            │     DB: family_archive
                                            │     STATUS: ECONNREFUSED ← DOWN NOW
                                            └─ Filesystem /volume1/web/
                                                  STATUS: UNVERIFIED
```

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Frontend (Vercel) | ✅ Live | Load nhưng API fail → blank data |
| Admin (Vercel) | ✅ Live | No auth — exposed |
| Cloudflare Tunnel | ✅ Healthy | Theo CAY_GIA_PHA_STRATEGIC_PLAN |
| Node.js API | ❌ DOWN | ECONNREFUSED 3306 |
| MariaDB | ❌ DOWN | Password mismatch sau rotation |
| Media binary (NAS fs) | ❓ UNKNOWN | Docs có nhắc, chưa verify được |
| chatbot-app | ✅ Build OK | Demo only — hardcoded text |

---

## 3. WHAT IS ACTUALLY WORKING?

[THỰC TẾ — xác minh từ source code, git history, strategic plan]

Những thứ này đang tốt và không cần đụng vào:

| Thứ | Bằng chứng | Giá trị |
|---|---|---|
| **Deployment pipeline** | git push → Vercel auto-build, đã hoạt động nhiều tháng | Không cần thay |
| **Design system** | `src/css/main.css` 4,550 dòng — Documentary Intimacy, nhất quán | Chất lượng cao |
| **Routing / SPA** | Hash routing, 10 routes, tested | Không cần SSR |
| **Calendar (ICS)** | 4 ICS feeds từ MariaDB, E2E PASS — duy nhất module pass | Tốt nhất trong project |
| **MẠCH articles** | `data/mach.json` v3.0 — 19 articles structured, well-formed | Best AI candidate |
| **Genealogy tree renderer** | Pan/zoom, generation bands, focus mode — đã fix iPhone | Làm được nhiều |
| **Domain Model + Ontology** | 3-tầng, 7 mức confidence, reified relationships | Vượt xa mức cần cho MVP |
| **MariaDB schema** | 228 people, 68 families, 20 stories — data thật | Nền tảng tốt |
| **chatbot UI shell** | `chatbot-app/` — component pattern đúng, streaming, citations UI | Reusable components |
| **Cloudflare Tunnel** | Zero Trust, không cần expose IP NAS | Đúng approach |

---

## 4. WHAT IS ACTUALLY BROKEN / DANGEROUS?

### CRITICAL — Phải xử lý trước khi làm bất kỳ thứ gì khác

**C1 — API đang down (ECONNREFUSED 3306)**
- **Evidence:** [THỰC TẾ] `zone.json` trong repo chứa error response thực từ NAS. `server/index.js` kết nối MariaDB qua `DB_PASSWORD` trong `.env`. Sau sự cố đổi password, `.env` trên NAS chưa được update.
- **Impact:** Toàn bộ website không load data. 100% blank.
- **Urgency:** NGAY BÂY GIỜ
- **Action:** Owner SSH vào NAS → update `server/.env` → `pm2 restart all`

**C2 — Toàn bộ write endpoint không có authentication**
- **Evidence:** [THỰC TẾ] `server/index.js` — `POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`, `POST /api/events` — không có middleware auth nào. Master plan E2 confirms: `POST /api/edges → {"success":true}`.
- **Impact:** Bất kỳ ai có thể ghi/xóa dữ liệu gia phả từ bất cứ đâu.
- **Urgency:** Sau khi C1 fix — trong sprint đầu tiên
- **Action:** Thêm `X-Admin-Key` header middleware vào write endpoints (Cline có thể làm, scope nhỏ)

**C3 — Không có backup MariaDB**
- **Evidence:** [THỰC TẾ] Master plan §22 "Backup/recovery: NOT IMPLEMENTED". Không có dump script, không có restore drill, không có offsite copy.
- **Impact:** Nếu NAS hỏng = mất toàn bộ 228 records, 68 families, 20 stories
- **Urgency:** Ngay sau C1
- **Action:** Owner chạy `mysqldump family_archive > backup_$(date +%Y%m%d).sql` → lưu ra ngoài NAS

---

### HIGH — Quan trọng nhưng không chặn development ngay

**H1 — Write path ≠ Read path (data divergence)**
- **Evidence:** [THỰC TẾ] Admin `POST /api/edges` → ghi vào bảng `edges`. Nhưng `GET /api/genealogy.json` chỉ đọc bảng `families`, bỏ qua `edges`. Admin `POST /api/stories` ghi relational columns nhưng Public API đọc cột `payload`.
- **Impact:** Data được Admin nhập không hiển thị trên Public Web.
- **Action:** Fix query trong `server/index.js` (Cline, ~2h)

**H2 — Credentials bị leak vào transcript**
- **Evidence:** [THỰC TẾ] `credential-exposure-audit-v1.md` — Cloudflare API token + MariaDB password đã bị ghi vào `transcript.jsonl`. Rotation chưa hoàn tất vì NAS offline.
- **Action:** Owner rotate sau khi NAS online (Cloudflare Dashboard + NAS mysql)

---

### MEDIUM — Xử lý theo roadmap

- Monolith `app.js` 2,901 dòng — khó maintain, nhưng đang hoạt động
- `payload` blob anti-pattern — hai sources of truth trong cùng một record
- `admin/js/mockData.js` chưa bị xóa
- Stack trace exposed trong API errors (`res.json({error: e.message})`)
- `people.json` root file empty (1KB, 0 bytes hợp lệ)
- `zone.json` commit vào repo (chứa account info)
- MẠCH count drift: 19 trong JSON tracked vs 20 trong MariaDB
- Validation paths `validate_integrity.py` trỏ sai thư mục

---

### LOW — Chưa cần quan tâm

- CSS duplicate tokens (10 tokens)
- SQLite fallback code còn trong server
- `npx @latest` không pin version trong MCP config

---

## 5. WHAT SHOULD OWNER DECIDE NOW?

*Chỉ những quyết định nếu không quyết định thì bước tiếp theo bị block.*

---

### D1 — MariaDB là canonical source of truth

**Vấn đề:** Hiện có hai nguồn dữ liệu: MariaDB (228 records) và các file JSON (local 223 records). Frontend đọc từ API → MariaDB. Nhưng JSON files vẫn tồn tại và validators trỏ vào đó.

**Bằng chứng:** [THỰC TẾ] Master plan §22 "228 vs 223; backend reads DB, frontend reads DB". `PROJECT_DECISIONS.md` D01 đã approve "MariaDB làm database".

**Các lựa chọn:**
- **Option A:** Xác nhận MariaDB là canonical, JSON là legacy fixture (không commit vào repo nữa)
- **Option B:** Giữ song song — continue conflict

**Khuyến nghị:** [ĐỀ XUẤT] Option A — quyết định này thực chất đã được đưa ra rồi (D01 approved), chỉ cần confirm rõ ràng để có thể repoint validators.

**Hệ quả nếu chọn A:** Validators được repoint sang DB query, JSON files được archive/remove, pipeline sạch hơn.

**Hệ quả nếu chọn B:** Conflict tiếp tục, test/CI không có ý nghĩa thực.

**Mức độ khẩn cấp:** SOON (trước khi sửa validators)

---

### D2 — Authentication: ai có quyền ghi dữ liệu?

**Vấn đề:** Hiện tại không có auth. Cần quyết định trước khi implement — nếu không sẽ implement sai hướng.

**Bằng chứng:** [THỰC TẾ] Write API hoàn toàn public. Admin Control Room không có login.

**Các lựa chọn:**
- **Option A (Minimal — làm ngay):** API key bí mật trong header `X-Admin-Key`. Admin web đọc từ localStorage. Không cần user registration.
- **Option B (Email login — làm sau):** Session-based auth, email/password, chỉ cho Admin.
- **Option C (Full membership — làm sau nhiều):** Google OIDC, membership flow, family visibility.

**Khuyến nghị:** [ĐỀ XUẤT] Option A ngay để close critical gap, plan B cho giai đoạn tiếp theo. Option C chỉ khi website có nhiều thành viên thực sự muốn đăng nhập.

**Hệ quả nếu chọn A:** Admin cần biết API key — lưu trong Bitwarden. Không cần user accounts.

**Hệ quả nếu bỏ qua:** Write endpoints tiếp tục exposed public.

**Mức độ khẩn cấp:** BLOCKER — phải quyết định trước khi Cline implement auth.

---

### D3 — AI endpoint: Gemini, Claude, hay OpenAI?

**Vấn đề:** Khi add AI backend, cần chọn provider để setup key. Lựa chọn này ảnh hưởng đến cost và lock-in.

**Bằng chứng:** [THỰC TẾ] `chatbot-app/.env.example` có placeholder cho cả 3. Không có key nào được set.

**Các lựa chọn:**
- **Option A:** Gemini Flash (Google) — free tier rộng, cost thấp, context 1M tokens
- **Option B:** Claude Haiku (Anthropic) — quality cao hơn, cost trung bình
- **Option C:** GPT-4o-mini (OpenAI) — quen thuộc nhất, cost thấp

**Khuyến nghị:** [ĐỀ XUẤT] Option A (Gemini Flash) cho giai đoạn đầu — context window 1M tokens phù hợp với "inject toàn bộ MẠCH + genealogy summary" mà không cần RAG. Đổi provider sau thì dễ nếu architecture đúng.

**Architecture requirement không thể thỏa hiệp:** API key KHÔNG được nằm ở frontend. Mọi AI call phải qua `POST /api/ai/chat` trên NAS server.

**Mức độ khẩn cấp:** LATER — chỉ quyết định khi Phase 1 (auth + data fix) đã xong.

---

## 6. WHAT DOES NOT NEED OWNER DECISION YET?

Những thứ này có thể để sau — không cần quyết định trong sprint này:

| Thứ | Lý do để sau |
|---|---|
| **Full membership + user accounts** | Cần auth simple trước (D2-A) |
| **ReBAC / family visibility rules** | Cần identity trước |
| **Places domain** | Chưa có nhu cầu thực tế phát sinh |
| **Brand Manifest** | CSS đang hoạt động tốt — chưa có developer team cần token system |
| **Media architecture chi tiết** | Path chưa verify được — quyết định khi verify xong |
| **UGC / community submissions** | Cần auth + moderation trước |
| **Control Plane lớn** | Admin hiện tại đủ dùng |
| **Audit trail** | Sau khi có auth |
| **RAG / vector search** | 228 records fit trong context |
| **Next.js migration** | Vanilla JS đang hoạt động, không có lý do đủ mạnh |

---

## 7. AI STRATEGY

### AI có nên xây ngay không?

**Chưa.** Nhưng không phải vì AI khó — mà vì backend chưa stable.

Thứ tự đúng:
```
Fix NAS (C1) → Auth (D2) → Data integrity (H1) → AI endpoint → AI interface
```

Nếu bỏ qua thứ tự này và xây AI trước: AI sẽ đọc data inconsistent, không có auth boundary, không có rate limit → rủi ro cao với chi phí không kiểm soát.

---

### 6 Lớp AI — Trạng Thái Hiện Tại

| Layer | Tên | Hiện trạng | Khi nào xây |
|---|---|---|---|
| **Layer 1** | Chat UI | ✅ Có (chatbot-app shell) | Reuse khi sẵn sàng |
| **Layer 2** | AI Gateway / proxy | ❌ Chưa có | Cùng lúc với Layer 3 |
| **Layer 3** | Knowledge (data) | ⚠️ Có data, không có retrieval API | Phase 2 |
| **Layer 4** | Retrieval / grounding | ❌ Chưa có | Phase 3 — context injection trước, RAG sau |
| **Layer 5** | Tools (MCP/API) | ❌ Chưa có | Phase 4 |
| **Layer 6** | Memory | ❌ Chưa có | Phase 4+ |

### Kiến trúc bắt buộc khi add AI

```
Frontend
  └─▶ POST /api/ai/chat  (NAS Express — Layer 2)
            ├─ API key: .env trên NAS (KHÔNG phải frontend, KHÔNG phải Vercel env)
            ├─ Model: hardcoded tại server (client không chọn được)
            ├─ Rate limit: 10 req/min/IP
            ├─ Token limit: 2000 tokens/request
            ├─ Usage logging: date, tokens, cost estimate
            ├─ Kill switch: env AI_ENABLED=false → 503
            └─▶ Gemini/Claude/OpenAI API
                      └─ System prompt chứa:
                           - MẠCH articles (19 articles, ~30K tokens)
                           - Genealogy summary
                           - Ontology rules (confidence levels)
```

**Có bị lock vào một provider không?**
[ĐỀ XUẤT] Không, nếu design đúng: tất cả provider call nằm trong một module riêng (`server/lib/ai-provider.js`), route `/api/ai/chat` không biết provider cụ thể. Đổi Gemini → Claude = thay env var `AI_PROVIDER`. Frontend không thay gì.

**API key + quota + cost control nằm ở đâu?**
→ Tại `server/.env` (NAS). Không bao giờ tại Vercel env (frontend) hoặc client bundle.

---

## 8. CHATBOT MVP — ĐÁNH GIÁ THỰC

[THỰC TẾ] `chatbot-app/src/app/api/chat/route.ts` = 22 dòng hardcoded text streaming.

| Câu hỏi | Đánh giá |
|---|---|
| Nó chứng minh được điều gì? | Cline có thể xây Next.js app với component architecture tốt, streaming UI đẹp, pattern đúng |
| Nó chưa chứng minh được điều gì? | LLM integration thật, data grounding, tool calling, source citation thật |
| Phần UI có nên giữ? | **Có** — `chat-shell`, `chat-message`, `source-citation`, `tool-activity` reusable |
| Kiến trúc có đủ tốt để nối backend thật? | **Có** — `useChat` hook từ `@ai-sdk/react` là đúng pattern |
| Có cần migrate toàn website sang Next.js? | **Không** — không có lý do đủ mạnh |
| Có nên giữ chatbot như app độc lập? | **Tùy Owner** — có thể embed vào `index.html` hoặc giữ `/chat` route riêng |

[SUY LUẬN] Đường ngắn nhất để có AI thật: thêm `/api/ai/chat` vào `server/index.js` (không cần Next.js), vanilla JS fetch trong `index.html`. Chatbot-app Next.js chỉ cần nếu muốn route `/chat` riêng biệt.

---

## 9. RECOMMENDED FIRST VERTICAL SLICE

[ĐỀ XUẤT]

> **"Hỏi đáp về MẠCH — AI trả lời dựa trên dữ liệu thật, có citation, có cost control, đổi được model"**

**Scope nhỏ:**
- Frontend: Ô chat đơn giản trong `index.html` (không cần Next.js)
- Backend: `POST /api/ai/chat` tại NAS Express — proxy ra Gemini Flash
- Data: System prompt inject 19 MẠCH articles (~30K tokens, không cần RAG)
- Security: Rate limit AI endpoint, auth cho write endpoints (riêng biệt)
- Observability: Log mỗi AI request + token count
- Provider abstraction: `server/lib/ai-provider.js` — đổi model bằng env var

**Tại sao MẠCH thay vì genealogy?**
- MẠCH data là structured nhất, đã tracked trong git, không bị conflict
- Genealogy data hiện đang inconsistent (edges ≠ families bug) — cần fix trước
- MẠCH articles có narrative rõ ràng — AI trả lời tốt hơn

**Definition of Done:**
- Hỏi "Bài viết MẠCH số 01 nói về gì?" → AI trả lời đúng từ data thật
- Citation hiển thị tên bài viết
- Cost được log
- Không có API key nào trong client bundle
- Đổi model bằng thay env var `AI_MODEL=gemini-flash`

---

## 10. CLINE vs AGY — PHÂN CHIA VAI TRÒ

[ĐỀ XUẤT]

| Việc | Ai làm |
|---|---|
| Discovery, audit, architecture decision | **AGY** |
| Brief, planning, evaluation, verification | **AGY** |
| Viết code implementation (rõ scope) | **Cline** |
| UI components, CSS, tests | **Cline** |
| Fix bugs có spec rõ | **Cline** |
| SSH vào NAS, rotate credentials | **OWNER** |
| Architecture decision (D1, D2, D3) | **OWNER** |
| Approve và merge vào production | **OWNER** |

**Nguyên tắc:** AGY không implement. Cline không plan. Không để hai agent cùng sửa một file trong cùng một session.

---

## 11. RECOMMENDED NEXT 3 STEPS

### Step 1 — Owner fix NAS (30 phút, chỉ Owner làm được)

**Objective:** Khôi phục API về trạng thái hoạt động

**Owner action:**
```bash
ssh <user>@<nas-ip>
cd /volume1/web/family-api
nano .env       # update DB_PASSWORD
pm2 restart all
curl http://localhost:3000/api/genealogy.json | head -20
```

**Agent action:** Không có — không được thực hiện lệnh chứa credentials

**Definition of Done:** `curl https://api.giatoctrantrongthu.com/api/genealogy.json` → JSON với `individuals: 228`

**Must NOT happen:** Agent thực hiện bất kỳ SSH command nào chứa password

---

### Step 2 — Cline: Fix auth + data integrity (1 sprint, ~4-6h)

**Objective:** Close 3 gaps: auth, data read path, admin mock

**Owner action trước:** Quyết định D2 → cung cấp cho Cline spec rõ ràng

**Agent action (Cline):**
1. Thêm `X-Admin-Key` middleware vào tất cả write endpoints trong `server/index.js`
2. Fix `genealogy.json` — đọc từ `edges` table thay vì chỉ `families`
3. Fix `stories` endpoint — đọc đúng columns, không phụ thuộc `payload` null
4. Remove `admin/js/mockData.js`
5. Add `GET /api/health` endpoint trả về DB status

**Owner action sau:** Review code → commit → rsync lên NAS → restart PM2

**Definition of Done:**
- `POST /api/edges` không có header → 401
- `POST /api/edges` có đúng header → 200
- Thêm quan hệ qua Admin → xuất hiện trên Public Web
- Admin không còn load mock data

**Must NOT happen:** Cline tự sửa `.env`, tự deploy lên NAS, tự thay đổi production database

---

### Step 3 — Backup + Monitoring (Owner, 1h)

**Objective:** Không còn single point of failure không được backup

**Owner action:**
```bash
# Backup MariaDB — lưu ra ngoài NAS
mysqldump -u <user> -p family_archive > ~/backup_$(date +%Y%m%d).sql
# Copy lên Dropbox / Google Drive / external disk

# Setup UptimeRobot (free tier)
# Monitor: https://api.giatoctrantrongthu.com/api/health
# Alert: email khi down > 5 phút
```

**Agent action:** Cline viết `GET /api/health` endpoint (đã có trong Step 2)

**Definition of Done:** Có ≥1 backup file tại nơi khác NAS. UptimeRobot gửi alert khi API down.

**Must NOT happen:** Backup lưu trên cùng NAS — phải lưu ở nơi khác.

---

## 12. DO NOT DO YET

| Việc | Lý do |
|---|---|
| **Migrate frontend sang Next.js** | Vanilla JS đang làm việc tốt. Không có lý do cụ thể |
| **Xây RAG / vector database** | 228 records + 20 articles fit trong context window Gemini 1M |
| **Full membership system** | Cần simple auth (D2-A) trước |
| **Full ReBAC / family visibility** | Cần identity foundation trước |
| **AI chatbot full-featured** | Backend chưa stable, auth chưa có |
| **Knowledge Graph DB full implementation** | Premature khi data chưa normalized |
| **Cài thêm MCP cho Cline** | 4 MCPs hiện tại đã đủ cho development workflow |
| **Control Plane lớn** | Admin hiện tại đủ dùng cho 1-2 editor |
| **UGC / community submissions** | Cần moderation system + auth trước |
| **PostgreSQL migration** | MariaDB đang hoạt động, chi phí migration không có lợi ích rõ ràng |

---

## 13. OWNER DECISION CARD

| # | Quyết định | Khuyến nghị | Owner action |
|---|---|---|---|
| **D1** | MariaDB = canonical, JSON = legacy fixture | ✅ Option A | `APPROVE / MODIFY / REJECT` |
| **D2** | Auth: `X-Admin-Key` header (minimal, làm ngay) | ✅ Option A | `APPROVE / MODIFY / REJECT` |
| **D3** | AI provider: Gemini Flash, backend proxy | ⏸ Để sau Phase 1 | `APPROVE / DEFER / REJECT` |

*Chỉ D1 và D2 cần quyết định ngay. D3 có thể để sau.*

---

## 14. FINAL RECOMMENDATION

Nếu đây là hệ thống của tôi, tôi sẽ:

1. **Owner fix NAS ngay hôm nay** — 30 phút. Không có agent nào làm thay được. Đây là blocker số 1.
2. **Backup MariaDB ngay sau đó** — trước khi Cline chạm vào bất kỳ dòng code backend nào.
3. **Owner quyết định D1 + D2** — để Cline có spec rõ trước khi implement.
4. **Cline fix auth + data integrity trong 1 sprint** — scope nhỏ, rõ ràng, có thể verify.
5. **Không đụng vào AI** cho đến khi backend stable và auth có.
6. **Khi ready cho AI:** inject MẠCH articles vào system prompt, gọi Gemini Flash qua backend proxy — không cần RAG, không cần vector DB.

**Rủi ro lớn nhất hiện tại:** Write API không có auth + không có backup = một người xấu hoặc một accident có thể xóa toàn bộ dữ liệu gia phả và không có cách recover.

**Điều tôi không chắc:** Media binary path trên NAS — chưa verify được từ local. Cần Owner xác nhận `/volume1/web/family-api/assets/images/` có data thật không và có bao nhiêu files.

**AI sẽ tạo ra giá trị thật khi:** Người dùng hỏi "Cụ Thu là ai?" và AI trả lời dựa trên data thật từ MẠCH + genealogy, với citation rõ ràng, không hallucinate. Đó là bước tiếp theo thực tế — không phải "AI-powered knowledge platform".

---

*Báo cáo kết thúc. Không có code, schema, config, hay deployment nào bị thay đổi.*
*Chờ Owner review và quyết định D1, D2 trước khi tiếp tục.*
