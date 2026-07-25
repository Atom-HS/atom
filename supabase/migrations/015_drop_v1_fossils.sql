-- ═══════════════════════════════════════════════════════════════
-- 015_drop_v1_fossils.sql — Fase 8 (Onda 2): o porão limpo
-- Spec: docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md · D4
-- Lineage: M7 da auditoria reformar-x-zero (12 Jun) — a 011 foi
-- marcada aplicada no repair do histórico (24 Jul) sem nunca rodar;
-- as fantasmas seguiam vivas, 3 delas COM dados (atom_items 51,
-- share_links 21, email_captures 17 leads da landing "revelation").
-- Export integral feito em 25 Jul ANTES deste drop:
-- c:/repos/_archive/atom-fosseis-export-2026-07-25/ (sim do Rick).
-- ═══════════════════════════════════════════════════════════════

drop table if exists public.atom_items cascade;
drop table if exists public.share_links cascade;
drop table if exists public.email_captures cascade;
drop table if exists public.threads cascade;
drop table if exists public.sessions cascade;
drop table if exists public.artifacts cascade;
drop table if exists public.discoveries cascade;
