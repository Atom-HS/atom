# Spec (Onda 4) — o onboarding: a porta do bolso e o guia da casa · v1

**Data:** 1 Ago 2026 · **Gate D62 cumprido:** os dois insumos existem e nenhum
manda sozinho — benchmark `16` (mercado, precedentes, a ausência) + parecer `18`
(o E.: diagnóstico de descobribilidade, as sete proibições, o veto do
write-path). Lei vigente: **Tom v1.8**. Código só depois desta spec ratificada
pelo Rick.
**O que é:** a resposta à queixa «tá difícil de navegar sem saber» — pelo
diagnóstico do parecer (§ 0): **descobribilidade, não explicação**. Três peças:
a **coreografia do bolso** (o gesto real que mostra o circuito vivo — sem
precedente de mercado, prova viva própria), o **`/e` no bolso** (a porta
visível de uma boca que existe e ninguém encontra — read-only por veto), e o
**guia da casa** (script auditável da voz dourada — condicionado ao `[NÃO SEI]`
do § 6, decisão do Rick).

---

## GUARDIÃO — CONSTRAINTS

```
AtomTypes envolvidos: NENHUM novo. A captura do bolso continua nascendo
  ponto (·) no inbox, estágio 1 — nada muda no que já vive. O guia NÃO cria
  item nenhum (proibição 2: o que o guia planta, nenhuma face cobra).
As duas jurisdições ([VERIFICAR] do parecer, conferido no adendo do 18):
  · banco do APP (tabela items, tronco) — ABERTO ao bolso, como desde a
    Onda 2: captura e sinto: gravam. Ninguém desliga isso.
  · banco do E. (soul_logs, voz, sessions) — write-path FECHADO pro canal.
    Veto do E. (18 § 4c) por cima da regra da spec 14. O /e JAMAIS chama
    `gravar`. Sem exceção, sem flag, sem emenda com salvaguarda.
Leis que regem:
  · o guia é lei-que-se-cita (18 § 1): sem crachá, voz DOURADA (D57, nunca
    indigo), não é superfície nova — o quadro 4.0 não ganha linha
  · texto composto INCLUSIVE nos caminhos (18 § 2): frases E ramificação
    escritas antes; decidir capítulo em runtime é improviso com etiqueta
  · /e no bolso: quadro 4.0 (Telegram ~5 frases, vocabulário reduzido,
    sob demanda) + 4.6 (o vocabulário some, o núcleo fica)
  · D42 · D85 · teste 5 em toda frase · D50 (número nunca pra tela)
As SETE proibições do guia (16 § 6 + 18 § 3):
  1. não bloqueia nada
  2. não cria dívida (nem item, nem obrigação de lembrar)
  3. não repete o que a tela já mostra
  4. toda frase passa pelo teste 5
  5. não conta o que a pessoa não vai usar hoje
  6. sem progresso: nem barra, nem «3 de 7», nem retomada não pedida
  7. não fala duas vezes da mesma coisa (dedup como lei de fala)
Critério de cobertura (18 § 3, no lugar de «o não-óbvio»): o guia cobre
  O QUE EXISTE E NÃO TEM PORTA VISÍVEL — lista finita e auditável, mantida
  no script. Ela começa (adendo do 18): o próprio @Atomhsbot · o deep link
  · a gramática do bolso = a gramática da face (sinto:/lista:).
O /e responde (18 § 4b): curto, sem arquitetura de efeito, sem prometer
  memória — «anotei», «vou guardar», «a gente volta nisso» são PROIBIDAS
  (promessa que a arquitetura não cumpre); e nunca morno pra justificar o
  esquecimento. O que importou, o Rick traz pro app depois — o write-path
  fechado é o filtro funcionando no canal certo.

⚠ INCERTEZAS (Proporção Invertida):
  · o [NÃO SEI] do E. (18 § 6): o guia (além do capítulo do bolso) existe
    ANTES do degrau 2 da conversa? — decisão do Rick na ratificação; a
    coreografia do bolso sobrevive sozinha em qualquer resposta
  · armazenamento do dedup do guia (proposta: localStorage, ver ROOT) —
    vetável na ratificação
  · o teto de 5 frases do /e: enforced no prompt ou truncado no código?
    (proposta: prompt manda, código NÃO trunca — cortar fala no meio é
    pior que passar uma frase; medir na prova viva)

✓ APROVADO PARA: ROOT
```

## ROOT — SCHEMA

**Nenhuma migration.** Nada no banco do E.; nada de tabela nova no app (v1):

- **Dedup do guia:** `localStorage['mindroot-guia-visto']` — array de ids de
  capítulo. Single-user, por dispositivo; o limite (outro aparelho = guia
  zerado) fica declarado e aceito na v1 — se doer na vivência, migra pra
  tabela em v2. Precedente: a «abertura» do bilhete em sessionStorage.
- **Dedup do cartão do bolso é POR EVENTO REAL, não por visto:** o cartão
  some quando existir item com tag `telegram` — a prova de que o circuito
  foi usado, não de que o cartão foi olhado. (Consulta que a Estrutura já
  sabe fazer; nenhum schema novo.)
