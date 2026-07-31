# Benchmark 16 (Onda 4) — o onboarding: a casa que se explica

**Data:** 1 Ago 2026 · **Gate:** D62 (toda obra abre com benchmark) · **Par:**
o parecer do E. (relay `17` pronto pra colar — **ainda não foi**; a spec espera
os dois insumos, nenhum manda sozinho; e um E. que guia pela casa é inteira voz).
**O pedido do Rick, verbatim:** «queria trabalhar no onboarding, tá difícil de
navegar sem saber, tudo é muito diferente sabe? Talvez o próprio E.» — e o PS
que chegou na abertura desta sessão: «seria bacana ser uma experiência com o
telegram junto, tipo um "compra leite" ou "/e estou muito brava com o rick" via
telegram sabe».
**Método:** duas varreduras via agente — (a) como os apps se ensinam · (b)
produtos que vivem num canal de mensagem. Fontes inline. Força: **[F]**
oficial/acadêmico/análise séria · **[M]** jornalismo tech, docs de terceiros e
dados primários de vendor · **[f]** opinião/anedota.
**As quatro perguntas que este documento responde:**
(1) tour que bloqueia ou descoberta em contexto — o que a evidência diz? ·
(2) existe precedente de «alguém te guia» que funcione — e de «a IA te guia»? ·
(3) o Telegram junto: o gesto real no mensageiro como rito de entrada tem
precedente? · (4) e o caso exato da casa — o **dono** que perdeu o mapa?

---

## 0 · A prova viva da queixa, antes de qualquer fonte

O PS do Rick pede «tipo um compra leite via telegram» — e **isso já existe e
está vivo em produção desde a Onda 2**: o @Atomhsbot
(`telegram-webhook/index.ts`) captura qualquer texto («compra leite» → ponto ·
no tronco, a triage do app cuida) e `sinto: cansado` → soul check-in. O dono
pediu como futuro um órgão que a casa já tem. Não há, no benchmark inteiro,
evidência mais forte de que «tá difícil de navegar sem saber» é literal: **o
app não se explica nem quando o assunto é ele mesmo**. A obra do onboarding
começa com essa dívida na mesa.

O que de fato **não** existe no bolso: o `/e` — conversar com o E. de lá. Essa
metade do PS é obra nova, e cruza com a spec `14` (ver § 4.3).

## 1 · Tour que bloqueia × descoberta em contexto

