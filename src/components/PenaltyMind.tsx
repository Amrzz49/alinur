import { useState } from 'react';
import { Goalkeeper } from './Goalkeeper';

type Direction = 'left' | 'center' | 'right';
const allDirections:Direction[]=['left','center','right'];
const directions: { id: Direction; label: string; icon: string }[] = [
  { id: 'left', label: 'Левый угол', icon: '↖' },
  { id: 'center', label: 'По центру', icon: '↑' },
  { id: 'right', label: 'Правый угол', icon: '↗' },
];

const keeperPrediction = (history: Direction[]): Direction => {
  const all = allDirections;
  if (history.length >= 2 && Math.random() < .6) {
    return all.reduce((best, item) => history.filter((shot) => shot === item).length > history.filter((shot) => shot === best).length ? item : best);
  }
  return all[Math.floor(Math.random() * all.length)];
};

export function PenaltyMind({ language='ru',onBack, onComplete }: { language?:'ru'|'en';onBack?: () => void; onComplete?: () => void }) {
  const en=language==='en';
  const [selected, setSelected] = useState<Direction>('left');
  const [keeper, setKeeper] = useState<Direction | null>(null);
  const [keeperRead,setKeeperRead]=useState<Direction>(()=>keeperPrediction([]));
  const [history, setHistory] = useState<Direction[]>([]);
  const [score, setScore] = useState(0); const [round, setRound] = useState(1); const [finished, setFinished] = useState(false);
  const isGoal = keeper !== null && keeper !== selected;
  const shoot = () => { if (keeper) return; const alternatives=allDirections.filter((item)=>item!==keeperRead);const guess=Math.random()<.72?keeperRead:alternatives[Math.floor(Math.random()*alternatives.length)]; setKeeper(guess); setHistory((items) => [...items, selected]); if (guess !== selected) setScore((value) => value + 1); };
  const next = () => { if (round === 5) { onComplete?.(); return setFinished(true); } setRound((value) => value + 1); setKeeper(null);setKeeperRead(keeperPrediction(history)); };
  const restart = () => { setSelected('left'); setKeeper(null);setKeeperRead(keeperPrediction([])); setHistory([]); setScore(0); setRound(1); setFinished(false); };
  const resultTitle = score >= 4 ? (en?'Penalty master!':'Мастер пенальти!') : score >= 2 ? (en?'Good run!':'Хорошая серия!') : (en?'Keep trying!':'Старайся лучше!');
  const resultText = score >= 4 ? (en?'You changed direction well and beat the goalkeeper.':'Ты отлично менял направления и перехитрил вратаря.') : score >= 2 ? (en?'Good result. Keep changing corners.':'Неплохой результат. Меняй углы ударов, чтобы стать ещё опаснее.') : (en?'The goalkeeper read your shots. Vary the corner and try again!':'Вратарь разгадал твои удары. Не повторяй один угол и попробуй ещё раз!');

  if (finished) return <section className="penalty-finish">{onBack&&<button className="game-back" onClick={onBack}>← {en?'All games':'Все игры'}</button>}<div>{score >= 4 ? '🏆' : score >= 2 ? '⚽' : '💪'}</div><span className="step-label">{en?'SERIES COMPLETE':'СЕРИЯ ЗАВЕРШЕНА'}</span><h1>{resultTitle}</h1><strong>{score} <small>/ 5</small></strong><p>{resultText}</p><button className="play-button" onClick={restart}>{en?'Play again':'Сыграть ещё раз'} ↻</button></section>;

  return <section className="penalty-screen">{onBack&&<button className="game-back" onClick={onBack}>← {en?'All games':'Все игры'}</button>}
    <div className="penalty-heading"><div><div className="eyebrow"><span /> {en?'Mini-game':'Мини-игра'}</div><h1>Penalty Mind</h1><p>{en?'Pick a corner and outsmart the goalkeeper.':'Выбери угол и перехитри вратаря.'}</p></div><div className="penalty-score"><span>{en?'Goals':'Голы'}</span><strong>{score}</strong><small>{en?'Round':'Раунд'} {round} / 5</small></div></div>
    <div className="penalty-game"><div className="stadium-lights" /><div className="goal"><div className="goal-net" />
      <div className={`keeper ${keeper ? `keeper--${keeper}` : ''}`}><Goalkeeper /></div>
      <div className={`shot-ball ${keeper ? `shot-ball--${selected}` : ''}`}>⚽</div>
      {keeper && <div className={`goal-result ${isGoal ? 'result--goal' : 'result--save'}`}>{isGoal ? (en?'GOAL!':'ГОООЛ!') : (en?'SAVE!':'СЕЙВ!')}</div>}
    </div><div className="penalty-spot" /><div className="keeper-read">👀 {en?'Keeper leans':'Вратарь смещается'}: <strong>{en?({left:'LEFT',center:'CENTRE',right:'RIGHT'} as const)[keeperRead]:({left:'ВЛЕВО',center:'В ЦЕНТР',right:'ВПРАВО'} as const)[keeperRead]}</strong><small>{en?'He may bluff':'Он может обмануть'}</small></div><div className="penalty-controls"><span>{en?'Where will you shoot?':'Куда бьём?'}</span><div>{directions.map((direction) => <button className={selected === direction.id ? 'active' : ''} disabled={keeper !== null} onClick={() => setSelected(direction.id)} key={direction.id}><i>{direction.icon}</i>{en?({left:'Left corner',center:'Centre',right:'Right corner'} as const)[direction.id]:direction.label}</button>)}</div>{keeper ? <button className="penalty-shoot" onClick={next}>{round === 5 ? (en?'Result':'Результат') : (en?'Next penalty':'Следующий пенальти')} →</button> : <button className="penalty-shoot" onClick={shoot}>{en?'Shoot':'Ударить'} ⚽</button>}</div></div>
  </section>;
}
