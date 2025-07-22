import { NextResponse } from 'next/server';

type Job = {
  id: number;
  title: string;
  company_name: string;
  category: string;
  url: string;
  job_type: string;
  candidate_required_location: string;
  publication_date: string;
  salary: string;
  description: string;
};

let cachedJobs: Job[] | null = null;
let cacheTimestamp: number | null = null;

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export async function GET() {
  const now = Date.now();

  // Serve from cache if valid
  if (cachedJobs && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    console.log('Serving jobs from cache');
    return NextResponse.json({ jobs: cachedJobs });
  }

  // Otherwise fetch fresh data from Remotive
  try {
    console.log('Fetching fresh jobs from Remotive API');
    const res = await fetch('https://remotive.com/api/remote-jobs');

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Upstream error', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    cachedJobs = data.jobs;
    cacheTimestamp = now;

    return NextResponse.json({ jobs: cachedJobs });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
