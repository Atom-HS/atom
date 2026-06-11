# Roadmap de release — Atom v1 (+ integração Constellation)

**Data:** 2026-06-11 · **Status:** v1 — proposta pra discussão com Rick
**Par:** `analise_mindmate-atom_v1.md` (F1–F4) · Agenda: `agenda-discussao_features_v1.md`

> Premissa validada na análise: **as peças existem.** Esqueleto (atom-app beta.1), alma (atom-zero), engenharia operacional (atom-core), produto definido (projeto-e: ERP de presença, Home B+C, 3 faces). O release é um trabalho de **montagem + transplante + resgate**, não de invenção.

---

## F5 — O caminho até o release

### O corte de MVP (o que É o v1)

O v1 é **single-user, 3 faces, com E. e offline**:

- **HOJE** — arco do dia (aurora → zênite → crepúsculo), chegada com emoção, protocolos do E., fixos do calendário, fluido ("o que cabe agora", 1 sugestão), fechamento com wrap.
- **ÁRVORE** — radial φ, 8 ramos real×ideal, síntese que nomeia sem cobrar, drill-down pra items/pessoas/raiz.
- **@** — uma boca só (captura unificada), conversa com E., bilhetes, triage IA por trás.
- Por baixo: schema v2 (FSM 7 estágios), Raiz (entrada/gênese), connectors Google, PWA offline, push pros protocolos.

**Fora do v1, por decisão escrita:** colaboração multi-user (v2), Xero connector (v1.x/v2), listas Keep (v1.x), calendar mensal completo (se week-strip bastar), marketplace (futuro — mas a arquitetura de camadas já o respeita).

### Milestones

**R0 — Chão firme** *(~1 semana)*
Destravar e estabilizar a base antes de construir em cima.
- Esclarecer o `revert 8 sprints` no atom-app: o que caiu, o que volta (sessão com Rick).
- Migrar repo pra conta `ramalhoau` (lei vigente: todo repo novo/migrado nasce lá) + matar a deriva mindroot×mindroot-v2×Vercel órfãos de vez.
- Resgatar o padrão de CI do atom-core (Actions: unit + E2E + build) apontado pro atom-app.
- Selar por escrito as mortes (streaks, gamificação, AI summary, wiki) e o adiamento da colaboração.
- ✅ *Pronto quando:* CI verde no repo canônico da conta nova, decisões seladas em `decisions/`.

**R1 — As 3 faces (Home B+C)** *(~3–4 semanas — o coração do release)*
Reescrever a casca do app de 14 rotas → 3 faces + norte + ajustes. Forma transplanta do atom-zero; código novo.
- Face HOJE: arco + chegada + fixos (Google Calendar já conectado) + wrap como crepúsculo.
- **Rituais de verdade no arco (Rick, 11 Jun):** cada momento do arco é um gesto, não um checkbox — aurora = chegada + respiração breve; zênite = um toque ("como está sendo?"); crepúsculo = encerramento com semente; completar protocolos também conta. **Todos escrevem soul log** — a soul extension (`body.soul`: emotion before/after, energy) já existe no schema v2, é só usar.
- **Listas simples na face @ (Rick, 11 Jun):** "compra leite" coberto sem cerimônia — resgate do List Engine do atom-core, UI mínima (item 20 da matriz, veredito atualizado).
- Face ÁRVORE: radial φ sobre os dados reais do `items` (substitui Analytics).
- Face @: captura unificada (a boca do atom-app já existe) + feed de conversa.
- As 14 rotas atuais viram drill-downs (Mapa/Modules → dentro da ÁRVORE; Pipeline → dentro do @).
- ✅ *Pronto quando:* Rick vive um dia inteiro (aurora→crepúsculo) só nas 3 faces, sem precisar das rotas antigas.

**R2 — O E. encarna** *(~2–3 semanas)*
A muda mais valiosa transplanta.
- Protocolos do essencial (manhã: água/vitamina/remédio — sentinela sem-shame).
- Bilhetes do E. (observações, não sugestões de produtividade) — Tom passa nos 3 testes.
- Push VAPID resgatado do atom-core (lembrete de protocolo com app fechado, via pg_cron).
- "O que cabe agora": 1 sugestão fluida por momento (capacidade × hora), não lista.
- ✅ *Pronto quando:* o E. lembra um protocolo com o app fechado e o Rick sente companhia, não cobrança.

**R3 — Robustez de rua** *(~2 semanas)*
Resgate da engenharia que o atom-core já tinha pago.
- PWA offline: fila IndexedDB + auto-sync (padrão do atom-core, reescrito no v2).
- Error tracking em produção (edge function + tabela, sem o dashboard cheio).
- Prompts de reflexão guiados no check-in (conteúdo do atom-core, Tom revisado).
- Export do journal (MD/JSON) — soberania de dados.
- Suíte de testes ≥ nível "confiança de release" nos fluxos críticos (captura, wrap, offline-sync, E.).
- ✅ *Pronto quando:* avião sem wifi: captura, wrap e protocolos funcionam e sincronizam ao pousar.

