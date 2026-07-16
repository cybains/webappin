import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const remotive = readFileSync(new URL('./fetchAndSaveJobs.mjs', import.meta.url), 'utf8');
const adzuna = readFileSync(new URL('./adzunaFetcher.mjs', import.meta.url), 'utf8');
const health = readFileSync(new URL('../client/src/app/api/health/route.ts', import.meta.url), 'utf8');

test('all active importers explicitly own refjobs.jobs', () => {
  assert.match(remotive, /dbName: 'refjobs'/);
  assert.match(remotive, /model\('Job', jobSchema, 'jobs'\)/);
  assert.match(adzuna, /client\.db\('refjobs'\)\.collection\('jobs'\)/);
  assert.doesNotMatch(`${remotive}\n${adzuna}`, /jobsdb/);
});

test('source identity is stable and logs do not contain secret configuration', () => {
  assert.match(remotive, /source_id/);
  assert.match(adzuna, /source_id/);
  assert.doesNotMatch(`${remotive}\n${adzuna}`, /Loaded env|Fetching URL|console\.(log|error)\([^\n]*(MONGODB_URI|ADZUNA_APP_KEY|ADZUNA_APP_ID)/);
});

test('public health output is minimal and raw errors are not returned', () => {
  assert.match(health, /database: "connected"/);
  assert.match(health, /database: "unavailable"/);
  assert.doesNotMatch(health, /databaseName|error: message|String\(e\)/);
});
