// components/triage/Assentimento.tsx — o gesto de assentir (D69 · ato II)
// Nasceu dentro da tela /pipeline, que a D48 sentenciou à morte e que a nav
// nunca mostrou — o assentimento ficou sem porta enquanto o cron enchia o
// inbox. Aqui ele vira componente: uma casa só, chamada de onde precisar
// (o puxador do HOJE hoje; a tela velha até o gate). D40: não é lugar, é gesto.

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { useItemMutations } from '@/hooks/useItemMutations';
import { usePipeline } from '@/hooks/usePipeline';
import { useTriage } from '@/hooks/useTriage';
import { comLeitura, leituraPronta } from '@/engine/esteira';
import { getConfidenceBand } from '@/service/triage-service';
import type { TriageResult } from '@/service/triage-service';
import type { AtomItem, AtomModule, AtomType } from '@/types/item';
import { MODULE_COLORS, getTypeColor } from '@/components/atoms/tokens';
import { ConfidenceBar } from '@/components/atoms/ConfidenceBar';
import { connectorContext } from '@/engine/connector';
import { MODULES } from '@/engine/token-parser';
import { toast } from '@/store/toast-store';

const BAND_COLORS = {
  auto:    { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)', label: 'auto' },
  suggest: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)', label: 'sugerir' },
  manual:  { bg: 'var(--color-error-bg)', text: 'var(--color-error-text)', label: 'manual' },
} as const;

/** Quantos pontos esperam leitura — o número que o puxador mostra (D46: estado). */
export function esperandoLeitura(items: AtomItem[]): number {
  return items.filter((i) => i.state === 'inbox').length;
}

