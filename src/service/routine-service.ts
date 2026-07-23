// service/routine-service.ts — monta e vive a cadeia (Fase 6 · spec v0.4 D2)
// Rotina nasce structured (a cadeia É a estrutura). Elos = habits com
// Recurrence própria, ligados por belongs_to. Selar = cadeia executada.
// Pattern: hooks → service → supabase

import { itemService, connectionService } from './item-service';
import type { AtomItem, AtomModule, RitualSlot } from '@/types/item';
import type { RecurrenceType } from '@/engine/recurrence';
import { slugify } from '@/engine/people';

export interface RoutineLinkInput {
  title: string;
  existingId?: string;   // reaproveita um habit que já existe no tronco
}

export interface CreateRoutinePayload {
  userId: string;
  name: string;
  slot: RitualSlot;
  module?: AtomModule;
  links: RoutineLinkInput[];          // em ordem — a ordem é a cadeia
  recurrence?: RecurrenceType;        // default: daily (rotina e elos novos)
}

function recurrenceBody(rule: RecurrenceType) {
  return { rule, last_completed: null, streak_count: 0, completion_log: [] };
}

export const routineService = {
  async createRoutine(payload: CreateRoutinePayload): Promise<AtomItem> {
    const { userId, name, slot, links } = payload;
    const module = payload.module ?? 'body';
    const rule = payload.recurrence ?? 'daily';

    // 1 · elos — cria os habits que ainda não existem, preservando a ordem
    const chain: string[] = [];
    for (const link of links) {
      if (link.existingId) {
        chain.push(link.existingId);
        continue;
      }
      const habit = await itemService.create({
        title: link.title,
        user_id: userId,
        type: 'habit',
        module,
        state: 'classified',
        genesis_stage: 2,
        status: 'active',
        source: 'mindroot',
        tags: ['#routine'],
        body: { recurrence: recurrenceBody(rule) },
      });
      chain.push(habit.id);
    }

    // 2 · a rotina — contêiner da cadeia
    const routine = await itemService.create({
      title: name,
      user_id: userId,
      type: 'routine',
      module,
      state: 'structured',
      genesis_stage: 3,
      status: 'active',
      source: 'mindroot',
      tags: ['#routine', `#slot:${slot}`],
      naming_convention: `mod-${module}_routine_${slugify(name)}`,
      body: { chain, slot, recurrence: recurrenceBody(rule) },
    });

    // 3 · elo pertence à cadeia
    for (const id of chain) {
      await connectionService.create({
        user_id: userId,
        source_id: id,
        target_id: routine.id,
        relation: 'belongs_to',
        note: 'routine-link',
      });
    }

    return routine;
  },

  // Completa um elo NESTE período: status + last_completed + log.
  // (O completeMutation genérico não grava recurrence — aqui é lei.)
  async completeLink(item: AtomItem): Promise<AtomItem> {
    const now = new Date().toISOString();
    const body = (item.body ?? {}) as Record<string, unknown>;
    const rec = (body.recurrence ?? {}) as Record<string, unknown>;
    const log = Array.isArray(rec.completion_log) ? (rec.completion_log as string[]) : [];
    return itemService.update(item.id, {
      status: 'completed',
      body: {
        ...body,
        recurrence: {
          ...rec,
          last_completed: now,
          streak_count: ((rec.streak_count as number) ?? 0) + 1,
          completion_log: [...log, now],
        },
      },
    });
  },

  async reopenLink(item: AtomItem): Promise<AtomItem> {
    const body = (item.body ?? {}) as Record<string, unknown>;
    const rec = (body.recurrence ?? {}) as Record<string, unknown>;
    return itemService.update(item.id, {
      status: 'active',
      body: { ...body, recurrence: { ...rec, last_completed: null } },
    });
  },

  // A cadeia executada — a rotina sela o período dela
  async sealRoutine(routine: AtomItem): Promise<AtomItem> {
    return routineService.completeLink(routine);
  },

  async unsealRoutine(routine: AtomItem): Promise<AtomItem> {
    return routineService.reopenLink(routine);
  },
};
