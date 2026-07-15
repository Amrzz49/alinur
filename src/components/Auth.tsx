import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false); const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(''); setSuccess(false);
    if (mode === 'signup' && password !== confirmPassword) return setMessage('Пароли не совпадают.');
    setBusy(true);
    try {
      const { error } = mode === 'signup'
        ? await supabase.auth.signUp({ email, password, options: { data: { name: name.trim() } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else if (mode === 'signup') { setSuccess(true); setMessage('Аккаунт создан! Проверь почту для подтверждения.'); }
    } catch { setMessage('Не получилось подключиться. Попробуй ещё раз.'); }
    finally { setBusy(false); }
  };

  const signInWithGoogle = async () => {
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: window.location.origin },
    });
    if (error) { setMessage(error.message); setBusy(false); }
  };

  const switchMode = () => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); setSuccess(false); };

  return <section className="auth-screen">
    <div className="auth-intro"><div className="eyebrow"><span /> Твой профиль</div><h1>{mode === 'signup' ? 'Вступай в игру' : 'С возвращением'}</h1><p>Сохраняй прогресс, развивай Football IQ и проходи новые тренировки.</p><div className="auth-benefits"><span>✓ 12 тактических задач</span><span>✓ Футбольный квиз</span><span>✓ Личный прогресс</span></div></div>
    <form className="auth-card" onSubmit={submit}><span className="step-label">FIELDMIND ACCOUNT</span><h2>{mode === 'signup' ? 'Создать аккаунт' : 'Войти в аккаунт'}</h2>
      <button className="google-button" type="button" onClick={signInWithGoogle} disabled={busy}><span>G</span>Продолжить с Google</button>
      <div className="auth-divider"><span>или через email</span></div>
      {mode === 'signup' && <label>Имя<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Твоё имя" minLength={2} required /></label>}
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="player@example.com" required /></label>
      <label>Пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Минимум 6 символов" minLength={6} required /></label>
      {mode === 'signup' && <label>Повтори пароль<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Повтори пароль" minLength={6} required /></label>}
      <button className="auth-submit" disabled={busy}>{busy ? 'Подождите…' : mode === 'signup' ? 'Зарегистрироваться' : 'Войти'} <span>→</span></button>
      {message && <p className={`auth-message ${success ? 'success' : ''}`}>{message}</p>}
      <button className="auth-switch" type="button" onClick={switchMode}>{mode === 'signup' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}</button>
    </form>
  </section>;
}
