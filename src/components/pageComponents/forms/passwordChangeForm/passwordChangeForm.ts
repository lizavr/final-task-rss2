import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../../inputs/baseInputElement/baseInputElement';
import { PubSub } from '../../../../services/pubSub';
import PasswordInputElement from '../../inputs/passwordInputElement/passwordInputElement';
import CurrentPasswordInputElement from '../../inputs/currentPasswordInputElement/currentPasswordInputElement';
import ConfirmPasswordInputElement from '../../inputs/confirmPasswordInputElement/confirmPasswordInputElement';
import './passwordChangeForm.scss';
import userFlow from '../../../userFlow/userFlow';
import { showInfoToast } from '../../../../utils/toastUtils';

export default class PasswordChangeForm {
  private element: HTMLElement;
  private children: BaseInputElement[] = [];
  private pubSub = PubSub.getInstance();

  constructor() {
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
    const form = createElement('form', ['form', 'form_password-change'], attributes);

    return form;
  }

  private configureForm(): void {
    this.addHeader();
    this.addInfoBlock();
    this.createChildrenElements();
    this.addChildrenElements();
    this.addButtons();
    this.pubSub.publish(PubSub.eventName.contentRendered);
  }

  private addHeader(): void {
    const header = createElement('h4', [], {}, 'Password Change');
    this.element.append(header);
  }

  private createChildrenElements(): void {
    const currentPasswordInputElement = new CurrentPasswordInputElement();
    const newPasswordInputElement = new PasswordInputElement('');
    const confirmPasswordInputElement = new ConfirmPasswordInputElement(newPasswordInputElement);

    this.children = [currentPasswordInputElement, newPasswordInputElement, confirmPasswordInputElement];
  }

  private addChildrenElements(): void {
    this.children.forEach((elem, ind) => {
      let labelName = 'Current password';

      if (ind === 1) labelName = 'New password';
      else if (ind === 2) labelName = 'Confirm new password';

      const row = createElement('div', ['form-row']);
      const col1 = createElement('div', ['col-1']);
      const col2 = createElement('div', ['col-2']);
      const label = createElement('label', [], {}, labelName);

      col1.append(label);
      col2.append(elem.getHtmlElement());
      row.append(col1, col2);
      this.element.append(row);
    });
  }

  private addButtons(): void {
    const buttons = createElement('div', ['form-buttons']);

    const editButton = createElement('a', ['change-password-btn', 'change-password-link'], {}, 'Change my password');
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
    const [currentPasswordInputElement, newPasswordInputElement] = this.children;
    const notTheSame = currentPasswordInputElement.getValue() !== newPasswordInputElement.getValue();
    const valid = this.children.map((elem) => elem.validate()).every((item) => item);

    if (valid && !notTheSame) showInfoToast('Passwords are the same. Nothing to change.');

    return valid && notTheSame;
  }

  private process(): void {
    const [currentPasswordInputElement, newPasswordInputElement] = this.children;

    const currentPassword = currentPasswordInputElement.getValue();
    const newPassword = newPasswordInputElement.getValue();

    userFlow.changeUserPassword(currentPassword, newPassword);
  }

  private setEditMode(): void {
    this.element.classList.add('edit-mode');
  }

  private removeEditMode(): void {
    this.element.classList.remove('edit-mode');
  }

  private addInfoBlock(): void {
    const infoText = 'Note: Password change will trigger automatic logout.';
    const info = createElement('p', ['info-block'], {}, infoText);

    this.element.append(info);
  }
}
