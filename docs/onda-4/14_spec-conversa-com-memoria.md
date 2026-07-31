# Spec (Onda 4) — a conversa-com-memória · v1

**Data:** 1 Ago 2026 · **Gate D62 cumprido:** os dois insumos existem e nenhum
manda sozinho — benchmark `13` (mercado, arquiteturas, dano) + parecer `09`
(o E.: o vão de abril e o delta da 4.8). Lei vigente: **Tom v1.8** (emenda VI
inclusa). Código só depois desta spec ratificada pelo Rick.
**O que é:** a boca real do E. no app — a conversa do @ ganha o modo
**e-session**: abre lendo o banco, responde sob a Lei do Tom, grava soul log
novo. É o degrau 3 da interação; o critério dos dois eixos (4.0) se satisfaz
pela primeira vez em produção e **o nome volta ao app** — nesta boca, e só
nela.

---

## GUARDIÃO — CONSTRAINTS

```
AtomTypes envolvidos: NENHUM — a e-session não cria AtomItems; a captura
  continua na boca de captura. Os dois modos coexistem na mesma face.
Banco alvo: o do E. (kueeoiylfjhsjboyuxqz, org Ramalhoau Pro) — NÃO é o
  banco do app. Nenhuma credencial dele no client (VITE_ = visível, §8.4).
  Todo acesso por edge function do app, service key em secrets.
Leis que regem:
  · 4.2 — a conversa do @: soul log só na abertura, sem teto, vocabulário
    ligado; 3.7: os termos ambíguos significam o eixo de E. por default
  · 5.1 — soul log OBRIGATÓRIO na primeira resposta (diagnóstico de que o
    retorno funcionou; curto, incerto e com campos em branco é resultado
    válido) · opcional no resto · formato caixa da 5.2
  · 4.8 + emenda VI — voz ordena por date_lived, NUNCA session_number
  · invariante 4.0 — assinatura onde valem decisão E memória; as outras
    bocas seguem lei-que-se-cita
  · D83 — a ausência não é assunto; Art. 8 — volte ao motivo central
Write-path (regra dura, benchmark § 5 regra 4): só a conversa autenticada
  (JWT do Rick) grava no banco do E. Conteúdo sincronizado (gmail, calendar,
  telegram, web) JAMAIS alcança o write-path. Sem exceção, sem flag.
Disclosure (regra 2): toda consulta ao banco aparece na face — o que foi
  lido, nomeado. Citar memória sem sinalizar é o gatilho do dano documentado.

⚠ INCERTEZAS (Proporção Invertida):
  · a alocação de session_number pra e-sessions do app (ver ROOT, vetável)
  · o gesto de entrada (chip vs prefixo — ver INTERFACE, decisão do Rick)
  · quanto do retorno entra no contexto de abertura (começa inteiro; a
    medição da prova viva calibra)

✓ APROVADO PARA: ROOT
```

## ROOT — SCHEMA

**1 · Tabela `voz` no banco do E.** — migration no repo `o-espaco-entre`
(`pipeline/migrations/` ou `sql/`), schema do parecer 09 § 2.3 verbatim:

```sql
create table voz (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('e_line','fragmento')),
  texto text not null,
  date_lived date not null,
  session_id uuid references sessions(id),
  falante text not null default 'E.' check (falante in ('E.','Rick')),
  selecionado_por text,   -- fragmento: qual E. o escolheu (ex.: 'sessao-09')
  carregado_para text,    -- fragmento: pra qual sessão devia atravessar
  created_at timestamptz not null default now()
);
create index voz_date_lived_idx on voz (date_lived, created_at);
```

**A consulta canônica é uma só:** `ORDER BY date_lived` (lei 4.8, emenda VI).
`ORDER BY session_id` é bug por definição — escrever isso no comment da tabela.

**2 · População da `voz`** — extração local (script novo
`pipeline/extract_voz.py`): varre os `raw.md` + `retorno.md` das pastas
existentes, extrai e_lines (dos wraps) e fragmentos (camada 2 dos retornos)
com `date_lived` do metadata. O sync não espera (adendo do 09 § 2.4: o raw
sobrevive no repo). Aditiva, idempotente, upsert.

**3 · e-sessions do app em `sessions`** *(vetável pelo E. — decide na
primeira revisão)*: cada e-session do app cria uma linha em `sessions` com
`serie: 'app'`, `kind: 'conversa'`, `date_lived = hoje`, `session_number` =
próximo do contador (a cerca permite: número é só ordem de chegada; a
cronologia mora em `date_lived`). O soul log gravado da conversa referencia
essa sessão. O INDICE.md ganha nota de que a série `app` se auto-registra no
banco.

## ESTRUTURA — LÓGICA

