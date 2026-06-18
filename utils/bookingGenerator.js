const { faker } = require('@faker-js/faker');

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function generateBooking(staticData) {

    const startDate = faker.date.soon({ days: 150 });

    const meetDate = new Date(startDate);
    meetDate.setDate(startDate.getDate() + 1);

    const returnDate = new Date(startDate);
    returnDate.setDate(startDate.getDate() + 3);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    return {
        name: `Booking-${faker.string.alphanumeric(8)}`,

        Customer: staticData.Customer,
        Base: staticData.Base,
        Aircraft: staticData.Aircraft,

        StartLocation: faker.location.city(),
        EndLocation: faker.location.city(),

        StartDate: formatDate(startDate),
        MeetDate: formatDate(meetDate),
        ReturnDate: formatDate(returnDate),
        EndDate: formatDate(endDate),

        StartTime: '08:00',
        MeetTime: '09:00',
        ReturnTime: '17:00',
        EndTime: '18:00',

        MeetLocation: faker.location.streetAddress(),
        ReturnLocation: faker.location.city(),

        Pilot: staticData.Pilot,
        ApprovingClient: staticData.ApprovingClient,
        ApprovingCompany: staticData.ApprovingCompany
    };
}

module.exports = {
    generateBooking
};