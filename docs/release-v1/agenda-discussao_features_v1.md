# Agenda de discussão — features do release Atom

**Data:** 2026-06-11 · 13 questões que só o Rick decide. Cada uma: contexto · posição recomendada · trade-off.
**Par:** `analise_mindmate-atom_v1.md` · `roadmap_release-atom_v1.md`

---

**1 · O que exatamente caiu no `revert 8 sprints`?** ✅ **RESPONDIDA (11 Jun, autópsia no adendo da análise)**
Revert cirúrgico, não total. Mortos: shell desktop (sprint 1), **AI companion = proto-E., 300 linhas** (sprint 5), analytics raiz (sprint 6), testes (sprint 8). Vivos: soul patterns, raiz visual, connectors. O próprio commit diz *"remains in git history for future cherry-pick"*.
→ **Vira ação, não questão:** cherry-pick do sprint 1 no R1 (shell) e do sprint 5 no R2 (esqueleto do E., conteúdo reescrito com o Tom).

**2 · Colaboração multi-user: v2 mesmo?**
O atom-core tem colaboração COMPLETA e testada (roles, convites, activity feed, RLS, E2E cross-user). É a maior perda silenciosa do rebuild — e `family` é módulo do Atom.
→ **Recomendo:** v2, selado por escrito agora. Single-user primeiro; presença é íntima antes de ser compartilhada.
*Trade-off:* adiar = release mais rápido e focado; mas o desenho do schema v2 deve nascer já compatível (project_id/membership) pra não pagar migração dolorosa depois.

**3 · Streaks e heatmap: matar de vez?**
O atom-core tinha gamificação completa de hábitos. Conflita com sem-shame ("quebrou o streak" = cobrança pura), mas há quem funcione com isso — e ND às vezes se beneficia de cadeia visível.
→ **Recomendo:** matar no core; se a necessidade aparecer, renasce como leitura da Árvore ("21 dias de seiva nesse ramo"), nunca como contador quebrável.
*Trade-off:* matar = coerência total com o Tom; manter = retenção clássica de habit-apps (que você decidiu não ser).

**4 · Recorrência: RRULE ou cadência φ?**
atom-core: RRULE clássico (toda 2ª/4ª, projeção virtual). atom-zero: cadência φ (o item rebrota em proporção áurea). Filosofias opostas de tempo.
→ **Recomendo:** φ pro fluido (hábitos, rituais — forma), RRULE só pra fixos duros de calendário (que já vêm do Google). Não construir motor RRULE próprio.
*Trade-off:* dois modelos = clareza conceitual mas duas mecânicas; um só = simplicidade mas força um modelo onde não cabe.

**5 · Offline-first é condição de release?**
atom-core tinha PWA offline completa; atom-app só tem banner. Presença que falha sem sinal não é presença.
→ **Recomendo:** sim, condição de release (R3). O padrão do atom-core (fila IndexedDB + auto-sync) reescreve em ~2 semanas.
*Trade-off:* +2 semanas de release; sem isso, primeiro voo/fazenda/academia sem wifi quebra a confiança no app.

**6 · Push notifications no v1?**
Protocolos do E. (água, remédio) com app fechado pedem push. Infra VAPID + pg_cron já desenhada no atom-core.
→ **Recomendo:** sim, mas SÓ pros protocolos do E. (nunca "você tem 5 tarefas atrasadas").
*Trade-off:* push de protocolo = o E. cuidando; qualquer push além disso escorrega pra cobrança.

**7 · As duas ontologias dos 9 domínios: qual vence?**
atom-app/Raiz: identidade, documentos, saúde, finanças, arquivos, memórias, tempo, comunicação, projetos (inventário da vida prática). atom-zero: corpo, mente, alma, amor, família, trabalho, criação, mundo, casa (ramos do ser). Mesmo número, ontologias diferentes — e a memória do ecossistema já flagava buraco lei×app aqui.
→ **Recomendo:** as duas, em papéis distintos — Raiz (prática) é a GÊNESE/entrada; os ramos (ser) são a ÁRVORE permanente. Nomear diferente pra nunca mais confundir.
*Trade-off:* manter ambas = riqueza com risco de confusão; fundir = perde ou a entrada prática ou o espelho do ser.

**8 · Calendar: week-strip basta pro v1?**
atom-core tinha mensal+semanal+DnD; atom-app tem week-strip + day view + Google sync.
→ **Recomendo:** week-strip basta. Fixos vêm do Google (que já tem vista mensal lá). Mensal+DnD = v1.x se sentir falta.
*Trade-off:* menos é coerente com HOJE; power users de calendário vão sentir falta (mas eles têm o Google).

**9 · Prompts guiados de reflexão: resgatar?**
20+ prompts em 6 categorias prontos no atom-core (gratidão, crescimento, sentimentos…).
→ **Recomendo:** resgatar o conteúdo, passar cada prompt pelo teste do Tom, servir no check-in e no journal. Custo ~1 dia.
*Trade-off:* quase nenhum; só não deixar virar "wizard de journaling" — prompt é convite, não formulário.

**10 · Posicionamento: ainda "open source, doe se puder"?**
A landing do atom-core prometia *"Gratuito para todos. Open source. Doe se puder."* O Atom de hoje (lei v1.3, marketplace, presets) sugere outro modelo.
→ **Recomendo:** decidir ANTES do R4 (landing). Minha leitura: core aberto + marketplace como economia é coerente com a lei; mas é decisão de negócio tua, não técnica.
*Trade-off:* manter a promessa = comunidade e confiança; recuar = liberdade comercial, mas a promessa pública de 2025 existe no git.

**11 · Qualidade: voltar ao padrão do avô antes do release?**
atom-core: 150+ testes, CI 3 jobs, zero-any. atom-app: 15 arquivos de teste. Regressão de ~90%.
→ **Recomendo:** não perseguir 150 testes — perseguir o PADRÃO: CI verde obrigatória (R0) + testes nos 4 fluxos críticos (captura, wrap, offline, E.). Qualidade a serviço do release, não score.
*Trade-off:* padrão completo = +1-2 semanas; sem nada = beta que quebra na mão de estranho no R4.

**12 · atom-core: selar o arquivamento (e a história)?**
O doc histórico nega que o MindMate 4.0 foi construído; há 2 D-003 conflitantes; domínio mindroot.com.au e Vercel órfãos apontam pra repos fósseis; whitepaper v4.4.1 segue perdido.
→ **Recomendo:** 1 decisão escrita que conta a história verdadeira (este pacote é o rascunho), corrige o mindmate-tag-v1-ux.md, arquiva atom-core com selo e mata os deploys órfãos.
*Trade-off:* meio dia de higiene; sem isso, a próxima sessão de IA re-descobre tudo errado de novo (aconteceu agora).

**13 · O easter egg "mindmate" fica?**
`src/features/raiz/mindmate.ts`: digitar "mindmate" dispara quotes. O precursor vive como fantasma no sucessor.
→ **Recomendo:** fica. É a homenagem certa — e custa zero.
*Trade-off:* nenhum. Essa é de graça pra terminar a sessão sorrindo.
