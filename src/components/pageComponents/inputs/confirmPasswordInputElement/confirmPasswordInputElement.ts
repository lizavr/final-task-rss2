import PasswordInputElement from '../passwordInputElement/passwordInputElement';

export default class ConfirmPasswordInputElement extends PasswordInputElement {
  private parentElement: PasswordInputElement;

  constructor(parentElement: PasswordInputElement) {
    super('');
    this.parentElement = parentElement;
  }

  protected validateValue(): string[] {
    const msg = super.validateValue();

    if (!this.passwordMatch()) msg.push('Passwords do NOT match');

    return msg;
  }

  private passwordMatch(): boolean {
    return this.getValue() === this.parentElement.getValue();
  }
}
