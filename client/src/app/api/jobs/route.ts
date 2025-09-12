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

export type JobsResponse = {
  jobs: Job[];
  page: number;
  limit: number;
  totalJobs: number;
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
  return {
    id: `arbeitnow_${safeStr(j.slug) || safeStr(j.url)}`,
    source: 'arbeitnow',
    source_id: safeStr(j.slug) || safeStr(j.url),
    title: safeStr(j.title),
    company_name: safeStr(j.company_name),
    category: '',
    url: safeStr(j.url),
    job_type: primaryType,
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseIntParam(searchParams.get('page'), 1);
  const limit = parseIntParam(searchParams.get('limit'), 20);
  const q = safeStr(searchParams.get('q'));
  const sourceRaw = safeStr(searchParams.get('source')) as SourceId | '';

  // Gather jobs based on `source` filter
  let all: Job[] = [];
  if (!sourceRaw || sourceRaw === 'remotive') {
    const r = await fetchRemotive(q);
    all = all.concat(r);
  }
  if (!sourceRaw || sourceRaw === 'arbeitnow') {
    const a = await fetchArbeitnow(q);
    all = all.concat(a);
  }

  // Sort and paginate locally
  all.sort(sortByDateDesc);
  const totalJobs = all.length;
  const startIdx = (page - 1) * limit;
  const endIdx = Math.min(totalJobs, startIdx + limit);
  const slice = startIdx < totalJobs ? all.slice(startIdx, endIdx) : [];

  const payload: JobsResponse = { jobs: slice, page, limit, totalJobs };

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
