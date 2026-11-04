import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 46000 + Math.floor(Math.random() * 10000);
const server = spawn(process.execPath, ['scripts/dev.mjs'], {
  env: { ...process.env, QUEUETWIN_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const origin = `http://127.0.0.1:${port}`;

async function ready() {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) throw new Error('Server stopped before becoming ready');
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) return;
    } catch { /* retry until listening */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Server did not become ready');
}

try {
  await ready();
  const page = await fetch(origin);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /QueueTwin/);
  const response = await fetch(`${origin}/api/simulate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messageCount: 3, maxAttempts: 2, failureProbability: 100, duplicateProbability: 0, seed: 2 }),
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.metrics.deadLettered, 3);
  const bad = await fetch(`${origin}/api/simulate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messageCount: -1 }),
  });
  assert.equal(bad.status, 400);
  console.log('Smoke test passed: UI, simulator API, validation.');
} finally {
  server.kill('SIGTERM');
}
