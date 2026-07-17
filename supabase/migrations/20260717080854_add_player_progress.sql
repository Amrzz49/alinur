alter table public.game_profiles
  add column xp integer not null default 0 check (xp >= 0),
  add column skills jsonb not null default '{"vision":10,"passing":10,"shooting":10,"dribbling":10}'::jsonb,
  add column daily_task_date date not null default current_date,
  add column daily_tasks jsonb not null default '{"training":0,"games":0,"wins":0}'::jsonb;

create or replace function public.record_player_activity(
  activity text,
  skill_changes jsonb default '{}'::jsonb
)
returns table (xp integer, skills jsonb, daily_tasks jsonb)
language plpgsql
security invoker
set search_path = public
as $$
declare
  profile public.game_profiles%rowtype;
  reward integer;
  task_key text;
  updated_skills jsonb;
  updated_tasks jsonb;
begin
  if activity not in ('training', 'game', 'match_win') then
    raise exception 'Unknown activity';
  end if;

  select * into profile from public.game_profiles
  where user_id = auth.uid() for update;
  if profile.user_id is null then raise exception 'Game profile not found'; end if;

  if profile.daily_task_date <> current_date then
    profile.daily_tasks := '{"training":0,"games":0,"wins":0}'::jsonb;
  end if;

  reward := case activity when 'training' then 100 when 'match_win' then 75 else 50 end;
  task_key := case activity when 'training' then 'training' when 'match_win' then 'wins' else 'games' end;
  updated_tasks := jsonb_set(profile.daily_tasks, array[task_key], to_jsonb(coalesce((profile.daily_tasks->>task_key)::integer,0)+1));
  updated_skills := jsonb_build_object(
    'vision', least(100, coalesce((profile.skills->>'vision')::integer,10)+coalesce((skill_changes->>'vision')::integer,0)),
    'passing', least(100, coalesce((profile.skills->>'passing')::integer,10)+coalesce((skill_changes->>'passing')::integer,0)),
    'shooting', least(100, coalesce((profile.skills->>'shooting')::integer,10)+coalesce((skill_changes->>'shooting')::integer,0)),
    'dribbling', least(100, coalesce((profile.skills->>'dribbling')::integer,10)+coalesce((skill_changes->>'dribbling')::integer,0))
  );

  update public.game_profiles set
    xp = game_profiles.xp + reward,
    skills = updated_skills,
    daily_tasks = updated_tasks,
    daily_task_date = current_date,
    updated_at = now()
  where user_id = auth.uid()
  returning game_profiles.xp into profile.xp;

  return query select profile.xp, updated_skills, updated_tasks;
end;
$$;
