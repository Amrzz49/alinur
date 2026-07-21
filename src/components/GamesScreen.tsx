import { useEffect, useState } from 'react';
import { FindThePass } from './FindThePass';
import { GoalkeeperIQ } from './GoalkeeperIQ';
import { PenaltyMind } from './PenaltyMind';
import { SquadBuilder } from './SquadBuilder';
import { VarChallenge } from './VarChallenge';
import { saveGameProfile, type GameProfile } from '../lib/gameWallet';
import { loadGuestProfile, saveGuestProfile } from '../lib/guestProfile';
import { StatusState } from './StatusState';

type Game = 'menu' | 'penalty' | 'goalkeeper' | 'pass' | 'squad' | 'var';
type GameCard = { id:Game; role:string;roleEn:string; title:string; titleRu:string; text:string;textEn:string; cover:string; price?:number };

const games:GameCard[]=[
  {id:'penalty',role:'НАПАДАЮЩИЙ',roleEn:'STRIKER',title:'Penalty Mind',titleRu:'Мастер пенальти',text:'Перехитри вратаря и забей как можно больше пенальти.',textEn:'Outsmart the goalkeeper and score as many penalties as possible.',cover:'⚽'},
  {id:'goalkeeper',role:'ВРАТАРЬ',roleEn:'GOALKEEPER',title:'Goalkeeper IQ',titleRu:'IQ вратаря',text:'Угадывай направление удара и защищай свои ворота.',textEn:'Read the shot direction and protect your goal.',cover:'🧤',price:100},
  {id:'pass',role:'ПЛЕЙМЕЙКЕР',roleEn:'PLAYMAKER',title:'Find the Pass',titleRu:'Найди пас',text:'Находи свободного партнёра и избегай перехватов.',textEn:'Find the free teammate and avoid interceptions.',cover:'● → ●',price:150},
  {id:'squad',role:'МЕНЕДЖЕР',roleEn:'MANAGER',title:'Squad Builder 26',titleRu:'Конструктор состава 26',text:'Собери состав мечты и получи максимальную химию.',textEn:'Build your dream squad and maximise chemistry.',cover:'95 91 93',price:300},
  {id:'var',role:'ВИДЕОСУДЬЯ',roleEn:'VIDEO REFEREE',title:'VAR Challenge',titleRu:'VAR-челлендж',text:'Разбирай спорные эпизоды и выноси правильный вердикт.',textEn:'Review close calls and make the correct decision.',cover:'VAR',price:200},
];

export function GamesScreen({language,isGuest,initialProfile,loadError,onRetry,onCoinsChange,onUnlockedGamesChange,onGameComplete}:{language:'ru'|'en';isGuest:boolean;initialProfile:GameProfile|null;loadError:string;onRetry:()=>void;onCoinsChange:(coins:number)=>void;onUnlockedGamesChange:(games:string[])=>void;onGameComplete:()=>void}) {
  const en=language==='en';
  const [game,setGame]=useState<Game>('menu');
  const [profile,setProfile]=useState<GameProfile|null>(initialProfile);
  const profileLoading=!initialProfile;
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  useEffect(()=>{if(initialProfile)setProfile(initialProfile)},[initialProfile]);
  const save=(updated:GameProfile)=>{if(isGuest){const guest=loadGuestProfile();saveGuestProfile({...guest,coins:updated.coins,unlockedGames:updated.unlockedGames});return Promise.resolve(updated)}return saveGameProfile(updated)};
  const reward=async()=>{
    if(!profile)return;
    const updated={...profile,coins:profile.coins+50};
    try{
      await save(updated);
      setProfile(updated);onCoinsChange(updated.coins);onUnlockedGamesChange(updated.unlockedGames);
      onGameComplete();setMessage(en?'+$50 for completing the game!':'+$50 за завершённую игру!');
    }catch{setMessage(en?'Could not save the reward. Your balance was not changed.':'Не удалось сохранить награду. Монеты не списаны и не добавлены.')}
  };
  const open=async(item:GameCard)=>{
    if(busy)return;
    if(!item.price||profile?.unlockedGames.includes(item.id)){setGame(item.id);return;}
    if(!profile){setMessage(en?'Sign in to unlock games.':'Войди в аккаунт, чтобы покупать игры.');return;}
    if(profile.coins<item.price){setMessage(en?`You need $${item.price-profile.coins} more. Play free games!`:`Нужно ещё $${item.price-profile.coins}. Проходи бесплатные игры!`);return;}
    const updated={...profile,coins:profile.coins-item.price,unlockedGames:[...profile.unlockedGames,item.id]};
    setBusy(true);
    try{
      await save(updated);
      setProfile(updated);onCoinsChange(updated.coins);onUnlockedGamesChange(updated.unlockedGames);
      setMessage(en?`${item.title} unlocked!`:`${item.titleRu} разблокирована!`);setGame(item.id);
    }catch{setMessage(en?'Purchase was not saved. No coins were charged.':'Покупка не сохранилась. Монеты не списаны — попробуй ещё раз.')}
    finally{setBusy(false)}
  };
  const back=()=>setGame('menu');
  if(game==='penalty')return <PenaltyMind language={language} onBack={back} onComplete={reward}/>;
  if(game==='goalkeeper')return <GoalkeeperIQ language={language} onBack={back} onComplete={reward}/>;
  if(game==='pass')return <FindThePass language={language} onBack={back} onComplete={reward}/>;
  if(game==='squad')return <SquadBuilder language={language} onBack={back} onComplete={reward}/>;
  if(game==='var')return <VarChallenge language={language} onBack={back} onComplete={reward}/>;
  if(loadError)return <StatusState kind="error" title={en?'Your progress is safe':'Прогресс не пропал'} text={loadError} action={en?'Try again':'Загрузить снова'} onAction={onRetry}/>;
  if(profileLoading)return <StatusState kind="loading" title={en?'Loading your games…':'Загружаем твои игры…'} text={en?'This usually takes a few seconds.':'Обычно это занимает несколько секунд.'}/>;
  return <section className="games-screen"><div className="games-title"><div><div className="eyebrow"><span/> {en?'Game zone':'Игровая зона'}</div><h1>{en?'Choose a game':'Выбери игру'}</h1><p>{en?'Play, earn coins and unlock new modes.':'Играй, зарабатывай монеты и открывай режимы.'}</p></div><div className="coin-wallet"><span>FIELD COINS</span><strong>${profile?.coins??'—'}</strong></div></div>{message&&<div className="wallet-message">{message}</div>}<div className="game-library">{games.map((item)=>{const locked=Boolean(item.price&&!profile?.unlockedGames.includes(item.id));return <button className={locked?'game-locked':''} disabled={busy} onClick={()=>{void open(item)}} key={item.id}><div className={`game-cover game-cover--${item.id}`}><span>{item.cover}</span>{locked&&<b>🔒</b>}</div><small>{en?item.roleEn:item.role}</small><h2>{en?item.title:item.titleRu}</h2><p>{en?item.textEn:item.text}</p><strong>{locked?`${en?'Unlock':'Разблокировать'} · $${item.price}`:(en?'Play →':'Играть →')}</strong></button>})}</div><p className="reward-hint">🏆 {en?'Completion reward: $50':'Награда за игру: $50'}</p></section>;
}
