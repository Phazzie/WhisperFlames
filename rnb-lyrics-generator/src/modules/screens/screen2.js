// screen2.js - Verse 1
import { renderDeviceGrid } from '../deviceManager.js';

export function renderScreen2({ appState, saveState, navigateTo, DEVICES }) {
  const container = document.getElementById('verse1Devices');
  const counterNode = (document.getElementById('verse1Remaining')?.parentElement) || document.querySelector('.screen[data-screen="2"] .counter');
  const nextBtn = document.getElementById('toScreen3');
  const backBtn = document.getElementById('backTo1');
  const selected = new Set(appState.verses[1].devices);
  const baseDisabled = new Set();
  const max = 3;

  function updateUI() {
    const effectiveDisabled = new Set(baseDisabled);
    if (selected.size >= max) { DEVICES.forEach(d => { if (!selected.has(d.id)) effectiveDisabled.add(d.id); }); }
    if (counterNode) counterNode.textContent = `${selected.size}/${max} selected`;
    if (nextBtn) nextBtn.disabled = selected.size !== max;
    appState.verses[1].devices = Array.from(selected);
    saveState();
    renderDeviceGrid(container, DEVICES, selected, effectiveDisabled, max, updateUI);
  }

  renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, updateUI);
  updateUI();

  const ideas = document.getElementById('verse1Ideas');
  if (ideas) {
    ideas.value = appState.verses[1].content || '';
    ideas.oninput = () => { appState.verses[1].content = ideas.value; saveState(); };
  }

  if (nextBtn) nextBtn.onclick = () => navigateTo(3);
  const clearBtn = document.getElementById('clearV1');
  if (clearBtn) clearBtn.onclick = () => {
    selected.clear();
    appState.verses[1].devices = [];
    saveState();
    renderDeviceGrid(container, DEVICES, selected, new Set(), max, () => {});
    updateUI();
  };
  if (backBtn) backBtn.onclick = () => navigateTo(1);
}
