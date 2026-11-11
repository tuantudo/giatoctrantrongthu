# PRODUCTION WIRING AUDIT

**Audit Role:** OpenCode (Independent Technical Audit)
**Project:** giatoctrantrongthu
**Date:** 2026-09-15
**Mode:** READ-ONLY — no changes to any production component

---

## WIRING TABLE

| Layer | Status | Current Target | Verified Evidence | Gap | Action |
|-------|--------|---------------|-------------------|-----|--------|
| **Git** | ✓ OK | `main` @ `0eae852` | `git rev-parse HEAD/origin/main` match | None | — |
| **Vercel Project** | ✓ OK | `giatoctrantrongthu` (`prj_jwHYW33ioSD0SfOhKhY0lU9dEoV3`) | `.vercel/project.json`, `vercel ls` | None | — |
| **Vercel Production** | ✓ OK | Latest deployment: 4m ago, Ready, Production | `vercel ls` output | None | — |
| **Custom Domain** | ✓ OK | `giatoctrantrongthu.com` attached to canonical project | `vercel domains ls` | None | — |
| **DNS: frontend** | ✓ OK | `giatoctrantrongthu.com` → `76.76.21.21` (Vercel A) | `dig` | None | — |
| **DNS: www** | ✓ OK | `www.giatoctrantrongthu.com` → `cname.vercel-dns.com` | `dig` | None | — |
| **DNS: api** | ⚠ PRESENT | `api.giatoctrantrongthu.com` → `172.67.143.63`, `104.21.27.162` (Cloudflare proxy) | `dig` | Tunnel state unknown | Verify tunnel is running on NAS |
| **Frontend** | ⚠ DEGRADED | Hardcoded `https://api.giatoctrantrongthu.com/api/*` in `src/js/app.js:48-92` | `rg` source | No static data fallback — app renders empty when API down | Add fallback data or verify API uptime |
| **API Domain** | ✗ DOWN | `api.giatoctrantrongthu.com` → HTTP 530 (error 1033) | `curl -sI` all 8 endpoints | **ALL endpoints unreachable** | Restart Cloudflare Tunnel + Node.js service on NAS |
| **Cloudflare Tunnel** | ✗ DOWN | Tunnel offline or origin service unreachable | HTTP 530 + `cf-ray` header confirms Cloudflare proxy active but origin dead | Tunnel process likely stopped | Check `cloudflared` process on NAS |
| **NAS** | NOT VERIFIED | `100.80.147.119` (Tailscale IP from `server/.env`) | `server/.env` config | Cannot SSH/inspect from here | Owner must verify NAS service status |
| **Node.js/Express** | NOT VERIFIED | Port 3000, binds `127.0.0.1` | `server/index.js:361-362` | Cannot reach — tunnel down | Owner must check `node index.js` process on NAS |
| **MariaDB** | NOT VERIFIED | `100.80.147.119:3306`, database `family_archive` | `server/.env` config | Cannot connect from here | Owner must verify MariaDB is running on NAS |
| **Filesystem/Media** | NOT VERIFIED | NAS `/volume1/web/family-api/assets/images/` | `AGENTS.md` reference | Cannot access from here | Owner must verify media files exist |
| **Real Data** | ✗ DOWN | Production frontend expects live API data (genealogy, MACH, media, calendars) | `src/js/app.js:48-92` | **Zero data served when API is down** — all fetch calls fail silently | API must come back online for production to function |
| **TLS/HTTPS** | ✓ OK | Valid TLS on all domains | `curl -sI` shows `HTTP/2 200`/`530` over HTTPS | None | — |
| **Secrets/Environment** | ⚠ PRESENT | `server/.env` contains DB credentials (gitignored but was previously committed) | `git ls-files`, `.gitignore` | File is gitignored now; verify no secrets in git history | `git filter-branch` or BFG if credentials appear in history |
| **Static Data on Vercel** | ✗ ABSENT | `/data/mach.json` → 404, `/data/genealogy.json` → 404 | `curl -sI` | No local data fallback deployed to Vercel | Consider deploying static JSON to Vercel as fallback |

