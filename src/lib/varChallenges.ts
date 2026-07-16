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
