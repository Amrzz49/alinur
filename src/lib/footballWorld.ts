import alvarezPhoto from '../assets/players/alvarez.jpg';
import haalandPhoto from '../assets/players/haaland.jpg';
import kanePhoto from '../assets/players/kane.jpg';
import kvaraPhoto from '../assets/players/kvaratskhelia.png';
import mbappePhoto from '../assets/players/mbappe.jpg';
import messiPhoto from '../assets/players/messi.jpg';
import barcelonaLogo from '../assets/clubs/barcelona.svg';
import liverpoolLogo from '../assets/clubs/liverpool.svg';
import psgLogo from '../assets/clubs/psg.svg';
import realMadridLogo from '../assets/clubs/real-madrid.png';

export type WorldItem = { name: string; meta: string; fact: string; mark: string; color: string; logo?: string };
export type PlayerCard = { name: string; shortName: string; photo: string; country: string; position: string; rating: number; accent: string; stats: { label: string; value: number }[]; note: string };
export type PlayerDetails = { birthDate: string; club: string; nationalTeam: string; foot: string; height: string; style: string };

export const playerDetails: Record<string, PlayerDetails> = {
  'Килиан Мбаппе': { birthDate:'1998-12-20',club:'Real Madrid',nationalTeam:'Франция',foot:'Правая',height:'178 см',style:'Взрывная скорость, рывки за спину и точное завершение атак.' },
  'Лионель Месси': { birthDate:'1987-06-24',club:'Inter Miami',nationalTeam:'Аргентина',foot:'Левая',height:'170 см',style:'Контроль мяча, видение поля и передачи между линиями.' },
  'Эрлинг Холанд': { birthDate:'2000-07-21',club:'Manchester City',nationalTeam:'Норвегия',foot:'Левая',height:'195 см',style:'Мощные рывки, выбор позиции и игра в штрафной площади.' },
  'Харри Кейн': { birthDate:'1993-07-28',club:'Bayern München',nationalTeam:'Англия',foot:'Правая',height:'188 см',style:'Завершение атак, дальние передачи и умное движение без мяча.' },
  'Хвича Кварацхелия': { birthDate:'2001-02-12',club:'Paris Saint-Germain',nationalTeam:'Грузия',foot:'Правая',height:'183 см',style:'Дриблинг один в один, смена направления и удары с фланга.' },
  'Хулиан Альварес': { birthDate:'2000-01-31',club:'Atlético de Madrid',nationalTeam:'Аргентина',foot:'Правая',height:'170 см',style:'Интенсивный прессинг, движение между линиями и быстрые удары.' },
};

export const players: WorldItem[] = [
  { name: 'Усман Дембеле', meta: 'Франция · Paris Saint-Germain', fact: 'The Best FIFA 2025', mark: 'OD', color: '#385b9d', logo: psgLogo },
  { name: 'Айтана Бонмати', meta: 'Испания · FC Barcelona', fact: '3× подряд The Best FIFA', mark: 'AB', color: '#8b3652', logo: barcelonaLogo },
  { name: 'Ламин Ямаль', meta: 'Испания · FC Barcelona', fact: '2-е место The Best FIFA 2025', mark: 'LY', color: '#76579b', logo: barcelonaLogo },
  { name: 'Килиан Мбаппе', meta: 'Франция · Real Madrid', fact: '3-е место The Best FIFA 2025', mark: 'KM', color: '#33466c', logo: realMadridLogo },
];

export const clubs: WorldItem[] = [
  { name: 'Paris Saint-Germain', meta: 'Франция · Париж', fact: 'Победитель Лиги чемпионов 2025', mark: 'PSG', color: '#17366d', logo: psgLogo },
  { name: 'Real Madrid', meta: 'Испания · Мадрид', fact: 'Рекордсмен Лиги чемпионов', mark: 'RM', color: '#a88945', logo: realMadridLogo },
  { name: 'FC Barcelona', meta: 'Испания · Барселона', fact: 'Контроль мяча и школа La Masia', mark: 'FCB', color: '#7a2847', logo: barcelonaLogo },
  { name: 'Liverpool', meta: 'Англия · Ливерпуль', fact: 'Интенсивность и быстрый прессинг', mark: 'LFC', color: '#a52b31', logo: liverpoolLogo },
];

