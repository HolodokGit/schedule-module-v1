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

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});