import { useState } from 'react';
import { PlayerCard } from './PlayerCard';
import { PlayerDetailsModal } from './PlayerDetailsModal';
import { clubs, coaches, players, seasonCards, worldCupCards, type PlayerCard as PlayerCardData, type WorldItem } from '../lib/footballWorld';
import { localizeWorldItem } from '../lib/footballWorldTranslations';

type Tab = 'worldCup' | 'season' | 'players' | 'clubs' | 'coaches';
const tabs: { id: Tab; ru:string;en:string }[] = [{id:'worldCup',ru:'ЧМ-2026',en:'World Cup 2026'},{id:'season',ru:'Сезон 25/26',en:'Season 25/26'},{id:'players',ru:'Звёзды',en:'Stars'},{id:'clubs',ru:'Клубы',en:'Clubs'},{id:'coaches',ru:'Тренеры',en:'Coaches'}];
const logoClass = (item: WorldItem) => item.name === 'Real Madrid' || item.meta.includes('Real Madrid') ? 'world-avatar--rm' : item.name === 'Liverpool' ? 'world-avatar--lfc' : '';

export function WorldScreen({language}:{language:'ru'|'en'}) {
  const en=language==='en';
  const [tab, setTab] = useState<Tab>('worldCup');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCardData | null>(null);
  const standard: Partial<Record<Tab, WorldItem[]>> = { players, clubs, coaches };
  const cards = tab === 'worldCup' ? worldCupCards : seasonCards;
  const isCards = tab === 'worldCup' || tab === 'season';
  return (
    <section className="world-screen">
      <div className="world-heading"><div><div className="eyebrow"><span /> {en?'Learn from the best':'Учись у лучших'}</div><h1>{en?'Football world':'Футбольный мир'}</h1><p>{en?'Top player cards, legendary clubs and the best football coaches.':'Карточки лидеров, сильные клубы и лучшие футбольные тренеры.'}</p></div><div className="award-stamp">FM<br/><strong>2026</strong></div></div>
      <div className="world-tabs">{tabs.map((item)=><button className={tab===item.id?'active':''} onClick={()=>setTab(item.id)} key={item.id}>{en?item.en:item.ru}</button>)}</div>
      {isCards ? <div className="player-card-grid">{cards.map((card)=><PlayerCard card={card} language={language} onClick={()=>setSelectedPlayer(card)} key={`${tab}-${card.name}`}/>)}</div> : <div className="world-grid">{standard[tab]?.map((item,index)=>{const text=localizeWorldItem(item,language);return <article className="world-card" key={item.name}><span className="rank">0{index+1}</span><div className={`world-avatar ${item.logo?`world-avatar--logo ${logoClass(item)}`:''} ${item.photo?'world-avatar--photo':''}`} style={{background:item.logo?'rgba(255,255,255,.94)':item.color}}>{item.photo?<img src={item.photo} alt={text.name}/>:item.logo?<img src={item.logo} alt={`${en?'Logo':'Логотип'} ${text.name}`}/>:item.mark}</div><div><h2>{text.name}</h2><p>{text.meta}</p><span className="fact">★ {text.fact}</span></div></article>})}</div>}
      <p className="data-note">{isCards ? (en?'FIFA and UEFA tournament data. World Cup stats updated July 14, 2026.':'Турнирные данные FIFA и UEFA. Статистика ЧМ обновлена 14 июля 2026.') : (en?'Awards data based on official FIFA and UEFA results.':'Данные о наградах: официальные итоги FIFA и UEFA.')}</p>
      {selectedPlayer && <PlayerDetailsModal card={selectedPlayer} language={language} onClose={()=>setSelectedPlayer(null)}/>}
    </section>
  );
}
