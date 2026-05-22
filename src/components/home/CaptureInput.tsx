// home/CaptureInput.tsx — Captura híbrida: input livre + tokens + chips
// Tokens #module / @type / @date são parseados em tempo real e refletidos nos chips.
// Clicar chip toggles o token no texto. onSubmit recebe ParsedCapture estruturado.

import { useState } from 'react';
import { parseCapture, MODULES, type ParsedCapture } from '@/engine/token-parser';
import type { AtomType } from '@/types/item';

const COMMON_TYPES: ReadonlyArray<AtomType> = ['task', 'note', 'reflection', 'project', 'habit'];

const DATE_CHIPS: ReadonlyArray<{ label: string; token: string }> = [
  { label: 'hoje', token: 'hoje' },
  { label: 'amanhã', token: 'amanha' },
  { label: 'semana', token: 'semana' },
];

interface CaptureInputProps {
  placeholder?: string;
  onSubmit: (parsed: ParsedCapture) => void | Promise<void>;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
        active
          ? 'bg-accent text-bg'
          : 'bg-card border border-border text-text-muted hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

export function CaptureInput({ placeholder = 'o que esta na cabeca?', onSubmit }: CaptureInputProps) {
  const [text, setText] = useState('');
  const parsed = parseCapture(text);

  const toggleToken = (token: string) => {
    const re = new RegExp(`\\s*${escapeRegExp(token)}(?=\\s|$|[.,;!?])`, 'gi');
    if (re.test(text)) {
      setText(text.replace(re, '').replace(/\s+/g, ' ').trim());
    } else {
      setText(text.trim() ? `${text.trim()} ${token}` : token);
    }
  };

  const handleSubmit = async () => {
    if (!parsed.title) return;
    await onSubmit(parsed);
    setText('');
  };

  const dateActive = (tokenWord: string) => new RegExp(`@${tokenWord}(?=\\s|$|[.,;!?])`, 'i').test(text);

  return (
    <div className="space-y-2">
      <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-35">
          <circle cx="7" cy="7" r="2.5" fill="currentColor" />
        </svg>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-text-muted"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!parsed.title}
          className="w-9 h-9 rounded-full bg-text text-bg flex items-center justify-center shrink-0 disabled:opacity-30"
          aria-label="Capturar"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v7M3 6l3-4 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {MODULES.map((m) => (
          <Chip key={m} active={parsed.module === m} onClick={() => toggleToken(`#${m}`)}>
            {m}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {COMMON_TYPES.map((t) => (
          <Chip key={t} active={parsed.type === t} onClick={() => toggleToken(`@${t}`)}>
            {t}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {DATE_CHIPS.map((d) => (
          <Chip key={d.token} active={dateActive(d.token)} onClick={() => toggleToken(`@${d.token}`)}>
            {d.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
