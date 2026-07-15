import { useState } from 'react';
import { PlayerCard } from './PlayerCard';
import { PlayerDetailsModal } from './PlayerDetailsModal';
import { clubs, coaches, players, seasonCards, worldCupCards, type PlayerCard as PlayerCardData, type WorldItem } from '../lib/footballWorld';

type Tab = 'worldCup' | 'season' | 'players' | 'clubs' | 'coaches';
const tabs: { id: Tab; label: string }[] = [{id:'worldCup',label:'ЧМ-2026'},{id:'season',label:'Сезон 25/26'},{id:'players',label:'Звёзды'},{id:'clubs',label:'Клубы'},{id:'coaches',label:'Тренеры'}];
const logoClass = (item: WorldItem) => item.name === 'Real Madrid' || item.meta.includes('Real Madrid') ? 'world-avatar--rm' : item.name === 'Liverpool' ? 'world-avatar--lfc' : '';

export function WorldScreen() {
  const [tab, setTab] = useState<Tab>('worldCup');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCardData | null>(null);
  const standard: Partial<Record<Tab, WorldItem[]>> = { players, clubs, coaches };
  const cards = tab === 'worldCup' ? worldCupCards : seasonCards;
  const isCards = tab === 'worldCup' || tab === 'season';
  return (
    <section className="world-screen">
      <div className="world-heading"><div><div className="eyebrow"><span /> Учись у лучших</div><h1>Футбольный мир</h1><p>Карточки лидеров, сильные клубы и лучшие футбольные тренеры.</p></div><div className="award-stamp">FM<br/><strong>2026</strong></div></div>
      <div className="world-tabs">{tabs.map((item)=><button className={tab===item.id?'active':''} onClick={()=>setTab(item.id)} key={item.id}>{item.label}</button>)}</div>
      {isCards ? <div className="player-card-grid">{cards.map((card)=><PlayerCard card={card} onClick={()=>setSelectedPlayer(card)} key={`${tab}-${card.name}`}/>)}</div> : <div className="world-grid">{standard[tab]?.map((item,index)=><article className="world-card" key={item.name}><span className="rank">0{index+1}</span><div className={`world-avatar ${item.logo?`world-avatar--logo ${logoClass(item)}`:''}`} style={{background:item.logo?'rgba(255,255,255,.94)':item.color}}>{item.logo?<img src={item.logo} alt={`Логотип ${item.name}`}/>:item.mark}</div><div><h2>{item.name}</h2><p>{item.meta}</p><span className="fact">★ {item.fact}</span></div></article>)}</div>}
      <p className="data-note">{isCards ? 'Турнирные данные FIFA и UEFA. Статистика ЧМ обновлена 14 июля 2026.' : 'Данные о наградах: официальные итоги FIFA и UEFA.'}</p>
      {selectedPlayer && <PlayerDetailsModal card={selectedPlayer} onClose={()=>setSelectedPlayer(null)}/>} 
    </section>
  );
}
