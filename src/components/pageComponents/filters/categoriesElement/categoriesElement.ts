import { Category, CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { createElement } from '../../../../utils/utils';
import { ApiClient } from '../../../api/client';
import { handleApiError } from '../../../api/apiErrorHandler';

export default class CategoriesElement {
  private categoriesWrapper: HTMLElement;
  private selectedCategory: Category | null;

  constructor(category: Category | null = null) {
    this.selectedCategory = category;
    this.categoriesWrapper = this.createCategoriesWrapper();
    this.loadCategories();
  }

  public getHtmlElement(): HTMLElement {
    return this.categoriesWrapper;
  }

  private loadCategories(): void {
    ApiClient.getInstance()
      .apiRoot.categories()
      .get({
        queryArgs: {
          where: this.selectedCategory ? `parent(id="${this.selectedCategory.id}")` : 'ancestors is empty',
          sort: 'orderHint desc',
        },
      })
      .execute()
      .then((response) => this.drawCategories(response.body))
      .catch((error) => handleApiError(error));
  }

  private drawCategories(response: CategoryPagedQueryResponse): void {
    this.categoriesWrapper.innerHTML = '';
    if (!response.results.length) {
      return;
    }
    this.categoriesWrapper.append(this.createFilterHeader('Categories'));
    response.results.forEach((item) => {
      this.categoriesWrapper.append(this.createCategoryLink(item));
    });
  }

  private createCategoryLink(category: Category): HTMLElement {
    const categoryLink = createElement('a', [], { href: `/catalog/${category.key}` });
    categoryLink.innerHTML = category.name['en-US'];
    return categoryLink;
  }

  private createFilterHeader(title: string): HTMLElement {
    const categoriesHeader = createElement('h3', ['filter-header-text']);
    categoriesHeader.innerHTML = title;
    return categoriesHeader;
  }

  private createCategoriesWrapper(): HTMLElement {
    const categoriesWrapper = createElement('div', ['categories-wrapper']);

    return categoriesWrapper;
  }
}
