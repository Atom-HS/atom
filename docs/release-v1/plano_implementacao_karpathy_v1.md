> ⚠️ **SUPERSEDED (23 Jul 2026):** este plano foi substituído pela spec aprovada
> [`docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md`](../specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md).
> Fica como contexto histórico; E0–E2 executados, E3–E7 reabsorvidos nas 9 fases da spec.

# Plano de implementação — Atom v1 (método Karpathy)

**Data:** 2026-06-11 · **Status:** v1 — plano executável
**Consolida:** `analise_mindmate-atom_v1.md` (linhagem + 28 vereditos) · `roadmap_release-atom_v1.md` (R0–R4) · `plano_r1_pos-marcacao.md` (marcação + casca viva D) · mockups (`cara-do-atom-teste-abc.html`)

---

## 0 · O método (adaptado de "A Recipe for Training Neural Networks")

Os princípios do Karpathy, traduzidos pra este produto:

1. **Become one with the data** — antes de escrever uma linha: viver no app atual, olhar os items reais, conhecer cada campo do schema. Não construir sobre suposição.
2. **End-to-end skeleton first** — o loop completo mais burro possível, deployado e usável no celular, ANTES de qualquer feature. Nunca construir em camadas horizontais ("primeiro todo o backend…").
3. **Overfit a single batch** — fazer funcionar perfeitamente pra **1 usuário (Rick), 1 dia real**, com dados reais. Se o loop não fecha pra um, não fecha pra mil.
4. **Don't trust — verify** — todo passo termina com algo **observável** (na tela, no banco, no soul log). Nada é "pronto" porque o código compilou.
5. **Complexify one piece at a time** — um slice por vez, cada um shippável. *"The surest way to fail is to skip steps."*
6. **Keep the leash short** — diffs pequenos, commits com body, CI verde como portão, Rick autoriza o merge. (Chat legisla · Code executa · Rick autoriza — já é a lei da casa.)

**A função de avaliação (o "loss"):** *o dia vivido.* Cada etapa é medida por uma pergunta só — **o Rick viveu o dia inteiro dentro do app, sem sair pra outra ferramenta e sem perder nada?** O soul log é a telemetria disso de graça: dia sem entradas = dia que o app falhou.

**Critério de release (o "ship"):** 7 dias consecutivos vividos no app · zero perda de dados · 1 dia inteiro offline sobrevivido · um estranho atravessa a Raiz e entende o app sem manual.

---

## ETAPA 0 · Become one with the data *(~2 dias)*

> Não se constrói sobre o que não se conhece. Metade já foi feita (análise de linhagem); falta a metade viva.

- [ ] **0.1** Rodar o atom-app local (`pnpm dev`), logar, navegar TODAS as 14 rotas — anotar o que quebra, o que está vazio, o que surpreende. *Verifica: lista escrita de achados.*
- [ ] **0.2** Olhar os dados reais: query na tabela `items` do Supabase do Atom — quantos items, de que types, em que stages, o que tem em `body`. *Verifica: snapshot do estado real documentado.*
- [ ] **0.3** Rodar a suíte atual (15 arquivos, 12 falhas pré-existentes conhecidas do commit `b8f2f1b`) — saber o que está verde/vermelho ANTES de mexer. *Verifica: baseline de testes registrada.*
- [ ] **0.4** Decisão pendente que trava o desenho: **o canal de escrita** — soul log local ou `body.soul` no tronco desde o v1? **Default do plano: tronco desde já**, via service do próprio app (mesmo caminho que o wrap usa — não viola "items read-only de fora"). Rick veta ou confirma. *Verifica: decisão selada em decisions/.*

## ETAPA 1 · Chão firme *(~3 dias — o "fixed seed")*

> Reprodutibilidade antes de tudo. No recipe: fixar seeds, eliminar aleatoriedade. Aqui: repo canônico, CI, deploy.

- [ ] **1.1** Migrar repo pra `ramalhoau` (lei vigente) — um repo, um branch canônico, deriva morta. *Verifica: clone fresco builda.*
- [ ] **1.2** CI resgatada do padrão atom-core: lint + typecheck + unit + build em toda PR. (O padrão, não os 150 testes.) *Verifica: PR de teste fica verde/vermelha corretamente.*
- [ ] **1.3** Deploy contínuo: main → Vercel → **instalado no celular do Rick**. *Verifica: Rick abre o app no telefone.*
- [ ] **1.4** Selar por escrito as mortes (streaks, gamificação, AI summary Gemini, wiki in-app) e adiamentos (colaboração→v2, Xero→v1.x) — decisions/ com data. *Verifica: arquivos existem; nunca mais se re-discute por acidente.*

