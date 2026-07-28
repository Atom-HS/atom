# Páginas internas — o mapa do que falta (UX + verificação)

*28 Jul 2026 · levantado a pedido do Rick: "continuar o desenho do UX,
funcionalidade e páginas internas — saber que as funções estão funcionando,
a tela tá certa". As 3 faces nasceram; quem vive nelas cai nas páginas
internas — e essas seguem da casca velha, sem desenho novo e sem prova
visual de que o fluxo funciona.*

## O diagnóstico em três linhas

1. **Shell e nav são da casca velha** — `AppShell` se declara "light-first"
   (D57 diz mundo escuro deliberado) e a `BottomNav` tem as 5 abas antigas
   (home · pipeline · raiz · projects · calendar). As faces só são
   alcançáveis pelo banner âmbar de dev — gambiarra assumida.
2. **Toda página interna tocada a partir das faces é velha** — o chip
   "abrir" do @ cai num `ItemDetail` com barra de stages (D48 matou funil;
   D46 matou %), o wrap tem flow novo (Onda 2) mas pele velha, search e
   settings ainda são abas (D54: gesto e sheet).
3. **Nenhuma verificação visual do mundo novo** — os e2e (`visual-pages`,
   `visual-flows`) fotografam só a casca velha. Os 214 testes provam os
   motores; ninguém prova que "a tela tá certa".

## O mapa, página por página

| Página | Estado hoje | Decisão que rege | Veredito |
|---|---|---|---|
| **AppShell / TopBar / BottomNav** | ✅ **reformado 28 Jul** — nav `· ⬡ ✳`, tokens D57, banner âmbar morto | D41 (nav · ⬡ ✳), D57 (tokens) | **FEITO** — obra 1 entregue |
| **ItemDetail** | stage bar, classify/advance, era pipeline | D48 (maturação no galho), D46 (número = estado), D57 | **REFORMA JÁ** — página interna nº 1: todo chip "abrir/ajusta" cai aqui |
| **Wrap** | flow F3 novo (lê o tronco), pele velha | D57 + Lei do Tom 4.4 (e_line 0-ou-1, sem repetição) | **REFORMA** — reskin + e_line sob a lei |
| **Search** | aba com chips de filtro | D54: busca = gesto (puxar pra baixo) | **VIRA GESTO** — motor (`engine/search`) fica; aba morre |
| **Settings** | aba cheia (profile, conectores, export) | D54: pull discreto (sheet) | **VIRA SHEET** — conteúdo sobrevive, lugar muda |
| **Raiz** | doors de onboarding, HealthBar | D50 (chão da árvore), D58 (Builder mora aqui) | **REFORMA JUNTO DO BUILDER** — já é destino do drill da ÁRVORE |
| **Review** | ritual da escada F4, funcional | D57 | **RESKIN LEVE** — o ritual fica |
| **Library** | aba com cards | D51: despensa, não aba | **VIRA DESTINO DE DRILL** — reskin quando a despensa nascer |
| Home · Pipeline · Graph · Analytics · Projects · Calendar | telas velhas | D48 + parecer §telas | **MORREM NO GATE** — zero obra |

## Verificação funcional — o que está provado e o que não

- ✅ **Motores**: 214 testes unitários (sky, today, mouth, tree, mirror,
  outbox, list, protocol…) — a lógica está provada.
- ✅ **Fluxo Telegram**: vivo em prod, testado no uso.
- ⚠️ **Faces no navegador**: nenhum e2e abre `/hoje`, `/at` ou `/arvore`.
  Captura→chip→ItemDetail, lista→pill→mercado, sim-week, offline→fila→sync:
  tudo verificado só à mão.
- ⚠️ **e2e visuais**: fotografam a casca velha — inúteis pro gate.

**Obra de verificação:** e2e novo fotografando o mundo novo (3 faces +
ItemDetail + wrap, light/dark, com sim-week como dado determinístico) —
vira a prova objetiva de "a tela tá certa" e o guarda de regressão do gate.

## Ordem proposta (cada passo destrava o seguinte)

1. ✅ **Shell novo** *(28 Jul)* — nav `· ⬡ ✳` na branch, tokens D57 no
   `index.css` (mundo único — media query e `html.light/dark` caíram; o
   toggle de tema fica inerte até a obra 5 levar Settings pro sheet),
   banner âmbar morto (sobrou só o aviso `?sim=1`). TopBar quieto com as
   duas portas de andaime (buscar/menu) que a obra 5 mata (D54).
2. **ItemDetail reformado** — a página interna mais tocada; maturação vira
   glifo no galho, linguagem de presença, corpo por tipo (list entries já
   vive lá).
3. **e2e do mundo novo** — as fotos que provam a tela.
4. **Wrap reskin** + e_line sob a lei (0-ou-1, sem repetição).
5. **Settings-sheet + Search-gesto** (D54).
6. **Raiz + Builder** (D50 + D58) — a obra grande que o roadmap já tinha.

---

*O gate (D41) continua esperando vivência — mas vivência sem páginas
internas novas testa só metade do mundo. Esta fila é o que falta pra
vivência valer.*
