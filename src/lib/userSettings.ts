import { supabase } from './supabase';

export type UserSettings={language:'ru'|'en';brightness:80|100|115;textSize:'normal'|'large';reducedMotion:boolean;sound:boolean};
export const defaultSettings:UserSettings={language:'ru',brightness:100,textSize:'normal',reducedMotion:false,sound:true};

export async function loadUserSettings():Promise<UserSettings>{
  const {data:auth}=await supabase.auth.getUser();if(!auth.user)return defaultSettings;
  const {data,error}=await supabase.from('game_profiles').select('settings').eq('user_id',auth.user.id).single();
  if(error)throw error;return {...defaultSettings,...data.settings} as UserSettings;
}

export async function saveUserSettings(settings:UserSettings):Promise<void>{
  const {data:auth}=await supabase.auth.getUser();if(!auth.user)throw new Error('Нужно войти в аккаунт.');
  const {error}=await supabase.from('game_profiles').update({settings,updated_at:new Date().toISOString()}).eq('user_id',auth.user.id);
  if(error)throw error;
}