## ETAPA 2 · Esqueleto ponta-a-ponta *(~1 semana — o "walking skeleton")*

> O loop inteiro, burro, funcionando: **acordar → chegada → ver o dia → capturar → fechar o dia → soul log no tronco.** Sem árvore, sem E., sem pipeline, sem beleza. UMA tela e dois overlays.

- [ ] **2.1** Face HOJE crua: arco estático + fixos (Google Calendar já conectado) + lista de items do dia. Reusa services existentes. *Verifica: o dia real do Rick aparece.*
- [ ] **2.2** Ritual de aurora mínimo: overlay → emoção (3 botões) → grava `body.soul` no tronco. *Verifica: row no Supabase com a emoção de hoje.*
- [ ] **2.3** Fechar o dia mínimo: emoção + semente → grava. *Verifica: soul log do dia tem abertura e fechamento.*
- [ ] **2.4** Boca única: input → `capture()` (pipeline-service existente) → item nasce como ponto (·). *Verifica: item capturado no celular aparece no banco.*
- [ ] **2.5** **🏁 Marco: Rick vive 1 dia inteiro no esqueleto.** Feio, mas completo. *Verifica: soul log de um dia real, ponta a ponta.*

## ETAPA 3 · Overfit no Rick *(~1–2 semanas — "make the loss go to zero for one batch")*

> Antes de generalizar: o loop do Rick, perfeito. Cada atrito do dia vivido vira o próximo commit. Ordem dos slices = ordem da dor, não do roadmap.

- [ ] **3.1** Protocolos do E. (manhã: água/vitamina/remédio) — sentinela sem-shame, "ainda dá". 3/3 grava no soul log. *Verifica: 3 manhãs seguidas usadas de verdade.*
- [ ] **3.2** Rituais imersivos (marcação 11 Jun): aurora tela cheia na primeira abertura + respiração; zênite tela própria. Cherry-pick da ESTRUTURA do RitualView (atom-core), conteúdo novo. *Verifica: Rick sente diferença entre tocar e viver — confirma no corpo.*
- [ ] **3.3** "O que cabe agora" v0: 2–3 opções **burras** (heurística: due hoje + leve + módulo variado). Baseline antes de inteligência — escolha grava no soul log. *Verifica: taxa de escolha > recusa numa semana.*
- [ ] **3.4** Listas simples na face @ ("compra leite") — resgate do List Engine, UI mínima. *Verifica: mercado de verdade feito com a lista.*
- [ ] **3.5** Journal como gesto próprio (marcação): tela zen de escrita longa, prompts resgatados do atom-core (passados pelo teste do Tom). *Verifica: 1 reflexão longa real escrita nela.*
- [ ] **3.6** **🏁 Marco: 5 dias consecutivos vividos — sem sair do app pro essencial.** *Se um slice não passa na verificação: para, conserta, não empilha o próximo (regra de ouro do recipe).*

## ETAPA 4 · As faces completas *(~2–3 semanas — "complexify gradually")*

> Só agora a estrutura grande — e cada face entra como slice independente, shippável.

- [ ] **4.1** Shell + navegação: cherry-pick sprint 1 (`SidebarNav`/`useBreakpoint` do histórico) → adaptar pra barra de faces. *Verifica: navegação fluida mobile + desktop.*
- [ ] **4.2** Face ÁRVORE v0: radial φ sobre items reais (8 módulos, real×ideal por contagem/peso) + folhas recentes. Síntese ainda HARDCODED-burra ("ramo X cheio · ramo Y pedindo" por regra simples). *Verifica: a árvore reflete uma semana real do Rick reconhecivelmente.*
- [ ] **4.3** Drill do ramo: projetos do ramo (+progress) → project sheet existente · items soltos · pessoas · raiz. *Verifica: chegar num projeto real em 2 toques.*
- [ ] **4.4** Face @ completa: conversa + bilhetes v0 (regras heurísticas, NÃO IA ainda — baseline burra primeiro) + cozinha do E. (triage existente exposta). *Verifica: 1 bilhete útil real por dia, zero bilhete com cheiro de cobrança.*
- [ ] **4.5** Face pipeline (a vista do construtor — marca ✗ do Rick): 7 colunas de estágio, leitura, sem os "7 toques". *Verifica: o que matura é visível; nada exige clique pra maturar.*
- [ ] **4.6** **Casca viva D** (hipótese do Rick): B até protocolo da manhã fechar → barra sobe (C) → crepúsculo recolhe. Gatilho instrumentado pra ajuste (protocolo 3/3 vs chegada+2h). *Verifica: 3 dias com a transição acontecendo no momento certo — se irritar, ajustar gatilho com o dado do soul log.*
- [ ] **4.7** **🏁 Marco: o app das 3+1 faces vivo, casca respirando com o dia.**

