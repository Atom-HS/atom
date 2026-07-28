// features/raiz/builder-mapper.ts — Maps builder answers to AtomItems
// D64: as respostas parem ESTRUTURAS — cadeia (routine) e protocolo —
// não hábitos soltos. Tudo nasce no inbox (estágio 1); o mini-wrap é o
// assentimento que dá corpo.

import type {
  BuilderAnswer,
  BuilderGeneratedItem,
  BuilderProtocol,
  BuilderRoutine,
  BuilderStructures,
  RitualSlot,
} from './builder-types';
import type { AtomModule, AtomType } from '@/types/item';
import { BUILDER_QUESTION_MAP } from './builder-questions';

let tempCounter = 0;
function tempId(): string {
  return `builder-${Date.now()}-${++tempCounter}`;
}

export function generateItems(answers: BuilderAnswer[], module: AtomModule): BuilderGeneratedItem[] {
  const items: BuilderGeneratedItem[] = [];

  for (const answer of answers) {
    const question = BUILDER_QUESTION_MAP[answer.questionId];
    if (!question) continue;

    const value = typeof answer.value === 'boolean' ? (answer.value ? 'yes' : 'no') : answer.value;

    // Skip "no" answers for yesno — they don't generate items
    if (question.inputType === 'yesno' && value === 'no') continue;

    // Generate items based on question context
    if (question.inputType === 'freetext' && value.trim()) {
      // Check if next answer is a frequency — if so, skip this freetext.
      // The frequency handler will use this text as the habit title.
      const idx = answers.indexOf(answer);
      const nextAnswer = idx < answers.length - 1 ? answers[idx + 1] : null;
      const nextQuestion = nextAnswer ? BUILDER_QUESTION_MAP[nextAnswer.questionId] : null;
      const isContextForFrequency = nextQuestion?.inputType === 'frequency';

      if (!isContextForFrequency) {
        items.push({
          tempId: tempId(),
          title: value.trim(),
          type: inferType(question.id, value),
          module,
          tags: [`#domain:${inferDomain(module)}`, '#raiz', '#routine-builder'],
          ritualSlot: inferSlot(question.id, answers),
          notes: question.text,
        });
      }
    }

    if (question.inputType === 'frequency') {
      const freq = parseInt(value);
      if (freq > 0) {
        // Find the preceding freetext answer for context
        const idx = answers.indexOf(answer);
        const context = idx > 0 ? answers[idx - 1] : null;
        const title = context && typeof context.value === 'string' ? context.value : `${module} ${freq}x/semana`;
        items.push({
          tempId: tempId(),
          title,
          type: 'habit',
          module,
          tags: [`#domain:${inferDomain(module)}`, '#raiz', '#routine-builder'],
          recurrence: `${freq}x/week`,
        });
      }
    }

    if (question.inputType === 'time') {
      // Time answers generate ritual items
      const parts = value.split(' — ');
      if (parts.length === 2) {
        items.push({
          tempId: tempId(),
          title: `Acordar ${parts[0].replace(' acordar', '')}`,
          type: 'ritual',
          module,
          tags: [`#domain:${inferDomain(module)}`, '#raiz', '#routine-builder'],
          ritualSlot: 'aurora',
        });
        items.push({
          tempId: tempId(),
          title: `Dormir ${parts[1].replace(' dormir', '')}`,
          type: 'ritual',
          module,
          tags: [`#domain:${inferDomain(module)}`, '#raiz', '#routine-builder'],
          ritualSlot: 'crepusculo',
        });
      }
    }

    if (question.inputType === 'choice') {
      // Choices that map to ritual slots generate items
      if (['aurora', 'zenite', 'crepusculo'].includes(value)) {
        items.push({
          tempId: tempId(),
          title: inferChoiceTitle(question.id, value),
          type: inferType(question.id, value),
          module,
          tags: [`#domain:${inferDomain(module)}`, '#raiz', '#routine-builder'],
          ritualSlot: value as RitualSlot,
        });
      }
    }
  }

  return items;
}

function inferType(questionId: string, _value: string): AtomType {
  if (questionId.includes('habito') || questionId.endsWith('-3') || questionId.endsWith('-5')) return 'habit';
  if (questionId.includes('meta') || questionId.includes('aprender')) return 'task';
  if (questionId.includes('ritual') || questionId.includes('time')) return 'ritual';
  return 'note';
}

function inferDomain(module: AtomModule): string {
  const map: Partial<Record<AtomModule, string>> = {
    body: 'health', mind: 'projects', family: 'communication', work: 'projects', finance: 'finance',
  };
  return map[module] ?? 'projects';
}

