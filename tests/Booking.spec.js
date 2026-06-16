
import { test } from '../fixtures/base.fixture';
import testData from '../fixtures/testdata.json';

const BookingPage = require('../pages/BookingPage');

 

test.describe.configure({ mode: 'default' });

test('BookingPage Navigation', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    await bookingPage.bookingPageNavigation();

})

test('Booking Filters', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await page.waitForLoadState('networkidle');
    await bookingPage.bookingDateFilter();

})

test('Booking Header Validation', async ({ page }) => {

    const bookingPage = new BookingPage(page);
    
    await page.waitForLoadState('networkidle');
    await bookingPage.verifybookingcolumns();

})


test('Create Booking', async ({ page }) => {
   
    const bookingPage = new BookingPage(page);
    
    await bookingPage.createBookings(testData.booking);
    console.log("Booking Created Succesfully")
});
