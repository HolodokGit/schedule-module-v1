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

app.put('/api/schedule/:id', (req, res) => {
  const { id } = req.params;
  const {
    groupId,
    teacherId,
    day,
    blockOrder,
    blockLabel,
    time,
    subject,
    room,
  } = req.body;

  if (!groupId || !teacherId || !day || !blockOrder || !blockLabel || !time || !subject || !room) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const update = db.prepare(`
    UPDATE schedule 
    SET group_id = ?, teacher_id = ?, day = ?, block_order = ?, block_label = ?, time = ?, subject = ?, room = ?
    WHERE id = ?
  `);

  const result = update.run(
    groupId,
    teacherId,
    day,
    blockOrder,
    blockLabel,
    time,
    subject,
    room,
    id
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Запись не найдена' });
  }

  res.json({ ok: true });
});

app.delete('/api/schedule/:id', (req, res) => {
  const { id } = req.params;

  const del = db.prepare('DELETE FROM schedule WHERE id = ?');
  const result = del.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Запись не найдена' });
  }

  res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});