"use strict"

const GROUPS = [
    // Смешанные группы
    { id: '11-sm', name: '11-СМ', course: 1 },
    { id: '21-sm', name: '21-СМ', course: 2 },
    { id: '31-sf', name: '31-СФ', course: 3 },
    { id: '41-hm', name: '41-ХМ', course: 4 },

    // Воспитатели
    { id: '11-v', name: '11-В', course: 1 },
    { id: '21-v', name: '21-В', course: 2 },
    { id: '31-v', name: '31-В', course: 3 },
    { id: '41-v', name: '41-В', course: 4 },

    // Хореография
    { id: '11-h', name: '11-Х', course: 1 },
    { id: '21-h', name: '21-Х', course: 2 },
    { id: '31-h', name: '31-Х', course: 3 },

    // Коррекционка
    { id: '11-k', name: '11-К', course: 1 },
    { id: '21-k', name: '21-К', course: 2 },
    { id: '31-k', name: '31-К', course: 3 },
    { id: '41-k', name: '41-К', course: 4 },

    // Физруки
    { id: '11-f', name: '11-Ф', course: 1 },
    { id: '21-f', name: '21-Ф', course: 2 },
    { id: '41-f', name: '41-Ф', course: 4 },

    // Тренеры
    { id: '11-t', name: '11-Т', course: 1 },
    { id: '21-t', name: '21-Т', course: 2 },
    { id: '31-t', name: '31-Т', course: 3 },
    { id: '41-t', name: '41-Т', course: 4 },

    // Учителя
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
    { id: '11-r', name: '11-Р', course: 1 },
    { id: '21-i', name: '21-И', course: 2 },
    { id: '31-i', name: '31-И', course: 3 },
    { id: '41-i', name: '41-И', course: 4}
];