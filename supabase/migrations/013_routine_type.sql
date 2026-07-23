-- ═══════════════════════════════════════════════════════════════
-- 013_routine_type.sql — Fase 6 (Onda 2): routine builder
-- Spec: docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md · D2
--
-- Rotina = sequência de hábitos encadeados (D2: ritual ≠ rotina ≠
-- protocolo). Item-contêiner com a cadeia ordenada no body
-- (chain: item ids) + Recurrence própria; elos são habits ligados
-- por belongs_to. Completion = a cadeia executada no período.
-- ═══════════════════════════════════════════════════════════════

ALTER TYPE atom_type ADD VALUE IF NOT EXISTS 'routine';
