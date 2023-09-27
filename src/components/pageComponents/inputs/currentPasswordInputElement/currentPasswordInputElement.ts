import PasswordInputElement from '../passwordInputElement/passwordInputElement';

export default class CurrentPasswordInputElement extends PasswordInputElement {
  constructor(placeholder = '') {
    super(placeholder);
  }

  protected validateValue(): string[] {
    const value = this.getValue();
    const msg: string[] = [];

    if (!value) msg.push(`Password is required and must be not empty.`);

    return msg;
  }
}
