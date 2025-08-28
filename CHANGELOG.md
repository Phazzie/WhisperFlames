# Changelog

All notable changes to this project are documented here. The format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Planned
- Seam detection service (LLM-powered) for `/seams` endpoint
- Contract generation service to fully power `/contracts`
- Expanded validation reporting via `/validate`

---

## [0.2.0] - 2025-08-27

### Added
- R&B Lyrics Generator app modularization
  - Split monolithic `src/app.js` into focused modules:
    - `modules/uiHelpers.js`, `modules/storage.js`, `modules/state.js`, `modules/navigation.js`
    - `modules/deviceManager.js`, `modules/promptBuilder.js`, `modules/devMode.js`, `modules/backend.js`
    - Per-screen modules `modules/screens/screen1..7.js`
  - Kept `app.js` as a lean orchestrator (<100 lines) delegating to screen modules.
- Frontend dev server script
  - Root script `npm run rnb:dev` to start `rnb-lyrics-generator/dev-server.js`.
  - Added `rnb-lyrics-generator/package.json` with `{ "type": "commonjs" }` so the CJS server runs under root ESM.
- Backend generation adapter
  - `/generate` endpoint that adapts UI payloads to `AIGenerationSeam` contract.
  - Contract-driven Gemini provider with structured errors.
- Documentation updates
  - `rnb-lyrics-generator/README.md` now includes a module map and quick-start options.

### Changed
- Enabled permissive CORS for local development (frontend 5173 <-> backend 3333).
- Centralized state management and keyboard navigation handling in modules.

### Fixed
- Removed unused legacy helpers and renderers from the R&B app.
- Aligned frontend/backend payload shapes; added mock fallback when backend or key is unavailable.

### Validation
- SDD Compliance: PASS (sdd:safe)
- Contracts examples: PASS (check:examples)

### SDD Commentary
- SDD guardrails shaped the refactor: defining seams (UI helpers, storage, state, navigation, device manager, prompt builder, backend adapter) reduced hidden coupling and made the monolith safe to split.
- Contract-first thinking for `/generate` forced a clean adapter layer and clear error semantics; the UI’s mock fallback fits neatly as a separate seam.
- The biggest productivity win was clarity: once seams were named, module responsibilities were obvious, and app.js shrank naturally.
- Tradeoff: Slight upfront friction (contracts, compliance checks), but velocity improved after the first seam map.

---

## [0.1.1] - 2025-08-07

### Improved
- Hardened and documented `/contracts` endpoint
  - Comprehensive SDD-style comments for maintainability and onboarding.
  - All file I/O and code generation routed through explicit seams.
  - Errors returned in contract-compliant `{ ok: false, errors: [...] }` format.
  - Partial success returns HTTP 207 with both errors and generated content.
  - Better logging for generation and file write failures.

### Added
- Implemented initial POST `/contracts` endpoint
  - Reads `tmp/seams-cache.json` via `FileSystemSeam`.
  - Generates YAML via `CodeGenerationSeam` and writes to `contracts/`.

### SDD Commentary
- Elevating `/contracts` to an SDD-compliant endpoint reinforced the rule that code generation happens through explicit seams, not ad-hoc file writes.
- Aligning error responses to contract format tightened the feedback loop for client tooling.

---

## [0.1.0] - 2025-08-03

### Added
- Initial SDD Proof-of-Concept project
  - Express TypeScript server, ESM config, structured endpoints.
  - Contracts suite created: LLMApiSeam, FileSystemSeam, YamlProcessingSeam, CodeGenerationSeam, HttpHandlingSeam.
  - Guardrails: Husky hooks, contract immutability, generated file protection, YAML linting, examples validation.
  - Templates: contract stub, TypeScript stub, blueprint docs, test template.
  - Scripts and tasks: validation, compliance, helper utilities; VS Code tasks for quick runs.

### Notes
- This project uses SDD methodology to build SDD tooling; contracts precede implementation and generated code is treated as read-only.

### SDD Commentary
- Starting with contracts and templates anchored the architecture and kept drift in check while bootstrapping.
- Guardrails (immutability, generated-file protection) were essential to prevent accidental cross-boundary changes.
