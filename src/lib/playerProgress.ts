import { supabase } from './supabase';
import type { TrainingDecision } from './aiCoach';

export type Skills={vision:number;passing:number;shooting:number;dribbling:number};
export type DailyTasks={training:number;games:number;wins:number};
export type PlayerProgress={xp:number;skills:Skills;dailyTasks:DailyTasks};
export type Activity='training'|'game'|'match_win';

const defaults:PlayerProgress={xp:0,skills:{vision:10,passing:10,shooting:10,dribbling:10},dailyTasks:{training:0,games:0,wins:0}};

export async function loadPlayerProgress():Promise<PlayerProgress|null>{
  const {data:auth}=await supabase.auth.getUser();if(!auth.user)return null;
  const {data,error}=await supabase.from('game_profiles').select('xp,skills,daily_tasks,daily_task_date').eq('user_id',auth.user.id).single();
  if(error)throw error;
  const tasks=data.daily_task_date===new Date().toISOString().slice(0,10)?data.daily_tasks:defaults.dailyTasks;
  return {xp:data.xp,skills:data.skills as Skills,dailyTasks:tasks as DailyTasks};
}

export async function recordActivity(activity:Activity,skillChanges:Partial<Skills>={}):Promise<PlayerProgress>{
  const {data,error}=await supabase.rpc('record_player_activity',{activity,skill_changes:skillChanges});
  if(error)throw error;const result=data?.[0];if(!result)throw new Error('Прогресс не сохранился.');
  return {xp:result.xp,skills:result.skills as Skills,dailyTasks:result.daily_tasks as DailyTasks};
}

export function trainingSkillChanges(decisions:TrainingDecision[]):Partial<Skills>{
  const correct=decisions.filter((item)=>item.selected===item.correct);
  return {vision:Math.max(1,Math.round(correct.length/3)),passing:correct.filter((item)=>item.correct==='left'||item.correct==='right').length,shooting:correct.filter((item)=>item.correct==='shot').length,dribbling:correct.filter((item)=>item.correct==='dribble').length};
}

export {defaults as defaultProgress};
