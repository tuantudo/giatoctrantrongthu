const fs = require('fs');
const content = fs.readFileSync('server/index.js', 'utf8');
const newRoute = `
// ------------------- DATABASE ADMIN ROUTES -------------------
app.get('/api/admin/database/schema', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const client = process.env.DB_CLIENT || 'sqlite3';
        let tables = [];
        let info = { client, database: process.env.DB_NAME || 'family_archive', host: process.env.DB_HOST || 'local' };
        
        if (client === 'sqlite3') {
            const tableObjs = await dbAccessor.allQuery("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            for (let t of tableObjs) {
                const countObj = await dbAccessor.getQuery("SELECT COUNT(*) as c FROM " + t.name);
                tables.push({ name: t.name, rows: countObj.c, engine: 'SQLite', primary_key: 'id' });
            }
        }
        res.json({ info, tables });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

`;
const newContent = content.replace('// ------------------- MEMBER ROUTES (P0.1) -------------------', newRoute + '// ------------------- MEMBER ROUTES (P0.1) -------------------');
fs.writeFileSync('server/index.js', newContent);
