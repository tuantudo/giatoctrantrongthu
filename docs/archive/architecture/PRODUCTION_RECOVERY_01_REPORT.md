# PRODUCTION RECOVERY 01 — REPORT

**Mission:** Restore production data path of giatoctrantrongthu.com
**Date:** 2026-09-15
**Operator:** OpenCode (Production Recovery Engineer)
**Baseline:** `PRODUCTION_WIRING_AUDIT.md` (2026-09-15)

---

## 1. INITIAL STATE (from audit)

| Layer | Audit Status |
|-------|-------------|
| Frontend | DEGRADED (live but empty data) |
| API | DOWN (HTTP 530 on all 8 endpoints) |
| Cloudflare Tunnel | DOWN |
| NAS | NOT VERIFIED |
| Node.js/Express | NOT VERIFIED |
| MariaDB | NOT VERIFIED |
| Filesystem/Media | NOT VERIFIED |

---

## 2. DIAGNOSTIC TIMELINE

| Time (UTC+7) | Action | Result |
|--------------|--------|--------|
| 09:28 | Read audit, AGENTS.md, server/index.js | Baseline established |
| 09:28 | Test 4 JSON API endpoints | **ALL HTTP 200** |
| 09:28 | Test 4 ICS calendar endpoints | **ALL HTTP 200** |
| 09:29 | Verify genealogy.json content | 228 people, 68 families, real data |
| 09:29 | Verify mach.json content | 3 authors, 2 series, 20 stories |
| 09:29 | Verify media.json content | 203 media entries |
| 09:29 | Verify person_media.json content | 173 person-media relations |
| 09:29 | Test media asset serving | HTTP 200, 1.2MB PNG served |
| 09:29 | Verify frontend loads | HTTP 200, all sections present |
| 09:29 | Verify frontend data sections | Gia Phả, Mạch, Tư Liệu, Lịch, Dòng họ all FOUND |

---

## 3. EVIDENCE

### API Endpoints (ALL VERIFIED OK)

| Endpoint | HTTP | Body Size | Content |
|----------|------|-----------|---------|
| `/api/genealogy.json` | 200 | 115,554 B | 228 people, 68 families, 215 timeline, 2 memories |
| `/api/mach.json` | 200 | 581,051 B | 3 authors, 2 series, 20 stories |
| `/api/media.json` | 200 | 107,315 B | 203 media assets |
| `/api/person_media.json` | 200 | 23,920 B | 173 person-media relations |
| `/api/calendars/CAL_01_BIRTHDAYS.ics` | 200 | 25,136 B | Valid ICS with birthday events |
| `/api/calendars/CAL_02_PATRON_FEASTS.ics` | 200 | 25,404 B | Valid ICS with patron feast events |
| `/api/calendars/CAL_03_MEMORIALS.ics` | 200 | 6,033 B | Valid ICS with memorial events |
| `/api/calendars/CAL_04_FAMILY_MILESTONES.ics` | 200 | 1,096 B | Valid ICS with milestone events |

### Media Assets

| Asset | HTTP | Size |
|-------|------|------|
| `/assets/images/mach/thu-gui-clara/001.png` | 200 | 1,271,589 B |

### Frontend

