# MEDIA_DEPENDENCY_MAP

Read-only map of current media/file dependencies.

## End-to-end observed path

```text
media table / media artifact
        ↓ /api/media.json
person_media table / relation artifact
        ↓ /api/person_media.json
frontend mediaDb index by personId
        ↓ assetId lookup
asset.file
        ↓ browser <img> / CSS background URL
API origin /assets/images/* or rewritten API URL
```

## Evidence map

| Layer | Current evidence | Classification |
|---|---|---|
| Binary serving | `app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')))` in `server/index.js:9` | OBSERVED |
| Media metadata | `server/data/media.json` records include `assetId`, `file`, checksum, source, provenance | OBSERVED |
| Person-media relation | `server/data/person_media.json` records use `personId`, `assetId`, `role`, `isPrimary`, status | OBSERVED |
| API media adapter | `server/index.js:303-335` | OBSERVED |
| Browser resolver | `src/js/app.js:114-153` | OBSERVED |
| Production root consumer | `src/js/app-v2.js` does not fetch media endpoints | OBSERVED; also documented in `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md:81-91` |
| Full/staged consumer | `src/js/app.js:54-72,120-153` | OBSERVED |
| API origin dependency | Hard-coded `https://api.giatoctrantrongthu.com` in `src/js/app.js`, `src/js/app-v2.js`, `admin/js/api.js` | OBSERVED |

## Path conventions

- **[OBSERVED]** Current media artifacts use web-relative paths such as `assets/images/avatars/FS_AVATAR_G1B5-W5Y.jpg` (`server/data/media.json:2-10`).
- **[OBSERVED]** MẠCH generated records use `assets/images/mach/...` paths (`scripts/build_mach.py:80-116,1203-1221`).
- **[OBSERVED]** Legacy/test image data uses absolute `/volume1/web/web_images/family.jpg` (`database/migrations/002_seed_test_data.sql:21`; `server/create_schema.js:34`).
- **[DOCUMENTED]** `PROJECT_ARCHITECTURE.md:25` documents `/volume1/web/family-api/assets/images/` as NAS filesystem location.
- **[UNKNOWN]** Which path convention is authoritative in the live DB and whether every referenced file exists at the origin.

## Resolution behavior

- **[OBSERVED]** API adapters prefix only non-HTTP `file`/`path` values with `https://api.giatoctrantrongthu.com/` (`server/index.js:224-229,269-286,303-313`).
- **[OBSERVED]** This is URL concatenation, not filesystem canonicalization. A value beginning `/volume1/...` would become an API URL containing that path; no safe path translation is implemented in the shown code.
- **[OBSERVED]** The frontend does not construct a filename from FSID; it uses the returned `asset.file` (`src/js/app.js:120-141`).
- **[INFERRED]** Media rendering depends on API-produced URL correctness and server static-route layout, especially for the full `app.js` path. This is a dependency inference from the observed resolver.

## Website/NAS/Vercel dependency

- **[OBSERVED]** Vercel root deployment serves static HTML/JS/CSS according to `vercel.json`; no filesystem mount or media origin is configured there.
- **[DOCUMENTED]** `PROJECT_ARCHITECTURE.md:4-28` assigns frontend delivery to Vercel and DB/media serving to API/NAS.
- **[DOCUMENTED]** `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md:110-120` records prior live API/media verification; this report does not refresh it.
- **[UNKNOWN]** Whether the current production route uses a live NAS mount, a copied asset tree, or another origin behind the API domain.

**STOP — WAIT FOR ARCHITECTURE BASELINE**
