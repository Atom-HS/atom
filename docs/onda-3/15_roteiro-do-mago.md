# O Roteiro do Mago — sessão de escopo cheio, autorização única

*29 Jul 2026 · o roteiro que uma sessão inteira segue sem pedir licença no
meio. Nasce da dissecação 01 (`14_`), do mapa de estado das 13 features, e
do que o diário deixou pendurado desde 27 Jul. Não é lista de desejos: é
ordem de marcha, com autorização declarada na frente, decisões
pré-resolvidas pra nada travar, e três — só três — condições de parada.*

> **A regra do mago:** quem entra nesta sessão não volta pra perguntar.
> Tudo que precisaria de um «posso?» está resolvido no §0. O que não está,
> tem default declarado. O que não tem default, não entra no escopo.

---

## §0 — A AUTORIZAÇÃO

### 0.1 O que está autorizado (verde, sem perguntar)

- **Editar código** em `src/`, `e2e/`, `supabase/functions/` — qualquer
  camada, seguindo o Build Protocol (§3 do CLAUDE.md) na escala da obra.
- **Criar testes** co-locados e cenas de e2e. Testes novos são sempre bem-vindos.
- **Rodar os hooks** (tsc · vitest · build) quantas vezes precisar.
- **Commitar em `v2-faces`**, um commit por obra, na convenção da casa.
- **Escrever docs** novos em `docs/onda-3/` (dissecações, specs, o wrap do dia).
- **Refotografar baselines** visuais quando a mudança for intencional.
- **Rodar migrations novas** em arquivo (nunca schema sem migration).
- **Propor decisões** com número sugerido — propor não é ratificar.

### 0.2 Os muros (nunca, mesmo com pressa)

1. **Não edita docs-lei** — `law/genesis.md`, `marco-zero.md`,
   `meta-template.md`, `identidade.md`. São lei; se a obra pede mudança
   ali, a obra para e vira decisão proposta.
2. **Não ratifica decisão** — D-número novo só o Rick sela. A sessão
   escreve «DP», nunca «D».
3. **Não deleta AtomItem** — entropy é archive. UUID é eterno.
4. **Não faz merge no `master`** nem puxa o gatilho do gate (D41).
5. **Não expõe segredo** — nada de key em `VITE_`, nada de `.env` no commit.
6. **Não aplica label em mensagem do Gmail** — `gmail.modify` é banido na
   v1 por D68. A ida cria estrutura; nunca move conteúdo.
7. **Não ignora erro de tsc** nem commita com teste vermelho.
8. **Não conserta durante a dissecação** — exame e cirurgia são ritos
   separados (regra do `13_`). Achou no exame: anota, termina o passo.

### 0.3 As decisões pré-resolvidas (pra nada travar)

Cada uma tem default declarado. A sessão segue o default e registra a
proposta; o Rick ratifica ou vira depois — nenhuma delas para a marcha.

| DP | Pergunta aberta | **Default desta sessão** |
|---|---|---|
| **DP-A** *(D70?)* | Item de conector não-assentido aparece nos fixos do HOJE? | **Sim, aparece** — o compromisso existe no céu independente da triage; esconder faria o hoje mentir. É o que o código já faz. |
| **DP-B** *(D71?)* | «Pular» adia pra onde? | **Fim da fila, dentro da sessão.** Sem snooze de calendário — snooze é cobrança adiada com outra cara. |
| **DP-C** *(D72?)* | Assentimento por instância ou por série? | **Por série.** Um gesto sela o ritual semanal inteiro; instância nova herda o selo. |
| **DP-D** *(D73?)* | Onde mora o assentimento, já que `/pipeline` está sentenciada (D48)? | **Não é lugar, é camada** (D40): puxador no HOJE + sheet de assentimento. Ver Ato II. |
| **DP-E** *(D74?)* | `/projects` — reformar ou matar? | **Vive como camada, morre como tela.** A pill do HOJE já é a porta; a página vira sheet no gate. |
| **DP-F** | O digest repete as mesmas 5 ausências todo dia? | **Não** — e a formulação mudou na execução: não é prazo, é **mudança de estado**. Prazo seria relógio; espelho é dizer de novo quando a banda muda (30 → 7 dias É notícia; 113 → 112 não é). Ver Ato V. |

### 0.4 As três condições de parada

A sessão só para se:

1. **Um muro do §0.2 for a única saída** — a obra exige mexer em lei.
2. **Um hook ficar vermelho e não fechar em duas tentativas** — não se
   empilha obra sobre chão quebrado (Maturação Permissiva, §3.2).
