import { useState } from 'react';

type Choice='left'|'right'|'dribble'|'shot';
const choices:{id:Choice;label:string;icon:string}[]=[
  {id:'left',label:'Пас налево',icon:'↙'},{id:'right',label:'Пас направо',icon:'↗'},
  {id:'dribble',label:'Дриблинг',icon:'⌁'},{id:'shot',label:'Удар',icon:'◎'},
];

export function DemoDayScreen({language,onBack}:{language:'ru'|'en';onBack:()=>void}){
  const en=language==='en';
  const [step,setStep]=useState(0);
  const [choice,setChoice]=useState<Choice|null>(null);
  const correct=choice==='right';
  return <section className="demo-day">
    <header className="demo-header"><button className="game-back" onClick={onBack}>← {en?'Home':'На главную'}</button><div><span>DEMO DAY · {en?'3 MINUTES':'3 МИНУТЫ'}</span><b>{step+1} / 3</b></div><i><em style={{width:`${((step+1)/3)*100}%`}}/></i></header>
    {step===0&&<section className="demo-scene">
      <div className="demo-copy"><span>0:00 — {en?'FOOTBALL DECISION':'ФУТБОЛЬНОЕ РЕШЕНИЕ'}</span><h1>{en?'Find the best move':'Найди лучший ход'}</h1><p>{en?'You are blue. The centre is blocked — where will you attack?':'Ты играешь за синих. Соперник закрывает центр — куда продолжить атаку?'}</p></div>
      <div className="demo-layout"><DemoPitch choice={choice}/><article className="demo-decision"><h2>{en?'What will you do?':'Что сделаешь?'}</h2><div>{choices.map((item)=><button className={choice===item.id?'active':''} disabled={choice!==null} onClick={()=>setChoice(item.id)} key={item.id}><i>{item.icon}</i>{en?({left:'Pass left',right:'Pass right',dribble:'Dribble',shot:'Shoot'} as const)[item.id]:item.label}</button>)}</div>{choice&&<div className={`demo-feedback ${correct?'correct':'wrong'}`}><strong>{correct?(en?'Great decision!':'Отличное решение!'):(en?'You can do better':'Можно сыграть лучше')}</strong><p>{correct?(en?'The right flank is open, creating a 2v1.':'Правый фланг свободен, а партнёр уже набирает скорость. Такой пас создаёт выход 2 в 1.'):(en?'The centre is crowded. A professional spots the free player on the right.':'Центр перегружен. Профессионал сначала заметил бы свободного игрока справа.')}</p><small>{en?'AI COACH · 2-second analysis':'AI-ТРЕНЕР · анализ за 2 секунды'}</small><button onClick={()=>setStep(1)}>{en?'Continue':'Продолжить'} <span>→</span></button></div>}</article></div>
    </section>}
    {step===1&&<section className="demo-reward"><span>1:00 — {en?'CLEAR RESULT':'ПОНЯТНЫЙ РЕЗУЛЬТАТ'}</span><div>✓</div><h1>{en?'Decision reviewed':'Решение разобрано'}</h1><p>{en?'See what happened, how professionals play and which skill improved.':'Игрок сразу понимает, что произошло, как поступают профессионалы и какой навык он улучшил.'}</p><section><article><small>{en?'REWARD':'НАГРАДА'}</small><strong>+100 XP</strong></article><article><small>FIELD COINS</small><strong>+$25</strong></article><article><small>{en?'SKILL':'НАВЫК'}</small><strong>{en?'Vision':'Видение'} +2</strong></article></section><button className="play-button" onClick={()=>setStep(2)}>{en?'View progress':'Показать прогресс'} <span>→</span></button></section>}
    {step===2&&<section className="demo-summary"><div className="demo-copy"><span>2:00 — {en?'PLAYER VALUE':'ЦЕННОСТЬ ДЛЯ ИГРОКА'}</span><h1>{en?'Progress you can see':'Прогресс, который видно'}</h1><p>{en?'FieldMind turns every decision into a clear development path.':'FieldMind превращает каждое решение в понятную картину развития.'}</p></div><div className="demo-summary-grid"><article><header><span>{en?'PLAYER PROFILE':'ПРОФИЛЬ ИГРОКА'}</span><b>LVL 4</b></header><Skill name={en?'Vision':'Видение поля'} value={78}/><Skill name={en?'Passing':'Пасы'} value={72}/><Skill name={en?'Shooting':'Удары'} value={61}/><Skill name={en?'Dribbling':'Дриблинг'} value={66}/></article><article className="parent-report"><span>{en?'YOUR REPORT':'ТВОЙ ОТЧЁТ'}</span><h2>{en?'You are improving':'Ты прогрессируешь'}</h2><strong>8 {en?'of':'из'} 10</strong><p>{en?'Finding the free teammate is your strength. Next week, train decisions under pressure.':'Ты лучше всего находишь свободного партнёра. На следующей неделе потренируй решения под прессингом.'}</p><small>{en?'AI coach recommendation':'Рекомендация AI-тренера'}</small></article></div><button className="play-button" onClick={onBack}>{en?'Finish demo':'Завершить демо'} <span>✓</span></button></section>}
  </section>;
}

function DemoPitch({choice}:{choice:Choice|null}){return <div className="demo-pitch"><div className="demo-pitch-line"/><i className="demo-player blue you">YOU</i><i className="demo-player blue mate-a"/><i className="demo-player blue mate-b"/><i className="demo-player red rival-a"/><i className="demo-player red rival-b"/><i className="demo-player red rival-c"/><span className="demo-ball">⚽</span>{choice&&<svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="35" y1="62" x2={choice==='right'?'74':choice==='left'?'20':choice==='shot'?'96':'51'} y2={choice==='right'?'27':choice==='left'?'76':choice==='shot'?'50':'45'}/></svg>}</div>}
function Skill({name,value}:{name:string;value:number}){return <label className="demo-skill"><span>{name}</span><i><em style={{width:`${value}%`}}/></i><b>{value}</b></label>}
