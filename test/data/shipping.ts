import type { ShippingAddress } from '../pageobjects/checkoutInfo.page.js';

export const VALID_SHIPPING_ADDRESS: ShippingAddress = {
  fullName: 'Haris Q.A.',
  address1: '221B Baker Street',
  city: 'London',
  zip: '10001',
  country: 'United Kingdom',
};

export const SHIPPING_ADDRESS_WITH_INVALID_ZIP: ShippingAddress = {
  ...VALID_SHIPPING_ADDRESS,
  zip: 'ABCDE',
};
