// e2e/visual-mundo-novo.spec.ts — as fotos que provam que "a tela tá certa"
// Obra 3 da fila (06_paginas-internas_mapa.md): fotografa o MUNDO NOVO —
// 3 faces + ItemDetail + wrap — com a semana simulada (?sim=1) como dado
// determinístico. Mundo único escuro (D57): não há eixo light/dark.
//
// Determinismo: o céu do HOJE é matemática de Date (engine/sky) — relógio
// fixo (page.clock) + timezone da casa deixam o arco parado na foto.
// A semana simulada nasce relativa ao "agora" → idades quietas estáveis.
//
// Rodar:    pnpm test:visual            (compara com baseline — o guarda do gate)
// Baseline: pnpm test:visual:update     (re-fotografa depois de obra intencional)

import { test, expect } from './fixtures/auth';

// 15:00 em Brisbane — zênite: sol no alto do arco, aurora já recolhida
const FIXED_TIME = new Date('2026-07-28T15:00:00+10:00');

test.use({ timezoneId: 'Australia/Brisbane' });

const SHOT = { fullPage: true as const, maxDiffPixelRatio: 0.01 };

async function chegar(page: import('@playwright/test').Page, path: string) {
  await page.clock.install({ time: FIXED_TIME });
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700); // animações de entrada assentam
}

