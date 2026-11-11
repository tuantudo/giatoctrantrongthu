/**
 * scripts/serve_lab.mjs
 * Static server for Vibecode Lab & UI vNEXT.
 * Serves the repository root at http://localhost:8888/
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const PORT = 8888;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|\.git|\.aios|\.vercel|\.env|node_modules|\.github|content|assets\/private|data\/private)(\/|$)|^\/?archive(\/|$)|thu-gui-clara|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env|bak|orig)(\?|#|$)|cookie\.txt/i;

const server = http.createServer((req, res) => {
  let reqPath = '';
  try {
    reqPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request: Invalid URI Encoding');
    return;
  }

  if (SENSITIVE_PATH.test(reqPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${reqPath}`);
    return;
  }

  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (reqPath === '/' || reqPath === '') reqPath = '/lab.html';
  const filePath = path.join(REPO_ROOT, reqPath.replace(/^\//, ''));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${reqPath}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[VIBECODE LAB SERVER RUNNING]`);
  console.log(`  Local URL:   http://localhost:${PORT}/lab.html`);
  console.log(`  Serving dir: ${REPO_ROOT}`);
});

