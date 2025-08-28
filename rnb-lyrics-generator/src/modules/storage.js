// storage.js
// Purpose: Persist and restore app state using localStorage.

const KEY = 'rnb-lyrics-generator-state-v1';

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { /* ignore */ }
}

export function loadState(defaults) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}
