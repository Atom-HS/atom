# Benchmark 02 (Onda 4) — o retorno: «o que mudou»

**Data:** 31 Jul 2026 · **Gate:** D62 (toda obra abre com benchmark) · **Par:**
`01_parecer-e.md` + `01a_errata-parecer-e.md` — os dois insumos da spec; nenhum
manda sozinho.
**Método:** pesquisa de mercado via agente (fontes citadas inline). Força da
evidência marcada: **[F]** = oficial/acadêmico/análise séria · **[M]** = jornalismo
tech, docs de terceiros · **[f]** = opinião/anedota.
**As duas perguntas que este documento responde:** (1) o topo de mercado amostra
o passado por **intervalo** desde a última visita ou por **densidade
decrescente**? (errata § 4) · (2) o retorno é **marca** que se puxa ou **boca**
que fala? (parecer § 1.3, que o benchmark podia derrubar)

---

## 1 · As três morfologias do mercado

O mercado não tem duas formas de contar «o que mudou» — tem três:

| # | Morfologia | Quem faz | Reputação |
|---|---|---|---|
| a | **Marca/inbox que o usuário puxa** | GitHub notifications, Linear Inbox, Notion Updates, Basecamp «Hey!» | a forma padrão do trabalho; criticada só pelo *conteúdo* (falta priorização), nunca pela forma |
| b | **Fala não solicitada por evento** | Duolingo push, Slack ping, badges vermelhos | a mais criticada e a mais documentadamente danosa (§ 3) |
| c | **Fala agendada e consolidada, que respeita a ausência** | Basecamp catch-up email, Slack AI Recap diário, o «summary email tomorrow morning» do JOMO de Fried | o meio-termo calmo, defendido por escrito pela escola calm-software |

