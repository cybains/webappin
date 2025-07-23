import 'dotenv/config';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

// Load and validate environment variables
const {
  ADZUNA_APP_ID,
  ADZUNA_APP_KEY,
  ADZUNA_COUNTRY,
  MONGODB_URI,
  MONGODB_DB_NAME
} = process.env;

console.log("Loaded env:", {
  ADZUNA_APP_ID,
  ADZUNA_APP_KEY,
  ADZUNA_COUNTRY,
  MONGODB_URI,
  MONGODB_DB_NAME
});

if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY || !ADZUNA_COUNTRY || !MONGODB_URI || !MONGODB_DB_NAME) {
  throw new Error("❌ Missing one or more required environment variables.");
}

// Constants
const BASE_URL = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/`;
const RESULTS_PER_PAGE = 50;
const MAX_PAGES = 2;
const FETCH_DELAY_MS = 1000; // Delay between pages to avoid rate limits

// MongoDB setup
const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(MONGODB_DB_NAME);
const jobsCollection = db.collection("jobs");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJobsFromAdzuna(page = 1) {
  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: RESULTS_PER_PAGE.toString(),
    what: 'software' // or any general keyword you want
  });

  const url = `${BASE_URL}${page}?${params.toString()}`;
  console.log("🔗 Fetching URL:", url);
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
    const jobWithSource = {
      id: job.id,
      title: job.title,
      location: job.location,
      description: job.description,
      company: job.company,
      redirect_url: job.redirect_url,
      created: job.created,
      source: "adzuna"
    };

    try {
      await jobsCollection.updateOne(
        { id: job.id },
        { $set: jobWithSource },
        { upsert: true }
      );
      console.log(`⬆️ Upserted Adzuna Job ID: ${job.id} - ${job.title}`);
    } catch (err) {
      console.error(`❌ Failed to upsert job ID ${job.id}:`, err);
    }
  }
}

async function main() {
  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`📄 Fetching page ${page}`);
    const jobs = await fetchJobsFromAdzuna(page);
    if (!jobs.length) {
      console.log("ℹ️ No more jobs returned.");
      break;
    }
    await upsertJobs(jobs);
    await delay(FETCH_DELAY_MS);
  }

  await client.close();
  console.log("✅ Done fetching jobs from Adzuna.");
}

// Execute the main function
main().catch(err => {
  console.error("❌ Error:", err);
  client.close();
});
