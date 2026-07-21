export type QuizQuestion = { question: string; answers: string[]; correct: number; explanation: string; category: string };

export const quizQuestions: QuizQuestion[] = [
  { category:'Правила',question:'Сколько игроков одной команды одновременно находится на поле?',answers:['9','10','11','12'],correct:2,explanation:'На поле играет 11 футболистов: вратарь и 10 полевых игроков.' },
  { category:'Тактика',question:'Что лучше сделать, если партнёр свободен, а тебя прессингуют два соперника?',answers:['Держать мяч','Отдать быстрый пас','Бить издалека','Остановиться'],correct:1,explanation:'Быстрый пас выводит мяч из зоны давления и сохраняет атаку.' },
  { category:'Правила',question:'Как называется удар с отметки в 11 метров?',answers:['Аут','Пенальти','Угловой','Свободный'],correct:1,explanation:'Пенальти выполняется с одиннадцатиметровой отметки.' },
  { category:'Позиции',question:'Главная задача центрального защитника — это…',answers:['Подавать угловые','Защищать центр у ворот','Всегда атаковать','Только делать вбрасывания'],correct:1,explanation:'Центральный защитник закрывает опасные зоны и мешает сопернику бить по воротам.' },
  { category:'Техника',question:'Какой частью стопы проще всего выполнить точный короткий пас?',answers:['Внутренней','Пяткой','Носком','Подошвой'],correct:0,explanation:'Внутренняя сторона стопы даёт большую площадь контакта и хороший контроль.' },
  { category:'Тактика',question:'Зачем команда быстро переводит мяч с одного фланга на другой?',answers:['Чтобы потратить время','Чтобы растянуть оборону','Чтобы сменить мяч','Чтобы сделать офсайд'],correct:1,explanation:'Смена фланга заставляет оборону двигаться и открывает свободное пространство.' },
  { category:'Правила',question:'Когда назначается угловой удар?',answers:['Мяч ушёл от нападающего','Мяч ушёл от защитника за линию ворот','Игрок попал в офсайд','Вратарь поймал мяч'],correct:1,explanation:'Угловой назначают, если защитник последним коснулся мяча перед выходом за линию ворот.' },
  { category:'Football IQ',question:'Что важно сделать до получения мяча?',answers:['Закрыть глаза','Осмотреть поле','Поднять руку','Стоять неподвижно'],correct:1,explanation:'Осмотр поля помогает заранее увидеть соперников, партнёров и следующий ход.' },
  { category:'История',question:'Какая сборная выиграла чемпионат мира 2022 года?',answers:['Франция','Бразилия','Аргентина','Хорватия'],correct:2,explanation:'Аргентина победила Францию в финале ЧМ-2022 после серии пенальти.' },
  { category:'Football IQ',question:'Что означает играть «в одно касание»?',answers:['Сразу передать или пробить','Вести мяч долго','Коснуться рукой','Остановить игру'],correct:0,explanation:'Игрок сразу направляет мяч дальше первым касанием, не останавливая его.' },
];

export const quizQuestionsEn:QuizQuestion[]=[
  {category:'Rules',question:'How many players from one team are on the pitch?',answers:['9','10','11','12'],correct:2,explanation:'A team has 11 players: one goalkeeper and ten outfield players.'},
  {category:'Tactics',question:'A teammate is free while two opponents press you. What is best?',answers:['Hold the ball','Play a quick pass','Shoot from distance','Stop'],correct:1,explanation:'A quick pass moves the ball out of pressure and keeps the attack alive.'},
  {category:'Rules',question:'What is a kick from the 11-metre spot called?',answers:['Throw-in','Penalty','Corner','Free kick'],correct:1,explanation:'A penalty is taken from the 11-metre spot.'},
  {category:'Positions',question:'What is a centre-back’s main job?',answers:['Take corners','Protect the centre','Always attack','Only take throw-ins'],correct:1,explanation:'A centre-back protects dangerous areas and blocks shots.'},
  {category:'Technique',question:'Which part of the foot is best for an accurate short pass?',answers:['Inside','Heel','Toe','Sole'],correct:0,explanation:'The inside of the foot gives a large contact area and good control.'},
  {category:'Tactics',question:'Why switch the ball quickly from one wing to the other?',answers:['Waste time','Stretch the defence','Change the ball','Create offside'],correct:1,explanation:'Switching play moves the defence and opens space.'},
  {category:'Rules',question:'When is a corner awarded?',answers:['The attacker puts it out','A defender puts it over the goal line','A player is offside','The goalkeeper catches it'],correct:1,explanation:'A corner is awarded when a defender touches the ball last before it crosses the goal line.'},
  {category:'Football IQ',question:'What should you do before receiving the ball?',answers:['Close your eyes','Scan the pitch','Raise your hand','Stand still'],correct:1,explanation:'Scanning helps you see opponents, teammates and your next move.'},
  {category:'History',question:'Which nation won the 2022 World Cup?',answers:['France','Brazil','Argentina','Croatia'],correct:2,explanation:'Argentina beat France in the final after a penalty shootout.'},
  {category:'Football IQ',question:'What does playing “one touch” mean?',answers:['Pass or shoot immediately','Dribble for a long time','Touch with your hand','Stop play'],correct:0,explanation:'The player redirects the ball with the first touch instead of stopping it.'},
];
