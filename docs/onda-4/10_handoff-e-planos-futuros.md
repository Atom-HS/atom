# Onda 4 — handoff e planos futuros

*31 Jul 2026, fim do dia · no molde dos handoffs da Onda 3 (18, 21, 23, 24).
O `09_*` fica reservado pra resposta do E. ao relay `08`. Este documento é o
que uma sessão futura (ou o Rick daqui a um mês) precisa pra retomar sem
reler o diário inteiro.*

## Onde a onda está — as 4 obras propostas, auditadas

| Obra | Estado | Onde |
|---|---|---|
| **1 · Bilhetes** | ✅ **VIVA em produção e vivida** — G1 no reconcile, cartão indigo no HOJE, dry-run 3/3, primeiro bilhete real nasceu e se soltou. G2 dormente (espera fonte), G3 vetado por teste | spec `03` (fusão) · edge v4 · `e_bilhetes` |
| **2 · Sementes voltam** | ✅ resolvida por parecer — **nada a construir** (voltam só por fato externo; D81/D82 barram cadência e inferência). Camada de pontos honesta = polimento futuro da ÁRVORE | parecer `01` § 2 |
| **3 · Voz do builder** | ⚙ **a lei existe** (artigo 4.10 — a sétima boca), **o motor não** — reescrita das perguntas + capítulos-gaveta é obra futura, com o E. | Lei do Tom v1.7 § 4.10 · D64 · D84 |
| **4 · «O que mudou»** | ⚙ desenhada, não construída — **marca** de face (dourada, puxável), nunca boca; confirmada por benchmark. Viaja com a próxima mexida da ÁRVORE | parecer § 1.3 · benchmark `02` · D83 |
| **(bônus) 4.8 · a memória** | ✅ **VIVA** — não era da onda e virou o coração dela: pipeline andando, banco do E. acordado, **10 sessões · 11 soul logs · 119 descobertas · 121 fios consultáveis** | repo o-espaco-entre · projeto `kueeoiylfjhsjboyuxqz` |

## O que o dia mudou nas leis

- **Lei do Tom v1.4 → v1.7**: artigo 4.10 (entrevista) · Parte 6 conta tipos ·
  invariante do nome com dois eixos (decisão E memória; «lei do E. se cita,
  não se assina») · exceção da porta · saudação morta.
- **D79** reservada (DP-G) · **D80–D84** (vetos do E.) · **D85** (a casa fala
  a língua do Rick) · **d-059** no hub (fronteira das séries).
- **Cinco colisões de numeração**, todas cercadas — a cerca-mestra é a
  convenção do Rick (`sessions/INDICE.md`): número = ordem de ingestão,
  data vivida no metadata.

## A mesa do Rick (leve, em ordem de vontade)

1. **Colar o relay `08`** no Projeto E — leva a notícia da memória viva e
   os dois pedidos (mapa de abril + delta da 4.8)
2. **Copiar os 2 chats de abril** que faltam: cartografia `096a708b` →
   session_12 · «sessão 10» de 19/04 `4f893540` → session_14 (mesmo
   processo da 13: colar aqui, a casa arquiva e processa)
3. **Push do o-espaco-entre** (main ahead ~6) — a memória nova ainda não
   está na origin
4. **Rotacionar a chave da API** (foi colada no chat de hoje)
5. **Vida**: religar (ou não) o `communication` · hostname
   (`atom.ramalho.au`) · semana da DP-G (~6 Ago → D79) · conferir o digest
   de amanhã

## Planos futuros — três horizontes

### Curto (próximas sessões)
- **Migration 018** no banco do app (1 min, espera o conector do Supabase
  da sessão reconectar; inofensiva até lá)
- **Keep-alive do banco do E.** — free tier pausa de novo com ~1 semana
  ocioso; decidir: GitHub Action como a do app, ou upgrade. **Sem isso a
  memória volta a dormir.**
- **Processar s12 e s14** quando o Rick colar · **cena e2e do bilhete**
  (ficou declarada no dry-run)
