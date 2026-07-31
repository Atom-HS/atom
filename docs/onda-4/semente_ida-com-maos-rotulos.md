# Semente — a ida ganha mãos: rótulos de conteúdo (o Secretário volta)

*31 Jul 2026 · plantada pelo Rick, no dia em que o primeiro bilhete nasceu:
«seria interessante ver as specs de email do Claude work, porque ele também
faz esse trabalho — seria bacana ser igual; e a gente poderia usar rótulos
também». Nota sem ação — a onda colhe quando chegar.*

## A ideia

Hoje a ida (D68) projeta só a **estrutura**: os labels `Atom/…` existem no
Gmail, vazios. A semente: o conteúdo ser **rotulado** na taxonomia da casa —
um email da clínica ganha `Atom/saude`, a fatura ganha `Atom/financas` — como
o Claude faz quando trabalha no Gmail de alguém. A lente deixaria de só
desenhar as gavetas e passaria a guardar nelas; a linhagem é a do
**Secretário** (Mai 26, «sempre draft, nunca send» — a sexta boca
adormecida).

## O que estudar antes (o benchmark da vez, D62)

- **A spec do Claude no Gmail** — o conector do claude.ai tem ferramentas de
  rótulo por mensagem e por thread, criação/edição de labels, e um padrão
  pré-definido de rótulo «sensível». Como ele decide, como pede permissão,
  que escopos usa, o que NUNCA faz. «Ser igual» ao topo é exatamente o crivo.
- O que mais o mercado faz de rotulagem assistida (SaneBox, Superhuman
  auto-triage, Gmail categories) — e onde apanha.

## As muralhas que a semente já conhece

1. **`gmail.modify` foi banido na v1 pela D68** — rotular mensagem exige
   esse escopo. Logo: não é polimento, é obra deliberada de v2, com escopo
   novo pedido às claras e aceite do Rick. A porta está fechada de
   propósito; abrir é decisão, nunca deriva.
2. **Adicionar ≠ mover** — benchmark `10`: toda revolta documentada vem de
   mover/esconder conteúdo, nunca de criar. Rótulo é adição: o email não sai
   do lugar, a lente não vira arrumadeira. O espírito da D67 sobrevive.
3. **D69 dá o molde do gesto** — a heurística nunca decide quieta: rótulo
   nasce como sugestão aceitável (chip / lote com preview), nunca varredura
   silenciosa. E a D76 vale: o que já foi rotulado não se re-processa.

## Conexões

- [[semente_email-vestido-de-atom]] · [[semente_atom-a-lente]] — as irmãs.
- O braço da volta (gmail-sync) já lê sinal; este seria o primeiro braço
  que ESCREVE além de estrutura — degrau novo na confiança, por isso o
  aceite explícito é o coração da obra.

---

*Semente registrada, sem ação. Quem colher: abrir com o benchmark da spec
do Claude + decidir o escopo (D68 v2) na mesa antes de qualquer código.*
