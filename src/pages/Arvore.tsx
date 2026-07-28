// pages/Arvore.tsx — Face ÁRVORE (Onda 3 · branch v2-faces)
// A vida vista de cima: 8 ramos real × ideal (o baseline é o teu passado,
// nunca meta), janelas φ, o espelho no tempo (F9) e as folhas recentes.
// Maturação se vê no galho (· → ○), não em funil (D48). Toque no ramo
// abre o drill; o chão da árvore leva à raiz (D50). O espelho nasce
// quieto — "ainda ouvindo teus dias" — e acorda com a semana vivida.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { useAppStore } from '@/store/app-store';
import { eventService } from '@/service/item-service';
import { treeShape, synthesis, TREE_WINDOWS, BRANCH_LABEL, type Branch, type TreeWindow } from '@/engine/tree';
import { mirror } from '@/engine/mirror';
import { simEvents } from '@/dev/sim-week';
import type { AtomItem, AtomModule } from '@/types/item';

// idade da folha, quieta: hoje · ontem · Nd (estado, nunca cobrança — D46)
function ageLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? 'hoje' : days === 1 ? 'ontem' : `${days}d`;
}

const MOD_COLOR: Record<AtomModule, string> = {
  work: 'var(--color-mod-work)', body: 'var(--color-mod-body)',
  mind: 'var(--color-mod-mind)', family: 'var(--color-mod-family)',
  purpose: 'var(--color-mod-purpose)', bridge: 'var(--color-mod-bridge)',
  finance: 'var(--color-mod-finance)', social: 'var(--color-mod-social)',
};

// ─── a copa: 8 ramos em leque, SVG ───────────────────
function TreeCrown({ branches, selected, onSelect }: {
  branches: Branch[];
  selected: AtomModule | null;
  onSelect: (m: AtomModule) => void;
}) {
  const W = 340, H = 250, cx = W / 2, cy = H * 0.82, maxR = 118;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label="árvore da vida: 8 ramos, real × ideal">
      {branches.map((b, i) => {
        // leque no hemisfério de cima (mesma geometria do mockup)
        const a = Math.PI - (Math.PI * (i + 0.8)) / (branches.length + 0.6);
        const dx = Math.cos(a), dy = -Math.sin(a) * 0.95;
        const ideal = maxR * (0.35 + b.ideal * 0.65);
        const real = maxR * (0.35 + b.real * 0.65);
        const px = -dy * 22, py = dx * 22; // curva orgânica
        const color = MOD_COLOR[b.module];
        const dim = selected !== null && selected !== b.module;
        const path = (len: number) =>
          `M ${cx} ${cy} Q ${cx + dx * len * 0.5 + px} ${cy + dy * len * 0.5 + py} ${cx + dx * len} ${cy + dy * len}`;

        return (
          <g key={b.module} opacity={dim ? 0.25 : 1} onClick={() => onSelect(b.module)} style={{ cursor: 'pointer' }}>
            <path d={path(ideal)} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="4 5" opacity=".35" />
            <path d={path(real)} fill="none" stroke={color} strokeWidth="3" opacity=".85" strokeLinecap="round" />
            {b.leaves.slice(0, 4).map((_, l) => {
              const n = Math.min(b.leaves.length, 4);
              const f = 0.45 + ((l + 1) / (n + 1)) * 0.55;
              return (
                <circle key={l}
                  cx={cx + dx * real * f + px * (1 - f) * 0.4}
                  cy={cy + dy * real * f + py * (1 - f) * 0.4}
                  r="3.6" fill={color} opacity=".9"
                />
              );
            })}
            {b.saturated && (
              <circle cx={cx + dx * real} cy={cy + dy * real} r="7" fill="none" stroke={color} strokeWidth="1.6" />
            )}
            <text
              x={cx + dx * (maxR + 16)} y={cy + dy * (maxR + 16) + 4}
              fontSize="10.5" fontFamily="monospace"
              fill={selected === b.module ? 'var(--color-accent)' : 'var(--color-text-muted)'}
              textAnchor={dx > 0.25 ? 'start' : dx < -0.25 ? 'end' : 'middle'}
            >
              {BRANCH_LABEL[b.module]}
            </text>
          </g>
        );
      })}
      {/* o tronco */}
      <line x1={cx} y1={cy} x2={cx} y2={cy + 34} stroke="var(--color-warning)" strokeWidth="4.5" opacity=".85" strokeLinecap="round" />
    </svg>
  );
}

