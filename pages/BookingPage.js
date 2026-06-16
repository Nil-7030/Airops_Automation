import testData from '../fixtures/testdata.json';
const { expect } = require('@playwright/test');
class BookingPage {


    constructor(page) {

        this.page = page;

        this.flightOpsHeading = page.getByText('Flight Ops');
        this.booking = page.getByRole('menuitem', { name: 'Booking' });
        this.fromCalendar = page.locator('button[aria-label="change date"]').first();
        this.toCalendar = page.locator('button[aria-label="change date"]').nth(1);
        this.startDateColumn = page.getByRole('button', { name: "Start Date" });
        this.endDateColumn = page.getByRole('button', { name: "End Date" });
        this.numberColumn = page.getByRole('button', { name: 'Number' });
        this.name = page.getByRole('button', { name: 'Name' });
        this.customer = page.getByRole('button', { name: 'Customer' });

        this.createBooking = page.getByRole('menuitem', { name: 'Add New' });
        this.namefield = page.locator('//input[@name="name"]');
        this.selectcustomer = page.getByRole('textbox', { name: 'Customer' });
        this.customerList = page.getByRole('listbox', { name: 'Customer' })
        this.base = page.getByRole('textbox', { name: 'Base' });
        this.baseoption = page.getByRole('option', { name: testData.booking.Base });
        this.aircraft = page.getByRole('textbox', { name: 'Aircraft' });
        this.aircraftoption = page.getByRole('option', { name: testData.booking.Aircraft });
        this.startLocation = page.locator('//input[@name="startLocation"]');
        this.meetLocation = page.locator('//input[@name="meetingLocation"]');
        this.startDate = page.getByRole('textbox', { name: 'Start Date' });
        this.startTime = page.getByRole('textbox', { name: 'Start Time' });
        this.meetDate = page.getByRole('textbox', { name: 'Meet Date' });
        this.meetTime = page.getByRole('textbox', { name: 'Meet Time' });
        this.endDate = page.getByRole('textbox', { name: 'End Date' });
        this.endTime = page.getByRole('textbox', { name: 'End Time' });
        this.returnDate = page.getByRole('textbox', { name: 'Return Date' });
        this.returnTime = page.getByRole('textbox', { name: 'Return Time' });
        this.endLocation = page.locator('//input[@name="endLocation"]');
        this.returnLocation = page.locator('//input[@name="returnLocation"]');

        this.flightReportType = page.getByRole('radio', { name: 'HYDRO QUEBEC' });
        this.pilot = page.getByRole('textbox', { name: 'Pilot', exact: true });
        this.selectPilot = page.getByRole('option', { name: testData.booking.Pilot });
        this.approvingClient = page.locator('//input[@id="approvingClient"]');
        this.selectClient = page.getByRole('option', { name: testData.booking.ApprovingClient });
        this.approvingCompany = page.locator('//input[@id="approvingCompany"]');
        this.selectCompany = page.getByRole('option', { name: testData.booking.ApprovingCompany });
        this.saveBooking = page.getByTitle('Save');
    }

    async bookingPageNavigation() {

        await this.flightOpsHeading.click();
        await this.booking.click();

    }

    async bookingDateFilter() {
        await this.flightOpsHeading.click();
        await this.booking.click();
        await this.fromCalendar.click();
        const randomDay = Math.floor(Math.random() * 30) + 1;
        const startdayButton = this.page.getByRole('button', {
            name: String(randomDay),
            exact: true
        }).filter({ visible: true });
        await startdayButton.click();
        await this.toCalendar.click();
        const lastdayButton = this.page.getByRole('button', {
            name: String(randomDay),
            exact: true
        }).filter({ visible: true });
        await lastdayButton.click();
    }

    async verifybookingcolumns(page) {
        await this.flightOpsHeading.click();
        await this.booking.click();
        await page.waitForLoadState('networkidle');
        await expect(this.startDateColumn).toBeVisible();
        await expect(this.endDateColumn).toBeVisible();
        await expect(this.numberColumn).toBeVisible();
        await expect(this.name).toBeVisible();
        await expect(this.customer).toBeVisible();
    }

    async createBookings(booking) {
        await this.flightOpsHeading.click();
        await this.booking.click();
        await this.createBooking.click();
        await this.namefield.fill(booking.name);
        await this.selectcustomer.fill(booking.Customer);
        await this.customerList.click();
        await this.base.click();
        await this.baseoption.click();
        await this.aircraft.click();
        await this.aircraftoption.click();
        await this.startLocation.fill(booking.StartLocation);
        await this.endLocation.fill(booking.EndLocation);
        await this.startDate.fill(booking.StartDate);
        await this.endDate.fill(booking.EndDate);
        await this.startTime.fill(booking.StartTime);
        await this.endTime.fill(booking.EndTime);
        await this.meetDate.fill(booking.MeetDate);
        await this.meetLocation.fill(booking.MeetLocation);
        await this.returnLocation.fill(booking.ReturnLocation)
        await this.meetTime.fill(booking.MeetTime);
        await this.returnDate.fill(booking.ReturnDate);
        await this.returnTime.fill(booking.ReturnTime);
        await this.flightReportType.click();
        await this.pilot.click();
        await this.selectPilot.scrollIntoViewIfNeeded();
        await this.selectPilot.click();
        await this.approvingClient.click();
        await this.selectClient.click();
        await this.approvingCompany.click();
        await this.selectCompany.click();
        await this.saveBooking.click();
    }

}
module.exports = BookingPage;
