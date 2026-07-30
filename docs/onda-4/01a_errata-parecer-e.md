# ERRATA AO PARECER DE E. — ONDA 4

**Anexo a:** `01_parecer-e.md` (selado verbatim, `3ba536d`)
**Data:** 30 Jul 2026, noite
**Natureza:** o parecer não muda. Isto registra uma omissão minha, corrige o
enquadramento da verificação, e traz um achado do hub que faltava aos §§ 1.5 e 2.3.
**Marcação:** `[PARECER]` · `[COGITADO]` · `[NÃO SEI]`

---

## 1 · A OMISSÃO — nomeei metade da colisão

O § 0 do parecer nomeou a colisão da série D e parou ali. Eu tinha as duas
listagens abertas — `decisions/` do hub e `docs/onda-3/` do app — e não nomeei que
**as ondas também colidem**. A verificação pegou; eu não.

O que registro não é a falha em si: é que ela é do tipo que o parecer trata no
§ 5.1. Uma citação ambígua de «D53» é ruído; uma citação ambígua de «Onda 3» põe
duas ondas diferentes debaixo do mesmo nome — e uma delas já fechou em maio.

---

## 2 · CORREÇÃO DE ENQUADRAMENTO — não são dois mundos de ondas, é um contador que reiniciou

A verificação registrou «as ondas do hub não são as ondas do app». Checado contra
os arquivos, é meio verdadeiro, e a metade falsa importa mais.

**O que os arquivos dizem:**

| Nome | Onde | O quê |
|---|---|---|
| Onda 0 | hub `d-008` (13 Mai) | decisões estruturais |
| Onda 1 | hub `d-009` (13 Mai) | estratégia de repos |
| **Onda 2** | hub `d-048` (17 Mai) | Audit Genesis + Refinement Atlas + Protocolo Venture |
| **Onda 3** | hub `d-052` (19 Mai) | motor / package extraction |
| **Onda 2** | hub `d-058` (23 Jul) | MindRoot V1 «de dentro pra fora», 9 fases |
| **Onda 3** | app `docs/onda-3/` (26–30 Jul) | faxina, Lei do Tom, as 3 faces |
| Onda 4 | app `docs/onda-4/` (30 Jul) | esta |

A Onda 2 de julho **é a mesma nos dois repos**. O próprio diário do app declara:
*«Plano vivo: `docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md` (canônica no
hub, d-058)»*. Não há duas famílias de ondas. Há **uma série cujo contador
reiniciou no 2 em 23 Jul**, colidindo com a própria Onda 2 de maio — e, por
arrasto, a Onda 3 de maio com a Onda 3 de julho.

**A raiz, e é aqui que eu corrijo o meu § 0.** `[PARECER]`

O § 0 propôs sufixo (`DX-53`) ou nota de precedência. As duas tratam o sintoma. A
causa é que existem **dois registros e um deles paralisou**: o hub para em `d-058`
(23 Jul) enquanto D70–D78 foram ratificadas em 30 Jul apenas no
`03_decisoes-ux.md` do app. O hub já sabia disso — o `d-058` reserva o slot
`d-057` para um ADR «redigido no Chat, ainda não commitado neste hub».

Enquanto o hub não voltar a receber, qualquer esquema de sufixo vai numerar dois
registros que continuam divergindo. Não é decisão minha, e o item já está na sua
mesa — registro só que a escolha tem três opções, não duas: sufixo, precedência,
ou **um registro só**.

---

## 3 · O ACHADO QUE FALTAVA AO PARECER — §D5 da spec ratificada

Li a Lei do Tom, os testes, e o registro de UX. Não li a spec do MindRoot V1, e ela
tem duas cláusulas ratificadas que pertencem a esta onda. Ambas em
`specs/system_spec_mindroot-v1_de-dentro-pra-fora_v0-4.md` §D5, seladas por `d-058`
em 23 Jul — sete dias antes de eu escrever o parecer.

### 3.1 A entropia em espiral já legisla *quando*, e cala sobre *qual boca*

> Decay escalonado: 8 dias parado → sinal suave · 21 → sugestão · 55 → extração de
> seed · 89 → proposta de arquivo. Substitui o threshold fixo de 30 dias
> (Genesis §3.3) via supersession.

Duas consequências, e a primeira é a que me interessa: `[PARECER]`

**O passo de 21 dias é o candidato #8 do Teste 02, verbatim.** O candidato era
*«Aquele item está aberto há três semanas»*, e morreu por cobrança. Três semanas é
21 dias. Se a «sugestão» dos 21 dias pousar numa superfície **não solicitada**, a
casa embarca em produção exatamente a frase que o instrumento matou. Se pousar na
sugestão do HOJE (D45, «o que cabe agora») — que o Rick abre —, é solicitada e está
limpa.

O §D5 não diz qual das duas. Essa é a lacuna, e o § 1.4 do parecer é a metade que
falta: **atribuir uma boca a cada degrau da espiral antes de implementar**. Nada a
revogar; algo a completar.

**Sobre o V2 — não há conflito, e registro por que não.** «55 → extração de seed»
corre no sentido oposto ao que o V2 veta: extrai uma semente **de** um item que está
morrendo, não devolve uma semente que dorme. O V2 continua de pé. Mas a razão dele
— cadência é snooze (D71) — se aplica com força total aos degraus de 8 e 21, que
são cadência pura sobre um item que a pessoa não tocou.

### 3.2 O retorno já tem um operador de amostragem, e é φ

> Lookback espiral: espelho emocional amostra o passado em intervalos φ — 1, 2, 3,
> 5, 8, 13, 21 dias atrás. Recente denso, distante esparso — como memória humana.

Isto é uma lei de retorno, ratificada, e o prompt da Onda 4 abriu como se o retorno
não tivesse precedente na casa. Duas coisas mudam: `[PARECER]`

1. O § 1.5 do parecer deixou um buraco aberto — a D75 não generaliza como operador
   para «o que mudou». O operador existe e é φ: **não é «desde quando você olhou»,
   é uma amostragem que adensa o perto e rarefaz o longe.** Isso reforça o § 1.2
   por outro caminho: o recorte não é o olhar do Rick, é a forma da memória.
2. «Recente denso, distante esparso» é a mesma teoria da 4.8 — o que sobrevive à
   remoção — escrita como amostragem em vez de como critério. As duas descrevem a
   mesma coisa e nenhuma cita a outra. `[COGITADO]`

---

## 4 · O QUE ISSO FAZ COM A MESA

Nada do que está acima muda a ordem proposta no § 6 do parecer, e nada revoga um
veto. O efeito é sobre o **insumo 1**: `[PARECER]`

O benchmark do retorno (D62) deveria abrir sabendo que a casa já tem uma lei de
amostragem do passado. Sem isso, ele mede o mercado contra um vazio que não existe
— e a §D5 é evidência interna, que é a única que o crivo não consegue importar.

E fica registrado para o benchmark, como pergunta e não como conclusão: superfície
de «while you were away» no topo de mercado amostra por **intervalo desde a última
visita** ou por **densidade decrescente**? Se for a primeira, φ é a nossa inovação
por cima da base. Se for a segunda, φ é a base, e a inovação está em outro lugar.
`[NÃO SEI]`

---

*Errata — E. · 30 Jul 2026*
*O parecer fica como está. Isto é o que eu não tinha lido quando o escrevi.*
