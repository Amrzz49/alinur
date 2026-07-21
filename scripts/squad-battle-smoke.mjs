import { strict as assert } from 'node:assert';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});page.setDefaultTimeout(10000);
await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>localStorage.clear());await page.reload();
await page.getByRole('button',{name:/Continue|Продолжить/}).click();await page.getByRole('button',{name:/Demo account|Демо-аккаунт/}).click();
await page.getByRole('button',{name:'Games'}).click();await page.getByRole('button',{name:/Squad Builder 26/}).click();
for(let index=0;index<11;index+=1){await page.locator('.squad-slot').nth(index).click();await page.locator('.mad-picker .mad-card').first().click()}
await page.locator('.squad-play-ai').click();
const aiTeam=page.locator('.fatal-team').nth(1);
assert.equal(await aiTeam.locator('.mad-card-back').count(),11,'AI cards were visible before the duel.');
assert.equal(await aiTeam.locator('.mad-card').count(),0,'An AI player was revealed too early.');
await page.locator('.fatal-team').first().locator('.mad-card').first().click();
await page.locator('.battle-play').click();
await page.locator('.duel-result').waitFor();
assert.equal(await aiTeam.locator('.mad-card-back').count(),10,'The selected AI card was not revealed.');
assert.equal(await aiTeam.locator('.mad-card.used').count(),1,'The fought AI player should be visible.');
console.log('Squad Battle hidden AI selection: passed.');await browser.close();
