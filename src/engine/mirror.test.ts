// engine/mirror.test.ts — o espelho no tempo (F9)
// A regra de ouro sob teste: padrão só COM saída; pouco dado = silêncio.
import { describe, it, expect } from 'vitest';
import { mirror, readDays } from './mirror';
import type { AtomEvent, AtomItem } from '@/types/item';

const NOW = new Date('2026-07-27T20:00:00');

function at(daysBack: number, hour: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

let seq = 0;
function checkin(daysBack: number, emotion: string): AtomItem {
  return {
    id: `c${++seq}`,
    title: `sinto — ${emotion}`,
    type: 'checkpoint',
    tags: ['checkin'],
    created_at: at(daysBack, 7),
    updated_at: at(daysBack, 7),
    body: { soul: { emotion_before: emotion, emotion_after: null } },
    state: 'committed',
    status: 'completed',
  } as unknown as AtomItem;
}

function wrap(daysBack: number, emotionAfter: string): AtomItem {
  return {
    id: `w${++seq}`,
    title: 'Wrap',
    type: 'wrap',
    tags: ['wrap'],
    created_at: at(daysBack, 20),
    updated_at: at(daysBack, 20),
    body: { soul: { emotion_before: null, emotion_after: emotionAfter } },
    state: 'committed',
    status: 'completed',
  } as unknown as AtomItem;
}

function run(daysBack: number): AtomEvent {
  return {
    id: `e${++seq}`,
    user_id: 'u',
    source_id: 'p1',
    target_id: null,
    event_type: 'protocol_run',
    payload: {},
    created_at: at(daysBack, 10),
  };
}

describe('mirror — silêncio honesto', () => {
  it('sem dado nenhum → null (ainda ouvindo teus dias)', () => {
    expect(mirror([], [], NOW)).toBeNull();
  });

  it('menos de 3 dias com alma → null, mesmo com padrão aparente', () => {
    const items = [checkin(1, 'ansioso'), wrap(1, 'calmo')];
    expect(mirror(items, [run(1)], NOW)).toBeNull();
  });

  it('manhãs difíceis SEM saída comprovada → não vira diagnóstico', () => {
    // 4 manhãs ansiosas, nenhum protocolo, nenhuma noite leve: o espelho cala
    const items = [
      checkin(1, 'ansioso'), checkin(2, 'ansioso'), checkin(3, 'ansioso'), checkin(4, 'ansioso'),
    ];
    expect(mirror(items, [], NOW)).toBeNull();
  });
});

describe('mirror — padrão 1: o protocolo funciona', () => {
  it('manhã difícil + protocolo + noite leve, 2+ dias → nomeia com a saída', () => {
    const items = [
      checkin(1, 'ansioso'), wrap(1, 'calmo'),
      checkin(2, 'ansioso'), wrap(2, 'grato'),
      checkin(3, 'calmo'), wrap(3, 'calmo'),
    ];
    const m = mirror(items, [run(1), run(2)], NOW)!;
    expect(m.kind).toBe('protocolo');
    expect(m.text).toContain('2 manhãs ansiosas');
    expect(m.text).toContain('protocolo');
    expect(m.text).toContain('o corpo já sabe o caminho');
  });

  it('noite continuou difícil → o padrão NÃO fecha (sem saída, sem fala)', () => {
    const items = [
      checkin(1, 'ansioso'), wrap(1, 'frustrado'),
      checkin(2, 'ansioso'), wrap(2, 'triste'),
      checkin(3, 'ansioso'), wrap(3, 'cansado'),
    ];
    const m = mirror(items, [run(1), run(2), run(3)], NOW);
    // cai pro padrão do rito (3 wraps seguidos) — nunca pro diagnóstico
    expect(m?.kind).not.toBe('protocolo');
  });
});

describe('mirror — padrão 2: o rito segurou', () => {
  it('3+ wraps em dias seguidos → nomeia a sequência', () => {
    const items = [
      checkin(1, 'calmo'), wrap(1, 'calmo'),
      checkin(2, 'calmo'), wrap(2, 'grato'),
      checkin(3, 'calmo'), wrap(3, 'calmo'),
    ];
    const m = mirror(items, [], NOW)!;
    expect(m.kind).toBe('rito');
    expect(m.text).toContain('3 dias selados seguidos');
  });
});

describe('readDays — o diário implícito', () => {
  it('1º check-in da manhã é a chegada; wrap é a noite; protocolo marca o dia', () => {
    const days = readDays(
      [checkin(1, 'ansioso'), checkin(1, 'calmo'), wrap(1, 'grato')],
      [run(1)],
      7,
      NOW,
    );
    expect(days).toHaveLength(1);
    expect(days[0].morning).toBe('ansioso'); // o primeiro vence
    expect(days[0].evening).toBe('grato');
    expect(days[0].protocolRan).toBe(true);
  });
});
