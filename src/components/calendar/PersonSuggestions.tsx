// calendar/PersonSuggestions.tsx — sugestão curada (Fase 5 · spec v0.4 D1)
// Attendees desconhecidos viram cards prontos: 1 toque escolhe o vínculo e a
// pessoa nasce ○ no tronco. O sistema apresenta, o humano decide — pessoa
// nunca nasce sozinha. "Agora não" silencia o email neste aparelho.
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { toast } from '@/store/toast-store';
import { personService } from '@/service/person-service';
import { collectUnknownAttendees, type AttendeeLike, type PersonSuggestion } from '@/engine/people';
import type { AtomModule } from '@/types/item';

const PRESETS: { label: string; relationship: string; module: AtomModule }[] = [
  { label: 'família', relationship: 'família', module: 'family' },
  { label: 'trabalho', relationship: 'trabalho', module: 'work' },
  { label: 'amigo', relationship: 'amigo', module: 'social' },
];

function dismissedKey(userId: string): string {
  return `mindroot:person-dismissed:${userId}`;
}

function readDismissed(userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(dismissedKey(userId)) ?? '[]');
  } catch {
    return [];
  }
}

export function PersonSuggestions() {
  const user = useAppStore((s) => s.user);
  const { items } = useItems();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string[]>(() => (user ? readDismissed(user.id) : []));

  const suggestions = useMemo(() => {
    const persons = items.filter((i) => i.type === 'person' && i.state !== 'archived');
    const events = items
      .filter((i) => i.tags?.includes('#source:google-calendar'))
      .map((i) => {
        const body = (i.body ?? {}) as Record<string, unknown>;
        return {
          title: i.title,
          attendees: Array.isArray(body.attendees) ? (body.attendees as AttendeeLike[]) : [],
        };
      })
      .filter((e) => e.attendees.length > 0);
    return collectUnknownAttendees(events, persons).filter((s) => !dismissed.includes(s.email));
  }, [items, dismissed]);

  if (!user || suggestions.length === 0) return null;

  const dismiss = (email: string) => {
    const next = [...dismissed, email];
    setDismissed(next);
    localStorage.setItem(dismissedKey(user.id), JSON.stringify(next));
  };

  const create = async (s: PersonSuggestion, preset: (typeof PRESETS)[number]) => {
    setBusyEmail(s.email);
    try {
      await personService.createPerson({
        userId: user.id,
        name: s.name,
        emails: [s.email],
        relationship: preset.relationship,
        module: preset.module,
      });
      await personService.syncEventConnections(user.id);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success(`${s.name} entrou no teu mundo`);
    } catch {
      toast.error(`Não deu pra criar ${s.name}`);
    } finally {
      setBusyEmail(null);
    }
  };

  return (
    <div className="bg-card border border-accent/20 rounded-xl mb-3 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text font-medium">
              ⬠ {suggestions.length === 1 ? '1 pessoa nova' : `${suggestions.length} pessoas novas`} no calendário
            </p>
            <p className="text-xs text-text-muted mt-0.5">toca pra decidir quem entra no teu mundo</p>
          </div>
          <span className="text-accent text-sm">{expanded ? '↑' : '→'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {suggestions.map((s) => (
            <div key={s.email} className="rounded-lg border border-border bg-bg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">{s.name}</p>
                  <p className="text-[11px] text-text-muted truncate">
                    {s.email} · {s.eventCount === 1 ? '1 evento' : `${s.eventCount} eventos`}
                  </p>
                  {s.eventTitles.length > 0 && (
                    <p className="text-[11px] text-text-muted/70 truncate mt-0.5">{s.eventTitles.join(' · ')}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(s.email)}
                  className="text-text-muted text-xs px-1.5 py-0.5 rounded hover:bg-surface shrink-0"
                  title="agora não"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-1.5 mt-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    disabled={busyEmail === s.email}
                    onClick={() => create(s, preset)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:border-accent/40 transition-colors disabled:opacity-40"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
