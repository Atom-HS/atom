// service/items-snapshot.ts — o tronco de bolso (Onda 3 · D55)
// Último fetch bom, guardado por usuário: sem rede, o HOJE lê daqui — a
// lista no mercado, o protocolo na rua. Snapshot é conforto, não contrato:
// se o localStorage falhar (cheio, privado), o app segue sem ele.

import type { AtomItem } from '@/types/item';

const KEY = (userId: string) => `mindroot.items-snapshot.v1.${userId}`;

export function saveItemsSnapshot(userId: string, items: AtomItem[]): void {
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(items));
  } catch {
    // sem espaço ou sem permissão — o snapshot fica como estava
  }
}

export function loadItemsSnapshot(userId: string): AtomItem[] | null {
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AtomItem[]) : null;
  } catch {
    return null;
  }
}

/**
 * Corrida com prazo: a promessa que não responde perde pro bolso.
 * A dissecação 04 provou que sem rede o fetch do tronco NUNCA resolve —
 * nem rejeita — e o catch que leria o snapshot era código inalcançável:
 * o HOJE ficava em «…» pra sempre, com o bolso gravado do lado. Um erro
 * de rede que não chega é pior que um que chega; o prazo o materializa.
 */
export function comPrazo<T>(promessa: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const relogio = setTimeout(() => reject(new Error('a rede não respondeu')), ms);
    promessa.then(
      (v) => { clearTimeout(relogio); resolve(v); },
      (e) => { clearTimeout(relogio); reject(e); },
    );
  });
}
