// e2e/teste-real-virtual.spec.ts — o teste real virtual (mesa da sessão, item 3)
// NÃO é gate: roda sob demanda. O item 3 da mesa pedia o teste ao vivo dos 178
// reais — a vida é do Rick; aqui a casa faz o ensaio geral com a MATÉRIA real:
// o retrato do banco vivo de 3 Ago (187 no inbox — eram 178 na auditoria 20),
// puxado por Management API (leitura apenas) e semeado no mundo hermético COM
// ESTADO do exame 21. Produção não é tocada; os gestos são os de verdade.
// Rodar: npx playwright test e2e/teste-real-virtual.spec.ts --project=mobile
import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';
import * as fs from 'node:fs';

const OUT = 'docs/onda-4/23_teste-real-fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

// ─── o retrato vivo (3 Ago 2026, 187 no inbox + check-in de hoje) ────────
// user_id real → usuário do mundo de teste, pro mundo ficar consistente.
// Todo o resto — títulos, tags, datas, módulos — é a vida como ela está.

type Row = Record<string, unknown> & { id: string; state?: string };

const E2E_USER = 'e2e-test-user-0001';
// a protagonista do ato do detalhe: task real, família, marcada #hoje
const LISA_ID = 'f696767f';

function retrato(): Row[] {
  const raw = JSON.parse(
    fs.readFileSync('e2e/seed/retrato-vivo-2026-08-03.json', 'utf-8'),
  ) as Row[];
  return raw.map((r) => ({ ...r, user_id: E2E_USER, created_by: E2E_USER, body: r.body ?? {} }));
}

function acharLisa(db: Row[]): Row {
  const lisa = db.find((i) => i.id.startsWith(LISA_ID));
  if (!lisa) throw new Error('a task da Lisa não está no retrato — regravar o seed');
  return lisa;
}

async function mockTronco(page: Page, db: Row[]) {
  // catch-all primeiro: tabelas fora do elenco devolvem vazio
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

async function chegar(page: Page, path_: string) {
  await page.goto(path_);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

// ─── ato I — os 187 reais: puxador → em bloco → marcar lidos → aceitar ───

test('os 187 reais: a fila da vida encolhe 187 → 26 no gesto em bloco', async ({ authenticatedPage: page }) => {
  test.setTimeout(420_000);
  const db = retrato();
  const inbox0 = db.filter((i) => i.state === 'inbox').length;
  const crus = db.filter((i) => i.state === 'inbox' && !i.type).length;
  // o achado que só matéria real expõe: 2 itens vivem em state='inbox' com
  // genesis_stage=2 (Aurora briefings de junho) — o fsm recusa o classify
  // deles («Item nao esta no inbox») e o aceite em bloco não os drena.
  const travados = db.filter((i) => i.state === 'inbox' && i.type && i.genesis_stage !== 1).length;
  expect(inbox0).toBe(187); // o retrato é o da auditoria, crescido: 178 → 187
  expect(travados).toBe(2);
  await mockTronco(page, db);

  // 1 — HOJE: o puxador diz o número da vida real (D46: estado, nunca badge)
  await chegar(page, '/hoje');
  await page.screenshot({ path: shot('01-hoje-187-reais'), fullPage: true });

  // 2 — um a um: o primeiro card da fila real
  await page.getByRole('button', { name: /esperando leitura/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot('02-um-a-um-real') });

  // 3 — em bloco: cada linha real mostra a leitura que seria aceita
  await page.getByRole('button', { name: 'em bloco', exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('03-em-bloco-real') });

  // 4 — marcar lidos (163): só o que tem leitura pronta entra
  await page.getByRole('button', { name: /marcar lidos/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('04-marcar-lidos-163') });

  // 5 — aceitar leituras (163): o selo segue sendo do humano, um a um no fio.
  // 161 gravam; os 2 travados recusam — e a fila honesta para em 26, não 24.
  await page.getByRole('button', { name: /aceitar leituras/ }).click();
  await expect
    .poll(() => db.filter((i) => i.state === 'inbox').length, { timeout: 240_000 })
    .toBe(crus + travados);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot('05-aceitas-fila-26') });

  // 6 — o que sobra é o que pede olho: os 24 crus ficam pro um-a-um do Rick
  // (o teste NÃO os arquiva — essa decisão é da vida, não do ensaio) e os 2
  // travados ficam na foto como prova do drift state×stage.
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('06-o-que-sobra-24-crus-2-travados'), fullPage: true });
  expect(db.filter((i) => i.state === 'inbox' && !i.type).length).toBe(crus);
  const sobraram = db.filter((i) => i.state === 'inbox' && i.type);
  expect(sobraram.every((i) => i.genesis_stage !== 1)).toBe(true);
});

// ─── ato II — o gesto no item real: prazo, prioridade, concluído com rastro ───

test('a task da Lisa: prazo amanhã, prioridade alta, concluída — o touch sai no fio', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  const db = retrato();
  const lisa = acharLisa(db);
  // o item como fica logo depois do aceite do ato I (classify: inbox → classified)
  Object.assign(lisa, { state: 'classified', status: 'active', genesis_stage: 2 });
  delete (lisa.body as Record<string, unknown>).due_date;
  await mockTronco(page, db);

  // o rastro do conserto 7: capturar todo POST em atom_events
  const rastro: Array<Record<string, unknown>> = [];
  page.on('request', (r) => {
    if (r.url().includes('atom_events') && r.method() === 'POST') {
      try { rastro.push(r.postDataJSON()); } catch { /* corpo não-JSON não interessa */ }
    }
  });

  // 7 — «Confirmar Lisa leva Bella amanhã», chips virgens: prazo? prioridade?
  await chegar(page, `/item/${lisa.id}`);
  await page.screenshot({ path: shot('07-lisa-chips-virgens'), fullPage: true });

  // 8 — prazo: amanhã, literalmente o que o título pede
  await page.getByRole('button', { name: 'prazo?' }).click();
  await page.waitForTimeout(300);
  await page.locator('input[type="date"]').fill('2026-08-04');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'prioridade?' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot('08-prazo-amanha') });
  await page.getByRole('button', { name: /alta/ }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('09-prioridade-alta') });

  // 10 — concluir pelo seletor de status: o gesto que deixa rastro (D63)
  await page.getByRole('button', { name: 'ativo', exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'concluido', exact: true }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot('10-concluido-touch-real') });

  // a prova: o touch saiu no fio com o UUID real do item
  expect(rastro.some((e) => e.event_type === 'touch' && e.source_id === lisa.id)).toBe(true);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/rastro-touch-real.json`, JSON.stringify(rastro, null, 2));
});
