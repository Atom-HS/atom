# SPEC — OBRA 1: O BILHETE

**Versão:** v1 · **Data:** 30 Jul 2026 · **Escrita por:** E.
**Onda:** 4 (retorno e voz) · primeira obra pela ordem do `01_parecer-e.md` § 6
**Insumos:** `01_parecer-e.md` (interno) · `02_benchmark-bilhete.md` (D62)
**Lei que rege:** Lei do Tom v1.4, Parte 2 (shame-test 3+2) e Parte 4.1
**Destrava:** D53 («bilhetes do E. = v2, só com a lei do Tom escrita» — escrita e
selada em v1.4)

---

## 1 · O QUE ESTA OBRA É

Pôr a superfície 4.1 em produção. A lei dela está escrita e testada; o que não
existe é o fio: uma fonte de evento, um lugar onde a frase pousa, e a medição que
permite revisar a lei depois.

**O que esta obra não é:**

- Não é um canal de notificação. Se precisar de ação do Rick, não é bilhete.
- Não é um gerador. Ver § 3.1.
- Não é o digest. Ver § 5.
- Não abre push. A 4.5 fica intocada.

**Por que é a primeira obra da onda:** é a única que alimenta a lei de volta. A
Parte 6 tem um gatilho de revisão — os 20 primeiros bilhetes reais — que só
produção abre. Enquanto ele não abrir, tudo o que se escrever para as outras três
obras é lei antes do fato, que é a hipótese que a própria Parte 0 confessa.

---

## 2 · REGRA DE EXISTÊNCIA (herdada, não reescrita)

Um bilhete só nasce quando há algo que **só E. sabe**, e só sai se passar nas
**seis condições da 4.1.1**, todas:

1. Não está na tela.
2. É do sistema, do dado ou do mundo — nunca do Rick.
3. Não cobra.
4. Não cria dívida (teste 5).
5. Não pede resposta.
6. Só E. sabe, no momento em que sabe.

**Silêncio é o default.** Nenhum bilhete é saída válida, e é a saída mais comum.

Forma: três frases no máximo, frequentemente uma. Sem saudação vazia, sem tarefa
embutida, sem emoji decorativo (3.5: informa fica, decora sai).

---

## 3 · OS GATILHOS

### 3.1 Decisão de arquitetura — v1 não gera texto em runtime `[PARECER]`

Cada gatilho carrega a **sua frase, escrita antes, com espaços para os dados do
evento**. Nada é redigido por modelo no momento do disparo.

A razão é o próprio Teste 02: quando eu gerei doze candidatos plausíveis sob a
lei, **onze reprovaram**. O gerador não é o instrumento que produz bilhetes bons —
é o mecanismo que produz o template antes da pergunta, que é a antivoz que os 27
testes documentaram. Pedir a um modelo «escreva o bilhete de hoje» é construir o
horóscopo com passos extras.

Frase autorizada por gatilho tem três propriedades que a geração não tem: é
auditável antes do disparo, não deriva, e custa zero chamada.

**Quando isso se revisa:** se em algum momento existir um gatilho cujo conteúdo
não couber numa frase com espaços — um padrão que muda de forma a cada ocorrência
—, esse gatilho não é bilhete. É assunto do @.

### 3.2 Tabela de gatilhos v1

| # | Evento | Fonte | Frase (espaços em `{}`) | Estado |
|---|---|---|---|---|
| **G1** | A ida de um conector foi desfeita fora do app — label `Atom/…` apagado, braço desligado (D68: delete lá fora é comando) | `taxonomy-sync` · ação `reconcile` (deployada v2, 30 Jul) | «O braço `{taxonomia}` foi desligado no {conector}. A estrutura lá fora não existe mais.» | **embarca na v1** |
| **G2** | O pipeline de O Espaço Entre rodou em produção pela primeira vez | fora do app — precisa de fonte de evento `[VERIFICAR]` | «O pipeline rodou. {n} sessões no Supabase.» | entra quando houver fonte |
| **G3** | Uma semente `#seed` virou respondível porque um fato externo chegou (parecer § 2.4) | inbox + o fato externo | *a escrever no teste* | **vai a teste antes de embarcar** |

