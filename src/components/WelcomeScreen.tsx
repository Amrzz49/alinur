import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function WelcomeScreen({language,onGuest,onDemo,onEmail}:{language:'ru'|'en';onGuest:()=>void;onDemo:()=>void;onEmail:()=>void}){
  const en=language==='en';
  const [showOptions,setShowOptions]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const google=async()=>{setBusy(true);setError('');const {error:signInError}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(signInError){setError(en?'Google sign-in failed. Try again.':'Не удалось войти через Google. Попробуй ещё раз.');setBusy(false)}};
  return <section className="welcome-screen"><div className="welcome-screen__mark">F</div><h1>{en?"Welcome! Let’s begin.":'Добро пожаловать! Начнём путь.'}</h1>{!showOptions?<div className="welcome-start"><button className="welcome-primary" onClick={()=>setShowOptions(true)}>{en?'Continue':'Продолжить'} <span>→</span></button></div>:<div className="welcome-actions"><button className="welcome-primary" onClick={onGuest}>{en?'Enter as guest':'Войти как гость'} <span>→</span></button><button onClick={onDemo}>▶ {en?'Demo account':'Демо-аккаунт'}</button><button onClick={google} disabled={busy}>G&nbsp;&nbsp;{busy?(en?'Connecting…':'Подключаем…'):(en?'Continue with Google':'Продолжить с Google')}</button><button onClick={onEmail}>{en?'Continue with email':'Войти через email'}</button></div>}{error&&<p className="welcome-error">{error}</p>}</section>;
}
