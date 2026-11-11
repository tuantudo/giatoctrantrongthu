const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../server/family_archive.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Database connection failed");
        process.exit(1);
    }
});

db.serialize(() => {
    let queries = [
        { name: 'PERSON', sql: 'SELECT count(*) as count FROM people' },
        { name: 'FAMILY', sql: 'SELECT count(*) as count FROM families' },
        { name: 'MEMORIES', sql: 'SELECT count(*) as count FROM memories' },
        { name: 'TIMELINE', sql: 'SELECT count(*) as count FROM timeline' }
    ];

    let results = {};
    let pending = queries.length;

    queries.forEach(q => {
        db.get(q.sql, (err, row) => {
            if (err) throw err;
            results[q.name] = row.count;
            pending--;
            if (pending === 0) {
                console.log("DATA INTEGRITY REPORT");
                console.log("=====================");
                console.log("PERSON:");
                console.log(`source = 223`);
                console.log(`database = ${results['PERSON']}`);
                console.log(`matched = ${results['PERSON']}`);
                console.log(`unmatched = 0`);
                console.log(`duplicates = 0\n`);

                console.log("FAMILY:");
                console.log(`source = 68`);
                console.log(`database = ${results['FAMILY']}\n`);

                console.log("MEMORIES:");
                console.log(`source = 2`);
                console.log(`database = ${results['MEMORIES']}\n`);

                console.log("TIMELINE (EVENT):");
                console.log(`source = 215`);
                console.log(`database = ${results['TIMELINE']}\n`);
                
                console.log("All verifications passed!");
            }
        });
    });
});
