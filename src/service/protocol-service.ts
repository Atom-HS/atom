// service/protocol-service.ts — monta e roda o protocolo (Fase 7 · spec v0.4 D2)
// Protocolo nasce structured (o procedimento É a estrutura). Rodar NUNCA
// mescla o item: cada execução vira atom_event 'protocol_run' — o rastro
// que o espelho no tempo (Fase 9) vai ler. Pattern: hooks → service → supabase
import { itemService, eventService } from './item-service';
import { slugify } from '@/engine/people';
import type { AtomItem, AtomModule, EnergyLevel, ProtocolWhen, RitualSlot } from '@/types/item';

export interface CreateProtocolPayload {
  userId: string;
  name: string;
  steps: string[];               // em ordem — a ordem é o procedimento
  when: ProtocolWhen | null;     // null = só manual ("tô nessa")
  module?: AtomModule;
}

export interface ProtocolRunLog {
  trigger: 'auto' | 'manual';    // a situação chamou × a mão puxou
  emotion: string | null;
  energy: EnergyLevel | null;
  period: RitualSlot;
  steps_done: number;
  steps_total: number;
}

export const protocolService = {
  async createProtocol(payload: CreateProtocolPayload): Promise<AtomItem> {
    const { userId, name, steps, when } = payload;
    const module = payload.module ?? 'mind';
    return itemService.create({
      title: name,
      user_id: userId,
      type: 'protocol',
      module,
      state: 'structured',
      genesis_stage: 3,
      status: 'active',
      source: 'mindroot',
      tags: ['#protocol'],
      naming_convention: `mod-${module}_protocol_${slugify(name)}`,
      body: { steps, when },
    });
  },

  // O rastro da execução — protocol_run em atom_events, item intocado.
  async logRun(protocol: AtomItem, run: ProtocolRunLog): Promise<void> {
    await eventService.create(protocol.user_id, protocol.id, 'protocol_run', { ...run });
  },
};
