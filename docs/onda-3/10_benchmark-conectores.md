# Benchmark sob a lei D62 — conectores: a lente sobre email e calendar

*29 Jul 2026 · o benchmark que abre a obra dos conectores, primeira obra
nascida sob a D67 ("o Atom é a lente, não o lugar"). Três agentes de
pesquisa, mercado 2024–2026 + doc oficial do Google. A régua não é "melhor
cliente de X" — é "melhor LENTE sobre X". Fontes nos relatórios; as
principais estão linkadas aqui.*

## Veredito em uma linha por frente

| Frente | Veredito | O achado que muda a obra |
|---|---|---|
| **Lente sobre email** | ✅ do lado certo da história, **1 ponto cego** | clientes de email morrem (Mailbox, Sunrise, Google Inbox); lentes sobrevivem há 15 anos (SaneBox, Boomerang, TripIt) — mas estrela é sinal manual e raro: **se o usuário não estrela, a lente parece morta** |
| **Lente sobre calendar** | ✅ tese confirmada por um cemitério | "melhor calendário" é guerra perdida documentada (Sunrise, Woven, Rise, Clockwise mortos; Amie pivotou); o dado nº1 consumido é UM evento — o próximo. O céu no HOJE está certo. **Cego:** recorrente→ritual erra (standup não é ritual pessoal) |
| **A ida (legislar pra fora)** | ✅ **inédita como ciclo completo, e barata** | criar labels = `gmail.labels` (**non-sensitive**, sem CASA); calendário próprio = `calendar.app.created` (sensitive, verificação gratuita); pastas = `drive.file` (non-sensitive). O muro caro (CASA, US$ 500–4.500/ano) só existe se o app **aplicar** labels em mensagens (`gmail.modify`, restricted) — a v1 não precisa |

---

## 1 · Email — a volta estreita é feature, não timidez

**A D67 está do lado certo da história.** Quem virou "o lugar" morreu ou
está sendo comido: Mailbox (comprado por ~US$ 100M, morto em 2 anos),
Sunrise (idem), Google Inbox (morto pelo próprio Google), Shortwave
pivotando enquanto o Gemini absorve sumarização/priorização de graça.
Quem ficou como lente modesta segue vivo e cobrando: SaneBox (2010),
Boomerang (2010), TripIt (2006). **Sobrevive o que depende de contexto
que o Google não tem — e a taxonomia da casa mora fora do Gmail.** Bônus
de graça: a volta só-estrela é superfície mínima de ataque na era do
prompt-injection por email (HN sobre AI-inbox: "a phisher's white whale").

**Sinais ranqueados por valor comprovado no mercado:** (1) enviado sem
resposta — pago há 15 anos (Boomerang, SaneBox NoResponse, Superhuman);
(2) precisa de resposta minha — a tese de Cora/Superhuman auto-triage;
(3) VIP/remetente — universal, o `#who:` já está alinhado; (4) data/
compromisso embutido (TripIt provou); (5) fatura/vencimento — conversa
direto com o cofre (D63); (6) newsletter pra fora do fluxo (Meco).

