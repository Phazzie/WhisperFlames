// screen7.js - Generate
import { showToast } from '../uiHelpers.js';

export function renderScreen7({ appState, navigateTo, DEVICES }) {
  renderSummary({ appState, DEVICES, navigateTo });
  const generateBtn = document.getElementById('generateLyrics');
  const copyBtn = document.getElementById('copyPrompt');
  const out = document.getElementById('lyricsOutput');

  async function tryBackend() {
    const { generateLyricsViaBackend } = await import('../backend.js');
    return await generateLyricsViaBackend(appState);
  }

  if (generateBtn) generateBtn.onclick = async () => {
    out.textContent = 'Generating...';
    const viaBackend = await tryBackend();
    if (viaBackend) {
      out.textContent = viaBackend;
    } else {
      const { prepareAIPrompt, exportForSuno } = await import('../promptBuilder.js');
      const prompt = prepareAIPrompt({ ...appState, DEVICES });
      console.log('AI Prompt:\n' + prompt);
      const { mockGenerateLyrics, isLocalhost } = await import('../devMode.js');
      const content = mockGenerateLyrics(appState);
      out.textContent = content;
      if (isLocalhost()) showToast('Using mock output (backend not available)');
    }
  };

  if (copyBtn) copyBtn.onclick = async () => {
    const { prepareAIPrompt } = await import('../promptBuilder.js');
    const prompt = prepareAIPrompt({ ...appState, DEVICES });
    try { await navigator.clipboard.writeText(prompt); showToast('Prompt copied!'); }
    catch { console.warn('Clipboard write failed'); }
  };

  const exportBtn = document.getElementById('exportSuno');
  if (exportBtn) exportBtn.onclick = async () => {
    const raw = out.textContent || '';
    const { exportForSuno } = await import('../promptBuilder.js');
    const formatted = exportForSuno(raw, appState);
    if (!formatted) { alert('Nothing to export yet. Generate lyrics first.'); return; }
    navigator.clipboard?.writeText(formatted).then(() => alert('Suno-formatted lyrics copied to clipboard.'));
  };

  const backBtn = document.getElementById('backTo6');
  if (backBtn) backBtn.onclick = () => navigateTo(6);
}

function renderSummary({ appState, DEVICES, navigateTo }) {
  const deviceById = (id) => DEVICES.find(d => d.id === id)?.name || id;
  const escapeHtml = (s) => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  const s = appState;
  const lines = [];
  lines.push(`<h3>Summary</h3>`);
  lines.push(`<p><strong>Topic:</strong> ${escapeHtml(s.topic) || '—'} <button data-edit="1">Edit</button></p>`);
  lines.push(`<p><strong>Mood:</strong> ${escapeHtml(s.mood) || '—'} <button data-edit="1">Edit</button></p>`);
  for (let i = 1; i <= 3; i++) {
    const dv = s.verses[i].devices.map(deviceById).join(', ') || '—';
    lines.push(`<p><strong>Verse ${i}:</strong> ${escapeHtml(s.verses[i].content) || '—'}<br/><em>Devices:</em> ${escapeHtml(dv)} <button data-edit="${i+1}">Edit</button></p>`);
  }
  const comboNames = s.chorus.deviceCombos.map(([a,b]) => `${deviceById(a)} + ${deviceById(b)}`).join('; ') || '—';
  lines.push(`<p><strong>Chorus theme:</strong> ${escapeHtml(s.chorus.content) || '—'}<br/><em>Device combos:</em> ${escapeHtml(comboNames)} <button data-edit="3">Edit</button></p>`);
  const bridgeNames = (s.bridge.devices || []).map(deviceById).join(', ') || '—';
  lines.push(`<p><strong>Bridge:</strong> ${escapeHtml(s.bridge.content) || '—'}<br/><em>Devices:</em> ${escapeHtml(bridgeNames)} <button data-edit="6">Edit</button></p>`);
  const container = document.getElementById('summary');
  if (container) {
    container.innerHTML = lines.join('\n');
    container.querySelectorAll('button[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const n = Number(btn.getAttribute('data-edit'));
        navigateTo(n);
      });
    });
  }
}
