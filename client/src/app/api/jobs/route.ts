import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { error: "Jobs feature is temporarily disabled." },
    { status: 410 },
  );
}
