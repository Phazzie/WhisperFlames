import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRDCache, APIResponse } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3333;

// In-memory storage
let prdCache: PRDCache | null = null;

// Middleware
app.use(express.json());

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

// Endpoint 2: Detect seams (placeholder)
app.post('/seams', (req, res) => {
  // TODO: Implement seam detection
  res.json({ ok: true, message: 'Seams endpoint - coming soon' });
});

// Endpoint 3: Generate contracts (placeholder)
app.post('/contracts', (req, res) => {
  // TODO: Implement contract generation
  res.json({ ok: true, message: 'Contracts endpoint - coming soon' });
});

// Endpoint 4: Validate contracts (placeholder)
app.post('/validate', (req, res) => {
  // TODO: Implement validation
  res.json({ pass: true });
});

// Endpoint 5: Generate code stubs (placeholder)
app.post('/generate', (req, res) => {
  // TODO: Implement code generation
  res.json({ generated: true });
});

app.listen(PORT, () => {
  console.log(`🚀 SDD MCP Server running on http://localhost:${PORT}`);
  console.log('📋 Endpoints: /requirements, /seams, /contracts, /validate, /generate');
  if (prdCache) {
    console.log(`📝 Loaded cached PRD from ${prdCache.timestamp}`);
  }
});
