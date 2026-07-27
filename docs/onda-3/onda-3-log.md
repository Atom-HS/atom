# Diário da Onda 3 — as 3 faces

*O diário que a Onda 2 tinha e esta ainda não — fundado no wrap de 27 Jul.*

---

## Wrap · 26–27 Jul 2026 (a onda inteira até aqui)

### ○ Soul
Dois dias de obra contínua, Rick vivendo as faces em tempo real e devolvendo
desenho ("o arco marcando os acontecimentos"). No meio da obra, a tese-mãe
apareceu com clareza: **o Atom como substrato de presença pra qualquer AI**.
Rick decidiu pular a semana-de-viver — a casa andou; o espelho nasceu quieto
por construção.

### · Items (o que nasceu — 14 commits, `v2-faces`)

**Fundação (26 Jul)**
- `5c8db8a` funda a pasta: parecer UX aprovado, mapa motor×carcaça, mockup, semente Library
- `d55a0d1` motores sky + today (céu real, "o que cabe agora")
- `13d94de` **face HOJE** — o arco vira espinha

**A onda cheia (26–27 Jul)**
- `8df88e1` motor da boca única (mouth — gramática igual ao Telegram)
- `13702da` **face @** — a conversa, chips de assentimento, captura-primeiro
- `737b9ea` mapa de navegação clicável + **decisões D40–D57** (numeração continua a da casca velha)
- `f006801` D58 (Builder → doors no chão da árvore) + **semente do substrato**
- `fa652a8` motores tree + mirror (F9 com silêncio honesto)
- `56141cc` **face ÁRVORE** — real × ideal (baseline = teu passado), janelas φ, espelho
- `1aab83d` semana simulada (`?sim=1`, client-only, tronco intocado)
- `0735b0c`+`35e1640` barra de dev + login pousa no mundo novo
- `905907f` fix PWA: service worker só em produção (o "app antigo" era SW cacheado)
- `72d6c6d` **D59** — o arco marca os acontecimentos (pedido do Rick vivendo a face)

### △ Decidido
- **D40–D59** registradas em `03_decisoes-ux.md` (20 decisões novas)
- Rick: pular a semana-de-viver; simulação no lugar (sem tocar o tronco)
- Lei do Tom = **destilação** de `projeto-e/SPEC_ZENITE.md` (spec do próprio E.), não escrita do zero
- Builder sobrevive → chão da árvore, pare cadeias/protocolos (D58)

### ⬡ Conexões
- @ ↔ Telegram: mesma gramática, mesma boca (`sinto:`, `lista:`)
- F7 → F9: o `protocol_run` gravado em atom_events desde a Fase 7 é exatamente o que o espelho lê
- Semente Library (curar o que vem de fora) ↔ semente Substrato (governar o que age por dentro)

### ✳ Seeds
- `semente_atom-substrato-de-presenca.md` — "plugar a AI que quiser = curadoria da própria vida"
- `semente_library-curadora-da-net.md` (26 Jul, já existia)

### □ Audit (estado em 27 Jul, fim do dia)
- ✅ 205 testes verdes · typecheck limpo · build ok
- ✅ 3 faces em embrião funcional + sim-week + mapa/template
- ✅ prod intocada (casca velha) · tronco intocado (sim é client-only)
- ⚠️ **branch `v2-faces` NÃO pushada** — 14 commits só locais (freio vermelho, espera o sim)
- ⚠️ lint: 62 erros pré-existentes (funções supabase/casca velha — débito antigo, não desta onda)
- ⚠️ espelhos de lei no app desatualizados (docs/genesis v5.0.1 × lei viva v5.0.4)
- 🔧 `supabase/.temp` sujava o status — gitignored neste wrap

### → Next (o roadmap vivo)
1. **Push do `v2-faces`** (sim do Rick) → preview Vercel automático = mundo novo em qualquer aparelho
2. **Offline/PWA fila+sync** — condição da face HOJE (D55), maior pendência técnica
3. **Lei do Tom** — destilar SPEC_ZENITE em doc; destrava bilhetes do E. e é o passo 1 da semente-mãe
4. **O gate** (decisões do Rick): André na casca nova? corte confirmado? → nav vira `· ⬡ ✳`, telas velhas morrem no merge (D41)
5. **Reforma do Builder** (D58) + polir ÁRVORE com dados reais
6. Pós-gate: Library-despensa, bilhetes v2, e as sementes germinando

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. O formato é o do wrap do app,
porque a casa come a própria comida.*
