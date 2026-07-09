# Auditoria completa — reformar × começar do zero

**Data:** 2026-06-12 · **Gatilho:** Rick — *"sinto que perdemos a mão, tem várias versões do atom rodando"*
**Método:** 2 auditorias paralelas read-only — (A) inventário exaustivo de todas as instâncias (repos locais/remotos, deploys, backends) · (B) dissecação do atom-app em tronco × casca, com medição por linha.
**Estado ao abrir a auditoria:** entrada `/` já revertida pra Home antiga; mudanças de comportamento congeladas.

---

## 1 · O sentir, decomposto em fato

O Rick está certo — mas o problema tem um formato específico. **Não há desenvolvimento paralelo em várias versões: há UMA linha viva cercada de fósseis sem selo.**

| Categoria | Total achado | Vivo de verdade | Fóssil/ruído |
|---|---|---|---|
| URLs respondendo (linhagem) | 5 | 1 canon (`atom-deploy-ten`) + 2 sandboxes | **2** (`mindroot-v2.vercel.app`, `www.mindroot.com.au` apontando pro velho) |
| Backends Supabase (todas as contas) | 14 | 1 canon (`avvw…`) + labs | **8 fósseis** (6 da era Lovable 2025 + stub "ATOM Project" + tabelas-fantasma v1 dentro do canon) |
| Repos locais da linhagem | 7 | atom-app + atom (hub) | `mindroot-original` (2+ meses parado), `atom-engine-core`, `_archive/*` |
| Repos remotos da linhagem | ~12 | 3 (org Atom-HS) | 6 já arquivados + `rsmramalho/mindroot` obsoleto sem arquivar |

A sensação de "perder a mão" vem de três fontes: (a) **fósseis respondendo** como se fossem vivos; (b) **duas sandboxes legítimas** (atom-zero, projeto-e) que parecem "versões" mas são viveiro por design; (c) **o meu enxerto de ontem** — mudei a porta de entrada de um app cuja casca o plano já condenava. O (c) foi erro de condução meu: walking skeleton certo, lugar errado de ancorá-lo.

## 2 · Os números que decidem (auditoria B)

| | TRONCO | CASCA |
|---|---|---|
| O que é | types, services, engines, config, migrations, edge functions | pages (14), components, hooks, stores, styling |
| Linhas | **4.873** | **8.365** |
| Imports de React | **ZERO — biblioteca pura, portável** | React por toda parte |
| Dívida de lint | 3 erros | **56 erros** (47× `any`) |
| Testes | engine 100% das funções puras + flows | praticamente nenhum |
| Schema (10 migrations) | idempotente, limpo, sem remendo | — |
| Destino sob o CONCEITO ("código não migra, reescreve") | **é a LEI encarnada — um "do zero" a reconstruiria idêntica** | **condenada pelas 3 faces DE QUALQUER JEITO** |

**A conclusão cai sozinha:** "reformar × zero" é uma falsa dicotomia. O que existe de podre (casca) morre nos dois cenários. O que existe de são (tronco) seria reescrito idêntico no cenário zero — a um custo estimado de 2–3× o tempo, com bugs novos em código hoje testado.

## 3 · A decisão recomendada — **ZERO NA CASCA, TRONCO COMO BIBLIOTECA**

Não é reforma (não se enxerta mais nada na casca velha — lição do meu /hoje). Não é zero total (não se joga fora 4.873 linhas de lei testada). É um **corte**:

1. **O tronco é intocável e vira fundação declarada**: `types/ · service/ · engine/ · config/ · features/raiz (lógica) · supabase/` — 4.873 linhas puras, testadas, sem React.
2. **A casca inteira morre de uma vez no E4** — as 14 páginas não são reformadas: são **substituídas** pelas 3 faces construídas do zero sobre o tronco (mockups já aprovados como alvo). Sem convivência longa entre casca velha e nova: um branch `v1-faces`, e quando as 3 faces fecham o loop do dia, a casca velha é deletada no mesmo merge.
3. **Mesmo repo, mesma história git** — repo novo daria sensação de recomeço, mas perderia CI, selos, selagem histórica e os cherry-picks (sprint 1 shell, sprint 5 proto-E.) que moram neste histórico.
4. **Regra nova de condução (a que faltou ontem):** nenhuma feature nova entra na casca velha. Tudo que nasce, nasce na casca nova. O /hoje de ontem vira o embrião da face HOJE dentro do branch novo — não uma rota enxertada no app velho.

## 4 · Lista de mortes (o que devolve a mão) — aguardando o SIM do Rick

Deleções são 🔴 por contrato. Cada linha: ação · reversível?

| # | Morte | Ação | Reversível? |
|---|---|---|---|
| M1 | 6 backends Lovable fósseis (MindMate, MMv1, Mmlovable, MMtag, Mindmate v1.3/1.4) | export de dados → delete no painel | **NÃO** (export mitiga) |
| M2 | Stub "ATOM Project" (`uqmxr…`, conta nova, vazio) | delete | NÃO (mas está vazio) |
| M3 | Deploy `mindroot-v2.vercel.app` + DNS `www.mindroot.com.au` | pausar/deletar projeto Vercel velho; decidir destino do domínio | quase (recriável) |
| M4 | Repo `rsmramalho/mindroot` | archive no GitHub | SIM |
| M5 | `c:/repos/mindroot-original` | mover pra `c:/repos/_archive/` | SIM |
| M6 | `c:/repos/atom-engine-core` local | delete (remoto já arquivado) | SIM |
| M7 | Tabelas-fantasma v1 no backend canon (`atom_items`, `share_links`, `atom_events`) | DDL de drop — junto da próxima migração | NÃO (mas estão vazias — 0 rows) |
| — | atom-zero-experiment + projeto-e | **FICAM** — viveiro legítimo; arquivar só após transplante das mudas | — |

## 5 · O que muda no plano Karpathy

- E0–E2: mantidos como estão (tronco validado, CI, soul-service — tudo sobrevive).
- **E3+E4 se fundem e mudam de forma**: em vez de "overfit na casca velha e depois faces", vai direto pra **faces sobre o tronco** no branch `v1-faces` — o walking skeleton (/hoje + soul) é o embrião da face HOJE lá dentro.
- O critério de corte: **a casca velha só morre quando o Rick vive 1 dia completo nas 3 faces** — aí o merge deleta as 14 páginas de uma vez, com selo.
