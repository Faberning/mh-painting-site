/**
 * worker.js — the only dynamic surface. Per EKO build rules §2:
 *  - Static assets are served through env.ASSETS (the binding), never by the
 *    Worker fetching its own custom domain (that is the 522 self-loop).
 *  - Secrets (mail key, etc.) live in Worker env, never in the repo.
 *
 * Routing: /api/lead is handled here (form round-trip, EKO §7); everything else
 * is a static asset served from ./dist via the ASSETS binding.
 *
 * Lead email is delivered via Resend (https://resend.com). Set the key once:
 *   wrangler secret put RESEND_API_KEY
 * Sends are fired after the 200 (ctx.waitUntil) so the form is always fast and
 * a mail hiccup never fails the submission. Until the sending domain verifies
 * (or the key is set) sends just log and the form still succeeds.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// From a verified SUBDOMAIN (keeps the root domain's deliverability clean).
// Override with the LEAD_FROM env var to test from onboarding@resend.dev before
// send.mhpainting.co verifies — no code change needed.
const DEFAULT_FROM = "mh painting <leads@send.mhpainting.co>";

// Team inbox that gets new-enquiry notifications (mirrors BUSINESS.email).
const TEAM_TO = "max@mhpainting.co";

// Canonical is non-www (go-live brief, Step 3).
const WWW_HOST = "www.mhpainting.co";
const APEX_HOST = "mhpainting.co";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- www -> apex, 301, path + query preserved ---
    if (url.hostname === WWW_HOST) {
      url.hostname = APEX_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // --- Lead capture (EKO §7: 2xx fast, send async, store + notify) ---
    if (url.pathname === "/api/lead" && request.method === "POST") {
      return handleLead(request, env, ctx);
    }

    // --- Everything else: static assets via the binding (never self-fetch) ---
    return env.ASSETS.fetch(request);
  },
};

async function handleLead(request, env, ctx) {
  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: "bad payload" }, 400); }

  // Validate (EKO §7)
  const email = (data.email || "").trim();
  const name = (data.name || "").trim();
  const honeypot = data.company_url; // honeypot field — bots fill it
  if (honeypot) return json({ ok: true }, 200);                       // silently drop bots
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: "name and a valid email are required" }, 422);
  }

  // Acknowledge FAST; do the work after responding (EKO §7).
  ctx.waitUntil(
    Promise.allSettled([
      storeLead(env, data),
      notifyTeam(env, data),
      autoresponder(env, data),
    ])
  );
  return json({ ok: true }, 200);
}

// --- Email senders (Resend) -------------------------------------------------

// Notify Max: To the team inbox, Reply-To the lead so a reply goes straight back.
async function notifyTeam(env, data) {
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone || "").trim() || "—";
  const message = (data.details || data.message || "").trim() || "—";
  const source = (data.source || "website").trim();

  const text =
`New enquiry via the MH Painting website.

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Source:  ${source}

Message:
${message}
`;

  return sendEmail(env, {
    to: TEAM_TO,
    replyTo: email,
    subject: `New enquiry from ${name} — mh painting`,
    text,
  });
}

// Confirm to the lead: To the lead, Reply-To Max. Short, plain, in MH's voice.
async function autoresponder(env, data) {
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  if (!email) return;

  const text =
`Hi ${name || "there"},

Thanks for getting in touch with MH Painting — we've got your enquiry and Max will get back to you shortly, usually within a day.

If it's urgent, give us a call on 020 4076 7979.

Cheers,
Max
MH Painting
`;

  return sendEmail(env, {
    to: email,
    replyTo: TEAM_TO,
    subject: "Thanks for your enquiry — mh painting",
    text,
  });
}

// Optional KV backup of the raw lead — only runs if a LEADS namespace is bound.
// Not a blocker: no binding => no-op. Wire env.LEADS in wrangler.toml to enable.
async function storeLead(env, data) {
  if (!env.LEADS || typeof env.LEADS.put !== "function") return;
  const key = `lead:${Date.now()}:${(data.email || "anon").trim()}`;
  const record = {
    name: (data.name || "").trim(),
    email: (data.email || "").trim(),
    phone: (data.phone || "").trim(),
    message: (data.details || data.message || "").trim(),
    source: (data.source || "website").trim(),
    submitted_at: new Date().toISOString(),
  };
  await env.LEADS.put(key, JSON.stringify(record));
}

// Thin Resend client. Throws on non-2xx so Promise.allSettled records the
// failure (logged) without ever failing the user's already-sent 200.
async function sendEmail(env, { to, replyTo, subject, text }) {
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping send to", to);
    return;
  }
  const from = env.LEAD_FROM || DEFAULT_FROM;
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