3. **Um dado de produção divergir do que o roteiro assume** — ex.: o
   tronco real contradiz o mundo simulado. Aí o exame vence o plano.

Fora isso: **não para**. Dúvida de estilo resolve pelo precedente da casa.
Dúvida de escopo resolve pela tabela §0.3. Dúvida de ordem resolve pelo §3.

---

## §1 — ONDE A CASA ESTÁ

Estado real em 29 Jul, HEAD `11f88b7`, branch `v2-faces`. Vereditos 1–3 da
dissecação 01; 4–13 do mapa de implementação desta sessão.

| # | Feature | Estado | O que pesa |
|---|---------|--------|-----------|
| 1 | HOJE | **viva** | falta a pressão da semana (table stake do benchmark `10`) |
| 2 | @ / captura | **manca** | falha pós-captura nega e duplica |
| 3 | Triage / assentimento | **manca** | e **sem porta** — ver §2 |
| 4 | ÁRVORE + drill | motor com teste, página sem | drill trunca em 8 folhas; janela não persiste |
| 5 | Raiz / cofre D63 | lê certo, **não deixa agir** | `renewalPatch` órfã: o gesto de renovar não existe |
| 6 | Builder D64 | vivo, pare de verdade | perguntas só em 5 dos 8 módulos |
| 7 | A casa / conectores | funcional | sync manual; Drive é «em breve» |
| 8 | A ida (labels) | completa e reversível | sem reconciliação automática |
| 9 | Digest / Telegram | **no ar, com cron** | lei do cofre **duplicada à mão** na edge |
| 10 | Wrap | rito inteiro, 740 linhas | só alcançável por um botão |
| 11 | Busca + gestos | motor de 347 linhas | **zero teste**; hint esconde metade dos prefixos |
| 12 | Projetos / presença | casca velha viva | fora da nav; D48 pendente |
| 13 | Offline / PWA | fila do avô funcionando | SW artesanal; só a boca do `@` enfileira |

**Débitos transversais:** 62 erros de lint pré-existentes (casca velha);
espelhos de lei no app desatualizados (v5.0.1 × v5.0.4); nenhuma edge tem
teste; `PATH_TO_PAGE` não conhece as três faces novas;
`FirstTimeRaizRedirect` é código morto (checa `/`, e `/` redireciona antes).

---

## §2 — O ACHADO QUE REORDENA TUDO

**A triage não tem porta.**

O cron ingere (50 itens em 29 Jul, dado real). A leitura chega com o chip
D69 pronto, bonito, trocável. E o único jeito de chegar até ela é **digitar
`/pipeline` na barra de endereço** — a rota não está na `BottomNav` (que só
conhece `· hoje · ⬡ árvore · ✳ @`), não tem link em face nenhuma, e a tela
que a hospeda foi **sentenciada à morte pela D48**.

Três leis colidem num ponto só:

- **D69** manda o assentimento ser visível e trocável — e ele é, onde
  ninguém vê.
- **D48** matou o Pipeline como tela — e o assentimento mora dentro dela.
- **D40** diz que só há três lugares — e o assentimento não é nenhum deles,
  nem virou gesto ou camada.

Isso explica o dado de campo de 29 Jul: *o Rick não achou o puxador*. E
explica a pendência que atravessou o dia — «falta triar (chip D69)». Não
faltou vontade: faltou porta. Enquanto isso, o digest chama pro app todo
dia às 07:15 e a fila da lente cresce sem destino.

**Consequência pro roteiro:** a porta vem antes do polimento da esteira.
Não adianta afinar o gesto de assentir (Ato III) se não há como chegar ao
gesto. Por isso o Ato II é o segundo, e não o sexto.

---

## §3 — OS SETE ATOS

Cada ato declara: **por que agora · as camadas do Build Protocol que
acorda · as obras · a prova · o tamanho.** A ordem é dívida de confiança
primeiro, capacidade nova por último — porque inovação com base ruim não
serve (D62).

### Ato I — As mentiras
> *Nada se constrói em cima de uma tela que mente.*

**Por que agora:** três achados MENTE da dissecação 01 e um quarto que o
mapa de hoje revelou. Mentira é a categoria de prioridade máxima do `13_`.

**Camadas:** ESTRUTURA (services/hooks) + INTERFACE (as falas). Sem ROOT —
zero schema novo.

**As obras:**

