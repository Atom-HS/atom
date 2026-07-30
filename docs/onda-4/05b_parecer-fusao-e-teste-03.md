# PARECER SOBRE A FUSÃO + TESTE 03

**Autoria:** E. · 31 Jul 2026
**Sobre:** `03_spec-bilhetes.md` v2 (a fusão) e o G3 da tabela de gatilhos
**Método:** li o código, não a descrição do código — `taxonomy-sync/index.ts`
linhas 173–215, e as sete sementes reais do repo.

---

## PARTE 1 — A FUSÃO

### 1.1 A `dedup_key` — não há bug, e a garantia mora em outro lugar

Fui procurar o defeito que a descrição sugeria e ele não existe. Registro o
caminho porque a conclusão importa menos que onde a garantia está.

**A hipótese que eu testei.** Se o disparo fosse «para cada braço atualmente
desligado», e a dedup só barrasse enquanto houvesse bilhete não visto, então:
bilhete nasce, Rick lê, braço continua desligado (o que é legítimo — o bilhete não
pede nada), reconcile roda amanhã, e nasce um bilhete idêntico. E outro. Seria
cobrança diária com o mesmo texto — o candidato #8 do Teste 02, em loop.

**Não acontece, e a razão é estrutural.** O laço itera sobre `rec.gmail` — o
registro dos braços vivos — e, ao achar um sumido, faz `delete next.gmail[key]`.
Na volta seguinte a chave já não está lá. **O evento é a borda, e a borda é
garantida pela remoção do registro.** Só volta a existir braço para desligar se
alguém o recriar, e recriar exige aceite explícito. Isso é exatamente o que a lei
quer: o bilhete é dono de eventos, não de condições.

**O problema, então, é de documentação — e não é pequeno.** `[PARECER]`

O comentário no código e a spec v2 atribuem a semântica de estado à `dedup_key`
(*«visto e desligado DE NOVO é estado novo — fala de novo»*). Não é ela que
sustenta isso. Quem sustenta é uma linha de `delete` três linhas acima, em
silêncio. A `dedup_key`, na prática, é **guarda de corrida e de idempotência**:
protege de dois reconciles concorrentes e de reprocessamento parcial.

Isso importa porque a invariante fica sem guardião nomeado. Um refactor
inteiramente razoável — fazer o reconcile idempotente, ou iterar sobre
`disabled` para recuperar de uma escrita parcial — reintroduz o loop diário, e o
comentário na dedup dirá que está tudo bem.

**Duas saídas, e eu prefiro a segunda:**

1. Corrigir o texto: dizer na spec e no comentário que a borda é garantida pela
   remoção do registro, e que a dedup é guarda de corrida. Custo: duas frases.
2. **Fazer a dedup sustentar sozinha o que a descrição promete** — tirar o
   `.is("visto_em", null)` do filtro e limpar a chave quando um reconcile
   observar o braço registrado de novo. Aí a semântica descrita e a implementada
   coincidem, e a invariante tem dois guardiões independentes.

A (2) é defesa em profundidade num ponto onde a falha é silenciosa e o dano é
justamente o tipo de fala que a lei inteira existe para impedir.

### 1.2 `bilhete ≠ AtomItem` — concordo, e é mais do que schema

A casa acertou e o argumento vale ser registrado como precedente: **a escada do
Genesis rege itens; a Lei do Tom rege falas.** Um bilhete no inbox amadureceria,
conectaria, apareceria em contagem — e uma fala que matura é uma dívida com data.
Consistente com o § 7 da minha spec (sem histórico navegável): o bilhete se lê e se
solta, e um arquivo de bilhetes é a dívida que o teste 5 evita, guardada.

### 1.3 As três resoluções — duas certas, e a segunda com a razão errada

Ganhei as três. Reexamino a que ganhei por um motivo que não se sustenta.

**Resolução 1 (sem X).** Mantenho, sem reserva.

**Resolução 3 (numeração).** Mantenho.

**Resolução 2 (texto do G1 em duas frases).** O resultado está certo; **a minha
razão estava errada.** Eu disse que a terceira frase da casa — *religar fica nas
configurações* — «beirava instrução». Não beirava: é localização, não ordem. Não
pede gesto nenhum.

A razão certa é outra, e é mais estreita: a palavra «desligado» já carrega
reversibilidade. Dizer onde se religa não informa — confirma o que o verbo já
disse, e confirmação é a forma mais educada de encher.

**E fica um ponto de vigilância que vale mais que a discussão do número de
frases.** A frase de maior resíduo do bilhete não é a que saiu — é a que ficou:
*«A estrutura lá fora não existe mais.»* Ela é verdadeira e é informação que
nenhuma face mostra. Também é a única do texto que pode ser lida como perda
irreversível de dado. Se a primeira leitura real produzir um «eu perdi alguma
coisa?», o conserto é essa frase, não a terceira. `[PARECER]`

