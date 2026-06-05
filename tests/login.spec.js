// @ts-check
import { test, expect } from '@playwright/test';
const LoginPage = require('../pages/AdminLoginPage.js');
const env = require('../config/env');
import testData from '../fixtures/testdata.json';

test('Login Test', async ({ page }) => {
  await page.goto(env.qa.url);
  const loginPage = new LoginPage(page);

  await loginPage.login(testData.username[0], testData.password);


  await page.locator('.company-header h6').waitFor({
    state: 'visible',
    timeout: 10000
  });


  await expect(page.locator('.company-header h6'))
    .toHaveText('AirOps');


  await expect(page.locator('.company-header span'))
    .toHaveText('Mustang Helicopters');

})

