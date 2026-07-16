import { useState } from 'react';
import { varChallenges, varDecisionLabels, type VarDecision } from '../lib/varChallenges';

type Props = { onBack: () => void };

export function VarChallenge({ onBack }: Props) {
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState<VarDecision|null>(null);
  const [score,setScore]=useState(0);
  const [finished,setFinished]=useState(false);
  const challenge=varChallenges[index];
  const decisions=Object.keys(varDecisionLabels) as VarDecision[];

  const choose=(decision:VarDecision)=>{
    if(selected)return;
    setSelected(decision);
    if(decision===challenge.decision)setScore((value)=>value+1);
  };
  const next=()=>{
    if(index===varChallenges.length-1){setFinished(true);return;}
    setIndex((value)=>value+1);setSelected(null);
  };
  const restart=()=>{setIndex(0);setSelected(null);setScore(0);setFinished(false)};

  if(finished)return <section className="var-finish"><div>📺</div><span className="step-label">ПРОВЕРКА ЗАВЕРШЕНА</span><h1>{score>=6?'Решение подтверждено':'Нужен повтор'}</h1><strong>{score}<small>из {varChallenges.length}</small></strong><p>{score>=6?'Ты отлично читаешь спорные игровые эпизоды.':'Посмотри объяснения и попробуй ещё раз — точность придёт с практикой.'}</p><button className="play-button" onClick={restart}>Пройти снова</button><button className="game-back" onClick={onBack}>← К списку игр</button></section>;

  return <section className="var-game"><button className="game-back" onClick={onBack}>← Все игры</button><header className="var-heading"><div><div className="eyebrow"><span/> Судейский тренажёр</div><h1>VAR Challenge</h1></div><strong>{score} / {index+1}</strong></header><div className="var-progress"><i style={{width:`${((index+1)/varChallenges.length)*100}%`}}/></div><div className="var-layout"><div className={`var-scene var-scene--${challenge.scene}`}><div className="var-screen-label">VAR · REPLAY</div><div className="var-box"/><div className="var-goal"/><span className="var-attacker">9</span><span className="var-defender">4</span><span className="var-ball">●</span>{challenge.scene==='offside'&&<i className="var-line"/>}</div><article className="var-panel"><div className="var-meta"><span>{challenge.difficulty}</span><strong>{index+1} / {varChallenges.length}</strong></div><h2>{challenge.title}</h2><p>{challenge.description}</p><div className="var-decisions">{decisions.map((decision)=>{const state=selected?(decision===challenge.decision?'correct':decision===selected?'wrong':''):'';return <button className={state} onClick={()=>choose(decision)} key={decision}>{varDecisionLabels[decision]}</button>})}</div>{selected&&<div className="var-verdict"><strong>{selected===challenge.decision?'Решение верное ✓':'Решение изменено VAR'}</strong><p>{challenge.explanation}</p><button onClick={next}>{index===varChallenges.length-1?'Результат':'Следующий эпизод'} →</button></div>}</article></div></section>;
}
