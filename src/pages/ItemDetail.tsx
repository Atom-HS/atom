// pages/ItemDetail.tsx — a página da coisa (obra 2 · 06_paginas-internas_mapa)
// Wireframe: docs/onda-3/07_paginas-internas_wireframe.html
// O que morreu: barra de 7 stages (D48 — maturação se vê no galho, não em
// funil), "classificar com AI" roxo (virou leitura do @ com chips de
// assentimento, D52), botão excluir (lei da casa §8.2 — entropy é archive).
// O que rege: D46 (número = estado: "folha de ontem", nunca %), D45 (um
// convite por vez), D57 (dourado só no caminho convidado), Lei do Tom (você).

import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useItems } from '@/hooks/useItems';
import { useItemMutations } from '@/hooks/useItemMutations';
import { usePipeline } from '@/hooks/usePipeline';
import { useTriage } from '@/hooks/useTriage';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { MODULES, EMOTIONS } from '@/types/item';
import type { AtomType, AtomModule, AtomStatus, AtomRelation, AtomItem, Emotion, OperationsExtension, Priority } from '@/types/item';
import { shouldTriggerCheckIn } from '@/engine/soul';
import { BRANCH_LABEL } from '@/engine/tree';
import { toast } from '@/store/toast-store';
import { ALL_TYPES } from '@/config/types';
import { STAGE_GEOMETRIES, MODULE_COLORS, getTypeColor } from '@/components/atoms/tokens';
import { ConnectionsSection } from '@/components/shared/ConnectionsSection';
import { ListChecklist } from '@/components/shared/ListChecklist';
import { getConfidenceBand } from '@/service/triage-service';
import { useConnections } from '@/hooks/useConnections';

const STATUS_OPTIONS: { key: AtomStatus; label: string }[] = [
  { key: 'active', label: 'ativo' },
  { key: 'paused', label: 'pausado' },
  { key: 'waiting', label: 'aguardando' },
  { key: 'someday', label: 'algum dia' },
  { key: 'completed', label: 'concluido' },
];

// o convite de maturação — um por estágio, geometria em vez de número (D48).
// convite, nunca cobrança: "quando quiser", sem prazo, sem %.
// O convite do 5 diz o destino REAL: handleMature sela (○). O estágio 6 não
// tem porta em código (propagate_effect sem caller — auditoria 20 § 2); se um
// dia ganhar, o 5 volta a apontar pro ⬡.
const INVITES: Record<number, { geo: string; label: string }> = {
  2: { geo: '— → △', label: 'dar corpo' },
  3: { geo: '△ → □', label: 'dar forma final' },
  5: { geo: '⬠ → ○', label: 'selar' },
  6: { geo: '⬡ → ○', label: 'selar' },
};

// idade quieta da folha — mesmo vocabulário da ÁRVORE (D46)
function leafAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? 'hoje' : days === 1 ? 'ontem' : `${days}d`;
}

