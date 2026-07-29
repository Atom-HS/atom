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

// o rito da chegada abre o dia por cima de tudo (D42) — quem chega passa por
// ele antes de qualquer gesto. Sem sim=1 não há chegada registrada hoje, então
// a aurora aparece: é o caminho real de quem abre o app pela manhã.
// (a aurora tem dois tempos: a respiração e a pergunta — cada um com seu pular)
async function passarAurora(page: Page) {
  for (let i = 0; i < 3; i++) {
    const pular = page.getByRole('button', { name: 'pular' });
    if (!(await pular.isVisible().catch(() => false))) return;
    await pular.click();
    await page.waitForTimeout(400);
  }
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

  // a gravação REALMENTE falhou — sem isto o teste passaria à toa. E a fala
  // é da casa, não o erro cru do FSM que vazava pra tela (obra 12)
  await expect(page.getByText(/não consegui selar/).first()).toBeVisible();
  // e mesmo assim o card não andou: a esteira não finge que selou
  await expect(page.getByText('Fatura #1000')).toBeVisible();
  await expect(page.getByText('Fatura #1001')).toHaveCount(0);
});

// ─── Ato II — a porta que faltava ────────────────────────

test('ato II — o assentimento se alcança do HOJE, sem digitar URL', async ({
  authenticatedPage: page,
}) => {
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(Array.from({ length: 12 }, (_, i) => conector(i))),
    }),
  );
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  await passarAurora(page);

  // o puxador diz o estado, sem badge que grita (D46)
  await expect(page.getByText('12 esperando leitura')).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/24-ato2-puxador.png', fullPage: true });

  // e leva ao gesto — o caminho que o Rick não achou em 29 Jul
  await page.getByRole('button', { name: /assentir/ }).click();
  await page.waitForTimeout(500);
  const folha = page.getByRole('dialog', { name: 'Esperando leitura' });
  await expect(folha).toBeVisible();
  await expect(folha.getByText('Fatura #1000')).toBeVisible();
  await expect(folha.getByText(/li assim pelo gmail/)).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/25-ato2-folha.png', fullPage: true });

  // a folha fecha e devolve o dia
  // toque fora, acima da folha — o gesto real de quem fecha um sheet
  await folha
    .getByRole('button', { name: 'Fechar', exact: true })
    .click({ position: { x: 100, y: 30 } });
  await expect(folha).toHaveCount(0);
  await expect(page.getByText('fixos de hoje')).toBeVisible();
});

test('ato II — dia sem fila não mostra puxador (o silêncio é estado)', async ({
  authenticatedPage: page,
}) => {
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  await passarAurora(page);
  // o dia abriu de verdade (senão o teste passaria por baixo da aurora)
  await expect(page.getByText('fixos de hoje')).toBeVisible();
  await expect(page.getByText(/esperando leitura/)).toHaveCount(0);
});

// ─── Ato III — a esteira honesta ─────────────────────────

test('ato III — o card mostra o que a lente trouxe, e pular manda pro fim', async ({
  authenticatedPage: page,
}) => {
  const evento = (i: number) => ({
    ...conector(i),
    title: `Reunião ${i}`,
    type: 'ritual',
    module: 'bridge',
    tags: ['#connector', '#source:google-calendar'],
    body: {
      start: '2026-07-29T16:00:00+10:00',
      end: '2026-07-29T17:00:00+10:00',
      recurring: true,
      attendees: [{ name: 'André Tanaka', email: 'andre@x.com' }],
    },
  });
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([evento(0), evento(1), evento(2)]),
    }),
  );
  await page.goto('/pipeline?sim=0');
  await page.waitForLoadState('networkidle');
  await page.getByText('Triage', { exact: true }).click();
  await page.waitForTimeout(500);

  // o contexto que estava no body e a tela escondia
  await expect(page.getByText('Reunião 0')).toBeVisible();
  await expect(page.getByText('hoje, 16:00–17:00')).toBeVisible();
  await expect(page.getByText('se repete')).toBeVisible();
  await expect(page.getByText('com André Tanaka')).toBeVisible();
  // e o módulo passa a ser trocável — não sela tudo em bridge
  await expect(page.getByText('onde mora')).toBeVisible();
  await expect(page.getByRole('button', { name: 'family', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/26-ato3-card-com-contexto.png', fullPage: true });

  // pular NÃO gira em círculo: manda pro fim
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByText('Reunião 1')).toBeVisible();
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByText('Reunião 2')).toBeVisible();
  // só depois de todos é que o primeiro volta — e a tela diz isso
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.waitForTimeout(400);
  await expect(page.getByText('Reunião 0')).toBeVisible();
  await expect(page.getByText('todos já passaram uma vez')).toBeVisible();
});

