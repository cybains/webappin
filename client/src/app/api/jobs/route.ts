// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ---- Shared types (align with your JobsClient.tsx) ----
export type Job = {
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
  source?: SourceId;
  source_id?: string;
};

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type JobsFacets = {
  sources: FacetOption[];
  jobTypes: FacetOption[];
  locations: FacetOption[];
  tags: FacetOption[];
};

export type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
  facets: JobsFacets;
};

// ---- Sources ----
export type SourceId = 'remotive' | 'arbeitnow';

// Remotive API (https://remotive.com/api/remote-jobs)
interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string; // some payloads use this
  company_logo_url?: string; // some payloads use this
  category: string;
  job_type: string; // e.g. Full-Time
  candidate_required_location: string;
  publication_date?: string; // ISO
  job_description?: string; // HTML
  description?: string; // sometimes used
  salary?: string;
  tags?: string[];
}
interface RemotiveResponse { jobs: RemotiveJob[] }

// Arbeitnow API (https://www.arbeitnow.com/api/job-board-api)
interface ArbeitnowJob {
  slug?: string;
  title?: string;
  company_name?: string;
  description?: string; // HTML/markdown-ish
  url?: string;
  tags?: string[];
  job_types?: string[]; // e.g. ["full_time"]
  created_at?: string; // ISO
  updated_at?: string; // ISO
  location?: string;
  remote?: boolean;
  salary?: string;
  company_logo?: string;
  company_url?: string;
}
interface ArbeitnowResponse { data?: ArbeitnowJob[] }

// ---- Utilities ----
function toIsoOrNull(input: string | undefined): string | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function safeStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function safeStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
}

function normalizeRemotive(j: RemotiveJob): Job {
  const logo = j.company_logo_url ?? j.company_logo;
  const pub = j.publication_date ? toIsoOrNull(j.publication_date) : null;
  const desc = j.description ?? j.job_description ?? '';
  return {
    id: `remotive_${String(j.id)}`,
    source: 'remotive',
    source_id: String(j.id),
    title: safeStr(j.title),
    company_name: safeStr(j.company_name),
    category: safeStr(j.category),
    url: safeStr(j.url),
    job_type: safeStr(j.job_type),
    candidate_required_location: safeStr(j.candidate_required_location),
    publication_date: pub,
    salary: safeStr(j.salary),
    description: safeStr(desc),
    company_logo: logo ? String(logo) : undefined,
    tags: j.tags ? safeStrArr(j.tags) : undefined,
  };
}

function normalizeArbeitnow(j: ArbeitnowJob): Job {
  const created = toIsoOrNull(j.created_at) ?? toIsoOrNull(j.updated_at);
  const primaryType = Array.isArray(j.job_types) && j.job_types.length > 0 ? j.job_types[0] : '';
  const formattedType = primaryType ? primaryType.replace(/[_-]+/g, ' ').trim() : '';
  return {
    id: `arbeitnow_${safeStr(j.slug) || safeStr(j.url)}`,
    source: 'arbeitnow',
    source_id: safeStr(j.slug) || safeStr(j.url),
    title: safeStr(j.title),
    company_name: safeStr(j.company_name),
    category: '',
    url: safeStr(j.url),
    job_type: formattedType,
    candidate_required_location: safeStr(j.location),
    publication_date: created,
    salary: safeStr(j.salary),
    description: safeStr(j.description),
    company_logo: j.company_logo ? String(j.company_logo) : undefined,
    tags: j.tags ? safeStrArr(j.tags) : undefined,
    company_domain: j.company_url ? String(j.company_url) : undefined,
  };
}

