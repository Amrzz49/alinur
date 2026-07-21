import { useState } from 'react';
import { varChallenges, varChallengesEn, varDecisionLabels, varDecisionLabelsEn, type VarDecision } from '../lib/varChallenges';

type Props = { language: 'ru'|'en'; onBack: () => void; onComplete?: () => void };

export function VarChallenge({ language, onBack, onComplete }: Props) {
  const en=language==='en';
  const challenges=en?varChallengesEn:varChallenges;
  const decisionLabels=en?varDecisionLabelsEn:varDecisionLabels;
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState<VarDecision|null>(null);
  const [score,setScore]=useState(0);
  const [finished,setFinished]=useState(false);
  const challenge=challenges[index];
  const decisions=Object.keys(varDecisionLabels) as VarDecision[];

  const choose=(decision:VarDecision)=>{
    if(selected)return;
    setSelected(decision);
    if(decision===challenge.decision)setScore((value)=>value+1);
  };
  const next=()=>{
    if(index===challenges.length-1){onComplete?.();setFinished(true);return;}
    setIndex((value)=>value+1);setSelected(null);
  };
  const restart=()=>{setIndex(0);setSelected(null);setScore(0);setFinished(false)};

  if(finished)return <section className="var-finish"><div>📺</div><span className="step-label">{en?'REVIEW COMPLETE':'ПРОВЕРКА ЗАВЕРШЕНА'}</span><h1>{score>=6?(en?'Decision confirmed':'Решение подтверждено'):(en?'Review required':'Нужен повтор')}</h1><strong>{score}<small>{en?'of':'из'} {challenges.length}</small></strong><p>{score>=6?(en?'You read difficult incidents brilliantly.':'Ты отлично читаешь спорные игровые эпизоды.'):(en?'Review the explanations and try again.':'Посмотри объяснения и попробуй ещё раз — точность придёт с практикой.')}</p><button className="play-button" onClick={restart}>{en?'Try again':'Пройти снова'}</button><button className="game-back" onClick={onBack}>← {en?'All games':'К списку игр'}</button></section>;

  return <section className="var-game"><button className="game-back" onClick={onBack}>← {en?'All games':'Все игры'}</button><header className="var-heading"><div><div className="eyebrow"><span/> {en?'Referee trainer':'Судейский тренажёр'}</div><h1>VAR Challenge</h1></div><strong>{score} / {index+1}</strong></header><div className="var-progress"><i style={{width:`${((index+1)/challenges.length)*100}%`}}/></div><div className="var-layout"><div className={`var-scene var-scene--${challenge.scene}`}><div className="var-screen-label">VAR · REPLAY</div><div className="var-box"/><div className="var-goal"/><span className="var-attacker">9</span><span className="var-defender">4</span><span className="var-ball">●</span>{challenge.scene==='offside'&&<i className="var-line"/>}</div><article className="var-panel"><div className="var-meta"><span>{challenge.difficulty}</span><strong>{index+1} / {challenges.length}</strong></div><h2>{challenge.title}</h2><p>{challenge.description}</p><div className="var-decisions">{decisions.map((decision)=>{const state=selected?(decision===challenge.decision?'correct':decision===selected?'wrong':''):'';return <button className={state} onClick={()=>choose(decision)} key={decision}>{decisionLabels[decision]}</button>})}</div>{selected&&<div className="var-verdict"><strong>{selected===challenge.decision?(en?'Correct decision ✓':'Решение верное ✓'):(en?'Decision overturned by VAR':'Решение изменено VAR')}</strong><p>{challenge.explanation}</p><button onClick={next}>{index===challenges.length-1?(en?'Results':'Результат'):(en?'Next incident':'Следующий эпизод')} →</button></div>}</article></div></section>;
}
