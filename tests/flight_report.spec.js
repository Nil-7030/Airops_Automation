import { test } from '../fixtures/base.fixture';
const flightReport = require('../pages/FlightReportPage');
const { expect } = require('@playwright/test');


test.describe('Booking Module', () => {

    test('navigate to the flightreport page', async ({ page }) => {

        const FlightReport = new flightReport(page);

        await FlightReport.FlightReportNavigation();

    });

    test('flightreport calender Validation', async ({ page }) => {


        const FlightReport = new flightReport(page);

        await FlightReport.CalenderValidation();

    });

    test('flightreport column Header Validation', async ({ page }) => {

        const FlightReport = new flightReport(page);

        await FlightReport.verifyFlightReportColumnsVisible();

    });

    test('Verify flight report summary matches details page',
async ({ page }) => {

    const FlightReport = new flightReport(page);

    await FlightReport.FlightReportNavigation();

    const expected =
        await FlightReport.getFlightReportSummary(0);

    await FlightReport.openFlightReport(0);

    const actual =
        await FlightReport.getOpenedReportDetails();

    console.log('Grid Data:', expected);
    console.log('Detail Data:', actual);

    expect(actual.reportNumber)
    .toBe(expected.reportNumber);

expect(actual.approvalStatus.toLowerCase())
    .toBe(expected.approvalStatus.toLowerCase());

expect(actual.mobileStatus.toLowerCase())
    .toBe(expected.mobileStatus.toLowerCase());
});
});