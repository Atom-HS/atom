// engine/bilhete.test.ts — a prova da lógica do bilhete (spec 03 v2)
import { describe, expect, it } from 'vitest';
import { bilheteGesto, bilhetePendente, type Bilhete } from './bilhete';

const b = (over: Partial<Bilhete>): Bilhete => ({
  id: 'b1',
  gatilho: 'arm-disabled',
  texto: 'O braço Atom/saude foi desligado no Gmail. A estrutura lá fora não existe mais.',
  nasceu_em: '2026-07-31T07:15:00Z',
  exibido_em: null,
  visto_em: null,
  ...over,
});

describe('bilhetePendente — um por vez, o mais antigo primeiro', () => {
  it('vazio → silêncio (null)', () => {
    expect(bilhetePendente([])).toBeNull();
  });

  it('todos vistos → silêncio', () => {
    expect(bilhetePendente([b({ visto_em: '2026-07-31T08:00:00Z' })])).toBeNull();
  });

  it('o segundo espera o primeiro ser visto — sai o mais antigo', () => {
    const primeiro = b({ id: 'a', nasceu_em: '2026-07-30T07:15:00Z' });
    const segundo = b({ id: 'z', nasceu_em: '2026-07-31T07:15:00Z' });
    expect(bilhetePendente([segundo, primeiro])?.id).toBe('a');
  });

  it('visto sai da fila — o próximo assume', () => {
    const visto = b({ id: 'a', nasceu_em: '2026-07-30T07:15:00Z', visto_em: '2026-07-30T09:00:00Z' });
    const vivo = b({ id: 'z', nasceu_em: '2026-07-31T07:15:00Z' });
    expect(bilhetePendente([visto, vivo])?.id).toBe('z');
  });
});

describe('bilheteGesto — se lê e se solta, sem X', () => {
  it('nunca exibido → exibir', () => {
    expect(bilheteGesto(b({}), false)).toBe('exibir');
  });

  it('exibido nesta abertura → manter (não some na cara do leitor)', () => {
    expect(bilheteGesto(b({ exibido_em: '2026-07-31T08:00:00Z' }), true)).toBe('manter');
  });

  it('exibido em abertura anterior → soltar (some sozinho)', () => {
    expect(bilheteGesto(b({ exibido_em: '2026-07-30T08:00:00Z' }), false)).toBe('soltar');
  });
});
