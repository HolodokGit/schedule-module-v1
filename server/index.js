"use strict"

require('dotenv').config();

const crypto = require('crypto');
const db = require('./db');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKENS = new Set();   // активные токены в памяти

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  TOKENS.add(token);

  res.json({ token });
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');

  if (!TOKENS.has(token)) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  next();
}

app.get('/api/groups', (req, res) => {
    const groups = db.prepare('SELECT * FROM groups ORDER BY course, name').all();
    res.json(groups);
});

app.post('/api/groups', requireAuth, (req, res) => {
  const { id, name, course } = req.body;

  if (!id || !name || !course) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const insert = db.prepare(`
      INSERT INTO groups (id, name, course) VALUES (?, ?, ?)
    `);
    insert.run(id, name, course);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Группа с таким id уже существует' });
  }
});

app.put('/api/groups/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { name, course } = req.body;

  if (!name || !course) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const update = db.prepare(`
    UPDATE groups SET name = ?, course = ? WHERE id = ?
  `);
  const result = update.run(name, course, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Группа не найдена' });
  }

  res.json({ ok: true });
});

app.delete('/api/groups/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  // Проверка — есть ли пары у группы
  const count = db.prepare('SELECT COUNT(*) AS c FROM schedule WHERE group_id = ?').get(id);
  if (count.c > 0) {
    return res.status(400).json({ error: `У группы ${count.c} пар. Сначала удалите их.` });
  }

  const del = db.prepare('DELETE FROM groups WHERE id = ?');
  const result = del.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Группа не найдена' });
  }

  res.json({ ok: true });
});

app.get('/api/teachers', (req, res) => {
  const teachers = db.prepare('SELECT * FROM teachers ORDER BY name').all();
  res.json(teachers);
});

app.post('/api/teachers', requireAuth, (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const insert = db.prepare('INSERT INTO teachers (id, name) VALUES (?, ?)');
    insert.run(id, name);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Преподаватель с таким id уже существует' });
  }
});

app.put('/api/teachers/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Имя обязательно' });
  }

  const update = db.prepare('UPDATE teachers SET name = ? WHERE id = ?');
  const result = update.run(name, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Преподаватель не найден' });
  }

  res.json({ ok: true });
});

app.delete('/api/teachers/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  const count = db.prepare('SELECT COUNT(*) AS c FROM schedule WHERE teacher_id = ?').get(id);
  if (count.c > 0) {
    return res.status(400).json({ error: `У преподавателя ${count.c} пар. Сначала удалите их.` });
  }

  const del = db.prepare('DELETE FROM teachers WHERE id = ?');
  const result = del.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Преподаватель не найден' });
  }

  res.json({ ok: true });
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



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/schedule.html'));
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.put('/api/schedule/:id', requireAuth, (req, res) => {
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

app.post('/api/schedule', requireAuth, (req, res) => {
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

  const insert = db.prepare(`
    INSERT INTO schedule (group_id, teacher_id, day, block_order, block_label, time, subject, room)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    groupId,
    teacherId,
    day,
    blockOrder,
    blockLabel,
    time,
    subject,
    room
  );

  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/schedule/:id', requireAuth, (req, res) => {
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