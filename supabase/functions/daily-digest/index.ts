// daily-digest — a válvula do cofre + o cron da volta (obra 8 · D66/D69)
// A ÚNICA exceção sancionada ao "pull, nunca push" do bot: a casa fala
// uma vez por dia, no máximo, e SÓ quando há algo vencendo ou ausente.
// Braço 1 (volta): sincroniza calendar/gmail e ingere — espelho do
//   contrato canônico em src/service/connector-service.ts (ingest*).
// Braço 2 (cofre): validade + ausência — espelho da lei canônica em
//   src/engine/vault.ts (D63). Mudança de regra nasce LÁ; aqui segue.
// Auth: header x-digest-secret comparado ao Vault ('digest_secret') —
//   segredo nunca em repo (§8.4).
import { serviceClient, resolveUserId } from "../_shared/tronco.ts";

function log(step: string, data?: Record<string, unknown>): void {
  console.log(`[daily-digest] ${step}`, data ? JSON.stringify(data) : "");
}
function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

// ─── espelho de engine/vault.ts (canônico lá — D63) ──────
const LEAD_DAYS: Record<string, number> = { documents: 270, identity: 90, finance: 60, health: 60 };
const LEAD_DEFAULT = 30;
const SIGNIFICANT_EVENTS = ["touch", "checkin", "protocol_run"];
const ABSENCE_THRESHOLD_DAYS = 90;
// os 9 domínios da vida (canônico: src/config/raiz.ts)
const DOMAINS = ["identity", "documents", "health", "finance", "storage", "memories", "time", "communication", "projects"];
const DOMAIN_PT: Record<string, string> = {
  identity: "identidade", documents: "documentos", health: "saúde",
  finance: "finanças", storage: "arquivos", memories: "memórias",
  time: "tempo", communication: "comunicação", projects: "projetos",
};
const MS_DAY = 86_400_000;

interface Row {
  id: string; title: string; tags: string[] | null; status: string | null;
  state: string | null; body: Record<string, unknown> | null; created_at: string;
}

function domainOf(tags: string[] | null): string | null {
  const t = (tags ?? []).find((x) => x.startsWith("#domain:"));
  return t ? t.slice("#domain:".length) : null;
}

