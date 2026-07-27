// dev/SimBanner.tsx — o aviso da semana simulada + atalhos das faces novas
// Visível sempre que a sim está ligada: ninguém confunde ficção com tronco,
// e ninguém se perde na casca velha (a raiz "/" segue sendo a Home antiga
// até o gate — D41). Os atalhos são affordance de dev, não a nav do gate.
import { NavLink } from 'react-router-dom';
import { simActive } from './sim-week';

const FACES = [
  { to: '/hoje', label: '· hoje' },
  { to: '/arvore', label: '⬡ árvore' },
  { to: '/at', label: '✳ @' },
];

export function SimBanner() {
  if (!simActive()) return null;
  return (
    <div className="sticky top-0 z-30 text-[11px] font-mono py-1.5 px-3 bg-warning/15 text-warning border-b border-warning/25 flex items-center justify-center gap-3 flex-wrap">
      <span>🜂 semana simulada · tronco intocado</span>
      <span className="flex gap-2">
        {FACES.map((f) => (
          <NavLink
            key={f.to}
            to={f.to}
            className={({ isActive }) => `px-2 py-0.5 rounded-full border border-warning/30 ${isActive ? 'bg-warning/20 font-medium' : ''}`}
          >
            {f.label}
          </NavLink>
        ))}
      </span>
      <a href="?sim=0" className="underline opacity-80">desligar</a>
    </div>
  );
}
