const Database = require('better-sqlite3');

const db = new Database('db.sqlite');

// db.prepare(`DROP TABLE IF EXISTS schedules`).run();
// db.prepare(`DROP TABLE IF EXISTS company_tags`).run();
// db.prepare(`DROP TABLE IF EXISTS companies`).run();
// db.prepare(`DROP TABLE IF EXISTS favorites`).run();
// db.prepare(`DROP TABLE IF EXISTS files`).run();

// companies
db.prepare(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    search_name TEXT NOT NULL, -- used for case-insensitive Cyrillic search
    category_id NUMBER NOT NULL,
    region_id NUMBER NOT NULL,
    city_id NUMBER NOT NULL,
    desc TEXT NOT NULL,
    phone_number NUMBER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address TEXT NOT NULL,
    created_by_user_id NUMBER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1
  )
`).run();

// categories
db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
  )
`).run();

// tags
db.prepare(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id NUMBER NOT NULL
  )
`).run();

// files
db.prepare(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// company_files (many-to-many relationship between companies and files)
db.prepare(`
  CREATE TABLE IF NOT EXISTS company_files (
    company_id NUMBER NOT NULL,
    file_id NUMBER NOT NULL,
    PRIMARY KEY (company_id, file_id),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
  )
`).run();

// regions
db.prepare(`
  CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

// cities
db.prepare(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id NUMBER NOT NULL
  )
`).run();

// company_tags (many-to-many relationship between companies and tags)
db.prepare(`
  CREATE TABLE IF NOT EXISTS company_tags (
    company_id NUMBER NOT NULL,
    tag_id NUMBER NOT NULL,
    PRIMARY KEY (company_id, tag_id)
  )
`).run();

// users
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number NUMBER NOT NULL,
    gender_id NUMBER NOT NULL
  )
`).run();

// genders
db.prepare(`
  CREATE TABLE IF NOT EXISTS genders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

// schedules
db.prepare(`
  CREATE TABLE IF NOT EXISTS schedules (
    company_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    lunch_start_at TEXT,
    lunch_end_at TEXT,
    is_working_day BOOLEAN NOT NULL,
    is_day_and_night BOOLEAN NOT NULL,
    without_breaks BOOLEAN NOT NULL,
    PRIMARY KEY (company_id, day_of_week),
    FOREIGN KEY (company_id) REFERENCES companies(id)
  )
`).run();

// social_media
db.prepare(`
  CREATE TABLE IF NOT EXISTS social_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

// social_media_accounts
db.prepare(`
  CREATE TABLE IF NOT EXISTS social_media_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    social_media_id INTEGER NOT NULL,
    account_url TEXT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (social_media_id) REFERENCES social_media(id)
  )
`).run();

// favorites
db.prepare(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    UNIQUE(user_id, company_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )
`).run();

module.exports = db;