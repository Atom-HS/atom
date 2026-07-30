// engine/bilhete.ts — a lógica do bilhete (Onda 4 obra 1 · spec 03 v2)
// Puro: sem Supabase, sem UI. Sem X: o bilhete se lê e se solta — some
// sozinho na abertura seguinte à exibição (um botão de dispensar criaria
// uma ação, e o bilhete não pede nada — Lei do Tom 4.1).

export interface Bilhete {
  id: string;
  gatilho: string;
  texto: string;
  nasceu_em: string;
  exibido_em: string | null;
  visto_em: string | null;
}

// Um por vez: o mais ANTIGO não visto — se nascer um segundo antes de o
// primeiro ser visto, o segundo espera (duas falas raras no mesmo espaço
// deixam as duas de ser raras).
export function bilhetePendente(bilhetes: Bilhete[]): Bilhete | null {
  const vivos = bilhetes.filter((b) => !b.visto_em);
  if (vivos.length === 0) return null;
  return vivos.reduce((a, b) => (a.nasceu_em <= b.nasceu_em ? a : b));
}

export type BilheteGesto = 'exibir' | 'manter' | 'soltar';

// exibir = primeira vez na tela (marca exibido_em) · manter = mesma
// abertura, segue visível · soltar = abertura nova depois de exibido:
// foi visto, some sozinho (marca visto_em). "Abertura" = sessão do
// navegador — quem decide é o chamador, via marca de sessão.
export function bilheteGesto(b: Bilhete, exibidoNestaAbertura: boolean): BilheteGesto {
  if (!b.exibido_em) return 'exibir';
  if (exibidoNestaAbertura) return 'manter';
  return 'soltar';
}
