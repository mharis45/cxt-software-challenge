import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

class CartPage extends BasePage {
  private get emptyCartView() {
    return $(id('noItemCL'));
  }

  private get cartItemTitle() {
    return $(id('titleTV'));
  }

  private get removeItemButton() {
    return $(id('removeBt'));
  }

  private get totalPriceLabel() {
    return $(id('totalPriceTV'));
  }

  private get checkoutButton() {
    return $('~Confirms products for checkout');
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyCartView.waitForDisplayed({ timeout: 5000 }).catch(() => false);
  }

  async getItemTitle(): Promise<string> {
    await this.cartItemTitle.waitForDisplayed();
    return this.cartItemTitle.getText();
  }

  async getTotalPriceText(): Promise<string> {
    await this.totalPriceLabel.waitForDisplayed();
    return this.totalPriceLabel.getText();
  }

  async removeFirstItem(): Promise<void> {
    await this.removeItemButton.waitForDisplayed();
    await this.removeItemButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.waitForDisplayed();
    await this.checkoutButton.click();
  }

  async waitForEmptyState(): Promise<void> {
    await this.emptyCartView.waitForDisplayed({ timeout: 10000 });
  }
}

export default new CartPage();
