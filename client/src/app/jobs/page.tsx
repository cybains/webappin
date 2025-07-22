export const dynamic = 'force-dynamic';

import React from 'react';

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

async function getJobs(): Promise<Job[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/jobs`, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch jobs via proxy: ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data?.jobs || !Array.isArray(data.jobs)) {
      console.warn('Unexpected jobs response format:', data);
      return [];
    }

    return data.jobs;
  } catch (err) {
    console.error('Error while fetching jobs:', err);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Remote Jobs</h1>
      <p className="mb-6 italic text-gray-600 text-sm">
        We update job listings by fetching data every 6 hours to respect API rate limits.
      </p>

      {jobs.length === 0 ? (
        <p className="text-red-500">No jobs found. Please check back later.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.slice(0, 20).map((job) => (
            <a
              key={job.id}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-xl hover:shadow transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-500">
                {job.company_name} • {job.job_type} • {job.candidate_required_location}
              </p>
              <div
                className="mt-2 text-gray-700 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
