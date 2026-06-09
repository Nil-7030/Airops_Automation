const { expect } = require('@playwright/test');


class FlightOpsPage {

    constructor(page) {
        this.page = page;

        this.flightOpsHeading = page.getByRole('heading', { name: 'Flight Ops' });
        this.weeklyReport = page.getByRole('menuitem', { name: 'Weekly' });
        this.weeklyDate = page.locator('.selected-week-calendar h6');
        this.previousWeekArrow = page.locator('.calendar-actions-wrapper svg').first();
        this.nextWeekArrow = page.locator('.calendar-actions-wrapper svg').last();
    }

    async ClickFlightOpsHeading() {
        await this.flightOpsHeading.click();
    }

    async VerifyWeeklyReportSelection() {
        await expect(this.weeklyReport).toBeFocused();
    }

    async FlightOperations() {
        await this.ClickFlightOpsHeading();
        await this.VerifyWeeklyReportSelection();
    }

    async WeeklydateVerify() {
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

    async WeeklyNavigation() {
        await this.clickPreviousWeek();
        await expect(this.weeklyDate).toBeVisible();

        await this.clickNextWeek();
        await expect(this.weeklyDate).toBeVisible();
    }

}

module.exports = FlightOpsPage;