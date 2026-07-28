// shell/SearchLayer.tsx — buscar = gesto, não aba (D54 · obra 5)
// Puxou pra baixo em qualquer face (ou "/" no teclado) → este overlay.
// O motor (engine/search) ficou; a aba morreu. v2: buscar = perguntar ao @.

import { useState, useMemo, useRef, useEffect } from 'react';
import { useItems } from '@/hooks/useItems';
import { useNav } from '@/hooks/useNav';
import { parseSearchQuery, searchItems } from '@/engine/search';
import { MODULE_COLORS, STAGE_GEOMETRIES, getTypeColor } from '@/components/atoms/tokens';
import type { AtomItem } from '@/types/item';

interface SearchLayerProps {
  onClose: () => void;
}

function touchOf(i: AtomItem): string {
  return i.updated_at && i.updated_at > i.created_at ? i.updated_at : i.created_at;
}

export function SearchLayer({ onClose }: SearchLayerProps) {
  const { items } = useItems();
  const { selectItem } = useNav();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(
    () => (query.trim() ? searchItems(items, parseSearchQuery(query)) : []),
    [items, query],
  );

  // recentes — as últimas coisas tocadas, quando a boca está vazia
  const recentes = useMemo(
    () =>
      [...items]
        .filter((i) => i.status !== 'archived' && i.state !== 'archived')
        .sort((a, b) => touchOf(b).localeCompare(touchOf(a)))
        .slice(0, 6),
    [items],
  );

  const open = (id: string) => {
    selectItem(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-sm mx-auto w-full max-w-[430px] flex flex-col" role="dialog" aria-label="Buscar">
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2.5">
          <span className="text-text-faint text-xs">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="buscar no tronco…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-text-faint"
          />
        </div>
        <button onClick={onClose} className="font-mono text-[11px] text-gold-dim" aria-label="Fechar busca">
          fechar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {!query.trim() && recentes.length > 0 && (
          <>
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5">recentes</div>
            {recentes.map((item) => <ResultRow key={item.id} item={item} onOpen={open} />)}
            <p className="font-mono text-[10px] text-text-faint text-center mt-6">
              pra afinar: mod: · tipo: · tag:
            </p>
          </>
        )}

        {query.trim() && (
          <>
            {results.map(({ item }) => <ResultRow key={item.id} item={item} onOpen={open} />)}
            {results.length === 0 && (
              <p className="text-sm text-text-muted text-center py-10">nada com esse nome no tronco</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResultRow({ item, onOpen }: { item: AtomItem; onOpen: (id: string) => void }) {
  const moduleColor = item.module ? MODULE_COLORS[item.module] : 'var(--color-mod-bridge)';
  const geo = STAGE_GEOMETRIES[item.genesis_stage] ?? '·';
  const typeColor = item.type ? getTypeColor(item.type) : 'var(--color-mod-bridge)';

  return (
    <button
      onClick={() => onOpen(item.id)}
      className="w-full flex items-center gap-2.5 p-2.5 mb-1 bg-card border border-border-soft rounded-xl text-left"
    >
      <span className="w-[3px] h-6 rounded-sm shrink-0" style={{ background: moduleColor }} />
      <span className="font-mono text-xs text-gold-dim">{geo}</span>
      <span className="flex-1 min-w-0 text-[13px] truncate">{item.title}</span>
      {item.type && (
        <span
          className="font-mono text-[9px] px-1.5 py-px rounded-full shrink-0"
          style={{ background: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}
        >
          {item.type}
        </span>
      )}
    </button>
  );
}
