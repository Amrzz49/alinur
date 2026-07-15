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
import { PenaltyMind } from './components/PenaltyMind';
import { challenges, type ChoiceId } from './lib/challenges';
import { supabase } from './lib/supabase';

export type Page = 'home' | 'training' | 'games' | 'quiz' | 'world' | 'auth';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [user,setUser]=useState<User|null>(null);
  const challenge = challenges[challengeIndex];

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user));
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));
    return ()=>data.subscription.unsubscribe();
  },[]);

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

  return (
    <main className="app-shell">
      <SiteHeader page={page} score={score} progress={`${challengeIndex + 1} / ${challenges.length}`} userEmail={user?.email} userName={user?.user_metadata.name as string | undefined} onSignOut={()=>supabase.auth.signOut()} onNavigate={setPage} />
      {page === 'home' && <HomeScreen onPlay={() => setPage('training')} onExplore={() => setPage('world')} />}
      {page === 'world' && <WorldScreen />}
      {page === 'quiz' && <QuizScreen />}
      {page === 'games' && <PenaltyMind />}
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
