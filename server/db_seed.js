const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'family_archive.db');
const db = new sqlite3.Database(dbPath);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'genealogy.json');
const mediaFile = path.join(dataDir, 'media.json');
const pMediaFile = path.join(dataDir, 'person_media.json');

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const mediaData = fs.existsSync(mediaFile) ? JSON.parse(fs.readFileSync(mediaFile, 'utf8')) : {};
const pMediaData = fs.existsSync(pMediaFile) ? JSON.parse(fs.readFileSync(pMediaFile, 'utf8')) : [];

db.serialize(() => {
    // Clear data
    db.run("DELETE FROM people");
    db.run("DELETE FROM families");
    db.run("DELETE FROM memories");
    db.run("DELETE FROM timeline");
    db.run("DROP TABLE IF EXISTS media");
    db.run("DROP TABLE IF EXISTS person_media");
    db.run("CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, payload TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS person_media (relation_id TEXT PRIMARY KEY, person_id TEXT, media_id TEXT)");

    const insertPerson = db.prepare("INSERT INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    let pCount = 0; let mCount = 0;
    const insertMemory = db.prepare("INSERT INTO memories (id, person_id, title, story, payload) VALUES (?, ?, ?, ?, ?)");

    if (data.people) {
        for (const key in data.people) {
            const p = data.people[key];
            const payload = JSON.stringify(p);
            const birthDate = (p.birth && typeof p.birth === 'object') ? (p.birth.date || null) : (p.birth || null);
            const deathDate = (p.death && typeof p.death === 'object') ? (p.death.date || null) : (p.death || null);
            insertPerson.run(p.id, p.name, birthDate, deathDate, p.sex, "", "PUBLISHED", payload);
            pCount++;
            if (p.memory) {
                const m = p.memory;
                const mId = "m_" + key;
                insertMemory.run(mId, key, m.title || "", m.story || "", JSON.stringify(m));
                mCount++;
            }
        }
    }
    insertPerson.finalize(); insertMemory.finalize();

    const insertFamily = db.prepare("INSERT INTO families (id, husband_id, wife_id, date, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?)");
    let fCount = 0;
    if (data.families) {
        for (const key in data.families) {
            const f = data.families[key];
            const payload = JSON.stringify(f);
            insertFamily.run(f.id, f.husb || null, f.wife || null, f.marr || "", "", "PUBLISHED", payload);
            fCount++;
        }
    }
    insertFamily.finalize();

    let tCount = 0;
    const insertTimeline = db.prepare("INSERT INTO timeline (id, person_id, date, event, payload) VALUES (?, ?, ?, ?, ?)");
    if (data.timeline) {
        for (let i = 0; i < data.timeline.length; i++) {
            const t = data.timeline[i];
            const tId = "t_" + i;
            insertTimeline.run(tId, t.personId, t.date || "", t.type || "", JSON.stringify(t));
            tCount++;
        }
    }
    insertTimeline.finalize();

    const insertMedia = db.prepare("INSERT INTO media (id, payload) VALUES (?, ?)");
    let medCount = 0;
    for (const key in mediaData) {
        insertMedia.run(key, JSON.stringify(mediaData[key]));
        medCount++;
    }
    insertMedia.finalize();

    const insertPM = db.prepare("INSERT INTO person_media (relation_id, person_id, media_id) VALUES (?, ?, ?)");
    let pmCount = 0;
    for (let i = 0; i < pMediaData.length; i++) {
        const pm = pMediaData[i];
        insertPM.run(pm.relationId || `pm_${i}`, pm.personId, pm.assetId || pm.mediaId);
        pmCount++;
    }
    insertPM.finalize();

    console.log(`Seeded ${pCount} persons, ${fCount} families, ${mCount} memories, ${tCount} timeline, ${medCount} media, ${pmCount} pm.`);
});

db.close();
