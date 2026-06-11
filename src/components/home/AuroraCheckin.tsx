// components/home/AuroraCheckin.tsx — First-access-of-day check-in
import { useState, useMemo } from 'react';
import { isToday, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useSoulStore } from '@/store/soul-store';
import { useAppStore } from '@/store/app-store';
import { soulService } from '@/service/soul-service';
import { getCurrentPeriod } from '@/types/ui';

const ENERGY_OPTIONS: { key: 'high' | 'medium' | 'low'; label: string }[] = [
  { key: 'high', label: 'alta' },
  { key: 'medium', label: 'media' },
  { key: 'low', label: 'baixa' },
];

export function AuroraCheckin() {
  const { auroraCheckedToday, setAurora, skipAurora } = useSoulStore();
  const user = useAppStore((s) => s.user);
  const period = getCurrentPeriod();
  const { items } = useItems();

  const [emotion, setEmotion] = useState('');
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low'>('medium');
  const [intention, setIntention] = useState('');

  // O tronco é a fonte de verdade: se a chegada de hoje já está em items,
  // não re-pergunta (o Zustand evapora no reload; o banco não)
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

  // Only show before crepusculo and if not checked today
  if (auroraCheckedToday || jaChegouNoTronco || period.key === 'crepusculo') return null;

  const canSubmit = emotion.trim().length > 0;

  const handleSubmit = () => {
    const e = emotion.trim();
    const i = intention.trim();
    // Local primeiro — a UI nunca espera a rede pra deixar o dia começar
    setAurora(e, energy, i);
    if (user) {
      soulService
        .persistAuroraCheckin({ userId: user.id, emotion: e, energy, intention: i })
        .catch(() => {
          // offline/erro: o dia segue; fila de persistência vem na E6 (PWA offline)
        });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-bg flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-xl font-medium text-text-heading text-center mb-1">
            como voce ta chegando hoje?
          </h2>
          <p className="text-xs text-text-muted text-center mb-6">
            sem julgamento. uma palavra basta.
          </p>

          {/* Emotion */}
          <input
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            placeholder="animado, cansado, ansioso..."
            autoFocus
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent-light mb-4 placeholder:text-text-muted"
          />

          {/* Energy */}
          <div className="mb-4">
            <span className="text-[11px] text-text-muted tracking-wider uppercase mb-2 block">energia</span>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setEnergy(opt.key)}
                  className={`flex-1 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all ${
                    energy === opt.key
                      ? 'bg-accent-bg text-accent border border-accent/30'
                      : 'bg-surface text-text-muted border border-border'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intention */}
          <input
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="hoje e dia de..."
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent-light mb-6 placeholder:text-text-muted"
          />

          {/* Actions */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-xl text-sm font-medium bg-accent text-white disabled:opacity-30 mb-3"
          >
            comecar
          </button>
          <button
            onClick={skipAurora}
            className="w-full text-center text-xs text-text-muted py-2"
          >
            pular
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