function inferSlot(_questionId: string, answers: BuilderAnswer[]): RitualSlot | undefined {
  // Check if any answer in this chain specified a slot
  for (const a of answers) {
    if (typeof a.value === 'string' && ['aurora', 'zenite', 'crepusculo'].includes(a.value)) {
      return a.value as RitualSlot;
    }
  }
  return undefined;
}

function inferChoiceTitle(qId: string, value: string): string {
  if (qId === 'mind-5') return `Reflexao (${value})`;
  if (qId === 'work-3') return `Bloco de foco (${value})`;
  return value;
}

// ─── D64: de itens soltos a estruturas vivas ─────────────

const MODULE_LABEL: Partial<Record<AtomModule, string>> = {
  body: 'corpo', mind: 'mente', family: 'família', work: 'trabalho', finance: 'finanças',
};

// A pergunta-condição de cada módulo ({module}-7) vira protocolo:
// "quando X, faço Y" — dorme até a alma do dia chamar (engine/protocol).
const PROTOCOL_TITLES: Record<string, string> = {
  'body-7': 'quando o corpo pesa',
  'mind-7': 'quando a cabeça acelera',
  'work-7': 'quando travar no trabalho',
};

function parseSteps(raw: string): string[] {
  return raw
    .split(/[,;\n]| e /)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

/** O que a entrevista pare, por módulo: itens + no máximo UMA cadeia e UM protocolo. */
export function generateStructures(answers: BuilderAnswer[], module: AtomModule): BuilderStructures {
  const protocolAnswerIds = new Set(Object.keys(PROTOCOL_TITLES));
  const flat = generateItems(
    answers.filter((a) => !protocolAnswerIds.has(a.questionId)),
    module,
  );

  // Cadeia: os elos são os hábitos/rituais recorrentes do módulo.
  // Piso mínimo (Guardião): cadeia sem 2+ elos não nasce — 1 hábito é hábito.
  const elos = flat.filter((i) => i.type === 'habit' || i.type === 'ritual');
  let routine: BuilderRoutine | null = null;
  if (elos.length >= 2) {
    const slots = elos.map((e) => e.ritualSlot).filter((s): s is RitualSlot => !!s);
    const slot = slots.length
      ? slots.sort((a, b) => slots.filter(s => s === b).length - slots.filter(s => s === a).length)[0]
      : null;
    routine = {
      tempId: tempId(),
      title: `cadeia de ${MODULE_LABEL[module] ?? module}`,
      module,
      slot,
      eloTempIds: elos.map((e) => e.tempId),
    };
  }

  // Protocolo: só nasce da pergunta-condição com passos de verdade.
  let protocol: BuilderProtocol | null = null;
  for (const a of answers) {
    const title = PROTOCOL_TITLES[a.questionId];
    if (!title || typeof a.value !== 'string') continue;
    const steps = parseSteps(a.value);
    if (steps.length === 0) continue; // piso mínimo: protocol sem steps não nasce
    protocol = { tempId: tempId(), title, module, steps };
  }

  return { items: flat, routine, protocol };
}

/** Payload da cadeia — chain com ids REAIS (resolvidos após criar os elos). */
export function routineToPayload(routine: BuilderRoutine, chainIds: string[], userId: string) {
  return {
    title: routine.title,
    user_id: userId,
    type: 'routine' as AtomType,
    module: routine.module,
    tags: ['#raiz', '#routine-builder'],
    status: 'inbox' as const,
    state: 'inbox' as const,
    genesis_stage: 1,
    source: 'mindroot',
    body: { chain: chainIds, slot: routine.slot, builder_origin: true } as Record<string, unknown>,
  };
}

/** Payload do protocolo — when por estado desafiador (nunca só horário, D2/F7). */
export function protocolToPayload(protocol: BuilderProtocol, userId: string) {
  return {
    title: protocol.title,
    user_id: userId,
    type: 'protocol' as AtomType,
    module: protocol.module,
    tags: ['#raiz', '#routine-builder'],
    status: 'inbox' as const,
    state: 'inbox' as const,
    genesis_stage: 1,
    source: 'mindroot',
    body: {
      steps: protocol.steps,
      when: { emotion: null, challenging: true, energy: null, period: null },
      builder_origin: true,
    } as Record<string, unknown>,
  };
}

export function toSupabasePayload(item: BuilderGeneratedItem, userId: string) {
  return {
    title: item.title,
    user_id: userId,
    type: item.type,
    module: item.module,
    tags: item.tags,
    status: 'inbox' as const,
    state: 'inbox' as const,
    genesis_stage: 1,
    source: 'mindroot',
    notes: item.notes ?? null,
    body: {
      ...(item.ritualSlot ? { soul: { ritual_slot: item.ritualSlot } } : {}),
      ...(item.recurrence ? { recurrence: { rule: item.recurrence } } : {}),
      builder_origin: true,
    } as Record<string, unknown>,
  };
}