**Sobre o G1.** É o único com fonte de evento viva hoje: a reconciliação subiu em
30 Jul. É do mundo, não do Rick; irreversível sem novo assentimento; invisível em
qualquer face; e o dano do silêncio é maior que o da fala, porque um braço
desligado falha calado. Passa nas seis.

**Sobre o G2.** É o único candidato aprovado do Teste 02 e continua sem ter
acontecido. O evento não nasce neste repo — a fonte precisa ser verificada antes
de qualquer fio. Não invento a ponte aqui.

**Sobre o G3.** O parecer o aprovou com ressalva: é o que mais se aproxima da
fronteira do teste 5, porque «está respondível» tem sombra de «está te
esperando». Por isso vai a **Teste 03** antes de embarcar — mesmo desenho do
Teste 02, com candidatos gerados a partir das sementes reais que existem hoje.
Honrar a ressalva do parecer em vez de promovê-la no fio é o ponto.

### 3.3 Como um gatilho novo entra

1. Nasce como candidato, com a frase escrita.
2. Passa pelo shame-test 3+2 documentado por escrito, uma linha por teste.
3. Só então ganha fio.

Gatilho sem shame-test registrado não embarca. É o que impede que o sistema
descubra como notificar por dentro.

---

## 4 · SUPERFÍCIE E FORMATO — a regra que a lei não tem

O benchmark trouxe o risco que a Lei do Tom não previu: ela legisla o conteúdo com
rigor e é muda sobre o formato. Banner é o formato de pior reação medida e o alvo
direto da dispensa reflexa registrada pelo NN/g em 2026 — o leitor não decide
ignorar, ele já ignorou. Um bilhete que passa nas seis condições e nasce banner
morre num componente. `[PARECER]`

**Regras de superfície, v1:**

1. **Não é banner e não tem X.** O bilhete não se dispensa — ele se lê e se solta.
   Um botão de dispensar cria uma ação, e a 4.1 é explícita: o bilhete não pede
   nada. Some sozinho na próxima abertura depois de ter sido visto.
2. **Pousa na face HOJE, abaixo do rito.** A aurora é rito por ser a primeira
   coisa (D42). O bilhete não disputa com ela e não a antecede.
3. **Indigo (D61).** Quem fala é E., não a casa. O dourado é raro e sagrado e é da
   casa (D57); aqui não entra.
4. **Um por vez.** Se nascer um segundo antes de o primeiro ter sido visto, o
   segundo espera. É o teto da 4.5 aplicado por analogia — duas falas raras no
   mesmo espaço deixam as duas de ser raras.
5. **Sem som, sem badge, sem contador.** Contador de bilhete não lido é dívida com
   número, e número visível é estado, nunca julgamento (D46).
6. **Não vaza para push.** O canal de baixa urgência não desce por canal de alta
   urgência — o benchmark registra que a quebra de confiança aí não produz opt-out
   seletivo, produz desligamento geral.

---

## 5 · A FRONTEIRA — bilhete × digest × push

Regra em uma linha, do parecer § 4.2:

> **O digest tem cadência e é dono de quantidades. O bilhete não tem cadência e é
> dono de eventos. O push é dono do irreversível iminente.**

| | quem inicia | cadência | assunto | canal |
|---|---|---|---|---|
| **digest** (D66) | cron 07:15 | diária, fala só quando a banda muda (D75) | quantidades: validades, ausências | Telegram |
| **bilhete** (4.1) | evento | nenhuma | eventos singulares e irreversíveis | in-app |
| **push** (4.5) | evento | nenhuma | os três casos, exaustivos | push |

**Precedência:** quem tem cadência fala primeiro. Se algo cabe no digest, o digest
diz e o **bilhete cala por já ter sido dito**. Generalização da Parte 5.4: se
emendar um push com outro push duplica a invasão, dizer a mesma coisa em duas
bocas duplica pelo mesmo mecanismo.

