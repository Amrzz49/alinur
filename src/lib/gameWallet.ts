import { supabase } from './supabase';
import { defaultEquipped, defaultOwned, type EquippedCosmetics } from './cosmetics';

export type GameProfile = { coins: number; unlockedGames: string[]; ownedCosmetics:string[]; equippedCosmetics:EquippedCosmetics; dailyStreak?:number; lastDailyReward?:string|null };
export type DailyReward = { coins:number; daily_streak:number; reward:number; claimed:boolean };

const initialProfile: GameProfile = { coins: 150, unlockedGames: [],ownedCosmetics:defaultOwned,equippedCosmetics:defaultEquipped };
const wait=(milliseconds:number)=>new Promise((resolve)=>window.setTimeout(resolve,milliseconds));
const cacheKey=(userId:string)=>`fieldmind-profile-${userId}`;
const cacheProfile=(userId:string,profile:GameProfile)=>localStorage.setItem(cacheKey(userId),JSON.stringify(profile));

export async function loadGameProfile(): Promise<GameProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  let data:null|{coins:number;unlocked_games:string[];owned_cosmetics:string[];equipped_cosmetics:EquippedCosmetics;daily_streak:number;last_daily_reward:string|null}=null;
  let lastError:Error|null=null;
  for(let attempt=0;attempt<3;attempt+=1){const result=await supabase.from('game_profiles').select('coins, unlocked_games, owned_cosmetics, equipped_cosmetics, daily_streak, last_daily_reward').eq('user_id',auth.user.id).maybeSingle();if(!result.error){data=result.data;lastError=null;break}lastError=result.error;if(attempt<2)await wait(350*(attempt+1))}
  if(lastError){const cached=localStorage.getItem(cacheKey(auth.user.id));if(cached)try{return JSON.parse(cached) as GameProfile}catch{localStorage.removeItem(cacheKey(auth.user.id))}throw lastError}
  if(data){const profile={coins:data.coins,unlockedGames:data.unlocked_games,ownedCosmetics:data.owned_cosmetics,equippedCosmetics:data.equipped_cosmetics,dailyStreak:data.daily_streak,lastDailyReward:data.last_daily_reward};cacheProfile(auth.user.id,profile);return profile}
  const { data: created, error: createError } = await supabase.from('game_profiles').insert({user_id:auth.user.id}).select('coins, unlocked_games, owned_cosmetics, equipped_cosmetics, daily_streak, last_daily_reward').single();
  if (createError) throw createError;
  const profile={coins:created.coins,unlockedGames:created.unlocked_games,ownedCosmetics:created.owned_cosmetics,equippedCosmetics:created.equipped_cosmetics as EquippedCosmetics,dailyStreak:created.daily_streak,lastDailyReward:created.last_daily_reward};cacheProfile(auth.user.id,profile);return profile;
}

export async function saveGameProfile(profile: GameProfile): Promise<GameProfile> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Войди в аккаунт, чтобы сохранить прогресс.');
  const { error } = await supabase.from('game_profiles').update({coins:profile.coins,unlocked_games:profile.unlockedGames,updated_at:new Date().toISOString()}).eq('user_id',auth.user.id);
  if (error) throw error;
  cacheProfile(auth.user.id,profile);
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
