-- Migration 003 (MariaDB / MySQL Syntax): Governance & Audit Architecture v2.0.0
-- Scope: audit_logs table, proposals table lifecycle extension

-- 1. Create audit_logs table with InnoDB engine and proper utf8mb4 collation
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    before_value LONGTEXT,
    after_value LONGTEXT,
    reason TEXT,
    correlation_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_actor (actor_id),
    INDEX idx_audit_correlation (correlation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create proposals table if not exists with all lifecycle columns
CREATE TABLE IF NOT EXISTS proposals (
    id VARCHAR(64) PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    person_id VARCHAR(255) NOT NULL,
    field VARCHAR(100) NOT NULL,
    suggested_value TEXT NOT NULL,
    source_evidence TEXT,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    reviewer_note TEXT,
    reviewer_id VARCHAR(255),
    base_value TEXT,
    committed_at TIMESTAMP NULL,
    commit_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Extend proposals table if it was created previously with older schema
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS reviewer_id VARCHAR(255);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS base_value TEXT;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS committed_at TIMESTAMP NULL;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS commit_error TEXT;
