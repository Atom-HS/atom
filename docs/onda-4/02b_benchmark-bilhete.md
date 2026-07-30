# Benchmark sob a lei D62 — o bilhete

*30 Jul 2026 · benchmark da obra 1 da Onda 4. Mercado 2024–2026 + evidência.
Serve à `03_spec-bilhete_v1.md`. Abre a obra porque a D62 manda: nenhuma função
executiva nasce sem a base do topo de mercado embaixo.*

**Fontes principais**

- Airship — *How Push Notifications Impact Mobile App Retention Rates*
  (`grow.urbanairship.com/rs/313-QPJ-195/images/airship-how-push-notifications-impact-mobile-app-retention-rates.pdf`)
- Localytics, via MobiLoud — *Push Notification Statistics*
  (`mobiloud.com/blog/push-notification-statistics`) e NotiGrid
  (`notigrid.com/blog/notification-rate-limiting-alert-fatigue`)
- Nielsen Norman Group 2026, banner blindness — via Userpilot
  (`userpilot.com/blog/in-app-messaging/`)
- Digia — *In-App Messaging vs Push Notifications*
  (`digia.tech/post/in-app-messaging-vs-push-notifications/`)
- Business of Apps / Airship — reação por formato
  (`businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/`)
- Appbot — *Push Notification Best Practices 2026*
  (`appbot.co/blog/app-push-notifications-2026-best-practices/`)
- Courier — *How to Reduce Notification Fatigue*
  (`courier.com/blog/how-to-reduce-notification-fatigue-...`)
- *Project Hermes* (arXiv 2602.18643) — alert fatigue em suporte clínico

---

## Veredito em uma linha por frente

| Frente | Veredito | O achado que muda a obra |
|---|---|---|
| **Raridade como regra** | ✅ mecânica confirmada, ❌ **objetivo do mercado é o oposto do nosso** | todo estudo de frequência mede retenção; a 4.1 proíbe exatamente a alavanca que eles medem |
| **Canal (in-app × push)** | ✅ **escolha certa, e por margem grande** | in-app abre ~75%, push ~20%, e in-app não gasta permissão |
| **Formato** | ⚠ **risco estrutural não previsto pela lei** | banner é o formato de pior reação e o alvo da cegueira reflexa; a lei pode estar certa e o bilhete morrer mesmo assim |
| **Silêncio** | ⚠ risco real, **já coberto pela D66** | zero mensagem correlaciona com churn altíssimo — mas o digest é a boca periódica, não o bilhete |
| **Cadência × evento** | ✅ **à frente** | a recomendação de ponta é disparar por comportamento e contexto, nunca por agenda arbitrária — é a D75 e o § 4.2 do parecer, ditos de fora |

---

## 1 · A raridade — a mecânica confirma, o objetivo colide

Os números de tolerância são mais duros do que a lei supunha, e vêm de survey,
não de opinião: **46% dos usuários desativam ao receber de 2 a 5 mensagens numa
semana**; 32% desativam entre 6 e 10 (Localytics). E **60% desativam
completamente por alertas irrelevantes** — irrelevância, não volume, é a causa
citada.

O teto praticado no mercado consumidor é de 1 mensagem não-transacional por dia,
com cap global de 3 por 24h; produtividade e fintech ficam em 1 a cada 1–2 dias.
O sinal de que o teto foi ultrapassado é a taxa de opt-out em 7 dias subindo.

A 4.1 opera **duas ordens de grandeza abaixo** disso — um bilhete a cada poucas
semanas. Pela mecânica, estamos seguros com folga enorme.

**Mas a colisão é de propósito, não de número.** Todo estudo acima mede
*retenção*: mensagem semanal rende 440% mais retenção que zero, uma única
mensagem rende 120% mais (Airship). A alavanca que produz esses números é
exatamente o que a 4.1.1 proíbe — streak, re-engajamento, lembrete de existir,
comentário sobre o comportamento do usuário. O candidato #11 do Teste 02 (*o
bilhete lembrando de existir*) é, no mercado, uma **prática recomendada de
win-back**.

**O que importamos:** os limiares, os formatos, a taxonomia de tiers.
**O que recusamos:** a função-objetivo. `[PARECER]`

