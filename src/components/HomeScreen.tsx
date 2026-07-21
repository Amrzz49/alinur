type Props = { language:'ru'|'en'; onMatch:()=>void; onDemo:()=>void };

export function HomeScreen({ language, onMatch, onDemo }: Props) {
  const en=language==='en';
  return (
    <section className="home-screen">
      <div className="hero-copy">
        <div className="eyebrow"><span /> {en?'Train your football mind':'Тренируй футбольное мышление'}</div>
        <h1>{en?'Think faster.':'Думай быстрее.'}<br /><em>{en?'Play smarter.':'Играй умнее.'}</em></h1>
        <p>{en?'Make decisions on a 2D pitch, review every move and learn to see the game like a professional.':'Принимай решения на 2D-поле, получай разбор каждого хода и учись видеть игру как профессионал.'}</p>
        <div className="hero-actions"><button className="play-button" onClick={onMatch}>{en?'Start match':'Начать матч'} <span>→</span></button><button className="explore-button" onClick={onDemo}>{en?'3-minute demo':'Демо за 3 минуты'}</button></div>
      </div>
      <div className="hero-board">
        <div className="mini-pitch"><div className="mini-line" /><i className="mini-player blue p1" /><i className="mini-player blue p2" /><i className="mini-player blue p3" /><i className="mini-player red p4" /><i className="mini-player red p5" /><span className="mini-ball">⚽</span><span className="move-arrow">↗</span></div>
        <div className="floating-card"><span>{en?'Best move':'Лучший ход'}</span><strong>{en?'Pass right':'Пас направо'}</strong><small>+10 Football IQ</small></div>
      </div>
    </section>
  );
}
