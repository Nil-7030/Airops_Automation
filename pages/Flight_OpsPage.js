const { expect } = require('@playwright/test');


class Flight_OpsPage {

    constructor (page) {
        this.page = page;

        this.flightOpsHeading = page.getByRole('heading', {name: 'Flight Ops'});
        this.weeklyReport = page.getByRole('menuitem', {name: 'Weekly'});

    }

    async ClickFlightOpsHeading(){
        await this.flightOpsHeading.click();
    }

    async VerifyWeeklyReportSelection(){
        await expect(this.weeklyReport).toBeFocused();
    }

    async FlightOperations(){
        await this.ClickFlightOpsHeading();
        await this.VerifyWeeklyReportSelection();
    }

}

module.exports = Flight_OpsPage;