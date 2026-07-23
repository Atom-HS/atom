// calendar/RoutineChain.tsx — a cadeia viva no bloco do ritual (Fase 6 · D2)
// Elos em ordem; toca pra completar; o próximo elo aberto pulsa; cadeia
// fechada = rotina selada ○. Completion é "executei a sequência", não checkbox.
import { useMemo } from 'react';
import type { AtomItem } from '@/types/item';
import { chainProgress } from '@/engine/routine';
import { useRoutineActions } from '@/hooks/useRoutine';

export function RoutineChain({ routine, items }: { routine: AtomItem; items: AtomItem[] }) {
  const { toggleLink } = useRoutineActions();
  const progress = useMemo(() => chainProgress(routine, items), [routine, items]);

  if (progress.total === 0) return null;
  const { links, done, total, complete, next } = progress;

  return (
    <div className={`rounded-lg border p-2 px-2.5 mb-[3px] text-[13px] ${
      complete ? 'bg-success-bg/40 border-success-text/20' : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px]">{complete ? '○' : '⛓'}</span>
        <span className="flex-1 truncate font-medium">{routine.title}</span>
        <span className="text-[10px] text-text-muted">
          {complete ? 'cadeia fechada' : `${done}/${total}`}
        </span>
      </div>
      <div className="space-y-px">
        {links.map((link, i) => {
          const isNext = next?.id === link.item.id;
          return (
            <button
              key={link.item.id}
              onClick={() => toggleLink.mutate({ routine, link, items })}
              disabled={toggleLink.isPending}
              className={`w-full flex items-center gap-2 px-1.5 py-1 rounded-md text-left transition-colors ${
                isNext ? 'bg-accent-light/8' : 'hover:bg-surface/60'
              } disabled:opacity-50`}
            >
              <span className={`w-[16px] h-[16px] rounded-full border inline-flex items-center justify-center text-[9px] shrink-0 ${
                link.done
                  ? 'bg-success-text/80 border-success-text/80 text-white'
                  : isNext
                    ? 'border-accent text-accent'
                    : 'border-border text-text-muted'
              }`}>
                {link.done ? '✓' : i + 1}
              </span>
              <span className={`flex-1 truncate ${link.done ? 'text-text-muted line-through decoration-border' : ''}`}>
                {link.item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
