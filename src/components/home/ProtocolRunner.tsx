// home/ProtocolRunner.tsx — desdobrar e viver o protocolo (Fase 7 · D2)
// A situação chamou (ou a mão puxou) → os passos se abrem. Tocar passo marca;
// "executado ○" deixa o rastro (atom_events) e silencia o chamado de hoje.
// Sair sempre possível — nunca forçar.
import { useState } from 'react';
import type { AtomItem } from '@/types/item';
import { readProtocolBody, readTodaySoul } from '@/engine/protocol';
import { getCurrentPeriod } from '@/types/ui';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { useProtocolActions } from '@/hooks/useProtocol';
import { snoozeToday } from './protocol-snooze';

export function ProtocolRunner({
  protocol,
  trigger,
  onClose,
}: {
  protocol: AtomItem;
  trigger: 'auto' | 'manual';
  onClose: () => void;
}) {
  const user = useAppStore((s) => s.user);
  const { items } = useItems();
  const { logRun } = useProtocolActions();
  const [done, setDone] = useState<Set<number>>(new Set());

  const { steps } = readProtocolBody(protocol);
  const soul = readTodaySoul(items ?? []);
  const period = getCurrentPeriod().key;

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const finish = () => {
    logRun.mutate(
      {
        protocol,
        run: {
          trigger,
          emotion: soul.emotion,
          energy: soul.energy,
          period,
          steps_done: done.size,
          steps_total: steps.length,
        },
      },
      {
        onSuccess: () => {
          snoozeToday(user?.id, protocol.id);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-bg rounded-t-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[17px] font-medium">◈ {protocol.title}</h2>
          <button onClick={onClose} className="text-text-muted text-sm px-2 py-1 rounded hover:bg-surface">×</button>
        </div>
        <p className="text-xs text-text-muted mb-4">
          {trigger === 'auto'
            ? `a situação chamou${soul.emotion ? ` — ${soul.emotion}` : ''}`
            : 'tu chamaste'}
        </p>

        <div className="space-y-1.5 mb-5">
          {steps.map((step, i) => {
            const isDone = done.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg border transition-colors ${
                  isDone ? 'border-accent/40 bg-accent-light/8' : 'border-border bg-card'
                }`}
              >
                <span className={`text-sm ${isDone ? 'text-accent' : 'text-text-muted'}`}>
                  {isDone ? '●' : '○'}
                </span>
                <span className={`text-[13px] ${isDone ? 'text-text' : 'text-text-muted'}`}>{step}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={finish}
          disabled={logRun.isPending}
          className="w-full py-2.5 rounded-xl bg-text text-bg text-[14px] font-medium disabled:opacity-30 transition-opacity"
        >
          {logRun.isPending ? 'registrando…' : `executado ○ · ${done.size}/${steps.length}`}
        </button>
      </div>
    </div>
  );
}
