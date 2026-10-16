// eChefe — "porteiro" (Cloudflare Worker)
// Keeps the AI keys on the server. Testers use an invite code; each code has daily limits.
//
// Needs in the Cloudflare dashboard (Worker → Settings):
//   Variables and Secrets:  ANTHROPIC_KEY (secret), OPENAI_KEY (secret, optional), ADMIN_PASS (secret)
//   Bindings → KV namespace: variable name  ECHEFE
//
// Admin page:  https://<your-worker>.workers.dev/admin

const ALLOWED_ORIGINS = ["https://prfroger-maker.github.io", "http://localhost:8765"];
const CLAUDE_MODELS = ["claude-sonnet-5-5", "claude-sonnet-4-5", "claude-haiku-4-5-20251001"];
const IMG_MODELS = ["gpt-image-1-mini", "gpt-image-1", "dall-e-3"];
const DEFAULT_LIMITS = { chat: 150, tts: 80, img: 40 };   // per code, per day
const GLOBAL_LIMITS = { chat: 3000, tts: 1500, img: 600 }; // all codes together, per day (safety net)

const today = () => new Date().toISOString().slice(0, 10);
const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...extra } });
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normCode = (c) => String(c || "").trim().toUpperCase().replace(/\s+/g, "");

function cors(req) {
  const o = req.headers.get("origin") || "";
  return {
    "access-control-allow-origin": ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-echefe-code",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

async function getCode(env, code) {
  if (!code) return null;
  const c = await env.ECHEFE.get("code:" + code, "json");
  return c && c.active !== false ? c : null;
}

// counts one use of `kind` for a code; returns null if allowed, or an error Response
async function spend(env, code, info, kind, h) {
  const d = today();
  const dayKey = `use:${code}:${d}`, globKey = `glob:${d}`;
  const [day, glob] = await Promise.all([env.ECHEFE.get(dayKey, "json"), env.ECHEFE.get(globKey, "json")]);
  const u = day || { chat: 0, tts: 0, img: 0 }, g = glob || { chat: 0, tts: 0, img: 0 };
  const lim = { ...DEFAULT_LIMITS, ...(info.limits || {}) };
  if ((u[kind] || 0) >= lim[kind]) return json({ error: "limit", kind, scope: "code" }, 429, h);
  if ((g[kind] || 0) >= GLOBAL_LIMITS[kind]) return json({ error: "limit", kind, scope: "global" }, 429, h);
  u[kind] = (u[kind] || 0) + 1; g[kind] = (g[kind] || 0) + 1;
  const tot = (await env.ECHEFE.get("total:" + code, "json")) || { chat: 0, tts: 0, img: 0 };
  tot[kind] = (tot[kind] || 0) + 1; tot.last = Date.now();
  await Promise.all([
    env.ECHEFE.put(dayKey, JSON.stringify(u), { expirationTtl: 60 * 60 * 24 * 40 }),
    env.ECHEFE.put(globKey, JSON.stringify(g), { expirationTtl: 60 * 60 * 24 * 40 }),
    env.ECHEFE.put("total:" + code, JSON.stringify(tot)),
  ]);
  return null;
}

async function claude(env, body, h) {
  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || !messages.length) return json({ error: "bad_request" }, 400, h);
  const max_tokens = Math.min(6000, Math.max(64, Number(body.max_tokens) || 1000));
  let r, data;
  for (const model of CLAUDE_MODELS) {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens, messages }),
    });
    data = await r.json().catch(() => null);
    const msg = (data && data.error && data.error.message) || "";
    if (r.status === 404 || (data && data.error && data.error.type === "not_found_error") || (r.status === 400 && /model/i.test(msg))) continue;
    break;
  }
  if (r.status === 401 || r.status === 403) return json({ error: "server_key" }, 502, h);
  if (data && data.error && /credit balance/i.test(data.error.message || "")) return json({ error: "server_credit" }, 502, h);
  if (r.status === 429 || r.status === 529) return json({ error: "busy" }, 503, h);
  return json(data || { error: "upstream" }, r.status, h);
}

async function tts(env, body, h) {
  if (!env.OPENAI_KEY) return json({ error: "no_voice" }, 501, h);
  const r = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.OPENAI_KEY, "content-type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts", voice: String(body.voice || "ash"), input: String(body.input || "").slice(0, 1500),
      instructions: String(body.instructions || "").slice(0, 600), response_format: "mp3",
    }),
  });
  if (!r.ok) return json({ error: "upstream" }, r.status, h);
  return new Response(r.body, { status: 200, headers: { ...h, "content-type": "audio/mpeg" } });
}

