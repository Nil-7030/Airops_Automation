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
        this.pilot = page.getByRole('button', { name: 'Pilot', exact: 'true' }).first();
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
        this.tableRows = page.locator('tbody tr');
        this.reportNumberLabel = page.locator('text=Flight Reports');
        this.approvedStatusChip = page.locator('text=Approved Status').locator('xpath=following-sibling::*[1]');
        this.mobileStatusChip = page.locator('text=Mobile Status').locator('xpath=following-sibling::*[1]');

        this.emailButton = page.getByRole('menuitem', { name: 'Send Flight Report to Email' });
        this.lockButton = page.locator('button.MuiSpeedDialAction-fab').nth(1);

        this.reviewApproveButton = page.locator('button.MuiSpeedDialAction-fab').nth(2);
        this.flightReportBreadcrumb = page.getByText('Flight Reports').first();
        // Toast message
        this.toastMessage = page.locator('.Toastify__toast').last();


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

    async getFlightReportSummaryByNumber(reportNumber) {

        const rowCount = await this.tableRows.count();

        for (let i = 0; i < rowCount; i++) {

            const row = this.tableRows.nth(i);

            const currentReportNumber = (
                await row.locator('th[role="cell"]').nth(6).textContent()
            ).trim();

            if (currentReportNumber === reportNumber) {

                return {
                    approvalStatus: (
                        await row.locator('th[role="cell"]').nth(0)
                            .locator('.MuiChip-label')
                            .textContent()
                    ).trim(),

                    reportNumber: currentReportNumber,

                    mobileStatus: (
                        await row.locator('th[role="cell"]').nth(18)
                            .locator('.MuiChip-label')
                            .textContent()
                    ).trim()
                };
            }
        }

        throw new Error(`Flight Report ${reportNumber} not found.`);
    }

    async openFlightReportByNumber(reportNumber) {

        await this.page.waitForLoadState('networkidle');

        await this.tableRows.first().waitFor({
            state: 'visible',
            timeout: 15000
        });

        const rowCount = await this.tableRows.count();

        for (let i = 0; i < rowCount; i++) {

            const row = this.tableRows.nth(i);

            const reportNo = (
                await row.locator('[role="cell"]').nth(6).textContent()
            ).trim();

            console.log(reportNo);

            if (reportNo === reportNumber) {
                await row.click();
                return;
            }
        }

        throw new Error(`Flight Report ${reportNumber} not found.`);
    }



    async getOpenedReportDetails() {

        const reportNumber = (
            await this.page
                .locator('text=Flight Reports')
                .locator('xpath=following::*[normalize-space() and string-length(normalize-space())=6][1]')
                .textContent()
        ).trim();

        const pageText = await this.page.locator('body').innerText();

        const approvalMatch = pageText.match(
            /Approved Status\s*:?\s*(NOT APPROVED|APPROVED)/i
        );

        const mobileMatch = pageText.match(
            /Mobile Status\s*:?\s*(NO SIGNATURE|SIGNED)/i
        );

        return {
            reportNumber,
            approvalStatus: approvalMatch ? approvalMatch[1].trim() : '',
            mobileStatus: mobileMatch ? mobileMatch[1].trim() : ''
        };
    }

    async getMobileStatus() {

        const pageText = await this.page.locator('body').innerText();

        const match = pageText.match(
            /Mobile Status\s*:?\s*(NOT LOCKED|LOCKED|NO SIGNATURE|SIGNED)/i
        );

        if (!match) {
            throw new Error('Unable to fetch Mobile Status');
        }

        return match[1].trim();
    }

    async backToFlightReportList() {
        await this.flightReportBreadcrumb.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getApprovalStatus() {

        const pageText = await this.page.locator('body').innerText();

        const match = pageText.match(
            /Approved Status\s*:\s*([^\n\r]+)/i
        );

        if (!match) {
            throw new Error('Approval Status not found');
        }

        return match[1].trim();
    }

    async sendReportToEmail() {

        await this.emailButton.waitFor({
            state: 'visible'
        });

        await this.emailButton.click();
    }

    async toggleLockStatus() {

        await this.lockButton.waitFor({
            state: 'visible'
        });

        await this.lockButton.click();
    }
    async reviewOrApproveReport() {

        await this.reviewApproveButton.waitFor({
            state: 'visible'
        });

        await this.reviewApproveButton.click();
    }

    async getToastMessage() {

        await this.toastMessage.waitFor({
            state: 'visible',
            timeout: 10000
        });

        return await this.toastMessage.textContent();
    }

}
module.exports = FlightReport;




