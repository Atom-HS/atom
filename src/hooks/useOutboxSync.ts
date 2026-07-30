// hooks/useOutboxSync.ts — a subida da fila (Onda 3 · D55)
// Vive no shell autenticado: quando a rede volta (ou o app abre com fila
// pendente), sobe tudo e avisa quieto — estado, nunca cobrança (D46).

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/app-store';
import { outboxService } from '@/service/outbox-service';
import { toast } from '@/store/toast-store';

export function useOutboxSync() {
  const userId = useAppStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const up = async () => {
      if (!navigator.onLine || outboxService.count(userId) === 0) return;
      const sent = await outboxService.flush(userId);
      if (sent > 0) {
        queryClient.invalidateQueries({ queryKey: ['items'] });
        toast.info(sent === 1 ? 'a fila subiu — 1 ponto no tronco' : `a fila subiu — ${sent} pontos no tronco`);
      }
      const resto = outboxService.count(userId);
      if (resto > 0) toast.info(`${resto} na fila — sobem na próxima janela de rede`);
    };

    up();
    window.addEventListener('online', up);
    return () => window.removeEventListener('online', up);
  }, [userId, queryClient]);
}
