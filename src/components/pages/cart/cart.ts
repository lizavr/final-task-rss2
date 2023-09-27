import { Cart, LineItem } from '@commercetools/platform-sdk';
import { createElement } from '../../../utils/utils';
import shoppingFlow from '../../shoppingFlow/shoppingFlow';
import './cart.scss';
import { Attributes, PathObj } from '../../../types/types';
import swal from 'sweetalert';

export class CartContent {
  public wrapper: HTMLElement;
  private cart: Cart | null = null;
  private innerContent: HTMLElement;
  private columns = ['Product', 'Price', 'Quantity', 'Total', ''];

  constructor() {
    this.wrapper = createElement('main', ['cart_page', 'width-content'], { id: 'cart' });
    this.innerContent = createElement('div', ['inner-content']);
    this.addPageContent();
  }

  private async addPageContent(): Promise<void> {
    this.cart = await shoppingFlow.getMyCart();

    const breadcrumbs = this.createBreadcrumbs();
    const innerContent = await this.getInnerContent();
    this.innerContent.append(innerContent);

    this.wrapper.append(breadcrumbs, this.innerContent);
  }

  private async getInnerContent(): Promise<HTMLElement> {
    return this.cart?.lineItems.length
      ? await this.createCartContent(this.cart.lineItems)
      : this.createEmptyCartContent();
  }

  private createBreadcrumbs(): HTMLElement {
    const wrapper = createElement('div', ['breadcrumbs']);
    const divider = document.createTextNode(' / ');

    const homeLink = createElement('a', ['breadcrumb-link'], { href: PathObj.mainPath }, 'Home');
    const catalogLink = createElement('a', ['breadcrumb-link'], { href: PathObj.catalogPath }, 'Catalog');
    const cartLink = createElement('a', ['breadcrumb-link'], { href: PathObj.cartPath }, 'Cart');

    wrapper.append(homeLink, divider, catalogLink, divider.cloneNode(), cartLink);

    return wrapper;
  }

