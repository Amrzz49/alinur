import { AiCoachAnalysis } from './AiCoachAnalysis';
import type { TrainingDecision } from '../lib/aiCoach';
import type { MistakePatterns } from '../lib/playerProgress';

type Props = { score: number; total: number; decisions:TrainingDecision[]; patterns:MistakePatterns; language:'ru'|'en'; onRestart: () => void };

export function GameComplete({ score, total, decisions, patterns, language, onRestart }: Props) {
  const percent = Math.round((score / total) * 100);
  const en=language==='en';
  return (
    <section className="complete-screen">
      <div className="trophy">🏆</div>
      <span className="step-label">{en?'TRAINING COMPLETE':'ТРЕНИРОВКА ЗАВЕРШЕНА'}</span>
      <h1>{en?'Great work!':'Отличная работа!'}</h1>
      <p>{en?'You progressed from simple passes to difficult tactical decisions.':'Ты прошёл путь от простых пасов до сложных тактических решений.'}</p>
      <div className="final-score"><strong>{score} / {total}</strong><span>{en?'correct decisions':'правильных решений'} · {percent}%</span></div>
      <AiCoachAnalysis decisions={decisions} score={score} total={total} patterns={patterns} language={language}/>
      <button className="next-button" onClick={onRestart}>{en?'Try again':'Пройти ещё раз'} <span>↻</span></button>
    </section>
  );
}
