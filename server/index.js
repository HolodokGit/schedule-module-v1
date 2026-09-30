"use strict"

const db = require('./db');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/api/groups', (req, res) => {
    const groups = db.prepare('SELECT * FROM groups ORDER BY course, name').all();
    res.json(groups);
});

app.get('/api/teachers', (req, res) => {
  const teachers = db.prepare('SELECT * FROM teachers ORDER BY name').all();
  res.json(teachers);
});

app.get('/api/schedule', (req, res) => {
  const schedule = db.prepare(`
    SELECT 
      s.id,
      s.group_id    AS groupId,
      g.name        AS groupName,
      s.teacher_id  AS teacherId,
      t.name        AS teacherName,
      s.day,
      s.block_order AS blockOrder,
      s.block_label AS blockLabel,
      s.time,
      s.subject,
      s.room
    FROM schedule s
    LEFT JOIN groups g ON s.group_id = g.id
    LEFT JOIN teachers t ON s.teacher_id = t.id
    ORDER BY s.day, s.block_order
  `).all();
  res.json(schedule);
});

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});