/**
 * Contact form endpoint.
 *
 * Right now it validates input and logs the message on the server. To
 * actually deliver mail, plug in a provider below — the recommended path
 * is Resend (https://resend.com):
 *
 *   1. `npm install resend`
 *   2. Add `RESEND_API_KEY=...` to `.env.local`
 *   3. Uncomment the block marked "SEND EMAIL" and set your addresses.
 *
 * No secrets are hard-coded; everything comes from environment variables.
 */

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot — real users never fill this
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: silently accept and drop obvious bots.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const { name, email, message } = body;

  if (!isNonEmptyString(name, 120)) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!isNonEmptyString(message, 5000)) {
    return Response.json(
      { error: "Please enter a message." },
      { status: 400 },
    );
  }

  const clean = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  // ---- SEND EMAIL (uncomment after installing + configuring Resend) ----
  // import { Resend } from "resend"  // move to top of file
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Portfolio <onboarding@resend.dev>",
  //   to: process.env.CONTACT_TO_EMAIL ?? "you@example.com",
  //   replyTo: clean.email,
  //   subject: `New message from ${clean.name}`,
  //   text: clean.message,
  // });
  // ----------------------------------------------------------------------

  // Placeholder delivery: log to the server so nothing is lost in dev.
  console.log("[contact] new message:", clean);

  return Response.json({ ok: true });
}
