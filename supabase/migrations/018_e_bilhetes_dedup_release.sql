-- 018_e_bilhetes_dedup_release.sql — a dedup ganha o crachá certo (05b §1.1)
-- O E. auditou a fusão: a borda do G1 era garantida pela remoção do registro
-- (delete next.gmail[key]), não pela dedup — e a invariante ficava sem
-- guardião nomeado. Opção 2 dele, preferida: a dedup passa a sustentar
-- sozinha a semântica — bloqueia enquanto a chave existir; o RELIGAR limpa
-- a chave (dedup_key = null), e aí o próximo desligamento é estado novo e
-- fala de novo. Dois guardiões independentes.
-- A chave precisa poder ser solta: cai o NOT NULL. O texto do bilhete segue
-- imutável — a chave é metadado operacional, não fala.

alter table public.e_bilhetes alter column dedup_key drop not null;
