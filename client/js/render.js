"use strict"

// Рендер разделов Группы и Преподавателей
function renderTypes() {
    const container = document.querySelector('[data-slot="types"]');
    container.innerHTML = '';

    const types = [
        { id: 'group', name: 'Группы' },
        { id: 'teacher', name: 'Преподаватели' }
    ];

    types.forEach(type => {
        const el = document.createElement('div');
        el.className = 'sched-type';
        if(state.type === type.id) {
            el.classList.add('is-active');
        }
        el.dataset.type = type.id;
        el.textContent = type.name;
        container.appendChild(el);
    });
}

// Рендер Групп(с разбивкой по курсам) и преподавателей(которые запускают свою функцию)
function renderList() {
    const container = document.querySelector('[data-slot="list"]');

    container.innerHTML = '';

    container.classList.toggle('sched-list--teachers', state.type === 'teacher');
    
    const items = state.type === 'group' ? GROUPS : TEACHERS;

    if(state.type === 'teacher') {
        renderFlatList(container, items);
        return;
    }

    const byCourse = {};
    items.forEach(item => {
        if(!byCourse[item.course]) byCourse[item.course] = [];
        byCourse[item.course].push(item);
    });

    const courses = Object.keys(byCourse).sort((a, b) => a - b);

    courses.forEach(course => {
        const section = document.createElement('div');
        section.className = 'sched-course';

        const title = document.createElement('div');
        title.className = 'sched-course-title';
        title.textContent = `${course} курс`;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'sched-course-grid';

        byCourse[course].forEach(item => {
            const el = document.createElement('div');
            el.className = 'sched-item';
            if(state.selectedId === item.id) {
                el.classList.add('is-active');
            }
            el.dataset.id = item.id;
            el.textContent = item.name;
            grid.appendChild(el);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

// Рендер преподавателей
function renderFlatList(container, items) {
    const grid = document.createElement('div');
    grid.className = 'sched-course-grid';

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'sched-item';
        if(state.selectedId === item.id) {
            el.classList.add('is-active');
        }
        el.dataset.id = item.id;
        el.textContent = item.name;
        grid.appendChild(el);
    })
    container.appendChild(grid);
}

// Событие onclick запускающее функции рендера Групп и Преподаватедлей
function initTypeClicks() {
    const container = document.querySelector('[data-slot="types"]');

    container.addEventListener('click', (event) => {
        const el = event.target.closest('.sched-type');
        if(!el) return;

        state.type = el.dataset.type;
        state.selectedId = null;
        state.activeDay = 'mon';
        renderList();
        renderTypes();
        renderSchedule();
    })
}

initTypeClicks();

// Рендер дней недели и самого расписания
function renderSchedule() {
    const container = document.querySelector('[data-slot="schedule"]');

    container.innerHTML = '';

    if(!state.selectedId) return;

    renderDayTabs(container);
    renderCards(container);
}

// Функция для дней недели
function renderDayTabs(container) {
    const DAYS = [
        { id: 'mon', name: 'Пн'},
        { id: 'tue', name: 'Вт'},
        { id: 'wed', name: 'Ср'},
        { id: 'thu', name: 'Чт'},
        { id: 'fri', name: 'Пт'},
        { id: 'sat', name: 'Сб'}
    ];

    const tabs = document.createElement('div');
    tabs.className = 'sched-tabs';

    DAYS.forEach(day => {
        const tab = document.createElement('div');
        tab.className = 'sched-tab';

        if(state.activeDay === day.id) {
            tab.classList.add('is-active');
        }
        tab.dataset.day = day.id;
        tab.textContent = day.name;
        tabs.appendChild(tab);
    });
    container.appendChild(tabs);
}

// Функция для карточек расписания
function renderCards(container) {
    let items = SCHEDULE.filter(item => item.day === state.activeDay);

    if(state.type === 'group') {
        items = items.filter(item => item.groupId === state.selectedId);
    } else {
        items = items.filter(item => item.teacherId === state.selectedId);
    }

    items.sort((a, b) => a.blockOrder - b.blockOrder);

    const cards = document.createElement('div');
    cards.className = 'sched-cards';

    if( items.length === 0 ) {
        const empty = document.createElement('div');
        empty.className = 'sched-empty';
        empty.textContent = 'Нет занятий';
        cards.appendChild(empty);
        container.appendChild(cards);
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'sched-card';
        card.dataset.subject = item.subject;

        const teacher = TEACHERS.find(t => t.id === item.teacherId)
        const group = GROUPS.find(g => g.id === item.groupId);

        const secondLine = state.type === 'group'
        ? (teacher ? teacher.name : '')
        : (group ? group.name : '');

        card.innerHTML = `
        <div class="sched-card-head">
            <span class="sched-card-pair">${item.blockLabel}</span>
            <span class="sched-card-time">${item.time}</span>
        </div>
        <h3 class="sched-card-subject">${item.subject}</h3>
        <p class="sched-card-teacher">${secondLine}</p>
        <p class="sched-card-meta">ауд. ${item.room}</p>
        `;

        cards.appendChild(card);
    });
    container.appendChild(cards);
}

// Событие onclick на группе
function initListClick() {
    const container = document.querySelector('[data-slot="list"]');

    container.addEventListener('click', (event) => {
        const el = event.target.closest('.sched-item');
        if(!el) return;

        state.selectedId = el.dataset.id;
        state.activeDay = 'mon';
        renderList();
        renderSchedule();
    });
}

initListClick();

// Событие onclick на дне недели
function initDayClick() {
    const container = document.querySelector('[data-slot="schedule"]');

    container.addEventListener('click', (event) => {
        const el = event.target.closest('.sched-tab');
        if(!el) return;

        state.activeDay = el.dataset.day;
        renderSchedule();
    });
}

initDayClick();