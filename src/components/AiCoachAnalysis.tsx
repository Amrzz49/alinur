import { useEffect, useState } from 'react';
import { getAiCoachAnalysis, getFallbackCoachAnalysis, type TrainingDecision } from '../lib/aiCoach';
import type { MistakePatterns } from '../lib/playerProgress';

type Props={decisions:TrainingDecision[];score:number;total:number;patterns:MistakePatterns;language:'ru'|'en'};

export function AiCoachAnalysis({decisions,score,total,patterns,language}:Props){
  const en=language==='en';
  const fallback=getFallbackCoachAnalysis(decisions,score,total,patterns,language);
  const [analysis,setAnalysis]=useState('');const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;setLoading(true);
    getAiCoachAnalysis(decisions,score,total,patterns,language)
      .then((text)=>{if(active)setAnalysis(text)}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[decisions,score,total,patterns,language]);
  return <section className="ai-coach">
    <div className="ai-coach__head"><span>AI</span><div><strong>{en?'Personal coach':'Персональный тренер'}</strong><small>{loading?(en?'Improving your plan…':'Уточняю твой план…'):(en?'Analysis ready':'Разбор готов')}</small></div></div>
    <div className="ai-coach__answer"><strong>{en?'Training summary':'Итог тренировки'}</strong><p>{analysis||fallback.summary}</p><strong>{en?'Mistake memory':'Память ошибок'}</strong><p>{fallback.memory}</p><strong>{en?'Next exercise':'Следующее упражнение'}</strong><p>{fallback.exercise}</p></div>
  </section>;
}
