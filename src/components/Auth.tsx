import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export function Auth({language,onGuest}:{language:'ru'|'en';onGuest:()=>void}) {
  const en=language==='en';
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false); const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(''); setSuccess(false);
    if (mode === 'signup' && password !== confirmPassword) return setMessage(en?'Passwords do not match.':'Пароли не совпадают.');
    setBusy(true);
    try {
      const { error } = mode === 'signup'
        ? await supabase.auth.signUp({ email, password, options: { data: { name: name.trim() } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else if (mode === 'signup') { setSuccess(true); setMessage(en?'Account created! Check your email to confirm.':'Аккаунт создан! Проверь почту для подтверждения.'); }
    } catch { setMessage(en?'Could not connect. Try again.':'Не получилось подключиться. Попробуй ещё раз.'); }
    finally { setBusy(false); }
  };

  const signInWithGoogle = async () => {
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: window.location.origin },
    });
    if (error) { setMessage(en?'Google sign-in failed. Try again.':error.message); setBusy(false); }
  };

  const switchMode = () => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); setSuccess(false); };

  return <section className="auth-screen">
    <div className="auth-intro"><div className="eyebrow"><span /> {en?'Your profile':'Твой профиль'}</div><h1>{mode === 'signup' ? (en?'Join the game':'Вступай в игру') : (en?'Welcome back':'С возвращением')}</h1><p>{en?'Save progress and improve your Football IQ.':'Сохраняй прогресс и развивай Football IQ.'}</p><div className="auth-benefits"><span>✓ {en?'8 tactical challenges':'8 тактических задач'}</span><span>✓ {en?'Football quiz':'Футбольный квиз'}</span><span>✓ {en?'Personal progress':'Личный прогресс'}</span></div></div>
    <form className="auth-card" onSubmit={submit}><span className="step-label">FIELDMIND ACCOUNT</span><h2>{mode === 'signup' ? (en?'Create account':'Создать аккаунт') : (en?'Sign in':'Войти в аккаунт')}</h2>
      <button className="google-button" type="button" onClick={signInWithGoogle} disabled={busy}><span>G</span>{en?'Continue with Google':'Продолжить с Google'}</button>
      <div className="auth-divider"><span>{en?'or use email':'или через email'}</span></div>
      {mode === 'signup' && <label>{en?'Name':'Имя'}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={en?'Your name':'Твоё имя'} minLength={2} required /></label>}
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="player@example.com" required /></label>
      <label>{en?'Password':'Пароль'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={en?'At least 6 characters':'Минимум 6 символов'} minLength={6} required /></label>
      {mode === 'signup' && <label>{en?'Confirm password':'Повтори пароль'}<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={en?'Repeat password':'Повтори пароль'} minLength={6} required /></label>}
      <button className="auth-submit" disabled={busy}>{busy ? (en?'Please wait…':'Подождите…') : mode === 'signup' ? (en?'Sign up':'Зарегистрироваться') : (en?'Sign in':'Войти')} <span>→</span></button>
      {message && <p className={`auth-message ${success ? 'success' : ''}`}>{message}</p>}
      <button className="auth-switch" type="button" onClick={switchMode}>{mode === 'signup' ? (en?'Already have an account? Sign in':'Уже есть аккаунт? Войти') : (en?'No account? Sign up':'Нет аккаунта? Зарегистрироваться')}</button>
      <button className="guest-button" type="button" onClick={onGuest}>{en?'Continue as guest':'Продолжить как гость'}</button>
    </form>
  </section>;
}
