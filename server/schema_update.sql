ALTER TABLE people ADD COLUMN fsid VARCHAR(255);
ALTER TABLE people ADD COLUMN payload JSON;

ALTER TABLE stories ADD COLUMN payload JSON;

CREATE TABLE IF NOT EXISTS families (
    id VARCHAR(255) PRIMARY KEY,
    husb VARCHAR(255),
    wife VARCHAR(255),
    payload JSON
);

CREATE TABLE IF NOT EXISTS memories (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    story LONGTEXT,
    personId VARCHAR(255),
    payload JSON
);

CREATE TABLE IF NOT EXISTS timeline (
    id VARCHAR(255) PRIMARY KEY,
    date VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(255) PRIMARY KEY,
    filename VARCHAR(255),
    mimetype VARCHAR(50),
    payload JSON
);

CREATE TABLE IF NOT EXISTS person_media (
    relation_id VARCHAR(255) PRIMARY KEY,
    person_id VARCHAR(255),
    asset_id VARCHAR(255),
    role VARCHAR(50),
    is_primary BOOLEAN
);

CREATE TABLE IF NOT EXISTS calendar_events (
    uid VARCHAR(255) PRIMARY KEY,
    summary VARCHAR(255),
    dtstart VARCHAR(50),
    description TEXT,
    calendar_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS authors (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    payload JSON
);

CREATE TABLE IF NOT EXISTS series (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    payload JSON
);
ALTER DATABASE family_archive CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE people CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE stories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE families CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE memories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE timeline CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE media CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE person_media CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE calendar_events CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE authors CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE series CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