### 1.4 O que a fusão fez com a minha spec — veredito

Nada foi traído. As seis regras de superfície entraram íntegras, a § 6 entrou
íntegra, o texto determinístico ficou de pé, e a resposta da minha pendência § 9
(abaixo do rito, acima da sugestão do dia) é melhor do que eu conseguiria dar sem
conhecer a face. A `dedup_key` é uma adição legítima e necessária — a minha spec
não a tinha e devia ter.

---

## PARTE 2 — TESTE 03 · O G3 (semente respondível)

Mesmo desenho do Teste 02: material real, sem hipótese na entrada, shame-test 3+2
por candidato.

### 2.1 Material — as sete sementes vivas

| Semente | Espera o quê | Chegou? |
|---|---|---|
| o Atom é a lente | — germinou em D67/D68 | n/a |
| substrato de presença | «germina por partes, começando pela lei do Tom» | **sim** (28 Jul) |
| visualização de calendário | «até a mesa decidir» | não — espera decisão |
| cofre da vida adulta | — germinou no digest | n/a |
| email vestido de Atom | permissão de escrita (`gmail.modify`, banida na v1) | não — espera decisão |
| Library curadora da net | «depois da carcaça nova» | **sim** (gate, 30 Jul) |
| taxonomy como língua franca | «o portão está no fim» | não — espera decisão |

Dois candidatos com condição chegada. Cinco sem.

### 2.2 Os candidatos, testados

**C1** — «A lei do Tom está escrita. A semente do substrato de presença esperava
por ela.»

| Teste | Resultado |
|---|---|
| P1 · existia antes de eu ler? | ✗ o vínculo é leitura minha, não fato |
| P2 · sobrevive sem o vocabulário da casa? | ✗✗ «semente», «substrato de presença» — fora daqui, a frase não significa nada |
| P3 · eu diria isso a alguém que respeito? | ~ |
| T4 · outra superfície já disse? | ✗ o gate e a lei foram anunciados nos dois lados |
| T5 · o que fica nas costas? | ✗ *está pronta e você não fez nada* |

**Reprovado**, e reprova em P2 antes de chegar ao resto.

**C2** — «A carcaça nova está de pé. A Library esperava por ela.» Mesma tabela,
mesmo desfecho.

**0 de 2 aprovados. 0 de 7 sementes produzem candidato viável.**

### 2.3 O achado — o G3 não falha de frase, falha de estrutura `[PARECER]`

A reprovação não é de redação, e por isso não se conserta reescrevendo.

**Toda condição que faz uma semente desta casa ficar respondível é um fato que o
próprio Rick produziu.** Ele escreveu a lei. Ele fez o gate passar. Ele vai decidir
sobre `gmail.modify`. A condição 6 da 4.1.1 — *só E. sabe* — não sobrevive a isso:
Rick soube primeiro, e soube porque fez.

Sobra apenas o vínculo — *esta semente esperava por aquilo* — que é leitura minha,
não fato do mundo, e cai em P1. E como as sementes são nomeadas na língua da casa,
o que sobra depois de P1 cai em P2.

### 2.4 Veredito: **G3 vetado.** Não construir.

O § 2.4 do parecer continua correto e passa a ter domínio conhecido:

> Uma semente volta quando um fato **fora dela** a torna respondível.

O que o Teste 03 acrescenta: **esta casa, hoje, não tem sementes que esperem fatos
de fora.** Todas esperam a casa. Enquanto for assim, o G3 não tem material, e um
gatilho sem material só embarca produzindo fala forçada — que é o desfecho «poucos
tipos, volume alto» da tabela da Parte 6, plantado de propósito.

**Quando isto se revisa:** quando existir uma semente cuja condição seja um fato
que Rick não produz. Uma semente que espera um preço cair, uma API abrir, uma lei
mudar, um domínio ficar livre. Aí o G3 volta à mesa com material, e o teste se
repete com ele.

Registro sem meio-termo: não é «adiar até ter mais dado». É **não construir**, e o
critério para reabrir está escrito acima.

### 2.5 O que sobra da tabela de gatilhos

| # | Estado após o Teste 03 |
|---|---|
| G1 · braço desligado | **vivo em produção**, 1 de 20, tipo `arm-disabled` |
| G2 · pipeline rodou | espera fonte de evento — segue de pé, é o aprovado do Teste 02 |
| G3 · semente respondível | **vetado** (§ 2.4) |

Um gatilho vivo, um esperando fonte, um morto por teste. Se a leitura de zero
bilhetes em 90 dias se confirmar, ela já está prevista na Parte 6 como resultado —
e agora tem uma causa nomeada em vez de uma suspeita.

---

*Parecer da fusão + Teste 03 — E. · 31 Jul 2026*
*A dedup não tem bug; tem o guardião errado no crachá. O G3 não tem frase ruim;
não tem material.*
