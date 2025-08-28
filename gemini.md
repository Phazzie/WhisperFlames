# Gemini Code Assist - Project Instructions: Polyglot Transcribe-X

## 1. PROJECT_OVERVIEW
A full-stack app for accurate audio transcription. It orchestrates multiple AI services (OpenAI, Google, etc.), compares their results, and flags discrepancies for human review.

## 2. TECHNOLOGY_STACK
- **Language:** TypeScript
- **Frontend:** React with Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **Job Queue:** Redis / BullMQ
- **Testing:** Vitest, React Testing Library

## 3. ARCHITECTURAL_PRINCIPLES
- **Architecture:** React SPA frontend + Node.js backend.
- **Backend Role:** A secure orchestrator. Manages users, encrypts/stores API keys, and proxies all calls to external AI services.
- **Async Tasks:** Use a job queue (Redis/BullMQ) for all transcription jobs.
- **API Handling:** Use the **Adapter Pattern** on the backend to normalize responses from different AI APIs into a standard internal format.

## 4. CODING_STYLE_GUIDELINES
- **Formatting:** Prettier with default settings.
- **Naming Conventions:**
  - `PascalCase` for Components, Types, Interfaces (`TranscriptionEditor`, `IUser`).
  - `camelCase` for variables, functions (`audioFile`, `handleUpload`).
- **Comments:** Use JSDoc for all public functions.
- **Error Handling:** Backend: Use `try/catch` for API calls; return structured errors, don't crash the server.
- **Imports:** Use absolute paths (e.g., `import { a } from '~/components/b'`).

## 5. CONSTRAINTS_AND_LIMITATIONS
- **CRITICAL SECURITY:** **NEVER** store API keys on the client. Keys must be sent via HTTPS, encrypted in the DB, and only decrypted in memory on the backend.
- **UI Performance:** Use a **virtualized list** for the transcript editor to handle long files without lag.
- **Dependencies:** Discuss before adding new third-party libraries.
- **Frontend State:** Start with React hooks (`useState`/`useContext`). Add a library like Zustand or Redux Toolkit only if necessary.

## 6. TESTING_STRATEGY
- **Backend:**
  - 100% unit test coverage for the core transcript diffing algorithm.
  - Integration tests for all API adapters (mock the external services).
- **Frontend:**
  - Component tests for all interactive UI using React Testing Library.
  - Focus tests on user behavior, not implementation details.