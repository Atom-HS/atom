// pages/Wrap.tsx — o rito de fechar o dia (obra 4 · 06_paginas-internas_mapa)
// Wireframe: docs/onda-3/07_paginas-internas_wireframe.html
// 7 passos = 7 estágios (D44): as geometrias caminham em dourado no topo —
// estado, não barra. O % de "saúde" morreu (D46: número é estado, nunca
// julgamento). A e_line entra pelo portão admitELine (Lei do Tom §4.4:
// 0-ou-1, nunca repetida) — a voz é do E., o portão é da casa.

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWrap } from '@/hooks/useWrap';
import { useItems } from '@/hooks/useItems';
import { useFullAudit } from '@/hooks/useAudit';
import { useNav } from '@/hooks/useNav';
import { getCreatedToday, getModifiedToday, computeAudit, admitELine, pastELines } from '@/engine/wrap';
import { detectShift } from '@/engine/soul';
import { soulService } from '@/service/soul-service';
import { StageBadge } from '@/components/atoms/StageBadge';
import { EMOTIONS } from '@/types/item';
import type { Emotion, EnergyLevel, AtomItem, AtomRelation } from '@/types/item';
import { toast } from '@/store/toast-store';
import { usePipeline } from '@/hooks/usePipeline';
import { getTypeColor } from '@/components/atoms/tokens';

const STEPS = [
  { geo: '·', name: 'alma', label: '' },
  { geo: '—', name: 'o dia', label: '' },
  { geo: '△', name: 'decidido', label: '' },
  { geo: '□', name: 'a teia', label: '' },
  { geo: '⬠', name: 'sementes', label: 'opcional' },
  { geo: '⬡', name: 'audit', label: 'auto' },
  { geo: '○', name: 'selar', label: '' },
];

