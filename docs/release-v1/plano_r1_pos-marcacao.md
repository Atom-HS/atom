# Plano R1 — pós-marcação do WIREFRAME_V2

**Data:** 2026-06-11 · sessão de marcação conduzida (protocolo do próprio wireframe)
**Par:** `roadmap_release-atom_v1.md` (R1 = a milestone-coração) · mockup `cara-do-atom.html`

---

## A marcação registrada (devolvida pelo Rick)

| Bloco | Marca | O que significa |
|---|---|---|
| Estrutura 5 faces | **testar 3 versões** | não decide no papel — prototipa A/B/C e vive |
| Zênite vira toque | **✗** | zênite merece momento maior — tela própria, imersiva |
| Aurora | **tela-ritual de manhã** | primeira abertura do dia = ritual em tela cheia, antes do HOJE |
| "O que cabe agora" 1 só | **✗** | 2–3 opções visíveis, tu escolhes |
| Pessoas/raiz em drill-down | **?** | discutir |
| Maturação vira leitura (kanban morre) | **✗** | **a vista de pipeline/estágios sobrevive** em algum lugar |
| Completude/ribbon | **nos dois / ?** | árvore E fechar-do-dia — calibrar |
| Journal/caligrafia | **gesto próprio** | escrever longo é lugar íntimo, separado da conversa do @ |
| Bocas morre, @ tria | **✓** | uma boca só; colar lista = o @ separa |
| O dia escreve onde | **?** | local × tronco desde v1 — discutir o canal |
| Andre | **só meu por ora** | single-user no v1 **confirmado** — sela colaboração no v2 |

**Leitura de conjunto [O]:** as marcas apontam numa direção clara — **os rituais são o coração, não decoração**. Aurora e zênite imersivos = o RitualView do atom-core volta vingado (full-screen, perguntas por período), agora com soul log no tronco conceitual. E a estrutura se decide vivendo, não desenhando.

---

## As 3 versões da estrutura (pra testar, não escolher no papel)

**A — "3 faces"** (WIREFRAME_V2 puro, o mockup atual)
Nav: `·hoje` `⬡árvore` `✳@`. Rituais imersivos por cima. Pipeline vive como drill (dentro do @ ou da árvore).

**B — "o dia é o app"**
Abre no ritual da manhã → HOJE é a única tela. Árvore = puxar pra cima (gesto); @ = botão flutuante. Sem barra de navegação. Presença máxima, estrutura mínima.

**C — "4 faces"**
`·hoje` `⬡árvore` `✳@` `△pipeline`. Honra o ✗ da maturação: o kanban de estágios sobrevive como face de trabalho — pra quem quer VER o que matura (o lado construtor do Rick).

**D — "a casca viva"** *(hipótese do Rick, 11 Jun — favorita)*
A estrutura acompanha o arco do dia: **B até fechar o ritual/protocolo da manhã** (só presença, sem barra) → **a casa abre em C** (barra com 4 faces, pipeline incluso) → **no crepúsculo, fechar o dia recolhe a casa** de volta pra B. A estrutura não é configuração — é resposta ao estado do dia. Implementada no mockup `cara-do-atom-teste-abc.html` (versão default): protocolo 3/3 → barra sobe com toast "a manhã fechou — a casa abriu"; fechar o dia → "a casa se recolhe".

*Teste: viver os 4 modos no mockup (seletor A·B·C·D); a D é a candidata a bater — confirmar no corpo, alguns dias.*

---

## O que as marcas já decidem (vira código no R1)

1. **Ritual de aurora em tela cheia na primeira abertura do dia** — respiração + chegada + emoção → soul log. (Padrão imersivo: resgatar a estrutura do RitualView do atom-core, conteúdo novo.)
2. **Zênite com tela própria** — pausa imersiva, não toque: respiração curta + "como está sendo?" + emoção.
3. **Fluido com 2–3 opções** — motor sugere, humano escolhe; escolha também vai pro soul log.
4. **Journal como gesto próprio** — modo/tela de escrita longa (zen, sem conversa), separado da boca do @. *(Resgatar do atom-core: prompts guiados + design zen do Journal — item 11 da matriz, já marcado resgatar.)*
5. **Boca única com triagem do @** — colar lista → itens separados (a triage IA do atom-app já faz isso por trás).
6. **Single-user v1 selado** — colaboração oficialmente v2 (questão 2 da agenda: respondida via Andre).

