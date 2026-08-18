import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import CatalogPage from '../pageobjects/catalog.page.js';
import { VALID_USER, LOCKED_USER } from '../data/users.js';
import { launchFreshApp } from '../support/appLifecycle.js';

describe('Login', () => {
  beforeEach(async () => {
    await launchFreshApp();
    await LoginPage.navigateToLogin();
    await expect(LoginPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-LOGIN-01: valid credentials log the user into the product catalog', async () => {
    await LoginPage.login(VALID_USER.username, VALID_USER.password);

    await expect(CatalogPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-LOGIN-02: a locked-out account is rejected with an explicit message', async () => {
    await LoginPage.login(LOCKED_USER.username, LOCKED_USER.password);

    await expect(LoginPage.isLockedOutMessageShown()).resolves.toBe(true);
    await expect(LoginPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-LOGIN-03: submitting with both fields empty shows a username-required error', async () => {
    await LoginPage.submitEmptyForm();

    const errorText = await LoginPage.getUsernameErrorText();
    expect(errorText.toLowerCase()).toContain('required');
    await expect(LoginPage.isDisplayed()).resolves.toBe(true);
  });

  it('TC-LOGIN-04: username filled but password empty shows a password-required error', async () => {
    await LoginPage.login(VALID_USER.username, '');

    const errorText = await LoginPage.getPasswordErrorText();
    expect(errorText.toLowerCase()).toContain('password');
    await expect(LoginPage.isDisplayed()).resolves.toBe(true);
  });
});
