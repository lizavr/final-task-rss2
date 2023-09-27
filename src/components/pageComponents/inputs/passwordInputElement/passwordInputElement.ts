import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../baseInputElement/baseInputElement';
import './passwordInputElement.scss';

export default class PasswordInputElement extends BaseInputElement {
  constructor(placeholder = 'Password') {
    super(placeholder, 'password', 'form-element_password');

    this.addVisibilityToggle();
  }

  protected validateValue(): string[] {
    const upperCaseLetters = /[A-Z]/g;
    const lowerCaseLetters = /[a-z]/g;
    const numbers = /[0-9]/g;
    const value = this.getValue();
    const trimmedValue = value.trim();
    const PASSWORD_MIN_LENGTH = 8;

    const msg: string[] = [];

    if (!value) msg.push(`Password is required and must be not empty.`);

    if (value.length < PASSWORD_MIN_LENGTH) {
      msg.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
    }

    if (!value.match(upperCaseLetters)) msg.push('Password must contain at least one uppercase letter (A-Z).');

    if (!value.match(lowerCaseLetters)) msg.push('Password must contain at least one lowercase letter (a-z).');

    if (!value.match(numbers)) msg.push('Password must contain at least one digit (0-9).');

    if (value !== trimmedValue) msg.push('Password must not contain leading or trailing whitespace.');

    return msg;
  }

  private addVisibilityToggle() {
    const element = this.getHtmlElement();
    const inputElement = this.getInputElement();
    const toggleElement = createElement('i', ['toggle-password']);

    element.append(toggleElement);

    toggleElement.addEventListener('click', () => {
      if (element.classList.contains('show-password')) {
        this.hidePassword(element, inputElement);
      } else {
        this.showPassword(element, inputElement);
      }
    });
  }

  private hidePassword(element: HTMLElement, inputElement: HTMLElement): void {
    element.classList.remove('show-password');
    inputElement.setAttribute('type', 'password');
  }

  private showPassword(element: HTMLElement, inputElement: HTMLElement): void {
    element.classList.add('show-password');
    inputElement.setAttribute('type', 'text');
  }
}
