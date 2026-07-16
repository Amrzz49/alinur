import { useEffect, useState } from 'react';
import type { Page } from '../App';
import { DailyRewards } from './DailyRewards';
import { claimDailyReward } from '../lib/gameWallet';

type Props = { page: Page; score: number; progress: string; coins: number | null; dailyStreak:number; claimedToday:boolean; userEmail?: string; userName?: string; onCoinsChange:(coins:number)=>void; onDailyChange:(streak:number)=>void; onSignOut: () => void; onNavigate: (page: Page) => void };

export function SiteHeader({ page, score, progress, coins, dailyStreak, claimedToday, userEmail, userName, onCoinsChange, onDailyChange, onSignOut, onNavigate }: Props) {
  const [isProfileOpen,setIsProfileOpen]=useState(false);
  const [rewardLoading,setRewardLoading]=useState(false);
  const [rewardClaimed,setRewardClaimed]=useState(claimedToday);
  useEffect(()=>setRewardClaimed(claimedToday),[claimedToday]);
  const logout=()=>{setIsProfileOpen(false);onSignOut()};
  const claim=async()=>{setRewardLoading(true);try{const result=await claimDailyReward();onCoinsChange(result.coins);onDailyChange(result.daily_streak);setRewardClaimed(true)}finally{setRewardLoading(false)}};
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('home')}><span className="brand__mark">F</span><span className="brand__name">FieldMind</span></button>
      <nav className="nav-links">
        <button className={page === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}>Главная</button>
        <button className={page === 'training' ? 'active' : ''} onClick={() => onNavigate('training')}>Тренировка</button>
        <button className={page === 'games' ? 'active' : ''} onClick={() => onNavigate('games')}>Игры</button>
        <button className={page === 'quiz' ? 'active' : ''} onClick={() => onNavigate('quiz')}>Квиз</button>
        <button className={page === 'world' ? 'active' : ''} onClick={() => onNavigate('world')}>Футбольный мир</button>
      </nav>
      <div className="header-stats"><span className="score-pill">✓ {score}</span>{userEmail&&<span className="header-wallet" title="Field Coins">$ {coins??'—'}</span>}{page === 'training' && <div className="progress-pill"><strong>{progress}</strong></div>}{userEmail?<div className="profile-wrap"><button className="account-button" onClick={()=>setIsProfileOpen((open)=>!open)} title="Открыть профиль">{(userName||userEmail).charAt(0).toUpperCase()}</button>{isProfileOpen&&<div className="profile-menu profile-menu--rewards"><span>Твой аккаунт</span><strong>{userName||'Игрок FieldMind'}</strong><small>{userEmail}</small><DailyRewards streak={dailyStreak} claimedToday={rewardClaimed} loading={rewardLoading} onClaim={claim}/><button onClick={logout}>Выйти из аккаунта</button></div>}</div>:<button className="account-login" onClick={()=>onNavigate('auth')}>Войти</button>}</div>
    </header>
  );
}
