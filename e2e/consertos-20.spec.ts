// e2e/consertos-20.spec.ts — o exame fotográfico dos consertos da auditoria 20
// NÃO é gate: roda sob demanda, fotografa os consertos 1–4 e prova o 7.
// Mundo hermético COM ESTADO: o mock guarda os PATCHes, então a fila encolhe
// de verdade na foto — e o POST em atom_events (rastro `touch` do conserto 7)
// é capturado e gravado como prova em rastro-touch.json.
// Rodar: npx playwright test e2e/consertos-20.spec.ts --project=mobile
import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';
import * as fs from 'node:fs';

const OUT = 'docs/onda-4/21_consertos-fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

// ─── o tronco de mentira (com estado) ────────────────────

type Row = Record<string, unknown> & { id: string };

const base = {
  user_id: 'e2e-test-user-0001',
  created_by: 'e2e-test-user-0001',
  source: 'mindroot',
  notes: null,
  created_at: '2026-07-30T09:00:00Z',
  updated_at: '2026-07-30T09:00:00Z',
};
const inbox = { status: 'inbox', state: 'inbox', genesis_stage: 1 };

function itens(): Row[] {
  const hoje = new Date().toISOString();
  return [
    // a chegada de hoje já no tronco — o ritual da aurora não abre por cima
    // das fotos (é a MESMA regra do app: chegou hoje, não re-pergunta)
    { ...base, id: 'ck-aurora', title: 'cheguei: focado', type: 'checkpoint', module: 'mind', tags: ['checkin', 'aurora'], status: 'completed', state: 'committed', genesis_stage: 7, created_at: hoje, updated_at: hoje, body: {} },
    // 9 com leitura pronta (conector/AI já leu — entram no bloco, D69)
    { ...base, ...inbox, id: 'c-01', title: 'Reunião de obra — Atlas Frames', type: 'ritual', module: 'work', tags: ['#connector', '#source:google-calendar'], body: {} },
    { ...base, ...inbox, id: 'c-02', title: 'Pagar registro do carro', type: 'task', module: 'bridge', tags: ['#connector', '#source:gmail'], body: {} },
    { ...base, ...inbox, id: 'c-03', title: 'Newsletter — Supabase changelog', type: 'note', module: 'mind', tags: ['#connector', '#source:gmail'], body: {} },
    { ...base, ...inbox, id: 'c-04', title: 'Treino de pernas', type: 'ritual', module: 'body', tags: ['#connector', '#source:google-calendar'], body: {} },
    { ...base, ...inbox, id: 'c-05', title: 'Ligar pro contador', type: 'task', module: 'work', tags: [], body: {} },
    { ...base, ...inbox, id: 'c-06', title: 'Mural de fotos da família', type: 'note', module: 'family', tags: [], body: {} },
    { ...base, ...inbox, id: 'c-07', title: 'Café com a Ana', type: 'ritual', module: 'family', tags: ['#connector', '#source:google-calendar'], body: {} },
    { ...base, ...inbox, id: 'c-08', title: 'Spec do configurador', type: 'spec', module: 'work', tags: [], body: {} },
    { ...base, ...inbox, id: 'c-09', title: 'Beber água ao acordar', type: 'habit', module: 'body', tags: [], body: {} },
    // 3 capturas cruas (sem type — ficam no um-a-um, onde a leitura acontece)
    { ...base, ...inbox, id: 'r-01', title: 'aquilo do seguro... ver depois', type: null, module: null, tags: [], body: {} },
    { ...base, ...inbox, id: 'r-02', title: 'estacionamento 45 min grátis', type: null, module: null, tags: [], body: {} },
    { ...base, ...inbox, id: 'r-03', title: 'olhar isso com calma', type: null, module: null, tags: [], body: {} },
    // os do detalhe: prazo/prioridade virgens (conserto 3) e o convite do 5 (conserto 2)
    { ...base, id: 'd-01', title: 'Renovar o passaporte', type: 'task', module: 'family', tags: [], status: 'active', state: 'classified', genesis_stage: 2, body: {} },
    { ...base, id: 'd-02', title: 'Landing /expo do Atlas Frames', type: 'project', module: 'work', tags: [], status: 'active', state: 'connected', genesis_stage: 5, body: {} },
  ];
}

async function mockTronco(page: Page, db: Row[]) {
  // catch-all primeiro: tabelas fora do elenco (e_bilhetes etc.) devolvem vazio
  await page.route('**/rest/v1/**', (route) =>
    route.fulfill({ json: route.request().method() === 'GET' ? [] : {} }));
  await page.route('**/rest/v1/items*', async (route) => {
    const req = route.request();
    const idEq = new URL(req.url()).searchParams.get('id');
    const id = idEq?.startsWith('eq.') ? idEq.slice(3) : null;
    if (req.method() === 'GET') {
      if (id) return route.fulfill({ json: db.find((i) => i.id === id) ?? {} });
      return route.fulfill({ json: db });
    }
    if (req.method() === 'PATCH' && id) {
      const alvo = db.find((i) => i.id === id);
      if (alvo) Object.assign(alvo, req.postDataJSON());
      return route.fulfill({ json: alvo ?? {} });
    }
    return route.fulfill({ json: {} });
  });
}

