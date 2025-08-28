# API Key Setup (Windows)

Keep your secrets out of source code and out of this chat. Use environment variables so keys stay local to your machine.

## Option A: Gemini (Google AI Studio API key)

Use an API key for Gemini models (e.g., `gemini-1.5-pro`, `gemini-1.5-flash`).

1) Set an environment variable (replace with your real key):

```cmd
setx GOOGLE_API_KEY "YOUR_GEMINI_API_KEY"
```

2) Close and reopen your terminal (or sign out/in) so the variable is available to new processes.

3) Verify it’s set:

```cmd
echo %GOOGLE_API_KEY%
```

Notes:
- We’ll read `GOOGLE_API_KEY` server-side only. It will never be sent to the browser.
- Don’t commit keys to the repo.

## Option B: Vertex AI (Gemma on Google Cloud)

If you want Gemma hosted on Vertex AI:

```cmd
setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\service-account.json"
setx GOOGLE_CLOUD_PROJECT "your-gcp-project-id"
setx VERTEX_REGION "us-central1"
```

Then restart your terminal and verify:

```cmd
echo %GOOGLE_APPLICATION_CREDENTIALS%
echo %GOOGLE_CLOUD_PROJECT%
echo %VERTEX_REGION%
```

We’ll use these to authenticate to Vertex AI from the server, never the browser.

## Option C: Local (Gemma via Ollama)

If you run Gemma locally, no cloud key is needed. We’ll point the server-side seam to your local endpoint (e.g., `http://localhost:11434`).

---

## Quick script (Windows)

Prefer a one-time script? Edit the placeholder in `scripts\set-gemini-key.cmd` and run it:

```cmd
scripts\set-gemini-key.cmd
```

This sets `GOOGLE_API_KEY` using `setx`. Restart your terminal afterward.

## Why environment variables?
- Keys stay out of your repo and out of the client.
- The server (AIGenerationSeam implementation) reads the key from `process.env` at runtime.

## Next
Once you’ve set your key, let me know which provider/model you want to use (e.g., Gemini: `gemini-1.5-pro`), and I’ll wire the AIGenerationSeam implementation to call it server-side.
