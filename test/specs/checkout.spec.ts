import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import CatalogPage from '../pageobjects/catalog.page.js';
import ProductDetailPage from '../pageobjects/productDetail.page.js';
import CartPage from '../pageobjects/cart.page.js';
import CheckoutInfoPage from '../pageobjects/checkoutInfo.page.js';
import PaymentInfoPage from '../pageobjects/paymentInfo.page.js';
import PlaceOrderPage from '../pageobjects/placeOrder.page.js';
import CheckoutCompletePage from '../pageobjects/checkoutComplete.page.js';
import { VALID_USER } from '../data/users.js';
import { VALID_SHIPPING_ADDRESS, SHIPPING_ADDRESS_WITH_INVALID_ZIP } from '../data/shipping.js';
import { VALID_PAYMENT_CARD } from '../data/payment.js';
import { launchFreshApp } from '../support/appLifecycle.js';

describe('Checkout', () => {
  beforeEach(async () => {
    await launchFreshApp();
    await LoginPage.navigateToLogin();
    await LoginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(CatalogPage.isDisplayed()).resolves.toBe(true);

    const [firstProductName] = await CatalogPage.getProductNames();
    await CatalogPage.openProductByName(firstProductName);
    await ProductDetailPage.addToCart();
    await ProductDetailPage.openCart();
    await CartPage.proceedToCheckout();
    await expect(CheckoutInfoPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-CHECKOUT-01 (E2E): a full purchase completes with a confirmation screen', async () => {
    await CheckoutInfoPage.fill(VALID_SHIPPING_ADDRESS);
    await CheckoutInfoPage.submit();

    await expect(PaymentInfoPage.isDisplayed()).resolves.toBe(true);
    await PaymentInfoPage.fill(VALID_PAYMENT_CARD);
    await PaymentInfoPage.submit();

    await expect(PlaceOrderPage.isDisplayed()).resolves.toBe(true);
    await PlaceOrderPage.placeOrder();

    await expect(CheckoutCompletePage.isDisplayed()).resolves.toBe(true);
    const thankYou = await CheckoutCompletePage.getThankYouText();
    expect(thankYou.toLowerCase()).toContain('thank you');
  });

  it('TC-CHECKOUT-02: submitting with all required fields empty blocks progression', async () => {
    await CheckoutInfoPage.submit();

    await expect(CheckoutInfoPage.areRequiredFieldErrorsShown()).resolves.toBe(true);
    await expect(PlaceOrderPage.isDisplayed()).resolves.toBe(false);
  });

  it('TC-CHECKOUT-03: an invalid, non-numeric Zip Code is (incorrectly) accepted', async () => {
    await CheckoutInfoPage.fill(SHIPPING_ADDRESS_WITH_INVALID_ZIP);
    await CheckoutInfoPage.submit();

    await expect(PaymentInfoPage.isDisplayed()).resolves.toBe(true);
  });
});
