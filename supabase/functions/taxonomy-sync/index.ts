// taxonomy-sync — a ida (D68): o Genesis legisla pra fora.
// Cria labels `Atom/…` no Gmail e o calendário `Atom` no GCal.
// Leis embutidas: cria estrutura, NUNCA move conteúdo · delete lá fora é
// comando (desativa o braço, nunca recria quieto) · desfazer remove SÓ o
// que a casa criou (ids registrados) · reconciliação por diff, com log.
// Escopos: gmail.labels (non-sensitive) + calendar.app.created (sensitive).
// Contrato canônico: src/engine/taxonomy.ts (TaxonomyRecord, namespace,
// CALENDAR_KEY) — esta edge espelha à mão e o guarda taxonomy-espelho
// quebra se divergir. Mudança de contrato nasce LÁ; aqui segue.
import { createClient } from "jsr:@supabase/supabase-js@2";

interface DesiredLabel { key: string; name: string }

interface TaxonomyRecord {
  version: 1;
  gmail: Record<string, { id: string; name: string }>;
  calendar: { id: string; summary: string } | null;
  disabled: string[];
  applied_at: string | null;
}

const CALENDAR_KEY = "_calendar";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
function err(msg: string, code: string, status: number, detail?: string): Response {
  const p: Record<string, string> = { error: msg, code }; if (detail) p.detail = detail;
  console.error(`[taxonomy-sync] ${code}: ${msg}`, detail ?? ""); return json(p, status);
}
function log(step: string, data?: Record<string, unknown>): void {
  console.log(`[taxonomy-sync] ${step}`, data ? JSON.stringify(data) : "");
}

async function refreshToken(rt: string, ci: string, cs: string): Promise<{ token: string } | { error: Response }> {
  log("token-refresh");
  let r: globalThis.Response;
  try {
    r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: ci, client_secret: cs, refresh_token: rt, grant_type: "refresh_token" }),
    });
  } catch (e) { return { error: err("Network error", "TAX_100", 502, String(e)) }; }
  if (!r.ok) {
    const b = await r.text().catch(() => "");
    if (r.status === 400 && b.includes("invalid_grant")) return { error: err("Token revoked — reconnect", "TAX_101", 400) };
    return { error: err("Token refresh failed", "TAX_103", 502, `${r.status}: ${b.slice(0, 500)}`) };
  }
  const d = await r.json().catch(() => ({}));
  if (!d.access_token) return { error: err("No access_token", "TAX_105", 502) };
  return { token: d.access_token };
}

// 403 do Google = token sem os escopos novos → o app pede reconexão
function scopeError(where: string, body: string): Response {
  return err("Missing scopes — reconnect with Google to grant label/calendar powers", "TAX_401", 403, `${where}: ${body.slice(0, 300)}`);
}

