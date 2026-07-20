export function WelcomeScreen({language,onContinue}:{language:'ru'|'en';onContinue:()=>void}){
  const en=language==='en';
  return <section className="welcome-screen"><div className="welcome-screen__mark">F</div><h1>{en?"Welcome! Let’s get you started in under a minute.":'Добро пожаловать! Давай начнём меньше чем за минуту.'}</h1><button onClick={onContinue}>{en?'Get started':'Начать'} <span>→</span></button></section>;
}
