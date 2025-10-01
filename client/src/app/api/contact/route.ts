// app/api/contact/route.ts (Next.js 13+ / App Router)
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  let payload: { name?: string; email?: string; subject?: string; message?: string };
  try {
    payload = await req.json();
  } catch (error) {
    console.error("Invalid contact form payload", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, email, subject, message } = payload;

  // Basic guard:
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_ADDRESS ?? "Sufoniq <no-reply@sufoniq.com>",
      to: "support@sufoniq.com",
      replyTo: email,
      subject,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
  } catch (error) {
    console.error("Failed to deliver contact form email", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
