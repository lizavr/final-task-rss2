import AddressElement from '../addressElement/addressElement';

export default class BillingAddressElement extends AddressElement {
  constructor() {
    super('Billing Address', true, 'billing_address');
  }
}
