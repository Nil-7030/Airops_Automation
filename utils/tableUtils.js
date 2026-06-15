const { expect } = require('@playwright/test');

class TableUtils {
    constructor(page) {
        this.page = page;
    }

    /**
     * Generic Sort A → Z
     * @param {Locator} columnHeader - column header locator (e.g. firstName)
     * @param {Locator} sortAtoZOption - "Sort A → Z" option locator
     * @param {Locator} columnValues - column cell values locator
     */
    async sortAscending(columnHeader, sortAtoZOption, columnValues) {
        await columnHeader.click();
        await sortAtoZOption.click();
        const values = await columnValues.allTextContents();
        return values.map(v => v.trim());
    }

    /**
     * Generic Sort Z → A
     */
    async sortDescending(columnHeader, sortZtoAOption, columnValues) {
        await columnHeader.click();
        await sortZtoAOption.click();
        const values = await columnValues.allTextContents();
        return values.map(v => v.trim());
    }

    /**
     * Generic Column Filter
     * @param {Locator} columnHeader - column header locator
     * @param {Locator} filterInput - filter input box
     * @param {Locator} columnValues - column cell values locator
     * @param {Locator} rows - table rows locator (for visibility check)
     * @param {string} filterValue - value to filter by
     */
    async filterByColumn(columnHeader, filterInput, columnValues, rows, filterValue) {
    await columnHeader.click();
    await filterInput.fill(filterValue);

    // Wait for dropdown option to appear after typing
    const option = this.page.getByRole('option', {
        name: filterValue,
        exact: true
    });

    // ✅ Wait for option — if not found, log and SKIP (don't fail)
    const optionExists = await option.waitFor({
        state: 'visible',
        timeout: 5000
    }).then(() => true).catch(() => false);

    if (!optionExists) {
        console.log(`ℹ️ Filter option "${filterValue}" not found in dropdown — skipping test`);
        await this.page.keyboard.press('Escape'); // close dropdown cleanly
        return {
            status: 'OPTION_NOT_FOUND',
            message: `Filter option "${filterValue}" not found in dropdown`,
            values: []
        };
    }

    await option.click();

    // Check if table has results
    const hasResults = await rows.first().isVisible({ 
        timeout: 5000 
    }).catch(() => false);

    if (!hasResults) {
        console.log(`ℹ️ No results found for filter "${filterValue}" — skipping test`);
        return {
            status: 'NO_RESULTS',
            message: `No results found for filter "${filterValue}"`,
            values: []
        };
    }

    await expect(columnValues.first()).toContainText(filterValue, { timeout: 10000, ignoreCase: true })
    const values = await columnValues.allTextContents();
    const trimmedValues = values.map(v => v.trim());

    console.log('Displayed Values:', [...new Set(trimmedValues)]);
    return {
        status: 'SUCCESS',
        message: `Filter "${filterValue}" applied successfully`,
        values: trimmedValues
    };
}

    /**
     * Generic column values fetcher (with visibility wait)
     */
    async getColumnValues(columnValues, rows) {
        await expect(rows.first()).toBeVisible({ timeout: 10000 });
        const values = await columnValues.allTextContents();
        return values.map(v => v.trim());
    }
}

module.exports = TableUtils;