"use strict"

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

renderTypes();

function renderList() {
    const container = document.querySelector('[data-slot="list"]');

    container.innerHTML = '';

    const items = state.type === 'group' ? GROUPS : TEACHERS;

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'sched-item';
        el.dataset.id = item.id;
        el.textContent = item.name;
        container.appendChild(el);
    });
}

renderList();

function initTypeClicks() {
    const container = document.querySelector('[data-slot="types"]');

    container.addEventListener('click', (event) => {
        const el = event.target.closest('.sched-type');
        if(!el) return;

        state.type = el.dataset.type;
        renderList();
        renderTypes();
    })
}

initTypeClicks();

function renderSchedule() {
    const container = document.querySelector('[data-slot="schedule"]');

    container.innerHTML = '';

    if(!state.selectId) return;

    renderDayTabs(container);
    renderCards(container);
}

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

function renderCards(container) {
    let items = SCHEDULE.filter(item => item.day === state.activeDay);

    if(state.type === 'group') {
        items = items.filter(item => item.groupId === state.selectId);
    } else {
        items = items.filter(item => item.teacherId === state.selectId);
    }

    items.sort((a, b) => a.pair - b.pair);

    const cards = document.createElement('div');
    cards.className = 'sched-cards';

    if( items.length === 0 ) {
        const empty = document.createElement('div');
        empty.className = 'sched-empty';
        empty.textContent = 'Нет занятий';
        cards.appendChild(empty);
        container.appendChild(cards);
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'sched-card';
        card.dataset.subject = item.subject;

        card.innerHTML = `
        <div class="sched-card-head">
            <span class="sched-card-pair">${item.pair} пара</span>
            <span class="sched-card-pair">${item.time} пара</span>
        </div>
        <h3 class="sched-card.subject">${item.subject}</h3>
        <p class="sched-card-meta">ауд. ${item.room}</p>
        `;

        cards.appendChild(card);
    });
    container.appendChild(cards);
}

function initListClick() {
    const container = document.querySelector('[data-slot="list"]');

    container.addEventListener('click', (event) => {
        const el = event.target.closest('.sched-item');
        if(!el) return;

        state.selectId = el.dataset.id;
        state.activeDay = 'mon';
        renderSchedule();
    });
}

initListClick();

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