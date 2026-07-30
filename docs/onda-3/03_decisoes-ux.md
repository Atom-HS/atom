# Decisões de UX — Onda 3 (D40–D78)

**Data:** 2026-07-27 · **Fonte:** `00_parecer-ux.md` (aprovado pelo Rick em
26 Jul) destilado em decisões numeradas · **Par visual:** `03_mapa-navegacao.html`
(o template + mapa clicável).

A numeração **continua** a série da casca velha (D0–D39 em
`docs/wireframes/prompt-continuacao-wireframes.md`) — não recomeça. As que
sobrevivem de lá seguem valendo onde não conflitam; em conflito, a Onda 3 vence
(a casca velha morre por merge, D41).

## Herdadas que seguem de pé

- **D0** — progressive disclosure universal: wireframe = blueprint, não pixel final.
- Geometrias `· — △ □ ⬠ ⬡ ○` (7 estágios Genesis) como vocabulário visual.
- Períodos do dia (aurora/zênite/crepúsculo) como tom — agora via céu real, não paleta trocada.
- Wrap = 7 passos = 7 estágios, com animação geométrica no commit.
- Linguagem livre no soul ("meio bosta" é válido — Marco Zero §5).

## As novas (Onda 3)

| # | Decisão | Raiz no parecer |
|---|---------|-----------------|
| **D40** | **Só 3 lugares** — HOJE, ÁRVORE, @. Todo o resto é gesto ou camada: puxa, toca, abre, volta. Nada some; tudo para de gritar. | essência |
| **D41** | **Morte por merge** — cada face que entra mata a tela velha correspondente no mesmo merge. Substituição, não convivência. Nav vira `· ⬡ ✳` no gate. | ordem §5 |
| **D42** | **Aurora = topo do HOJE** — o rito é rito por ser a primeira coisa, não por bloquear. Morre o overlay-modal. | HOJE |
| **D43** | **Zênite = toque no arco** — bottom-sheet; nunca tela. | HOJE |
| **D44** | **Wrap se dissolve no HOJE mantendo a cerimônia dos 7 passos** — a rota morre, o rito não. | HOJE |
| **D45** | **UMA sugestão** ("o que cabe agora") + "me dá outra" circular. Motor simples já (peso + período + fixos livres); não esperar o E. ficar esperto. Ansiedade odeia escolha. | princípio 1 |
| **D46** | **Todo número visível é estado, nunca julgamento** — "2 de 5 abertos", jamais "40% atrasado". Shame mata, convite sustenta. | princípio 2 |
| **D47** | **Céu no horário real** — sol nasce/põe de verdade, lua com fase. Misticismo discreto; o arco é a espinha do HOJE. | HOJE |
| **D48** | **Pipeline, Graph e Analytics morrem como telas** — maturação se vê no galho (`· → ○`), não se gerencia em funil. | ÁRVORE |
| **D49** | **F9 = espelho que nomeia padrões COM saída** ("3 manhãs ansiosas → tarde leve depois do protocolo"), nunca diagnóstico sem caminho. Nomear acalma; rotular sem saída é ruminação. | ÁRVORE |
| **D50** | **Raiz = o chão da árvore** — drill embaixo do tronco. Doors de onboarding ficam; % vira estado quieto, nunca meta; completa-se on-demand. HealthBar velha vira esta leitura + passo audit do wrap. | ÁRVORE |
| **D51** | **Library = despensa, não aba** — acesso por drill do ramo, busca, e contextual (cadeia → workout, protocolo → receita). Horizonte: curadora da net (semente registrada). | casa |
| **D52** | **Uma boca só (@)** — a fricção de decidir "onde põe" no momento da ideia é o que mata captura. Decide-se depois, por chips de assentimento. Triage invisível na conversa, nas 3 faixas do Genesis §3.1. Captura-primeiro: o ponto nasce antes da leitura da AI. | @ |
| **D53** | **`sinto:` = boca da alma** — mesma gramática em todo aparelho (app @ e Telegram = mesma face). `lista:` = despensa. Bilhetes do E. = v2, só com a lei do Tom escrita. | @ |
| **D54** | **Search = gesto** (puxar pra baixo; v2: buscar = perguntar ao @) · **Settings/conectores = pull discreto** (sheet). Nenhum dos dois é aba. | casa |
| **D55** | **Offline (PWA) = condição da face HOJE** — a lista no mercado, o protocolo na rua. Padrão do avô: fila + sync. | casa |
| **D56** | **Push = só voz do E.** (protocolos que acordaram), nunca cobrança. Email = boca, nunca lugar (o app jamais vira cliente de email). | casa |
| **D57** | **Mundo único, escuro, deliberado** — o app à luz de vela. Dourado é raro e sagrado (rito, sentinela, caminho convidado); módulos dessaturados; mono marca, sans fala, itálico acolhe. Tokens no `03_mapa-navegacao.html` §1. | mockup |
| **D58** | **Builder = a entrevista das doors** — o Routine Builder (Abr, `features/raiz/`) sobrevive e muda de casa: vive no chão da árvore (drill da raiz, D50), on-demand. Reforma junto com a face ÁRVORE: as respostas passam a parir **cadeias (`routine`) e protocolos (`◈`)**, não só hábitos soltos — hoje ele é pré-F6 e alimenta o motor velho. | Rick 27 Jul |
| **D59** | **O arco marca os acontecimentos** — o que nasceu ou selou hoje pousa no arco como ponto na cor do módulo, na hora em que aconteceu. O dia se vê caminhando; estado, nunca cobrança (D46). | Rick 27 Jul |
| **D60** | **Lei do Tom — primeiros vetos do Rick:** Art. 7 ratificado (**«você», nunca «tu»**) — as falas em tu da casca nova entram na fila de correção antes do gate; proibição de emoji **vetada** — emoji permitido. Demais vetáveis (exclamação, raridade do bilhete, push 3 casos, precedência conversa×SPEC) em análise. | Rick 28 Jul |
| **D61** | **Indigo é a cor do E.** — quando algo fala em indigo (bolhas do @, espelho F9, janela de tempo da ÁRVORE), é o E. presente, não a casa. O dourado segue sendo da casa (D57); o roxo saiu de tudo que não é a voz dele (a teia virou dourada na obra 4). Ratificada no teste de usabilidade de 28 Jul. | Rick 29 Jul |
| **D62** | **O crivo do topo de mercado (lei)** — toda função executiva do app tem que funcionar no nível do melhor software da categoria; nossas inovações nascem POR CIMA dessa base, nunca no lugar dela ("inovação com base ruim não serve"). Na prática: toda obra abre com benchmark (pesquisa de mercado + evidência) antes do código, e o crivo se aplica face a face — o projetos como bom software de projetos, a presença, o cofre, e assim vai. | Rick 29 Jul |
| **D63** | **Cofre v1 no chão da árvore** — a Raiz lê e mostra, quieto: validades (`deadline` com antecedência por tipo — passaporte 9m, cartão 2m — e gesto de renovação) e ausências (por **evento significativo**, nunca `updated_at` — benchmark `09`). Leitura-só, zero schema novo. O cofre completo (cadastro guiado, extração de data, espelho digital) segue semente. | Rick 29 Jul |
| **D64** | **Builder pare cadeias e protocolos** — as respostas da entrevista geram `routine` (chain de elos) e `protocol` (when/steps) de verdade, nascendo no inbox com assentimento no mini-wrap (maturação sequencial, nunca pula). Reescrita das perguntas em capítulos-gaveta retomáveis (gabarito no benchmark `09`) é obra de voz com o E., pós-motor. | Rick 29 Jul |
| **D65** | **MindMate é patrimônio do chão** — o easter egg (gatilho "mindmate" em texto livre) sobrevive a toda reforma da Raiz. O coração que o Rick lembrou de cabeça meses depois. | Rick 29 Jul |
| **D66** | **A válvula do cofre** — validade/ausência ganham UM canal assíncrono raro: digest na voz do E. pelo Telegram, só quando há algo vencendo ou ausente. Estado, nunca alarme (D46) — mas "nunca avisa" mata o cofre (benchmark `09`: Life OS morre quieto). | Rick 29 Jul |
| **D67** | **O Atom é a lente, não o lugar** — D56 generalizada pra TODOS os conectores. Conector = mão dupla: **ida** (o Genesis legisla pra fora — labels, calendários, estruturas na taxonomia da casa dentro do app externo, como no experimento do Secretário) + **volta** (refletir só o sinal — estrela, hora marcada, vencimento — nunca o volume). O Atom jamais vira cliente de email, calendário completo ou gerenciador de arquivos: a pessoa vive onde sempre viveu, o Atom enxerga através da bagunça. Crivo D62 por conector: a régua é "melhor LENTE sobre X", nunca "melhor cliente de X". Semente: `semente_atom-a-lente.md`. | Rick 29 Jul |
| **D68** | **A ida é estrutural e reversível** — o conector cria taxonomia no app externo, NUNCA move nem esconde conteúdo. Zero escopo restricted novo (`gmail.modify` banido na v1); namespace assinado `Atom/…`; preview + assentimento antes de criar; delete lá fora é comando (desativa o braço), nunca recriação silenciosa; desligar o conector desfaz a estrutura. **Ida v1 = Gmail + Calendar juntos; a taxonomia projetada = os 9 domínios da vida** (`config/raiz.ts`), a língua da vida adulta legível dentro do Gmail. Benchmark `10` §3: toda revolta documentada vem de mover, nunca de criar. | Rick 29 Jul |
| **D69** | **A heurística nunca decide quieta** — toda leitura automática de conector (recorrente→`ritual`, único→`task`) é sugestão visível: o chip de assentimento no inbox mostra a leitura e deixa trocar (ritual ⇄ task) num toque. Benchmark `10`: sugerir-e-aprovar 73% de adesão vs 31% da automação cega (Morgen). Cadência da volta: manual agora; cron nasce junto com o digest D66 (uma rotina servindo os dois). | Rick 29 Jul |
| **D70** | **Item de conector não-assentido aparece nos fixos do HOJE** — o compromisso existe no céu independente da triage; esconder faria o hoje mentir. *(era DP-A, default do roteiro do mago, rodando desde 30 Jul de madrugada)* | Rick 30 Jul |
| **D71** | **«Pular» adia pro fim da fila, dentro da sessão** — sem snooze de calendário: snooze é cobrança adiada com outra cara. *(era DP-B)* | Rick 30 Jul |
| **D72** | **Assentimento por série** — um gesto sela o ritual semanal inteiro; instância nova herda o selo pelo portão 1→2 (inbox obrigatório de pé). Guardada por `series-espelho`. *(era DP-C)* | Rick 30 Jul |
| **D73** | **O assentimento é camada, não lugar** — puxador no HOJE + sheet (D40 aplicada ao rito da triage, já que `/pipeline` morreu). *(era DP-D)* | Rick 30 Jul |
| **D74** | **`/projects` vive como camada, morre como tela** — a pill do HOJE abre a sheet do projeto; a tela morreu no gate. Confirmada por vivência (dissecação 04) e mercado (benchmark `16`). *(era DP-E)* | Rick 30 Jul |
| **D75** | **O raro tem memória por mudança de estado** — o digest só repete quando a BANDA muda (113→112 dias cala; 8→7 fala; ausência por degrau de 90d). Não é prazo, é espelho. Guardada por `vault-espelho`. *(era DP-F)* | Rick 30 Jul |
| **D76** | **Item já nascido não se re-processa** — conserto de mapper, tag ou heurística vale pro parto novo; o que nasceu fica como nasceu. História é história; se a busca precisar aceitar as duas formas, isso é obra própria. *(era DP-H, precedente honrado desde a cirurgia)* | Rick 30 Jul |
| **D77** | **A sheet mostra só o que a página provou que importa** — presença, próximo como convite, filhos, quietude; zero chrome de gerenciador (criar/filtrar/agrupar morreram com a tela). *(era DP-I)* | Rick 30 Jul |
| **D78** | **A taxonomy projetada fica em ASCII** (`Atom/saude`) — renomear lá fora faria o diff ler «sumiu» e desligar braços (D68: delete lá fora é comando). Acento no Gmail, se um dia, é obra deliberada de contrato (rename pelo id), nunca varredura de tom. *(era DP-J)* | Rick 30 Jul |

## Na mesa (não ratificada — em observação vivida)

- **DP-G** — a porta da escada na ÁRVORE (puxador quieto «…espera significado
  · significar», default da opção *a* do gate §3, 100% reversível). Rick
  decidiu em 30 Jul: **viver uma semana antes de ratificar** — se o puxador
  servir no uso real, vira D79 (~6 Ago).

## A lei do desenho (nomeada pelo Rick, rege todas)

> **Simples na superfície** — resolve a ansiedade do dia; **fundo inteiro
> atrás**, pra quem e quando quiser. Cresce preservando presença.

## Como usar este par

1. Tela nova? Abre `03_mapa-navegacao.html`: replica os tokens (§1) e o kit (§2),
   e encaixa a tela no mapa (§3) — se ela não cabe no mapa, provavelmente não
   devia ser tela (D40).
2. Decisão nova de UX? Ganha número aqui (D58+), com raiz declarada.
3. Este par é o baseline pra atualizar o Claude design (Project no Claude.ai) —
   subida é gesto do Rick.