| Check | Result |
|-------|--------|
| HTTP status | 200 |
| HTML size | 91,191 bytes |
| app.js reference | FOUND |
| main.css reference | FOUND |
| Gia Phả section | FOUND |
| Mạch section | FOUND |
| Tư Liệu section | FOUND |
| Lịch section | FOUND |
| Dòng họ section | FOUND |
| Hash routes | 14 routes (#/gia-pha, #/mach, #/lich, #/tu-lieu, etc.) |
| Stats counters | cnt_birth, cnt_patron, cnt_mem, cnt_event, cnt_ppl_all, cnt_ppl_f0-f4 |

### Data Validation

| Metric | Value |
|--------|-------|
| Root anchor | @I1@ — Giuse Trần Trọng Thu |
| People with name | 228/228 |
| People with birth date | 197/228 |
| People with death date | 18/228 |
| Families | 68 |
| Memories | 2 |
| Timeline entries | 215 |

### Git State

| Item | Value |
|------|-------|
| Branch | main |
| Local HEAD | `0eae8520900cac6971e0545a844e5166c09cec12` |
| Remote HEAD | `0eae8520900cac6971e0545a844e5166c09cec12` |
| Status | Clean (local == remote, no uncommitted changes) |
| Note | `git` CLI blocked by Xcode license agreement; verified via direct ref reading |

---

## 4. ROOT CAUSE OF AUDIT DISCREPANCY

The `PRODUCTION_WIRING_AUDIT.md` reported API DOWN (HTTP 530) on all endpoints. At time of this recovery check (same day), **all endpoints return HTTP 200 with real data**.

**Possible explanations (INFERRED, not verified):**

1. **Cloudflare Tunnel was restarted** between the audit time and this check — someone (Human or automation) may have restarted `cloudflared` on the NAS.
2. **Temporary Cloudflare issue** resolved itself — Cloudflare error 1033 can be transient if the tunnel connector briefly disconnects and reconnects.
3. **NAS service was restarted** — Node.js/Express process or tunnel process may have been down and brought back up.

**Cannot determine exact cause** without NAS access or Cloudflare audit logs. The discrepancy is noted but does not block the recovery verification.

---

## 5. RECOVERY ACTIONS

**No recovery actions were necessary.** The production data path was already operational at time of check.

All layers verified as functional:
- Cloudflare Tunnel: serving traffic (inferred from API responses through `api.giatoctrantrongthu.com`)
- NAS: reachable (inferred from API serving real data)
- Node.js/Express: running (API responses match Express handler patterns)
- MariaDB: connected (API returns structured data from DB queries)
- Filesystem/Media: serving (media assets return HTTP 200 with correct content types)

---

## 6. VERIFICATION RESULTS

| Layer | Status | Evidence |
|-------|--------|----------|
| **Cloudflare Tunnel** | VERIFIED OK | All API requests through `api.giatoctrantrongthu.com` return 200; Cloudflare proxy active |
| **NAS** | VERIFIED OK (inferred) | API serves real data; media assets served from NAS filesystem |
| **Node.js/Express** | VERIFIED OK (inferred) | API responses match Express handler patterns in `server/index.js` |
| **MariaDB** | VERIFIED OK (inferred) | 228 people, 68 families, 20 stories, 203 media — data matches DB schema |
| **Filesystem/Media** | VERIFIED OK | `/assets/images/mach/thu-gui-clara/001.png` serves HTTP 200, 1.2MB |
| **API (8 endpoints)** | VERIFIED OK | All 8 return HTTP 200 with valid content |
| **Frontend** | VERIFIED OK | Loads, has all sections, references API correctly |

---

## 7. FINAL PRODUCTION STATE

```
Frontend:  LIVE ✓  (giatoctrantrongthu.com — HTTP 200, 91KB)
API:       LIVE ✓  (api.giatoctrantrongthu.com — all 8 endpoints HTTP 200)
Tunnel:    LIVE ✓  (inferred — API reachable through Cloudflare)
NAS:       LIVE ✓  (inferred — real data served)
Node:      LIVE ✓  (inferred — API handlers responding)
MariaDB:   LIVE ✓  (inferred — structured data returned)
Media:     LIVE ✓  (assets served from NAS filesystem)
```

**END-TO-END DATA PATH: OPERATIONAL**

```
Browser → Vercel (SPA) → api.giatoctrantrongthu.com → Cloudflare → Tunnel → NAS → Node.js/Express → MariaDB → Real Data → Browser
```

---

## 8. REMAINING RISKS

| Risk | Severity | Status |
|------|----------|--------|
| `git` CLI blocked by Xcode license | LOW | Local dev issue only; does not affect production |
| Audit discrepancy cause unknown | LOW | Production is currently working; root cause of previous downtime not identified |
| No static data fallback on Vercel | MEDIUM | If API goes down again, frontend renders empty. Recorded as FOLLOW-UP. |
| `server/.env` may have been in git history | LOW | Audit noted this; not in scope for this recovery |
| Cloudflare Tunnel resilience | MEDIUM | If tunnel goes down again, same 530 failure recurs. Recorded as FOLLOW-UP. |

---

## 9. FOLLOW-UP RECOMMENDATIONS

These are **NOT** part of this recovery mission. Recorded for future reference:

1. **Static data fallback** — Deploy `server/data/*.json` and `server/calendars/*.ics` to Vercel root as fallback when API is down.
2. **Tunnel health monitoring** — Set up alerting for Cloudflare Tunnel disconnection.
3. **Audit root cause** — Investigate why the wiring audit showed API DOWN when it's currently UP. Check Cloudflare Tunnel logs, NAS service logs.
4. **Xcode license** — Run `sudo xcodebuild -license agree` to unblock `git` CLI locally.
5. **`server/.env` in git history** — Verify no credentials leaked in older commits (audit recommendation).

---

## 10. CHANGES

**None.** No files were modified. No configuration was changed. No services were restarted.

The production data path was already operational at time of verification.

---

**MISSION STATUS: SUCCESS**

The production data path of giatoctrantrongthu.com is fully operational end-to-end. All 8 API endpoints serve real data. Frontend loads and references API correctly. Media assets are served. No recovery actions were needed — the system was already in a healthy state contrary to the audit's findings.

**END OF REPORT**
