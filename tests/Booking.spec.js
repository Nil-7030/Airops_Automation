import testData from '../fixtures/testdata.json';
import { test } from '../fixtures/base.fixture';
const BookingPage = require('../pages/BookingPage');
const { generateBooking } = require('../utils/bookingGenerator');

test.describe('Booking Module', () => {

    test('should navigate to the Booking page', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.bookingNavigation();


    });

    test('should filter bookings by date range', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.filterByDateRange();

    });

    test('should display all expected grid columns', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await bookingPage.verifyBookingColumnsVisible();
    });

    test('Create Booking', async ({ page }) => {

        const bookingPage = new BookingPage(page);

        const booking = generateBooking(
            testData.bookingDefaults
        );

        console.log(booking);

        await bookingPage.createBooking(booking);

        console.log('Created Booking:', booking.name);
        await page.waitForTimeout(5000);

        await bookingPage.bookingNavigation();

        await bookingPage.verifyBookingExists(
            booking.name
        );
    });
});