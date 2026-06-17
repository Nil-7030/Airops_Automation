const { test, expect } = require('../fixtures/base.fixture');
const BookingPage = require('../pages/BookingPage');
const testData = require('../fixtures/testdata.json');

test.describe('Booking Module', () => {

    test('should navigate to the Booking page', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.goto();
        
        
    });

    test('should filter bookings by date range', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.filterByDateRange();

        await expect(page).not.toHaveURL(/error/);
    });

    test('should display all expected grid columns', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.verifyBookingColumnsVisible();
    });

    for (const [scenario, booking] of Object.entries(testData.bookings)) {
        test(`should create a booking - ${scenario}`, async ({ page }) => {
            const bookingPage = new BookingPage(page);

            await bookingPage.createBooking(booking);

            
        });
    }
});