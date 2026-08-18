import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

class ProductDetailPage extends BasePage {
  private get title() {
    return $(id('productTV'));
  }

  private get addToCartButton() {
    return $(id('cartBt'));
  }

  async isDisplayed(): Promise<boolean> {
    return this.title.waitForDisplayed({ timeout: 10000 }).catch(() => false);
  }

  async getTitle(): Promise<string> {
    await this.title.waitForDisplayed();
    return this.title.getText();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.waitForDisplayed();
    await this.addToCartButton.click();
  }
}

export default new ProductDetailPage();
