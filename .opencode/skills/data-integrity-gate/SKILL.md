---
name: data-integrity-gate
description: Regenerates genealogy JSON and 4 calendar ICS feeds from the private GEDCOM source, then runs the integrity validator to gate the data before commit/deploy. Load when the Human asks to update genealogy data, fix data, verify integrity, regenerate feeds, or before deploying data changes.
---

## What I do

Runs and interprets the data pipeline for the Trần Trọng Thu genealogy dataset:

1. **Regenerate genealogy JSON:** `python3 generator/export_genealogy_json.py` (requires private `GIADINHONGTHU.ged`, path via `GEDCOM_FILE_PATH` or default OneDrive location). Output `server/data/genealogy.json` (the live dataset that the app/API reads).
2. **Regenerate calendar feeds:** `python3 generator/generate_calendar_feeds.py` → 4 ICS feeds in `server/calendars/` (CAL_01_BIRTHDAYS, CAL_02_PATRON_FEASTS, CAL_03_MEMORIALS, CAL_04_FAMILY_MILESTONES; RFC 5545, stable `memorial-{FSID}-{YEAR}` UIDs).
3. **Run integrity gate:** `python3 generator/validate_integrity.py`.
4. **Interpret result honestly:** the gate currently FAILS with "Missing data file" because `validate_integrity.py` expects root `data/genealogy.json` + root `calendars/`, while live data lives in `server/data/` + `server/calendars/`. Treat this as an environment/consistency mismatch, NOT proof the data is corrupt. Cross-check datasets directly at `server/data/` and report facts.

## When to use me

- Updating genealogy data/people/families and needing regenerate + verify.
- Fixing calendar feed issues or regenerating ICS.
- Verifying data integrity before commit/deploy.
- Debugging stats/reference mismatches.

## Rules

- Never fabricate or beautify lineage/data; preserve 7-level epistemic certainty labels; never delete history.
- Keep stable person/family IDs and slugs (do not break deep links).
- Report checks honestly: PASS / FAIL / UNKNOWN (do not claim VERIFIED for a check you could not run).