import { useRef, useState } from 'react';
import { playerStats, squadPlayers, type DuelStat, type SquadPlayer, type SquadPosition } from '../lib/squadPlayers';
import { SquadCard } from './SquadCard';

const needs:Record<SquadPosition,number>={GK:1,DEF:4,MID:3,ATT:3};
const statNames:Record<DuelStat,string>={attack:'АТАКА',control:'КОНТРОЛЬ',defence:'ЗАЩИТА'};
const buildAiTeam=()=>Object.entries(needs).flatMap(([position,count])=>squadPlayers
  .filter((player)=>player.position===position).sort(()=>Math.random()-.5).slice(0,count));

type Duel={mine:SquadPlayer;enemy:SquadPlayer;stat:DuelStat;mineValue:number;enemyValue:number};

export function SquadBattle({team,onBack,onComplete}:{team:SquadPlayer[];userChemistry:number;onBack:()=>void;onComplete:()=>void}){
  const [aiTeam,setAiTeam]=useState(buildAiTeam);
  const [mine,setMine]=useState<SquadPlayer|null>(null);
  const [enemy,setEnemy]=useState<SquadPlayer|null>(null);
  const [stat,setStat]=useState<DuelStat>('attack');
  const [duels,setDuels]=useState<Duel[]>([]);
  const rewarded=useRef(false);
  const usedMine=duels.map((duel)=>duel.mine.id);
  const usedEnemy=duels.map((duel)=>duel.enemy.id);
  const myScore=duels.filter((duel)=>duel.mineValue>duel.enemyValue).length;
  const aiScore=duels.filter((duel)=>duel.mineValue<duel.enemyValue).length;
  const finished=duels.length===11;
  const lastDuel=duels[duels.length-1];

  const playDuel=()=>{
    if(!mine||!enemy)return;
    const mineValue=playerStats(mine)[stat];
    const enemyValue=playerStats(enemy)[stat];
    const next=[...duels,{mine,enemy,stat,mineValue,enemyValue}];
    setDuels(next);setMine(null);setEnemy(null);
    if(next.length===11&&!rewarded.current){rewarded.current=true;onComplete()}
  };
  const restart=()=>{
    setAiTeam(buildAiTeam());setDuels([]);setMine(null);setEnemy(null);rewarded.current=false;
  };

  return <section className="squad-battle">
    <button className="game-back" onClick={onBack}>← Вернуться к составу</button>
    <header className="fatal-header">
      <div><span>FIELD DRAFT · CARD DUELS</span><h1>Ты выбираешь дуэль</h1><p>Выбери характеристику, свою карточку и любого соперника.</p></div>
      <div className="fatal-score"><b>{myScore}</b><span>{duels.length} / 11</span><b>{aiScore}</b></div>
    </header>
    <nav className="fatal-stats">{(Object.keys(statNames) as DuelStat[]).map((item)=><button className={stat===item?'active':''} onClick={()=>setStat(item)} key={item}>{statNames[item]}</button>)}</nav>
    {lastDuel && (
      <DuelResult duel={lastDuel}/>
    )}
    <div className="fatal-squads">
      <CardTeam title="ТВОИ КАРТОЧКИ" players={team} selected={mine} used={usedMine} stat={stat} onPick={setMine}/>
      <div className="fatal-center"><span>{mine?.rating??'?'}</span><b>VS</b><span>{enemy?.rating??'?'}</span></div>
      <CardTeam title="КАРТОЧКИ AI" players={aiTeam} selected={enemy} used={usedEnemy} stat={stat} onPick={setEnemy}/>
    </div>
    {finished?<section className="fatal-finish"><h2>{myScore>aiScore?'Ты выиграл Squad Battle! 🏆':myScore===aiScore?'Ничья! 🤝':'AI победил — собери состав сильнее'}</h2><button onClick={restart}>Новый матч</button></section>:<button className="battle-play" disabled={!mine||!enemy} onClick={playDuel}>Играть выбранную дуэль <span>→</span></button>}
  </section>;
}

function CardTeam({title,players,selected,used,stat,onPick}:{title:string;players:SquadPlayer[];selected:SquadPlayer|null;used:number[];stat:DuelStat;onPick:(player:SquadPlayer)=>void}){
  return <section className="fatal-team"><h2>{title}</h2><div>{players.map((player)=><SquadCard player={player} selected={selected?.id===player.id} used={used.includes(player.id)} stat={stat} onClick={()=>onPick(player)} key={player.id}/>)}</div></section>;
}

function DuelResult({duel}:{duel:Duel}){
  const won=duel.mineValue>duel.enemyValue;
  const draw=duel.mineValue===duel.enemyValue;
  return <div className={`duel-result ${won?'won':draw?'draw':'lost'}`}><span>{duel.mine.name} · {duel.mineValue}</span><b>{draw?'НИЧЬЯ':won?'ТВОЁ ОЧКО':'ОЧКО AI'}</b><span>{duel.enemyValue} · {duel.enemy.name}</span></div>;
}
