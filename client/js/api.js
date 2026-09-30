"use strict"

const API_URL = '/api';

async function loadGroups() {
    const response = await fetch(`${API_URL}/groups`);
    return response.json();
}

async function loadTeachers() {
  const response = await fetch(`${API_URL}/teachers`);
  return response.json();
}

async function loadSchedule() {
  const response = await fetch(`${API_URL}/schedule`);
  return response.json();
}