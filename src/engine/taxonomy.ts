// engine/taxonomy.ts — a ida: o Genesis legisla pra fora (obra 7, etapa 4 · D68)
// Puro. A lei da casa (9 domínios, config/raiz) projetada como estrutura
// nos apps externos: labels `Atom/…` no Gmail, calendário `Atom` no GCal.
// Cria taxonomia, NUNCA move conteúdo. Delete lá fora é comando, não guerra.
import { RAIZ_DOMAINS } from '@/config/raiz';

export const ATOM_NAMESPACE = 'Atom';
export const ATOM_CALENDAR_SUMMARY = 'Atom';
/** chave reservada em `disabled` pro braço do calendário */
export const CALENDAR_KEY = '_calendar';

export interface DesiredLabel {
  key: string;  // domain key (identity, health…)
  name: string; // "Atom/saude"
}

/** O registro do que a lei criou lá fora — vive em user_connectors.metadata.taxonomy */
export interface TaxonomyRecord {
  version: 1;
  gmail: Record<string, { id: string; name: string }>;
  calendar: { id: string; summary: string } | null;
  /** braços desligados por comando do usuário (deletou lá fora) */
  disabled: string[];
  applied_at: string | null;
}

/** A taxonomia desejada: os 9 domínios da vida, no namespace assinado. */
export function desiredLabels(): DesiredLabel[] {
  return RAIZ_DOMAINS.map((d) => ({
    key: d.key,
    name: `${ATOM_NAMESPACE}/${d.label}`,
  }));
}

export function emptyTaxonomy(): TaxonomyRecord {
  return { version: 1, gmail: {}, calendar: null, disabled: [], applied_at: null };
}

/** Lê o registro do metadata do conector sem confiar no shape. */
export function readTaxonomy(metadata: Record<string, unknown> | null | undefined): TaxonomyRecord {
  const raw = metadata?.taxonomy as Partial<TaxonomyRecord> | undefined;
  if (!raw || typeof raw !== 'object') return emptyTaxonomy();
  return {
    version: 1,
    gmail: (raw.gmail && typeof raw.gmail === 'object' ? raw.gmail : {}) as TaxonomyRecord['gmail'],
    calendar: raw.calendar && typeof raw.calendar === 'object' ? (raw.calendar as TaxonomyRecord['calendar']) : null,
    disabled: Array.isArray(raw.disabled) ? raw.disabled.filter((k): k is string => typeof k === 'string') : [],
    applied_at: typeof raw.applied_at === 'string' ? raw.applied_at : null,
  };
}

/** A lei já vive lá fora? (algum braço aplicado) */
export function isApplied(rec: TaxonomyRecord): boolean {
  return Object.keys(rec.gmail).length > 0 || rec.calendar !== null;
}

/** Resumo quieto pro estado na sheet — número é estado, nunca meta (D46). */
export function taxonomySummary(rec: TaxonomyRecord): string {
  if (!isApplied(rec)) return '';
  const labels = Object.keys(rec.gmail).length;
  const parts: string[] = [];
  if (labels > 0) parts.push(`${labels} ${labels === 1 ? 'label' : 'labels'} no Gmail`);
  if (rec.calendar) parts.push('calendário no GCal');
  const off = rec.disabled.filter((k) => k !== CALENDAR_KEY).length + (rec.disabled.includes(CALENDAR_KEY) ? 1 : 0);
  if (off > 0) parts.push(`${off} desligado${off === 1 ? '' : 's'} por você`);
  return parts.join(' · ');
}
