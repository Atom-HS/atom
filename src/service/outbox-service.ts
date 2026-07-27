// service/outbox-service.ts — fila offline + sync (Onda 3 · D55)
// O braço do padrão do avô: o engine/outbox decide a forma; aqui mora a
// persistência (localStorage, por usuário) e a subida. FIFO, para no
// primeiro erro — a rede pode ter caído de novo; o resto espera a
// próxima janela. Cada entrada só sai da fila DEPOIS de subir.

import {
  entryFromReading,
  parseQueue,
  serializeQueue,
  type OutboxEntry,
} from '@/engine/outbox';
import type { MouthReading } from '@/engine/mouth';
import { resolveListTarget } from '@/engine/mouth';
import { listLists, readListBody } from '@/engine/list';
import { itemService } from './item-service';
import { pipelineService } from './pipeline-service';
import { soulService } from './soul-service';

const KEY = (userId: string) => `mindroot.outbox.v1.${userId}`;

function read(userId: string): OutboxEntry[] {
  return parseQueue(localStorage.getItem(KEY(userId)));
}

function write(userId: string, queue: OutboxEntry[]): void {
  if (queue.length === 0) localStorage.removeItem(KEY(userId));
  else localStorage.setItem(KEY(userId), serializeQueue(queue));
}

let seq = 0;
let flushing = false;

export const outboxService = {
  count(userId: string): number {
    return read(userId).length;
  },

  /** Guarda a leitura na fila. Retorna o tamanho novo da fila. */
  enqueue(userId: string, reading: MouthReading): number {
    const queue = read(userId);
    queue.push(entryFromReading(reading, `o${Date.now()}-${seq++}`, new Date().toISOString()));
    write(userId, queue);
    return queue.length;
  },

  /** Sobe a fila em ordem. Retorna quantas entradas subiram. */
  async flush(userId: string): Promise<number> {
    if (flushing) return 0; // 'online' + mount podem disparar juntos
    flushing = true;
    try {
      let queue = read(userId);
      let sent = 0;
      for (const entry of [...queue]) {
        try {
          await send(userId, entry);
        } catch {
          break; // o resto espera a próxima janela de rede
        }
        queue = queue.filter((e) => e.id !== entry.id);
        write(userId, queue);
        sent++;
      }
      return sent;
    } finally {
      flushing = false;
    }
  },
};

// Executa uma entrada — mesmos caminhos da boca online (face @).
async function send(userId: string, entry: OutboxEntry): Promise<void> {
  if (entry.kind === 'soul') {
    await soulService.persistSoulCheckin({ userId, emotion: entry.emotion, note: entry.note });
    return;
  }

  if (entry.kind === 'list') {
    // resolve contra o tronco fresco — mesma regra da boca online
    const all = await itemService.list(userId);
    const abertas = listLists(all).filter(
      (l) => readListBody(l).entries.some((en) => !en.done) || readListBody(l).entries.length === 0,
    );
    const alvo = resolveListTarget(abertas, entry.name);
    if (alvo) {
      const cur = readListBody(alvo).entries;
      const entries = [...cur, ...entry.entries.map((t) => ({ text: t, done: false }))];
      await itemService.update(alvo.id, { body: { ...(alvo.body ?? {}), entries } });
    } else {
      const item = await pipelineService.capture(entry.name ?? 'lista de hoje', userId);
      await pipelineService.quickClassifyAndStructure(item.id, 'list', 'bridge', {
        entries: entry.entries.map((t) => ({ text: t, done: false })),
      });
    }
    return;
  }

  // captura — o ponto nasce; tokens explícitos ainda valem como assentimento
  const item = await pipelineService.capture(entry.title, userId);
  if (entry.notes) await itemService.update(item.id, { notes: entry.notes });
  if (entry.hasTokens && entry.type && entry.module) {
    await pipelineService.quickClassifyAndStructure(
      item.id, entry.type, entry.module,
      entry.dueDate ? { operations: { due_date: entry.dueDate } } : {},
    );
  }
}
