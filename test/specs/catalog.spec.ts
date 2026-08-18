import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import CatalogPage from '../pageobjects/catalog.page.js';
import { VALID_USER } from '../data/users.js';
import { launchFreshApp } from '../support/appLifecycle.js';

describe('Product Catalog sorting', () => {
  beforeEach(async () => {
    await launchFreshApp();
    await LoginPage.navigateToLogin();
    await LoginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(CatalogPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-CATALOG-01: sorting by price (low to high) orders the list ascending', async () => {
    await CatalogPage.sortByPriceLowToHigh();

    const prices = await CatalogPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('TC-CATALOG-02: sorting by name (Z to A) orders the list descending alphabetically', async () => {
    await CatalogPage.sortByNameZToA();

    const names = await CatalogPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});
