# R&B Lyrics Generator

A 7-step, device-driven wizard to help you craft modern R&B lyrics. Mobile-first, no build step, runs as a static site.

## Quick start (Windows / Node)

- Prereq: Node 18+
- Option A (from repo root):
  - npm run rnb:dev
- Option B (from app folder):
  - cd C:\\Users\\thump\\OneDrive\\Desktop\\SDDv4\\rnb-lyrics-generator
  - node dev-server.js
- Open http://localhost:5173

## Features

- Seven screens: Setup → Verse1 → Chorus → Verse2 → Verse3 → Bridge → Generate
- Literary device selection caps per section (3/3/3 and 2 for bridge)
- Chorus device combinations (pick up to 3 pairs)
- LocalStorage persistence and summary with quick edit links
- Keyboard navigation: ArrowLeft/ArrowRight to move between steps
- Dev Mode button (only on localhost) pre-fills data and generates mock lyrics
- Export-for-Suno helper formats lyrics with labeled sections

## Files

- public/index.html – UI skeleton and screens
- public/style.css – Dark R&B theme and interactions
- src/app.js – Slim bootstrap/orchestrator that wires modules and delegates per-screen rendering
- data/devices.json – Catalog of devices
- dev-server.js – Tiny static server for local dev

### Module map

- src/modules/uiHelpers.js – DOM helpers ($, $all), toasts, HTML escaping, progress bar
- src/modules/storage.js – LocalStorage persistence (stable key v1)
- src/modules/state.js – Centralized app state and accessors
- src/modules/navigation.js – Screen transitions and global Arrow key handling
- src/modules/deviceManager.js – Load devices.json and render device/combo grids
- src/modules/promptBuilder.js – Build AI prompt and export-for-Suno formatter
- src/modules/backend.js – Adapter to POST selections to /generate on the SDD backend
- src/modules/devMode.js – Localhost-only helpers (mock generator button)
- src/modules/screens/screen1..7.js – Each wizard step’s render + event wiring

## Notes

- AI generation can call a local backend if available. If the backend is not running or no API key is configured, the Generate step uses a mock on localhost.

### Optional backend integration

If you run the SDD server (port 3333) and configure a Gemini API key, the Generate button will POST your selections to `/generate` and display real AI lyrics:

- In the SDD project root:
  - Set your key (Windows): scripts\\set-gemini-key.cmd (edit with your key, then run)
  - Optionally set model: setx GEMINI_MODEL gemini-2.5-flash-lite
  - Optionally set thinking budget: setx GEMINI_THINKING_BUDGET 1024
  - Start server: npm run dev

When backend is unavailable, the UI falls back to a mock and shows a small toast on localhost.
- If you add devices, ensure each has: id, name, definition, example, category.

### Deployment notes

- Configure the backend URL without rebuilding by editing `public/config.json`:
  - { "backendBaseUrl": "https://your-backend.example.com" }
- Default is `http://localhost:3333` for local development.
- The app is static and can be hosted on any static host (GitHub Pages, Netlify, etc.).

## Troubleshooting

- If devices don’t load, ensure the dev server is running from the rnb-lyrics-generator directory and that data/devices.json exists.
- If styles or scripts don’t load, check that index.html references ./style.css and ../src/app.js respectively.
