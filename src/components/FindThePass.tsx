import { useState } from 'react';

type Target={id:number;x:number;y:number};
type Round={you:{x:number;y:number};targets:Target[];opponents:{x:number;y:number}[];correct:number;hint:string};
const rounds:Round[]=[
  {you:{x:32,y:52},targets:[{id:1,x:58,y:20},{id:2,x:67,y:51},{id:3,x:55,y:80}],opponents:[{x:49,y:43},{x:58,y:60}],correct:1,hint:'Слева есть свободная линия.'},
  {you:{x:40,y:67},targets:[{id:1,x:27,y:25},{id:2,x:64,y:28},{id:3,x:75,y:72}],opponents:[{x:51,y:47},{x:62,y:63}],correct:2,hint:'Посмотри на дальний фланг.'},
  {you:{x:28,y:45},targets:[{id:1,x:50,y:18},{id:2,x:56,y:50},{id:3,x:52,y:82}],opponents:[{x:41,y:31},{x:42,y:65}],correct:2,hint:'Центральный игрок между линиями.'},
  {you:{x:48,y:55},targets:[{id:1,x:70,y:17},{id:2,x:78,y:48},{id:3,x:67,y:82}],opponents:[{x:60,y:30},{x:66,y:50},{x:56,y:70}],correct:3,hint:'Нижний фланг остался свободным.'},
  {you:{x:35,y:50},targets:[{id:1,x:65,y:22},{id:2,x:72,y:50},{id:3,x:63,y:78}],opponents:[{x:51,y:22},{x:55,y:51},{x:49,y:69}],correct:1,hint:'Один соперник не перекрыл линию полностью.'},
];

export function FindThePass({onBack,onComplete}:{onBack:()=>void;onComplete?:()=>void}){
  const [index,setIndex]=useState(0);const [selected,setSelected]=useState<number|null>(null);const [score,setScore]=useState(0);const [finished,setFinished]=useState(false);
  const round=rounds[index];const isCorrect=selected===round.correct;const chosen=round.targets.find((target)=>target.id===selected);
  const choose=(id:number)=>{if(selected)return;setSelected(id);if(id===round.correct)setScore((value)=>value+1)};
  const next=()=>{if(index===rounds.length-1){onComplete?.();return setFinished(true)}setIndex((value)=>value+1);setSelected(null)};
  const restart=()=>{setIndex(0);setSelected(null);setScore(0);setFinished(false)};
  if(finished)return <section className="pass-finish"><button className="game-back" onClick={onBack}>← Все игры</button><div>{score>=4?'🏆':score>=2?'🎯':'💪'}</div><span className="step-label">ИГРА ЗАВЕРШЕНА</span><h1>{score>=4?'Мастер паса!':score>=2?'Хорошее видение!':'Смотри на поле внимательнее!'}</h1><strong>{score}<small>/ 5</small></strong><p>Перед передачей проверяй всю линию между собой и партнёром.</p><button className="play-button" onClick={restart}>Играть снова ↻</button></section>;
  return <section className="find-pass"><button className="game-back" onClick={onBack}>← Все игры</button><div className="pass-heading"><div><div className="eyebrow"><span/> Мини-игра</div><h1>Find the Pass</h1><p>Нажми на свободного синего игрока.</p></div><div className="penalty-score"><span>Очки</span><strong>{score}</strong><small>Раунд {index+1} / 5</small></div></div><div className="pass-board"><div className="pass-pitch"><div className="pass-half"/><div className="pass-circle"/>{round.opponents.map((player,i)=><i className="pass-player opponent" style={{left:`${player.x}%`,top:`${player.y}%`}} key={`r-${i}`}>×</i>)}<i className="pass-player you" style={{left:`${round.you.x}%`,top:`${round.you.y}%`}}>ТЫ</i>{round.targets.map((target)=><button className={`pass-player teammate ${selected===target.id?(target.id===round.correct?'chosen-correct':'chosen-wrong'):''}`} style={{left:`${target.x}%`,top:`${target.y}%`}} onClick={()=>choose(target.id)} disabled={selected!==null} key={target.id}>{target.id}</button>)}<span className="pass-ball" style={{left:`${round.you.x+2}%`,top:`${round.you.y+5}%`}}>⚽</span>{chosen&&<svg className="chosen-pass-line" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={round.you.x} y1={round.you.y} x2={chosen.x} y2={chosen.y}/></svg>}</div><aside className="pass-panel"><span className="step-label">НАЙДИ ПАС</span><h2>{selected===null?'Кому отдать мяч?':isCorrect?'Отличный пас!':'Перехват!'}</h2><p>{selected===null?round.hint:isCorrect?'Линия передачи свободна, и атака продолжается.':'Соперник перекрывал эту линию. Ищи другого партнёра.'}</p>{selected&&<button className="penalty-shoot" onClick={next}>{index===4?'Результат':'Следующий раунд'} →</button>}</aside></div></section>;
}
