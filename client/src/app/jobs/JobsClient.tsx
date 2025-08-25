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
  company_logo?: string;
  tags?: string[];
};

type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
};

async function getJobs(page = 1, limit = 20): Promise<JobsResponse> {
  const url = `/api/jobs?page=${page}&limit=${limit}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { jobs: [], page, limit, totalJobs: 0 };
    return await res.json();
  } catch {
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
  const totalPages = Math.max(1, Math.ceil(totalJobs / limit));

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getJobs(currentPage, limit).then((data) => {
      if (!alive) return;
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setExpandedJobId(null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/jobs?page=${newPage}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  const renderPageNumbers = () => {
    const nodes: React.ReactNode[] = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1); // <- const (fix prefer-const)

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    if (start > 1) {
      nodes.push(
        <button key={1} onClick={() => handlePageChange(1)} className="chip rounded px-3 py-1">
          1
        </button>
      );
      if (start > 2) nodes.push(<span key="dots-start" className="px-2 opacity-70">…</span>);
    }

    for (let i = start; i <= end; i++) {
      const active = i === currentPage;
      nodes.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className="rounded px-3 py-1 transition"
          style={{
            background: active ? 'var(--primary)' : 'transparent',
            color: active ? '#fff' : 'inherit',
            border: active ? '1px solid transparent' : '1px solid var(--chip-border)',
          }}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) nodes.push(<span key="dots-end" className="px-2 opacity-70">…</span>);
      nodes.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="chip rounded px-3 py-1"
        >
          {totalPages}
        </button>
      );
    }

    return nodes;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {loading ? (
        <div className="mx-auto max-w-md card rounded-2xl p-6 ring-brand text-center">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="mx-auto max-w-md card rounded-2xl p-6 ring-brand text-center">No jobs found.</div>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            return (
              <article
                key={job.id}
                className="card rounded-2xl p-4 ring-brand shadow-sm hover:shadow-md transition"
                onClick={() => toggleExpand(job.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                <header className="flex justify-between items-center mb-2 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={`${job.company_name} logo`}
                        className="w-10 h-10 object-contain rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded muted" aria-hidden />
                    )}
                    <h2 className="text-xl font-semibold truncate">{job.title}</h2>
                  </div>
                  <time className="text-sm opacity-75">
                    {new Date(job.publication_date).toLocaleDateString()}
                  </time>
                </header>

                {!isExpanded && (
                  <div className="text-sm opacity-85 flex flex-wrap gap-3">
                    <span className="chip rounded-full px-2 py-1">{job.candidate_required_location}</span>
                    <span className="chip rounded-full px-2 py-1">{job.job_type}</span>
                    {job.salary ? <span className="chip rounded-full px-2 py-1">{job.salary}</span> : null}
                  </div>
                )}

                {isExpanded && (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Company:</strong> {job.company_name}
                    </div>
                    <div className="text-sm">
                      <strong>Category:</strong> {job.category}
                    </div>

                    {job.tags?.length ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <span key={tag} className="chip rounded-full text-xs px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div
                      className="mt-2 max-h-96 overflow-auto leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />

                    <div className="pt-2">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded px-4 py-2 btn-brand transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        See the job posting ↗
                      </a>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <nav className="flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded px-3 py-1 chip disabled:opacity-50"
        >
          Previous
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded px-3 py-1 chip disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </main>
  );
}
