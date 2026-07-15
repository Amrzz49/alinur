import { useState } from 'react';
import { Goalkeeper } from './Goalkeeper';

type Direction = 'left' | 'center' | 'right';
const directions: { id: Direction; label: string; icon: string }[] = [
  { id: 'left', label: 'Левый угол', icon: '↖' },
  { id: 'center', label: 'По центру', icon: '↑' },
  { id: 'right', label: 'Правый угол', icon: '↗' },
];

const keeperPrediction = (history: Direction[]): Direction => {
  const all: Direction[] = ['left', 'center', 'right'];
  if (history.length >= 2 && Math.random() < .6) {
    return all.reduce((best, item) => history.filter((shot) => shot === item).length > history.filter((shot) => shot === best).length ? item : best);
  }
  return all[Math.floor(Math.random() * all.length)];
};

export function PenaltyMind() {
  const [selected, setSelected] = useState<Direction>('left');
  const [keeper, setKeeper] = useState<Direction | null>(null);
  const [history, setHistory] = useState<Direction[]>([]);
  const [score, setScore] = useState(0); const [round, setRound] = useState(1); const [finished, setFinished] = useState(false);
  const isGoal = keeper !== null && keeper !== selected;
  const shoot = () => { if (keeper) return; const guess = keeperPrediction(history); setKeeper(guess); setHistory((items) => [...items, selected]); if (guess !== selected) setScore((value) => value + 1); };
  const next = () => { if (round === 5) return setFinished(true); setRound((value) => value + 1); setKeeper(null); };
  const restart = () => { setSelected('left'); setKeeper(null); setHistory([]); setScore(0); setRound(1); setFinished(false); };
  const resultTitle = score >= 4 ? 'Мастер пенальти!' : score >= 2 ? 'Хорошая серия!' : 'Старайся лучше!';
  const resultText = score >= 4 ? 'Ты отлично менял направления и перехитрил вратаря.' : score >= 2 ? 'Неплохой результат. Меняй углы ударов, чтобы стать ещё опаснее.' : 'Вратарь разгадал твои удары. Не повторяй один угол и попробуй ещё раз!';

  if (finished) return <section className="penalty-finish"><div>{score >= 4 ? '🏆' : score >= 2 ? '⚽' : '💪'}</div><span className="step-label">СЕРИЯ ЗАВЕРШЕНА</span><h1>{resultTitle}</h1><strong>{score} <small>/ 5</small></strong><p>{resultText}</p><button className="play-button" onClick={restart}>Сыграть ещё раз ↻</button></section>;

  return <section className="penalty-screen">
    <div className="penalty-heading"><div><div className="eyebrow"><span /> Мини-игра</div><h1>Penalty Mind</h1><p>Выбери угол и перехитри вратаря. Не бей постоянно в одно место!</p></div><div className="penalty-score"><span>Голы</span><strong>{score}</strong><small>Раунд {round} / 5</small></div></div>
    <div className="penalty-game"><div className="stadium-lights" /><div className="goal"><div className="goal-net" />
      <div className={`keeper ${keeper ? `keeper--${keeper}` : ''}`}><Goalkeeper /></div>
      <div className={`shot-ball ${keeper ? `shot-ball--${selected}` : ''}`}>⚽</div>
      {keeper && <div className={`goal-result ${isGoal ? 'result--goal' : 'result--save'}`}>{isGoal ? 'ГОООЛ!' : 'СЕЙВ!'}</div>}
    </div><div className="penalty-spot" /><div className="penalty-controls"><span>Куда бьём?</span><div>{directions.map((direction) => <button className={selected === direction.id ? 'active' : ''} disabled={keeper !== null} onClick={() => setSelected(direction.id)} key={direction.id}><i>{direction.icon}</i>{direction.label}</button>)}</div>{keeper ? <button className="penalty-shoot" onClick={next}>{round === 5 ? 'Результат' : 'Следующий пенальти'} →</button> : <button className="penalty-shoot" onClick={shoot}>Ударить ⚽</button>}</div></div>
  </section>;
}
