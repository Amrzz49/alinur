import { AiCoachAnalysis } from './AiCoachAnalysis';
import type { TrainingDecision } from '../lib/aiCoach';

type Props = { score: number; total: number; decisions:TrainingDecision[]; onRestart: () => void };

export function GameComplete({ score, total, decisions, onRestart }: Props) {
  const percent = Math.round((score / total) * 100);
  return (
    <section className="complete-screen">
      <div className="trophy">🏆</div>
      <span className="step-label">ТРЕНИРОВКА ЗАВЕРШЕНА</span>
      <h1>Отличная работа!</h1>
      <p>Ты прошёл путь от простых пасов до сложных тактических решений.</p>
      <div className="final-score"><strong>{score} / {total}</strong><span>правильных решений · {percent}%</span></div>
      <AiCoachAnalysis decisions={decisions} score={score} total={total}/>
      <button className="next-button" onClick={onRestart}>Пройти ещё раз <span>↻</span></button>
    </section>
  );
}
