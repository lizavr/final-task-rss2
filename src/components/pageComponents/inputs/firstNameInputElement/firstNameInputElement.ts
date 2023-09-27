import OnlyLettersInputElement from '../onlyLettersInputElement/onlyLettersInputElement';

export default class FirstNameInputElement extends OnlyLettersInputElement {
  constructor(placeholder = 'First name') {
    super(placeholder, 'text', 'form-element_firstName');
  }
}
