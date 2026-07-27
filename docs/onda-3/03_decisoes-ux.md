# Decisões de UX — Onda 3 (D40–D57)

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
