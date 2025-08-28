import { loadDevices as loadDevicesFromModule } from './modules/deviceManager.js';
import { navigateTo as goTo, installGlobalKeys } from './modules/navigation.js';
import { getState, loadAppState, setState } from './modules/state.js';
import { $ } from './modules/uiHelpers.js';

let appState = {
  topic: '',
  mood: '',
  verses: { 1: { content: '', devices: [] }, 2: { content: '', devices: [] }, 3: { content: '', devices: [] } },
  chorus: { content: '', deviceCombos: [] },
  bridge: { content: '', devices: [], included: false },
  currentScreen: 1,
};

let DEVICES = []; // loaded from data/devices.json; items: {id,name,definition,example,category}

// ---- Persistence ----
function saveState() { setState(appState); }

// ---- Utilities ----
function navigateTo(screen) { goTo(screen, renderCurrentScreen); }

function canUseGlobalKeys() {
  const ae = document.activeElement;
  if (!ae) return true;
  const tag = ae.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return false;
  if (ae.isContentEditable) return false;
  return true;
}

installGlobalKeys(canUseGlobalKeys, () => appState.currentScreen || 1, (n) => navigateTo(n));

// ---- Rendering per screen ----
import { renderScreen1 } from './modules/screens/screen1.js';
import { renderScreen2 } from './modules/screens/screen2.js';
import { renderScreen3 } from './modules/screens/screen3.js';
import { renderScreen4 } from './modules/screens/screen4.js';
import { renderScreen5 } from './modules/screens/screen5.js';
import { renderScreen6 } from './modules/screens/screen6.js';
import { renderScreen7 } from './modules/screens/screen7.js';

const screens = [null, renderScreen1, renderScreen2, renderScreen3, renderScreen4, renderScreen5, renderScreen6, renderScreen7];
const buildCtx = () => ({ appState, saveState, navigateTo, DEVICES, $ });
function renderCurrentScreen() { const i = appState.currentScreen || 1; const fn = screens[i]; return fn?.(buildCtx()); }

// ---- Init ----

(async function main() {
  try {
    loadAppState();
    appState = getState();
    DEVICES = await loadDevicesFromModule();
    try { (await import('./modules/devMode.js')).attachDevModeButton?.(); } catch {}
    navigateTo(appState.currentScreen || 1);
  } catch (e) {
    console.error('Initialization failed', e);
    const out = document.getElementById('lyricsOutput');
    if (out) out.textContent = 'Failed to initialize app.';
  }
})();
