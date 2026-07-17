import { useEffect, useState } from 'react';
import { FindThePass } from './FindThePass';
import { GoalkeeperIQ } from './GoalkeeperIQ';
import { PenaltyMind } from './PenaltyMind';
import { SquadBuilder } from './SquadBuilder';
import { VarChallenge } from './VarChallenge';
import { loadGameProfile, saveGameProfile, type GameProfile } from '../lib/gameWallet';

type Game = 'menu' | 'penalty' | 'goalkeeper' | 'pass' | 'squad' | 'var';
type GameCard = { id:Game; role:string; title:string; text:string; cover:string; price?:number };

const games:GameCard[]=[
  {id:'penalty',role:'НАПАДАЮЩИЙ',title:'Penalty Mind',text:'Перехитри вратаря и забей как можно больше пенальти.',cover:'⚽'},
  {id:'goalkeeper',role:'ВРАТАРЬ',title:'Goalkeeper IQ',text:'Угадывай направление удара и защищай свои ворота.',cover:'🧤',price:100},
  {id:'pass',role:'ПЛЕЙМЕЙКЕР',title:'Find the Pass',text:'Находи свободного партнёра и избегай перехватов.',cover:'● → ●',price:150},
  {id:'squad',role:'МЕНЕДЖЕР',title:'Squad Builder 26',text:'Собери состав мечты и получи максимальную химию.',cover:'95 91 93',price:300},
  {id:'var',role:'ВИДЕОСУДЬЯ',title:'VAR Challenge',text:'Разбирай спорные эпизоды и выноси правильный вердикт.',cover:'VAR',price:200},
];

export function GamesScreen({language,onCoinsChange,onGameComplete}:{language:'ru'|'en';onCoinsChange:(coins:number)=>void;onGameComplete:()=>void}) {
  const en=language==='en';
  const [game,setGame]=useState<Game>('menu');
  const [profile,setProfile]=useState<GameProfile|null>(null);
  const [message,setMessage]=useState('');
  useEffect(()=>{loadGameProfile().then((loaded)=>{setProfile(loaded);if(loaded)onCoinsChange(loaded.coins)}).catch(()=>setMessage('Не удалось загрузить баланс.'))},[onCoinsChange]);
  const reward=()=>{
    onGameComplete();
    if(!profile)return;
    const updated={...profile,coins:profile.coins+50};
    setProfile(updated);onCoinsChange(updated.coins);setMessage('+$50 за завершённую игру!');
    saveGameProfile(updated).catch(()=>setMessage('Не удалось сохранить награду.'));
  };
  const open=(item:GameCard)=>{
    if(!item.price||profile?.unlockedGames.includes(item.id)){setGame(item.id);return;}
    if(!profile){setMessage('Войди в аккаунт, чтобы покупать игры.');return;}
    if(profile.coins<item.price){setMessage(`Нужно ещё $${item.price-profile.coins}. Проходи бесплатные игры!`);return;}
    const updated={coins:profile.coins-item.price,unlockedGames:[...profile.unlockedGames,item.id]};
    setProfile(updated);onCoinsChange(updated.coins);setMessage(`${item.title} разблокирована!`);
    saveGameProfile(updated).then(()=>setGame(item.id)).catch(()=>setMessage('Покупка не сохранилась. Попробуй ещё раз.'));
  };
  const back=()=>setGame('menu');
  if(game==='penalty')return <PenaltyMind onBack={back} onComplete={reward}/>;
  if(game==='goalkeeper')return <GoalkeeperIQ onBack={back} onComplete={reward}/>;
  if(game==='pass')return <FindThePass onBack={back} onComplete={reward}/>;
  if(game==='squad')return <SquadBuilder onBack={back}/>;
  if(game==='var')return <VarChallenge onBack={back}/>;
  return <section className="games-screen"><div className="games-title"><div><div className="eyebrow"><span/> {en?'Game zone':'Игровая зона'}</div><h1>{en?'Choose a game':'Выбери игру'}</h1><p>{en?'Start with Penalty Mind, earn coins and unlock new modes.':'Начни с Penalty Mind, зарабатывай монеты и открывай новые режимы.'}</p></div><div className="coin-wallet"><span>FIELD COINS</span><strong>${profile?.coins??'—'}</strong></div></div>{message&&<div className="wallet-message">{message}</div>}<div className="game-library">{games.map((item)=>{const locked=Boolean(item.price&&!profile?.unlockedGames.includes(item.id));return <button className={locked?'game-locked':''} onClick={()=>open(item)} key={item.id}><div className={`game-cover game-cover--${item.id}`}><span>{item.cover}</span>{locked&&<b>🔒</b>}</div><small>{item.role}</small><h2>{item.title}</h2><p>{item.text}</p><strong>{locked?`${en?'Unlock':'Разблокировать'} · $${item.price}`:(en?'Play →':'Играть →')}</strong></button>})}</div><p className="reward-hint">🏆 {en?'Reward for completing a game: $50':'Награда за завершение игры: $50'}</p></section>;
}
