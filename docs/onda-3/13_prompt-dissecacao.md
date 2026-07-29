# O prompt da dissecação — cada feature, com profundidade, pela intenção

*29 Jul 2026 · pedido do Rick: "dissecar cada uma dessas features e ter
certeza que estão funcionando com profundidade e fazendo sentido, pensando
pela perspectiva do usuário e a intenção do aplicativo, e sugerir mudanças
e ajustes." Roda numa sessão nova do Claude Code, feature por feature ou
o exame inteiro. Reutilizável: é ritual, não relatório.*

---

## O PROMPT

Tu és o examinador da casa. Tua missão: dissecar as features do Atom
uma a uma — **vivendo cada uma como usuário primeiro, lendo código
depois** — e dizer sem dó: funciona de verdade? faz sentido pela
intenção? o que ajustar?

### A intenção que rege tudo (a régua)

1. **O Atom é a lente, não o lugar** (D67) — ele enxerga através da
   bagunça dos outros apps; nunca replica, nunca vira o app que espelha.
2. **Simples na superfície, fundo inteiro atrás** (lei do desenho) —
   resolve a ansiedade do dia na primeira tela; a profundidade existe
   mas nunca cobra passagem.
3. **Estado, nunca julgamento** (D46) — todo número é espelho, jamais
   cobrança. Shame mata; convite sustenta.
4. **O assentimento é do humano** (D52/D69) — a máquina lê e sugere;
   quem sela é a pessoa, num toque, sempre podendo trocar.
5. **Captura-primeiro** — nada se perde; o ponto nasce antes de
   qualquer leitura ou decisão.
6. **A voz é rara e na Lei do Tom** — você (nunca tu), sem exclamação,
   sem streak-parabéns; push só voz do E. com motivo (D56/D66).
7. **Frase-norte:** *"abrir o Gmail e estar bagunçado; abrir o Atom e
   ver o que eu preciso de verdade."*

### O método (por feature, nesta ordem)

**Passo 1 — VIVER.** Abre o app (localhost:5173 dev · produção
atom-zeta-snowy.vercel.app · mundo demo com `?sim=1`) e usa a feature
como um usuário de primeira viagem usaria — com Playwright
(`e2e/tour.spec.ts` é o mapa dos gestos) ou dirigindo o browser. Tira
screenshot. Anota onde travaste, hesitaste, ou precisaste saber algo
que a tela não disse.

**Passo 2 — A INTENÇÃO.** Pergunta: esta feature serve qual das 7 leis
acima? Ela mente pra alguma? (ex.: um número que cobra viola a 3; um
sync que espelha volume viola a 1). Cita a decisão (D-número) que a
rege — se não existe decisão, isso JÁ é um achado.

**Passo 3 — A PROFUNDIDADE.** Agora sim o código: o caminho feliz tem
teste? Os cantos têm? (vazio, offline, erro de rede, dado sujo, fuso,
primeira vez, centésima vez). O que acontece se a edge cai? Se o token
morre? Confere `src/engine/*` (puro), `service/*`, os testes co-locados
e as fotos do gate (`e2e/visual-mundo-novo.spec.ts`).

**Passo 4 — O CRIVO (D62).** Compara com o melhor da categoria (os
benchmarks `09` e `10` já têm table stakes mapeadas): o que o topo de
mercado faz que esta feature não faz? É table stake (dívida) ou é
escolha deliberada da casa (registrar como tal)?

**Passo 5 — O VEREDITO.** Uma linha: **VIVA** (funciona e serve a
intenção) · **MANCA** (funciona mas trai a intenção, ou serve a
intenção mas falha em canto real) · **MENTE** (parece funcionar mas
engana o usuário — a pior categoria, prioridade máxima). E os ajustes:
cada um com tamanho (gesto · obra pequena · obra com mesa) e qual lei
o justifica.

### As features a dissecar (uma sessão pode fazer 2–3 com profundidade)

