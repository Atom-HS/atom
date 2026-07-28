// hooks/useVault.ts — a leitura do cofre (obra 6 · D63)
// O chão da árvore lê daqui: validades na janela de aviso e ausências por
// evento significativo. Consome o engine/vault; nunca calcula na UI.

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { eventService } from '@/service/item-service';
import { RAIZ_DOMAINS } from '@/config/raiz';
import {
  SIGNIFICANT_EVENTS,
  absences,
  expiries,
  quietAbsences,
  type VaultAbsence,
  type VaultExpiry,
} from '@/engine/vault';

const WINDOW_DAYS = 730; // 2 anos — o "dentista há 2 anos" precisa caber

export function useVault() {
  const { items } = useItems();
  const userId = useAppStore((s) => s.user?.id);

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
    return quietAbsences(absences(keys, items, events, now));
  }, [items, events]); // eslint-disable-line react-hooks/exhaustive-deps

  return { vencendo, ausencias };
}