// Fetchers return normalized jobs and never throw (they fail softly to [])
async function fetchRemotive(q: string): Promise<Job[]> {
  const base = 'https://remotive.com/api/remote-jobs';
  const sp = new URLSearchParams();
  if (q) sp.set('search', q);
  // Remotive supports `search` and `category`; `page` is inconsistent, so we fetch first page and paginate locally
  const url = `${base}?${sp.toString()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const jobs = (data as RemotiveResponse).jobs ?? [];
    return jobs.map(normalizeRemotive);
  } catch {
    return [];
  }
}

async function fetchArbeitnow(q: string): Promise<Job[]> {
  const base = 'https://www.arbeitnow.com/api/job-board-api';
  try {
    const res = await fetch(base, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const raw = (data as ArbeitnowResponse).data ?? [];
    const normalized = raw
      .filter((j) => j && typeof j === 'object')
      .map((j) => normalizeArbeitnow(j as ArbeitnowJob));
    if (!q) return normalized;
    const lc = q.toLowerCase();
    return normalized.filter((j) =>
      j.title.toLowerCase().includes(lc) ||
      j.company_name.toLowerCase().includes(lc) ||
      (j.tags ?? []).some((t) => t.toLowerCase().includes(lc))
    );
  } catch {
    return [];
  }
}

function sortByDateDesc(a: Job, b: Job): number {
  if (!a.publication_date && !b.publication_date) return 0;
  if (!a.publication_date) return 1;
  if (!b.publication_date) return -1;
  const ta = Date.parse(a.publication_date);
  const tb = Date.parse(b.publication_date);
  if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
  if (Number.isNaN(ta)) return 1;
  if (Number.isNaN(tb)) return -1;
  return tb - ta;
}

function parseIntParam(v: string | null, d: number): number {
  const n = v ? Number.parseInt(v, 10) : d;
  return Number.isFinite(n) && n > 0 ? n : d;
}

const canonical = (value: string) => value.trim().toLowerCase();
const canonicalJobType = (value: string) => canonical(value.replace(/[_\s]+/g, ' '));

const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const buildFacetArray = (map: Map<string, { label: string; count: number }>, limit?: number): FacetOption[] => {
  const arr = Array.from(map.entries())
    .map(([value, meta]) => ({ value, label: meta.label, count: meta.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return typeof limit === 'number' ? arr.slice(0, limit) : arr;
};

const deriveFacets = (jobs: Job[]): JobsFacets => {
  const sourceMap = new Map<string, { label: string; count: number }>();
  const jobTypeMap = new Map<string, { label: string; count: number }>();
  const locationMap = new Map<string, { label: string; count: number }>();
  const tagMap = new Map<string, { label: string; count: number }>();

  for (const job of jobs) {
    const source = job.source ?? 'external';
    const sourceKey = canonical(source);
    const sourceLabel = titleCase(source.replace(/[_-]+/g, ' '));
    const existingSource = sourceMap.get(sourceKey);
    sourceMap.set(sourceKey, {
      label: existingSource?.label ?? sourceLabel,
      count: (existingSource?.count ?? 0) + 1,
    });

    const jobTypeKey = canonicalJobType(job.job_type);
    if (jobTypeKey) {
      const label = titleCase(job.job_type.replace(/[_-]+/g, ' '));
      const existing = jobTypeMap.get(jobTypeKey);
      jobTypeMap.set(jobTypeKey, {
        label: existing?.label ?? label,
        count: (existing?.count ?? 0) + 1,
      });
    }

    const locationKey = canonical(job.candidate_required_location);
    if (locationKey) {
      const label = job.candidate_required_location.trim();
      const existing = locationMap.get(locationKey);
      locationMap.set(locationKey, {
        label: existing?.label ?? label,
        count: (existing?.count ?? 0) + 1,
      });
    }

    for (const rawTag of job.tags ?? []) {
      const tagKey = canonical(rawTag);
      if (!tagKey) continue;
      const label = `#${rawTag.trim().replace(/^#+/, '')}`;
      const existing = tagMap.get(tagKey);
      tagMap.set(tagKey, {
        label: existing?.label ?? label,
        count: (existing?.count ?? 0) + 1,
      });
    }
  }

  return {
    sources: buildFacetArray(sourceMap),
    jobTypes: buildFacetArray(jobTypeMap, 12),
    locations: buildFacetArray(locationMap, 15),
    tags: buildFacetArray(tagMap, 20),
  };
};

