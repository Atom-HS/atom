// service/soul-service.ts — soul log no tronco (selo S-03 · E2.2 walking skeleton)
// O check-in de aurora vivia só em Zustand e evaporava no reload — o soul nunca
// tocava o banco. Agora a chegada nasce como checkpoint born-committed em items,
// mesmo padrão do wrap (state committed · stage 7 · status completed).
import { itemService } from './item-service';
import { supabase } from './supabase';
import type { AtomItem, EnergyLevel } from '@/types/item';

export const soulService = {
  /** Journaling das pontas do dia (spec v0.4 §2.2 — primeira classe, não campo).
   *  Escrita livre → item reflection born-committed com o slot do ritual. */
  async persistJournal(params: {
    userId: string;
    text: string;
    slot: 'aurora' | 'crepusculo';
  }): Promise<AtomItem> {
    const { userId, text, slot } = params;
    const firstLine = text.trim().split('\n')[0].slice(0, 60);
    return itemService.create({
      title: firstLine || `${slot} — journaling`,
      user_id: userId,
      type: 'reflection',
      module: 'mind',
      state: 'committed',
      genesis_stage: 7,
      status: 'completed',
      source: 'mindroot',
      tags: ['journal', slot],
      notes: text,
      body: {
        soul: {
          energy_level: null,
          emotion_before: null,
          emotion_after: null,
          needs_checkin: false,
          ritual_slot: slot,
        },
      },
    });
  },

  /** A chegada de hoje, lida do TRONCO (o Zustand evapora no reload —
   *  sem isto, check-in às 5h + wrap às 20h = shift perdido). */
  async getTodayArrival(): Promise<{
    emotion: string;
    energy: string | null;
    intention: string | null;
  } | null> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from('items')
      .select('notes,body,created_at')
      .eq('type', 'checkpoint')
      .contains('tags', ['aurora'])
      .gte('created_at', start.toISOString())
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    const soul = (data.body as Record<string, unknown> | null)?.soul as
      | { emotion_before?: string | null; energy_level?: string | null }
      | undefined;
    if (!soul?.emotion_before) return null;
    return {
      emotion: soul.emotion_before,
      energy: soul.energy_level ?? null,
      intention: data.notes ?? null,
    };
  },

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
