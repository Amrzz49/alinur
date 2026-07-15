import { useState } from 'react';
import type { Page } from '../App';

type Props = { page: Page; score: number; progress: string; userEmail?: string; userName?: string; onSignOut: () => void; onNavigate: (page: Page) => void };

export function SiteHeader({ page, score, progress, userEmail, userName, onSignOut, onNavigate }: Props) {
  const [isProfileOpen,setIsProfileOpen]=useState(false);
  const logout=()=>{setIsProfileOpen(false);onSignOut()};
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
      <div className="header-stats"><span className="score-pill">✓ {score}</span>{page === 'training' && <div className="progress-pill"><strong>{progress}</strong></div>}{userEmail?<div className="profile-wrap"><button className="account-button" onClick={()=>setIsProfileOpen((open)=>!open)} title="Открыть профиль">{(userName||userEmail).charAt(0).toUpperCase()}</button>{isProfileOpen&&<div className="profile-menu"><span>Твой аккаунт</span><strong>{userName||'Игрок FieldMind'}</strong><small>{userEmail}</small><div>✓ Вход выполнен</div><button onClick={logout}>Выйти из аккаунта</button></div>}</div>:<button className="account-login" onClick={()=>onNavigate('auth')}>Войти</button>}</div>
    </header>
  );
}
