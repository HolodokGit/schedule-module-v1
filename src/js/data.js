"use strict"

const state = {
    type: 'group',
    selectedId: null,
    activeDay: 'mon',
}

const GROUPS = [
    { id: '11-u', name: '11-У', course: 1 },
    { id: '21-u', name: '21-У', course: 2 },
    { id: '31-u', name: '31-У', course: 3 },
    { id: '41-u', name: '41-У', course: 4 },

    // СДО
    { id: '11-sdo', name: '11-СДО', course: 1 },
    { id: '21-sdo', name: '21-СДО', course: 2 },
    { id: '31-sdo', name: '31-СДО', course: 3 },
    { id: '41-sdo', name: '41-СДО', course: 4 },

    // Дизайн
    { id: '11-d', name: '11-Д', course: 1 },
    { id: '21-d', name: '21-Д', course: 2 },
    { id: '31-d', name: '31-Д', course: 3 },
    { id: '41-d', name: '41-Д', course: 4 },

    // Информатика
    { id: '11-i', name: '11-И', course: 1 },
    { id: '21-i', name: '21-И', course: 2 },
    { id: '31-i', name: '31-И', course: 3 },
    { id: '41-i', name: '41-И', course: 4}
];

const TEACHERS = [
    { id: 'ivanov', name: 'Иванов И.И.' },
    { id: 'petrov', name: 'Петров П.П.'}
];

const SCHEDULE = [
    {
        groupId: '11-i',
        teacherId: 'ivanov',
        day: 'mon',
        blockOrder: 1,
        blockLabel: '1-2',
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    },
    {
        groupId: '11-i',
        teacherId: 'petrov',
        day: 'mon',
        blockOrder: 2,
        blockLabel: '3-4',
        time: '10:10-11:40',
        subject: 'Программирование',
        room: 205, 
    },
    {
        groupId: '11-i',
        teacherId: 'Ivanov',
        day: 'tue',
        blockOrder: 1,
        blockLabel: '1-2',
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    },
    {
        groupId: '11-i',
        teacherId: 'Ivanov',
        day: 'tue',
        blockOrder: 1,
        blockLabel: '1-2',
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    }
];