**[F]** Basecamp: notificações agrupadas «to keep your inbox calm»; badge do Hey!
é **opt-in entre ponto discreto e contagem** — o número é escolha, não default
([help oficial](https://3.basecamp-help.com/article/86-how-notifications-work)).
**[F]** Fried/DHH, *It Doesn't Have to Be Crazy at Work*: «Calm is asynchronous
first, real-time second» — e a defesa explícita do resumo único de manhã contra o
drip-drip-drip ([quotes](https://www.goodreads.com/work/quotes/60452039-it-doesn-t-have-to-be-crazy-at-work)).
**[F]** Twist/Doist: sem indicadores de presença de propósito — «presence
indicators become expectation tools»; o usuário decide quando se atualizar
([TechCrunch](https://techcrunch.com/2021/10/12/doist-redesigns-twist-the-slack-alternative-focused-on-async-work/)).

**O que a casa já tem:** a morfologia (c) está viva — o digest das 07:15 (D66,
D75). A (a) é exatamente a marca do parecer § 1.3. A (b) é o que D80 barra.
**A onda não precisa inventar forma nenhuma: precisa completar a (a).**

## 2 · A pergunta da amostragem — resposta à errata § 4

**Intervalo domina o mercado inteiro.** Slack AI Recap cobre «however many days
you were gone» **[F]** ([help](https://slack.com/help/articles/25076892548883-Guide-to-AI-features-in-Slack));
Basecamp catch-up é «anything you missed while you were away» **[M]**; a linha
vermelha do Slack, os unreads de GitHub/Linear/Notion — tudo é «desde o último
ponto de leitura», cronológico. O refinamento existente é **relevância dentro do
intervalo**: o Twitter de 2015 («a recap of some of the top Tweets you might have
missed», a primeira feature não-cronológica deles **[F]**,
[blog oficial](https://blog.x.com/official/en_us/a/2015/while-you-were-away-0.html))
e o Slack Recap com resumo AI — compressão adaptativa, mas uniforme dentro da
janela.

**Densidade decrescente (recente denso, distante esparso) não foi encontrada como
padrão de UI em nenhum produto pesquisado.** O conceito existe formalizado só como
técnica de engenharia — «forward decay» (Cormode et al.) para telemetria e
streaming **[F]** ([paper](https://dimacs.rutgers.edu/~graham/pubs/papers/fwddecay.pdf))
— nunca como superfície de retorno. *(Ausência em produtos é inferência da
pesquisa, não prova.)*

**Veredito da pergunta:** φ é **inovação nossa por cima da base — não é a base.**
E a consequência D62 é dura: inovação sem benchmark externo exige prova viva
própria. O lookback φ (§D5) embarca **depois** da base (a marca) existir e ser
vivida — nunca como primeiro gesto da obra. Nota a favor do desenho da casa: o
mercado indexa tudo no olhar do usuário («desde seu último login») — exatamente o
que D83 proíbe. A amostragem φ é indexada na forma da memória, não na ausência do
Rick; é a única das abordagens que obedece D83 por construção.

## 3 · A evidência de dano — o chão dos vetos

- **Badge vermelho como cobrança:** thread inteira no HN sobre «Slack red unread
  chat callouts are anxiety inducing» **[M]**
  ([HN](https://news.ycombinator.com/item?id=31520779)); artigos citam o badge
  como segundo elemento mais ansiogênico do Slack, mecanismo «open loop» **[f→M]**.
- **Streak/culpa como anti-padrão documentado:** as notificações de perda de
  streak do Duolingo renderam ~3% de retenção ao custo de «ansiedade genuína e
  aprendizado performativo»; usuários se sentem «vigiados e julgados» **[M]**
  ([análise](https://opinionsandconditions.substack.com/p/duolingo-owl-dark-patterns-digital-guilt)).
  É a D46 confirmada por mercado: o número que julga expulsa.
- **Um deslize vira desistência:** o «abstinence violation effect» (Marlatt &
  Gordon) **[F]** — quando o sistema trata a falha como quebra, a pessoa abandona
  tudo; ~70% de descontinuação em 100 dias em apps de lifestyle **[F]**
  ([scoping review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11694054/)).
- **Usuário em sofrimento:** «for a user managing depression, a broken streak can
  exacerbate the very feelings the app aims to alleviate» **[F]**
  ([Smashing Magazine](https://www.smashingmagazine.com/2026/07/designing-distressed-users-mental-health-apps-ui/)).
- **E o outro lado do espectro não reclama:** nenhuma fonte crítica um produto
  por ser «quieto demais». *(Ausência de evidência, não evidência de ausência —
  mas o risco assimétrico é claro.)*

**Sustenta na íntegra: D80 (teto), D81/D82 (semente não volta por cadência nem
inferência), D83 (a ausência não é assunto), D84 (frequência pretendida é a régua
da cobrança futura).**

## 4 · Os precedentes de acolhimento — quem migrou de cobrança pra convite

- **Animal Crossing** é o caso documentado de migração: o New Leaf **punia** o
  retorno (baratas, vizinhos ressentidos — «guilt tripping» relatado); o update
  3.0 do New Horizons inverteu — Resetti, o personagem da culpa, «agora dá
  permissão para recomeçar sem vergonha», «an act of forgiveness built into the
  game's very mechanics» **[M]**
  ([GameRant](https://gamerant.com/animal-crossing-new-horizons-3-0-update-island-return-forgiveness/)).
- **Headspace:** streak como «encouragement rather than judgment»; texto oficial —
  «We all miss days, and that's okay… neither does that number on the screen have
  the capacity to judge us» **[F]**
  ([Headspace](https://www.headspace.com/articles/building-a-meditation-practice));
  o «Maybe Later» sempre visível, dismiss guilt-free **[M]**.
- **Re-onboarding ≠ onboarding:** o primeiro retorno após um gap é gatilho
  distinto — banner contextual não-bloqueante, nunca tela de boas-vindas; o
  timing errado gera 38% de dismiss em <4s **[M]**
  ([Chameleon](https://www.chameleon.io/blog/onboarding-ux-patterns)).
  Rima com D42: o rito é rito por ser a primeira coisa, não por bloquear.

## 5 · O recuo do Basecamp — o alerta contra consolidação total

O único recuo público documentado numa superfície de «o que mudou»: o Basecamp 3
unificou três inboxes no «Hey!» («Don't we have enough inboxes in our lives
already?») e **teve que devolver** o menu de Pings quando o uso real exigiu
**[F]** ([saída](https://medium.com/signal-v-noise/basecamp-3-redesign-phase-1-new-nav-and-a-unified-hey-inbox-4faed81ef137)
· [volta](https://signalvnoise.com/svn3/the-pings-menu-is-back/)).

Lição pra casa: **categorias de retorno distintas podem precisar de portas
distintas.** Sustenta a fronteira do parecer § 4.2 (digest dono de quantidades ·
bilhete dono de eventos · marca dona da mudança) — fundir as três numa
«central de novidades» é o erro que até a escola calm cometeu uma vez.

## 6 · O crivo D62 aplicado — veredito

**A base do topo de mercado** = (a) inbox/marca que se puxa, com priorização
dentro + (c) fala agendada consolidada. A crítica recorrente do mercado não é à
forma — é à **ausência de modelo de atenção** dentro dela (GitHub e Linear
criticados pelo mesmo motivo: inbox sem priorização; Duolingo pelo oposto:
priorização a serviço da métrica) **[M]**
([Linear crítica](https://medium.com/@arjundesigns/linears-notification-system-treats-attention-as-abundant-it-isn-t-646f5f44b8ae)).

| Camada | Status na casa | O que falta |
|---|---|---|
| (c) digest agendado | **vivo** (D66/D75, 07:15) | nada — já é topo de categoria em contenção |
| (a) marca que se puxa | parcial (quietude na sheet, fixos no céu) | **a marca de mudança** — o § 1.3 do parecer, agora confirmado por mercado |
| priorização dentro da marca | — | o filtro do § 1.4 («muda o que o Rick faria?») é exatamente o «modelo de atenção» cuja falta o mercado critica |
| (b) fala por evento | barrada (D80) + 3 gatilhos curados de bilhete | manter raro — a curadoria de 75% do parecer é o oposto do inbox sem modelo |
| φ (densidade) | lei interna (§D5), sem código | **sem benchmark externo — prova viva própria, depois da base** |

**As duas respostas, seladas:**
1. **Intervalo × densidade:** o mercado é intervalo; densidade decrescente não
   existe como UI. **φ é inovação por cima da base** — embarca por último, com
   medição própria, e é a única amostragem que obedece D83 por construção.
2. **Marca × boca:** o § 1.3 do parecer **fica de pé, reforçado** — o mercado
   convergiu na marca-que-se-puxa, a fala por evento é a forma documentadamente
   danosa, e a casa já tem a terceira morfologia viva no digest. Com o refinamento
   do § 5: as três portas (marca · digest · bilhete) não se fundem.

**O que vai pra spec:** marca de mudança no HOJE/ÁRVORE (estado, dourado,
puxável → leitura indigo no @) · filtro § 1.4 como modelo de atenção · bilhetes
com os 3 gatilhos curados · tabela degrau→boca antes de qualquer espiral ·
lookback φ como fase própria, pós-base, com prova viva.

---

*Benchmark 02 — Onda 4 · 31 Jul 2026 · pesquisa via agente, fontes inline.*
*Os dois insumos existem. A spec pode nascer.*
