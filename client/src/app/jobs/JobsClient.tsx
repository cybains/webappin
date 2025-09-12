'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Job = {
  id: string;
  title: string;
  company_name: string;
  category: string;
  url: string;
  job_type: string;
  candidate_required_location: string;
  publication_date: string | null;
  salary: string;
  description: string; // HTML
  company_logo?: string;
  tags?: string[];
  company_domain?: string;
  source?: string;
  source_id?: string;
};

type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
};

const PAGE_WINDOW = 7;
const PAGE_SIZES = [10, 20, 30, 50, 100];

function buildPageItems(current: number, total: number, windowSize = PAGE_WINDOW): (number | '...')[] {
  if (total <= windowSize) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

  const items: (number | '...')[] = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push('...');
  }
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total) {
    if (end < total - 1) items.push('...');
    items.push(total);
  }
  return items;
}

async function getJobs(page = 1, limit = 20, q = "", source = ""): Promise<JobsResponse> {
  const url = `/api/jobs?page=${page}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ""}${source ? `&source=${encodeURIComponent(source)}` : ""}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      let detail = '';
      try { detail = JSON.stringify(await res.json()); } catch { detail = await res.text(); }
      console.error(`Failed to fetch jobs: ${res.status} ${res.statusText} — ${detail}`);
      return { jobs: [], page, limit, totalJobs: 0 };
    }
    return await res.json();
  } catch (err) {
    console.error('Error while fetching jobs:', err);
    return { jobs: [], page, limit, totalJobs: 0 };
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}

function logoFallback(domain?: string, companyName?: string) {
  if (domain) return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  const name = companyName?.trim() || 'C';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=64&background=DDD&color=444`;
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const currentLimit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
  const currentQ = (searchParams.get('q') || '').trim();
  const currentSource = (searchParams.get('source') || '').trim();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(currentLimit);
  const [modalJob, setModalJob] = useState<Job | null>(null);

  const [qInput, setQInput] = useState(currentQ);
  const [sourceInput, setSourceInput] = useState(currentSource);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalJobs / pageSize)), [totalJobs, pageSize]);
  const pageItems = useMemo(() => buildPageItems(currentPage, totalPages), [currentPage, totalPages]);

  const pushRoute = useCallback((page: number, limit = pageSize, q = currentQ, source = currentSource) => {
    const clamped = Math.min(Math.max(1, Math.trunc(page)), Math.max(1, Math.trunc(Math.ceil(totalJobs / limit))));
    const qs = new URLSearchParams();
    qs.set('page', String(clamped));
    qs.set('limit', String(Math.trunc(limit)));
    if (q) qs.set('q', q);
    if (source) qs.set('source', source);
    router.push(`/jobs?${qs.toString()}`);
  }, [router, pageSize, totalJobs, currentQ, currentSource]);

  const pushPage = useCallback((page: number) => pushRoute(page), [pushRoute]);

  useEffect(() => {
    setLoading(true);
    getJobs(currentPage, currentLimit, currentQ, currentSource).then((data) => {
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setLoading(false);
      setExpandedJobId(null);
    });
    setPageSize(currentLimit);
    setQInput(currentQ);
    setSourceInput(currentSource);
  }, [currentPage, currentLimit, currentQ, currentSource]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') pushPage(currentPage - 1);
      if (e.key === 'ArrowRight') pushPage(currentPage + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, pushPage]);

  const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    setPageSize(newSize);
    pushRoute(1, newSize);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushRoute(1, pageSize, qInput.trim(), sourceInput.trim());
  };

  const toggleExpand = (id: string) => setExpandedJobId(expandedJobId === id ? null : id);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Search + controls */}
      <form onSubmit={onSearchSubmit} className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="Search title, company, category, tags…"
          className="px-3 py-2 border rounded-md bg-white text-gray-900 border-gray-300 dark:bg-[var(--card)] dark:text-[var(--foreground)] dark:border-[var(--card-border)]"
        />
        <input
          value={sourceInput}
          onChange={(e) => setSourceInput(e.target.value)}
          placeholder="Filter by source (e.g., remotive, arbeitnow)"
          className="px-3 py-2 border rounded-md bg-white text-gray-900 border-gray-300 dark:bg-[var(--card)] dark:text-[var(--foreground)] dark:border-[var(--card-border)]"
        />
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            className="px-2 py-2 border rounded-md bg-white text-gray-900 border-gray-300 dark:bg-[var(--card)] dark:text-[var(--foreground)] dark:border-[var(--card-border)]"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:brightness-90"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mb-4 text-sm text-[var(--muted)]">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> •{' '}
        <span className="font-medium">{totalJobs}</span> jobs{currentQ ? ` • query: "${currentQ}"` : ''}{currentSource ? ` • source: ${currentSource}` : ''}
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-[var(--muted)]">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-red-500">No jobs found.</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const bannerText = job.source ? `Source: ${job.source}` : 'Source: External';
            const logoSrc = job.company_logo || logoFallback(job.company_domain, job.company_name);

            return (
              <div
                key={job.id}
                className="relative border rounded-2xl p-4 hover:shadow transition bg-white text-gray-900 border-gray-200 dark:bg-[var(--card)] dark:text-[var(--foreground)] dark:border-[var(--card-border)]"
              >
                {/* source banner */}
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  {bannerText}
                </div>

                {/* header (click to expand) */}
                <button onClick={() => toggleExpand(job.id)} className="w-full text-left">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={logoSrc}
                        alt={`${job.company_name} logo`}
                        className="w-10 h-10 object-contain rounded"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = logoFallback(job.company_domain, job.company_name); }}
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-primary">{job.title}</h2>
                        <div className="text-sm text-[var(--muted)]">
                          {job.company_name}{job.category ? ` • ${job.category}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--muted)]">
                      {formatDate(job.publication_date)}
                    </span>
                  </div>

                  {!isExpanded && (
                    <div className="mt-2 text-sm text-[var(--muted)] flex flex-wrap gap-2">
                      {job.candidate_required_location && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)]">{job.candidate_required_location}</span>}
                      {job.job_type && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)] capitalize">{job.job_type}</span>}
                      {job.salary && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)]">{job.salary}</span>}
                    </div>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4">
                    {/* meta chips */}
                    <div className="text-sm text-[var(--muted)] flex flex-wrap gap-2 mb-3">
                      {job.candidate_required_location && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)]">{job.candidate_required_location}</span>}
                      {job.job_type && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)] capitalize">{job.job_type}</span>}
                      {job.salary && <span className="px-2 py-1 rounded-full bg-[var(--chip-bg)]">{job.salary}</span>}
                    </div>

                    {/* tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="mt-1 mb-3 flex flex-wrap gap-2">
                        {job.tags.slice(0, 12).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-br from-[var(--chip-bg)] to-[var(--card)] text-[var(--muted)] text-xs px-2 py-1 rounded-full border border-[var(--card-border)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* short preview (first ~400 chars) */}
                    <div className="prose prose-sm break-words text-[var(--foreground)] line-clamp-6 [&_*]:text-[var(--foreground)]">
                      <div
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setModalJob(job); }}
                        className="text-sm px-3 py-1 border rounded-lg border-gray-300 hover:bg-gray-100 text-gray-900 dark:border-[var(--card-border)] dark:hover:bg-[var(--chip-bg)] dark:text-[var(--foreground)]"
                      >
                        View full description
                      </button>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:brightness-90 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        See the job posting
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination — sticky footer */}
      <div className="sticky bottom-4 z-10">
        <div className="flex flex-wrap justify-center items-center gap-2 bg-white/80 backdrop-blur rounded-xl px-3 py-2 border border-gray-200 dark:bg-[color:var(--card)_/_0.8] dark:border-[var(--card-border)]">
          <button onClick={() => pushRoute(1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border rounded-md border-[var(--card-border)] disabled:opacity-50">First</button>
          <button onClick={() => pushRoute(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 text-sm border rounded-md border-[var(--card-border)] disabled:opacity-50">Previous</button>

          {pageItems.map((item, idx) =>
            item === '...' ? (
              <span key={`dots-${idx}`} className="px-2 select-none">…</span>
            ) : (
              <button
                key={item}
                onClick={() => pushRoute(item as number)}
                className={`px-3 py-1 text-sm border rounded-md border-[var(--card-border)] ${currentPage === item ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
              >
                {item}
              </button>
            )
          )}

          <button onClick={() => pushRoute(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 text-sm border rounded-md border-[var(--card-border)] disabled:opacity-50">Next</button>
          <button onClick={() => pushRoute(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border rounded-md border-[var(--card-border)] disabled:opacity-50">Last</button>

          <div className="ml-2 flex items-center gap-1 text-sm">
            <span>Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const raw = (e.target as HTMLInputElement).value;
                  const val = Math.trunc(Number(raw));
                  if (Number.isFinite(val)) pushRoute(val);
                }
              }}
              className="w-16 px-2 py-1 border rounded-md bg-transparent border-[var(--card-border)] text-[var(--foreground)]"
            />
          </div>
        </div>
      </div>

      {/* FULL DESCRIPTION MODAL */}
      {modalJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalJob(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[80vh] overflow-auto bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:bg-[var(--card)] dark:text-[var(--foreground)] dark:border-[var(--card-border)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-primary">{modalJob.title}</h3>
                <p className="text-sm text-[var(--muted)]">
                  {modalJob.company_name} {modalJob.category ? `• ${modalJob.category}` : ''}
                </p>
              </div>
              <button
                onClick={() => setModalJob(null)}
                className="px-3 py-1 border rounded-lg border-[var(--card-border)] hover:bg-[var(--chip-bg)]"
              >
                Close
              </button>
            </div>
            <div className="mt-3 prose prose-sm break-words [&_*]:max-w-full [&_img]:h-auto [&_img]:max-w-full text-[var(--foreground)] [&_*]:text-[var(--foreground)]">
              <div dangerouslySetInnerHTML={{ __html: modalJob.description }} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
