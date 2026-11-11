const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'family_archive.db');
const db = new sqlite3.Database(dbPath);

const schema = `
CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    name TEXT,
    birthYear TEXT,
    deathYear TEXT,
    gender TEXT,
    notes TEXT,
    status TEXT,
    payload TEXT
);

CREATE TABLE IF NOT EXISTS families (
    id TEXT PRIMARY KEY,
    husband_id TEXT,
    wife_id TEXT,
    date TEXT,
    notes TEXT,
    status TEXT,
    payload TEXT
);

CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    person_id TEXT,
    title TEXT,
    story TEXT,
    payload TEXT
);

CREATE TABLE IF NOT EXISTS timeline (
    id TEXT PRIMARY KEY,
    person_id TEXT,
    date TEXT,
    event TEXT,
    payload TEXT
);

CREATE TABLE IF NOT EXISTS edges (
    source_id TEXT,
    target_id TEXT,
    edge_type TEXT,
    PRIMARY KEY (source_id, target_id, edge_type)
);

CREATE TABLE IF NOT EXISTS authors (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS series (id TEXT PRIMARY KEY);
`;

db.exec(schema, (err) => {
    if (err) {
        console.error("Error creating schema", err);
    } else {
        console.log("Schema created successfully.");
    }
    db.close();
});
