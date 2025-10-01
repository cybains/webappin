// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const safe = (s: string) =>
  String(s).replace(/[<>&"'`]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c] as string)
  );

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const html = `
      <div>
        <p><strong>From:</strong> ${safe(name)} &lt;${safe(email)}&gt;</p>
        <p><strong>Subject (user):</strong> ${safe(subject)}</p>
        <hr/>
        <pre style="white-space:pre-wrap; font: inherit; line-height:1.5">${safe(message)}</pre>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Sufoniq Forms <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_TO as string,  // or: [process.env.MAIL_TO as string]
      replyTo: email,                      // ✅ correct property name
      subject: `New contact form: ${subject} — ${name}`,
      html,
      text: `From: ${name} <${email}>\n\nSubject: ${subject}\n\n${message}`,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Email provider error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
