// home/ProtocolComposer.tsx — montar o protocolo (Fase 7 · D2)
// Seleção pronta > formulário: templates completos pra 1-2 toques, tudo
// editável. "Quando X" = uma condição de alma (ou só manual); "faço Y" =
// os passos em ordem.
import { useState } from 'react';
import type { ProtocolWhen, RitualSlot } from '@/types/item';
import { useAppStore } from '@/store/app-store';
import { useProtocolActions } from '@/hooks/useProtocol';

type WhenMode = 'manual' | 'emotion' | 'challenging' | 'low-energy';

interface Template {
  name: string;
  mode: WhenMode;
  emotion?: string;
  steps: string[];
}

const TEMPLATES: Template[] = [
  { name: 'ansiedade bateu', mode: 'emotion', emotion: 'ansioso', steps: ['Respirar fundo 10×', 'Nomear o que sinto', 'Menor passo possível'] },
  { name: 'energia no chão', mode: 'low-energy', steps: ['Água + 5 min de sol', 'Cortar a tarefa pela metade', 'Pausa sem culpa'] },
  { name: 'travado', mode: 'manual', steps: ['Fechar as abas', 'Timer de 10 min', 'Só o próximo passo'] },
];

const MODE_LABELS: { key: WhenMode; label: string }[] = [
  { key: 'manual', label: 'só manual' },
  { key: 'emotion', label: 'quando sentir…' },
  { key: 'challenging', label: 'quando desafiador' },
  { key: 'low-energy', label: 'energia baixa' },
];

const PERIOD_LABELS: { key: RitualSlot | null; label: string }[] = [
  { key: null, label: 'sempre' },
  { key: 'aurora', label: '☀ aurora' },
  { key: 'zenite', label: '◆ zênite' },
  { key: 'crepusculo', label: '☽ crepúsculo' },
];

export function ProtocolComposer({ onClose }: { onClose: () => void }) {
  const user = useAppStore((s) => s.user);
  const { createProtocol } = useProtocolActions();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<WhenMode>('manual');
  const [emotion, setEmotion] = useState('');
  const [period, setPeriod] = useState<RitualSlot | null>(null);
  const [steps, setSteps] = useState<string[]>(['', '', '']);

  const applyTemplate = (t: Template) => {
    setName(t.name);
    setMode(t.mode);
    setEmotion(t.emotion ?? '');
    setSteps([...t.steps]);
  };

  const setStep = (i: number, value: string) => {
    setSteps((prev) => prev.map((s, j) => (j === i ? value : s)));
  };

  const moveStep = (i: number, dir: -1 | 1) => {
    setSteps((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const buildWhen = (): ProtocolWhen | null => {
    if (mode === 'manual') return null;
    return {
      emotion: mode === 'emotion' ? emotion.trim() : null,
      challenging: mode === 'challenging',
      energy: mode === 'low-energy' ? 'low' : null,
      period,
    };
  };

  const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
  const canCreate =
    !!user &&
    name.trim().length > 0 &&
    cleanSteps.length > 0 &&
    (mode !== 'emotion' || emotion.trim().length > 0) &&
    !createProtocol.isPending;

  const create = () => {
    if (!user || !canCreate) return;
    createProtocol.mutate(
      { userId: user.id, name: name.trim(), steps: cleanSteps, when: buildWhen() },
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
          <h2 className="text-[17px] font-medium">montar protocolo</h2>
          <button onClick={onClose} className="text-text-muted text-sm px-2 py-1 rounded hover:bg-surface">×</button>
        </div>

        {/* Templates — o sistema sugere, tu ajustas */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card hover:border-accent/40 transition-colors"
            >
              ◈ {t.name}
            </button>
          ))}
        </div>

        {/* Nome */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="nome do protocolo"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-[14px] mb-3 outline-none focus:border-accent/40"
        />

        {/* Quando X */}
        <div className="text-[11px] font-medium tracking-[1.2px] uppercase text-text-muted mb-1.5">quando</div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {MODE_LABELS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                mode === m.key ? 'border-accent text-accent bg-accent-light/8' : 'border-border bg-card text-text-muted'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode === 'emotion' && (
          <input
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            placeholder="ansioso, cansado, frustrado…"
            className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-[13px] mb-2 outline-none focus:border-accent/40"
          />
        )}
        {mode !== 'manual' && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {PERIOD_LABELS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPeriod(p.key)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  period === p.key ? 'border-accent text-accent bg-accent-light/8' : 'border-border bg-card text-text-muted'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Faço Y */}
        <div className="text-[11px] font-medium tracking-[1.2px] uppercase text-text-muted mb-1.5 mt-3">faço</div>
        <div className="space-y-1.5 mb-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-muted w-4 text-center shrink-0">{i + 1}</span>
              <input
                value={step}
                onChange={(e) => setStep(i, e.target.value)}
                placeholder={`passo ${i + 1}`}
                className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-accent/40"
              />
              <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="text-text-muted text-xs px-1 disabled:opacity-20">↑</button>
              <button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="text-text-muted text-xs px-1 disabled:opacity-20">↓</button>
              <button onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))} className="text-text-muted text-xs px-1">×</button>
            </div>
          ))}
          <button
            onClick={() => setSteps((prev) => [...prev, ''])}
            className="text-[11px] text-text-muted px-1 py-0.5 hover:text-text transition-colors"
          >
            + passo
          </button>
        </div>

        <button
          onClick={create}
          disabled={!canCreate}
          className="w-full py-2.5 rounded-xl bg-text text-bg text-[14px] font-medium disabled:opacity-30 transition-opacity"
        >
          {createProtocol.isPending ? 'montando…' : 'montar protocolo'}
        </button>
      </div>
    </div>
  );
}
