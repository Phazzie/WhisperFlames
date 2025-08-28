import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateWithGemini, type AIGenerationResponse } from './services/aiGenerationSeam';
import { PRDCache } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3333;

// In-memory storage
let prdCache: PRDCache | null = null;

// Middleware
app.use(express.json());

// Minimal CORS for local development (frontend served from 5173)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Helper to load/save cache
const CACHE_FILE = path.join(__dirname, '../tmp/sdd-cache.json');

function loadCache(): PRDCache | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load cache:', error);
  }
  return null;
}

function saveCache(cache: PRDCache): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('Failed to save cache:', error);
  }
}

// Initialize cache on startup
prdCache = loadCache();

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'SDD MCP Server running' });
});

// Endpoint 1: Store requirements
app.post('/requirements', (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ 
        ok: false, 
        errors: ['Content is required and must be a string'] 
      });
    }

    prdCache = {
      content,
      timestamp: new Date().toISOString()
    };

    // Save to tmp file
    fs.writeFileSync(path.join(__dirname, '../tmp/requirements.txt'), content);
    saveCache(prdCache);

    res.json({ ok: true });
  } catch (error) {
    console.error('Error storing requirements:', error);
    res.status(500).json({ 
      ok: false, 
      errors: ['Failed to store requirements'] 
    });
  }
});

// NOTE: /seams and /contracts endpoints temporarily disabled pending seam service implementations



// --- SDD: Begin /validate endpoint ---
// This endpoint validates all contract YAML files in the contracts/ directory.
// All file I/O and validation is routed through explicit seams.
app.post('/validate', async (_req, res) => {
  try {
    const contractsDir = path.join(__dirname, '../contracts');
    const entries = fs.readdirSync(contractsDir, { withFileTypes: true });
    const contractFiles = entries
      .filter((e) => e.isFile() && (e.name.endsWith('.yml') || e.name.endsWith('.yaml')))
      .map((e) => e.name);

    // For now, just return the list. Full YAML/schema validation is handled by scripts/checkExamples.js
    return res.status(200).json({ ok: true, message: 'Contracts listed', contracts: contractFiles });
  } catch (error) {
    console.error('Critical error processing /validate:', error);
    return res.status(500).json({
      ok: false,
      errors: [{ code: 'VALIDATE_ENDPOINT_CRITICAL_ERROR', message: 'A critical error occurred while validating contracts.', details: error instanceof Error ? error.message : String(error) }],
    });
  }
});

// --- SDD: End /validate endpoint ---

// --- SDD: Begin /generate endpoint ---
// Adapter from HTTP JSON to AIGenerationSeam contract input and back
app.post('/generate', async (req, res) => {
  try {
    const body = req.body ?? {};
    // Expect body to already be close to the contract shape from the R&B app
    const requestInput = {
      topic: body.topic,
      mood: body.mood,
      verses: body.verses ?? { v1: body.verse1 ? { content: body.verse1 } : undefined, v2: body.verse2 ? { content: body.verse2 } : undefined, v3: body.verse3 ? { content: body.verse3 } : undefined },
      chorus: body.chorus ?? { content: body.chorusContent, deviceCombos: body.deviceCombos },
      bridge: body.includeBridge ? { included: true, content: body.bridgeContent } : undefined,
    };

    const result: AIGenerationResponse = await generateWithGemini(requestInput);

    if (result.ok) {
      return res.status(200).json({ ok: true, data: result.data });
    }
    // Map to HTTP codes loosely based on contract
    const status = result.errors.some(e => e.code === 'INPUT_INVALID') ? 422 : 502;
    return res.status(status).json(result);
  } catch (error) {
    console.error('Critical error in /generate:', error);
    return res.status(500).json({ ok: false, errors: [{ code: 'GENERATION_FAILED', message: 'Critical server error', details: error instanceof Error ? error.message : String(error) }] });
  }
});
// --- SDD: End /generate endpoint ---

app.listen(PORT, () => {
  console.log(`🚀 SDD MCP Server running on http://localhost:${PORT}`);
  console.log('📋 Endpoints: /requirements, /seams, /contracts, /validate, /generate');
  if (prdCache) {
    console.log(`📝 Loaded cached PRD from ${prdCache.timestamp}`);
  }
});
