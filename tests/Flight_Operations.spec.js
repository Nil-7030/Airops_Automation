
const { test, expect } = require('../fixtures/base.fixture');

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

test.describe.configure({ mode: 'default' });

test('P1 - Flight Operations', async ({flightOpsPage}) => {

    await flightOpsPage.clickFlightOpsHeading();
    await flightOpsPage.verifyWeeklyReportSelection();

      console.log("Weekly displayed")
});


test('P2 - Weekly Navigation', async ({ flightOpsPage}) => {


    await flightOpsPage.clickFlightOpsHeading();

    await flightOpsPage.weeklydateVerify();

    const currentWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Weekly Date:', currentWeek);

    const expectedWeek = getCurrentWeekRange();
    console.log('Expected Week:', expectedWeek);
    expect(currentWeek).toBe(expectedWeek);

    console.log("weekly Date Verfied")

    await flightOpsPage.clickPreviousWeek();
    const previousWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Previous Week after clicking previous button:', previousWeek);

    await flightOpsPage.clickNextWeek();
    const nextWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Next Week after clicking next button:', nextWeek);
});

test('P3 - FirstNameSortAtoZValidations', async ({ flightOpsPage }) => {

    await page.waitForLoadState('networkidle');

    await flightOpsPage.verifyColumnHeaders()

     console.log("column Header Verfied")

    const names = await flightOpsPage.verifySortAscending();

    const actualNames = names.map(name => name.trim());

    const expectedNames = [...actualNames]
        .sort();

    expect(actualNames).toEqual(expectedNames);

     console.log("Sort By AtoZ Verfied")

});


test('P4 - FirstNameSortZtoAValidations', async ({ flightOpsPage }) => {

    await page.waitForLoadState('networkidle');

    const names = await flightOpsPage.verifySortDescending();

    const actualNames = names.map(name => name.trim());

    const expectedNames = [...actualNames]
        .sort()
        .reverse();

    expect(actualNames).toEqual(expectedNames);

   console.log("Sort By ZtoA Verfied")
});

test('P5 - FirstNamefilterValidations', async ( { flightOpsPage, testData } ) => {
    
    await page.waitForLoadState('networkidle');

    const firstName = testData.FirstName;
 
    const names = await flightOpsPage.verifyfirstNamefilter(firstName);

    console.log('Displayed Name:', names[0]);

    for (const name of names) {
        expect(name.trim()).toContain(firstName);
    }
    console.log("Filter by Name Verfied")
});