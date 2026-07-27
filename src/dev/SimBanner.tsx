// dev/SimBanner.tsx — a barra de dev da v2-faces
// Duas funções: (1) atalhos das 3 faces — SEMPRE visíveis nesta branch,
// porque a nav de baixo ainda é a casca velha e sem porta o Rick se perde;
// (2) o aviso da semana simulada quando ?sim=1 está ligada (tronco intocado).
// Isto é affordance de dev, não a nav do gate — morre quando a nav virar · ⬡ ✳ (D41).
import { NavLink } from 'react-router-dom';
import { simActive } from './sim-week';

const FACES = [
  { to: '/hoje', label: '· hoje' },
  { to: '/arvore', label: '⬡ árvore' },
  { to: '/at', label: '✳ @' },
];

export function SimBanner() {
  const sim = simActive();
  return (
    <div className="sticky top-0 z-30 text-[11px] font-mono py-1.5 px-3 bg-warning/15 text-warning border-b border-warning/25 flex items-center justify-center gap-3 flex-wrap">
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
      {sim ? (
        <span>🜂 semana simulada · tronco intocado · <a href="?sim=0" className="underline">desligar</a></span>
      ) : (
        <a href="?sim=1" className="underline opacity-70">simular semana</a>
      )}
    </div>
  );
}
