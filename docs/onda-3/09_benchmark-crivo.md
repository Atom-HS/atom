# Benchmark sob a lei D62 — cofre · rotinas · entrevista

*29 Jul 2026 · o primeiro benchmark do crivo do topo de mercado (D62).
Três agentes de pesquisa, mercado 2024–2026 + evidência científica.
Serve à obra 6 (`08_raiz-builder_spec.md`). Fontes nos relatórios; as
principais estão linkadas aqui.*

## Veredito em uma linha por frente

| Frente | Veredito | O achado que muda a obra |
|---|---|---|
| **Cadeia + Protocolo** | ✅ fundação **à frente do mercado inteiro** | disparo por estado emocional é a intervenção com maior efeito documentado da psicologia comportamental (d=0.65–0.91) e nenhum app mainstream faz |
| **Cofre da vida adulta** | ✅ método certo, **1 falha estrutural** | `updated_at` como proxy de ausência mente; ausência precisa de evento significativo explícito |
| **Entrevista (Builder)** | ✅ "uma gaveta por vez" **validada pelo mercado** | capítulos retomáveis de 5–8 perguntas com estrutura nascendo viva no fim de cada um |

---

## 1 · Cadeia + Protocolo — à frente, com 3 table stakes a cobrir

**A ciência valida o par inteiro.** Cadeia = habit stacking ancorado em
rotina — e RCT (Keller 2021) mostra que cue de rotina SUPERA cue de horário
pra automaticidade: nossa proibição de horário-sozinho não é dogma, é
alinhamento com a evidência. Protocolo = implementation intention
("quando X → Y") — meta-análise Gollwitzer & Sheeran: d=0.65 em 94 testes;
com cue emocional, d=0.91. E o usuário *declarar* o estado ("sinto:")
funciona melhor que o sistema inferir por sensor (evidência JITAI) — a boca
da alma já é o desenho certo.

**O que ninguém tem:** disparo por estado interno como cidadão de primeira
classe; o par completo (cadeia cobre o previsível, protocolo o
imprevisível); builder que pare estrutura personalizada (Fabulous prescreve
programas fixos).

**Table stakes a cobrir (prioridade):**
1. **Chain player** — execução guiada elo-a-elo com progresso visível
   (padrão-ouro: Routinery). Sem isso a cadeia é só lista.
2. **Consistência que perdoa** — força-de-hábito com decaimento suave
   (modelo Loop), NUNCA streak binário: a evidência condena (culpa, churn,
   ~3x mais abandono após a 1ª falha). A casa já sabia — Lei do Tom v1.4:
   "parabenizar streak é cobrar com outra cara". Agora tem a ciência junto.
3. **Registro de execução do protocolo** — disparou → "usei e funcionou?"
   fecha o loop de reforço. (O `protocol_run` em atom_events já é o embrião.)
4. Valor no dia 1 (a maior queixa do Fabulous é o gating lento).
5. Declarar estado em 1 gesto, no máximo 2 (senão o protocolo nunca acorda).

## 2 · Cofre — método certo, uma falha estrutural, um risco de produto

**O que temos que ninguém tem:** (a) **lembrete de ausência** — inédito na
categoria consumer; só existe em B2B de recall clínico e micro-apps "days
since" isolados; (b) **mecanismo unificado** — um campo (`deadline`) + um
derivado cobrindo 9 domínios, onde o mercado fragmenta em 4 apps
(Trustworthy docs, Rocket Money assinaturas, 1Password logins, GetReminded
validades); (c) cofre dentro de um OS pessoal, não app-silo.

**Falha estrutural (corrigir ANTES de construir):** `updated_at` como proxy
de ausência mente — qualquer toque administrativo (retag, correção) reseta
o relógio e silencia o sinal. Ausência deriva de **evento significativo
explícito** ("visita/uso/registro em X"), como o recall clínico faz
("última *visita*", nunca "última edição do cadastro"). Barato agora, caro
depois.

