import path from 'node:path';

const APP_PATH = process.env.APP_PATH || path.join(process.cwd(), 'apps', 'mda-2.2.0-25.apk');
const AVD_NAME = process.env.ANDROID_AVD_NAME || 'Pixel_6';

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,

  specs: ['./test/specs/**/*.spec.ts'],
  exclude: [],

  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:avd': AVD_NAME,
      'appium:app': APP_PATH,
      'appium:appPackage': 'com.saucelabs.mydemoapp.android',
      'appium:appWaitActivity': 'com.saucelabs.mydemoapp.android.view.activities.*',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      'appium:noReset': false,
    },
  ],

  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        args: { relaxedSecurity: true },
        command: 'appium',
      },
    ],
  ],

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
  },

  afterTest: async function (_test, _context, result) {
    if (!result.passed) {
      await browser.saveScreenshot(
        path.join(process.cwd(), 'allure-results', `failure-${Date.now()}.png`)
      );
    }
  },
};
