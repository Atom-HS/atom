// shared/ListChecklist.tsx — a lista viva no detail (Fase 8 · linhagem #20)
// Keep-style: check no lugar, adicionar embaixo, sem cerimônia.
// Mutações vêm puras do engine; quem grava é o caller (update body).
import { useState } from 'react';
import type { AtomItem, ListBody } from '@/types/item';
import { readListBody, toggleEntry, addEntry, removeEntry } from '@/engine/list';

export function ListChecklist({
  item,
  onSave,
}: {
  item: AtomItem;
  onSave: (body: ListBody) => void;
}) {
  const [draft, setDraft] = useState('');
  const { entries } = readListBody(item);

  const add = () => {
    if (!draft.trim()) return;
    onSave(addEntry(item, draft));
    setDraft('');
  };

  return (
    <div className="mb-4">
      <div className="text-[11px] font-medium tracking-[1.2px] uppercase text-text-muted mb-1.5">
        lista{entries.length > 0 ? ` · ${entries.filter((e) => !e.done).length} de ${entries.length}` : ''}
      </div>
      <div className="space-y-1">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center gap-2.5 group">
            <button
              onClick={() => onSave(toggleEntry(item, i))}
              className={`flex-1 flex items-center gap-2.5 text-left px-3 py-2 rounded-lg border transition-colors ${
                entry.done ? 'border-border bg-surface' : 'border-border bg-card'
              }`}
            >
              <span className={`text-sm ${entry.done ? 'text-accent' : 'text-text-muted'}`}>
                {entry.done ? '●' : '○'}
              </span>
              <span className={`text-[13px] ${entry.done ? 'text-text-muted line-through decoration-border' : ''}`}>
                {entry.text}
              </span>
            </button>
            <button
              onClick={() => onSave(removeEntry(item, i))}
              className="text-text-muted text-xs px-1 opacity-40 hover:opacity-100 transition-opacity"
              aria-label={`remover ${entry.text}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="+ item da lista"
          className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-accent/40"
        />
        {draft.trim() && (
          <button onClick={add} className="text-xs text-accent px-2">ok</button>
        )}
      </div>
    </div>
  );
}
