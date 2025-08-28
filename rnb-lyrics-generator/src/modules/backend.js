// backend.js
// Purpose: Call the backend /generate endpoint with the contract-ish payload.

export async function generateLyricsViaBackend(appState) {
  const payload = {
    topic: appState.topic,
    mood: appState.mood,
    verses: {
      v1: { content: appState.verses[1].content, devices: appState.verses[1].devices },
      v2: { content: appState.verses[2].content, devices: appState.verses[2].devices },
      v3: { content: appState.verses[3].content, devices: appState.verses[3].devices },
    },
    chorus: { content: appState.chorus.content, deviceCombos: appState.chorus.deviceCombos },
    bridge: appState.bridge?.included ? { included: true, content: appState.bridge.content, devices: appState.bridge.devices } : undefined,
  };

  try {
    const resp = await fetch('http://localhost:3333/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) return null;
    const json = await resp.json();
    if (json?.ok && json.data?.lyrics) return json.data.lyrics;
    return null;
  } catch {
    return null;
  }
}
