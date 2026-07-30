// engine/tree.ts — a árvore da vida (Onda 3 · face ÁRVORE)
// Puro: sem Supabase, sem UI. 8 ramos (módulos), real × ideal, folhas,
// janelas φ em dias. Lei do desenho: números são ESTADO, nunca julgamento
// (D46) — o "ideal" não é meta externa: é o TEU próprio baseline na janela
// longa. A árvore pende; nunca cobra.

import type { AtomItem, AtomModule } from '@/types/item';
import { MODULES } from './token-parser';

export interface TreeWindow {
  key: 'semana' | 'lunar' | 'estacao' | 'ano';
  days: number;
  label: string;
}

// janelas φ da árvore (≠ escada F4, que é cadência de calendário)
// labels sem emoji: a casa fala em glifos, e aqui nada há a informar (lei 3.5)
export const TREE_WINDOWS: TreeWindow[] = [
  { key: 'semana', days: 7, label: 'semana 7' },
  { key: 'lunar', days: 21, label: 'lunar 21' },
  { key: 'estacao', days: 55, label: 'estação 55' },
  { key: 'ano', days: 365, label: 'ano' },
];

// baseline de cada janela = a janela seguinte (o teu passado mais longo).
// o ano se compara consigo — real = ideal, a árvore em repouso.
const BASELINE: Record<TreeWindow['key'], TreeWindow['key']> = {
  semana: 'estacao',
  lunar: 'estacao',
  estacao: 'ano',
  ano: 'ano',
};

export interface Leaf {
  item: AtomItem;
  when: string; // ISO do toque mais recente
}

export interface Branch {
  module: AtomModule;
  real: number;   // 0..1 — presença na janela ativa, relativa ao ramo mais cheio
  ideal: number;  // 0..1 — presença no baseline, mesma régua
  leaves: Leaf[]; // folhas recentes (mais nova primeiro; teto de 8 pro drill)
  total: number;  // quantas folhas a janela tem de verdade (sem teto — o drill não mente)
  baseTotal: number;  // folhas na janela do baseline — o chão em que o "ideal" se apoia
  confidence: BranchConfidence; // quanta folha sustenta a leitura deste ramo
  saturated: boolean; // real folgado acima do baseline → anel (cheio)
  thirsty: boolean;   // real bem abaixo do baseline → pedindo água
}

/**
 * Confiança por ramo (benchmark 16, table stake): «sem dado, e tudo bem»
 * tem que ser distinguível de «caiu» — e de leitura apoiada em quase nada.
 * O degrau é do dado, não do humano: nenhuma confiança julga (D46).
 */
export type BranchConfidence = 'firme' | 'rala' | 'sem-dado';

// menos folha que isto no baseline = o "ideal" ainda é chute educado
export const CONFIDENCE_FLOOR = 3;

/** O que a face diz de cada degrau — null quando não há nada a dizer. */
export const CONFIDENCE_LABEL: Record<BranchConfidence, string | null> = {
  firme: null,
  rala: 'leitura rala — o ideal deste ramo se apoia em pouca folha ainda',
  'sem-dado': 'sem folha ainda — e tudo bem: o ramo cresce quando a vida tocar nele',
};

const LIVE = (i: AtomItem) => i.state !== 'archived' && i.status !== 'archived';

function touchOf(i: AtomItem): string {
  return i.updated_at && i.updated_at > i.created_at ? i.updated_at : i.created_at;
}

