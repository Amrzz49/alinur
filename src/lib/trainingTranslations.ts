import type { Challenge, ChoiceId } from './challenges';

type Translation=Pick<Challenge,'title'|'situation'|'tip'|'result'|'proTip'>;

const english:Translation[]=[
  {title:'Free teammate',situation:'A teammate is free on the left, while opponents block the way forward.',tip:'Look for the free teammate.',result:'A pass left keeps possession and finds your teammate in space.',proTip:'Before passing, a professional lifts their head and looks for open space.'},
  {title:'Open goal',situation:'You are close to goal. The defenders are behind you and the shooting lane is open.',tip:'Check whether you have a clear path to goal.',result:'Shooting is the best choice: the distance is short and nobody blocks the ball.',proTip:'In a good position, a striker avoids an extra touch and shoots quickly.'},
  {title:'Do not risk it near goal',situation:'An opponent is running straight at you. A defender on the right is ready for a simple pass.',tip:'Choose the safe option near your own goal.',result:'A pass right keeps the ball and moves your team away from dangerous pressure.',proTip:'A defender does not take risks near their own goal when a teammate is free.'},
  {title:'Space to run',situation:'There is open space ahead and the nearest opponent is far away.',tip:'Use the open space in front of you.',result:'Dribbling moves the ball forward before the opponent can close the space.',proTip:'When nobody challenges them, a professional carries the ball forward and draws out a defender.'},
  {title:'Open wing',situation:'The centre is crowded. A teammate on the right is ready to continue the quick attack.',tip:'Do not carry the ball into a crowded area.',result:'A pass right switches play from the crowded centre to the open wing.',proTip:'Strong players change the direction of attack when opponents crowd the centre.'},
  {title:'One versus one',situation:'One defender is ahead, no teammate is free nearby, and there is plenty of space behind them.',tip:'Sometimes you need to attack with confidence.',result:'Dribbling beats the last defender and takes you closer to goal.',proTip:'Before accelerating, a professional changes pace and moves the ball away from the defender’s strong foot.'},
  {title:'Switch the play',situation:'The opponents overloaded the right side. A teammate on the left is unmarked.',tip:'Scan the far side of the pitch.',result:'A diagonal pass left moves the attack into the area with more space.',proTip:'Professionals switch wings quickly to stretch the opponent’s defence.'},
  {title:'Time to shoot',situation:'A defender blocked the pass right, but a shooting lane has opened in front of you.',tip:'Do not miss the short shooting window.',result:'A quick shot uses the moment before defenders can make a block.',proTip:'Dangerous players prepare the shot with their first touch and do not let the defence reset.'},
  {title:'Beat the press',situation:'Two opponents are pressing you. A short passing lane is open on the left.',tip:'Play faster under pressure.',result:'A short pass left gets the team out of pressure with minimal risk.',proTip:'A professional decides where to pass before receiving the ball.'},
  {title:'The final pass',situation:'You are outside the penalty area. A teammate on the right runs behind the defender.',tip:'Watch runs as well as the ball.',result:'A pass right into space creates a one-on-one chance against the goalkeeper.',proTip:'The best pass goes where the teammate will be in a second, not directly to their feet.'},
  {title:'False space',situation:'The player on the right looks free, but an opponent is ready to intercept. The passing lane left is safe.',tip:'Notice opponents positioned between you and your teammate.',result:'A pass left avoids the hidden defender and keeps the attack moving.',proTip:'Before passing, a professional checks both the teammate and the entire passing lane.'},
  {title:'The decisive choice',situation:'Your teammates are covered, the defender is off balance, and the goal is close.',tip:'Watch the defender’s body position.',result:'A sharp dribble into space beats the defender and creates a shooting chance.',proTip:'A professional attacks when the defender’s weight is on the wrong foot.'},
];

export const choiceLabel=(id:ChoiceId,language:'ru'|'en')=>language==='en'?({left:'Pass left',right:'Pass right',dribble:'Dribble',shot:'Shoot'} as const)[id]:({left:'Пас налево',right:'Пас направо',dribble:'Дриблинг',shot:'Удар'} as const)[id];

export function localizeChallenge(challenge:Challenge,index:number,language:'ru'|'en'):Challenge{
  if(language==='ru')return challenge;
  const translation=english[index];
  return {...challenge,...translation,difficulty:challenge.difficulty==='Легко'?'Easy':challenge.difficulty==='Средне'?'Medium':'Hard'} as Challenge;
}
