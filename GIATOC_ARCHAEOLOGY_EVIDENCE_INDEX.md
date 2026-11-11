# GIATOC ARCHAEOLOGY EVIDENCE INDEX

Phạm vi: đối chiếu nội bộ của đúng bốn archaeology artifacts:

- `GIATOC_DATA_ARCHAEOLOGY.md`
- `CURRENT_SCHEMA_MAP.md`
- `MEDIA_DEPENDENCY_MAP.md`
- `ARCHITECTURE_CONFLICTS.md`

Không audit lại repository, filesystem, production, NAS hoặc database. Không giải quyết conflict.

## Consistency check

- **[OBSERVED] Nhất quán:** Bốn file cùng xác định `server/index.js` là backend Express hiện hữu, `people` là PERSON entity, và `media` + `person_media` là media relationship hiện được thể hiện trong code/artifacts.
- **[OBSERVED] Nhất quán:** Bốn file cùng giữ riêng baseline `images`/`events` và later `media`/`person_media`/`calendar_events`; không gọi chúng là một schema đã được hợp nhất.
- **[OBSERVED] Nhất quán:** `app-v2.js` được mô tả là root/current frontend entrypoint; `app.js` là full/staged frontend, không được kết luận là production hiện tại.
- **[OBSERVED] Nhất quán:** Relative web paths và absolute NAS paths đều được ghi nhận; không file nào biến một convention thành canonical live fact.
- **[OBSERVED] Nhất quán:** API media resolution được mô tả là URL rewriting/static route, không phải filesystem canonicalization.
- **[OBSERVED] Nhất quán:** NAS/Cloudflare/MariaDB/Vercel topology được phân biệt giữa `DOCUMENTED` và `UNKNOWN`, không được trình bày như fresh live verification.
- **[OBSERVED] Classification hợp lệ:** Các file chỉ dùng năm nhãn được yêu cầu. Những dòng có hai nhãn (ví dụ `DOCUMENTED / UNKNOWN`) là boundary finding, không phải biến `UNKNOWN` thành fact.

## Evidence index

