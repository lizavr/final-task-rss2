import { AttributeDefinition, ProductTypePagedQueryResponse } from '@commercetools/platform-sdk';
import { createElement } from '../../../../utils/utils';
import { ApiClient } from '../../../api/client';
import { handleApiError } from '../../../api/apiErrorHandler';
import PriceFilterElement from '../priceFilterElement/priceFilterElement';
import IFilterElement from '../ifilterElement/ifilterElement';
import { PubSub } from '../../../../services/pubSub';
import EnumFilterElement from '../enumFilterElement/enumFilterElement';

export default class AttributesElement {
  private attributesWrapper: HTMLElement;
  private filterElements: IFilterElement[];
  private pubSub: PubSub;

  constructor() {
    this.attributesWrapper = this.createAttributesWrapper();
    this.filterElements = [];
    this.pubSub = PubSub.getInstance();
    this.loadAttributes();
  }

  public getHtmlElement(): HTMLElement {
    return this.attributesWrapper;
  }

  public getFiltersQuery(): string[] {
    return this.filterElements.filter((item) => item.isSelected()).map((item) => item.getFilterQuery());
  }

  private loadAttributes(): void {
    ApiClient.getInstance()
      .apiRoot.productTypes()
      .get()
      .execute()
      .then((response) => this.drawAttributes(response.body))
      .catch((error) => {
        console.log(error);
        handleApiError(error);
      });
  }

  private drawAttributes(response: ProductTypePagedQueryResponse): void {
    this.attributesWrapper.innerHTML = '';
    const uniqueAttributes: AttributeDefinition[] = [];
    response.results.forEach((item) => {
      item.attributes
        ?.filter((attribute) => attribute.isSearchable)
        .forEach((attribute) => {
          if (!uniqueAttributes.find((it) => it.name === attribute.name)) {
            uniqueAttributes.push(attribute);
          }
        });
    });

    const priceFilterElement = new PriceFilterElement();
    this.filterElements.push(priceFilterElement);
    this.attributesWrapper.append(priceFilterElement.getHtmlElement());

    const productTypeOptions = response.results.map((item) => {
      return {
        key: item.id,
        label: item.name,
      };
    });
    const productFilterElement = new EnumFilterElement(`productType.id`, 'Product', productTypeOptions);
    this.filterElements.push(productFilterElement);
    this.attributesWrapper.append(productFilterElement.getHtmlElement());

    const filterElements = uniqueAttributes.map((item) => this.createFilterElement(item));
    this.filterElements.push(...filterElements);
    this.attributesWrapper.append(...filterElements.map((item) => item.getHtmlElement()));

    const filterButton = createElement('button', ['button-form']);
    filterButton.innerHTML = 'Filter';
    filterButton.addEventListener('click', () => this.filter());

    const resetButton = createElement('button', ['button-form']);
    resetButton.innerHTML = 'Reset';
    resetButton.addEventListener('click', () => this.reset());
    this.attributesWrapper.append(filterButton, resetButton);
  }

  private createFilterElement(attribute: AttributeDefinition): IFilterElement {
    if (attribute.type.name === 'enum') {
      const options = attribute.type.values.map((item) => {
        return {
          key: item.key,
          label: item.label,
        };
      });
      return new EnumFilterElement(`variants.attributes.${attribute.name}.key`, attribute.label['en-US'], options);
    }
    throw new Error(`Attribute type ${attribute.type.name} isn't supported`);
  }

  private createAttributesWrapper(): HTMLElement {
    const attributesWrapper = createElement('div', ['attributes-wrapper']);

    return attributesWrapper;
  }

  private filter(): void {
    this.pubSub.publish(PubSub.eventName.filtersUpdated);
  }

  private reset(): void {
    this.filterElements.forEach((item) => item.reset());
    this.pubSub.publish(PubSub.eventName.filtersUpdated);
  }
}
