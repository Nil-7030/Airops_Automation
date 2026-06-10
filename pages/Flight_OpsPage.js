const { expect } = require('@playwright/test');


class FlightOpsPage {

    constructor(page) {
        this.page = page;

        this.flightOpsHeading = page.getByRole('heading', { name: 'Flight Ops' });
        this.weeklyReport = page.getByRole('menuitem', { name: 'Weekly' });

        this.weeklyDate = page.locator('.selected-week-calendar h6');
        this.previousWeekArrow = page.locator('.calendar-actions-wrapper svg').first();
        this.nextWeekArrow = page.locator('.calendar-actions-wrapper svg').last();

        this.firstName = page.getByRole( 'button', {name: 'First Name' });
        this.lastName = page.getByRole( 'button', { name: 'Last Name' });
        this.department = page.getByRole('button', { name: 'Department' });
        this.total = page.getByRole('button', { name: 'Total' });
        this.status = page.getByRole('button', { name: 'Status' });
        this.supervisor = page.getByRole('button', { name: 'Supervisor' });
        this.missingReceipts = page.getByRole('button', { name: 'Missing Receipts' });
        this.reviewedBy = page.getByRole('button', { name: 'Reviewed By' });
        this.approvedBy = page.getByRole('button', { name: 'Approved By' });

        this.sortAtoZ = page.getByRole('menuitem', { name: 'Sort A → Z' });
        this.sortZtoA = page.getByRole('menuitem', { name: 'Sort Z → A' });
        this.filterbyName = page.getByRole('textbox', { name: 'First Name' });

    }

    async clickFlightOpsHeading() {
        await this.flightOpsHeading.click();
    }

    async verifyWeeklyReportSelection() {
        await expect(this.weeklyReport).toBeFocused();
    }

    async flightOperations() {
        await this.clickFlightOpsHeading();
        await this.verifyWeeklyReportSelection();
    }

    async selectWeeklyReport() {
        await this.weeklyReport.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.weeklyDate).toBeVisible({
            timeout: 10000
        });
    }

    async weeklydateVerify() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.weeklyDate).toBeVisible({
            timeout: 10000
        });
    }

    async getWeeklyDateText() {
        return (await this.weeklyDate.textContent())
            .replace(/\s+/g, ' ')
            .trim();
    }

    async clickPreviousWeek() {
        await this.previousWeekArrow.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickNextWeek() {
        await this.nextWeekArrow.click();
        await this.page.waitForLoadState('networkidle');
    }

    async weeklyNavigation() {
        await this.clickPreviousWeek();
        await expect(this.weeklyDate).toBeVisible();

        await this.clickNextWeek();
        await expect(this.weeklyDate).toBeVisible();
    }

    async verifyColumnHeaders() {
        
        await expect(this.firstName).toBeVisible({
            timeout: 10000
        });
        await expect(this.lastName).toBeVisible();
        await expect(this.department).toBeVisible();
        await expect(this.total).toBeVisible();
        await expect(this.status).toBeVisible();
        await expect(this.supervisor).toBeVisible();
        await expect(this.missingReceipts).toBeVisible();
        await expect(this.reviewedBy).toBeVisible();
        await expect(this.approvedBy).toBeVisible();

    }

    async verifySortandfilter(firstName){
        await this.firstName.click();
        await this.sortAtoZ.click();
        await this.firstName.click();
        await this.sortZtoA.click();
        await this.firstName.click();
        await this.filterbyName.fill(firstName);
    }

    
    

    
}

module.exports = FlightOpsPage;