export function Assentimento() {
  const { items } = useItems();
  const { classify } = usePipeline();
  const { archiveBatch } = useItemMutations();
  const { classify: aiClassify, isClassifying, result: triageResult, reset: resetTriage } = useTriage();

  // o modo em bloco (auditoria 20 § 7.1) — só aceita em massa o que já tem
  // leitura visível (engine/esteira, D69); o resto se arquiva ou volta ao
  // um-a-um. Seleção nunca sobrevive à troca de modo.
  const [modo, setModo] = useState<'um' | 'bloco'>('um');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [gravando, setGravando] = useState<{ feito: number; total: number } | null>(null);

  // DP-B: pular manda pro FIM da fila, não gira em círculo. E a fila é sempre
  // lida pelo topo — assim selar (o item sai do inbox) nunca pula o seguinte,
  // que era o que um índice fixo fazia calado.
  const [pulados, setPulados] = useState<string[]>([]);

  const fila = useMemo(() => {
    const inbox = items.filter((i) => i.state === 'inbox');
    if (pulados.length === 0) return inbox;
    const atras = new Set(pulados);
    const frente = inbox.filter((i) => !atras.has(i.id));
    const fundo = pulados
      .map((id) => inbox.find((i) => i.id === id))
      .filter((i): i is AtomItem => !!i);
    return [...frente, ...fundo];
  }, [items, pulados]);

  const current = fila[0];
  const total = fila.length;
  const deuAVolta = total > 0 && pulados.length >= total;

  // bloco de 1 não existe — a fila encolheu até aqui? volta ao card
  useEffect(() => {
    if (total <= 1 && modo === 'bloco') setModo('um');
  }, [total, modo]);

  // D69 — a heurística nunca decide quieta: item de conector chega com
  // leitura pronta (recorrente→ritual, único→task, email→note); o chip
  // mostra a leitura e deixa trocar num toque. AI não re-lê o que o
  // conector já leu.
  const isConnector = current?.tags?.includes('#connector') ?? false;
  const leituraOpcoes: Array<AtomItem['type']> = current?.tags?.includes('#source:google-calendar')
    ? ['ritual', 'task']
    : ['note', 'task'];
  const [leituraEscolhida, setLeituraEscolhida] = useState<AtomItem['type'] | null>(null);
  const [moduloEscolhido, setModuloEscolhido] = useState<AtomModule | null>(null);
  // card novo, leitura limpa — a sugestão de um nunca vaza pro seguinte
  useEffect(() => {
    setLeituraEscolhida(null);
    setModuloEscolhido(null);
    resetTriage();
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const leitura = leituraEscolhida ?? current?.type ?? null;
  const modulo = moduloEscolhido ?? (current?.module as AtomModule | null) ?? 'bridge';
  const contexto = useMemo(
    () => (current ? connectorContext(current) : { origin: null, lines: [] }),
    [current],
  );

  // o selo é do humano (D69): se a gravação falhou, o card NÃO anda — senão
  // a esteira mente ("assenti 6") e os itens voltam na próxima volta
  const handleAcceptLeitura = async () => {
    if (!current || !leitura) return;
    await classify(current.id, leitura, modulo, { quiet: true });
  };

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl text-success mb-3">○</div>
        <h3 className="text-lg font-medium mb-1.5">nada esperando</h3>
        <p className="text-[13px] text-text-muted">tudo que chegou já tem leitura</p>
      </div>
    );
  }

  const handleClassify = async () => {
    if (!current) return;
    if (!current.title.trim()) {
      toast.error('Item sem titulo — edite antes de classificar');
      return;
    }
    try {
      const result = await aiClassify({ input: current.title });
      const band = getConfidenceBand(result);
      if (band === 'auto') {
        await classify(current.id, result.type as AtomItem['type'], result.module as AtomModule, { quiet: true });
      }
      // 'suggest' and 'manual' stay on card for user action
    } catch {
      toast.error('não consegui ler agora — o ponto segue esperando');
    }
  };

  const handleAccept = async (result: TriageResult) => {
    if (!current) return;
    await classify(current.id, result.type as AtomItem['type'], moduloEscolhido ?? (result.module as AtomModule), { quiet: true });
  };

  // pular manda pro fim da fila (DP-B): o item volta, mas depois de todos os
  // outros — adiar não é esconder, e não é snooze (cobrança adiada)
  const handleSkip = () => {
    if (!current) return;
    setPulados((p) => [...p.filter((id) => id !== current.id), current.id]);
  };

  // ── o bloco ──
  const prontos = useMemo(() => comLeitura(fila), [fila]);
  const selecionados = useMemo(() => fila.filter((i) => sel.has(i.id)), [fila, sel]);
  const selComLeitura = useMemo(() => selecionados.filter((i) => leituraPronta(i)), [selecionados]);

  const toggleSel = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const aceitarSelecionados = async () => {
    if (selComLeitura.length === 0 || gravando) return;
    setGravando({ feito: 0, total: selComLeitura.length });
    let ok = 0;
    let falhas = 0;
    // o selo segue sendo do humano (D69): cada leitura aceita aqui estava
    // visível na linha; falha não anda — o item fica na fila e é contado
    for (const it of selComLeitura) {
      const l = leituraPronta(it);
      if (!l) continue;
      try {
        await classify(it.id, l.type, l.module, { quiet: true });
        ok += 1;
      } catch {
        falhas += 1;
      }
      setGravando((g) => (g ? { ...g, feito: g.feito + 1 } : g));
    }
    setGravando(null);
    setSel(new Set());
    if (ok > 0) toast.success(ok === 1 ? '1 leitura aceita' : `${ok} leituras aceitas`);
    if (falhas > 0) toast.error(`${falhas} não gravaram — seguem na fila`);
  };

  const arquivarSelecionados = async () => {
    if (selecionados.length === 0 || gravando) return;
    setGravando({ feito: 0, total: selecionados.length });
    await archiveBatch.mutateAsync(selecionados.map((i) => i.id)).catch(() => {});
    setGravando(null);
    setSel(new Set());
  };

  const band = triageResult ? getConfidenceBand(triageResult) : null;
  const bandStyle = band ? BAND_COLORS[band] : null;

  return (
    <div>
      {/* quantos faltam — estado, nunca corrida (D46). A posição na fila não
          significa mais nada: pular manda pro fim, selar tira da fila. */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-xl font-medium text-text-heading">{total}</span>
        <span className="text-[13px] text-text-muted">{total === 1 ? 'esperando' : 'esperando'}</span>
        {modo === 'um' && deuAVolta && (
          <span className="ml-auto font-mono text-[11px] text-text-faint">todos já passaram uma vez</span>
        )}
        {total > 1 && (
          <button
            onClick={() => { setModo(modo === 'um' ? 'bloco' : 'um'); setSel(new Set()); }}
            className={modo === 'um' && deuAVolta ? 'font-mono text-[11px] text-gold-dim' : 'ml-auto font-mono text-[11px] text-gold-dim'}
          >
            {modo === 'um' ? 'em bloco' : 'um a um'}
          </button>
        )}
      </div>

      {/* o bloco — cada linha mostra a leitura que seria aceita; nada quieto */}
      {modo === 'bloco' && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setSel(new Set(prontos.map((i) => i.id)))}
              disabled={prontos.length === 0}
              className="font-mono text-[11px] text-text-muted disabled:opacity-40"
            >
              marcar lidos ({prontos.length})
            </button>
            {sel.size > 0 && (
              <button onClick={() => setSel(new Set())} className="font-mono text-[11px] text-text-faint">
                limpar
              </button>
            )}
          </div>

          <div className="space-y-1 mb-3">
            {fila.map((i) => {
              const l = leituraPronta(i);
              const marcado = sel.has(i.id);
              const color = l ? getTypeColor(l.type) : 'var(--color-text-faint)';
              return (
                <button
                  key={i.id}
                  onClick={() => toggleSel(i.id)}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-xl border transition-colors"
                  style={{
                    borderColor: marcado ? 'color-mix(in srgb, var(--color-gold) 40%, var(--color-border))' : 'var(--color-border)',
                    background: marcado ? 'var(--color-gold-bg)' : 'var(--color-card)',
                  }}
                  aria-pressed={marcado}
                >
                  <span className="font-mono text-sm shrink-0" style={{ color: marcado ? 'var(--color-gold)' : 'var(--color-text-faint)' }}>
                    {marcado ? '●' : '○'}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-[13px]">{i.title}</span>
                  {l ? (
                    <span className="font-mono text-[10.5px] px-2 py-0.5 rounded-full shrink-0" style={{ background: `${color}18`, color }}>
                      {l.type} · {l.module}
                    </span>
                  ) : (
                    <span className="font-mono text-[10.5px] text-text-faint shrink-0">sem leitura</span>
                  )}
                </button>
              );
            })}
          </div>

          {gravando && (
            <p className="font-mono text-[11px] text-text-muted mb-2">gravando {gravando.feito}/{gravando.total}…</p>
          )}

          {sel.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={aceitarSelecionados}
                disabled={selComLeitura.length === 0 || !!gravando}
                className="flex-1 py-2.5 rounded-xl bg-success text-white text-[13px] font-medium disabled:opacity-40"
              >
                ✓ aceitar leituras ({selComLeitura.length})
              </button>
              <button
                onClick={arquivarSelecionados}
                disabled={!!gravando}
                className="flex-1 py-2.5 rounded-xl border border-border text-text-muted text-[13px] disabled:opacity-40"
              >
                guardar no arquivo ({selecionados.length})
              </button>
            </div>
          )}
          {sel.size > 0 && selComLeitura.length < selecionados.length && (
            <p className="text-[11px] text-text-faint mt-1.5">
              sem leitura só vai pro arquivo — pra ler, volta ao um a um
            </p>
          )}
        </div>
      )}

      {/* o card */}
      {modo === 'um' && current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="bg-card border border-border rounded-[14px] p-5 mb-4"
          >
            {/* Module bar */}
            <div
              className="w-full h-[3px] rounded-sm mb-4"
              style={{ background: current.module ? MODULE_COLORS[current.module] : 'var(--color-text-muted)' }}
            />

            {/* Title */}
            <div className="text-lg leading-relaxed mb-2">
              <span className="text-sm text-text-muted mr-1.5">·</span>
              {current.title}
            </div>

            {/* o que a lente trouxe junto — não se assente o que não se vê */}
            {contexto.lines.length > 0 && (
              <div className="mb-4 space-y-0.5">
                {contexto.lines.map((l) => (
                  <p key={l} className="text-[12px] text-text-muted leading-snug">{l}</p>
                ))}
              </div>
            )}

            {/* Leitura do conector (D69) — visível e trocável, nunca quieta */}
            {isConnector ? (
              <div className="bg-surface rounded-xl p-3.5 mb-3">
                <span className="text-xs text-text-muted block mb-2">
                  li assim pelo {current.tags?.includes('#source:google-calendar') ? 'calendar' : 'gmail'} — troca se não for isso
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {leituraOpcoes.map((t) => {
                    const color = getTypeColor(t as AtomType);
                    const ativo = leitura === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setLeituraEscolhida(t)}
                        className="text-[13px] font-medium px-3 py-1.5 rounded-lg border transition-colors"
                        style={
                          ativo
                            ? { background: `${color}18`, color, borderColor: color }
                            : { background: 'transparent', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }
                        }
                      >
                        {ativo ? '● ' : '○ '}{t}
                      </button>
                    );
                  })}
                </div>

                {/* onde mora — sem isto tudo nascia bridge e a árvore recebia
                    a colheita inteira num galho só */}
                <span className="text-xs text-text-muted block mt-3 mb-1.5">onde mora</span>
                <div className="flex gap-1 flex-wrap">
                  {MODULES.map((m) => {
                    const color = MODULE_COLORS[m as keyof typeof MODULE_COLORS];
                    const ativo = modulo === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setModuloEscolhido(m)}
                        className="text-[11px] font-medium px-2 py-1 rounded-md border transition-colors"
                        style={
                          ativo
                            ? { background: `${color}18`, color, borderColor: color }
                            : { background: 'transparent', color: 'var(--color-text-faint)', borderColor: 'var(--color-border)' }
                        }
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : triageResult ? (
              <div className="bg-surface rounded-xl p-3.5 mb-3">
                <ConfidenceBar value={triageResult.confidence} className="mb-3" />

                {bandStyle && (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-lg inline-block mb-2.5"
                    style={{ background: bandStyle.bg, color: bandStyle.text }}
                  >
                    {bandStyle.label}
                  </span>
                )}

                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ai-purple to-ai-blue flex items-center justify-center text-[10px] text-white font-medium shrink-0">
                    A
                  </div>
                  <span className="text-xs text-text-muted">sugestao do triage</span>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  <TypeChip type={triageResult.type} />
                  <ModuleChip module={triageResult.module} />
                </div>

                {triageResult.reasoning && (
                  <p className="text-[11px] text-text-muted italic leading-relaxed mt-1.5">
                    "{triageResult.reasoning}"
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleClassify}
                disabled={isClassifying}
                className="w-full bg-surface rounded-xl p-3.5 mb-3 text-center text-[13px] text-text-muted hover:bg-border/50 transition-colors disabled:opacity-50"
              >
                {isClassifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-accent-light border-t-transparent animate-spin" />
                    classificando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ai-purple to-ai-blue flex items-center justify-center text-[10px] text-white font-medium shrink-0">
                      A
                    </div>
                    classificar com AI
                  </span>
                )}
              </button>
            )}

            {current.notes && <p className="text-xs text-text-muted mb-2">{current.notes}</p>}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Action buttons */}
      {modo === 'um' && (
      <div className="flex items-center justify-center gap-6 py-2">
        <button
          onClick={handleSkip}
          className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted text-lg"
          aria-label="Pular"
        >
          →
        </button>
        {isConnector ? (
          <button
            onClick={handleAcceptLeitura}
            className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center text-xl shadow-lg shadow-success/25"
            aria-label="Aceitar leitura do conector"
          >
            ✓
          </button>
        ) : triageResult ? (
          <button
            onClick={() => handleAccept(triageResult)}
            className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center text-xl shadow-lg shadow-success/25"
            aria-label="Aceitar classificacao"
          >
            ✓
          </button>
        ) : (
          <button
            onClick={handleClassify}
            disabled={isClassifying}
            className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center text-xl shadow-lg shadow-success/25 disabled:opacity-50"
            aria-label="Classificar"
          >
            ▸
          </button>
        )}
      </div>
      )}
      {modo === 'um' && (
      <div className="flex justify-center gap-9 text-[10px] text-text-muted mt-1.5">
        <span>pular</span>
        <span>{isConnector || triageResult ? 'aceitar' : 'classificar'}</span>
      </div>
      )}
    </div>
  );
}

function TypeChip({ type }: { type: string }) {
  const color = getTypeColor(type as AtomType);
  return (
    <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: `${color}18`, color }}>
      {type}
    </span>
  );
}

function ModuleChip({ module }: { module: string }) {
  const color = MODULE_COLORS[module as keyof typeof MODULE_COLORS] ?? 'var(--color-mod-bridge)';
  return (
    <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: `${color}18`, color }}>
      {module}
    </span>
  );
}