function sinceISO(now: Date, days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/** presença bruta por módulo: items do módulo tocados na janela */
export function presence(items: AtomItem[], days: number, now: Date): Record<AtomModule, number> {
  const since = sinceISO(now, days);
  const out = Object.fromEntries(MODULES.map((m) => [m, 0])) as Record<AtomModule, number>;
  for (const i of items) {
    if (!i.module || !LIVE(i)) continue;
    if (touchOf(i) >= since) out[i.module as AtomModule] += 1;
  }
  return out;
}

const DELTA = 0.18; // folga antes de nomear cheio/sede — a árvore não é balança de farmácia

/** a forma da árvore numa janela — real × ideal por ramo + folhas */
export function treeShape(items: AtomItem[], windowKey: TreeWindow['key'], now: Date = new Date()): Branch[] {
  const win = TREE_WINDOWS.find((w) => w.key === windowKey) ?? TREE_WINDOWS[0];
  const base = TREE_WINDOWS.find((w) => w.key === BASELINE[win.key])!;

  const realRaw = presence(items, win.days, now);
  const idealRaw = presence(items, base.days, now);
  const realMax = Math.max(1, ...Object.values(realRaw));
  const idealMax = Math.max(1, ...Object.values(idealRaw));

  const since = sinceISO(now, win.days);
  return MODULES.map((m) => {
    const real = realRaw[m] / realMax;
    const ideal = idealRaw[m] / idealMax;
    const inWindow = items
      .filter((i) => i.module === m && LIVE(i) && touchOf(i) >= since)
      .sort((a, b) => touchOf(b).localeCompare(touchOf(a)));
    const leaves = inWindow.slice(0, 8).map((item) => ({ item, when: touchOf(item) }));
    const baseTotal = idealRaw[m];
    const confidence: BranchConfidence =
      baseTotal === 0 && inWindow.length === 0 ? 'sem-dado'
      : baseTotal < CONFIDENCE_FLOOR ? 'rala'
      : 'firme';
    return {
      module: m,
      real,
      ideal,
      leaves,
      total: inWindow.length,
      baseTotal,
      confidence,
      saturated: real > ideal + DELTA,
      thirsty: ideal > 0 && real < ideal - DELTA,
    };
  });
}

/**
 * Todas as folhas de um ramo na janela — a porta do «+N mais antigas»
 * (pol. 9 diss. 02): o teto de 8 é do primeiro olhar, nunca do caminho.
 * Mesma ordem do drill (mais nova primeiro), sem teto.
 */
export function allLeaves(items: AtomItem[], module: AtomModule, windowKey: TreeWindow['key'], now: Date = new Date()): Leaf[] {
  const win = TREE_WINDOWS.find((w) => w.key === windowKey) ?? TREE_WINDOWS[0];
  const since = sinceISO(now, win.days);
  return items
    .filter((i) => i.module === module && LIVE(i) && touchOf(i) >= since)
    .sort((a, b) => touchOf(b).localeCompare(touchOf(a)))
    .map((item) => ({ item, when: touchOf(item) }));
}

/**
 * A árvore inteira ainda não viveu? Cold start é ESTADO declarado, nunca
 * silêncio mudo: 8 tocos idênticos sem uma palavra são indistinguíveis de
 * «caiu» (benchmark 16: Whoop declara o cinza; quem esconde, assusta).
 */
export function isColdStart(branches: Branch[]): boolean {
  return branches.every((b) => b.total === 0 && b.baseTotal === 0);
}

// nomes de casa pros ramos (a árvore fala pt)
export const BRANCH_LABEL: Record<AtomModule, string> = {
  work: 'trabalho', body: 'corpo', mind: 'mente', family: 'família',
  purpose: 'propósito', bridge: 'ponte', finance: 'finanças', social: 'social',
};

/** a síntese — uma linha, estado sem julgamento; null quando a árvore está quieta */
export function synthesis(branches: Branch[]): string | null {
  const parts: string[] = [];
  const cheio = branches.filter((b) => b.saturated).sort((a, b) => (b.real - b.ideal) - (a.real - a.ideal))[0];
  const sede = branches.filter((b) => b.thirsty).sort((a, b) => (b.ideal - b.real) - (a.ideal - a.real))[0];
  const nova = branches
    .filter((b) => b.leaves.length > 0)
    .sort((a, b) => b.leaves[0].when.localeCompare(a.leaves[0].when))[0];

  if (cheio) parts.push(`${BRANCH_LABEL[cheio.module]} cheio`);
  if (sede) parts.push(`${BRANCH_LABEL[sede.module]} pedindo água`);
  if (nova && nova !== cheio && nova !== sede) parts.push(`${BRANCH_LABEL[nova.module]} em folha nova`);

  return parts.length > 0 ? `a árvore pende: ${parts.join(' · ')}` : null;
}
