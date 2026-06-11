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

let flightOpsPage;

test.beforeEach(async ({ page }) => {

        const loginPage = new LoginPage(page);
        flightOpsPage = new FlightOpsPage(page);

        await page.goto(env.qa.url);

        await loginPage.login(
            testData.username[0],
            testData.password
        );

        await page.waitForLoadState('networkidle');
    });

test('P1 - Flight Operations', async ({ page }) => {

    await flightOpsPage.clickFlightOpsHeading();
    await flightOpsPage.verifyWeeklyReportSelection();
});

test('P2 - Weekly Navigation', async ({ page }) => {


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

test('P3 - FirstNameSortAtoZValidations', async ({ page }) => {
  
    
    await page.waitForLoadState('networkidle');

    await flightOpsPage.flightOperations();
   
    await flightOpsPage.verifyColumnHeaders()

    await flightOpsPage.verifySortAscending();
   
    const names = await flightOpsPage.getFirstNames();

    const actualNames = names.map(name => name.trim());

    const expectedNames = [...actualNames]
        .sort((a, b) => a.localeCompare(b));

    expect(actualNames).toEqual(expectedNames);

});

    test('P4 - FirstNameSortZtoAValidations', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    await flightOpsPage.flightOperations();

    await flightOpsPage.verifySortDescending();

   const names = await flightOpsPage.getFirstNames();

    const actualNames = names.map(name => name.trim());

    const expectedNames = [...actualNames]
        .sort((a, b) => b.localeCompare(a));

});

  test('P5 - FirstNamefilterValidations', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    await flightOpsPage.flightOperations();

    await flightOpsPage.verifyfirstNamefilter(testData.FirstName);
    
    for (const name of names) {
        expect(name.trim()).toContain(firstName);
    }
  });