function readDeadline(body: Record<string, unknown> | null): Date | null {
  const ops = body?.operations as { deadline?: string | null; due_date?: string | null } | undefined;
  const raw = ops?.deadline ?? ops?.due_date;
  if (!raw) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T23:59:59`) : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function expiries(rows: Row[], now: Date): Array<{ title: string; domain: string; daysLeft: number }> {
  const out: Array<{ title: string; domain: string; daysLeft: number }> = [];
  for (const r of rows) {
    if (r.status === "archived" || r.state === "archived" || r.status === "completed") continue;
    const domain = domainOf(r.tags);
    if (!domain) continue;
    const deadline = readDeadline(r.body);
    if (!deadline) continue;
    const daysLeft = Math.floor((deadline.getTime() - now.getTime()) / MS_DAY);
    const lead = LEAD_DAYS[domain] ?? LEAD_DEFAULT;
    if (daysLeft <= lead) out.push({ title: r.title, domain, daysLeft });
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft);
}

function absences(
  rows: Row[],
  events: Array<{ event_type: string; source_id: string; created_at: string }>,
  now: Date,
): Array<{ domain: string; daysSince: number | null }> {
  const itemDomain = new Map<string, string>();
  const lastTouch = new Map<string, number>();
  for (const r of rows) {
    if (r.status === "archived" || r.state === "archived") continue;
    const domain = domainOf(r.tags);
    if (!domain) continue;
    itemDomain.set(r.id, domain);
    const created = new Date(r.created_at).getTime();
    if (created > (lastTouch.get(domain) ?? 0)) lastTouch.set(domain, created);
  }
  for (const e of events) {
    if (!SIGNIFICANT_EVENTS.includes(e.event_type)) continue;
    const domain = itemDomain.get(e.source_id);
    if (!domain) continue;
    const at = new Date(e.created_at).getTime();
    if (at > (lastTouch.get(domain) ?? 0)) lastTouch.set(domain, at);
  }
  return DOMAINS
    .map((domain) => {
      const touch = lastTouch.get(domain);
      return { domain, daysSince: touch ? Math.floor((now.getTime() - touch) / MS_DAY) : null };
    })
    .filter((a) => a.daysSince === null || a.daysSince > ABSENCE_THRESHOLD_DAYS)
    .sort((a, b) => (b.daysSince ?? Infinity) - (a.daysSince ?? Infinity));
}

// ─── a voz do E. (Lei do Tom: você · estado, nunca cobrança · sem !) ──
function compose(
  exp: Array<{ title: string; domain: string; daysLeft: number }>,
  abs: Array<{ domain: string; daysSince: number | null }>,
): string {
  const lines: string[] = ["◍ o cofre, uma vez por dia — só porque há algo.", ""];
  if (exp.length > 0) {
    lines.push("vencendo:");
    for (const e of exp.slice(0, 6)) {
      const quando = e.daysLeft < 0
        ? `venceu há ${Math.abs(e.daysLeft)} ${Math.abs(e.daysLeft) === 1 ? "dia" : "dias"}`
        : e.daysLeft === 0 ? "vence hoje" : `${e.daysLeft} dias`;
      lines.push(`· ${e.title} — ${quando} (${DOMAIN_PT[e.domain] ?? e.domain})`);
    }
    if (exp.length > 6) lines.push(`· e mais ${exp.length - 6} na janela — o chão da árvore mostra`);
    lines.push("");
  }
  if (abs.length > 0) {
    lines.push("quieto há tempo:");
    for (const a of abs.slice(0, 4)) {
      lines.push(`· ${DOMAIN_PT[a.domain] ?? a.domain} — ${a.daysSince === null ? "nunca teve registro" : `${a.daysSince} dias sem toque`}`);
    }
    lines.push("");
  }
  lines.push("renovar é um gesto no chão da árvore. o resto segue de pé.");
  return lines.join("\n");
}

// ─── a volta no cron (espelho do connector-service.ingest*) ──────────
interface CalEvent {
  google_id: string; title: string; start: string; end: string;
  calendar: string; recurring: boolean; all_day?: boolean;
  attendees?: Array<{ email: string; name: string | null; response: string | null }>;
}
interface GmailMsg {
  id: string; thread_id: string; subject: string; from: string;
  date: string; snippet: string; labels: string[];
}

function extractWhoTag(from: string): string | null {
  const nameMatch = from.match(/^([^<]+)</);
  if (nameMatch) {
    const name = nameMatch[1].trim().replace(/["']/g, "");
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (slug) return `#who:${slug}`;
    }
  }
  const emailMatch = from.match(/<?\s*([^@]+)@/);
  if (emailMatch) {
    const prefix = emailMatch[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (prefix) return `#who:${prefix}`;
  }
  return null;
}

async function callEdge(name: string, userId: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/${name}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!r.ok) { log(`${name}-failed`, { status: r.status }); return null; }
    return await r.json().catch(() => null);
  } catch (e) { log(`${name}-error`, { e: String(e) }); return null; }
}

