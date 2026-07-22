import { localDayKey } from './dates';

// engine/token-parser.ts — Parser de tokens de captura manual
// Input livre + tokens #module / @type / @date → ParsedCapture estruturado.

import type { AtomModule, AtomType } from '@/types/item';

export const MODULES: ReadonlyArray<AtomModule> = [
  'work', 'body', 'mind', 'family', 'purpose', 'bridge', 'finance', 'social',
];

export const TYPES: ReadonlyArray<AtomType> = [
  'note', 'reflection', 'recommendation', 'podcast', 'article', 'resource', 'list',
  'task', 'habit', 'recipe', 'workout', 'spec', 'checkpoint', 'project',
  'session-log', 'wrap', 'ritual', 'review', 'log', 'doc', 'research', 'template', 'lib',
];

const DATE_KEYWORDS = ['hoje', 'amanha', 'amanhã', 'semana', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'sáb', 'dom'] as const;
type DateKeyword = typeof DATE_KEYWORDS[number];

function offsetDays(d: Date, days: number): string {
  const dd = new Date(d);
  dd.setDate(dd.getDate() + days);
  return localDayKey(dd); // fuso local — @hoje às 04h da manhã é HOJE, não ontem-UTC
}

function nextWeekday(d: Date, target: number): string {
  const current = d.getDay();
  const diff = (target - current + 7) % 7 || 7;
  return offsetDays(d, diff);
}

function resolveDate(kw: DateKeyword, today: Date): string {
  if (kw === 'hoje') return offsetDays(today, 0);
  if (kw === 'amanha' || kw === 'amanhã') return offsetDays(today, 1);
  if (kw === 'semana') return offsetDays(today, 7);
  const map: Record<string, number> = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6, 'sáb': 6 };
  return nextWeekday(today, map[kw]);
}

export interface ParsedCapture {
  title: string;
  module: AtomModule | null;
  type: AtomType | null;
  dueDate: string | null;
}

const MODULE_RE = new RegExp(`#(${MODULES.join('|')})\\b`, 'gi');
const TYPE_RE = new RegExp(`@(${TYPES.join('|')})\\b`, 'gi');
// Lookahead em vez de \b: word boundary não casa após chars acentuados (ã, á)
const DATE_RE = new RegExp(`@(${DATE_KEYWORDS.join('|')})(?=\\s|$|[.,;!?])`, 'gi');

export function parseCapture(input: string, today: Date = new Date()): ParsedCapture {
  let module: AtomModule | null = null;
  let type: AtomType | null = null;
  let dueDate: string | null = null;
  let title = input;

  title = title.replace(MODULE_RE, (_, m) => { module = m.toLowerCase() as AtomModule; return ''; });
  title = title.replace(TYPE_RE, (_, t) => { type = t.toLowerCase() as AtomType; return ''; });
  title = title.replace(DATE_RE, (_, d) => {
    dueDate = resolveDate(d.toLowerCase() as DateKeyword, today);
    return '';
  });

  return { title: title.replace(/\s+/g, ' ').trim(), module, type, dueDate };
}
