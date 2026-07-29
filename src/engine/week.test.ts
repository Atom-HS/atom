// engine/week.test.ts — a pressão dos próximos dias (ato IV)
import { describe, it, expect } from 'vitest';
import { dayName, pressureLine, weekAhead } from './week';
import type { AtomItem } from '@/types/item';

// quarta-feira, 29 jul 2026, 10h local
const NOW = new Date(2026, 6, 29, 10, 0, 0);

function emDias(n: number, hora = 9): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + n);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
}

function dayKeyEmDias(n: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function item(over: Partial<AtomItem> = {}): AtomItem {
  return {
    id: `i${Math.random()}`, user_id: 'u1', title: 'x', type: 'task', module: 'work',
    tags: [], status: 'active', state: 'structured', genesis_stage: 3,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_at: NOW.toISOString(), updated_at: NOW.toISOString(),
    created_by: null, ...over,
  } as AtomItem;
}

const ops = (due: string) => ({
  operations: {
    due_date: due,
    priority: null, deadline: null, project_status: null, progress_mode: null, progress: null,
  },
});

const fixo = (n: number, hora = 9) => item({ body: { start: emDias(n, hora), end: emDias(n, hora + 1) } });
const entrega = (n: number) => item({ body: ops(dayKeyEmDias(n)) });

describe('weekAhead — a janela começa amanhã', () => {
  it('hoje fica de fora: a página inteira já é hoje', () => {
    const loads = weekAhead([fixo(0), fixo(0, 14)], NOW);
    expect(loads).toHaveLength(7);
    expect(loads.every((l) => l.total === 0)).toBe(true);
  });

  it('conta hora marcada e entrega no dia certo', () => {
    const loads = weekAhead([fixo(2), fixo(2, 14), entrega(2)], NOW);
    const dia2 = loads.find((l) => l.dayKey === dayKeyEmDias(2))!;
    expect(dia2).toMatchObject({ marcadas: 2, entregas: 1, total: 3 });
  });

  it('all-day não ocupa a agenda — não é hora marcada', () => {
    const allDay = item({ body: { start: dayKeyEmDias(3), all_day: true } });
    const dia3 = weekAhead([allDay], NOW).find((l) => l.dayKey === dayKeyEmDias(3))!;
    expect(dia3.marcadas).toBe(0);
  });

  it('só acionável e ativo conta como entrega', () => {
    const feito = item({ body: ops(dayKeyEmDias(1)), status: 'completed' });
    const nota = item({ type: 'note', body: ops(dayKeyEmDias(1)) });
    const dia1 = weekAhead([feito, nota], NOW).find((l) => l.dayKey === dayKeyEmDias(1))!;
    expect(dia1.entregas).toBe(0);
  });

  it('fora da janela não entra', () => {
    const loads = weekAhead([fixo(9), entrega(30)], NOW);
    expect(loads.every((l) => l.total === 0)).toBe(true);
  });
});

describe('dayName — o dia como quem fala', () => {
  it('amanhã tem nome próprio', () => {
    const amanha = new Date(NOW);
    amanha.setDate(amanha.getDate() + 1);
    expect(dayName(amanha, NOW)).toBe('amanhã');
  });

  it('depois disso, o dia da semana sem o -feira', () => {
    const daqui2 = new Date(NOW);
    daqui2.setDate(daqui2.getDate() + 2);
    expect(dayName(daqui2, NOW)).toBe('sexta');
  });
});

describe('pressureLine — sussurro, nunca alarme', () => {
  it('semana leve é silêncio (a raridade é o que faz valer)', () => {
    expect(pressureLine(weekAhead([fixo(1), entrega(3)], NOW), NOW)).toBeNull();
  });

  it('o dia cheio aparece em estado, sem juízo', () => {
    const linha = pressureLine(weekAhead([fixo(2), fixo(2, 14), entrega(2)], NOW), NOW);
    expect(linha).toBe('sexta: 2 horas marcadas e 1 pra entregar');
    expect(linha).not.toMatch(/sobrecarr|demais|pesado|cuidado|!/);
  });

  it('só horas marcadas, sem inventar entrega', () => {
    expect(pressureLine(weekAhead([fixo(1), fixo(1, 12), fixo(1, 15)], NOW), NOW))
      .toBe('amanhã: 3 horas marcadas');
  });

  it('só entregas, sem inventar hora', () => {
    expect(pressureLine(weekAhead([entrega(4), entrega(4), entrega(4)], NOW), NOW))
      .toMatch(/^domingo: 3 pra entregar$/);
  });

  it('empate escolhe o dia mais próximo — o que chega antes pesa antes', () => {
    const linha = pressureLine(
      weekAhead([entrega(2), entrega(2), entrega(2), entrega(5), entrega(5), entrega(5)], NOW),
      NOW,
    );
    expect(linha).toBe('sexta: 3 pra entregar');
  });

  it('singular fala no singular', () => {
    const linha = pressureLine(weekAhead([fixo(1), entrega(1), entrega(1)], NOW), NOW);
    expect(linha).toBe('amanhã: 1 hora marcada e 2 pra entregar');
  });
});
