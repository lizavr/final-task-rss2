import AddressElement from '../addressElement/addressElement';

export default class ShippingAddressElement extends AddressElement {
  constructor() {
    super('Shipping Address', false, 'shipping_address');
  }
}
