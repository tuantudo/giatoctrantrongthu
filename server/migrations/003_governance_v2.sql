-- Migration 003: Governance & Audit Architecture v2.0.0
-- Scope: Audit Logs, Proposal Workflow, and Atomic Commits

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    before_value TEXT,
    after_value TEXT,
    reason TEXT,
    correlation_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_correlation ON audit_logs (correlation_id);

-- 2. Extend proposals table with reviewer and commit lifecycle columns
ALTER TABLE proposals ADD COLUMN reviewer_id TEXT;
ALTER TABLE proposals ADD COLUMN base_value TEXT;
ALTER TABLE proposals ADD COLUMN committed_at TEXT;
ALTER TABLE proposals ADD COLUMN commit_error TEXT;

