import { createElement, createHorizontalTextElement } from '../../../utils/utils';
import { ApiClient } from '../../api/client';
import './promoBlock.scss';

export class PromoBlock {
  private htmlElement: HTMLElement;
  private apiClient = ApiClient.getInstance();

  constructor() {
    this.htmlElement = createElement('div', ['promo-block']);
    this.createBlockContent();
  }

  public getHtmlElement(): HTMLElement {
    return this.htmlElement;
  }

  private async createBlockContent(): Promise<void> {
    const discountCodes = await this.apiClient.apiRoot
      .discountCodes()
      .get({ queryArgs: { where: `isActive=true` } })
      .execute()
      .then((res) => res.body.results)
      .catch(() => null);

    const productDiscounts = await this.apiClient.apiRoot
      .productDiscounts()
      .get({ queryArgs: { where: `isActive=true` } })
      .execute()
      .then((res) => res.body.results)
      .catch(() => null);

    if (discountCodes?.length || productDiscounts?.length) {
      const header = createHorizontalTextElement('Promo');
      const allDiscountsBlock = createElement('div', ['all-discounts-block']);

      if (productDiscounts?.length) {
        productDiscounts.forEach((discount) => {
          const discountName = discount.name ? `${discount.name['en-US']}` : 'Discount';
          const discountEl = createElement('div', ['discount']);
          const name = createElement('span', ['discount-name'], {}, discountName);
          let description = null;

          if (discount.description) {
            description = createElement('div', ['discount-description']);
            description.innerHTML = `${discount.description['en-US']}`;
          }
          const discountCode = createElement('span', ['no-discount-code'], {}, '* no discount code required');

          discountEl.append(name);
          if (description) discountEl.append(description);
          discountEl.append(discountCode);

          allDiscountsBlock.append(discountEl);
        });
      }

      if (discountCodes?.length) {
        discountCodes.forEach((discount) => {
          const discountName = discount.name ? `${discount.name['en-US']}` : 'Discount';
          const discountEl = createElement('div', ['discount']);
          const name = createElement('span', ['discount-name'], {}, discountName);
          let description = null;

          if (discount.description) {
            description = createElement('div', ['discount-description']);
            description.innerHTML = `${discount.description['en-US']}`;
          }
          const discountCode = createElement('span', ['discount-code'], {}, discount.code);

          discountEl.append(name, discountCode);
          if (description) discountEl.append(description);

          allDiscountsBlock.append(discountEl);
        });
      }

      this.htmlElement.append(header, allDiscountsBlock);
    }
  }
}
