import BaseInputElement from '../baseInputElement/baseInputElement';

export default class OnlyLettersInputElement extends BaseInputElement {
  protected validateValue(): string[] {
    const value = this.getValue();
    const pattern = /^\p{L}+$/u;

    const msg: string[] = [];

    if (!value.match(pattern)) {
      msg.push(`Must contain at least one character and no special characters or numbers`);
    }
    return msg;
  }
}
