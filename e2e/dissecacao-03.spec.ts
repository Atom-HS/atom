// e2e/dissecacao-03.spec.ts — exame da dissecação (docs/onda-3/13), features 7–9
// NÃO é gate: roda sob demanda, fotografa as cenas que provam os achados.
// A ida REAL no Gmail e o digest em runtime são muros desta sessão (produção
// é do Rick) — aqui vive-se a casa com mundo mockado; o resto é NÃO VERIFICADO.
// Rodar: npx playwright test e2e/dissecacao-03.spec.ts --project=mobile
import { test } from './fixtures/auth';
import type { Page } from '@playwright/test';

const OUT = 'docs/onda-3/14_dissecacao-01_fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

const TAX_APPLIED = {
  version: 1,
  gmail: {
    identity: { id: 'L1', name: 'Atom/identidade' }, documents: { id: 'L2', name: 'Atom/documentos' },
    health: { id: 'L3', name: 'Atom/saude' }, finance: { id: 'L4', name: 'Atom/financas' },
    storage: { id: 'L5', name: 'Atom/arquivos' }, memories: { id: 'L6', name: 'Atom/memorias' },
    time: { id: 'L7', name: 'Atom/tempo' }, communication: { id: 'L8', name: 'Atom/comunicacao' },
    projects: { id: 'L9', name: 'Atom/projetos' },
  },
  calendar: { id: 'cal-atom', summary: 'Atom' },
  disabled: [],
  applied_at: '2026-07-29T10:00:00Z',
};

const DOMAINS = ['identity', 'documents', 'health', 'finance', 'storage', 'memories', 'time', 'communication', 'projects'];
const LABEL_PT: Record<string, string> = {
  identity: 'identidade', documents: 'documentos', health: 'saude', finance: 'financas',
  storage: 'arquivos', memories: 'memorias', time: 'tempo', communication: 'comunicacao', projects: 'projetos',
};

/** conector google ligado; `applied` controla se a ida já vive lá fora */
async function mockCasa(page: Page, opts: { applied?: boolean } = {}) {
  const state = { applied: opts.applied ?? false };

  await page.route('**/rest/v1/user_connectors*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{
        provider: 'google', status: 'connected',
        last_sync_at: '2026-07-30T06:00:00Z',
        metadata: state.applied ? { taxonomy: TAX_APPLIED } : {},
      }]),
    }),
  );

  await page.route('**/functions/v1/taxonomy-sync*', async (route) => {
    const body = JSON.parse(route.request().postData() ?? '{}');
    if (body.action === 'preview') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          action: 'preview',
          labels: DOMAINS.map((k) => ({
            key: k, name: `Atom/${LABEL_PT[k]}`,
            action: state.applied ? 'exists' : 'create',
          })),
          calendar: { key: '_calendar', name: 'Atom', action: state.applied ? 'exists' : 'create' },
        }),
      });
    }
    if (body.action === 'apply') {
      state.applied = true;
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          action: 'apply',
          labels: DOMAINS.map((k) => ({ key: k, name: `Atom/${LABEL_PT[k]}`, action: 'created' })),
          calendar: { key: '_calendar', name: 'Atom', action: 'created' },
        }),
      });
    }
    state.applied = false;
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ action: 'remove', removed: [...DOMAINS, '_calendar'] }),
    });
  });
}

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

async function abrirCasa(page: Page) {
  await page.getByRole('button', { name: /a casa/ }).click();
  await page.waitForTimeout(600);
}

// ─── Feature 7 — a casa / conectores ─────────────────────

test('casa: o puxador — o que o Rick não achou', async ({ authenticatedPage: page }) => {
  await chegar(page, '/hoje');
  // a foto da prova: quão visível é a barra fina acima da nav?
  await page.locator('nav').screenshot({ path: shot('47-casa-puxador') });
});

test('casa: a sheet com os conectores ligados', async ({ authenticatedPage: page }) => {
  await mockCasa(page);
  await chegar(page, '/hoje');
  await abrirCasa(page);
  await page.screenshot({ path: shot('48-casa-sheet') });
});

test('casa: a ida — plano, assentimento, estado vivo, desfazer', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  await mockCasa(page);
  await chegar(page, '/hoje');
  await abrirCasa(page);

  // o plano (preview D68)
  await page.getByRole('button', { name: 'ver o plano' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: shot('49-casa-ida-plano') });

  // o assentimento
  await page.getByRole('button', { name: 'assentir ✓' }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: shot('50-casa-ida-assentida') });

  // o desfazer devolve
  const desfazer = page.getByRole('button', { name: 'desfazer tudo' });
  if (await desfazer.isVisible().catch(() => false)) {
    await desfazer.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: shot('51-casa-ida-desfeita') });
  }
});

test('casa: sincronizar dá feedback do que trouxe', async ({ authenticatedPage: page }) => {
  await mockCasa(page);
  await page.route('**/functions/v1/calendar-sync*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        events: [
          {
            google_id: 'gc-100', title: 'Retro mensal Atlas', start: '2026-07-31T15:00:00Z',
            end: '2026-07-31T16:00:00Z', calendar: 'primary', recurring: true,
            recurring_event_id: 'serie-retro', all_day: false, attendees: [],
          },
          {
            google_id: 'gc-101', title: 'Buscar óculos novos', start: '2026-08-01T01:00:00Z',
            end: '2026-08-01T02:00:00Z', calendar: 'primary', recurring: false,
            recurring_event_id: null, all_day: false, attendees: [],
          },
        ],
        timezone: 'Australia/Brisbane', synced_at: '2026-07-30T06:00:00Z',
      }),
    }),
  );
  await chegar(page, '/hoje');
  await abrirCasa(page);
  await page.getByRole('button', { name: 'sincronizar' }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot('52-casa-sync-feedback') });
});

test('casa: o token que expirou pede reconexão, não falha quieto', async ({ authenticatedPage: page }) => {
  await mockCasa(page);
  await page.route('**/functions/v1/taxonomy-sync*', (route) =>
    route.fulfill({
      status: 403, contentType: 'application/json',
      body: JSON.stringify({ error: 'Missing scopes', code: 'TAX_401' }),
    }),
  );
  await chegar(page, '/hoje');
  await abrirCasa(page);
  await page.getByRole('button', { name: 'ver o plano' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot('53-casa-reconectar') });
});

test('casa: a lei viva — o estado quieto de quem já assentiu', async ({ authenticatedPage: page }) => {
  await mockCasa(page, { applied: true });
  await chegar(page, '/hoje');
  await abrirCasa(page);
  await page.screenshot({ path: shot('54-casa-lei-viva') });
});
