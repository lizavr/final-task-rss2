import './product.scss';
import { createElement } from '../../../utils/utils';
import { Product } from '@commercetools/platform-sdk';
import { Slider } from '../../pageComponents/slider/slider';
import shoppingFlow from '../../shoppingFlow/shoppingFlow';

export class ProductContent {
  public wrapper: HTMLElement;
  public buttonWrap: HTMLElement;

  constructor(product: Product) {
    window.scroll(0, 0);

    this.wrapper = createElement('div', ['product_page'], { id: 'product' });

    this.buttonWrap = createElement('div', ['buy-btn_wrap']);

    this.isInCart(product);

    this.wrapper.append(this.createProductContent(product));
  }

  private createProductContent(product: Product): HTMLElement {
    const productContent = createElement('div', ['product_content', 'width-content']);

    productContent.append(this.createProductImgContent(product), this.createProductDescription(product));
    return productContent;
  }

  private createProductImgContent(product: Product): HTMLElement {
    const productImagesObj = product.masterData.current.masterVariant.images;

    const arrayImgUrl: string[] = [];

    productImagesObj?.forEach((img) => {
      arrayImgUrl.push(img.url);
    });

    const slider = new Slider(arrayImgUrl);
    return slider.sliderWrapper;
  }

  private createProductDescription(product: Product): HTMLElement {
    const productData = product.masterData.current;

    const productDescriptionWrap = createElement('div', ['product_description-wrapper']);

    const productTitle = createElement('h1', ['product_title'], {}, productData.name['en-US']);

    const productPriceWrapper = createElement('div', ['product_price-wrapper']);

    const priceData = productData.masterVariant.prices;

    if (priceData) {
      const priceValue = `$${(priceData[0].value.centAmount / 100).toFixed(2)}`;

      const price = createElement('span', [], {}, priceValue);

      const priceDiscount = productData.masterVariant.prices[0].discounted?.value;

      if (priceDiscount) {
        const discountPrice = createElement(
          'span',
          ['product_price-dicount'],
          {},
          `$${(priceDiscount.centAmount / 100).toFixed(2)}`
        );

        price.style.textDecoration = 'line-through';
        productPriceWrapper.append(price, discountPrice);
      } else {
        price.classList.add('product_price');
        productPriceWrapper.append(price);
      }
    }

    productDescriptionWrap.append(
      productTitle,
      productPriceWrapper,
      this.createProductText(product),
      this.createProductAtribute(product),
      this.buttonWrap
    );
    return productDescriptionWrap;
  }

  private createProductText(product: Product): HTMLElement {
    const productData = product.masterData.current.description;

    const descriptionWrapper = createElement('div', ['product_descript-wrapper']);

    if (productData) {
      const productText = productData['en-US'];

      const descriptionTitle = createElement('h3', ['product_descript-title'], {}, 'Description:');

      const descriptionText = createElement('div', ['product_descript-text'], {}, productText);

      descriptionWrapper.append(descriptionTitle, descriptionText);
    }

    return descriptionWrapper;
  }

  private createProductAtribute(product: Product): HTMLElement {
    const productData = product.masterData.current.masterVariant.attributes;

    const atributeWrap = createElement('div', ['product_atribute-wrap']);

    if (productData) {
      productData.forEach((atribute) => {
        const nameTitle = atribute.name[0].toUpperCase() + atribute.name.slice(1) + ':';
        const title = createElement('h3', ['product_descript-title'], {}, nameTitle);

        let textValue = null;

        if (typeof atribute.value === 'string') {
          textValue = atribute.value;
        } else {
          textValue = atribute.value.label;
        }

        const text = createElement('div');

        if (atribute.name === 'size') {
          text.classList.add('product_size-value');
          text.innerText = textValue[0];
        } else {
          text.classList.add('product_descript-text');
          text.innerText = textValue;
        }
        atributeWrap.append(title, text);
      });
    }
    return atributeWrap;
  }

  private createAddBtn(product: Product): HTMLElement {
    const addBtn = createElement('button', ['add-product_btn'], {}, 'ADD TO CART');

    addBtn.addEventListener('click', async () => {
      addBtn.innerText = '✓';
      addBtn.classList.add('validate');

      await shoppingFlow.addToCart(product.id);

      this.isInCart(product);
    });

    return addBtn;
  }

  private createRemoveBtn(product: Product): HTMLElement {
    const removeBtn = createElement('button', ['remove-product_btn', 'in-cart'], {}, 'REMOVE FROM CART');

    removeBtn.addEventListener('click', async () => {
      removeBtn.innerText = '✓';
      removeBtn.classList.add('validate');

      await shoppingFlow.removeFromCart(product.id);

      this.isInCart(product);
    });

    return removeBtn;
  }

  private async isInCart(product: Product): Promise<void> {
    const isInCart = await shoppingFlow.isInCart(product.id);

    if (isInCart === true) {
      this.buttonWrap.replaceChildren(this.createRemoveBtn(product));
    } else {
      this.buttonWrap.replaceChildren(this.createAddBtn(product));
    }
  }
}
