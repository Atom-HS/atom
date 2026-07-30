// hoje/ProtocolBanner.tsx — o chamado do protocolo (Fase 7 · D2)
// Discreto por lei: a situação chamou → convida; não chamou → return null.
// "×" silencia por hoje (por aparelho); amanhã a condição decide de novo.
import { useMemo, useState } from 'react';
import type { AtomItem } from '@/types/item';
import { evaluateProtocols, readTodaySoul } from '@/engine/protocol';
import { getCurrentPeriod } from '@/types/ui';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { getSnoozedIds, snoozeToday } from './protocol-snooze';
import { ProtocolRunner } from './ProtocolRunner';

export function ProtocolBanner() {
  const { items } = useItems();
  const user = useAppStore((s) => s.user);
  const [running, setRunning] = useState<AtomItem | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const awakened = useMemo(() => {
    const soul = readTodaySoul(items ?? []);
    return evaluateProtocols(
      items ?? [],
      { emotion: soul.emotion, energy: soul.energy, period: getCurrentPeriod().key },
      [...getSnoozedIds(user?.id), ...dismissed],
    );
  }, [items, user?.id, dismissed]);

  const first = awakened[0];
  if (!first && !running) return null;

  return (
    <>
      {first && (
        <div className="w-full bg-card border border-accent/20 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
          <button onClick={() => setRunning(first)} className="flex-1 text-left">
            <p className="text-sm text-text font-medium">◈ {first.title}</p>
            <p className="text-xs text-text-muted mt-0.5">a situação chamou — desdobrar?</p>
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setRunning(first)} className="text-accent text-sm">→</button>
            <button
              onClick={() => {
                snoozeToday(user?.id, first.id);
                setDismissed((prev) => [...prev, first.id]);
              }}
              className="text-text-muted text-sm px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {running && (
        <ProtocolRunner protocol={running} trigger="auto" onClose={() => setRunning(null)} />
      )}
    </>
  );
}
