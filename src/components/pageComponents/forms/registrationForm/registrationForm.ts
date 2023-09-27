import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import DateOfBirthInputElement from '../../inputs/dateOfBirthInputElement/dateOfBirthInputElement';
import EmailInputElement from '../../inputs/emailInputElement/emailInputElement';
import FirstNameInputElement from '../../inputs/firstNameInputElement/firstNameInputElement';
import LastNameInputElement from '../../inputs/lastNameInputElement/lastNameInputElement';
import PasswordInputElement from '../../inputs/passwordInputElement/passwordInputElement';
import userFlow from '../../../userFlow/userFlow';
import './registrationForm.scss';
import IFormElement from '../../inputs/IFormElement/IFormElement';
import ShippingAddressElement from '../../inputs/shippingAddressElement/shippingAddressElement';
import BillingAddressElement from '../../inputs/billingAddressElement/billingAddressElement';
import AddressElement from '../../inputs/addressElement/addressElement';

export default class RegistrationForm {
  private element: HTMLElement;
  private children: IFormElement[] = [];

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
    const form = createElement('form', ['form', 'form_registration'], attributes);

    return form;
  }

  private configureForm(): void {
    this.createChildrenElements();
    this.addChildrenElements();
    this.addSubmitButton();
    this.listenEvents();
  }

  private createChildrenElements(): void {
    const elements = [
      new EmailInputElement(),
      new PasswordInputElement(),
      new FirstNameInputElement(),
      new LastNameInputElement(),
      new DateOfBirthInputElement(),
      new ShippingAddressElement(),
      new BillingAddressElement(),
    ];

    this.children.push(...elements);
  }

  private addChildrenElements(): void {
    const [email, password, firstName, lastName, dateOfBirth, shippingAddress, billingAddress] = this.children;
    const row1 = createElement('div', ['form_row']);
    const row2 = createElement('div', ['form_row']);
    const row3 = createElement('div', ['form_row']);
    const row4 = createElement('div', ['form_row', 'form_row_addresses']);

    row1.append(email.getHtmlElement(), password.getHtmlElement());
    row2.append(firstName.getHtmlElement(), lastName.getHtmlElement());
    row3.append(dateOfBirth.getHtmlElement());
    row4.append(shippingAddress.getHtmlElement(), billingAddress.getHtmlElement());

    this.element.append(row1, row2, row3, row4);
  }

  private addSubmitButton(): void {
    const attributes: Attributes = {
      type: 'submit',
      value: 'Register',
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

  private async process(): Promise<void> {
    const [
      emailInputElement,
      passwordInputElement,
      firstNameInputElement,
      lastNameInputElement,
      dateOfBirthInputElement,
      shippingAddressInputElement,
      billingAddressInputElement,
    ] = this.children;

    if (
      !(billingAddressInputElement instanceof AddressElement) ||
      !(shippingAddressInputElement instanceof AddressElement)
    ) {
      return;
    }

    const email = emailInputElement.getValue();
    const password = passwordInputElement.getValue();
    const dateOfBirth = dateOfBirthInputElement.getValue();
    const firstName = firstNameInputElement.getValue();
    const lastName = lastNameInputElement.getValue();
    const shippingAddress = this.getShippingAddress(shippingAddressInputElement);
    const billingAddress = billingAddressInputElement.getIsDuplicateAddressValue()
      ? shippingAddress
      : this.getBillingAddress(billingAddressInputElement);

    userFlow.register(email, password, dateOfBirth, firstName, lastName, shippingAddress, billingAddress);
  }

  private getShippingAddress(shippingAddressInputElement: AddressElement) {
    return {
      country: shippingAddressInputElement.getCountryValue(),
      city: shippingAddressInputElement.getCityValue(),
      streetName: shippingAddressInputElement.getStreetValue(),
      postalCode: shippingAddressInputElement.getPostalCodeValue(),
      isDefault: shippingAddressInputElement.getIsDefaultAddressValue(),
    };
  }

  private getBillingAddress(billingAddressInputElement: AddressElement) {
    return {
      country: billingAddressInputElement.getCountryValue(),
      city: billingAddressInputElement.getCityValue(),
      streetName: billingAddressInputElement.getStreetValue(),
      postalCode: billingAddressInputElement.getPostalCodeValue(),
      isDefault: billingAddressInputElement.getIsDefaultAddressValue(),
    };
  }
}
