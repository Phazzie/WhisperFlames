/**
 * AIGenerationSeam Service (Gemini 2.5 Pro provider)
 * Contract: contracts/AIGenerationSeam.contract.v1.yml
 *
 * Env: GOOGLE_API_KEY (required)
 *
 * This is a HAND-WRITTEN implementation that adapts contract input/output to a
 * Gemini-backed provider function. We do NOT edit files in src/generated/.
 */

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, type GenerateContentRequest, type SafetySetting } from "@google/generative-ai";
import { performance } from "node:perf_hooks";

// Contract-driven shapes (duplicated minimally to avoid editing generated code)
export type AIGenerationRequest = {
  topic: string;
  mood: string;
  verses: {
    v1?: { content?: string; devices?: string[] };
    v2?: { content?: string; devices?: string[] };
    v3?: { content?: string; devices?: string[] };
  };
  chorus: { content?: string; deviceCombos?: string[][] };
  bridge?: { included?: boolean; content?: string; devices?: string[] };
};

export type AIGenerationSuccess = {
  ok: true;
  data: { lyrics: string; provider: string; latencyMs: number };
};

export type AIGenerationFailure = {
  ok: false;
  errors: Array<{ code: string; message: string; details?: unknown }>;
};

export type AIGenerationResponse = AIGenerationSuccess | AIGenerationFailure;

const SUPPORTED_MODELS = new Set([
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  // Power users can still point to Pro or specific preview versions via env var
  "gemini-2.5-pro",
]);

function resolveModelName(): string {
  // Default to Flash-Lite as requested
  const envName = (process.env.GEMINI_MODEL || "gemini-2.5-flash-lite").trim();
  if (SUPPORTED_MODELS.has(envName)) return envName;
  // Accept any non-empty model for flexibility, but prefer supported defaults
  return envName || "gemini-2.5-flash-lite";
}
const MAX_RETRIES = 2;
const INITIAL_BACKOFF_MS = 1000;

function buildPrompt(input: AIGenerationRequest): string {
  const lines: string[] = [];
  lines.push("You are an expert R&B lyricist. Write cohesive, singable lyrics.");
  lines.push("");
  lines.push(`Topic: ${input.topic}`);
  lines.push(`Mood: ${input.mood}`);
  if (input.verses?.v1?.content) lines.push(`Verse1 guidance: ${input.verses.v1.content}`);
  if (input.verses?.v2?.content) lines.push(`Verse2 guidance: ${input.verses.v2.content}`);
  if (input.verses?.v3?.content) lines.push(`Verse3 guidance: ${input.verses.v3.content}`);
  if (input.chorus?.content) lines.push(`Chorus hook guidance: ${input.chorus.content}`);
  if (input.chorus?.deviceCombos?.length) {
    lines.push("Chorus device combos to incorporate:");
    for (const combo of input.chorus.deviceCombos) {
      lines.push(`- ${combo.join(" + ")}`);
    }
  }
  if (input.bridge?.included) {
    lines.push("Include a short bridge offering a new emotional perspective.");
    if (input.bridge.content) lines.push(`Bridge guidance: ${input.bridge.content}`);
  }
  lines.push("");
  lines.push("Constraints:");
  lines.push("- Aim for ~2 verses and a memorable chorus; include bridge only if requested.");
  lines.push("- Use contemporary R&B voice, natural phrasing, internal rhyme when fitting.");
  lines.push("- Return ONLY the complete lyrics as plain text. No markdown. No labels like 'Verse' or 'Chorus'.");
  return lines.join("\n");
}

export async function generateWithGemini(input: AIGenerationRequest): Promise<AIGenerationResponse> {
  const t0 = performance.now();

  // Validate minimal required fields per contract intent
  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ code: "INPUT_INVALID", message: "Input must be an object" }] };
  }
  if (!input.topic || !input.mood || !input.chorus) {
    return { ok: false, errors: [{ code: "INPUT_INVALID", message: "Missing topic, mood, or chorus" }] };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { ok: false, errors: [{ code: "PROVIDER_UNAVAILABLE", message: "GOOGLE_API_KEY not set" }] };
  }

  const modelName = resolveModelName();
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const thinkingEnv = process.env.GEMINI_THINKING_BUDGET;
  const thinkingBudget = thinkingEnv ? Number(thinkingEnv) : undefined; // -1 dynamic, 0 disable, N>0 enables

  const generationConfig: any = {
    temperature: 0.8,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
    thinkingConfig: thinkingBudget !== undefined ? { thinkingBudget } : undefined,
  };

  const safetySettings: SafetySetting[] = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const request: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
    generationConfig,
    safetySettings,
  };

  let lastError: AIGenerationFailure | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(request);
  const text = result.response.text()?.trim() ?? "";
  return { ok: true, data: { lyrics: text, provider: modelName, latencyMs: performance.now() - t0 } };
    } catch (e: any) {
      const status = e?.cause?.status ?? e?.status;
      const retriable = status === 429 || (typeof status === "number" && status >= 500 && status < 600);
      lastError = {
        ok: false,
        errors: [
          {
            code: retriable ? "PROVIDER_UNAVAILABLE" : "GENERATION_FAILED",
            message: `Gemini request failed${status ? ` (status ${status})` : ""}`,
            details: e?.message ?? String(e),
          },
        ],
      };
      if (retriable && attempt < MAX_RETRIES) {
        const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  return lastError ?? { ok: false, errors: [{ code: "GENERATION_FAILED", message: "Unknown error" }] };
}

export default { generateWithGemini };
