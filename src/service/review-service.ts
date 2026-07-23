// service/review-service.ts — sela uma review da escada (Fase 4 · spec §2.4)
// Review = item born-committed: o sistema apresentou, o humano significou.
import { itemService } from './item-service';
import type { AtomItem } from '@/types/item';
import type { Cadence } from '@/engine/meaning';

export const reviewService = {
  async sealReview(params: {
    userId: string;
    cadence: Cadence;
    label: string;
    readIds: string[];
    meaning: string;
  }): Promise<AtomItem> {
    const { userId, cadence, label, readIds, meaning } = params;
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return itemService.create({
      title: `Review — ${label} · ${today}`,
      user_id: userId,
      type: 'review',
      module: 'mind',
      state: 'committed',
      genesis_stage: 7,
      status: 'completed',
      source: 'mindroot',
      tags: ['review', cadence],
      notes: meaning,
      body: {
        cadence,
        reads: readIds,
        read_count: readIds.length,
      },
    });
  },
};
