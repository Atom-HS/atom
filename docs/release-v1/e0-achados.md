# E0 — Become one with the data · achados

**Data:** 2026-06-12 (madrugada) · **Etapa:** E0 do plano Karpathy (`plano_implementacao_karpathy_v1.md`)
**Método:** app rodado local contra backend real · screenshots autenticados de todas as rotas · baseline de testes ANTES de qualquer mudança · inspeção do banco de produção.

---

## E0.1 — O app vivo (todas as rotas, sessão de teste)

Dev server: `pnpm dev` → ok (porta 5174 local; 5173 ocupada por outro projeto). Conta de teste criada pela porta pública: `atom-e0-test@ramalho.au`.

| Rota | Estado | Observação |
|---|---|---|
| `/landing`, `/` | ✅ | landing "sistema operacional pessoal — emoção precede ação, reflexão fecha o ciclo" |
| `/home` | ✅ | saúda por período ("Boa noite … crepusculo"), SOUL card, "sem intenção definida" |
| `/pipeline` | ✅ | 7 estágios Genesis com glifos, contadores zerados |
| `/wrap` | ✅ | fluxo 1/7 "como você está saindo hoje?" — emoções |
| `/projects` | ✅ | empty state correto |
| `/calendar` | ✅ | week strip (8–14 jun), dia atual |
| `/raiz` | ✅ | welcome "vamos organizar sua vida, uma gaveta por vez" |
| `/analytics` | ✅ | 3 tabs (pipeline/soul/connections), funnel zerado |
| `/library` | ✅ | filtros por domínio (identidade/documentos/saúde/finanças…) |
| `/search` | ✅ | busca + pills de módulo |
| `/settings` | ✅ | conta, aparência (sistema/claro/escuro), rituais |
| `/graph` | ✅ | "0 nós, 0 conexões" + filtros |

**Veredicto: ZERO crashes em 13 rotas.** Guard de auth global funciona (deslogado, toda rota cai na landing). O app é um beta saudável e vazio.

### Achados dignos de nota
1. **Auto-confirm de email está LIGADO** — signup retorna sessão imediata sem confirmação. Conveniente pro dev, decisão consciente necessária antes do release público (selo futuro).
2. À 01:08 o app saúda como "crepusculo" — o mapeamento de período não tem faixa "madrugada/noite profunda". Detalhe pro E3 (rituais imersivos).
3. Screenshots em evidência local (`/tmp/e0-shots/`), fora do git de propósito (e2e/screenshots já tem baseline própria).

## E0.2 — Os dados reais (produção `avvwjkzkzklloyfugzer`)

Via `supabase inspect db table-stats` (projeto linkado, leitura):

| Tabela | Rows (est.) | Leitura |
|---|---|---|
| `items` | **3** | **o banco está praticamente virgem — o app nunca foi vivido** |
| `atom_items` | 0 | **resto do schema v1** (pré-reconciliação 007) |
| `share_links` | 0 | resto do v1 (sharing nunca usado) |
| `atom_events` | 0 | resto do v1 |
| `item_connections` | 0 | — |
| `user_connectors` | 0 | conector Google nunca ativado em prod |

**Implicações:**
- O "overfit no Rick" (E3) começa do dado zero — sem migração de dados legados, sem medo de quebrar histórico.
- As 3 tabelas-fantasma do v1 (`atom_items`, `share_links`, `atom_events`) merecem um selo de limpeza futura (DDL = escala pro Rick; não bloqueia nada).
- Conteúdo das 3 rows não inspecionado: dump exige Docker (ausente) e não vale raspar credencial por 3 linhas. *Runbook: instalar Docker Desktop OU `SUPABASE_ACCESS_TOKEN` no ambiente → `supabase db dump --data-only`.*
- O projeto fica na org pessoal antiga ("rsmramalho's Project", mesma org do Constellation). Renomear pra "Atom" no painel = 1 clique do Rick (cosmético, não urgente).

### Arqueologia bônus
A conta antiga da CLI ainda lista os backends da linhagem inteira: **"MindMate" (Jun 2025), "Mindmate v1.4", "MMv1", "Mmlovable", "MMtag" (Set 2025)** — confirma a fase Tag V1 do histórico. Nenhum é dependência de nada; candidatos a selo de arquivamento.

## E0.3 — Baseline (ANTES de qualquer mudança)

| Check | Resultado | Nota |
|---|---|---|
| `vitest run` | ✅ **15 arquivos · 106/106 verdes** | as "12 falhas pré-existentes" do commit `b8f2f1b` já foram corrigidas em algum momento — suposição do plano corrigida |
| `pnpm build` (tsc -b + vite) | ✅ verde | bundle maior: useItems 243kB (65kB gzip) — ok por ora |
| `pnpm lint` | ❌ **59 erros, 4 warnings** | dívida herdada; CI nasce com lint como RELATÓRIO (não-bloqueante) + selo pra apertar |

## E0.4 — Canal de escrita (decisão default executada)

**Soul log no tronco desde o v1** via `body.soul` (a extensão já existe no schema v2 — zero DDL). Escrita sempre pelo app autenticado — o freio "items read-only de fora" segue intacto. Selado em `docs/decisions/`.
