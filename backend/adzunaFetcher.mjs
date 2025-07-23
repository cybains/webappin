import 'dotenv/config';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

const {
  ADZUNA_APP_ID,
  ADZUNA_APP_KEY,
  ADZUNA_COUNTRY,
  MONGODB_URI,
  MONGODB_DB_NAME
} = process.env;

const BASE_URL = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/`;
const RESULTS_PER_PAGE = 50;
const MAX_PAGES = 2;

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(MONGODB_DB_NAME);
const jobsCollection = db.collection("jobs");

async function fetchJobsFromAdzuna(page = 1) {
  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: RESULTS_PER_PAGE.toString(),
    content_type: "application/json",
    what: "software",
    where: "remote",
  });

  const url = `${BASE_URL}${page}?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`❌ Failed to fetch page ${page}: ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  return data.results || [];
}

async function upsertJobs(jobs) {
  for (const job of jobs) {
    // Add a 'source' field to identify origin
    const jobWithSource = { ...job, source: "adzuna" };

    await jobsCollection.updateOne(
      { id: job.id }, // match existing job by id
      { $set: jobWithSource },
      { upsert: true }
    );

    console.log(`⬆️ Upserted Adzuna Job ID: ${job.id} - ${job.title}`);
  }
}

async function main() {
  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`📄 Fetching page ${page}`);
    const jobs = await fetchJobsFromAdzuna(page);
    if (!jobs.length) break;
    await upsertJobs(jobs);
  }

  await client.close();
  console.log("✅ Done fetching jobs from Adzuna.");
}

main().catch(err => {
  console.error("❌ Error:", err);
  client.close();
});
