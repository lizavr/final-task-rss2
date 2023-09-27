import { createElement } from '../../../../utils/utils';
import CategoriesElement from '../categoriesElement/categoriesElement';
import AttributesElement from '../attributesElement/attributesElement';
import { Category } from '@commercetools/platform-sdk';

export default class FiltersElement {
  private catalogFiltersWrapper: HTMLElement;
  private attributesElement: AttributesElement;

  constructor(category: Category | null = null) {
    const categoriesElement = new CategoriesElement(category);
    this.attributesElement = new AttributesElement();
    this.catalogFiltersWrapper = this.createCatalogFilters(
      categoriesElement.getHtmlElement(),
      this.attributesElement.getHtmlElement()
    );
  }

  public getHtmlElement(): HTMLElement {
    return this.catalogFiltersWrapper;
  }

  public getFiltersQuery(): string[] {
    return this.attributesElement.getFiltersQuery();
  }

  private createCatalogFilters(categoriesWrapper: HTMLElement, attributesWrapper: HTMLElement): HTMLElement {
    const filterWrapper = createElement('div', ['filter-wrapper', 'nav-bar']);
    filterWrapper.append(categoriesWrapper, attributesWrapper);

    return filterWrapper;
  }
}
