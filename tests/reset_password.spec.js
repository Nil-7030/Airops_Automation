const { test, expect } = require('../fixtures/base.fixture');

test('Reset password', async ({page}) => {
 
    await resetPasswordPage.clickResetPasswordLink();
    await resetPasswordPage.emailInput(testData.username[1]);
    await resetPasswordPage.clickResetPasswordButton();
    await page.waitForTimeout(10000);
    await expect(loginSuccessMsg).toHaveText('Reset Link Sent Successfully');

     console.log("Password Reset Succesfully")

});
