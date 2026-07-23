// components/home/AuroraRitual.tsx — a porta do dia (spec v0.4 · Fase 2)
// Tela-ritual imersiva, nunca formulário: respiração → check-in → journaling
// (página, primeira classe) → chegada com o estado do dia. Tudo pulável —
// a lei: nunca forçar. Sucede o AuroraCheckin (embrião E2).
import { useState, useMemo, useEffect } from 'react';
import { isToday, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useSoulStore } from '@/store/soul-store';
import { useAppStore } from '@/store/app-store';
import { soulService } from '@/service/soul-service';
import { wrapService } from '@/service/wrap-service';
import { getCurrentPeriod } from '@/types/ui';
import type { AtomItem } from '@/types/item';

const ENERGY_OPTIONS: { key: 'high' | 'medium' | 'low'; label: string }[] = [
  { key: 'high', label: 'alta' },
  { key: 'medium', label: 'media' },
  { key: 'low', label: 'baixa' },
];

const BREATH_CYCLES = 3;
const BREATH_HALF_MS = 4000; // inspira 4s · expira 4s

type Step = 'breath' | 'checkin' | 'journal' | 'arrival';

export function AuroraRitual() {
  const { auroraCheckedToday, setAurora, skipAurora } = useSoulStore();
  const user = useAppStore((s) => s.user);
  const period = getCurrentPeriod();
  const { items, isLoading } = useItems();

  const [step, setStep] = useState<Step>('breath');
  const [breathWord, setBreathWord] = useState('inspira');
  const [emotion, setEmotion] = useState('');
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low'>('medium');
  const [intention, setIntention] = useState('');
  const [journal, setJournal] = useState('');
  const [lastWrap, setLastWrap] = useState<AtomItem | null>(null);

  // O tronco é a fonte de verdade: chegada de hoje já em items → não re-pergunta
  const jaChegouNoTronco = useMemo(
    () =>
      (items ?? []).some(
        (i) =>
          i.type === 'checkpoint' &&
          i.tags?.includes('aurora') &&
          isToday(parseISO(i.created_at)),
      ),
    [items],
  );

  // Máquina de abertura: abre UMA vez quando os dados carregam e a chegada
  // de hoje não existe; depois de aberto, só fecha no fim do ritual (ou pular).
  // (setAurora no meio do fluxo não pode derrubar o overlay antes do journaling.)
  const shouldStart = !auroraCheckedToday && !jaChegouNoTronco && period.key !== 'crepusculo';
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!isLoading && shouldStart && !started) {
      setOpen(true);
      setStarted(true);
    }
  }, [isLoading, shouldStart, started]);

  const visible = open;

  const closeRitual = () => setOpen(false);
  const skipAll = () => {
    skipAurora();
    setOpen(false);
  };

  // Respiração: 3 ciclos guiados, depois segue sozinha pro check-in
  useEffect(() => {
    if (!visible || step !== 'breath') return;
    let half = 0;
    const t = setInterval(() => {
      half += 1;
      setBreathWord(half % 2 ? 'expira' : 'inspira');
      if (half >= BREATH_CYCLES * 2) setStep('checkin');
    }, BREATH_HALF_MS);
    return () => clearInterval(t);
  }, [visible, step]);

  // Estado do dia (último wrap) — carrega em silêncio durante o ritual
  useEffect(() => {
    if (!visible) return;
    wrapService.getLastWrap().then(setLastWrap).catch(() => {});
  }, [visible]);

  if (!visible) return null;

  const seeds: string[] = (() => {
    const s = (lastWrap?.body as Record<string, unknown> | null)?.seeds;
    if (!Array.isArray(s)) return [];
    return s
      .filter((x: { status?: string }) => x?.status === 'approved')
      .map((x: { title?: string }) => x?.title ?? '')
      .filter(Boolean)
      .slice(0, 3);
  })();
  const ativos = (items ?? []).filter(
    (i) => i.status !== 'completed' && i.status !== 'archived' && i.state !== 'inbox',
  ).length;
  const inbox = (items ?? []).filter((i) => i.state === 'inbox').length;

  const submitCheckin = () => {
    const e = emotion.trim();
    const i = intention.trim();
    setAurora(e, energy, i); // local primeiro — a rede nunca segura o dia
    if (user) {
      soulService
        .persistAuroraCheckin({ userId: user.id, emotion: e, energy, intention: i })
        .catch(() => {});
    }
    setStep('journal');
  };

  const submitJournal = (save: boolean) => {
    const text = journal.trim();
    if (save && text && user) {
      soulService.persistAuroraJournal({ userId: user.id, text }).catch(() => {});
    }
    setStep('arrival');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-5"
        style={{
          // base sólida por baixo: no dark o aurora-bg-from é rgba translúcido
          // e a página vazava por trás do ritual (achado do E2E visual)
          backgroundColor: 'var(--color-bg)',
          backgroundImage: 'linear-gradient(170deg, var(--color-aurora-bg-from) 0%, var(--color-bg) 62%)',
        }}
      >
        <AnimatePresence mode="wait">
          {step === 'breath' && (
            <motion.div key="breath" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center">
              <div className="aurora-breath mb-6" />
              <p className="text-sm italic text-text-muted min-h-[22px]">{breathWord}…</p>
              <button onClick={() => setStep('checkin')} className="mt-8 text-xs text-text-muted underline underline-offset-4">
                pular
              </button>
            </motion.div>
          )}

          {step === 'checkin' && (
            <motion.div key="checkin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full" style={{ maxWidth: '384px' }}>
              <h2 className="text-xl font-medium text-text-heading text-center mb-1">
                como voce ta chegando hoje?
              </h2>
              <p className="text-xs text-text-muted text-center mb-6">sem julgamento. uma palavra basta.</p>
              <input value={emotion} onChange={(e) => setEmotion(e.target.value)} autoFocus
                placeholder="animado, cansado, ansioso..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent-light mb-4 placeholder:text-text-muted" />
              <span className="text-[11px] text-text-muted tracking-wider uppercase mb-2 block">energia</span>
              <div className="flex gap-2 mb-4">
                {ENERGY_OPTIONS.map((opt) => (
                  <button key={opt.key} onClick={() => setEnergy(opt.key)}
                    className={`flex-1 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all ${
                      energy === opt.key
                        ? 'bg-accent-bg text-accent border border-accent/30'
                        : 'bg-surface text-text-muted border border-border'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <input value={intention} onChange={(e) => setIntention(e.target.value)}
                placeholder="hoje e dia de..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent-light mb-6 placeholder:text-text-muted" />
              <button onClick={submitCheckin} disabled={!emotion.trim()}
                className="w-full py-3.5 rounded-xl text-sm font-medium bg-accent text-white disabled:opacity-30 mb-3">
                continuar
              </button>
              <button onClick={skipAll} className="w-full text-center text-xs text-text-muted py-2">
                pular
              </button>
            </motion.div>
          )}

          {step === 'journal' && (
            <motion.div key="journal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col pt-14 pb-8" style={{ maxWidth: '430px' }}>
              <h2 className="text-lg font-medium text-text-heading mb-1">a pagina esta aberta</h2>
              <p className="text-xs text-text-muted mb-4">escreve o que quiser. ou nada. ninguem le alem de ti.</p>
              <textarea value={journal} onChange={(e) => setJournal(e.target.value)} autoFocus
                placeholder="..."
                className="flex-1 w-full bg-transparent text-[15px] leading-relaxed text-text outline-none resize-none placeholder:text-text-muted" />
              <div className="flex gap-3 pt-4">
                <button onClick={() => submitJournal(true)} disabled={!journal.trim()}
                  className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-accent text-white disabled:opacity-30">
                  guardar
                </button>
                <button onClick={() => submitJournal(false)}
                  className="px-5 py-3.5 rounded-xl text-sm text-text-muted border border-border">
                  hoje nao
                </button>
              </div>
            </motion.div>
          )}

          {step === 'arrival' && (
            <motion.div key="arrival" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full text-center" style={{ maxWidth: '384px' }}>
              <p className="text-lg italic font-medium text-text-heading mb-6">
                {emotion.trim() ? `chegaste ${emotion.trim()}.` : 'chegaste.'}
              </p>
              <div className="text-left bg-card border border-border rounded-xl p-4 mb-3">
                <p className="text-[11px] tracking-wider uppercase text-text-muted mb-2">o dia te espera</p>
                <p className="text-sm text-text">{ativos} items ativos · {inbox} no inbox</p>
                {intention.trim() && (
                  <p className="text-sm text-text-muted mt-1.5 italic">foco: {intention.trim()}</p>
                )}
              </div>
              {lastWrap && (
                <div className="text-left bg-card border border-border rounded-xl p-4 mb-6">
                  <p className="text-[11px] tracking-wider uppercase text-text-muted mb-2">
                    do ultimo wrap · {format(parseISO(lastWrap.created_at), "d 'de' MMM", { locale: ptBR })}
                  </p>
                  {seeds.length > 0 ? (
                    seeds.map((s) => <p key={s} className="text-sm text-text py-0.5">🌱 {s}</p>)
                  ) : (
                    <p className="text-sm text-text-muted">ciclo fechado, sem seeds pendentes</p>
                  )}
                </div>
              )}
              <button onClick={closeRitual}
                className="w-full py-3.5 rounded-xl text-sm font-medium bg-accent text-white">
                comecar o dia
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
