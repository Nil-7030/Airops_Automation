class ResetPasswordPage {


    constructor(page) {

        this.page = page;

        this.resetPasswordLink = page.getByRole('link', { name: 'Click here to reset your password' });
        this.enterEmailInput = page.getByRole('textbox', { name: 'Enter email' });
        this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
        this.loginSuccessMsg= page.locator("//div[contains(@class,'Toastify__toast-body')]")
    }

    async clickResetPasswordLink() {
        await this.resetPasswordLink.click();

    }

    async emailInput(username) {
        await this.enterEmailInput.fill(username);
    }

    async clickResetPasswordButton() {
        await this.resetPasswordButton.click();
    }

    async resetPassword(username) {
        await this.clickResetPasswordLink();
        await this.emailInput(username);
        await this.clickResetPasswordButton();
    }

}

module.exports = ResetPasswordPage;