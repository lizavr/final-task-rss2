import { PathObj } from '../../../types/types';
import { createElement } from '../../../utils/utils';
import RegistrationForm from '../../pageComponents/forms/registrationForm/registrationForm';
import './registration.scss';

export class Registration {
  public wrapper: HTMLElement;

  constructor() {
    this.wrapper = createElement('main', ['registration_page'], { id: 'registration' });
    this.addPageContent();
  }

  private addPageContent(): void {
    const content = createElement('div', ['registration-content']);
    const header = this.getHeader();
    const form = this.getForm();
    const link = this.getLink();

    [header, link, form].forEach((elem) => {
      const contentItem = createElement('div', ['registration-content_item']);
      contentItem.append(elem);
      content.append(contentItem);
    });

    this.wrapper.append(content);
  }

  private getHeader(): HTMLElement {
    const header = createElement('h2', ['page-header']);
    header.innerText = 'Register';

    return header;
  }

  private getForm(): HTMLElement {
    const form = new RegistrationForm();

    return form.getHtmlElement();
  }

  private getLink(): HTMLElement {
    const pathToLoginPage = PathObj.loginPath;
    const linkWrapper = createElement('div', ['login-link-wrapper']);

    const prefixText = createElement('span');
    prefixText.textContent = 'Already have an account?';

    const link = createElement('a', ['login-link'], { href: pathToLoginPage });
    link.innerText = 'Log In';

    linkWrapper.append(prefixText, link);

    return linkWrapper;
  }
}
