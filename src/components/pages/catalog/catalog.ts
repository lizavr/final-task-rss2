import { Category, ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { createElement } from '../../../utils/utils';
import { ApiClient } from '../../api/client';
import { handleApiError } from '../../api/apiErrorHandler';
import './catalog.scss';
import FiltersElement from '../../pageComponents/filters/filtersElement/filtersElement';
import { PubSub } from '../../../services/pubSub';
import { EventCallback, QueryArgsType } from '../../../types/types';
import shoppingFlow from '../../shoppingFlow/shoppingFlow';

export default class Catalog {
  private currentSort = 'name.en-US asc';
  private currentPage = 0;

  private static readonly DESCRIPTION_LENGTH = 130;
  private static readonly ITEMS_PER_PAGE = 6;
  private static readonly API_RESPONSE_DELAY = 400;

  public wrapper: HTMLElement;
  private selectedCategory: Category | null;
  private catalogWrapper: HTMLElement;
  private control: HTMLElement;
  private catalogCardsWrapper: HTMLElement;
  private loadMoreButton: HTMLElement;
  private loadingIndicator: HTMLElement;
  private filtersHtmlElement: HTMLElement;
  private filtersElement: FiltersElement;
  private filtersUpdatedCallback: EventCallback;
  private searchText: string;
  private isDataLoaded: boolean;

  constructor(category: Category | null = null) {
    this.searchText = '';
    this.isDataLoaded = false;
    this.selectedCategory = category;
    this.wrapper = this.createPageWrapper();
    this.control = this.createControl();
    this.loadingIndicator = this.createLoadingElement();
    this.loadMoreButton = this.createLoadMoreButton();
    this.catalogCardsWrapper = this.createCatalogCardsWrapper();
    this.filtersElement = new FiltersElement(category);
    this.filtersHtmlElement = this.filtersElement.getHtmlElement();
    this.catalogWrapper = this.createWrapperForCatalog(
      this.filtersHtmlElement,
      this.catalogCardsWrapper,
      this.loadingIndicator
    );
    this.wrapper.append(this.control, this.catalogWrapper);
    this.changeElementsVisibility(false);
    this.filtersUpdatedCallback = () => this.loadProducts();
    PubSub.getInstance().subscribe(PubSub.eventName.filtersUpdated, this.filtersUpdatedCallback);
    this.loadProducts();
  }

  public cleanSubscriptions(): void {
    PubSub.getInstance().unsubscribe(PubSub.eventName.filtersUpdated, this.filtersUpdatedCallback);
  }

  private async loadProducts(currentPage = 0): Promise<void> {
    this.loadingIndicator.classList.remove('hidden');
    this.currentPage = currentPage;
    const queryArgs: { sort: string; filter?: string[]; ['text.EN-US']?: string } = this.createQueryArgs(currentPage);

    await new Promise((resolve) => setTimeout(resolve, Catalog.API_RESPONSE_DELAY));

    ApiClient.getInstance()
      .apiRoot.productProjections()
      .search()
      .get({
        queryArgs: queryArgs,
      })
      .execute()
      .then((response) => this.createCatalog(response.body))
      .catch((error) => handleApiError(error))
      .finally(() => this.loadingIndicator.classList.add('hidden'));
  }

  private createQueryArgs(currentPage: number): QueryArgsType {
    const filtersQuery = this.filtersElement.getFiltersQuery();
    if (this.selectedCategory) {
      filtersQuery.push(`categories.id: subtree("${this.selectedCategory.id}")`);
    }

    const queryArgs: QueryArgsType = {
      sort: this.currentSort,
    };

    if (filtersQuery && filtersQuery.length) {
      queryArgs.filter = filtersQuery;
    }

    if (this.searchText) {
      queryArgs['text.EN-US'] = this.searchText;
    }

    queryArgs.limit = Catalog.ITEMS_PER_PAGE;

    if (currentPage) {
      queryArgs.offset = currentPage * Catalog.ITEMS_PER_PAGE;
    }
    return queryArgs;
  }

  private createPageWrapper(): HTMLElement {
    const wrapper = createElement('div', ['wrapper-page']);
    return wrapper;
  }

  private createWrapperForCatalog(
    catalogFiltersWrapper: HTMLElement,
    catalogCardsWrapper: HTMLElement,
    loadingIndicatorWrapper: HTMLElement
  ): HTMLElement {
    const wrapper = createElement('div', ['catalog-page'], { id: 'catalog' });
    wrapper.append(catalogFiltersWrapper, catalogCardsWrapper);
    loadingIndicatorWrapper.classList.add('a');
    wrapper.append(loadingIndicatorWrapper);
    return wrapper;
  }

  private createSearchElement(): HTMLElement {
    const searchContainer = createElement('div', ['search-container']);
    const searchInputEl = createElement('input', ['search'], {
      type: 'text',
      placeholder: 'Enter product',
    }) as HTMLInputElement;
    const loupe = createElement('button', ['loupe'], { type: 'submit' });
    const cross = createElement('button', ['cross'], { type: 'submit' });
    cross.innerHTML = '&#215;';
    searchContainer.append(searchInputEl, loupe, cross);

    searchInputEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.searchText = searchInputEl.value;
        this.loadProducts();
      }
    });

    loupe.addEventListener('click', () => {
      this.searchText = searchInputEl.value;
      this.loadProducts();
    });

    cross.addEventListener('click', () => {
      searchInputEl.value = '';
      this.searchText = '';
      this.loadProducts();
    });

    return searchContainer;
  }

  private createControl(): HTMLElement {
    const controlEl = createElement('div', ['control']);
    const controlPathEl = this.createControlPathElement();
    const controlSortEl = this.createControlSelect();
    const search = this.createSearchElement();

    controlEl.append(controlPathEl, search, controlSortEl);

    return controlEl;
  }

  private createControlPathElement(): HTMLElement {
    const controlPathEl = createElement('div', ['control-path']);
    const homeLink = createElement('a', ['breadcrumb-link'], { href: '/' });
    homeLink.innerHTML = 'Home';
    const catalogLink = createElement('a', ['breadcrumb-link'], { href: '/catalog' });
    catalogLink.innerHTML = 'Catalog';

    controlPathEl.append(homeLink);
    controlPathEl.innerHTML += ' / ';
    controlPathEl.append(catalogLink);

    if (this.selectedCategory) {
      const pathElements = this.getCategoriesPath(this.selectedCategory);
      pathElements.forEach((item) => {
        controlPathEl.innerHTML += ' / ';
        controlPathEl.append(item);
      });
    }

    return controlPathEl;
  }

  private getCategoriesPath(category: Category): HTMLElement[] {
    const links: HTMLElement[] = [];
    let currentCategory: Category | undefined = category;
    while (currentCategory) {
      const categoryLink = createElement('a', ['breadcrumb-link'], { href: `/catalog/${currentCategory.key}` });
      categoryLink.innerHTML = currentCategory.name['en-US'];
      links.push(categoryLink);
      currentCategory = currentCategory.parent?.obj;
    }
    return links.reverse();
  }

  private createControlSelect(): HTMLElement {
    const controlSortEl = createElement('div', ['control-path']);
    const controlSortLabelEl = createElement('label', ['control-label'], { for: 'sort' });
    controlSortLabelEl.innerHTML = 'Sort by: ';
    const controlSelectEl = createElement('select', ['control-select'], { id: 'sort' });
    const sortOptionsEls = this.createSortOptions();
    controlSelectEl.append(...sortOptionsEls);
    controlSortEl.append(controlSortLabelEl, controlSelectEl);

    controlSelectEl.addEventListener('change', (ev) => {
      if (ev.target instanceof HTMLSelectElement) {
        this.currentSort = ev.target.value;
        this.loadProducts();
      }
    });

    return controlSortEl;
  }

  private createSortOptions(): HTMLElement[] {
    const sortOptions = [
      { value: 'name.en-US asc', label: 'Name: A - Z' },
      { value: 'name.en-US desc', label: 'Name: Z - A' },
      { value: 'price asc', label: 'Price: Low to High' },
      { value: 'price desc', label: 'Price: High to Low' },
    ];

    return sortOptions.map((item) => {
      const optionEl = createElement('option', [], { value: item.value });
      optionEl.innerHTML = item.label;
      return optionEl;
    });
  }

  private createLoadMoreButton(): HTMLElement {
    const buttonWrapper = createElement('div', ['load-more-button-wrapper']);
    const loadMoreButton = createElement('button', ['load-more-button'], { type: 'submit' }, 'Load more');
    loadMoreButton.addEventListener('click', () => this.loadProducts(this.currentPage));
    buttonWrapper.append(loadMoreButton);
    return buttonWrapper;
  }

  private async createCatalog(productsResponse: ProductProjectionPagedSearchResponse): Promise<void> {
    if (productsResponse.offset === 0) {
      this.catalogCardsWrapper.innerHTML = '';
    }

    if (this.catalogCardsWrapper.contains(this.loadMoreButton)) {
      this.catalogCardsWrapper.removeChild(this.loadMoreButton);
    }

    if (productsResponse.total) {
      const myCart = await shoppingFlow.getMyCart();
      this.currentPage++;
      productsResponse.results.forEach((item) => {
        const card = this.createCatalogCard(
          item,
          myCart !== null && myCart.lineItems.filter((cartItem) => item.id === cartItem.productId).length > 0
        );
        this.catalogCardsWrapper.append(card);
      });

      if (this.catalogCardsWrapper.childNodes.length < productsResponse.total) {
        this.catalogCardsWrapper.append(this.loadMoreButton);
      }
    } else {
      const label = createElement('h3', ['noFound']);
      label.innerHTML = 'No items found';
      this.catalogCardsWrapper.append(label);
    }
    if (!this.isDataLoaded) {
      this.isDataLoaded = true;
      this.changeElementsVisibility(true);
    }
  }

  private createCatalogCardsWrapper(): HTMLElement {
    const catalogCardsWrapper = createElement('div', ['catalog-cards']);

    return catalogCardsWrapper;
  }

  private createCatalogCard(product: ProductProjection, isInCart: boolean): HTMLElement {
    const { price, discountPrice } = this.getPrices(product);

    const card = createElement('a', ['card'], { href: `product/${product.key}` });
    const cardImgEl = this.createImageElement(product);
    const cardNameEl = this.createNameElement(product);
    const cardPriceEl = this.createPriceElement(price, discountPrice);
    const cardDiscountPriceEl = this.createDiscountPriceElement(discountPrice);
    const cardDescriptionEl = this.createDescriptionElement(product);
    const discountEl = this.createDiscountElement(price, discountPrice);
    const cartEl = this.createCartElement(product.id, isInCart);
    card.append(cardImgEl, discountEl, cartEl, cardNameEl, cardPriceEl, cardDiscountPriceEl, cardDescriptionEl);

    return card;
  }

  private createCartElement(productId: string, isInCart: boolean): HTMLElement {
    const cartElement = createElement('div', ['buy-btn_wrap']);
    if (isInCart) {
      cartElement.append(this.createRemoveBtn(cartElement, productId));
    } else {
      cartElement.append(this.createAddBtn(cartElement, productId));
    }
    return cartElement;
  }

  private createDiscountPriceElement(discountPrice: string | undefined): HTMLElement {
    const cardDiscountPriceEl = createElement('p', ['card-discount-price']);
    if (discountPrice) {
      cardDiscountPriceEl.innerHTML = `$${discountPrice}`;
      cardDiscountPriceEl.classList.add('discount-price');
    }
    return cardDiscountPriceEl;
  }

  private getPrices(product: ProductProjection): { price: string; discountPrice: string | undefined } {
    let price, discountPrice;

    if (product.masterVariant.prices && product.masterVariant.prices[0]) {
      price = (product.masterVariant.prices[0].value.centAmount / 100).toFixed(2);
      if (product.masterVariant.prices[0].discounted?.value) {
        discountPrice = (product.masterVariant.prices[0].discounted?.value.centAmount / 100).toFixed(2);
      }
    } else {
      price = '';
    }
    return { price, discountPrice };
  }

  private createPriceElement(price: string, discountPrice: string | undefined): HTMLElement {
    const cardPriceEl = createElement('p');
    if (price) {
      cardPriceEl.innerHTML = `$${price}`;
      cardPriceEl.classList.add('total-price');
    }
    cardPriceEl.classList.add(discountPrice ? 'through-price' : 'card-price');
    return cardPriceEl;
  }

  private createNameElement(product: ProductProjection): HTMLElement {
    const cardNameEl = createElement('p', ['card-name']);
    cardNameEl.innerHTML = `${product.name['en-US']}`;
    return cardNameEl;
  }

  private createImageElement(product: ProductProjection): HTMLElement {
    const cardImgEl = createElement('div', ['card-img']);
    if (product.masterVariant.images) {
      cardImgEl.style.backgroundImage = `url('${product.masterVariant.images[0].url}')`;
    } else {
      cardImgEl.style.backgroundImage = `url(${'../../assets/images/image-coming.png'})`;
    }
    return cardImgEl;
  }

  private getAmountDiscount(price: string, discountPrice: string | undefined): number {
    if (price && discountPrice) {
      const discount = Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100);
      return discount;
    }
    return 0;
  }

  private createDiscountElement(price: string, discountPrice: string | undefined): HTMLElement {
    const discount = this.getAmountDiscount(price, discountPrice);
    const amountDiscountElement = createElement('p', ['discount']);
    amountDiscountElement.innerHTML = discount ? `-${discount}%` : ``;

    return amountDiscountElement;
  }

  private createDescriptionElement(product: ProductProjection): HTMLElement {
    const cardDescriptionEl = createElement('p', ['card-description']);
    const descriptionSpanEl = createElement('span');
    if (!product.description) {
      cardDescriptionEl.innerHTML = ``;
    } else {
      descriptionSpanEl.innerHTML = 'Description: ';
      cardDescriptionEl.append(descriptionSpanEl);
      cardDescriptionEl.innerHTML += this.cutLine(product.description['en-US'], Catalog.DESCRIPTION_LENGTH);
    }

    return cardDescriptionEl;
  }

  private createLoadingElement(): HTMLElement {
    const loadingIndicatorWrapper = createElement('div', ['loading-indicator-wrapper', 'hidden']);
    const loadingIndicator = createElement('div', ['loading-indicator']);
    loadingIndicatorWrapper.append(loadingIndicator);
    return loadingIndicatorWrapper;
  }

  private cutLine(str: string, limit: number): string {
    if (str.length <= limit) {
      return str;
    }
    const res = str.substring(0, limit - 3);
    return `${res}...`;
  }

  private changeElementsVisibility(isVisible: boolean): void {
    const visibility = isVisible ? 'visible' : 'hidden';
    this.control.style.visibility = visibility;
    this.filtersHtmlElement.style.visibility = visibility;
    this.catalogCardsWrapper.style.visibility = visibility;
  }

  private createAddBtn(buttonWrap: HTMLElement, productId: string): HTMLElement {
    const addBtn = createElement('button', ['add-product_btn', 'cart-element'], {}, 'ADD TO CART');

    addBtn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      addBtn.innerText = '✓';
      addBtn.classList.add('validate');

      await shoppingFlow.addToCart(productId);

      await this.isInCart(buttonWrap, productId);
    });

    return addBtn;
  }

  private createRemoveBtn(buttonWrap: HTMLElement, productId: string): HTMLElement {
    const removeBtn = createElement(
      'button',
      ['remove-product_btn', 'cart-element', 'in-cart'],
      {},
      'REMOVE FROM CART'
    );

    removeBtn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      removeBtn.innerText = '✓';
      removeBtn.classList.add('validate');

      await shoppingFlow.removeFromCart(productId);

      await this.isInCart(buttonWrap, productId);
    });

    return removeBtn;
  }

  private async isInCart(buttonWrap: HTMLElement, productId: string): Promise<void> {
    const isInCart = await shoppingFlow.isInCart(productId);

    if (isInCart) {
      buttonWrap.replaceChildren(this.createRemoveBtn(buttonWrap, productId));
    } else {
      buttonWrap.replaceChildren(this.createAddBtn(buttonWrap, productId));
    }
  }
}
