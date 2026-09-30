"use strict";

const API = '/api';

// ============ АВТОРИЗАЦИЯ ============
function getToken() {
  return localStorage.getItem('adminToken');
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '/login.html';
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    logout();
    throw new Error('Не авторизован');
  }

  return res;
}

// Проверка при загрузке
if (!getToken()) {
  window.location.href = '/login.html';
}

// ============ ТАБЫ ============
function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });
}

// ============ РАСПИСАНИЕ ============
async function loadSelects() {
  const [groups, teachers] = await Promise.all([
    fetch(`${API}/groups`).then(r => r.json()),
    fetch(`${API}/teachers`).then(r => r.json()),
  ]);

  const groupSelect = document.querySelector('#schedule-groupId');
  const teacherSelect = document.querySelector('#schedule-teacherId');

  groupSelect.innerHTML = '';
  teacherSelect.innerHTML = '';

  groups.forEach(g => {
    const o = document.createElement('option');
    o.value = g.id;
    o.textContent = g.name;
    groupSelect.appendChild(o);
  });

  teachers.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.name;
    teacherSelect.appendChild(o);
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
      <button class="admin-btn-delete" data-type="schedule" data-id="${item.id}">Удалить</button>
    `;
    container.appendChild(row);
  });
}

function initScheduleForm() {
  const form = document.querySelector('#schedule-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    await apiFetch(`${API}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    form.reset();
    await loadSchedule();
  });
}

// ============ ГРУППЫ ============
async function loadGroups() {
  const groups = await fetch(`${API}/groups`).then(r => r.json());
  const container = document.querySelector('#groups-list');
  container.innerHTML = '';

  groups.forEach(g => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-info">
        <strong>${g.name}</strong> · ${g.course} курс · <code>${g.id}</code>
      </div>
      <button class="admin-btn-delete" data-type="groups" data-id="${g.id}">Удалить</button>
    `;
    container.appendChild(row);
  });
}

function initGroupForm() {
  const form = document.querySelector('#group-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.course = parseInt(data.course, 10);

    const res = await apiFetch(`${API}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Ошибка');
      return;
    }

    form.reset();
    await loadGroups();
    await loadSelects();
  });
}

// ============ ПРЕПОДАВАТЕЛИ ============
async function loadTeachers() {
  const teachers = await fetch(`${API}/teachers`).then(r => r.json());
  const container = document.querySelector('#teachers-list');
  container.innerHTML = '';

  teachers.forEach(t => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div class="admin-row-info">
        <strong>${t.name}</strong> · <code>${t.id}</code>
      </div>
      <button class="admin-btn-delete" data-type="teachers" data-id="${t.id}">Удалить</button>
    `;
    container.appendChild(row);
  });
}

function initTeacherForm() {
  const form = document.querySelector('#teacher-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const res = await apiFetch(`${API}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Ошибка');
      return;
    }

    form.reset();
    await loadTeachers();
    await loadSelects();
  });
}

// ============ УДАЛЕНИЕ (общее) ============
function initDelete() {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('.admin-btn-delete');
    if (!btn) return;

    const { type, id } = btn.dataset;
    if (!confirm(`Удалить ${id}?`)) return;

    const res = await apiFetch(`${API}/${type}/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Ошибка удаления');
      return;
    }

    if (type === 'schedule') await loadSchedule();
    if (type === 'groups') {
      await loadGroups();
      await loadSelects();
    }
    if (type === 'teachers') {
      await loadTeachers();
      await loadSelects();
    }
  });
}

// ============ LOGOUT BUTTON ============
function initLogout() {
  const btn = document.querySelector('#logout-btn');
  if (btn) btn.addEventListener('click', logout);
}

// ============ INIT ============
async function init() {
  initTabs();
  await loadSelects();
  await loadSchedule();
  await loadGroups();
  await loadTeachers();
  initScheduleForm();
  initGroupForm();
  initTeacherForm();
  initDelete();
  initLogout();
}

init();