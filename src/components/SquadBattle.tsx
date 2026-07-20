import { useRef, useState } from 'react';
import { squadPlayers, type SquadPlayer, type SquadPosition } from '../lib/squadPlayers';

const needs:Record<SquadPosition,number>={GK:1,DEF:4,MID:3,ATT:3};
const buildAiTeam=()=>Object.entries(needs).flatMap(([position,count])=>squadPlayers
  .filter((player)=>player.position===position)
  .sort(()=>Math.random()-.5)
  .slice(0,count));
const strength=(players:SquadPlayer[],chemistry:number)=>players.reduce((sum,player)=>sum+player.rating,0)/11+chemistry*.08;
const chemistry=(players:SquadPlayer[])=>Math.min(100,55+players.reduce((score,player,index)=>score+players.slice(index+1).filter((other)=>other.club===player.club||other.country===player.country).length*3,0));
const scorer=(players:SquadPlayer[])=>players.filter((player)=>player.position==='ATT'||player.position==='MID').sort(()=>Math.random()-.5)[0];

export function SquadBattle({team,userChemistry,onBack,onComplete}:{team:SquadPlayer[];userChemistry:number;onBack:()=>void;onComplete:()=>void}){
  const [aiTeam,setAiTeam]=useState(buildAiTeam);
  const [result,setResult]=useState<{user:number;ai:number;events:string[]}|null>(null);
  const rewarded=useRef(false);
  const aiChemistry=chemistry(aiTeam);
  const userRating=Math.round(strength(team,0));
  const aiRating=Math.round(strength(aiTeam,0));
  const play=()=>{
    const userPower=strength(team,userChemistry);
    const aiPower=strength(aiTeam,aiChemistry);
    let user=0,ai=0;
    const events:string[]=[];
    [14,27,41,58,72,86].forEach((minute)=>{
      const chance=Math.random()*2;
      const userChance=.72+(userPower-aiPower)*.035;
      if(chance<userChance){user+=1;events.push(`${minute}' ⚽ ${scorer(team).name} — твоя команда`)}
      else if(chance>1.25){ai+=1;events.push(`${minute}' ⚽ ${scorer(aiTeam).name} — AI`)}
    });
    if(user===ai){
      if(Math.random()+userPower/200>Math.random()+aiPower/200){user+=1;events.push(`90' ⚽ Победный гол твоей команды`)}
      else{ai+=1;events.push(`90' ⚽ Победный гол AI`)}
    }
    setResult({user,ai,events});
    if(!rewarded.current){rewarded.current=true;onComplete()}
  };
  const replay=()=>{setAiTeam(buildAiTeam());setResult(null)};
  return <section className="squad-battle">
    <button className="game-back" onClick={onBack}>← Вернуться к составу</button>
    <div className="battle-heading"><div><div className="eyebrow"><span/> Squad Battle</div><h1>Твой состав против AI</h1></div>{result&&<strong>{result.user} : {result.ai}</strong>}</div>
    <div className="battle-stats"><span>ТЫ · {userRating} OVR · {userChemistry} CHEM</span><b>Стадион FieldMind</b><span>AI · {aiRating} OVR · {aiChemistry} CHEM</span></div>
    <div className="battle-teams"><Team title="ТВОЯ КОМАНДА" players={team}/><div className="battle-versus">VS</div><Team title="СОСТАВ AI" players={aiTeam}/></div>
    {result?<div className="battle-result"><h2>{result.user>result.ai?'Победа! 🏆':'Поражение — усили состав'}</h2><div>{result.events.map((event)=><p key={event}>{event}</p>)}</div><button onClick={replay}>Новый соперник</button></div>:<button className="battle-play" onClick={play}>Сыграть матч против AI <span>→</span></button>}
  </section>;
}

function Team({title,players}:{title:string;players:SquadPlayer[]}){return <section className="battle-team"><h2>{title}</h2><div>{players.map((player)=><article key={player.id}><b>{player.rating}</b>{player.photo?<img src={player.photo} alt={player.name}/>:<i>{player.initials}</i>}<span>{player.name}</span><small>{player.position}</small></article>)}</div></section>}
