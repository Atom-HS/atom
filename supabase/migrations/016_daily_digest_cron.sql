-- 016_daily_digest_cron.sql — obra 8: a válvula do cofre + o cron da volta
-- (D66/D69, spec docs/onda-3/12_digest-valvula_spec.md)
-- Agenda a rotina diária que sincroniza a lente e olha o cofre.
-- O segredo NUNCA vive aqui (§8.4): mora no Supabase Vault com o nome
-- 'digest_secret', semeado por fora; o cron o lê na hora de chamar e a
-- edge o confere no header. Horário: 21:15 UTC = 07:15 Brisbane (pós-
-- aurora). Ajustar = cron.alter_job / re-schedule, sem re-deploy.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- O schema vault não é exposto via REST: a edge lê o segredo por esta
-- função, trancada pro service_role (o browser nunca alcança).
create or replace function public.get_digest_secret()
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'digest_secret';
$$;
revoke all on function public.get_digest_secret() from public, anon, authenticated;
grant execute on function public.get_digest_secret() to service_role;

select cron.schedule(
  'daily-digest',
  '15 21 * * *',
  $$
  select net.http_post(
    url := 'https://avvwjkzkzklloyfugzer.supabase.co/functions/v1/daily-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-digest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'digest_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
