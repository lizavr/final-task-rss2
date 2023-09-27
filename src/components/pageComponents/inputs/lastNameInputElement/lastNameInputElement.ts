import OnlyLettersInputElement from '../onlyLettersInputElement/onlyLettersInputElement';

export default class LastNameInputElement extends OnlyLettersInputElement {
  constructor(placeholder = 'Last name') {
    super(placeholder, 'text', 'form-element_lastName');
  }
}
