const { expect } = require('@playwright/test');

class BookingPage {

    constructor(page) {
        this.page = page;

        // Navigation
        this.flightOpsHeading = page.getByText('Flight Ops');
        this.booking = page.getByRole('menuitem', { name: 'Booking' });
        this.bookingsHeader = page.locator('//a[text()="Bookings"]');
        // Filters / grid
        this.fromCalendar = page.locator('button[aria-label="change date"]').first();
        this.toCalendar = page.locator('button[aria-label="change date"]').nth(1);
        this.startDateColumn = page.getByRole('button', { name: 'Start Date' });
        this.endDateColumn = page.getByRole('button', { name: 'End Date' });
        this.numberColumn = page.getByRole('button', { name: 'Number' });
        this.nameColumn = page.getByRole('button', { name: 'Name' });
        this.customerColumn = page.getByRole('button', { name: 'Customer' });

        // Create booking form
        this.createBookingButton = page.getByRole('menuitem', { name: 'Add New' });
        this.nameField = page.locator('input[name="name"]');
        this.customerField = page.getByRole('textbox', { name: 'Customer' });
        this.customerListbox = page.getByRole('listbox', { name: 'Customer' });
        this.baseField = page.getByRole('textbox', { name: 'Base' });
        this.aircraftField = page.getByRole('textbox', { name: 'Aircraft' });
        this.startLocationField = page.locator('input[name="startLocation"]');
        this.meetLocationField = page.locator('input[name="meetingLocation"]');
        this.startDateField = page.getByRole('textbox', { name: 'Start Date' });
        this.startTimeField = page.getByRole('textbox', { name: 'Start Time' });
        this.meetDateField = page.getByRole('textbox', { name: 'Meet Date' });
        this.meetTimeField = page.getByRole('textbox', { name: 'Meet Time' });
        this.endDateField = page.getByRole('textbox', { name: 'End Date' });
        this.endTimeField = page.getByRole('textbox', { name: 'End Time' });
        this.returnDateField = page.getByRole('textbox', { name: 'Return Date' });
        this.returnTimeField = page.getByRole('textbox', { name: 'Return Time' });
        this.endLocationField = page.locator('input[name="endLocation"]');
        this.returnLocationField = page.locator('input[name="returnLocation"]');

        this.flightReportTypeRadio = page.getByRole('radio', { name: 'HYDRO QUEBEC' });
        this.pilotField = page.getByRole('textbox', { name: 'Pilot', exact: true });
        this.approvingClientField = page.locator('#approvingClient');
        this.approvingCompanyField = page.locator('#approvingCompany');
        this.saveBookingButton = page.getByTitle('Save');

        // Confirmation / feedback
        this.successToast = page.getByText('Booking created successfully');
    }

    // ---- Dynamic option locators (value supplied per call, not bound to any fixed dataset) ----
    optionByName(name) {
        return this.page.getByRole('option', { name });
    }

    // ---- Navigation ----
    async goto() {
        await this.flightOpsHeading.click();
        await this.page.waitForLoadState('networkidle');
        await this.booking.click();
        await expect(this.bookingsHeader).toBeVisible();

    }

    // ---- Filters ----
    async filterByDateRange() {
        await this.goto();

        await this.fromCalendar.click();
        const randomDay = Math.floor(Math.random() * 28) + 1;

        await this.page.getByRole('button', { name: String(randomDay), exact: true })
            .first()
            .click();

        await this.toCalendar.click();
        await this.page.getByRole('button', { name: String(randomDay), exact: true })
            .first()
            .click();

    }

    // ---- Header validation ----
    async verifyBookingColumnsVisible() {
        await this.goto();

        await expect(this.startDateColumn).toBeVisible();
        await expect(this.endDateColumn).toBeVisible();
        await expect(this.numberColumn).toBeVisible();
        await expect(this.nameColumn).toBeVisible();
        await expect(this.customerColumn).toBeVisible();
    }

    // ---- Create booking ----
    async openCreateBookingForm() {
        await this.goto();
        await this.createBookingButton.click();
    }

    async fillBookingDetails(booking) {
        await this.nameField.fill(booking.name);

        await this.customerField.fill(booking.Customer);
        await this.customerListbox.click();

        await this.baseField.click();
        await this.optionByName(booking.Base).click();

        await this.aircraftField.click();
        await this.optionByName(booking.Aircraft).click();

        await this.startLocationField.fill(booking.StartLocation);
        await this.endLocationField.fill(booking.EndLocation);
        await this.startDateField.fill(booking.StartDate);
        await this.endDateField.fill(booking.EndDate);
        await this.startTimeField.fill(booking.StartTime);
        await this.endTimeField.fill(booking.EndTime);
        await this.meetDateField.fill(booking.MeetDate);
        await this.meetLocationField.fill(booking.MeetLocation);
        await this.returnLocationField.fill(booking.ReturnLocation);
        await this.meetTimeField.fill(booking.MeetTime);
        await this.returnDateField.fill(booking.ReturnDate);
        await this.returnTimeField.fill(booking.ReturnTime);

        await this.flightReportTypeRadio.click();

        await this.pilotField.click();
        const pilotOption = this.optionByName(booking.Pilot);
        await pilotOption.scrollIntoViewIfNeeded();
        await pilotOption.click();

        await this.approvingClientField.click();
        await this.optionByName(booking.ApprovingClient).click();

        await this.approvingCompanyField.click();
        await this.optionByName(booking.ApprovingCompany).click();
    }

    async submitBooking() {
        await this.saveBookingButton.click();
    }

    async createBooking(booking) {
        await this.openCreateBookingForm();
        await this.fillBookingDetails(booking);
        await this.submitBooking();
    }
}

module.exports = BookingPage;