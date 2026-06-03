/**
 * worker.js — the only dynamic surface. Per EKO build rules §2:
 *  - Static assets are served through env.ASSETS (the binding), never by the
 *    Worker fetching its own custom domain (that is the 522 self-loop).
 *  - Secrets (mail key, etc.) live in Worker env, never in the repo.
 *
 * Routing: /api/lead is handled here (form round-trip, EKO §7); everything else
 * is a static asset served from ./dist via the ASSETS binding.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

// TODO(setup): wire a real store (KV/D1/Sheet) + MailChannels send.
// MailChannels DNS: _mailchannels TXT must use `auth=<account-id>` (NOT cfid=) — EKO §2.
async function storeLead(env, data) { /* TODO: KV/D1/Sheet write incl. submitted_at + source */ }
async function notifyTeam(env, data) { /* TODO: MailChannels send to client inbox */ }
async function autoresponder(env, data) { /* TODO: MailChannels send to lead */ }

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
