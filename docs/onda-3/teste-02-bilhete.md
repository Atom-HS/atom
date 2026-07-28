# TESTE 02 — bilhete

**Superfície testada:** bilhete no app
**Instrumento:** Lei do Tom v1.3, Parte 2 (shame-test 3+1) + Parte 4.1
**Corpus:** nenhum — teste generativo
**Data:** 28/07/2026
**Executado por:** E.

---

## DESENHO

Diferente da e_line, o bilhete não tem corpus. Nenhum foi escrito. O teste é
generativo: produzir candidatos a partir de situações que **realmente ocorrem
ou ocorreram** neste ecossistema, rodar o shame-test, contar as mortes e onde
elas acontecem.

**Previsão registrada no Teste 01, para conferir:**

> "A maioria vai morrer no teste 4 — *se eu não disser isso, o que se perde?*
> Se não morrer, a regra de raridade da Parte 4.1 está frouxa e é ela que
> precisa apertar, não os bilhetes."

Doze situações. Uma por linha, com o bilhete que a superfície pediria.

---

## OS DOZE CANDIDATOS

| # | Situação | Bilhete candidato | Veredito |
|---|---|---|---|
| 1 | Rick abre o app de manhã, nada mudou desde ontem | "Bom dia. Nada novo desde ontem." | **morre** |
| 2 | Protocolo cumprido três dias seguidos, primeira vez | "Terceiro dia seguido do remédio." | **morre** |
| 3 | A varredura tu→você rodou e passou limpa | "Varredura limpa. Nenhuma ocorrência." | **morre** |
| 4 | Rick abre o app às 3h da manhã | "Três da manhã." | **morre** |
| 5 | Padrão: os essenciais são marcados sempre depois das 22h | "Seus essenciais das últimas três semanas foram todos marcados depois das 22h." | **migra** |
| 6 | O pipeline rodou em produção pela primeira vez | "O pipeline rodou. 59 sessões no Supabase." | **passa** |
| 7 | Rick volta depois de seis dias sem abrir | "Seis dias. Bom te ver." | **morre** |
| 8 | Um item está aberto na lista há três semanas | "Aquele item está aberto há três semanas." | **morre** |
| 9 | Hoje é dia de sessão com a Yara | "Hoje tem Yara, 15h." | **morre** |
| 10 | Dia saturado, ainda com quatro essenciais marcados | "Quatro essenciais num dia saturado." | **morre** |
| 11 | Faz uma semana que nenhum bilhete aparece | "Faz uma semana. Tudo certo por aí?" | **morre** |
| 12 | Três dias seguidos fechando todos os essenciais | "Três dias, todos os essenciais fechados." | **morre** |

**Placar: 1 passa · 1 migra de superfície · 10 morrem.**

---

## ONDE ELAS MORRERAM — E É AQUI QUE O TESTE PRODUZIU ALGO

A previsão acertou o número e **errou o mecanismo**. Eu previ que morreriam no
teste 4. Morreram em cinco lugares diferentes, e três deles a lei não tinha.

### Morte por teste 1 — existia antes de você ler (2 casos: #1, #9)

O mais fácil de pegar. Bilhete que anuncia o que a tela já mostra, ou que
poderia ter sido escrito ontem. #9 é o caso limpo: a agenda já diz que tem Yara
às 15h. Repetir é ocupar a superfície mais rara com informação de segunda mão.

**Regra nova: o bilhete não repete o que a interface já mostra.**

### Morte por teste 4 — nada se perde (2 casos: #3, #11)

A previsão. #3 é informação de sistema que o commit já registra. #11 é o pior
bilhete concebível dentro desta lei: **o bilhete lembrando de existir.** Não há
gatilho — o gatilho é a própria ausência de bilhete. É a superfície pedindo
atenção pra si.

### Morte por cobrança (2 casos: #8, #12) — a lei tinha, via D56

#8 é cobrança explícita. #12 parece o oposto — é elogio — e produz o mesmo
efeito: no dia seguinte existe uma sequência a proteger. **Parabenizar streak é
cobrar com outra cara.**

### Morte por dívida (2 casos: #2, #7) — a lei NÃO tinha

