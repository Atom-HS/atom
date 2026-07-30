-- 017_e_bilhetes.sql — a mesa do bilhete (Onda 4 obra 1 · spec 03 v2)
-- O bilhete NÃO é AtomItem: é fala do E., não vida do Rick — a escada do
-- Genesis rege itens, a Lei do Tom rege falas. Três eventos e nada mais:
-- nasceu · exibido · visto — sem clique, sem conversão, sem tempo de
-- leitura (a condição 2 vale para os dados também).

create table if not exists public.e_bilhetes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gatilho text not null,
  texto text not null,
  dedup_key text not null,
  nasceu_em timestamptz not null default now(),
  exibido_em timestamptz,
  visto_em timestamptz
);

create index if not exists e_bilhetes_pending_idx
  on public.e_bilhetes (user_id, visto_em, nasceu_em);

alter table public.e_bilhetes enable row level security;

-- O dono lê e marca exibido/visto. NINGUÉM insere pelo client: o bilhete
-- nasce só do sistema (service role, que atravessa RLS). Delete não
-- existe — fala não se apaga; o registro é o instrumento da revisão dos
-- 20 (spec §6.1: select gatilho, count(*)).
create policy "e_bilhetes_select_own" on public.e_bilhetes
  for select using (auth.uid() = user_id);

create policy "e_bilhetes_update_own" on public.e_bilhetes
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