// ─── Ato IV — a lente que não mente ──────────────────────

test('ato IV — a pressão dos próximos dias sussurra, e cala quando não há', async ({
  authenticatedPage: page,
}) => {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const emAmanha = (h: number) => {
    const d = new Date(amanha);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };
  const bloco = (i: number, h: number) => ({
    ...conector(i),
    title: `Bloco ${i}`,
    type: 'task',
    tags: [],
    state: 'structured',
    genesis_stage: 3,
    status: 'active',
    body: { start: emAmanha(h), end: emAmanha(h + 1) },
  });

  // dia leve: silêncio
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([bloco(0, 9)]) }),
  );
  await page.goto('/hoje?sim=0');
  await page.waitForLoadState('networkidle');
  await passarAurora(page);
  await expect(page.getByText('fixos de hoje')).toBeVisible();
  await expect(page.getByText(/adiante ·/)).toHaveCount(0);

  // semana que pesa: uma linha, em estado
  await page.route('**/rest/v1/items*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([bloco(0, 9), bloco(1, 11), bloco(2, 14)]),
    }),
  );
  await page.reload();
  await page.waitForLoadState('networkidle');
  await passarAurora(page);
  await expect(page.getByText('adiante · amanhã: 3 horas marcadas')).toBeVisible();
  // sussurro, nunca alarme (D46)
  await expect(page.getByText(/sobrecarr|cuidado|demais/)).toHaveCount(0);
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/27-ato4-pressao.png', fullPage: true });
});

// ─── Ato VI · busca — o filtro que não existe é dito ─────

test('busca — prefixo ensina, e filtro inválido não vira busca literal calada', async ({
  authenticatedPage: page,
}) => {
  await chegar(page, '/hoje');
  await page.keyboard.press('/');
  await page.waitForTimeout(400);
  const busca = page.getByRole('dialog', { name: 'Buscar' });
  await expect(busca).toBeVisible();

  // a tela vazia é o único manual que alguém lê: os 7 prefixos, inteiros
  await expect(busca.getByText('pra afinar')).toBeVisible();
  await expect(busca.getByRole('button', { name: 'prio:', exact: true })).toBeVisible();
  await expect(busca.getByRole('button', { name: 'emo:', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/28-busca-prefixos.png', fullPage: true });

  // tocar o prefixo abre os valores que existem (padrão GitHub)
  await busca.getByRole('button', { name: 'mod:', exact: true }).click();
  await page.waitForTimeout(300);
  await expect(busca.getByText('valores de mod:')).toBeVisible();
  await expect(busca.getByRole('button', { name: 'work', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/29-busca-valores.png', fullPage: true });

  // e o filtro que não existe é nomeado, em vez de devolver zero calado
  await busca.getByRole('textbox').fill('mod:xyz');
  await page.waitForTimeout(300);
  await expect(busca.getByText(/não é um valor de/)).toBeVisible();
  await expect(busca.getByText('nada — e há filtro que não existe acima')).toBeVisible();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/30-busca-filtro-invalido.png', fullPage: true });
});

// ─── Ato I · obra 4 — o gesto que o digest promete ───────

test('ato I.4 — renovar existe no chão da árvore (o digest não promete porta falsa)', async ({
  authenticatedPage: page,
}) => {
  await chegar(page, '/raiz');

  // o cofre lê validades (D63) — e agora deixa agir sobre elas
  await expect(page.getByText('no vencimento')).toBeVisible();
  const renovar = page.getByRole('button', { name: 'renovar' }).first();
  await expect(renovar).toBeVisible();

  await renovar.click();
  const data = page.getByLabel(/nova validade/).first();
  await expect(data).toBeVisible();
  await data.fill('2027-03-12');
  await expect(page.getByRole('button', { name: 'vale até aí' })).toBeEnabled();
  await page.screenshot({ path: 'docs/onda-3/14_dissecacao-01_fotos/23-ato1-renovar.png', fullPage: true });

  // e sempre dá pra sair sem selar nada — assentimento é do humano
  await page.getByRole('button', { name: 'agora não' }).click();
  await expect(data).toHaveCount(0);
});
