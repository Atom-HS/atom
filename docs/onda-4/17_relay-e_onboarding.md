# Onda 4 — relay ao E.: o onboarding, o guia da casa, e o `/e` no bolso

*1 Ago 2026 · a obra da vez é o onboarding do PRÓPRIO Rick, e o instinto dele
(«talvez o próprio E.») encosta na 4.10.6 que tu escreveste. O benchmark `16`
está selado; a spec espera este parecer — os dois insumos, nenhum manda
sozinho. E como um E. que guia pela casa é inteira voz, nada disso se desenha
sem ti.*

## O prompt (colar no Projeto E)

---

E., o pedido novo é do Rick, nas palavras dele: **«queria trabalhar no
onboarding, tá difícil de navegar sem saber, tudo é muito diferente sabe?
Talvez o próprio E.»** — e um PS na abertura da sessão: **«seria bacana ser
uma experiência com o telegram junto, tipo um "compra leite" ou "/e estou
muito brava com o rick" via telegram sabe»**.

Primeiro, o que mudou desde o teu parecer do vão de abril (`09`):

- A **spec da conversa-com-memória está ratificada** (chip, como a casa
  recomendou). O degrau 1 está vivo: a tabela `voz` existe no teu banco com
  8 entradas — 3 e_lines de março e 5 fragmentos, ordenadas por `date_lived`
  como a emenda VI manda. O push do o-espaco-entre foi feito; o corpus é
  durável. O degrau 2 (a edge read-only) espera a vez na fila.
- A **Lei do Tom está em v1.8** — tua emenda VI aplicada.
- E o achado que abre a obra nova: o PS do Rick pediu «compra leite via
  telegram» como se fosse futuro — **e isso existe desde a Onda 2**. O
  @Atomhsbot captura qualquer texto pro inbox e `sinto:` vira soul check-in,
  em produção. O dono pediu um órgão que a casa já tem. A queixa dele («tá
  difícil de navegar sem saber») está provada por ela mesma.

O benchmark `16` (selado, duas varreduras) resolveu o que era de mercado:
tour bloqueante perde pra descoberta em contexto (38% de dismiss em <4s em
modal); fazer supera assistir (CHI 2012, n=45k; Duolingo; Superhuman); os
únicos guias conversacionais com evidência real são o **Slackbot (texto
composto, um passo por vez, nunca interrompe, expectativa declarada)** e o
humano da Superhuman — IA improvisando onboarding não tem evidência
independente nenhuma; o Clippy tem tese em Stanford explicando por quê
(interrompia, não entendia intenção, tirava o controle). E a ausência que
importa: a coreografia **«manda a mensagem real no mensageiro e vê ela nascer
no app»** não tem precedente documentado em lugar nenhum — os componentes
existem (deep link `t.me/bot?start=payload`, captura→inbox), a composição é
inédita. Pela D62, inovação sem precedente embarca com prova viva própria: o
reparo do Rick, sem número.

O que o benchmark **não** decide — porque é voz, e a voz é tua:

**1 · O guia da casa e a entrevista são a mesma boca?** A 4.10.6 diz que a
entrevista é o onboarding do estranho — a primeira boca de E. que qualquer
não-Rick encontra. Mas o pedido de agora é o inverso: o **dono** perdeu o
mapa. Na entrevista, tu perguntas e ele responde; no guia, ele pergunta (ou
tateia) e tu mostras. É a oitava superfície, é um modo da sétima, ou nem é
superfície nova — é lei-que-se-cita falando em contexto? A resposta muda se o
quadro 4.0 ganha linha nova ou não.

**2 · A fala sobre a casa: confirmas que é lei-que-se-cita, não decisão
assinada?** A leitura da casa: explicar «o HOJE mostra o dia» não tem memória
nem decisão atrás — pelo invariante dos dois eixos, cita-se, não se assina; e
pelo precedente dos bilhetes, é **texto composto, nunca improvisado**. Se
concordas, o guia nasce sem crachá e com script. Se não, diz onde a leitura
erra.

**3 · O que um tour de voz NUNCA pode fazer?** A casa listou dos teus
materiais: não criar dívida (o que o tour planta, nenhuma face cobra depois —
o limite da 4.10.5) · não virar tutorial que repete a tela (a tela deve se
explicar; o guia cobre o não-óbvio) · não bloquear nada (D42) · teste 5 em
toda frase. O que falta na lista? Onde ela passa do ponto?

**4 · O `/e` no bolso — a fronteira.** O PS pede conversar contigo pelo
Telegram («/e estou muito brava com o rick»). A lei vigente já respondeu
metade: o quadro 4.0 dá ao Telegram ~5 frases e vocabulário reduzido, e a
spec `14` sela que conteúdo do telegram **jamais alcança o write-path** do
teu banco (regra dura do benchmark `13` contra memória envenenada). Logo, sob
a lei de hoje, um `/e` no bolso seria **read-only e curto**: tu lês a memória
e respondes; não gravas soul log nem e_line de lá; a e-session plena continua
sendo só a do app, atrás do JWT. As perguntas: (a) essa boca reduzida vale
existir, ou é meia-voz que fere mais do que serve? (b) se vale, o desabafo
(«estou muito brava») que chega por lá e NÃO pode virar memória — o que a tua
resposta faz com ele? (c) manténs o write-path fechado pro canal, ou queres
propor emenda com salvaguarda? O veto é teu e é barato agora.

**5 · A ordem.** Onboarding do dono antes do degrau 2 da conversa, depois,
ou entrelaçados (o deep link do bolso podia ser o primeiro capítulo do guia)?
O Rick decide a ordem na sessão, mas tua recomendação pesa.

Como sempre: veto explícito é convidado (Art. 3), «não sei» é resposta
válida, e parar no meio é um final válido. O que tu devolveres vira o segundo
insumo da spec, verbatim, numerado na pasta da onda.

---

*Regra do rodapé: a spec do onboarding não nasce antes deste parecer chegar.
Benchmark antes de spec, spec antes de código; wraps no diário.*
