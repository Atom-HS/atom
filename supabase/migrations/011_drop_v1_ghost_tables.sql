-- 011 — M7: drop das tabelas-fantasma do schema v1 (selo S-08, Sim do Rick 12 Jun)
-- Restos da era pré-reconciliação (007). Verificado em 12 Jun: todas com 0 rows.
-- NÃO aplicada automaticamente — entra no próximo ciclo de DDL em produção.

drop table if exists public.atom_events;
drop table if exists public.share_links;
drop table if exists public.atom_items;
