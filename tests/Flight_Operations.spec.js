import { test, expect } from '@playwright/test';
import testData from '../fixtures/testdata.json';

const env = require('../config/env.js');
const FlightOpsPage = require('../pages/Flight_OpsPage.js');
const LoginPage = require('../pages/AdminLoginPage.js');

function getCurrentWeekRange() {

    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay()); // Sunday

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };

    const start = startDate
        .toLocaleDateString('en-GB', options)
        .replace(',', '');

    const end = endDate
        .toLocaleDateString('en-GB', options)
        .replace(',', '');

    return `${start} - ${end}`;
}

test.describe.configure({ mode: 'serial' });

test('P1 - Flight Operations', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const flightOpsPage = new FlightOpsPage(page);

    await page.goto(env.qa.url);

    await loginPage.login(
        testData.username[0],
        testData.password
    );

    await flightOpsPage.clickFlightOpsHeading();
    await flightOpsPage.verifyWeeklyReportSelection();
});

test('P2 - Weekly Navigation', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const flightOpsPage = new FlightOpsPage(page);

    await page.goto(env.qa.url);

    await loginPage.login(
        testData.username[0],
        testData.password
    );

    await flightOpsPage.clickFlightOpsHeading();

    await flightOpsPage.weeklydateVerify();

    const currentWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Weekly Date:', currentWeek);

    const expectedWeek = getCurrentWeekRange();
    console.log('Expected Week:', expectedWeek);
    expect(currentWeek).toBe(expectedWeek);

    await flightOpsPage.clickPreviousWeek();
    const previousWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Previous Week after clicking previous button:', previousWeek);

    await flightOpsPage.clickNextWeek();
    const nextWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Next Week after clicking next button:', nextWeek);
});

test('P3 - FirstNameFilterValidations', async ({ page }) => {
  
    const loginPage = new LoginPage(page);
    const flightOpsPage = new FlightOpsPage(page);

    await page.goto(env.qa.url);

    await loginPage.login(
        testData.username[0],
        testData.password
    );

    await page.waitForLoadState('networkidle');

    await flightOpsPage.flightOperations();
   
    await page.waitForLoadState('networkidle');

    await flightOpsPage.verifyColumnHeaders()

    await flightOpsPage.verifySortandfilter(testData.FirstName);
});
