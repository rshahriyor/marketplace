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

module.exports = db;