// shell/TopBar.tsx — o topo quieto do mundo novo (D57)
// Wordmark mono que sussurra e volta pro HOJE. As duas portas da direita
// (buscar, menu) são andaime: D54 manda busca virar gesto e settings virar
// sheet — morrem na obra 5 da fila (06_paginas-internas_mapa.md).

import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-1">
      <button
        onClick={() => navigate('/hoje')}
        className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-faint"
      >
        atom
      </button>

      <div className="flex items-center">
        {/* Buscar — vira gesto (D54, obra 5) */}
        <button
          onClick={() => navigate('/search')}
          className="w-11 h-11 flex items-center justify-center text-text-faint"
          aria-label="Buscar"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu — vira sheet (D54, obra 5) */}
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 flex items-center justify-center text-text-faint"
          aria-label="Menu"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="2" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
