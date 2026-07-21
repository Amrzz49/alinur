import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import { chromium, devices } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const env=Object.fromEntries((await readFile('.env.local','utf8')).split(/\r?\n/).filter((line)=>line&&!line.startsWith('#')).map((line)=>{const at=line.indexOf('=');return [line.slice(0,at),line.slice(at+1).replace(/^['"]|['"]$/g,'')]}));
const browser=await chromium.launch({headless:true});

for(const deviceName of ['iPhone 13','Pixel 5']){
  const context=await browser.newContext({...devices[deviceName]});
  const page=await context.newPage();page.setDefaultTimeout(10000);
  await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.getByRole('button',{name:/Continue|Продолжить/}).click();await page.getByRole('button',{name:/guest|гость/i}).click();
  await page.getByRole('button',{name:/Start match|Начать матч/}).click();
  const canvas=page.locator('.caps-canvas-wrap canvas');const box=await canvas.boundingBox();if(!box)throw new Error('Field Caps canvas missing.');
  const x=box.x+box.width*.22,y=box.y+box.height*.5,session=await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-box.width*.09,y}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.getByText(/Opponent.s turn|Ход соперника/).waitFor();
  console.log(`${deviceName} touch shot: passed.`);await context.close();
}

const aiContext=await browser.newContext({viewport:{width:390,height:844}});const aiPage=await aiContext.newPage();aiPage.setDefaultTimeout(15000);
await aiPage.route('**/functions/v1/ai',async(route)=>{const response=await route.fetch();await new Promise((resolve)=>setTimeout(resolve,5000));await route.fulfill({response})});
await aiPage.goto('http://127.0.0.1:4173');await aiPage.evaluate(()=>localStorage.clear());await aiPage.reload();
await aiPage.getByRole('button',{name:/Continue|Продолжить/}).click();await aiPage.getByRole('button',{name:/Demo account|Демо-аккаунт/}).click();await aiPage.getByRole('button',{name:'Home',exact:true}).click();await aiPage.getByRole('button',{name:'Training'}).click();
for(let index=0;index<8;index+=1){await aiPage.locator('.choice').first().click();await aiPage.locator('.next-button').click()}
await aiPage.getByText('Improving your plan…').waitFor();
assert.ok((await aiPage.locator('.ai-coach__answer p').first().innerText()).length>0,'Fallback coach text missing.');
await aiPage.getByText('Analysis ready').waitFor();console.log('AI coach with five-second network delay: passed.');await aiContext.close();

const api=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const email=`fieldmind.recovery.${Date.now()}@example.com`,password=`Fm-${crypto.randomUUID()}!`;
const {data:signup,error:signupError}=await api.auth.signUp({email,password});if(signupError||!signup.session||!signup.user)throw signupError??new Error('Recovery test session missing.');
await api.from('game_profiles').upsert({user_id:signup.user.id},{onConflict:'user_id'});
const recovery=await browser.newContext({viewport:{width:390,height:844}});const recoveryPage=await recovery.newPage();recoveryPage.setDefaultTimeout(12000);
const ref=new URL(env.VITE_SUPABASE_URL).hostname.split('.')[0],storageKey=`sb-${ref}-auth-token`;
await recoveryPage.addInitScript(({key,session})=>localStorage.setItem(key,JSON.stringify(session)),{key:storageKey,session:signup.session});
await recoveryPage.route('**/*.supabase.co/rest/v1/**',(route)=>route.abort('internetdisconnected'));
await recoveryPage.goto('http://127.0.0.1:4173');await recoveryPage.getByRole('button',{name:/^(Home|Главная)$/}).waitFor();
assert.equal(await recoveryPage.getByText(/Welcome! Let’s begin.|Добро пожаловать! Начнём путь./).count(),0,'User was logged out during outage.');
await recoveryPage.unroute('**/*.supabase.co/rest/v1/**');await recoveryPage.getByRole('button',{name:/^(Games|Игры)$/}).click();
const retry=recoveryPage.getByRole('button',{name:/Try again|Загрузить снова/});if(await retry.count())await retry.click();
await recoveryPage.getByText(/Choose a game|Выбери игру/).waitFor();console.log('Supabase outage and recovery: passed.');
await api.from('game_profiles').delete().eq('user_id',signup.user.id);await recovery.close();await browser.close();
