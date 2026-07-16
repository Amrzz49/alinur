import { useState } from 'react';
import { Goalkeeper } from './Goalkeeper';

type Direction='left'|'center'|'right';
const directions:{id:Direction;label:string;icon:string}[]=[{id:'left',label:'Прыжок влево',icon:'↖'},{id:'center',label:'Остаться в центре',icon:'↑'},{id:'right',label:'Прыжок вправо',icon:'↗'}];
const randomShot=():Direction=>['left','center','right'][Math.floor(Math.random()*3)] as Direction;

export function GoalkeeperIQ({onBack,onComplete}:{onBack:()=>void;onComplete?:()=>void}){
  const [choice,setChoice]=useState<Direction>('center'); const [shot,setShot]=useState<Direction|null>(null); const [saves,setSaves]=useState(0); const [round,setRound]=useState(1); const [finished,setFinished]=useState(false);
  const isSave=shot!==null&&shot===choice;
  const defend=()=>{if(shot)return;const nextShot=randomShot();setShot(nextShot);if(nextShot===choice)setSaves((value)=>value+1)};
  const next=()=>{if(round===5){onComplete?.();return setFinished(true)}setRound((value)=>value+1);setShot(null)};
  const restart=()=>{setChoice('center');setShot(null);setSaves(0);setRound(1);setFinished(false)};
  if(finished)return <section className="keeper-finish"><button className="game-back" onClick={onBack}>← Все игры</button><div>{saves>=4?'🏆':saves>=2?'🧤':'💪'}</div><span className="step-label">МАТЧ ЗАВЕРШЁН</span><h1>{saves>=4?'Стена в воротах!':saves>=2?'Хорошая игра!':'Продолжай тренироваться!'}</h1><strong>{saves}<small>/ 5 сейвов</small></strong><p>{saves>=4?'Ты отлично читаешь удары соперника.':'Следи за разбегом нападающего и меняй направление прыжка.'}</p><button className="play-button" onClick={restart}>Сыграть ещё раз ↻</button></section>;
  return <section className="goalkeeper-game"><button className="game-back" onClick={onBack}>← Все игры</button><div className="keeper-game-heading"><div><div className="eyebrow"><span/> Мини-игра</div><h1>Goalkeeper IQ</h1><p>Выбери направление до удара нападающего.</p></div><div className="penalty-score"><span>Сейвы</span><strong>{saves}</strong><small>Раунд {round} / 5</small></div></div><div className="penalty-game keeper-arena"><div className="stadium-lights"/><div className="goal"><div className="goal-net"/><div className={`keeper ${shot?`keeper--${choice}`:''}`}><Goalkeeper/></div><div className={`shot-ball ${shot?`shot-ball--${shot}`:''}`}>⚽</div>{shot&&<div className={`goal-result ${isSave?'result--goal':'result--save'}`}>{isSave?'СЕЙВ!':'ГОЛ!'}</div>}</div><div className="penalty-spot"/><div className="penalty-controls"><span>Куда прыгнуть?</span><div>{directions.map((direction)=><button className={choice===direction.id?'active':''} disabled={shot!==null} onClick={()=>setChoice(direction.id)} key={direction.id}><i>{direction.icon}</i>{direction.label}</button>)}</div>{shot?<button className="penalty-shoot" onClick={next}>{round===5?'Результат':'Следующий удар'} →</button>:<button className="penalty-shoot" onClick={defend}>Защищать 🧤</button>}</div></div></section>;
}
