// screen4.js - Verse 2
import { renderDeviceGrid } from '../deviceManager.js';

export function renderScreen4({ appState, saveState, navigateTo, DEVICES }) {
  const container = document.getElementById('verse2Devices');
  const counterNode = (document.getElementById('verse2Remaining')?.parentElement) || document.querySelector('.screen[data-screen="4"] .counter');
  const nextBtn = document.getElementById('toScreen5');
  const backBtn = document.getElementById('backTo3');
  const selected = new Set(appState.verses[2].devices);
  const max = 3;

  const baseDisabled = new Set(appState.verses[1].devices.concat(appState.chorus.deviceCombos.flat()));

  function updateUI() {
    const effectiveDisabled = new Set(baseDisabled);
    if (selected.size >= max) { DEVICES.forEach(d => { if (!selected.has(d.id)) effectiveDisabled.add(d.id); }); }
    if (counterNode) counterNode.textContent = `${selected.size}/${max} selected`;
    if (nextBtn) nextBtn.disabled = selected.size !== max;
    appState.verses[2].devices = Array.from(selected);
    saveState();
    renderDeviceGrid(container, DEVICES, selected, effectiveDisabled, max, updateUI);
  }

  renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, updateUI);
  updateUI();

  const ideas = document.getElementById('verse2Ideas');
  if (ideas) {
    ideas.value = appState.verses[2].content || '';
    ideas.oninput = () => { appState.verses[2].content = ideas.value; saveState(); };
  }

  if (nextBtn) nextBtn.onclick = () => navigateTo(5);
  const clearBtn = document.getElementById('clearV2');
  if (clearBtn) clearBtn.onclick = () => {
    selected.clear();
    appState.verses[2].devices = [];
    saveState();
    renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, () => {});
    updateUI();
  };
  if (backBtn) backBtn.onclick = () => navigateTo(3);
}