Isto não é o crivo sendo dispensado — é o crivo aplicado com o alvo certo. A D62
manda funcionar no nível do melhor software da categoria; a categoria do bilhete
não é *notificação de engajamento*. É mais próxima do alerta clínico, onde a
literatura mede a coisa certa: profissionais ignoram entre 49% e 96% dos alertas
de decisão clínica, e o desenho que funciona é o de gatilho conservador — no
estudo Hermes, 0,78 sinal por dia foi descrito como taxa administrável, e ainda
assim é **vinte vezes** mais frequente que o nosso.

## 2 · O canal — in-app é a escolha certa, com margem

Diferença consistente na literatura: **mensagem in-app abre em torno de 75%,
push em torno de 20%**. A razão é estrutural, não de conteúdo: o in-app fala com
quem já está dentro, não exige permissão do sistema operacional, e não passa por
infraestrutura de terceiro.

E há o risco de contaminação, que confirma a Parte 5.4 da lei por outro caminho:
quando mensagem de baixa prioridade desce por canal de alta urgência, a confiança
quebra — e o usuário **não desativa seletivamente, desativa tudo** (Appbot).

**Consequência para nós:** o bilhete no in-app e o push nos três casos da 4.5 não
são só duas superfícies com leis diferentes. São dois canais com custos de erro
diferentes, e misturá-los derruba o mais barato junto com o mais caro.

## 3 · O formato — o risco que a lei não prevê

Este é o achado que muda a spec.

A atualização de 2026 da pesquisa de *banner blindness* do Nielsen Norman Group
registra que usuários hoje **pulam banners por reflexo**, em desktop e mobile,
com taxas de detecção abaixo das de uma década atrás. A dispensa virou hábito, não
avaliação — o usuário não decide ignorar, ele já ignorou.

Por formato, a reação medida (Airship): interstitial 35% · caixa de alerta 18,3%
· **banner 12,5%**.

**O problema:** a Lei do Tom legisla o conteúdo com rigor extremo e é **muda sobre
o formato**. Um bilhete que passa nas seis condições, renderizado como banner no
topo da face, é dispensado por reflexo antes de ser lido. O trabalho inteiro da
lei morre num componente. `[PARECER]`

Isso não se resolve com mais lei de tom. Resolve-se com uma regra de superfície,
e ela está na spec (§ 4).

## 4 · O silêncio — o risco oposto, e por que ele não é do bilhete

O contrapeso honesto: **95% dos usuários que aceitaram notificação e não
receberam nenhuma abandonaram o app em 90 dias** (Airship). É o mesmo achado do
benchmark `09` sobre o cofre — *Life OS morre quieto*.

Mas o risco não pertence a esta obra. A D66 já criou a boca periódica: o digest
das 07:15, na voz do E., só quando há banda mudando. **O bilhete pode ser raro
porque o digest existe.** Se algum dia o digest for desligado, a raridade do
bilhete passa a ser exposição, e a 4.1 precisa ser relida junto.

Registro como condição, não como ressalva: *a raridade do bilhete depende da
existência de uma boca periódica*. `[PARECER]`

## 5 · Cadência × evento — onde já estamos à frente

A recomendação de ponta é disparar por comportamento e contexto e não por agenda
arbitrária; a formulação corrente é que a mensagem certa na hora errada continua
sendo a mensagem errada (Appcues). E a prática de *batching*/digest é recomendada
justamente por atacar a causa principal de opt-out, que é a **contagem bruta de
interrupções** (Courier).

Isso valida, de fora, três coisas que a casa já decidiu: a D75 (banda, não prazo),
a fronteira digest × bilhete do § 4.2 do parecer, e a proibição de cadência do
veto V2.

**Table stake que não temos:** nenhuma medição. A literatura inteira mede taxa de
dispensa e opt-out em 7 dias como sinal precoce. Nós não temos nem o evento de
leitura. Entra na spec como requisito mínimo (§ 6).

---

## O que muda na spec 03

1. **Uma regra de formato**, que a lei não tem — o bilhete não pode ser banner
   dispensável (§ 4 da spec).
2. **Instrumentação mínima obrigatória** desde o primeiro disparo: nasceu, foi
   exibido, foi visto. Sem isso, o gatilho de revisão da Parte 6 é inauditável.
3. **A raridade fica condicionada à existência do digest** — vira nota de
   dependência, não pressuposto silencioso.
4. **Confirmação sem mudança:** gatilho por evento, canal in-app, separação
   estrita do push. Os três já estavam certos.

---

*Benchmark D62 — obra 1 · E. · 30 Jul 2026*
*A mecânica do mercado importa-se; a função-objetivo dele, não.*