async function chegar(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

// ─── consertos 1 (lote na esteira) e o puxador ───────────

test('esteira em bloco: marcar lidos, aceitar, e a fila encolhe de verdade', async ({ authenticatedPage: page }) => {
  test.setTimeout(180_000);
  const db = itens();
  await mockTronco(page, db);

  // 1 — HOJE: o puxador diz quantos esperam (D46: estado, nunca badge)
  await chegar(page, '/hoje');
  await page.screenshot({ path: shot('01-hoje-puxador'), fullPage: true });

  // 2 — o gesto de sempre: um a um, o card do conector com a leitura visível
  await page.getByRole('button', { name: /esperando leitura/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot('02-esteira-um-a-um') });

  // 3 — o modo novo: em bloco, cada linha mostra a leitura que seria aceita
  await page.getByRole('button', { name: 'em bloco', exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('03-esteira-em-bloco') });

  // 4 — marcar lidos (9): só o que tem leitura pronta entra
  await page.getByRole('button', { name: /marcar lidos/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('04-marcar-lidos') });

  // 5 — um cru na seleção: a casa avisa que sem leitura só vai pro arquivo
  await page.getByRole('button', { name: /estacionamento 45 min/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot('05-cru-so-arquivo') });
  await page.getByRole('button', { name: /estacionamento 45 min/ }).click(); // desfaz

  // 6 — aceitar leituras (9): grava, conta, e a fila encolhe
  await page.getByRole('button', { name: /aceitar leituras/ }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: shot('06-aceitas-fila-encolheu') });
  expect(db.filter((i) => i.state === 'inbox')).toHaveLength(3);

  // 7 — sobraram os 3 crus; dois vão pro arquivo em lote
  await page.getByRole('button', { name: /estacionamento 45 min/ }).click();
  await page.getByRole('button', { name: /olhar isso com calma/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /guardar no arquivo/ }).click();
  await page.waitForTimeout(1500);
  // fila de 1 volta ao card sozinha — o cru que ficou espera leitura na frente do humano
  await page.screenshot({ path: shot('07-arquivo-e-volta-ao-card') });
  expect(db.filter((i) => i.state === 'inbox')).toHaveLength(1);
  const arquivados = db.filter((i) => i.state === 'archived');
  expect(arquivados.map((i) => i.status)).toEqual(['archived', 'archived']); // status E state (bug latente morto)
});

// ─── consertos 3 (prazo/prioridade), 2 (convite honesto) e 7 (rastro) ───

test('detalhe: prazo e prioridade ganham porta, o convite diz o destino, concluir deixa rastro', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  const db = itens();
  await mockTronco(page, db);

  // o rastro do conserto 7: capturar todo POST em atom_events
  const rastro: Array<Record<string, unknown>> = [];
  page.on('request', (r) => {
    if (r.url().includes('atom_events') && r.method() === 'POST') {
      try { rastro.push(r.postDataJSON()); } catch { /* corpo não-JSON não interessa */ }
    }
  });

  // 8 — os chips virgens: prazo? prioridade? (a porta que faltava, § 7.3)
  await chegar(page, '/item/d-01');
  await page.screenshot({ path: shot('08-detalhe-chips-virgens'), fullPage: true });

  // 9 — dar prazo: o date picker nativo, limpar é gesto de primeira classe
  await page.getByRole('button', { name: 'prazo?' }).click();
  await page.waitForTimeout(300);
  await page.locator('input[type="date"]').fill('2026-08-15');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'prioridade?' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot('09-prazo-dado-prioridade-aberta') });
  await page.getByRole('button', { name: /alta/ }).click(); // o botão diz «○ alta»
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('10-prazo-e-prioridade-dados') });

  // 11 — concluir pelo seletor de status: o gesto que agora deixa rastro (D63)
  await page.getByRole('button', { name: 'ativo', exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'concluido', exact: true }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot('11-concluido-com-rastro') });

  // a prova do conserto 7: o touch saiu no fio
  expect(rastro.some((e) => e.event_type === 'touch' && e.source_id === 'd-01')).toBe(true);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/rastro-touch.json`, JSON.stringify(rastro, null, 2));

  // 12 — o convite do 5 diz o destino real: ⬠ → ○ selar (nunca mais «abrir pro mundo»)
  await chegar(page, '/item/d-02');
  await page.screenshot({ path: shot('12-convite-honesto'), fullPage: true });
});
