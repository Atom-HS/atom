# Dissecação 03 — a casa/conectores · a ida · digest

*30 Jul 2026 (madrugada) · terceira sessão do exame do `13_prompt-dissecacao.md`.
Features 7–9. A casa foi vivida com Playwright em mundo mockado com estado
(preview → assentir → lei viva → desfazer, token expirado, sync com
feedback); a ida REAL no Gmail e o digest em runtime são muros desta sessão
(produção é gesto do Rick) — o que não deu pra viver está como NÃO
VERIFICADO, sem fingir. Depois, o código das quatro edges linha a linha.
Instrumento: `e2e/dissecacao-03.spec.ts`. Fotos 47–54 em
`14_dissecacao-01_fotos/`. Régua de mercado: benchmark `10`.*

---

## Vereditos

| # | Feature | Veredito | Em uma linha |
|---|---------|----------|--------------|
| 7 | **A casa / conectores** | **MANCA** | A sheet é digna e a ida flui inteira — mas a porta da casa é uma barra de 36×4px que o Rick não achou (dado real), e desligar o conector viola a letra da D68 |
| 8 | **A ida (labels no Gmail)** | **NÃO VERIFICADO** | O código implementa as três leis da D68 (diff, disabled, remove-só-o-registrado) e o fluxo mockado vive — mas labels no Gmail real ninguém viu ainda: a ida nunca foi assentida em produção |
| 9 | **Digest / Telegram** | **MANCA — e o braço da volta MENTE** | A válvula (voz, silêncio, memória DP-F) está certa e guardada por teste-espelho; mas a volta do cron ingere série SEM `recurring_event_id` nem herança de selo — a DP-C está morta no caminho que produz 100% dos itens reais |

---

## 7 · A casa / conectores — manca