**O ponto cego da estrela:** não existe dado público de adoção; a evidência
qualitativa diz que vira pilha ("lista longa de estrelas sem memória de
por quê"). Mas pra UM usuário com contrato explícito ("estrela = quero no
Atom") é o sinal mais barato, reversível, e funciona de qualquer aparelho
sem UI extra — opt-in humano, zero falso positivo. **A síntese que ninguém
fez:** sinal declarado como verdade primária + sinal detectado por AI como
*sugestão de estrela* ("isto parece precisar de você — estrelar?"), humano
sempre no gate. É a doutrina da casa (inbox obrigatório, assentimento)
aplicada ao email.

**O que ninguém tem:** projetar uma ontologia que vive FORA do email
(módulos, domínios, pessoas de um OS pessoal) como labels dentro do Gmail.
Auto-labeling virou commodity (n8n de prateleira faz) — o valor não está
em rotular, está em **qual taxonomia** o rótulo carrega. E ninguém
transforma email em cidadão de um grafo tipado (o email que `feeds` um
projeto). O fosso é o grafo do outro lado.

## 2 · Calendar — o céu está certo; a higiene do sinal, não

**O cemitério confirma a categoria:** todo cliente de calendário
independente morreu ou foi absorvido (Sunrise→Microsoft, Cron→Notion,
Reclaim→Dropbox, Clockwise→Salesforce — este desligado em 1 semana com
40k orgs). A indústria inteira de widgets/complications existe pra mostrar
UM dado: o próximo evento. **O céu no HOJE (hora marcada como ponto fixo,
nunca grade) é exatamente a lente que sobrevive** — e time blocking tem
evidência real por trás (implementation intentions, 94 estudos).

**Onde estamos atrás (table stakes, priorizado):**
1. **O hoje nunca mente** — filtrar recusados/tentative, tratar all-day vs
   com hora, multi-calendário, timezone. Lente que mostra sinal errado
   morre na primeira semana. (Hoje o sync ingere tudo cru.)
2. **Conflito é sinal** — duas horas marcadas colidindo; o Gemini já
   entrega nativo, a lente precisa no mínimo refletir.
3. **Pressão dos próximos dias** — a vista só-hoje esconde sobrecarga
   cumulativa ("cada dia parece administrável isoladamente"). Um sussurro
   de pressão vinda da semana, sem virar vista de semana.
4. Digest matinal — comoditizado (Gemini Daily Brief); só se defende com a
   taxonomia própria. Conversa com D66.

**O risco nomeado: classificação enganosa.** Recorrente→`ritual` e
único→`task` são heurísticas que erram (reunião semanal de trabalho não é
ritual pessoal; evento único pode ser âncora). O dado do Morgen: 73% de
adesão quando a IA **sugere e o humano aprova**, vs 31% na automação. A
casa já tem o gate — tudo nasce no inbox — mas o chip de assentimento
precisa **mostrar a leitura e deixar trocar** (ritual ⇄ task), nunca
decidir quieto.

**O que ninguém tem:** ler a recorrência do Google e interpretá-la como
ritual do sistema pessoal (Reclaim faz a direção oposta); `#who:` na tela
do dia (Clay/Dex provam o valor, mas vivem em app separado); o dia como
sinal não-grade; taxonomia de vida projetada de volta como cores/
calendários.

## 3 · A ida — inédita, e mais barata do que a casa temia

**Ninguém faz o ciclo completo.** Cada peça existe isolada: Superhuman/
Fyxer projetam taxonomia DELES (responder/FYI/marketing); SaneBox projeta
pastas de atenção; Reclaim projeta eventos; gmailctl versiona labels (só
devs, sem volta). **Ninguém projeta a taxonomia pessoal do usuário em
Gmail + Calendar + Drive e lê o sinal de volta pela própria lei.** A ida é
o espaço vazio da categoria.

**O mapa de escopos (doc oficial Google, jul/2026):**

| Ação da ida | Escopo | Classificação | Custo real |
|---|---|---|---|
| Criar labels no Gmail | `gmail.labels` | **non-sensitive** ✅ | quase zero |
| Calendário próprio + eventos nele | `calendar.app.created` | sensitive 🟡 | verificação gratuita |
| Pastas no Drive | `drive.file` | **non-sensitive** ✅ | quase zero |
| **Aplicar** label em mensagem | `gmail.modify` | **restricted** 🔴 | CASA anual US$ 500–4.500+ |
| Criar filtros nativos | `gmail.settings.basic` | **restricted** 🔴 | idem |
| Ler mensagens (a volta atual) | `gmail.readonly` | **restricted** 🔴 | já é o custo carregado hoje |

**Arquitetura de menor custo:** a ida v1 inteira sem NENHUM escopo
restricted novo. Aplicação de labels adiada — ou híbrida: o Atom cria a
taxonomia via API e ensina o usuário a criar 2–3 filtros nativos à mão.

**A lição de UX unânime dos precedentes:** ninguém se revolta com
estrutura criada (labels/calendários vazios) — a revolta documentada vem
de **mover/esconder conteúdo** (Fyxer "broke my Gmail", Motion
"oppressive"). Table stakes de escrever com respeito, priorizado:
1. **Namespace assinado** — `Atom/…` aninhado; nunca colidir com o que é
   do usuário (precedente: `@Sane`, `[1. Respond]`).
2. **Preview antes de criar** — "vou criar 6 labels, 1 calendário" +
   assentimento único por estrutura. Até o Google pede antes de mover.
3. **Delete é sinal, não guerra** — usuário deletou a label = comando
   (desativa aquele braço), nunca recriação silenciosa. Padrão Reclaim.
4. **Desfazer completo** — desligar o conector remove a estrutura e
   devolve o estado. A lei que entra sabe sair (padrão SaneBox).
5. **Criar estrutura ≠ mover conteúdo** — dois consentimentos separados.
6. **Reconciliação por diff** — estado desejado × real, só o delta, com
   log (padrão gmailctl).

**Riscos operacionais do regime atual (afetam "ligar na conta do Rick"):**
- **Testing mode**: refresh token expira em **7 dias** — reconsentimento
  semanal, inviável pra sync contínuo. Verificar o regime do projeto GCP.
- **Cap de 100 usuários é vitalício** no projeto não-verificado — planejar
  projeto GCP separado pra produção desde já.
- Uso pessoal (só o dono do projeto) é **isento de verificação** — o Atom
  de um usuário nunca precisa de CASA, nem com `gmail.modify`.
- Cor do calendário vive no CalendarList — confirmar em código se
  `calendar.app.created` cobre `calendarList.update` das entradas próprias.

---

## O que muda na spec da obra

1. **A ida v1 é estrutural, nunca move conteúdo** — escopos non-sensitive/
   sensitive apenas; `gmail.modify` banido até fazer sentido pagar CASA.
   Preview + assentimento; delete é sinal; desfazer completo; namespace
   `Atom/`.
2. **Higiene do sinal antes de sinal novo** — recusados/all-day/timezone/
   conflito no calendar-sync ANTES de qualquer feature nova. O hoje nunca
   mente.
3. **Assentimento mostra a leitura** — o chip do inbox exibe ritual/task e
   deixa trocar (Morgen: aprovar > automatizar).
4. **Estrela segue verdade primária**; sugestão de estrela por AI vira
   semente (não v1). Digest D66 ganha mais um motivo: é o antídoto do
   "sinal sem hábito".
5. **Regime Google entra como incerteza de obra** — testing mode (token 7
   dias) e cap 100 são decisões de infra que afetam viver a volta.

---

*Crivo D62 aplicado: categoria própria confirmada ("lente sobre X" não tem
concorrente de ciclo completo), base validada pelos cemitérios das
categorias vizinhas, furos nomeados antes do código. Os três relatórios
completos com todas as fontes estão no diário da sessão de 29 Jul.*
