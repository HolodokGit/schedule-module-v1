"use strict"

const db = require('./db');

const groups = [
  { id: '11-sm', name: '11-СМ', course: 1 },
  { id: '21-sm', name: '21-СМ', course: 2 },
  { id: '31-sf', name: '31-СФ', course: 3 },
  { id: '41-hm', name: '41-ХМ', course: 4 },
  { id: '11-v', name: '11-В', course: 1 },
  { id: '21-v', name: '21-В', course: 2 },
  { id: '31-v', name: '31-В', course: 3 },
  { id: '41-v', name: '41-В', course: 4 },
  { id: '11-h', name: '11-Х', course: 1 },
  { id: '21-h', name: '21-Х', course: 2 },
  { id: '31-h', name: '31-Х', course: 3 },
  { id: '11-k', name: '11-К', course: 1 },
  { id: '21-k', name: '21-К', course: 2 },
  { id: '31-k', name: '31-К', course: 3 },
  { id: '41-k', name: '41-К', course: 4 },
  { id: '11-f', name: '11-Ф', course: 1 },
  { id: '21-f', name: '21-Ф', course: 2 },
  { id: '41-f', name: '41-Ф', course: 4 },
  { id: '11-t', name: '11-Т', course: 1 },
  { id: '21-t', name: '21-Т', course: 2 },
  { id: '31-t', name: '31-Т', course: 3 },
  { id: '41-t', name: '41-Т', course: 4 },
  { id: '11-u', name: '11-У', course: 1 },
  { id: '21-u', name: '21-У', course: 2 },
  { id: '31-u', name: '31-У', course: 3 },
  { id: '41-u', name: '41-У', course: 4 },
  { id: '11-sdo', name: '11-СДО', course: 1 },
  { id: '21-sdo', name: '21-СДО', course: 2 },
  { id: '31-sdo', name: '31-СДО', course: 3 },
  { id: '41-sdo', name: '41-СДО', course: 4 },
  { id: '11-d', name: '11-Д', course: 1 },
  { id: '21-d', name: '21-Д', course: 2 },
  { id: '31-d', name: '31-Д', course: 3 },
  { id: '41-d', name: '41-Д', course: 4 },
  { id: '11-r', name: '11-Р', course: 1 },
  { id: '21-i', name: '21-И', course: 2 },
  { id: '31-i', name: '31-И', course: 3 },
  { id: '41-i', name: '41-И', course: 4 },
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO groups (id, name, course) VALUES (?, ?, ?)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item.id, item.name, item.course);
  }
});

insertMany(groups);
console.log(`Inserted ${groups.length} groups`);


const teachers = [
    { id: 'ivanov', name: 'Иванов И.И.' },
    { id: 'petrov', name: 'Петров П.П.'},
    { id: 'sergeev', name: 'Сергеев А.В.'},
    { id: 'sergeeva', name: 'Сергеева Н.А.'},
    { id: 'korneev', name: 'Корнеев Д.В.'},
    { id: 'komarova', name: 'Комарова Е.В.'},
    { id: 'kuznetsova', name: 'Кузнецова Л.В.'},
];

const insertTeacher = db.prepare(`
  INSERT OR REPLACE INTO teachers (id, name) VALUES (?, ?)
`);

const insertTeachers = db.transaction((items) => {
  for (const item of items) {
    insertTeacher.run(item.id, item.name);
  }
});

insertTeachers(teachers);
console.log(`Inserted ${teachers.length} teachers`);

const schedule = [
  {
    group_id: '11-r',
    teacher_id: 'ivanov',
    day: 'mon',
    block_order: 1,
    block_label: '1-2',
    time: '8:30-10:00',
    subject: 'Математика',
    room: '312',
  },
  {
    group_id: '11-r',
    teacher_id: 'petrov',
    day: 'mon',
    block_order: 2,
    block_label: '3-4',
    time: '10:10-11:40',
    subject: 'Программирование',
    room: '205',
  },
  {
    group_id: '11-r',
    teacher_id: 'ivanov',
    day: 'tue',
    block_order: 1,
    block_label: '1-2',
    time: '8:30-10:00',
    subject: 'Математика',
    room: '312',
  },
  {
    group_id: '21-i',
    teacher_id: 'petrov',
    day: 'mon',
    block_order: 1,
    block_label: '1-2',
    time: '8:30-10:00',
    subject: 'Программирование',
    room: '205',
  },
];

const insertSchedule = db.prepare(`
  INSERT INTO schedule (group_id, teacher_id, day, block_order, block_label, time, subject, room)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertScheduleMany = db.transaction((items) => {
  for (const item of items) {
    insertSchedule.run(
      item.group_id,
      item.teacher_id,
      item.day,
      item.block_order,
      item.block_label,
      item.time,
      item.subject,
      item.room
    );
  }
});

insertScheduleMany(schedule);

console.log(`Inserted ${schedule.length} schedule records`);