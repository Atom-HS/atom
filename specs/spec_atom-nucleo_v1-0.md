╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     spec                       ║
║ module:   bridge                     ║
║ state:    connected                  ║
║ status:   active                     ║
║ stage:    5 ⬠ Pentágono              ║
║ tags:     [#spec, #atom, #nucleo,    ║
║            #engine, #marketplace,    ║
║            #design-system,           ║
║            #contrato]                ║
║ source:   claude-project             ║
║ created:  2026-05-15                 ║
║ updated:  2026-05-15                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: Genesis v5.0.4       ║
║   → references: ATOM.md v2.0 (hub)   ║
║   → references: Identidade v1.3      ║
║   → references: design-system v1.0   ║
║   → references: D-004, D-013, D-016  ║
║   → feeds: app implementation        ║
║   → feeds: ROADMAP.md (app)          ║
╚══════════════════════════════════════╝

# Atom Núcleo — Spec arquitetural v1.0

**Versão:** 1.0
**Data:** 15 Mai 2026
**Status:** inaugural
**Princípio:** este doc descreve o que o Atom **é** funcionando como Atom. Não é roadmap (vive em ROADMAP.md). Não é preset pessoal (vive em PENTAGON.md do hub). É o contrato de produto — Engine OS Naked deployado, design como espinha, fronteira pra add-ons explícita.

---

## 0 · Mapa em uma página

```
┌───────────────────────────────────────────────────────────┐
│                  ATOM (produto único)                     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐      │
│  │           Engine (camadas 1-8)                  │      │
│  │  Casa · Porta · Língua · Pilares · Motor ·      │      │
│  │  Cara · Bocas · Olhos                           │      │
│  │  ─── universal · imutável · entregue pronto ─── │      │
│  └─────────────────────────────────────────────────┘      │
│  ┌─────────────────────────────────────────────────┐      │
│  │      Add-on plane (camadas 9-10)                │      │
│  │  Home (9 Yesod)    │   Features (10 Malkuth)    │      │
│  │  ─── vazio por default · onde add-ons agem ───  │      │
│  └─────────────────────────────────────────────────┘      │
│                                                           │
│  3 pilares atravessam tudo: Emotion · Action · Time       │
└──────────────────────┬────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────────┐
              │     MARKETPLACE    │
              │ (estrutura natural │
              │   de extensão)     │
              └────────┬───────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ⬡ add-on       ⬡ add-on       ⬡ add-on
   (Features +    (Features +    (Tema visual)
    Home opc.)     Home opc.)
```

Atom = Engine OS Naked deployado. Marketplace = como Atom cresce. Add-on = unidade que tessela.

---

## 1 · O que é o Atom

### 1.1 · Definição operacional

**Atom = Engine OS Naked deployado como app.**

Quando uma pessoa instala o Atom, recebe o Engine completo (8 camadas universais), funcionando, sem ginástica de configuração. A casa está pronta. Ela mora.

A pessoa estende o que recebeu via **Marketplace** — instalando add-ons que adicionam features (camada 10), Home customizada (camada 9), ou tema visual. Sem add-on, o Atom já funciona. Add-ons são escolha.

Esta spec descreve o **Engine OS Naked** — o que precisa estar pronto pra ser entregável como Atom.

### 1.2 · As 4 leis arquiteturais

Herdadas de ATOM v2.0 §2. Não são regras de uso — são propriedades da arquitetura. Quebrar uma é deixar de ser Atom.

| Lei | Consequência operacional |
|---|---|
| **O sistema classifica a si mesmo** | Tudo é AtomItem. Specs, ADRs, roadmaps inclusos. Não há metadado privilegiado fora do schema |
| **Documentar é executar** | Spec é meio do trabalho, não preparação. Jobs têm conteúdo inline + commit message — o spec é o commit |
| **Born committed** | Wraps, ADRs, jobs nascem commitados. Trabalho não-commitado não existe |
| **De dentro pra fora** | A semente não passa pelo solo que ela mesma criou (Genesis Part 1). Fundação muda primeiro; depois o que ela sustenta |

### 1.3 · As 3 escalas fractais

A geometria do Atom opera em três escalas simultâneas. Cada uma percorre os mesmos 7 estágios (`· — △ □ ⬠ ⬡ ○`) do Genesis. O fractal é a assinatura do design.

| Escala | Unidade | Estado atual (15 Mai 2026) |
|---|---|---|
| **1 · Item** | AtomItem (texto bruto → committed) | ✅ state machine completa, validada |
| **2 · Atom (produto)** | O sistema inteiro | ◐ entre ⬠ e ⬡ (app deployado, Marketplace iminente) |
| **3 · Marketplace** | O ecossistema | · (não existe operacionalmente ainda) |

### 1.4 · Os 3 pilares

Todo Atom implementa três pilares universais. Mudam as features, nunca os pilares.

| Pilar | O que captura | Connectors |
|---|---|---|
| **Emotion** | Como você está · Aurora check-in · emoção pós-task · shift no wrap | Captura direta (sem connector externo) |
| **Action** | O que você faz · pipeline · morph · decay · propagation | Gmail, Calendar, Atom Agent/FS, manual |
| **Time** | Quando acontece · ritual slots · recurrence · wrap commit | Google Calendar (primário) |

**Cross-pillar** é onde o sistema ganha musicalidade — Emotion × Time (wrap inclui soul data), Emotion × Action (emotion_after em tasks), Action × Time (items com due_date no Calendar). Cada intersecção é feature do núcleo, não add-on.

---

## 2 · As 10 camadas Tree of Life

A Árvore da Vida (Etz Chaim) tem 10 sefirot. O Atom tem 10 camadas. A correspondência não foi planejada — emergiu.

### 2.1 · Tabela completa

| # | Camada | Sefirah | O que é | Escopo |
|---|---|---|---|---|
| 1 | Casa | Keter (Coroa) | Onde os dados moram · schema é o contrato, não o banco | **Engine** |
| 2 | Porta | Chokmah (Sabedoria) | Quem entra e como · auth, API, RLS | **Engine** |
| 3 | Língua | Binah (Entendimento) | O vocabulário · types, modules, states, relations | **Engine** |
| 4 | Pilares | Chesed (Expansão) | Emotion, Action, Time | **Engine** |
| 5 | Motor | Gevurah (Força) | State machine, triage, FSM, wrap, propagação | **Engine** |
| 6 | Cara | Tiferet (Beleza) | Shell, nav, design system | **Engine** |
| 7 | Bocas | Netzach (Persistência) | Captura manual, Email, Calendar, Agent · 4 universais | **Engine** |
| 8 | Olhos | Hod (Esplendor) | Library, Search, Pipeline, Graph, Analytics, Projects, Calendar view, Email view | **Engine** |
| 9 | Home | Yesod (Fundação) | A personalidade · o primeiro ecrã | **Add-on plane** |
| 10 | Features | Malkuth (Reino) | Manifestação no mundo · plugins opt-in | **Add-on plane** |

### 2.2 · 1-8 é o Engine

Funciona sozinho. É universal e imutável. Esta spec descreve o que precisa estar fechado em cada uma das 8 pra Atom ser entregável.

### 2.3 · 9-10 é onde add-ons tocam

**Nunca tocam 1-8** — essa é a garantia de que o Atom continua sendo Atom mesmo com qualquer combinação de add-ons instalados (Identidade v1.3 §2.4).

Por default, 9-10 vêm com **Home Naked** (camada 9 padrão, suficiente pra usar) e **zero features instaladas** (camada 10 vazia). Add-ons preenchem.

### 2.4 · A linha entre 8 e 9

O corte entre 8 e 9 é o corte da Árvore: acima está o que é verdadeiro pra todos. Abaixo está o que se manifesta em cada instância.

**Regra inviolável:** qualquer feature que dependa do schema (camada 1), do auth (camada 2), do vocabulário (camada 3), dos pilares (camada 4), da state machine (camada 5), do shell (camada 6), das bocas universais (camada 7) ou das visões core (camada 8) é Engine. Não é add-on.

Casos onde a linha precisa ser explicitada antes de virar dívida arquitetural ficam em §6.4 (pendências decisórias).

---

## 3 · O contrato visual — Design system como espinha

Design system v1.0 (08 Abr 2026, no hub em `design/`) é o contrato visual canônico do Engine. **A camada 6 (Cara) o implementa.** Add-ons herdam — tema visual customiza superfícies sem violar a estrutura.

### 3.1 · Filosofia visual

| Princípio | Tradução visual |
|---|---|
| Presença sobre produtividade | Calmo, quente, silencioso · espaço pra pensar |
| Emoção precede ação | SoulCard é o primeiro componente da Home |
| Geometria é DNA | 7 estágios (`· — △ □ ⬠ ⬡ ○`) em StageBar, badges, pipeline |
| Módulos são cores | 8 módulos = 8 cores fixas · nunca mudam entre add-ons |
| Mobile-first | 360×800 viewport mínimo |
| Polish Sunsama-level | Cards limpos, sombras sutis, espaçamento generoso, hierarquia clara |

### 3.2 · Tokens canônicos

3 surfaces · 3 text · 1 accent + muted · 8 module colors · 7 stage colors · 3 ritual colors · borders, radius, shadow · tipografia DM Sans (regular 400, medium 500, **nunca 600+**).

CSS vars vivem em `src/index.css` no `:root`. Dark mode é default. Light mode não existe por agora.

Listagem completa: `design/design-system.md` §2 no hub.

### 3.3 · Geometria visual

- **Módulos (8):** `work` · `body` · `mind` · `family` · `purpose` · `bridge` · `finance` · `social` — borda lateral esquerda de 3px em cards de items, fundo de chips a 15% opacity
- **Estágios (7):** cada estágio tem cor + símbolo · StageBar usa segmentos proporcionais · StageBadge usa símbolo + cor
- **Rituais (3):** Aurora (05h-08h) · Zênite (08h-17h) · Crepúsculo (17h+) — SoulCard tem borda Aurora; Wrap acontece no Crepúsculo

### 3.4 · BottomNav universal — 5 slots

| Slot | Label | Camada | Customização |
|---|---|---|---|
| 1 | Home | 9 Yesod | Fixo (estrutural) |
| 2 | Search | 8 Hod | Add-on pode trocar label/ícone |
| 3 | · | 3 Binah (captura) | **Fixo · imutável** |
| 4 | Pipeline | 8 Hod | Fixo (estrutural) |
| 5 | Raiz | Engine universal | Add-on pode trocar label/ícone |

Slots 1, 3, 4 são fixos. 2 e 5 customizáveis por add-on (ver §4.6 sobre temas).

### 3.5 · Componentes e telas

**20 componentes** definidos em design-system §4:
- **4 Atoms:** ModuleChip, StageBadge, StatusDot, IconButton
- **8 Molecules:** TaskCard, InboxItem, SubtaskItem, MetricCard, CalendarEvent, SettingsRow, ConnectorCard, EmailItem
- **8 Organisms:** SoulCard, StageBar, AtomInput, BottomNav, AuditSummary, FocusTimer, WrapStepper, (Raiz domain card)

**14 telas** mapeadas em design-system §5:
Home · Item Detail · Calendar · Focus · Pipeline · Analytics · Settings · Wrap · Email · Projects · Connectors · Search · Login · Raiz

Cada tela tem nav access definido e referência v0.dev. **Raiz** (slot 5, 9 domínios) é Engine-level — add-ons customizam labels, não estrutura.

### 3.6 · Estados obrigatórios

Todo componente tem 4 estados, nenhum sem tratamento visual:

| Estado | Princípio |
|---|---|
| **Loading** | Skeleton com `--surface` pulsando 0.3→0.6, 1.5s loop · nunca spinner circular |
| **Empty** | Tom positivo ou neutro · oportunidade de guiar, não de reclamar |
| **Error** | Nunca perder dado · captura/wrap salvam local · toast com borda colorida |
| **Offline** | Banner sutil · capturas continuam locais · sync ao voltar online |

Detalhe completo: design-system §9.

### 3.7 · Regras visuais invioláveis

| # | Regra |
|---|---|
| 1 | Nunca bold 600+ · máximo weight 500 |
| 2 | Nunca borda dura · sombras sutis substituem `border: 1px solid` |
| 3 | Módulo = cor da borda esquerda · todo card de item tem 3px left border na cor do módulo |
| 4 | Estágio = geometria · todo item mostra `· — △ □ ⬠ ⬡ ○` com cor do estágio |
| 5 | SoulCard sempre primeiro na Home Aurora |
| 6 | Mobile-first · 360px mínimo · escala até desktop sem quebrar |
| 7 | Dark mode only por agora |
| 8 | DM Sans only · sem segunda fonte |

**Add-ons herdam as 8 regras.** Tema visual pode trocar tokens; não pode quebrar regra estrutural.

---

## 4 · Marketplace — Contrato de extensão

O Marketplace é a **estrutura natural de extensão do Atom** (Identidade v1.3 §2.4). Add-ons publicados ali tocam camadas 9-10. Esta seção define o contrato.

### 4.1 · O que add-on pode tocar

| Camada | O que add-on pode adicionar |
|---|---|
| **9 Home** | Configuração de primeira tela (opcional · default é Home Naked) · widgets · arranjo |
| **10 Features** | Rotas novas · telas novas (que respeitam o design system) · listeners de eventos · novos types/modules (declarados via manifesto, sem alterar schema base) |

Tema visual é caso especial — ver §4.6.

### 4.2 · O que add-on não pode tocar

| Camada | Por quê |
|---|---|
| **1 Casa** | Schema é o contrato base · alterar quebra a 1ª lei |
| **2 Porta** | Auth/RLS é fronteira de segurança |
| **3 Língua** | Vocabulário é universal · add-on declara types próprios mas não redefine `type`, `module`, `state`, `stage` |
| **4 Pilares** | Emotion/Action/Time são universais · add-on usa, não substitui |
| **5 Motor** | State machine é Genesis · 7 estágios são lei |
| **6 Cara** | Shell + nav + design system são contrato |
| **7 Bocas** | 4 connectors universais (captura, Gmail, Calendar, Agent) · add-on adiciona connector próprio em camada 10, não substitui boca universal |
| **8 Olhos** | 8 visões core são contrato · add-on cria visão nova em camada 10, não substitui Library/Search/Pipeline/Graph/Analytics/Projects/Calendar view/Email view |

### 4.3 · Manifesto declarativo

Cada add-on declara, em manifesto JSON:
- **Identidade:** `name`, `version`, `author`, `description`
- **Adições:** `routes`, `screens`, `types`, `modules`, `connectors`, `permissions` solicitadas
- **Configurações:** namespace próprio (`addons:<id>:*` no Supabase)
- **Reversibilidade:** o que precisa ser limpo ao desinstalar

Manifesto é validado pelo **GUARDIÃO** (agente arquitetural, ATOM v2.0 §7) antes de publicar.

### 4.4 · Namespace + API contract

- **Namespace de dados:** add-on lê dados core via API contract pública (queries permitidas declaradas no manifesto). Escrita só em namespace próprio
- **Namespace de configuração:** settings do add-on vivem em `settings/addons/<id>/` (nunca colidem com core)
- **Namespace de eventos:** listeners de add-on assinam `atom_events`, podem emitir eventos próprios em `<id>:*`

### 4.5 · Reversibilidade

Desinstalar add-on retorna o Atom ao estado anterior:
- Rotas e telas somem
- Types declarados ficam como `decayed` (não morrem — items existentes mantém histórico)
- Settings do namespace são removidos (com confirmação)
- Eventos emitidos pelo add-on ficam no log mas viram órfãos rastreáveis

Add-on que não consegue ser revertido é violação do contrato — não passa no GUARDIÃO.

### 4.6 · Temas como caso especial

Tema visual é tipo especial de add-on que toca **apenas tokens CSS** (cores, radius, shadow, tipografia). Não toca rotas, telas, types, eventos.

**Pode customizar:**
- Tokens de surface, text, accent
- Module colors (mas as 8 nomes/módulos permanecem)
- Stage colors (mas as 7 geometrias permanecem)
- Ritual colors

**Não pode quebrar:**
- Regras visuais invioláveis §3.7
- BottomNav 5 slots
- DM Sans como fonte (ou outra fonte que respeite weight ≤500 + caráter calmo)
- Dark mode default (light mode é tema, futuro)

---

## 5 · Atom vs codename interno

D-004 (Identidade v1.3) estabeleceu naming canônico:

| Contexto | Nome |
|---|---|
| Nome público do produto | **Atom** |
| Subtítulo filosófico | Atom HS (Human Systems) |
| Codename interno do app | MindRoot (não aparece pro usuário) |
| Repo do app | `atom-hs/atom` (master canônico) |
| Deploy técnico | `mindroot.com.au` (migração futura pra atom-only) |
| Schema/código (tipos técnicos) | `AtomItem`, `AtomType`, `atom_events`, `item_connections` |
| Estrutura de extensão | Marketplace |
| Unidade de extensão | add-on |
| Coleção curada de add-ons | preset |

**Onde MindRoot apareça voltado ao usuário — UI, splash, manifest, copy, marketing — é Atom.** O termo MindRoot some do vocabulário externo.

---

## 6 · O que esta spec não cobre

### 6.1 · Roadmap

Trabalho ativo, sprints, frentes de Espiral, cherry-picks, bugs por release vivem em **`atom-hs/atom/ROADMAP.md`** (canônico per D-016). Esta spec é arquitetural; roadmap é operacional.

### 6.2 · Presets pessoais

Pentágono Rick e outros presets futuros vivem em **`atom-hs/atom-engine/PENTAGON.md`** e equivalentes. Preset é coleção curada de add-ons — composição de produto, não estrutura.

### 6.3 · Ventures externas

Atlas Frames, Mt Samson, Yugar Lab, Constellation: ventures separadas que **podem** virar add-ons quando o Marketplace existir. Não são parte do núcleo. Trigger pra cada uma virar add-on é decisão de venture, fora do escopo desta spec.

### 6.4 · Pendências decisórias que afetam o núcleo

| # | Pendência | Por que importa |
|---|---|---|
| 1 | Focus Mode é Engine (camada 8 ou 10) ou add-on? | Se feature universal, vai pra 10 do core; se opt-in, é add-on. Design-system §5.3 lista como pendente |
| 2 | Companion/AI chat — Engine ou add-on? | "Definido como feature futura no roadmap do MindRoot" mas escopo (universal vs opt-in) não decidido |
| 3 | Home Crepúsculo (variante noturna da Home Aurora) — Engine ou add-on? | Aurora existe no core; crepúsculo não. Decisão de simetria pendente |
| 4 | Tokens divergentes entre 3 projetos v0 (Screen Templates, Component Library, Wireframes Completo) | Antes de qualquer add-on, tokens canônicos precisam ser únicos |
| 5 | Tema visual vs Theme add-on: light mode é caso de tema oficial do core ou primeiro add-on de tema? | Decide se o core entrega 1 tema (dark) ou 2 (dark+light) |

Cada uma vira ADR quando trigger operacional chegar. Esta spec **não decide** — só sinaliza pra que decisões futuras saibam que existem.

---

## 7 · Referências cruzadas

| Documento | Função | Onde mora |
|---|---|---|
| Genesis v5.0.4 | A lei · stage machine · types · modules · relations | hub · `law/` |
| Marco Zero v3.1 | O protocolo · boot · sessão · audit | hub · `law/` |
| Meta-Template v1.2 | A forma · ATOM ENVELOPE · estrutura de docs | hub · `law/` |
| Identidade v1.3 | Naming · Marketplace · add-on · preset | hub · `law/` |
| ATOM.md v2.0 | O método · 4 leis · 3 escalas · 10 camadas | hub · root |
| design-system v1.0 | Tokens · componentes · telas · regras visuais | hub · `design/design-system.md` |
| single-source-map.md | Onde cada doc canônico mora | hub · `foundation/` |
| ROADMAP.md | Trabalho ativo · sprints · frentes | app · root (canônico) |
| PENTAGON.md v4.0 | Preset pessoal do criador | hub · root |

---

## 8 · Princípios honrados

Esta spec respeita as 4 leis arquiteturais:

- **Sistema classifica a si mesmo:** este doc é AtomItem (envelope no topo), nasce committed quando push acontecer
- **Documentar é executar:** ao virar commit em `atom-hs/atom/specs/`, esta spec **é** o contrato — não preparação pra contrato
- **Born committed:** nasce no estágio 5 (connected) — já tem `references` ligando às leis e ao design-system
- **De dentro pra fora:** descreve o núcleo (Engine) antes do exterior (Marketplace) antes da customização (temas/add-ons)

---

## 9 · Versionamento

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 15 Mai 2026 | Spec inaugural. Define Atom como Engine OS Naked deployado · 10 camadas Tree of Life · 4 leis · 3 escalas · 3 pilares · contrato visual (design-system v1.0 aplicado) · contrato Marketplace (o que add-on pode/não pode tocar, manifesto, namespace, reversibilidade, temas) · naming canônico (Atom público, MindRoot interno) · 5 pendências decisórias sinalizadas (Focus, Companion, Home Crepúsculo, tokens, tema light). |

---

*Atom é Engine deployado.*
*Marketplace é como Atom cresce.*
*Add-on tessela sem violar a fronteira.*
*De dentro pra fora — sempre.*
