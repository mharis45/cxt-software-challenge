import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import CatalogPage from '../pageobjects/catalog.page.js';
import ProductDetailPage from '../pageobjects/productDetail.page.js';
import CartPage from '../pageobjects/cart.page.js';
import { VALID_USER } from '../data/users.js';
import { launchFreshApp } from '../support/appLifecycle.js';

describe('Cart', () => {
  beforeEach(async () => {
    await launchFreshApp();
    await LoginPage.navigateToLogin();
    await LoginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(CatalogPage.isDisplayed()).resolves.toBe(true);

    const [firstProductName] = await CatalogPage.getProductNames();
    await CatalogPage.openProductByName(firstProductName);
    await expect(ProductDetailPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-CART-01: adding a product updates the header cart badge and cart contents', async () => {
    const productName = await ProductDetailPage.getTitle();
    await ProductDetailPage.addToCart();

    await expect(ProductDetailPage.cartItemCount()).resolves.toBe(1);

    await ProductDetailPage.openCart();
    await expect(CartPage.getItemTitle()).resolves.toBe(productName);
  });

  it('TC-CART-02: removing the only item returns the cart to its empty state', async () => {
    await ProductDetailPage.addToCart();
    await ProductDetailPage.openCart();
    await expect(CartPage.isEmpty()).resolves.toBe(false);

    await CartPage.removeFirstItem();

    await CartPage.waitForEmptyState();
    await expect(CartPage.cartItemCount()).resolves.toBe(0);
  });
});
