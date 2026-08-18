export default abstract class BasePage {
  private get menuIcon() {
    return $('~View menu');
  }

  private get sortIcon() {
    return $('~Shows current sorting order and displays available sorting options');
  }

  private get cartIcon() {
    return $('~View cart');
  }

  private get cartBadgeCount() {
    return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")');
  }

  async openDrawerMenu(): Promise<void> {
    await this.menuIcon.waitForDisplayed();
    await this.menuIcon.click();
  }

  async openSortDialog(): Promise<void> {
    await this.sortIcon.waitForDisplayed();
    await this.sortIcon.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.waitForDisplayed();
    await this.cartIcon.click();
  }

  async cartItemCount(): Promise<number> {
    if (!(await this.cartBadgeCount.isExisting())) {
      return 0;
    }
    const text = await this.cartBadgeCount.getText();
    return Number(text) || 0;
  }
}
