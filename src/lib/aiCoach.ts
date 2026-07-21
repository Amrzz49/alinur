import { supabase } from './supabase';
import { choices, type ChoiceId } from './challenges';

export type TrainingDecision = {
  title:string;
  difficulty:string;
  selected:ChoiceId;
  correct:ChoiceId;
};

const choiceName=(id:ChoiceId)=>choices.find((choice)=>choice.id===id)?.label??id;

export async function getAiCoachAnalysis(decisions:TrainingDecision[],score:number,total:number,language:'ru'|'en'='ru'):Promise<string>{
  const details=decisions.map((item,index)=>`${index+1}. ${item.title} (${item.difficulty}): игрок выбрал «${choiceName(item.selected)}», правильный ответ — «${choiceName(item.correct)}».`).join('\n');
  const prompt=`Результат игрока: ${score} из ${total}.\nРешения:\n${details}\n\nДай персональный разбор на ${language==='en'?'английском':'русском'} языке. Формат: 1) Сильная сторона — одно предложение. 2) Главная ошибка — одно предложение. 3) Совет профессионала — одно предложение. 4) Следующее упражнение — одно конкретное короткое задание. Не выдумывай данные, которых нет в списке.`;
  const {data,error}=await supabase.functions.invoke('ai',{body:{prompt,system:`Ты доброжелательный профессиональный футбольный тренер. Отвечай только на ${language==='en'?'английском':'русском'} языке, кратко и понятно.`}});
  if(error)throw new Error('AI-тренер сейчас недоступен. Попробуй немного позже.');
  const response=data as {text?:string;error?:string}|null;
  if(!response?.text)throw new Error(response?.error||'AI-тренер не получил ответ.');
  return response.text;
}

export async function getWeeklyPlayerAdvice(progress:{totalTrainings:number;correctDecisions:number;totalDecisions:number;skills:Record<string,number>}):Promise<string>{
  const accuracy=progress.totalDecisions?Math.round(progress.correctDecisions/progress.totalDecisions*100):0;
  const prompt=`Статистика молодого футболиста: тренировок ${progress.totalTrainings}, точность решений ${accuracy}%, навыки ${JSON.stringify(progress.skills)}. Обратись прямо к игроку и дай один конкретный безопасный совет на следующую неделю: какой навык футбольного мышления улучшить и одно упражнение на 10 минут. Максимум 2 коротких предложения, без медицинских советов.`;
  const {data,error}=await supabase.functions.invoke('ai',{body:{prompt,system:'Ты доброжелательный футбольный тренер для юного игрока. Обращайся на «ты» и отвечай кратко на русском языке.'}});
  const response=data as {text?:string}|null;
  if(error||!response?.text)throw new Error('AI-тренер сейчас недоступен.');
  return response.text;
}
