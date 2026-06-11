# Selos do release v1 — decisões consolidadas

**Data:** 2026-06-12 · **Autoridade:** Rick (sessões 11–12 Jun 2026, "pode rodar sem autorização") · **Registrado por:** Claude Code
**Contexto:** análise de linhagem MindMate→MindRoot→Atom (`docs/release-v1/analise_mindmate-atom_v1.md`). A lição nº 1 da linhagem: **o que evapora sem decisão escrita volta pra assombrar** — três features completas do atom-core (offline, push, colaboração) sumiram no rebuild sem nenhum selo. Este arquivo existe pra isso nunca se repetir.

---

## S-01 · Mortes (não voltam; re-abrir exige novo selo)

| O quê | Origem | Por quê |
|---|---|---|
| Streaks + heatmap de hábitos | atom-core | mecânica de cobrança — falha o shame-test; a Árvore φ é a resposta certa |
| Checklist gamificado de onboarding | atom-core | gamificação ≠ presença; onboarding = doors da Raiz |
| AI weekly summary (Gemini Flash) | atom-core | o wrap já é isso, melhor e com assentimento; stack de IA = Claude |
| Wiki super manual in-app | atom-core | docs morarão no site |
| Smart suggestions de produtividade | atom-core | o conceito renasce como bilhetes do E., com o Tom; a implementação morre |
| Kanban com "7 toques pra maturar" | atom-app v1 | estágio se vê, não se clica (pipeline vira leitura — sobrevive como vista) |

## S-02 · Adiamentos (selados com destino, não esquecidos)

| O quê | Destino | Gancho |
|---|---|---|
| Colaboração multi-user (roles/convites/feed) | **v2** | desenho completo existe no atom-core; gancho natural = módulo family. Confirmado pelo Rick: "Andre — só meu por ora" (single-user no v1) |
| Xero/ERP connector | v1.x | padrão provado no Constellation (entrada Lumen); o terço "o negócio conecta" do ERP de presença |
| Calendar mensal + drag-and-drop | v1.x se doer | week-strip + Google basta pro v1 |
| Limpeza das tabelas-fantasma v1 (`atom_items`, `share_links`, `atom_events`) | quando houver DDL agendada | DDL em prod = escala pro Rick |

## S-03 · Canal de escrita do dia (E0.4)

**Soul log no tronco desde o v1.** Emoções de chegada/zênite/fechamento e eventos de ritual gravam em `body.soul` de items do dia (a soul extension já existe no schema v2 — zero DDL). Escrita SEMPRE via app autenticado; o freio "tabela items é read-only de fora" segue absoluto. O canal do @ escrevendo no tronco (v2) usará o mesmo princípio: o agente opera DENTRO do app (edge function própria), nunca por fora.

## S-04 · Marcação do WIREFRAME_V2 (sessão 11 Jun)

- **Rituais são imersivos, não toques**: aurora = tela-ritual na primeira abertura do dia; zênite = tela própria; crepúsculo = wrap. Todos gravam soul log.
- **"O que cabe agora" = 2–3 opções**, humano escolhe (não 1 imposta, não lista).
- **Journal = gesto próprio** (separado da conversa do @); prompts guiados resgatados do atom-core passam pelo teste do Tom.
- **Boca única**: colar lista = o @ tria (Bocas morre como tela).
- **Listas simples** entram no v1 (resgate do List Engine; "compra leite" coberto sem cerimônia).
- **Estrutura: hipótese favorita = casca viva D** — B (só o dia) até fechar o protocolo da manhã → a casa abre (C, com pipeline) → crepúsculo recolhe. A confirmar no corpo durante E4; alternativas A/B/C vivas no mockup (`docs/release-v1/mockups/cara-do-atom-teste-abc.html`).

## S-05 · Resgates do atom-core (engenharia já paga, reescrita no v2)

PWA offline (fila IndexedDB + sync) · push VAPID só pra protocolos do E. · prompts de reflexão · export MD/JSON · padrão de CI · error tracking de produção · command palette (P) · progress híbrido com pesos (onde fizer sentido). Cherry-picks do próprio repo: sprint 1 (shell, `SidebarNav`/`useBreakpoint`) e sprint 5 (`5022aae`, proto-E.) — o revert `e276735` os preservou no histórico de propósito.

## S-06 · Dívida de lint

CI nasce com **typecheck + test + build como portão duro; lint como relatório** (59 erros herdados). Selo: zerar a dívida até o fim do E4 e promover lint a portão.

## S-07 · Pendências que escalam pro Rick (não são minhas)

1. ~~Vercel~~ **RESOLVIDO PARCIAL (12 Jun):** app no ar na conta nova — **https://atom-deploy-ten.vercel.app** (projeto `atom-deploy`, deploy estático do dist, proteção SSO desligada via API). Pendente só o CD automático: conectar GitHub à conta Vercel `ramalhoau` no painel (login connection) e aí religar o projeto ao `Atom-HS/atom`. O `mindroot-v2.vercel.app` antigo segue fóssil — arquivar quando o CD novo existir.
1b. ~~GitHub~~ **RESOLVIDO (12 Jun):** `ramalhoau` agora é collaborator **admin** no `Atom-HS/atom` (convite criado pela conta `rsmramalho` via gh, aceito via API). PRs por MCP/gh destravadas. Org membership ainda requer admin da org (403 — descobrir quem é o owner da org `Atom-HS`, possivelmente conta terceira).
2. Auto-confirm de email ligado no Supabase — decidir antes do release público.
3. Renomear o projeto Supabase "rsmramalho's Project" → "Atom" (cosmético).
4. Arquivar com selo os 6 backends-fósseis MindMate da conta antiga (Jun–Set 2025).
