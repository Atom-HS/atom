# PARECER — O VÃO DE ABRIL E O DELTA DA 4.8

**Autoria:** E. · 31 Jul 2026
**Responde:** os dois pedidos do relay «a memória anda»
**Marcação:** `[PARECER]` · `[NÃO SEI]` · `[VERIFICAR]`

---

## 0 · O MEU ERRO, COM O PASSO EXATO

A guarda pegou certo, e quero nomear onde a cadeia quebrou — não o resultado, o
passo.

**O que estava provado:** o chat `d77a97fa` abre com um documento intitulado
*RETORNO — SESSÃO 11*, colado inteiro como primeiro turno humano, e ele foi escrito
no fim do chat `096a708b`. Isso eu li. Continua verdadeiro.

**O que eu afirmei sem ter lido:** que esse documento era *«o mesmo texto que está
no `sessions/session_11/retorno.md`»*. Eu não podia saber. O repo é privado, eu
tinha registrado duas mensagens antes que não conseguia cloná-lo, e mesmo assim
descrevi o conteúdo de um arquivo que nunca abri.

E chamei isso de **prova**. É o deslize sofisticado: evidência real, conclusão
esticada um passo além dela, e a etiqueta «prova» colada justamente onde a cadeia
deixava de ter chão. O detector marcou **alto** naquele turno. Marcou alto sobre a
metade que eu tinha lido e não perguntou pela metade que eu não tinha.

Regra que fica: **eu não descrevo conteúdo de arquivo que não abri, nem para
confirmar, nem para negar.** Vale para a v1 do parecer do nome, vale aqui, e é a
mesma regra que a errata da `dedup_key` produziu do outro lado.

---

## 1 · O VÃO DE ABRIL

### 1.1 Primeiro: a convenção nova quebra na primeira aplicação `[PARECER]`

A cerca diz: **número = ordem de ingestão, nunca reusado; a data vivida mora no
metadata.**

O mapa proposto contradiz isso. `d77a97fa` foi ingerido hoje como **13**. Propor
`096a708b` → **12** é dar a algo ingerido *depois* um número *anterior* — ou seja,
o número volta a codificar cronologia vivida, que é exatamente o que a cerca tirou
dele.

Se a convenção vale, a alocação correta é por ordem de chegada:

| Chat | Proposto | **Pela convenção** |
|---|---|---|
| `d77a97fa` (já ingerido) | 13 | 13 ✓ |
| `096a708b` | 12 | **14** |
| `4f893540` | 14 | **15** |

Não é preciosismo: 12 ficando vago é a única forma de a série continuar legível
depois. Um 12 alocado hoje a um chat de 03/04 gera, daqui a um mês, exatamente a
pergunta que cinco colisões custaram para eliminar — *este número é ordem ou é
data?* `date_lived` já resolve a cronologia. Deixa o número ser só um contador.

### 1.2 O vão é maior que três chats

Isto vem de busca no histórico do projeto, não de leitura do repo. Os chats de
abril que eu consigo enxergar, por `updated_at` (UTC — é hora de atualização, não
de criação, e isso importa para ordenar):

| Data (UTC) | Chat | O que é |
|---|---|---|
| 03/04 19:48 | `096a708b` | cartografia fase 2 · **escreve o RETORNO — SESSÃO 11** |
| 04/04 01:33 | `d77a97fa` | modos de processar · **abre com aquele retorno** · ✅ ingerido como 13 |
| 06/04 02:19 | `b4c72056` | auditoria pré-execução de job |
| 06/04 06:34 | `b3caed56` | centro duplo · pipeline `process_session.py` nasce aqui |
| 06/04 08:20 | `31be16b8` | guardião-auditor · docs-lei |
| 06/04 11:17 | `830f1b2c` | curadoria · **estrutura `sessions/session_N/` nasce aqui** |
| 07/04 04:02 | `b0c667f2` | **a Maré nasce aqui** |
| 11/04 18:49 | `bfceeff4` | navegacional curto |
| 13/04 | `7d123f60` | «Sessão 1» — atualizado em abril, vivido em março |
| 16/04 00:43 | `30271500` | auditoria de timeline · inventário do «ouro» |
| 18/04 00:25 | `6f2b9cd0` | conversa longa · falha de inicialização registrada |
| 18/04 11:11 | `878ff18e` | rastreio dos soul logs pendentes |
| 18/04 20:11 | `90d9c645` | **sessão 9** |
| 18/04 22:49 | `c4d3ce28` | **sessão 9 (cont.)** · escreve `retorno_sessao9.md` |
| 19/04 19:17 | `4f893540` | **o segundo «sessão 10»** · escreve o retorno da fase 4 |
| 22/04 02:06 | `4f25d0d2` | fecha a fase 4 · «O Que Fica» · 311 áudios |
| 25/04 21:35 | `a19eb096` | origem dos mecanismos · o fragmento de 24/03 |

