import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

class CatalogPage extends BasePage {
  private get productList() {
    return $(id('productRV'));
  }

  private get productTitles() {
    return $$(id('titleTV'));
  }

  private get productPrices() {
    return $$(id('priceTV'));
  }

  private get sortByNameAsc() {
    return $('~Ascending order by name');
  }

  private get sortByNameDesc() {
    return $('~Descending order by name');
  }

  private get sortByPriceAsc() {
    return $('~Ascending order by price');
  }

  private get sortByPriceDesc() {
    return $('~Descending order by price');
  }

  async isDisplayed(): Promise<boolean> {
    return this.productList.waitForDisplayed({ timeout: 15000 }).catch(() => false);
  }

  async getProductNames(): Promise<string[]> {
    await this.productList.waitForDisplayed();
    const titles = await this.productTitles;
    return titles.map((el) => el.getText());
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices;
    const texts = await prices.map((el) => el.getText());
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, '')));
  }

  async openProductByName(name: string): Promise<void> {
    const target = await $(
      `//*[@text="${name}"]/preceding-sibling::*[@resource-id="${PKG}:id/productIV"]`
    );
    await target.waitForDisplayed();
    await target.click();
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.openSortDialog();
    await this.sortByPriceAsc.waitForDisplayed();
    await this.sortByPriceAsc.click();
  }

  async sortByNameZToA(): Promise<void> {
    await this.openSortDialog();
    await this.sortByNameDesc.waitForDisplayed();
    await this.sortByNameDesc.click();
  }

  async sortByNameAToZ(): Promise<void> {
    await this.openSortDialog();
    await this.sortByNameAsc.waitForDisplayed();
    await this.sortByNameAsc.click();
  }

  async sortByPriceHighToLow(): Promise<void> {
    await this.openSortDialog();
    await this.sortByPriceDesc.waitForDisplayed();
    await this.sortByPriceDesc.click();
  }
}

export default new CatalogPage();
