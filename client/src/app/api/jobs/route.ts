// app/api/jobs/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function toStringId(_id: any) {
  try { return typeof _id?.toString === "function" ? _id.toString() : String(_id); }
  catch { return String(_id); }
}

function normalizeDate(input: any): string | null {
  if (!input) return null;
  if (typeof input === "string" || typeof input === "number") {
    const d = new Date(input); return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (input instanceof Date) return input.toISOString();
  if (typeof input === "object" && input.$date) {
    const val = typeof input.$date === "object" ? input.$date.$numberLong : input.$date;
    const d = new Date(val as any); return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

// --- helpers to coerce source fields into strings/arrays of strings
function asString(x: any): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (Array.isArray(x)) return x.map(asString).filter(Boolean).join(", ");
  if (typeof x === "object") {
    // try common props
    if (typeof x.name === "string") return x.name;
    if (typeof x.label === "string") return x.label;
    if (typeof x.value === "string") return x.value;
    try { return JSON.stringify(x); } catch { return String(x); }
  }
  return String(x);
}

function asStringArray(x: any): string[] {
  if (x == null) return [];
  if (Array.isArray(x)) return x.map(asString).filter(Boolean);
  if (typeof x === "string") return [x];
  if (typeof x === "object") {
    // allow tags as array of objects or a single object
    if (Array.isArray((x as any).items)) return (x as any).items.map(asString).filter(Boolean);
    return [asString(x)];
  }
  return [String(x)];
}

function mapJob(doc: any) {
  const url =
    doc.apply_url ??
    doc.raw?.url ??
    doc.url ??
    "#";

  const publication_date =
    normalizeDate(doc.posted_at) ??
    normalizeDate(doc.raw?.publication_date) ??
    normalizeDate(doc.publication_date) ??
    normalizeDate(doc.fetched_at);

  const job_type =
    doc.employment_type ??
    doc.raw?.job_type ??
    doc.job_type ??
    "";

  const candidate_required_location = asString(
    doc.raw?.candidate_required_location ?? doc.candidate_required_location
  );

  const company_name = asString(doc.company?.name ?? doc.company_name);

  const company_logo =
    doc.raw?.company_logo ??
    doc.company_logo ??
    undefined;

  const category = asString(doc.raw?.category ?? doc.category);

  // 👇 full description fallback chain (fixes non-Arbeitnow)
  const description =
    doc.description_html ??
    doc.description ??
    doc.raw?.description ??
    "";

  // Salary normalize
  let salary = "";
  if (typeof doc.salary === "string") {
    salary = doc.salary;
  } else if (doc.salary && (doc.salary.min || doc.salary.max)) {
    const parts: string[] = [];
    if (doc.salary.min != null) parts.push(String(doc.salary.min));
    if (doc.salary.max != null) parts.push(parts.length ? `- ${doc.salary.max}` : String(doc.salary.max));
    salary = parts.join(" ");
    if (doc.salary.currency) salary = `${salary} ${doc.salary.currency}`.trim();
  }

  const company_domain = doc.company?.domain ?? undefined;
  const source = doc.source ?? undefined;
  const source_id = doc.source_id ?? doc.raw?.id ?? undefined;
  const tags = asStringArray(doc.tags);

  return {
    id: toStringId(doc._id ?? doc.id),
    title: doc.title ?? doc.raw?.title ?? "",
    company_name,
    category,
    url,
    job_type,
    candidate_required_location,
    publication_date,
    salary,
    description,          // HTML (or rich text)
    company_logo,
    tags,
    company_domain,
    source,
    source_id,
  };
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "refjobs";
    const db = client.db(dbName);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const q = (searchParams.get("q") || "").trim();
    const sourceFilter = (searchParams.get("source") || "").trim();

    const col = db.collection("jobs");

    // base filter: not spam
    const match: any = { $or: [{ spam_flag: { $exists: false } }, { spam_flag: { $ne: true } }] };

    // full-text-ish search using regex OR (kept simple and fast enough with indexes later)
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      match.$and = (match.$and || []).concat([{
        $or: [
          { title: rx },
          { "raw.title": rx },
          { "company.name": rx },
          { company_name: rx },
          { category: rx },
          { "raw.category": rx },
          { tags: rx },
          { source: rx },
        ]
      }]);
    }

    if (sourceFilter) {
      const rx = new RegExp(sourceFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      match.$and = (match.$and || []).concat([{ source: rx }]);
    }

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          _posted: { $convert: { input: "$posted_at", to: "date", onError: null, onNull: null } },
          _rawPub: { $convert: { input: "$raw.publication_date", to: "date", onError: null, onNull: null } },
          _fetched: { $convert: { input: "$fetched_at", to: "date", onError: null, onNull: null } },
        }
      },
      { $addFields: { sortKey: { $ifNull: ["$_posted", { $ifNull: ["$_rawPub", "$_fetched"] }] } } },
      { $sort: { sortKey: -1, _id: -1 } },
      {
        $project: {
          title: 1,
          company: { name: 1, domain: 1 },
          company_name: 1,
          category: 1,
          apply_url: 1,
          employment_type: 1,
          raw: {
            candidate_required_location: 1,
            company_logo: 1,
            url: 1,
            category: 1,
            publication_date: 1,
            title: 1,
            description: 1, // 👈 include raw.description for fallback
          },
          posted_at: 1,
          publication_date: 1,
          fetched_at: 1,
          salary: 1,
          description_html: 1,
          description: 1,
          company_logo: 1,
          tags: 1,
          url: 1,
          job_type: 1,
          source: 1,
          source_id: 1,
        }
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const [docs, totalJobs] = await Promise.all([
      col.aggregate(pipeline, { allowDiskUse: true }).toArray(),
      col.countDocuments(match),
    ]);

    return NextResponse.json({ jobs: docs.map(mapJob), page, limit, totalJobs });
  } catch (err: any) {
    console.error("🔴 /api/jobs error:", err?.stack || err?.message || err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
