const PKG = 'com.saucelabs.mydemoapp.android';

export async function launchFreshApp(): Promise<void> {
  await driver.execute('mobile: clearApp', { appId: PKG });
  await driver.activateApp(PKG);
}