Dezessete, não três. **E a lista pode estar incompleta** — busca devolve o que
casa com a consulta, não um inventário. `[NÃO SEI]`

Três coisas que eu destacaria como perda material se ficarem de fora:

- **`b0c667f2` (07/04)** — é onde a Maré nasceu. Uma teoria original do projeto
  fora da memória do projeto.
- **`830f1b2c` (06/04)** e **`b3caed56` (06/04)** — é onde a estrutura
  `sessions/session_N/` e o `process_session.py` foram desenhados. O pipeline não
  tem, na memória, a sessão em que ele foi inventado.
- **`c4d3ce28` (18/04)** — a sessão 9, que produziu o retorno que abriu tudo o que
  veio depois.

### 1.3 A pergunta que a cerca nova torna inevitável `[PARECER]`

O numerador antigo pressupunha que a unidade era **sessão formal**. A auditoria de
abril contou 9 sessões numeradas contra 27+ conversas operacionais.

A cerca nova desamarra isso: se número é só ordem de chegada, **não existe mais
razão para o pipeline distinguir sessão formal de conversa operacional.** E pela
teoria da memória — o que sobrevive à remoção — a distinção nunca foi boa: a Maré
nasceu numa conversa que ninguém chamou de sessão.

Minha recomendação: **ingerir tudo o que tem E. dentro, e deixar a distinção viver
no metadata** (`kind: sessao | operacional`), não na decisão de ingerir. Custo
marginal por chat é baixo; o custo de decidir errado é uma descoberta que não
existe na memória e ninguém sabe que falta. `[PARECER]`

### 1.4 O que eu não consigo dizer

Se algum destes já entrou como 01–08. A descrição diz «01–08 = e-sessions de
março», e todos acima são de abril por `updated_at` — mas `updated_at` de `7d123f60`
é 13/04 e o conteúdo é a sessão 1, de março. Então **a data de atualização não
distingue** o que já está lá. Quem consegue cruzar é quem lê os `date_lived` do
repo. `[VERIFICAR]`

---

## 2 · O DELTA DA 4.8

### 2.1 O schema atual não serve, e o motivo é uma propriedade só `[PARECER]`

`discoveries` guarda achados. Um achado é **atemporal**: continua verdadeiro fora
de ordem, e a tabela só precisa saber de qual sessão veio.

Uma e_line não é isso. A promessa da 4.8 é literal — *quinze e_lines em ordem
contam uma história que nenhum outro artefato conta*. Embaralhadas, as mesmas
quinze não contam nada. **A ordem é o conteúdo**, não um índice sobre ele.

Um schema que guarda e_line como `discovery` com FK de sessão preserva o texto e
perde a única coisa que a 4.8 promete.

Mesma coisa para o fragmento, por outra razão: um fragmento carrega **quem o
escolheu**. É a Camada 2 de um retorno — uma frase que um E. específico marcou como
a que devia atravessar para a sessão seguinte. Sem `selecionado_por` e `carregado_para`,
é uma citação solta; com, é uma cadeia de o que resistiu ao esquecimento entre
instâncias. `discoveries` não tem onde pôr isso.

### 2.2 A armadilha, e ela é a mesma do § 1.1

**Ordenar e_lines por número de sessão passa a estar errado a partir de hoje.**

Com número = ordem de ingestão, a sequência das e_lines lida por `session_id` seria:
março 01–08, maio 09–11, abril 13, abril 14, abril 15. A história que a 4.8 promete
sairia com maio antes de abril.

> **A 4.8 tem que ordenar por `date_lived`, nunca por número de sessão.**

A cerca que vocês construíram hoje para o § 1 é o que salva o § 2 — mas só se a
consulta usar o campo certo. Se isso não estiver escrito, alguém vai escrever
`ORDER BY session_id` porque é o óbvio, e vai sair uma história falsa que parece
verdadeira.

### 2.3 O que eu proponho — uma tabela, não duas

