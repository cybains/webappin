'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Job = {
  id: string;
  title: string;
  company_name: string;
  category: string;
  url: string;
  job_type: string;
  candidate_required_location: string;
  publication_date: string;
  salary: string;
  description: string;
  company_logo?: string; // added this based on your example
  tags?: string[];       // added this for tags
};

type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
};

async function getJobs(page = 1, limit = 20): Promise<JobsResponse> {
  const isProd = process.env.NODE_ENV === 'production';
  const baseUrl = isProd
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

  const url = `${baseUrl}/api/jobs?page=${page}&limit=${limit}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch jobs via proxy: ${res.status}`);
      return { jobs: [], page, limit, totalJobs: 0 };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error while fetching jobs:', err);
    return { jobs: [], page, limit, totalJobs: 0 };
  }
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    getJobs(currentPage, limit).then((data) => {
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setLoading(false);
      setExpandedJobId(null); // close any expanded job on page change
    });
  }, [currentPage]);

  const totalPages = Math.ceil(totalJobs / limit);

  const handlePageChange = (newPage: number) => {
    router.push(`/jobs?page=${newPage}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const renderPageNumbers = () => {
    const pages = [];

    const start = 1;
    const end = Math.min(5, totalPages);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-black text-white' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (totalPages > 5) {
      pages.push(<span key="dots" className="px-2">...</span>);

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-black text-white' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Removed the <h1> "Remote Jobs" */}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-red-500">No jobs found.</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;

            return (
              <div
                key={job.id}
                onClick={() => toggleExpand(job.id)}
                className="border rounded-xl p-4 cursor-pointer hover:shadow transition"
              >
                <div className="flex justify-between items-center mb-2">
                  {/* Left side: Title and company logo */}
                  <div className="flex items-center gap-3">
                    {job.company_logo && (
                      <img
                        src={job.company_logo}
                        alt={`${job.company_name} logo`}
                        className="w-10 h-10 object-contain rounded"
                      />
                    )}
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                  </div>

                  {/* Right side: publication date */}
                  <span className="text-sm text-gray-500">
                    {new Date(job.publication_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Collapsed view info */}
                {!isExpanded && (
                  <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                    <span>{job.candidate_required_location}</span>
                    <span>{job.job_type}</span>
                    {job.salary && <span>{job.salary}</span>}
                  </div>
                )}

                {/* Expanded view */}
                {isExpanded && (
                  <>
                    <p className="text-gray-700 mt-2">
                      <strong>Company:</strong> {job.company_name}
                    </p>
                    <p className="text-gray-700">
                      <strong>Category:</strong> {job.category}
                    </p>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <div
                      className="mt-4 text-gray-700 max-h-96 overflow-auto"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />

                    {/* Button */}
                    <div className="mt-4">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={(e) => e.stopPropagation()} // prevent card toggle on click
                      >
                        See the job posting
                      </a>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
