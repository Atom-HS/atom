-- ═══════════════════════════════════════════════════════════════
-- 012_person_type.sql — Fase 5 (Onda 2): pessoas no calendário
-- Spec: docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md · D1
--
-- Person = entidade do mundo do usuário, não conta (D1: sem
-- multi-tenancy, sem permissões, sem sync entre usuários).
-- Born-committed (stage 7 ○): uma pessoa É — não matura pelo FSM
-- e não sofre entropia (views de audit só olham inbox/connected).
-- ═══════════════════════════════════════════════════════════════

ALTER TYPE atom_type ADD VALUE IF NOT EXISTS 'person';
