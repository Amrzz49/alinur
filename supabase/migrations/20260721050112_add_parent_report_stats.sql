alter table public.game_profiles
  add column total_trainings integer not null default 0 check (total_trainings>=0),
  add column correct_decisions integer not null default 0 check (correct_decisions>=0),
  add column total_decisions integer not null default 0 check (total_decisions>=0);

drop function if exists public.record_player_activity(text,jsonb);
create function public.record_player_activity(activity text,skill_changes jsonb default '{}'::jsonb)
returns table (xp integer,skills jsonb,daily_tasks jsonb,total_trainings integer,correct_decisions integer,total_decisions integer)
language plpgsql security invoker set search_path=public as $$
declare profile public.game_profiles%rowtype;reward integer;task_key text;updated_skills jsonb;updated_tasks jsonb;
begin
  if activity not in ('training','game','match_win') then raise exception 'Unknown activity'; end if;
  select gp.* into profile from public.game_profiles gp where gp.user_id=auth.uid() for update;
  if not found then raise exception 'Game profile not found'; end if;
  if profile.daily_task_date<>current_date then profile.daily_tasks:='{"training":0,"games":0,"wins":0}'::jsonb;end if;
  reward:=case activity when 'training' then 100 when 'match_win' then 75 else 50 end;
  task_key:=case activity when 'training' then 'training' when 'match_win' then 'wins' else 'games' end;
  updated_tasks:=jsonb_set(profile.daily_tasks,array[task_key],to_jsonb(coalesce((profile.daily_tasks->>task_key)::integer,0)+1));
  updated_skills:=jsonb_build_object(
    'vision',least(100,coalesce((profile.skills->>'vision')::integer,10)+coalesce((skill_changes->>'vision')::integer,0)),
    'passing',least(100,coalesce((profile.skills->>'passing')::integer,10)+coalesce((skill_changes->>'passing')::integer,0)),
    'shooting',least(100,coalesce((profile.skills->>'shooting')::integer,10)+coalesce((skill_changes->>'shooting')::integer,0)),
    'dribbling',least(100,coalesce((profile.skills->>'dribbling')::integer,10)+coalesce((skill_changes->>'dribbling')::integer,0)));
  update public.game_profiles gp set xp=gp.xp+reward,skills=updated_skills,daily_tasks=updated_tasks,daily_task_date=current_date,
    total_trainings=gp.total_trainings+case when activity='training' then 1 else 0 end,
    correct_decisions=gp.correct_decisions+case when activity='training' then coalesce((skill_changes->>'_correct')::integer,0) else 0 end,
    total_decisions=gp.total_decisions+case when activity='training' then coalesce((skill_changes->>'_total')::integer,0) else 0 end,updated_at=now()
  where gp.user_id=auth.uid() returning gp.* into profile;
  return query select profile.xp,updated_skills,updated_tasks,profile.total_trainings,profile.correct_decisions,profile.total_decisions;
end;$$;
