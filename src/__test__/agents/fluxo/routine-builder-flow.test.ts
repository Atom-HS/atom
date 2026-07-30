import { describe, it, expect, beforeEach } from 'vitest';
import { useBuilderStore } from '@/features/raiz/builder-store';

describe('AGENTE FLUXO — Routine Builder end-to-end', () => {
  beforeEach(() => useBuilderStore.getState().reset());

  it('fluxo completo: selecionar modulo → responder → gerar items → wrap', () => {
    const store = useBuilderStore.getState();

    store.startModule('body');
    expect(useBuilderStore.getState().activeModule).toBe('body');

    store.answerQuestion('body-1', true);
    store.answerQuestion('body-2', 'yoga');
    store.answerQuestion('body-3', '4');
    store.answerQuestion('body-4', '06:00 acordar — 22:00 dormir');
    store.answerQuestion('body-5', true);
    store.answerQuestion('body-6', 'meditacao 10 min');
    store.answerQuestion('body-7', 'alongar, respirar fundo'); // D64: a pergunta-condição

    const state = useBuilderStore.getState();
    expect(state.activeModule).toBeNull();
    expect(state.completedModules).toContain('body');
    expect(state.generatedItems.length).toBeGreaterThan(0);

    // D64: a entrevista pare estruturas — cadeia (2+ elos) e protocolo
    expect(state.generatedRoutines).toHaveLength(1);
    expect(state.generatedRoutines[0].eloTempIds.length).toBeGreaterThanOrEqual(2);
    expect(state.generatedProtocols).toHaveLength(1);
    expect(state.generatedProtocols[0].steps).toEqual(['alongar', 'respirar fundo']);

    state.generatedItems.forEach(item => {
      expect(item.tags).toContain('#raiz');
      expect(item.tags).toContain('#routine-builder');
      expect(item.module).toBe('body');
    });
  });

  it('fluxo: dois modulos sequenciais acumulam items', () => {
    const store = useBuilderStore.getState();

    store.startModule('finance');
    store.answerQuestion('finance-1', false);
    store.answerQuestion('finance-3', 'poupar 5k');
    store.answerQuestion('finance-4', 'monthly');

    const afterFirst = useBuilderStore.getState().generatedItems.length;

    store.startModule('mind');
    store.answerQuestion('mind-1', false);
    store.answerQuestion('mind-3', 'podcast IA');
    store.answerQuestion('mind-4', false);
    store.answerQuestion('mind-6', 'aprender rust');
    store.answerQuestion('mind-7', ''); // condição vazia → protocolo não nasce (piso mínimo)

    const state = useBuilderStore.getState();
    expect(state.generatedItems.length).toBeGreaterThan(afterFirst);
    expect(state.completedModules).toContain('mind');
    expect(state.generatedProtocols).toHaveLength(0);
  });
});
