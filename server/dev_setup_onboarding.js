const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const db = new sqlite3.Database('family_archive.db');

const runQuery = (q, p = []) => new Promise((res, rej) => db.run(q, p, err => err ? rej(err) : res()));
const getQuery = (q, p = []) => new Promise((res, rej) => db.get(q, p, (err, row) => err ? rej(err) : res(row)));

function generateUsername(name) {
    let unaccented = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    let parts = unaccented.toLowerCase().split(/\s+/);
    if(parts.length === 0) return "user";
    let username = parts[parts.length - 1]; // last name / ten
    for(let i=0; i<parts.length-1; i++) {
        username += parts[i][0]; // initials
    }
    return username;
}

async function setup() {
    // Drop accounts to get fresh schema
    await runQuery("DROP TABLE IF EXISTS accounts");
    await runQuery("DROP TABLE IF EXISTS identity_mappings"); await runQuery("DROP TABLE IF EXISTS authorities");
    await runQuery("DROP TABLE IF EXISTS identity_mappings"); await runQuery("DROP TABLE IF EXISTS authorities");

    // Run foundation
    const { initFoundationTables } = require('./foundation');
    await initFoundationTables(runQuery, false);

    // Map to real person ID from genealogy.json
    const personId = '@I115@';

    // Generate Username (tuantq)
    let baseUser = generateUsername('Trần Quốc Tuấn');
    let username = baseUser;
    // (mock collision check)
    let acc = await getQuery("SELECT id FROM accounts WHERE username=?", [username]);
    if(acc) {
        username = baseUser + '2';
    }

    // Provision
    const accountId = randomUUID();
    const tempPassword = '050787'; // from birthdate
    const hash = await bcrypt.hash(tempPassword, 10);

    await runQuery(`INSERT INTO accounts (id, username, password_hash, role, status) VALUES (?, ?, ?, ?, ?)`,
                   [accountId, username, hash, 'member', 'PROVISIONED']);
    await runQuery(`INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)`, [accountId, personId]);
    
    console.log(`Provisioned account:`);
    console.log(`Person: Trần Quốc Tuấn (ID: ${personId})`);
    console.log(`Username: ${username}`);
    console.log(`Status: PROVISIONED`);
}

setup().then(() => db.close()).catch(console.error);
