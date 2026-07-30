// ═══ NOTA DE MUSEU (30 Jul 2026) ═══════════════════════════════════════
// Este tour fotografa o mundo de ANTES do gate (D41, disparado em 30 Jul
// 2026): o passo da triage entra pelo /pipeline, tela que morreu na morte
// por merge. É história — o guia visual de uma casa que não existe mais —
// e não roda no rito do verde. Quem rodar à mão vai ver vermelho, e o
// vermelho é a verdade: a rota não existe mais.
// ═══════════════════════════════════════════════════════════════════════
// e2e/tour.spec.ts — o tour guiado com fotos (não é gate; roda sob demanda)
// Dirige o app como um usuário faria e fotografa cada gesto, pra montar
// o guia visual. Mundo simulado (?sim=1) + auth mockada (fixtures/auth).
// Rodar: npx playwright test e2e/tour.spec.ts --project=mobile
import { test } from './fixtures/auth';

const OUT = process.env.TOUR_OUT ?? 'e2e/results/tour';
const shot = (n: string) => `${OUT}/${n}.png`;

async function chegar(page: import('@playwright/test').Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

test('tour completo com fotos', async ({ authenticatedPage: page }) => {
  test.setTimeout(180_000);

  // 1 — HOJE: a face que abre o dia
  await chegar(page, '/hoje');
  await page.screenshot({ path: shot('01-hoje'), fullPage: true });

  // 2 — @: a boca única — digita e manda
  await chegar(page, '/at');
  await page.getByRole('textbox').first().fill('comprar cafe amanha');
  await page.screenshot({ path: shot('02-at-digitando') });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200); // captura + leitura (triage mockada)
  await page.screenshot({ path: shot('03-at-leitura'), fullPage: true });

  // 3 — Triage: o item do conector com o chip de leitura (D69)
  await chegar(page, '/pipeline');
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot('04-triage-conector'), fullPage: true });
  await page.getByRole('button', { name: '○ task' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot('05-triage-trocado'), fullPage: true });

  // 4 — ÁRVORE: os 8 ramos e o drill
  await chegar(page, '/arvore');
  await page.screenshot({ path: shot('06-arvore'), fullPage: true });
  await page.getByText('trabalho', { exact: true }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('07-arvore-drill'), fullPage: true });

  // 5 — Raiz: o chão da árvore (cofre + builder)
  await chegar(page, '/raiz');
  await page.screenshot({ path: shot('08-raiz-chao'), fullPage: true });

  // 6 — A casa: o puxador no rodapé
  await chegar(page, '/hoje');
  await page.getByRole('button', { name: 'a casa — perfil, conectores, export' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('09-casa-sheet'), fullPage: true });

  // 7 — A ida: ver o plano (edge mockada — teste hermético)
  await page.route('**/functions/v1/taxonomy-sync*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        action: 'preview',
        labels: ['identidade', 'documentos', 'saude', 'financas', 'arquivos', 'memorias', 'tempo', 'comunicacao', 'projetos']
          .map((l, i) => ({ key: `k${i}`, name: `Atom/${l}`, action: 'create' })),
        calendar: { key: '_calendar', name: 'Atom', action: 'create' },
      }),
    }),
  );
  await page.getByRole('button', { name: /ver o plano/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot('10-casa-plano-ida'), fullPage: true });

  // 8 — Busca: o gesto "/"
  await chegar(page, '/hoje');
  await page.keyboard.press('/');
  await page.waitForTimeout(400);
  await page.screenshot({ path: shot('11-busca') });

  // 9 — Wrap: fechar o dia
  await chegar(page, '/wrap');
  await page.screenshot({ path: shot('12-wrap'), fullPage: true });
});
