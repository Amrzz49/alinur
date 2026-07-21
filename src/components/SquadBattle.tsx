import { useRef, useState } from 'react';
import { playerStats, squadPlayers, type DuelStat, type SquadPlayer, type SquadPosition } from '../lib/squadPlayers';
import { SquadCard } from './SquadCard';

const needs:Record<SquadPosition,number>={GK:1,DEF:4,MID:3,ATT:3};
const statNames:Record<DuelStat,string>={attack:'АТАКА',control:'КОНТРОЛЬ',defence:'ЗАЩИТА'};
const buildAiTeam=()=>Object.entries(needs).flatMap(([position,count])=>squadPlayers
  .filter((player)=>player.position===position).sort(()=>Math.random()-.5).slice(0,count));

type Duel={mine:SquadPlayer;enemy:SquadPlayer;stat:DuelStat;mineValue:number;enemyValue:number};

export function SquadBattle({language,team,onBack,onComplete}:{language:'ru'|'en';team:SquadPlayer[];userChemistry:number;onBack:()=>void;onComplete:()=>void}){
  const en=language==='en';
  const [aiTeam,setAiTeam]=useState(buildAiTeam);
  const [mine,setMine]=useState<SquadPlayer|null>(null);
  const [stat,setStat]=useState<DuelStat>('attack');
  const [duels,setDuels]=useState<Duel[]>([]);
  const rewarded=useRef(false);
  const usedMine=duels.map((duel)=>duel.mine.id);
  const usedEnemy=duels.map((duel)=>duel.enemy.id);
  const myScore=duels.filter((duel)=>duel.mineValue>duel.enemyValue).length;
  const aiScore=duels.filter((duel)=>duel.mineValue<duel.enemyValue).length;
  const finished=duels.length===11;
  const lastDuel=duels[duels.length-1];
  const aiChooses=duels.length%2===1;

  const playDuel=()=>{
    if(!mine)return;
    const available=aiTeam.filter((player)=>!usedEnemy.includes(player.id));
    let chosenStat=stat;
    let enemy=available.reduce((best,player)=>playerStats(player)[stat]>playerStats(best)[stat]?player:best);
    if(aiChooses){
      const options=(Object.keys(statNames) as DuelStat[]).flatMap((item)=>available.map((player)=>({item,player,advantage:playerStats(player)[item]-playerStats(mine)[item]})));
      const choice=options.reduce((best,option)=>option.advantage>best.advantage?option:best);
      chosenStat=choice.item;enemy=choice.player;setStat(chosenStat);
    }
    const mineValue=playerStats(mine)[chosenStat];
    const enemyValue=playerStats(enemy)[chosenStat];
    const next=[...duels,{mine,enemy,stat:chosenStat,mineValue,enemyValue}];
    setDuels(next);setMine(null);
    if(next.length===11&&!rewarded.current){rewarded.current=true;onComplete()}
  };
  const restart=()=>{
    setAiTeam(buildAiTeam());setDuels([]);setMine(null);rewarded.current=false;
  };

  return <section className="squad-battle">
    <button className="game-back" onClick={onBack}>← {en?'Back to squad':'Вернуться к составу'}</button>
    <header className="fatal-header">
      <div><span>FIELD DRAFT · CARD DUELS</span><h1>{en?'Choose your move':'Выбери свой ход'}</h1><p>{en?'Pick a stat and your card. AI secretly chooses the opponent.':'Выбери характеристику и свою карточку. Соперника AI выберет тайно.'}</p></div>
      <div className="fatal-score"><b>{myScore}</b><span>{duels.length} / 11</span><b>{aiScore}</b></div>
    </header>
    <div className="duel-picker-label">{aiChooses?(en?'AI CHOOSES THE STAT':'ХАРАКТЕРИСТИКУ ВЫБИРАЕТ AI'):(en?'YOU CHOOSE THE STAT':'ХАРАКТЕРИСТИКУ ВЫБИРАЕШЬ ТЫ')}</div>
    <nav className={`fatal-stats ${aiChooses?'ai-turn':''}`}>{(Object.keys(statNames) as DuelStat[]).map((item)=><button className={!aiChooses&&stat===item?'active':''} disabled={aiChooses} onClick={()=>setStat(item)} key={item}>{en?item.toUpperCase():statNames[item]}</button>)}</nav>
    {lastDuel && (
      <DuelResult duel={lastDuel} language={language}/>
    )}
    <div className="fatal-squads">
      <CardTeam title={en?'YOUR CARDS':'ТВОИ КАРТОЧКИ'} players={team} selected={mine} used={usedMine} stat={stat} onPick={setMine}/>
      <div className="fatal-center"><span>{mine?.rating??'?'}</span><b>VS</b><span>?</span></div>
      <CardTeam title={en?'HIDDEN AI CARDS':'СКРЫТЫЕ КАРТОЧКИ AI'} players={aiTeam} selected={null} used={usedEnemy} stat={stat} hidden locked language={language} onPick={()=>{}}/>
    </div>
    {finished?<section className="fatal-finish"><h2>{myScore>aiScore?(en?'You won Squad Battle! 🏆':'Ты выиграл Squad Battle! 🏆'):myScore===aiScore?(en?'Draw! 🤝':'Ничья! 🤝'):(en?'AI wins — improve your squad':'AI победил — собери состав сильнее')}</h2><button onClick={restart}>{en?'New match':'Новый матч'}</button></section>:<button className="battle-play" disabled={!mine} onClick={playDuel}>{!mine?(en?'Choose your card':'Выбери свою карточку'):aiChooses?(en?'AI chooses stat and opponent':'AI выберет характеристику и соперника'):(en?'AI picks opponent · reveal duel':'AI выберет соперника · открыть дуэль')} <span>→</span></button>}
  </section>;
}

function CardTeam({title,players,selected,used,stat,hidden=false,locked=false,language='en',onPick}:{title:string;players:SquadPlayer[];selected:SquadPlayer|null;used:number[];stat:DuelStat;hidden?:boolean;locked?:boolean;language?:'ru'|'en';onPick:(player:SquadPlayer)=>void}){
  return <section className="fatal-team"><h2>{title}</h2><div>{players.map((player,index)=>hidden&&!used.includes(player.id)?<button className={`mad-card-back ${selected?.id===player.id?'selected':''}`} disabled={locked} onClick={()=>onPick(player)} aria-label={`${language==='en'?'Hidden opponent card':'Скрытая карточка соперника'} ${index+1}`} key={player.id}><i>FM</i><strong>?</strong><span>{language==='en'?'AI PICK':'ВЫБОР AI'}</span></button>:<SquadCard player={player} selected={selected?.id===player.id} used={used.includes(player.id)} stat={stat} onClick={()=>onPick(player)} key={player.id}/>)}</div></section>;
}

function DuelResult({duel,language}:{duel:Duel;language:'ru'|'en'}){
  const won=duel.mineValue>duel.enemyValue;
  const draw=duel.mineValue===duel.enemyValue;
  const stat=language==='en'?duel.stat.toUpperCase():statNames[duel.stat];
  return <div className={`duel-result ${won?'won':draw?'draw':'lost'}`}><span>{duel.mine.name} · {duel.mineValue}</span><b><small>{stat}</small>{draw?(language==='en'?'DRAW':'НИЧЬЯ'):won?(language==='en'?'YOUR POINT':'ТВОЁ ОЧКО'):(language==='en'?'AI POINT':'ОЧКО AI')}</b><span>{duel.enemyValue} · {duel.enemy.name}</span></div>;
}
