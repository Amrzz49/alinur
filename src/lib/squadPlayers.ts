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
import alisson from '../assets/players/alisson.jpg';
import bastoni from '../assets/players/bastoni.jpg';
import dias from '../assets/players/dias.jpg';
import neuer from '../assets/players/neuer.jpg';
import oblak from '../assets/players/oblak.jpg';
import odegaard from '../assets/players/odegaard.jpg';
import palmer from '../assets/players/palmer.jpg';
import raya from '../assets/players/raya.jpg';
import rice from '../assets/players/rice.jpg';
import rudiger from '../assets/players/rudiger.jpg';
import saliba from '../assets/players/saliba.jpg';
import theo from '../assets/players/theo.jpg';
import valverde from '../assets/players/valverde.jpg';
import vinicius from '../assets/players/vinicius.jpg';
import yamal from '../assets/players/yamal.jpg';

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
  {id:17,name:'Алиссон',position:'GK',rating:89,country:'🇧🇷',club:'Liverpool',photo:alisson,initials:'AB'},
  {id:18,name:'Я. Облак',position:'GK',rating:88,country:'🇸🇮',club:'Atlético',photo:oblak,initials:'JO'},
  {id:19,name:'Д. Райя',position:'GK',rating:87,country:'🇪🇸',club:'Arsenal',photo:raya,initials:'DR'},
  {id:20,name:'М. Нойер',position:'GK',rating:88,country:'🇩🇪',club:'Bayern',photo:neuer,initials:'MN'},
  {id:21,name:'У. Салиба',position:'DEF',rating:89,country:'🇫🇷',club:'Arsenal',photo:saliba,initials:'WS'},
  {id:22,name:'А. Бастони',position:'DEF',rating:88,country:'🇮🇹',club:'Inter',photo:bastoni,initials:'AB'},
  {id:23,name:'А. Рюдигер',position:'DEF',rating:88,country:'🇩🇪',club:'Real Madrid',photo:rudiger,initials:'AR'},
  {id:24,name:'Р. Диаш',position:'DEF',rating:89,country:'🇵🇹',club:'Man City',photo:dias,initials:'RD'},
  {id:25,name:'Т. Эрнандес',position:'DEF',rating:87,country:'🇫🇷',club:'Milan',photo:theo,initials:'TH'},
  {id:26,name:'Ф. Вальверде',position:'MID',rating:90,country:'🇺🇾',club:'Real Madrid',photo:valverde,initials:'FV'},
  {id:27,name:'К. Палмер',position:'MID',rating:89,country:'🏴',club:'Chelsea',photo:palmer,initials:'CP'},
  {id:28,name:'М. Эдегор',position:'MID',rating:89,country:'🇳🇴',club:'Arsenal',photo:odegaard,initials:'MO'},
  {id:29,name:'Д. Райс',position:'MID',rating:88,country:'🏴',club:'Arsenal',photo:rice,initials:'DR'},
  {id:30,name:'Винисиус',position:'ATT',rating:94,country:'🇧🇷',club:'Real Madrid',photo:vinicius,initials:'VJ'},
  {id:31,name:'Л. Ямаль',position:'ATT',rating:92,country:'🇪🇸',club:'Barcelona',photo:yamal,initials:'LY'},
];

export type DuelStat='attack'|'control'|'defence';
export const playerStats=(player:SquadPlayer):Record<DuelStat,number>=>{
  const bonus:Record<SquadPosition,Record<DuelStat,number>>={
    GK:{attack:-15,control:-5,defence:5},DEF:{attack:-7,control:0,defence:4},
    MID:{attack:0,control:4,defence:0},ATT:{attack:5,control:2,defence:-8},
  };
  const offset=(player.id%5)-2;
  return {attack:player.rating+bonus[player.position].attack+offset,control:player.rating+bonus[player.position].control-offset,defence:player.rating+bonus[player.position].defence};
};
