// screen3.js - Chorus
import { comboKey, renderComboGrid } from '../deviceManager.js';

export function renderScreen3({ appState, saveState, navigateTo, DEVICES }) {
  const comboContainer = document.getElementById('chorusCombos');
  const counterNode = (document.getElementById('chorusRemaining')?.parentElement) || document.querySelector('.screen[data-screen="3"] .counter');
  const nextBtn = document.getElementById('toScreen4');
  const backBtn = document.getElementById('backTo2');
  const selectedSet = new Set(appState.chorus.deviceCombos.map(comboKey));
  const max = 3;

  const remainingIds = DEVICES.map(d => d.id).filter(id => !appState.verses[1].devices.includes(id));

  function updateUI() {
    if (counterNode) counterNode.textContent = `${selectedSet.size}/${max} selected`;
    appState.chorus.deviceCombos = Array.from(selectedSet).map(k => k.split('__'));
    saveState();
    renderComboGrid(comboContainer, DEVICES, remainingIds, selectedSet, max, updateUI);
  }

  renderComboGrid(comboContainer, DEVICES, remainingIds, selectedSet, max, updateUI);
  updateUI();

  const theme = document.getElementById('chorusTheme');
  if (theme) {
    theme.value = appState.chorus.content || '';
    theme.oninput = () => { appState.chorus.content = theme.value; saveState(); };
  }

  if (nextBtn) nextBtn.onclick = () => navigateTo(4);
  const clearBtn = document.getElementById('clearChorus');
  if (clearBtn) clearBtn.onclick = () => {
    selectedSet.clear();
    appState.chorus.deviceCombos = [];
    saveState();
    renderComboGrid(comboContainer, DEVICES, remainingIds, selectedSet, max, () => {});
    updateUI();
  };
  if (backBtn) backBtn.onclick = () => navigateTo(2);
}
