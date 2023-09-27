import BaseInputElement from '../baseInputElement/baseInputElement';

export default class StateInputElement extends BaseInputElement {
  constructor(placeholder = 'State') {
    super(placeholder, 'text', 'form-element_state');
  }

  protected validateValue(): string[] {
    return [];
  }
}
