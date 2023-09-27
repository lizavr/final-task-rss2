import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../../inputs/baseInputElement/baseInputElement';
import EmailInputElement from '../../inputs/emailInputElement/emailInputElement';
import PasswordInputElement from '../../inputs/passwordInputElement/passwordInputElement';
import userFlow from '../../../userFlow/userFlow';
import './loginForm.scss';

export default class LoginForm {
  private element: HTMLElement;
  private children: BaseInputElement[] = [];

  constructor() {
    this.element = this.createFormElement();
    this.configureForm();
  }

  public getHtmlElement(): HTMLElement {
    return this.element;
  }

  private createFormElement(): HTMLElement {
    const attributes: Attributes = {
      novalidate: 'novalidate',
    };
    const form = createElement('form', ['form', 'form_login'], attributes);

    return form;
  }

  private configureForm(): void {
    this.createChildrenElements();
    this.addChildrenElements();
    this.addSubmitButton();
    this.listenEvents();
  }

  private createChildrenElements(): void {
    const emailElement = new EmailInputElement();
    const passwordElement = new PasswordInputElement();

    this.children.push(emailElement);
    this.children.push(passwordElement);
  }

  private addChildrenElements(): void {
    this.children.forEach((elem) => this.element.append(elem.getHtmlElement()));
  }

  private addSubmitButton(): void {
    const attributes: Attributes = {
      type: 'submit',
      value: 'Login',
    };
    const submitButton = createElement('input', ['form-submit', 'button-large'], attributes);

    this.element.append(submitButton);
  }

  private listenEvents(): void {
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.validate()) this.process();
    });
  }

  private validate(): boolean {
    return this.children.map((elem) => elem.validate()).every((item) => item);
  }

  private process(): void {
    const [emailInputElement, passwordInputElement] = this.children;
    const email = emailInputElement.getValue();
    const password = passwordInputElement.getValue();

    userFlow.login(email, password);
  }
}
