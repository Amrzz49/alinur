import { strict as assert } from 'node:assert';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(10000);
await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>localStorage.clear());await page.reload();
await page.getByRole('button',{name:/Continue|Продолжить/}).click();await page.getByRole('button',{name:/Demo account|Демо-аккаунт/}).click();await page.getByRole('button',{name:'Games'}).click();
await page.getByRole('button',{name:/Penalty Mind/}).click();await page.locator('.keeper-read').waitFor();await page.getByRole('button',{name:/Shoot/}).click();await page.locator('.goal-result').waitFor();await page.getByRole('button',{name:/All games/}).click();
await page.getByRole('button',{name:/Goalkeeper IQ/}).click();await page.locator('.striker-cue').waitFor();await page.getByRole('button',{name:/Defend/}).click();await page.locator('.goal-result').waitFor();await page.getByRole('button',{name:/All games/}).click();
await page.getByRole('button',{name:/Find the Pass/}).click();await page.locator('.pass-player.teammate').filter({hasText:'1'}).click();assert.match(await page.locator('.penalty-score small').innerText(),/🔥 1/);
console.log('Realistic mini-game cues and passing streak: passed.');await browser.close();
