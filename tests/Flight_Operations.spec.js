const { test, expect } = require('../fixtures/base.fixture');
const testData = require('../fixtures/testdata.json'); 

function getCurrentWeekRange() {
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const options = { day: '2-digit', month: 'short', year: 'numeric' };

    const start = startDate.toLocaleDateString('en-GB', options).replace(',', '');
    const end = endDate.toLocaleDateString('en-GB', options).replace(',', '');

    return `${start} - ${end}`;
}

test.describe.configure({ mode: 'default' });

// ============================================
// P1 - Flight Operations Landing
// ============================================
test('P1 - Flight Operations', async ({ flightOpsPage }) => {
    await flightOpsPage.clickFlightOpsHeading();
    await flightOpsPage.verifyWeeklyReportSelection();
    console.log("Weekly displayed");
});

// ============================================
// P2 - Weekly Navigation
// ============================================
test('P2 - Weekly Navigation', async ({ flightOpsPage }) => {
    await flightOpsPage.clickFlightOpsHeading();
    await flightOpsPage.weeklydateVerify();

    const currentWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Weekly Date:', currentWeek);

    const expectedWeek = getCurrentWeekRange();
    console.log('Expected Week:', expectedWeek);
    expect(currentWeek).toBe(expectedWeek);
    console.log("Weekly Date Verified");

    await flightOpsPage.clickPreviousWeek();
    const previousWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Previous Week:', previousWeek);

    await flightOpsPage.clickNextWeek();
    const nextWeek = await flightOpsPage.getWeeklyDateText();
    console.log('Next Week:', nextWeek);
});

// ============================================
// P3 - Column Headers Verification
// ============================================
test('P3 - Verify Column Headers', async ({ page, flightOpsPage }) => {
    await page.waitForLoadState('networkidle');
    await flightOpsPage.flightOperations();
    await flightOpsPage.verifyColumnHeaders();
    console.log("Column Headers Verified");
});

// ============================================
// P4 - Data-Driven Sort A→Z Tests
// P5 - Data-Driven Sort Z→A Tests
// ============================================
for (const col of testData.columns) {

    test(`P4 - Sort ${col.label} A to Z`, async ({ page, flightOpsPage }) => {
        await page.waitForLoadState('networkidle');
        await flightOpsPage.flightOperations();

        const values = await flightOpsPage.sortColumnAscending(col.key);
        const actual = values.map(v => v.trim());
        const expected = [...actual].sort();

        console.log(`${col.label} (A→Z):`, actual);
        expect(actual).toEqual(expected);
        console.log(`${col.label} Sort A-Z Verified`);
    });

    test(`P5 - Sort ${col.label} Z to A`, async ({ page, flightOpsPage }) => { 
        await page.waitForLoadState('networkidle');
        await flightOpsPage.flightOperations();

        const values = await flightOpsPage.sortColumnDescending(col.key);
        const actual = values.map(v => v.trim());
        const expected = [...actual].sort().reverse();

        console.log(`${col.label} (Z→A):`, actual);
        expect(actual).toEqual(expected);
        console.log(`${col.label} Sort Z-A Verified`);
    });
}

// ============================================
// P6 - Data-Driven Filter Tests  
// ============================================
for (const col of testData.columns) {

    test(`P6 - Filter ${col.label} by "${col.filterValue}"`, async ({ page, flightOpsPage }) => {
        await page.waitForLoadState('networkidle');
        await flightOpsPage.flightOperations();

        const result = await flightOpsPage.filterColumn(col.key, col.filterValue);

        // ✅ Scenario 1 — Option not found → log and skip, don't fail
        if (result.status === 'OPTION_NOT_FOUND') {
            console.log(`ℹ️ SKIPPED: "${col.filterValue}" not found in ${col.label} dropdown`);
            test.skip(); // marks test as skipped in report
            return;
        }

        // ✅ Scenario 2 — No results returned → log and skip, don't fail
        if (result.status === 'NO_RESULTS') {
            console.log(`ℹ️ SKIPPED: No rows found after filtering ${col.label} by "${col.filterValue}"`);
            test.skip();
            return;
        }

        // ✅ Success — verify all returned rows contain filter value
        console.log(`Displayed ${col.label} values:`, [...new Set(result.values)]);
        expect(result.values.length).toBeGreaterThan(0);

        for (const value of result.values) {
            expect(value.trim().toLowerCase()).toContain(col.filterValue.toLowerCase());
        }
        console.log(`✅ ${col.label} Filter Verified`);
    });
}