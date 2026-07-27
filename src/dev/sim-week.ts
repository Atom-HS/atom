// dev/sim-week.ts — a semana simulada (Onda 3 · demo/dev)
// O TRONCO É SAGRADO: simulação nunca escreve no banco. Estes items vivem
// só no client, atrás da flag localStorage 'mindroot-sim' (liga com ?sim=1,
// desliga com ?sim=0). Toda id é 'sim-*' e source='sim' — inconfundível.
// A semana é desenhada pra acordar os motores de verdade: 3 manhãs ansiosas
// com protocolo e noite leve (espelho F9), trabalho cheio × família pedindo
// água (síntese da árvore), lista 2 de 3 (pill), fixos e chegada (HOJE).
import type { AtomEvent, AtomItem, AtomModule, AtomType } from '@/types/item';

const KEY = 'mindroot-sim';

export function simActive(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}

/** ?sim=1 liga · ?sim=0 desliga — chamado no mount do App */
export function initSimFromUrl(): void {
  try {
    const v = new URLSearchParams(window.location.search).get('sim');
    if (v === '1') localStorage.setItem(KEY, '1');
    if (v === '0') localStorage.removeItem(KEY);
  } catch { /* sem storage, sem sim */ }
}

// ─── a fábrica da semana ─────────────────────────────
function at(daysBack: number, hour: number, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

let seq = 0;
function item(over: Partial<AtomItem> & { title: string; type: AtomType | null }): AtomItem {
  const created = over.created_at ?? at(0, 9);
  return {
    id: `sim-${++seq}`,
    user_id: 'sim',
    module: null,
    tags: [],
    status: 'active',
    state: 'structured',
    genesis_stage: 3,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: 'sim',
    created_by: 'sim',
    created_at: created,
    updated_at: over.updated_at ?? created,
    ...over,
  } as AtomItem;
}

function checkin(daysBack: number, emotion: string, extraTags: string[] = []): AtomItem {
  return item({
    title: `sinto — ${emotion}`,
    type: 'checkpoint',
    module: 'mind',
    tags: ['checkin', ...extraTags],
    status: 'completed',
    state: 'committed',
    genesis_stage: 7,
    created_at: at(daysBack, 7, 10),
    body: { soul: { energy_level: 'medium', emotion_before: emotion, emotion_after: null, needs_checkin: false, ritual_slot: null } },
  });
}

function wrap(daysBack: number, after: string): AtomItem {
  return item({
    title: `Wrap`,
    type: 'wrap',
    module: 'bridge',
    tags: ['wrap'],
    status: 'completed',
    state: 'committed',
    genesis_stage: 7,
    created_at: at(daysBack, 20, 30),
    body: { soul: { energy_level: 'medium', emotion_before: null, emotion_after: after, needs_checkin: false, ritual_slot: 'crepusculo' } },
  });
}

function task(module: AtomModule, title: string, daysBack: number, over: Partial<AtomItem> = {}): AtomItem {
  return item({ title, type: 'task', module, created_at: at(daysBack, 10), ...over });
}

function build(): { items: AtomItem[]; events: AtomEvent[] } {
  const items: AtomItem[] = [];
  const today = new Date();
  const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // o protocolo que a semana prova
  const protocolo = item({
    title: 'ansiedade bateu',
    type: 'protocol',
    module: 'mind',
    tags: ['#protocol'],
    created_at: at(20, 9),
    body: { steps: ['respira 4-7-8', 'água gelada', 'nomeia em 1 linha'], when: { emotion: null, challenging: true, energy: null, period: null } },
  });
  items.push(protocolo);

  // a semana da alma: 3 manhãs ansiosas (com protocolo + noite leve) → F9
  const manhas: Array<[number, string, string]> = [
    [1, 'ansioso', 'calmo'], [2, 'calmo', 'grato'], [3, 'ansioso', 'calmo'],
    [4, 'focado', 'calmo'], [5, 'ansioso', 'grato'], [6, 'calmo', 'calmo'], [7, 'grato', 'calmo'],
  ];
  for (const [d, am, pm] of manhas) {
    items.push(checkin(d, am));
    items.push(wrap(d, pm));
  }

  // hoje: a chegada (aurora) + fixos + o que cabe
  items.push(item({
    title: 'aurora — focado',
    type: 'checkpoint',
    module: 'bridge',
    tags: ['checkin', 'aurora'],
    status: 'completed',
    state: 'committed',
    genesis_stage: 7,
    created_at: at(0, 6, 40),
    notes: 'um dia de cada coisa no seu lugar',
    body: { soul: { energy_level: 'medium', emotion_before: 'focado', emotion_after: null, needs_checkin: false, ritual_slot: 'aurora' } },
  }));
  items.push(task('family', 'levar Sofia', 0, { body: { start: at(0, 9) } }));
  items.push(task('work', 'call Atlas — orçamento', 0, { body: { start: at(0, 14) } }));
  items.push(task('work', 'responder Willi sobre o vidro', 1, {
    body: {
      operations: {
        due_date: dayKey(today),
        priority: null, deadline: null, project_status: null, progress_mode: null, progress: null,
      },
    },
  }));

  // trabalho cheio na semana…
  ['proposta do estúdio', 'medidas do vidro', 'follow-up fornecedor', 'nota fiscal Atlas', 'briefing do site'].forEach(
    (t, i) => items.push(task('work', t, i % 4)),
  );
  // …família viva na estação, quieta na semana (pedindo água)
  ['almoço de domingo', 'escola da Sofia — reunião', 'ligar pra mãe', 'aniversário do primo'].forEach(
    (t, i) => items.push(task('family', t, 30 + i * 5, { status: 'completed', state: 'committed', genesis_stage: 7 })),
  );
  // corpo em folha nova
  items.push(task('body', 'alongamento da manhã', 0, { status: 'completed', state: 'committed', genesis_stage: 7 }));
  items.push(task('body', 'dormir 21:30', 1, { type: 'habit' }));

  // a lista da pill — 2 de 3
  items.push(item({
    title: 'compra da semana',
    type: 'list',
    module: 'bridge',
    created_at: at(2, 18),
    body: { entries: [{ text: 'leite', done: false }, { text: 'pão', done: false }, { text: 'café', done: true }] },
  }));

  // a cadeia do zênite — 1 de 2
  const alongar = item({ title: 'alongar', type: 'habit', module: 'body', status: 'completed', created_at: at(0, 12) });
  const caminhar = item({ title: 'caminhar 10 min', type: 'habit', module: 'body', created_at: at(0, 12) });
  items.push(alongar, caminhar);
  items.push(item({
    title: 'pausa do meio-dia',
    type: 'routine',
    module: 'body',
    created_at: at(10, 9),
    body: { slot: 'zenite', chain: [alongar.id, caminhar.id] },
  }));

  // o rastro do protocolo (atom_events) — nos dias ansiosos
  const events: AtomEvent[] = [1, 3, 5].map((d) => ({
    id: `sim-ev-${d}`,
    user_id: 'sim',
    source_id: protocolo.id,
    target_id: null,
    event_type: 'protocol_run',
    payload: { trigger: 'auto', steps_done: 3, steps_total: 3 },
    created_at: at(d, 10, 15),
  }));

  return { items, events };
}

let cache: { items: AtomItem[]; events: AtomEvent[] } | null = null;
function sim(): { items: AtomItem[]; events: AtomEvent[] } {
  if (!cache) cache = build();
  return cache;
}

export function simItems(): AtomItem[] { return simActive() ? sim().items : []; }
export function simEvents(): AtomEvent[] { return simActive() ? sim().events : []; }