const isRemoteJob = (job: Job): boolean => {
  if (job.source === 'remotive') return true;
  const location = canonical(job.candidate_required_location);
  if (!location) return false;
  if (location.includes('remote') || location.includes('anywhere')) return true;
  const tagSet = new Set((job.tags ?? []).map((tag) => canonical(tag)));
  if (tagSet.has('remote') || tagSet.has('work from anywhere')) return true;
  return false;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseIntParam(searchParams.get('page'), 1);
  const limit = parseIntParam(searchParams.get('limit'), 20);
  const q = safeStr(searchParams.get('q'));
  const sourceInput = safeStr(searchParams.get('source'));
  const sourceCanonical = canonical(sourceInput);
  const jobTypeParam = safeStr(searchParams.get('job_type'));
  const tagParam = safeStr(searchParams.get('tag'));
  const locationParam = safeStr(searchParams.get('location'));
  const remoteOnly = canonical(safeStr(searchParams.get('remote_only'))) === 'true';
  const hasSalary = canonical(safeStr(searchParams.get('has_salary'))) === 'true';
  const postedAfterRaw = safeStr(searchParams.get('posted_after'));

  const sourceFilter = sourceCanonical;

  const selectedJobTypes = jobTypeParam
    .split(',')
    .map(canonicalJobType)
    .filter(Boolean);
  const selectedTags = tagParam
    .split(',')
    .map(canonical)
    .filter(Boolean);
  const selectedLocation = canonical(locationParam);
  const postedAfterDays = Number.parseInt(postedAfterRaw, 10);
  const postedAfterThreshold = Number.isFinite(postedAfterDays) && postedAfterDays > 0
    ? Date.now() - postedAfterDays * 24 * 60 * 60 * 1000
    : null;

  // Gather jobs based on `source` filter
  let all: Job[] = [];
  if (!sourceFilter || sourceFilter === 'remotive' || sourceFilter === 'external') {
    const r = await fetchRemotive(q);
    all = all.concat(r);
  }
  if (!sourceFilter || sourceFilter === 'arbeitnow' || sourceFilter === 'external') {
    const a = await fetchArbeitnow(q);
    all = all.concat(a);
  }

  const facets = deriveFacets(all);

  const filtered = all.filter((job) => {
    if (sourceFilter) {
      const jobSource = job.source ? canonical(job.source) : '';
      if (sourceFilter === 'external') {
        if (jobSource && jobSource !== 'external') return false;
      } else if (jobSource !== sourceFilter) {
        return false;
      }
    }
    if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(canonicalJobType(job.job_type))) {
      return false;
    }
    if (selectedTags.length > 0) {
      const tagSet = new Set((job.tags ?? []).map((tag) => canonical(tag)));
      const hasTag = selectedTags.some((tag) => tagSet.has(tag));
      if (!hasTag) return false;
    }
    if (selectedLocation && !canonical(job.candidate_required_location).includes(selectedLocation)) {
      return false;
    }
    if (remoteOnly && !isRemoteJob(job)) {
      return false;
    }
    if (hasSalary && !job.salary.trim()) {
      return false;
    }
    if (postedAfterThreshold) {
      if (!job.publication_date) return false;
      const ts = Date.parse(job.publication_date);
      if (Number.isNaN(ts) || ts < postedAfterThreshold) return false;
    }
    return true;
  });

  // Sort and paginate locally
  filtered.sort(sortByDateDesc);
  const totalJobs = filtered.length;
  const startIdx = (page - 1) * limit;
  const endIdx = Math.min(totalJobs, startIdx + limit);
  const slice = startIdx < totalJobs ? filtered.slice(startIdx, endIdx) : [];

  const payload: JobsResponse = { jobs: slice, page, limit, totalJobs, facets };

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