export function WrapPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmCommit, setConfirmCommit] = useState(false);
  const { items } = useItems();
  const { startWrap, session, updateSession, commitWrap, loading } = useWrap();
  const { capture } = usePipeline();
  const { navigate } = useNav();

  // Local state for soul step
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  // Fase 3: journaling de fechamento (página, primeira classe — spec §2.2)
  const [journal, setJournal] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [newDecision, setNewDecision] = useState('');
  const [nextSteps, setNextSteps] = useState<string[]>(['']);

  const created = useMemo(() => getCreatedToday(items), [items]);
  const modified = useMemo(() => getModifiedToday(items), [items]);
  // Fase 3: o soul log do dia ganha casa no crepúsculo (checkpoints de hoje)
  const todaySoul = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return (items ?? [])
      .filter((i) => i.type === 'checkpoint' && new Date(i.created_at) >= start)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }, [items]);

  const saveJournal = async () => {
    const text = journal.trim();
    if (!text || journalSaved) return;
    try {
      const { data } = await import('@/service/supabase').then((m) => m.supabase.auth.getUser());
      const uid = data.user?.id;
      if (!uid) return;
      await soulService.persistJournal({ userId: uid, text, slot: 'crepusculo' });
      setJournalSaved(true);
    } catch {
      /* rede não segura o ritual */
    }
  };
  const audit = useMemo(() => computeAudit(items), [items]);
  const { data: fullAudit, isLoading: auditLoading } = useFullAudit();

  useEffect(() => { startWrap(); }, []);

  const goNext = () => {
    // Auto-flush pending decision input
    if (step === 2 && newDecision.trim()) {
      setDecisions([...decisions, newDecision.trim()]);
      setNewDecision('');
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleCommit();
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleCommit = async () => {
    const validNext = nextSteps.filter(Boolean);
    if (validNext.length === 0) {
      toast.error('falta o que fica pra amanhã — um passo basta');
      return;
    }
    if (session) {
      const crepusculo = { emotion: (selectedEmotions[0] ?? 'neutro') as Emotion, energy };
      const auroraEmotion = session.soul.aurora?.emotion ?? null;
      const shift = detectShift(auroraEmotion, crepusculo.emotion);

      updateSession({
        soul: {
          ...session.soul,
          crepusculo,
          shift: shift !== 'unknown' ? shift : null,
        },
        decided: decisions,
        next: validNext,
      });
    }
    await commitWrap();

    // Create inbox items from next steps
    for (const step of validNext) {
      try {
        await capture(step);
      } catch { /* non-blocking */ }
    }

    setDone(true);
  };

  // a e_line passa pelo portão: 0-ou-1, nunca repetida (Lei do Tom §4.4)
  const eLine = admitELine(session?.e_line ?? null, pastELines(items));

  if (done) {
    return (
      <div className="px-5 text-center py-16">
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="text-xl text-text mb-1.5">o dia está selado</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {new Date().toLocaleDateString('pt-BR')} · crepúsculo
        </p>
        {eLine && (
          <p className="font-mono text-[11px] text-gold-dim mt-6 max-w-[280px] mx-auto">
            {eLine}
            <span className="block mt-1 tracking-[0.12em]">— E.</span>
          </p>
        )}
        <button
          onClick={() => navigate('home')}
          className="mt-8 text-[15px] text-gold"
        >
          boa noite ○
        </button>
      </div>
    );
  }

  const s = STEPS[step];

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Top */}
      <div className="px-5 pt-4 pb-3 border-b border-border-soft flex justify-between items-end">
        <div>
          <h1 className="text-lg text-text">○ fechar o dia</h1>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mt-0.5">
            crepúsculo · {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </p>
        </div>
        <span className="font-mono text-[11px] text-text-faint">passo {step + 1} de 7</span>
      </div>

      {/* as geometrias caminham — estado, não barra (D44/D46) */}
      <div className="flex justify-center gap-4 px-5 py-3 font-mono text-[14px]">
        {STEPS.map((st, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`transition-all leading-none ${
              i === step ? 'text-gold scale-125' : i < step ? 'text-gold-dim' : 'text-text-faint opacity-40'
            }`}
            aria-label={st.name}
            aria-current={i === step ? 'step' : undefined}
          >
            {st.geo}
          </button>
        ))}
      </div>

      {/* Step header */}
      <div className="px-5 pb-2 flex items-baseline gap-2">
        <span className="font-mono text-[13px] text-gold">{s.geo}</span>
        <span className="text-[15px] text-text">{s.name}</span>
        {s.label && <span className="font-mono text-[10px] text-text-faint ml-auto">{s.label}</span>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {step === 0 && <SoulStep emotions={selectedEmotions} setEmotions={setSelectedEmotions} energy={energy} setEnergy={setEnergy} aurora={session?.soul.aurora ?? null} intention={session?.soul.intention ?? null} todaySoul={todaySoul} journal={journal} setJournal={setJournal} journalSaved={journalSaved} onSaveJournal={saveJournal} />}
            {step === 1 && <ItemsStep created={created} modified={modified} />}
            {step === 2 && <DecidedStep decisions={decisions} setDecisions={setDecisions} newDecision={newDecision} setNewDecision={setNewDecision} />}
            {step === 3 && <ConnectionsStep items={items} createdToday={created} modifiedToday={modified} />}
            {step === 4 && <SeedsStep />}
            {step === 5 && <AuditStep audit={audit} fullAudit={fullAudit ?? null} auditLoading={auditLoading} />}
            {step === 6 && <CommitStep created={created} modified={modified} decisions={decisions} audit={audit} nextSteps={nextSteps} setNextSteps={setNextSteps} aurora={session?.soul.aurora ?? null} crepusculo={{ emotion: (selectedEmotions[0] ?? 'neutro') as Emotion, energy }} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-5 py-2.5 border-t border-border-soft">
        {step === STEPS.length - 1 && confirmCommit ? (
          <div className="bg-gold-bg border rounded-xl p-4 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>
            <p className="text-sm text-gold mb-2">selar este dia? depois de selado, não se edita</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmCommit(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-text-muted">
                voltar
              </button>
              <button onClick={handleCommit} disabled={loading} className="flex-1 py-2.5 rounded-xl text-gold bg-gold-bg text-sm font-medium disabled:opacity-50" style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 40%, var(--color-border))' }}>
                {loading ? 'selando…' : 'selar ○'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <button onClick={goBack} className={`font-mono text-[11px] text-gold-dim ${step === 0 ? 'invisible' : ''}`}>
              ← voltar
            </button>
            <button
              onClick={step === STEPS.length - 1 ? () => setConfirmCommit(true) : goNext}
              disabled={loading}
              className="rounded-xl px-7 py-3 text-sm text-gold bg-gold-bg disabled:opacity-50"
              style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
            >
              {step === STEPS.length - 1 ? 'selar ○' : `seguir → ${STEPS[step + 1].geo}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────

function SoulStep({ emotions, setEmotions, energy, setEnergy, aurora, intention, todaySoul, journal, setJournal, journalSaved, onSaveJournal }: {
  emotions: string[]; setEmotions: (e: string[]) => void;
  energy: EnergyLevel; setEnergy: (e: EnergyLevel) => void;
  aurora: { emotion: Emotion; energy: EnergyLevel } | null;
  intention: string | null;
  todaySoul: AtomItem[];
  journal: string; setJournal: (t: string) => void;
  journalSaved: boolean; onSaveJournal: () => void;
}) {
  const toggleEmotion = (e: string) => {
    setEmotions(emotions.includes(e) ? emotions.filter((x) => x !== e) : [...emotions, e]);
  };

  // Fase 3: o shift do dia, visível (chegaste X → sais Y)
  const exit = (emotions[0] ?? null) as Emotion | null;
  const shift = aurora && exit ? detectShift(aurora.emotion, exit) : null;
  const shiftWord =
    shift === 'positive' ? 'o dia subiu' :
    shift === 'negative' ? 'o dia pesou' :
    shift === 'stable' ? 'chegaste e sais inteiro' : null;

  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      {aurora && (
        <div className="mb-3 pb-3 border-b border-border-soft">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1">aurora</div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-bg text-gold text-xs">{aurora.emotion}</span>
            <span className="text-text-muted text-xs">· {aurora.energy}</span>
          </div>
          {intention && (
            <p className="text-xs text-text-muted mt-1 italic">"{intention}"</p>
          )}
        </div>
      )}
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">como você está saindo hoje?</div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {EMOTIONS.map((e) => (
          <button
            key={e}
            onClick={() => toggleEmotion(e)}
            className={`px-3 py-1 rounded-2xl border text-xs transition-all ${
              emotions.includes(e) ? 'text-gold bg-gold-bg' : 'border-border bg-card text-text-muted'
            }`}
            style={emotions.includes(e) ? { borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' } : undefined}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-text-muted w-12">energia</span>
        {(['high', 'medium', 'low'] as EnergyLevel[]).map((e) => (
          <button
            key={e}
            onClick={() => setEnergy(e)}
            className={`px-3 py-1 rounded-xl border text-xs transition-all ${
              energy === e ? 'text-gold bg-gold-bg' : 'border-border bg-card'
            }`}
            style={energy === e ? { borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' } : undefined}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Fase 3 · o shift, visível — nomeia, não julga */}
      {shift && aurora && exit && (
        <div className="mt-3 pt-3 border-t border-border-soft text-center">
          <p className="text-sm text-text">
            <span className="text-gold">{aurora.emotion}</span>
            <span className="text-text-muted mx-2">→</span>
            <span className="text-gold">{exit}</span>
          </p>
          {shiftWord && <p className="text-xs text-text-muted italic mt-0.5">{shiftWord}</p>}
        </div>
      )}

      {/* Fase 3 · o soul log do dia — casa própria no crepúsculo */}
      {todaySoul.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-soft">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5">o dia escreveu</div>
          {todaySoul.map((i) => (
            <div key={i.id} className="flex gap-2 py-0.5 text-xs text-text-muted">
              <span className="font-mono text-gold-dim">
                {new Date(i.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>{i.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fase 3 · journaling de fechamento — página, primeira classe */}
      <div className="mt-3 pt-3 border-t border-border-soft">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5">fechar escrevendo · opcional</div>
        {journalSaved ? (
          <p className="text-xs text-text-muted italic py-1">guardado. o dia está escrito.</p>
        ) : (
          <>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="o que este dia deixou em você…"
              rows={4}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none resize-none placeholder:text-text-faint"
            />
            {journal.trim() && (
              <button
                onClick={onSaveJournal}
                className="mt-2 px-4 py-2 rounded-xl text-gold bg-gold-bg text-xs"
                style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
              >
                guardar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ItemsStep({ created, modified }: { created: any[]; modified: any[] }) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint pb-1.5 border-b border-border-soft mb-1">o que nasceu</div>
      {created.length === 0 ? (
        <p className="text-xs text-text-muted py-2">nada nasceu hoje</p>
      ) : (
        created.map((item) => <WrapItemRow key={item.id} item={item} />)
      )}
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint pb-1.5 border-b border-border-soft mb-1 mt-3">o que se moveu</div>
      {modified.length === 0 ? (
        <p className="text-xs text-text-muted py-2">nada se moveu hoje</p>
      ) : (
        modified.map((item) => <WrapItemRow key={item.id} item={item} />)
      )}
    </div>
  );
}

function WrapItemRow({ item }: { item: any }) {
  return (
    <div className="py-2 border-b border-surface last:border-0 flex items-center gap-2.5">
      <span className="text-xs w-[18px] text-center">{item.genesis_stage <= 7 ? ['·', '—', '△', '□', '⬠', '⬡', '○'][item.genesis_stage - 1] : '·'}</span>
      <span className="text-[13px] flex-1 truncate">{item.title}</span>
      {item.type && (
        <span className="text-[9px] font-medium px-1.5 py-px rounded-lg bg-surface text-text-muted">{item.type}</span>
      )}
    </div>
  );
}

function DecidedStep({ decisions, setDecisions, newDecision, setNewDecision }: {
  decisions: string[]; setDecisions: (d: string[]) => void;
  newDecision: string; setNewDecision: (d: string) => void;
}) {
  const addDecision = () => {
    if (newDecision.trim()) {
      setDecisions([...decisions, newDecision.trim()]);
      setNewDecision('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">△ o que se decidiu</div>
      {decisions.map((d, i) => (
        <div key={i} className="py-2 border-b border-border-soft last:border-0 flex items-center gap-2.5">
          <span className="font-mono text-gold text-[13px] w-[18px] text-center shrink-0">△</span>
          <span className="text-[13px]">"{d}"</span>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border border-border rounded-lg px-3 py-2 text-[13px] bg-card text-text outline-none"
          placeholder="+ o que se decidiu hoje…"
          value={newDecision}
          onChange={(e) => setNewDecision(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDecision()}
        />
        {newDecision.trim() && (
          <button onClick={addDecision} className="px-3 py-2 text-gold bg-gold-bg rounded-lg text-sm shrink-0" style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>
            +
          </button>
        )}
      </div>
    </div>
  );
}

function ConnectionsStep({ items, createdToday, modifiedToday }: {
  items: AtomItem[]; createdToday: AtomItem[]; modifiedToday: AtomItem[];
}) {
  const { connect } = usePipeline();
  const [connectingItem, setConnectingItem] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const todayItems = useMemo(() => {
    const ids = new Set([...createdToday.map((i) => i.id), ...modifiedToday.map((i) => i.id)]);
    return items.filter((i) => ids.has(i.id));
  }, [items, createdToday, modifiedToday]);

  const handleConnect = async (sourceId: string, targetId: string, relation: AtomRelation) => {
    const result = await connect(sourceId, targetId, relation);
    if (result) {
      setAdded((prev) => new Set(prev).add(sourceId));
      setConnectingItem(null);
    }
  };

  if (todayItems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[14px] p-4">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">a teia</div>
        <p className="text-xs text-text-muted py-4 text-center">nada nasceu nem se moveu hoje</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">
        a teia
        {added.size > 0 && (
          <span className="ml-1.5 text-[10px] px-1.5 py-px rounded-md bg-success-bg text-success-text">+{added.size}</span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-3">algo de hoje se conecta com algo?</p>
      <div className="space-y-1.5">
        {todayItems.map((item) => {
          const isConnecting = connectingItem === item.id;
          const wasConnected = added.has(item.id);
          const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';
          return (
            <div key={item.id}>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex-1 truncate">{item.title}</span>
                {item.type && (
                  <span className="text-[9px] px-1.5 py-px rounded" style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}>{item.type}</span>
                )}
                {wasConnected ? (
                  <span className="text-[10px] text-success-text">✓</span>
                ) : (
                  <button onClick={() => setConnectingItem(isConnecting ? null : item.id)} className="font-mono text-[10px] text-gold-dim shrink-0">
                    {isConnecting ? 'deixa' : 'tecer'}
                  </button>
                )}
              </div>
              {isConnecting && (
                <WrapConnectionPicker items={items} sourceId={item.id}
                  onSelect={(tid, rel) => handleConnect(item.id, tid, rel)}
                  onCancel={() => setConnectingItem(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WrapConnectionPicker({ items, sourceId, onSelect, onCancel }: {
  items: AtomItem[]; sourceId: string;
  onSelect: (targetId: string, relation: AtomRelation) => void; onCancel: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [relation, setRelation] = useState<AtomRelation>('references');

  const RELATIONS: { key: AtomRelation; label: string }[] = [
    { key: 'belongs_to', label: 'pertence a' },
    { key: 'references', label: 'referencia' },
    { key: 'feeds', label: 'alimenta' },
    { key: 'blocks', label: 'bloqueia' },
    { key: 'derives', label: 'deriva de' },
    { key: 'mirrors', label: 'espelha' },
  ];

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return items.filter((i) => i.id !== sourceId && i.title.toLowerCase().includes(q)).slice(0, 5);
  }, [items, search, sourceId]);

  const target = selectedTarget ? items.find((i) => i.id === selectedTarget) : null;

  return (
    <div className="bg-surface rounded-lg p-2.5 mt-1.5 mb-2">
      {!selectedTarget ? (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus placeholder="buscar…"
            className="w-full text-[12px] bg-card border border-border rounded-lg px-2.5 py-1.5 outline-none mb-1.5" />
          {filtered.map((item) => (
            <button key={item.id} onClick={() => { setSelectedTarget(item.id); setSearch(''); }}
              className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-card rounded transition-colors truncate">
              {item.title}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="text-[11px] text-text-muted mb-2">→ <span className="font-medium text-text">{target?.title}</span></div>
          <div className="flex flex-wrap gap-1 mb-2">
            {RELATIONS.map((r) => (
              <button key={r.key} onClick={() => setRelation(r.key)}
                className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${relation === r.key ? 'text-gold bg-gold-bg' : 'border-border text-text-muted'}`}
                style={relation === r.key ? { borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' } : undefined}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button onClick={onCancel} className="flex-1 py-1.5 text-[10px] border border-border rounded-lg text-text-muted">deixa</button>
            <button onClick={() => onSelect(selectedTarget!, relation)} className="flex-1 py-1.5 text-[10px] text-gold bg-gold-bg rounded-lg" style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>tecer</button>
          </div>
        </>
      )}
    </div>
  );
}

function SeedsStep() {
  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">⬠ sementes</div>
      <p className="text-xs text-text-muted py-4 text-center">o que dorme será encontrado na Fase 5</p>
    </div>
  );
}

function AuditStep({ audit, fullAudit, auditLoading }: {
  audit: any;
  fullAudit: import('@/service/audit-service').AuditReport | null;
  auditLoading: boolean;
}) {
  // Prefer real Supabase data, fall back to local computeAudit counts
  const inboxCount = fullAudit?.inbox_count ?? audit.inbox_count;
  const belowFloor = fullAudit?.below_floor ?? [];
  const orphans = fullAudit?.orphans ?? [];
  const stale = fullAudit?.stale ?? [];

  return (
    <div className="bg-card border border-border rounded-[14px] p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">⬡ a casa por dentro</div>
      {auditLoading && (
        <div className="space-y-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-surface rounded animate-pulse" />
          ))}
        </div>
      )}
      {!auditLoading && (
        <>
          <AuditRow label="inbox" value={inboxCount} ok={inboxCount === 0} />
          <AuditRow
            label="abaixo do piso"
            value={belowFloor.length}
            ok={belowFloor.length === 0}
            detail={belowFloor.map((i) => (
              <div key={i.id} className="flex items-center gap-1.5 text-[11px] text-text-muted py-0.5">
                <span className="truncate flex-1">{i.title}</span>
                <StageBadge stage={i.genesis_stage} />
                <span>→</span>
                <StageBadge stage={i.required_floor} />
              </div>
            ))}
          />
          <AuditRow label="orfaos" value={orphans.length} ok={orphans.length === 0} />
          <AuditRow
            label="stale"
            value={stale.length}
            ok={stale.length === 0}
            detail={stale.map((i) => (
              <div key={i.id} className="flex items-center gap-1.5 text-[11px] text-text-muted py-0.5">
                <span className="truncate flex-1">{i.title}</span>
                <span className="text-[10px] font-medium px-1 rounded bg-error-bg text-error-text">{i.days_in_inbox}d</span>
              </div>
            ))}
          />
        </>
      )}
    </div>
  );
}

