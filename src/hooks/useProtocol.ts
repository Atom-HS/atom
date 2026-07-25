// hooks/useProtocol.ts — o gesto do protocolo (Fase 7)
// Montar cria o item; rodar só deixa rastro (atom_events).
// Pattern: hooks → service → supabase

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { protocolService, type CreateProtocolPayload, type ProtocolRunLog } from '@/service/protocol-service';
import type { AtomItem } from '@/types/item';
import { toast } from '@/store/toast-store';

export function useProtocolActions() {
  const queryClient = useQueryClient();

  const createProtocol = useMutation({
    mutationFn: async (payload: CreateProtocolPayload) => protocolService.createProtocol(payload),
    onSuccess: (protocol) => {
      toast.success(`${protocol.title} — protocolo pronto`);
    },
    onError: () => toast.error('Erro ao montar o protocolo'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });

  const logRun = useMutation({
    mutationFn: async ({ protocol, run }: { protocol: AtomItem; run: ProtocolRunLog }) =>
      protocolService.logRun(protocol, run),
    onSuccess: (_, { protocol }) => {
      toast.success(`${protocol.title} — executado ○`);
    },
    onError: () => toast.error('Erro ao registrar a execução'),
  });

  return { createProtocol, logRun };
}
