import './main.scss';
import { createElement } from '../../../utils/utils';
import { PromoBlock } from '../../pageComponents/promoBlock/promoBlock';

export class Main {
  public wrapper: HTMLElement;
  private promoBlock = new PromoBlock();

  constructor() {
    this.wrapper = createElement('div', ['main_page'], { id: 'main' });

    this.wrapper.append(this.createInfoContent(), this.promoBlock.getHtmlElement());
  }

  private createInfoContent(): HTMLElement {
    const infoContent_wrapper = createElement('div', ['info-content']);

    infoContent_wrapper.append(this.createWelcomeInfoContent());

    return infoContent_wrapper;
  }

  private createWelcomeInfoContent(): HTMLElement {
    const wrapper = createElement('div', [], {});
    const welcomeInfoWrapper = createElement('div', ['welcome_info-wrapper', 'width-content']);

    const welcomeInfo = createElement('div', ['welcome_info']);

    const welcomeText = createElement('p', ['welcome_text'], {}, 'Welcome to PLANTIQUE');

    const greenWord = createElement('span', [], {}, 'PLANET');
    greenWord.style.color = '#46A358';

    const welcomeTitle = createElement('h1', ['main-title'], {}, 'Let’s Make a Better ');
    welcomeTitle.append(greenWord);

    const welcomeInfoText = createElement(
      'p',
      ['welcome_info-text'],
      {},
      'We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!'
    );

    const welcomeImg = createElement('div', ['welcome-img']);

    welcomeInfo.append(welcomeText, welcomeTitle, welcomeInfoText);
    welcomeInfoWrapper.append(welcomeInfo, welcomeImg);

    const crossCheckDescription = this.createCrossCheckDescriptionElement();

    wrapper.append(crossCheckDescription, welcomeInfoWrapper);

    return wrapper;
  }

  private createCrossCheckDescriptionElement(): HTMLElement {
    const crossCheckDescription = createElement('div', ['container-central']);
    crossCheckDescription.innerHTML = `<h3>Пояснения к Cross-Check проверке.</h3>
     <ul>Пагинация:</ul>
     <li>Количество элементов, возвращаемых одним запросом равно 6.</li>
     <li>Пагинация реализована через кнопку Load More, по нажатию на которую загружается следующие 6 элементов.</li>
     <li>При применении фильтров или сортировки загрузка элементов происходит с 1-й страницы.</li>
     <ul>Индикатор загрузки:</ul>
     <li>Добавлен доп. интервал (400мс), чтобы увеличить время загрузки с CommerceTools и сделать индикатор визуально видимым, т.к. скорость ответа быстрая.</li>
      `;
    return crossCheckDescription;
  }
}
