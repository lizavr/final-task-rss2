import BaseInputElement from '../baseInputElement/baseInputElement';
import postalCodeRegexes from './postalCodes';

export default class PostalCodeInputElement extends BaseInputElement {
  private country: string;

  constructor(placeholder = 'Postal code') {
    super(placeholder, 'text', 'form-element_postalCode');
    this.country = '';
  }

  public setCountry(country: string): void {
    this.country = country;
    this.validate();
  }

  protected validateValue(): string[] {
    const postalCode = this.getValue();
    const regexPattern = postalCodeRegexes[this.country];
    const msg: string[] = [];
    if (regexPattern) {
      if (!postalCode.match(regexPattern)) {
        msg.push(`Postal code doesn't match template for selected country`);
      }
    } else {
      if (!postalCode.trim().length) {
        msg.push(`Postal code doesn't match template for selected country`);
      }
    }
    return msg;
  }
}
