alter table public.game_profiles
  add column last_daily_reward date,
  add column daily_streak integer not null default 0 check (daily_streak between 0 and 7);

create or replace function public.claim_daily_reward()
returns table (coins integer, daily_streak integer, reward integer, claimed boolean)
language plpgsql
security invoker
set search_path = public
as $$
declare
  profile public.game_profiles%rowtype;
  next_streak integer;
  prize integer;
begin
  select * into profile from public.game_profiles
  where user_id = auth.uid() for update;

  if profile.user_id is null then
    raise exception 'Game profile not found';
  end if;

  if profile.last_daily_reward = current_date then
    return query select profile.coins, profile.daily_streak, 0, false;
    return;
  end if;

  next_streak := case
    when profile.last_daily_reward = current_date - 1 then (profile.daily_streak % 7) + 1
    else 1
  end;
  prize := (array[25, 40, 60, 80, 100, 150, 250])[next_streak];

  update public.game_profiles
  set coins = game_profiles.coins + prize,
      daily_streak = next_streak,
      last_daily_reward = current_date,
      updated_at = now()
  where user_id = auth.uid()
  returning game_profiles.coins into profile.coins;

  return query select profile.coins, next_streak, prize, true;
end;
$$;
