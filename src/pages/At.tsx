// pages/At.tsx — Face @ (Onda 3 · branch v2-faces)
// A conversa: uma boca só. "A fricção de decidir onde põe no momento da
// ideia é o que mata captura" (parecer-ux §@) — aqui despeja-se, e o E.
// lê; decide-se depois, por chips de assentimento. Captura-primeiro: o
// ponto nasce no tronco ANTES da leitura da AI — se ela falhar, nada se
// perde. Triage invisível na conversa; sinto: é a boca da alma (mesma
// gramática do Telegram); lista: é a despensa. Bilhetes do E. = v2.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { useChatStore, type ChatChip, type ChatMessage } from '@/store/chat-store';
import { readMouth, resolveListTarget, structureFromTriage, readingChips } from '@/engine/mouth';
import { listLists, readListBody } from '@/engine/list';
import { evaluateProtocols, readTodaySoul } from '@/engine/protocol';
import { getCurrentPeriod } from '@/types/ui';
import { getSnoozedIds } from '@/components/hoje/protocol-snooze';
import { pipelineService } from '@/service/pipeline-service';
import { itemService } from '@/service/item-service';
import { outboxService } from '@/service/outbox-service';
import { soulService } from '@/service/soul-service';
import { triageService, getConfidenceBand } from '@/service/triage-service';
import type { AtomItem } from '@/types/item';