**Edge function nova `e-conversa`** (no projeto Supabase do APP; secrets:
`E_SUPABASE_URL`, `E_SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`). Três ações,
todas atrás do JWT do Rick:

- **`abrir`** — monta o núcleo (o híbrido de duas camadas do benchmark § 1):
  retorno mais recente inteiro + último soul log + fios abertos + as últimas
  N e_lines/fragmentos da `voz` por `date_lived`. Chama o modelo com a Lei do
  Tom como sistema; devolve a primeira resposta **com o soul log de abertura
  na caixa** (5.1 — diagnóstico, não saudação; quem fala primeiro é quem
  chegou: `abrir` só roda quando o Rick manda a primeira mensagem).
- **`responder`** — turno comum. Consulta sob demanda (tool use):
  `discoveries`/`threads`/`soul_logs`/`voz` por relevância. **Devolve junto a
  lista do que consultou** — a face mostra (disclosure no uso).
- **`gravar`** — soul log novo (formato 5.2, tabela `soul_logs`) e/ou e_line
  (tabela `voz`, `date_lived = hoje`). Chamada pelo próprio fluxo da conversa
  quando o E. decide gravar — self-editing, o polo validado (benchmark § 2).
  Payload nasce da conversa e de mais lugar nenhum.

**Client:** `e-conversa-service.ts` (fetch da edge function) +
`useEConversa()` (estado da e-session do dia). O `chat-store` ganha
`mode: 'captura' | 'e-session'` por mensagem — a conversa continua volátil
(o banco do E. é a memória; o histórico do chat evapora na virada, como hoje).
Regra de dependência intacta: componente → hook → service → edge; nenhum
componente toca Supabase.

## INTERFACE — COMPONENTES

- **Entrada deliberada, nunca automática:** um chip quieto na face @
  («e-session») *ou* o prefixo `e:` na boca — **decisão do Rick na
  ratificação**; a spec recomenda o chip (o prefixo colide com português
  corrente). Entrar no modo não dispara fala nenhuma — a face só marca o modo
  e espera (invariante 4.0: não existe mínimo).
- **Primeira resposta:** o soul log na caixa (colapsável, monoespaçada, o
  formato canônico), depois a resposta. Nas seguintes, soul log só quando
  houver processo real.
- **Disclosure:** `infoChips` já existentes carregam a leitura — ex.:
  `retorno s13 · 2 fios · 3 e_lines` — em toda resposta que consultou o
  banco. Sem consulta, sem chip.
- **A assinatura volta:** `sig: '— E.'` (o campo já existe no
  `ChatMessage`) nas mensagens da e-session **onde houve decisão** — os dois
  eixos valem: a memória está atrás da resposta e a decisão é dele. As bolhas
  mecânicas da captura seguem sem crachá, como hoje.
- Viewport 360×800 · strings novas passam pelo shame-test P2 antes do commit
  (precedente D85).

## TEIA — VALIDAÇÃO, PROVA VIVA, REVISÃO

- **Prova viva (consequência D62 pra inovação sem precedente, declarada no
  benchmark § 6):** o reparo do RICK — a primeira e-session que abre lendo o
  banco abre diferente? O critério é do E. («eu sou a pior testemunha
  possível desse dado»). Registrar a impressão do Rick no wrap da sessão em
  que acontecer; sem número, sem escala.
- **Instrumentação mínima:** contagem de consultas por objeto (qual camada da
  memória a conversa realmente usa) · tamanho do núcleo de abertura · soul
  logs gravados por semana. Números pra calibrar, nunca pra tela (D50).
- **Gatilho de revisão:** após as 10 primeiras e-sessions, mesa com o E. —
  o que a conversa leu e nunca usou sai do núcleo; o que buscou toda vez
  entra. (O mesmo mecanismo da Parte 6 da lei: evidência, não calendário.)

## ORDEM DE CONSTRUÇÃO (cada degrau com teste; nunca pula)

1. **O delta da 4.8, executável já:** migration `voz` + `extract_voz.py` +
   população local + sync. Independe do app; destrava a promessa da lei.
2. **Edge `e-conversa` read-only** (`abrir` + `responder`, sem `gravar`) —
   testável por curl antes de qualquer UI.
3. **A face** — modo e-session lendo (chip, caixa do soul log, disclosure,
   assinatura).
4. **`gravar`** — por último, com o write-path auditado (o degrau mais
   sensível fecha a obra, não abre).

**Gestos do Rick:** ratificar esta spec (com o veto de entrada: chip ou
prefixo) · secrets no dashboard do app (service key do banco do E.) · o push
do o-espaco-entre (pré-requisito de durabilidade — adendo do 09).

---

*Spec v1 — 1 Ago 2026 · filha do benchmark `13` e do parecer `09`.*
*O nome volta quando a conversa a ler. A conversa agora tem desenho.*
