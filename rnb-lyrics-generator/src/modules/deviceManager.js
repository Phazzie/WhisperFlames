// deviceManager.js
// Purpose: Load devices.json, and provide rendering helpers used by screens.

export async function loadDevices() {
  // Try common URL variants depending on how the app is hosted
  const candidates = [
    '/data/devices.json',
    './data/devices.json',
    '../data/devices.json'
  ];
  let lastErr;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) continue;
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) return json;
      // If file exists but empty/invalid, keep trying other candidates
    } catch (e) {
      lastErr = e;
    }
  }
  console.error('[devices] Failed to load devices.json from candidates', candidates, lastErr);
  return [];
}

export function byId(DEVICES, id) { return DEVICES.find(d => d.id === id); }

export function makeDeviceCard(device, opts) {
  const { selected = false, disabled = false, onToggle } = opts;
  const card = document.createElement('div');
  card.className = 'device';
  if (selected) card.classList.add('selected');
  if (disabled) card.classList.add('disabled');
  card.tabIndex = disabled ? -1 : 0;
  const example = device.example || '';
  const short = example.length > 60 ? example.slice(0, 57) + '…' : example;
  card.innerHTML = `
    <div class="title">${device.name}</div>
    <div class="meta">${short}</div>
    <div class="check">✓</div>
  `;
  if (!disabled) {
    card.addEventListener('click', () => onToggle());
    card.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); } });
  }
  return card;
}

export function renderDeviceGrid(containerEl, DEVICES, selectedSet, disabledSet, max, onChange) {
  containerEl.innerHTML = '';
  if (!DEVICES || DEVICES.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'empty';
    msg.textContent = 'No devices available. Check that /data/devices.json is being served by your dev server.';
    containerEl.appendChild(msg);
    return;
  }
  DEVICES.forEach(d => {
    const card = makeDeviceCard(d, {
      selected: selectedSet.has(d.id),
      disabled: disabledSet.has(d.id) && !selectedSet.has(d.id),
      onToggle: () => {
        const wasSelected = selectedSet.has(d.id);
        if (wasSelected) selectedSet.delete(d.id);
        else {
          if (selectedSet.size >= max) return;
          if (disabledSet.has(d.id)) return;
          selectedSet.add(d.id);
        }
        onChange();
      },
    });
    containerEl.appendChild(card);
  });
}

export function combinationsOfTwo(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) out.push([ids[i], ids[j]]);
  }
  return out;
}

export function comboKey(pair) { return pair.slice().sort().join('__'); }

export function renderComboGrid(containerEl, DEVICES, remainingIds, selectedCombosSet, max, onChange) {
  containerEl.innerHTML = '';
  const combos = combinationsOfTwo(remainingIds);
  combos.forEach(pair => {
    const key = comboKey(pair);
    const selected = selectedCombosSet.has(key);
    const el = document.createElement('div');
    el.className = 'device' + (selected ? ' selected' : '');
    el.tabIndex = 0;
    const [a, b] = pair;
    const da = byId(DEVICES, a); const db = byId(DEVICES, b);
    el.innerHTML = `
      <div class="title">${da?.name} + ${db?.name}</div>
      <div class="meta">${(da?.example||'')}${da?.example&&db?.example?' | ':''}${(db?.example||'')}</div>
      <div class="check">✓</div>
    `;
    function tryToggle() {
      if (selectedCombosSet.has(key)) selectedCombosSet.delete(key);
      else {
        if (selectedCombosSet.size >= max) return;
        selectedCombosSet.add(key);
      }
      onChange();
    }
    el.addEventListener('click', tryToggle);
    el.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tryToggle(); } });
    containerEl.appendChild(el);
  });
}
