const { expect } = require('@playwright/test');
const TableUtils = require('../utils/tableUtils');

class FlightOpsPage {

    constructor(page) {
        this.page = page;
        this.tableUtils = new TableUtils(page);

        this.flightOpsHeading = page.getByRole('heading', { name: 'Flight Ops' });
        this.weeklyReport = page.getByRole('menuitem', { name: 'Weekly' });
        this.weeklyDate = page.locator('.selected-week-calendar h6');
        this.previousWeekArrow = page.locator('.calendar-actions-wrapper svg').first();
        this.nextWeekArrow = page.locator('.calendar-actions-wrapper svg').last();

        this.flightOpsTable = page.getByRole('table', { name: 'custom pagination table' });
        this.flightOpsRows = this.flightOpsTable.getByRole('rowgroup').nth(1).getByRole('row');

        this.sortAtoZ = page.getByRole('menuitem', { name: 'Sort A → Z' });
        this.sortZtoA = page.getByRole('menuitem', { name: 'Sort Z → A' });

        // ✅ DYNAMIC COLUMN CONFIG — add any column here
        this.columns = {
            firstName: {
                header: page.getByRole('columnheader', { name: 'First Name' }),
                filterInput: page.getByRole('textbox', { name: 'First Name' }),
                values: page.locator('tbody tr th:first-child')
                
            },
            lastName: {
                header: page.getByRole('columnheader', { name: 'Last Name' }),
                filterInput: page.getByRole('textbox', { name: 'Last Name' }),
                values: page.locator('tbody tr th:nth-child(2)') 
            },
            department: {
                header: page.getByRole('columnheader', { name: 'Department' }),
                filterInput: page.getByRole('textbox', { name: 'Department' }),
                values: page.locator('tbody tr th:nth-child(3)')
            },
            status: {
                header: page.getByRole('columnheader', { name: 'Status' }),
                filterInput: page.getByRole('textbox', { name: 'Status' }),
                values: page.locator('tbody tr th:nth-child(5)')
            },
            supervisor: {
                header: page.getByRole('columnheader', { name: 'Supervisor' }),
                filterInput: page.getByRole('textbox', { name: 'Supervisor' }),
                values: page.locator('tbody tr th:nth-child(6)')
            },
            
        };

        
        this.lastName = this.columns.lastName.header;
        this.department = this.columns.department.header;
        this.total = page.getByRole('button', { name: 'Total' });
        this.status = this.columns.status.header;
        this.supervisor = this.columns.supervisor.header;
        this.missingReceipts = page.getByRole('button', { name: 'Missing Receipts' });
        this.reviewedBy = page.getByRole('button', { name: 'Reviewed By' });
        this.approvedBy = page.getByRole('button', { name: 'Approved By' });
        this.firstName = this.columns.firstName.header;
    }

    async clickFlightOpsHeading() {
        await this.flightOpsHeading.click();
    }

    async verifyWeeklyReportSelection() {
        await expect(this.weeklyReport).toBeFocused();
    }

    async flightOperations() {
        await this.clickFlightOpsHeading();
        await this.verifyWeeklyReportSelection();
    }

    async weeklydateVerify() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.weeklyDate).toBeVisible({ timeout: 10000 });
    }

    async getWeeklyDateText() {
        return (await this.weeklyDate.textContent()).replace(/\s+/g, ' ').trim();
    }

    async clickPreviousWeek() {
        await this.previousWeekArrow.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clickNextWeek() {
        await this.nextWeekArrow.click();
        await this.page.waitForLoadState('networkidle');
    }

    async weeklyNavigation() {
        await this.clickPreviousWeek();
        await expect(this.weeklyDate).toBeVisible();
        await this.clickNextWeek();
        await expect(this.weeklyDate).toBeVisible();
    }

    async verifyColumnHeaders() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstName).toBeVisible({ timeout: 10000 });
        await expect(this.lastName).toBeVisible();
        await expect(this.department).toBeVisible();
        await expect(this.total).toBeVisible();
        await expect(this.status).toBeVisible();
        await expect(this.supervisor).toBeVisible();
        await expect(this.missingReceipts).toBeVisible();
        await expect(this.reviewedBy).toBeVisible();
        await expect(this.approvedBy).toBeVisible();
    }

    // ============================================
    // ✅ GENERIC METHODS — work for ANY column
    // ============================================

    /**
     * Sort any column A → Z
     * @param {string} columnKey - key from this.columns (e.g. 'firstName', 'lastName')
     */
    async sortColumnAscending(columnKey) {
        const column = this.columns[columnKey];
        if (!column) throw new Error(`Unknown column: ${columnKey}`);

        return this.tableUtils.sortAscending(
            column.header,
            this.sortAtoZ,
            column.values
        );
    }

    /**
     * Sort any column Z → A
     * @param {string} columnKey - key from this.columns
     */
    async sortColumnDescending(columnKey) {
        const column = this.columns[columnKey];
        if (!column) throw new Error(`Unknown column: ${columnKey}`);

        return this.tableUtils.sortDescending(
            column.header,
            this.sortZtoA,
            column.values
        );
    }

    /**
     * Filter any column by value
     * @param {string} columnKey - key from this.columns
     * @param {string} filterValue - value to filter by
     */
    async filterColumn(columnKey, filterValue) {
        const column = this.columns[columnKey];
        if (!column) throw new Error(`Unknown column: ${columnKey}`);

        return this.tableUtils.filterByColumn(
            column.header,
            column.filterInput,
            column.values,
            this.flightOpsRows,
            filterValue
        );
    }

    /**
     * Get current values of any column
     * @param {string} columnKey - key from this.columns
     */
    async getColumnValues(columnKey) {
        const column = this.columns[columnKey];
        if (!column) throw new Error(`Unknown column: ${columnKey}`);

        return this.tableUtils.getColumnValues(
            column.values,
            this.flightOpsRows
        );
    }
}

module.exports = FlightOpsPage;