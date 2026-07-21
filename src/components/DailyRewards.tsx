const prizes=[25,40,60,80,100,150,250];

type Props={language:'ru'|'en';streak:number;claimedToday:boolean;onClaim:()=>void;loading:boolean};

export function DailyRewards({language,streak,claimedToday,onClaim,loading}:Props){
  const en=language==='en';
  return <section className="daily-rewards"><div><span>{en?'DAILY BONUS':'ЕЖЕДНЕВНЫЙ БОНУС'}</span><strong>{en?`Streak: ${streak} days 🔥`:`Серия: ${streak} дней 🔥`}</strong></div><div className="daily-grid">{prizes.map((prize,index)=>{const day=index+1;const collected=day<=streak;return <article className={collected?'collected':''} key={day}><small>{en?'Day':'День'} {day}</small><b>${prize}</b>{collected&&<i>✓</i>}</article>})}</div><button disabled={claimedToday||loading} onClick={onClaim}>{loading?(en?'Claiming…':'Получаем...'):claimedToday?(en?'Reward claimed ✓':'Приз уже получен ✓'):(en?`Claim $${prizes[streak%7]}`:`Забрать $${prizes[streak%7]}`)}</button></section>;
}
