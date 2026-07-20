import type { PlayerProgress } from '../lib/playerProgress';

const skillLabels={vision:'Видение поля',passing:'Пас',shooting:'Удар',dribbling:'Дриблинг'};

export function PlayerProgressCard({progress,language='ru',rewardLoading=false,onClaimReward}:{progress:PlayerProgress;language?:'ru'|'en';rewardLoading?:boolean;onClaimReward?:()=>void}){
  const level=Math.floor(progress.xp/500)+1,xpInLevel=progress.xp%500;
  const tasks=[{label:'Пройти тренировку',value:progress.dailyTasks.training,target:1},{label:'Завершить 2 мини-игры',value:progress.dailyTasks.games,target:2},{label:'Выиграть матч',value:progress.dailyTasks.wins,target:1}];
  const isEmpty=progress.xp===0&&Object.values(progress.dailyTasks).every((value)=>value===0);
  const allDone=tasks.every((task)=>task.value>=task.target);
  return <section className="player-progress"><header><div><span>УРОВЕНЬ</span><strong>{level}</strong></div><div><b>{progress.xp} XP</b><i><em style={{width:`${xpInLevel/5}%`}}/></i><small>{xpInLevel} / 500 до нового уровня</small></div></header>{isEmpty&&<div className="progress-empty"><span>⚽</span><strong>{language==='en'?'Nothing here yet—complete your first activity to get started!':'Пока здесь пусто — выполни первое задание, чтобы начать!'}</strong></div>}<h3>Профиль навыков</h3><div className="skill-list">{Object.entries(progress.skills).map(([key,value])=><label key={key}><span>{skillLabels[key as keyof typeof skillLabels]}</span><i><em style={{width:`${value}%`}}/></i><b>{value}</b></label>)}</div><h3>Задания на сегодня</h3><div className="daily-tasks">{tasks.map((task)=>{const done=task.value>=task.target;return <div className={done?'done':''} key={task.label}><i>{done?'✓':'○'}</i><span>{task.label}</span><b>{Math.min(task.value,task.target)}/{task.target}</b></div>})}</div>{allDone&&<button className="task-reward" disabled={progress.dailyRewardClaimed||rewardLoading} onClick={onClaimReward}>{progress.dailyRewardClaimed?(language==='en'?'Reward claimed ✓':'Награда получена ✓'):rewardLoading?(language==='en'?'Claiming…':'Получаем…'):(language==='en'?'Claim $100 reward':'Забрать награду $100')}</button>}</section>;
}
