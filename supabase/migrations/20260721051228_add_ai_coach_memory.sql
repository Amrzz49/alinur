alter table public.game_profiles
  add column mistake_patterns jsonb not null default '{"left":0,"right":0,"dribble":0,"shot":0}'::jsonb;

create or replace function public.remember_training_mistakes(mistakes jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare profile public.game_profiles%rowtype;updated jsonb;
begin
  select gp.* into profile from public.game_profiles gp where gp.user_id=auth.uid() for update;
  if not found then raise exception 'Game profile not found'; end if;
  updated:=jsonb_build_object(
    'left',coalesce((profile.mistake_patterns->>'left')::integer,0)+coalesce((mistakes->>'left')::integer,0),
    'right',coalesce((profile.mistake_patterns->>'right')::integer,0)+coalesce((mistakes->>'right')::integer,0),
    'dribble',coalesce((profile.mistake_patterns->>'dribble')::integer,0)+coalesce((mistakes->>'dribble')::integer,0),
    'shot',coalesce((profile.mistake_patterns->>'shot')::integer,0)+coalesce((mistakes->>'shot')::integer,0));
  update public.game_profiles gp set mistake_patterns=updated,updated_at=now() where gp.user_id=auth.uid();
  return updated;
end;$$;

revoke execute on function public.remember_training_mistakes(jsonb) from public,anon;
grant execute on function public.remember_training_mistakes(jsonb) to authenticated;
