-- =============================================================================
-- 004_img01_grave_roles_mariadb.sql — IMG-01 (Visual & Editorial Batch 2A)
-- -----------------------------------------------------------------------------
-- The FamilySearch images for @I1@ (Cụ Giuse Trần Trọng Thu) and @I8@ (Cụ bà
-- Nguyễn Thị Xuân - Út) are photographs of their gravestone, not portraits.
-- They are reclassified as GRAVE (non-primary) so they are never resolved as an
-- avatar. NO row is deleted; the media asset remains in the archival list.
--
-- MariaDB only (schema from nas_migrate.js: role, is_primary). Idempotent.
-- Local SQLite person_media has no role/is_primary columns: it is reseeded from
-- server/data/person_media.json (already updated) via db_seed.js.
-- PRODUCTION: requires an explicit Human Gate from Tuấn + a physical backup
-- before execution. NOT applied by the agent.
-- =============================================================================
UPDATE person_media
   SET role = 'GRAVE', is_primary = 0
 WHERE relation_id IN ('PMR_I1_G5X4-48S', 'PMR_I8_G5X4-NQX');