## ETAPA 5 · O E. encarna *(~2 semanas)*

> Inteligência SÓ depois da baseline burra provar o formato (regra: dumb baseline → depois o modelo).

- [ ] **5.1** Cherry-pick sprint 5 (`5022aae`): CompanionSheet + engine/companion como fundação técnica. *Verifica: sheet abre com o conteúdo v0 heurístico.*
- [ ] **5.2** Bilhetes com IA (edge function, mesmo padrão da triage): contexto = soul log + árvore + pipeline. Cada bilhete passa o shame-test por construção (prompt com a lei do Tom). *Verifica: Rick não consegue distinguir bilhete de cuidado de bilhete de máquina — e nenhum dói.*
- [ ] **5.3** "O que cabe agora" v1: capacidade × momento usando soul log (emoção da chegada modula a sugestão). *Verifica: dia "pesado" recebe sugestões mais leves — observável.*
- [ ] **5.4** Push VAPID (resgate atom-core, pg_cron): SÓ protocolos do E., app fechado. *Verifica: lembrete do remédio chega com app fechado; NENHUM outro push existe.*
- [ ] **5.5** **🏁 Marco: o E. é companhia — Rick sente falta dele num dia sem app.**

## ETAPA 6 · Robustez de rua *(~2 semanas — "regularize")*

- [ ] **6.1** PWA offline: fila IndexedDB + auto-sync (padrão atom-core reescrito no v2). *Verifica: avião — captura, protocolo e wrap offline; pousa e sincroniza, zero perda.*
- [ ] **6.2** Error tracking produção (edge function + tabela; sem dashboard cheio). *Verifica: erro forçado aparece logado.*
- [ ] **6.3** Export do journal/soul (MD/JSON) — soberania de dados. *Verifica: export abre legível.*
- [ ] **6.4** Suíte de confiança: testes nos 4 fluxos críticos (captura, ritual/soul, offline-sync, E.) + e2e dos rituais. *Verifica: CI bloqueia regressão real (testar quebrando de propósito).*
- [ ] **6.5** **🏁 Marco: 1 dia inteiro offline vivido sem medo.**

## ETAPA 7 · Release *(~1 semana — "squeeze the juice")*

- [ ] **7.1** Onboarding = Raiz doors (welcome simples; sem checklist gamificado — morto com selo). *Verifica: conta nova atravessa a Raiz em < 10 min.*
- [ ] **7.2** Landing com identidade v1.3 (decidir posicionamento open-source ANTES — questão 10 da agenda). *Verifica: copy passa shame·oráculo·chegada.*
- [ ] **7.3** Beta fechado: 2–3 estranhos de confiança, 1 semana, soul log deles = telemetria. *Verifica: 1 estranho vive 3 dias e o app fez sentido sem manual.*
- [ ] **7.4** **🏁 RELEASE.** Critério integral: 7 dias vividos · zero perda · offline ok · estranho entende.

---

## Sequência e dependências

```
E0 dados ─→ E1 chão ─→ E2 esqueleto ─→ E3 overfit ─→ E4 faces ─→ E5 E. ─→ E6 rua ─→ E7 release
                              ↑________________o dia vivido (loop diário de feedback)________________↑
```
- **Nada pula etapa.** Se E3 revela que o loop não fecha, E4 espera.
- E5.4 (push) e E6.1 (offline) são independentes entre si — paralelizáveis.
- **Total estimado: 10–12 semanas** de trabalho focado (consistente com o roadmap R0–R4, agora em passos verificáveis).

## Regras de operação (a coleira curta)

1. **Um slice = uma PR pequena** com body (o quê/por quê/impacto). Rick autoriza merge.
2. **Todo slice tem "Verifica:"** — se não dá pra observar, o slice está mal cortado: corta menor.
3. **App sempre deployável** — main quebrada é incidente, não rotina.
4. **Baseline burra antes de inteligência** — toda feature com IA nasce heurística primeiro (3.3→5.3, 4.4→5.2).
5. **O soul log é o sensor** — dia sem uso real = sinal de produto, investigar antes de codar mais.
6. **Mortes e adiamentos só com selo** — a lição nº 1 da linhagem: o que evapora sem decisão volta pra assombrar.
```
