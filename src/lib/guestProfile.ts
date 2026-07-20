import { defaultProgress, type Activity, type PlayerProgress, type Skills } from './playerProgress';
import { defaultEquipped,defaultOwned,type EquippedCosmetics } from './cosmetics';

export type GuestProfile={coins:number;unlockedGames:string[];ownedCosmetics:string[];equippedCosmetics:EquippedCosmetics;dailyStreak:number;lastDailyReward:string|null;dailyTaskDate:string;progress:PlayerProgress};
const key='fieldmind-guest-profile';
const today=()=>new Date().toISOString().slice(0,10);
const initial:GuestProfile={coins:150,unlockedGames:[],ownedCosmetics:defaultOwned,equippedCosmetics:defaultEquipped,dailyStreak:0,lastDailyReward:null,dailyTaskDate:today(),progress:defaultProgress};

export function loadGuestProfile():GuestProfile{
  const saved=localStorage.getItem(key);
  if(!saved)return initial;
  try{const parsed=JSON.parse(saved) as GuestProfile;return {...initial,...parsed,progress:{...defaultProgress,...parsed.progress}}}catch{return initial}
}

export function saveGuestProfile(profile:GuestProfile){localStorage.setItem(key,JSON.stringify(profile))}

export function claimGuestReward():GuestProfile{
  const profile=loadGuestProfile();
  const today=new Date().toISOString().slice(0,10);
  if(profile.lastDailyReward===today)return profile;
  const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
  const dailyStreak=profile.lastDailyReward===yesterday?profile.dailyStreak+1:1;
  const prizes=[25,40,60,80,100,150,250];
  const next={...profile,dailyStreak,lastDailyReward:today,coins:profile.coins+prizes[(dailyStreak-1)%7]};
  saveGuestProfile(next);return next;
}

export function recordGuestActivity(activity:Activity,skillChanges:Partial<Skills>={}):PlayerProgress{
  const profile=loadGuestProfile(),currentDay=today();
  const sameDay=profile.dailyTaskDate===currentDay;
  const dailyTasks=sameDay?{...profile.progress.dailyTasks}:{training:0,games:0,wins:0};
  const task=activity==='training'?'training':activity==='game'?'games':'wins';dailyTasks[task]+=1;
  const xpReward=activity==='training'?100:activity==='match_win'?75:50;
  const skills={...profile.progress.skills};Object.entries(skillChanges).forEach(([name,value])=>{const key=name as keyof Skills;skills[key]=Math.min(100,skills[key]+(value??0))});
  const progress={...profile.progress,xp:profile.progress.xp+xpReward,skills,dailyTasks,dailyRewardClaimed:sameDay&&profile.progress.dailyRewardClaimed};
  saveGuestProfile({...profile,dailyTaskDate:currentDay,progress});return progress;
}

export function claimGuestTaskReward():GuestProfile{
  const profile=loadGuestProfile(),tasks=profile.progress.dailyTasks;
  if(profile.dailyTaskDate!==today()||tasks.training<1||tasks.games<2||tasks.wins<1||profile.progress.dailyRewardClaimed)return profile;
  const next={...profile,coins:profile.coins+100,progress:{...profile.progress,dailyRewardClaimed:true}};
  saveGuestProfile(next);return next;
}
