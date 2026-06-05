class LoginPage {

    constructor(page) {
        this.page = page;

        this.usernameInput = page.getByRole('textbox', { name: 'Enter email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Enter password' });
        this.loginbutton = page.getByRole('button', { name: 'GO' });

    }

    async enterUsername(username) {
        await this.usernameInput.fill(username);
    };


    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLoginbutton() {
        await this.loginbutton.click();
    }

    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginbutton();
    }

}

module.exports = LoginPage;
