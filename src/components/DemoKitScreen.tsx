type Props={language:'ru'|'en';onBack:()=>void};

export function DemoKitScreen({language,onBack}:Props){
  const en=language==='en';
  return <section className="demo-kit">
    <header><button className="game-back" onClick={onBack}>← {en?'Back to demo':'Назад к демо'}</button><div><span>DEMO DAY KIT</span><h1>{en?'Ready for the stage':'Готово к презентации'}</h1></div></header>
    <div className="demo-kit-grid">
      <article className="pitch-slide pitch-slide--problem"><span>01 · {en?'PROBLEM → SOLUTION':'ПРОБЛЕМА → РЕШЕНИЕ'}</span><div><section><small>{en?'PROBLEM':'ПРОБЛЕМА'}</small><h2>{en?'Players train their feet, but rarely train decisions.':'Игроки тренируют ноги, но редко тренируют решения.'}</h2></section><b>→</b><section><small>{en?'SOLUTION':'РЕШЕНИЕ'}</small><h2>{en?'FieldMind turns match situations into short, clear exercises.':'FieldMind превращает игровые ситуации в короткие понятные задания.'}</h2></section></div></article>
      <article className="pitch-slide pitch-slide--business"><span>02 · {en?'AUDIENCE & BUSINESS':'АУДИТОРИЯ И ЗАРАБОТОК'}</span><h2>{en?'Who uses FieldMind?':'Кому нужен FieldMind?'}</h2><div className="audience-list"><b>⚽ {en?'Players':'Игроки'}</b><b>👨‍👩‍👦 {en?'Parents':'Родители'}</b><b>🧠 {en?'Coaches':'Тренеры'}</b><b>🏟 {en?'Academies':'Академии'}</b></div><footer><strong>{en?'Freemium':'Freemium'}</strong><p>{en?'Free basic training. Subscription for personal AI plans, reports and academy tools.':'Базовые тренировки бесплатны. Подписка — за AI-план, отчёты и инструменты академий.'}</p></footer></article>
      <article className="demo-resource"><img src="/demo/fieldmind-qr.svg" alt="FieldMind website QR code"/><div><span>{en?'SCAN TO PLAY':'ОТСКАНИРУЙ И ИГРАЙ'}</span><h2>alinur-amber.vercel.app</h2><p>{en?'The QR code opens the live product.':'QR-код открывает рабочий сайт.'}</p></div></article>
      <article className="demo-resource demo-video"><video controls preload="metadata" poster="/demo/video-poster.png"><source src="/demo/fieldmind-demo.webm" type="video/webm"/></video><div><span>{en?'OFFLINE BACKUP':'ЗАПАСНОЕ ВИДЕО'}</span><h2>{en?'Demo walkthrough':'Прохождение демо'}</h2><p>{en?'Use this if the internet is unstable.':'Используй, если интернет работает плохо.'}</p><a href="/demo/fieldmind-demo.webm" download>{en?'Download video':'Скачать видео'}</a></div></article>
    </div>
  </section>;
}
