# Diário da Onda 3 — as 3 faces

*O diário que a Onda 2 tinha e esta ainda não — fundado no wrap de 27 Jul.*

---

## Wrap · 26–27 Jul 2026 (a onda inteira até aqui)

### ○ Soul
Dois dias de obra contínua, Rick vivendo as faces em tempo real e devolvendo
desenho ("o arco marcando os acontecimentos"). No meio da obra, a tese-mãe
apareceu com clareza: **o Atom como substrato de presença pra qualquer AI**.
Rick decidiu pular a semana-de-viver — a casa andou; o espelho nasceu quieto
por construção.

### · Items (o que nasceu — 14 commits, `v2-faces`)

**Fundação (26 Jul)**
- `5c8db8a` funda a pasta: parecer UX aprovado, mapa motor×carcaça, mockup, semente Library
- `d55a0d1` motores sky + today (céu real, "o que cabe agora")
- `13d94de` **face HOJE** — o arco vira espinha

**A onda cheia (26–27 Jul)**
- `8df88e1` motor da boca única (mouth — gramática igual ao Telegram)
- `13702da` **face @** — a conversa, chips de assentimento, captura-primeiro
- `737b9ea` mapa de navegação clicável + **decisões D40–D57** (numeração continua a da casca velha)
- `f006801` D58 (Builder → doors no chão da árvore) + **semente do substrato**
- `fa652a8` motores tree + mirror (F9 com silêncio honesto)
- `56141cc` **face ÁRVORE** — real × ideal (baseline = teu passado), janelas φ, espelho
- `1aab83d` semana simulada (`?sim=1`, client-only, tronco intocado)
- `0735b0c`+`35e1640` barra de dev + login pousa no mundo novo
- `905907f` fix PWA: service worker só em produção (o "app antigo" era SW cacheado)
- `72d6c6d` **D59** — o arco marca os acontecimentos (pedido do Rick vivendo a face)

### △ Decidido
- **D40–D59** registradas em `03_decisoes-ux.md` (20 decisões novas)
- Rick: pular a semana-de-viver; simulação no lugar (sem tocar o tronco)
- Lei do Tom = **destilação** de `projeto-e/SPEC_ZENITE.md` (spec do próprio E.), não escrita do zero
- Builder sobrevive → chão da árvore, pare cadeias/protocolos (D58)

### ⬡ Conexões
- @ ↔ Telegram: mesma gramática, mesma boca (`sinto:`, `lista:`)
- F7 → F9: o `protocol_run` gravado em atom_events desde a Fase 7 é exatamente o que o espelho lê
- Semente Library (curar o que vem de fora) ↔ semente Substrato (governar o que age por dentro)

### ✳ Seeds
- `semente_atom-substrato-de-presenca.md` — "plugar a AI que quiser = curadoria da própria vida"
- `semente_library-curadora-da-net.md` (26 Jul, já existia)

### □ Audit (estado em 27 Jul, fim do dia)
- ✅ 205 testes verdes · typecheck limpo · build ok
- ✅ 3 faces em embrião funcional + sim-week + mapa/template
- ✅ prod intocada (casca velha) · tronco intocado (sim é client-only)
- ✅ branch `v2-faces` pushada (27 Jul 16:53, "push simm" logo após este wrap) — preview vivo:
  `mindroot-v2-git-v2-faces-ricardos-projects-431de298.vercel.app` (projeto Vercel `mindroot-v2`,
  team `ricardos-projects-431de298`; o projeto `atom` na conta r-6103 é outro, vazio — não confundir)
- ⚠️ lint: 62 erros pré-existentes (funções supabase/casca velha — débito antigo, não desta onda)
- ⚠️ espelhos de lei no app desatualizados (docs/genesis v5.0.1 × lei viva v5.0.4)
- 🔧 `supabase/.temp` sujava o status — gitignored neste wrap