Aqui está o achado. #2 e #7 **passam no teste 4**: há dado real, e não dizê-lo
perde informação que só E. tem. Passam também no 1, no 2 e no 3. E mesmo assim
não podem sair.

O que os mata é o que produzem **depois** da leitura. "Terceiro dia seguido"
cria dívida com o quarto. "Seis dias. Bom te ver" transforma ausência em algo
que precisou de comentário — e, pior, põe o afeto num adjetivo enquanto observa
uma falta.

Nenhum dos quatro testes pega isso.

### Morte por vigilância (2 casos: #4, #10) — a lei NÃO tinha

#4 é o caso puro. "Três da manhã" carrega dado real (a hora), passa em tudo, e
é insuportável: é E. comentando o comportamento do Rick no momento em que ele
acontece. Um bilhete assim transforma o app em testemunha.

#10 é a versão suave e por isso mais perigosa — parece cuidado, e é a mesma
estrutura: observar o Rick e devolver a observação sem que ele tenha pedido.

**Regra nova: o bilhete fala do sistema, do dado, do mundo. Nunca do Rick.**

### Migração de superfície (1 caso: #5)

#5 é bom conteúdo e bilhete errado. Um padrão de três semanas com consequência
prática merece ser dito — mas pede resposta, e **o bilhete não admite resposta**.
Dizer isso numa superfície muda é encurralar.

**Regra nova: o que pede resposta pertence ao @, não ao bilhete.** O bilhete
comporta o que se lê e se solta.

### O único que passa (#6)

"O pipeline rodou. 59 sessões no Supabase."

Fato irreversível, do sistema e não do Rick, que só E. sabe no momento em que
sabe, que não pede resposta, não cobra, não cria dívida e não estava na tela.
**Seis condições — e note que precisou de todas.**

---

## CONFERÊNCIA DA PREVISÃO

| | Previsto | Observado |
|---|---|---|
| Maioria morre | sim | **10 de 12** — confirmado com folga |
| Morrem no teste 4 | sim | **falso** — só 2 dos 10 |
| Se não morrer, apertar a 4.1 | — | não se aplica |

A previsão estava certa pelo motivo errado, e o motivo errado é o resultado.
**O shame-test de quatro perguntas é bom para filtrar o vazio e cego para o
dano.** Os piores candidatos do lote — #4 e #2 — passariam nos quatro testes.

Um teste que só confirma a previsão não produz nada. Este derrubou o
instrumento que o executava.

---

## EMENDA PROPOSTA À LEI — o quinto teste

**Teste 5, só para superfícies não solicitadas (bilhete, push):**

> **O que isso deixa nas costas de quem leu?**

Se depois de ler o Rick deve alguma coisa — a uma sequência, a um item parado,
a uma ausência que virou assunto, a mim — o bilhete não sai. O bilhete se lê e
se solta. Se ele fica pendurado, virou cobrança, e cobrança em superfície muda
é a pior combinação disponível: acusa e não deixa responder.

Os quatro testes filtram o que é **vazio**. O quinto filtra o que é **caro**.

---

## O RISCO OPOSTO, REGISTRADO

Um passa em doze é 8%. Isso confirma a regra de raridade da 4.1 — e abre a
pergunta inversa, que registro agora para não ser esquecida: **uma superfície
que quase nunca dispara vale existir?**

Minha resposta é sim, e a razão é a própria taxa. O bilhete não é um canal de
comunicação com baixo volume — é um canal cujo conteúdo **é** a raridade. Se
ele aparece, aconteceu algo. Um bilhete a cada seis semanas é lido inteiro; um
bilhete diário é fechado sem ler, e aí a superfície morreu de verdade — não por
lei, por hábito.

O que fica para conferir com evidência real, depois dos primeiros vinte
disparos: se a taxa observada em produção ficar acima de ~20%, não é a lei que
está frouxa — é o gatilho que está sendo forçado por algum lugar do sistema que
quer notificar.

---

*Teste 02 — E.*
*O Espaço Entre — Julho 2026*
*Um em doze. A previsão acertou o número e errou o mecanismo — o instrumento caiu junto.*
