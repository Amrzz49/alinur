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
import type { TrainingDecision } from './lib/aiCoach';
import { defaultProgress, loadPlayerProgress, recordActivity, trainingSkillChanges, type Activity, type PlayerProgress } from './lib/playerProgress';
import { defaultSettings, loadUserSettings, saveUserSettings, type UserSettings } from './lib/userSettings';
import { localizeChallenge } from './lib/trainingTranslations';
import { loadGuestProfile, recordGuestActivity, saveGuestProfile } from './lib/guestProfile';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SavedToast } from './components/SavedToast';
import { ShopScreen } from './components/ShopScreen';
import { defaultEquipped,defaultOwned,type EquippedCosmetics } from './lib/cosmetics';
import { DemoDayScreen } from './components/DemoDayScreen';
import { PlayerReport } from './components/ParentReport';

export type Page = 'home' | 'demo' | 'parent' | 'match' | 'training' | 'games' | 'shop' | 'quiz' | 'world' | 'auth' | 'welcome';
const trainingChallenges=challenges.slice(0,8);

export default function App() {
  const [page, setPage] = useState<Page>('welcome');
  const [authReady,setAuthReady]=useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [user,setUser]=useState<User|null>(null);
  const [isGuest,setIsGuest]=useState(()=>localStorage.getItem('fieldmind-guest')==='true');
  const [coins,setCoins]=useState<number|null>(null);
  const [unlockedGames,setUnlockedGames]=useState<string[]>([]);
  const [gameProfileReady,setGameProfileReady]=useState(false);
  const [gameProfileError,setGameProfileError]=useState('');
  const [profileReload,setProfileReload]=useState(0);
  const [ownedCosmetics,setOwnedCosmetics]=useState<string[]>(defaultOwned);
  const [equippedCosmetics,setEquippedCosmetics]=useState<EquippedCosmetics>(defaultEquipped);
  const [dailyStreak,setDailyStreak]=useState(0);
  const [claimedToday,setClaimedToday]=useState(false);
  const [trainingDecisions,setTrainingDecisions]=useState<TrainingDecision[]>([]);
  const [playerProgress,setPlayerProgress]=useState<PlayerProgress>(defaultProgress);
  const [settings,setSettings]=useState<UserSettings>(defaultSettings);
  const [showSaved,setShowSaved]=useState(false);
  const challenge = localizeChallenge(trainingChallenges[challengeIndex],challengeIndex,settings.language);

  useEffect(()=>{
    const acceptUser=(nextUser:User|null,event?:string)=>{setUser(nextUser);if(nextUser){localStorage.removeItem('fieldmind-guest');setIsGuest(false);setPage('home')}else if(event==='SIGNED_OUT')setPage('welcome')};
    supabase.auth.getUser().then(({data})=>acceptUser(data.user)).finally(()=>setAuthReady(true));
    const {data}=supabase.auth.onAuthStateChange((event,session)=>acceptUser(session?.user??null,event));
    return ()=>data.subscription.unsubscribe();
  },[]);

  useEffect(()=>{if(!isGuest||user)return;const guest=loadGuestProfile();setCoins(guest.coins);setUnlockedGames(guest.unlockedGames);setOwnedCosmetics(guest.ownedCosmetics);setEquippedCosmetics(guest.equippedCosmetics);setDailyStreak(guest.dailyStreak);setClaimedToday(guest.lastDailyReward===new Date().toISOString().slice(0,10));setPlayerProgress(guest.progress);setGameProfileReady(true)},[isGuest,user]);

  useEffect(()=>{
    if(!user){if(!isGuest){setCoins(null);setUnlockedGames([]);setGameProfileReady(false)}return;}
    setGameProfileReady(false);setGameProfileError('');
    loadGameProfile().then(async(profile)=>{setCoins(profile?.coins??null);setUnlockedGames(profile?.unlockedGames??[]);setOwnedCosmetics(profile?.ownedCosmetics??defaultOwned);setEquippedCosmetics(profile?.equippedCosmetics??defaultEquipped);setDailyStreak(profile?.dailyStreak??0);setClaimedToday(profile?.lastDailyReward===new Date().toISOString().slice(0,10));const [progress,savedSettings]=await Promise.all([loadPlayerProgress(),loadUserSettings()]);if(progress)setPlayerProgress(progress);setSettings(savedSettings);setGameProfileReady(true)}).catch(()=>{setGameProfileError('Не удалось загрузить прогресс. Проверь интернет и попробуй снова.');setGameProfileReady(false)});
  },[user,isGuest,profileReload]);

  useEffect(()=>{document.documentElement.style.setProperty('--app-brightness',String(settings.brightness/100));document.documentElement.dataset.textSize=settings.textSize;document.documentElement.dataset.reducedMotion=String(settings.reducedMotion);document.documentElement.lang=settings.language},[settings]);
  useEffect(()=>{if(!showSaved)return;const timer=window.setTimeout(()=>setShowSaved(false),2600);return()=>clearTimeout(timer)},[showSaved,settings]);
  const changeSettings=async(next:UserSettings)=>{setSettings(next);try{if(isGuest)localStorage.setItem('fieldmind-guest-settings',JSON.stringify(next));else await saveUserSettings(next);setShowSaved(true)}catch{setShowSaved(false)}};
  const enterAsGuest=()=>{localStorage.setItem('fieldmind-guest','true');const guest=loadGuestProfile();setCoins(guest.coins);setUnlockedGames(guest.unlockedGames);setOwnedCosmetics(guest.ownedCosmetics);setEquippedCosmetics(guest.equippedCosmetics);setDailyStreak(guest.dailyStreak);setClaimedToday(guest.lastDailyReward===new Date().toISOString().slice(0,10));setPlayerProgress(guest.progress);setGameProfileReady(true);setIsGuest(true);const saved=localStorage.getItem('fieldmind-guest-settings');if(saved)try{setSettings({...defaultSettings,...JSON.parse(saved) as UserSettings})}catch{localStorage.removeItem('fieldmind-guest-settings')}setPage('home')};
  const updateCosmetics=(nextCoins:number,owned:string[],equipped:EquippedCosmetics)=>{setCoins(nextCoins);setOwnedCosmetics(owned);setEquippedCosmetics(equipped)};
  const signOut=()=>{if(isGuest){localStorage.removeItem('fieldmind-guest');setIsGuest(false);setSettings(defaultSettings);setPage('welcome');return}void supabase.auth.signOut()};

  const trackActivity=async(activity:Activity,decisions:TrainingDecision[]=[])=>{
    const changes=activity==='training'?trainingSkillChanges(decisions):{};
    try{setPlayerProgress(isGuest?recordGuestActivity(activity,changes,decisions):await recordActivity(activity,changes,decisions))}catch{return;}
  };

  const choose = (choice: ChoiceId) => {
    setSelectedChoice(choice);
    setTrainingDecisions((current)=>[...current,{title:challenge.title,difficulty:challenge.difficulty,selected:choice,correct:challenge.correctChoice}]);
    if (choice === challenge.correctChoice) setScore((current) => current + 1);
  };
  const next = () => {
    if (challengeIndex === trainingChallenges.length - 1) {void trackActivity('training',trainingDecisions);return setFinished(true);}
    setChallengeIndex((current) => current + 1); setSelectedChoice(null);
  };
  const restart = () => {
    setChallengeIndex(0); setSelectedChoice(null); setScore(0); setFinished(false); setTrainingDecisions([]); setPage('training');
  };
  const rewardMatchWin=async()=>{
    if(isGuest){const guest=loadGuestProfile(),updated={...guest,coins:guest.coins+25};saveGuestProfile(updated);setCoins(updated.coins);void trackActivity('match_win');return;}
    const profile=await loadGameProfile();
    if(!profile)return;
    const updated={...profile,coins:profile.coins+25};
    await saveGameProfile(updated);setCoins(updated.coins);void trackActivity('match_win');
  };

  return (
    <main className="app-shell">
      {!authReady&&<div className="app-loading" aria-label="Loading"/>}
      {authReady&&<>
      {showSaved&&<SavedToast language={settings.language}/>}
      {page!=='welcome'&&<SiteHeader page={page} score={score} coins={coins} playerProgress={playerProgress} settings={settings} equipped={equippedCosmetics} dailyStreak={dailyStreak} claimedToday={claimedToday} progress={`${challengeIndex + 1} / ${trainingChallenges.length}`} userEmail={user?.email} userName={user?.user_metadata.name as string | undefined} userAvatar={user?.user_metadata.avatar_url as string | undefined} isGuest={isGuest&&!user} onGuest={enterAsGuest} onSettingsChange={changeSettings} onProgressChange={setPlayerProgress} onCoinsChange={setCoins} onDailyChange={(streak)=>{setDailyStreak(streak);setClaimedToday(true)}} onSignOut={signOut} onNavigate={setPage} />}
      {page==='welcome'&&<WelcomeScreen language={settings.language} onGuest={enterAsGuest} onEmail={()=>setPage('auth')}/>}
      {page === 'home' && <HomeScreen language={settings.language} onMatch={()=>setPage('match')} onDemo={()=>setPage('demo')} onExplore={() => setPage('world')} />}
      {page === 'demo'&&<DemoDayScreen onBack={()=>setPage('home')}/>}
      {page==='parent'&&<PlayerReport progress={playerProgress} onBack={()=>setPage('home')}/>}
      {page === 'match' && <FieldCapsMatch cosmetics={equippedCosmetics} onBack={()=>setPage('home')} onWin={()=>{void rewardMatchWin()}}/>}
      {page === 'world' && <WorldScreen language={settings.language} />}
      {page === 'quiz' && <QuizScreen />}
      {page === 'games' && <GamesScreen language={settings.language} isGuest={isGuest&&!user} initialProfile={gameProfileReady?{coins:coins??0,unlockedGames,ownedCosmetics,equippedCosmetics}:null} loadError={gameProfileError} onRetry={()=>setProfileReload((value)=>value+1)} onCoinsChange={setCoins} onUnlockedGamesChange={setUnlockedGames} onGameComplete={()=>{void trackActivity('game')}} />}
      {page === 'shop'&&<ShopScreen coins={coins??0} owned={ownedCosmetics} equipped={equippedCosmetics} isGuest={isGuest&&!user} onChange={updateCosmetics}/>}
      {page === 'auth' && <Auth language={settings.language} onGuest={enterAsGuest} />}
      {page === 'training' && (finished ? <GameComplete score={score} total={trainingChallenges.length} decisions={trainingDecisions} patterns={playerProgress.mistakePatterns} language={settings.language} onRestart={restart} /> : (
        <section className="game-layout">
          <div className="field-column">
            <div className="eyebrow"><span /> {challenge.difficulty}</div><h1>{challenge.title}</h1>
            <p className="lead">{settings.language==='en'?'You play for the blue team. Study the pitch and make a decision.':'Ты играешь за синюю команду. Посмотри на поле и прими решение.'}</p>
            <FootballField challenge={challenge} selectedChoice={selectedChoice} />
            <div className="legend"><span><i className="dot dot--blue" /> {settings.language==='en'?'Your team':'Твоя команда'}</span><span><i className="dot dot--red" /> {settings.language==='en'?'Opponent':'Соперник'}</span><span><i className="ball-mini">●</i> {settings.language==='en'?'Ball':'Мяч'}</span></div>
          </div>
          <DecisionPanel challenge={challenge} selectedChoice={selectedChoice} language={settings.language} onChoose={choose} onNext={next} />
        </section>
      ))}</>}
    </main>
  );
}
