alter table public.game_profiles
  add column owned_cosmetics jsonb not null default '["ball_classic","kit_blue","stadium_green","frame_none"]'::jsonb,
  add column equipped_cosmetics jsonb not null default '{"ball":"ball_classic","kit":"kit_blue","stadium":"stadium_green","frame":"frame_none"}'::jsonb;

create or replace function public.buy_cosmetic(item_id text)
returns table (coins integer,owned_cosmetics jsonb,equipped_cosmetics jsonb)
language plpgsql security invoker set search_path=public as $$
declare profile public.game_profiles%rowtype;price integer;category text;
begin
  select * into profile from public.game_profiles where user_id=auth.uid() for update;
  if profile.user_id is null then raise exception 'Game profile not found'; end if;
  select p,c into price,category from (values
    ('ball_gold',80,'ball'),('ball_ucl',120,'ball'),('kit_white',120,'kit'),('kit_black',150,'kit'),
    ('stadium_night',200,'stadium'),('stadium_royal',250,'stadium'),('frame_gold',100,'frame'),('frame_blue',80,'frame')
  ) as catalog(id,p,c) where id=item_id;
  if price is null then raise exception 'Unknown cosmetic'; end if;
  if profile.owned_cosmetics ? item_id then
    update public.game_profiles set equipped_cosmetics=jsonb_set(equipped_cosmetics,array[category],to_jsonb(item_id)),updated_at=now() where user_id=auth.uid();
  else
    if profile.coins<price then raise exception 'Not enough coins'; end if;
    update public.game_profiles set coins=game_profiles.coins-price,owned_cosmetics=owned_cosmetics||to_jsonb(item_id),equipped_cosmetics=jsonb_set(equipped_cosmetics,array[category],to_jsonb(item_id)),updated_at=now() where user_id=auth.uid();
  end if;
  return query select g.coins,g.owned_cosmetics,g.equipped_cosmetics from public.game_profiles g where g.user_id=auth.uid();
end;$$;

create or replace function public.equip_cosmetic(item_id text,category text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare result jsonb;
begin
  if category not in ('ball','kit','stadium','frame') then raise exception 'Unknown category'; end if;
  if not exists(select 1 from public.game_profiles where user_id=auth.uid() and owned_cosmetics ? item_id) then raise exception 'Cosmetic not owned'; end if;
  update public.game_profiles set equipped_cosmetics=jsonb_set(equipped_cosmetics,array[category],to_jsonb(item_id)),updated_at=now() where user_id=auth.uid() returning equipped_cosmetics into result;
  return result;
end;$$;
