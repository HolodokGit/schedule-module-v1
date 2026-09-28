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