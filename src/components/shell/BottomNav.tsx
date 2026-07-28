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

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-20 border-t border-border-soft"
      style={{ background: 'color-mix(in srgb, var(--color-bg) 70%, black)' }}
      role="navigation"
      aria-label="Navegacao principal"
    >
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
