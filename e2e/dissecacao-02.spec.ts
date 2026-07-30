// e2e/dissecacao-02.spec.ts — exame da dissecação (docs/onda-3/13), features 4–6
// NÃO é gate: roda sob demanda, fotografa as cenas que provam os achados.
// Rodar: npx playwright test e2e/dissecacao-02.spec.ts --project=mobile
import { test } from './fixtures/auth';
import type { Page } from '@playwright/test';

// mesma pasta das rodadas anteriores; numeração continua da 31
const OUT = 'docs/onda-3/14_dissecacao-01_fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

// ─── Feature 4 — ÁRVORE + drill ──────────────────────────

test('árvore: a copa na semana (sim)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/arvore');
  await page.screenshot({ path: shot('32-arvore-semana'), fullPage: true });

  // a janela estação — o baseline muda?
  await page.getByRole('button', { name: 'estação 55' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('33-arvore-estacao'), fullPage: true });
});

test('árvore: o drill do ramo — toque abre, glifos de maturação', async ({ authenticatedPage: page }) => {
  await chegar(page, '/arvore');
  await page.locator('svg[role="img"] text', { hasText: 'trabalho' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('34-arvore-drill-trabalho'), fullPage: true });
});

test('árvore: a janela escolhida sobrevive à navegação?', async ({ authenticatedPage: page }) => {
  await chegar(page, '/arvore');
  await page.getByRole('button', { name: 'estação 55' }).click();
  await page.waitForTimeout(400);
  // vai pro HOJE e volta pela nav — a janela ainda é estação?
  await page.getByRole('link', { name: 'hoje' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'árvore' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('35-arvore-volta-da-nav'), fullPage: true });
});

test('árvore: o drill em escala — 22 folhas num ramo só', async ({ authenticatedPage: page }) => {
  // todas dentro da janela de 7 dias — o teto de 8 do drill tem que aparecer
  const mk = (i: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (i % 5));
    d.setHours(9 + (i % 8), 0, 0, 0);
    const iso = d.toISOString();
    return {
      id: `mock-work-${i}`,
      title: `Entrega ${i + 1} — cliente ${String.fromCharCode(65 + (i % 6))}`,
      type: 'task', module: 'work', tags: [],
      status: i % 4 === 0 ? 'completed' : 'active',
      state: i % 4 === 0 ? 'committed' : 'structured',
      genesis_stage: i % 4 === 0 ? 7 : 3,
      source: 'mindroot', created_by: 'e2e-test-user-0001',
      created_at: iso, updated_at: iso,
      body: {},
    };
  };
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(Array.from({ length: 22 }, (_, i) => mk(i))),
    }),
  );
  await page.goto('/arvore?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.locator('svg[role="img"] text', { hasText: 'trabalho' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('36-arvore-drill-escala'), fullPage: true });
});

test('árvore: o mundo vazio — cold start', async ({ authenticatedPage: page }) => {
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/arvore?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.screenshot({ path: shot('37-arvore-vazia'), fullPage: true });
});

// ─── Feature 5 — Raiz / cofre (D63) ──────────────────────

test('raiz: o panorama com o cofre lendo (sim)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/raiz');
  await page.screenshot({ path: shot('38-raiz-panorama'), fullPage: true });

  // o gesto de renovar (nasceu no Ato I) — abre a linha inline?
  await page.getByRole('button', { name: 'renovar' }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('39-raiz-renovar'), fullPage: true });
});

test('raiz: da ausência à gaveta — o convite de "faz tempo"', async ({ authenticatedPage: page }) => {
  await chegar(page, '/raiz');
  // toca na primeira linha de "faz tempo" → inventário do domínio
  const fazTempo = page.locator('div', { hasText: /^faz tempo/ }).locator('button').first();
  await fazTempo.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('40-raiz-gaveta'), fullPage: true });
});

test('raiz: a primeira chegada (welcome)', async ({ authenticatedPage: page }) => {
  // o mock da casa chega com raiz_welcomed=true; aqui a gente desfaz isso
  await page.addInitScript(() => {
    const key = 'sb-avvwjkzkzklloyfugzer-auth-token';
    const raw = localStorage.getItem(key);
    if (raw) {
      const session = JSON.parse(raw);
      session.user.user_metadata = { ...session.user.user_metadata, raiz_welcomed: false };
      localStorage.setItem(key, JSON.stringify(session));
    }
  });
  await page.route('**/auth/v1/user', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'e2e-test-user-0001', email: 'visual@mindroot.test',
        app_metadata: { provider: 'google', providers: ['google'] },
        user_metadata: { full_name: 'Visual Tester', raiz_welcomed: false },
        aud: 'authenticated', role: 'authenticated', created_at: '2026-01-01T00:00:00Z',
      }),
    }),
  );
  await chegar(page, '/raiz');
  await page.screenshot({ path: shot('41-raiz-welcome'), fullPage: true });
});

// ─── Feature 6 — Builder (D64) ───────────────────────────

test('builder: módulos, entrevista, retomada e o parto', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  await chegar(page, '/raiz');
  await page.getByRole('button', { name: /construir minha rotina/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('42-builder-modulos'), fullPage: true });

  // a entrevista de finanças (a mais curta) — primeira pergunta
  await page.getByRole('button', { name: /Finan/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('43-builder-pergunta'), fullPage: true });

  // responde a primeira e meia — e "volta amanhã" (reload = outra sessão)
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /construir minha rotina/ }).click();
  await page.waitForTimeout(500);
  // o que sobrou da entrevista de ontem?
  await page.screenshot({ path: shot('44-builder-retomada'), fullPage: true });

  // agora a entrevista inteira, sem interrupção
  await page.getByRole('button', { name: /Finan/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'App ou planilha' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox').fill('juntar pra viagem do fim do ano');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Mensal' }).click();
  await page.waitForTimeout(700);
  // o que a conversa pariu
  await page.screenshot({ path: shot('45-builder-miniwrap'), fullPage: true });

  // o assentimento
  const nascam = page.getByRole('button', { name: /que nasçam/ });
  if (await nascam.isVisible().catch(() => false)) {
    await nascam.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: shot('46-builder-nasceu'), fullPage: true });
  }
});