function AuditRow({ label, value, ok, detail }: { label: string; value: number; ok: boolean; detail?: React.ReactNode }) {
  return (
    <div className="border-b border-surface last:border-0">
      <div className="flex justify-between py-1.5 text-[13px]">
        <span>{label}</span>
        <span className={`font-medium ${ok ? 'text-success-text' : 'text-warning'}`}>
          {value} {ok ? '✓' : '!'}
        </span>
      </div>
      {!ok && detail && <div className="pb-1.5">{detail}</div>}
    </div>
  );
}

const SHIFT_LABELS: Record<string, string> = {
  positive: 'positivo',
  negative: 'negativo',
  stable: 'estavel',
};

function CommitStep({ created, modified, decisions, audit, nextSteps, setNextSteps, aurora, crepusculo }: {
  created: any[]; modified: any[]; decisions: string[]; audit: any;
  nextSteps: string[]; setNextSteps: (s: string[]) => void;
  aurora: { emotion: Emotion; energy: EnergyLevel } | null;
  crepusculo: { emotion: Emotion; energy: EnergyLevel };
}) {
  const shift = aurora ? detectShift(aurora.emotion, crepusculo.emotion) : 'unknown';
  const updateStep = (i: number, val: string) => {
    const copy = [...nextSteps];
    copy[i] = val;
    setNextSteps(copy);
  };
  const addStep = () => setNextSteps([...nextSteps, '']);

  // D46: número é estado — "2 no inbox", nunca "92% de saúde"
  const quieto = audit.inbox_count === 0 && audit.below_floor === 0;

  return (
    <>
      <div className="bg-gold-bg border rounded-[14px] p-6 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 25%, var(--color-border-soft))' }}>
        <div className="font-mono text-[13px] text-gold tracking-[0.3em] mb-4">
          · — △ □ ⬠ ⬡ ○
        </div>
        <h2 className="text-xl text-text mb-1.5">o dia, inteiro</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {created.length + modified.length === 0
            ? 'um dia quieto'
            : `${created.length} ${created.length === 1 ? 'nasceu' : 'nasceram'} · ${modified.length} se ${modified.length === 1 ? 'moveu' : 'moveram'}`}
          {decisions.length > 0 && ` · ${decisions.length} ${decisions.length === 1 ? 'decisão' : 'decisões'}`}
        </p>
        <p className="font-mono text-[11px] text-text-muted mt-3">
          {quieto
            ? 'a casa está quieta'
            : [
                audit.inbox_count > 0 ? `${audit.inbox_count} no inbox` : null,
                audit.below_floor > 0 ? `${audit.below_floor} abaixo do piso` : null,
              ].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Soul summary */}
      {(aurora || crepusculo.emotion !== 'neutro') && (
        <div className="bg-card border border-border rounded-[14px] p-4 mt-4">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">alma</div>
          <div className="flex items-center gap-2 text-xs">
            {aurora && (
              <>
                <span className="px-2 py-0.5 rounded-full bg-gold-bg text-gold">{aurora.emotion}</span>
                <span className="text-text-muted">→</span>
              </>
            )}
            <span className="px-2 py-0.5 rounded-full bg-gold-bg text-gold">{crepusculo.emotion}</span>
            {shift !== 'unknown' && (
              <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full ${
                shift === 'positive' ? 'bg-success-bg text-success-text' :
                shift === 'negative' ? 'bg-error-bg text-error-text' :
                'bg-surface text-text-muted'
              }`}>
                {SHIFT_LABELS[shift]}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-2">o que fica pra amanhã</div>
        {nextSteps.map((s, i) => (
          <input
            key={i}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-[13px] bg-card text-text outline-none mb-1.5"
            value={s}
            onChange={(e) => updateStep(i, e.target.value)}
            placeholder="+ um passo…"
          />
        ))}
        <button onClick={addStep} className="font-mono text-[11px] text-gold-dim mt-1">+ mais um</button>
      </div>
    </>
  );
}
