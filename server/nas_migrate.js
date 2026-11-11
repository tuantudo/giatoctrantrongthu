require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    console.log("Connecting to MariaDB...");
    const db = await mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'family_archive'
    });

    // 1. Update Schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema_update.sql'), 'utf-8');
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (let stmt of statements) {
        try {
            await db.execute(stmt);
            console.log("Executed:", stmt.substring(0, 50) + "...");
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Error or already exists:", err.message);
            }
        }
    }

    // 2. Load Data
    const genealogy = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/genealogy.json')));
    const mach = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mach.json')));
    const media = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/media.json')));
    const person_media = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/person_media.json')));

    // People
    console.log(`Migrating ${Object.keys(genealogy.people).length} people...`);
    for (let id in genealogy.people) {
        let p = genealogy.people[id];
        let status = 'PUBLISHED';
        let payload = JSON.stringify(p);
        await db.execute(
            `REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status, fsid, payload) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.name, p.birth?.date || '', p.death?.date || '', p.sex === 'M' ? 'Nam' : 'Nữ', '', status, p.fsid || '', payload]
        );
    }

    // Families
    console.log(`Migrating ${Object.keys(genealogy.families).length} families...`);
    for (let id in genealogy.families) {
        let f = genealogy.families[id];
        await db.execute(
            `REPLACE INTO families (id, husb, wife, payload) VALUES (?, ?, ?, ?)`,
            [f.id, f.husb || '', f.wife || '', JSON.stringify(f)]
        );
    }

    // Memories
    if (genealogy.memories) {
        console.log(`Migrating ${genealogy.memories.length} memories...`);
        for (let m of genealogy.memories) {
            await db.execute(
                `REPLACE INTO memories (id, title, story, personId, payload) VALUES (?, ?, ?, ?, ?)`,
                [m.id, m.title || '', m.story || '', m.personId || '', JSON.stringify(m)]
            );
        }
    }

    // Timeline
    if (genealogy.timeline) {
        console.log(`Migrating ${genealogy.timeline.length} timeline events...`);
        for (let t of genealogy.timeline) {
            await db.execute(
                `REPLACE INTO timeline (id, date, title, description, icon) VALUES (?, ?, ?, ?, ?)`,
                [t.id || Math.random().toString(), t.date || '', t.title || '', t.description || '', t.icon || '']
            );
        }
    }

    // Authors
    if (mach.authors) {
        for (let id in mach.authors) {
            let a = mach.authors[id];
            await db.execute(
                `REPLACE INTO authors (id, name, role, payload) VALUES (?, ?, ?, ?)`,
                [a.id, a.name, a.role || '', JSON.stringify(a)]
            );
        }
    }

    // Series
    if (mach.series) {
        for (let id in mach.series) {
            let s = mach.series[id];
            await db.execute(
                `REPLACE INTO series (id, title, description, payload) VALUES (?, ?, ?, ?)`,
                [s.id || s.slug, s.title, s.description || '', JSON.stringify(s)]
            );
        }
    }

    // Stories
    if (mach.stories) {
        console.log(`Migrating ${mach.stories.length} stories...`);
        for (let s of mach.stories) {
            await db.execute(
                `REPLACE INTO stories (id, title, author, content, status, updatedAt, payload) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [s.slug || s.id, s.title, s.authorId || '', s.content || '', 'PUBLISHED', s.publishedAt || s.date || '', JSON.stringify(s)]
            );
        }
    }

    // Media
    console.log(`Migrating ${Object.keys(media).length} media items...`);
    for (let id in media) {
        let m = media[id];
        await db.execute(
            `REPLACE INTO media (id, filename, mimetype, payload) VALUES (?, ?, ?, ?)`,
            [id, m.path || m.filename || '', m.mimetype || m.type || '', JSON.stringify(m)]
        );
    }

    // Person Media
    console.log(`Migrating ${person_media.length} person_media links...`);
    for (let pm of person_media) {
        await db.execute(
            `REPLACE INTO person_media (relation_id, person_id, asset_id, role, is_primary) VALUES (?, ?, ?, ?, ?)`,
            [pm.relationId, pm.personId, pm.assetId, pm.role || '', pm.isPrimary ? 1 : 0]
        );
    }

    // Calendars
    const icsFiles = fs.readdirSync(path.join(__dirname, 'calendars')).filter(f => f.endsWith('.ics'));
    console.log(`Migrating calendars...`);
    for (let file of icsFiles) {
        let text = fs.readFileSync(path.join(__dirname, 'calendars', file), 'utf-8');
        let lines = text.split(/\r?\n/);
        let currentEvent = null;
        for (let line of lines) {
            if (line.startsWith('BEGIN:VEVENT')) {
                currentEvent = { type: file.replace('.ics', '') };
            } else if (line.startsWith('END:VEVENT')) {
                if (currentEvent && currentEvent.uid) {
                    await db.execute(
                        `REPLACE INTO calendar_events (uid, summary, dtstart, description, calendar_type) VALUES (?, ?, ?, ?, ?)`,
                        [currentEvent.uid, currentEvent.summary || '', currentEvent.dtstart || '', currentEvent.description || '', currentEvent.type]
                    );
                }
                currentEvent = null;
            } else if (currentEvent) {
                if (line.startsWith('UID:')) currentEvent.uid = line.substring(4);
                if (line.startsWith('SUMMARY:')) currentEvent.summary = line.substring(8);
                if (line.startsWith('DTSTART')) currentEvent.dtstart = line.split(':')[1];
                if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12);
            }
        }
    }

    console.log("Migration complete!");
    process.exit(0);
}

migrate().catch(console.error);
