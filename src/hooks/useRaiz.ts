// hooks/useRaiz.ts — Raiz domain health hook
// Reusable across pages. Zero new schema — reads existing items + #domain:* tags.
// A quietude do grid lê a MESMA lei do cofre (D63): último toque
// significativo (criação ou evento touch/checkin/protocol_run), nunca
// updated_at — que mente a cada retag. Uma tela, uma lei de quietude.

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useItems } from '@/hooks/useItems';
import { useAppStore } from '@/store/app-store';
import { eventService } from '@/service/item-service';
import { simEvents } from '@/dev/sim-week';
import { RAIZ_DOMAINS } from '@/config/raiz';
import { SIGNIFICANT_EVENTS, absences } from '@/engine/vault';

const WINDOW_DAYS = 730; // a mesma janela do cofre (useVault)

export interface DomainHealth {
  key: string;
  label: string;
  emoji: string;
  module: string;
  count: number;
  oldest: number; // dias desde o último toque significativo (lei do cofre)
  status: 'active' | 'stale' | 'empty';
}

export function useRaiz() {
  const { items } = useItems();
  const userId = useAppStore((s) => s.user?.id);

  // a mesma query do cofre (queryKey compartilhada — react-query dedupa)
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

  const domains = useMemo<DomainHealth[]>(() => {
    const toques = absences(
      RAIZ_DOMAINS.map((d) => d.key),
      items,
      [...events, ...simEvents()],
      new Date(),
    );
    const daysByDomain = new Map(toques.map((a) => [a.domain, a.daysSince]));

    return RAIZ_DOMAINS.map((domain) => {
      const domainItems = items.filter(
        (i) =>
          i.status !== 'archived' &&
          i.tags?.includes(`#domain:${domain.key}`),
      );
      const count = domainItems.length;
      // domínio habitado sempre tem toque (a criação conta) — null só no vazio
      const oldest = daysByDomain.get(domain.key) ?? 0;

      let status: 'active' | 'stale' | 'empty' = 'active';
      if (count === 0) status = 'empty';
      else if (oldest > 30) status = 'stale';

      return { key: domain.key, label: domain.label, emoji: domain.emoji, module: domain.module, count, oldest, status };
    });
  }, [items, events]);

  const activeCount = domains.filter((d) => d.status === 'active').length;
  const staleCount = domains.filter((d) => d.status === 'stale').length;
  const emptyCount = domains.filter((d) => d.status === 'empty').length;
  const totalItems = items.filter((i) => i.status !== 'archived').length;

  return { domains, activeCount, staleCount, emptyCount, totalItems };
}
