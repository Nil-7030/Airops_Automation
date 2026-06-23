const filterByDate = require('../utils/filterByDate');
const { expect } = require('@playwright/test');
class FlightReport {

    constructor(page) {
        this.page = page;

        this.flightOpsHeading = page.getByRole('heading', { name: 'Flight Ops' });
        this.flightReport = page.getByRole('menuitem', { name: 'Flight Report' });
        this.filter = page.locator('//img[@alt="filter"]');
        this.fromCalendar = page.locator('button[aria-label="change date"]').first();
        this.toCalendar = page.locator('button[aria-label="change date"]').nth(1);
        this.approvalStatus = page.getByRole('button', { name: 'Approval status' });
        this.date = page.getByRole('button', { name: 'Date' }).first();;
        this.aircraft = page.getByRole('button', { name: 'Aircraft' });
        this.booking = page.getByRole('button', { name: 'booking' });
        this.customer = page.getByRole('button', { name: 'Customer' });
        this.flightType = page.getByRole('button', { name: 'Flight Type' });
        this.flightReportColumn = page.getByRole('button', { name: 'Flight Report' });
        this.acType = page.getByRole('button', { name: 'AC Type' });
        this.pilot = page.getByRole('button', { name: 'Pilot', exact:'true'}).first();
        this.coPilot = page.getByRole('button', { name: 'Co Pilot' });
        this.ame = page.getByRole('button', { name: 'AME' });
        this.apprentice = page.getByRole('button', { name: 'Apprentice' });
        this.revenueHrs = page.getByRole('button', { name: 'Rev Hrs' }).first();
        this.nonRevHrs = page.getByRole('button', { name: 'Non-rev Hrs' });
        this.airTime = page.getByRole('button', { name: 'Air Time' });
        this.invoiceNumber = page.getByRole('button', { name: 'Invoice Number' });
        this.approvedBy = page.getByRole('button', { name: 'Approved By' });
        this.comments = page.getByRole('button', { name: 'Comments' });
        this.MobileStatus = page.getByRole('button', { name: 'mobile status' });

        

    }

    async FlightReportNavigation() {
        await this.flightOpsHeading.click();
        await this.flightReport.click();

    }

    async CalenderValidation() {

        await this.FlightReportNavigation();

        await this.filter.click();

        const selectedDay = await filterByDate.selectRandomDate(
            this.page,
            this.fromCalendar,
            this.toCalendar
        );

        console.log(`Selected Day: ${selectedDay}`);
    }

    async verifyFlightReportColumnsVisible() {

        await this.FlightReportNavigation();
        await this.page.waitForLoadState('networkidle');
        await expect(this.approvalStatus).toBeVisible();
        await expect(this.date).toBeVisible();
        await expect(this.aircraft).toBeVisible();
        await expect(this.booking).toBeVisible();
        await expect(this.customer).toBeVisible();
        await expect(this.flightType).toBeVisible();
        await expect(this.flightReportColumn).toBeVisible();
        await expect(this.acType).toBeVisible();
        await expect(this.pilot).toBeVisible();
        await expect(this.coPilot).toBeVisible();
        await expect(this.ame).toBeVisible();
        await expect(this.apprentice).toBeVisible();
        await expect(this.revenueHrs).toBeVisible();
        await expect(this.nonRevHrs).toBeVisible();
        await expect(this.airTime).toBeVisible();
        await expect(this.invoiceNumber).toBeVisible();
        await expect(this.approvedBy).toBeVisible();
        await expect(this.comments).toBeVisible();
        await expect(this.MobileStatus).toBeVisible();

    }

}
module.exports = FlightReport;




