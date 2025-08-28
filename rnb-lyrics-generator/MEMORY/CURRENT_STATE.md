2025-08-26 Checkpoint

Implemented:
- Back buttons on screens 2–7 and ArrowLeft/ArrowRight global navigation
- Device/combo card checkmarks only visible when selected
- Tiny static dev server (dev-server.js) and README with quick start
- Clear selections buttons on screens 2–6 with toast notifications
- Copy Prompt button on Generate with toast confirmation
- Structured AI prompt builder and Suno export helper

Seams:
- Introduced AIGenerationSeam contract (v1) for future AI integration (stub generated)

Validations:
- SDD contract validation: PASS (6/6)
- SDD compliance check: PASS (no violations)

Next:
- Optional UX niceties (clear all, toasts for more actions, more presets)
- Wire AIGenerationSeam to a real provider via the SDD server