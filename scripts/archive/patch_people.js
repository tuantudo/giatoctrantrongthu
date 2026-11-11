const fs = require('fs');

let content = fs.readFileSync('server/index.js', 'utf8');

const oldPostPeople = `app.post('/api/people', async (req, res) => {
    const { id, name, birthYear, deathYear, gender, notes, status } = req.body;
    const query = useMariaDB ? 
        "REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)" :
        "INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)";
    await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status]);
    res.json({ success: true });
});`;

const newPostPeople = `app.post('/api/people', async (req, res) => {
    try {
        const { id, name, birthYear, deathYear, gender, notes, status } = req.body;
        
        // Fetch existing payload
        let existing = await allQuery("SELECT payload FROM people WHERE id = ?", [id]);
        let payload = {};
        if (existing.length > 0 && existing[0].payload) {
            payload = typeof existing[0].payload === 'string' ? JSON.parse(existing[0].payload) : existing[0].payload;
        }
        
        // Update payload to reflect reality
        payload.id = id;
        payload.name = name;
        if (!payload.birth) payload.birth = {};
        payload.birth.date = birthYear;
        if (!payload.death) payload.death = {};
        payload.death.date = deathYear;
        payload.sex = gender === 'Nam' ? 'M' : (gender === 'Nữ' ? 'F' : 'U');
        
        const payloadStr = JSON.stringify(payload);
        
        if (useMariaDB) {
            const query = "INSERT INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), birthYear=VALUES(birthYear), deathYear=VALUES(deathYear), gender=VALUES(gender), notes=VALUES(notes), status=VALUES(status), payload=VALUES(payload)";
            await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status, payloadStr]);
        } else {
            const query = "INSERT OR REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status, payloadStr]);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});`;

content = content.replace(oldPostPeople, newPostPeople);
fs.writeFileSync('server/index.js', content);