export const coaches: WorldItem[] = [
  { name: 'Луис Энрике', meta: 'Испания · PSG', fact: 'The Best FIFA Coach 2025', mark: 'LE', color: '#345b8d' },
  { name: 'Ханси Флик', meta: 'Германия · Barcelona', fact: 'Финалист The Best FIFA 2025', mark: 'HF', color: '#7c3e50' },
  { name: 'Арне Слот', meta: 'Нидерланды · Liverpool', fact: 'Финалист The Best FIFA 2025', mark: 'AS', color: '#8e3438' },
];

export const worldCupCards: PlayerCard[] = [
  { name:'Килиан Мбаппе',shortName:'MB',photo:mbappePhoto,country:'🇫🇷 Франция',position:'ST',rating:96,accent:'#275ed8',note:'8 голов · 3 передачи',stats:[{label:'ГОЛ',value:8},{label:'ПАС',value:3},{label:'УД',value:30},{label:'МАТ',value:6}] },
  { name:'Лионель Месси',shortName:'LM',photo:messiPhoto,country:'🇦🇷 Аргентина',position:'RW',rating:95,accent:'#66aee8',note:'8 голов · 2 передачи',stats:[{label:'ГОЛ',value:8},{label:'ПАС',value:2},{label:'УД',value:29},{label:'МАТ',value:6}] },
  { name:'Эрлинг Холанд',shortName:'EH',photo:haalandPhoto,country:'🇳🇴 Норвегия',position:'ST',rating:93,accent:'#c44146',note:'7 голов на ЧМ-2026',stats:[{label:'ГОЛ',value:7},{label:'ПАС',value:0},{label:'IQ',value:91},{label:'МАТ',value:6}] },
  { name:'Харри Кейн',shortName:'HK',photo:kanePhoto,country:'🏴 Англия',position:'ST',rating:92,accent:'#304a8c',note:'6 голов · 1 передача',stats:[{label:'ГОЛ',value:6},{label:'ПАС',value:1},{label:'IQ',value:94},{label:'МАТ',value:6}] },
];

export const seasonCards: PlayerCard[] = [
  { name:'Хвича Кварацхелия',shortName:'KK',photo:kvaraPhoto,country:'🇬🇪 Грузия · PSG',position:'LW',rating:96,accent:'#233f92',note:'Игрок сезона ЛЧ',stats:[{label:'ГОЛ',value:10},{label:'ПАС',value:6},{label:'СКР',value:34},{label:'МАТ',value:16}] },
  { name:'Килиан Мбаппе',shortName:'KM',photo:mbappePhoto,country:'🇫🇷 Real Madrid',position:'ST',rating:95,accent:'#6a75c6',note:'Лучший бомбардир ЛЧ',stats:[{label:'ГОЛ',value:15},{label:'ПАС',value:2},{label:'IQ',value:94},{label:'МАТ',value:11}] },
  { name:'Харри Кейн',shortName:'HK',photo:kanePhoto,country:'🏴 Bayern',position:'ST',rating:94,accent:'#bc2f3b',note:'14 голов в ЛЧ',stats:[{label:'ГОЛ',value:14},{label:'ПАС',value:2},{label:'IQ',value:93},{label:'МАТ',value:14}] },
  { name:'Хулиан Альварес',shortName:'JA',photo:alvarezPhoto,country:'🇦🇷 Atlético',position:'ST',rating:91,accent:'#c7434f',note:'10 голов в ЛЧ',stats:[{label:'ГОЛ',value:10},{label:'ПАС',value:3},{label:'IQ',value:91},{label:'МАТ',value:13}] },
];
