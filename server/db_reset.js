const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../server/family_archive.db');
const db = new sqlite3.Database(dbPath);

const queries = [
    "DROP TABLE IF EXISTS people",
    "DROP TABLE IF EXISTS families",
    "DROP TABLE IF EXISTS memories",
    "DROP TABLE IF EXISTS timeline",
    "DROP TABLE IF EXISTS edges"
];

db.serialize(() => {
    for(let q of queries) db.run(q);
    
    db.run(`CREATE TABLE people (
        id TEXT PRIMARY KEY,
        name TEXT,
        birthYear TEXT,
        deathYear TEXT,
        gender TEXT,
        notes TEXT,
        status TEXT,
        payload TEXT
    )`);
    db.run(`CREATE TABLE families (
        id TEXT PRIMARY KEY,
        husband_id TEXT,
        wife_id TEXT,
        date TEXT,
        notes TEXT,
        status TEXT,
        payload TEXT
    )`);
    db.run(`CREATE TABLE memories (
        id TEXT PRIMARY KEY,
        person_id TEXT,
        title TEXT,
        story TEXT,
        payload TEXT
    )`);
    db.run(`CREATE TABLE timeline (
        id TEXT PRIMARY KEY,
        person_id TEXT,
        date TEXT,
        event TEXT,
        payload TEXT
    )`);
    db.run(`CREATE TABLE edges (
        source_id TEXT,
        target_id TEXT,
        edge_type TEXT,
        PRIMARY KEY (source_id, target_id, edge_type)
    )`);
    console.log("Database reset and schema created.");
});