**Caso de colisão** — o mesmo dado é quantidade e evento (a validade venceu hoje):
resolve pelo digest, porque a banda mudou e a boca periódica é a mais barata.

**Caso que parece bilhete e é push:** o cron das 07:15 não rodou. Só E. sabe, não
está na tela, e importa — mas exige ação, e o que pede ação é notificação. **Push,
caso 3.**

**Dependência registrada.** A raridade do bilhete só é segura porque o digest
existe. A evidência de churn com silêncio total é forte, e o benchmark `09` já
tinha achado o mesmo no cofre. Se o digest for desligado, a 4.1 precisa ser relida
junto — não é ressalva, é condição.

---

## 6 · INSTRUMENTAÇÃO — o mínimo que torna a Parte 6 auditável

Sem medição, o gatilho de revisão dos 20 bilhetes é inauditável e a lei não pode
fechar por evidência. Requisito mínimo, v1:

Uma tabela. Um registro por bilhete, com: `trigger_id` · `nasceu_em` ·
`exibido_em` · `visto_em` · `texto_final`.

Três eventos, nada mais: **nasceu · foi exibido · foi visto**. Sem clique (não há
o que clicar), sem conversão (não há o que converter), sem tempo de leitura
(medir atenção é observar o Rick, e a condição 2 vale para os dados também).

### 6.1 O instrumento de revisão — diversidade, não taxa `[PARECER]`

Refinamento do gatilho 1 da Parte 6, proposto no parecer § 4.3 e mantido aqui:

**Contar tipos de gatilho, não disparos.** Vinte bilhetes vindos de 2 tipos é
gatilho forçado — alguma parte do sistema descobriu como notificar. Vinte vindos
de muitos tipos é um período em que a casa realmente aconteceu. A taxa sozinha não
distingue os dois, e são opostos.

Leitura combinada:

| tipos | volume | leitura |
|---|---|---|
| poucos | alto | gatilho forçado — apertar a fonte, não a lei |
| muitos | alto | a casa está agitada; a Parte 0 deixou de ser verdade |
| — | zero em 90 dias | os gatilhos são estreitos demais, ou o app não gera eventos singulares |

O terceiro caso também é resultado, e é o que eu consideraria mais provável.
Registrado agora para não ser lido como fracasso depois.

---

## 7 · FORA DA V1

- Geração de texto em runtime (§ 3.1).
- G3 antes do Teste 03.
- Qualquer gatilho sobre comportamento do Rick — hora de abrir, sequência,
  ausência, ritmo. Não é «ainda não»: é a condição 2, e não entra em versão
  nenhuma.
- Preferências de frequência. Não há frequência a preferir.
- Histórico de bilhetes navegável. O bilhete se lê e se solta; um arquivo de
  bilhetes é a dívida que o teste 5 evita, guardada.

---

## 8 · ORDEM DE CONSTRUÇÃO

1. A tabela e os três eventos (§ 6) — sem isso, nada é auditável.
2. O componente na face HOJE, sob as seis regras do § 4.
3. **G1** ligado à `reconcile` (§ 3.2) — o único com fonte viva.
4. **Teste 03** sobre o G3, mesmo desenho do Teste 02.
5. **G2** quando a fonte de evento for verificada.

Os passos 1–3 são a obra. Os 4–5 são o que a obra destrava.

---

## 9 · PENDÊNCIAS QUE NÃO SÃO MINHAS

- **Fonte de evento do G2** — dado da casa, não decisão minha. `[VERIFICAR]`
- **Onde exatamente na composição do HOJE** (`SkyArc`, `ArcMark`, `AuroraRitual`,
  `ProtocolBanner`) o bilhete pousa — o § 4 dá as regras; o lugar é de quem
  conhece a face por dentro.
- O `[NÃO SEI]` do parecer § 5.1 (buraco 3) segue aberto e **não bloqueia esta
  obra** — o soul log não aparece no bilhete em hipótese nenhuma (4.0).

---

*Spec obra 1 — E. · 30 Jul 2026*
*A lei já existia. Esta obra é o fio, o lugar, e o instrumento que deixa a lei fechar.*
