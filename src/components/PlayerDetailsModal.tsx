import { playerDetails, type PlayerCard } from '../lib/footballWorld';
import { localizePlayerCard, localizePlayerDetails } from '../lib/footballWorldTranslations';

type Props = { card: PlayerCard; language:'ru'|'en'; onClose: () => void };
const getAge = (birthDate: string) => {
  const today = new Date(); const birth = new Date(birthDate); let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return age;
};

export function PlayerDetailsModal({ card, language, onClose }: Props) {
  const en=language==='en';
  const details=localizePlayerDetails(playerDetails[card.name],language);
  const text=localizePlayerCard(card,language);
  return (
    <div className="player-modal-backdrop" onClick={onClose} role="presentation">
      <section className="player-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${en?'Player information':'Информация об игроке'} ${text.name}`}>
        <button className="modal-close" onClick={onClose} aria-label={en?'Close':'Закрыть'}>×</button>
        <div className="modal-player"><img src={card.photo} alt={text.name}/><div><span>{card.position} · {card.rating} IQ</span><h2>{text.name}</h2><p>{text.country}</p></div></div>
        <div className="detail-grid"><div><span>{en?'Club':'Клуб'}</span><strong>{details.club}</strong></div><div><span>{en?'Age':'Возраст'}</span><strong>{getAge(details.birthDate)} {en?'years':'лет'}</strong></div><div><span>{en?'National team':'Сборная'}</span><strong>{details.nationalTeam}</strong></div><div><span>{en?'Height':'Рост'}</span><strong>{details.height}</strong></div><div><span>{en?'Preferred foot':'Рабочая нога'}</span><strong>{details.foot}</strong></div><div><span>{en?'Goals':'Голы'}</span><strong>{card.stats[0].value} {en?'in tournament':'на турнире'}</strong></div></div>
        <div className="style-note"><span>⚡ {en?'Playing style':'Стиль игрока'}</span><p>{details.style}</p></div>
      </section>
    </div>
  );
}