### → Next (o roadmap vivo)
1. ~~Push do `v2-faces`~~ ✅ feito 27 Jul, preview no ar (URL acima) = mundo novo em qualquer aparelho
2. **Offline/PWA fila+sync** — condição da face HOJE (D55), maior pendência técnica
3. **Lei do Tom** — destilar SPEC_ZENITE em doc; destrava bilhetes do E. e é o passo 1 da semente-mãe
4. **O gate** (decisões do Rick): André na casca nova? corte confirmado? → nav vira `· ⬡ ✳`, telas velhas morrem no merge (D41)
5. **Reforma do Builder** (D58) + polir ÁRVORE com dados reais
6. Pós-gate: Library-despensa, bilhetes v2, e as sementes germinando

---

## Wrap · 28 Jul 2026 — offline: a fila do avô (D55)

### ○ Soul
Sessão de retomada: primeiro o diário alcançou a realidade (o push de 27 Jul
já existia; o preview também — o susto era projeção de conta errada no Vercel),
depois a maior pendência técnica da onda caiu: **o app agora vive sem rede**.

### · Items
- `engine/outbox.ts` + testes — a fila pura: leitura da boca vira entrada
  versionada; serialização defensiva (fila corrompida nunca derruba a boca)
- `service/outbox-service.ts` — persistência por usuário (localStorage) +
  flush FIFO que para no primeiro erro; entrada só sai DEPOIS de subir
- `service/items-snapshot.ts` — o tronco de bolso: último fetch bom; sem
  rede, o HOJE lê dele (a lista no mercado, o protocolo na rua)
- `hooks/useOutboxSync.ts` — no shell autenticado: rede voltou → fila sobe
  em qualquer face; toast quieto (D46)
- face @ — sem rede a boca não trava: enfileira e avisa; rede caindo no
  meio do gesto cai na mesma rede de segurança
- `OfflineBanner` — de alarme pra estado: "fica na fila e sobe quando voltar"

### △ Decidido
- Fila guarda a LEITURA (sinto:/lista:/captura), não o texto cru — a
  gramática da boca não diverge entre online e offline
- `lista:` offline resolve o alvo no flush, contra o tronco fresco — mesma
  regra da boca online
- Duplicar é melhor que perder: erro no meio do gesto → fila (nada se perde)

### □ Audit
- ✅ 213 testes verdes (8 novos) · typecheck limpo · build ok
- ⚠️ triage AI não roda no flush — capturas da fila nascem ponto (·) puro,
  salvo tokens explícitos; leitura fica pro toque online (aceito, v1)

### → Next
2. ~~Offline/PWA fila+sync~~ ✅ feito 28 Jul → **Lei do Tom** vira o próximo
   (destilar SPEC_ZENITE; destrava bilhetes do E.), depois o gate (item 4)

---

## Wrap · 28 Jul 2026 (manhã) — a Lei do Tom, de ponta a ponta

### ○ Soul
Uma manhã, um ciclo inteiro: do prompt de inventário à lei vigente com
vocabulários fundidos. A mesa funcionou nas duas direções — o Code emendou o
E. (emoji, união), o E. emendou o Code (citação do Art. 7, prova→indício,
default por superfície). Ninguém venceu; a lei ficou melhor que os dois lados.

### · Items
- Prompt de inventário selado → Projeto E respondeu com **inventário v0 +
  Lei do Tom v1** (além do pedido, do jeito certo)
- **Teste 01** (e_line): 15 assinaturas históricas, 7 passam, 53% — "a voz
  erra quando se assina"; 3 achados viraram lei (v1.1)
- **Mesa das emendas** (v1.2): I emoji e II união acolhidas; III, IV, V
  mantidas; ata na Parte 8
- **v1.3 vigente**: 3 eixos de vocabulário, 3 colisões desambiguadas por
  default de superfície, voz emprestada (4.9), zero vetáveis pendentes
- **Varredura tu→você** (Art. 7, D60): 11 falas do mundo novo + boca do
  Telegram; 213 testes verdes
