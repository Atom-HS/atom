// hooks/useRoutine.ts — o gesto da cadeia (Fase 6)
// Toca o elo → completa/reabre; a cadeia fechou → a rotina sela sozinha.
// Pattern: hooks → service → supabase

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routineService, type CreateRoutinePayload } from '@/service/routine-service';
import { chainProgress, type ChainLink } from '@/engine/routine';
import type { AtomItem } from '@/types/item';
import { toast } from '@/store/toast-store';

export function useRoutineActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  const toggleLink = useMutation({
    mutationFn: async ({ routine, link, items }: { routine: AtomItem; link: ChainLink; items: AtomItem[] }) => {
      if (link.done) {
        await routineService.reopenLink(link.item);
        if (routine.status === 'completed') await routineService.unsealRoutine(routine);
        return { sealed: false };
      }
      await routineService.completeLink(link.item);
      const after = items.map((i) =>
        i.id === link.item.id ? { ...i, status: 'completed' as const } : i,
      );
      if (chainProgress(routine, after).complete) {
        await routineService.sealRoutine(routine);
        return { sealed: true };
      }
      return { sealed: false };
    },
    onSuccess: ({ sealed }, { routine }) => {
      if (sealed) toast.success(`${routine.title} — a cadeia fechou ○`);
    },
    onError: () => toast.error('Erro ao tocar o elo'),
    onSettled: invalidate,
  });

  const createRoutine = useMutation({
    mutationFn: async (payload: CreateRoutinePayload) => routineService.createRoutine(payload),
    onSuccess: (routine) => {
      toast.success(`${routine.title} — cadeia montada`);
    },
    onError: () => toast.error('Erro ao montar a rotina'),
    onSettled: invalidate,
  });

  return { toggleLink, createRoutine };
}
