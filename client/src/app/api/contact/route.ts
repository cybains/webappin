// app/api/contact/route.ts (Next.js 13+ / App Router)
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();

  // TODO: send email to support@sufoniq.com with your provider of choice.
  // Example: await resend.emails.send({...})

  // Basic guard:
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
