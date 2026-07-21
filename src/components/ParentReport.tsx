import { useState } from 'react';
import { getWeeklyPlayerAdvice } from '../lib/aiCoach';
import type { PlayerProgress, Skills } from '../lib/playerProgress';

const labels={ru:{vision:'Видение поля',passing:'Пасы',shooting:'Удары',dribbling:'Дриблинг'},en:{vision:'Vision',passing:'Passing',shooting:'Shooting',dribbling:'Dribbling'}} as const;

export function PlayerReport({progress,language,onBack}:{progress:PlayerProgress;language:'ru'|'en';onBack:()=>void}){
  const en=language==='en',names=labels[language] as Record<keyof Skills,string>;
  const ranked=(Object.entries(progress.skills) as [keyof Skills,number][]).sort((a,b)=>b[1]-a[1]);
  const strongest=ranked.slice(0,2),weakest=ranked[ranked.length-1];
  const accuracy=progress.totalDecisions?Math.round(progress.correctDecisions/progress.totalDecisions*100):0;
  const fallback=en?`Train “${names[weakest[0]]}” for 10 minutes this week: name two options before every action.`:`На этой неделе тренируй навык «${names[weakest[0]]}» по 10 минут: перед каждым действием назови два возможных решения.`;
  const [advice,setAdvice]=useState(fallback);const [loading,setLoading]=useState(false);
  const askCoach=async()=>{setLoading(true);try{setAdvice(await getWeeklyPlayerAdvice(progress,language))}catch{setAdvice(fallback)}finally{setLoading(false)}};
  return <section className="parent-page">
    <button className="game-back" onClick={onBack}>← {en?'Home':'На главную'}</button>
    <header><div><span>{en?'YOUR REPORT':'ТВОЙ ОТЧЁТ'}</span><h1>{en?'Your football progress':'Твой футбольный прогресс'}</h1><p>{en?'See your results, strengths and next goal.':'Посмотри свои результаты, сильные навыки и следующую цель.'}</p></div><b>{accuracy}%<small>{en?'decision accuracy':'точность решений'}</small></b></header>
    <div className="parent-metrics"><article><span>{en?'TRAININGS COMPLETED':'ТРЕНИРОВОК ПРОЙДЕНО'}</span><strong>{progress.totalTrainings}</strong><small>{en?'all time':'за всё время'}</small></article><article><span>{en?'CORRECT DECISIONS':'ПРАВИЛЬНЫЕ РЕШЕНИЯ'}</span><strong>{progress.correctDecisions}</strong><small>{en?'of':'из'} {progress.totalDecisions}</small></article><article><span>{en?'LEVEL':'УРОВЕНЬ'}</span><strong>{Math.floor(progress.xp/500)+1}</strong><small>{progress.xp} XP</small></article></div>
    <div className="parent-details"><article><span>{en?'YOUR STRENGTHS':'ТВОИ СИЛЬНЫЕ НАВЫКИ'}</span>{strongest.map(([skill,value])=><div className="parent-skill strong" key={skill}><b>{names[skill]}</b><i><em style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</article><article><span>{en?'WHAT TO IMPROVE':'ЧТО ТЕБЕ УЛУЧШИТЬ'}</span><div className="parent-skill improve"><b>{names[weakest[0]]}</b><i><em style={{width:`${weakest[1]}%`}}/></i><strong>{weakest[1]}</strong></div><p>{en?'This skill is currently the lowest. Start your next training with it.':'Этот навык пока ниже остальных — начни следующую тренировку именно с него.'}</p></article></div>
    <article className="weekly-advice"><div><span>{en?'AI COACH · WEEKLY ADVICE':'AI-ТРЕНЕР · СОВЕТ НА НЕДЕЛЮ'}</span><h2>{advice}</h2></div><button disabled={loading} onClick={()=>{void askCoach()}}>{loading?(en?'AI is analysing…':'AI анализирует…'):(en?'Refresh AI advice':'Обновить совет AI')}</button></article>
  </section>;
}
