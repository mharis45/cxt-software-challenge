import BasePage from './base.page.js';

const PKG = 'com.saucelabs.mydemoapp.android';
const id = (resId: string) => `android=new UiSelector().resourceId("${PKG}:id/${resId}")`;

export interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
}

class PaymentInfoPage extends BasePage {
  private get cardHolderNameInput() {
    return $(id('nameET'));
  }
  private get cardNumberInput() {
    return $(id('cardNumberET'));
  }
  private get expirationDateInput() {
    return $(id('expirationDateET'));
  }
  private get securityCodeInput() {
    return $(id('securityCodeET'));
  }
  private get continueButton() {
    return $('~Saves payment info and launches screen to review checkout data');
  }

  async isDisplayed(): Promise<boolean> {
    return this.cardNumberInput.waitForDisplayed({ timeout: 10000 }).catch(() => false);
  }

  async fill(card: PaymentCard): Promise<void> {
    await this.cardHolderNameInput.waitForDisplayed();
    await this.cardHolderNameInput.setValue(card.cardHolderName);
    await this.cardNumberInput.setValue(card.cardNumber);
    await this.expirationDateInput.setValue(card.expirationDate);
    await this.securityCodeInput.setValue(card.securityCode);
  }

  async submit(): Promise<void> {
    await this.continueButton.waitForDisplayed();
    await this.continueButton.click();
  }
}

export default new PaymentInfoPage();
