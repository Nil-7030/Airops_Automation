const { test: base } = require('@playwright/test');
const AdminLoginPage = require('../pages/AdminLoginPage');
const FlightOpsPage = require('../pages/FlightOpsPage');
const ResetPasswordPage = require('../pages/ResetPasswordPage');
const testData = require('./testdata.json');
const env = require('../config/env');

const test = base.extend({

    
    adminLoginPage: async ({ page }, use) => {
        const adminLoginPage = new AdminLoginPage(page);
        await use(adminLoginPage);
    },

    
    flightOpsPage: async ({ page }, use) => {
        const flightOpsPage = new FlightOpsPage(page);
        await use(flightOpsPage);
    },

    
    resetPasswordPage: async ({ page }, use) => {
        const resetPasswordPage = new ResetPasswordPage(page);
        await use(resetPasswordPage);
    },

    
    testData: async ({ }, use) => {
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