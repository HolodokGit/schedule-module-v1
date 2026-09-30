"use strict";

async function init() {
  try {
    GROUPS = await loadGroups();
    TEACHERS = await loadTeachers();
    SCHEDULE = await loadSchedule();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return;
  }

  renderTypes();
  renderList();
  renderSchedule();
}

init();