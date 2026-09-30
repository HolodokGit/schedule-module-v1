"use strict"

const API_URL = '/api';

async function loadGroups() {
    const response = await fetch(`${API_URL}/groups`);
    return response.json();
}