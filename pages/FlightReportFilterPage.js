const TableUtils = require('../utils/tableUtils');

class FlightReportFilterPage {
    constructor(page) {
        this.page = page;
        this.tableUtils = new TableUtils(page);

        // Navigation
        this.flightOpsHeading = page.getByRole('button', { name: 'Flight Ops' });
        this.flightReportMenu = page.getByRole('menuitem', { name: 'Flight Report' });

        // Global filter icon
        this.filterIcon = page.getByRole('img', { name: 'filter' });

        // Sort menu items
        this.sortAtoZ = page.getByRole('menuitem', { name: 'Sort A → Z' });
        this.sortZtoA = page.getByRole('menuitem', { name: 'Sort Z → A' });

        // Table rows
        this.tableRows = page.locator('tbody tr');

        // Column configuration
        this.columns = {
            approvalStatus: {
                header: page.getByRole('button', { name: 'Approval status', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Status' }),
            },

            pilot: {
                header: page.getByRole('button', { name: 'Pilot', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Pilot' }),
            },
            aircraft: {
                header: page.getByRole('button', { name: 'Aircraft', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Aircraft' }),
            },
            customer: {
                header: page.getByRole('button', { name: 'Customer', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Customer' }),
            },
            ame: {
                header: page.getByRole('button', { name: 'AME', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'AME' }),
            },
            approvedBy: {
                header: page.getByRole('button', { name: 'Approved by', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Approved By' }),
            },
            invoiceNumber: {
                header: page.getByRole('button', { name: 'Invoice Number', exact: true }),
                filterInput: page.getByRole('textbox', { name: 'Invoice Number' }),
            },
        };
    }

    async navigateToFlightReport() {
        await this.flightOpsHeading.click();
        await this.flightReportMenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    async activateFilter() {
        await this.filterIcon.click();
    }

    #getColumn(columnKey) {
        const column = this.columns[columnKey];

        if (!column) {
            throw new Error(
                `Unknown column key: "${columnKey}". Valid keys: ${Object.keys(this.columns).join(', ')}`
            );
        }

        return column;
    }

    async filterColumn(columnKey, filterValue) {
        const column = this.#getColumn(columnKey);

        // Open filter mode
        await this.activateFilter();

        // Open column filter
        await column.header.click();

        // Wait for filter input
        await column.filterInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        return await this.tableUtils.filterByColumn(
            column.header,
            column.filterInput,
            this.tableRows,
            filterValue
        );
    }

    // ── Sort ───────────────────────────────────────────────────────────────
    async sortColumnAscending(columnKey) {
        const column = this.#getColumn(columnKey);
        return this.tableUtils.sortAscending(
            column.header,
            this.sortAtoZ,
            this.tableRows
        );
    }

    async sortColumnDescending(columnKey) {
        const column = this.#getColumn(columnKey);
        return this.tableUtils.sortDescending(
            column.header,
            this.sortZtoA,
            this.tableRows
        );
    }
}

module.exports = FlightReportFilterPage;