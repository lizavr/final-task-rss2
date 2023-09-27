import { Attributes } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import BaseInputElement from '../../inputs/baseInputElement/baseInputElement';
import { PubSub } from '../../../../services/pubSub';
import { BaseAddress } from '@commercetools/platform-sdk';
import './accountAddressForm.scss';
import CityInputElement from '../../inputs/cityInputElement/cityInputElement';
import CountryInputElement from '../../inputs/countryInputElement/countryInputElement';
import PostalCodeInputElement from '../../inputs/postalCodeInputElement/postalCodeInputElement';
import StreetInputElement from '../../inputs/streetInputElement/streetInputElement';
import { getName } from 'country-list';
import userFlow from '../../../userFlow/userFlow';
import StateInputElement from '../../inputs/stateInputElement/stateInputElement';

export default class AccountAddressForm {
  private element: HTMLElement;
  private children: BaseInputElement[] = [];
  private pubSub = PubSub.getInstance();
  private address: BaseAddress;
  private isDefaultShipping: boolean;
  private isDefaultBilling: boolean;

  constructor(address: BaseAddress, { isDefaultShipping = false, isDefaultBilling = false }) {
    this.address = address;
    this.isDefaultShipping = isDefaultShipping;
    this.isDefaultBilling = isDefaultBilling;
    this.element = this.createFormElement();
    this.configureForm();
    this.listenEvents();
  }

  public getHtmlElement(): HTMLElement {
    return this.element;
  }

  private createFormElement(): HTMLElement {
    const attributes: Attributes = { novalidate: 'novalidate' };
    if (this.address?.id) attributes['data-id'] = this.address.id;

    const form = createElement('form', ['form', 'form_account-address'], attributes);

    return form;
  }

  private configureForm(): void {
    this.addDefaultOptions();
    this.createChildrenElements();
    this.addChildrenElements();
    this.addButtons();
    this.pubSub.publish(PubSub.eventName.contentRendered);
  }

  private addDefaultOptions(): void {
    const defaultsRow = createElement('div', ['form-row', 'form-row_defaults']);
    const isDefault = this.isDefaultShipping || this.isDefaultBilling;

    if (isDefault) this.element.classList.add('default-address');

    if (this.address.id) {
      if (this.isDefaultShipping) this.addDefaultLabel('shipping', defaultsRow, this.address.id);
      else this.addDefaultButton('shipping', defaultsRow, this.address.id);

      if (this.isDefaultBilling) this.addDefaultLabel('billing', defaultsRow, this.address.id);
      else this.addDefaultButton('billing', defaultsRow, this.address.id);
    }

    this.element.append(defaultsRow);
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
      const [defaultValue, cleanValue] = this.getDefaultValue(elem);
      const labelName = this.getLabelName(elem);

      const row = createElement('div', ['form-row']);
      const col1 = createElement('div', ['col-1']);
      const col2 = createElement('div', ['col-2']);
      const label = createElement('label', [], {}, labelName);
      const span = createElement('span', ['info-element'], {}, cleanValue);
      elem.setValue(defaultValue);

      col1.append(label);
      col2.append(span, elem.getHtmlElement());
      row.append(col1, col2);
      this.element.append(row);
    });
  }

  private getDefaultValue(elem: BaseInputElement): string[] {
    let value;

    if (elem instanceof CityInputElement) value = this.address?.city;
    else if (elem instanceof StateInputElement) value = this.address?.state;
    else if (elem instanceof CountryInputElement) value = this.address?.country;
    else if (elem instanceof PostalCodeInputElement) value = this.address?.postalCode;
    else if (elem instanceof StreetInputElement) value = this.address?.streetName;

    value = value ? value : '';
    const cleanValue = elem instanceof CountryInputElement ? this.getCountryValue() : value;

    return [value, cleanValue];
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

    const editButton = createElement('a', ['edit-btn', 'edit-link'], {}, 'Edit');
    const removeButton = createElement('a', ['remove-btn', 'remove-link'], {}, 'Remove');
    const submitButton = createElement('input', ['submit-btn'], { type: 'submit', value: 'Save' });
    const resetButton = createElement('input', ['reset-btn'], { type: 'reset', value: 'Cancel' });

    editButton.addEventListener('click', () => this.setEditMode());
    removeButton.addEventListener('click', () => this.removeAddress());

    this.element.addEventListener('reset', () => {
      this.removeEditMode();
      this.children.forEach((elem) => elem.resetElementValidation());
    });

    buttons.append(editButton, removeButton, submitButton, resetButton);
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

    const newAddress = { ...this.address, city, state, country, postalCode, streetName };

    const user = await userFlow.updateUserAddress(newAddress);

    if (user) this.updateAddressForm(newAddress);
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

  private getCountryValue(): string {
    let country;
    if (this.address?.country) country = getName(this.address.country);

    return country ? country : 'None';
  }

  private updateAddressForm(address: BaseAddress) {
    this.address = address;
    this.element.innerHTML = '';
    this.configureForm();
    this.removeEditMode();
  }

  private async removeAddress(): Promise<void> {
    if (this.address.id) {
      const user = await userFlow.removeUserAddress(this.address.id);

      if (user) this.pubSub.publish(PubSub.eventName.addressesUpdated);
    }
  }

  private addDefaultLabel(type: 'shipping' | 'billing', parent: HTMLElement, addressId: string): void {
    const label = createElement('a', ['default-address_label', 'checked'], {}, `default ${type}`);
    parent.prepend(label);

    label.addEventListener('click', () => {
      label.classList.remove('checked');
      userFlow
        .removeDefaultUserAddress(type, addressId)
        .then(() => this.pubSub.publish(PubSub.eventName.addressesUpdated));
    });
  }

  private addDefaultButton(type: 'shipping' | 'billing', parent: HTMLElement, addressId: string): void {
    const setAsDefaultBtn = createElement('a', ['default-address_button'], {}, `default ${type}`);
    parent.prepend(setAsDefaultBtn);

    setAsDefaultBtn.addEventListener('click', () => {
      setAsDefaultBtn.classList.add('checked');
      userFlow
        .setUserAddressAsDefault(type, addressId)
        .then(() => this.pubSub.publish(PubSub.eventName.addressesUpdated));
    });
  }
}
