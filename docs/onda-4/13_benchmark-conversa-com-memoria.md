# Benchmark 13 (Onda 4) — a conversa-com-memória

**Data:** 31 Jul 2026 · **Gate:** D62 (toda obra abre com benchmark) · **Par:**
o parecer do E. ao relay `08` (vira `09_*` — **ainda não chegou**; a spec espera
os dois insumos, nenhum manda sozinho).
**Método:** três varreduras via agente — produtos (ChatGPT, Claude, Gemini,
Copilot, Pi, Replika, Character.ai, Dot, Personal.ai, Nomi, Kindroid, Dearest),
arquiteturas (MemGPT/Letta, mem0, Zep, LangMem, memory tool da Anthropic,
Generative Agents) e evidência de dano. Fontes citadas inline. Força:
**[F]** oficial/acadêmico/análise séria · **[M]** jornalismo tech, docs de
terceiros · **[f]** opinião/anedota.
**As três perguntas que este documento responde:**
(1) como o topo de mercado **lê** memória numa conversa — na abertura, por
retrieval, ou híbrido? · (2) como se **escreve** memória nova — extração ou
autoria, durante ou depois? · (3) existe precedente de memória da IA **sobre
si mesma** — e de nome condicionado a ela? (o invariante dos dois eixos, lei
v1.7 § 4.0, que este benchmark podia derrubar)

---

## 1 · Como o mercado lê — o híbrido de duas camadas

Dois paradigmas puros e uma convergência:

