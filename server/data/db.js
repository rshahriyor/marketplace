const Database = require('better-sqlite3');

const db = new Database('db.sqlite');

// db.prepare(`DROP TABLE IF EXISTS companies`).run();
// db.prepare(`DROP TABLE IF EXISTS categories`).run();

// companies
db.prepare(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id NUMBER NOT NULL,
    region_id NUMBER NOT NULL,
    city_id NUMBER NOT NULL,
    desc TEXT NOT NULL,
    phone_number NUMBER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address TEXT NOT NULL
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

module.exports = db;