| ID | Finding | Source File | Classification | Architecture Impact | Confidence |
|---|---|---|---|---|---|
| F-01 | Backend có hai DB branches: MariaDB theo env và SQLite fallback tại `server/family_archive.db`; production DB location chưa được xác nhận từ artifacts | `GIATOC_DATA_ARCHAEOLOGY.md` §1; `ARCHITECTURE_CONFLICTS.md` C07 | OBSERVED | NAS Architecture; GiaToc Database; Production/Vercel | HIGH |
| F-02 | Production topology được documents mô tả là Vercel frontend → Cloudflare Tunnel → NAS Node API → MariaDB/filesystem, nhưng live wiring hiện tại vẫn UNKNOWN trong package | `GIATOC_DATA_ARCHAEOLOGY.md` §1, §6; `MEDIA_DEPENDENCY_MAP.md` §Website/NAS/Vercel; `ARCHITECTURE_CONFLICTS.md` C07 | DOCUMENTED | NAS Architecture; Production/Vercel | HIGH |
| F-03 | Baseline migration, inline startup DDL và `schema_update.sql` không tạo thành một schema duy nhất: startup chỉ tạo `people`, `stories`, `edges`, trong khi adapters dùng thêm nhiều bảng/cột | `CURRENT_SCHEMA_MAP.md` §Shape conflicts; `ARCHITECTURE_CONFLICTS.md` C01-C03 | OBSERVED | GiaToc Database; T-DOS evidence lineage | HIGH |
| F-04 | `people.payload` được admin/public code sử dụng nhưng bị bỏ khỏi inline DDL; `fsid` và các adapter tables cũng nằm ở schema update riêng | `CURRENT_SCHEMA_MAP.md` C01-C02; `GIATOC_DATA_ARCHAEOLOGY.md` §2 | OBSERVED | GiaToc Database; T-DOS data integrity | HIGH |
| F-05 | PERSON tồn tại ở SQL `people`, JSON `genealogy.people`, và UI `app.js`; IDs gồm GEDCOM-style ID và `fsid` | `GIATOC_DATA_ARCHAEOLOGY.md` §3; `CURRENT_SCHEMA_MAP.md` table/entity map | OBSERVED | GiaToc Database; T-DOS identity/provenance | HIGH |
| F-06 | Media relationship là logical `person_media.person_id -> asset_id -> media.id`; không có SQL FK được quan sát | `GIATOC_DATA_ARCHAEOLOGY.md` §4; `CURRENT_SCHEMA_MAP.md` data model; `ARCHITECTURE_CONFLICTS.md` C09 | OBSERVED | Media Architecture; GiaToc Database; T-DOS integrity | HIGH |
| F-07 | Media paths dùng hai convention: relative web paths trong media artifacts và absolute `/volume1/...` trong baseline/test seed; canonical live convention UNKNOWN | `MEDIA_DEPENDENCY_MAP.md` §Path conventions; `GIATOC_DATA_ARCHAEOLOGY.md` §4; `ARCHITECTURE_CONFLICTS.md` C06 | OBSERVED | Media Architecture; NAS Architecture; T-DOS canonicality | HIGH |
| F-08 | API prefixes non-HTTP media values bằng fixed API origin; behavior là URL concatenation, không phải translation từ filesystem path sang public route | `MEDIA_DEPENDENCY_MAP.md` §Resolution behavior; `GIATOC_DATA_ARCHAEOLOGY.md` §5; `ARCHITECTURE_CONFLICTS.md` C08 | OBSERVED | Media Architecture; Production/Vercel | HIGH |
| F-09 | Server static route chỉ expose `/assets/images` từ process asset directory; actual live NAS media root chưa xác định | `MEDIA_DEPENDENCY_MAP.md` §Evidence map, §Website/NAS/Vercel; `GIATOC_DATA_ARCHAEOLOGY.md` §4, §6 | OBSERVED | NAS Architecture; Media Architecture; Production/Vercel | HIGH |
| F-10 | Root production frontend load `app-v2.js`; full `app.js` có media resolver nhưng không phải root-loaded entrypoint | `GIATOC_DATA_ARCHAEOLOGY.md` §7; `MEDIA_DEPENDENCY_MAP.md` §Evidence map; `ARCHITECTURE_CONFLICTS.md` C04-C05 | OBSERVED | Production/Vercel; Media Architecture | HIGH |
| F-11 | Website root phụ thuộc API domain cho genealogy, MẠCH và calendar; full/staged app còn phụ thuộc media endpoints; Vercel không có filesystem mount trong package | `MEDIA_DEPENDENCY_MAP.md` §Website/NAS/Vercel; `GIATOC_DATA_ARCHAEOLOGY.md` §6 | OBSERVED | Production/Vercel; NAS Architecture; Media Architecture | HIGH |
| F-12 | `server/data/*.json` được nhận diện là repository artifacts/snapshots, không được xác định là database source of truth | `GIATOC_DATA_ARCHAEOLOGY.md` §7; `ARCHITECTURE_CONFLICTS.md` classification summary | OBSERVED | T-DOS lifecycle; GiaToc Database; Production/Vercel | MEDIUM |
| F-13 | Architecture module boundaries (Genealogy/Archive/Narrative/Testament/Access) là target/documented boundaries; backend thực tế vẫn là single Express file với inline SQL | `GIATOC_DATA_ARCHAEOLOGY.md` §7; `ARCHITECTURE_CONFLICTS.md` C11 | DOCUMENTED | NAS Architecture; GiaToc Database; T-DOS governance | HIGH |
| F-14 | Abstract database pointers, eight-layer model và NAS migration/normalization là proposed/document-only; chưa phải current implementation | `GIATOC_DATA_ARCHAEOLOGY.md` §7; `ARCHITECTURE_CONFLICTS.md` C12 | PROPOSED | NAS Architecture; T-DOS; Media Architecture | HIGH |
| F-15 | Exact live schema, authoritative data rows, canonical media root/path format, SQLite deployment role và human approval status đều còn UNKNOWN | `ARCHITECTURE_CONFLICTS.md` Review questions; `CURRENT_SCHEMA_MAP.md` §Shape conflicts; `MEDIA_DEPENDENCY_MAP.md` §Path conventions | UNKNOWN | Tất cả năm vùng review | HIGH |
| F-16 | `/api/person_media.json` emits `status: MATCHED` for every row, while source artifacts include status/matching metadata; semantic discrepancy is recorded, not resolved | `ARCHITECTURE_CONFLICTS.md` C10; `GIATOC_DATA_ARCHAEOLOGY.md` §5 | OBSERVED | Media Architecture; T-DOS evidence integrity | MEDIUM |

## Classification audit

- **OBSERVED:** implementation files, table declarations/queries, endpoint behavior represented in source, path literals, frontend entrypoint references, and artifact shapes.
- **DOCUMENTED:** topology and prior live-verification claims copied from architecture/current-state documents, without treating them as newly verified in this package.
- **INFERRED:** only used where a repository-level relationship is reasoned from coexistence or dependency, such as a likely separate schema-application step or stronger media dependency in the full app.
- **PROPOSED:** only used for abstract pointers, eight-layer model, modular target boundaries, and migration/normalization ideas explicitly described as proposals.
- **UNKNOWN:** only used for facts requiring live DB/NAS/production inspection or human approval not present in the four source artifacts.

## ARCHITECTURE-RELEVANT FINDINGS

Chỉ các finding sau cần đưa vào Architecture Review:

- **F-02:** NAS/Cloudflare/MariaDB/Vercel topology is documented but live wiring is not established by this package.
- **F-03 và F-04:** Schema sources conflict; `payload`, `fsid`, and adapter tables are not represented consistently by startup DDL.
- **F-05:** PERSON identity spans relational, GEDCOM-derived JSON, and `fsid` identifiers.
- **F-06:** Media linkage is logical ID-based without observed SQL foreign keys.
- **F-07, F-08 và F-09:** Media path conventions and URL/static serving boundary are mixed or unresolved.
- **F-10 và F-11:** Production/Vercel frontend dependency differs from full/staged frontend dependency, especially for media and API availability.
- **F-12:** Committed JSON snapshots must not be silently treated as database source of truth.
- **F-13 và F-14:** Documented/proposed architecture boundaries are not equivalent to current implementation.
- **F-15:** Live schema, canonical media root, authoritative data source, and approval status remain explicit review blockers/unknowns.
- **F-16:** Media relation status semantics are transformed by the API and need review as evidence integrity, without resolving the behavior here.

**STOP — WAIT FOR ARCHITECTURE REVIEW**