// ─── a face ──────────────────────────────────────────
export function ArvorePage() {
  const navigate = useNavigate();
  const { selectItem } = useNav();
  const { items } = useItems();
  const user = useAppStore((s) => s.user);
  const [winKey, setWinKey] = useState<TreeWindow['key']>('semana');
  const [selected, setSelected] = useState<AtomModule | null>(null);

  const all = useMemo(() => (items ?? []) as AtomItem[], [items]);

  // o rastro que o espelho lê (protocol_run · Fase 7 → F9)
  const { data: runs } = useQuery({
    queryKey: ['events', 'protocol_run'],
    enabled: !!user,
    queryFn: () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      return eventService.listByType(user!.id, 'protocol_run', since.toISOString());
    },
  });

  const branches = useMemo(() => treeShape(all, winKey), [all, winKey]);
  const line = useMemo(() => synthesis(branches), [branches]);
  const espelho = useMemo(() => mirror(all, [...(runs ?? []), ...simEvents()]), [all, runs]);

  const folhas = useMemo(
    () =>
      branches
        .flatMap((b) => b.leaves.map((l) => ({ ...l, module: b.module })))
        .sort((a, b) => b.when.localeCompare(a.when))
        .slice(0, 4),
    [branches],
  );

  const drill = selected ? branches.find((b) => b.module === selected) : null;

  return (
    <div className="px-5 pt-2 pb-24">
      <TreeCrown
        branches={branches}
        selected={selected}
        onSelect={(m) => setSelected((cur) => (cur === m ? null : m))}
      />

      {/* a síntese — estado, nunca julgamento; quieta se a árvore está quieta */}
      {line && <p className="text-center text-sm italic text-text-muted -mt-1 mb-3 text-balance">{line}</p>}

      {/* janelas φ */}
      <div className="flex gap-1.5 justify-center flex-wrap mb-3">
        {TREE_WINDOWS.map((w) => (
          <button
            key={w.key}
            onClick={() => setWinKey(w.key)}
            className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
              w.key === winKey
                ? 'text-accent border-accent/40 bg-accent/10'
                : 'text-text-muted border-border bg-card'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* o drill do ramo — toque abriu */}
      {drill && (
        <section className="bg-card border border-border rounded-xl p-4 mb-3" style={{ borderLeftWidth: 3, borderLeftColor: MOD_COLOR[drill.module] }}>
          <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-1.5">
            {BRANCH_LABEL[drill.module]} · {drill.total > 0 ? `${drill.total} ${drill.total === 1 ? 'folha' : 'folhas'} na janela` : 'sem folha nesta janela'}
          </h4>
          {drill.leaves.map(({ item, when }) => (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              className="flex items-center gap-2 w-full text-left py-1.5 text-sm border-b border-surface last:border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: MOD_COLOR[drill.module] }} />
              <span className="truncate text-text">{item.title}</span>
              <span className="ml-auto text-[10px] font-mono text-text-muted shrink-0">
                {ageLabel(when)} {item.status === 'completed' ? '○' : '·'}
              </span>
            </button>
          ))}
          {drill.total > drill.leaves.length && (
            <p className="text-[10px] font-mono text-text-muted mt-1.5">
              +{drill.total - drill.leaves.length} mais antigas na janela
            </p>
          )}
        </section>
      )}

      {/* o espelho no tempo — F9, ou o silêncio honesto */}
      <section className="bg-card border rounded-xl p-4 mb-3" style={{ borderColor: 'color-mix(in srgb, var(--color-mod-mind) 35%, var(--color-border))' }}>
        <h4 className="text-[11px] font-semibold tracking-wider mb-1" style={{ color: 'color-mix(in srgb, var(--color-mod-mind) 70%, var(--color-text-muted))' }}>
          ○ espelho no tempo · f9
        </h4>
        {espelho ? (
          <p className="text-[13px] text-text-muted">{espelho.text}</p>
        ) : (
          <p className="text-[13px] text-text-muted italic">ainda ouvindo seus dias — o espelho acorda com a semana vivida.</p>
        )}
      </section>

      {/* folhas recentes — a seiva nova */}
      {folhas.length > 0 && (
        <section className="bg-card border border-border rounded-xl p-4 mb-3">
          <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-1.5">folhas recentes · a seiva nova</h4>
          {folhas.map(({ item, module }) => (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              className="flex items-center gap-2 w-full text-left py-1.5 text-[13px] border-b border-surface last:border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: MOD_COLOR[module] }} />
              <span className="truncate text-text">{item.title}</span>
              <span className="ml-auto text-[10px] font-mono text-text-muted shrink-0">{BRANCH_LABEL[module]}</span>
            </button>
          ))}
        </section>
      )}

      {/* o chão da árvore — a raiz mora embaixo do tronco (D50) */}
      <button
        onClick={() => navigate('/raiz')}
        className="w-full py-3 rounded-xl text-sm border border-border text-text-muted bg-card text-left px-4"
      >
        ○ <span className="text-text">o chão da árvore</span>
        <span className="block text-xs mt-0.5">a raiz mora embaixo do tronco — estado quieto, nunca meta</span>
      </button>
    </div>
  );
}
