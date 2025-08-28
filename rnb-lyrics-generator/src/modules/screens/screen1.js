// screen1.js - Song Setup
export function renderScreen1({ appState, saveState, navigateTo, $ }) {
  const topic = $('#songTopic');
  const mood = $('#songMood');
  if (topic) {
    topic.value = appState.topic || '';
    topic.oninput = () => { appState.topic = topic.value; saveState(); };
  }
  if (mood) {
    mood.value = appState.mood || '';
    mood.oninput = () => { appState.mood = mood.value; saveState(); };
  }
  const next = document.getElementById('toScreen2');
  if (next) next.onclick = () => navigateTo(2);
}
