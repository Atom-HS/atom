// features/raiz/builder-store.ts — Zustand store for Routine Builder

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AtomModule, AtomType } from '@/types/item';
import type { BuilderAnswer, BuilderGeneratedItem, BuilderProtocol, BuilderRoutine } from './builder-types';
import { BUILDER_MODULE_MAP, BUILDER_QUESTION_MAP } from './builder-questions';
import { generateStructures } from './builder-mapper';

interface BuilderState {
  activeModule: AtomModule | null;
  currentQuestionId: string | null;
  answers: BuilderAnswer[];
  generatedItems: BuilderGeneratedItem[];
  generatedRoutines: BuilderRoutine[];   // D64: a entrevista pare cadeias
  generatedProtocols: BuilderProtocol[]; // D64: e protocolos
  completedModules: AtomModule[];
  mindmateMode: boolean;

  startModule: (module: AtomModule) => void;
  answerQuestion: (questionId: string, value: string | boolean) => void;
  setItemType: (tempId: string, type: AtomType) => void;
  goBack: () => void;
  completeModule: () => void;
  checkMindmateTrigger: (text: string) => void;
  reset: () => void;
}

// persist (MANCA 3 da dissecação 02): reload não apaga a entrevista — o
// store retoma onde parou. A reescrita em capítulos-gaveta retomáveis segue
// sendo obra de voz com o E. (D64); aqui é só não perder o que foi dito.
export const useBuilderStore = create<BuilderState>()(persist((set, get) => ({
  activeModule: null,
  currentQuestionId: null,
  answers: [],
  generatedItems: [],
  generatedRoutines: [],
  generatedProtocols: [],
  completedModules: [],
  mindmateMode: false,

  startModule: (module) => {
    const mod = BUILDER_MODULE_MAP[module];
    if (!mod || mod.questions.length === 0) return;
    set({
      activeModule: module,
      currentQuestionId: mod.questions[0].id,
    });
  },

  answerQuestion: (questionId, value) => {
    const { answers, activeModule } = get();
    const question = BUILDER_QUESTION_MAP[questionId];
    if (!question) return;

    const newAnswers = [...answers, { questionId, value }];

    // Determine next question
    let nextId: string | null | undefined;
    if (question.branchOn) {
      const key = typeof value === 'boolean' ? String(value) : value;
      nextId = question.branchOn[key] ?? question.nextQuestionId;
    } else {
      nextId = question.nextQuestionId;
    }

    if (nextId && BUILDER_QUESTION_MAP[nextId]) {
      set({ answers: newAnswers, currentQuestionId: nextId });
    } else {
      // Module complete — a entrevista pare estruturas (D64)
      if (activeModule) {
        const { items, routine, protocol } = generateStructures(newAnswers.filter(a => {
          const q = BUILDER_QUESTION_MAP[a.questionId];
          return q?.module === activeModule;
        }), activeModule);

        set((s) => ({
          answers: newAnswers,
          activeModule: null,
          currentQuestionId: null,
          generatedItems: [...s.generatedItems, ...items],
          generatedRoutines: routine ? [...s.generatedRoutines, routine] : s.generatedRoutines,
          generatedProtocols: protocol ? [...s.generatedProtocols, protocol] : s.generatedProtocols,
          completedModules: [...s.completedModules, activeModule],
        }));
      }
    }
  },

  // D69 — a heurística nunca decide quieta: o chip do mini-wrap troca o
  // tipo antes do parto, e o que nasce é o que o humano disse
  setItemType: (tempId, type) =>
    set((s) => ({
      generatedItems: s.generatedItems.map((i) => (i.tempId === tempId ? { ...i, type } : i)),
    })),

  goBack: () => {
    const { answers, activeModule } = get();
    if (answers.length === 0 || !activeModule) return;

    const moduleAnswers = answers.filter(a => {
      const q = BUILDER_QUESTION_MAP[a.questionId];
      return q?.module === activeModule;
    });

    if (moduleAnswers.length === 0) {
      set({ activeModule: null, currentQuestionId: null });
      return;
    }

    const lastAnswer = moduleAnswers[moduleAnswers.length - 1];
    const newAnswers = answers.filter(a => a !== lastAnswer);
    set({
      answers: newAnswers,
      currentQuestionId: lastAnswer.questionId,
    });
  },

  completeModule: () => {
    set({ activeModule: null, currentQuestionId: null });
  },

  checkMindmateTrigger: (text) => {
    if (text.toLowerCase().includes('mindmate')) {
      set({ mindmateMode: true });
    }
  },

  reset: () => set({
    activeModule: null,
    currentQuestionId: null,
    answers: [],
    generatedItems: [],
    generatedRoutines: [],
    generatedProtocols: [],
    completedModules: [],
    mindmateMode: false,
  }),
}), { name: 'mindroot.builder.v1' }));