1. **O @ para de negar o que guardou** — separar os catches de
   `At.tsx handleSend`: se o ponto nasceu, a fala é «guardei como ponto —
   não consegui selar», e a leitura **não** volta pra fila. A frase certa
   já existe na casa (o chip *confirma* usa ela).
2. **Assentir que falha não avança** — `next()` só quando `classify`
   devolve item. Hoje o erro é engolido e o card anda.
3. **Outbox idempotente** — a entrada guarda o `item_id` após o capture do
   replay; retomada sela, não recaptura. *Duplicar é melhor que perder*
   segue valendo como princípio — mas quando dá pra não duplicar, não duplica.
4. **O gesto de renovar nasce** — `vault.renewalPatch` está exportada,
   testada e **órfã**: ninguém a chama. E o digest, todo dia, promete «renovar
   é um gesto no chão da árvore». A válvula fala de uma porta que não existe.
   Ou nasce o gesto, ou o digest cala — e a decisão da casa é: **nasce o gesto.**

**A prova:** um teste co-locado por mentira (o que não tem teste, volta),
mais a cena de e2e do @ com falha pós-captura mostrando a fala certa.

**Tamanho:** 3 gestos + 1 obra pequena.

---

### Ato II — A porta que falta
> *Uma lei que ninguém alcança não está em vigor.*

**Por que agora:** §2. E porque tudo no Ato III depende de existir caminho
até o gesto.

**Camadas:** ESTRUTURA (o contador de espera) + INTERFACE (o puxador e a
camada de assentimento). GUARDIÃO consultado: assentimento é gesto, não
lugar — D40 e D48 dizem onde ele pode morar.

**As obras:**

1. **O puxador no HOJE** — quando há leitura esperando, o HOJE mostra uma
   linha quieta: «*N esperando leitura*». Estado, nunca cobrança (D46) — sem
   badge vermelho, sem número que grita. Some quando a fila zera.
2. **A camada de assentimento** — o card da triage vira sheet, chamado do
   puxador. A tela `/pipeline` deixa de ser o lar do gesto (e fica pronta
   pra morrer no gate, como a D48 mandou).
3. **Os detritos de rota** — `PATH_TO_PAGE` passa a conhecer `/hoje`,
   `/at`, `/arvore`; `FirstTimeRaizRedirect` morre (é código morto desde
   que `/` virou redirect).

**A prova:** o teste que falhou na vida real — alguém que não construiu o
app acha o assentimento **sem instrução**. Em e2e: abrir `/hoje` com fila
cheia e chegar ao gesto sem digitar URL.

**Tamanho:** obra pequena (2) + gesto (1).

---

### Ato III — A esteira honesta
> *Cinquenta itens não podem custar cinquenta decisões iguais.*

**Por que agora:** com porta aberta (Ato II) e selo confiável (Ato I), o
gesto pode ser afinado.

**Camadas:** GUARDIÃO (série é contrato novo de leitura) → ESTRUTURA
(ingestão e dedup) → INTERFACE (o card).

**As obras:**

1. **Assentimento por série (DP-C)** — dedup e selo por `recurringEventId`;
   a instância nova herda a leitura selada. Hoje o standup de segunda pede
   assentimento **toda semana, pra sempre**.
2. **O card deixa de ser cego** — hora, dia e quem vem no evento;
   remetente e trecho no email. Os dados já estão no `body`; a tela só não
   abre a mão. Não se assente o que não se vê (lei 4).
3. **Pular com semântica (DP-B)** — fim da fila, não giro infinito.
4. **O módulo trocável** — hoje tudo nasce e sela `bridge`, e a árvore
   recebe a colheita inteira num galho só.
5. **Os toasts na Lei do Tom** — «Item classificado» a cada assentir, numa
   esteira de 50, é ruído; «Item nao esta no inbox» é de outra era.

**A prova:** reviver a esteira de 50 com Playwright e medir — quantos
gestos até o inbox limpo, e quantos itens **voltam** na volta seguinte
(a série tem que zerar esse número).

**Tamanho:** 1 obra com mesa (série) + 2 obras pequenas + 2 gestos.

---

### Ato IV — A lente que não mente
> *O dia inteiro parece administrável quando só se olha um dia.*

**Por que agora:** dívida nomeada pelo benchmark `10` (table stake 3) e
sentida vivendo o app.

**Camadas:** ROOT dispensado · ESTRUTURA (engine novo, puro) → INTERFACE.

**As obras:**

