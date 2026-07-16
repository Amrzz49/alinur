import { supabase } from './supabase';

export type GameProfile = { coins: number; unlockedGames: string[]; dailyStreak?:number; lastDailyReward?:string|null };
export type DailyReward = { coins:number; daily_streak:number; reward:number; claimed:boolean };

const initialProfile: GameProfile = { coins: 150, unlockedGames: [] };

export async function loadGameProfile(): Promise<GameProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.from('game_profiles').select('coins, unlocked_games, daily_streak, last_daily_reward').eq('user_id',auth.user.id).maybeSingle();
  if (error) throw error;
  if (data) return { coins:data.coins, unlockedGames:data.unlocked_games, dailyStreak:data.daily_streak, lastDailyReward:data.last_daily_reward };
  const { data: created, error: createError } = await supabase.from('game_profiles').insert({user_id:auth.user.id}).select('coins, unlocked_games, daily_streak, last_daily_reward').single();
  if (createError) throw createError;
  return { coins:created.coins, unlockedGames:created.unlocked_games, dailyStreak:created.daily_streak, lastDailyReward:created.last_daily_reward };
}

export async function saveGameProfile(profile: GameProfile): Promise<GameProfile> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Войди в аккаунт, чтобы сохранить прогресс.');
  const { error } = await supabase.from('game_profiles').update({coins:profile.coins,unlocked_games:profile.unlockedGames,updated_at:new Date().toISOString()}).eq('user_id',auth.user.id);
  if (error) throw error;
  return profile;
}

export async function claimDailyReward(): Promise<DailyReward> {
  const { data, error } = await supabase.rpc('claim_daily_reward');
  if (error) throw error;
  const reward = data?.[0] as DailyReward | undefined;
  if (!reward) throw new Error('Не удалось получить ежедневный приз.');
  return reward;
}

export { initialProfile };