| # | Feature | As perguntas afiadas |
|---|---------|---------------------|
| 1 | **HOJE** (céu, fixos, sugestão, pills) | O arco diz algo útil ou é só bonito? A sugestão única convence ou o usuário quer ver a lista (e isso é feature ou fraqueza)? Fixos com conflito/all-day mentem em algum fuso? A pressão dos próximos dias (cega apontada no benchmark `10`) faz falta na prática? |
| 2 | **@ / captura** (texto, tokens, sinto:, lista:) | O caminho boca→inbox perde algo em rede ruim (outbox D55)? A leitura da AI erra em qual banda de confiança e o que o usuário vê quando erra? Os tokens explícitos (`△`, `#`, `@data`) são descobríveis ou só o Rick sabe? |
| 3 | **Triage/assentimento** (chips, D69) | 50 itens de conector de uma vez: o fluxo aguenta ou vira esteira de fadiga? "Pular" adia pra onde — e o item pulado volta? O chip ritual⇄task cobre os casos reais (e email→task faz sentido)? |
| 4 | **ÁRVORE + drill** | Real×ideal comunica sem explicação? O drill mostra o que importa do ramo ou despeja itens? Maturação (·→○) se entende sem manual? |
| 5 | **Raiz/cofre** (D63) | As validades avisam com lead time certo? Ausência por evento significativo funciona com os dados reais (ou tudo é "nunca teve registro" porque os domínios estão vazios — e aí o que convida a preencher)? |
| 6 | **Builder** (D64) | A entrevista pare cadeia/protocolo de verdade no fim? Retomável? O payoff aparece ("estrutura nascendo") ou é questionário? |
| 7 | **A casa/conectores** (sheet, sync, D68) | O puxador é descobrível (o Rick não achou — dado real de 29 Jul)? O sync dá feedback do que trouxe? A ida: preview→assentir→reconexão flui, e o desfazer devolve mesmo? |
| 8 | **A ida vivida** (labels no Gmail) | Depois do assentir: as labels aparecem no Gmail? Deletar uma lá desliga o braço aqui (D68)? Reprojetar respeita o desligado? |
| 9 | **Digest/Telegram** (D66) | A voz está na Lei do Tom? "Só quando há algo" segura mesmo (dia limpo = silêncio)? 5 ausências "nunca teve registro" todo dia vira ruído — o raro precisa de memória (não repetir o já-dito)? |
| 10 | **Wrap** | O rito fecha o dia ou é formulário? O que ele alimenta (espelho F9, arco D59) se percebe depois? |
| 11 | **Busca + gestos** | O pull-down é descobrível? A busca acha por título, tag, `#who:`? |
| 12 | **Projetos/presença** | A pill do projeto comunica presença ou confunde? A página `/projects` (casca velha) trai o mundo novo — reformar ou matar (D48)? |
| 13 | **Offline/PWA** (D55) | Instala? A lista abre no mercado sem rede? A fila do outbox sobe sozinha quando volta? |

### Regras do exame

- **Não corrige durante o exame.** Achou bug crítico: anota, termina o
  passo, e só então (se pequeno) conserta com hooks verdes — ou vira
  item da fila. Dissecação e cirurgia são ritos separados.
- **Não assume: vive.** "Deve funcionar" não existe — ou viveu e viu,
  ou está no relatório como NÃO VERIFICADO.
- **Ajuste que muda decisão ratificada não se aplica — se propõe.**
  Vira "decisão proposta" pra mesa do Rick, com número sugerido.
- **O relatório final** (um doc `docs/onda-3/14_dissecacao-NN.md` por
  sessão): tabela de vereditos · a fila de ajustes priorizada (MENTE >
  MANCA > polimento, cada um com tamanho e lei) · decisões propostas ·
  sementes novas registradas. Screenshots das cenas que provam os
  achados.

*Começa perguntando ao Rick: quais features desta lista examinar nesta
sessão — ou segue a ordem da tabela, 2–3 por vez, com profundidade
sempre vencendo cobertura.*

---

*Filho do crivo D62 ("inovação com base ruim não serve") e do pedido de
29 Jul. O exame se repete a cada onda — as perguntas afiadas mudam; o
método e a régua, não.*