async function gget(url: string, at: string): Promise<globalThis.Response> {
  return await fetch(url, { headers: { Authorization: `Bearer ${at}` } });
}
async function gsend(url: string, method: string, at: string, body?: unknown): Promise<globalThis.Response> {
  return await fetch(url, {
    method, headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const GMAIL = "https://gmail.googleapis.com/gmail/v1/users/me";
const GCAL = "https://www.googleapis.com/calendar/v3";

interface BranchReport { key: string; name: string; action: "create" | "created" | "exists" | "disabled" | "off" }

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return err("Method not allowed", "TAX_001", 405);

  try {
    log("start");
    const s = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
          ci = Deno.env.get("GOOGLE_CLIENT_ID"), cs = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!s || !k || !ci || !cs) return err("Missing env vars", "TAX_010", 500);

    let body: Record<string, unknown>;
    try { body = JSON.parse(await req.text() || "{}"); } catch (e) { return err("Invalid JSON", "TAX_021", 400, String(e)); }
    const userId = body.user_id;
    const action = body.action;
    const labels = body.labels as DesiredLabel[] | undefined;
    const calendarSummary = typeof body.calendar_summary === "string" ? body.calendar_summary : "Atom";
    if (!userId || typeof userId !== "string") return err("Missing user_id", "TAX_022", 400);
    if (action !== "preview" && action !== "apply" && action !== "remove" && action !== "reconcile") return err("Invalid action", "TAX_023", 400);
    if ((action === "preview" || action === "apply") && (!Array.isArray(labels) || labels.some((l) => !l?.key || typeof l.name !== "string" || !l.name.startsWith("Atom/")))) {
      return err("Labels must live in the Atom/ namespace", "TAX_024", 400);
    }

    const sb = createClient(s, k);
    const { data: conn, error: ce } = await sb.from("user_connectors")
      .select("provider_refresh_token, metadata")
      .eq("user_id", userId).eq("provider", "google").maybeSingle();
    if (ce) return err("DB error", "TAX_301", 500, ce.message);
    if (!conn?.provider_refresh_token) return err("Google not connected", "TAX_302", 400);

    const metadata = (conn.metadata ?? {}) as Record<string, unknown>;
    const rawRec = metadata.taxonomy as Partial<TaxonomyRecord> | undefined;
    const rec: TaxonomyRecord = {
      version: 1,
      gmail: (rawRec?.gmail && typeof rawRec.gmail === "object" ? rawRec.gmail : {}) as TaxonomyRecord["gmail"],
      calendar: rawRec?.calendar ?? null,
      disabled: Array.isArray(rawRec?.disabled) ? rawRec.disabled : [],
      applied_at: rawRec?.applied_at ?? null,
    };

    // reconciliar sem ida viva: nada a conferir — sai antes de acordar o Google
    if (action === "reconcile" && Object.keys(rec.gmail).length === 0 && !rec.calendar) {
      log("reconciled", { disabled: 0, idaViva: false });
      return json({ action: "reconcile", disabled: [] });
    }

    const tr = await refreshToken(conn.provider_refresh_token, ci, cs);
    if ("error" in tr) return tr.error;
    const at = tr.token;

    // ─── desfazer completo: remove SÓ o que a casa criou (ids registrados) ───
    if (action === "remove") {
      const removed: string[] = [];
      for (const [key, label] of Object.entries(rec.gmail)) {
        const r = await gsend(`${GMAIL}/labels/${label.id}`, "DELETE", at);
        if (r.status === 403) return scopeError("gmail-delete", await r.text().catch(() => ""));
        if (r.ok || r.status === 404) removed.push(key);
      }
      if (rec.calendar) {
        const r = await gsend(`${GCAL}/calendars/${rec.calendar.id}`, "DELETE", at);
        if (r.status === 403) return scopeError("calendar-delete", await r.text().catch(() => ""));
        if (r.ok || r.status === 404 || r.status === 410) removed.push(CALENDAR_KEY);
      }
      const { error: ue } = await sb.from("user_connectors")
        .update({ metadata: { ...metadata, taxonomy: null }, updated_at: new Date().toISOString() })
        .eq("user_id", userId).eq("provider", "google");
      if (ue) return err("DB error", "TAX_303", 500, ue.message);
      log("removed", { count: removed.length });
      return json({ action: "remove", removed });
    }

    // ─── ler o estado vivo lá fora (diff, nunca snapshot cego) ───
    const lr = await gget(`${GMAIL}/labels`, at);
    if (lr.status === 403) return scopeError("gmail-list", await lr.text().catch(() => ""));
    if (!lr.ok) return err("Gmail API error", "TAX_201", 502, `${lr.status}`);
    const liveLabels: Array<{ id: string; name: string }> = ((await lr.json().catch(() => ({}))).labels ?? [])
      .map((l: Record<string, unknown>) => ({ id: String(l.id), name: String(l.name) }));
    const liveByName = new Map(liveLabels.map((l) => [l.name, l]));

    let calendarLive: { id: string; summary: string } | null = null;
    let calendarGone = false;
    if (rec.calendar) {
      const cr = await gget(`${GCAL}/calendars/${rec.calendar.id}`, at);
      if (cr.status === 403) return scopeError("calendar-get", await cr.text().catch(() => ""));
      if (cr.ok) calendarLive = rec.calendar;
      // 404/410 → o usuário deletou o calendário: comando, não guerra
      if (cr.status === 404 || cr.status === 410) calendarGone = true;
    }

    // ─── reconcile: a volta diária confere o que a casa criou (D68) ───
    // «Deletou lá fora → braço desliga» sem depender de alguém abrir o
    // preview à mão. Só DESLIGA — nunca cria: criar exige assentimento.
    // Ninguém olhando → só o 404/410 explícito desliga o calendário; erro
    // transitório do Google não vira comando.
    if (action === "reconcile") {
      const next: TaxonomyRecord = { ...rec, gmail: { ...rec.gmail }, disabled: [...rec.disabled] };
      const disabledNow: string[] = [];
      const desligados: Array<{ key: string; taxonomia: string; conector: string }> = [];
      for (const [key, label] of Object.entries(rec.gmail)) {
        if (liveByName.has(label.name)) continue;
        delete next.gmail[key];
        if (!next.disabled.includes(key)) next.disabled.push(key);
        disabledNow.push(key);
        desligados.push({ key, taxonomia: label.name, conector: "Gmail" });
      }
      if (calendarGone) {
        desligados.push({ key: CALENDAR_KEY, taxonomia: rec.calendar?.summary ?? "Atom", conector: "Google Calendar" });
        next.calendar = null;
        if (!next.disabled.includes(CALENDAR_KEY)) next.disabled.push(CALENDAR_KEY);
        disabledNow.push(CALENDAR_KEY);
      }
      if (disabledNow.length > 0) {
        const { error: ue } = await sb.from("user_connectors")
          .update({ metadata: { ...metadata, taxonomy: next }, updated_at: new Date().toISOString() })
          .eq("user_id", userId).eq("provider", "google");
        if (ue) return err("DB error", "TAX_305", 500, ue.message);
      }
      // ─── G1: o bilhete do braço desligado (Onda 4 obra 1 · spec 03 v2) ───
      // Texto pré-escrito, zero modelo no disparo (anti-gerador). A BORDA do
      // evento é garantida pela remoção do registro (delete next.gmail[key],
      // acima) — braço desligado sai do laço e não re-dispara. A dedup é o
      // segundo guardião (05b §1.1, opção 2 do E.): bloqueia enquanto a
      // chave existir; o RELIGAR (apply) limpa a chave, e o próximo
      // desligamento é estado novo — fala de novo. Falha aqui nunca derruba
      // o reconcile: braços independentes.
      for (const d of desligados) {
        const dedupKey = `arm-disabled:${d.key}`;
        const { data: ecoou } = await sb.from("e_bilhetes").select("id")
          .eq("user_id", userId).eq("dedup_key", dedupKey).limit(1);
        if (ecoou && ecoou.length > 0) continue;
        const { error: be } = await sb.from("e_bilhetes").insert({
          user_id: userId,
          gatilho: "arm-disabled",
          dedup_key: dedupKey,
          texto: `O braço ${d.taxonomia} foi desligado no ${d.conector}. A estrutura lá fora não existe mais.`,
        });
        if (be) log("bilhete_error", { key: d.key, error: be.message });
      }
      log("reconciled", { disabled: disabledNow.length, bilhetes: desligados.length });
      return json({ action: "reconcile", disabled: disabledNow });
    }

    // ─── o plano por braço ───
    const report: BranchReport[] = [];
    const disabled = new Set(rec.disabled);
    for (const l of labels ?? []) {
      if (disabled.has(l.key)) { report.push({ key: l.key, name: l.name, action: "off" }); continue; }
      const live = liveByName.get(l.name);
      if (live) { report.push({ key: l.key, name: l.name, action: "exists" }); continue; }
      if (rec.gmail[l.key]) {
        // registrado mas sumiu lá fora → o usuário deletou → desativa o braço
        report.push({ key: l.key, name: l.name, action: "disabled" });
        continue;
      }
      report.push({ key: l.key, name: l.name, action: "create" });
    }
    const calendarPlan: BranchReport = disabled.has(CALENDAR_KEY)
      ? { key: CALENDAR_KEY, name: calendarSummary, action: "off" }
      : calendarLive
        ? { key: CALENDAR_KEY, name: calendarSummary, action: "exists" }
        : rec.calendar
          ? { key: CALENDAR_KEY, name: calendarSummary, action: "disabled" }
          : { key: CALENDAR_KEY, name: calendarSummary, action: "create" };

    if (action === "preview") {
      log("preview", { create: report.filter((r) => r.action === "create").length });
      return json({ action: "preview", labels: report, calendar: calendarPlan });
    }

    // ─── apply: só o delta, com registro ───
    const next: TaxonomyRecord = { ...rec, gmail: { ...rec.gmail } };
    for (const r of report) {
      if (r.action === "exists") {
        const live = liveByName.get(r.name);
        if (live) next.gmail[r.key] = { id: live.id, name: live.name };
      } else if (r.action === "disabled") {
        delete next.gmail[r.key];
        if (!next.disabled.includes(r.key)) next.disabled = [...next.disabled, r.key];
      } else if (r.action === "create") {
        const cr = await gsend(`${GMAIL}/labels`, "POST", at, {
          name: r.name, labelListVisibility: "labelShow", messageListVisibility: "show",
        });
        if (cr.status === 403) return scopeError("gmail-create", await cr.text().catch(() => ""));
        if (!cr.ok) return err("Gmail label create failed", "TAX_202", 502, `${r.name}: ${cr.status}`);
        const created = await cr.json();
        next.gmail[r.key] = { id: String(created.id), name: r.name };
        r.action = "created";
      }
    }

    if (calendarPlan.action === "disabled") {
      next.calendar = null;
      if (!next.disabled.includes(CALENDAR_KEY)) next.disabled = [...next.disabled, CALENDAR_KEY];
    } else if (calendarPlan.action === "create") {
      const cr = await gsend(`${GCAL}/calendars`, "POST", at, {
        summary: calendarSummary,
        description: "O céu da casa — criado pelo Atom (a lente, não o lugar).",
      });
      if (cr.status === 403) return scopeError("calendar-create", await cr.text().catch(() => ""));
      if (!cr.ok) return err("Calendar create failed", "TAX_203", 502, `${cr.status}`);
      const created = await cr.json();
      next.calendar = { id: String(created.id), summary: calendarSummary };
      calendarPlan.action = "created";
    }

    // ─── o religar limpa a chave (05b §1.1): braço vivo de novo → o próximo
    // desligamento é estado novo e fala de novo. Falha aqui não derruba o apply.
    const rearmed = report.filter((r) => r.action === "created" || r.action === "exists").map((r) => r.key);
    if (calendarPlan.action === "created" || calendarPlan.action === "exists") rearmed.push(CALENDAR_KEY);
    if (rearmed.length > 0) {
      const { error: re } = await sb.from("e_bilhetes")
        .update({ dedup_key: null })
        .eq("user_id", userId)
        .in("dedup_key", rearmed.map((k) => `arm-disabled:${k}`));
      if (re) log("dedup_release_error", { error: re.message });
    }

    next.applied_at = new Date().toISOString();
    const { error: ue } = await sb.from("user_connectors")
      .update({ metadata: { ...metadata, taxonomy: next }, updated_at: next.applied_at })
      .eq("user_id", userId).eq("provider", "google");
    if (ue) return err("DB error", "TAX_304", 500, ue.message);

    log("applied", {
      created: report.filter((r) => r.action === "created").length,
      disabled: next.disabled.length,
    });
    return json({ action: "apply", labels: report, calendar: calendarPlan });
  } catch (u) {
    return err("Unhandled", "TAX_999", 500, u instanceof Error ? `${u.name}: ${u.message}` : String(u));
  }
});
