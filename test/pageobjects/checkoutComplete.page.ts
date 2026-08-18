import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

class CheckoutCompletePage extends BasePage {
  private get completeHeading() {
    return $(id('completeTV'));
  }

  private get thankYouMessage() {
    return $(id('thankYouTV'));
  }

  async isDisplayed(): Promise<boolean> {
    return this.completeHeading.waitForDisplayed({ timeout: 15000 }).catch(() => false);
  }

  async getThankYouText(): Promise<string> {
    await this.thankYouMessage.waitForDisplayed();
    return this.thankYouMessage.getText();
  }
}

export default new CheckoutCompletePage();