export function ItemDetailPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { items } = useItems();
  const { updateMutation, completeMutation } = useItemMutations();
  const { classify: pipelineClassify, structure, validate, commit: pipelineCommit, morph, connect: pipelineConnect } = usePipeline();
  const { classify: aiClassify, isClassifying, result: triageResult, reset: resetTriage } = useTriage();
  const { connections } = useConnections();
  const storeId = useAppStore((s) => s.selectedItemId);
  const { goBack } = useNav();
  const [checkInPrompt, setCheckInPrompt] = useState<string | null>(null);
  const [showConnectionPrompt, setShowConnectionPrompt] = useState(true);

  const itemId = urlId ?? storeId;
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="px-5 pt-8 text-center">
        <div className="text-3xl text-text-faint mb-3">·</div>
        <p className="text-sm text-text-muted">essa coisa não está aqui</p>
        <button onClick={() => goBack()} className="font-mono text-[11px] text-gold-dim mt-4">← voltar</button>
      </div>
    );
  }

  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';
  const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
  const touched = item.updated_at && item.updated_at > item.created_at ? item.updated_at : item.created_at;

  // a linha de presença — estado, nunca julgamento (D46)
  const presenceLine = item.genesis_stage === 1
    ? `ainda um ponto · ${leafAge(item.created_at) === 'hoje' ? 'nasceu hoje' : `nasceu há ${leafAge(item.created_at)}`}`
    : `${item.module ? `no galho de ${BRANCH_LABEL[item.module]}` : 'sem galho ainda'} · folha de ${leafAge(touched)}`;

  const update = (updates: Record<string, unknown>) => {
    updateMutation.mutate({ id: item.id, updates });
  };

  // concluir tem lei própria: rastro `touch` (o cofre lê ausência por ele,
  // D63) e `last_completed` da recorrência — o update genérico perde os dois
  // (auditoria 20 § 7.7). Qualquer outro status segue pelo update.
  const changeStatus = (status: AtomStatus) => {
    if (status === 'completed' && item.status !== 'completed') {
      completeMutation.mutate(item.id);
      const trigger = shouldTriggerCheckIn({ ...item, status: 'completed' as const });
      if (trigger) setCheckInPrompt(trigger.prompt);
      return;
    }
    update({ status });
  };

  // patch em body.operations preservando o resto do body e das operations
  const updateOps = (patch: Partial<OperationsExtension>) => {
    const body = (item.body ?? {}) as Record<string, unknown>;
    const ops = (body.operations ?? {}) as Record<string, unknown>;
    update({ body: { ...body, operations: { ...ops, ...patch } } });
  };

  const handleEmotionAfter = (emotion: Emotion) => {
    const existingBody = (item.body ?? {}) as Record<string, unknown>;
    const existingSoul = (existingBody.soul ?? {}) as Record<string, unknown>;
    updateMutation.mutate({
      id: item.id,
      updates: {
        body: { ...existingBody, soul: { ...existingSoul, emotion_after: emotion } } as Record<string, unknown>,
      },
    });
    setCheckInPrompt(null);
    toast.success('sentida e guardada');
  };

  const handleAskAt = async () => {
    if (!item.title.trim()) {
      toast.error('a coisa não tem nome ainda');
      return;
    }
    try {
      const result = await aiClassify({ input: item.title });
      const band = getConfidenceBand(result);
      if (band === 'auto') {
        await pipelineClassify(item.id, result.type as AtomType, result.module as AtomModule);
        resetTriage();
      }
    } catch {
      toast.error('o @ não conseguiu ler agora');
    }
  };

  const handleAssent = async () => {
    if (!triageResult) return;
    await pipelineClassify(item.id, triageResult.type as AtomType, triageResult.module as AtomModule);
    resetTriage();
  };

  const handleMature = async () => {
    const stage = item.genesis_stage;
    if (stage === 2) {
      await structure(item.id, item.body ?? {}, item.notes ?? undefined);
    } else if (stage === 3) {
      await validate(item.id);
    } else if (stage >= 5 && stage < 7) {
      await pipelineCommit(item.id);
    }
  };

  const invite = INVITES[item.genesis_stage] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pb-8"
    >
      {/* voltar — mono quieto */}
      <div className="pt-4 pb-3">
        <button onClick={() => goBack()} className="font-mono text-[11px] text-gold-dim">← voltar</button>
      </div>

      {/* a cabeça: glifo do estágio + título + linha de presença */}
      <div
        className="mb-4"
        style={item.module ? { borderLeft: `3px solid ${moduleColor}`, paddingLeft: 11 } : undefined}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-gold text-lg shrink-0" aria-label={`estágio ${item.genesis_stage}`}>{geo}</span>
          <EditableTitle item={item} onSave={(title) => update({ title })} />
        </div>
        <p className="font-mono text-[11px] text-text-muted mt-1">{presenceLine}</p>
      </div>

      {/* chips: forma · galho · status · prazo · prioridade
          prazo e prioridade sempre existiram no schema (body.operations) —
          faltava a porta (auditoria 20 § 7.3). Limpar volta ao silêncio. */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <TypeSelector value={item.type} onChange={(type) => {
          if (item.genesis_stage >= 3) {
            morph(item.id, type);
          } else {
            update({ type });
          }
        }} />
        <ModuleSelector value={item.module} onChange={(module) => update({ module })} />
        <StatusSelector value={item.status} onChange={changeStatus} />
        <PrazoChip item={item} onPatch={updateOps} />
        <PrioridadeChip item={item} onPatch={updateOps} />
      </div>

      {/* check-in da alma depois de concluir */}
      {checkInPrompt && (
        <div className="mb-4 bg-gold-bg border rounded-[14px] p-4" style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>
          <p className="text-[13px] text-gold mb-2.5">{checkInPrompt}</p>
          <div className="flex flex-wrap gap-1.5">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                onClick={() => handleEmotionAfter(e)}
                className="px-2.5 py-1 rounded-2xl border border-border bg-card text-xs text-text-muted hover:text-gold transition-all"
              >
                {e}
              </button>
            ))}
          </div>
          <button onClick={() => setCheckInPrompt(null)} className="text-[11px] text-text-muted mt-2">
            agora não
          </button>
        </div>
      )}

      {/* estágio 1 — a leitura do @, chips de assentimento (D52) */}
      {item.genesis_stage === 1 && (
        <div className="mb-4">
          {triageResult ? (
            <div className="bg-gold-bg border rounded-[14px] p-3.5" style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>
              <p className="text-[13px] text-gold mb-2">
                o @ leu: parece{' '}
                <b className="font-medium" style={{ color: getTypeColor(triageResult.type as AtomType) }}>{triageResult.type}</b>
                {triageResult.module && (
                  <> no galho de <b className="font-medium" style={{ color: MODULE_COLORS[triageResult.module as AtomModule] ?? 'var(--color-mod-bridge)' }}>{BRANCH_LABEL[triageResult.module as AtomModule] ?? triageResult.module}</b></>
                )}
                {' '}— assim?
              </p>
              {triageResult.reasoning && (
                <p className="text-[11px] text-text-muted italic mb-2.5">"{triageResult.reasoning}"</p>
              )}
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={handleAssent} className="font-mono text-[10.5px] px-3 py-1.5 rounded-full text-gold bg-gold-bg" style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }}>
                  assim ·
                </button>
                <button onClick={() => resetTriage()} className="font-mono text-[10.5px] px-3 py-1.5 rounded-full border border-border bg-surface text-text-muted">
                  deixa quieto
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAskAt}
              disabled={isClassifying}
              className="w-full bg-card border border-border-soft rounded-[14px] p-3.5 text-center text-[13px] text-text-muted transition-colors disabled:opacity-50"
            >
              {isClassifying ? 'o @ está lendo…' : '✳ perguntar ao @ que forma isso tem'}
            </button>
          )}
        </div>
      )}

      {/* o convite de maturação — um, quieto, sem pressa (D45/D48) */}
      {invite && (
        <button
          onClick={handleMature}
          className="w-full mb-4 py-3 px-4 text-left text-[13px] rounded-[14px] bg-gold-bg text-gold"
          style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
        >
          <span className="font-mono">{invite.geo}</span> {invite.label} — quando você quiser
        </button>
      )}

      {/* portão 4 — a teia pergunta */}
      {item.genesis_stage === 4 && showConnectionPrompt && (
        <ConnectionPrompt
          item={item}
          allItems={items}
          connections={connections}
          onConnect={async (targetId, relation) => {
            await pipelineConnect(item.id, targetId, relation);
            setShowConnectionPrompt(false);
          }}
          onSkip={() => setShowConnectionPrompt(false)}
        />
      )}

      <Divider />

      {/* corpo por tipo — list mostra as entradas checáveis */}
      {item.type === 'list' && (
        <ListChecklist item={item} onSave={(body) => update({ body: { ...item.body, ...body } })} />
      )}

      {/* notas */}
      <EditableNotes item={item} onSave={(notes) => update({ notes })} />

      <Divider />

      {/* a teia */}
      <ConnectionsSection itemId={item.id} />

      <Divider />

      {/* tags */}
      <TagsSection tags={item.tags} onAdd={(tag) => update({ tags: [...item.tags, tag] })} onRemove={(tag) => update({ tags: item.tags.filter((t) => t !== tag) })} />

      <Divider />

      {/* detalhes — estado quieto */}
      <SectionLabel>detalhes</SectionLabel>
      <div className="space-y-1 mb-4">
        <DetailRow label="nasceu" value={formatDate(item.created_at)} />
        <DetailRow label="tocada" value={leafAge(touched).endsWith('d') ? `há ${leafAge(touched)}` : leafAge(touched)} />
        {item.source && <DetailRow label="veio de" value={item.source} />}
        {item.project_id && <DetailRow label="projeto" value={item.project_id.slice(0, 8)} />}
      </div>

      <Divider />

      {/* entropy é archive, nunca delete (lei da casa §8.2). O state vai junto:
          sem ele o item arquivado continuava contando como inbox na esteira. */}
      <button
        onClick={() => { update({ status: 'archived', state: 'archived' }); goBack(); }}
        className="w-full py-2.5 text-center text-sm border border-border rounded-xl text-text-muted mt-4"
      >
        guardar no arquivo
      </button>
    </motion.div>
  );
}

