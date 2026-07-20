alter table public.game_profiles add column daily_task_reward_date date;

create or replace function public.claim_daily_task_reward()
returns table (coins integer,reward integer,claimed boolean)
language plpgsql
security invoker
set search_path=public
as $$
declare profile public.game_profiles%rowtype;
begin
  select * into profile from public.game_profiles where user_id=auth.uid() for update;
  if profile.user_id is null then raise exception 'Game profile not found'; end if;
  if profile.daily_task_date<>current_date
    or coalesce((profile.daily_tasks->>'training')::integer,0)<1
    or coalesce((profile.daily_tasks->>'games')::integer,0)<2
    or coalesce((profile.daily_tasks->>'wins')::integer,0)<1 then
    raise exception 'Daily tasks are not complete';
  end if;
  if profile.daily_task_reward_date=current_date then
    return query select profile.coins,0,false;return;
  end if;
  update public.game_profiles set coins=game_profiles.coins+100,daily_task_reward_date=current_date,updated_at=now()
  where user_id=auth.uid() returning game_profiles.coins into profile.coins;
  return query select profile.coins,100,true;
end;
$$;
