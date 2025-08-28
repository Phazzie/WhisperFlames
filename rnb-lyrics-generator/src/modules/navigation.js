// navigation.js
// Purpose: Screen navigation, progress, and global keyboard handling.

import { TOTAL_SCREENS, getState, setCurrentScreen } from './state.js';
import { $all, setProgress } from './uiHelpers.js';

export function navigateTo(n, renderCurrent) {
  const state = getState();
  const prev = state.currentScreen || 1;
  const next = Math.min(Math.max(n, 1), TOTAL_SCREENS);
  setCurrentScreen(next);

  const screens = $all('.screen');
  screens.forEach(div => {
    const idx = Number(div.getAttribute('data-screen'));
    const goingForward = next > prev;
    div.classList.remove('enter', 'active', 'exit');
    if (idx === next) {
      div.hidden = false;
      div.classList.add('enter');
      void div.offsetWidth;
      div.classList.remove('enter');
      div.classList.add('active');
    } else {
      if (!div.hidden && ((goingForward && idx < next) || (!goingForward && idx > next))) {
        div.classList.add('exit');
        setTimeout(() => { div.hidden = true; div.classList.remove('exit'); }, 300);
      } else {
        div.hidden = true;
      }
    }
  });

  setProgress(next, TOTAL_SCREENS);
  renderCurrent?.();
}

export function installGlobalKeys(canUseGlobalKeys, getCurrent, go) {
  window.addEventListener('keydown', (e) => {
    if (!canUseGlobalKeys()) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(getCurrent() + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(getCurrent() - 1); }
  });
}

