import { supabase } from './supabase';
import { choices, type ChoiceId } from './challenges';
import type { MistakePatterns } from './playerProgress';

export type TrainingDecision = {
  title:string;
  difficulty:string;
  selected:ChoiceId;
  correct:ChoiceId;
};

const choiceName=(id:ChoiceId)=>choices.find((choice)=>choice.id===id)?.label??id;
const decisionNames:Record<ChoiceId,{ru:string;en:string}>={left:{ru:'пас налево',en:'left pass'},right:{ru:'пас направо',en:'right pass'},dribble:{ru:'дриблинг',en:'dribbling'},shot:{ru:'удар',en:'shooting'}};
const exercises:Record<ChoiceId,{ru:string;en:string}>={
  left:{ru:'10 минут: перед получением мяча дважды посмотри через левое плечо и найди безопасный пас.',en:'10 minutes: scan over your left shoulder twice before receiving and find a safe pass.'},
  right:{ru:'10 минут: после приёма мяча сначала проверь свободного партнёра справа.',en:'10 minutes: after receiving, check the free teammate on your right first.'},
  dribble:{ru:'10 минут: отмечай момент, когда перед тобой есть пространство для рывка.',en:'10 minutes: identify the moment when space opens for a forward run.'},
  shot:{ru:'10 минут: ищи открытую линию удара и принимай решение за два касания.',en:'10 minutes: find an open shooting lane and decide within two touches.'},
};
const frequentMistake=(patterns:MistakePatterns)=>Object.entries(patterns).sort((a,b)=>b[1]-a[1])[0] as [ChoiceId,number];

export function getFallbackCoachAnalysis(decisions:TrainingDecision[],score:number,total:number,patterns:MistakePatterns,language:'ru'|'en'){
  const en=language==='en',accuracy=total?Math.round(score/total*100):0;
  const [mistake,count]=frequentMistake(patterns);
  const focus={left:0,right:0,dribble:0,shot:0};
  decisions.filter((item)=>item.selected!==item.correct).forEach((item)=>{focus[item.correct]+=1});
  const [nextFocus]=frequentMistake(Object.values(focus).some(Boolean)?focus:patterns);
  return {summary:en?`${accuracy}% correct. You made ${score} good decisions.`:`${accuracy}% точности. Ты принял ${score} верных решений.`,memory:count>0?(en?`Repeated pattern: you missed “${decisionNames[mistake].en}” ${count} times.`:`Повторяющаяся ошибка: ты ${count} раз не заметил решение «${decisionNames[mistake].ru}».`):(en?'No repeated mistakes yet — keep training.':'Повторяющихся ошибок пока нет — продолжай тренироваться.'),exercise:exercises[nextFocus][language]};
}

export async function getAiCoachAnalysis(decisions:TrainingDecision[],score:number,total:number,patterns:MistakePatterns,language:'ru'|'en'='ru'):Promise<string>{
  const details=decisions.map((item,index)=>`${index+1}. ${item.title} (${item.difficulty}): игрок выбрал «${choiceName(item.selected)}», правильный ответ — «${choiceName(item.correct)}».`).join('\n');
  const prompt=`Результат: ${score} из ${total}. История ошибок: ${JSON.stringify(patterns)}.\nРешения:\n${details}\n\nОтветь на ${language==='en'?'английском':'русском'}: ровно 2 коротких простых предложения. Первое — что получилось и какая ошибка повторяется. Второе — одно конкретное упражнение на 10 минут. Не выдумывай данные.`;
  const {data,error}=await supabase.functions.invoke('ai',{body:{prompt,system:`Ты доброжелательный профессиональный футбольный тренер. Отвечай только на ${language==='en'?'английском':'русском'} языке, кратко и понятно.`}});
  if(error)throw new Error('AI-тренер сейчас недоступен. Попробуй немного позже.');
  const response=data as {text?:string;error?:string}|null;
  if(!response?.text)throw new Error(response?.error||'AI-тренер не получил ответ.');
  return response.text;
}

export async function getWeeklyPlayerAdvice(progress:{totalTrainings:number;correctDecisions:number;totalDecisions:number;skills:Record<string,number>},language:'ru'|'en'='ru'):Promise<string>{
  const accuracy=progress.totalDecisions?Math.round(progress.correctDecisions/progress.totalDecisions*100):0;
  const prompt=`Player stats: trainings ${progress.totalTrainings}, decision accuracy ${accuracy}%, skills ${JSON.stringify(progress.skills)}. Address the player directly and give one safe weekly focus plus one 10-minute exercise. Maximum 2 short sentences in ${language==='en'?'English':'Russian'}.`;
  const {data,error}=await supabase.functions.invoke('ai',{body:{prompt,system:`You are a friendly football coach for a young player. Answer briefly in ${language==='en'?'English':'Russian'}.`}});
  const response=data as {text?:string}|null;
  if(error||!response?.text)throw new Error('AI-тренер сейчас недоступен.');
  return response.text;
}
