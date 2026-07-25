-- ═══════════════════════════════════════════════════════════════
-- 014_protocol_type.sql — Fase 7 (Onda 2): protocol builder
-- Spec: docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md · D2
--
-- Protocolo = procedimento condicional: "quando X, faço Y" (D2:
-- ritual ≠ rotina ≠ protocolo). Não vive no calendário, não tem
-- recorrência — dorme até a situação chamar. Body: steps ordenados
-- (o procedimento) + when (a condição de alma/período; null = só
-- manual). Completion = disparo situacional; cada execução vira
-- registro em atom_events (protocol_run), nunca escrita no item.
-- ═══════════════════════════════════════════════════════════════

ALTER TYPE atom_type ADD VALUE IF NOT EXISTS 'protocol';
