// pages/Pipeline.tsx — Pipeline + Triage page
// Wireframe: mindroot-wireframe-triage-pipeline-v2.html
// Two tabs: Pipeline (funnel + stage rows) and Triage (swipe cards)

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { GENESIS_STAGES } from '@/types/item';
import type { AtomItem } from '@/types/item';
import { STAGE_COLORS, MODULE_COLORS } from '@/components/atoms/tokens';
import { getTypeColor } from '@/components/atoms/tokens';
import { getBelowFloor } from '@/engine/fsm';
// o gesto mora em components/triage — esta tela é só uma das portas dele,
// e é a que morre no gate (D48)
import { Assentimento } from '@/components/triage/Assentimento';

type Tab = 'pipeline' | 'triage';

export function PipelinePage() {
  const [tab, setTab] = useState<Tab>('pipeline');

  return (
    <div className="px-5 pb-4">
      {/* Header */}
      <div className="pt-4 pb-4">
        <h1 className="text-[24px] font-medium tracking-tight text-text-heading">Pipeline</h1>
        <div className="text-[13px] text-text-muted mt-0.5">7 estagios · Genesis v5</div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-surface rounded-lg p-[3px] mb-4">
        <TabButton active={tab === 'pipeline'} onClick={() => setTab('pipeline')}>Pipeline</TabButton>
        <TabButton active={tab === 'triage'} onClick={() => setTab('triage')}>Triage</TabButton>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'pipeline' ? (
          <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PipelineView />
          </motion.div>
        ) : (
          <motion.div key="triage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Assentimento />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-center py-2 text-[13px] rounded-lg transition-all ${
        active ? 'bg-card font-medium text-text-heading shadow-sm' : 'text-text-muted'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Pipeline View ─────────────────────────────────────

function PipelineView() {
  const { items } = useItems();
  const [expanded, setExpanded] = useState<number | null>(null);

  const activeItems = useMemo(
    () => items.filter((i) => i.status !== 'completed' && i.status !== 'archived'),
    [items],
  );

  const byStage = useMemo(() => {
    const grouped: Record<number, AtomItem[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    activeItems.forEach((i) => {
      if (grouped[i.genesis_stage]) grouped[i.genesis_stage].push(i);
    });
    return grouped;
  }, [activeItems]);

  const belowFloor = useMemo(() => getBelowFloor(activeItems), [activeItems]);
  const maxCount = Math.max(1, ...Object.values(byStage).map((arr) => arr.length));

  return (
    <div>
      {/* Funnel */}
      <div className="flex items-end gap-[3px] h-12 px-1 mb-8">
        {GENESIS_STAGES.map((s) => {
          const count = byStage[s.stage]?.length ?? 0;
          const height = maxCount > 0 ? Math.max(4, (count / maxCount) * 48) : 4;
          return (
            <div key={s.stage} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-text-muted">{count}</span>
              <motion.div
                className="w-full rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ delay: s.stage * 0.06, duration: 0.4, ease: 'easeOut' }}
                style={{ background: STAGE_COLORS[s.stage] }}
              />
              <span className="text-[9px] text-text-muted">{s.geometry}</span>
            </div>
          );
        })}
      </div>

      {/* Below floor banner */}
      {belowFloor.length > 0 && (
        <div className="bg-warning-bg rounded-lg px-3.5 py-2.5 mb-3 flex items-center gap-2 text-xs text-warning-text font-medium">
          <span>⚠</span>
          <span>{belowFloor.length} items abaixo do floor</span>
        </div>
      )}

      {/* Stage rows */}
      <div className="space-y-0.5">
        {GENESIS_STAGES.map((s) => {
          const stageItems = byStage[s.stage] ?? [];
          const isExpanded = expanded === s.stage;

          return (
            <div key={s.stage}>
              <button
                onClick={() => setExpanded(isExpanded ? null : s.stage)}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl hover:bg-surface transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base"
                  style={{ background: STAGE_COLORS[s.stage] }}
                >
                  {s.geometry}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[11px] text-text-muted">{s.label}</div>
                </div>
                <span className={`text-lg font-medium ${stageItems.length === 0 ? 'text-text-muted font-light' : ''}`}>
                  {stageItems.length}
                </span>
              </button>

              {/* Expanded items */}
              <AnimatePresence>
                {isExpanded && stageItems.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-3 pb-2"
                  >
                    {stageItems.map((item) => (
                      <StageItem key={item.id} item={item} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageItem({ item }: { item: AtomItem }) {
  const { selectItem } = useNav();
  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';
  const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';

  return (
    <div onClick={() => selectItem(item.id)} className="flex items-center gap-2 p-2.5 px-3 mt-1 rounded-lg bg-card border border-border text-[13px] cursor-pointer hover:bg-surface transition-colors">
      <div className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: moduleColor }} />
      <span className="flex-1 truncate">{item.title}</span>
      {item.type && (
        <span
          className="text-[10px] font-medium px-2 py-px rounded-md shrink-0"
          style={{ background: `${typeColor}18`, color: typeColor }}
        >
          {item.type}
        </span>
      )}
    </div>
  );
}
