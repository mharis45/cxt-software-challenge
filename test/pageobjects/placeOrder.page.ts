import BasePage from './base.page.js';

class PlaceOrderPage extends BasePage {
  private get placeOrderButton() {
    return $('~Completes the process of checkout');
  }

  async isDisplayed(): Promise<boolean> {
    return this.placeOrderButton.waitForDisplayed({ timeout: 10000 }).catch(() => false);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.waitForDisplayed();
    await this.placeOrderButton.click();
  }
}

export default new PlaceOrderPage();
