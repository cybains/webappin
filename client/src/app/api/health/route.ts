export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "refjobs");
    const count = await db.collection("jobs").estimatedDocumentCount();
    return NextResponse.json({ ok: true, db: db.databaseName, collection: "jobs", count });
  } catch (e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
}
