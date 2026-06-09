 import {test, expect} from '@playwright/test';
 const env = require('../config/env.js');
 const FlightOpsPage = require('../pages/Flight_OpsPage.js');
 import testData from '../fixtures/testdata.json';
 const LoginPage = require('../pages/AdminLoginPage.js');

 test('Flight Operations', async ({page}) => {

    await page.goto(env.qa.url);
  const loginPage = new LoginPage(page);

  await loginPage.login(testData.username[0], testData.password);

  const flightOpsPage = new FlightOpsPage(page);
  
  await flightOpsPage.ClickFlightOpsHeading();
  await flightOpsPage.VerifyWeeklyReportSelection()
  await flightOpsPage.ClickFlightOpsHeading();




 });
