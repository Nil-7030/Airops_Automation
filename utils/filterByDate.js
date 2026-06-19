class filterByDate {

    static async selectRandomDate(page, fromCalendar, toCalendar) {

        const startDay = Math.floor(Math.random() * 28) + 1;
        const toDay = Math.floor(Math.random() * (29 - startDay)) + startDay;

        await fromCalendar.click();
        await page.getByRole('button', { name: String(startDay), exact: true })
            .first()
            .click();

        await toCalendar.click();
        await page.getByRole('button', { name: String(toDay), exact: true })
            .first()
            .click();

        return { startDay, toDay };
    }
}

module.exports = filterByDate;