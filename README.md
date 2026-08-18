# Mobile Automation Engineer — Real Work Challenge

Appium + WebdriverIO + TypeScript UI automation suite for [Sauce Labs' "My Demo App"](https://github.com/saucelabs/my-demo-app-android) (Android), built for the Mobile Automation Engineer take-home challenge.

- **Test design & rationale:** [`TEST_DESIGN.md`](./TEST_DESIGN.md) — read this first.
- **Automation code:** `test/pageobjects/`, `test/specs/`

## Project structure

```
test/
  pageobjects/
    base.page.ts
    login.page.ts
    catalog.page.ts
    productDetail.page.ts
    cart.page.ts
    checkoutInfo.page.ts
    paymentInfo.page.ts
    placeOrder.page.ts
    checkoutComplete.page.ts
  data/
    users.ts
    shipping.ts
    payment.ts
  support/
    appLifecycle.ts
  specs/
    login.spec.ts
    catalog.spec.ts
    cart.spec.ts
    checkout.spec.ts
wdio.conf.ts
.github/workflows/
```

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | `node -v` |
| Java JDK | 11+ | required by Android SDK tooling |
| Android SDK + an emulator (AVD) | API 33 recommended | via Android Studio, or `sdkmanager`/`avdmanager` on CLI |
| Appium | 2.x | installed as a dependency below, no global install needed |

## Setup

```bash
npm install

npx appium driver install uiautomator2

mkdir -p apps
curl -L -o apps/mda-2.2.0-25.apk \
  https://github.com/saucelabs/my-demo-app-android/releases/download/2.2.0/mda-2.2.0-25.apk

emulator -avd Pixel_6
```

If your AVD has a different name, either rename it to `Pixel_6` or export `ANDROID_AVD_NAME=<your-avd-name>` before running the suite. Check the exact name with `emulator -list-avds`.

## Running the tests

```bash
npm test
npm run test:login
npm run test:catalog
npm run test:cart
npm run test:checkout
npm run typecheck
```

`wdio.conf.ts` starts and stops the Appium server automatically via `@wdio/appium-service` — there's no separate `appium` process to manage by hand.

### Reports

Every run writes Allure results to `allure-results/`, including a screenshot attached to any failing test:

```bash
npm run report
```

## Design notes

See `TEST_DESIGN.md` for the full rationale.

- Locator strategy: resource-id first, `content-desc` (accessibility id) second, text-based XPath as a last resort.
- Page Object Model throughout.
- No fixed sleeps; every wait is condition-based (`waitForDisplayed`/`waitForEnabled`) with a bounded timeout.
- Each spec starts from a freshly reset app state instead of relying on state left over from a previous test.

## CI

`.github/workflows/mobile-tests.yml` runs the full suite on a GitHub-hosted Android emulator (`reactivecircus/android-emulator-runner`) on every push/PR to `main`, and uploads the Allure results as a build artifact.
