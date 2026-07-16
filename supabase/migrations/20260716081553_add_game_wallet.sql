create table public.game_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  coins integer not null default 150 check (coins >= 0),
  unlocked_games text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.game_profiles enable row level security;

create policy "read own game profile"
  on public.game_profiles for select
  using (auth.uid() = user_id);

create policy "insert own game profile"
  on public.game_profiles for insert
  with check (auth.uid() = user_id);

create policy "update own game profile"
  on public.game_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
