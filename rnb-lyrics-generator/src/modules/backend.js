// backend.js
// Purpose: Call the backend /generate endpoint with the contract-ish payload.
// The backend base URL is configurable via public/config.json -> { "backendBaseUrl": "http://host:port" }

let BASE_URL_CACHE = null;
async function getBaseUrl() {
  if (BASE_URL_CACHE) return BASE_URL_CACHE;
  try {
    const resp = await fetch('./config.json', { cache: 'no-cache' });
    if (resp.ok) {
      const cfg = await resp.json();
      if (cfg && typeof cfg.backendBaseUrl === 'string' && cfg.backendBaseUrl.trim()) {
        BASE_URL_CACHE = cfg.backendBaseUrl.trim().replace(/\/$/, '');
        return BASE_URL_CACHE;
      }
    }
  } catch {}
  // fallback to local dev default
  BASE_URL_CACHE = 'http://localhost:3333';
  return BASE_URL_CACHE;
}

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
    const base = await getBaseUrl();
    const resp = await fetch(`${base}/generate`, {
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
