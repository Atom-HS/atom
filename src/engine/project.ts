// engine/project.ts — o projeto como contêiner relacional (Fase 8 · spec v0.4 D4)
// Puro: sem Supabase, sem UI. A lei do registry é o norte: "a project
// without items is empty" — belongs_to é a ÚNICA verdade de pertencimento
// (precedente da cadeia, F6); project_id é coluna dormente, não se lê.
// Sem %: presença deriva dos filhos — abertos, próximo, quietude (φ: o
// sinal suave começa em 8 dias, D5). O número convida, nunca cobra.

import type { AtomItem, ItemConnection } from '@/types/item';

export interface ProjectPresence {
  project: AtomItem;
  children: AtomItem[];      // via belongs_to, vivos
  open: AtomItem[];          // ainda não selados
  done: number;
  total: number;
  next: AtomItem | null;     // o filho aberto mais antigo — o convite
  lastTouch: string | null;  // último toque no projeto ou num filho
  quietDays: number;         // dias desde o último toque
}

const QUIET_THRESHOLD = 8; // primeiro degrau da espiral φ (8/21/55/89)

export function listProjects(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => i.type === 'project' && i.state !== 'archived' && i.status !== 'archived');
}

// Filhos pela conexão belongs_to (filho —belongs_to→ projeto), vivos.
export function projectChildren(
  project: AtomItem,
  items: AtomItem[],
  connections: ItemConnection[],
): AtomItem[] {
  const childIds = new Set(
    connections
      .filter((c) => c.relation === 'belongs_to' && c.target_id === project.id)
      .map((c) => c.source_id),
  );
  return items.filter(
    (i) => childIds.has(i.id) && i.status !== 'archived' && i.state !== 'archived',
  );
}

export function projectPresence(
  project: AtomItem,
  items: AtomItem[],
  connections: ItemConnection[],
  now: Date = new Date(),
): ProjectPresence {
  const children = projectChildren(project, items, connections);
  const open = children.filter((c) => c.status !== 'completed');
  const done = children.length - open.length;

  const next =
    open.length > 0
      ? open.reduce((oldest, c) => (c.created_at < oldest.created_at ? c : oldest))
      : null;

  const touches = [project.updated_at, ...children.map((c) => c.updated_at)].filter(Boolean);
  const lastTouch = touches.length ? touches.reduce((a, b) => (a > b ? a : b)) : null;
  const quietDays = lastTouch
    ? Math.max(0, Math.floor((now.getTime() - new Date(lastTouch).getTime()) / 86_400_000))
    : 0;

  return { project, children, open, done, total: children.length, next, lastTouch, quietDays };
}

// A linha de presença do card — estado, não métrica.
export function presenceLine(p: ProjectPresence): string {
  const base =
    p.total === 0
      ? 'vazio — um projeto sem items é vazio'
      : p.open.length === 0
        ? `${p.total} ${p.total === 1 ? 'item selado' : 'items selados'} ○`
        : `${p.open.length} de ${p.total} abertos`;
  return p.quietDays >= QUIET_THRESHOLD ? `${base} · quieto há ${p.quietDays} dias` : base;
}
