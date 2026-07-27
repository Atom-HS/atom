// pages/Hoje.tsx — Face HOJE (Onda 3 · branch v2-faces)
// O arco do dia como espinha: céu real → chegada → sentinela → cadeia →
// fixos → o que cabe agora → pills → fechar. Lei do desenho (parecer-ux):
// simples na superfície, fundo inteiro atrás; uma coisa por vez; o céu
// anda no horário de verdade (engine/sky) — misticismo discreto.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '@/hooks/useItems';
import { useConnections } from '@/hooks/useConnections';
import { useNav } from '@/hooks/useNav';
import { useSoulStore } from '@/store/soul-store';
import { getCurrentPeriod } from '@/types/ui';
import { AuroraRitual } from '@/components/home/AuroraRitual';
import { ProtocolBanner } from '@/components/home/ProtocolBanner';
import { skyNow, sunTimes, fmtMin } from '@/engine/sky';
import { MODULE_COLORS } from '@/components/atoms/tokens';
import { suggestNow } from '@/engine/today';
import { routinesForSlot, chainProgress } from '@/engine/routine';
import { listLists, listSummary } from '@/engine/list';
import { listProjects, projectPresence, presenceLine } from '@/engine/project';
import type { AtomItem } from '@/types/item';

function isTodayISO(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// um acontecimento do dia pousado no arco (D59)
export interface ArcMark {
  t: number;      // 0..1 na caminhada do sol
  color: string;  // a cor do módulo
  title: string;
}

// ─── o céu no horário real ───────────────────────────
function SkyArc({ marks }: { marks: ArcMark[] }) {
  const baseRef = useRef<SVGPathElement>(null);
  const [tick, setTick] = useState(0);
  const [geo, setGeo] = useState<{ px: number; py: number; dash: string; pts: Array<ArcMark & { x: number; y: number }> }>({
    px: 170, py: 14, dash: '0 1000', pts: [],
  });

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const sky = skyNow(now);
  const { sunriseMin, sunsetMin } = sunTimes(now);
  const color = sky.isDay ? 'var(--color-warning)' : '#aeb6c6';
  const marksKey = marks.map((m) => `${m.t.toFixed(3)}${m.color}`).join('|');

  // mede o path real (bezier) fora do render — lint da casa
  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;
    const L = base.getTotalLength();
    const p = base.getPointAtLength(L * sky.t);
    setGeo({
      px: p.x,
      py: p.y,
      dash: `${(L * sky.t).toFixed(1)} ${(L * 1.2).toFixed(1)}`,
      pts: marks.map((m) => {
        const q = base.getPointAtLength(L * m.t);
        return { ...m, x: q.x, y: q.y };
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sky.t, tick, marksKey]);
  const { px, py, dash, pts } = geo;

  return (
    <div className="pt-4 text-center">
      <svg viewBox="0 0 340 78" className="w-full overflow-visible" role="img" aria-label="arco do dia — céu no horário real">
        <path ref={baseRef} d="M 20 64 Q 170 -20 320 64" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
        <path d="M 20 64 Q 170 -20 320 64" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={dash} opacity=".8" />
        <circle cx="20" cy="64" r="3" fill="var(--color-warning)" opacity=".7" />
        <circle cx="320" cy="64" r="3" fill="var(--color-border)" />
        {/* os acontecimentos do dia, na cor do módulo (D59) — estado, nunca cobrança */}
        {pts.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r="2.6" fill={m.color} opacity=".9">
            <title>{m.title}</title>
          </circle>
        ))}
        <g transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`}>
          <circle r="9" fill={color} opacity=".14" />
          <text textAnchor="middle" dy="4" fontSize="12" fill={color}>{sky.glyph}</text>
          <text textAnchor="middle" dy="21" fontSize="8.5" fill="var(--color-text-muted)" fontFamily="monospace">
            {fmtMin(sky.minutes)}
          </text>
        </g>
      </svg>
      <div className="flex justify-between px-2 text-[10px] font-mono text-text-muted -mt-1">
        <span>☀ {fmtMin(sunriseMin)}</span>
        <span className="opacity-70">{sky.isDay ? 'dia caminhando' : 'noite'} · {sky.phaseName}</span>
        <span>☽ {fmtMin(sunsetMin)}</span>
      </div>
    </div>
  );
}

// ─── a face ──────────────────────────────────────────
export function HojePage() {
  const navigate = useNavigate();
  const { items, isLoading } = useItems();
  const { connections } = useConnections();
  const { selectItem } = useNav();
  const soul = useSoulStore();
  const period = getCurrentPeriod();
  const [skip, setSkip] = useState(0);

  const all = useMemo(() => (items ?? []) as AtomItem[], [items]);

  // os acontecimentos de hoje pousam no arco: nasceu ou selou → ponto na
  // cor do módulo, na hora em que aconteceu (pedido do Rick, D59)
  const marks = useMemo(() => {
    const { sunriseMin, sunsetMin } = sunTimes(new Date());
    const span = Math.max(1, sunsetMin - sunriseMin);
    return all
      .filter((i) => i.module)
      .map((i) => {
        const born = isTodayISO(i.created_at);
        const sealed = i.status === 'completed' && isTodayISO(i.updated_at);
        if (!born && !sealed) return null;
        const when = new Date(born ? i.created_at : i.updated_at);
        const min = when.getHours() * 60 + when.getMinutes();
        return {
          t: Math.min(0.97, Math.max(0.03, (min - sunriseMin) / span)),
          color: MODULE_COLORS[i.module as keyof typeof MODULE_COLORS],
          title: `${i.title} · ${when.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => a.t - b.t)
      .slice(0, 16);
  }, [all]);

  const fixos = useMemo(
    () =>
      all
        .filter((i) => {
          const start = (i.body as Record<string, unknown> | null)?.start;
          return typeof start === 'string' && isTodayISO(start);
        })
        .sort((a, b) =>
          String((a.body as Record<string, unknown>).start).localeCompare(
            String((b.body as Record<string, unknown>).start),
          ),
        ),
    [all],
  );

  const cadeias = useMemo(() => routinesForSlot(all, period.key), [all, period.key]);
  const sugestao = useMemo(() => suggestNow(all, new Date().toISOString(), skip), [all, skip]);

  const pills = useMemo(() => {
    const ls = listLists(all)
      .map((l) => ({ item: l, sum: listSummary(l) }))
      .filter((p) => p.sum && !p.sum.includes('✓'));
    const pr = listProjects(all)
      .filter((p) => p.status === 'active')
      .map((p) => ({ item: p, presence: projectPresence(p, all, connections) }))
      .filter((p) => p.presence.open.length > 0)
      .sort((a, b) => b.presence.open.length - a.presence.open.length);
    return { listas: ls.slice(0, 2), projeto: pr[0] ?? null };
  }, [all, connections]);

  const auroraDoTronco = useMemo(
    () =>
      all.find(
        (i) => i.type === 'checkpoint' && isTodayISO(i.created_at) && i.tags?.includes('aurora'),
      ),
    [all],
  );
  const soulBody = (auroraDoTronco?.body as Record<string, unknown> | null)?.soul as
    | { emotion_before?: string | null }
    | undefined;
  const emotion = soul.emotion ?? soulBody?.emotion_before ?? null;
  const intention = soul.intention ?? auroraDoTronco?.notes ?? null;

  return (
    // padrão da casa: página usa só padding — o AppShell já limita a 430px
    <div className="px-5 pb-24">
      <AuroraRitual />

      <SkyArc marks={marks} />

      {/* chegada */}
      <div className="text-center my-4">
        {emotion ? (
          <>
            <p className="text-lg italic font-medium text-text-heading">“cheguei {emotion}”</p>
            {intention && <p className="text-xs text-text-muted mt-1">{intention}</p>}
          </>
        ) : (
          <p className="text-sm text-text-muted">o dia ainda não chegou — a aurora pergunta</p>
        )}
      </div>

      {/* sentinela — o protocolo acordado pela alma (F7, reusado) */}
      <ProtocolBanner />

      {/* cadeia do período atual */}
      {cadeias.map((rotina) => {
        const prog = chainProgress(rotina, all);
        return (
          <section key={rotina.id} className="bg-card border border-border rounded-xl p-4 mb-3">
            <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-2">
              ⛓ {period.label.toLowerCase()} · {rotina.title}
            </h4>
            <div className="flex items-center gap-2 text-[13px] flex-wrap">
              {prog.links.map((l, i) => (
                <span key={i} className={l.done ? 'text-success-text' : 'text-text-muted'}>
                  {l.done ? '●' : '○'} {l.item.title}
                </span>
              ))}
              <span className="ml-auto text-[11px] italic text-text-muted">
                {prog.done} de {prog.total} · sela sozinha
              </span>
            </div>
          </section>
        );
      })}

      {/* fixos de hoje */}
      <section className="bg-card border border-border rounded-xl p-4 mb-3">
        <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-2">fixos de hoje</h4>
        {fixos.length === 0 && <p className="text-sm text-text-muted">nenhum bloco duro hoje</p>}
        {fixos.map((i) => (
          <div key={i.id} className="flex gap-3 py-1.5 text-sm border-b border-surface last:border-0">
            <span className="text-text-muted text-xs pt-0.5 font-mono">
              {timeOf(String((i.body as Record<string, unknown>).start))}
            </span>
            <span className="text-text">{i.title}</span>
          </div>
        ))}
      </section>

      {/* o que cabe agora — UMA sugestão */}
      <section className="bg-card border border-border rounded-xl p-4 mb-3" style={{ borderColor: 'color-mix(in srgb, var(--color-mod-body) 30%, var(--color-border))' }}>
        <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-1">o que cabe agora</h4>
        {isLoading ? (
          <p className="text-sm text-text-muted">…</p>
        ) : sugestao ? (
          <>
            <button onClick={() => selectItem(sugestao.item.id)} className="text-[15px] text-text text-left block">
              {sugestao.item.title}
            </button>
            <p className="text-xs text-text-muted italic mt-0.5">{sugestao.reason}</p>
            <button onClick={() => setSkip((s) => s + 1)} className="text-[11px] text-accent mt-2">
              me dá outra
            </button>
          </>
        ) : (
          <p className="text-sm text-text-muted">nada pedindo agora — o dia é seu</p>
        )}
      </section>

      {/* pills puxáveis — contexto sob demanda */}
      {(pills.listas.length > 0 || pills.projeto) && (
        <div className="flex gap-2 flex-wrap mb-4">
          {pills.listas.map(({ item, sum }) => (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              className="text-xs text-text-muted border border-border bg-card rounded-full px-3 py-1.5"
            >
              🛒 {item.title} · <b className="text-text font-medium">{sum}</b>
            </button>
          ))}
          {pills.projeto && (
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-text-muted border border-border bg-card rounded-full px-3 py-1.5"
            >
              ⛓ {pills.projeto.item.title} · <b className="text-text font-medium">{presenceLine(pills.projeto.presence)}</b>
            </button>
          )}
        </div>
      )}

      {/* fechar o dia → wrap (a cerimônia fica) */}
      <button
        onClick={() => navigate('/wrap')}
        className="w-full py-3.5 rounded-xl text-sm font-medium border border-border text-accent bg-surface"
      >
        ○ fechar o dia
      </button>
    </div>
  );
}
