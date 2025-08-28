// Tiny static dev server for the R&B Lyrics Generator
// Usage: node dev-server.js

const http = require('http');
const path = require('path');
const fs = require('fs');

const root = __dirname; // rnb-lyrics-generator
const publicDir = path.join(root, 'public');
const srcDir = path.join(root, 'src');
const dataDir = path.join(root, 'data');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '') {
      return serveFile(res, path.join(publicDir, 'index.html'));
    }
    // Allow /public, /src, /data direct serving
    if (urlPath.startsWith('/public/')) {
      return serveFile(res, path.join(root, urlPath));
    }
    if (urlPath.startsWith('/src/')) {
      return serveFile(res, path.join(root, urlPath));
    }
    if (urlPath.startsWith('/data/')) {
      return serveFile(res, path.join(root, urlPath));
    }
    // Fallback: try public first
    const candidate = path.join(publicDir, urlPath.replace(/^\//, ''));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return serveFile(res, candidate);
    }
    // Not found
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
server.listen(PORT, () => {
  console.log(`R&B dev server running at http://localhost:${PORT}`);
});
