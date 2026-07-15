import type { PlayerCard as PlayerCardData } from '../lib/footballWorld';

export function PlayerCard({ card, onClick }: { card: PlayerCardData; onClick: () => void }) {
  return (
    <button className="player-card" onClick={onClick} aria-label={`Подробнее: ${card.name}`}>
      <div className="player-card__top"><div className="card-rating"><strong>{card.rating}</strong><span>{card.position}</span></div><div className="card-portrait" style={{ '--accent': card.accent } as React.CSSProperties}><img src={card.photo} alt={card.name} /></div></div>
      <div className="card-name">{card.name}</div>
      <div className="card-stats">{card.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
      <div className="card-country"><span>{card.country}</span><strong>◆ FM</strong></div>
      <p>{card.note}</p>
      <span className="card-more">Нажми, чтобы узнать больше →</span>
    </button>
  );
}
