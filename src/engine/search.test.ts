// engine/search.test.ts — o motor de 347 linhas que vivia sem gate
// (benchmark 16 §busca: «a falha aparece só em escala, invisível no teste
// com 50 itens» — então aqui tem escala também)
import { describe, it, expect } from 'vitest';
import {
  EMPTY_FILTERS,
  extractTags,
  hasActiveFilters,
  normalize,
  parseSearchQuery,
  prefixVocabulary,
  searchItems,
} from './search';
import type { AtomItem } from '@/types/item';

function item(over: Partial<AtomItem> = {}): AtomItem {
  return {
    id: `i${Math.random()}`, user_id: 'u1', title: 'Item', type: 'task', module: 'work',
    tags: [], status: 'active', state: 'structured', genesis_stage: 3,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_at: '2026-07-01T10:00:00Z', updated_at: '2026-07-01T10:00:00Z',
    created_by: null, ...over,
  } as AtomItem;
}

const busca = (items: AtomItem[], q: string) => searchItems(items, parseSearchQuery(q));

describe('normalize — acento não separa quem procura de quem guardou', () => {
  it('caixa e acento somem', () => {
    expect(normalize('Orçamento ATLAS')).toBe('orcamento atlas');
    expect(normalize('reunião')).toBe('reuniao');
  });
});

describe('parseSearchQuery — os prefixos', () => {
  it('lê módulo, tipo e tag', () => {
    const f = parseSearchQuery('mod:work tipo:task tag:vidro');
    expect(f).toMatchObject({ module: 'work', type: 'task', tag: 'vidro', text: '' });
  });

  it('aceita o nome longo e o português', () => {
    expect(parseSearchQuery('modulo:body').module).toBe('body');
    expect(parseSearchQuery('tipo:tarefa').type).toBe('task');
    expect(parseSearchQuery('prio:alta').priority).toBe('high');
  });

  it('o resto vira texto livre, na ordem em que veio', () => {
    expect(parseSearchQuery('mod:work orçamento do vidro').text).toBe('orçamento do vidro');
  });

  it('dois-pontos no meio de uma palavra comum não vira filtro', () => {
    expect(parseSearchQuery('nota: comprar pão').text).toBe('nota: comprar pão');
    expect(parseSearchQuery('nota: comprar pão').desconhecidos).toEqual([]);
  });
});

// A mentira que o benchmark do GitHub expôs: prefixo certo + valor que não
// existe virava TEXTO LIVRE. A busca procurava «mod:xyz» no título, achava
// nada, e a tela dizia «nada com esse nome no tronco» — o usuário concluía
// que não tinha o item, quando o que não existia era o filtro.
describe('filtro que não existe é nomeado, nunca engolido', () => {
  it('valor inválido de prefixo conhecido é registrado', () => {
    const f = parseSearchQuery('mod:xyz');
    expect(f.desconhecidos).toEqual([{ prefix: 'mod', value: 'xyz' }]);
    expect(f.text).toBe(''); // e NÃO virou busca literal por «mod:xyz»
  });

  it('vale pra todos os prefixos da casa', () => {
    expect(parseSearchQuery('tipo:foo').desconhecidos[0].prefix).toBe('tipo');
    expect(parseSearchQuery('prio:urgentissimo').desconhecidos[0].prefix).toBe('prio');
    expect(parseSearchQuery('data:ontem').desconhecidos[0].prefix).toBe('data');
    expect(parseSearchQuery('emo:radiante').desconhecidos[0].prefix).toBe('emo');
  });

  it('prefixo que a casa nem conhece segue sendo texto livre', () => {
    const f = parseSearchQuery('http://exemplo.com');
    expect(f.desconhecidos).toEqual([]);
    expect(f.text).toBe('http://exemplo.com');
  });

  it('o filtro bom sobrevive ao filtro ruim ao lado', () => {
    const f = parseSearchQuery('mod:work tipo:inexistente');
    expect(f.module).toBe('work');
    expect(f.desconhecidos).toHaveLength(1);
  });

  it('filtro inexistente não alarga o resultado — devolve nada, e a tela explica', () => {
    const a = item({ title: 'um', module: 'work' });
    const b = item({ title: 'dois', module: 'body' });
    // ignorar o filtro ruim e devolver o tronco inteiro seria apresentar
    // lista NÃO filtrada como filtrada: mentira de outro formato
    expect(busca([a, b], 'mod:xyz')).toHaveLength(0);
    expect(busca([a, b], 'mod:work tipo:foo')).toHaveLength(0);
    // e sem filtro ruim, o filtro bom segue funcionando
    expect(busca([a, b], 'mod:work')).toHaveLength(1);
  });
});

