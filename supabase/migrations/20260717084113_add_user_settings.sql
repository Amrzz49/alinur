alter table public.game_profiles
  add column settings jsonb not null default '{"language":"ru","brightness":100,"textSize":"normal","reducedMotion":false,"sound":true}'::jsonb;