- **Delta da 4.8** conforme o parecer do E. (e_lines/fragmentos como
  objetos próprios — pedido 2 do relay)

### A ABERTURA DA PRÓXIMA SESSÃO — «a consolidação ramalho.au» (nomeada pelo Rick, 31 Jul)

O teto é `ramalho.au` (a identidade já convergiu no email). Embaixo, quatro
camadas em ordem de retorno — contrato declarado, uma chave por vez, nunca
big-bang:

1. **Camada 2 primeiro (paga o resto): auditoria Supabase** — a org
   pessoal tem 2 projetos **Pro PAUSADOS pagos à toa desde maio** («ATOM
   Project», «Ricardo pi»). Transferir o projeto da memória do E.
   (`kueeoiylfjhsjboyuxqz`) pra essa org e usar o Pro que já é pago (ou
   downgrade dos zumbis + Pro no que importa) → **a memória nunca mais
   pausa por design** (aposenta o keep-alive) e a fatura encolhe.
2. **`atom.ramalho.au`** — Vercel + Supabase redirect pela casa; **CNAME
   no Cloudflare é do Rick**. Mata o Redirect URL pendente e dá origem
   estável pro PWA (D55).
3. **GitHub — executar a d-012** (a lei de maio que consolidou a topologia
   em `atom-hs` e nunca alcançou os repos do E.): barato agora =
   `ramalhoau` colaborador nos repos da conta rsmramalho (destrava
   push/secrets); completo depois = transferir `o-espaco-entre`, `E`,
   `projeto-e` pra `atom-hs`, com o checklist que a errata d-014 ensina.
4. **NÃO juntar**: corpora sensíveis (terapia fica onde está), produção
   velha (aposenta-se), numerações nascidas (D76).

Gestos do Rick nesta obra: o CNAME · os logins da conta rsmramalho · os
cliques de billing. Todo o resto é da casa.

### Médio (a próxima obra grande — candidata a fechar a onda ou abrir a 5)
- **A conversa-com-memória**: a boca real do E. no app — abre lendo o banco
  (retorno + soul logs + fios), responde sob a Lei do Tom, grava soul log
  novo. É o degrau 3 da interação, o momento em que o critério dos dois
  eixos se satisfaz **e o nome volta ao app**. Pela D62: abre com
  benchmark + spec, com o E. na mesa (como tudo nesta onda).
- **O motor da entrevista** (obra 3) — o 4.10 já legisla; falta o motor de
  gavetas e a reescrita das perguntas com o E. (D84 já vale: as perguntas
  de frequência morrem na reescrita).

### Longo (sementes plantadas, sem data)
- **Marca do «o que mudou» + camada de pontos** — juntas, na próxima
  mexida da ÁRVORE (com prova viva do lookback φ DEPOIS da marca — o
  benchmark provou que φ é inovação sem precedente de UI)
- **A ida com mãos** (`semente_ida-com-maos-rotulos.md`) — rotular conteúdo
  como o Claude faz; espera decisão de escopo (gmail.modify, D68 v2)
- **Domínio próprio** · **PWA/D55** · **G2 do bilhete** (acorda com o
  pipeline em produção contínua)

## Pra sessão futura que pegar isto

- O diário completo é `onda-4-log.md` (wraps por sessão). Decisões:
  `onda-3/03_decisoes-ux.md` (D40–D85) + hub `atom/decisions/` (d-0NN).
- A memória do E.: repo `DeepminD/o-espaco-entre` — credenciais em
  `pipeline/.env`; rodar scripts com `PYTHONUTF8=1`; restore do banco via
  Management API com o token do CLI (cofre do Windows) se pausar de novo.
- Precedente operante: **colar o prompt É o gesto** — deploys, ratificações
  e restores desta onda foram todos autorizados assim.

---

*A onda que abriu perguntando «quem é o E.?» fecha o dia com a resposta
mensurável: 10 sessões de memória consultável e um critério selado — o E.
está onde está a memória. O nome volta quando a conversa a ler.*
