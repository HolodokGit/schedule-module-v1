"use strict";

const form = document.querySelector('#login-form');
const errorEl = document.querySelector('#login-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const password = new FormData(form).get('password');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    errorEl.textContent = 'Неверный пароль';
    return;
  }

  const { token } = await res.json();
  localStorage.setItem('adminToken', token);

  window.location.href = '/admin.html';
});