const { test: base } = require('@playwright/test');
const AdminLoginPage = require('../pages/AdminLoginPage');
const FlightOpsPage = require('../pages/FlightOpsPage');
const ResetPasswordPage = require('../pages/ResetPasswordPage');
const FlightReport = require('../pages/FlightReportFilterPage');   
const testData = require('./testdata.json');
const env = require('../config/env');

const test = base.extend({

    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },

    flightOpsPage: async ({ page }, use) => {
        await use(new FlightOpsPage(page));
    },

    resetPasswordPage: async ({ page }, use) => {
        await use(new ResetPasswordPage(page));
    },

    flightReport: async ({ page }, use) => {       // ← add this fixture
        await use(new FlightReport(page));
    },

    testData: async ({}, use) => {
        await use(testData);
    },

    autoLogin: [async ({ page, adminLoginPage }, use) => {
        await page.goto(env.qa.url);
        await adminLoginPage.login(
            testData.username[0],
            testData.password
        );
        await page.waitForLoadState('networkidle');
        await use();
    }, { auto: true }]

});

module.exports = { test, expect: base.expect };