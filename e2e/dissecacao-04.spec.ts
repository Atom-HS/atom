// ═══ NOTA DE MUSEU PARCIAL (30 Jul 2026) ═══════════════════════════════
// A cena do projeto («a pill leva pra… /projects») fotografa o mundo de
// ANTES do gate (D41, disparado em 30 Jul 2026): a pill hoje abre sheet e
// /projects morreu na morte por merge — quem rodar essa cena à mão vai ver
// vermelho, e o vermelho é a verdade. As demais cenas (wrap, busca,
// offline) seguem dirigíveis. Nada aqui roda no rito do verde.
// ═══════════════════════════════════════════════════════════════════════
// e2e/dissecacao-04.spec.ts — exame da dissecação (docs/onda-3/13), features 10–13
// NÃO é gate: roda sob demanda, fotografa as cenas que provam os achados.
// Rodar: npx playwright test e2e/dissecacao-04.spec.ts --project=mobile
import { test } from './fixtures/auth';
import type { Page } from '@playwright/test';

const OUT = 'docs/onda-3/14_dissecacao-01_fotos';
const shot = (n: string) => `${OUT}/${n}.png`;

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

// ─── Feature 10 — Wrap ───────────────────────────────────

test('wrap: o rito inteiro, passo a passo — e o selo com o dia vazio', async ({ authenticatedPage: page }) => {
  test.setTimeout(180_000);
  await chegar(page, '/wrap');
  await page.screenshot({ path: shot('55-wrap-alma'), fullPage: true });

  const seguir = () => page.getByRole('button', { name: /seguir/ }).click();
  await seguir(); await page.waitForTimeout(500);
  await page.screenshot({ path: shot('56-wrap-o-dia'), fullPage: true });
  await seguir(); await page.waitForTimeout(500); // decidido (3)
  await seguir(); await page.waitForTimeout(500); // teia (4)
  await page.screenshot({ path: shot('57-wrap-teia'), fullPage: true });
  await seguir(); await page.waitForTimeout(500); // sementes (5)
  await page.screenshot({ path: shot('58-wrap-sementes'), fullPage: true });
  await seguir(); await page.waitForTimeout(700); // audit (6)
  await page.screenshot({ path: shot('59-wrap-audit'), fullPage: true });
  await seguir(); await page.waitForTimeout(500); // selar (7)
  await page.screenshot({ path: shot('60-wrap-selar'), fullPage: true });

  // selar com tudo vazio: o que acontece?
  await page.getByRole('button', { name: 'selar ○' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'selar ○' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('61-wrap-selo-vazio'), fullPage: true });

  // com um passo pra amanhã, o selo passa
  await page.getByPlaceholder('+ um passo…').first().fill('revisar o vidro com Willi');
  await page.getByRole('button', { name: 'selar ○' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: shot('62-wrap-selado'), fullPage: true });
});

// ─── Feature 11 — busca + gestos ─────────────────────────

test('busca: a camada vazia, o achado por título, who: e o filtro errado', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  await chegar(page, '/hoje');
  await page.keyboard.press('/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('63-busca-vazia'), fullPage: true });

  const boca = page.getByPlaceholder('buscar no tronco…');
  await boca.fill('vidro');
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('64-busca-titulo'), fullPage: true });

  await boca.fill('who:');
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('65-busca-who'), fullPage: true });

  await boca.fill('mod:xyz vidro');
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('66-busca-filtro-errado'), fullPage: true });
});

// ─── Feature 12 — projetos / presença ────────────────────

const NOW = new Date().toISOString();
function mundoComProjeto() {
  const mk = (over: Record<string, unknown>) => ({
    tags: [], status: 'active', state: 'structured', genesis_stage: 3,
    source: 'mindroot', created_by: 'e2e-test-user-0001',
    created_at: NOW, updated_at: NOW, body: {}, module: 'work', type: 'task',
    ...over,
  });
  const items = [
    mk({ id: 'proj-1', title: 'Atlas Detailer', type: 'project' }),
    mk({ id: 'c1', title: 'medir a van do Ricardo' }),
    mk({ id: 'c2', title: 'orçar o vinil fosco' }),
    mk({ id: 'c3', title: 'foto do antes e depois' }),
    mk({ id: 'c4', title: 'post no insta', status: 'completed', state: 'committed', genesis_stage: 7 }),
    mk({ id: 'c5', title: 'contrato assinado', status: 'completed', state: 'committed', genesis_stage: 7 }),
  ];
  const connections = ['c1', 'c2', 'c3', 'c4', 'c5'].map((c, i) => ({
    id: `conn-${i}`, source_id: c, target_id: 'proj-1', relation: 'belongs_to',
    user_id: 'e2e-test-user-0001', created_at: NOW,
  }));
  return { items, connections };
}

test('projetos: a pill do HOJE, a página velha, o detalhe', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  const { items, connections } = mundoComProjeto();
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(items) }),
  );
  await page.route('**/rest/v1/item_connections*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(connections) }),
  );
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
  // sem chegada registrada, a aurora cobre o dia — pular (2×: respiro → checkin)
  for (let i = 0; i < 2; i++) {
    const pular = page.getByRole('button', { name: 'pular' });
    if (await pular.isVisible().catch(() => false)) {
      await pular.click();
      await page.waitForTimeout(600);
    }
  }
  await page.screenshot({ path: shot('67-hoje-pill-projeto'), fullPage: true });

  // a pill leva pra… /projects, a página condenada pela D48
  await page.getByRole('button', { name: /Atlas Detailer/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot('68-projects-pagina'), fullPage: true });

  await page.getByText('Atlas Detailer', { exact: false }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('69-projects-detalhe'), fullPage: true });
});

// ─── Feature 13 — offline / o tronco de bolso ────────────

test('offline: sem rede, o HOJE lê do bolso (items-snapshot)', async ({ authenticatedPage: page }) => {
  test.setTimeout(120_000);
  const { items, connections } = mundoComProjeto();
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(items) }),
  );
  await page.route('**/rest/v1/item_connections*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(connections) }),
  );
  // 1ª visita com rede: o snapshot é guardado
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(900);
  for (let i = 0; i < 2; i++) {
    const pular = page.getByRole('button', { name: 'pular' });
    if (await pular.isVisible().catch(() => false)) {
      await pular.click();
      await page.waitForTimeout(400);
    }
  }

  // a rede morre; recarrega — o tronco de bolso segura?
  await page.unroute('**/rest/v1/items*');
  await page.route('**/rest/v1/items*', (route) => route.abort('failed'));
  await page.reload();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: shot('70-offline-bolso'), fullPage: true });
});
