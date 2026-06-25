import { test } from '../fixtures/base.fixture';
const testData = require('../fixtures/testdata.json');
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

            const expected = await FlightReport.getFlightReportSummaryByNumber(testData.flightReportNumber);

            await FlightReport.openFlightReportByNumber(testData.flightReportNumber);

            const actual = await FlightReport.getOpenedReportDetails();

            console.log('Grid Data:', expected);
            console.log('Detail Data:', actual);

            expect(actual.reportNumber).toBe(expected.reportNumber);

            expect(actual.approvalStatus.toLowerCase())
                .toBe(expected.approvalStatus.toLowerCase());

            expect(actual.mobileStatus.toLowerCase())
                .toBe(expected.mobileStatus.toLowerCase());
        });

    test('Verify report can be sent via email', async ({ page }) => {

        const FlightReport = new flightReport(page);

        await FlightReport.FlightReportNavigation();

        // Open the flight report from test data
        await FlightReport.openFlightReportByNumber(
            testData.flightReportNumber
        );

        // Verify the correct report is opened
        const actual = await FlightReport.getOpenedReportDetails();

        expect(actual.reportNumber).toBe(
            testData.flightReportNumber
        );

        // Send report to email
        await FlightReport.sendReportToEmail();

        // Verify success toast
        const EmailSend = await expect(
            page.getByText(/Email sent successfully/i).last());
        EmailSend.toBeVisible();
        console.log(EmailSend);
    });


    test('Verify lock/unlock updates mobile status', async ({ page }) => {

        const FlightReport = new flightReport(page);

        await FlightReport.FlightReportNavigation();

        await FlightReport.openFlightReportByNumber(
            testData.flightReportNumber
        );

        const initialStatus = await FlightReport.getMobileStatus();

        console.log('Before:', initialStatus);

        await FlightReport.toggleLockStatus();

        // Return to list
        await FlightReport.backToFlightReportList();

        // Open same report again
        await FlightReport.openFlightReportByNumber(
            testData.flightReportNumber
        );

        const updatedStatus = await FlightReport.getMobileStatus();

        console.log('After:', updatedStatus);

        expect(updatedStatus).not.toBe(initialStatus);
    });




    test('Verify flight report approval', async ({ page }) => {

        const FlightReport = new flightReport(page);

        await FlightReport.FlightReportNavigation();

        await FlightReport.openFlightReportByNumber(
            testData.flightReportNumber
        );

        await FlightReport.reviewOrApproveReport();

        await page.waitForTimeout(2000);

        await FlightReport.reviewOrApproveReport();

        await page.waitForTimeout(2000);


        const finalStatus = await FlightReport.getApprovalStatus();

        console.log('Final Approval Status:', finalStatus);

        expect(finalStatus.toLowerCase()).toContain('approved');
    });


});