const Database = require('better-sqlite3');

const db = new Database('db.sqlite');

// companies
db.prepare(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT NOT NULL
  )
`).run();

// categories (если их ещё нет)
db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )
`).run();

module.exports = db;