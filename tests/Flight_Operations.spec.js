 import {test, expect} from '@playwright/test';
 const env = require('../config/env');
 import testData from '../fixtures/testdata.json';
 const LoginPage = require('../pages/AdminLoginPage.js');

 test('Flight Operations', async ({page}) => {

    const loginPage = new LoginPage(page);
    
    await page.goto(env.qa.url);

    await loginPage.login(testData.username[0], testData.password);
    await page.getByRole('button', {name: 'close'}).click();
    await page.getByRole('heading', {name: 'Flight Ops'}).click();
    const weeklyReport = await expect(page.getByRole('menuitem', {name: 'Weekly'})).toBeFocused();
   await page.getByRole('heading', {name: 'Flight Ops'}).click();


 })
