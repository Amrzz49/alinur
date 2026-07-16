const prizes=[25,40,60,80,100,150,250];

type Props={streak:number;claimedToday:boolean;onClaim:()=>void;loading:boolean};

export function DailyRewards({streak,claimedToday,onClaim,loading}:Props){
  return <section className="daily-rewards"><div><span>ЕЖЕДНЕВНЫЙ БОНУС</span><strong>Серия: {streak} дней 🔥</strong></div><div className="daily-grid">{prizes.map((prize,index)=>{const day=index+1;const collected=day<=streak;return <article className={collected?'collected':''} key={day}><small>День {day}</small><b>${prize}</b>{collected&&<i>✓</i>}</article>})}</div><button disabled={claimedToday||loading} onClick={onClaim}>{loading?'Получаем...':claimedToday?'Приз уже получен ✓':`Забрать $${prizes[streak%7]}`}</button></section>;
}