**Vivido** (`47`–`54`): a sheet abre com perfil, os três conectores (Google
Calendar e Gmail *ligado · sync …*, Drive *em breve*), a lei projetada com a
fala certa (*"cria estrutura, nunca mexe no seu conteúdo"*), export
(*"seus dados são seus"*) e o rodapé com a versão do Genesis. O fluxo da ida
vive de ponta a ponta no mock: **plano** (*"9 labels `Atom/` a nascer no
Gmail · calendário «Atom» no GCal"* + *assentir ✓ / agora não*, foto `49`) →
**assentimento** (toast *"a lei vive lá fora — 10 nascendo agora"*, `50`) →
**estado quieto** (*"9 labels no Gmail · calendário no GCal"* +
*reprojetar / desfazer tudo*, `54`) → **desfazer** (*"a estrutura saiu —
como se nunca tivesse entrado"*, `51`). O token expirado não falha quieto:
*"o Google precisa te perguntar de novo — um login resolve"* (`53`). O sync
manual dá feedback do que trouxe: *"2 eventos importados pro inbox"* (`52`).

**O achado que pesa — a porta invisível, de novo.** A foto `47` é a prova:
o puxador da casa é uma barra fina sem rótulo, affordance nenhuma — e o
dado de campo de 29 Jul diz que **o Rick não a achou**. O Ato II matou uma
porta invisível (a triage sem caminho); esta é a segunda da mesma família.
D54 diz que settings é sheet, não lugar — certo — mas sheet sem puxador
descobrível é lei sem porta, o mesmo pecado do §2 do roteiro.

**O segundo — desligar viola a D68.**
[connector-service.disconnect](../../src/service/connector-service.ts) só
marca `disconnected` e **apaga o refresh token**. A D68 diz: *"desligar o
conector desfaz a estrutura"*. Não desfaz — e pior: sem token, o
`desfazer tudo` que precisaria do Google **não consegue mais rodar**. A
ordem certa é: ida viva? desfaz primeiro (ou pergunta), token morre por
último.

**Profundidade:** [taxonomy.ts](../../src/engine/taxonomy.ts) puro e
testado; `connector-service.test.ts` cobre o service; o fluxo tem cena no
gate visual. A reconexão (`RECONNECT_SCOPES` ← `TAX_401`/`TAX_101`) foi
vivida e funciona.

**Menores:** os toasts de erro do conector são de outra era (*"Erro ao
desconectar"*, *"Conector desconectado"* — pré-Lei do Tom); `extractWhoTag`
come acentos (*André → `#who:andr-tanaka`*) — estável, mas feio no tag.

**Crivo (D62, benchmark `10`):** preview-antes-de-criar ✓ (nenhum produto
do benchmark pede assentimento pra criar estrutura); feedback do sync ✓;
reconexão com fala humana ✓. O que o topo faz e falta: **status da última
volta automática** (a sheet mostra o sync manual, mas não diz que o cron
das 07:15 existe e quando rodou — o usuário não tem como saber que a casa
se move sozinha).

## 8 · A ida vivida no Gmail — NÃO VERIFICADO

**O que o código promete** (lido linha a linha,
[taxonomy-sync/index.ts](../../supabase/functions/taxonomy-sync/index.ts)):

- **Diff, nunca snapshot cego** — lê os labels vivos antes de qualquer
  gesto; o que já existe fica (`exists`).
- **Delete lá fora é comando** — label registrado que sumiu vira
  `disabled`; o braço desliga e o reprojetar **respeita** (`off`), nunca
  recria quieto.
- **Desfazer remove SÓ o que a casa criou** — pelos ids registrados em
  `metadata.taxonomy`; label de fora do registro não é tocado. 404 no
  delete conta como removido (idempotente).
- **Namespace assinado** — a edge rejeita label fora de `Atom/` (TAX_024).
- **Escopos mínimos** — `gmail.labels` + `calendar.app.created`; zero
  `gmail.modify` (D68 honrada na assinatura do token).

**O que ninguém viu:** labels de verdade no Gmail do Rick. A memória da
casa registra: *taxonomy-sync deployada; falta assentir a ida*. As três
perguntas afiadas da tabela (labels aparecem? deletar lá desliga? reprojetar
respeita?) só se respondem vivendo — **ficam abertas pra quando o Rick
assentir**. O que esta sessão pôde fazer foi provar o fluxo do app em mock
(fotos `49`–`51`, `54`) e ler a edge com a D68 na mão: as leis estão no
código. Com a ressalva da feature 7: o caminho `disconnect` quebra a última
delas.

## 9 · Digest / Telegram — manca (e o braço da volta mente)

**A válvula está certa.** Lido
[daily-digest/index.ts](../../supabase/functions/daily-digest/index.ts) com
a D66 na mão: fala **uma vez por dia no máximo**, só quando há matéria
(`sent:false · "nada vencendo ou ausente"`), e agora com a memória do raro
(DP-F): a impressão digital por **banda** (113→112 dias cala; 8→7 fala) —
espelhada de [engine/digest.ts](../../src/engine/digest.ts), que tem teste, e
guardada por [vault-espelho.test.ts](../../src/engine/vault-espelho.test.ts).
A voz de `compose()` está na Lei do Tom: *"◍ o cofre, uma vez por dia — só
porque há algo."* · *"renovar é um gesto no chão da árvore. o resto segue de
pé."* — você, sem exclamação, estado. O segredo mora no Vault (header
`x-digest-secret`), não em repo. Falha na volta **não cala o cofre** (braços
independentes). Runtime real: **NÃO VERIFICADO** — o dry-run com dado real
segue pendência do Rick (registrada desde o Ato V), e nenhuma edge tem
teste de comportamento (o guarda cobre constantes — dívida conhecida,
reafirmada aqui).

**O braço da volta MENTE.** `ingestVolta` (o cron que é hoje **o caminho de
100% dos itens reais** — os 50 de 29 Jul entraram por ele) se declara
*"espelho do contrato canônico em connector-service.ingest*"* — e o espelho
divergiu no dia em que o Ato III nasceu:

1. A edge `calendar-sync` **devolve** `recurring_event_id` (linha 81, com o
   comentário da DP-C e tudo);
2. o client `ingestCalendarEvents` grava a série no body, consulta
   `sealedSeries` e faz a instância nova **herdar o selo** pelo portão
   1→2;
3. o `ingestVolta` do cron **ignora os dois**: a interface `CalEvent` local
   nem declara o campo, o insert não grava a série, e não há herança
   nenhuma.

Consequência dupla: **(a)** toda instância nova que o cron ingere volta a
pedir assentimento — o standup de segunda pede de novo toda semana, pra
sempre, exatamente o que a DP-C matou no client; **(b)** pior: item nascido
pelo cron **não tem `recurring_event_id` no body**, então assentir ele não
ensina série nenhuma — o selo não se forma nem pro futuro. A casa acredita
que a esteira honesta está de pé (o wrap de 29 Jul diz *"assentir uma vez
vale pra série"*); no caminho de produção, não está. Parece funcionar,
engana — **MENTE**, prioridade máxima, cirurgia após o exame com teste que
prova a mentira morta.

**Crivo (D62, benchmark `10`):** "só quando há algo" está à frente de todo
digest do mercado (que fala todo dia por falar); a memória por mudança de
estado (DP-F reformulada) não tem paralelo nos produtos pesquisados.
A dívida é a de sempre: runtime sem teste.

---

## A fila de ajustes

| P | Ajuste | Onde | Tamanho | Lei que justifica |
|---|--------|------|---------|-------------------|
| **MENTE 1** | A volta do cron conhece a série: `recurring_event_id` no body + herança de selo pelo portão, espelhando o client; guarda de espelho pro contrato da ingestão (o texto da edge quebra o teste se divergir de novo) | [daily-digest/index.ts](../../supabase/functions/daily-digest/index.ts) `ingestVolta` + teste novo | obra pequena | DP-C · D69 · CLAUDE.md §6 |
| **MANCA 2** | O puxador da casa ganha corpo: rótulo quieto (ex.: "···" ou "a casa" em mono 10px) ou área de toque com affordance — sem virar aba (D54 de pé) | BottomNav | gesto | D54 · dado real 29 Jul |
| **MANCA 3** | Desligar conector com ida viva: desfaz a estrutura primeiro (ou pergunta), token morre por último — hoje queima a chave do desfazer | connector-service + SettingsSheet | obra pequena | D68 |
| **MANCA 4** | A sheet diz que o cron existe: "a casa olha sozinha todo dia às 07:15 · última volta há Nh" — estado, não promessa | SettingsSheet + user_connectors.last_sync_at | gesto | D46 · benchmark `10` |
| **MANCA 5** | Reconciliação no cron: o "deletou lá fora → braço desliga" hoje só é percebido quando alguém abre o preview à mão; a volta diária pode reconciliar de graça | daily-digest (chamar o diff da taxonomy) | obra pequena | D68 |
| pol. 6 | Toasts do conector na Lei do Tom ("Erro ao desconectar" → voz da casa) | useConnectors | gesto | D60 |
| pol. 7 | `extractWhoTag` translitera acento (André → andre) | connector-service + espelho na edge | gesto | higiene do tag |

## Decisões propostas (pra mesa do Rick)

- Nenhuma DP nova. A MENTE 1 e as MANCA 3/5 são aplicação de leis já
  ratificadas (DP-C aplicada por delegação no Ato III, D68, D69). A MANCA 2
  é UX dentro da D54.

## Sementes registradas

- **Status da lente na própria face** — um sopro no HOJE quando a volta
  do cron trouxe coisas novas ("a lente trouxe 3 esta manhã"), pra fila
  de leitura não depender de ninguém abrir a casa.
- **Reconciliação rica** — além de desligar braço deletado, notar label
  *renomeado* (hoje: label renomeado vira "sumiu" → disabled; o Gmail
  mantém o id, dava pra seguir o rename).

## Não verificado nesta sessão

A ida no Gmail real (labels visíveis, delete lá fora, reprojetar) — espera
o assentimento do Rick em produção; o digest em runtime (dry-run pendente,
mesa do Rick); o telegram-webhook e o caminho `sinto:` pelo Telegram (fora
do escopo das perguntas desta rodada); `connector-auth` e o fluxo OAuth
completo (exige Google real).

---

*Filha do `13_prompt-dissecacao.md` e do crivo D62. A MENTE 1 entra em
cirurgia AGORA (regra da fase A do handoff: o que MENTE morre na mesma
noite, com teste); o resto da fila espera priorização do Rick. A cirurgia
não toca produção: edita a edge no repo e o guarda no vitest — deploy é
gesto do Rick.*