  private async createCartContent(lineItems: LineItem[]): Promise<HTMLElement> {
    const wrapper = createElement('div', ['cart_content-wrapper']);
    const cartContent = createElement('div', ['cart_content']);

    const table = createElement('div', ['products-list']);
    const tableHead = this.createProductsListHead();
    const tableBody = this.createProductsListBody(lineItems);
    table.append(tableHead, tableBody);

    const cartTotals = await this.createCartTotals();

    const removeCart = createElement('button', ['clear-cart-btn'], {}, 'Clear Shopping Cart');

    removeCart.addEventListener('click', () => {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to clear the shopping cart?',
        icon: 'warning',
        buttons: ['Cancel', 'Clear'],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          shoppingFlow.deleteCart().then((res) => {
            this.cart = res;
            this.updateCart();
          });
        }
      });
    });

    cartContent.append(table, cartTotals);
    wrapper.append(cartContent, removeCart);

    return wrapper;
  }

  private createEmptyCartContent(): HTMLElement {
    const empty = createElement('div', ['cart_content_empty']);
    const linkToCatalog = createElement('a', [], { href: PathObj.catalogPath }, 'Catalog');
    const message = createElement('p');

    message.append(
      `Your shopping cart is currently empty. Please browse our catalog to find the items you'd like to purchase. `,
      linkToCatalog
    );
    empty.append(message);

    return empty;
  }

  private createProductsListHead(): HTMLElement {
    const tableHead = createElement('div', ['table_head']);

    this.columns.forEach((columnName) => {
      const columnHeader = createElement('div');
      const header = createElement('span', [], {}, columnName);

      columnHeader.append(header);
      tableHead.append(columnHeader);
    });

    return tableHead;
  }

  private createProductsListBody(lineItems: LineItem[]): HTMLElement {
    const tableBody = createElement('div', ['table_body']);

    lineItems.forEach((lineItem) => {
      const row = createElement('div', ['table_row'], { 'data-productId': lineItem.productId });

      this.columns.forEach((columnName) => {
        const { price, discountPrice, cartDiscountPrice } = this.getPrices(lineItem);
        const realPrice = discountPrice ? discountPrice : price;

        if (columnName === 'Product') row.append(this.getProductData(lineItem, realPrice, cartDiscountPrice));
        else if (columnName === 'Price') row.append(this.getProductPrice(realPrice, cartDiscountPrice));
        else if (columnName === 'Quantity') row.append(this.getProductQuantity(lineItem));
        else if (columnName === 'Total') row.append(this.getProductTotalAmount(lineItem, realPrice, cartDiscountPrice));
        else row.append(this.getProductRemoveButton(lineItem));
      });

      tableBody.append(row);
    });

    return tableBody;
  }

  private getProductData(lineItem: LineItem, realPrice: string, cartDiscountPrice: string | undefined): HTMLElement {
    const wrapper = createElement('div', ['product-data']);
    const name = this.getProductName(lineItem, realPrice, cartDiscountPrice);
    const image = this.getProductImage(lineItem);

    wrapper.append(image, name);
    return wrapper;
  }

  private getProductName(lineItem: LineItem, realPrice: string, cartDiscountPrice: string | undefined): HTMLElement {
    const wrapper = createElement('div', ['product-name']);
    const linkAttrs: Attributes = { href: `${PathObj.productPath}/${lineItem.productKey}` };
    const name = createElement('a', ['link'], linkAttrs, `${lineItem.name['en-US']}`);
    const amount = (+realPrice * lineItem.quantity).toFixed(2);
    const price = createElement('div', ['total-price']);
    price.innerHTML = `<span class="total">$${amount}</span><span class="one-piece">(1 pc: $${realPrice})</span>`;

    if (cartDiscountPrice) {
      const discountAmount = (+cartDiscountPrice * lineItem.quantity).toFixed(2);
      price.innerHTML = `<div class="total"><span>$${discountAmount}</span> <s>$${amount}</s></div><div class="one-piece">(1 pc: <span>$${cartDiscountPrice}</span> <s>$${realPrice})</s></div>`;
    }

    wrapper.append(name, price);
    return wrapper;
  }

  private getProductPrice(price: string, cartDiscountPrice: string | undefined): HTMLElement {
    const element = createElement('div', ['price']);
    element.innerHTML = `<span>$${price}</span>`;

    if (cartDiscountPrice) {
      element.innerHTML = `<span>$${cartDiscountPrice}</span> <s>$${price}</s>`;
    }

    return element;
  }

  private getProductQuantity(lineItem: LineItem): HTMLElement {
    const quantityWrapper = createElement('div', ['product-quantity'], {});
    const minusBtn = createElement('button', ['minus-btn'], {}, '−');
    const plusBtn = createElement('button', ['plus-btn'], {}, '+');
    const quantityEl = createElement('span', ['quantity'], {}, `${lineItem.quantity}`);

    minusBtn.addEventListener('click', () => {
      shoppingFlow.removeFromCart(lineItem.productId, 1).then((res) => {
        this.cart = res;
        this.updateCart();
      });
    });

    plusBtn.addEventListener('click', () => {
      shoppingFlow.addToCart(lineItem.productId).then((res) => {
        this.cart = res;
        this.updateCart();
      });
    });

    quantityWrapper.append(minusBtn, quantityEl, plusBtn);

    return quantityWrapper;
  }

  private getProductTotalAmount(
    lineItem: LineItem,
    realPrice: string,
    cartDiscountPrice: string | undefined
  ): HTMLElement {
    const element = createElement('div', ['total-amount']);
    const amount = (+realPrice * lineItem.quantity).toFixed(2);
    element.innerHTML = `<span>$${amount}</span>`;

    if (cartDiscountPrice) {
      const discountAmount = (+cartDiscountPrice * lineItem.quantity).toFixed(2);
      element.innerHTML = `<span>$${discountAmount}</span> <s>$${amount}</s>`;
    }

    return element;
  }

  private getProductRemoveButton(lineItem: LineItem): HTMLElement {
    const removeBtnWrapper = createElement('div', ['remove-link-wrapper']);
    const removeBtn = createElement('a', ['remove-link']);

    removeBtn.addEventListener('click', () =>
      shoppingFlow.removeFromCart(lineItem.productId).then((res) => {
        this.cart = res;
        this.updateCart();
      })
    );

    removeBtnWrapper.append(removeBtn);

    return removeBtnWrapper;
  }

  private getPrices(
    lineItem: LineItem
  ): {
    price: string;
    discountPrice: string | undefined;
    cartDiscountPrice: string | undefined;
  } {
    let price, discountPrice, cartDiscountPrice;

    if (lineItem.price) {
      price = (lineItem.price.value.centAmount / 100).toFixed(2);
      if (lineItem.price.discounted?.value) {
        discountPrice = (lineItem.price.discounted?.value.centAmount / 100).toFixed(2);
      }
      if (lineItem.discountedPricePerQuantity[0]) {
        cartDiscountPrice = (lineItem.discountedPricePerQuantity[0].discountedPrice.value.centAmount / 100).toFixed(2);
      }
    } else {
      price = '';
    }
    return { price, discountPrice, cartDiscountPrice };
  }

  private getProductImage(lineItem: LineItem): HTMLElement {
    const imageEl = createElement('div', ['product-img']);
    const link = createElement('a', ['link'], { href: `${PathObj.productPath}/${lineItem.productKey}` });
    if (lineItem.variant.images) {
      imageEl.style.backgroundImage = `url('${lineItem.variant.images[0].url}')`;
    } else {
      imageEl.style.backgroundImage = `url(${'../../assets/images/image-coming.png'})`;
    }

    link.append(imageEl);
    return link;
  }

  private async updateCart(): Promise<void> {
    const innerContent = await this.getInnerContent();
    this.innerContent.replaceChildren(innerContent);
  }

  private async createCartTotals(): Promise<HTMLElement> {
    const promoCode = await this.getPromoCode();
    const cartTotals = createElement('div', ['cart-totals']);
    const cartTotalsHeader = createElement('h3', [], {}, 'Cart Totals');
    const couponEl = createElement('div', ['coupon-apply']);
    const couponLabel = createElement('label', [], {}, 'Coupon Apply');
    const couponInput = createElement('input', ['coupon-input'], {
      placeholder: 'Enter coupon code here...',
      name: 'coupon-input',
      value: promoCode ? promoCode : '',
    });
    const couponBtnApply = createElement('button', ['coupon-btn'], {}, 'Apply');
    const couponInputWrapper = createElement('div', ['coupon-input-wrapper']);

    const totalPrice = this.cart ? (this.cart?.totalPrice.centAmount / 100).toFixed(2) : 0;
    const subtotalPrice = this.cart ? this.getSubTotalPrice() : 0;
    const discountSum = (+subtotalPrice - +totalPrice).toFixed(2);

    const subtotal = createElement('div', ['subtotal']);
    subtotal.innerHTML = `<span class="label">Subtotal</span><span class="amount">$${subtotalPrice}<span>`;

    const discount = createElement('div', ['discount-sum']);
    discount.innerHTML = `<span class="label">Discount</span><span class="amount">(-) $${discountSum}<span>`;

    const total = createElement('div', ['total']);
    total.innerHTML = `<span class="label">Total</span><span class="amount">$${totalPrice}<span>`;

    couponBtnApply.addEventListener('click', () => {
      if (couponInput instanceof HTMLInputElement) {
        const value = couponInput.value;

        if (value && value !== promoCode) {
          shoppingFlow.applyPromocode(value).then((res) => {
            this.cart = res;
            this.updateCart();
          });
        }
      }
    });

    couponInputWrapper.append(couponInput, couponBtnApply);
    couponEl.append(couponLabel, couponInputWrapper);
    cartTotals.append(cartTotalsHeader, couponEl, subtotal, discount, total);

    return cartTotals;
  }

  private async getPromoCode(): Promise<string | null> {
    const discountId = this.cart?.discountCodes[0]?.discountCode.id;
    return discountId ? await shoppingFlow.getCodeByDiscountID(discountId) : null;
  }

  private getSubTotalPrice(): string {
    const lineItems = this.cart?.lineItems ? [...this.cart.lineItems] : [];
    const subtotal = lineItems.reduce((sum, lineItem) => {
      const { price, discountPrice } = this.getPrices(lineItem);
      const realPrice = discountPrice ? discountPrice : price;

      return sum + +realPrice * lineItem.quantity;
    }, 0);

    return subtotal.toFixed(2);
  }
}
