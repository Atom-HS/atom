# Obra 1 (Onda 4) — os bilhetes do E. · spec v2, a fusão

*31 Jul 2026 · **v2 = fusão de duas specs escritas em paralelo sem uma saber
da outra**: a da casa (v1 deste arquivo, Code) e a do E.
(`03b_spec-bilhete-e_v1.md`, selada verbatim). O mesmo aconteceu com o
benchmark: `02_benchmark-retorno.md` (casa, escopo da onda) e
`02b_benchmark-bilhete.md` (E., escopo da obra) — **complementares, não
duplicados**: um responde marca × boca e intervalo × densidade; o outro
responde frequência, canal e formato. Esta fusão é aditiva onde as duas
concordam (quase tudo) e resolve as três divergências declarando quem tinha
jurisdição. Spec primeiro (§8.7); o código espera o assentimento do Rick.*

## O que cada mãe trouxe (e a fusão guarda)

**Da spec do E.** (jurisdição: a voz e a superfície dela):
- **A regra de formato que a lei não tinha** — banner é o formato de pior
  reação medida (12,5%) e alvo da dispensa reflexa (NN/g 2026): o bilhete
  que nasce banner morre num componente. Não é banner e **não tem X**.
- **Anti-gerador com a razão numerada**: no Teste 02, 11 de 12 candidatos
  gerados reprovaram — pedir a um modelo «escreva o bilhete de hoje» é
  construir o horóscopo com passos extras. Texto pré-escrito por gatilho,
  espaços só para dados.
- **Instrumentação mínima** (3 eventos: nasceu · exibido · visto) — sem
  ela, a revisão dos 20 (Parte 6) é inauditável.
- **A dependência declarada**: a raridade do bilhete só é segura porque o
  digest existe (95% de churn em 90 dias com silêncio total — Airship).
  Digest desligado → 4.1 se relê junto. Condição, não ressalva.
- **Fora da v1, em lei**: gatilho sobre comportamento do Rick não é «ainda
  não» — é a condição 2, e não entra em versão nenhuma. Sem histórico
  navegável (arquivo de bilhetes é a dívida do teste 5, guardada).
- **G3 vai a Teste 03 antes de embarcar** (honrar a ressalva do parecer em
  vez de promovê-la no fio).
- **Processo de gatilho novo**: candidato → frase escrita → shame-test 3+2
  documentado linha a linha → só então fio. Sem registro, não embarca.

**Da spec da casa** (jurisdição: o tronco, o schema, a face por dentro):
- **`dedup_key`** — o estado que já falou não fala de novo (D75 em
  espírito). O E. não tinha; sem isso, o mesmo braço desligado falaria a
  cada reconcile diário. `dedup_key = "arm-disabled:" + branchKey`;
  religou-e-apagaram-de-novo é estado novo, fala de novo.
- **Bilhete NÃO é AtomItem** — é fala do E., não vida do Rick. Não entra no
  inbox, não matura, não conecta. A escada do Genesis rege itens; a Lei do
  Tom rege falas. Duas jurisdições, zero mistura.
- **O detector localizado**: `taxonomy-sync` action `reconcile` já computa
  `disabledNow` no cron diário — o G1 é dar boca ao que o braço já sabe.
- **Migration + RLS**: tabela nova exige migration (§8.3); só o dono lê.
- **Onde pousa no HOJE** (pendência § 9 do E., respondida por quem conhece
  a face): **abaixo do rito da aurora (D42), acima da sugestão do dia** —
  não disputa com o rito nem empurra o arco pra fora do fold (360×800).

## As três divergências, resolvidas

| # | Divergência | Resolução | Por quê |
|---|---|---|---|
| 1 | **Soltar**: casa propunha gesto próprio (toque); E. decidiu **sem X — some sozinho na próxima abertura depois de visto** | **E.** | é a superfície dele; e a razão é de lei: botão de dispensar cria uma ação, e o bilhete não pede nada (4.1). A incerteza da v1 era declarada e ajustável — ajustou |
| 2 | **Texto do G1**: casa tinha 3ª frase de reversibilidade («religar fica nas configurações»); E. escreveu 2 frases secas | **E.** | a voz é dele (Art. 5 invertido: decisão do domínio dele); a 3ª frase beirava instrução, e o que pede gesto é notificação |
| 3 | **Numeração dos gatilhos** (casa: braço=G2; E.: braço=G1) | **E.** | a tabela dele é a canônica; a da v1 morre nesta fusão |