## O que fica aberto (próxima conversa, não bloqueia)

- **Pessoas/raiz**: drill-down do ramo ou view própria? (testar na versão A vs C)
- **Completude**: dose na árvore × dose no fechar-do-dia
- **O canal de escrita**: soul log local por ora ou `body.soul` no tronco desde o v1? **[O]** Minha leitura: o caminho legal já existe — edge function do próprio app (como o wrap) escreve no tronco sem violar o freio "items read-only de fora". Vale decidir cedo: migrar soul log local→tronco depois é chato.

---

## O mapa de endereços — onde cada feature de hoje mora nas 3 faces

Pergunta do Rick (11 Jun): "onde ficam as outras features tipo projetos e tal?" — Resposta: **nada se perde; as 14 rotas viram drill-downs.** Faces são a superfície; profundidade continua existindo.

| Rota/feature de hoje | Endereço novo | Profundidade |
|---|---|---|
| `/home` | **vira o próprio HOJE** | superfície |
| `/projects` | **ÁRVORE → ramo → projetos do ramo** (projeto = galho; progress no lugar) | toca ramo → lista; toca projeto → sheet completa (a de hoje, intacta) |
| `/projects/:id` (sheet) | continua existindo — abre do drill | nível 2 |
| `/pipeline` | **sobrevive (marca ✗ do Rick)** — versão C: 4ª face; versões A/B: a "cozinha do @" (o que o E. está triando) | depende do teste A/B/C |
| `/wrap` | o **fechar-do-dia** do HOJE (crepúsculo) | ritual |
| `/calendar` | **fixos no HOJE**; week-strip = drill do arco | toca o arco → semana |
| `/raiz` | entrada/gênese (onboarding) + **"a raiz dele" em cada ramo** | drill do ramo |
| `/analytics` | **vira a ÁRVORE** (síntese + janelas φ) | superfície |
| `/graph` (conexões) | constelação = o centro da ÁRVORE (inventário do wireframe) | dentro da árvore |
| `/library` | recursos → busca + ramo; **reflexões → journal (gesto próprio, marca do Rick)** | busca / gesto |
| `/search` | global — ícone no topo, ao lado do norte | sempre à mão |
| `/settings` | ajustes — discreto no topo (já no mockup) | topo |
| `/item/:id` | detalhe do item — abre de qualquer lugar | nível 2 |
| `/landing`, `/auth` | fora do app (porta) | — |

Princípio: **superfície = presença (3 faces); profundidade = estrutura (drills e sheets)**. O lado construtor entra pela árvore e pelo pipeline; o lado presente nunca precisa sair do HOJE.

## Fases de commits pequenos (como a casa gosta)

```
fase 0 · chão       — R0 do roadmap (repo ramalhoau, CI, selos) — inalterado
fase 1 · ritual     — aurora tela cheia + zênite próprio + soul log (schema: body.soul)
                      cherry-pick estrutura: RitualView (atom-core) + sprint1 shell (5022aae vizinho)
fase 2 · hoje       — face HOJE: arco + protocolos + fixos + fluido 2-3 opções
fase 3 · árvore     — radial φ real×ideal sobre items reais + síntese + drill-down
fase 4 · @          — boca única + bilhetes + listas simples + journal gesto próprio
fase 5 · estrutura  — montar A/B/C, Rick vive, decide; pipeline encaixa conforme a escolha
```

Cada fase = commits pequenos com body, testável ao fim. As 3 versões (fase 5) reaproveitam as mesmas peças das fases 1–4 — só a casca muda.
