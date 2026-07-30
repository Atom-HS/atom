// service/bilhete-service.ts — leitura e marcas do bilhete (spec 03 v2 §6)
// Três eventos e só: nasceu (edge, no reconcile) · exibido · visto.
// Sem delete — fala não se apaga; o registro é o instrumento da revisão
// dos 20. O insert não existe aqui: bilhete nasce só do sistema.

import { supabase } from './supabase';
import type { Bilhete } from '@/engine/bilhete';

export const bilheteService = {
  async pendentes(userId: string): Promise<Bilhete[]> {
    const { data, error } = await supabase
      .from('e_bilhetes')
      .select('id, gatilho, texto, nasceu_em, exibido_em, visto_em')
      .eq('user_id', userId)
      .is('visto_em', null)
      .order('nasceu_em', { ascending: true })
      .limit(3);
    if (error) throw error;
    return (data ?? []) as Bilhete[];
  },

  async marcarExibido(id: string): Promise<void> {
    const { error } = await supabase
      .from('e_bilhetes')
      .update({ exibido_em: new Date().toISOString() })
      .eq('id', id)
      .is('exibido_em', null);
    if (error) throw error;
  },

  async marcarVisto(id: string): Promise<void> {
    const { error } = await supabase
      .from('e_bilhetes')
      .update({ visto_em: new Date().toISOString() })
      .eq('id', id)
      .is('visto_em', null);
    if (error) throw error;
  },
};
