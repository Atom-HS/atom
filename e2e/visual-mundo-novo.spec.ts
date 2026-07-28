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
