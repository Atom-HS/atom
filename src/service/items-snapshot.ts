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