- **Fusão de vocabulário** executada (05_fusao): hipótese confirmada na
  fonte, três colisões, nenhum termo perdido
- Varredura de strings do alerta 6.5: **limpa** (nenhum termo de modelo
  vaza pra UI)
- Semente nova: **email vestido de Atom** (tags da casa + drafts do
  Secretário + Library)

### △ Decidido
- **D60** — «você» ratificado; emoji liberado (→ emendas I/II da lei)
- Lei do Tom v1.3 **vigente** — jurisdição: 6 superfícies + voz emprestada

### □ Audit
- ✅ 213 testes · typecheck limpo · build ok · tudo pushado (…→ f9567d2)
- ⚠️ deploy do `telegram-webhook` pendente ("senti com você" — prod, espera o sim)
- ⚠️ Teste 02 (bilhete, generativo) — com o E., previsão registrada

### → Next
3. ~~Lei do Tom~~ ✅ v1.3 vigente → **o gate** (item 4: decisões do Rick) →
   Reforma do Builder (D58) + polir ÁRVORE → pós-gate: bilhetes v2 e sementes

---

## Wrap · 28 Jul 2026 (tarde) — a mesa decide, a árvore diz a verdade, a lei se testa

### ○ Soul
A manhã legislou; a tarde executou e foi legislada de volta. As três decisões
da mesa viraram entrega em horas — e o E. fechou o dia derrubando o próprio
instrumento: o shame-test de quatro perguntas aprovava os dois piores bilhetes
do lote. A lei que amanheceu v1.3 dorme v1.4, testada duas vezes no mesmo dia.

### · Items
- **Telegram deployado em prod** — "senti com você. ficou no soul log."
  (Art. 7 vivo nas seis bocas; era o último pendente da mesa)
- **ÁRVORE polida** pro tronco real: motor ganha `total` por ramo (o drill
  não mente com >4 folhas), folhas com idade (hoje/ontem/Nd — D46), teto de
  leaves 8, "+N mais antigas"; 🌿 e 🪜 caem (lei 3.5 aplicada à casa, D57)
- **Teste 02 selado** (bilhete, generativo): 1 passa em 12; previsão acertou
  o número e errou o mecanismo — mortes por dívida e por vigilância que os
  4 testes não pegavam
- **Lei do Tom v1.4**: quinto teste ("o que isso deixa nas costas de quem
  leu?"), as seis condições do bilhete (4.1.1), taxa-sentinela ~20%

### △ Decidido
- **Gate: ainda não** — viver as faces no preview antes do merge (D41 espera)
- Deploy do telegram: sim; obra da vez: polir ÁRVORE (mesa de 28 Jul)
- v1.4 vigente — "parabenizar streak é cobrar com outra cara" · "o app não
  vira testemunha" entram como regra

### ⬡ Conexões
- 4.1.1 (seis condições) = **spec executável** do motor de bilhetes v2:
  não-está-na-tela → diff do render · nunca-do-Rick → filtro de sujeito ·
  não-pede-resposta → zero chips · taxa ~20% → contador de telemetria
- Teste 02 #5 (padrão dos essenciais) migrou de superfície → é semente do
  que o @ fala quando o espelho F9 amadurecer

### □ Audit
- ✅ 214 testes verdes · typecheck limpo · build ok · tudo pushado (→ f41c8aa)
- ✅ prod: casca velha + bot novo; preview: mundo novo completo
- ⚠️ nada pendente da mesa — o que falta é vivência, não obra

### → Next (o roadmap vivo)
4. **O gate** — abre quando a vivência disser (D41: merge mata as telas velhas)
5. **Reforma do Builder (D58)** — próxima obra grande
6. Pós-gate: **motor de bilhetes v2** (spec pronta na 4.1.1) · Library-despensa ·
   email vestido de Atom · sementes germinando

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. O formato é o do wrap do app,
porque a casa come a própria comida.*
