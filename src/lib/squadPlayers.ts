import alvarez from '../assets/players/alvarez.jpg';
import haaland from '../assets/players/haaland.jpg';
import kane from '../assets/players/kane.jpg';
import kvara from '../assets/players/kvaratskhelia.png';
import mbappe from '../assets/players/mbappe.jpg';
import messi from '../assets/players/messi.jpg';
import bellingham from '../assets/players/bellingham.jpg';
import rodri from '../assets/players/rodri.jpg';
import pedri from '../assets/players/pedri.jpg';
import vitinha from '../assets/players/vitinha.jpg';
import vanDijk from '../assets/players/van-dijk.jpg';
import hakimi from '../assets/players/hakimi.jpg';
import nunoMendes from '../assets/players/nuno-mendes.jpg';
import cubarsi from '../assets/players/cubarsi.jpg';
import donnarumma from '../assets/players/donnarumma.jpg';
import courtois from '../assets/players/courtois.jpg';

export type SquadPosition='GK'|'DEF'|'MID'|'ATT';
export type SquadPlayer={id:number;name:string;position:SquadPosition;rating:number;country:string;club:string;photo?:string;initials:string};
export const squadPlayers:SquadPlayer[]=[
  {id:1,name:'К. Мбаппе',position:'ATT',rating:95,country:'🇫🇷',club:'Real Madrid',photo:mbappe,initials:'KM'},
  {id:2,name:'Э. Холанд',position:'ATT',rating:93,country:'🇳🇴',club:'Man City',photo:haaland,initials:'EH'},
  {id:3,name:'Л. Месси',position:'ATT',rating:94,country:'🇦🇷',club:'Inter Miami',photo:messi,initials:'LM'},
  {id:4,name:'Х. Кварацхелия',position:'ATT',rating:92,country:'🇬🇪',club:'PSG',photo:kvara,initials:'KK'},
  {id:5,name:'Х. Кейн',position:'ATT',rating:92,country:'🏴',club:'Bayern',photo:kane,initials:'HK'},
  {id:6,name:'Х. Альварес',position:'ATT',rating:89,country:'🇦🇷',club:'Atlético',photo:alvarez,initials:'JA'},
  {id:7,name:'Дж. Беллингем',position:'MID',rating:91,country:'🏴',club:'Real Madrid',photo:bellingham,initials:'JB'},
  {id:8,name:'Родри',position:'MID',rating:91,country:'🇪🇸',club:'Man City',photo:rodri,initials:'RO'},
  {id:9,name:'Педри',position:'MID',rating:89,country:'🇪🇸',club:'Barcelona',photo:pedri,initials:'PE'},
  {id:10,name:'Витинья',position:'MID',rating:90,country:'🇵🇹',club:'PSG',photo:vitinha,initials:'VI'},
  {id:11,name:'Ван Дейк',position:'DEF',rating:90,country:'🇳🇱',club:'Liverpool',photo:vanDijk,initials:'VD'},
  {id:12,name:'А. Хакими',position:'DEF',rating:89,country:'🇲🇦',club:'PSG',photo:hakimi,initials:'AH'},
  {id:13,name:'Н. Мендеш',position:'DEF',rating:88,country:'🇵🇹',club:'PSG',photo:nunoMendes,initials:'NM'},
  {id:14,name:'П. Кубарси',position:'DEF',rating:86,country:'🇪🇸',club:'Barcelona',photo:cubarsi,initials:'PC'},
  {id:15,name:'Доннарумма',position:'GK',rating:90,country:'🇮🇹',club:'Man City',photo:donnarumma,initials:'GD'},
  {id:16,name:'Т. Куртуа',position:'GK',rating:90,country:'🇧🇪',club:'Real Madrid',photo:courtois,initials:'TC'},
];
