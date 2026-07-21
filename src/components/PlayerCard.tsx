import type { PlayerCard as PlayerCardData } from '../lib/footballWorld';
import { localizePlayerCard } from '../lib/footballWorldTranslations';

export function PlayerCard({ card, language, onClick }: { card: PlayerCardData; language:'ru'|'en'; onClick: () => void }) {
  const text=localizePlayerCard(card,language);
  return (
    <button className="player-card" onClick={onClick} aria-label={`${language==='en'?'Details':'Подробнее'}: ${text.name}`}>
      <div className="player-card__top"><div className="card-rating"><strong>{card.rating}</strong><span>{card.position}</span></div><div className="card-portrait" style={{ '--accent': card.accent } as React.CSSProperties}><img src={card.photo} alt={card.name} /></div></div>
      <div className="card-name">{text.name}</div>
      <div className="card-stats">{text.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
      <div className="card-country"><span>{text.country}</span><strong>◆ FM</strong></div>
      <p>{text.note}</p>
      <span className="card-more">{language==='en'?'Tap for details':'Нажми, чтобы узнать больше'} →</span>
    </button>
  );
}
