import { describe, it, expect } from 'vitest';
import { parseCapture } from './token-parser';

const TODAY = new Date('2026-05-22T10:00:00Z'); // sexta-feira

describe('parseCapture', () => {
  it('parses plain text sem tokens', () => {
    expect(parseCapture('comprar leite', TODAY)).toEqual({
      title: 'comprar leite', module: null, type: null, dueDate: null,
    });
  });

  it('extrai #module e remove do título', () => {
    expect(parseCapture('comprar leite #body', TODAY)).toEqual({
      title: 'comprar leite', module: 'body', type: null, dueDate: null,
    });
  });

  it('extrai @type e remove do título', () => {
    expect(parseCapture('comprar leite @task', TODAY)).toEqual({
      title: 'comprar leite', module: null, type: 'task', dueDate: null,
    });
  });

  it('extrai @hoje como dueDate ISO', () => {
    expect(parseCapture('comprar leite @hoje', TODAY)).toEqual({
      title: 'comprar leite', module: null, type: null, dueDate: '2026-05-22',
    });
  });

  it('combina todos os tokens', () => {
    expect(parseCapture('comprar leite #body @task @hoje', TODAY)).toEqual({
      title: 'comprar leite', module: 'body', type: 'task', dueDate: '2026-05-22',
    });
  });

  it('tokens em qualquer ordem/posição', () => {
    expect(parseCapture('@task #body comprar leite @hoje', TODAY)).toEqual({
      title: 'comprar leite', module: 'body', type: 'task', dueDate: '2026-05-22',
    });
  });

  it('@amanha resolve para +1 dia', () => {
    expect(parseCapture('coisa @amanha', TODAY).dueDate).toBe('2026-05-23');
  });

  it('@amanhã com acento resolve igual', () => {
    expect(parseCapture('coisa @amanhã', TODAY).dueDate).toBe('2026-05-23');
  });

  it('@semana resolve para +7 dias', () => {
    expect(parseCapture('coisa @semana', TODAY).dueDate).toBe('2026-05-29');
  });

  it('@seg (segunda) resolve para próxima segunda — TODAY é sexta', () => {
    // 22-mai-2026 é sexta (5). Próxima segunda = 25-mai (5+3 = 8 → wrap mod 7 = 3 dias adiante)
    expect(parseCapture('coisa @seg', TODAY).dueDate).toBe('2026-05-25');
  });

  it('@sex (sexta) num dia que JÁ é sexta resolve para próxima sexta (não hoje)', () => {
    expect(parseCapture('coisa @sex', TODAY).dueDate).toBe('2026-05-29');
  });

  it('case-insensitive', () => {
    expect(parseCapture('coisa #BODY @TASK', TODAY)).toMatchObject({
      module: 'body', type: 'task',
    });
  });

  it('tokens inválidos ficam no título', () => {
    expect(parseCapture('lembrete #xyz @blah', TODAY)).toEqual({
      title: 'lembrete #xyz @blah', module: null, type: null, dueDate: null,
    });
  });

  it('múltiplos espaços colapsam após remoção de token', () => {
    expect(parseCapture('comprar  #body  leite', TODAY).title).toBe('comprar leite');
  });

  it('título vazio se só tem tokens', () => {
    expect(parseCapture('#body @task', TODAY)).toEqual({
      title: '', module: 'body', type: 'task', dueDate: null,
    });
  });

  it('parse é determinístico (não muta input)', () => {
    const input = 'coisa #body';
    const before = input;
    parseCapture(input, TODAY);
    expect(input).toBe(before);
  });
});
