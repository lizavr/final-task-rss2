import { PathObj } from '../../../types/types';
import { createElement } from '../../../utils/utils';
import LoginForm from '../../pageComponents/forms/loginForm/loginForm';
import './login.scss';

export class Login {
  public wrapper: HTMLElement;

  constructor() {
    this.wrapper = createElement('main', ['login_page'], { id: 'login' });
    this.addPageContent();
  }

  private addPageContent(): void {
    const content = createElement('div', ['login-content']);
    const header = this.getHeader();
    const form = this.getForm();
    const link = this.getLink();

    [header, link, form].forEach((elem) => {
      const contentItem = createElement('div', ['login-content_item']);
      contentItem.append(elem);
      content.append(contentItem);
    });

    this.wrapper.append(content);
  }

  private getHeader(): HTMLElement {
    const header = createElement('h2', ['page-header']);
    header.innerText = 'Login';

    return header;
  }

  private getForm(): HTMLElement {
    const form = new LoginForm();

    return form.getHtmlElement();
  }

  private getLink(): HTMLElement {
    const pathToRegisterPage = PathObj.registrationPath;
    const linkWrapper = createElement('div', ['register-link-wrapper']);

    const prefixText = createElement('span');
    prefixText.textContent = 'Have no account yet?';

    const link = createElement('a', ['register-link'], { href: pathToRegisterPage });
    link.innerText = 'Register';

    linkWrapper.append(prefixText, link);

    return linkWrapper;
  }
}
