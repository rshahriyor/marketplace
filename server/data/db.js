const Database = require('better-sqlite3');

const db = new Database('db.sqlite');

// companies
db.prepare(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id NUMBER NOT NULL
  )
`).run();

// categories
db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
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

// company_tags (many-to-many relationship between companies and tags)
db.prepare(`
  CREATE TABLE IF NOT EXISTS company_tags (
    company_id NUMBER NOT NULL,
    tag_id NUMBER NOT NULL,
    PRIMARY KEY (company_id, tag_id)
  )
`).run();

module.exports = db;