class TableUtils {
    constructor(page) {
        this.page = page;
    }

    // Get column index dynamically from table header
    async getColumnIndex(columnHeader) {
        const headerText = (await columnHeader.innerText()).trim();

        const headers = this.page.locator('thead th');
        const count = await headers.count();

        for (let i = 0; i < count; i++) {
            const text = (await headers.nth(i).innerText()).trim();

            if (text === headerText) {
                return i + 1;
            }
        }

        throw new Error(`Column header "${headerText}" not found in table.`);
    }

    // Read all values from a specific column
    async getColumnValues(columnIndex, tableRows) {
        const rowCount = await tableRows.count();
        const values = [];

        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);

            // Supports both td and th cells
            const cell = row.locator(
                `:scope > td:nth-child(${columnIndex}), :scope > th:nth-child(${columnIndex})`
            );

            if (await cell.count()) {
                const text = (await cell.first().innerText()).trim();

                if (text) {
                    values.push(text);
                }
            }
        }

        return values;
    }

    // Sort Ascending
   async sortAscending(columnHeader, sortAtoZMenuItem, tableRows) {
        await columnHeader.click();
        await sortAtoZMenuItem.click();
        await this.page.waitForLoadState('networkidle');

        const colIndex = await this.getColumnIndex(columnHeader);
        return this.getColumnValues(colIndex, tableRows);
    }

    // ── Sort Descending ────────────────────────────────────────────────────
    async sortDescending(columnHeader, sortZtoAMenuItem, tableRows) {
        await columnHeader.click();
        await sortZtoAMenuItem.click();
        await this.page.waitForLoadState('networkidle');

        const colIndex = await this.getColumnIndex(columnHeader);
        return this.getColumnValues(colIndex, tableRows);
    }


    // Filter Column
    async filterByColumn(columnHeader, filterInput, tableRows, filterValue) {
        await filterInput.click();
        await filterInput.fill(filterValue);

        const option = this.page.getByRole('option', {
            name: new RegExp(filterValue, 'i'),
        });

        try {
            await option.waitFor({
                state: 'visible',
                timeout: 5000,
            });
        } catch {
            await this.page.keyboard.press('Escape');

            return {
                status: 'OPTION_NOT_FOUND',
                values: [],
            };
        }

        await option.click();

        await this.page.waitForTimeout(1000);

        const columnIndex = await this.getColumnIndex(columnHeader);
        const values = await this.getColumnValues(columnIndex, tableRows);

        return {
            status: values.length > 0 ? 'OK' : 'NO_RESULTS',
            values,
        };
    }
}

module.exports = TableUtils;