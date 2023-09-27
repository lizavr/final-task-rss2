import { createElement } from '../../../../utils/utils';
import IFormElement from '../IFormElement/IFormElement';

export default class CheckboxElement implements IFormElement {
  private formElement: HTMLElement;
  private checkboxElement: HTMLElement;
  private labelElement: HTMLElement;

  constructor(titleLegend: string, textLabel: string) {
    this.checkboxElement = this.createCheckboxElement(titleLegend);
    this.labelElement = this.createLabelElement(titleLegend, textLabel);
    this.formElement = this.createFormElement();
  }

  public validate(): boolean {
    return true;
  }

  public getValue(): string {
    return this.checkboxElement instanceof HTMLInputElement ? this.checkboxElement.checked.toString() : '';
  }

  public getHtmlElement(): HTMLElement {
    return this.formElement;
  }

  public getInputElement(): HTMLElement {
    return this.checkboxElement;
  }

  private createCheckboxElement(titleLegend: string): HTMLElement {
    const checkboxName = `${titleLegend}Checkbox`;
    const attributes = {
      type: 'checkbox',
      name: checkboxName,
      id: checkboxName,
    };
    const checkboxElement = createElement('input', ['checkbox-element'], attributes);
    return checkboxElement;
  }

  private createLabelElement(titleLegend: string, textLabel: string): HTMLElement {
    const checkboxName = `${titleLegend}Checkbox`;
    const attributesForLabel = {
      for: checkboxName,
    };

    const labelElement = createElement('label', ['label-element-checkbox'], attributesForLabel);
    labelElement.innerHTML = textLabel;
    return labelElement;
  }

  private createFormElement(): HTMLElement {
    const divCheckboxElement = createElement('div', ['div-checkbox-element']);

    divCheckboxElement.append(this.checkboxElement);
    divCheckboxElement.append(this.labelElement);
    return divCheckboxElement;
  }
}
