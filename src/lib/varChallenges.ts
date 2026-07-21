export type VarDecision = 'goal' | 'offside' | 'penalty' | 'no-foul';

export type VarChallenge = {
  title: string;
  description: string;
  difficulty: string;
  decision: VarDecision;
  explanation: string;
  scene: 'offside' | 'box' | 'goal' | 'tackle';
};

export const varDecisionLabels: Record<VarDecision, string> = {
  goal: '⚽ Засчитать гол',
  offside: '🚩 Офсайд',
  penalty: '👉 Пенальти',
  'no-foul': '▶ Продолжить игру',
};

export const varDecisionLabelsEn: Record<VarDecision, string> = {
  goal: '⚽ Award goal', offside: '🚩 Offside', penalty: '👉 Penalty', 'no-foul': '▶ Play on',
};

export const varChallenges: VarChallenge[] = [
  { title:'Ранний забег', description:'Нападающий оказался ближе к воротам, чем мяч и предпоследний защитник, в момент паса.', difficulty:'Легко', decision:'offside', scene:'offside', explanation:'Офсайд фиксируется в момент передачи. Нападающий уже находился за линией предпоследнего защитника.' },
  { title:'Чистый подкат', description:'Защитник в штрафной сначала выбил мяч, а затем по инерции коснулся ноги соперника.', difficulty:'Легко', decision:'no-foul', scene:'tackle', explanation:'Защитник первым сыграл в мяч, а последующий контакт был естественным и неосторожным не являлся.' },
  { title:'Удар в руку', description:'После удара мяч попал в широко отставленную руку защитника и изменил направление.', difficulty:'Средне', decision:'penalty', scene:'box', explanation:'Рука увеличила площадь тела и находилась в неестественном положении — это основание для пенальти.' },
  { title:'На одной линии', description:'В момент передачи плечо нападающего находится на одной линии с предпоследним защитником.', difficulty:'Средне', decision:'goal', scene:'offside', explanation:'Положение на одной линии разрешено. После забитого мяча гол следует засчитать.' },
  { title:'Пассивный офсайд', description:'Игрок в офсайде не касается мяча и не мешает вратарю. Гол забивает другой игрок.', difficulty:'Средне', decision:'goal', scene:'goal', explanation:'Само положение вне игры не является нарушением. Игрок не участвовал в эпизоде и не мешал сопернику.' },
  { title:'Контакт после удара', description:'Нападающий пробил, затем вратарь поздно врезался в него и не коснулся мяча.', difficulty:'Сложно', decision:'penalty', scene:'box', explanation:'Даже после удара безрассудный поздний контакт в штрафной остаётся нарушением и наказывается пенальти.' },
  { title:'Рикошет от защитника', description:'Пас идёт игроку в офсайде, но защитник лишь случайно касается мяча при попытке блока.', difficulty:'Сложно', decision:'offside', scene:'offside', explanation:'Случайный рикошет не считается осознанной игрой защитника и не отменяет первоначальный офсайд.' },
  { title:'Борьба плечом', description:'Два игрока бегут рядом. Защитник прижимается плечом без толчка руками, нападающий падает.', difficulty:'Сложно', decision:'no-foul', scene:'tackle', explanation:'Разрешённая борьба плечом в плечо без толчка, подножки или чрезмерной силы — игра продолжается.' },
];

export const varChallengesEn: VarChallenge[] = [
  {title:'Early run',description:'At the pass, the attacker is nearer the goal than both the ball and the second-last defender.',difficulty:'Easy',decision:'offside',scene:'offside',explanation:'Offside is judged when the pass is played. The attacker was already beyond the line.'},
  {title:'Clean tackle',description:'The defender wins the ball first, then makes natural contact with the attacker.',difficulty:'Easy',decision:'no-foul',scene:'tackle',explanation:'The defender played the ball first and the follow-through was not careless.'},
  {title:'Handball',description:'The shot hits a defender’s raised arm and changes direction.',difficulty:'Medium',decision:'penalty',scene:'box',explanation:'The arm made the body unnaturally bigger, so a penalty is awarded.'},
  {title:'Level',description:'At the pass, the attacker’s shoulder is level with the second-last defender.',difficulty:'Medium',decision:'goal',scene:'offside',explanation:'Being level is allowed. The goal stands.'},
  {title:'Passive offside',description:'The offside player neither touches the ball nor blocks the goalkeeper. A teammate scores.',difficulty:'Medium',decision:'goal',scene:'goal',explanation:'An offside position alone is not an offence. The player did not affect play.'},
  {title:'Late contact',description:'The striker shoots, then the goalkeeper arrives late without touching the ball.',difficulty:'Hard',decision:'penalty',scene:'box',explanation:'A reckless late challenge in the box remains a foul after the shot.'},
  {title:'Deflection',description:'A pass targets an offside player and only glances off a defender attempting a block.',difficulty:'Hard',decision:'offside',scene:'offside',explanation:'A deflection is not a deliberate play and does not reset offside.'},
  {title:'Shoulder challenge',description:'The defender uses a fair shoulder challenge without pushing, and the attacker falls.',difficulty:'Hard',decision:'no-foul',scene:'tackle',explanation:'A fair shoulder-to-shoulder challenge uses no push, trip or excessive force.'},
];
