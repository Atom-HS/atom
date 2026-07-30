// e2e/dissecacao-01.spec.ts — exame da dissecação (docs/onda-3/13), features 1–3
// NÃO é gate: roda sob demanda, fotografa as cenas que provam os achados.
// Rodar: npx playwright test e2e/dissecacao-01.spec.ts --project=mobile
import { test } from './fixtures/auth';
import type { Page } from '@playwright/test';

// fora de e2e/results — o Playwright limpa o outputDir a cada rodada,
// e estas fotos são a prova dos achados do relatório
const OUT = 'docs/onda-3/14_dissecacao-01_fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

async function despejar(page: Page, texto: string) {
  await page.getByRole('textbox').first().fill(texto);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1400);
}

// ─── Feature 1 — HOJE ────────────────────────────────────

test('hoje: o dia cheio (sim)', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  await chegar(page, '/hoje');
  await page.screenshot({ path: shot('01-hoje-cheio'), fullPage: true });

  // a sugestão única: pedir outra, 4 vezes — cicla? esgota? repete?
  for (let i = 1; i <= 4; i++) {
    const card = page.locator('section', { hasText: 'o que cabe agora' });
    await card.screenshot({ path: shot(`02-sugestao-${i}`) });
    const btn = page.getByRole('button', { name: 'me dá outra' });
    if (!(await btn.isVisible().catch(() => false))) break;
    await btn.click();
    await page.waitForTimeout(400);
  }
  await page.locator('section', { hasText: 'o que cabe agora' }).screenshot({ path: shot('02-sugestao-final') });

  // fixos: all-day + conflito
  await page.locator('section', { hasText: 'fixos de hoje' }).screenshot({ path: shot('03-fixos') });
});

test('hoje: o dia vazio (primeira vez)', async ({ authenticatedPage: page }) => {
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.screenshot({ path: shot('04-hoje-vazio'), fullPage: true });
});

// ─── Feature 2 — @ / captura ─────────────────────────────

test('@: captura lisa → leitura sugerida (92% task = suggest)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await despejar(page, 'ligar pro contador sobre o BAS');
  await page.screenshot({ path: shot('05-at-suggest'), fullPage: true });
  const confirma = page.getByRole('button', { name: 'confirma' });
  if (await confirma.isVisible().catch(() => false)) {
    await confirma.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: shot('06-at-confirmado'), fullPage: true });
});

test('@: tokens explícitos', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await despejar(page, 'pagar contador #work @task @amanha');
  await page.screenshot({ path: shot('07-at-tokens'), fullPage: true });
});

test('@: sinto — a boca da alma acorda a sentinela', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await despejar(page, 'sinto: ansioso, o dia começou pesado');
  await page.screenshot({ path: shot('08-at-sinto'), fullPage: true });
});

test('@: lista — a despensa', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await despejar(page, 'lista: manga, ovos');
  await page.screenshot({ path: shot('09-at-lista'), fullPage: true });
  await despejar(page, 'lista farmácia: dipirona, band-aid');
  await page.screenshot({ path: shot('10-at-lista-nova'), fullPage: true });
});

test('@: sem rede — a fila do avô (D55)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await page.context().setOffline(true);
  await despejar(page, 'comprar filtro de café');
  await despejar(page, 'sinto: cansado');
  await page.screenshot({ path: shot('11-at-offline'), fullPage: true });
  await page.context().setOffline(false);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: shot('12-at-volta-rede'), fullPage: true });
});

test('@: leitura sem clareza (manual) e leitura que falha', async ({ authenticatedPage: page }) => {
  await page.route('**/functions/v1/triage-classify*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        title: 'x', type: 'note', module: 'bridge', confidence: 40,
        reasoning: 'baixa confiança', tags: [], due_date: null, emotion: null,
      }),
    }),
  );
  await chegar(page, '/at');
  await despejar(page, 'aquilo do negócio do cara lá');
  await page.screenshot({ path: shot('13-at-manual'), fullPage: true });

  await page.route('**/functions/v1/triage-classify*', (route) => route.abort('failed'));
  await despejar(page, 'outra coisa qualquer sem clareza');
  await page.screenshot({ path: shot('14-at-leitura-caiu'), fullPage: true });
});

// ─── Feature 3 — Triage / assentimento ───────────────────

test('triage: o item do conector (sim, 1 item)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/pipeline');
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);
  // o 1º card é item comum (fixture); o do conector vem depois — pular até ele
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('15-triage-conector'), fullPage: true });
  await page.getByRole('button', { name: '○ task' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot('16-triage-trocado'), fullPage: true });
  // pular com 1 item só: pra onde vai?
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('17-triage-pulado'), fullPage: true });
});

test('triage: 50 itens do conector — a esteira', async ({ authenticatedPage: page }) => {
  const mk = (i: number) => {
    const gmail = i % 3 === 0;
    return {
      id: `mock-inbox-${i}`,
      title: gmail ? `Fatura #${1000 + i} — vence dia ${(i % 28) + 1}` : `Evento ${i} — sync semanal`,
      type: gmail ? 'note' : 'ritual',
      module: gmail ? 'finance' : 'bridge',
      tags: ['#connector', gmail ? '#source:gmail' : '#source:google-calendar'],
      status: 'inbox', state: 'inbox', genesis_stage: 1,
      source: 'connector', created_by: 'e2e-test-user-0001',
      created_at: '2026-07-29T07:00:00Z', updated_at: '2026-07-29T07:00:00Z',
      body: {},
    };
  };
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(Array.from({ length: 50 }, (_, i) => mk(i))),
    }),
  );
  await page.goto('/pipeline?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('18-triage-50-inicio'), fullPage: true });

  // viver a esteira: assentir 3, pular 3 — quanto custa cada gesto?
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Assentir/ }).click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: shot('19-triage-50-apos-3'), fullPage: true });
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Pular' }).click();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: shot('20-triage-50-apos-pulos'), fullPage: true });
});

test('triage: item manual — classificar com AI', async ({ authenticatedPage: page }) => {
  await page.goto('/pipeline?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('21-triage-manual-card'), fullPage: true });
  await page.getByRole('button', { name: /classificar com AI/ }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot('22-triage-ai-sugestao'), fullPage: true });
});
