import { useEffect, useState } from 'react';
import type { Page } from '../App';
import { claimDailyReward } from '../lib/gameWallet';
import { claimGuestReward, claimGuestTaskReward } from '../lib/guestProfile';
import { claimDailyTaskReward, type PlayerProgress } from '../lib/playerProgress';
import type { UserSettings } from '../lib/userSettings';
import { DailyRewards } from './DailyRewards';
import { PlayerProgressCard } from './PlayerProgressCard';
import { SettingsPanel } from './SettingsPanel';
import { ProfileCompletion } from './ProfileCompletion';
import { AvatarPicker } from './AvatarPicker';
import type { EquippedCosmetics } from '../lib/cosmetics';

type Panel='profile'|'rewards'|'settings'|null;
type Props={page:Page;score:number;progress:string;playerProgress:PlayerProgress;settings:UserSettings;equipped:EquippedCosmetics;coins:number|null;dailyStreak:number;claimedToday:boolean;userEmail?:string;userName?:string;userAvatar?:string;isGuest:boolean;onGuest:()=>void;onSettingsChange:(settings:UserSettings)=>void;onProgressChange:(progress:PlayerProgress)=>void;onCoinsChange:(coins:number)=>void;onDailyChange:(streak:number)=>void;onSignOut:()=>void;onNavigate:(page:Page)=>void};

export function SiteHeader(props:Props){
  const {page,score,progress,playerProgress,settings,equipped,coins,dailyStreak,claimedToday,userEmail,userName,userAvatar,isGuest,onGuest,onSettingsChange,onProgressChange,onCoinsChange,onDailyChange,onSignOut,onNavigate}=props;
  const [panel,setPanel]=useState<Panel>(null);
  const [rewardLoading,setRewardLoading]=useState(false);
  const [rewardClaimed,setRewardClaimed]=useState(claimedToday);
  const [taskRewardLoading,setTaskRewardLoading]=useState(false);
  const [avatar,setAvatar]=useState(userAvatar);
  useEffect(()=>setRewardClaimed(claimedToday),[claimedToday]);
  useEffect(()=>setAvatar(userAvatar),[userAvatar]);
  const loggedIn=Boolean(userEmail||isGuest),en=settings.language==='en';
  const nav=en?{home:'Home',training:'Training',games:'Games',shop:'Shop',quiz:'Quiz',world:'Football world',login:'Sign in',guestLogin:'Enter as guest',account:'Your account',player:'FieldMind player',guest:'Guest',logout:'Sign out',profile:'Profile',report:'Parent report',rewards:'Daily reward',settings:'Settings'}:{home:'Главная',training:'Тренировка',games:'Игры',shop:'Магазин',quiz:'Квиз',world:'Футбольный мир',login:'Войти',guestLogin:'Войти как гость',account:'Твой аккаунт',player:'Игрок FieldMind',guest:'Гость',logout:'Выйти',profile:'Профиль',report:'Отчёт для родителя',rewards:'Ежедневная награда',settings:'Настройки'};
  const toggle=(next:Exclude<Panel,null>)=>setPanel((current)=>current===next?null:next);
  const logout=()=>{setPanel(null);onSignOut()};
  const claim=async()=>{setRewardLoading(true);try{if(isGuest){const result=claimGuestReward();onCoinsChange(result.coins);onDailyChange(result.dailyStreak)}else{const result=await claimDailyReward();onCoinsChange(result.coins);onDailyChange(result.daily_streak)}setRewardClaimed(true)}finally{setRewardLoading(false)}};
  const claimTasks=async()=>{setTaskRewardLoading(true);try{if(isGuest){const result=claimGuestTaskReward();onCoinsChange(result.coins);onProgressChange(result.progress)}else{onCoinsChange(await claimDailyTaskReward());onProgressChange({...playerProgress,dailyRewardClaimed:true})}}finally{setTaskRewardLoading(false)}};
  const links:[Page,string][]=[['home',nav.home],['training',nav.training],['games',nav.games],['shop',nav.shop],['quiz',nav.quiz],['world',nav.world]];

  return <header className="topbar">
    <button className="brand" onClick={()=>onNavigate('home')}><span className="brand__mark">F</span><span className="brand__name">FieldMind</span></button>
    <nav className="nav-links">{links.map(([target,label])=><button className={page===target?'active':''} onClick={()=>onNavigate(target)} key={target}>{label}</button>)}</nav>
    <div className="header-stats">
      <span className="score-pill">✓ {score}</span>
      {loggedIn&&<span className="header-xp">LVL {Math.floor(playerProgress.xp/500)+1}</span>}
      {loggedIn&&<span className="header-wallet" title="Field Coins">$ {coins??'—'}</span>}
      {page==='training'&&<div className="progress-pill"><strong>{progress}</strong></div>}
      {loggedIn?<div className="profile-wrap header-tools">
        <button className="header-tool" onClick={()=>toggle('rewards')} title={nav.rewards}>🎁</button>
        <button className="header-tool" onClick={()=>toggle('settings')} title={nav.settings}>⚙</button>
        <button className={`account-button account-button--${equipped.frame}`} onClick={()=>toggle('profile')} title={nav.profile}>{avatar&&!isGuest?<img src={avatar} alt=""/>:isGuest?'G':(userName||userEmail||'F').charAt(0).toUpperCase()}</button>
        {panel&&<div className="profile-menu profile-menu--rewards">
          {panel==='profile'&&<><span>{nav.account}</span><strong>{isGuest?nav.guest:userName||nav.player}</strong><small>{isGuest?'FieldMind Guest':userEmail}</small>{!isGuest&&<AvatarPicker language={settings.language} onUploaded={setAvatar}/>} {!isGuest&&<ProfileCompletion progress={playerProgress} dailyStreak={dailyStreak} language={settings.language}/>}<PlayerProgressCard progress={playerProgress} language={settings.language} rewardLoading={taskRewardLoading} onClaimReward={claimTasks}/><button className="parent-report-link" onClick={()=>{setPanel(null);onNavigate('parent')}}>📊 {nav.report}</button><button onClick={logout}>{nav.logout}</button></>}
          {panel==='rewards'&&<DailyRewards streak={dailyStreak} claimedToday={rewardClaimed} loading={rewardLoading} onClaim={claim}/>}
          {panel==='settings'&&<SettingsPanel settings={settings} onChange={onSettingsChange}/>}
        </div>}
      </div>:<div className="guest-entry"><button className="guest-entry__button" onClick={onGuest}>{nav.guestLogin}</button><button className="account-login" onClick={()=>onNavigate('auth')}>{nav.login}</button></div>}
    </div>
  </header>;
}
