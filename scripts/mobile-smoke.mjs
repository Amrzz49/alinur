import { strict as assert } from 'node:assert';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
page.setDefaultTimeout(7000);
const openFresh=async()=>{await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'})};
const noOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true);

await openFresh();
await page.getByRole('button',{name:'Продолжить'}).click();
await page.getByRole('button',{name:'Войти как гость'}).click();
await page.getByRole('button',{name:'Главная'}).waitFor();
await page.reload({waitUntil:'networkidle'});
await page.getByRole('button',{name:'Главная'}).waitFor();
await noOverflow();
console.log('Guest login and refresh passed.');

await page.evaluate(()=>{localStorage.clear();localStorage.setItem('fieldmind-guest-profile','guest-progress-must-stay')});
await page.reload({waitUntil:'networkidle'});
await page.getByRole('button',{name:'Продолжить'}).click();
await page.getByRole('button',{name:'Демо-аккаунт'}).click();
await page.getByText('$ 760',{exact:true}).waitFor();
assert.equal(await page.evaluate(()=>localStorage.getItem('fieldmind-guest-profile')),'guest-progress-must-stay');
await page.reload({waitUntil:'networkidle'});
await page.getByText('$ 760',{exact:true}).waitFor();
console.log('Demo profile isolation and refresh passed.');

await page.getByRole('button',{name:'Training'}).click();
await page.locator('.training-field-progress').getByText('1 / 8').waitFor();
await page.getByRole('button',{name:/Pass left/}).waitFor();
await noOverflow();
console.log('Training passed.');

await page.getByRole('button',{name:'Home'}).click();
await page.getByRole('button',{name:/Start match/}).click();
await page.locator('.caps-canvas-wrap canvas').waitFor();
await noOverflow();
console.log('Field Caps passed.');

await page.getByRole('button',{name:'Shop'}).click();
await page.locator('.shop-screen').waitFor();
await page.getByText('$760',{exact:true}).waitFor();
await noOverflow();

await page.getByRole('button',{name:'Football world'}).click();
for(const tab of ['World Cup 2026','Season 25/26','Stars','Clubs','Coaches']){
  await page.getByRole('button',{name:tab}).click();
  const text=await page.locator('.world-screen').innerText();
  assert.equal(/[А-Яа-яЁё]/.test(text),false,`Russian text remained in ${tab}`);
}
await page.getByRole('button',{name:'World Cup 2026'}).click();
await page.locator('.player-card').first().click();
assert.equal(/[А-Яа-яЁё]/.test(await page.locator('.player-modal').innerText()),false,'Russian text remained in player details');

await browser.close();
console.log('Mobile smoke test passed: login, persistence, training, Field Caps, shop, English Football World, refresh and viewport.');
