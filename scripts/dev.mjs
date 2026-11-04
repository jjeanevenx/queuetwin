import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { simulate } from '../packages/simulator/src/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = process.env.QUEUETWIN_HOST || '127.0.0.1';
const port = Number.parseInt(process.env.QUEUETWIN_PORT || '4173', 10);
const staticFiles = new Map([
  ['/', ['apps/web/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['apps/web/styles.css', 'text/css; charset=utf-8']],
  ['/app.mjs', ['apps/web/app.mjs', 'text/javascript; charset=utf-8']],
  ['/docs/architecture.md', ['docs/architecture.md', 'text/plain; charset=utf-8']],
]);
const scenarios = [
  'examples/scenarios/happy-path.json',
  'examples/scenarios/retry-storm.json',
  'examples/scenarios/duplicate-delivery.json',
];

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

async function jsonBody(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 16_384) {
      const error = new Error('JSON request body exceeds 16 KiB limit');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Malformed JSON body');
    error.status = 400;
    throw error;
  }
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, { status: 'ok', modelVersion: '0.1.0' });
    }
    if (req.method === 'GET' && url.pathname === '/api/scenarios') {
      const entries = await Promise.all(scenarios.map(async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'))));
      return sendJson(res, 200, { scenarios: entries });
    }
    if (req.method === 'POST' && url.pathname === '/api/simulate') {
      const input = await jsonBody(req);
      return sendJson(res, 200, simulate(input));
    }
    if (req.method === 'GET' && staticFiles.has(url.pathname)) {
      const [file, mime] = staticFiles.get(url.pathname);
      const body = await readFile(path.join(root, file));
      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
      res.end(body);
      return;
    }
    return sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    const status = error.status || (error instanceof RangeError || error instanceof TypeError ? 400 : 500);
    sendJson(res, status, { error: status === 500 ? 'Internal server error' : error.message });
  }
});

server.listen(port, host, () => {
  process.stdout.write(`QueueTwin running at http://${host}:${port}\n`);
});
