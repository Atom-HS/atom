// e2e/atos.spec.ts — as provas do roteiro do mago (docs/onda-3/15)
// Cada obra que conserta uma mentira nasce com uma cena que prova a mentira
// morta. Isto NÃO é foto: é asserção contra a página de verdade.
// Rodar: npx playwright test e2e/atos.spec.ts --project=mobile
import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

// ─── Ato I · obra 1 — o @ para de negar o que guardou ────

test('ato I.1 — selo que falha depois da captura não vira fila (nem duplicata)', async ({
  authenticatedPage: page,
}) => {
  await chegar(page, '/at');
  // tokens explícitos: captura passa, quickClassify falha no mundo mockado —
  // exatamente o canto que a dissecação 01 fotografou mentindo
  await page.getByRole('textbox').first().fill('pagar contador #work @task');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  await expect(page.getByText(/guardei como ponto/)).toBeVisible();
  await expect(page.getByText(/foi pra fila/)).toHaveCount(0);
  // e o ponto continua alcançável — nada se perdeu de verdade
  await expect(page.getByRole('button', { name: 'abrir' })).toBeVisible();
});

test('ato I.1 — sem rede a fila continua sendo a rede de segurança', async ({
  authenticatedPage: page,
}) => {
  await chegar(page, '/at');
  await page.context().setOffline(true);
  await page.getByRole('textbox').first().fill('comprar filtro de café');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);

  // nada nasceu: aqui a fila é a resposta certa — a correção não pode matá-la
  await expect(page.getByText(/guardei na fila/)).toBeVisible();
  await page.context().setOffline(false);
});

// ─── Ato I · obra 2 — o selo é do humano ─────────────────

const conector = (i: number) => ({
  id: `mock-inbox-${i}`,
  title: `Fatura #${1000 + i}`,
  type: 'note',
  module: 'finance',
  tags: ['#connector', '#source:gmail'],
  status: 'inbox',
  state: 'inbox',
  genesis_stage: 1,
  source: 'connector',
  created_by: 'e2e-test-user-0001',
  created_at: '2026-07-29T07:00:00Z',
  updated_at: '2026-07-29T07:00:00Z',
  body: {},
});

test('ato I.2 — assentir que falha NÃO avança o card', async ({ authenticatedPage: page }) => {
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(Array.from({ length: 50 }, (_, i) => conector(i))),
    }),
  );
  await page.goto('/pipeline?sim=0');
  await page.waitForLoadState('networkidle');
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);

  await expect(page.getByText('Fatura #1000')).toBeVisible();

  // três tentativas que falham na gravação (mundo mockado)
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Assentir/ }).click();
    await page.waitForTimeout(400);
  }

  // a gravação REALMENTE falhou — sem isto o teste passaria à toa
  await expect(page.getByText(/nao esta no inbox/).first()).toBeVisible();
  // e mesmo assim o card não andou: a esteira não finge que selou
  await expect(page.getByText('Fatura #1000')).toBeVisible();
  await expect(page.getByText('Fatura #1001')).toHaveCount(0);
});
