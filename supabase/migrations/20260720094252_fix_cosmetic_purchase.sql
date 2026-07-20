create or replace function public.buy_cosmetic(item_id text)
returns table (coins integer,owned_cosmetics jsonb,equipped_cosmetics jsonb)
language plpgsql security definer set search_path=public as $$
declare
  current_user_id uuid:=auth.uid();
  profile public.game_profiles%rowtype;
  item_price integer;
  item_category text;
begin
  if current_user_id is null then raise exception 'Sign in required'; end if;
  select * into profile from public.game_profiles where user_id=current_user_id for update;
  if not found then raise exception 'Game profile not found'; end if;

  select catalog.price,catalog.category into item_price,item_category
  from (values
    ('ball_gold',80,'ball'),('ball_ucl',120,'ball'),('kit_white',120,'kit'),('kit_black',150,'kit'),
    ('stadium_night',200,'stadium'),('stadium_royal',250,'stadium'),
    ('frame_gold',100,'frame'),('frame_blue',80,'frame')
  ) as catalog(id,price,category)
  where catalog.id=buy_cosmetic.item_id;

  if item_price is null then raise exception 'Unknown cosmetic'; end if;
  if not (profile.owned_cosmetics ? item_id) and profile.coins<item_price then
    raise exception 'Not enough coins';
  end if;

  update public.game_profiles set
    coins=case when owned_cosmetics ? item_id then game_profiles.coins else game_profiles.coins-item_price end,
    owned_cosmetics=case when owned_cosmetics ? item_id then owned_cosmetics else owned_cosmetics||jsonb_build_array(item_id) end,
    equipped_cosmetics=jsonb_set(equipped_cosmetics,array[item_category],to_jsonb(item_id),true),
    updated_at=now()
  where user_id=current_user_id;

  return query select g.coins,g.owned_cosmetics,g.equipped_cosmetics
  from public.game_profiles g where g.user_id=current_user_id;
end;$$;

create or replace function public.equip_cosmetic(item_id text,category text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare current_user_id uuid:=auth.uid();result jsonb;
begin
  if current_user_id is null then raise exception 'Sign in required'; end if;
  if category not in ('ball','kit','stadium','frame') then raise exception 'Unknown category'; end if;
  if not exists(select 1 from public.game_profiles where user_id=current_user_id and owned_cosmetics ? item_id) then
    raise exception 'Cosmetic not owned';
  end if;
  update public.game_profiles set equipped_cosmetics=jsonb_set(equipped_cosmetics,array[category],to_jsonb(item_id),true),updated_at=now()
  where user_id=current_user_id returning equipped_cosmetics into result;
  return result;
end;$$;

revoke execute on function public.buy_cosmetic(text) from public,anon;
revoke execute on function public.equip_cosmetic(text,text) from public,anon;
grant execute on function public.buy_cosmetic(text) to authenticated;
grant execute on function public.equip_cosmetic(text,text) to authenticated;