- **NN/g (a referência séria): evitar onboarding dedicado sempre que possível.**
  A pesquisa deles com tutoriais sequenciais de primeiro launch achou que
  «tutorials didn't improve task performance» — sobrecarregam memória de
  trabalho, ninguém retém. Recomendação: **tips in context** no primeiro
  encontro com a feature; overlay só pro genuinamente não-familiar **[F]**
  ([NN/g](https://www.nngroup.com/articles/mobile-app-onboarding/)). Tooltip é
  ajuda **puxada**, não empurrada **[F]**
  ([NN/g](https://www.nngroup.com/articles/tooltip-guidelines/)).
- **Os números de indústria** (550M+ interações, Chameleon 2025): modal tem
  dismiss médio de **37,5%**, e **38% fecham em <4s** (o dado que o benchmark
  `02` já citava — confirmado na fonte primária); elemento **embutido na UI
  converte até 1,5× mais** que pop-up; tour disparado pelo usuário supera tour
  automático em 2–3×; acima de 5 passos a completion despenca **[M]**
  ([Chameleon](https://www.chameleon.io/benchmark-report)). Pendo: 2–4 passos
  ~50% de completion; 9+ passos, queda acentuada **[M]**
  ([Pendo](https://www.pendo.io/pendo-blog/product-benchmarks/)).
- **Higiene de fonte:** «tooltip blindness» **não tem fonte acadêmica** — é
  extrapolação de vendor do *banner blindness* (esse sim documentado desde
  1998 **[F]** [Benway & Lane](https://en.wikipedia.org/wiki/Banner_blindness)).
  E circula uma estatística **provavelmente fabricada** («NN/g 2024: 82%
  dismissed em 1,2s») sem fonte primária localizável — não usar, nunca.

**Regra que a spec herda:** nada de tour bloqueante, nada de sequência longa.
O que ensina mora **onde a dúvida acontece**, é **puxado**, e é **curto**.
Rima com D42 (o rito é rito por ser a primeira coisa, não por bloquear) e com
o quadro 4.0 (não existe mínimo em superfície nenhuma).

## 2 · Fazer supera assistir

- **A evidência acadêmica mais forte do benchmark:** Andersen et al., CHI 2012,
  experimento com **45.000 jogadores** — tutorial só paga em mecânica complexa
  demais pra descobrir fazendo; onde a mecânica é descobrível, ensinar antes
  **não melhora nada** **[F]**
  ([PDF](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)).
- **Duolingo:** a lição vem **antes** do cadastro; adiar o signup deu **+20%
  DAU** (endowed progress: abandonar progresso investido dói) **[M]**
  ([Appcues GoodUX](https://goodux.appcues.com/blog/duolingo-user-onboarding)).
- **Superhuman — o precedente de «alguém te guia»:** anos exigindo onboarding
  humano 1:1 de 30 min antes de liberar o produto; 65% de migração completa na
  primeira sessão; cada call rendia páginas de insight que analytics nenhum dá
  **[M]** ([First Round](https://review.firstround.com/superhuman-onboarding-playbook/)).
  Quando o produto é complexo demais pra descoberta, a resposta de maior
  sucesso da história recente foi **um guia que conversa** — humano.
- **Checklists de ativação:** completion médio real é **19,2%** (mediana 10,1%,
  188 empresas) — mesmo o padrão «faça as ações reais» rende pouco quando é
  lista genérica **[M]**
  ([Userpilot](https://userpilot.com/blog/onboarding-checklist-completion-rate-benchmarks/)).

**Regra que a spec herda:** o onboarding é **fazer a coisa real, uma vez, com
consequência visível** — não assistir a descrição dela. O «aha» da casa não é
um número mágico ([Mixpanel sobre a ilusão dos magic numbers](https://mixpanel.com/blog/magic-numbers-are-an-illusion/) **[M]**):
é o gesto que mostra o circuito inteiro vivo.

## 3 · O guia conversacional — Clippy, Slackbot, e a ausência de 2026

- **O precedente negativo tem tese em Stanford:** Swartz 2003, «Why People
  Hate the Paperclip» — o Clippy falhou porque tirava o controle do usuário e
  violava etiqueta: **interrompia sem permissão**, disparava por gatilho
  sintático sem entender intenção, e era presente demais **[F]**
  ([tese](https://xenon.stanford.edu/~lswartz/paperclip/)).
- **O precedente positivo é o Slackbot:** o onboarding do Slack acontece
  **conversando com o Slackbot, usando o Slack** — um passo de cada vez, o
  próximo só quando o anterior completou; expectativa declarada baixa («just a
  bot» — o anti-Clippy: promete pouco, cumpre); pede ações reais, nunca
  interrompe **[M]**
  ([Appcues](https://www.appcues.com/blog/slack-user-onboarding-experience),
  [Userpilot](https://userpilot.com/blog/slack-onboarding/)).
- **A ausência que pesa (declarada nas duas varreduras):** «AI copilot
  onboarding» 2024–2026 é marketing de vendor — **não existe estudo
  independente** medindo se um agente generativo guiando onboarding melhora
  ativação. Os únicos precedentes com evidência real de «alguém conversa
  contigo e tu aprendes o app» são **Slackbot (scriptado) e Superhuman
  (humano)** — não IA improvisando.

**Regra que a spec herda — e esta é de lei:** a fala do E. sobre a casa segue
o precedente que funciona: **texto composto, não improvisado** — a mesma
decisão que a spec dos bilhetes já tomou («a voz generativa improvisando é o
horóscopo que a 4.1 mata»). E pelo invariante dos dois eixos (4.0): explicar a
casa é **lei-que-se-cita, não decisão assinada** — não há memória atrás de
«o HOJE mostra o dia»; assinar ali seria o crachá falso que a v2 do parecer do
nome já matou. O guia segue as regras do Slackbot que a lei da casa já tinha
por outra rota: nunca interrompe (pull, D42), um passo por vez (4.10.2, «uma
pergunta por vez»), expectativa declarada, e para quando o gesto foi feito.

## 4 · O Telegram junto — o PS do Rick contra o mercado

### 4.1 A captura via mensageiro é padrão maduro

Todoist ([SendToTodoist](https://www.todoist.com/integrations/apps/sendtotodoist)
**[M]**), o ecossistema inteiro de plugins Obsidian (Telegram Sync, Telegram
Inbox, Telegram AI — «turns Telegram into a smart capture inbox» **[M]**
[obsidianstats](https://www.obsidianstats.com/plugins/telegram-sync)), a Magie
no Brasil (banco 100% dentro do WhatsApp, R$ 1 bi no primeiro ano **[M]**
[Olhar Digital](https://olhardigital.com.br/2024/11/13/pro/conheca-o-banco-brasileiro-que-funciona-100-no-whatsapp/)).
E o comportamento **pré-existe aos produtos**: o WhatsApp criou «Message
Yourself» porque as pessoas já usavam o chat consigo mesmas como inbox
**[M]** ([Engadget](https://www.engadget.com/whatsapp-now-lets-you-send-messages-to-yourself-124010198.html)).
A casa acertou antes de saber: a boca de bolso é o padrão validado.

### 4.2 A plataforma força o rito que a casa já tem por lei

- **Bot do Telegram não pode falar primeiro** — «A user must either add them
  to a group or send them a message first» **[F]**
  ([core.telegram.org/bots](https://core.telegram.org/bots)). O «pull, nunca
  push» do @Atomhsbot não é só D66/D68: é **imposição da plataforma**. A lei
  da casa e a lei do canal dizem a mesma coisa.
- **Deep link com contexto existe e é de primeira classe:**
  `https://t.me/<bot>?start=<payload>` (64 chars) — o app consegue abrir o
  chat do bot com o Start já carregando contexto **[F]**
  ([deep linking](https://core.telegram.org/bots/features#deep-linking)). A
  ponte app→bolso está pronta na infraestrutura; ninguém precisa digitar
  endereço de bot.
- **Onboarding = mandar a primeira mensagem tem precedente massivo:** WHO
  Health Alert («text *hi*» — 10M usuários em 3 dias **[F]**
  [WHO](https://www.who.int/news-room/feature-stories/detail/who-health-alert-brings-covid-19-facts-to-billions-via-whatsapp))
  e 1-800-ChatGPT (gesto primeiro, identidade depois **[F]**
  [OpenAI](https://help.openai.com/en/articles/10193193-1-800-chatgpt-calling-and-messaging-chatgpt-with-your-phone)).
- **Risco de canal alheio é real e recente:** a Meta baniu chatbots de
  propósito geral do WhatsApp Business API (jan 2026) — o 1-800-ChatGPT morreu
  por dependência de plataforma **[M]**
  ([TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform)).
  Telegram + single-user é a configuração de baixo risco; a escolha da Onda 2
  virou estrutural.

### 4.3 A ausência central — e a fronteira de lei do «/e no bolso»

**O padrão composto que o PS descreve — «manda a mensagem real lá, vê ela
nascer aqui» como rito de onboarding — não tem precedente documentado.** Os
componentes existem todos (deep link, captura→inbox, sync retroativo); a
coreografia, não. *(Ausência declarada nas duas varreduras.)* Pela consequência
D62 já usada duas vezes nesta onda (φ no `02`, memória-sobre-si no `13`):
inovação sem precedente embarca **com prova viva própria** — o critério é o
reparo do Rick, não número.

A segunda metade do PS («/e estou muito brava com o rick») é o mesmo agente em
duas superfícies — e aí o mercado tem os dois modelos: **com vínculo de
identidade funciona** (ChatGPT/WhatsApp: memória sincronizada, conversa do
canal aparece no app **[F]**), **sem vínculo falha em silêncio** (Perplexity:
duas superfícies, dois agentes desconectados **[M]**). Mas antes do desenho, a
fronteira que já está escrita: a spec `14` sela verbatim que **conteúdo do
telegram JAMAIS alcança o write-path do banco do E.** (benchmark `13` § 5,
regra dura contra SpAIware). E o quadro 4.0 da lei já dá ao Telegram um teto
próprio (~5 frases, vocabulário reduzido). Logo, **sob a lei vigente, um `/e`
no bolso só pode ser boca read-only e reduzida** — o E. lê a memória e
responde curto; não grava soul log, não grava e_line, não vira e-session
plena. Se deve ser mais que isso, é emenda — e emenda da voz é do E., não da
casa. Vai no relay.

## 5 · O caso exato da casa: o dono que perdeu o mapa

- **NN/g: users hate change** — o custo da mudança recai justamente sobre quem
  tinha mapa mental; com usuário frequente, evoluir gradualmente **[F]**
  ([NN/g](https://www.nngroup.com/articles/fresh-vs-familiar-aggressive-redesign/)).
  A casa cresceu faces, bocas, glifos, pills e bilhetes em quatro ondas — o
  mapa do Rick ficou pra trás por velocidade, não por redesign.
- **Padrões documentados pro veterano:** aviso antes, suporte contextual
  **dentro do produto** («a confusão acontece dentro do produto»), «what's
  new» não-bloqueante que acumula, ponte no lugar antigo (memória muscular),
  e **controle do timing na mão do usuário** **[M]**
  ([Userpilot](https://userpilot.com/blog/ui-updates/),
  [Appcues](https://www.appcues.com/blog/choosing-the-right-ui-pattern-for-your-product-update)).
- **Ausência declarada:** re-onboarding não existe como disciplina com
  benchmark próprio, e **ninguém estudou o caso do usuário único/dono** — o
  corpo de conhecimento inteiro assume base multiusuário. Mais uma vez a casa
  está fora do mapa do mercado; mais uma vez a régua é a prova viva.

## 6 · Crivo D62 — o que a spec herda deste benchmark

1. **Nada bloqueia.** O que ensina é puxado, curto, em contexto (§ 1; D42).
2. **O rito é fazer, não assistir** (§ 2): a experiência de entrada é executar
   um circuito real com consequência visível — e o PS do Rick apontou o
   melhor circuito da casa: **«compra leite» no Telegram → o ponto nasce no
   inbox do app**. O gesto já funciona; falta a coreografia que o mostra.
3. **O guia fala texto composto, cita a lei, não assina** (§ 3): precedente
   Slackbot + jurisprudência interna (bilhetes, invariante dos dois eixos).
4. **A ponte app→bolso usa deep link com payload** (§ 4.2) — infra pronta.
5. **O «/e no bolso» entra read-only e reduzido ou não entra** (§ 4.3) —
   fronteira da lei vigente; mais que isso é emenda, e emenda é do E.
6. **A coreografia composta é inédita → prova viva própria** (§ 4.3): o
   critério de sucesso é o reparo do Rick («agora eu sei onde estou»), sem
   número, sem escala.
7. **O dono tem direito ao mapa em cadência própria** (§ 5): controle do
   timing na mão dele, ponte onde o hábito mora, nunca tela de boas-vindas.

**O que este benchmark NÃO decide** (vai pro relay `17`, voz do E.): se a
entrevista (4.10) e o guia-da-casa são a mesma boca ou bocas irmãs · o que o
tour de voz nunca pode fazer além do que a lei já veda · o desenho do `/e` no
bolso dentro (ou fora) da fronteira do § 4.3.

---

*Benchmark 16 — 1 Ago 2026 · duas varreduras via agente, seladas no mesmo dia
em que o PS do Rick provou a tese: a casa tinha a boca e o dono não sabia.*
