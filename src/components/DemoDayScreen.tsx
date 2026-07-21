import { useState } from 'react';

type Choice='left'|'right'|'dribble'|'shot';
const choices:{id:Choice;label:string;icon:string}[]=[
  {id:'left',label:'Пас налево',icon:'↙'},{id:'right',label:'Пас направо',icon:'↗'},
  {id:'dribble',label:'Дриблинг',icon:'⌁'},{id:'shot',label:'Удар',icon:'◎'},
];

export function DemoDayScreen({onBack}:{onBack:()=>void}){
  const [step,setStep]=useState(0);
  const [choice,setChoice]=useState<Choice|null>(null);
  const correct=choice==='right';
  return <section className="demo-day">
    <header className="demo-header"><button className="game-back" onClick={onBack}>← На главную</button><div><span>DEMO DAY · 3 МИНУТЫ</span><b>{step+1} / 3</b></div><i><em style={{width:`${((step+1)/3)*100}%`}}/></i></header>
    {step===0&&<section className="demo-scene">
      <div className="demo-copy"><span>0:00 — ФУТБОЛЬНОЕ РЕШЕНИЕ</span><h1>Найди лучший ход</h1><p>Ты играешь за синих. Соперник закрывает центр — куда продолжить атаку?</p></div>
      <div className="demo-layout"><DemoPitch choice={choice}/><article className="demo-decision"><h2>Что сделаешь?</h2><div>{choices.map((item)=><button className={choice===item.id?'active':''} disabled={choice!==null} onClick={()=>setChoice(item.id)} key={item.id}><i>{item.icon}</i>{item.label}</button>)}</div>{choice&&<div className={`demo-feedback ${correct?'correct':'wrong'}`}><strong>{correct?'Отличное решение!':'Можно сыграть лучше'}</strong><p>{correct?'Правый фланг свободен, а партнёр уже набирает скорость. Такой пас создаёт выход 2 в 1.':'Центр перегружен. Профессионал сначала заметил бы свободного игрока справа.'}</p><small>AI-ТРЕНЕР · анализ за 2 секунды</small><button onClick={()=>setStep(1)}>Продолжить <span>→</span></button></div>}</article></div>
    </section>}
    {step===1&&<section className="demo-reward"><span>1:00 — ПОНЯТНЫЙ РЕЗУЛЬТАТ</span><div>✓</div><h1>Решение разобрано</h1><p>Игрок сразу понимает, что произошло, как поступают профессионалы и какой навык он улучшил.</p><section><article><small>НАГРАДА</small><strong>+100 XP</strong></article><article><small>FIELD COINS</small><strong>+$25</strong></article><article><small>НАВЫК</small><strong>Видение +2</strong></article></section><button className="play-button" onClick={()=>setStep(2)}>Показать прогресс <span>→</span></button></section>}
    {step===2&&<section className="demo-summary"><div className="demo-copy"><span>2:00 — ЦЕННОСТЬ ДЛЯ ИГРОКА</span><h1>Прогресс, который видно</h1><p>FieldMind превращает каждое решение в понятную картину развития.</p></div><div className="demo-summary-grid"><article><header><span>ПРОФИЛЬ ИГРОКА</span><b>LVL 4</b></header><Skill name="Видение поля" value={78}/><Skill name="Пасы" value={72}/><Skill name="Удары" value={61}/><Skill name="Дриблинг" value={66}/></article><article className="parent-report"><span>ТВОЙ ОТЧЁТ</span><h2>Ты прогрессируешь</h2><strong>8 из 10</strong><p>Ты лучше всего находишь свободного партнёра. На следующей неделе потренируй решения под прессингом.</p><small>Рекомендация AI-тренера</small></article></div><button className="play-button" onClick={onBack}>Завершить демо <span>✓</span></button></section>}
  </section>;
}

function DemoPitch({choice}:{choice:Choice|null}){return <div className="demo-pitch"><div className="demo-pitch-line"/><i className="demo-player blue you">YOU</i><i className="demo-player blue mate-a"/><i className="demo-player blue mate-b"/><i className="demo-player red rival-a"/><i className="demo-player red rival-b"/><i className="demo-player red rival-c"/><span className="demo-ball">⚽</span>{choice&&<svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="35" y1="62" x2={choice==='right'?'74':choice==='left'?'20':choice==='shot'?'96':'51'} y2={choice==='right'?'27':choice==='left'?'76':choice==='shot'?'50':'45'}/></svg>}</div>}
function Skill({name,value}:{name:string;value:number}){return <label className="demo-skill"><span>{name}</span><i><em style={{width:`${value}%`}}/></i><b>{value}</b></label>}