export function AtPage() {
  const navigate = useNavigate();
  const { selectItem } = useNav();
  const queryClient = useQueryClient();
  const user = useAppStore((s) => s.user);
  const { items } = useItems();
  const chat = useChatStore();
  const [text, setText] = useState('');
  const [lendo, setLendo] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { chat.ensureToday(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [chat.messages, lendo]);

  const all = useMemo(() => (items ?? []) as AtomItem[], [items]);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  // Bolha mecânica não assina: a assinatura acompanha a decisão, não a
  // fala (Lei do Tom v1.6, invariante da 4.0 — «o crachá sou eu»). O sig
  // volta pela `extra` só onde houver julgamento de E. (ex.: bilhete).
  const e = (text: string, extra?: Partial<ChatMessage>) =>
    chat.push({ from: 'e', text, ...extra });

  // ─── os fluxos da boca ─────────────────────────────────
  async function handleSend() {
    const input = text.trim();
    if (!input || !user || lendo) return;
    setText('');
    if (boxRef.current) boxRef.current.style.height = 'auto';
    chat.push({ from: 'me', text: input });

    const reading = readMouth(input);

    // D55 — sem rede, a boca não trava: a leitura vai pra fila do avô e
    // sobe sozinha quando a rede voltar (useOutboxSync). Nada se perde.
    if (!navigator.onLine) {
      const n = outboxService.enqueue(user.id, reading);
      e(n === 1
        ? 'sem rede — guardei na fila. sobe sozinho quando a rede voltar.'
        : `sem rede — guardei na fila (${n} esperando). sobem sozinhos quando a rede voltar.`);
      return;
    }

    // captura-primeiro tem consequência no erro: se o ponto JÁ nasceu, a fila
    // duplicaria. Guardamos quem nasceu pra falar a verdade no catch.
    let nascido: AtomItem | null = null;

    try {
      if (reading.kind === 'soul') {
        await soulService.persistSoulCheckin({ userId: user.id, emotion: reading.emotion, note: reading.note });
        invalidate();
        // a emoção nova pode acordar a sentinela — o convite vem na conversa
        const soul = readTodaySoul(all);
        const awake = evaluateProtocols(
          all,
          { emotion: reading.emotion, energy: soul.energy, period: getCurrentPeriod().key },
          getSnoozedIds(user.id),
        )[0];
        if (awake) {
          e(`senti com você — anotei na sua chegada. o ◈ «${awake.title}» tá de pé.`, {
            chips: [
              { label: '◈ abrir no hoje', hot: true, action: { type: 'open-hoje' } },
              { label: 'agora não', action: { type: 'dismiss' } },
            ],
          });
        } else {
          e('senti com você — anotei na sua chegada.');
        }
        return;
      }

      if (reading.kind === 'list') {
        const abertas = listLists(all).filter((l) => readListBody(l).entries.some((en) => !en.done) || readListBody(l).entries.length === 0);
        const alvo = resolveListTarget(abertas, reading.name);
        if (alvo) {
          const cur = readListBody(alvo).entries;
          const entries = [...cur, ...reading.entries.map((t) => ({ text: t, done: false }))];
          await itemService.update(alvo.id, { body: { ...(alvo.body ?? {}), entries } });
          invalidate();
          e(`+${reading.entries.length} na «${alvo.title}» · ${entries.filter((en) => !en.done).length} abertos. fica de pill no HOJE.`, {
            chips: [{ label: 'abrir', action: { type: 'open-item', itemId: alvo.id } }],
          });
        } else {
          const titulo = reading.name ?? 'lista de hoje';
          const item = await pipelineService.capture(titulo, user.id);
          nascido = item;
          await pipelineService.quickClassifyAndStructure(item.id, 'list', 'bridge', {
            entries: reading.entries.map((t) => ({ text: t, done: false })),
          });
          invalidate();
          e(`🛒 «${titulo}» criada · ${reading.entries.length} itens. fica de pill no HOJE pra puxar no mercado.`, {
            chips: [{ label: 'abrir', action: { type: 'open-item', itemId: item.id } }],
          });
        }
        return;
      }

      // captura — o ponto nasce ANTES de qualquer leitura
      const item = await pipelineService.capture(reading.title, user.id);
      nascido = item;
      if (reading.notes) await itemService.update(item.id, { notes: reading.notes });

      if (reading.hasTokens) {
        // tokens explícitos = o assentimento já veio no gesto
        await pipelineService.quickClassifyAndStructure(
          item.id, reading.type!, reading.module!,
          reading.dueDate ? { operations: { due_date: reading.dueDate } } : {},
        );
        invalidate();
        e('guardei do seu jeito:', {
          infoChips: [`△ ${reading.type}`, `#${reading.module}`, ...(reading.dueDate ? [`@${reading.dueDate.slice(5)}`] : [])],
          chips: [{ label: 'abrir', action: { type: 'open-item', itemId: item.id } }],
        });
        return;
      }

      invalidate();
      setLendo(true);
      try {
        const result = await triageService.classify(input);
        const band = getConfidenceBand(result);
        if (band === 'auto') {
          const s = structureFromTriage(result);
          await pipelineService.quickClassifyAndStructure(item.id, s.type, s.module, s.body);
          invalidate();
          e('li assim — já guardei:', {
            infoChips: readingChips(result),
            chips: [{ label: 'ajusta', action: { type: 'open-item', itemId: item.id } }],
          });
        } else if (band === 'suggest') {
          e('li assim:', {
            infoChips: readingChips(result),
            chips: [
              { label: 'confirma', hot: true, action: { type: 'confirm-triage', itemId: item.id, result } },
              { label: 'ajusta', action: { type: 'open-item', itemId: item.id } },
            ],
          });
        } else {
          e('não li com clareza — guardei como ponto (·). decide com calma quando quiser.', {
            chips: [{ label: 'abrir', action: { type: 'open-item', itemId: item.id } }],
          });
        }
      } catch {
        // a leitura falhou; a captura não — nada se perde
        e('guardei como ponto (·) — a leitura falhou agora, mas nada se perdeu.', {
          chips: [{ label: 'abrir', action: { type: 'open-item', itemId: item.id } }],
        });
      } finally {
        setLendo(false);
      }
    } catch {
      // o ponto já nasceu e só o selo falhou: enfileirar aqui criaria um
      // segundo ponto igual. A verdade é que está guardado, sem leitura.
      if (nascido) {
        e('guardei como ponto (·) — não consegui selar agora. nada se perdeu.', {
          chips: [{ label: 'abrir', action: { type: 'open-item', itemId: nascido.id } }],
        });
        return;
      }
      // nada nasceu — a rede caiu antes do ponto; aí sim a fila é a rede de segurança
      const n = outboxService.enqueue(user.id, reading);
      e(`não consegui guardar agora — foi pra fila (${n}). sobe sozinho quando der.`);
    }
  }

  // ─── os chips de assentimento ──────────────────────────
  async function handleChip(msg: ChatMessage, chip: ChatChip) {
    chat.clearChips(msg.id);
    const a = chip.action;
    if (a.type === 'dismiss') return;
    if (a.type === 'open-hoje') { navigate('/hoje'); return; }
    if (a.type === 'open-item') { selectItem(a.itemId); return; }
    if (a.type === 'confirm-triage') {
      const s = structureFromTriage(a.result);
      try {
        await pipelineService.quickClassifyAndStructure(a.itemId, s.type, s.module, s.body);
        invalidate();
        e(`✓ selado — ${a.result.type} em #${a.result.module}.`);
      } catch {
        e('não consegui selar — o ponto segue no inbox.');
      }
    }
  }

  // ─── a face ────────────────────────────────────────────
  return (
    <div className="px-5 pt-4 pb-36 flex flex-col gap-2.5 min-h-[60dvh]">
      {chat.messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
            m.from === 'me'
              ? 'self-end bg-surface border border-border rounded-br-sm'
              : 'self-start border rounded-bl-sm'
          }`}
          style={m.from === 'e' ? { borderColor: 'color-mix(in srgb, var(--color-accent) 30%, var(--color-border))' } : undefined}
        >
          {m.sig && (
            <div className="text-[10px] font-mono tracking-widest text-accent/80 mb-1">{m.sig}</div>
          )}
          <p className="whitespace-pre-wrap text-text">{m.text}</p>
          {m.infoChips && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {m.infoChips.map((c) => (
                <span key={c} className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-card border border-border text-text-muted">
                  {c}
                </span>
              ))}
            </div>
          )}
          {m.chips && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {m.chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleChip(m, c)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                    c.hot
                      ? 'text-accent border-accent/40 bg-accent/10'
                      : 'text-text-muted border-border bg-card'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {lendo && (
        <div className="self-start border rounded-2xl rounded-bl-sm px-3.5 py-2.5"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 30%, var(--color-border))' }}>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted/50 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={endRef} />

      {/* a boca — fixa, acima da nav */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3 pt-2 bg-gradient-to-t from-bg via-bg to-transparent">
        <div className="flex items-end gap-2 bg-card border border-border rounded-3xl px-4 py-2.5">
          <textarea
            ref={boxRef}
            rows={1}
            value={text}
            onChange={(ev) => {
              setText(ev.target.value);
              ev.target.style.height = 'auto';
              ev.target.style.height = `${Math.min(ev.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); handleSend(); }
            }}
            placeholder="fala, cola, despeja…"
            className="flex-1 bg-transparent outline-none text-sm resize-none placeholder:text-text-muted max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || lendo}
            className="w-8 h-8 rounded-full bg-text text-bg flex items-center justify-center shrink-0 disabled:opacity-30"
            aria-label="despejar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v7M3 6l3-4 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {/* a gramática era privada — os tokens não apareciam em canto nenhum
            da interface. Uma linha faint ensina uma vez, sem virar tutorial. */}
        <p className="text-[10px] font-mono text-text-faint text-center mt-1.5">
          #módulo · @tipo · @amanhã — se já souber onde vai
        </p>
      </div>
    </div>
  );
}
