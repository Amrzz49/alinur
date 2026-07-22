import { defaultProgress, type Activity, type PlayerProgress, type Skills } from './playerProgress';
import { defaultEquipped,defaultOwned,type EquippedCosmetics } from './cosmetics';

export type GuestProfile={coins:number;unlockedGames:string[];ownedCosmetics:string[];equippedCosmetics:EquippedCosmetics;dailyStreak:number;lastDailyReward:string|null;dailyTaskDate:string;progress:PlayerProgress};
const guestKey='fieldmind-guest-profile-v2';
const demoKey='fieldmind-demo-profile';
const activeKey=()=>localStorage.getItem('fieldmind-demo')==='true'?demoKey:guestKey;
const today=()=>new Date().toISOString().slice(0,10);
const initial:GuestProfile={coins:0,unlockedGames:[],ownedCosmetics:[...defaultOwned],equippedCosmetics:{...defaultEquipped},dailyStreak:0,lastDailyReward:null,dailyTaskDate:today(),progress:{...defaultProgress,skills:{...defaultProgress.skills},dailyTasks:{...defaultProgress.dailyTasks},mistakePatterns:{...defaultProgress.mistakePatterns}}};
const demo:GuestProfile={coins:760,unlockedGames:['pass','squad','var'],ownedCosmetics:[...defaultOwned,'ball_gold','kit_white','stadium_night','frame_gold'],equippedCosmetics:{ball:'ball_gold',kit:'kit_white',stadium:'stadium_night',frame:'frame_gold'},dailyStreak:6,lastDailyReward:today(),dailyTaskDate:today(),progress:{xp:1680,skills:{vision:78,passing:74,shooting:63,dribbling:69},dailyTasks:{training:1,games:2,wins:1},dailyRewardClaimed:false,totalTrainings:14,correctDecisions:73,totalDecisions:96,mistakePatterns:{left:2,right:5,dribble:3,shot:4}}};

export function loadGuestProfile():GuestProfile{
  const saved=localStorage.getItem(activeKey());
  if(!saved)return initial;
  try{const parsed=JSON.parse(saved) as GuestProfile;return {...initial,...parsed,progress:{...defaultProgress,...parsed.progress}}}catch{return initial}
}

export function saveGuestProfile(profile:GuestProfile){localStorage.setItem(activeKey(),JSON.stringify(profile))}

export function createDemoProfile(){localStorage.setItem(demoKey,JSON.stringify(demo));return demo}

export function activeGuestSettingsKey(){return localStorage.getItem('fieldmind-demo')==='true'?'fieldmind-demo-settings':'fieldmind-guest-settings-v2'}

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

export function recordGuestActivity(activity:Activity,skillChanges:Partial<Skills>={},decisions:{selected:string;correct:string}[]=[]):PlayerProgress{
  const profile=loadGuestProfile(),currentDay=today();
  const sameDay=profile.dailyTaskDate===currentDay;
  const dailyTasks=sameDay?{...profile.progress.dailyTasks}:{training:0,games:0,wins:0};
  const task=activity==='training'?'training':activity==='game'?'games':'wins';dailyTasks[task]+=1;
  const xpReward=activity==='training'?100:activity==='match_win'?75:50;
  const skills={...profile.progress.skills};Object.entries(skillChanges).forEach(([name,value])=>{const key=name as keyof Skills;skills[key]=Math.min(100,skills[key]+(value??0))});
  const correct=decisions.filter((item)=>item.selected===item.correct).length;
  const mistakePatterns={...profile.progress.mistakePatterns};if(activity==='training')decisions.filter((item)=>item.selected!==item.correct).forEach((item)=>{const key=item.correct as keyof typeof mistakePatterns;mistakePatterns[key]+=1});
  const progress={...profile.progress,xp:profile.progress.xp+xpReward,skills,dailyTasks,dailyRewardClaimed:sameDay&&profile.progress.dailyRewardClaimed,totalTrainings:profile.progress.totalTrainings+(activity==='training'?1:0),correctDecisions:profile.progress.correctDecisions+(activity==='training'?correct:0),totalDecisions:profile.progress.totalDecisions+(activity==='training'?decisions.length:0),mistakePatterns};
  saveGuestProfile({...profile,dailyTaskDate:currentDay,progress});return progress;
}

export function claimGuestTaskReward():GuestProfile{
  const profile=loadGuestProfile(),tasks=profile.progress.dailyTasks;
  if(profile.dailyTaskDate!==today()||tasks.training<1||tasks.games<2||tasks.wins<1||profile.progress.dailyRewardClaimed)return profile;
  const next={...profile,coins:profile.coins+100,progress:{...profile.progress,dailyRewardClaimed:true}};
  saveGuestProfile(next);return next;
}
