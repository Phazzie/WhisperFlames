// uiHelpers.js
// Purpose: Small DOM helpers, toasts, progress bar, and escaping utilities.

export function $(sel) { return document.querySelector(sel); }
export function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

export function setProgress(screen, total) {
  const pct = Math.round((screen / total) * 100);
  const fill = $('#progressFill');
  if (fill) fill.style.setProperty('--pct', pct + '%');
  const text = $('#progressText');
  if (text) text.textContent = `Step ${screen} of ${total}`;
}

export function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 200); }, 2000);
}

export function escapeHtml(s) {
  return (s || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
