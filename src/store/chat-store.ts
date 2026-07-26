// store/chat-store.ts — a conversa do @ (Onda 3 · face @)
// Volátil por desenho: o TRONCO é a memória (items); a conversa é superfície
// do dia. Vive em Zustand (sobrevive à navegação), evapora no reload/virada
// — mesmo padrão do soul-store. Chips = assentimento: descritores de ação
// que a face executa; aqui só dados.
import { create } from 'zustand';
import { localDayKey } from '@/engine/dates';
import type { TriageResult } from '@/service/triage-service';

export type ChipAction =
  | { type: 'open-hoje' }
  | { type: 'open-item'; itemId: string }
  | { type: 'confirm-triage'; itemId: string; result: TriageResult }
  | { type: 'dismiss' };

export interface ChatChip {
  label: string;
  hot?: boolean; // o caminho convidado (dourado); os outros são quietos
  action: ChipAction;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'e';
  text: string;
  sig?: string;        // assinatura do E. ("E." | "E. · bilhete")
  chips?: ChatChip[];  // consumidos após o gesto (a face limpa)
  infoChips?: string[]; // leitura pura ("△ task · #work · 92%") — sem ação
}

interface ChatState {
  dayKey: string | null;
  messages: ChatMessage[];
  push: (msg: Omit<ChatMessage, 'id'>) => void;
  clearChips: (messageId: string) => void;
  ensureToday: () => void;
}

let seq = 0;
const nextId = () => `m${Date.now()}-${seq++}`;

const SEED: Omit<ChatMessage, 'id'> = { from: 'e', sig: 'E.', text: 'o que chegou?' };

export const useChatStore = create<ChatState>((set, get) => ({
  dayKey: null,
  messages: [],

  push: (msg) => set((s) => ({ messages: [...s.messages, { ...msg, id: nextId() }] })),

  clearChips: (messageId) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === messageId ? { ...m, chips: undefined } : m)),
    })),

  // Dia virou (ou primeira visita) → conversa nova, E. abre a porta.
  ensureToday: () => {
    const today = localDayKey();
    if (get().dayKey !== today) {
      set({ dayKey: today, messages: [{ ...SEED, id: nextId() }] });
    }
  },
}));
