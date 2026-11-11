# 18 FLASHDRIVE MIGRATION DRY RUN

## 1. Executive Summary

Báo cáo này thiết kế migration an toàn cho hai thư mục FLASHDRIVE từ `homes/tuandzain` sang `TUAN_FORGE/01_INBOX`. NAS hiện offline — toàn bộ design dựa trên evidence đã có từ 17 báo cáo audit trước. Không có lệnh thao tác filesystem nào được execute.

**Status:** DRY RUN COMPLETE — READY FOR NAS ONLINE VERIFICATION

---

## 2. Source Inventory

### FLASHDRIVE-TUANTUDO1

| Field | Value | Classification |
|-------|-------|----------------|
| Path | `/volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1` | OBSERVED (from audit reports) |
| Owner | `admin` | OBSERVED (Report #13) |
| Data Role | RAW INPUT (backup dump from external drive) | INFERENCE (Report #13, #14) |
| T-DOS Stage | 01_INBOX (target) | PROPOSED (Report #14) |
| File Count | UNKNOWN — NAS offline | BLOCKED |
| Total Size | UNKNOWN — NAS offline | BLOCKED |
| Extension Distribution | UNKNOWN — NAS offline | BLOCKED |
| Duplicate Overlap | Likely overlaps with `TUAN_FORGE/03_CORE` and `TUAN_ATLAS` (Report #13, #10) | INFERENCE |

### FLASHDRIVE-TUANTUDO2

| Field | Value | Classification |
|-------|-------|----------------|
| Path | `/volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2` | OBSERVED (from audit reports) |
| Owner | `admin` | OBSERVED (Report #13) |
| Data Role | RAW INPUT (backup dump from external drive) | INFERENCE (Report #13, #14) |
| T-DOS Stage | 01_INBOX (target) | PROPOSED (Report #14) |
| File Count | UNKNOWN — NAS offline | BLOCKED |
| Total Size | UNKNOWN — NAS offline | BLOCKED |
| Extension Distribution | UNKNOWN — NAS offline | BLOCKED |
| Duplicate Overlap | Likely overlaps with existing data (Report #13) | INFERENCE |

### Source Provenance

OBSERVED (Report #13, #10, #14):
- Both FLASHDRIVE directories were copied directly into `homes/tuandzain` via Synology USB Copy feature
- Owner is `admin` (not `tuandzain`), indicating they were created under a different account
- This placement violates T-DOS — raw dumps should have gone to `FORGE/01_INBOX`

---

## 3. Destination Validation

| Field | Value | Classification |
|-------|-------|----------------|
| Target Path | `/volume1/TUAN_FORGE/01_INBOX/` | OBSERVED (Report #14) |
| Target Exists | UNKNOWN — NAS offline | BLOCKED |
| Target Permissions | UNKNOWN — NAS offline | BLOCKED |
| Same Volume | YES — both on `/volume1/` | INFERENCE (all paths under `/volume1/`) |
| Available Space | UNKNOWN — NAS offline | BLOCKED |

### Destination Conformance

OBSERVED (Report #10, #14):
- `TUAN_FORGE/01_INBOX` is the correct T-DOS entry point for raw data
- Structure `01_INBOX → 02_SORT → 03_AUDIT → 04_CLEAN → 05_DUP → ATLAS` is established
- FLASHDRIVE directories belong at `01_INBOX` per T-DOS lifecycle

---

## 4. Sync Dependency Check

### Synology Drive Status

OBSERVED (Report #11, #13, #17):
- `homes/tuandzain` is managed by Synology Drive
- Index status: `Re-indexing needed` (stuck due to legacy `tuantudo` account)
- Active sync connections exist between NAS and Mac

### FLASHDRIVE Sync Risk Assessment

| Factor | Assessment | Classification |
|--------|------------|----------------|
| FLASHDRIVE dirs actively synced? | LOW — raw backup dumps, not active workspace | INFERENCE |
| Synology Drive indexing FLASHDRIVE? | POSSIBLE — `homes` is in indexed scope | INFERENCE |
| Moving breaks Mac sync? | YES — if Synology Drive is syncing `homes/tuandzain` subfolders | OBSERVED (Report #11) |
| FLASHDRIVE is active workspace? | NO — name indicates static backup dump | INFERENCE |

### Critical Pre-Condition

OBSERVED (Report #11, #17):
> "Nếu tự ý Move `FLASHDRIVE-*` sang `/volume1/TUAN_FORGE`, mọi kết nối đồng bộ từ máy Mac của Tuấn sẽ bị đứt gãy ngay lập tức."

**Required Action Before Migration:**
1. Verify which subfolders of `homes/tuandzain` are in Synology Drive sync scope
2. If FLASHDRIVE-* is in sync scope, either:
   - (A) Remove FLASHDRIVE-* from Synology Drive sync config first, OR
   - (B) Accept sync breakage for these specific folders (low impact since they're static dumps)

---

## 5. Recommended Migration Mechanism

### Option A: Synology File Station API (PREFERRED)

Synology File Station API provides programmatic file operations with progress tracking.

**Key API Endpoints:**

| API | Method | Purpose |
|-----|--------|---------|
| `SYNO.FileStation.List` | `list` | Enumerate source files before migration |
| `SYNO.FileStation.CopyMove` | `copy` or `move` | Execute migration with progress tracking |
| `SYNO.FileStation.CopyMove` | `status` | Poll progress (`processed_size`, `total`, `progress`, `finished`) |
| `SYNO.FileStation.CopyMove` | `cancel` | Abort if issues detected |

**Migration Sequence:**

```
STEP 1: Authenticate
  POST /webapi/entry.cgi?api=SYNO.API.Auth&version=3&method=login
  → Get sid (session token)

STEP 2: Pre-flight Check — List source contents
  POST /webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list
  &folder_path=/volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1
  → Record: file_count, total_size, directory_structure

STEP 3: Pre-flight Check — Verify destination exists
  POST /webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list
  &folder_path=/volume1/TUAN_FORGE/01_INBOX
  → Confirm directory exists, create if not:
  POST /webapi/entry.cgi?api=SYNO.FileStation.CreateFolder&version=2&method=create
  &folder_path=/volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1

STEP 4: Execute Move — FLASHDRIVE-TUANTUDO1
  POST /webapi/entry.cgi?api=SYNO.FileStation.CopyMove&version=3&method=move
  &path=["/volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1"]
  &dest_folder_path=/volume1/TUAN_FORGE/01_INBOX
  &overwrite=false
  → Get task_id

STEP 5: Monitor Progress
  POST /webapi/entry.cgi?api=SYNO.FileStation.CopyMove&version=3&method=status
  &task_id=<task_id>
  → Poll: { processed_size, total, progress, finished }

STEP 6: Verify Completion
  POST /webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list
  &folder_path=/volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1
  → Compare file_count with STEP 2

STEP 7: Repeat for FLASHDRIVE-TUANTUDO2
  (Same sequence as STEPS 3-6)

STEP 8: Logout
  POST /webapi/entry.cgi?api=SYNO.API.Auth&version=3&method=logout
```

### Option B: SSH/rsync (FALLBACK)

If File Station API is not available or authenticated:

```bash
# Pre-flight: create destination
ssh admin@NAS "mkdir -p /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1"

# Move with progress (rsync --remove-source-files = move)
ssh admin@NAS "rsync -av --progress --remove-source-files \
  /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1/ \
  /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1/"

# Verify
ssh admin@NAS "ls -la /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1/ | wc -l"

# Clean empty source
ssh admin@NAS "rmdir /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1"
```

### Option C: DSM File Station GUI (MANUAL)

If API and SSH are both unavailable:
1. Login to DSM web interface
2. Open File Station
3. Navigate to `/volume1/homes/tuandzain/`
4. Select `FLASHDRIVE-TUANTUDO1` → Move to → `/volume1/TUAN_FORGE/01_INBOX/`
5. Repeat for `FLASHDRIVE-TUANTUDO2`

**Not preferred:** No progress tracking, no automation, no verification.

---

## 6. Dry-Run Result

| Step | Action | Status | Notes |
|------|--------|--------|-------|
| 1 | Verify source paths exist | BLOCKED | NAS offline |
| 2 | Verify destination exists | BLOCKED | NAS offline |
| 3 | Check source file count | BLOCKED | NAS offline |
| 4 | Check source total size | BLOCKED | NAS offline |
| 5 | Check destination space | BLOCKED | NAS offline |
| 6 | Verify Synology Drive sync scope | BLOCKED | NAS offline |
| 7 | Test File Station API accessibility | BLOCKED | NAS offline |
| 8 | Test SSH connectivity | BLOCKED | NAS offline |
| 9 | Design migration sequence | COMPLETE | See Section 5 |
| 10 | Design verification procedure | COMPLETE | See Section 7 |
| 11 | Design rollback procedure | COMPLETE | See Section 8 |

**Overall Dry-Run Status: DESIGN COMPLETE / EXECUTION BLOCKED BY NAS OFFLINE**

---

## 7. Verification Design

### Post-Migration Verification

```
VERIFY 1: Destination file count matches source pre-move count
  Command: ls -la /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1/ | wc -l
  Expected: Matches STEP 2 count from File Station API

VERIFY 2: Source directory is empty/gone
  Command: ls /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1 2>&1
  Expected: "No such file or directory"

VERIFY 3: File integrity spot-check (random 5 files)
  Command: md5sum <source_file> == md5sum <dest_file>
  Note: Only if source still exists (copy-then-verify pattern)

VERIFY 4: No orphaned files in source
  Command: find /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1 -type f 2>/dev/null | wc -l
  Expected: 0

VERIFY 5: Synology Drive index update
  Check DSM → Universal Search → Indexing status for TUAN_FORGE
  Expected: Re-indexing triggered, eventually Finished
```

### Verification Matrix

| Check | Method | Pass Criteria | Fail Action |
|-------|--------|---------------|-------------|
| File count | `ls \| wc -l` | Matches pre-move count | Investigate partial move |
| Source empty | `ls source` | "No such file" | Manual cleanup |
| No orphans | `find source -type f` | 0 files | Manual cleanup |
| Space reclaimed | `df -h /volume1` | Space freed on homes | Investigate |
| Index health | DSM GUI | No errors | Re-index manually |

---

## 8. Rollback Design

### Rollback Procedure

If migration fails or data corruption detected:

```
ROLLBACK 1: Move back to source (if partial/failed)
  API: SYNO.FileStation.CopyMove (move)
  Path: /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1 → /volume1/homes/tuandzain/
  Condition: Only if destination has incomplete data

ROLLBACK 2: Restore from backup (if data corrupted)
  Condition: Requires backup to exist (NOT CURRENTLY AVAILABLE)
  Risk: HIGH — no backup strategy documented for FLASHDRIVE data

ROLLBACK 3: Accept migration, fix index
  Condition: Data is intact but Synology Drive index is broken
  Action: Re-index via DSM → Universal Search → Re-index
```

### Rollback Risk Assessment

| Scenario | Rollback Feasibility | Risk |
|----------|---------------------|------|
| Partial move (network interrupt) | HIGH — move remaining files back | LOW |
| Data corruption during move | LOW — no backup exists | HIGH |
| Synology Drive index broken | MEDIUM — re-index possible | MEDIUM |
| Destination out of space | HIGH — free space, retry | LOW |

---

## 9. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| R1 | Synology Drive sync breaks for FLASHDRIVE folders | HIGH | LOW (static dumps) | Pre-remove from sync scope, or accept breakage |
| R2 | Destination out of space | LOW | HIGH | Check `df -h` before migration |
| R3 | Partial move (network/API failure) | MEDIUM | MEDIUM | File Station API has resume; rsync has --partial |
| R4 | Data corruption during move | LOW | HIGH | Verify checksums post-move |
| R5 | Source owner mismatch (`admin` vs `tuandzain`) | LOW | LOW | Move preserves ownership within same volume |
| R6 | Synology Drive re-indexing storm | MEDIUM | LOW | Wait for current re-index to finish first |
| R7 | Hidden symlinks or special files | LOW | LOW | Pre-scan with `find -type l` |

---

## 10. Required Human Gate

### Before Migration (NAS Online)

1. **Confirm NAS is online and accessible**
   - Test: `ssh admin@NAS "uptime"` or DSM web login

2. **Verify Synology Drive sync scope for `homes/tuandzain`**
   - Check: DSM → Synology Drive → Team Folder / Share Sync
   - Question: Are `FLASHDRIVE-TUANTUDO1` and `FLASHDRIVE-TUANTUDO2` in sync scope?

3. **Check available disk space**
   - Check: `df -h /volume1`
   - Requirement: Free space > total size of both FLASHDRIVE dirs

4. **Approve migration execution**
   - Option A: File Station API (automated, recommended)
   - Option B: SSH/rsync (manual, fallback)
   - Option C: DSM GUI (manual, last resort)

5. **Accept sync breakage risk**
   - If FLASHDRIVE-* is in Synology Drive sync, moving it will break Mac sync for those folders
   - Impact: LOW (static backup dumps, not active data)

---

## 11. Exact Next Commands (When NAS Online)

### Phase A: Pre-Flight (5 minutes)

```bash
# A1: Test NAS connectivity
ssh admin@NAS "uptime"

# A2: Check source exists and get inventory
ssh admin@NAS "ls -la /volume1/homes/tuandzain/ | grep FLASH"
ssh admin@NAS "du -sh /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1"
ssh admin@NAS "du -sh /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2"
ssh admin@NAS "find /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1 -type f | wc -l"
ssh admin@NAS "find /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2 -type f | wc -l"

# A3: Check destination exists
ssh admin@NAS "ls -la /volume1/TUAN_FORGE/01_INBOX/"

# A4: Check available space
ssh admin@NAS "df -h /volume1"

# A5: Check Synology Drive sync scope
# (Manual check on DSM GUI required)
```

### Phase B: Migration (Duration depends on data size)

```bash
# B1: Create destination directories
ssh admin@NAS "mkdir -p /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1"
ssh admin@NAS "mkdir -p /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2"

# B2: Move FLASHDRIVE-TUANTUDO1 (rsync with progress)
ssh admin@NAS "rsync -av --progress --remove-source-files \
  /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1/ \
  /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1/"

# B3: Verify and clean source
ssh admin@NAS "find /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1 -type f | wc -l"
# Expected: 0
ssh admin@NAS "rmdir /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO1 2>/dev/null"

# B4: Move FLASHDRIVE-TUANTUDO2
ssh admin@NAS "rsync -av --progress --remove-source-files \
  /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2/ \
  /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2/"

# B5: Verify and clean source
ssh admin@NAS "find /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2 -type f | wc -l"
# Expected: 0
ssh admin@NAS "rmdir /volume1/homes/tuandzain/FLASHDRIVE-TUANTUDO2 2>/dev/null"
```

### Phase C: Post-Migration Verification (5 minutes)

```bash
# C1: Verify destinations
ssh admin@NAS "ls -la /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1/ | head -20"
ssh admin@NAS "ls -la /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2/ | head -20"
ssh admin@NAS "du -sh /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1"
ssh admin@NAS "du -sh /volume1/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2"

# C2: Verify sources are gone
ssh admin@NAS "ls /volume1/homes/tuandzain/ | grep FLASH"
# Expected: empty

# C3: Check disk space reclaimed
ssh admin@NAS "df -h /volume1"
```

---

## 12. Evidence Classification Summary

| Claim | Classification | Source |
|-------|---------------|--------|
| Source paths at `homes/tuandzain/FLASHDRIVE-*` | OBSERVED | Report #13, #10, #14 |
| Owner is `admin` | OBSERVED | Report #13 |
| Destination at `TUAN_FORGE/01_INBOX` | OBSERVED | Report #14 |
| Same volume (`/volume1/`) | INFERENCE | All paths under `/volume1/` |
| FLASHDRIVE = raw backup dump | INFERENCE | Report #13, #10 |
| Synology Drive manages `homes` | OBSERVED | Report #11, #17 |
| Index status: `Re-indexing needed` | OBSERVED | Report #11, #17 |
| Moving breaks Mac sync | OBSERVED | Report #11 |
| FLASHDRIVE not active workspace | INFERENCE | Name-based + provenance |
| File Station API supports progress tracking | OBSERVED | Synology API documentation (external knowledge) |
| Duplicate overlap with `03_CORE`/`ATLAS` | INFERENCE | Report #13, #10 |
| File count / size / extensions | UNKNOWN | NAS offline |
| Destination space available | UNKNOWN | NAS offline |
| Synology Drive sync scope for FLASHDRIVE | UNKNOWN | Requires DSM GUI check |

---

## 13. Final Status

```
A. READY OFFLINE
   - Migration design: COMPLETE
   - API sequence: DEFINED
   - Rollback procedure: DEFINED
   - Verification procedure: DEFINED
   - Risk register: DOCUMENTED

B. BLOCKED UNTIL NAS ONLINE
   - Source path verification
   - Source file count / size inventory
   - Destination space check
   - Synology Drive sync scope verification
   - File Station API accessibility test
   - SSH connectivity test
   - Actual migration execution

C. EXACT TESTS TO RUN WHEN NAS ONLINE
   1. ssh admin@NAS "uptime"
   2. ssh admin@NAS "du -sh /volume1/homes/tuandzain/FLASHDRIVE-*"
   3. ssh admin@NAS "find /volume1/homes/tuandzain/FLASHDRIVE-* -type f | wc -l"
   4. ssh admin@NAS "df -h /volume1"
   5. Manual DSM GUI check: Synology Drive → sync scope for homes/tuandzain
   6. Manual DSM GUI check: File Station → can we browse both paths?

D. MIGRATION MECHANISM TO TEST
   - PRIMARY: rsync --remove-source-files via SSH (proven, reliable)
   - ALTERNATIVE: Synology File Station API (if automation needed)
   - LAST RESORT: DSM File Station GUI (manual)

E. VERIFICATION
   - File count match pre/post move
   - Source directory empty/gone
   - Destination file count matches pre-move source count
   - Disk space reclaimed on /volume1
   - Synology Drive index re-indexes without error

F. ROLLBACK
   - Move back to source (if partial/failed)
   - Re-index via DSM (if index broken)
   - No backup exists for data corruption scenario (HIGH RISK)

G. HUMAN GATE
   - Approve migration execution after pre-flight checks
   - Confirm Synology Drive sync scope for FLASHDRIVE folders
   - Accept sync breakage risk for static backup dumps
```

---

`STOP — DRY RUN COMPLETE — AWAITING NAS ONLINE FOR EXECUTION`
