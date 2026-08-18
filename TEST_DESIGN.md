# Test Design Document
Mobile Automation Engineer — Real Work Challenge

**Author:** Haris
**Tool:** Appium 2 (UiAutomator2 driver) + WebdriverIO + TypeScript + Mocha
**Target application:** [Sauce Labs "My Demo App" — Android](https://github.com/saucelabs/my-demo-app-android) v2.2.0
**Platform:** Android (native app, `.apk`, package `com.saucelabs.mydemoapp.android`)

---

## 1. Why this tool and this application

**Tool.** Appium is the standard for native mobile UI automation: it drives real widgets through the platform's own accessibility layer (UiAutomator2 on Android), so tests exercise the app the same way a user does. WebdriverIO adds a Mocha test runner, a built-in Appium service so there's no separate server process to manage, and an Allure reporting integration. TypeScript catches selector and page-object typos at compile time instead of at runtime in CI.

**Application.** Sauce Labs "My Demo App" has enough real business logic to be worth testing: login rules, a sortable product catalog, a cart with running totals, and a multi-step checkout. It's open source, so locators and behavior in this document were checked against the app's actual layout XML and Fragment source, and any evaluator can pull the same APK and reproduce the results.

---

## 2. Scope: what's covered and why

The app has four functional areas, prioritized by user-journey criticality (would a defect here block a purchase) and by risk (where validation is thin or easy to get subtly wrong).

| Area | Priority | Why it's in scope |
|---|---|---|
| **Login / Authentication** | P0 | Gatekeeper for checkout. Any non-empty password is accepted; only one hardcoded username is locked out — an unusual rule worth a regression test. |
| **Product Catalog & Sort** | P1 | Sorting is the app's only real data-correctness feature — it re-orders by two keys in two directions each. Comparator bugs here are easy to introduce and tedious to catch by hand. |
| **Cart** | P0 | Directly gates revenue: wrong totals or a broken "remove item" flow is a business-critical defect. |
| **Checkout (shipping info → payment info → review → confirmation)** | P0 | The core conversion funnel. Its required-field checks are presence-only with no format validation, which makes it a good target for negative and boundary tests, not just happy-path. |

Out of scope: biometric login demo, QR code scanner, drawing pad, geolocation screen, in-app webview — present in the app but not core commerce flows.

---

## 3. Test strategy

- **Page Object Model.** Every screen is a class exposing intent-revealing methods; specs never touch a selector directly. A locator change is a one-line fix in one file.
- **Locators, in priority order:** `resource-id` first, `accessibility id` (`content-desc`) second, text-based XPath only as a last resort for content that has neither (for example a validation toast).
- **Independent tests.** Each spec resets the app to a clean state before every case, rather than depending on execution order or state left over from a previous test.
- **Explicit waits over sleeps.** Every interaction waits on a specific condition (`waitForDisplayed`) with a bounded timeout, never a fixed pause.
- **Positive, negative, and boundary cases per flow**, weighted toward areas where the app's own validation is weak (login password, checkout zip code).
- **Traceability.** Every spec file references the Test Case IDs it implements (§5).
- **Navigation.** The app opens directly to the Product Catalog — Login is reached via the drawer menu, not shown on first launch. Every spec's `beforeEach` accounts for this.

## 4. Rationale summary

- The login negative cases target the app's actual rule (`alice@example.com` is the only locked-out account; password is never validated) rather than a generic "wrong password" guess.
- TC-CHECKOUT-03 is a case designed to document a defect, not just confirm expected behavior — the zip code field accepts `"ABCDE"`.
- TC-CHECKOUT-01 automates a full purchase end to end, in addition to isolated per-screen checks, because "can a user complete a purchase at all" is only verified by chaining the real flow.

---

## 5. Test case catalog

Legend: **P** = Positive, **N** = Negative, **B/E** = Boundary/Edge. "Automated" = implemented in `test/specs/`.

### 5.1 Login (`test/specs/login.spec.ts`)

| ID | Type | Title | Preconditions | Steps | Expected Result | Automated |
|---|---|---|---|---|---|---|
| TC-LOGIN-01 | P | Valid credentials log the user in | App freshly launched, on Login screen | 1. Enter `bod@example.com` in Username 2. Enter any non-empty value in Password 3. Tap **Log In** | User is navigated to the Product Catalog screen | Yes |
| TC-LOGIN-02 | N | Locked-out account is rejected | On Login screen | 1. Enter `alice@example.com` in Username 2. Enter any password 3. Tap **Log In** | Login is blocked; an error indicating the account is locked out is shown; user remains on Login screen | Yes |
| TC-LOGIN-03 | N / B | Both fields empty | On Login screen, fields empty | 1. Tap **Log In** without entering anything | Inline "Username is required" error is shown under the Username field; no navigation occurs | Yes |
| TC-LOGIN-04 | N / B | Username present, password empty | On Login screen | 1. Enter `bod@example.com` in Username 2. Leave Password empty 3. Tap **Log In** | Inline error is shown under the Password field; no navigation occurs | Yes |
| TC-LOGIN-05 | E | Tapping a "saved credentials" quick-fill chip populates the form | On Login screen | 1. Tap the `visual@example.com` quick-fill row | Username field is populated with `visual@example.com` | No — low business risk, UI convenience feature |

### 5.2 Product Catalog & Sort (`test/specs/catalog.spec.ts`)

| ID | Type | Title | Preconditions | Steps | Expected Result | Automated |
|---|---|---|---|---|---|---|
| TC-CATALOG-01 | P | Sort by price, low → high | Logged in, on Product Catalog | 1. Tap sort icon 2. Select "Price (low to high)" | Product list re-renders in strictly ascending price order | Yes |
| TC-CATALOG-02 | P | Sort by name, Z → A | Logged in, on Product Catalog | 1. Tap sort icon 2. Select "Name (Z to A)" | Product list re-renders in strictly descending alphabetical order | Yes |
| TC-CATALOG-03 | E | Default sort on first load | Fresh login | Observe initial product order | List is sorted Name A→Z by default | No — covered implicitly as the pre-state assertion in TC-CATALOG-01/02 |

### 5.3 Cart (`test/specs/cart.spec.ts`)

| ID | Type | Title | Preconditions | Steps | Expected Result | Automated |
|---|---|---|---|---|---|---|
| TC-CART-01 | P | Adding a product updates the cart badge | Logged in, on a Product Detail screen | 1. Tap **Add to Cart** | Header cart badge shows count `1`; product appears in Cart screen with correct name/price | Yes |
| TC-CART-02 | E | Removing the only item empties the cart | Cart contains exactly 1 item | 1. Open Cart 2. Remove the item | Cart switches to its empty-state view ("no items"); badge count clears | Yes |
| TC-CART-03 | N / E | Checkout tapped with an empty cart | Cart is empty | 1. Attempt to reach the checkout button from an empty cart | App does not proceed into the checkout flow with no line items | No — flagged for manual/exploratory follow-up (§6) |

### 5.4 Checkout (`test/specs/checkout.spec.ts`)

| ID | Type | Title | Preconditions | Steps | Expected Result | Automated |
|---|---|---|---|---|---|---|
| TC-CHECKOUT-01 | P (E2E) | Full purchase completes successfully | Logged in as valid user | 1. Add a product to cart 2. Open Cart, tap checkout 3. Fill required shipping fields with valid data, continue 4. Fill payment details, continue to order review 5. Confirm/place order | Order Confirmation screen is shown with confirmation copy (e.g. "Thank you for your order") | Yes |
| TC-CHECKOUT-02 | N | Required shipping fields block on empty submit | On Checkout Info screen, all fields empty | 1. Tap **Continue** without entering any field | Inline errors are shown for every required field (Full Name, Address Line 1, City, Zip, Country); user is not advanced to Payment Info | Yes |
| TC-CHECKOUT-03 | B / E | Zip Code accepts a non-numeric, invalid-format value | On Checkout Info screen | 1. Fill all required fields with valid data, except enter `ABCDE` in Zip Code 2. Tap **Continue** | Documents a real gap: the app validates only that Zip Code is non-empty, not its format, so this submission is incorrectly accepted and the user advances to Payment Info. The test asserts the app's actual behavior as a regression guard | Yes |

**Coverage summary:** 14 designed cases across the 4 highest-risk areas of the app; 11 automated (79%), 3 documented as manual/exploratory follow-ups.

---

## 6. Observations

1. **Checkout has an undocumented Payment Information screen.** Shipping Info does not feed directly into order review — there's a Card Holder Name / Card Number / Expiration / Security Code screen in between (`test/pageobjects/paymentInfo.page.ts`). Not visible from a source-only read; found by running the suite against a live emulator.
2. **Checkout Info validation is presence-only.** Zip Code, and every other required field, is checked only for non-empty. TC-CHECKOUT-03 turns this into a standing regression guard.
3. **Inconsistent field-validation copy.** Leaving Username blank shows "Username is required"; leaving Password blank shows "Enter Password" — no shared wording between the two for the same class of error.
4. **Empty-cart checkout path is ambiguous** (TC-CART-03) — the cart screen doesn't visibly disable the checkout action when empty. Marked for follow-up rather than asserted without verification.

---

## 7. Live coding video

The recorded session automates TC-LOGIN-01 and TC-LOGIN-02 live. The full suite — all cases above — already exists in the repository under `test/specs/`.