// ─── Editable Title ──────────────────────────────────

function EditableTitle({ item, onSave }: { item: { title: string }; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(item.title);
      setEditing(false);
      toast.error('a coisa precisa de um nome');
      return;
    }
    if (trimmed !== item.title) onSave(trimmed);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === 'Enter' && save()}
        autoFocus
        className="text-[17px] w-full bg-transparent outline-none border-b pb-1"
        style={{ borderColor: 'var(--color-gold-dim)' }}
      />
    );
  }

  return (
    <h1
      onClick={() => { setDraft(item.title); setEditing(true); }}
      className="text-[17px] text-text cursor-text"
    >
      {item.title}
    </h1>
  );
}

// ─── Editable Notes ──────────────────────────────────

function EditableNotes({ item, onSave }: { item: { notes: string | null }; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.notes ?? '');

  const save = () => {
    if (draft !== (item.notes ?? '')) onSave(draft);
    setEditing(false);
  };

  return (
    <>
      <SectionLabel>notas</SectionLabel>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          autoFocus
          rows={4}
          className="w-full text-sm bg-transparent outline-none border border-border rounded-xl p-3 mb-4 resize-none"
        />
      ) : (
        <div
          onClick={() => { setDraft(item.notes ?? ''); setEditing(true); }}
          className={`text-sm mb-4 min-h-[40px] cursor-text ${item.notes ? 'text-text-muted' : 'text-text-faint italic'}`}
        >
          {item.notes || 'toque pra escrever uma nota…'}
        </div>
      )}
    </>
  );
}

