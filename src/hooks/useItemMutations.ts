// hooks/useItemMutations.ts
// createItem: aceita CreateItemPayload (compativel com AtomInput)
// updateMutation/completeMutation/etc: usados por Dashboard/Inbox
// alpha.10: toast notifications on success/error, undo on delete/archive

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, itemService } from '@/service/item-service';
import type { AtomItem, CreateItemPayload, UpdateItemPayload } from '@/types/item';
import { toast } from '@/store/toast-store';

export function useItemMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['items'] });

  const createItem = useMutation({
    mutationFn: async (payload: CreateItemPayload) => {
      return itemService.create(payload);
    },
    onSuccess: (item) => {
      invalidate();
      if (item) {
        toast.success('Item criado');
      }
    },
    onError: () => {
      toast.error('Erro ao criar item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateItemPayload }) => {
      return itemService.update(id, updates);
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);
      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      return { previous, updates };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['items'], context.previous);
      toast.error('Erro ao atualizar item');
    },
    onSuccess: (_data, { updates }, context) => {
      if (updates.status === 'archived' && context?.previous) {
        const previousItems = context.previous;
        // o undo devolve status E state de antes — restaurar só o status
        // deixava o item com state 'archived' (fora da esteira pra sempre)
        const prev = previousItems.find((i) => i.id === _data?.id);
        toast.success('Item arquivado', {
          undoAction: () => {
            queryClient.setQueryData(['items'], previousItems);
            const id = _data?.id;
            if (id) itemService.update(id, { status: prev?.status ?? 'active', state: prev?.state ?? 'classified' });
          },
        });
      } else if (updates.status !== 'archived') {
        toast.success('Item atualizado');
      }
    },
    onSettled: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      // Item recorrente precisa de last_completed — sem ele o virtual reset
      // nunca reabre o hábito no período seguinte (achado da Fase 6)
      const current = await itemService.getById(id);
      const rec = current.body?.recurrence;
      const now = new Date().toISOString();
      const updated = rec?.rule
        ? await itemService.update(id, {
            status: 'completed',
            body: {
              ...current.body,
              recurrence: {
                ...rec,
                last_completed: now,
                completion_log: [...(rec.completion_log ?? []), now],
              },
            },
          })
        : await itemService.update(id, { status: 'completed' });
      // concluir é toque de verdade — o cofre lê ausência por este rastro,
      // nunca por updated_at (D63); falha no rastro não derruba a conclusão
      eventService.create(updated.user_id, id, 'touch').catch(() => {});
      return updated;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);
      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, status: 'completed' as const } : item
        )
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Item concluido');
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['items'], context.previous);
      toast.error('Erro ao concluir item');
    },
    onSettled: invalidate,
  });

  const uncompleteMutation = useMutation({
    mutationFn: async (id: string) => itemService.update(id, { status: 'active' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);
      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, status: 'active' as const } : item
        )
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Item reaberto');
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['items'], context.previous);
      toast.error('Erro ao reabrir item');
    },
    onSettled: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => itemService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData<AtomItem[]>(['items']);
      queryClient.setQueryData<AtomItem[]>(['items'], (old) =>
        old?.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onSuccess: (_data, _id, context) => {
      if (context?.previous) {
        const previousItems = context.previous;
        toast.success('Item excluido', {
          undoAction: () => {
            queryClient.setQueryData(['items'], previousItems);
            queryClient.invalidateQueries({ queryKey: ['items'] });
          },
        });
      } else {
        toast.success('Item excluido');
      }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(['items'], context.previous);
      toast.error('Erro ao excluir item');
    },
    onSettled: invalidate,
  });

  // arquivar em bloco (esteira, auditoria 20 § 7.1) — um toast pro lote
  // inteiro, nunca N toasts; falha parcial é contada, não escondida.
  // status E state juntos: sem o state o item seguia contando como inbox.
  const archiveBatch = useMutation({
    mutationFn: async (ids: string[]) => {
      let ok = 0;
      let falhas = 0;
      for (const id of ids) {
        try {
          await itemService.update(id, { status: 'archived', state: 'archived' });
          ok += 1;
        } catch {
          falhas += 1;
        }
      }
      return { ok, falhas };
    },
    onSuccess: ({ ok, falhas }) => {
      if (ok > 0) toast.success(ok === 1 ? '1 guardado no arquivo' : `${ok} guardados no arquivo`);
      if (falhas > 0) toast.error(`${falhas} não foram — seguem na fila`);
    },
    onError: () => {
      toast.error('não consegui guardar agora — a fila mostra o que ficou');
    },
    onSettled: invalidate,
  });

  return { createItem, updateMutation, completeMutation, uncompleteMutation, deleteMutation, archiveBatch };
}
