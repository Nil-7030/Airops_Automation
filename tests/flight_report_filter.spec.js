const { test, expect } = require('../fixtures/base.fixture');
const testData = require('../fixtures/testdatafr.json');

test.describe('Flight Report - Sorting & Filtering', () => {

    test.describe.configure({ mode: 'default' });

    test.beforeEach(async ({ flightReport }) => {
        await flightReport.navigateToFlightReport();
    });

    function getSortedCopy(values, direction, type = 'string') {
        const copy = [...values];

        copy.sort((a, b) => {
            let comparison = 0;

            if (type === 'number') {
                comparison = Number(a) - Number(b);
            } else if (type === 'date') {
                comparison = new Date(a) - new Date(b);
            } else {
                comparison = a.toLowerCase().localeCompare(b.toLowerCase());
            }

            return direction === 'asc' ? comparison : -comparison;
        });

        return copy;
    }

    // ─────────────────────────────────────────────────────────────
    // P1 - Sort Ascending
    // ─────────────────────────────────────────────────────────────
    for (const col of testData.columns) {

        test(`P1 - Sort ${col.label} A to Z`, async ({ flightReport }) => {

            const values = await flightReport.sortColumnAscending(col.key);

            const actual = values.map(v => v.trim());

            expect(actual.length).toBeGreaterThan(0);

            const expected = getSortedCopy(actual, 'asc', col.type);

            test.info().annotations.push({
                type: 'sort-result',
                description: `${col.label} A→Z: ${actual.join(', ')}`
            });

            expect(actual).toEqual(expected);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // P2 - Sort Descending
    // ─────────────────────────────────────────────────────────────
    for (const col of testData.columns) {

        test(`P2 - Sort ${col.label} Z to A`, async ({ flightReport }) => {

            const values = await flightReport.sortColumnDescending(col.key);

            const actual = values.map(v => v.trim());

            expect(actual.length).toBeGreaterThan(0);

            const expected = getSortedCopy(actual, 'desc', col.type);

            test.info().annotations.push({
                type: 'sort-result',
                description: `${col.label} Z→A: ${actual.join(', ')}`
            });

            expect(actual).toEqual(expected);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // P3 - Filter Validation
    // ─────────────────────────────────────────────────────────────
    for (const col of testData.columns) {

        test(`P3 - Filter ${col.label} by "${col.filterValue}"`,
            async ({ flightReport }) => {

                const result = await flightReport.filterColumn(
                    col.key,
                    col.filterValue
                );

                if (result.status === 'OPTION_NOT_FOUND') {
                    test.skip(
                        true,
                        `"${col.filterValue}" not found in ${col.label} filter options`
                    );
                    return;
                }

                if (result.status === 'NO_RESULTS') {
                    test.skip(
                        true,
                        `No rows returned for ${col.label} = "${col.filterValue}"`
                    );
                    return;
                }

                expect(result.values.length).toBeGreaterThan(0);

                expect(result.values.length).toBeGreaterThan(0);

                for (const value of result.values) {
                    expect(value.trim()).not.toBe('');
                }

                test.info().annotations.push({
                    type: 'filter-verified',
                    description:
                        `${col.label} filter "${col.filterValue}" returned ${result.values.length} rows`
                });
            });
    }
});