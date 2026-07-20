import { playerStats, type DuelStat, type SquadPlayer } from '../lib/squadPlayers';

type Props={player:SquadPlayer;selected?:boolean;used?:boolean;stat?:DuelStat;onClick?:()=>void};

export function SquadCard({player,selected,used,stat,onClick}:Props){
  const stats=playerStats(player);
  return <button className={`mad-card ${selected?'selected':''} ${used?'used':''}`} disabled={used} onClick={onClick}>
    <span className="mad-card-rating">{player.rating}<small>{player.position}</small></span>
    {player.photo?<img src={player.photo} alt={player.name}/>:<i>{player.initials}</i>}
    <strong>{player.name}</strong>
    <em>{player.country} · {player.club}</em>
    <div>
      <span className={stat==='attack'?'active':''}><b>{stats.attack}</b> ATK</span>
      <span className={stat==='control'?'active':''}><b>{stats.control}</b> CON</span>
      <span className={stat==='defence'?'active':''}><b>{stats.defence}</b> DEF</span>
    </div>
  </button>;
}
