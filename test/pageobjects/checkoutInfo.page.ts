import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  state?: string;
  country: string;
}

class CheckoutInfoPage extends BasePage {
  private get fullNameInput() {
    return $(id('fullNameET'));
  }
  private get address1Input() {
    return $(id('address1ET'));
  }
  private get address2Input() {
    return $(id('address2ET'));
  }
  private get cityInput() {
    return $(id('cityET'));
  }
  private get zipInput() {
    return $(id('zipET'));
  }
  private get stateInput() {
    return $(id('stateET'));
  }
  private get countryInput() {
    return $(id('countryET'));
  }
  private get continueButton() {
    return $('~Saves user info for checkout');
  }

  private get fullNameError() {
    return $(id('fullNameErrorTV'));
  }
  private get address1Error() {
    return $(id('address1ErrorTV'));
  }
  private get cityError() {
    return $(id('cityErrorTV'));
  }
  private get zipError() {
    return $(id('zipErrorTV'));
  }
  private get countryError() {
    return $(id('countryErrorTV'));
  }

  async isDisplayed(): Promise<boolean> {
    return this.fullNameInput.waitForDisplayed({ timeout: 10000 }).catch(() => false);
  }

  async fill(address: ShippingAddress): Promise<void> {
    await this.fullNameInput.waitForDisplayed();
    await this.fullNameInput.setValue(address.fullName);
    await this.address1Input.setValue(address.address1);
    if (address.address2) await this.address2Input.setValue(address.address2);
    await this.cityInput.setValue(address.city);
    await this.zipInput.setValue(address.zip);
    if (address.state) await this.stateInput.setValue(address.state);
    await this.countryInput.setValue(address.country);
  }

  async submit(): Promise<void> {
    await this.continueButton.waitForDisplayed();
    await this.continueButton.click();
  }

  async areRequiredFieldErrorsShown(): Promise<boolean> {
    const checks = await Promise.all([
      this.fullNameError.isDisplayed(),
      this.address1Error.isDisplayed(),
      this.cityError.isDisplayed(),
      this.zipError.isDisplayed(),
      this.countryError.isDisplayed(),
    ]);
    return checks.every(Boolean);
  }
}

export default new CheckoutInfoPage();
