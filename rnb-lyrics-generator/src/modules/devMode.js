// devMode.js
// Purpose: Dev/diagnostic helpers, including mock generator and localhost detection.

import { showToast } from './uiHelpers.js';

export function isLocalhost() {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

export function mockGenerateLyrics(state) {
  const t = state.topic || 'love';
  const m = state.mood || 'smooth';
  const v = state.verses || 2;
  const c = state.chorus || 2;
  const lines = [];
  lines.push(`[Intro] (${m})`);
  for (let i = 1; i <= v; i++) lines.push(`Verse ${i}: ${t} flowing in time, hearts align.`);
  for (let j = 1; j <= c; j++) lines.push(`Chorus ${j}: We ride the wave, ${t} is our guide.`);
  if (state.bridge) lines.push('Bridge: Hold on, breathe in, let it be.');
  lines.push('Outro: Fading lights, still you and me.');
  return lines.join('\n');
}

export function attachDevModeButton() {
  const btn = document.getElementById('devModeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    showToast('Dev mode toggled (no-op placeholder).');
  });
}
