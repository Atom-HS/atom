// hooks/useVault.ts — a leitura do cofre (obra 6 · D63)
// O chão da árvore lê daqui: validades na janela de aviso e ausências por
// evento significativo. Consome o engine/vault; nunca calcula na UI.

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { eventService, itemService } from '@/service/item-service';
import { simEvents } from '@/dev/sim-week';
import { RAIZ_DOMAINS } from '@/config/raiz';
import { toast } from '@/store/toast-store';
import type { AtomItem } from '@/types/item';
import {
  SIGNIFICANT_EVENTS,
  absences,
  expiries,
  quietAbsences,
  renewalPatch,
  type VaultAbsence,
  type VaultExpiry,
} from '@/engine/vault';

const WINDOW_DAYS = 730; // 2 anos — o "dentista há 2 anos" precisa caber

export function useVault() {
  const { items } = useItems();
  const userId = useAppStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['vault-events', userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: () => {
      const since = new Date();
      since.setDate(since.getDate() - WINDOW_DAYS);
      return eventService.listSignificantSince(userId!, SIGNIFICANT_EVENTS, since.toISOString());
    },
  });

  const now = new Date();

  const vencendo: VaultExpiry[] = useMemo(() => expiries(items, now), [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const ausencias: VaultAbsence[] = useMemo(() => {
    // gaveta vazia não é ausência — é vazio (o grid já diz); ausência é
    // inventário que existe e ninguém toca
    const inhabited = new Set(
      items.filter((i) => i.status !== 'archived').flatMap((i) => i.tags ?? [])
        .filter((t) => t.startsWith('#domain:')).map((t) => t.slice('#domain:'.length)),
    );
    const keys = RAIZ_DOMAINS.map((d) => d.key).filter((k) => inhabited.has(k));
    return quietAbsences(absences(keys, items, [...events, ...simEvents()], now));
  }, [items, events]); // eslint-disable-line react-hooks/exhaustive-deps

  // Renovar: rolar a validade pra nova data. Sem este gesto a leitura do
  // cofre é beco sem saída — e o digest (D66) promete ele todo dia.
  // Renovar é toque de verdade: deixa o mesmo rastro `touch` que concluir
  // (D63), então a ausência do domínio zera por evento, nunca por updated_at.
  const renovar = useMutation({
    mutationFn: async ({ item, until }: { item: AtomItem; until: string }) => {
      const atualizado = await itemService.update(item.id, { body: renewalPatch(item, until) });
      eventService
        .create(atualizado.user_id, item.id, 'touch', { kind: 'renewal', until })
        .catch(() => {}); // falha no rastro não desfaz a renovação
      return atualizado;
    },
    onSuccess: (_data, { until }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['vault-events'] });
      toast.success(`renovado até ${new Date(until).toLocaleDateString('pt-BR')}`);
    },
    onError: () => toast.error('não consegui renovar agora — a validade segue como estava'),
  });

  return { vencendo, ausencias, renovar };
}
