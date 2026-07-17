import { useState } from 'react';
import { getAiCoachAnalysis, type TrainingDecision } from '../lib/aiCoach';

type Props={decisions:TrainingDecision[];score:number;total:number};

export function AiCoachAnalysis({decisions,score,total}:Props){
  const [analysis,setAnalysis]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const analyze=async()=>{setLoading(true);setError('');try{setAnalysis(await getAiCoachAnalysis(decisions,score,total))}catch(reason){setError(reason instanceof Error?reason.message:'Не удалось получить разбор.')}finally{setLoading(false)}};
  return <section className="ai-coach"><div className="ai-coach__head"><span>AI</span><div><strong>Персональный тренер</strong><small>Gemini разберёт твои решения</small></div></div>{analysis?<div className="ai-coach__answer">{analysis}</div>:<button disabled={loading||decisions.length===0} onClick={analyze}>{loading?'Анализирую решения...':'Получить разбор AI'}</button>}{error&&<p>{error}</p>}</section>;
}
