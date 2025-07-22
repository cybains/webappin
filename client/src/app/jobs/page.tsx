// src/app/jobs/page.tsx
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

async function getJobs() {
  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/jobs`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs via proxy: ${res.status}`);
  }
  const data = await res.json();
  return data.jobs;
}

export default async function JobsPage() {
  const jobs: Job[] = await getJobs();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Remote Jobs</h1>
      <p className="mb-6 italic text-gray-600 text-sm">
        We update job listings by fetching data every 6 hours to respect API rate limits.
      </p>

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
    </main>
  );
}
