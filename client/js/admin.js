"use strict";

const API = '/api';

async function loadOptions() {
  const [groups, teachers] = await Promise.all([
    fetch(`${API}/groups`).then(r => r.json()),
    fetch(`${API}/teachers`).then(r => r.json()),
  ]);

  const groupSelect = document.querySelector('#groupId');
  const teacherSelect = document.querySelector('#teacherId');

  groups.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;
    option.textContent = g.name;
    groupSelect.appendChild(option);
  });

  teachers.forEach(t => {
    const option = document.createElement('option');
    option.value = t.id;
    option.textContent = t.name;
    teacherSelect.appendChild(option);
  });
}

async function loadSchedule() {
  const schedule = await fetch(`${API}/schedule`).then(r => r.json());
  const container = document.querySelector('#schedule-list');
  container.innerHTML = '';

  if (schedule.length === 0) {
    container.textContent = 'Пусто';
    return;
  }

  schedule.forEach(item => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-info">
        <strong>${item.groupName}</strong> · 
        ${item.day} · ${item.blockLabel} · ${item.time} · 
        ${item.subject} · ауд. ${item.room} · 
        ${item.teacherName}
      </div>
      <button class="admin-btn-delete" data-id="${item.id}">Удалить</button>
    `;
    container.appendChild(row);
  });
}

async function deleteItem(id) {
  if (!confirm('Удалить?')) return;
  await fetch(`${API}/schedule/${id}`, { method: 'DELETE' });
  await loadSchedule();
}

function initForm() {
  const form = document.querySelector('#schedule-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    await fetch(`${API}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    form.reset();
    await loadSchedule();
  });
}

function initList() {
  const container = document.querySelector('#schedule-list');
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-btn-delete');
    if (!btn) return;
    deleteItem(btn.dataset.id);
  });
}

async function init() {
  await loadOptions();
  await loadSchedule();
  initForm();
  initList();
}

init();