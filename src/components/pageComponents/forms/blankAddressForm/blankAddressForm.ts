import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../../inputs/baseInputElement/baseInputElement';
import { PubSub } from '../../../../services/pubSub';
import './blankAddressForm.scss';
import CityInputElement from '../../inputs/cityInputElement/cityInputElement';
import CountryInputElement from '../../inputs/countryInputElement/countryInputElement';
import PostalCodeInputElement from '../../inputs/postalCodeInputElement/postalCodeInputElement';
import StreetInputElement from '../../inputs/streetInputElement/streetInputElement';
import userFlow from '../../../userFlow/userFlow';
import StateInputElement from '../../inputs/stateInputElement/stateInputElement';

export default class BlankAddressForm {
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
    const attributes: Attributes = { novalidate: 'novalidate' };

    const form = createElement('form', ['form', 'form_blank-address'], attributes);

    return form;
  }

  private configureForm(): void {
    this.createChildrenElements();
    this.addChildrenElements();
    this.addButtons();
    this.pubSub.publish(PubSub.eventName.contentRendered);
  }

  private createChildrenElements(): void {
    this.children = [
      new CityInputElement(),
      new StateInputElement(),
      new CountryInputElement(),
      new PostalCodeInputElement(),
      new StreetInputElement(),
    ];
  }

  private addChildrenElements(): void {
    this.children.forEach((elem) => {
      const labelName = this.getLabelName(elem);

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

  private getLabelName(elem: BaseInputElement): string {
    let label = 'Label';

    if (elem instanceof CityInputElement) label = 'City';
    else if (elem instanceof StateInputElement) label = 'State';
    else if (elem instanceof CountryInputElement) label = 'Country';
    else if (elem instanceof PostalCodeInputElement) label = 'Postal Code';
    else if (elem instanceof StreetInputElement) label = 'Street';

    return label;
  }

  private addButtons(): void {
    const buttons = createElement('div', ['form-buttons']);

    const addButton = createElement('a', ['add-btn']);
    const submitButton = createElement('input', ['submit-btn'], { type: 'submit', value: 'Save' });
    const resetButton = createElement('input', ['reset-btn'], { type: 'reset', value: 'Cancel' });

    addButton.addEventListener('click', () => this.setEditMode());

    this.element.addEventListener('reset', () => {
      this.removeEditMode();
      this.children.forEach((elem) => elem.resetElementValidation());
    });

    buttons.append(addButton, submitButton, resetButton);
    this.element.append(buttons);
  }

  private listenEvents(): void {
    this.listenCountryChangedEvent();
    this.listenSubmit();
  }

  private validate(): boolean {
    return this.children.map((elem) => elem.validate()).every((item) => item);
  }

  private async process(): Promise<void> {
    const [
      cityInputElement,
      stateInputElement,
      countryInputElement,
      postalCodeInputElement,
      streetInputElement,
    ] = this.children;

    const city = cityInputElement.getValue();
    const state = stateInputElement.getValue();
    const country = countryInputElement.getValue();
    const postalCode = postalCodeInputElement.getValue();
    const streetName = streetInputElement.getValue();

    const newAddress = { city, state, country, postalCode, streetName };

    const user = await userFlow.addUserAddress(newAddress);

    if (user) this.pubSub.publish(PubSub.eventName.addressesUpdated);
  }

  private setEditMode(): void {
    this.element.classList.add('edit-mode');
  }

  private removeEditMode(): void {
    this.element.classList.remove('edit-mode');
  }

  private listenSubmit(): void {
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.validate()) this.process();
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
