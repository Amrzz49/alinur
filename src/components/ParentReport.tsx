import { useState } from 'react';
import { getWeeklyParentAdvice } from '../lib/aiCoach';
import type { PlayerProgress, Skills } from '../lib/playerProgress';

const labels:Record<keyof Skills,string>={vision:'Видение поля',passing:'Пасы',shooting:'Удары',dribbling:'Дриблинг'};

export function ParentReport({progress,onBack}:{progress:PlayerProgress;onBack:()=>void}){
  const ranked=(Object.entries(progress.skills) as [keyof Skills,number][]).sort((a,b)=>b[1]-a[1]);
  const strongest=ranked.slice(0,2),weakest=ranked[ranked.length-1];
  const accuracy=progress.totalDecisions?Math.round(progress.correctDecisions/progress.totalDecisions*100):0;
  const fallback=`На этой неделе уделите 10 минут упражнениям на навык «${labels[weakest[0]]}»: перед каждым действием игрок должен назвать два возможных решения.`;
  const [advice,setAdvice]=useState(fallback);const [loading,setLoading]=useState(false);
  const askCoach=async()=>{setLoading(true);try{setAdvice(await getWeeklyParentAdvice(progress))}catch{setAdvice(fallback)}finally{setLoading(false)}};
  return <section className="parent-page">
    <button className="game-back" onClick={onBack}>← На главную</button>
    <header><div><span>ОТЧЁТ ДЛЯ РОДИТЕЛЯ</span><h1>Развитие футбольного мышления</h1><p>Короткий и понятный итог прогресса игрока.</p></div><b>{accuracy}%<small>точность решений</small></b></header>
    <div className="parent-metrics"><article><span>ТРЕНИРОВОК ПРОЙДЕНО</span><strong>{progress.totalTrainings}</strong><small>за всё время</small></article><article><span>ПРАВИЛЬНЫЕ РЕШЕНИЯ</span><strong>{progress.correctDecisions}</strong><small>из {progress.totalDecisions}</small></article><article><span>УРОВЕНЬ</span><strong>{Math.floor(progress.xp/500)+1}</strong><small>{progress.xp} XP</small></article></div>
    <div className="parent-details"><article><span>СИЛЬНЫЕ НАВЫКИ</span>{strongest.map(([skill,value])=><div className="parent-skill strong" key={skill}><b>{labels[skill]}</b><i><em style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</article><article><span>ЧТО УЛУЧШИТЬ</span><div className="parent-skill improve"><b>{labels[weakest[0]]}</b><i><em style={{width:`${weakest[1]}%`}}/></i><strong>{weakest[1]}</strong></div><p>Этот навык сейчас ниже остальных — следующая тренировка должна начать именно с него.</p></article></div>
    <article className="weekly-advice"><div><span>AI-ТРЕНЕР · СОВЕТ НА НЕДЕЛЮ</span><h2>{advice}</h2></div><button disabled={loading} onClick={()=>{void askCoach()}}>{loading?'AI анализирует…':'Обновить совет AI'}</button></article>
  </section>;
}
