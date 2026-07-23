// calendar/PersonChips.tsx — quem estará lá (Fase 5 · spec v0.4 D1)
// Chips discretos no evento: pessoa conhecida ganha cor do módulo e abre
// o item dela; attendee desconhecido fica cinza (vira sugestão curada).
import { useMemo } from 'react';
import type { AtomItem } from '@/types/item';
import { matchByEmail, matchInText, type AttendeeLike } from '@/engine/people';
import { MODULE_COLORS } from '@/components/atoms/tokens';
import { useNav } from '@/hooks/useNav';

const MAX_CHIPS = 3;

function initial(name: string): string {
  return (name.trim().charAt(0) || '?').toUpperCase();
}

export function PersonChips({ item, persons }: { item: AtomItem; persons: AtomItem[] }) {
  const { selectItem } = useNav();

  const { matched, unknown } = useMemo(() => {
    const body = (item.body ?? {}) as Record<string, unknown>;
    const attendees = Array.isArray(body.attendees) ? (body.attendees as AttendeeLike[]) : [];
    const m = new Map<string, AtomItem>();
    const u: AttendeeLike[] = [];
    for (const a of attendees) {
      const person = matchByEmail(persons, a.email);
      if (person) m.set(person.id, person);
      else u.push(a);
    }
    for (const person of matchInText(persons, item.title)) m.set(person.id, person);
    return { matched: [...m.values()], unknown: u };
  }, [item, persons]);

  const total = matched.length + unknown.length;
  if (total === 0) return null;

  const chips = [
    ...matched.map((p) => ({ key: p.id, label: initial(p.title), title: p.title, person: p })),
    ...unknown.map((a) => ({ key: a.email, label: initial(a.name ?? a.email), title: a.name ?? a.email, person: null })),
  ].slice(0, MAX_CHIPS);

  return (
    <span className="flex items-center -space-x-1 shrink-0">
      {chips.map((c) => (
        <span
          key={c.key}
          title={c.title}
          onClick={c.person ? (e) => { e.stopPropagation(); selectItem(c.person!.id); } : undefined}
          className={`w-[18px] h-[18px] rounded-full border border-bg text-[9px] font-medium inline-flex items-center justify-center ${
            c.person ? 'text-white cursor-pointer' : 'bg-surface text-text-muted'
          }`}
          style={c.person ? { background: MODULE_COLORS[c.person.module ?? 'family'] } : undefined}
        >
          {c.label}
        </span>
      ))}
      {total > MAX_CHIPS && (
        <span className="w-[18px] h-[18px] rounded-full border border-bg bg-surface text-[8px] text-text-muted inline-flex items-center justify-center">
          +{total - MAX_CHIPS}
        </span>
      )}
    </span>
  );
}
