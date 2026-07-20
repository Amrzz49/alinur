import { supabase } from './supabase';

export type CosmeticCategory='ball'|'kit'|'stadium'|'frame';
export type EquippedCosmetics=Record<CosmeticCategory,string>;
export type CosmeticItem={id:string;category:CosmeticCategory;name:string;price:number;preview:string};
export const defaultOwned=['ball_classic','kit_blue','stadium_green','frame_none'];
export const defaultEquipped:EquippedCosmetics={ball:'ball_classic',kit:'kit_blue',stadium:'stadium_green',frame:'frame_none'};
export const cosmetics:CosmeticItem[]=[
  {id:'ball_classic',category:'ball',name:'Классический мяч',price:0,preview:'⚽'},{id:'ball_gold',category:'ball',name:'Золотой мяч',price:80,preview:'●'},{id:'ball_ucl',category:'ball',name:'Звёздный мяч',price:120,preview:'✦'},
  {id:'kit_blue',category:'kit',name:'Синяя форма',price:0,preview:'👕'},{id:'kit_white',category:'kit',name:'Белая форма',price:120,preview:'♙'},{id:'kit_black',category:'kit',name:'Чёрная форма',price:150,preview:'♟'},
  {id:'stadium_green',category:'stadium',name:'Классический стадион',price:0,preview:'▥'},{id:'stadium_night',category:'stadium',name:'Ночной стадион',price:200,preview:'🌙'},{id:'stadium_royal',category:'stadium',name:'Королевская арена',price:250,preview:'🏟'},
  {id:'frame_none',category:'frame',name:'Без рамки',price:0,preview:'○'},{id:'frame_gold',category:'frame',name:'Золотая рамка',price:100,preview:'◎'},{id:'frame_blue',category:'frame',name:'Синяя рамка',price:80,preview:'◉'},
];
type PurchaseResult={coins:number;owned_cosmetics:string[];equipped_cosmetics:EquippedCosmetics};
const purchaseError=(message:string)=>message.includes('Not enough coins')?'Недостаточно монет.':message.includes('Sign in')?'Нужно войти в аккаунт.':'Покупка не удалась. Попробуй ещё раз.';
export async function buyCosmetic(id:string){
  const {data,error}=await supabase.rpc('buy_cosmetic',{item_id:id});
  if(error)throw new Error(purchaseError(error.message));
  const result=data?.[0] as PurchaseResult|undefined;
  if(!result)throw new Error('Покупка не сохранилась. Попробуй ещё раз.');
  return result;
}
export async function equipCosmetic(id:string,category:CosmeticCategory){const {data,error}=await supabase.rpc('equip_cosmetic',{item_id:id,category});if(error)throw error;return data as EquippedCosmetics;}
