import {test, expect} from '@playwright/test';
const ResetPasswordPage = require('../pages/ResetPasswordPage.js');
const env = require('../config/env');
import testData from '../fixtures/testdata.json';

test('Reset password', async ({page}) => {

    const  resetPasswordPage = new ResetPasswordPage(page);
    
    await page.goto(env.qa.url);
   
    await resetPasswordPage.clickResetPasswordLink();
    await resetPasswordPage.emailInput(testData.username[1]);
    await resetPasswordPage.clickResetPasswordButton();
    await page.waitForTimeout(10000);
    await expect(
        page.locator("//div[contains(@class,'Toastify__toast-body')]")
    ).toHaveText('Reset Link Sent Successfully');

});
