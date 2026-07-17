import { defaultProgress, type PlayerProgress } from './playerProgress';

export type GuestProfile={coins:number;dailyStreak:number;lastDailyReward:string|null;progress:PlayerProgress};
const key='fieldmind-guest-profile';
const initial:GuestProfile={coins:150,dailyStreak:0,lastDailyReward:null,progress:defaultProgress};

export function loadGuestProfile():GuestProfile{
  const saved=localStorage.getItem(key);
  if(!saved)return initial;
  try{return {...initial,...JSON.parse(saved) as GuestProfile}}catch{return initial}
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
