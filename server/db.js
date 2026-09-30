"use strict"

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    course INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    day TEXT NOT NULL,
    block_order INTEGER NOT NULL,
    block_label TEXT NOT NULL,
    time TEXT NOT NULL,
    subject TEXT NOT NULL,
    room TEXT NOT NULL
  );
`);

module.exports = db;