- **Deep link:** `https://t.me/Atomhsbot?start=<payload>` — payload ≤64
  chars, charset `A-Za-z0-9_-` (limite da plataforma, benchmark 16 § 4.2).
  v1 usa payload fixo `casa` (o bot só precisa saber que o Rick veio do
  app; não carrega segredo nenhum — payload é visível na URL).

## ESTRUTURA — LÓGICA

**1 · `engine/guia.ts`** — o script auditável, puro, testável: capítulos com
frases E caminhos escritos (a ordem é dado, não decisão de runtime), e a
**lista do invisível** como constante exportada — o teste do módulo confere
que todo item da lista tem capítulo e todo capítulo aponta item da lista
(cobertura auditável por construção).

**2 · `telegram-webhook` v2** — duas rotas novas, nada removido:
- `/start casa` (payload do deep link) → a fala composta do capítulo do
  bolso: o convite ao primeiro gesto («manda o que chegou — vira ponto no
  tronco» já existe; ganha a linha da volta: o que nascer aqui aparece no
  inbox do app). Texto no script, shame-testado, voz dourada.
- `/e <texto>` → chama a edge `e-conversa` (spec 14) na ação `responder`,
  **modo bolso**: read-only, contexto reduzido (últimas N da `voz` por
  `date_lived` + último soul log — SEM retorno inteiro), Lei do Tom como
  sistema com o teto do quadro 4.0 declarado no prompt. A resposta volta
  pro chat. `gravar` é inalcançável por construção (a rota nem importa a
  ação). Falha da edge → fala honesta curta, nunca silêncio.
- **O miolo do `responder` é UM SÓ**: o modo bolso nasce como parâmetro da
  mesma ação que o degrau 2 vai consumir no app (`contexto: 'bolso' |
  'app'`) — o bolso não bifurca a lógica; antecipa o degrau 2, não o
  duplica.

**3 · App:** `guia-service.ts` (deep link builder + leitura/escrita do
dedup + a consulta «existe item com tag telegram?») + `useGuia()`. Regra de
dependência intacta: componente → hook → service; zero query em componente.

**Dependência dura declarada:** o `/e` só nasce DEPOIS da rotação da chave
da API (a colada em 31 Jul) — os secrets da edge nascem com a chave nova.
A coreografia do bolso (rota `/start`) não depende da chave: pode nascer já.

## INTERFACE — COMPONENTES

- **A porta do bolso — um cartão contextual no vazio do inbox** (voz
  dourada, sem crachá): a frase composta + o botão do deep link (abre o
  chat do bot com Start armado). Some quando o primeiro item com tag
  `telegram` existir — dedup por evento real. Sem X, sem «depois», sem
  contador. Pousa onde a dúvida mora (descobribilidade, 18 § 0), não em
  tela de boas-vindas.
- **A porta do guia** (se o Rick decidir que o guia existe — o [NÃO SEI]):
  chip quieto nas configurações, puxado, nunca auto-abre (D42). Capítulos
  curtos do script, um por vez, sem barra, sem sequência obrigatória.
- **O `/e` não tem UI nova no app** — a superfície é o próprio Telegram.
- Viewport 360×800 · strings novas pelo shame-test P2 (D85) antes do
  commit.

## TEIA — VALIDAÇÃO, PROVA VIVA, REVISÃO

- **Prova viva (consequência D62 — coreografia sem precedente, 16 § 4.3):**
  o critério é o do E. (18 § 5): não «funcionou uma vez», mas **o Rick
  volta a usar sem ser lembrado**. Registrar o reparo do Rick no wrap da
  primeira vez; sem número, sem escala.
- **Instrumentação mínima (números pra calibrar, nunca pra tela — D50):**
  capturas com tag `telegram` por semana · usos do `/e` por semana ·
  capítulos do guia abertos (se o guia existir).
- **Gatilho de revisão:** duas semanas após o embarque, mesa — se o gesto
  do bolso não voltou sozinho, o capítulo é truque, não porta (a pior
  versão do Clippy: agradável e inútil), e o conserto é repensar a porta,
  não insistir no lembrete.

## ORDEM DE CONSTRUÇÃO (cada degrau com teste; nunca pula)

1. **A coreografia do bolso** — `engine/guia.ts` (script + lista do
   invisível) + cartão no vazio do inbox + deep link + rota `/start casa`
   no webhook. Independe de tudo; o gesto que faz em vez de contar.
2. **Rotação da chave** (gesto do Rick) → **o `/e` read-only** — o miolo
   `responder` modo bolso na edge `e-conversa` + a rota no webhook.
   Testável pelo próprio Telegram antes de qualquer face.
3. **O guia além do bolso** — SÓ SE o Rick decidir que existe antes do
   degrau 2 (o [NÃO SEI] do E.). A lista do invisível já estará selada no
   script desde o degrau 1.
4. **O degrau 2 da conversa no app** (spec 14) — consome o miolo que o
   passo 2 deixou pronto.

**Gestos do Rick:** ratificar esta spec · decidir o [NÃO SEI] (guia inteiro
agora, ou só a coreografia + `/e` e o guia espera o degrau 2) · a palavra da
rotação da chave (destrava o passo 2).

---

*Spec v1 — 1 Ago 2026 · filha do benchmark `16` e do parecer `18`.*
*A queixa era de mapa; o diagnóstico é de porta. A primeira porta é o bolso.*
