import BaseInputElement from '../baseInputElement/baseInputElement';

export default class EmailInputElement extends BaseInputElement {
  constructor(placeholder = 'Email') {
    super(placeholder, 'email', 'form-element_email');

    this.prohibitWhitespaces();
  }

  protected validateValue(): string[] {
    const value = this.getValue();
    const trimmedValue = value.trim();
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    const msg: string[] = [];

    if (!value) msg.push(`Email adress is required and must be not empty.`);

    if (!value.match(pattern)) msg.push(`Email address must be properly formatted (e.g., user@example.com).`);

    if (value !== trimmedValue) msg.push('Email address must not contain leading or trailing whitespace.');

    return msg;
  }

  private prohibitWhitespaces(): void {
    const input = this.getInputElement();

    input.addEventListener('keypress', (event: KeyboardEvent) => {
      const code = event.code.toLowerCase();
      if (code === 'space') event.preventDefault();
    });
  }
}
