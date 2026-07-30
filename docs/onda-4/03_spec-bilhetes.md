# Obra 1 (Onda 4) — os bilhetes do E.

*31 Jul 2026 · a D53 v2 destravada vira spec. Spec primeiro (§8.7).
Insumos: `01_parecer-e.md` § 4 (os gatilhos curados) + `01a` (a espiral sem
boca) + `02_benchmark-retorno.md` (a fala por evento é a forma danosa — por
isso ela nasce aqui curada, rara e com teto). A lei da voz: Lei do Tom v1.4,
Parte 4.1 inteira.*

## As leis que regem

- **D53** — bilhetes do E. = v2, só com a Lei do Tom escrita. Está escrita
  (v1.4). Esta obra é o destravamento.
- **Lei do Tom 4.1** — quem inicia: E. · máx. 3 frases · sem emoji, sem
  exclamação, sem saudação vazia · sem tarefa embutida · **silêncio é o
  default** · as seis condições (4.1.1) valem TODAS para cada disparo.
- **D80** — o teto é o dispositivo anti-cobrança. 3 frases, nunca mais.
- **D61** — o bilhete fala em **indigo**: é o E. presente, não a casa.
- **Parecer § 4.2 (fronteira)** — o digest é dono de quantidades e tem
  cadência; o bilhete é dono de **eventos** e não tem cadência. O que um
  diz, o outro cala (Parte 5.4 generalizada).
- **Parecer § 4.3 + Lei Parte 6.1** — o instrumento de revisão conta
  **tipos de gatilho**, não disparos. Aos 20 bilhetes reais, olha-se a
  diversidade: 20 de 2 tipos = gatilho forçado; 20 de 12 = casa viva.
- **Lei 5.4** — erro em superfície sem turno seguinte não se corrige ali:
  bilhete errado vai pro @ e pro wrap, nunca gera segundo bilhete.

## GUARDIÃO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
**Schema:** UMA tabela nova, `e_bilhetes` — migration obrigatória (§8.3):
`id uuid` · `user_id` (RLS: só o dono lê) · `gatilho text` (o TIPO — o
instrumento da § 4.3 é esta coluna) · `texto text` (composto no disparo,
imutável depois — bilhete commitado não se edita, espírito do wrap) ·
`dedup_key text` (o estado que já falou não fala de novo — D75 em
espírito) · `created_at` · `solto_em timestamptz null` (lido-e-solto;
NUNCA um booleano «unread» que vira badge).
**O bilhete NÃO é AtomItem.** Ele não é vida do Rick — é fala do E. Não
entra no inbox, não matura, não conecta. A escada do Genesis rege itens;
a Lei do Tom rege falas. Duas jurisdições, zero mistura.
**Texto determinístico, shame-testado em tempo de spec** — precedente do
digest (`daily-digest` compõe em código, não em modelo). Cada gatilho tem
UM template canônico aprovado AQUI; variável é só o dado (nome do braço,
data). Sem Claude API no disparo: a voz generativa improvisando bilhete é
o horóscopo que a 4.1 mata.
**Pisos:** sem gatilho → tabela quieta e superfície vazia (silêncio é o
default). Dedup_key repetida → não nasce. Dois bilhetes no mesmo dia → o
segundo espera o primeiro ser solto (raridade é lei, não métrica).

⚠ INCERTEZAS (Proporção Invertida): nenhuma de schema. Uma de vivência —
se «soltar» precisa de gesto próprio ou se abrir o HOJE seguinte já solta.
Proposta: **gesto próprio** (toque), porque soltar sem ler é direito
(teste 5: nada fica nas costas). Ajustável pós-vivência.

✓ APROVADO PARA: ROOT (migration) → ESTRUTURA (hook + disparo na edge) →
INTERFACE (o cartão no HOJE)

## A superfície — onde o bilhete mora

