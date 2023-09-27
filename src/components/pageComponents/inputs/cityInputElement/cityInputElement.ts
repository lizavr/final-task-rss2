import OnlyLettersInputElement from '../onlyLettersInputElement/onlyLettersInputElement';

export default class CityInputElement extends OnlyLettersInputElement {
  constructor(placeholder = 'City') {
    super(placeholder, 'text', 'form-element_city');
  }
}
