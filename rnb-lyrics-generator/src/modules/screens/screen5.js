// screen5.js - Verse 3
import { renderDeviceGrid } from '../deviceManager.js';

export function renderScreen5({ appState, saveState, navigateTo, DEVICES }) {
  const container = document.getElementById('verse3Devices');
  const counterNode = (document.getElementById('verse3Remaining')?.parentElement) || document.querySelector('.screen[data-screen="5"] .counter');
  const nextBtn = document.getElementById('toScreen6');
  const backBtn = document.getElementById('backTo4');
  const selected = new Set(appState.verses[3].devices);
  const max = 3;

  const baseDisabled = new Set(appState.verses[1].devices.concat(appState.verses[2].devices, appState.chorus.deviceCombos.flat()));

  function updateUI() {
    const effectiveDisabled = new Set(baseDisabled);
    if (selected.size >= max) { DEVICES.forEach(d => { if (!selected.has(d.id)) effectiveDisabled.add(d.id); }); }
    if (counterNode) counterNode.textContent = `${selected.size}/${max} selected`;
    if (nextBtn) nextBtn.disabled = selected.size !== max;
    appState.verses[3].devices = Array.from(selected);
    saveState();
    renderDeviceGrid(container, DEVICES, selected, effectiveDisabled, max, updateUI);
  }

  renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, updateUI);
  updateUI();

  const ideas = document.getElementById('verse3Ideas');
  if (ideas) {
    ideas.value = appState.verses[3].content || '';
    ideas.oninput = () => { appState.verses[3].content = ideas.value; saveState(); };
  }

  if (nextBtn) nextBtn.onclick = () => navigateTo(6);
  const clearBtn = document.getElementById('clearV3');
  if (clearBtn) clearBtn.onclick = () => {
    selected.clear();
    appState.verses[3].devices = [];
    saveState();
    renderDeviceGrid(container, DEVICES, selected, baseDisabled, max, () => {});
    updateUI();
  };
  if (backBtn) backBtn.onclick = () => navigateTo(4);
}
