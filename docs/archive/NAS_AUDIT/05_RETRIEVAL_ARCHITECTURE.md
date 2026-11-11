# 05 RETRIEVAL ARCHITECTURE

## INFERENCE (Current Gap)
- Synology Universal Search provides full-text and filename indexing.
- Synology Photos provides basic EXIF timeline indexing.
- System lacks a Semantic Mapping layer to bridge human concepts with filenames.

## PROPOSED ARCHITECTURE
1. **Storage Layer:** NAS Filesystem.
2. **Index Layer:** SQLite/JSON database containing file metadata and inferred tags.
3. **Semantic Layer:** A metadata tagging system (e.g. mapping `FLASHDRIVE-PVCFC` to `Công việc NPK`).
