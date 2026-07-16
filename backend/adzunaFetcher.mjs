import 'dotenv/config';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

const { ADZUNA_APP_ID, ADZUNA_APP_KEY, ADZUNA_COUNTRY, MONGODB_URI } = process.env;
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY || !ADZUNA_COUNTRY || !MONGODB_URI) {
  throw new Error('Missing required importer configuration.');
}

const BASE_URL = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/`;
const RESULTS_PER_PAGE = 50;
const MAX_PAGES = 2;
const FETCH_DELAY_MS = 1000;
const client = new MongoClient(MONGODB_URI);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJobsFromAdzuna(page = 1) {
  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: RESULTS_PER_PAGE.toString(),
    what: 'software',
  });
  console.log('Fetching Adzuna page', { page });
  const response = await fetch(`${BASE_URL}${page}?${params.toString()}`);
  if (!response.ok) {
    console.error('Adzuna request failed', { page, status: response.status, category: 'source_request_failed' });
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

async function upsertJobs(jobs, collection) {
  for (const job of jobs) {
    const sourceId = String(job.id ?? '');
    if (!sourceId) continue;
    const record = {
      source: 'adzuna', source_id: sourceId, title: job.title, locations: job.location ? [job.location] : [],
      description_html: job.description, company: job.company, apply_url: job.redirect_url,
      posted_at: job.created, fetched_at: new Date().toISOString(),
    };
    try {
      await collection.updateOne({ source: 'adzuna', source_id: sourceId }, { $set: record }, { upsert: true });
      console.log('Upserted Adzuna job', { sourceId });
    } catch {
      console.error('Adzuna job upsert failed', { sourceId, category: 'source_upsert_failed' });
    }
  }
}

async function main() {
  await client.connect();
  const jobs = client.db('refjobs').collection('jobs');
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const records = await fetchJobsFromAdzuna(page);
    if (!records.length) break;
    await upsertJobs(records, jobs);
    await delay(FETCH_DELAY_MS);
  }
  await client.close();
  console.log('Adzuna import complete');
}

main().catch(async () => {
  console.error('Adzuna import failed', { category: 'source_import_failed' });
  await client.close().catch(() => undefined);
  process.exitCode = 1;
});
