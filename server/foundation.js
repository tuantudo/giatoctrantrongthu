/**
 * foundation.js
 * P0 Foundation Layer: Accounts, IdentityMapping, Authority.
 * Provides initialization for tables and mapping for existing admin_users.
 */
const { randomUUID } = require('crypto'); // Built-in Node crypto for UUIDs

async function initFoundationTables(runQuery, isMySQL) {
    if (isMySQL) {
        await runQuery(`CREATE TABLE IF NOT EXISTS accounts (
            id VARCHAR(255) PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            username VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50) NOT NULL DEFAULT 'member',
            status VARCHAR(50) NOT NULL DEFAULT 'PROVISIONED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS identity_mappings (
            account_id VARCHAR(255),
            person_id VARCHAR(255),
            PRIMARY KEY (account_id, person_id)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS authorities (
            id VARCHAR(255) PRIMARY KEY,
            actor_type VARCHAR(50) NOT NULL,
            actor_id VARCHAR(255) NOT NULL,
            resource_type VARCHAR(50) NOT NULL,
            resource_id VARCHAR(255) NOT NULL,
            action VARCHAR(50) NOT NULL
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS proposals (
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
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS audit_logs (
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    } else {
        // SQLite
        await runQuery(`CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            username TEXT UNIQUE,
            password_hash TEXT,
            role TEXT NOT NULL DEFAULT 'member',
            status TEXT NOT NULL DEFAULT 'PROVISIONED',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS identity_mappings (
            account_id TEXT,
            person_id TEXT,
            PRIMARY KEY (account_id, person_id)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS authorities (
            id TEXT PRIMARY KEY,
            actor_type TEXT NOT NULL,
            actor_id TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT NOT NULL,
            action TEXT NOT NULL
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS proposals (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            person_id TEXT NOT NULL,
            field TEXT NOT NULL,
            suggested_value TEXT NOT NULL,
            source_evidence TEXT,
            reason TEXT,
            status TEXT NOT NULL DEFAULT 'PENDING',
            reviewer_note TEXT,
            reviewer_id TEXT,
            base_value TEXT,
            committed_at TEXT,
            commit_error TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            reviewed_at TEXT
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS audit_logs (
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
        )`);

        // Ensure columns exist on SQLite if table pre-existed
        try { await runQuery(`ALTER TABLE proposals ADD COLUMN reviewer_id TEXT`); } catch(e) {}
        try { await runQuery(`ALTER TABLE proposals ADD COLUMN base_value TEXT`); } catch(e) {}
        try { await runQuery(`ALTER TABLE proposals ADD COLUMN committed_at TEXT`); } catch(e) {}
        try { await runQuery(`ALTER TABLE proposals ADD COLUMN commit_error TEXT`); } catch(e) {}
    }
}

/**
 * Ensures an Account exists for a given admin_user.
 * This is the compatibility layer mapping admin_users to target Account concept.
 */
async function syncAdminUserToAccount(adminUser, dbAccessor) {
    // Attempt to find existing account by username
    const existing = await dbAccessor.getQuery(
        "SELECT id FROM accounts WHERE username = ?",
        [adminUser.username]
    );

    if (existing) {
        return existing.id;
    }

    // Create new Account
    const newId = randomUUID();
    await dbAccessor.runQuery(
        "INSERT INTO accounts (id, username, role, status) VALUES (?, ?, ?, 'ACTIVE')",
        [newId, adminUser.username, adminUser.role]
    );

    // Optionally: assign default authority to this account based on role
    const authId = randomUUID();
    await dbAccessor.runQuery(
        "INSERT INTO authorities (id, actor_type, actor_id, resource_type, resource_id, action) VALUES (?, ?, ?, ?, ?, ?)",
        [authId, 'ACCOUNT', newId, 'SYSTEM', '*', 'ADMIN_ACCESS']
    );

    return newId;
}

module.exports = {
    initFoundationTables,
    syncAdminUserToAccount
};