describe('searchItems — o que casa e o que não', () => {
  const vidro = item({ title: 'Orçamento do vidro', tags: ['#atlas'] });
  const nota = item({ title: 'Reunião', notes: 'falar do vidro temperado' });
  const outro = item({ title: 'Comprar café' });

  it('título ganha de notas, que ganha de tag', () => {
    const r = busca([nota, vidro], 'vidro');
    expect(r[0].item.id).toBe(vidro.id);
    expect(r[0].matchField).toBe('title');
    expect(r[1].matchField).toBe('notes');
  });

  it('começo do título ganha de meio do título', () => {
    const comeco = item({ title: 'vidro temperado' });
    const meio = item({ title: 'orçamento de vidro' });
    expect(busca([meio, comeco], 'vidro')[0].item.id).toBe(comeco.id);
  });

  it('acento não separa quem procura de quem guardou', () => {
    expect(busca([vidro], 'orcamento')).toHaveLength(1);
    expect(busca([vidro], 'ORÇAMENTO')).toHaveLength(1);
  });

  it('o que não casa fica fora', () => {
    expect(busca([outro], 'vidro')).toHaveLength(0);
  });

  it('arquivado nunca volta pela busca', () => {
    const morto = item({ title: 'vidro antigo', status: 'archived' });
    expect(busca([morto], 'vidro')).toHaveLength(0);
  });

  it('filtro sem texto devolve tudo que passa no filtro', () => {
    const corpo = item({ title: 'correr', module: 'body' });
    expect(busca([vidro, corpo], 'mod:body')).toHaveLength(1);
  });

  it('tag casa por pedaço (#atlas acha por atlas)', () => {
    expect(busca([vidro], 'tag:atlas')).toHaveLength(1);
  });

  it('filtros se somam, nunca se anulam', () => {
    const a = item({ title: 'x', module: 'work', type: 'task' });
    const b = item({ title: 'x', module: 'work', type: 'note' });
    expect(busca([a, b], 'mod:work tipo:task')).toHaveLength(1);
  });
});

// Frecency é table stake da categoria. Empate resolvido por ordem alfabética
// é ranking por acaso: «Almoço» vinha antes de «Zoom com o contador» só por
// começar com A.
describe('empate desempata por recência, não por alfabeto', () => {
  it('o tocado por último vem primeiro', () => {
    // empate real: as duas casam no MEIO do título (score 80), então quem
    // decide é o desempate. No alfabeto o «a…» venceria; na recência, o «b…»
    const antigo = item({ title: 'a peça de vidro antiga', updated_at: '2026-07-01T10:00:00Z' });
    const novo = item({ title: 'b peça de vidro nova', updated_at: '2026-07-28T10:00:00Z' });
    expect(busca([antigo, novo], 'vidro')[0].item.id).toBe(novo.id);
  });

  it('editar depois conta mais que ter nascido', () => {
    const nascidoTarde = item({ title: 'vidro A', created_at: '2026-07-20T10:00:00Z', updated_at: '2026-07-20T10:00:00Z' });
    const editadoHoje = item({ title: 'vidro B', created_at: '2026-01-01T10:00:00Z', updated_at: '2026-07-29T10:00:00Z' });
    expect(busca([nascidoTarde, editadoHoje], 'vidro')[0].item.id).toBe(editadoHoje.id);
  });
});

describe('a escala, que é onde a busca quebra de verdade', () => {
  const muitos = Array.from({ length: 3000 }, (_, n) =>
    item({
      title: n === 1500 ? 'a agulha no palheiro' : `item comum ${n}`,
      module: n % 2 ? 'work' : 'body',
      updated_at: `2026-07-${String((n % 28) + 1).padStart(2, '0')}T10:00:00Z`,
    }),
  );

  it('acha a agulha em 3000', () => {
    const r = busca(muitos, 'agulha');
    expect(r).toHaveLength(1);
    expect(r[0].item.title).toContain('agulha');
  });

  it('filtro em 3000 devolve só o lado certo', () => {
    expect(busca(muitos, 'mod:body').every((r) => r.item.module === 'body')).toBe(true);
  });

  it('não trava: 3000 itens resolvem em tempo de gesto', () => {
    const t0 = performance.now();
    busca(muitos, 'comum');
    // o padrão da categoria é 100ms (Superhuman mira 50–60ms). Aqui o teto é
    // frouxo de propósito — o que se guarda é a ordem de grandeza, não o relógio
    expect(performance.now() - t0).toBeLessThan(400);
  });
});

describe('vocabulário e rótulos — o que a tela tem pra ensinar', () => {
  it('o vocabulário lista os prefixos com valores reais', () => {
    const v = prefixVocabulary();
    expect(v.map((x) => x.prefix)).toContain('mod');
    expect(v.find((x) => x.prefix === 'mod')?.values).toContain('work');
    expect(v.find((x) => x.prefix === 'data')?.values).toEqual(['hoje', 'semana', 'atrasado', 'futuro']);
  });

  it('hasActiveFilters não confunde texto com filtro', () => {
    expect(hasActiveFilters(parseSearchQuery('vidro'))).toBe(false);
    expect(hasActiveFilters(parseSearchQuery('mod:work'))).toBe(true);
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it('extractTags junta e ordena sem repetir', () => {
    const a = item({ tags: ['#b', '#a'] });
    const b = item({ tags: ['#a', '#c'] });
    expect(extractTags([a, b])).toEqual(['#a', '#b', '#c']);
  });
});
