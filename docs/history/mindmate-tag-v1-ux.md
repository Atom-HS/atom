# MindMate — Tag V1 UX (Histórico)

> ⚠️ **Correção histórica (2026-06-12):** este doc afirma que a plataforma Lovable foi
> "planejada, não iniciada". **Falso** — o MindMate foi SIM construído no Lovable como
> "Atom Engine 4.0" (`rsmramalho/atom-core`, 743 commits, beta.2 completo em 20/Mar/2026,
> com colaboração multi-user, PWA offline e 150+ testes). A arqueologia completa está em
> [`docs/release-v1/analise_mindmate-atom_v1.md`](../release-v1/analise_mindmate-atom_v1.md).
> O texto abaixo segue congelado como estava — ele descreve fielmente apenas a fase
> *Tag V1* (Out 2025), não a linhagem inteira.

**Versão:** 1.0
**Data:** 2026-05-13
**Status:** Historical (referência)
**Origem:** consolidação do Project "MindMate" no Claude.ai
**Período coberto:** Out 2025 – Mar 2026

> Captura o pensamento de UX e design do MindMate (predecessor conceitual deste app, MindRoot v2). Documento histórico — para o design system atual, ver `docs/design-system.md` e `CLAUDE.md`.

---

## Filosofia central — Universal Card

A unidade atômica do MindMate era o **Universal Card**: um único objeto de dados visto através de múltiplas lentes contextuais, em vez de módulos separados. Cada card representava simultaneamente uma task, calendar event, ritual e nó emocional, renderizando diferente conforme a view ativa mas com dados unificados.

**Princípio:** Sem duplicação de dados. Adicionar uma task de meditação cria um card; o Board mostra como task, o Calendar como recorrência 07:00, a view Rituals como ritual matinal com streak, o Emotional Map como nó ligado a "calm" e "focused".

---

## Schema de tags — 3 eixos

```
type       multi-select  task | project | habit | event | ...
module     multi-select  work | body | mind | family
emotion    single-select (uma só)
```

Tags atravessavam todas as views e funcionavam como filtro primário.

### Progressive disclosure na entrada

Universal input no topo → usuário escolhe `type` → quando escolhido, aparece `module` → quando escolhido, aparece `emotion`. Substituía o padrão "mostra todas as categorias de uma vez" que sobrecarregava a interface. Validado Out 2025.

### Integration score

Métrica de primeira classe: percentual de itens pertencentes a 2+ modules. Era o sinal headline de coerência cross-module no dashboard.

---

## UX patterns

| Pattern | Regra |
|---|---|
| Sem modal overlays | Detail views expandem inline dentro do card. Hard rule. |
| Board layout | Kanban 3 colunas (A Fazer / Fazendo / Feito) à direita; sidebar calendar à esquerda; drag-and-drop. |
| Mobile-first responsive | 375px baseline; grid 12 col em 1024px+; desktop ref 1280px. |
| Touch targets | ≥ 44×44px em todos elementos interativos. |
| Accessibility | WCAG AA floor — focus-visible, prefers-contrast, dark mode (reservado). |

---

## Composição do dashboard

Hierarquia top → bottom: **Rituals → Events Today + Priorities → Focus + Emotions → Integration → Modules grid**.

7 cards em v1:
1. Rituals (com tempo periods: 🌅 Morning, 🌞 Afternoon, 🌙 Night, streak + emoji)
2. Events Today
3. Priorities
4. Focus (weekly)
5. Emotions (7-day bars)
6. Integration
7. Modules grid

### Atomic vs composite cards

| Atomic | Composite |
|---|---|
| `StatCard` | `RitualCard` |
| `TrendCard` | `EmotionMapCard` |
| `ProgressCard` | `ModuleCard` |
| `ListCard` | |

Todas definidas com TypeScript interfaces.

---

## Visual language

- **Symbolic minimalism:** white space generoso, sombras sutis, sem cromo decorativo
- **Pastel por module:** Work = blue, Body = green, Mind = purple, Family = orange. Tag chips herdam namespace.
- **Tipografia:** Inter (UI), DM Sans (display)
- **Motion:** CSS primitives — fade, slide, progress fill. Sem libs JS de animação.

---

## Stack planejada (não chegou a ser implementada como MindMate)

- React + TypeScript + Tailwind, hooks pra state
- **Implementation platform:** Lovable (planejado, não iniciado)
- Backend: Supabase. Tables `entries` + `tags`; helpers `fn_local_day`, `fn_tempo_period`; RLS a configurar
- Timezone: `Australia/Brisbane` — toda lógica de data via local-day helper, não UTC
- Icons: lucide-react

---

## Localização

User-facing labels em **português brasileiro** ("A Fazer / Fazendo / Feito"). Identificadores técnicos/código em **inglês**.

---

## O que o MindRoot v2 absorveu

Os princípios validados pelo MindMate foram herdados pelo MindRoot v2 e adaptados ao contexto Soul Layer + Atom Engine:

| Princípio MindMate | Como vive em MindRoot v2 |
|---|---|
| Universal Card | AtomItem (boolean `completed`/`archived`, sem `status`) |
| 3-axis tag schema | Schema mantido (type/module + emotion via Soul Layer) |
| Progressive disclosure | Aplicado em parser de input natural |
| Sem modal overlays | Mantido — detail views inline |
| WCAG AA | Mantido |
| Hard rule: UI pt-BR / código en | Mantido — regra #10 do CLAUDE.md |
| Pastel per module | Substituído pela paleta MindRoot dark editorial (Cormorant + Inter + JetBrains Mono) |
| Lovable como platform | Descartado em 02/03/2026 (D-003 rebuild) — atom-core Lovable arquivado, rebuild do zero |

---

## Arquivos originais

Documentos do design system MindMate viviam no Project "MindMate" no Claude.ai. O whitepaper v4.4.1, referenciado nas specs mas nunca anexado ao Project, é open loop — se o doc físico existir em algum lugar do Drive, vale recuperar como referência histórica.

---

*Documento histórico. Não atualizar — referência congelada do pensamento de UX do MindMate em Out 2025–Mar 2026.*
