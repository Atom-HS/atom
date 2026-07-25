// home/ProtocolShelf.tsx — as cartas na manga (Fase 7 · D2)
// Todo protocolo pode ser puxado pela mão ("tô nessa") — o que só o humano
// percebe nunca vai ser detectado. Chips discretos; sem protocolo ainda,
// um convite único pra montar o primeiro.
import { useMemo, useState } from 'react';
import type { AtomItem } from '@/types/item';
import { listProtocols } from '@/engine/protocol';
import { useItems } from '@/hooks/useItems';
import { ProtocolRunner } from './ProtocolRunner';
import { ProtocolComposer } from './ProtocolComposer';

export function ProtocolShelf() {
  const { items } = useItems();
  const [running, setRunning] = useState<AtomItem | null>(null);
  const [composing, setComposing] = useState(false);

  const protocols = useMemo(() => listProtocols(items ?? []), [items]);

  return (
    <div className="mt-4">
      {protocols.length > 0 ? (
        <>
          <div className="text-[11px] font-medium tracking-[1.2px] uppercase text-text-muted mb-1.5">
            protocolos
          </div>
          <div className="flex flex-wrap gap-1.5">
            {protocols.map((p) => (
              <button
                key={p.id}
                onClick={() => setRunning(p)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:border-accent/40 transition-colors"
              >
                ◈ {p.title}
              </button>
            ))}
            <button
              onClick={() => setComposing(true)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-border text-text-muted hover:border-accent/40 transition-colors"
            >
              ◈+
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setComposing(true)}
          className="text-[11px] text-text-muted px-1 py-0.5 hover:text-text transition-colors"
        >
          ◈ quando X, faço Y — montar primeiro protocolo
        </button>
      )}

      {running && (
        <ProtocolRunner protocol={running} trigger="manual" onClose={() => setRunning(null)} />
      )}
      {composing && <ProtocolComposer onClose={() => setComposing(false)} />}
    </div>
  );
}
