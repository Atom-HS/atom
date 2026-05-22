# Known Bugs

## triage-classify edge function: parser frágil

**Descoberto:** 22 mai 2026, durante validação "triage Fase 5 chegou em master"
**Status em master:** latente, não consertado
**Status em ui-v2:** mesmo bug — refactor +14/-17 daquela branch foi cosmético, não tocou no parsing
**Severity:** UX-bloqueante quando dispara, mas não corrompe dados

### Sintoma observado

Card "sugestão do triage" mostra:
- type = `note`
- module = `bridge`
- confidence = 20
- reasoning = `Failed to parse AI response`

Valores idênticos ao fallback hard-coded — confirma que **não é classificação real do Haiku**, é o handler de erro.

### Causa raiz

`supabase/functions/triage-classify/index.ts` (deployed v16):

```ts
const text = data.content?.[0]?.text || '{}';
try {
  parsed = JSON.parse(text);
} catch {
  parsed = { title: input, type: 'note', module: 'bridge',
             confidence: 20, reasoning: 'Failed to parse AI response',
             tags: [], due_date: null, emotion: null };
}
```

`JSON.parse(text)` cego. Claude Haiku ocasionalmente ignora "Return ONLY JSON. No markdown, no backticks." e devolve com fence ou prefixo (ex: `Here's the classification:\n\`\`\`json\n{...}\n\`\`\``). Parse falha, fallback dispara.

### Fix proposto (não aplicado)

Extrair JSON antes de parsear:

```ts
const match = text.match(/\{[\s\S]*\}/);
const jsonStr = match ? match[0] : text;
parsed = JSON.parse(jsonStr);
```

Ou usar JSON mode da Anthropic API (se disponível em Haiku 4.5). Ou ambos.

Deploy via `supabase functions deploy triage-classify` ou MCP `deploy_edge_function`. Não exige migration nem mudança de schema.

### Sinais nos logs

`mcp__claude_ai_Supabase__get_logs` mostrou todas as invocações como HTTP 200 em 1.5-2.2s — sem erro de rede, sem 429, sem 502. Confirma que o erro está **internamente no parse**, retornado como 200 com payload de fallback.

### Tentativa de fix (v17, 22-mai-2026)

Deployed v17 com extract de JSON antes do parse:

```ts
const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
const braceMatch = text.match(/\{[\s\S]*\}/);
const jsonStr = fenceMatch ? fenceMatch[1].trim() : (braceMatch ? braceMatch[0] : text);
parsed = JSON.parse(jsonStr);
// catch agora também loga: console.error('Triage parse failed. Raw text:', text);
```

**Resultado:** ainda falhou no teste manual. Significa que o problema não era só fence/prefixo — Haiku pode estar retornando JSON malformado (vírgula extra, aspas inconsistentes, ou texto que não fecha `}`). Próxima investigação precisa puxar `get_logs` com o `console.error` novo pra ver o raw text.

### Decisão (22-mai-2026)

**Pivô:** abandonar AI como caminho primário do triage. Implementar **manual-first** (tokens + chips) que aproveita a infra existente (`pipelineService.captureWithModule`, `quickClassifyAndStructure`). AI vira fallback opcional pra inputs sem token — quando/se for útil.

Razão: AI estava bloqueando uso real do app; UX manual carrega 80% do uso porque Rick já sabe módulo/type no momento da captura.
