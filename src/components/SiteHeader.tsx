import { useEffect, useState } from 'react';
import type { Page } from '../App';
import { DailyRewards } from './DailyRewards';
import { claimDailyReward } from '../lib/gameWallet';
import { PlayerProgressCard } from './PlayerProgressCard';
import type { PlayerProgress } from '../lib/playerProgress';
import { SettingsPanel } from './SettingsPanel';
import type { UserSettings } from '../lib/userSettings';

type Props = { page: Page; score: number; progress: string; playerProgress:PlayerProgress; settings:UserSettings; coins: number | null; dailyStreak:number; claimedToday:boolean; userEmail?: string; userName?: string; isGuest:boolean; onGuest:()=>void; onSettingsChange:(settings:UserSettings)=>void; onCoinsChange:(coins:number)=>void; onDailyChange:(streak:number)=>void; onSignOut: () => void; onNavigate: (page: Page) => void };

export function SiteHeader({ page, score, progress, playerProgress, settings, coins, dailyStreak, claimedToday, userEmail, userName, isGuest, onGuest, onSettingsChange, onCoinsChange, onDailyChange, onSignOut, onNavigate }: Props) {
  const [isProfileOpen,setIsProfileOpen]=useState(false);
  const [rewardLoading,setRewardLoading]=useState(false);
  const [rewardClaimed,setRewardClaimed]=useState(claimedToday);
  useEffect(()=>setRewardClaimed(claimedToday),[claimedToday]);
  const logout=()=>{setIsProfileOpen(false);onSignOut()};
  const claim=async()=>{setRewardLoading(true);try{const result=await claimDailyReward();onCoinsChange(result.coins);onDailyChange(result.daily_streak);setRewardClaimed(true)}finally{setRewardLoading(false)}};
  const nav=settings.language==='en'?{home:'Home',training:'Training',games:'Games',quiz:'Quiz',world:'Football world',login:'Sign in',guestLogin:'Enter as guest',account:'Your account',player:'FieldMind player',guest:'Guest',logout:'Sign out',profile:'Open profile'}:{home:'Главная',training:'Тренировка',games:'Игры',quiz:'Квиз',world:'Футбольный мир',login:'Войти',guestLogin:'Войти как гость',account:'Твой аккаунт',player:'Игрок FieldMind',guest:'Гость',logout:'Выйти',profile:'Открыть профиль'};
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('home')}><span className="brand__mark">F</span><span className="brand__name">FieldMind</span></button>
      <nav className="nav-links">
        <button className={page === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}>{nav.home}</button>
        <button className={page === 'training' ? 'active' : ''} onClick={() => onNavigate('training')}>{nav.training}</button>
        <button className={page === 'games' ? 'active' : ''} onClick={() => onNavigate('games')}>{nav.games}</button>
        <button className={page === 'quiz' ? 'active' : ''} onClick={() => onNavigate('quiz')}>{nav.quiz}</button>
        <button className={page === 'world' ? 'active' : ''} onClick={() => onNavigate('world')}>{nav.world}</button>
      </nav>
      <div className="header-stats"><span className="score-pill">✓ {score}</span>{userEmail&&<span className="header-xp">LVL {Math.floor(playerProgress.xp/500)+1}</span>}{userEmail&&<span className="header-wallet" title="Field Coins">$ {coins??'—'}</span>}{page === 'training' && <div className="progress-pill"><strong>{progress}</strong></div>}{(userEmail||isGuest)?<div className="profile-wrap"><button className="account-button" onClick={()=>setIsProfileOpen((open)=>!open)} title={nav.profile}>{isGuest?'G':(userName||userEmail||'F').charAt(0).toUpperCase()}</button>{isProfileOpen&&<div className="profile-menu profile-menu--rewards"><span>{nav.account}</span><strong>{isGuest?nav.guest:userName||nav.player}</strong><small>{isGuest?'FieldMind Guest':userEmail}</small>{!isGuest&&<PlayerProgressCard progress={playerProgress}/>} {!isGuest&&<DailyRewards streak={dailyStreak} claimedToday={rewardClaimed} loading={rewardLoading} onClaim={claim}/>}<SettingsPanel settings={settings} onChange={onSettingsChange}/><button onClick={logout}>{nav.logout}</button></div>}</div>:<div className="guest-entry"><button className="guest-entry__button" onClick={onGuest}>{nav.guestLogin}</button><button className="account-login" onClick={()=>onNavigate('auth')}>{nav.login}</button></div>}</div>
    </header>
  );
}
