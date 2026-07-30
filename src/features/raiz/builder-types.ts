// features/raiz/builder-types.ts — Routine Builder types

import type { AtomModule, AtomType } from '@/types/item';

export type InputType = 'yesno' | 'choice' | 'freetext' | 'time' | 'frequency';

export type RitualSlot = 'aurora' | 'zenite' | 'crepusculo';

export interface BuilderChoice {
  value: string;
  label: string;
}

export interface BuilderQuestion {
  id: string;
  module: AtomModule;
  text: string;
  subtext?: string;
  inputType: InputType;
  choices?: BuilderChoice[];
  nextQuestionId?: string | null; // null = end of module
  branchOn?: Record<string, string>; // answer value → next question id
}

export interface BuilderModuleConfig {
  id: AtomModule;
  label: string;
  description: string;
  icon: string;
  questions: BuilderQuestion[];
}

export interface BuilderAnswer {
  questionId: string;
  value: string | boolean;
}

export interface BuilderGeneratedItem {
  tempId: string;
  title: string;
  type: AtomType;
  module: AtomModule;
  tags: string[];
  ritualSlot?: RitualSlot;
  recurrence?: string;
  notes?: string;
}

// ─── D64: a entrevista pare estruturas, não itens soltos ──

export interface BuilderRoutine {
  tempId: string;
  title: string;
  module: AtomModule;
  slot: RitualSlot | null;
  eloTempIds: string[]; // resolvidos pra ids reais no assentimento
}

export interface BuilderProtocol {
  tempId: string;
  title: string;
  module: AtomModule;
  steps: string[];
}

export interface BuilderStructures {
  items: BuilderGeneratedItem[];
  routine: BuilderRoutine | null;
  protocol: BuilderProtocol | null;
}
