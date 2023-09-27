import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import IFormElement from '../IFormElement/IFormElement';
import './baseInputElement.scss';

export default abstract class BaseInputElement implements IFormElement {
  private formElement: HTMLElement;
  private inputElement: HTMLElement;
  private errorElement: HTMLElement;

  constructor(placeholder: string, type: string, className: string) {
    this.inputElement = this.createInputElement(placeholder, type);
    this.errorElement = this.createErrorElement();
    this.formElement = this.createFormElement(className);

    this.listenEvents();
  }

  public getHtmlElement(): HTMLElement {
    return this.formElement;
  }

  public validate(): boolean {
    let validated = false;

    const msg = this.validateValue();

    if (msg.length) {
      this.markInvalid(msg);
    } else {
      this.markValid();
      validated = true;
    }

    return validated;
  }

  public getInputElement(): HTMLElement {
    return this.inputElement;
  }

  protected abstract validateValue(): string[];

  public getValue(): string {
    if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLSelectElement) {
      return this.inputElement.value;
    }
    return '';
  }

  protected createInputElement(placeholderStr: string, typeStr: string): HTMLElement {
    const attributes: Attributes = {
      type: typeStr,
      placeholder: placeholderStr,
    };

    return createElement('input', [], attributes);
  }

  private createErrorElement(): HTMLElement {
    return createElement('div', ['error-msg']);
  }

  private createFormElement(className: string): HTMLElement {
    const formElement = createElement('div', ['form-element', className]);

    formElement.append(this.inputElement, this.errorElement);

    return formElement;
  }

  private markInvalid(msg: string[]): void {
    if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLSelectElement) {
      this.inputElement.setCustomValidity('There are custom errors.');

      if (this.inputElement.getAttribute('readonly')) this.inputElement.classList.add('invalid');
    }

    this.displayErrorMessages(msg);
  }

  private markValid(): void {
    if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLSelectElement) {
      this.inputElement.setCustomValidity('');
      this.inputElement.classList.remove('invalid');
    }

    this.removeErrorMessages();
  }

  private removeErrorMessages(): void {
    this.errorElement.innerHTML = '';
  }

  private displayErrorMessages(msg: string[]): void {
    this.errorElement.innerHTML = '';

    if (msg.length) {
      msg.forEach((message) => {
        const msgItem = createElement('div', ['error-msg_item']);
        msgItem.innerText = message;

        this.errorElement.append(msgItem);
      });
    }
  }

  private listenEvents(): void {
    ['input', 'change'].forEach((eventName) => {
      this.inputElement.addEventListener(eventName, () => {
        this.validate();
      });
    });
  }

  public setValue(value: string): void {
    if (this.inputElement instanceof HTMLInputElement) {
      this.inputElement.setAttribute('value', value);
    }

    if (this.inputElement instanceof HTMLSelectElement) {
      const optionToSelect = [...this.inputElement.options].find((option) => option.value === value);
      if (optionToSelect) optionToSelect.setAttribute('selected', 'true');
    }
  }

  public resetElementValidation(): void {
    this.markValid();
  }
}
