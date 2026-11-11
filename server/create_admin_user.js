/**
 * create_admin_user.js — CLI script to create the first admin user.
 * Usage: node create_admin_user.js <username> <password> [role]
 * Default role: 'owner'
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const [, , username, password, role = 'owner'] = process.argv;

if (!username || !password) {
    console.error('Usage: node create_admin_user.js <username> <password> [role]');
    process.exit(1);
}

async function main() {
    const hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        if (process.env.DB_CLIENT === 'mysql') {
            const mysql = require('mysql2/promise');
            const db = await mysql.createPool({
                host: process.env.DB_HOST || '127.0.0.1', port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER, password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME || 'family_archive'
            });
            await db.execute(
                "INSERT INTO admin_users (username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, 1, ?)",
                [username, hash, role, now]
            );
            await db.end();
        } else {
            const sqlite3 = require('sqlite3').verbose();
            const path = require('path');
            const db = new sqlite3.Database(process.env.DB_PATH || path.join(__dirname, 'family_archive.db'));
            await new Promise((resolve, reject) => db.run(
                "INSERT INTO admin_users (id, username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
                [crypto.randomUUID(), username, hash, role, now],
                (error) => error ? reject(error) : resolve()
            ));
            await new Promise((resolve) => db.close(resolve));
        }
        console.log(`✅ Admin user "${username}" created with role "${role}".`);
    } catch (e) {
        if (e.message.includes('Duplicate')) {
            console.error(`❌ Username "${username}" already exists.`);
        } else {
            console.error('❌ Error:', e.message);
        }
    }
}

main();
