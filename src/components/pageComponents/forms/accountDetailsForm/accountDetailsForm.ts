import { Customer } from '@commercetools/platform-sdk';
import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../../inputs/baseInputElement/baseInputElement';
import EmailInputElement from '../../inputs/emailInputElement/emailInputElement';
import FirstNameInputElement from '../../inputs/firstNameInputElement/firstNameInputElement';
import LastNameInputElement from '../../inputs/lastNameInputElement/lastNameInputElement';
import DateOfBirthInputElement from '../../inputs/dateOfBirthInputElement/dateOfBirthInputElement';
import { PubSub } from '../../../../services/pubSub';
import './accountDetailsForm.scss';
import userFlow from '../../../userFlow/userFlow';

export default class AccountDetailsForm {
  private element: HTMLElement;
  private children: BaseInputElement[] = [];
  private user: Customer;
  private pubSub = PubSub.getInstance();

  constructor(user: Customer) {
    this.user = user;
    this.element = this.createFormElement();
    this.configureForm();
    this.listenEvents();
  }

  public getHtmlElement(): HTMLElement {
    return this.element;
  }

  private createFormElement(): HTMLElement {
    const attributes: Attributes = {
      novalidate: 'novalidate',
    };
    const form = createElement('form', ['form', 'form_account-details'], attributes);

    return form;
  }

  private configureForm(): void {
    this.addHeader();
    this.createChildrenElements();
    this.addChildrenElements();
    this.addButtons();
    this.pubSub.publish(PubSub.eventName.contentRendered);
  }

  private addHeader(): void {
    const header = createElement('h4', [], {}, 'Personal Information');
    this.element.append(header);
  }

  private createChildrenElements(): void {
    this.children = [
      new EmailInputElement(),
      new FirstNameInputElement(),
      new LastNameInputElement(),
      new DateOfBirthInputElement(),
    ];
  }

  private addChildrenElements(): void {
    this.children.forEach((elem) => {
      const defaultValue = this.getDefaultValue(elem);
      const labelName = this.getLabelName(elem);
      const className = this.getRowClassName(elem);

      const row = createElement('div', ['form-row', className]);
      const col1 = createElement('div', ['col-1']);
      const col2 = createElement('div', ['col-2']);
      const label = createElement('label', [], {}, labelName);
      const span = createElement('span', ['info-element'], {}, defaultValue);
      elem.setValue(defaultValue);

      col1.append(label);
      col2.append(span, elem.getHtmlElement());
      row.append(col1, col2);
      this.element.append(row);
    });
  }

  private getDefaultValue(elem: BaseInputElement): string {
    let value;

    if (elem instanceof EmailInputElement) value = this.user.email;
    else if (elem instanceof FirstNameInputElement) value = this.user.firstName;
    else if (elem instanceof LastNameInputElement) value = this.user.lastName;
    else if (elem instanceof DateOfBirthInputElement) value = this.user.dateOfBirth;

    return value ? value : '';
  }

  private getLabelName(elem: BaseInputElement): string {
    let label = 'Label';

    if (elem instanceof EmailInputElement) label = 'Email';
    else if (elem instanceof FirstNameInputElement) label = 'First Name';
    else if (elem instanceof LastNameInputElement) label = 'Last Name';
    else if (elem instanceof DateOfBirthInputElement) label = 'Date Of Birth';

    return label;
  }

  private getRowClassName(elem: BaseInputElement): string {
    let className = 'no-row';

    if (elem instanceof EmailInputElement) className = 'email';
    else if (elem instanceof FirstNameInputElement) className = 'first-name';
    else if (elem instanceof LastNameInputElement) className = 'last-name';
    else if (elem instanceof DateOfBirthInputElement) className = 'date-of-birth';

    return className;
  }

  private addButtons(): void {
    const buttons = createElement('div', ['form-buttons']);

    const editButton = createElement('a', ['edit-btn', 'edit-link'], {}, 'Edit');
    const submitButton = createElement('input', ['submit-btn'], { type: 'submit', value: 'Save' });
    const resetButton = createElement('input', ['reset-btn'], { type: 'reset', value: 'Cancel' });

    editButton.addEventListener('click', () => this.setEditMode());

    this.element.addEventListener('reset', () => {
      this.removeEditMode();
      this.children.forEach((elem) => elem.resetElementValidation());
    });

    buttons.append(editButton, submitButton, resetButton);
    this.element.append(buttons);
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
    const [emailInputElement, firstNameInputElement, lastNameInputElement, dateOfBirthInputElement] = this.children;

    const email = emailInputElement.getValue();
    const dateOfBirth = dateOfBirthInputElement.getValue();
    const firstName = firstNameInputElement.getValue();
    const lastName = lastNameInputElement.getValue();

    const user = await userFlow.updateUserAccountDetails(email, firstName, lastName, dateOfBirth);

    if (user) this.updateAccountDetailsForm(user);
  }

  private updateAccountDetailsForm(user: Customer) {
    this.user = user;
    this.element.innerHTML = '';
    this.configureForm();
    this.removeEditMode();
  }

  private setEditMode(): void {
    this.element.classList.add('edit-mode');
  }

  private removeEditMode(): void {
    this.element.classList.remove('edit-mode');
  }
}