// Pra cena INTERATIVA com transições (AnimatePresence mode="wait"):
// qualquer relógio fake do Playwright trava a troca de telas (a pergunta
// nova fica em opacity 0 e o clique cai no botão fantasma da anterior).
// A cena dispensa relógio — nada nela renderiza data/idade.
async function chegarSemRelogio(page: import('@playwright/test').Page, path: string) {
  await page.goto(`${path}${path.includes('?') ? '&' : '?'}sim=1`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
}

// ─── as 3 faces ──────────────────────────────────────────

test('face HOJE — o arco, a chegada, o que cabe', async ({ authenticatedPage: page }) => {
  await chegar(page, '/hoje');
  await expect(page).toHaveScreenshot('face-hoje.png', SHOT);
});

test('face ARVORE — os 8 ramos, real x ideal', async ({ authenticatedPage: page }) => {
  await chegar(page, '/arvore');
  await expect(page).toHaveScreenshot('face-arvore.png', SHOT);
});

test('face ARVORE — drill do ramo cheio (trabalho)', async ({ authenticatedPage: page }) => {
  await chegar(page, '/arvore');
  await page.getByText('trabalho', { exact: true }).first().click();
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot('face-arvore-drill.png', SHOT);
});

test('face @ — a boca unica', async ({ authenticatedPage: page }) => {
  await chegar(page, '/at');
  await expect(page).toHaveScreenshot('face-at.png', SHOT);
});

// ─── as páginas internas ─────────────────────────────────

test('ItemDetail — o ponto recem-nascido (estagio 1)', async ({ authenticatedPage: page }) => {
  // e2e-item-003: note no inbox, stage 1 — a leitura do @ convida
  await chegar(page, '/item/e2e-item-003');
  await expect(page).toHaveScreenshot('item-ponto.png', SHOT);
});

test('ItemDetail — a coisa no galho (estagio 3)', async ({ authenticatedPage: page }) => {
  // e2e-item-001: task estruturada no galho do trabalho — convite △ → □
  await chegar(page, '/item/e2e-item-001');
  await expect(page).toHaveScreenshot('item-galho.png', SHOT);
});

test('Wrap — o rito de fechar o dia', async ({ authenticatedPage: page }) => {
  await chegar(page, '/wrap');
  await expect(page).toHaveScreenshot('wrap-rito.png', SHOT);
});

// ─── o chão da árvore (obra 6 · D63/D64) ─────────────────

test('raiz — o chao da arvore le o cofre', async ({ authenticatedPage: page }) => {
  await chegar(page, '/raiz');
  await expect(page).toHaveScreenshot('raiz-chao.png', SHOT);
});

test('builder — a entrevista pare cadeia e protocolo', async ({ authenticatedPage: page }) => {
  await chegarSemRelogio(page, '/raiz');
  await page.getByText('construir minha rotina').click();
  await page.getByText('Corpo', { exact: true }).click();

  // sincronia positiva: cada resposta espera a PRÓXIMA pergunta chegar
  await page.getByRole('button', { name: 'Sim' }).click();                    // body-1
  await page.getByText('Que tipo de exercício?').waitFor();
  await page.locator('textarea').fill('caminhada');                            // body-2
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('Quantas vezes por semana?').waitFor();
  await page.getByRole('button', { name: '3x', exact: true }).click();         // body-3
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('Que horas você acorda e dorme?').waitFor();
  await page.getByRole('button', { name: 'Continuar' }).click();               // body-4: horários default
  await page.getByText('Toma água de manhã').waitFor();
  await page.getByRole('button', { name: 'Sim' }).click();                     // body-5
  await page.getByText('Tem algum hábito de saúde').waitFor();
  await page.locator('textarea').fill('meditacao 10 min');                     // body-6
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('Quando o corpo pesa').waitFor();
  await page.locator('textarea').fill('alongar, respirar fundo');              // body-7: a condição → protocolo
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('o que a conversa pariu').waitFor();                    // o assentimento
  await page.waitForTimeout(600); // entrada dos cards assenta
  await expect(page).toHaveScreenshot('builder-assentimento.png', SHOT);
});

// ─── a lente (obra 7 · D67/D68/D69) ──────────────────────

test('triage — a leitura do conector no chip (D69)', async ({ authenticatedPage: page }) => {
  // sem relógio: a troca de card do Triage é AnimatePresence mode="wait".
  // a porta é a do mundo novo (/pipeline morreu no gate): puxador do HOJE →
  // folha. A foto é da FOLHA (precedente casa-plano-ida) — sem relógio fixo
  // o arco vivo andaria de minuto em minuto por trás dela.
  await chegarSemRelogio(page, '/hoje');
  await page.getByRole('button', { name: /aceitar/ }).click();
  await page.waitForTimeout(500);
  const folha = page.getByRole('dialog', { name: 'Esperando leitura' });
  await folha.getByRole('button', { name: 'Pular' }).click(); // passa o ponto do @; chega o conector
  await page.waitForTimeout(600);
  await expect(folha).toHaveScreenshot('triage-leitura-conector.png', { maxDiffPixelRatio: 0.01 });
});

test('a casa — o plano da ida (D68)', async ({ authenticatedPage: page }) => {
  // preview determinístico: a edge respondida aqui, nunca a de produção
  await page.route('**/functions/v1/taxonomy-sync*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        action: 'preview',
        labels: [
          'identidade', 'documentos', 'saude', 'financas', 'arquivos',
          'memorias', 'tempo', 'comunicacao', 'projetos',
        ].map((l, i) => ({ key: `k${i}`, name: `Atom/${l}`, action: 'create' })),
        calendar: { key: '_calendar', name: 'Atom', action: 'create' },
      }),
    }),
  );
  await chegarSemRelogio(page, '/hoje');
  await page.getByRole('button', { name: 'a casa — perfil, conectores, export' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /ver o plano/ }).click();
  await page.waitForTimeout(500);
  // a foto é da FOLHA, não da página: sem relógio fixo, o arco vivo aparece
  // por trás da folha ancorada embaixo e o sol anda de minuto em minuto —
  // a cena passava só quando refotografada e rodada no mesmo minuto
  await expect(page.getByRole('dialog', { name: 'A casa' }))
    .toHaveScreenshot('casa-plano-ida.png', { maxDiffPixelRatio: 0.01 });
});

// ─── os gestos (D54 — nada é aba) ────────────────────────

test('busca — o gesto abre a camada', async ({ authenticatedPage: page }) => {
  await chegar(page, '/hoje');
  await page.keyboard.press('/'); // o atalho do teclado; o dedo puxa pra baixo
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot('gesto-busca.png', SHOT);
});

test('a casa — o puxador abre a sheet', async ({ authenticatedPage: page }) => {
  await chegar(page, '/hoje');
  await page.getByRole('button', { name: 'a casa — perfil, conectores, export' }).click();
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot('gesto-casa.png', SHOT);
});