**R4 — Release** *(~1 semana)*
- Landing revisada com identidade v1.3 (decidir posicionamento "open source / doe se puder" — agenda).
- Onboarding = doors da Raiz (welcome simples, sem checklist gamificado).
- Beta fechado: Rick + poucos convidados → release.
- ✅ *Pronto quando:* um estranho cria conta, atravessa a Raiz, vive 3 dias e o app fez sentido sem manual.

**Total estimado: ~9–11 semanas** de trabalho focado. **[O]** O caminho crítico é R1; tudo o mais é paralelo ou resgate de padrão já provado.

### v1.x / v2 (selado, não esquecido)

- **v2 — Colaboração** (resgate do desenho do atom-core: roles, convites, RLS por membro — reescrito sobre schema v2). Gancho natural: módulo `family`.
- **v1.x — Xero/ERP connector** (padrão Lumen/Constellation aplicado ao Atom): o terço "o negócio conecta".
- **v1.x — Listas, calendar mensal, recurrence** (conforme decisão RRULE × φ).
- **Futuro — Marketplace** (camadas 9/10 da lei: add-ons nunca tocam 1–8).

---

## F6 — Integração com Constellation e apps futuros

> Regra desta seção: proposta a partir do que **já existe** nos dois lados; nada aqui inventa estrutura nova. Tudo é **[I]/[O]** salvo onde marcado.

### A descoberta: a integração já está legislada

**[F]** O CLAUDE.md do ricardo já define o Constellation como *"o app vivo (add-on Work / V2 do Pentágono)"*. **[F]** A lei de identidade v1.3 define: Marketplace = add-ons (camada 10) + Home customizada (camada 9), *"add-ons nunca tocam camadas 1–8"*, e o *"Pentágono Rick"* como preset instalável.

**[O]** Logo: **Constellation é o primeiro add-on do ecossistema Atom** — já batizado assim pela lei. A "integração" não é fusão de apps; é fazer os dois obedecerem ao mesmo contrato de fronteira.

### Espinha comum (compartilhado) vs por-app

| Camada | Compartilhado (espinha) | Por-app |
|---|---|---|
| **Lei** | `ricardo/law` (Genesis, identidade, fronteiras) — fonte única, apps apontam | leitura, nunca cópia |
| **Padrões** | FSM por estágios com portões · snapshot verbatim + assentimento humano (mandato ≈ wrap/commit ○) · triage/entrevista por IA com bandas de confiança · RLS per-user · edge functions | implementação de cada um |
| **Identidade visual/Tom** | lei da palavra (shame·oráculo·chegada), geometria | paleta e voz própria |
| **Backend** | padrão Supabase + RLS + edge functions | **projeto Supabase separado por app** (hoje já é assim: Constellation `atqshkhas…`; Atom o seu) |
| **Agente** | padrão "companheiro que entrevista e propõe, humano assenta" | E. (Atom) · Lumen (Constellation) |
| **Dados** | **nada compartilhado direto** | cada app dono do seu schema |

### Contratos de fronteira (3 regras)

1. **Ponte é ponteiro, nunca cópia** (regra já vigente no ecossistema): Constellation não lê o banco do Atom nem vice-versa. O que cruza, cruza por **connector explícito** — o mesmo padrão `user_connectors` que o Atom já tem pra Google e que o Constellation provou com Xero.
2. **Escrita no tronco só pela boca do app**: a tabela `items` continua read-only de fora (freio de lei). O wireframe V2 quer o @ escrevendo items — o caminho legal é o @ ser *parte do app* (edge function autenticada do próprio Atom), não um agente externo escrevendo no banco. **[O]** Isso resolve o buraco sem emendar a lei.
3. **Paralelo mandato↔wrap vira spec comum**: os dois apps têm o mesmo gesto no clímax — snapshot verbatim + assentimento humano irrevogável por construção (mandato F2→F4 no Constellation; commit ○ via wrap no Atom). **[O]** Quando esse gesto for escrito como padrão na lei, qualquer app futuro o herda de graça.

### Apps futuros (o teste do desenho)

**[O]** Um app novo do ecossistema nasce respondendo 4 perguntas: (1) qual lei aponta? (`ricardo/law`) (2) qual o seu agente-companheiro? (3) qual o seu gesto de assentimento? (4) que connectors cruzam a fronteira? — Se Constellation e Atom respondem hoje, o desenho generaliza. O Marketplace é a formalização disso em camada 9/10; o Pentágono Rick é o primeiro preset; o Constellation, o primeiro add-on de domínio.
