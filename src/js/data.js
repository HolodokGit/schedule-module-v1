"use strict"

const state = {
    type: 'group',
    selectId: null,
    activeDay: 'mon',
}

const GROUPS = [
    { id: '11-i', name: '11-И' },
    { id: '21-i', name: '21-И' },
    { id: '31-i', name: '31-И' }
];

const TEACHERS = [
    { id: 'ivanov', name: 'Иванов И.И.' },
    { id: 'petrov', name: 'Петров П.П.'}
];

const SCHEDULE = [
    {
        groupId: '11-i',
        teacherId: 'Ivanov',
        day: 'mon',
        pair: 1,
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    },
    {
        groupId: '11-i',
        teacherId: 'petrov',
        day: 'mon',
        pair: 2,
        time: '10:10-11:40',
        subject: 'Программирование',
        room: 205, 
    },
    {
        groupId: '11-i',
        teacherId: 'Ivanov',
        day: 'tue',
        pair: 1,
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    },
    {
        groupId: '11-i',
        teacherId: 'Ivanov',
        day: 'tue',
        pair: 1,
        time: '8:30-10:00',
        subject: 'Математика',
        room: 312,
    }
];