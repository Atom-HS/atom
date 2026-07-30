// shell/BottomNav.tsx — a nav das faces (D40/D41)
// Só 3 lugares: · hoje, ⬡ árvore, ✳ @. Todo o resto é gesto ou camada.
// Réplica do mockup 03_mapa-navegacao.html (nav.faces): glifo + label mono,
// faint em repouso, dourado quando é onde você está. Ativa pela rota —
// as páginas da casca velha (URL direta, até o gate) não acendem face.

import { NavLink } from 'react-router-dom';

const FACES = [
  { to: '/hoje', glyph: '·', label: 'hoje' },      // ·
  { to: '/arvore', glyph: '⬡', label: 'árvore' }, // ⬡
  { to: '/at', glyph: '✳', label: '@' },           // ✳
];

export function BottomNav({ onOpenCasa }: { onOpenCasa?: () => void }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-20 border-t border-border-soft"
      style={{ background: 'color-mix(in srgb, var(--color-bg) 70%, black)' }}
      role="navigation"
      aria-label="Navegacao principal"
    >
      {/* o puxador da casa — pull discreto (D54): settings é sheet, não lugar.
          A barra sozinha era porta invisível (dado real de 29 Jul: o Rick
          não a achou) — o rótulo mono quieto dá corpo sem virar aba. */}
      {onOpenCasa && (
        <button
          onClick={onOpenCasa}
          className="w-full flex flex-col items-center gap-[3px] pt-1.5 pb-0.5"
          aria-label="a casa — perfil, conectores, export"
        >
          <span className="w-9 h-1 rounded-full bg-border" />
          <span className="font-mono text-[10px] leading-none text-text-faint" aria-hidden="true">
            a casa
          </span>
        </button>
      )}
      <div className="flex items-stretch pb-[max(0rem,env(safe-area-inset-bottom))]">
        {FACES.map((f) => (
          <NavLink
            key={f.to}
            to={f.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-[3px] flex-1 min-h-[52px] pt-3 pb-3.5 font-mono text-[11.5px] transition-colors ${
                isActive ? 'text-gold' : 'text-text-faint'
              }`
            }
            aria-label={f.label}
          >
            {({ isActive }) => (
              <>
                <span className="text-[15px] leading-none" aria-hidden="true">{f.glyph}</span>
                <span aria-current={isActive ? 'page' : undefined}>{f.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
