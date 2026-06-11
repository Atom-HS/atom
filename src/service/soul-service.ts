// service/soul-service.ts — soul log no tronco (selo S-03 · E2.2 walking skeleton)
// O check-in de aurora vivia só em Zustand e evaporava no reload — o soul nunca
// tocava o banco. Agora a chegada nasce como checkpoint born-committed em items,
// mesmo padrão do wrap (state committed · stage 7 · status completed).
import { itemService } from './item-service';
import type { AtomItem, EnergyLevel } from '@/types/item';

export const soulService = {
  async persistAuroraCheckin(params: {
    userId: string;
    emotion: string;
    energy: EnergyLevel;
    intention: string;
  }): Promise<AtomItem> {
    const { userId, emotion, energy, intention } = params;
    return itemService.create({
      title: `aurora — ${emotion}`,
      user_id: userId,
      type: 'checkpoint',
      module: 'bridge',
      state: 'committed',
      genesis_stage: 7,
      status: 'completed',
      source: 'mindroot',
      tags: ['checkin', 'aurora'],
      notes: intention || null,
      body: {
        soul: {
          energy_level: energy,
          emotion_before: emotion,
          emotion_after: null,
          needs_checkin: false,
          ritual_slot: 'aurora',
        },
      },
    });
  },
};
