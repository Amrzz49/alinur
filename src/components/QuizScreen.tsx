import { useState } from 'react';
import { quizQuestions } from '../lib/quizQuestions';

export function QuizScreen() {
  const [index,setIndex]=useState(0); const [selected,setSelected]=useState<number|null>(null); const [score,setScore]=useState(0); const [finished,setFinished]=useState(false);
  const question=quizQuestions[index];
  const choose=(answer:number)=>{ if(selected!==null)return; setSelected(answer); if(answer===question.correct)setScore((value)=>value+1); };
  const next=()=>{ if(index===quizQuestions.length-1)return setFinished(true); setIndex((value)=>value+1); setSelected(null); };
  const restart=()=>{setIndex(0);setSelected(null);setScore(0);setFinished(false)};
  if(finished)return <section className="quiz-finish"><div className="quiz-trophy">🏆</div><span className="step-label">КВИЗ ЗАВЕРШЁН</span><h1>{score>=8?'Отличный Football IQ!':'Хорошая попытка!'}</h1><div className="quiz-final-score">{score}<small>/ {quizQuestions.length}</small></div><p>Ты ответил правильно на {score} из {quizQuestions.length} вопросов.</p><button className="next-button" onClick={restart}>Пройти ещё раз ↻</button></section>;
  return <section className="quiz-screen"><div className="quiz-heading"><div><div className="eyebrow"><span/> Футбольный квиз</div><h1>Проверь свои знания</h1></div><div className="quiz-score">✓ {score}</div></div><div className="quiz-progress"><i style={{width:`${((index+1)/quizQuestions.length)*100}%`}}/></div><div className="quiz-card"><div className="quiz-meta"><span>{question.category}</span><strong>{index+1} / {quizQuestions.length}</strong></div><h2>{question.question}</h2><div className="quiz-answers">{question.answers.map((answer,answerIndex)=>{const state=selected===null?'':answerIndex===question.correct?'correct':answerIndex===selected?'wrong':'';return <button className={state} onClick={()=>choose(answerIndex)} key={answer}><i>{String.fromCharCode(65+answerIndex)}</i>{answer}</button>})}</div>{selected!==null&&<div className={`quiz-explanation ${selected===question.correct?'correct':'wrong'}`}><strong>{selected===question.correct?'Верно!':'Не совсем'}</strong><p>{question.explanation}</p><button onClick={next}>{index===quizQuestions.length-1?'Узнать результат':'Следующий вопрос'} →</button></div>}</div></section>;
}
