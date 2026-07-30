# Onda 4 — log · a onda do E. (retorno e voz)

**Aberta:** 30 Jul 2026 · **Proposta em:** `onda-3/onda-3-log.md`, fecho da
faxina (registrada como seed, não decisão) · **Status:** consulta — nenhuma
obra de código autorizada.

## O escopo proposto

1. **«O que mudou desde que você olhou»** — o retorno ao vivo, pro Rick
2. **As sementes `#seed` voltam** — a Fase 5 que o cartão morto prometia
3. **A voz do builder** (D64) — a entrevista em capítulos-gaveta, com o E.
4. **Os bilhetes do E.** (D53 v2) — destravados pela Lei do Tom v1.4

## Os dois insumos da spec (nenhum manda sozinho)

- **O parecer do E.** — a fonte interna. ✅ Chegou em 30 Jul, selado
  verbatim em `01_parecer-e.md`.
- **O benchmark do retorno** — a fonte externa, como manda a D62. Ainda não
  rodado. O próprio parecer avisa (§ 5.3): o benchmark pode derrubar o
  § 1.3 dele.

---

## Wrap · 30 Jul 2026 — a onda abre pela boca certa

### ⬠ Soul
O Rick abriu a onda com uma frase e uma condição: «essa eu acho que a gente
deveria se consultar com o próprio E. também». A condição virou o primeiro
gesto — antes do benchmark, antes de spec, a pasta nasce com o prompt da
consulta. O precedente é o inventário da Lei do Tom: quando o assunto é a
voz, a casa pergunta antes de destilar. Desta vez todas as quatro obras são
superfícies dele — não faria sentido nenhum desenhar sem o parecer.

### · Items
- **`00_prompt-consulta-e.md` nasceu** — no molde do `onda-3/04`: o chão
  conhecido (o que mudou desde a mesa de 28 Jul, contado ao E. — o primeiro
  «o que mudou desde que você olhou» da onda é pra ele), as quatro obras, e
  seis partes de pergunta: retorno ao vivo · sementes · builder · bilhetes ·
  buracos e vetos · ordem. Veto explícito convidado (Art. 3 da lei dele).
- **Este log abriu** — a onda ganha diário próprio, no formato do wrap,
  como o da Onda 3.

### △ Decidido
- Nada. A onda segue proposta; a consulta é condição declarada pelo Rick,
  não decisão numerada.

### ⬡ Conexões
- O prompt ao E. É o gesto (precedente do deploy e do gate): colar no
  Projeto E é a mão do Rick.
- Simetria registrada: a obra 1 da onda («o que mudou desde que você
  olhou») estreia dentro do próprio prompt — a seção de contexto pro E. é
  exatamente essa superfície, executada à mão.

### ✳ Seeds
- Nenhuma nova.

### □ Audit
- ✅ zero código tocado — pasta nova só de docs
- ⚠ a onda não abre obra antes de `01_parecer-e.md` + benchmark existirem
  (regra declarada no rodapé do prompt)

### → Next — a mesa do Rick
1. Colar o prompt no Projeto E · trazer o retorno pra `01_parecer-e.md`
2. Autorizar o benchmark do retorno (D62) — pode rodar em paralelo à
   consulta
3. Os itens da mesa da Onda 3 seguem vivos: digest de 31 Jul 07:15,
   hostname do domínio, semana da DP-G

---

## Wrap · 30 Jul 2026 (noite) — o parecer chegou, e a onda encolheu pra crescer

### ⬠ Soul
O E. devolveu o parecer no mesmo dia — e a primeira coisa que ele fez foi
não responder o resumo: leu as fontes (a lei inteira, as decisões verbatim,
as perguntas literais do builder, 59 sessões de mecanismos) e abriu com um
erro-de-omissão que ninguém pediu: as duas séries D colidindo. O parecer
redesenhou a onda: das quatro obras, duas deixam de ser obras de voz (o
retorno vira marca de face + uma frase de nome; as sementes viram polimento
de face + dois vetos), e a única superfície genuinamente nova é a que
ninguém tinha enquadrado — a entrevista, onde a direção da pergunta
inverte. Cinco vetos, todos antes do código, «que é onde ele vale barato».

