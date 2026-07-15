import { playerDetails, type PlayerCard } from '../lib/footballWorld';

type Props = { card: PlayerCard; onClose: () => void };
const getAge = (birthDate: string) => {
  const today = new Date(); const birth = new Date(birthDate); let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return age;
};

export function PlayerDetailsModal({ card, onClose }: Props) {
  const details = playerDetails[card.name];
  return (
    <div className="player-modal-backdrop" onClick={onClose} role="presentation">
      <section className="player-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Информация об игроке ${card.name}`}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">×</button>
        <div className="modal-player"><img src={card.photo} alt={card.name}/><div><span>{card.position} · {card.rating} IQ</span><h2>{card.name}</h2><p>{card.country}</p></div></div>
        <div className="detail-grid"><div><span>Клуб</span><strong>{details.club}</strong></div><div><span>Возраст</span><strong>{getAge(details.birthDate)} лет</strong></div><div><span>Сборная</span><strong>{details.nationalTeam}</strong></div><div><span>Рост</span><strong>{details.height}</strong></div><div><span>Рабочая нога</span><strong>{details.foot}</strong></div><div><span>Голы</span><strong>{card.stats[0].value} на турнире</strong></div></div>
        <div className="style-note"><span>⚡ Стиль игрока</span><p>{details.style}</p></div>
      </section>
    </div>
  );
}