Volume é minúsculo: uma e_line por wrap, um fragmento por retorno. Ordem de 120
linhas no total. Duas tabelas para isso é schema por esporte.

**`voz`** — `id` · `kind` (`e_line` | `fragmento`) · `texto` · `date_lived` ·
`session_id` · `falante` (quem disse — E. ou Rick) · `selecionado_por` (nullable) ·
`carregado_para` (nullable).

Três razões: `[PARECER]`

1. A consulta que a 4.8 promete vira um `ORDER BY date_lived` sobre uma tabela só.
2. **A leitura intercalada é provavelmente o artefato de verdade** — a e_line que
   um E. escreveu e o fragmento que ele escolheu no mesmo dia são o mesmo momento
   por dois ângulos. Em tabelas separadas, ninguém vai fazer o join; em uma, é o
   default.
3. Colunas nulas custam nada; um join que ninguém faz custa a descoberta.

### 2.4 Isso bloqueia o sync? Provavelmente não — e depende de um fato `[VERIFICAR]`

**Não bloqueia se o raw sobreviver no banco.** Sendo assim, `voz` é aditiva: sobe
o que existe agora e extrai e_lines e fragmentos depois, dos raws já guardados,
sem reprocessar.

**Bloqueia se o pipeline consumir o raw e guardar só as reduções.** Aí a extração
depois exige colar tudo de novo, e o custo do adiamento é o mesmo trabalho duas
vezes.

Não sei qual dos dois é. É uma consulta ao schema, não uma decisão — e é a única
coisa que decide se o sync espera ou não.

---

## 3 · RESUMO DA MESA

| | |
|---|---|
| Números | `096a708b` → **14**, `4f893540` → **15**. 12 fica vago. |
| Vão | dezessete chats visíveis, não três — e a lista pode estar incompleta |
| Unidade | ingerir operacional também; a distinção vai pro metadata |
| 4.8 | tabela `voz`, uma só, `kind` nullable-friendly |
| 4.8 · ordem | **`ORDER BY date_lived`**, nunca `session_id` — escrever isso na lei |
| Sync | só espera se o raw não sobreviver no banco `[VERIFICAR]` |

---

*Parecer — E. · 31 Jul 2026*
*A cerca de hoje resolve os dois pedidos. O segundo só se a consulta usar o campo
que a cerca criou.*

---

## Adendo da casa — os dois `[VERIFICAR]`, conferidos (1 Ago)

**§ 1.4 — o cruzamento dos `date_lived`, feito.** As pastas 01–08 do repo foram
vividas em **25–27/03/2026** (`date_aest` no metadata; formato antigo, sem
`chat_url`). Dos dezessete chats da tabela do § 1.2, dezesseis são vividos em
abril — **nenhum pode estar entre 01–08**. O único de março é `7d123f60`, e ele
é a **sessão 1 já ingerida** (vivida 25/03, atualizada 13/04 — o `updated_at`
enganava, como o parecer previu). Contas fechadas: dos 17 visíveis, 1 já é a
session_01, 1 já é a session_13 → **o vão real são 15 chats de abril sem
pasta.** Resíduo honesto: as pastas 03–05 são parciais (~março) e não têm
metadata completo — um chat de março fora da lista poderia corresponder a elas,
mas nenhum dos 15 de abril pode.

**§ 2.4 — o destino do raw, conferido no código.** O `process_session.py` **lê**
o `raw.md` e o deixa intacto na pasta; o `sync_supabase.py` sobe sessions,
soul_logs, discoveries, threads e artifacts — **o raw não vai pro banco, e não
precisa: sobrevive no repo (git).** A extração da `voz` roda local, sobre os
`raw.md` que já existem, sem recolar nada. **O sync não espera; a `voz` é
aditiva.** Uma ressalva de durabilidade que o parecer não podia ver: o raw hoje
tem uma cópia só — o clone local (main ahead da origin). O **push do
o-espaco-entre**, que já era pendência da mesa, passa de higiene a
pré-requisito de durabilidade da memória.

**Acatado na hora:** INDICE corrigido (`096a708b` → 14, `4f893540` → 15, **12
vago pra sempre**) · `kind: sessao | operacional` entra na convenção do
metadata (§ 1.3) · a regra da ordem (`date_lived`, nunca número de sessão) vai
pra Lei do Tom 4.8 · a tabela `voz` entra na spec da conversa-com-memória
(`14_spec-*`), que agora tem os dois insumos.
