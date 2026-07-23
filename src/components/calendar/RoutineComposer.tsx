// calendar/RoutineComposer.tsx — montar a cadeia (Fase 6 · D2)
// Seleção pronta > formulário: templates completos por slot pra 1-2 toques;
// tudo editável antes de montar. Elos em ordem — a ordem é a cadeia.
import { useState } from 'react';
import type { RitualSlot } from '@/types/item';
import { useAppStore } from '@/store/app-store';
import { useRoutineActions } from '@/hooks/useRoutine';

interface Template {
  name: string;
  links: string[];
}

const TEMPLATES: Record<RitualSlot, Template[]> = {
  aurora: [
    { name: 'chegada ao dia', links: ['Água ao acordar', 'Movimento leve', 'Uma prioridade só'] },
    { name: 'corpo primeiro', links: ['Alongar', 'Treino curto', 'Banho frio'] },
  ],
  zenite: [
    { name: 'pausa do meio-dia', links: ['Levantar da cadeira', 'Água', '5 min de sol'] },
    { name: 'recalibrar', links: ['Respirar 10x', 'Revisar a prioridade', 'Fechar abas'] },
  ],
  crepusculo: [
    { name: 'desligar', links: ['Telas off', 'Arrumar o amanhã', 'Leitura leve'] },
    { name: 'volta pra casa', links: ['Guardar o trabalho', 'Presença com a família', 'Gratidão'] },
  ],
};

const SLOT_LABELS: { key: RitualSlot; label: string }[] = [
  { key: 'aurora', label: '☀ aurora' },
  { key: 'zenite', label: '◆ zênite' },
  { key: 'crepusculo', label: '☽ crepúsculo' },
];

export function RoutineComposer({ initialSlot, onClose }: { initialSlot: RitualSlot; onClose: () => void }) {
  const user = useAppStore((s) => s.user);
  const { createRoutine } = useRoutineActions();
  const [slot, setSlot] = useState<RitualSlot>(initialSlot);
  const [name, setName] = useState('');
  const [links, setLinks] = useState<string[]>(['', '', '']);

  const applyTemplate = (t: Template) => {
    setName(t.name);
    setLinks([...t.links]);
  };

  const setLink = (i: number, value: string) => {
    setLinks((prev) => prev.map((l, j) => (j === i ? value : l)));
  };

  const moveLink = (i: number, dir: -1 | 1) => {
    setLinks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const cleanLinks = links.map((l) => l.trim()).filter(Boolean);
  const canCreate = !!user && name.trim().length > 0 && cleanLinks.length > 0 && !createRoutine.isPending;

  const create = () => {
    if (!user || !canCreate) return;
    createRoutine.mutate(
      {
        userId: user.id,
        name: name.trim(),
        slot,
        links: cleanLinks.map((title) => ({ title })),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-bg rounded-t-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium">montar rotina</h2>
          <button onClick={onClose} className="text-text-muted text-sm px-2 py-1 rounded hover:bg-surface">×</button>
        </div>

        {/* Templates — o sistema sugere, tu ajustas */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {TEMPLATES[slot].map((t) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:border-accent/40 transition-colors"
            >
              ⛓ {t.name}
            </button>
          ))}
        </div>

        {/* Slot */}
        <div className="flex gap-1.5 mb-3">
          {SLOT_LABELS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSlot(s.key)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                slot === s.key ? 'border-accent text-accent bg-accent-light/8' : 'border-border bg-card text-text-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Nome */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="nome da rotina"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-[14px] mb-3 outline-none focus:border-accent/40"
        />

        {/* Elos */}
        <div className="space-y-1.5 mb-4">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-muted w-4 text-center shrink-0">{i + 1}</span>
              <input
                value={link}
                onChange={(e) => setLink(i, e.target.value)}
                placeholder={`elo ${i + 1}`}
                className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-accent/40"
              />
              <button onClick={() => moveLink(i, -1)} disabled={i === 0} className="text-text-muted text-xs px-1 disabled:opacity-20">↑</button>
              <button onClick={() => moveLink(i, 1)} disabled={i === links.length - 1} className="text-text-muted text-xs px-1 disabled:opacity-20">↓</button>
              <button onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))} className="text-text-muted text-xs px-1">×</button>
            </div>
          ))}
          <button
            onClick={() => setLinks((prev) => [...prev, ''])}
            className="text-[11px] text-text-muted px-1 py-0.5 hover:text-text transition-colors"
          >
            + elo
          </button>
        </div>

        <button
          onClick={create}
          disabled={!canCreate}
          className="w-full py-2.5 rounded-xl bg-text text-bg text-[14px] font-medium disabled:opacity-30 transition-opacity"
        >
          {createRoutine.isPending ? 'montando…' : 'montar cadeia'}
        </button>
      </div>
    </div>
  );
}
