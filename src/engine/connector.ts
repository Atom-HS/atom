// engine/connector.ts — o que a lente trouxe, legível (ato III · D69)
// Puro. O card de assentimento mostrava só o título: assentia-se no escuro.
// Os dados já vinham no body (hora, quem, remetente, trecho) — a tela é que
// não abria a mão. Não se assente o que não se vê.

import type { AtomItem } from '@/types/item';

export type ConnectorOrigin = 'calendar' | 'gmail';

export interface ConnectorContext {
  origin: ConnectorOrigin | null;
  /** as linhas que o card mostra pra decidir — vazio quando não há o que dizer */
  lines: string[];
}

export function originOf(item: AtomItem): ConnectorOrigin | null {
  const tags = item.tags ?? [];
  if (tags.includes('#source:google-calendar')) return 'calendar';
  if (tags.includes('#source:gmail')) return 'gmail';
  return null;
}

// "André Tanaka <andre@x.com>" → André Tanaka · "<a@x.com>" → a
export function personName(raw: string): string {
  const withName = raw.match(/^\s*"?([^"<]+?)"?\s*</);
  if (withName?.[1]?.trim()) return withName[1].trim();
  const email = raw.match(/<?([^<>@\s]+)@/);
  return email?.[1] ?? raw.trim();
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function hhmm(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** "hoje" · "amanhã" · "sex, 12 set" — o dia como quem fala, não como ISO */
export function dayWord(when: Date, now: Date): string {
  if (sameDay(when, now)) return 'hoje';
  const amanha = new Date(now);
  amanha.setDate(amanha.getDate() + 1);
  if (sameDay(when, amanha)) return 'amanhã';
  return when.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function readDate(raw: unknown): Date | null {
  if (typeof raw !== 'string' || raw === '') return null;
  // date-only (all-day) ancorado ao meio-dia local: não desliza de fuso
  const d = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T12:00:00`) : new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

const SNIPPET_MAX = 120;

export function connectorContext(item: AtomItem, now: Date = new Date()): ConnectorContext {
  const origin = originOf(item);
  const body = (item.body ?? {}) as Record<string, unknown>;
  const lines: string[] = [];

  if (origin === 'calendar') {
    const start = readDate(body.start);
    if (start) {
      const dia = dayWord(start, now);
      if (body.all_day === true) {
        lines.push(`${dia}, dia todo`);
      } else {
        const end = readDate(body.end);
        lines.push(end ? `${dia}, ${hhmm(start)}–${hhmm(end)}` : `${dia}, ${hhmm(start)}`);
      }
    }
    if (body.recurring === true) lines.push('se repete');

    const attendees = Array.isArray(body.attendees) ? body.attendees : [];
    const nomes = attendees
      .map((a) => {
        const p = a as { name?: string | null; email?: string };
        return p.name?.trim() || (p.email ? personName(p.email) : '');
      })
      .filter(Boolean);
    if (nomes.length === 1) lines.push(`com ${nomes[0]}`);
    else if (nomes.length === 2) lines.push(`com ${nomes[0]} e ${nomes[1]}`);
    else if (nomes.length > 2) lines.push(`com ${nomes[0]} e mais ${nomes.length - 1}`);
  }

  if (origin === 'gmail') {
    if (typeof body.from === 'string' && body.from) lines.push(`de ${personName(body.from)}`);
    const date = readDate(body.date);
    if (date) lines.push(dayWord(date, now));
    if (typeof body.snippet === 'string' && body.snippet.trim()) {
      const s = body.snippet.trim();
      lines.push(s.length > SNIPPET_MAX ? `${s.slice(0, SNIPPET_MAX)}…` : s);
    }
  }

  return { origin, lines };
}