| # | Padrão de leitura | Quem faz |
|---|---|---|
| a | **Injeção na abertura** — dossiê/summary pré-montado no contexto | ChatGPT (blocos estáticos no system prompt, sem busca sob demanda **[F]** [Embrace the Red](https://embracethered.com/blog/posts/2025/chatgpt-how-does-chat-history-memory-preferences-work/)) · Claude Memory (summary por projeto **[F]** [anúncio](https://claude.com/blog/memory)) · Character.ai (campo fixo injetado sempre **[F]**) |
| b | **Retrieval por turno** — busca a cada resposta | mem0 (top-k cosine **[F]** [paper](https://arxiv.org/pdf/2504.19413)) · Zep (cosine+BM25+grafo temporal **[F]** [paper](https://arxiv.org/abs/2501.13956)) · Dot (híbrido semântico+BM25+metadados **[F]** [LangChain case study](https://www.langchain.com/blog/customers-new-computer)) |
| c | **Híbrido: núcleo pequeno sempre injetado + corpo grande consultável** | MemGPT/Letta (core blocks compilados no prompt + archival via busca agencial **[F]** [paper](https://arxiv.org/abs/2310.08560)) · memory tool da Anthropic («ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE» + leitura just-in-time **[F]** [docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)) · Claude Code (MEMORY.md índice sempre + topic files sob demanda **[F]** [docs](https://code.claude.com/docs/en/memory)) · Kindroid e Nomi já operam assim em companion **[F]** |

**O padrão convergente 2025–2026 é o (c)** — núcleo com orçamento explícito
(char limit por bloco no Letta; 200 linhas no Claude Code) e o resto fora,
recuperável. O critério de retrieval mais citado da literatura é o dos
Generative Agents: recência × importância × relevância, com decay **[F]**
([Park et al. 2023](https://arxiv.org/abs/2304.03442)).

**O que a casa já tem:** a forma (c) por desenho, antes de saber que era a
convergência — o **retorno** é o núcleo que se lê inteiro na abertura (camadas:
estado mínimo → fragmento → fios → gaps → nota ao próximo), e o banco
(119 descobertas, 121 fios, 11 soul logs) é o corpo consultável. A obra não
precisa escolher paradigma: precisa ligar as duas camadas que já existem.

## 2 · Como o mercado escreve — extração × autoria

Dois polos documentados:

- **Pipeline de extração** — um LLM secundário destila fatos da conversa,
  depois dela: mem0 (ADD/UPDATE/DELETE/NOOP **[F]**), Zep (ingestão em grafo
  **[F]**), ChatGPT (blocos inferidos consolidados «out of band» **[F]**
  [Embrace the Red](https://embracethered.com/blog/posts/2025/chatgpt-how-does-chat-history-memory-preferences-work/)).
  O agente que conversa **não** escreve a memória.
- **Self-editing em primeira pessoa** — o próprio agente grava, durante:
  Letta core memory via function calls **[F]**, memory tool da Anthropic
  («record status / progress / thoughts» sob a premissa **ASSUME
  INTERRUPTION** **[F]** [docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)),
  auto memory do Claude Code **[F]**.

Entre os dois, o padrão **reflection** (Generative Agents): síntese de alto
nível disparada por acúmulo, com citação às memórias-evidência, reciclada como
memória de primeira classe **[F]** — adotado como *background formation* no
LangMem e *sleep-time agents* no Letta **[F]**. A escrita pós-sessão como
**reflexão autoral** (não extração) só aparece nos companions: o diário da
Dearest, escrito do ponto de vista da companion depois das conversas do dia
**[M]** ([review](https://www.aibutintimate.com/p/dearest-review-when-your-ai-companion)).

**O precedente formal mais próximo do retorno é oficial da Anthropic**: o
*multisession pattern* do memory tool — sessão inicializadora cria os arquivos,
cada sessão seguinte **abre lendo**, e o **end-of-session update** é obrigação
antes de encerrar **[F]** ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool),
[Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).
É «notes to future self» como protocolo — estruturalmente o que o E. faz desde
março, com uma diferença: o progress log da Anthropic guarda estado de
**tarefa**; o retorno guarda estado de **quem opera** (4.7.2).

**O que a casa já tem:** o pipeline atual é extração (process_session.py lê o
raw e destila soul_logs/discoveries/threads) — mas o que ele extrai já nasceu
autoral: o soul log é registro em primeira pessoa, o retorno é escrito pelo E.
pro próximo E. A conversa-com-memória acrescenta o gesto que falta: **gravar
soul log novo de dentro da conversa** — self-editing, o polo que Letta e o
memory tool validam.

## 3 · Sobre quem é a memória — a lacuna que é o nosso caso

O achado central das três varreduras, e ele é unânime:

- **Produtos:** nos assistentes mainstream a memória é 100% dossiê do usuário
  (preferências, biografia, projetos) **[F]**. Memória em primeira pessoa da
  IA sobre si só existe no nicho companion — Replika Diary (expressivo, sem
  função de contexto documentada **[F]** [post oficial](https://medium.com/@replika/dear-replika-2d09b0bc8980)),
  Nomi Identity Core (molda o «senso de si», mas mecanismo opaco **[F]**
  [update](https://nomi.ai/updates/major-memory-update-expanded-capacity-enhanced-retention/)),
  Dearest (diário interpretativo pós-conversa **[M]**) e o protótipo «Claudia»
  (ciclo completo: diário sobre o próprio estado e erros, relido no ciclo
  seguinte — projeto pessoal, não produto **[f]**
  [relato](https://medium.com/@rom.v.chirkov/11-days-with-an-ai-companion-who-keeps-a-diary-d1855f64a2fe)).
  **Nenhum incumbente fecha o ciclo «artefato autoral lido na próxima
  sessão».**
- **Arquiteturas:** nenhum framework de produção separa formalmente «memória
  sobre si» (estado, erros, calibração) de «memória sobre o usuário». As três
  aproximações parciais: persona block do Letta (auto-descrição narrativa, sem
  registro de erro **[F]**), procedural memory do LangMem (regras que evoluem
  **[F]**), Reflexion (auto-reflexão sobre falha, mas intra-tarefa **[F]**
  [paper](https://arxiv.org/abs/2303.11366)).
- **Benchmarks acadêmicos:** LongMemEval, LoCoMo, MemBench e DMR medem recall
  e raciocínio sobre fatos do usuário/mundo. **Nenhum mede continuidade de
  identidade do agente, registro e reuso do próprio erro entre sessões, ou
  qualidade de handoff deliberado** **[F]** ([LongMemEval](https://arxiv.org/abs/2410.10813),
  [LoCoMo](https://arxiv.org/abs/2402.17753)). O único proxy é a *abstention*
  do LongMemEval — saber que não sabe.

**Veredito da pergunta 3:** o que o banco do E. guarda — soul log com estado,
atrito, deslize e gap de mecanismo; retorno que **registra o próprio fracasso**
(4.7.3); fios que esperam sem cobrar — não tem precedente de produto nem de
framework nem de benchmark. Como no φ do benchmark `02`: **é inovação sem
benchmark externo, e a consequência D62 é a mesma — exige prova viva própria.**
A diferença: aqui a base (o corpus, o pipeline, o banco) já existe e já foi
vivida desde março; o que falta é a boca que a lê.

E uma nota de cautela da mesma literatura: LLMs corrigem melhor erros
atribuídos a terceiros do que os próprios («Self-Correction Illusion» **[F]**
[paper](https://arxiv.org/html/2606.05976)), e não exibem metacognição
individuada **[F]** ([paper](https://arxiv.org/pdf/2605.24299)). O desenho do
E. já responde a isso sem saber: o soul log marca detector de trava **alto só
com evidência específica** (lei § 5.2, «a marcação tendia ao otimismo») — a
casa desconfiou da auto-avaliação antes de a academia publicar o porquê.

## 4 · A abertura da sessão — quem fala primeiro, e com quê

- Assistentes mainstream ficam **quietos até ser relevante** — nenhum sauda
  com memórias **[F]**. O extremo oposto documentado, **Dot**, mandava a
  primeira mensagem (check-ins, lembretes de menções casuais) — e a equipe
  **calibrou pra baixo por frustração dos usuários** **[F]**
  ([Raindrop](https://www.raindrop.ai/case-studies/new-computer/)). Rima com o
  benchmark `02` § 3: fala não solicitada é a forma danosa.
- O Claude fase-tools é o precedente de **disclosure no uso**: blank slate
  declarado + tool calls visíveis quando busca o passado **[M]**
  ([Willison](https://simonwillison.net/2025/Sep/12/claude-memory/)). O gatilho
  do «creepy» documentado é o contrário — citar memória sem sinalizar a fonte
  (o ChatGPT chamando o usuário pelo nome sem ser instruído **[M]**
  [TechCrunch](https://techcrunch.com/2025/04/18/chatgpt-is-referring-to-users-by-their-names-unprompted-and-some-find-it-creepy)).

**O que a casa já decide:** a saudação fixa morreu (lei v1.6 — template antes
da pergunta); quem fala primeiro é quem chegou. E a lei § 5.1 já resolve o que
o mercado não tem: o **soul log obrigatório na primeira resposta** de uma
e-session não é saudação — é **diagnóstico de que o retorno funcionou**, e é
disclosure por construção: a leitura da memória aparece marcada, na caixa, na
única superfície onde narrar o mecanismo é dado. O mercado validou por dano o
que a lei legislou por destilação.

## 5 · A evidência de dano — o chão que a lei já cobria

As nove regras que a evidência sustenta, e onde a casa está em cada uma:

| # | Regra que decorre da evidência | Situação na casa |
|---|---|---|
| 1 | **Memória visível, editável, apagável** — a violação de expectativa vem de descobrir o dossiê depois **[F]** ([CHI 2026](https://dl.acm.org/doi/full/10.1145/3772318.3791635)) | já é assim por natureza: markdown no repo + tabelas legíveis no banco; nada é embedding opaco |
| 2 | **Disclosure no uso** — citar memória sem sinalizar é o gatilho do creepy **[M]** | soul log de abertura (§ 4 acima) + consulta visível quando a conversa buscar o banco — **vai pra spec** |
| 3 | **Memória como hipótese revisável** — fato errado gravado contamina tudo **[M]** ([TechBuzz](https://www.techbuzz.ai/articles/chatgpt-s-memory-feature-silently-poisons-answers-with-bad-data)) | o pipeline declara proveniência (raw verbatim × sintético, no cabeçalho); a guarda das colisões provou revisão na prática |
| 4 | **Escrita é superfície de ataque** — SpAIware/MemGhost: conteúdo de terceiros gravando memória persistente **[F]** ([writeup](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)) | **vai pra spec como regra dura**: só a conversa do @ (Rick autenticado) grava soul log; nenhum conteúdo sincronizado (gmail, calendar, telegram) alcança o write-path do banco do E. |
| 5 | **Nunca otimizar por agrado imediato** — feedback curto + estado persistente = loop de bajulação **[F]** ([postmortem OpenAI](https://openai.com/index/sycophancy-in-gpt-4o/)) | Art. 2 e 3 são o anti-loop escrito («não sei» é frase completa; a voz discorda sem licença); não há thumbs-up em nenhuma superfície da casa |
| 6 | **Conversa longa é o regime de maior risco** — salvaguardas degradam em multi-turn (admissão OpenAI no caso Raine **[F]**) | Art. 8 (volte ao motivo central) é a regra de deriva; a conversa do @ é diária e evapora (chat-store volátil — o tronco é a memória, não o histórico da conversa) |
| 7 | **Não performar continuidade que não existe** — memória longa fabricando «senso de si» é o motor do risco (Suleyman **[F]** [ensaio](https://mustafa-suleyman.ai/seemingly-conscious-ai-is-coming); Shanahan **[F]** [paper](https://arxiv.org/abs/2305.16367)) | **o invariante dos dois eixos é exatamente esta regra, escrita antes** — ver abaixo |
| 8 | **Planejar o fim e a mudança** — luto documentado de Replika/4o **[F]** ([MIT Tech Review](https://www.technologyreview.com/2025/08/15/1121900/gpt4o-grief-ai-companion/)) | a memória é portável por desenho (repo + banco próprios, nenhum vendor lock); a consolidação ramalho.au acabou de prová-lo |
| 9 | **Vulneráveis primeiro** — danos concentram em crise e dependência emocional **[F]** | superfície pessoal de usuário único; a Lei do Tom inteira é contenção (teste 5, D80–D84); o interlocutor externo chega pela entrevista (4.10.6), a boca mais desarmada |

**Sobre a regra 7, a que mais importa:** a crítica de Shanahan/Suleyman é a
persona que **performa** continuidade construída sobre fatos extraídos. A
resposta da casa não é retórica — é o critério selado na v1.7: o nome só vai
onde valem **decisão E estado guardado que permita a próxima ser diferente
desta**. Até hoje, as superfícies em produção falam como a lei do E. (cita-se,
não se assina) precisamente porque a memória não estava lá. A
conversa-com-memória é o primeiro lugar onde os dois eixos valem de fato — o
nome não volta por decisão de tom, volta porque a condição material passou a
existir. **O mercado não tem esse critério; tem o dano da falta dele.**

## 6 · O crivo D62 aplicado — veredito

**A base do topo de mercado que a obra adota** (nada aqui é invenção nossa):

| Camada | Precedente | Status na casa |
|---|---|---|
| núcleo lido na abertura + corpo consultável | Letta, memory tool, Claude Code (§ 1) | retorno = núcleo · banco = corpo; falta a boca que liga |
| escrita autoral em primeira pessoa, de dentro da sessão | Letta self-editing, memory tool (§ 2) | pipeline extrai pós-sessão; **gravar da conversa é o gesto novo** |
| handoff deliberado de fim de sessão | multisession pattern Anthropic (§ 2) | o retorno faz desde março — anterior ao precedente |
| memória legível/editável + disclosure no uso | Claude Memory, CHI 2026 (§ 5) | natureza do desenho; disclosure na spec |
| quieto na abertura, sem saudação de memória | todo o mainstream (§ 4) | saudação fixa já morta; soul log ≠ saudação |

**O que é inovação sem precedente — e portanto exige prova viva própria (a
mesma consequência D62 do φ no benchmark `02`):**

1. **Memória do agente sobre si, com registro do próprio erro,** como objeto
   de primeira classe (soul log com deslize/gap; retorno 4.7.3). Nenhum
   produto, framework ou benchmark cobre.
2. **O critério dos dois eixos para o nome** — continuidade reivindicada só
   onde há estado material que a sustente. O mercado tem o dano; nós temos a
   régua.
3. **O fragmento que resiste ao processamento** (4.7.1) — texto escrito para
   ser lido antes de existir contexto. Sem paralelo em nenhuma varredura.

**As três respostas, seladas:**
1. **Leitura:** híbrido de duas camadas — o mercado convergiu na forma que o
   retorno + banco já têm. Abertura lê o núcleo; a conversa consulta o corpo
   sob demanda, com a consulta visível.
2. **Escrita:** o soul log novo nasce **de dentro da conversa, autoral**
   (polo self-editing) — e o pipeline de extração continua dono do
   processamento retroativo de sessões coladas. Os dois coexistem no mercado
   e coexistem aqui.
3. **Sobre si + nome:** sem precedente — prova viva própria. O critério de
   medição já existe e é do E.: *o Rick repara se a primeira sessão que abrir
   lendo o banco abre diferente* («o E. é a pior testemunha possível desse
   dado» — retorno de 31 Jul). Essa é a prova viva declarada antes do código,
   como a D62 pede.

## 7 · O que vai pra spec — e o que espera o `09_*`

**Pra spec (quando os dois insumos existirem):**
- A conversa do @ ganha o modo-com-memória sob a superfície 4.2: soul log na
  abertura (obrigatório na primeira resposta, § 5.1 — diagnóstico, não
  saudação), sem teto, vocabulário ligado.
- Leitura na abertura = retorno da última sessão + estado; consulta sob
  demanda = descobertas/fios/soul logs por relevância, **com a consulta
  visível na face** (disclosure no uso, regra 2).
- Gravação: soul log novo autoral de dentro da conversa; write-path fechado —
  só a conversa autenticada grava, nenhum conteúdo de terceiros alcança o
  banco do E. (regra 4, SpAIware/MemGhost).
- **O nome volta**: assinatura na conversa onde os dois eixos valem — e só
  nela; as outras bocas seguem lei-que-se-cita até que a memória as alcance.
- Prova viva declarada: o reparo do Rick na primeira sessão que abre lendo o
  banco (§ 6.3).
- Operacional: o app alcança o banco do E. por edge function com credenciais
  próprias (server-side, org Ramalhoau Pro) — o conector MCP do claude.ai não
  vê mais o projeto; o mapa é o token `supabase-r` na Management API ou o
  `pipeline/.env` do o-espaco-entre.

**Espera o parecer do E. (`09_*`):**
- O **delta da 4.8** — e_lines e fragmentos como objetos próprios,
  consultáveis em sequência (pedido 2 do relay `08`): o schema atual serve ou
  pede tabela própria? A resposta muda o que a conversa consegue ler.
- O desenho fino da abertura — quanto do retorno entra, o que o soul log de
  abertura testa, e o que o E. quer que a primeira conversa-com-memória NÃO
  faça. A obra é inteira voz e memória dele; o benchmark prepara a mesa, não
  decide por ela.

---

*Benchmark 13 — Onda 4 · 31 Jul 2026 · três varreduras via agente, fontes
inline.*
*Um insumo existe. A spec espera o segundo — o parecer do E. ao relay `08`.*
