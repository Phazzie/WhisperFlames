// state.js
// Purpose: Centralized app state and persistence.

import { saveState as persist, loadState as restore } from './storage.js';

export const TOTAL_SCREENS = 7;

let state = {
  topic: '',
  mood: '',
  verses: { 1: { content: '', devices: [] }, 2: { content: '', devices: [] }, 3: { content: '', devices: [] } },
  chorus: { content: '', deviceCombos: [] },
  bridge: { content: '', devices: [], included: false },
  currentScreen: 1,
};

export function loadAppState() {
  state = restore(state);
}

export function getState() { return state; }

export function setState(updater) {
  const next = typeof updater === 'function' ? updater(state) : updater;
  state = { ...state, ...next };
  persist(state);
}

export function setCurrentScreen(n) {
  const clamped = Math.min(Math.max(n, 1), TOTAL_SCREENS);
  state.currentScreen = clamped;
  persist(state);
}
