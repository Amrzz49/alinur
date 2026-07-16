type Props = { onMatch:()=>void; onExplore: () => void };

export function HomeScreen({ onMatch, onExplore }: Props) {
  return (
    <section className="home-screen">
      <div className="hero-copy">
        <div className="eyebrow"><span /> Тренируй футбольное мышление</div>
        <h1>Думай быстрее.<br /><em>Играй умнее.</em></h1>
        <p>Принимай решения на 2D-поле, получай разбор каждого хода и учись видеть игру как профессионал.</p>
        <div className="hero-actions"><button className="play-button" onClick={onMatch}>Начать матч <span>→</span></button><button className="explore-button" onClick={onExplore}>Смотреть звёзд</button></div>
        <div className="hero-numbers"><div><strong>12</strong><span>ситуаций</span></div><div><strong>3</strong><span>уровня</span></div><div><strong>4</strong><span>решения</span></div></div>
      </div>
      <div className="hero-board">
        <div className="mini-pitch"><div className="mini-line" /><i className="mini-player blue p1" /><i className="mini-player blue p2" /><i className="mini-player blue p3" /><i className="mini-player red p4" /><i className="mini-player red p5" /><span className="mini-ball">⚽</span><span className="move-arrow">↗</span></div>
        <div className="floating-card"><span>Лучший ход</span><strong>Пас направо</strong><small>+10 Football IQ</small></div>
      </div>
    </section>
  );
}
