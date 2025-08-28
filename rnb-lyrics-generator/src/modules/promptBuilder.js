// promptBuilder.js
// Purpose: Build the AI prompt and export formats from app state selections (moved from app.js).

function deviceDisplayFromState(state, id) {
  const d = (state.DEVICES || []).find(x => x.id === id);
  return d ? `${d.name}` : id;
}

export function prepareAIPrompt(userData) {
  const lines = [];
  lines.push('You are an expert R&B songwriter. Write a complete, performance-ready song.');
  lines.push('Style: soulful, modern R&B, smooth imagery, clear rhyme and rhythm.');
  lines.push('Constraints: keep sections clearly labeled and demonstrate the requested literary devices naturally.');
  lines.push('');
  lines.push(`Topic: ${userData.topic || ''}`);
  lines.push(`Overall mood: ${userData.mood || ''}`);
  lines.push('');

  for (let i = 1; i <= 3; i++) {
    const v = userData.verses?.[i];
    if (!v) continue;
    lines.push(`[Verse ${i} guidance]`);
    lines.push(`Content: ${v.content || ''}`);
    const devs = (v.devices || []).map(id => deviceDisplayFromState(userData, id));
    lines.push(`Apply devices (${devs.length}): ${devs.join(', ')}`);
    lines.push('');
  }

  const chorus = userData.chorus || { content: '', deviceCombos: [] };
  lines.push('[Chorus guidance]');
  lines.push(`Theme: ${chorus.content || ''}`);
  const comboStrings = (chorus.deviceCombos || []).map(([a, b]) => `${deviceDisplayFromState(userData, a)} + ${deviceDisplayFromState(userData, b)}`);
  lines.push(`Apply device combinations (up to 3): ${comboStrings.join('; ')}`);
  lines.push('');

  const bridge = userData.bridge || { content: '', devices: [], included: false };
  if (bridge.included || bridge.content || (bridge.devices && bridge.devices.length)) {
    lines.push('[Bridge guidance]');
    lines.push(`Content: ${bridge.content || ''}`);
    const bdevs = (bridge.devices || []).map(id => deviceDisplayFromState(userData, id));
    lines.push(`Apply devices (${bdevs.length}): ${bdevs.join(', ')}`);
    lines.push('');
  }

  lines.push('Output format (exactly these headers):');
  lines.push('[Verse 1]');
  lines.push('[Chorus]');
  lines.push('[Verse 2]');
  lines.push('[Verse 3]');
  lines.push('[Bridge] (optional if included)');
  lines.push('Ensure each requested device is clearly but artfully demonstrated at least once.');
  lines.push('Avoid meta commentary; produce only lyrics in the labeled sections.');

  return lines.join('\n');
}

export function exportForSuno(lyrics, data) {
  const hasTags = /\[(Verse|Chorus|Bridge)/i.test(lyrics);
  if (hasTags) {
    return lyrics
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  const parts = [];
  const v = data?.verses || {};
  const addSection = (title, content) => {
    if (!content) return;
    parts.push(`[${title}]`);
    parts.push(content.trim());
    parts.push('');
  };
  addSection('Verse 1', v[1]?.content || '');
  addSection('Chorus', data?.chorus?.content || '');
  addSection('Verse 2', v[2]?.content || '');
  addSection('Verse 3', v[3]?.content || '');
  if (data?.bridge?.included) addSection('Bridge', data?.bridge?.content || '');
  if (parts.length === 0) {
    parts.push('[Verse 1]');
    parts.push((lyrics || '').trim());
  }
  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

