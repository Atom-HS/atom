# Semente — o cofre da vida adulta

*29 Jul 2026 · despejo do Rick ao abrir a obra Raiz+Builder. Selada no dia,
verbatim.*

## As palavras dele

> "raiz eh um coracao do app da onde sai o mindmate — tenho muitos projetos
> no assunto, o raiz mora muito perto do coracao, pq eh minha eterna batalha
> para me organizar, ter um lugar unico com tudo, seguro, com lembretes de
> exp, ou ausencia, tudo batendo com as necessidades de um adulto — tax,
> saude, conta etc — seria um sonho. isso de um lado, e mesma coisa com o
> digital na library, repo e etc ne"

## O desdobramento

**A dor: a vida adulta não tem inbox.** Passaporte vencendo, tax deadline,
seguro que renova sozinho, exame que ninguém pede, senha que só existe na
cabeça. Cada coisa mora num lugar; nenhum lugar avisa. A resposta do Atom
não é mais um app de documentos — é a **raiz da árvore ser o cofre**:

1. **Um lugar único, seguro** — os 9 domínios da Raiz (identidade,
   documentos, saúde, finanças, arquivos, memórias, tempo, comunicação,
   projetos) já são o mapa do cofre. O que falta não é estrutura — é a
   raiz *falar*.
2. **Lembrete de expiração** — coisa com validade (passaporte, seguro,
   visto, receita, tax deadline) avisa ANTES de vencer. Estado, nunca
   alarme (D46): "o passaporte vence em 60d", não "VENCIDO!!!".
3. **Lembrete de ausência** — o que importa e ninguém toca há tempo
   demais: "dentista — 2 anos sem registro", "backup das fotos — nunca".
   A ausência é informação; hoje ela é invisível.
4. **O espelho digital** — a mesma leitura pro patrimônio digital:
   repos, domínios, assinaturas, storage. Vive na Library-despensa
   ([[semente_library-curadora-da-net]]) com a mesma gramática de
   validade e ausência.

## O que já existe (a semente não nasce no vazio)

- **Raiz, 9 domínios + 3 portas** — `config/raiz.ts`, zero schema novo,
  tags `#domain:*`. O inventário da vida já tem onde morar.
- **`useRaiz`** — já mede count/idade/staleness por domínio. O embrião da
  leitura de ausência já roda.
- **`body.operations.deadline`** — o campo de validade já existe no
  schema (Genesis, extensão operations). Expiração não pede migration.
- **MindMate** — `features/raiz/mindmate.ts`, o easter egg que já mora na
  raiz (digite "mindmate" num freetext). O coração que o Rick lembrou.
- **D50** — raiz = chão da árvore; % vira estado quieto. O cofre é a
  leitura que o chão faz.
- **Telegram + @** — as bocas por onde o aviso de validade pode falar
  (voz do E., push só protocolo — D56).

## Gate

A obra Raiz+Builder da Onda 3 (spec `08_raiz-builder_spec.md`) planta o
chão: domínios como destino de drill, leitura de ausência, validades
visíveis. O cofre completo — cadastro guiado de validades, avisos pelas
bocas, espelho digital na Library — germina pós-gate, na fila das
sementes.

---

*"Seria um sonho." — a régua da semente: quando o Rick não lembrar mais
de cabeça quando o passaporte vence, ela deu fruto.*
