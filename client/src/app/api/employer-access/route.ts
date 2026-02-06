import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_EMAIL = "support@sufoniq.com";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Resend API key is not configured." },
      { status: 500 }
    );
  }

  let payload: { workEmail?: string; company?: string; hiringContext?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { workEmail = "", company = "", hiringContext = "" } = payload;
  if (!workEmail.trim() || !company.trim() || !hiringContext.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    return NextResponse.json({ error: "Provide a valid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: SUPPORT_EMAIL,
      to: SUPPORT_EMAIL,
      subject: `Employer access request — ${company}`,
      html: `<p><strong>Work email</strong>: ${workEmail}</p>
             <p><strong>Company</strong>: ${company}</p>
             <p><strong>Hiring context</strong>:<br />${hiringContext.replace(/\n/g, "<br />")}</p>`,
    });
  } catch (error) {
    console.error("Failed to send employer access email", error);
    return NextResponse.json(
      { error: "Unable to send your request. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
