import type { Challenge, ChoiceId } from '../lib/challenges';

type Props = { challenge: Challenge; selectedChoice: ChoiceId | null };

export function FootballField({ challenge, selectedChoice }: Props) {
  const you = challenge.players.find((player) => player.isYou)!;
  const isCorrect = selectedChoice === challenge.correctChoice;
  const target = isCorrect ? challenge.ballTarget : { x: you.x, y: you.y };
  const line = `M ${you.x} ${you.y} L ${challenge.ballTarget.x} ${challenge.ballTarget.y}`;

  return (
    <div className={`pitch ${selectedChoice ? 'pitch--answered' : ''}`}>
      <div className="pitch__shine" />
      <div className="pitch__halfway" /><div className="pitch__circle" />
      <div className="pitch__box pitch__box--left" /><div className="pitch__box pitch__box--right" />
      <div className="pitch__goal pitch__goal--left" /><div className="pitch__goal pitch__goal--right" />
      {challenge.players.map((player, index) => (
        <div className={`player player--${player.team} ${player.isYou ? 'player--you' : ''}`}
          style={{ left: `${player.x}%`, top: `${player.y}%` }} key={`${player.team}-${index}`}>
          <span className="player__number">{index + 2}</span>
          {player.isYou && <span className="player__label">ТЫ</span>}
        </div>
      ))}
      <svg className={`pass-line ${isCorrect ? 'pass-line--show' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={line} /></svg>
      <div className={`football ${isCorrect ? 'football--moving' : ''}`} style={{ left: `${selectedChoice ? target.x : you.x}%`, top: `${selectedChoice ? target.y : you.y + 5}%` }}>⚽</div>
      {!selectedChoice && <div className="scan-pulse" style={{ left: `${challenge.ballTarget.x}%`, top: `${challenge.ballTarget.y}%` }} />}
    </div>
  );
}