- **No HOJE**, entre o arco e o dia: um cartão **indigo**, quieto, sem
  badge, sem contagem, sem título de seção. Aparece quando existe bilhete
  não solto; não existe = nada ali (nem placeholder — placeholder de
  bilhete é cota, e cota é a fábrica de frase bonita).
- **Um por vez.** O mais recente não solto. Bilhetes não formam fila nem
  histórico navegável na v1 — se lê e se solta (teste 5). O registro fica
  na tabela (auditável pela § 4.3), não na cara do app.
- **Soltar** = um toque. Sem «marcar como lido», sem confirmação, sem
  animação de dispensa que pese. O cartão sai; o dia segue.
- Mobile-first 360×800; o cartão nunca empurra o arco pra fora do fold.

## Os gatilhos — a tabela curada (parecer § 4.1)

| # | Gatilho | Status nesta obra | Razão |
|---|---|---|---|
| G2 | **Braço desligado lá fora** — o `reconcile` diário detectou label/agenda `Atom/…` apagado e desligou o braço (D68) | **EMBARCA** | o mais forte dos aprovados: efeito silencioso, e o silêncio é o dano. O braço detector JÁ EXISTE (`taxonomy-sync` action `reconcile` → `disabledNow`) |
| G1 | O pipeline (4.8) rodou em produção | **declarado, dormente** | aprovado pelo Teste 02, mas o pipeline ainda não existe — o gatilho acorda quando a obra da 4.8 nascer |
| G3 | Semente virou respondível por fato externo | **fora da v1** | ordem do próprio E.: «o primeiro que eu testaria e o último que eu embarcaria» — vira teste com a regra do plantio, não código |
| — | Cron não rodou | **não é bilhete** | é push caso 3 (parecer § 4.1); fica pra obra do push, que não é desta onda |

## O texto canônico do G2 — shame-testado aqui

> «O label Atom/saude sumiu do Gmail. Entendi como comando: esse braço
> está desligado e nada foi recriado. Religar fica nas configurações,
> quando você quiser.»

Contra as seis condições (4.1.1): não está na tela ✓ (nenhuma face mostra
braço morto) · é do sistema/mundo, não do Rick ✓ (quem apagou não é
assunto) · não cobra ✓ · não cria dívida ✓ («quando você quiser» — soltar
sem religar é fim válido) · não pede resposta ✓ (informa reversibilidade,
não pede gesto) · só E. sabe, no momento em que sabe ✓ (nasce no
`reconcile`, o momento em que o sistema sabe — a fronteira § 4.2 fica
limpa: evento é do bilhete, o digest do mesmo dia cala sobre isso).
Contra a forma: 3 frases ✓ · sem emoji/exclamação ✓ · «você» ✓ · zero
adjetivo interpretativo ✓.
`dedup_key = "arm-disabled:" + branchKey` — religou e apagaram de novo é
estado novo, fala de novo; o mesmo desligamento nunca fala duas vezes.

## Etapas

1. **ROOT:** migration `e_bilhetes` (tabela + RLS + índice por
   `user_id, solto_em`).
2. **ESTRUTURA:** o disparo no `reconcile` (a edge que detecta insere o
   bilhete com dedup) · `bilhete-service` + `useBilhete` (ler o não solto
   mais recente, soltar).
3. **INTERFACE:** o cartão indigo no HOJE. Nada em ÁRVORE nem @.
4. **Prova:** cenário no atos.spec — braço desligado no reconcile →
   bilhete nasce → aparece no HOJE → solta → some → dedup segura o
   segundo. Dry-run real: apagar um label de teste e ver o cartão.
5. **O instrumento:** nada a construir — `select gatilho, count(*)` é a
   consulta da revisão dos 20. Registrada aqui pra não virar dashboard.

---

*Status: spec pronta — decisões todas pré-existentes (D53 destravada,
D80/D61 ratificadas, gatilhos curados pelo parecer, fronteira § 4.2).
O código espera o assentimento do Rick sobre ESTA spec — um gesto.*