## GUARDIÃO — CONSTRAINTS (fundidos)
━━━━━━━━━━━━━━━━━━━━━━
**Schema:** UMA tabela, `e_bilhetes` — migration + RLS (user_id, só o dono
lê): `id uuid` · `user_id` · `gatilho text` (o tipo — instrumento da
§ 6.1) · `texto text` (imutável após nascer) · `dedup_key text` ·
`nasceu_em` · `exibido_em timestamptz null` · `visto_em timestamptz null`.
Três eventos, nada mais: sem clique, sem conversão, sem tempo de leitura
(medir atenção é observar o Rick — a condição 2 vale para os dados também).
**Regra de existência:** as seis condições da 4.1.1, todas, por disparo.
Silêncio é o default e a saída mais comum.
**Texto determinístico** — frase pré-escrita por gatilho, shame-testada na
spec; zero chamada de modelo no disparo.
**Pisos:** sem gatilho → superfície vazia (nem placeholder — placeholder é
cota, cota é fábrica de frase bonita) · dedup repetida → não nasce · um
por vez: o segundo espera o primeiro ser visto · nunca vaza pra push (o
benchmark do E.: quebra de confiança de canal não gera opt-out seletivo,
gera desligamento geral).

✓ APROVADO PARA: ROOT → ESTRUTURA → INTERFACE

## A superfície (as seis regras do E., § 4 da spec dele — íntegras)

1. Não é banner e não tem X — se lê e se solta; some sozinho na próxima
   abertura depois de visto.
2. Pousa no HOJE, abaixo do rito (a aurora é rito por ser a primeira
   coisa, D42) — e acima da sugestão do dia (localização da casa).
3. Indigo (D61) — quem fala é E., não a casa; dourado não entra.
4. Um por vez — duas falas raras no mesmo espaço deixam as duas de ser
   raras.
5. Sem som, sem badge, sem contador — contador de não-lido é dívida com
   número (D46).
6. Não vaza para push.

## Os gatilhos (tabela canônica do E., com o estado da casa)

| # | Evento | Fonte | Frase | Estado |
|---|---|---|---|---|
| **G1** | Braço desligado lá fora (D68: delete é comando) | `reconcile` (v2 no ar, `disabledNow`) | «O braço `{taxonomia}` foi desligado no {conector}. A estrutura lá fora não existe mais.» | **embarca** |
| **G2** | O pipeline de O Espaço Entre rodou em produção | fora do app — `[VERIFICAR]` fonte; conversa com a obra da 4.8 | «O pipeline rodou. {n} sessões no Supabase.» | dormente até haver fonte |
| **G3** | Semente virou respondível por fato externo | inbox + fato externo | *a escrever no Teste 03* | teste antes de fio |
| — | Cron não rodou | — | — | é push caso 3, outra obra |

## Instrumentação e revisão (§ 6 do E. — íntegro)

Diversidade, não taxa: contar **tipos**, não disparos. Poucos tipos +
volume alto = gatilho forçado (apertar a fonte, não a lei) · muitos tipos
+ volume alto = a casa aconteceu (a Parte 0 vira histórica) · **zero em 90
dias também é resultado** — gatilhos estreitos demais ou app sem eventos
singulares; o E. registrou como o mais provável, pra não ser lido como
fracasso depois.

## Ordem de construção

1. **ROOT:** migration `e_bilhetes` (+ RLS + índice `user_id, visto_em`).
2. **ESTRUTURA:** disparo no `reconcile` (insert com dedup) ·
   `bilhete-service` + `useBilhete` (ler não-visto mais recente · marcar
   exibido/visto · a regra do sumiço na abertura seguinte).
3. **INTERFACE:** o cartão indigo no HOJE, sob as seis regras.
4. **Prova:** cena no atos.spec (braço desliga → bilhete nasce → exibe →
   visto → some na abertura seguinte → dedup segura o segundo) + dry-run
   real com label de teste.
5. O que a obra destrava (não é a obra): Teste 03 do G3 · fonte do G2.

---

*Spec v2 — fusão Code + E. · 31 Jul 2026 · mães seladas verbatim em
`03b_spec-bilhete-e_v1.md` e no histórico git da v1 (`27c7eec`).*
*Status: **aguarda o assentimento do Rick** — um gesto, e o código nasce.*
