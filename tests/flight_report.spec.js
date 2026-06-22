import { test } from '../fixtures/base.fixture';
const flightReport = require('../pages/FlightReportPage')

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


    });