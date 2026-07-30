// e2e/gate-fotos.spec.ts — o «antes» do gate (D41): as telas condenadas,
// fotografadas uma última vez antes da morte por merge. NÃO é gate de CI:
// roda sob demanda; as fotos vivem em docs/onda-3/19_gate_fotos/.
// Rodar: npx playwright test e2e/gate-fotos.spec.ts --project=mobile
import { test } from './fixtures/auth';
import type { Page } from '@playwright/test';

const OUT = 'docs/onda-3/19_gate_fotos';

const CONDENADAS = [
  ['home', '/home'],
  ['pipeline', '/pipeline'],
  ['calendar', '/calendar'],
  ['analytics', '/analytics'],
  ['library', '/library'],
  ['graph', '/graph'],
  ['review', '/review'],
  ['projects', '/projects'],
] as const;

async function chegar(page: Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(900);
}

for (const [nome, rota] of CONDENADAS) {
  test(`antes — ${nome}`, async ({ authenticatedPage: page }) => {
    await chegar(page, rota);
    // a aurora cobre qualquer tela na primeira chegada — pular se aparecer
    for (let i = 0; i < 2; i++) {
      const pular = page.getByRole('button', { name: 'pular' });
      if (await pular.isVisible().catch(() => false)) {
        await pular.click();
        await page.waitForTimeout(400);
      }
    }
    await page.screenshot({ path: `${OUT}/antes-${nome}.png`, fullPage: true });
  });
}
