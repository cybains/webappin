'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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

type KeywordSuggestion = {
  value: string;
  label: string;
  isCustom?: boolean;
};

type FetchJobsOptions = {
  page?: number;
  limit?: number;
  q?: string;
  jobTypes?: string[];
  tags?: string[];
  location?: string;
  remoteOnly?: boolean;
  hasSalary?: boolean;
  postedAfter?: string;
};

type RouteFilters = {
  q?: string;
  jobType?: string;
  tags?: string;
  location?: string;
  remoteOnly?: string;
  hasSalary?: string;
  postedAfter?: string;
};

const PAGE_WINDOW = 7;
const EMPTY_FACETS: JobsFacets = { jobTypes: [], locations: [], tags: [] };

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

const canonical = (value: string) => value.trim().toLowerCase();

const formatLabel = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const currentLimit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
  const currentQ = (searchParams.get('q') || '').trim();
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

  const currentKeywords = useMemo(
    () => (currentQ ? currentQ.split(',').map((value) => canonical(value)).filter(Boolean) : []),
    [currentQ],
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [logoOverrides, setLogoOverrides] = useState<Record<string, string>>({});
  const [facets, setFacets] = useState<JobsFacets | null>(null);

  const [keywordSelections, setKeywordSelections] = useState<string[]>(currentKeywords);
  const [keywordDraft, setKeywordDraft] = useState('');
  const [keywordMenuOpen, setKeywordMenuOpen] = useState(false);
  const [jobTypeSelections, setJobTypeSelections] = useState<string[]>(currentJobTypes);
  const [tagSelections, setTagSelections] = useState<string[]>(currentTags);
  const [selectedLocation, setSelectedLocation] = useState(currentLocationParam);
  const [locationDraft, setLocationDraft] = useState(currentLocationParam);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [remoteOnlyInput, setRemoteOnlyInput] = useState(currentRemoteOnlyParam);
  const [hasSalaryInput, setHasSalaryInput] = useState(currentHasSalaryParam);
  const [postedAfterInput, setPostedAfterInput] = useState(currentPostedAfterParam);

  const limit = Math.max(1, currentLimit);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalJobs / limit)), [totalJobs, limit]);
  const pageItems = useMemo(() => buildPageItems(currentPage, totalPages), [currentPage, totalPages]);

  const keywordOptions = useMemo(() => {
    const map = new Map<string, string>();
    const register = (raw: string) => {
      const cleaned = raw.replace(/^#+/, '').replace(/\s+/g, ' ').trim();
      if (!cleaned) return;
      const key = canonical(cleaned);
      if (!key || map.has(key)) return;
      map.set(key, formatLabel(cleaned));
    };
    (facets?.tags ?? []).forEach((opt) => register(opt.label));
    (facets?.jobTypes ?? []).forEach((opt) => register(opt.label));
    jobs.forEach((job) => {
      if (job.job_type) register(job.job_type);
      if (job.category) register(job.category);
      if (job.title) {
        job.title
          .split(/[\u2013\u2014,;:\/\-|]+/)
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach(register);
      }
      (job.tags ?? []).forEach(register);
    });
    [...keywordSelections, ...currentKeywords].forEach((value) => {
      const key = canonical(value);
      if (!map.has(key)) map.set(key, formatLabel(value));
    });
    return map;
  }, [facets, jobs, keywordSelections, currentKeywords]);

  const keywordSuggestions = useMemo<KeywordSuggestion[]>(() => {
    const normalizedDraft = canonical(keywordDraft);
    const entries = Array.from(keywordOptions.entries()).filter(([value]) => !keywordSelections.includes(value));
    const sliced = (!normalizedDraft
      ? entries.slice(0, 8)
      : entries.filter(([value]) => value.includes(normalizedDraft)).slice(0, 8));
    const mapped = sliced.map(([value, label]) => ({ value, label }));
    if (normalizedDraft && !keywordSelections.includes(normalizedDraft)) {
      const alreadyListed = mapped.some((option) => option.value === normalizedDraft);
      if (!alreadyListed) {
        const display = keywordDraft.trim() || formatLabel(normalizedDraft);
        mapped.unshift({ value: normalizedDraft, label: display, isCustom: true });
      }
    }
    return mapped;
  }, [keywordDraft, keywordOptions, keywordSelections]);

  const locationSuggestions = useMemo(() => {
    const options = facets?.locations ?? [];
    const normalizedDraft = canonical(locationDraft);
    if (!normalizedDraft) return options.slice(0, 8);
    return options.filter((option) => canonical(option.label).includes(normalizedDraft)).slice(0, 8);
  }, [facets, locationDraft]);

  const routeFiltersFromState = useMemo<RouteFilters>(() => ({
    q: keywordSelections.length > 0 ? keywordSelections.join(',') : '',
    jobType: jobTypeSelections.length > 0 ? jobTypeSelections.join(',') : '',
    tags: tagSelections.length > 0 ? tagSelections.join(',') : '',
    location: selectedLocation.trim(),
    remoteOnly: remoteOnlyInput ? 'true' : '',
    hasSalary: hasSalaryInput ? 'true' : '',
    postedAfter: postedAfterInput,
  }), [
    keywordSelections,
    jobTypeSelections,
    tagSelections,
    selectedLocation,
    remoteOnlyInput,
    hasSalaryInput,
    postedAfterInput,
  ]);

  const filtersKey = useMemo(() => JSON.stringify(routeFiltersFromState), [routeFiltersFromState]);

  const keywordBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);
  const lastAppliedFiltersRef = useRef(filtersKey);

  const pushRoute = useCallback(
    (page: number, filters: RouteFilters) => {
      const clampedPage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
      const qs = new URLSearchParams();
      qs.set('page', String(clampedPage));
      qs.set('limit', String(limit));
      if (filters.q) qs.set('q', filters.q);
      if (filters.jobType) qs.set('job_type', filters.jobType);
      if (filters.tags) qs.set('tag', filters.tags);
      if (filters.location) qs.set('location', filters.location);
      if (filters.remoteOnly === 'true') qs.set('remote_only', 'true');
      if (filters.hasSalary === 'true') qs.set('has_salary', 'true');
      if (filters.postedAfter) qs.set('posted_after', filters.postedAfter);
      const next = `/jobs?${qs.toString()}`;
      const current = `/jobs?${searchParams.toString()}`;
      if (next !== current) router.push(next);
    },
    [limit, router, searchParams, totalPages],
  );

  const pushPage = useCallback((page: number) => pushRoute(page, routeFiltersFromState), [pushRoute, routeFiltersFromState]);

  useEffect(() => {
    setLoading(true);
    getJobs({
      page: currentPage,
      limit,
      q: currentQ,
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

    isSyncingRef.current = true;
    setKeywordSelections(currentKeywords);
    setKeywordDraft('');
    setKeywordMenuOpen(false);
    setJobTypeSelections(currentJobTypes);
    setTagSelections(currentTags);
    setSelectedLocation(currentLocationParam);
    setLocationDraft(currentLocationParam);
    setLocationMenuOpen(false);
    setRemoteOnlyInput(currentRemoteOnlyParam);
    setHasSalaryInput(currentHasSalaryParam);
    setPostedAfterInput(currentPostedAfterParam);

    const currentRouteFilters: RouteFilters = {
      q: currentQ,
      jobType: currentJobTypeParam,
      tags: currentTagParam,
      location: currentLocationParam,
      remoteOnly: currentRemoteOnlyParam ? 'true' : '',
      hasSalary: currentHasSalaryParam ? 'true' : '',
      postedAfter: currentPostedAfterParam,
    };
    lastAppliedFiltersRef.current = JSON.stringify(currentRouteFilters);

    const timer = setTimeout(() => {
      isSyncingRef.current = false;
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [
    currentPage,
    limit,
    currentQ,
    currentJobTypes,
    currentTags,
    currentLocationParam,
    currentRemoteOnlyParam,
    currentHasSalaryParam,
    currentPostedAfterParam,
    currentKeywords,
    currentJobTypeParam,
    currentTagParam,
  ]);

  useEffect(() => {
    if (isSyncingRef.current) return;
    if (filtersKey === lastAppliedFiltersRef.current) return;
    const timer = setTimeout(() => {
      pushRoute(1, routeFiltersFromState);
      lastAppliedFiltersRef.current = filtersKey;
    }, 200);
    return () => clearTimeout(timer);
  }, [filtersKey, routeFiltersFromState, pushRoute]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') pushPage(currentPage - 1);
      if (e.key === 'ArrowRight') pushPage(currentPage + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, pushPage]);

  useEffect(() => () => {
    if (keywordBlurTimeout.current) clearTimeout(keywordBlurTimeout.current);
    if (locationBlurTimeout.current) clearTimeout(locationBlurTimeout.current);
  }, []);

  const addKeyword = useCallback(
    (value: string) => {
      const normalized = canonical(value);
      if (!normalized) return;
      setKeywordSelections((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
      setKeywordDraft('');
      setKeywordMenuOpen(false);
    },
    [],
  );

  const removeKeyword = useCallback((value: string) => {
    setKeywordSelections((prev) => prev.filter((item) => item !== value));
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  }, []);

  const toggleJobType = (value: string) => {
    setJobTypeSelections((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleTag = (value: string) => {
    setTagSelections((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const selectLocation = useCallback((label: string) => {
    const normalized = label.trim();
    if (!normalized) {
      setSelectedLocation('');
      setLocationDraft('');
    } else {
      setSelectedLocation(normalized);
      setLocationDraft(normalized);
    }
    setLocationMenuOpen(false);
  }, []);

  const commitLocationDraft = useCallback(() => {
    const normalized = canonical(locationDraft);
    if (!normalized) {
      setSelectedLocation('');
      setLocationDraft('');
      return;
    }
    const match = (facets?.locations ?? []).find((option) => canonical(option.label) === normalized);
    if (match) {
      setSelectedLocation(match.label);
      setLocationDraft(match.label);
    } else if (selectedLocation) {
      setLocationDraft(selectedLocation);
    } else {
      setSelectedLocation('');
      setLocationDraft('');
    }
  }, [facets, locationDraft, selectedLocation]);

  const handleKeywordFocus = () => {
    if (keywordBlurTimeout.current) {
      clearTimeout(keywordBlurTimeout.current);
      keywordBlurTimeout.current = null;
    }
    setKeywordMenuOpen(true);
  };

  const handleKeywordBlur = () => {
    if (keywordBlurTimeout.current) clearTimeout(keywordBlurTimeout.current);
    keywordBlurTimeout.current = setTimeout(() => {
      setKeywordMenuOpen(false);
    }, 120);
  };

  const handleLocationFocus = () => {
    if (locationBlurTimeout.current) {
      clearTimeout(locationBlurTimeout.current);
      locationBlurTimeout.current = null;
    }
    setLocationMenuOpen(true);
  };

  const handleLocationBlur = () => {
    if (locationBlurTimeout.current) clearTimeout(locationBlurTimeout.current);
    locationBlurTimeout.current = setTimeout(() => {
      commitLocationDraft();
      setLocationMenuOpen(false);
    }, 120);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (keywordSuggestions.length > 0) {
        addKeyword(keywordSuggestions[0].value);
      } else {
        addKeyword(keywordDraft);
      }
    } else if (e.key === 'Backspace' && !keywordDraft && keywordSelections.length > 0) {
      e.preventDefault();
      removeKeyword(keywordSelections[keywordSelections.length - 1]);
    } else if (e.key === 'Escape') {
      setKeywordMenuOpen(false);
    }
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (locationSuggestions.length > 0) {
        selectLocation(locationSuggestions[0].label);
      } else {
        commitLocationDraft();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setLocationMenuOpen(false);
      setLocationDraft(selectedLocation);
    }
  };

  const onClearFilters = () => {
    setKeywordSelections([]);
    setKeywordDraft('');
    setKeywordMenuOpen(false);
    setJobTypeSelections([]);
    setTagSelections([]);
    setSelectedLocation('');
    setLocationDraft('');
    setLocationMenuOpen(false);
    setRemoteOnlyInput(false);
    setHasSalaryInput(false);
    setPostedAfterInput('');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="lg:grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-8 xl:gap-12">
        <aside className="mb-10 lg:mb-0">
          <form
            onSubmit={(event) => event.preventDefault()}
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
              <div className="relative">
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Keywords</label>
                <div className="mt-1 flex min-h-[2.75rem] flex-wrap items-center gap-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2.5">
                  {keywordSelections.length === 0 && !keywordDraft ? (
                    <span className="text-xs text-[var(--muted)]">Start typing to add keywords</span>
                  ) : null}
                  {keywordSelections.map((value) => {
                    const label = keywordOptions.get(value) ?? formatLabel(value);
                    return (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1 rounded-full bg-[color:var(--primary)_/_0.12] px-3 py-1 text-xs font-medium text-primary"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => removeKeyword(value)}
                          className="ml-1 rounded-full border border-transparent p-0.5 text-[0.65rem] text-primary transition hover:border-primary hover:bg-[color:var(--primary)_/_0.08]"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  <input
                    value={keywordDraft}
                    onChange={(e) => setKeywordDraft(e.target.value)}
                    onFocus={handleKeywordFocus}
                    onBlur={handleKeywordBlur}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder={keywordSelections.length === 0 ? 'Search the keyword catalog…' : 'Add another keyword…'}
                    className="flex-1 min-w-[140px] border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                  />
                </div>
                {keywordMenuOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl">
                    {keywordSuggestions.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-[var(--muted)]">No matching keywords found.</p>
                    ) : (
                      <ul className="max-h-48 overflow-y-auto text-sm">
                        {keywordSuggestions.map((option) => (
                          <li key={`${option.value}-${option.isCustom ? 'custom' : 'preset'}`}>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addKeyword(option.value);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-[color:var(--primary)_/_0.08]"
                            >
                              <span className="font-medium text-[var(--foreground)]">
                                {option.isCustom ? (
                                  <>
                                    Search for <span className="font-semibold">“{option.label}”</span>
                                  </>
                                ) : (
                                  option.label
                                )}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>


              <div className="relative">
                <label className="text-xs uppercase tracking-wide text-[var(--muted)]">Location</label>
                <input
                  value={locationDraft}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocationDraft(value);
                    if (!value.trim()) {
                      setSelectedLocation('');
                    }
                  }}
                  onFocus={handleLocationFocus}
                  onBlur={handleLocationBlur}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Pick from available locations"
                  className="mt-1 w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)_/_0.2]"
                />
                {locationMenuOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl">
                    {locationSuggestions.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-[var(--muted)]">No matching locations.</p>
                    ) : (
                      <ul className="max-h-48 overflow-y-auto text-sm">
                        {locationSuggestions.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectLocation(option.label);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-[color:var(--primary)_/_0.08]"
                            >
                              <span className="text-[var(--foreground)]">{option.label}</span>
                              <span className="ml-auto text-[0.65rem] text-[var(--muted)]">{option.count}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
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
                {currentKeywords.map((keyword) => {
                  const label = keywordOptions.get(keyword) ?? formatLabel(keyword);
                  return (
                    <span key={`kw-${keyword}`} className="rounded-full border border-[var(--card-border)] px-3 py-1">
                      Keyword: {label}
                    </span>
                  );
                })}
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
                const jobTypeLabel = job.job_type ? formatLabel(job.job_type) : '';
                const locationLabel = (job.candidate_required_location || '').trim();
                const postedOn = formatDate(job.publication_date);
                const defaultLogo = job.company_logo || logoFallback(job.company_domain, job.company_name);
                const logoSrc = logoOverrides[job.id] ?? defaultLogo;

                return (
                  <article
                    key={job.id}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onClick={() => toggleExpand(job.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(job.id);
                      }
                    }}
                    className={`group col-span-1 flex flex-col overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.8] px-5 py-5 shadow-lg outline-none transition-all hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-[color:var(--primary)_/_0.6] ${isExpanded ? 'ring-2 ring-[color:var(--primary)_/_0.6]' : ''}`}
                  >
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
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">
                          {jobTypeLabel && (
                            <span className="rounded-full border border-[var(--card-border)] bg-[color:var(--primary)_/_0.12] px-2 py-0.5 text-[var(--primary)]">
                              {jobTypeLabel}
                            </span>
                          )}
                          {locationLabel && (
                            <span className="rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[var(--muted)]">
                              {locationLabel}
                            </span>
                          )}
                          {postedOn && <span className="ml-auto text-[var(--muted)] normal-case">Posted {postedOn}</span>}
                        </div>
                        <h2 className="line-clamp-2 text-lg font-semibold text-primary transition group-hover:text-[var(--foreground)]">
                          {job.title}
                        </h2>
                        <div className="text-sm text-[var(--muted)]">
                          {job.company_name}{job.category ? ` • ${job.category}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] text-[var(--muted)]">
                      {job.salary && (
                        <span className="rounded-full border border-transparent bg-[color:var(--chip-bg)_/_0.9] px-3 py-1 text-[var(--foreground)]">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <div
                        className="mt-4 space-y-3 text-sm text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                          }
                        }}
                      >
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
                  </article>
                );
              })}
            </div>
          )}

          <div className="sticky bottom-4 z-10">
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-[var(--card-border)] bg-[color:var(--card)_/_0.9] px-4 py-3 backdrop-blur">
              <button onClick={() => pushPage(1)} disabled={currentPage === 1} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">First</button>
              <button onClick={() => pushPage(currentPage - 1)} disabled={currentPage <= 1} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Previous</button>

              {pageItems.map((item, idx) =>
                item === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-sm select-none">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => pushPage(item as number)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${currentPage === item ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow' : 'border-[var(--card-border)] hover:border-[var(--primary)]'}`}
                  >
                    {item}
                  </button>
                )
              )}

              <button onClick={() => pushPage(currentPage + 1)} disabled={currentPage >= totalPages} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Next</button>
              <button onClick={() => pushPage(totalPages)} disabled={currentPage === totalPages} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium disabled:opacity-40">Last</button>

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
                      if (Number.isFinite(val)) pushPage(val);
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
