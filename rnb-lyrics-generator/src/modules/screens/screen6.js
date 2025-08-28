// screen6.js - Bridge (Optional)
import { renderDeviceGrid } from '../deviceManager.js';

export function renderScreen6({ appState, saveState, navigateTo, DEVICES }) {
  const container = document.getElementById('bridgeDevices');
  const counterNode = (document.getElementById('bridgeRemaining')?.parentElement) || document.querySelector('.screen[data-screen="6"] .counter');
  const skipBtn = document.getElementById('skipBridge');
  const addBtn = document.getElementById('addBridge');
  const nextBtn = document.getElementById('toScreen7');
  const backBtn = document.getElementById('backTo5');
  const selected = new Set(appState.bridge.devices);
  const max = 2;

  const baseDisabled = new Set(appState.verses[1].devices.concat(appState.verses[2].devices, appState.verses[3].devices, appState.chorus.deviceCombos.flat()));

  function updateUI() {
    const effectiveDisabled = new Set(baseDisabled);
    if (selected.size >= max) { DEVICES.forEach(d => { if (!selected.has(d.id)) effectiveDisabled.add(d.id); }); }
    if (counterNode) counterNode.textContent = `${selected.size}/${max} selected`;
    appState.bridge.devices = Array.from(selected);
    saveState();
    renderDeviceGrid(container, DEVICES, selected, effectiveDisabled, max, updateUI);
  }

  renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, updateUI);
  updateUI();

  const ideas = document.getElementById('bridgeIdeas');
  if (ideas) {
    ideas.value = appState.bridge.content || '';
    ideas.oninput = () => { appState.bridge.content = ideas.value; saveState(); };
  }

  if (skipBtn) skipBtn.onclick = () => { appState.bridge = { content: '', devices: [], included: false }; saveState(); navigateTo(7); };
  if (addBtn) addBtn.onclick = () => { appState.bridge.included = true; saveState(); };
  if (nextBtn) nextBtn.onclick = () => navigateTo(7);
  const clearBtn = document.getElementById('clearBridge');
  if (clearBtn) clearBtn.onclick = () => {
    selected.clear();
    appState.bridge.devices = [];
    saveState();
    renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, () => {});
    updateUI();
  };
  if (backBtn) backBtn.onclick = () => navigateTo(5);
}