async function image(env, body, h) {
  if (!env.OPENAI_KEY) return json({ error: "no_images" }, 501, h);
  const prompt = String(body.prompt || "").slice(0, 1000);
  for (const model of IMG_MODELS) {
    const payload = model === "dall-e-3"
      ? { model, prompt, n: 1, size: "1024x1024", quality: "standard", response_format: "b64_json" }
      : { model, prompt, n: 1, size: "1024x1024", quality: "low" };
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_KEY, "content-type": "application/json" }, body: JSON.stringify(payload),
    });
    if (r.status === 401 || r.status === 429) return json({ error: "upstream" }, r.status, h);
    if (!r.ok) continue;
    const d = await r.json().catch(() => null);
    const b64 = d && d.data && d.data[0] && d.data[0].b64_json;
    if (b64) return json({ b64 }, 200, h);
  }
  return json({ error: "no_images" }, 502, h);
}

// ── admin page ──────────────────────────────────────────────────────────────
async function listPrefix(env, prefix, limit = 1000) {
  const out = []; let cursor;
  do {
    const r = await env.ECHEFE.list({ prefix, cursor, limit: Math.min(1000, limit - out.length) });
    out.push(...r.keys); cursor = r.list_complete ? null : r.cursor;
  } while (cursor && out.length < limit);
  return out;
}