// deno-lint-ignore no-explicit-any
async function ingestVolta(sb: any, userId: string): Promise<{ calendar: number; gmail: number }> {
  const created = { calendar: 0, gmail: 0 };
  const { data: existing } = await sb.from("items").select("id, body").eq("user_id", userId).not("body", "is", null);
  const byGoogleId = new Set(
    (existing ?? []).map((i: { body: Record<string, unknown> | null }) => i.body?.google_id).filter(Boolean),
  );
  const byGmailId = new Set(
    (existing ?? []).map((i: { body: Record<string, unknown> | null }) => i.body?.gmail_id).filter(Boolean),
  );

  const cal = await callEdge("calendar-sync", userId);
  for (const event of ((cal?.events ?? []) as CalEvent[])) {
    if (byGoogleId.has(event.google_id)) continue;
    const attendees = event.attendees ?? [];
    const tags = ["#domain:time", "#source:google-calendar", "#connector"];
    for (const a of attendees) {
      const who = extractWhoTag(a.name ? `${a.name} <${a.email}>` : `<${a.email}>`);
      if (who && !tags.includes(who)) tags.push(who);
    }
    const { error } = await sb.from("items").insert({
      title: event.title, user_id: userId, type: event.recurring ? "ritual" : "task",
      module: "bridge", tags, status: "inbox", state: "inbox", genesis_stage: 1, source: "atom-engine",
      body: { google_id: event.google_id, start: event.start, end: event.end, calendar: event.calendar, recurring: event.recurring, all_day: event.all_day ?? false, attendees },
    });
    if (!error) created.calendar++;
  }

  const gm = await callEdge("gmail-sync", userId);
  for (const msg of ((gm?.messages ?? []) as GmailMsg[])) {
    if (byGmailId.has(msg.id)) continue;
    const tags = ["#domain:communication", "#source:gmail", "#connector"];
    const who = extractWhoTag(msg.from);
    if (who) tags.push(who);
    const { error } = await sb.from("items").insert({
      title: msg.subject || "(sem assunto)", user_id: userId, type: "note",
      module: "bridge", tags, status: "inbox", state: "inbox", genesis_stage: 1, source: "atom-engine",
      body: { gmail_id: msg.id, from: msg.from, date: msg.date, snippet: msg.snippet, labels: msg.labels },
    });
    if (!error) created.gmail++;
  }
  return created;
}

// ─── a rotina ────────────────────────────────────────────
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const sb = serviceClient();

    // o segredo mora no Vault — nunca em repo nem em migration (§8.4);
    // lido via RPC trancada pro service_role (vault não é exposto no REST)
    const { data: expected } = await sb.rpc("get_digest_secret");
    if (!expected || req.headers.get("x-digest-secret") !== expected) {
      return json({ error: "não autorizado" }, 401);
    }

    let body: Record<string, unknown> = {};
    try { body = JSON.parse(await req.text() || "{}"); } catch { /* corpo vazio vale */ }
    const dryRun = body.dry_run === true;

    const userId = await resolveUserId(sb);
    log("start", { dryRun });

    // braço 1 — a volta (falha aqui não cala o cofre)
    const volta = await ingestVolta(sb, userId);
    log("volta", volta);

    // braço 2 — o cofre (espelho de engine/vault.ts)
    const now = new Date();
    const { data: rows, error: ie } = await sb
      .from("items").select("id, title, tags, status, state, body, created_at").eq("user_id", userId);
    if (ie) return json({ error: ie.message }, 500);
    const since = new Date(now.getTime() - 400 * MS_DAY).toISOString();
    const { data: events } = await sb
      .from("atom_events").select("event_type, source_id, created_at")
      .eq("user_id", userId).gte("created_at", since);

    const exp = expiries((rows ?? []) as Row[], now);
    const abs = absences((rows ?? []) as Row[], (events ?? []) as Array<{ event_type: string; source_id: string; created_at: string }>, now);

    // o raro é lei: sem motivo, sem mensagem
    if (exp.length === 0 && abs.length === 0) {
      log("quiet", { volta });
      return json({ sent: false, reason: "nada vencendo ou ausente", volta });
    }

    const text = compose(exp, abs);
    if (dryRun) return json({ sent: false, dry_run: true, text, expiries: exp.length, absences: abs.length, volta });

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!token || !chatId) return json({ error: "Telegram não configurado" }, 500);
    const tr = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: Number(chatId), text }),
    });
    if (!tr.ok) return json({ error: "Telegram send failed", status: tr.status }, 502);

    log("sent", { expiries: exp.length, absences: abs.length });
    return json({ sent: true, expiries: exp.length, absences: abs.length, volta });
  } catch (u) {
    return json({ error: u instanceof Error ? `${u.name}: ${u.message}` : String(u) }, 500);
  }
});
