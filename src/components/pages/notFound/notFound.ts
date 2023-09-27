import './notFound.scss';
import { createElement } from '../../../utils/utils';
import { PathObj } from '../../../types/types';

export class NotFound {
  public wrapper: HTMLElement;
  public notFoundContainer: HTMLElement;

  constructor() {
    this.wrapper = createElement('div', ['not-found_page'], { id: 'not-found' });
    this.notFoundContainer = createElement('div', ['not-found_content', 'width-content']);

    this.notFoundContainer.append(this.create404Content(), this.create404Img());
    this.wrapper.append(this.notFoundContainer);
  }

  private create404Content(): HTMLElement {
    const infoWrapper = createElement('div', ['info-wrapper']);

    const title = createElement('div', ['info-title'], {}, '404');

    const subTitleWrapper = createElement('div', ['info-subtitle_wrapper']);

    const subTitle_first = createElement('h3', ['info-subtitle'], {}, 'OOOps!');

    const subTitle_second = createElement('h3', ['info-subtitle'], {}, 'Page Not Found');

    const infoText = createElement(
      'p',
      ['info-text'],
      {},
      'This page doesn’t exist or was removed! We suggest you back to home'
    );

    const linkToHome = createElement('a', ['button'], { href: PathObj.mainPath }, 'Home');

    subTitleWrapper.append(subTitle_first, subTitle_second);
    infoWrapper.append(title, subTitleWrapper, infoText, linkToHome);

    return infoWrapper;
  }

  private create404Img(): HTMLElement {
    const image404 = createElement('div', ['image-404']);

    return image404;
  }
}