function adminShell(body) {
  return new Response(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>eChefe · Porteiro</title>
<style>body{font-family:system-ui,sans-serif;background:#0F0A00;color:#FFF5E0;margin:0;padding:16px;max-width:900px;margin:auto}h1{color:#FF6B00;font-size:22px}h2{font-size:17px;margin-top:28px;border-bottom:1px solid #3D2800;padding-bottom:6px}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{padding:8px 6px;border-bottom:1px solid #3D2800;text-align:left;vertical-align:top}th{color:#8A6A40;font-weight:600}
input,textarea,button{font:inherit;border-radius:10px;border:1px solid #3D2800;background:#1E1400;color:#FFF5E0;padding:9px 12px}button{background:#FF6B00;border:none;color:#fff;font-weight:700;cursor:pointer}
.off{opacity:.45}.muted{color:#8A6A40;font-size:13px}.card{background:#1E1400;border:1px solid #3D2800;border-radius:12px;padding:12px;margin:8px 0}.code{font-family:monospace;font-size:15px;color:#FFB800}
.small{padding:5px 10px;font-size:13px;background:#3D2800}</style></head><body>${body}</body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
}

async function admin(req, env, url) {
  const pass = url.searchParams.get("k") || "";
  if (!env.ADMIN_PASS || pass !== env.ADMIN_PASS) {
    return adminShell(`<h1>eChefe · Porteiro</h1><form method="get"><p>Senha do administrador:</p><input name="k" type="password" autofocus> <button>Entrar</button></form>`);
  }
  const k = encodeURIComponent(pass);
  if (req.method === "POST") {
    const f = await req.formData();
    const action = f.get("action");
    if (action === "new") {
      const name = String(f.get("name") || "").trim().slice(0, 40) || "Testador";
      const base = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) || "TESTE";
      const code = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
      const chat = Number(f.get("chat")) || DEFAULT_LIMITS.chat;
      await env.ECHEFE.put("code:" + code, JSON.stringify({ name, active: true, created: Date.now(), limits: { ...DEFAULT_LIMITS, chat } }));
    } else if (action === "toggle") {
      const code = normCode(f.get("code"));
      const c = await env.ECHEFE.get("code:" + code, "json");
      if (c) { c.active = c.active === false; await env.ECHEFE.put("code:" + code, JSON.stringify(c)); }
    } else if (action === "delfb") {
      await env.ECHEFE.delete(String(f.get("key")));
    }
    return Response.redirect(url.origin + "/admin?k=" + k, 303);
  }
  const d = today();
  const codeKeys = await listPrefix(env, "code:");
  const rows = await Promise.all(codeKeys.map(async ({ name: key }) => {
    const code = key.slice(5);
    const [c, u, t] = await Promise.all([env.ECHEFE.get(key, "json"), env.ECHEFE.get(`use:${code}:${d}`, "json"), env.ECHEFE.get("total:" + code, "json")]);
    return { code, c: c || {}, u: u || {}, t: t || {} };
  }));
  rows.sort((a, b) => (b.c.created || 0) - (a.c.created || 0));
  const fbKeys = (await listPrefix(env, "fb:", 300)).map((x) => x.name).sort().reverse().slice(0, 200);
  const fbs = await Promise.all(fbKeys.map(async (key) => ({ key, v: await env.ECHEFE.get(key, "json") })));
  const glob = (await env.ECHEFE.get("glob:" + d, "json")) || {};
  const appUrl = ALLOWED_ORIGINS[0] + "/echefe/";
  const share = (r) => `Oi ${r.c.name}! Quero que você teste o eChefe, meu chef com IA. Abre este link no Chrome do celular: ${appUrl}?c=${r.code}&w=${encodeURIComponent(url.origin)} — depois toca nos 3 pontinhos e em "Adicionar à tela inicial". Seu código é ${r.code}. Depois me conta o que achou pelo botão 💬 Feedback dentro do app!`;
  return adminShell(`<h1>eChefe · Porteiro</h1>
<p class="muted">Hoje (${d}), todos juntos: ${glob.chat || 0} mensagens · ${glob.tts || 0} falas · ${glob.img || 0} fotos geradas</p>
<h2>Novo código de convite</h2>
<form method="post"><input type="hidden" name="action" value="new"><input name="name" placeholder="Nome do testador" required> <input name="chat" type="number" placeholder="Mensagens/dia (150)" style="width:170px"> <button>Criar código</button></form>
<h2>Testadores (${rows.length})</h2>
<table><tr><th>Código</th><th>Nome</th><th>Hoje</th><th>Total</th><th>Último uso</th><th></th></tr>
${rows.map((r) => `<tr class="${r.c.active === false ? "off" : ""}"><td class="code">${esc(r.code)}</td><td>${esc(r.c.name)}</td>
<td>${r.u.chat || 0} msg · ${r.u.tts || 0} voz · ${r.u.img || 0} foto</td><td>${r.t.chat || 0} msg</td><td class="muted">${r.t.last ? new Date(r.t.last).toLocaleString("pt-BR", { timeZone: "Europe/Berlin" }) : "—"}</td>
<td><form method="post" style="display:inline"><input type="hidden" name="action" value="toggle"><input type="hidden" name="code" value="${esc(r.code)}"><button class="small">${r.c.active === false ? "Ativar" : "Desligar"}</button></form>
<button class="small" onclick="navigator.clipboard.writeText(this.dataset.t);this.textContent='Copiado!'" data-t="${esc(share(r))}">Copiar convite</button></td></tr>`).join("")}
</table>
<h2>Feedbacks (${fbs.length})</h2>
${fbs.map(({ key, v }) => v ? `<div class="card"><div class="muted">${esc(v.name)} · <span class="code">${esc(v.code)}</span> · ${new Date(v.ts).toLocaleString("pt-BR", { timeZone: "Europe/Berlin" })}${v.rating ? " · " + "★".repeat(v.rating) : ""}</div><div style="white-space:pre-wrap;margin-top:6px">${esc(v.text)}</div>
<form method="post" style="margin-top:8px"><input type="hidden" name="action" value="delfb"><input type="hidden" name="key" value="${esc(key)}"><button class="small">Apagar</button></form></div>` : "").join("") || '<p class="muted">Nenhum feedback ainda.</p>'}`);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const h = cors(req);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (url.pathname === "/admin") return admin(req, env, url);
    if (url.pathname === "/" ) return new Response("eChefe porteiro ✓", { headers: { "content-type": "text/plain; charset=utf-8" } });
    if (req.method !== "POST" || !url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404, h);

    const body = await req.json().catch(() => ({}));
    const code = normCode(req.headers.get("x-echefe-code") || body.code);
    const info = await getCode(env, code);
    if (!info) return json({ error: "bad_code" }, 403, h);

    switch (url.pathname) {
      case "/api/check":
        return json({ ok: true, name: info.name, voice: !!env.OPENAI_KEY }, 200, h);
      case "/api/feedback": {
        const text = String(body.text || "").trim().slice(0, 4000);
        if (!text && !Number(body.rating)) return json({ error: "empty" }, 400, h);
        const ts = Date.now();
        await env.ECHEFE.put(`fb:${new Date(ts).toISOString()}:${Math.random().toString(36).slice(2, 7)}`,
          JSON.stringify({ code, name: info.name, text, rating: Math.min(5, Math.max(0, Number(body.rating) || 0)), ts, ua: String(req.headers.get("user-agent") || "").slice(0, 160) }));
        return json({ ok: true }, 200, h);
      }
      case "/api/claude": { const e = await spend(env, code, info, "chat", h); return e || claude(env, body, h); }
      case "/api/tts":    { const e = await spend(env, code, info, "tts", h);  return e || tts(env, body, h); }
      case "/api/image":  { const e = await spend(env, code, info, "img", h);  return e || image(env, body, h); }
    }
    return json({ error: "not_found" }, 404, h);
  },
};
