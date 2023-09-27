import './footer.scss';
import { createElement } from '../../../utils/utils';

export class Footer {
  public wrapper: HTMLElement;

  constructor() {
    this.wrapper = createElement('footer', ['footer']);

    this.wrapper.append(this.createInfoContentFooter(), this.createLinksContentFooter());
  }

  private createInfoContentFooter(): HTMLElement {
    const infoContainer_footer = createElement('div', ['info-container_footer']);

    const infoWrapper = createElement('div', ['info-wrapper_footer', 'width-content']);

    infoWrapper.append(this.createFirstBlockInfo(), this.createSecondBlockInfo(), this.createThirdBlockInfo());
    infoContainer_footer.append(infoWrapper);

    return infoContainer_footer;
  }

  private createFirstBlockInfo(): HTMLElement {
    const info_firstBlock = createElement('div', ['block-wrapper']);

    const firstBlock_img = createElement('div', ['first-block_img']);

    const firstBlock_title = createElement('h4', [], {}, 'Garden Care');

    const firstBlock_text = createElement(
      'p',
      ['block-text'],
      {},
      'You can trust us to take care of your garden and your indoor plants.'
    );

    info_firstBlock.append(firstBlock_img, firstBlock_title, firstBlock_text);

    return info_firstBlock;
  }

  private createSecondBlockInfo(): HTMLElement {
    const info_secondBlock = createElement('div', ['block-wrapper']);

    const secondBlock_img = createElement('div', ['second-block_img']);

    const secondBlock_title = createElement('h4', [], {}, 'Plant Renovation');

    const secondBlock_text = createElement(
      'p',
      ['block-text'],
      {},
      'You can entrust us with the reconstruction of your garden and your indoor plants.'
    );

    info_secondBlock.append(secondBlock_img, secondBlock_title, secondBlock_text);

    return info_secondBlock;
  }

  private createThirdBlockInfo(): HTMLElement {
    const info_thirdBlock = createElement('div', ['block-wrapper']);

    const thirdBlock_img = createElement('div', ['third-block_img']);

    const thirdBlock_title = createElement('h4', [], {}, 'Watering Graden');

    const thirdBlock_text = createElement(
      'p',
      ['block-text'],
      {},
      'You can trust us to water your garden and your indoor plants.'
    );

    info_thirdBlock.append(thirdBlock_img, thirdBlock_title, thirdBlock_text);

    return info_thirdBlock;
  }

  private createLinksContentFooter(): HTMLElement {
    const linksWrapper = createElement('div', ['link-wrapper_footer', 'width-content']);

    const linkContainer_footer = createElement('div', ['link-container_footer']);

    const logoWrapper = createElement('div', ['logo-wrapper', 'logo-footer']);

    const logoImg = createElement('div', ['logo-img']);

    const logoText = createElement('span', ['logo-text'], {}, 'PLANTIQUE');

    logoWrapper.append(logoImg, logoText);

    const rsLinks = createElement('a', ['rs-link', 'link'], { href: 'https://rs.school/js/' }, 'RS School');

    linksWrapper.append(logoWrapper, rsLinks, this.createGitHubLinksContent());
    linkContainer_footer.append(linksWrapper);

    return linkContainer_footer;
  }

  private createGitHubLinksContent(): HTMLElement {
    const gitHubLinks = createElement('div', ['git-hub_wrapper']);

    const linksContainer = createElement('div', ['links-container']);

    const gitHubImg = createElement('div', ['git-hub-img']);

    const gitHubLinks_first = createElement('a', ['link'], { href: 'https://github.com/lizavr' }, 'lizavr');

    const gitHubLinks_second = createElement(
      'a',
      ['link'],
      { href: 'https://github.com/fedko-zhenja' },
      'fedko-zhenja'
    );

    const gitHubLinks_thrid = createElement(
      'a',
      ['link'],
      { href: 'https://github.com/allaprischepa' },
      'allaprischepa'
    );

    linksContainer.append(gitHubLinks_first, gitHubLinks_second, gitHubLinks_thrid);
    gitHubLinks.append(gitHubImg, linksContainer);

    return gitHubLinks;
  }
}
