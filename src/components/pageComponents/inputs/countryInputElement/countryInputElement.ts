import { Attributes } from '../../../../types/types';
import BaseInputElement from '../baseInputElement/baseInputElement';
import { createElement } from '../../../../utils/utils';
import { getNames, getCode } from 'country-list';
import './countryInputElement.scss';

export default class CountryInputElement extends BaseInputElement {
  constructor(placeholder = 'Country') {
    super(placeholder, 'select', 'form-element_country');
  }

  protected validateValue(): string[] {
    const value = this.getValue();
    const msg: string[] = [];
    if (!value) {
      msg.push(`You should select country`);
    }
    return msg;
  }

  protected createInputElement(placeholderStr: string, typeStr: string): HTMLElement {
    const selectElement = createElement(typeStr, []);
    const placeholderOptionAttributes: Attributes = {
      value: '',
      disabled: 'true',
      hidden: 'true',
      selected: 'true',
    };
    const placeholderOptionElement = createElement('option', [], placeholderOptionAttributes);
    placeholderOptionElement.innerHTML = placeholderStr;
    selectElement.appendChild(placeholderOptionElement);
    const countries = getNames().sort();
    countries.forEach((country) => {
      const countryElementAttributes: Attributes = {
        value: getCode(country) ?? '',
      };
      const countryOptionElement = createElement('option', [], countryElementAttributes);
      countryOptionElement.innerHTML = country;
      selectElement.appendChild(countryOptionElement);
    });
    return selectElement;
  }
}