---

## CRITICAL BLOCKERS

### 1. API COMPLETELY DOWN (SEVERITY: CRITICAL)

`api.giatoctrantrongthu.com` returns **HTTP 530** (Cloudflare error 1033) on ALL 8 endpoints:

| Endpoint | HTTP Status |
|----------|-------------|
| `/api/genealogy.json` | 530 |
| `/api/mach.json` | 530 |
| `/api/media.json` | 530 |
| `/api/person_media.json` | 530 |
| `/api/calendars/CAL_01_BIRTHDAYS.ics` | 530 |
| `/api/calendars/CAL_02_PATRON_FEASTS.ics` | 530 |
| `/api/calendars/CAL_03_MEMORIALS.ics` | 530 |
| `/api/calendars/CAL_04_FAMILY_MILESTONES.ics` | 530 |

**Impact:** Production frontend (`giatoctrantrongthu.com`) renders with **empty data** — no genealogy, no MADR, no media, no calendars. The app is visually live but functionally dead.

**Root cause (inferred):** Cloudflare Tunnel to NAS is offline. The `cf-ray` header confirms Cloudflare is proxying, but error 1033 means the origin service (Node.js on NAS) is unreachable.

**Owner action required:**
1. SSH into NAS
2. Check if `cloudflared` tunnel process is running
3. Check if `node index.js` (API server) is running on port 3000
4. Restart both services

### 2. NO STATIC DATA FALLBACK ON VERCEL (SEVERITY: HIGH)

The production frontend (`src/js/app.js`) makes all data fetches to the external API. There are no local/static JSON files deployed to Vercel as fallback. When the API is down, the app renders with empty data.

**Owner action required (future):** Consider deploying `server/data/*.json` and `server/calendars/*.ics` to Vercel root as static fallback, or implement a service worker cache.

---

## ARCHITECTURE DIAGRAM (Current State)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                              │
│  giatoctrantrongthu.com ──→ Vercel (static SPA)              │
│  (frontend)                   index.html + src/js/app.js     │
│                                    │                         │
│                                    │ fetch() hardcoded       │
│                                    ▼                         │
│  api.giatoctrantrongthu.com ──→ Cloudflare Proxy             │
│  (API domain)                     │                          │
│                                    │ Tunnel (DOWN)           │
│                                    ▼                         │
│                               NAS (100.80.147.119)           │
│                               Node.js/Express :3000          │
│                               MariaDB :3306                  │
│                               /volume1/web/family-api/       │
└─────────────────────────────────────────────────────────────┘

STATUS: Frontend LIVE ✓ | API DOWN ✗ | Tunnel DOWN ✗ | NAS UNKNOWN ?
```

---

## OVERALL STATUS

**BLOCKED**

The production frontend is deployed and serving at `giatoctrantrongthu.com`, but the API backend is completely unreachable (HTTP 530 on all endpoints). The frontend renders with empty data. The Cloudflare Tunnel to the NAS is offline.

---

## CRITICAL BLOCKERS

1. **Cloudflare Tunnel offline** — `api.giatoctrantrongthu.com` returns 530 on all endpoints
2. **Node.js/Express service status unknown** — cannot verify from local machine
3. **MariaDB status unknown** — cannot verify from local machine
4. **No static data fallback** — Vercel deployment has no local JSON/ICS files

---

## SAFE NEXT MISSION

After API is restored:

1. **Verify API endpoints return 200** — `curl https://api.giatoctrantrongthu.com/api/genealogy.json`
2. **Verify production frontend loads data** — open `giatoctrantrongthu.com`, check browser console for successful fetch calls
3. **Consider static data fallback** — deploy `server/data/*.json` to Vercel root for offline resilience
4. **Audit `server/.env` in git history** — verify no credentials leaked in older commits
5. **DESIGN-001 prototype verification** — confirm `giatoctrantrongthu.com/design-playground` renders correctly with live data

---

**END OF AUDIT**
**NO PRODUCTION COMPONENTS WERE CHANGED**
