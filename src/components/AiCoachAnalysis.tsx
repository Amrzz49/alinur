import { useState } from 'react';
import { getAiCoachAnalysis, type TrainingDecision } from '../lib/aiCoach';

type Props={decisions:TrainingDecision[];score:number;total:number;language:'ru'|'en'};

export function AiCoachAnalysis({decisions,score,total,language}:Props){
  const en=language==='en';
  const [analysis,setAnalysis]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const analyze=async()=>{setLoading(true);setError('');try{setAnalysis(await getAiCoachAnalysis(decisions,score,total,language))}catch(reason){setError(reason instanceof Error?reason.message:(en?'Could not get analysis.':'Не удалось получить разбор.'))}finally{setLoading(false)}};
  return <section className="ai-coach"><div className="ai-coach__head"><span>AI</span><div><strong>{en?'Personal coach':'Персональный тренер'}</strong><small>{en?'Gemini will review your decisions':'Gemini разберёт твои решения'}</small></div></div>{analysis?<div className="ai-coach__answer">{analysis}</div>:<button disabled={loading||decisions.length===0} onClick={analyze}>{loading?(en?'Analyzing decisions...':'Анализирую решения...'):(en?'Get AI analysis':'Получить разбор AI')}</button>}{error&&<p>{error}</p>}</section>;
}
