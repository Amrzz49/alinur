import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { DecisionPanel } from './components/DecisionPanel';
import { FootballField } from './components/FootballField';
import { GameComplete } from './components/GameComplete';
import { HomeScreen } from './components/HomeScreen';
import { SiteHeader } from './components/SiteHeader';
import { WorldScreen } from './components/WorldScreen';
import { QuizScreen } from './components/QuizScreen';
import { Auth } from './components/Auth';
import { GamesScreen } from './components/GamesScreen';
import { challenges, type ChoiceId } from './lib/challenges';
import { supabase } from './lib/supabase';
import { loadGameProfile, saveGameProfile } from './lib/gameWallet';
import { FieldCapsMatch } from './components/FieldCapsMatch';

export type Page = 'home' | 'match' | 'training' | 'games' | 'quiz' | 'world' | 'auth';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [user,setUser]=useState<User|null>(null);
  const [coins,setCoins]=useState<number|null>(null);
  const [dailyStreak,setDailyStreak]=useState(0);
  const [claimedToday,setClaimedToday]=useState(false);
  const challenge = challenges[challengeIndex];

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user));
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));
    return ()=>data.subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user){setCoins(null);return;}
    loadGameProfile().then((profile)=>{setCoins(profile?.coins??null);setDailyStreak(profile?.dailyStreak??0);setClaimedToday(profile?.lastDailyReward===new Date().toISOString().slice(0,10))}).catch(()=>setCoins(null));
  },[user]);

  const choose = (choice: ChoiceId) => {
    setSelectedChoice(choice);
    if (choice === challenge.correctChoice) setScore((current) => current + 1);
  };
  const next = () => {
    if (challengeIndex === challenges.length - 1) return setFinished(true);
    setChallengeIndex((current) => current + 1); setSelectedChoice(null);
  };
  const restart = () => {
    setChallengeIndex(0); setSelectedChoice(null); setScore(0); setFinished(false); setPage('training');
  };
  const rewardMatchWin=async()=>{
    const profile=await loadGameProfile();
    if(!profile)return;
    const updated={...profile,coins:profile.coins+25};
    await saveGameProfile(updated);setCoins(updated.coins);
  };

  return (
    <main className="app-shell">
      <SiteHeader page={page} score={score} coins={coins} dailyStreak={dailyStreak} claimedToday={claimedToday} progress={`${challengeIndex + 1} / ${challenges.length}`} userEmail={user?.email} userName={user?.user_metadata.name as string | undefined} onCoinsChange={setCoins} onDailyChange={(streak)=>{setDailyStreak(streak);setClaimedToday(true)}} onSignOut={()=>supabase.auth.signOut()} onNavigate={setPage} />
      {page === 'home' && <HomeScreen onMatch={()=>setPage('match')} onExplore={() => setPage('world')} />}
      {page === 'match' && <FieldCapsMatch onBack={()=>setPage('home')} onWin={()=>{void rewardMatchWin()}}/>}
      {page === 'world' && <WorldScreen />}
      {page === 'quiz' && <QuizScreen />}
      {page === 'games' && <GamesScreen onCoinsChange={setCoins} />}
      {page === 'auth' && <Auth />}
      {page === 'training' && (finished ? <GameComplete score={score} total={challenges.length} onRestart={restart} /> : (
        <section className="game-layout">
          <div className="field-column">
            <div className="eyebrow"><span /> {challenge.difficulty}</div><h1>{challenge.title}</h1>
            <p className="lead">Ты играешь за синюю команду. Посмотри на поле и прими решение.</p>
            <FootballField challenge={challenge} selectedChoice={selectedChoice} />
            <div className="legend"><span><i className="dot dot--blue" /> Твоя команда</span><span><i className="dot dot--red" /> Соперник</span><span><i className="ball-mini">●</i> Мяч</span></div>
          </div>
          <DecisionPanel challenge={challenge} selectedChoice={selectedChoice} onChoose={choose} onNext={next} />
        </section>
      ))}
    </main>
  );
}
