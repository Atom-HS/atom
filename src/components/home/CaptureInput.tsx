// home/CaptureInput.tsx — Captura híbrida: input livre + popover contextual + pílulas
// Digita `#` ou `@` → popover compacto logo abaixo do cursor com opções filtráveis.
// Tokens reconhecidos viram pílulas coloridas em UMA linha embaixo do input.
// Setas navegam, Enter aceita, Esc fecha.

import { useState, useRef, useMemo, useEffect } from 'react';
import { parseCapture, MODULES, type ParsedCapture } from '@/engine/token-parser';
import type { AtomModule, AtomType } from '@/types/item';

const COMMON_TYPES: ReadonlyArray<AtomType> = ['task', 'note', 'reflection', 'project', 'habit', 'recipe', 'workout', 'spec', 'doc'];
const DATE_TOKENS: ReadonlyArray<string> = ['hoje', 'amanha', 'semana', 'seg', 'ter', 'qua', 'qui', 'sex'];

const MODULE_COLORS: Record<AtomModule, string> = {
  work: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  body: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  mind: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  family: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  purpose: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  bridge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
  finance: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  social: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
};

const TYPE_COLOR = 'bg-text/10 text-text border-text/20';
const DATE_COLOR = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

interface CaptureInputProps {
  placeholder?: string;
  onSubmit: (parsed: ParsedCapture) => void | Promise<void>;
}

interface ActiveTrigger {
  char: '#' | '@';
  prefix: string;
  start: number;
}

function detectTrigger(text: string, caretPos: number): ActiveTrigger | null {
  for (let i = caretPos - 1; i >= 0; i--) {
    const c = text[i];
    if (c === ' ' || c === '\t') return null;
    if (c === '#' || c === '@') {
      return { char: c, prefix: text.slice(i + 1, caretPos), start: i };
    }
  }
  return null;
}

export function CaptureInput({ placeholder = 'o que esta na cabeca?', onSubmit }: CaptureInputProps) {
  const [text, setText] = useState('');
  const [caretPos, setCaretPos] = useState(0);
  const [trigger, setTrigger] = useState<ActiveTrigger | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = parseCapture(text);

  const options = useMemo<string[]>(() => {
    if (!trigger) return [];
    const prefix = trigger.prefix.toLowerCase();
    if (trigger.char === '#') {
      return MODULES.filter((m) => m.startsWith(prefix));
    }
    // @ — types + dates
    const both = [...COMMON_TYPES, ...DATE_TOKENS];
    return both.filter((o) => o.startsWith(prefix));
  }, [trigger]);

  useEffect(() => { setHighlightIdx(0); }, [trigger?.char, trigger?.prefix]);

  const updateCaret = () => {
    const pos = inputRef.current?.selectionStart ?? 0;
    setCaretPos(pos);
    setTrigger(detectTrigger(text, pos));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const pos = e.target.selectionStart ?? 0;
    setCaretPos(pos);
    setTrigger(detectTrigger(e.target.value, pos));
  };

  const acceptOption = (opt: string) => {
    if (!trigger) return;
    const before = text.slice(0, trigger.start);
    const after = text.slice(caretPos);
    const inserted = `${trigger.char}${opt}`;
    const newText = `${before}${inserted}${after}`;
    setText(newText);
    setTrigger(null);
    const newCaret = before.length + inserted.length;
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(newCaret, newCaret);
      setCaretPos(newCaret);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (trigger && options.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx((i) => (i + 1) % options.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx((i) => (i - 1 + options.length) % options.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); acceptOption(options[highlightIdx]); return; }
      if (e.key === 'Escape') { e.preventDefault(); setTrigger(null); return; }
    }
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
  };

  const handleSubmit = async () => {
    if (!parsed.title) return;
    await onSubmit(parsed);
    setText('');
    setTrigger(null);
  };

  const dueLabel = useMemo(() => {
    if (!parsed.dueDate) return null;
    const m = text.match(/@(hoje|amanha|amanhã|semana|seg|ter|qua|qui|sex|sab|sáb|dom)\b/i);
    return m ? m[1].toLowerCase() : parsed.dueDate;
  }, [parsed.dueDate, text]);

  const hasPills = parsed.module || parsed.type || parsed.dueDate;

  return (
    <div className="relative">
      <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-35">
          <circle cx="7" cy="7" r="2.5" fill="currentColor" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCaret}
          onClick={updateCaret}
          onBlur={() => setTimeout(() => setTrigger(null), 150)}
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

      {trigger && options.length > 0 && (
        <div className="absolute left-8 top-full mt-1 z-10 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-35">
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); acceptOption(opt); }}
              onMouseEnter={() => setHighlightIdx(i)}
              className={`block w-full text-left text-xs px-3 py-1.5 ${
                i === highlightIdx ? 'bg-text/10 text-text' : 'text-text-muted'
              }`}
            >
              {trigger.char}{opt}
            </button>
          ))}
        </div>
      )}

      {hasPills && (
        <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
          {parsed.module && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${MODULE_COLORS[parsed.module]}`}>
              {parsed.module}
            </span>
          )}
          {parsed.type && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${TYPE_COLOR}`}>
              {parsed.type}
            </span>
          )}
          {dueLabel && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${DATE_COLOR}`}>
              {dueLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
