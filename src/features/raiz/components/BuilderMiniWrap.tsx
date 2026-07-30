// features/raiz/components/BuilderMiniWrap.tsx — o assentimento (D64)
// Revisão + nascimento: tudo nasce no inbox (estágio 1). Os elos nascem
// primeiro; a cadeia nasce depois com os ids reais; o protocolo dorme.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '../builder-store';
import { protocolToPayload, routineToPayload, toSupabasePayload } from '../builder-mapper';
import { itemService } from '@/service/item-service';
import { useAppStore } from '@/store/app-store';
import { getTypeColor } from '@/components/atoms/tokens';
import type { AtomType } from '@/types/item';
import type { BuilderGeneratedItem, BuilderProtocol, BuilderRoutine } from '../builder-types';

// D69 — a heurística nunca decide quieta: a leitura do mapper é sugestão
// visível e trocável (mesma gramática do chip da triage)
const TYPE_OPTIONS: AtomType[] = ['task', 'habit', 'ritual', 'note'];

const SLOT_LABELS: Record<string, string> = {
  aurora: 'Aurora', zenite: 'Zênite', crepusculo: 'Crepúsculo',
};

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export function BuilderMiniWrap({ onDone, onBack }: Props) {
  const generatedItems = useBuilderStore((s) => s.generatedItems);
  const generatedRoutines = useBuilderStore((s) => s.generatedRoutines);
  const generatedProtocols = useBuilderStore((s) => s.generatedProtocols);
  const mindmateMode = useBuilderStore((s) => s.mindmateMode);
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const totalCount = generatedItems.length + generatedRoutines.length + generatedProtocols.length;

  const handleCommit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Os elos nascem primeiro — a cadeia precisa dos ids reais
      const realIds = new Map<string, string>();
      for (const item of generatedItems) {
        const created = await itemService.create(toSupabasePayload(item, user.id));
        if (created?.id) realIds.set(item.tempId, created.id);
      }
      for (const routine of generatedRoutines) {
        const chainIds = routine.eloTempIds
          .map((t) => realIds.get(t))
          .filter((id): id is string => !!id);
        if (chainIds.length >= 2) {
          await itemService.create(routineToPayload(routine, chainIds, user.id));
        }
      }
      for (const protocol of generatedProtocols) {
        await itemService.create(protocolToPayload(protocol, user.id));
      }
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (err) {
      console.error('Builder commit failed:', err);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
          <span className="text-text-heading">✓</span>
        </div>
        <p className="text-base font-medium text-text-heading">nasceu — está no inbox</p>
        {mindmateMode && (
          <p className="text-xs text-text-muted italic">✦ onde tudo começou.</p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-text-muted hover:text-text">
          <span className="text-sm">←</span>
        </button>
        <div>
          <h2 className="text-base font-medium text-text-heading">o que a conversa pariu</h2>
          <p className="text-xs text-text-muted">
            {totalCount} {totalCount === 1 ? 'coisa nasce' : 'coisas nascem'} no inbox — você dá corpo quando quiser
          </p>
        </div>
      </div>

      {/* As estruturas primeiro — cadeia e protocolo são o porquê da conversa */}
      <div className="space-y-2 mb-8">
        {generatedRoutines.map((routine) => (
          <motion.div key={routine.tempId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
            <RoutineCard routine={routine} eloCount={routine.eloTempIds.length} />
          </motion.div>
        ))}
        {generatedProtocols.map((protocol) => (
          <motion.div key={protocol.tempId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
            <ProtocolCard protocol={protocol} />
          </motion.div>
        ))}
        {generatedItems.map((item, i) => (
          <motion.div key={item.tempId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* O assentimento */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleCommit}
        disabled={loading || totalCount === 0}
        className="w-full py-4 rounded-2xl text-sm font-medium bg-gold-bg border border-gold-dim/40 text-gold disabled:opacity-40">
        {loading ? 'nascendo…' : 'que nasçam ·'}
      </motion.button>

      {mindmateMode && (
        <p className="text-center text-xs text-text-muted mt-4 italic">✦ MindMate spirit — onde tudo começou.</p>
      )}
    </div>
  );
}

function RoutineCard({ routine, eloCount }: { routine: BuilderRoutine; eloCount: number }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-gold-dim/30">
      <span className="text-gold text-sm mt-0.5">⛓</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{routine.title}</p>
        <p className="text-xs text-text-muted mt-0.5">
          cadeia · {eloCount} elos{routine.slot ? ` · ${SLOT_LABELS[routine.slot] ?? routine.slot}` : ''}
        </p>
      </div>
    </div>
  );
}

function ProtocolCard({ protocol }: { protocol: BuilderProtocol }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-gold-dim/30">
      <span className="text-gold text-sm mt-0.5">◈</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{protocol.title}</p>
        <p className="text-xs text-text-muted mt-0.5">
          protocolo · {protocol.steps.length} {protocol.steps.length === 1 ? 'passo' : 'passos'} · dorme até você precisar
        </p>
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: BuilderGeneratedItem }) {
  const setItemType = useBuilderStore((s) => s.setItemType);
  const slotLabel = item.ritualSlot ? SLOT_LABELS[item.ritualSlot] : null;

  return (
    <div className="p-3.5 rounded-xl bg-surface border border-border">
      <p className="text-sm font-medium text-text truncate">{item.title}</p>
      {/* o tipo é sugestão trocável (D69) — trocar aqui muda o que nasce */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {TYPE_OPTIONS.map((t) => {
          const color = getTypeColor(t);
          const ativo = item.type === t;
          return (
            <button
              key={t}
              onClick={() => setItemType(item.tempId, t)}
              className="text-[11px] font-medium px-2 py-1 rounded-md border transition-colors"
              style={
                ativo
                  ? { background: `${color}18`, color, borderColor: color }
                  : { background: 'transparent', color: 'var(--color-text-faint)', borderColor: 'var(--color-border)' }
              }
            >
              {ativo ? '● ' : '○ '}{t}
            </button>
          );
        })}
        {slotLabel && <span className="text-[11px] text-text-muted ml-0.5">{slotLabel}</span>}
      </div>
    </div>
  );
}