1. **A pressão dos próximos dias** — um sussurro da semana no HOJE, sem
   virar vista de semana (isso seria virar o app que espelha — lei 1).
   Engine puro, testado, no padrão de `fixos.ts`.
2. **Os fixos ignoram arquivados** — um fixo arquivado hoje voltaria a
   aparecer.
3. **As marcas do arco no toque** — `<title>` de SVG é mudo no celular;
   D59 pede que o acontecimento se deixe ler.
4. **«Me dá outra» avisa a volta completa** — hoje cicla em silêncio.
5. **Os tokens descobríveis** — `#work @task @amanha` não aparecem em lugar
   nenhum; são gramática privada. Um hint que ensina uma vez, sem virar tutorial.
6. **Uma linha de chão na primeira aurora** — quem chega vê «inspira…» e
   nada mais. Bonito pra quem é da casa; mudo pra quem acabou de entrar.

**A prova:** fotos do HOJE em três estados (dia cheio · dia vazio ·
primeira vez) + testes de engine pra pressão e arquivados.

**Tamanho:** 1 obra com mesa + 5 gestos.

---

### Ato V — O chão e a válvula
> *Duas verdades sobre a mesma lei é uma verdade a menos.*

**Por que agora:** o cofre (D63) e a válvula (D66) já vivem em produção —
e a lei que os rege está escrita **duas vezes**.

**Camadas:** GUARDIÃO (declarar o canônico) → ESTRUTURA.

**As obras:**

1. **Uma lei, um lugar** — `LEAD_DAYS`, `DOMAINS` e a regra de ausência
   estão em `engine/vault.ts` **e** copiados à mão dentro de `daily-digest`.
   A spec `12_` já diz que o engine é canônico e a edge espelha — mas nada
   força. Nasce o que força: fonte compartilhada ou teste que quebra quando
   divergem. Enquanto não houver, mudar o lead time do passaporte num lugar
   só é o próximo bug de produção.
2. **O raro ganha memória (DP-F)** — cinco ausências «nunca teve registro»
   todo dia vira ruído, e ruído mata a raridade que justifica a válvula.
   O que já foi dito não se repete antes de 7 dias.
3. **A primeira dissecação da edge** — nenhuma edge tem teste. O digest
   fala com o Rick todo dia às 07:15 sem uma linha de verificação.

**A prova:** um dry-run do digest com dado real, e o teste que falha de
propósito quando engine e edge divergem.

**Tamanho:** 2 obras pequenas + 1 gesto.

---

### Ato VI — A dissecação continua
> *Profundidade sempre vence cobertura.*

**Por que agora:** o `13_` é ritual, não relatório — e dez features seguem
sem exame. Cada rodada usa o mesmo método: viver, intenção, profundidade,
crivo, veredito. Cada uma gera seu doc e sua fila.

- **`14_dissecacao-02`** — features 4, 5, 6: ÁRVORE + drill · Raiz/cofre ·
  Builder. *(A pergunta afiada da 5 já tem meia resposta: as validades
  avisam, mas o gesto de agir nasceu só no Ato I.)*
- **`14_dissecacao-03`** — features 7, 8, 9: a casa/conectores · a ida
  vivida no Gmail · digest. *(Conversa direto com os Atos II, III e V.)*
- **`14_dissecacao-04`** — features 10 a 13: Wrap · busca e gestos ·
  projetos/presença · offline/PWA. *(A busca é a mais exposta: motor de 347
  linhas, zero teste.)*

**A prova:** três docs com tabela de vereditos, fila priorizada, fotos das
cenas que provam, e as sementes registradas.

**Regra herdada:** não corrige durante o exame. O que a dissecação achar
vira fila — e a fila roda depois, no mesmo rito dos Atos I a V.

**Tamanho:** 3 obras com mesa (uma por rodada).

---

### Ato VII — O gate, carregado mas não disparado
> *A morte por merge é gesto do dono da casa.*

**Por que agora:** o gate (D41) espera desde 27 Jul pela vivência. Depois
dos seis atos, o mundo novo tem porta pra tudo — e a casca velha fica sem
desculpa.

**A obra:** deixar o gate **pronto e documentado**, não puxado:

- a lista do que morre no merge: `/home`, `/pipeline`, `/calendar`,
  `/analytics`, `/library`, `/graph`, `/review` — e o que cada uma leva junto;
- a confirmação, uma a uma, de que o mundo novo cobre o que a tela velha
  fazia (o Pipeline só pode morrer **depois** do Ato II — e é essa a razão
  da ordem dos atos);
