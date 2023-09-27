import { createElement } from '../../../../utils/utils';
import IFormElement from '../IFormElement/IFormElement';
import BaseInputElement from '../baseInputElement/baseInputElement';
import CheckboxElement from '../checkboxElement/checkboxElement';
import CityInputElement from '../cityInputElement/cityInputElement';
import CountryInputElement from '../countryInputElement/countryInputElement';
import PostalCodeInputElement from '../postalCodeInputElement/postalCodeInputElement';
import StreetInputElement from '../streetInputElement/streetInputElement';
import './addressElement.scss';

export default class AddressElement implements IFormElement {
  private formElement: HTMLElement;
  private legendElement: HTMLElement;
  private children: BaseInputElement[];
  private checkboxElement: CheckboxElement;
  private duplicateCheckboxElement: CheckboxElement | undefined;

  constructor(titleLegend: string, isDuplicateCheckbox: boolean, className = '') {
    this.legendElement = this.createLegendElement(titleLegend);
    this.children = this.createChildrenElements();
    this.checkboxElement = this.createCheckboxElement(titleLegend, 'Set as default address');
    this.duplicateCheckboxElement = this.createDuplicateCheckbox(isDuplicateCheckbox);
    this.formElement = this.createFormElement(className);
    this.listenEvents();
  }

  public validate(): boolean {
    if (this.duplicateCheckboxElement && this.duplicateCheckboxElement.getValue() === 'true') {
      return true;
    }
    return this.children.map((item) => item.validate()).every((item) => item);
  }

  public getValue(): string {
    return '';
  }

  public getHtmlElement(): HTMLElement {
    return this.formElement;
  }

  public getCityValue(): string {
    return this.children.find((item) => item instanceof CityInputElement)?.getValue() ?? '';
  }

  public getCountryValue(): string {
    return this.children.find((item) => item instanceof CountryInputElement)?.getValue() ?? '';
  }

  public getPostalCodeValue(): string {
    return this.children.find((item) => item instanceof PostalCodeInputElement)?.getValue() ?? '';
  }

  public getStreetValue(): string {
    return this.children.find((item) => item instanceof StreetInputElement)?.getValue() ?? '';
  }

  public getIsDuplicateAddressValue(): boolean {
    return this.duplicateCheckboxElement?.getValue() === 'true';
  }

  public getIsDefaultAddressValue(): boolean {
    return this.checkboxElement?.getValue() === 'true';
  }

  private createDuplicateCheckbox(isDuplicateCheckbox: boolean): CheckboxElement | undefined {
    if (isDuplicateCheckbox) {
      return this.createCheckboxElement('duplicateAddress', 'Billing address is the same as shipping');
    }
  }

  private createLegendElement(titleLegend: string): HTMLElement {
    const legendElement = createElement('legend', ['legend-element']);
    legendElement.innerHTML = titleLegend;
    return legendElement;
  }

  private createChildrenElements(): BaseInputElement[] {
    return [new CityInputElement(), new CountryInputElement(), new PostalCodeInputElement(), new StreetInputElement()];
  }

  private createCheckboxElement(titleLegend: string, textLabel: string): CheckboxElement {
    return new CheckboxElement(titleLegend, textLabel);
  }

  private createFormElement(className = ''): HTMLElement {
    const formElement = createElement('fieldset', ['address-form-element', className]);

    formElement.append(this.legendElement);

    if (this.duplicateCheckboxElement) {
      formElement.append(this.duplicateCheckboxElement.getHtmlElement());
    }

    this.children.forEach((item) => formElement.append(item.getHtmlElement()));

    formElement.append(this.checkboxElement.getHtmlElement());

    return formElement;
  }

  private listenEvents(): void {
    this.listenCountryChangedEvent();
    this.listenDuplicateCheckboxEvents();
  }

  private listenDuplicateCheckboxEvents(): void {
    this.duplicateCheckboxElement?.getInputElement().addEventListener('change', (ev) => {
      if (ev.target instanceof HTMLInputElement && ev.target.type === 'checkbox') {
        if (ev.target.checked) {
          this.children.forEach((item) => (item.getHtmlElement().style.display = 'none'));
          this.checkboxElement.getHtmlElement().style.display = 'none';
        } else {
          this.children.forEach((item) => (item.getHtmlElement().style.display = 'block'));
          this.checkboxElement.getHtmlElement().style.display = 'inline-block';
        }
      }
    });
  }

  private listenCountryChangedEvent(): void {
    const countryInputElement = this.children.find((child) => child instanceof CountryInputElement);
    const postalCodeInputElement = this.children.find((child) => child instanceof PostalCodeInputElement);
    if (!(countryInputElement instanceof CountryInputElement)) {
      return;
    }
    countryInputElement?.getInputElement().addEventListener('change', (ev) => {
      const selectedCountry = (ev.target as HTMLSelectElement).value;
      if (postalCodeInputElement instanceof PostalCodeInputElement) {
        postalCodeInputElement.setCountry(selectedCountry);
      }
      countryInputElement.getInputElement().style.color = '#3d3d3d';
    });
  }
}
