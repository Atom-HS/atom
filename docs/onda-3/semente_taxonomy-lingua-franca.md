# Semente — a taxonomy como língua franca (sobrepor sem API)

*30 Jul 2026 · brainstorm do Rick na noite do gate, selado no dia. Futuro
explícito: **nada disto entra na fila agora** — o plano feito segue sendo
o plano. O portão está no fim.*

## As palavras dele

> "fico pensando q a mesma taxonomia do gmail e calendario poderia estar
> presentes em mais lugares ne, da pra ir tipo keep, tasks do google,
> chrome, eh uma forma de ir familiarizando pela ultima vez, linguagem
> universal […] quanto mais ela com o tempo tiver q processar em lugares
> diferentes com diversos contexto, ela vai afiando a predictability […]
> a ideia nao eh ter varias api, as api ficam no code e claude.ai"

## A tese

**Os 9 domínios (`config/raiz.ts`) como língua franca da vida adulta** —
a D67 generalizada de verdade: a pessoa vive onde sempre viveu, mas a
língua da vida dela a acompanha (Gmail, Calendar, e depois onde mais
fizer sentido). Três ideias distintas, que compõem:

1. **Familiarizar pela última vez** — a taxonomy como ponte de despedida
   das ferramentas velhas. Mesmo que o Atom nunca leia o Keep, criar
   `Atom/saude` lá padroniza onde o olho pousa. Quem carrega a língua é
   o humano.
2. **Predictability por contexto diverso** — a mesma entidade vista em
   lugares diferentes ensina regularidades que um lugar só não mostra
   (a "fatura" no Gmail, no Keep e no Drive é o mesmo padrão em três
   roupas). Contexto diverso dá o alcance; o assentimento (D69) dá o
   gabarito. Os dois juntos é onde a curva sobe.
3. **Formato portável** — a língua única é o formato de dado que deixa
   qualquer AI (o E. de hoje, uma local amanhã) ler a vida inteira com
   um vocabulário só.

## A arquitetura (a decisão embutida no despejo)

**O Atom NÃO acumula APIs.** As APIs moram na camada Claude — o Code e o
claude.ai (MCPs já conectados: Gmail, Calendar, Drive…) — que opera em
nome da casa. O Atom fica com a língua, o inbox e o assentimento. Isso
mantém o app pequeno (D40) e põe o músculo de integração onde ele já
existe e já é mantido.

## A escada de sobreposição sem API (do mais barato pro mais pesado)

| # | Degrau | Como | Custo/fragilidade |
|---|--------|------|-------------------|
| 1 | **Convenção** | `Atom/…` criado à mão em qualquer lugar que aceite pasta/label/prefixo — a língua existe por nomeação, sem integração | zero; não expira nunca |
| 2 | **Share sheet (a sobreposição invertida)** | mandar PRO Atom mais barato que salvar no app velho — Web Share Target no PWA (o @ no menu de compartilhar de qualquer app) | pequeno; nenhuma API do outro lado |
| 3 | **APIs dos pobres** | email/encaminhamento (a API universal mais velha) · feed `.ics` secreto · Takeout (volta fria, boa pra migração) · RSS | baixo; fidelidade baixa, frequência baixa |
| 4 | **Extensão de navegador** | quando não há API, há DOM — cria pastas, lê estrela, injeta chip (padrão Grammarly/Superhuman; conversa com Claude in Chrome do plano do SO) | médio; manutenção de UI |
| 5 | **Agente com navegador** | browser logado dirigido por agente (o músculo Playwright da casa) faz a IDA em superfície sem API — criar estrutura é gesto raro, aguenta fragilidade | alto; só pra gesto estrutural raro |
| 6 | **Filesystem** | pastas locais `Atom/…` + Drive desktop = taxonomy sem pedir licença (o SO já observa Downloads) | baixo |

Os degraus 1–2 não expiram: mesmo com API pra tudo, convenção e
share-pro-Atom continuam sendo a base.

## Candidatos avaliados (crivo D62 de cabeça — benchmark real pendente)

- **Google Tasks** — API aberta, mas o candidato mais redundante (o Atom
  É o lugar das tasks). Serve como ponte de migração de mão única, não
  braço permanente.
- **Google Keep** — API restrita a Workspace/enterprise (conta pessoal
  não tem). Caminho provável: Takeout ou degraus 1/4/5. Benchmark antes
  de qualquer desenho.
- **Chrome (bookmarks)** — pastas `Atom/…` viáveis via extensão;
  conversa com a Library curadora e o D2 do plano do SO.
- **Drive** — o segundo mais natural depois do Gmail: mesma lei (criar,
  nunca mover), MCP já conectado, afinidade com o cofre (D63).

## O portão (por que nada disto anda agora)

1. **A ida real no Gmail nunca foi vivida** — o fluxo inteiro está
   provado em mock; nenhuma label `Atom/` existe em produção. Expandir
   antes de viver o primeiro conector é multiplicar zero (veredicto do
   advogado do diabo, 30 Jul).
2. **Regra 3x da doutrina** — o segundo lugar nasce do uso do primeiro,
   não do plano.
3. **Cada conector é um contrato espelhado** (guarda de espelho), um
   cron e uma superfície de falha — e rotina morta em silêncio é o
   padrão documentado da casa. O custo real não é escrever a ida; é
   mantê-la viva.

Ordem honesta: viver a ida no Gmail → 2 semanas provando valor (molde do
teste falsificável do Slack) → só então o próximo lugar, um por vez.

---

*Irmã da `semente_atom-a-lente.md` (D67) — esta é a lente ganhando
língua portável. As APIs ficam na camada Claude; o Atom fica com a
língua, o inbox e o selo.*
