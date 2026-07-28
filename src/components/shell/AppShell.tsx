// shell/AppShell.tsx — o aparelho (obra 5 · D54/D57)
// Coluna de 430px, mundo escuro deliberado. TopBar morreu com as abas:
// buscar = puxar pra baixo em qualquer face (ou "/"), a casa = puxador
// discreto acima da nav (sheet). Nada é aba; tudo é gesto ou camada.

import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { BottomNav } from './BottomNav';
import { SearchLayer } from './SearchLayer';
import { SettingsSheet } from './SettingsSheet';

const PULL_THRESHOLD = 70; // px de puxada no topo pra abrir a busca

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [casaOpen, setCasaOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const pull = useRef<{ y: number; atTop: boolean } | null>(null);

  // "/" abre a busca (teclado — o gesto do dedo é o puxar)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !typing && !searchOpen && !casaOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, casaOpen]);

  const onTouchStart = (e: TouchEvent) => {
    pull.current = {
      y: e.touches[0].clientY,
      atTop: (mainRef.current?.scrollTop ?? 1) <= 0,
    };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = pull.current;
    pull.current = null;
    if (!start?.atTop || searchOpen || casaOpen) return;
    const delta = e.changedTouches[0].clientY - start.y;
    if (delta > PULL_THRESHOLD) setSearchOpen(true);
  };

  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex flex-col mx-auto w-full max-w-[430px] border-x border-border/50 relative pt-[env(safe-area-inset-top)]">
      <main
        ref={mainRef}
        className="flex-1 pb-20 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </main>

      <BottomNav onOpenCasa={() => setCasaOpen(true)} />

      {searchOpen && <SearchLayer onClose={() => setSearchOpen(false)} />}
      {casaOpen && <SettingsSheet onClose={() => setCasaOpen(false)} />}
    </div>
  );
}
