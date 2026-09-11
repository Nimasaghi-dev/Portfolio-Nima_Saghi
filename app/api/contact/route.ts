/**
 * Contact form endpoint.
 *
 * Delivers mail through Resend (https://resend.com). Configure it with:
 *
 *   RESEND_API_KEY      required — from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL    required — inbox that receives the messages
 *   CONTACT_FROM_EMAIL  optional — defaults to Resend's shared test sender
 *
 * See `.env.example`. No secrets are hard-coded; everything comes from the
 * environment. Without RESEND_API_KEY the route refuses to claim success in
 * production, so a misconfigured deploy fails loudly instead of dropping mail.
 */

import { Resend } from "resend";

/* The Resend SDK and the rate-limit map both need a real Node runtime. */
export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot — real users never fill this
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Shown when mail cannot be delivered, so nobody is left without a way to reach us. */
const FALLBACK_EMAIL = process.env.CONTACT_TO_EMAIL ?? "nimasaghi.dev@gmail.com";
const DELIVERY_FAILED = `Could not send your message. Please email ${FALLBACK_EMAIL} directly.`;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

/* ------------------------------------------------------------------ *
 * Rate limiting                                                       *
 * ------------------------------------------------------------------ *
 * In-memory sliding window. Serverless instances don't share state, so
 * this caps abuse per instance rather than globally — enough to stop a
 * casual flood from burning the Resend quota. Use a shared store (Upstash,
 * Vercel KV) if this ever needs to be exact.
 */
const RATE_LIMIT = 5; // messages per window, per IP
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
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

  if (rateLimited(clientIp(request))) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const clean = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  /* Not configured: never pretend the message was delivered in production. */
  if (!apiKey || !to) {
    const missing = [!apiKey && "RESEND_API_KEY", !to && "CONTACT_TO_EMAIL"]
      .filter(Boolean)
      .join(", ");

    if (process.env.NODE_ENV === "production") {
      console.error(`[contact] not configured — missing ${missing}. Message dropped.`);
      return Response.json({ error: DELIVERY_FAILED }, { status: 503 });
    }

    console.warn(
      `[contact] ${missing} not set — NO EMAIL SENT. Message logged only:`,
      clean,
    );
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: clean.email, // replying in the inbox goes straight to the sender
      // Strip newlines so nothing can smuggle extra header lines into the subject.
      subject: `Portfolio contact from ${clean.name.replace(/[\r\n]+/g, " ")}`,
      text: [
        `Name:    ${clean.name}`,
        `Email:   ${clean.email}`,
        "",
        clean.message,
      ].join("\n"),
    });

    /* The SDK reports API failures in `error` instead of throwing. */
    if (error) {
      console.error("[contact] resend rejected the message:", error);
      return Response.json({ error: DELIVERY_FAILED }, { status: 502 });
    }

    console.log(`[contact] delivered ${data?.id} from ${clean.email}`);
    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send threw:", err);
    return Response.json({ error: DELIVERY_FAILED }, { status: 502 });
  }
}
