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