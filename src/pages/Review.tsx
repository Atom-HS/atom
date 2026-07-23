// pages/Review.tsx — o ritual da escada de meaning (Fase 4 · spec §2.4)
// Dois gestos: o sistema APRESENTA o período (lê o nível abaixo, nunca mais
// fundo) → o humano SIGNIFICA (página de escrita) → sela. Nunca forçar:
// sair é sempre possível, o acumulado espera.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { nextAvailableReview } from '@/engine/meaning';
import { reviewService } from '@/service/review-service';
import type { AtomItem } from '@/types/item';

function wrapSummary(w: AtomItem): { shift: string | null; eLine: string | null; seeds: number } {
  const body = w.body as Record<string, unknown> | null;
  const soul = body?.soul as { aurora?: { emotion?: string }; crepusculo?: { emotion?: string } } | undefined;
  const a = soul?.aurora?.emotion ?? null;
  const c = soul?.crepusculo?.emotion ?? null;
  const seeds = Array.isArray(body?.seeds) ? (body!.seeds as unknown[]).length : 0;
  return {
    shift: a && c ? `${a} → ${c}` : c ? c : null,
    eLine: typeof body?.e_line === 'string' ? (body.e_line as string) : null,
    seeds,
  };
}

export function ReviewPage() {
  const navigate = useNavigate();
  const { items, isLoading } = useItems();
  const user = useAppStore((s) => s.user);

  const available = useMemo(() => nextAvailableReview(items ?? []), [items]);

  const [step, setStep] = useState<'ler' | 'significar' | 'selado'>('ler');
  const [meaning, setMeaning] = useState('');
  const [sealing, setSealing] = useState(false);

  if (isLoading) {
    return <div className="px-5 py-16 text-center text-sm text-text-muted">…</div>;
  }

  if (!available && step !== 'selado') {
    return (
      <div className="px-5 py-16 text-center">
        <div className="text-3xl text-text-muted/40 mb-3">🪜</div>
        <p className="text-sm text-text-muted leading-relaxed">
          a escada dorme. a primeira síntese semanal<br />acorda com 7 wraps — cada noite conta.
        </p>
        <button onClick={() => navigate('/')} className="mt-6 text-sm text-accent">voltar</button>
      </div>
    );
  }

  const seal = async () => {
    if (!available || !user || !meaning.trim() || sealing) return;
    setSealing(true);
    try {
      await reviewService.sealReview({
        userId: user.id,
        cadence: available.rung.key,
        label: available.rung.label,
        readIds: available.reads.map((r) => r.id),
        meaning: meaning.trim(),
      });
      setStep('selado');
    } finally {
      setSealing(false);
    }
  };

  return (
    <div className="px-5 pb-24">
      <AnimatePresence mode="wait">
        {step === 'ler' && available && (
          <motion.div key="ler" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="pt-4 mb-4">
              <h1 className="text-lg font-medium text-text-heading">{available.rung.invite}</h1>
              <p className="text-xs text-text-muted mt-0.5">
                {available.reads.length} {available.rung.reads === 'wrap' ? 'dias' : 'sínteses'} acumulados · o sistema apresenta, tu significas
              </p>
            </div>

            <div className="space-y-2 mb-5">
              {available.reads.map((r) => {
                const s = wrapSummary(r);
                return (
                  <div key={r.id} className="bg-card border border-border rounded-xl px-4 py-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-text-muted">
                        {format(parseISO(r.created_at), "EEE · d 'de' MMM", { locale: ptBR })}
                      </span>
                      {s.shift && <span className="text-xs text-accent">{s.shift}</span>}
                    </div>
                    {s.eLine && <p className="text-[13px] text-text mt-1 italic">"{s.eLine}"</p>}
                    {!s.eLine && <p className="text-[13px] text-text-muted mt-1">{r.title}</p>}
                    {s.seeds > 0 && <p className="text-[11px] text-text-muted mt-0.5">🌱 {s.seeds} seed{s.seeds > 1 ? 's' : ''}</p>}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setStep('significar')}
              className="w-full py-3.5 rounded-xl text-sm font-medium bg-accent text-white">
              significar
            </button>
            <button onClick={() => navigate('/')}
              className="w-full text-center text-xs text-text-muted py-3">
              ainda não — o acumulado espera
            </button>
          </motion.div>
        )}

        {step === 'significar' && available && (
          <motion.div key="significar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col" style={{ minHeight: 'calc(100dvh - 200px)' }}>
            <div className="pt-4 mb-3">
              <h1 className="text-lg font-medium text-text-heading">o que {available.rung.label} significou?</h1>
              <p className="text-xs text-text-muted mt-0.5">padrões, não julgamentos. o que cresceu, o que pediu.</p>
            </div>
            <textarea value={meaning} onChange={(e) => setMeaning(e.target.value)} autoFocus
              placeholder="..."
              className="flex-1 w-full bg-transparent text-[15px] leading-relaxed text-text outline-none resize-none placeholder:text-text-muted" />
            <div className="flex gap-3 pt-4">
              <button onClick={seal} disabled={!meaning.trim() || sealing}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-accent text-white disabled:opacity-30">
                {sealing ? 'selando…' : 'selar ○'}
              </button>
              <button onClick={() => setStep('ler')}
                className="px-5 py-3.5 rounded-xl text-sm text-text-muted border border-border">
                voltar
              </button>
            </div>
          </motion.div>
        )}

        {step === 'selado' && (
          <motion.div key="selado" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16">
            <div className="text-4xl text-accent mb-4">○</div>
            <h2 className="text-lg font-medium text-text-heading mb-1">selado</h2>
            <p className="text-xs text-text-muted">a espiral subiu um degrau. o meaning acumula.</p>
            <button onClick={() => navigate('/')} className="mt-8 text-sm text-accent font-medium">voltar ao dia</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
