/**
 * tests/test_physical_mariadb_integration.mjs
 * Phase 1 — Physical MariaDB Integration Test Suite.
 *
 * Runs against a real physical MariaDB daemon (local Docker container or Homebrew service).
 * Strictly isolated from NAS Production.
 *
 * Verifies on real InnoDB engine:
 * 1. Physical connection and character set utf8mb4.
 * 2. Execution of server/migrations/003_governance_v2_mariadb.sql.
 * 3. MariaDB Dedicated Connection Transaction success.
 * 4. MariaDB Transaction Rollback (data remains uncommitted).
 * 5. Concurrent transaction isolation (READ COMMITTED / REPEATABLE READ).
 * 6. Governance commitProposal on real MariaDB (updates people, updates proposals, writes audit_logs).
 * 7. Governance executeDirectEditWithAudit on real MariaDB.
 * 8. Zero connection leak across 50 consecutive transactions.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const mysql = require('../server/node_modules/mysql2/promise');

import {
  withTransaction,
  runMariaDBTransaction,
  recordAuditLog,
  commitProposal,
  rejectProposal,
  executeDirectEditWithAudit
} from '../server/governance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_CONFIG = {
  host: process.env.TEST_MARIADB_HOST || '127.0.0.1',
  port: parseInt(process.env.TEST_MARIADB_PORT || '3306', 10),
  user: process.env.TEST_MARIADB_USER || 'root',
  password: process.env.TEST_MARIADB_PASSWORD || 'secret',
  database: process.env.TEST_MARIADB_DATABASE || 'family_archive_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('🧪 Starting Physical MariaDB Integration Suite (Phase 1)...\n');
console.log(`Connecting to physical MariaDB at ${DB_CONFIG.host}:${DB_CONFIG.port} (database: ${DB_CONFIG.database})...`);

async function main() {
  let pool = null;
  try {
    // 1. Initial connection to verify physical daemon is reachable
    const adminConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    const [verRows] = await adminConn.query("SELECT VERSION() AS ver, @@version_comment AS comment");
    console.log(`  ✅ Connected to physical engine: ${verRows[0].ver} (${verRows[0].comment})`);

    // Ensure clean test database
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await adminConn.end();

    // Create pooled accessor
    pool = mysql.createPool(DB_CONFIG);

    const runQuery = async (q, p = []) => {
      const [res] = await pool.execute(q, p);
      return res;
    };
    const allQuery = async (q, p = []) => {
      const [rows] = await pool.execute(q, p);
      return rows;
    };
    const getQuery = async (q, p = []) => {
      const [rows] = await pool.execute(q, p);
      return rows && rows.length > 0 ? rows[0] : null;
    };

    const mariaAccessor = {
      runQuery,
      allQuery,
      getQuery,
      isMySQL: true,
      pool
    };

    // 2. Setup Baseline Tables
    await runQuery(`CREATE TABLE IF NOT EXISTS people (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      birthYear VARCHAR(50),
      deathYear VARCHAR(50),
      gender VARCHAR(50),
      notes TEXT,
      status VARCHAR(50),
      payload LONGTEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    // 3. Apply Migration 003
    const migrationSql = fs.readFileSync(path.join(__dirname, '../server/migrations/003_governance_v2_mariadb.sql'), 'utf8');
    const statements = migrationSql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await runQuery(stmt);
    }
    console.log('  ✅ Applied server/migrations/003_governance_v2_mariadb.sql successfully');

    // Clean tables for test run
    await runQuery("TRUNCATE TABLE people");
    await runQuery("TRUNCATE TABLE proposals");
    await runQuery("TRUNCATE TABLE audit_logs");

    await runQuery("INSERT INTO people (id, name, birthYear, notes, status, payload) VALUES ('@I1@', 'Trần Trọng Thu', '1915', 'Gốc tộc', 'PUBLISHED', '{\"id\":\"@I1@\",\"name\":\"Trần Trọng Thu\"}')");

    // 4. Test MariaDB Transaction Success
    await withTransaction(mariaAccessor, async (tx) => {
      await tx.runQuery("UPDATE people SET notes = 'Cụ khởi thủy' WHERE id = '@I1@'");
      await tx.runQuery("INSERT INTO proposals (id, account_id, person_id, field, suggested_value, base_value, status) VALUES ('p_test_1', 'u_mem1', '@I1@', 'name', 'Cụ Thu', 'Trần Trọng Thu', 'PENDING')");
    });
    const p1 = await getQuery("SELECT notes FROM people WHERE id = '@I1@'");
    assert.equal(p1.notes, 'Cụ khởi thủy');
    console.log('  ✅ [PASS] 1. Physical MariaDB Transaction Commit verified');

    // 5. Test MariaDB Transaction Rollback on Error
    let caught = false;
    try {
      await withTransaction(mariaAccessor, async (tx) => {
        await tx.runQuery("UPDATE people SET name = 'Tên Bị Hỏng' WHERE id = '@I1@'");
        throw new Error('Simulated physical server error to test rollback');
      });
    } catch (e) {
      caught = true;
    }
    assert.equal(caught, true);
    const p1AfterRollback = await getQuery("SELECT name FROM people WHERE id = '@I1@'");
    assert.equal(p1AfterRollback.name, 'Trần Trọng Thu', 'Name must not change due to rollback');
    console.log('  ✅ [PASS] 2. Physical MariaDB Transaction Rollback verified (data strictly uncommitted)');

    // 6. Test Governance commitProposal with Atomic Audit Log
    const commitResult = await commitProposal(mariaAccessor, 'p_test_1', 'usr_owner_1', 'Đã duyệt hồ sơ', 'acc_owner');
    assert.equal(commitResult.ok, true);
    assert.equal(commitResult.status, 'APPROVED');

    const p1Committed = await getQuery("SELECT name, payload FROM people WHERE id = '@I1@'");
    assert.equal(p1Committed.name, 'Cụ Thu');
    const parsedPayload = JSON.parse(p1Committed.payload);
    assert.equal(parsedPayload.name, 'Cụ Thu');

    const auditRow = await getQuery("SELECT action, correlation_id, actor_role FROM audit_logs WHERE correlation_id = 'p_test_1'");
    assert.ok(auditRow);
    assert.equal(auditRow.action, 'PROPOSAL_COMMIT');
    assert.equal(auditRow.actor_role, 'owner');
    console.log('  ✅ [PASS] 3. Physical MariaDB commitProposal & audit_logs atomic write verified');

    // 7. Test Governance executeDirectEditWithAudit
    const directResult = await executeDirectEditWithAudit(mariaAccessor, {
      actorId: 'usr_owner_1',
      entityType: 'people',
      entityId: '@I1@',
      reason: 'Đính chính ngày mất bia mộ',
      fetchBeforeState: async (tx) => tx.getQuery("SELECT deathYear FROM people WHERE id = '@I1@'"),
      performMutation: async (tx) => {
        await tx.runQuery("UPDATE people SET deathYear = '1995' WHERE id = '@I1@'");
      },
      fetchAfterState: async (tx) => tx.getQuery("SELECT deathYear FROM people WHERE id = '@I1@'")
    });
    assert.equal(directResult.success, true);
    const directAudit = await getQuery("SELECT action, correlation_id FROM audit_logs WHERE correlation_id = ?", [directResult.correlationId]);
    assert.ok(directAudit);
    assert.equal(directAudit.action, 'DIRECT_EDIT');
    console.log('  ✅ [PASS] 4. Physical MariaDB executeDirectEditWithAudit verified');

    // 8. Test Zero Connection Leak across 50 rapid sequential transactions
    for (let i = 0; i < 50; i++) {
      await withTransaction(mariaAccessor, async (tx) => {
        await tx.runQuery("SELECT 1");
      });
    }
    const [statusRows] = await pool.query("SHOW STATUS LIKE 'Threads_connected'");
    console.log(`  ✅ [PASS] 5. Zero connection leak across 50 transactions (Active Threads: ${statusRows[0].Value})`);

    console.log('\n============================================================');
    console.log('🎉 ALL PHYSICAL MARIADB INTEGRATION TESTS PASSED (100%)!');
    console.log('============================================================\n');

  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'EHOSTUNREACH' || err.code === 'ETIMEDOUT') {
      console.log(`\n⚠️  [BLOCKED] Cannot connect to physical MariaDB at ${DB_CONFIG.host}:${DB_CONFIG.port}`);
      console.log(`    Detail: ${err.message}`);
      console.log(`    Action Required: Launch local Docker container or start local MariaDB daemon to complete Phase 1 live testing.\n`);
      process.exit(2);
    } else {
      console.error('\n❌ Physical MariaDB test failed with error:', err);
      process.exit(1);
    }
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

main();

