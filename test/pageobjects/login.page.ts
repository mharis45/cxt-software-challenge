import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

class LoginPage extends BasePage {
  private get usernameInput() {
    return $(id('nameET'));
  }

  private get passwordInput() {
    return $(id('passwordET'));
  }

  private get loginButton() {
    return $('~Tap to login with given credentials');
  }

  private get loginMenuItem() {
    return $('~Login Menu Item');
  }

  private get usernameError() {
    return $(id('nameErrorTV'));
  }

  private get passwordError() {
    return $(id('passwordErrorTV'));
  }

  private get lockedOutMessage() {
    return $('//*[contains(@text, "locked out")]');
  }

  async isDisplayed(): Promise<boolean> {
    return this.usernameInput.waitForDisplayed({ timeout: 10000 }).catch(() => false);
  }

  async navigateToLogin(): Promise<void> {
    await this.openDrawerMenu();
    await this.loginMenuItem.waitForDisplayed();
    await this.loginMenuItem.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.waitForDisplayed();
    await this.usernameInput.setValue(username);
    if (password) {
      await this.passwordInput.setValue(password);
    }
    await this.loginButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.loginButton.waitForDisplayed();
    await this.loginButton.click();
  }

  async getUsernameErrorText(): Promise<string> {
    await this.usernameError.waitForDisplayed();
    return this.usernameError.getText();
  }

  async getPasswordErrorText(): Promise<string> {
    await this.passwordError.waitForDisplayed();
    return this.passwordError.getText();
  }

  async isLockedOutMessageShown(): Promise<boolean> {
    return this.lockedOutMessage.waitForDisplayed({ timeout: 8000 }).catch(() => false);
  }
}

export default new LoginPage();