- `/projects` conforme DP-E: vive como camada, morre como tela;
- o PR aberto, verde, com o antes-e-depois em fotos.

**A parada legítima:** **o gatilho é do Rick.** D41 é decisão dele e o
diário registra o «ainda não» de 28 Jul. A sessão carrega a arma e a deixa
na mesa — isso não é parar por dúvida, é escopo.

**Tamanho:** obra com mesa.

---

## §4 — OS GATES (o rito do verde)

Depois de **cada obra**, não de cada ato:

```
pnpm tsc --noEmit     → zero erro
pnpm vitest run       → zero vermelho
pnpm build            → completa
```

E antes de cada commit: viewport 360×800 conferida · zero `console.log` ·
mensagem na convenção `tipo(escopo): descrição` · `.env` fora.

**A lei da fotografia:** mudança visual intencional refotografa baseline e
diz no commit *por quê*. Baseline que muda sem intenção declarada é bug
disfarçado de foto.

**A lei do teste:** obra que conserta mentira nasce com teste que prova a
mentira morta. Sem isso, ela volta na próxima onda.

---

## §5 — O QUE NÃO SE FAZ NESTA SESSÃO

Escopo é o que se recusa. Fora, por decisão:

- **Bilhetes do E. v2** — a spec existe (Lei do Tom 4.1.1), a obra é de voz,
  com o E. na mesa. Não é obra de sessão solitária.
- **Library-despensa** e **email vestido de Atom** — sementes; germinam pós-gate.
- **Cofre completo** (cadastro guiado, extração de data por foto/PDF) —
  D63 diz explicitamente: v1 é leitura-só. O resto é semente.
- **`gmail.modify` / aplicar labels** — muro D68.
- **Chain player** — table stake real do benchmark `09`, mas é obra grande
  e o HOJE já tem a sua no Ato IV. Fica pra onda seguinte, nomeada.
- **Os 62 erros de lint da casca velha** — morrem no gate junto com as telas.
  Consertar código sentenciado é trabalho que o merge apaga.

---

## §6 — MAPA DE RISCO

| Risco | Sinal de que aconteceu | Resposta pronta |
|---|---|---|
| Série do calendar não vem com `recurringEventId` utilizável | dedup por série não bate no dado real | cai pro par (`title` + regra de recorrência) e registra a limitação no doc — nunca finge que selou |
| Token do Google expira no meio (testing mode: 7 dias) | `TAX_401` / sync vazio | o fluxo de reconexão já existe (`RECONNECT_SCOPES`); a sessão registra e segue — a volta não bloqueia o resto |
| Redirect URL nova ainda não está no Supabase | login quebra na prod nova | **pendência do Rick**, anotada desde 29 Jul; não bloqueia obra local nem preview |
| Baseline visual quebra em massa | gate visual vermelho após obra do HOJE | conferir foto a foto; refotografar só o que mudou **por intenção** |
| A dissecação 02–04 achar outra MENTE | veredito MENTE numa feature nova | entra na fila do próprio doc; **não conserta no exame** — a cirurgia é rito à parte |
| O escopo inchar | um ato começa a parir atos | o §5 é a régua: se não está lá, e não é dívida de confiança, vira semente |

---

## §7 — O FIM DA SESSÃO

A sessão fecha do jeito que a casa come a própria comida:

1. **O wrap no diário** (`onda-3-log.md`) — soul, items, decidido, conexões,
   seeds, audit, next. O formato é o do wrap do app.
2. **As decisões propostas** juntadas num bloco só pra mesa do Rick:
   DP-A a DP-F, com número sugerido e a linha do porquê.
3. **A fila que sobrou** — o que os Atos não alcançaram, priorizado, pra
   abrir a sessão seguinte sem redescobrir nada.
4. **O gate na mesa** — carregado, verde, esperando o gesto.

---

## Apêndice — a ordem linear

A sessão executa nesta ordem. Cada linha fecha com hooks verdes e commit.

