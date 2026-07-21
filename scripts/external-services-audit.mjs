import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const env=Object.fromEntries((await readFile('.env.local','utf8')).split(/\r?\n/).filter((line)=>line&&!line.startsWith('#')).map((line)=>{const at=line.indexOf('=');return [line.slice(0,at),line.slice(at+1).replace(/^['"]|['"]$/g,'')]}));
const supabase=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});

const {data:oauth,error:oauthError}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:'https://alinur-amber.vercel.app',skipBrowserRedirect:true}});
if(oauthError||!oauth.url)throw oauthError??new Error('Google OAuth URL was not created.');
const googleUrl=new URL(oauth.url);
if(!googleUrl.hostname.endsWith('.supabase.co'))throw new Error('Unexpected Google OAuth host.');
console.log('Google OAuth redirect: ready.');

const email=`fieldmind.qa.${Date.now()}@example.com`;
const password=`Fm-QA-${crypto.randomUUID()}!`;
const {data:signup,error:signupError}=await supabase.auth.signUp({email,password,options:{data:{name:'FieldMind QA'}}});
if(signupError)throw signupError;
console.log(`Email registration: accepted (${signup.session?'session created':'confirmation required'}).`);

if(signup.session&&signup.user){
  const {error:createError}=await supabase.from('game_profiles').upsert({user_id:signup.user.id},{onConflict:'user_id'});
  if(createError)throw createError;
  const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
  const {error:dateError}=await supabase.from('game_profiles').update({last_daily_reward:yesterday,daily_streak:2}).eq('user_id',signup.user.id);
  if(dateError)throw dateError;
  const {data:reward,error:rewardError}=await supabase.rpc('claim_daily_reward');
  if(rewardError||reward?.[0]?.daily_streak!==3||!reward[0].claimed)throw rewardError??new Error('Next-day reward failed.');
  console.log('Next-day daily reward: passed.');
  const {data:purchase,error:purchaseError}=await supabase.rpc('buy_cosmetic',{item_id:'ball_gold'});
  if(purchaseError||!purchase?.[0]?.owned_cosmetics?.includes('ball_gold'))throw purchaseError??new Error('Registered purchase failed.');
  const {data:persisted,error:persistError}=await supabase.from('game_profiles').select('coins,owned_cosmetics,equipped_cosmetics').single();
  if(persistError||!persisted.owned_cosmetics.includes('ball_gold')||persisted.equipped_cosmetics.ball!=='ball_gold')throw persistError??new Error('Purchase did not persist.');
  console.log('Registered purchase persistence: passed.');
  await supabase.from('game_profiles').delete().eq('user_id',signup.user.id);
}else{
  console.log('Registered purchase and next-day reward: require confirmation of the QA email before a live authenticated test.');
}
