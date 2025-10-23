'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
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

type FacetOption = {
  value: string;
  label: string;
  count: number;
};

type JobsFacets = {
  sources: FacetOption[];
  jobTypes: FacetOption[];
  locations: FacetOption[];
  tags: FacetOption[];
};

type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
  facets: JobsFacets;
};

type FetchJobsOptions = {
  page?: number;
  limit?: number;
  q?: string;
  source?: string;
  jobTypes?: string[];
  tags?: string[];
  location?: string;
  remoteOnly?: boolean;
  hasSalary?: boolean;
  postedAfter?: string;
};

type RouteFilters = {
  q?: string;
  source?: string;
  jobType?: string;
  tags?: string;
  location?: string;
  remoteOnly?: string;
  hasSalary?: string;
  postedAfter?: string;
};

const PAGE_WINDOW = 7;
const PAGE_SIZES = [10, 20, 30, 50, 100];
const EMPTY_FACETS: JobsFacets = { sources: [], jobTypes: [], locations: [], tags: [] };

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

async function getJobs({
  page = 1,
  limit = 20,
  q = '',
  source = '',
  jobTypes = [],
  tags = [],
  location = '',
  remoteOnly = false,
  hasSalary = false,
  postedAfter = '',
}: FetchJobsOptions = {}): Promise<JobsResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (q) params.set('q', q);
  if (source) params.set('source', source);
  if (jobTypes.length > 0) params.set('job_type', Array.from(new Set(jobTypes)).join(','));
  if (tags.length > 0) params.set('tag', Array.from(new Set(tags)).join(','));
  if (location.trim()) params.set('location', location.trim());
  if (remoteOnly) params.set('remote_only', 'true');
  if (hasSalary) params.set('has_salary', 'true');
  if (postedAfter) params.set('posted_after', postedAfter);

  const url = `/api/jobs?${params.toString()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      let detail = '';
      try { detail = JSON.stringify(await res.json()); } catch { detail = await res.text(); }
      console.error(`Failed to fetch jobs: ${res.status} ${res.statusText} — ${detail}`);
      return { jobs: [], page, limit, totalJobs: 0, facets: EMPTY_FACETS };
    }
    const data = await res.json();
    return { ...data, facets: data.facets ?? EMPTY_FACETS };
  } catch (err) {
    console.error('Error while fetching jobs:', err);
    return { jobs: [], page, limit, totalJobs: 0, facets: EMPTY_FACETS };
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
  const currentSource = (searchParams.get('source') || '').trim().toLowerCase();
  const currentJobTypeParam = (searchParams.get('job_type') || '').trim();
  const currentTagParam = (searchParams.get('tag') || '').trim();
  const currentLocationParam = (searchParams.get('location') || '').trim();
  const currentRemoteOnlyParam = (searchParams.get('remote_only') || '').trim() === 'true';
  const currentHasSalaryParam = (searchParams.get('has_salary') || '').trim() === 'true';
  const currentPostedAfterParam = (searchParams.get('posted_after') || '').trim();

  const currentJobTypes = useMemo(
    () => (currentJobTypeParam ? currentJobTypeParam.split(',').map((v) => v.trim()).filter(Boolean) : []),
    [currentJobTypeParam],
  );

  const currentTags = useMemo(
    () => (currentTagParam ? currentTagParam.split(',').map((v) => v.trim()).filter(Boolean) : []),
    [currentTagParam],
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(currentLimit);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [logoOverrides, setLogoOverrides] = useState<Record<string, string>>({});
  const [facets, setFacets] = useState<JobsFacets | null>(null);

  const [qInput, setQInput] = useState(currentQ);
  const [sourceInput, setSourceInput] = useState(currentSource);
  const [jobTypeSelections, setJobTypeSelections] = useState<string[]>(currentJobTypes);
  const [tagSelections, setTagSelections] = useState<string[]>(currentTags);
  const [locationInput, setLocationInput] = useState(currentLocationParam);
  const [remoteOnlyInput, setRemoteOnlyInput] = useState(currentRemoteOnlyParam);
  const [hasSalaryInput, setHasSalaryInput] = useState(currentHasSalaryParam);
  const [postedAfterInput, setPostedAfterInput] = useState(currentPostedAfterParam);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalJobs / pageSize)), [totalJobs, pageSize]);
  const pageItems = useMemo(() => buildPageItems(currentPage, totalPages), [currentPage, totalPages]);

  const currentFilters = useMemo<RouteFilters>(() => ({
    q: currentQ,
    source: currentSource,
    jobType: currentJobTypeParam,
    tags: currentTagParam,
    location: currentLocationParam,
    remoteOnly: currentRemoteOnlyParam ? 'true' : '',
    hasSalary: currentHasSalaryParam ? 'true' : '',
    postedAfter: currentPostedAfterParam,
  }), [
    currentHasSalaryParam,
    currentJobTypeParam,
    currentLocationParam,
    currentPostedAfterParam,
    currentQ,
    currentRemoteOnlyParam,
    currentSource,
    currentTagParam,
  ]);

  const pushRoute = useCallback((page: number, limit = pageSize, filters: RouteFilters = currentFilters) => {
    const clamped = Math.min(Math.max(1, Math.trunc(page)), Math.max(1, Math.trunc(Math.ceil(totalJobs / limit))));
    const qs = new URLSearchParams();
    qs.set('page', String(clamped));
    qs.set('limit', String(Math.trunc(limit)));
    if (filters.q) qs.set('q', filters.q);
    if (filters.source) qs.set('source', filters.source);
    if (filters.jobType) qs.set('job_type', filters.jobType);
    if (filters.tags) qs.set('tag', filters.tags);
    if (filters.location) qs.set('location', filters.location);
    if (filters.remoteOnly === 'true') qs.set('remote_only', 'true');
    if (filters.hasSalary === 'true') qs.set('has_salary', 'true');
    if (filters.postedAfter) qs.set('posted_after', filters.postedAfter);
    router.push(`/jobs?${qs.toString()}`);
  }, [router, pageSize, totalJobs, currentFilters]);

  const pushPage = useCallback((page: number) => pushRoute(page), [pushRoute]);

  useEffect(() => {
    setLoading(true);
    getJobs({
      page: currentPage,
      limit: currentLimit,
      q: currentQ,
      source: currentSource,
      jobTypes: currentJobTypes,
      tags: currentTags,
      location: currentLocationParam,
      remoteOnly: currentRemoteOnlyParam,
      hasSalary: currentHasSalaryParam,
      postedAfter: currentPostedAfterParam,
    }).then((data) => {
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setFacets(data.facets);
      setLoading(false);
      setExpandedJobId(null);
    });
    setPageSize(currentLimit);
    setQInput(currentQ);
    setSourceInput(currentSource);
    setJobTypeSelections(currentJobTypes);
    setTagSelections(currentTags);
    setLocationInput(currentLocationParam);
    setRemoteOnlyInput(currentRemoteOnlyParam);
    setHasSalaryInput(currentHasSalaryParam);
    setPostedAfterInput(currentPostedAfterParam);
  }, [
    currentPage,
    currentLimit,
    currentQ,
    currentSource,
    currentJobTypes,
    currentTags,
    currentLocationParam,
    currentRemoteOnlyParam,
    currentHasSalaryParam,
    currentPostedAfterParam,
  ]);

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
    const filters: RouteFilters = {
      q: qInput.trim(),
      source: sourceInput.trim(),
      jobType: jobTypeSelections.length > 0 ? jobTypeSelections.join(',') : '',
      tags: tagSelections.length > 0 ? tagSelections.join(',') : '',
      location: locationInput.trim(),
      remoteOnly: remoteOnlyInput ? 'true' : '',
      hasSalary: hasSalaryInput ? 'true' : '',
      postedAfter: postedAfterInput,
    };
    pushRoute(1, pageSize, filters);
  };

  const toggleExpand = (id: string) => setExpandedJobId(expandedJobId === id ? null : id);

  const toggleJobType = (value: string) => {
    setJobTypeSelections((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleTag = (value: string) => {
    setTagSelections((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const formatLabel = (value: string) =>
    value
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const onClearFilters = () => {
    setQInput('');
    setSourceInput('');
    setJobTypeSelections([]);
    setTagSelections([]);
    setLocationInput('');
    setRemoteOnlyInput(false);
    setHasSalaryInput(false);
    setPostedAfterInput('');
    pushRoute(1, pageSize, {});
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="lg:grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-8 xl:gap-12">
        <aside className="mb-10 lg:mb-0">
          <form
            onSubmit={onSearchSubmit}
            className="space-y-6 rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.85] backdrop-blur p-6 shadow-lg lg:sticky lg:top-24"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-primary">Refine results</h2>
                <p className="text-xs text-[var(--muted)]">Combine filters to pinpoint the perfect role.</p>
              </div>
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs text-[var(--muted)] underline decoration-dotted hover:text-primary"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Keyword</label>
                <input
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  placeholder="Search title, company, category, tags…"
                  className="mt-1 w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)_/_0.2]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Source</label>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${sourceInput === '' ? 'border-[var(--primary)] bg-[color:var(--primary)_/_0.1]' : 'border-[var(--card-border)] hover:border-[var(--primary)]'}`}>
                    <input
                      type="radio"
                      name="source"
                      value=""
                      checked={sourceInput === ''}
                      onChange={() => setSourceInput('')}
                    />
                    <span>All sources</span>
                  </label>
                  {(facets?.sources ?? []).map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${sourceInput === option.value ? 'border-[var(--primary)] bg-[color:var(--primary)_/_0.1]' : 'border-[var(--card-border)] hover:border-[var(--primary)]'}`}
                    >
                      <input
                        type="radio"
                        name="source"
                        value={option.value}
                        checked={sourceInput === option.value}
                        onChange={() => setSourceInput(option.value)}
                      />
                      <span>{option.label}</span>
                      <span className="ml-auto text-[0.65rem] text-[var(--muted)]">{option.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Location</label>
                <input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="City, country, remote keyword…"
                  className="mt-1 w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)_/_0.2]"
                />
                {facets?.locations?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {facets.locations.slice(0, 6).map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setLocationInput(option.label)}
                        className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-primary"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm hover:border-[var(--primary)]">
                  <input
                    type="checkbox"
                    checked={remoteOnlyInput}
                    onChange={(e) => setRemoteOnlyInput(e.target.checked)}
                  />
                  <span>Remote only</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm hover:border-[var(--primary)]">
                  <input
                    type="checkbox"
                    checked={hasSalaryInput}
                    onChange={(e) => setHasSalaryInput(e.target.checked)}
                  />
                  <span>Has salary info</span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[var(--muted)]">
                  <span>Job type</span>
                  <span>{jobTypeSelections.length} selected</span>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {(facets?.jobTypes ?? []).map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${jobTypeSelections.includes(option.value) ? 'border-[var(--primary)] bg-[color:var(--primary)_/_0.1]' : 'border-[var(--card-border)] hover:border-[var(--primary)]'}`}
                    >
                      <input
                        type="checkbox"
                        checked={jobTypeSelections.includes(option.value)}
                        onChange={() => toggleJobType(option.value)}
                      />
                      <span>{option.label}</span>
                      <span className="ml-auto text-[0.65rem] text-[var(--muted)]">{option.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[var(--muted)]">
                  <span>Tags</span>
                  <span>{tagSelections.length} selected</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(facets?.tags ?? []).map((option) => {
                    const selected = tagSelections.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer select-none rounded-full border px-3 py-1 text-xs transition ${selected ? 'border-[var(--primary)] bg-[color:var(--primary)_/_0.15] text-primary' : 'border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-primary'}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleTag(option.value)}
                          className="hidden"
                        />
                        <span>{option.label}</span>
                        <span className="ml-2 text-[0.6rem]">{option.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Posted within</label>
                <select
                  value={postedAfterInput}
                  onChange={(e) => setPostedAfterInput(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)_/_0.2]"
                >
                  <option value="">Any time</option>
                  <option value="1">Last 24 hours</option>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Results per page</label>
                <select
                  value={pageSize}
                  onChange={onPageSizeChange}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-sm focus:border-[var(--primary)] focus:outline-none"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[color:var(--primary)_/_0.3] transition hover:scale-[1.01] hover:shadow-xl"
              >
                Apply filters
              </button>
            </div>
          </form>
        </aside>

        <section className="flex min-w-0 flex-col gap-6">
          <div className="rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.65] px-6 py-4 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Explore remote-friendly roles</h1>
                <p className="text-sm text-[var(--muted)]">
                  Page <span className="font-medium text-[var(--foreground)]">{currentPage}</span> of{' '}
                  <span className="font-medium text-[var(--foreground)]">{totalPages}</span> •{' '}
                  <span className="font-medium text-[var(--foreground)]">{totalJobs}</span> matching jobs
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {currentQ && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Keyword: {currentQ}</span>}
                {currentSource && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Source: {formatLabel(currentSource)}</span>}
                {currentJobTypes.map((jt) => (
                  <span key={jt} className="rounded-full border border-[var(--card-border)] px-3 py-1">Type: {formatLabel(jt)}</span>
                ))}
                {currentTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--card-border)] px-3 py-1">Tag: #{tag}</span>
                ))}
                {currentLocationParam && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Location: {currentLocationParam}</span>}
                {currentRemoteOnlyParam && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Remote only</span>}
                {currentHasSalaryParam && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Has salary</span>}
                {currentPostedAfterParam && <span className="rounded-full border border-[var(--card-border)] px-3 py-1">Fresh: {currentPostedAfterParam}d</span>}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 animate-pulse rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.4]"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--card-border)] bg-[color:var(--card)_/_0.4] px-6 py-12 text-center text-sm text-[var(--muted)]">
              No jobs match your filters right now. Try broadening your search.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const bannerText = job.source ? `Source: ${job.source}` : 'Source: External';
                const defaultLogo = job.company_logo || logoFallback(job.company_domain, job.company_name);
                const logoSrc = logoOverrides[job.id] ?? defaultLogo;

                return (
                  <div
                    key={job.id}
                    className={`group relative col-span-1 flex flex-col overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.8] px-5 py-5 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl ${isExpanded ? 'ring-2 ring-[color:var(--primary)_/_0.6]' : ''}`}
                  >
                    <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[color:var(--primary)_/_0.6] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow">
                      {bannerText}
                    </div>

                    <button onClick={() => toggleExpand(job.id)} className="w-full text-left">
                      <div className="flex items-start gap-4">
                        <Image
                          src={logoSrc}
                          alt={`${job.company_name} logo`}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-xl border border-[var(--card-border)] bg-white/70 object-contain p-2"
                          unoptimized
                          onError={() => {
                            const fallback = logoFallback(job.company_domain, job.company_name);
                            if (logoSrc === fallback) return;
                            setLogoOverrides((prev) => ({ ...prev, [job.id]: fallback }));
                          }}
                        />
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-lg font-semibold text-primary transition group-hover:text-[var(--foreground)]">
                            {job.title}
                          </h2>
                          <div className="text-sm text-[var(--muted)]">
                            {job.company_name}{job.category ? ` • ${job.category}` : ''}
                          </div>
                        </div>
                        <span className="ml-auto shrink-0 text-xs text-[var(--muted)]">
                          {formatDate(job.publication_date)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] text-[var(--muted)]">
                        {job.candidate_required_location && (
                          <span className="rounded-full border border-transparent bg-[color:var(--chip-bg)_/_0.9] px-3 py-1 text-[var(--foreground)]">
                            {job.candidate_required_location}
                          </span>
                        )}
                        {job.job_type && (
                          <span className="rounded-full border border-transparent bg-[color:var(--chip-bg)_/_0.9] px-3 py-1 text-[var(--foreground)]">
                            {formatLabel(job.job_type)}
                          </span>
                        )}
                        {job.salary && (
                          <span className="rounded-full border border-transparent bg-[color:var(--chip-bg)_/_0.9] px-3 py-1 text-[var(--foreground)]">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 text-sm text-[var(--foreground)]">
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                            {job.tags.slice(0, 12).map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-full border border-[var(--card-border)] bg-[color:var(--chip-bg)_/_0.9] px-3 py-1 text-[var(--muted)]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="prose prose-sm break-words text-[var(--foreground)] line-clamp-6 [&_*]:text-[var(--foreground)]">
                          <div dangerouslySetInnerHTML={{ __html: job.description }} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setModalJob(job); }}
                            className="rounded-full border border-[var(--card-border)] px-4 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--primary)] hover:bg-[color:var(--primary)_/_0.05]"
                          >
                            View full description
                          </button>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white shadow shadow-[color:var(--primary)_/_0.4] transition hover:scale-[1.02]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            See posting
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="sticky bottom-4 z-10">
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.9] px-4 py-3 backdrop-blur">
              <button onClick={() => pushRoute(1)} disabled={currentPage === 1} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">First</button>
              <button onClick={() => pushRoute(currentPage - 1)} disabled={currentPage <= 1} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Previous</button>

              {pageItems.map((item, idx) =>
                item === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-sm select-none">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => pushRoute(item as number)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${currentPage === item ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow' : 'border-[var(--card-border)] hover:border-[var(--primary)]'}`}
                  >
                    {item}
                  </button>
                )
              )}

              <button onClick={() => pushRoute(currentPage + 1)} disabled={currentPage >= totalPages} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Next</button>
              <button onClick={() => pushRoute(totalPages)} disabled={currentPage === totalPages} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Last</button>

              <div className="ml-2 flex items-center gap-2 text-xs">
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
                  className="w-20 rounded-xl border border-[var(--card-border)] bg-transparent px-3 py-1 text-xs focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FULL DESCRIPTION MODAL */}
      {modalJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalJob(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[80vh] overflow-auto bg-[var(--card)] text-[var(--foreground)] rounded-2xl shadow-xl border border-[var(--card-border)] p-4"
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
