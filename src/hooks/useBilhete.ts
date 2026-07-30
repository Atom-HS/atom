// hooks/useBilhete.ts — o bilhete no HOJE (spec 03 v2 §superfície)
// Um por vez, sem badge, sem som. "Abertura" = sessão do navegador: a
// marca de exibido-nesta-abertura vive em sessionStorage e morre com
// ela — na abertura seguinte o bilhete já foi visto e some sozinho.

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/app-store';
import { bilheteService } from '@/service/bilhete-service';
import { bilheteGesto, bilhetePendente, type Bilhete } from '@/engine/bilhete';
import { simActive } from '@/dev/sim-week';

const SESSION_KEY = 'mindroot-bilhete-exibido';

function exibidoNestaAbertura(id: string): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === id;
  } catch {
    return false;
  }
}

function marcarAbertura(id: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    /* sem storage, sem marca — o bilhete só vive mais uma abertura */
  }
}

export function useBilhete(): { bilhete: Bilhete | null } {
  const userId = useAppStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bilhetes', userId],
    queryFn: () => bilheteService.pendentes(userId as string),
    enabled: !!userId && !simActive(),
    staleTime: 60_000,
  });

  const pendente = bilhetePendente(query.data ?? []);
  const gesto = pendente ? bilheteGesto(pendente, exibidoNestaAbertura(pendente.id)) : null;

  useEffect(() => {
    if (!pendente || !gesto) return;
    if (gesto === 'exibir') {
      marcarAbertura(pendente.id);
      bilheteService.marcarExibido(pendente.id).catch(() => {
        /* a marca falhou — o bilhete só fica mais uma abertura */
      });
    } else if (gesto === 'soltar') {
      bilheteService
        .marcarVisto(pendente.id)
        .then(() => queryClient.invalidateQueries({ queryKey: ['bilhetes', userId] }))
        .catch(() => {
          /* idem — soltar de novo na próxima */
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendente?.id, gesto]);

  return { bilhete: gesto === 'exibir' || gesto === 'manter' ? pendente : null };
}
