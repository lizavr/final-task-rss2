import BaseInputElement from '../baseInputElement/baseInputElement';

export default class StreetInputElement extends BaseInputElement {
  constructor(placeholder = 'Street') {
    super(placeholder, 'text', 'form-element_street');
  }

  protected validateValue(): string[] {
    const value = this.getValue();
    const msg: string[] = [];
    if (!value.trim().length) {
      msg.push(`Street must contain at least one character`);
    }

    return msg;
  }
}