// ─── Type Selector ───────────────────────────────────

function TypeSelector({ value, onChange }: { value: AtomType | null; onChange: (v: AtomType) => void }) {
  const [open, setOpen] = useState(false);
  const color = value ? getTypeColor(value) : 'var(--color-text-faint)';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border bg-surface"
        style={{ color, borderColor: value ? `color-mix(in srgb, ${color} 35%, var(--color-border))` : 'var(--color-border)' }}
      >
        {value ?? 'forma?'}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto w-36">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { onChange(t as AtomType); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Prazo · Prioridade (body.operations) ────────────
// A porta que faltava (auditoria 20 § 7.3): due_date e priority sempre
// existiram no schema — a semana e a busca já os leem. Vazio fica quieto
// («prazo?»); limpar é gesto de primeira classe.

function PrazoChip({ item, onPatch }: { item: AtomItem; onPatch: (p: Partial<OperationsExtension>) => void }) {
  const due = ((item.body?.operations as Partial<OperationsExtension> | undefined)?.due_date) ?? null;
  const [open, setOpen] = useState(false);
  const label = due ? format(parseISO(due), 'd MMM', { locale: ptBR }) : 'prazo?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border bg-surface"
        style={due
          ? { color: 'var(--color-gold)', borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }
          : { color: 'var(--color-text-faint)', borderColor: 'var(--color-border)' }}
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 p-2.5 w-44">
          <input
            type="date"
            value={due ?? ''}
            onChange={(e) => { onPatch({ due_date: e.target.value || null }); setOpen(false); }}
            className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-text-heading"
            aria-label="Prazo"
          />
          {due && (
            <button
              onClick={() => { onPatch({ due_date: null }); setOpen(false); }}
              className="w-full text-left px-1 pt-2 text-[11px] text-text-muted"
            >
              sem prazo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const PRIORIDADES: { key: Priority; label: string }[] = [
  { key: 'high', label: 'alta' },
  { key: 'medium', label: 'média' },
  { key: 'low', label: 'baixa' },
];

function PrioridadeChip({ item, onPatch }: { item: AtomItem; onPatch: (p: Partial<OperationsExtension>) => void }) {
  const prio = ((item.body?.operations as Partial<OperationsExtension> | undefined)?.priority) ?? null;
  const [open, setOpen] = useState(false);
  const label = prio ? PRIORIDADES.find((p) => p.key === prio)?.label : 'prioridade?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border bg-surface"
        style={prio
          ? { color: 'var(--color-gold)', borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }
          : { color: 'var(--color-text-faint)', borderColor: 'var(--color-border)' }}
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-32">
          {PRIORIDADES.map((p) => (
            <button
              key={p.key}
              onClick={() => { onPatch({ priority: prio === p.key ? null : p.key }); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors"
            >
              {prio === p.key ? '● ' : '○ '}{p.label}
            </button>
          ))}
          {prio && (
            <button
              onClick={() => { onPatch({ priority: null }); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-[11px] text-text-muted border-t border-border"
            >
              sem prioridade
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Module Selector ─────────────────────────────────

function ModuleSelector({ value, onChange }: { value: AtomModule | null; onChange: (v: AtomModule) => void }) {
  const [open, setOpen] = useState(false);
  const color = value ? MODULE_COLORS[value] : 'var(--color-text-faint)';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border bg-surface flex items-center gap-1.5"
        style={{ color, borderColor: value ? `color-mix(in srgb, ${color} 35%, var(--color-border))` : 'var(--color-border)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        {value ? BRANCH_LABEL[value] : 'galho?'}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-36">
          {MODULES.map((m) => (
            <button
              key={m.key}
              onClick={() => { onChange(m.key); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              {BRANCH_LABEL[m.key] ?? m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status Selector ─────────────────────────────────

function StatusSelector({ value, onChange }: { value: AtomStatus; onChange: (v: AtomStatus) => void }) {
  const [open, setOpen] = useState(false);
  const label = STATUS_OPTIONS.find((s) => s.key === value)?.label ?? value;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border border-border bg-surface text-text-muted"
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-36">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => { onChange(s.key); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors ${value === s.key ? 'text-gold' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tags Section ────────────────────────────────────

function TagsSection({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (tag: string) => void; onRemove?: (tag: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const add = () => {
    if (draft.trim()) {
      onAdd(draft.trim());
      setDraft('');
      setAdding(false);
    }
  };

  return (
    <>
      <SectionLabel>tags</SectionLabel>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((t) => (
          <span key={t} className="font-mono text-[10.5px] px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
            {t}
            {onRemove && (
              <button
                onClick={() => {
                  const isProtected = ['#domain:', '#raiz', '#mod_', '#ritual:', '#project:', '#seed'].some(p => t.startsWith(p) || t === p);
                  if (isProtected) {
                    if (window.confirm(`Soltar a tag "${t}"? Ela é usada pelo sistema.`)) onRemove(t);
                  } else {
                    onRemove(t);
                  }
                }}
                className="text-text-faint hover:text-error ml-0.5"
                aria-label={`Remover tag ${t}`}
              >×</button>
            )}
          </span>
        ))}
        {adding ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={add}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            autoFocus
            placeholder="tag…"
            className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border bg-transparent outline-none w-20"
            style={{ borderColor: 'var(--color-gold-dim)' }}
          />
        ) : (
          <button onClick={() => setAdding(true)} className="font-mono text-[10.5px] px-2.5 py-1 rounded-full border border-border text-text-faint">
            + tag
          </button>
        )}
      </div>
    </>
  );
}

// ─── Connection Prompt (portão 4 — a teia pergunta) ──

function ConnectionPrompt({ item, allItems, connections, onConnect, onSkip }: {
  item: AtomItem;
  allItems: AtomItem[];
  connections: { source_id: string; target_id: string }[];
  onConnect: (targetId: string, relation: AtomRelation) => Promise<void>;
  onSkip: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [relation, setRelation] = useState<AtomRelation>('references');

  const connectedIds = new Set([
    ...connections.filter((c) => c.source_id === item.id).map((c) => c.target_id),
    ...connections.filter((c) => c.target_id === item.id).map((c) => c.source_id),
  ]);

  const suggested = useMemo(() => {
    const candidates = allItems.filter((i) =>
      i.id !== item.id &&
      !connectedIds.has(i.id) &&
      i.status !== 'archived' &&
      (i.module === item.module || i.tags?.some((t) => item.tags?.includes(t)))
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      return candidates.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 6);
    }
    return candidates.slice(0, 6);
  }, [allItems, item, connectedIds, search]);

  const RELATIONS: { key: AtomRelation; label: string }[] = [
    { key: 'belongs_to', label: 'pertence a' },
    { key: 'references', label: 'referencia' },
    { key: 'feeds', label: 'alimenta' },
    { key: 'blocks', label: 'bloqueia' },
    { key: 'derives', label: 'deriva de' },
    { key: 'mirrors', label: 'espelha' },
  ];

  const target = selectedId ? allItems.find((i) => i.id === selectedId) : null;

  return (
    <div className="mb-4 bg-gold-bg border rounded-[14px] p-4" style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-gold-dim mb-1">□ · a teia pergunta</div>
      <p className="text-[13px] text-text mb-3">isso se conecta com algo?</p>

      {!selectedId ? (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="buscar…"
            className="w-full text-[12px] bg-card border border-border rounded-lg px-3 py-2 outline-none mb-2"
          />
          {suggested.length > 0 ? (
            <div className="space-y-1">
              {suggested.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full text-left px-3 py-2 text-[12px] bg-card border border-border-soft rounded-lg transition-colors truncate flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.module ? MODULE_COLORS[s.module] : 'var(--color-border)' }} />
                  <span className="truncate">{s.title}</span>
                  {s.type && <span className="font-mono text-[9px] text-text-faint ml-auto shrink-0">{s.type}</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-2 text-center">nada parecido por perto</p>
          )}
          <button onClick={onSkip} className="text-[11px] text-text-muted mt-2">
            agora não
          </button>
        </>
      ) : (
        <>
          <div className="text-[12px] text-text-muted mb-2">→ <span className="text-text">{target?.title}</span></div>
          <div className="flex flex-wrap gap-1 mb-3">
            {RELATIONS.map((r) => (
              <button
                key={r.key}
                onClick={() => setRelation(r.key)}
                className={`font-mono text-[10px] px-2.5 py-1 rounded-full border ${
                  relation === r.key ? 'text-gold bg-gold-bg' : 'border-border text-text-muted'
                }`}
                style={relation === r.key ? { borderColor: 'color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' } : undefined}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelectedId(null)} className="flex-1 py-2 text-center text-xs border border-border rounded-lg text-text-muted">
              voltar
            </button>
            <button
              onClick={() => onConnect(selectedId!, relation)}
              className="flex-1 py-2 text-center text-xs rounded-lg text-gold bg-gold-bg font-medium"
              style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }}
            >
              tecer → ⬠
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared ──────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5">{children}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-faint">{label}</span>
      <span className="text-text-muted">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-b border-border-soft my-4" />;
}

function formatDate(iso: string): string {
  try { return format(parseISO(iso), "d MMM yyyy", { locale: ptBR }); }
  catch { return iso; }
}