### · Items
- **`01_parecer-e.md` selado** — verbatim, como o prompt pediu.
- **Verificação da casa, as duas alegações checáveis conferem:**
  - `builder-questions.ts` — «Quantas vezes por semana?» (`body-3`,
    `family-5`), «Mora com alguem?» (`family-1`), «frequencia» sem acento
    (`finance-4`): tudo literal, linha por linha.
  - **A colisão das séries D é real**: `c:\repos\atom\decisions\` (o hub)
    tem `d-053_tooling-pnpm-workspace` — exatamente o exemplo do E. E há
    um agravante que ele não citou: a série de **ondas** também colide
    (hub `d-052_onda-3-motor-package-extraction` é de maio;
    `d-058_onda-2-abertura` é de 23 Jul — as ondas do hub não são as ondas
    do app).
- **O resumo executivo do parecer, pra mesa:** V1 sem superfície não
  solicitada sem teto · V2/V3 semente não volta por cadência nem afinidade
  · V4 o nome muda («o que mudou», nunca «desde que você olhou») · V5
  frequência pretendida sai da entrevista. Ordem dele: bilhetes →
  entrevista (4.10) → marca do retorno → sementes; e a 4.8 (e_lines e
  fragmentos consultáveis) antes de tudo, se a decisão fosse dele.

### △ Decidido
- Nada — o parecer é insumo, não decisão. Vetos, ordem e consertos vão pra
  mesa do Rick; ratificação segue o rito da casa (número na série de UX…
  que é justamente a série em colisão — buraco 4 primeiro).

### ⬡ Conexões
- O § 2.5 do parecer devolve a obra 2 pro wrap: o problema da semente é de
  **plantio**, não de volta — e a boca do plantio já existe (obra 4 da
  faxina). O que falta é regra sobre o que ela aceita.
- O gatilho 2 dos bilhetes (label `Atom/…` apagado lá fora) conecta direto
  com a reconciliação da taxonomy-sync v2 deployada ontem — o braço que
  detecta já existe; o que não existe é a boca que conta.

### ✳ Seeds
- **Regra do plantio** (§ 2.5, `[COGITADO]` do E.): o passo 5 aceita
  registro de estado, não «coisa que eu deveria fazer». Sem dono ainda.
- **Contar tipos, não disparos** (§ 4.3): refinamento do gatilho 1 da
  Parte 6 da lei — diversidade como instrumento, não taxa. Proposta do E.,
  aguarda ratificação junto com a lei.

### □ Audit
- ✅ parecer selado sem edição (pedido do prompt honrado)
- ✅ duas alegações checáveis verificadas contra o repo — ambas conferem
- ✅ zero código tocado — os consertos apontados (acentos, frequência,
  «Nunca fiz») esperam a mesa; os vetos não custam código por definição
- ⚠ buraco 3 do E. segue aberto: «o @ do app é a mesma boca do @ do
  projeto?» — é dado que a casa deve, não decisão

### → Next — a mesa do Rick
1. **Autorizar o benchmark do retorno** (D62) — o segundo insumo; a spec
   não nasce sem ele
2. **Buraco 4**: decidir o conserto da colisão das séries D (sufixo na
   série de UX vs nota de precedência) — barato agora, caro depois
3. **Responder o buraco 3 ao E.** — o endereço do soul log no app
4. **Ratificar (ou não) os cinco vetos** — viram Ds na série de UX depois
   do conserto do item 2
5. Da mesa anterior: digest de 31 Jul 07:15 · hostname · semana da DP-G

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. Herdada da Onda 3.*
