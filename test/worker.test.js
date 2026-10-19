import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const env = { ASSETS: { fetch: async () => new Response('static') } };
const call = (path, init) => worker.fetch(new Request('https://app.test' + path, init), env);

test('health endpoint', async () => {
  const res = await call('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test('unknown API route is a JSON 404, other paths go to static assets', async () => {
  assert.equal((await call('/api/nope')).status, 404);
  assert.equal(await (await call('/')).text(), 'static');
});

test('cross-origin writes are rejected', async () => {
  const res = await call('/api/health', { method: 'POST', headers: { Origin: 'https://evil.test' } });
  assert.equal(res.status, 403);
});

test('workers.dev redirects to the canonical host', async () => {
  const res = await worker.fetch(new Request('https://ic3-prep.x.workers.dev/#/mock?a=1'), { ...env, CANONICAL_HOST: 'ic3.knhdixh.com' });
  assert.equal(res.status, 301);
  assert.match(res.headers.get('Location'), /^https:\/\/ic3\.knhdixh\.com\//);
});
