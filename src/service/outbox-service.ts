// service/outbox-service.ts — fila offline + sync (Onda 3 · D55)
// O braço do padrão do avô: o engine/outbox decide a forma; aqui mora a
// persistência (localStorage, por usuário) e a subida. FIFO, para no
// primeiro erro — a rede pode ter caído de novo; o resto espera a
// próxima janela. Cada entrada só sai da fila DEPOIS de subir.

import {
  bornItemId,
  entryFromReading,
  parseQueue,
  rememberItem,
  serializeQueue,
  type OutboxEntry,
} from '@/engine/outbox';
import type { MouthReading } from '@/engine/mouth';
import type { AtomModule, AtomType } from '@/types/item';
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
          // o nascimento é gravado na fila NA HORA: se o selo falhar depois,
          // a próxima janela sela — nunca recaptura
          await send(userId, entry, (itemId) => {
            queue = queue.map((e) => (e.id === entry.id ? rememberItem(e, itemId) : e));
            write(userId, queue);
          });
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

/** Sela o que ainda falta num ponto que nasceu antes — nunca reclassifica.
 *  (classify exige estágio 1; structure exige 2 — repetir jogaria erro e
 *  travaria a fila pra sempre.) */
async function selarOQueFalta(
  itemId: string,
  type: AtomType,
  module: AtomModule,
  body: Record<string, unknown>,
): Promise<void> {
  const atual = await itemService.getById(itemId);
  if (atual.genesis_stage === 1) {
    await pipelineService.quickClassifyAndStructure(itemId, type, module, body);
  } else if (atual.genesis_stage === 2) {
    await pipelineService.structure(itemId, body);
  }
  // estágio ≥ 3: já selado numa janela anterior — nada a fazer
}

// Executa uma entrada — mesmos caminhos da boca online (face @).
// `remember` grava na fila o id do ponto assim que ele nasce.
async function send(
  userId: string,
  entry: OutboxEntry,
  remember: (itemId: string) => void,
): Promise<void> {
  if (entry.kind === 'soul') {
    await soulService.persistSoulCheckin({ userId, emotion: entry.emotion, note: entry.note });
    return;
  }

  const jaNasceu = bornItemId(entry);

  if (entry.kind === 'list') {
    const corpo = { entries: entry.entries.map((t) => ({ text: t, done: false })) };
    if (jaNasceu) {
      await selarOQueFalta(jaNasceu, 'list', 'bridge', corpo);
      return;
    }
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
      remember(item.id);
      await pipelineService.quickClassifyAndStructure(item.id, 'list', 'bridge', corpo);
    }
    return;
  }

  // captura — o ponto nasce; tokens explícitos ainda valem como assentimento
  let itemId = jaNasceu;
  if (!itemId) {
    const item = await pipelineService.capture(entry.title, userId);
    itemId = item.id;
    remember(itemId);
  }
  // update é idempotente — repetir na retomada não estraga nada
  if (entry.notes) await itemService.update(itemId, { notes: entry.notes });
  if (entry.hasTokens && entry.type && entry.module) {
    const body = entry.dueDate ? { operations: { due_date: entry.dueDate } } : {};
    if (jaNasceu) await selarOQueFalta(itemId, entry.type, entry.module, body);
    else await pipelineService.quickClassifyAndStructure(itemId, entry.type, entry.module, body);
  }
}