**Table stakes a cobrir (prioridade):**
1. **Antecedência por tipo** — `deadline` cru avisa tarde. Passaporte =
   8–9 meses antes (regra dos 6 meses de validade na entrada — GetReminded,
   1Password); cartão/CNH = 2 meses. Lead time é regra de domínio.
2. **Rolagem pós-renovação** — "renovado até X" ou o item vira lixo vencido.
3. Extração automática de data (foto/PDF → deadline) — virou expectativa
   (Trustworthy Autopilot); faseável: v1 manual, v1.5 edge function+Claude.
4. Captura sem fricção (foto/email-in) — cofre que exige upload fica vazio.
5. Acesso de emergência — core da categoria "vault"; pode esperar (uso solo).

**Risco de produto — o dado mais duro da pesquisa:** Life OS em Notion
morre em ~1 mês por falta de gatilho que puxe de volta; a categoria nasceu
de uma multa de A$1.000 por rego vencida (Eggy). **Leitura quieta como
canal ÚNICO não protege ninguém.** A síntese que preserva a filosofia:
estado quieto no app + **um digest raro e assíncrono** (só quando há algo
vencendo/ausente). "Nunca alarme" continua lei; "nunca avisa" não pode ser.

## 3 · Entrevista — a filosofia da casa, confirmada e afiada

**Estrutura recomendada: híbrida.** Capítulos que escrevem nos 9 domínios
por baixo dos panos, mas a conversa em linguagem de vida (módulos) — o
usuário nunca pensa em taxonomia (Duolingo pergunta "por que você quer
aprender?", não "selecione seu perfil"). Primeira pergunta = "por onde quer
começar?" (as portas que já temos).

**Formato: capítulos retomáveis, nunca sessão única.** Capítulo = uma
gaveta = 5–8 perguntas = 2–4 min, com payoff no fim (estrutura criada e
MOSTRADA — o setup é o produto, à la YNAB). Primeiro capítulo curtíssimo
(Headspace: 2–3 perguntas) gerando algo vivo na primeira sessão. Mapa das
9 gavetas persistente (vazia/começada/viva) como convite de retomada.

**Regras de ouro:** teste da tesoura (pergunta que não muda a estrutura
gerada → inferência ou tesoura) · insight devolvido a cada 3–5 perguntas ·
explicar o porquê antes de pergunta sensível (documentos/finanças/saúde) ·
pular sempre visível · "montando…" breve antes de revelar (labor illusion,
HBS) · mostrar a estrutura nascendo (nunca 113 telas sem produto).
**Dark patterns banidos:** pergunta-teatro, progresso falso, sunk cost como
arma, confirmshaming no pular.

---

## O que muda na spec 08

1. **Ausência** (Guardião): sai `updated_at`, entra evento significativo —
   toque real registrado em `atom_events` (o trilho de `checkin`/
   `protocol_run` já existe; zero migration se o evento é uma linha nova).
2. **Validade** (Guardião): `deadline` + `lead_time` por tipo/tag com
   defaults de domínio (passaporte 9m, cartão 2m) + gesto de renovação.
3. **D63 (cofre v1)** ganha corpo: leitura quieta no chão + a válvula
   assíncrona (digest raro) entra na conversa da decisão 3 (bocas).
4. **D64 (builder)**: entrevista em capítulos-gaveta retomáveis com payoff;
   reescrita de perguntas agora tem gabarito de mercado (obra de voz com o
   E., pós-motor).
5. **Chain player e força-de-hábito** entram no mapa da obra (a execução da
   cadeia vive no HOJE — pode ser etapa própria ou obra irmã).

---

*Crivo D62 aplicado: base validada, inovações confirmadas como inéditas,
furos nomeados antes do código. Os três relatórios completos com todas as
fontes estão no diário da sessão de 29 Jul.*