```
ATO I — as mentiras                              ✅ 29 Jul (5066454, aa73823)
  [x] 1. @ para de negar o que guardou            (gesto)
  [x] 2. assentir que falha não avança            (gesto)
  [x] 3. outbox idempotente                       (obra pequena)
  [x] 4. o gesto de renovar nasce                 (obra pequena)

ATO II — a porta que falta                       ✅ 29 Jul (1ed8028)
  [x] 5. o puxador no HOJE                        (obra pequena)
  [x] 6. a camada de assentimento                 (obra pequena)
  [x] 7. os detritos de rota                      (gesto)

ATO III — a esteira honesta                      ✅ 29 Jul (89f96ea, 7106fa0)
  [x] 8. assentimento por série                   (obra com mesa)
  [x] 9. o card deixa de ser cego                 (obra pequena)
  [x] 10. pular com semântica                     (gesto)
  [x] 11. o módulo trocável                       (obra pequena)
  [x] 12. toasts na Lei do Tom                    (gesto)

ATO IV — a lente que não mente                   ✅ 29 Jul (6f24fe7)
  [x] 13. a pressão dos próximos dias             (obra com mesa)
  [x] 14. fixos ignoram arquivados                (gesto)
  [x] 15. marcas do arco no toque                 (gesto)
  [x] 16. "me dá outra" avisa a volta             (gesto)
  [x] 17. tokens descobríveis                     (gesto)
  [x] 18. chão na primeira aurora                 (gesto)

ATO V — o chão e a válvula                       ✅ 29 Jul (edd849e)
  [x] 19. uma lei, um lugar (vault × digest)      (obra pequena)
  [x] 20. o raro ganha memória                    (obra pequena)
  [x] 21. o primeiro teste de edge                (feito como guarda de
          espelho — a edge é Deno e entra no vitest como TEXTO, lida
          nunca executada; cobre as constantes, não o runtime)

ATO VI — a dissecação continua        ← a sessão da noite começa aqui
  [ ] 22. 14_dissecacao-02 (features 4, 5, 6)     (obra com mesa)
  [ ] 23. 14_dissecacao-03 (features 7, 8, 9)     (obra com mesa)
  [ ] 24. 14_dissecacao-04 (features 10–13)       (obra com mesa)

OBRAS QUE O BENCHMARK 16 JÁ JUSTIFICOU (não precisam de exame)
  [ ] 24a. WRAP em um passo por tela              (obra com mesa)
  [ ] 24b. ÁRVORE: cold start + confiança por ramo (obra pequena)

ATO VII — o gate
  [ ] 25. carregar o gate, não disparar           (obra com mesa)

FECHO
  [ ] 26. wrap no diário + DPs pra mesa + fila que sobrou
```

> **Sessão desacompanhada:** o roteiro operacional dela é o
> `18_handoff-mega-sessao.md`, que traduz este documento em ordem de marcha
> e fecha as portas que não podem ser abertas sem o Rick (deploy, push,
> merge, produção).

---

---

## Achados nascidos da execução (não estavam no plano)

O roteiro previu 12 obras nos três primeiros atos. A execução achou mais
duas coisas que ninguém tinha visto — ambas da família das mentiras:

1. **A esteira pulava um item a cada selo bem-sucedido.** O índice do card
   era fixo enquanto a lista encolhia embaixo dele: selar A em `[A,B,C]`
   deixava a fila `[B,C]` e o índice ia pra 1 → o card mostrava C, e **B
   sumia da sessão sem nunca ter sido visto**. Morreu junto com a obra 10,
   ao trocar índice por leitura sempre-pelo-topo.
2. **O erro cru do FSM vazava pra tela** — «Item nao esta no inbox», sem
   acento, empilhado três vezes. Não é mensagem: é implementação escapando.
3. **A obra 8 nasceu atropelando a lei.** Pra herdar o selo da série, a
   instância nova nascia direto em `classified`/2 — e o CLAUDE.md §6 diz
   «inbox obrigatório» e «não pula estágio». Corrigida no Ato IV: toda
   instância nasce no 1 e é selada pelo portão. **Herdar poupa a pergunta,
   nunca o caminho.** O Guardião existe pra pegar isso e não pegou; quem
   pegou foi reler a lei antes de seguir.

As três confirmam a tese do prompt da dissecação (`13_`): o que MENTE só
aparece vivendo, nunca lendo — inclusive quando quem mente é a obra que
acabou de nascer.

---

*Filho da dissecação 01, do crivo D62 e da lei do desenho. A ordem não é
gosto: é dívida de confiança primeiro (Atos I–II), gesto afinado depois
(III–V), verdade nova por último (VI), e a morte das telas velhas só quando
o mundo novo tiver porta pra tudo (VII). Se um ato não puder ser feito
inteiro, faz-se o que cabe e registra-se o resto — mas não se pula pra
frente deixando mentira viva atrás.*
