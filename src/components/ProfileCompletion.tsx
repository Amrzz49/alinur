import type { PlayerProgress } from '../lib/playerProgress';

export function ProfileCompletion({progress,dailyStreak,language}:{progress:PlayerProgress;dailyStreak:number;language:'ru'|'en'}){
  const en=language==='en';
  const steps=[{done:progress.xp>0,label:en?'Complete your first training':'Пройди первую тренировку'},{done:progress.dailyTasks.games>0,label:en?'Play a mini-game':'Сыграй в мини-игру'},{done:dailyStreak>0,label:en?'Claim your daily reward':'Забери ежедневную награду'}];
  const remaining=steps.filter((step)=>!step.done).length;
  return <section className={`profile-completion ${remaining===0?'complete':''}`}><div><strong>{remaining===0?(en?'Success! Everything is ready to go.':'Готово! Всё настроено и готово к работе.'):(en?`You're ${remaining} ${remaining===1?'step':'steps'} away from completing your profile.`:`Осталось ${remaining} ${remaining===1?'шаг':'шага'}, чтобы заполнить профиль.`)}</strong><span>{3-remaining}/3</span></div><i><em style={{width:`${((3-remaining)/3)*100}%`}}/></i><ul>{steps.map((step)=><li className={step.done?'done':''} key={step.label}>{step.done?'✓':'○'} {step.label}</li>)}</ul></section>;
}
