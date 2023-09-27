import { EnumFilterOption } from '../../../../types/types';
import { createElement } from '../../../../utils/utils';
import IFilterElement from '../ifilterElement/ifilterElement';

export default class EnumFilterElement implements IFilterElement {
  private elementWrapper: HTMLElement;
  private filter: string;
  private checkboxInputs: HTMLInputElement[];

  constructor(filter: string, title: string, options: EnumFilterOption[]) {
    const { element: elementWrapper, inputs: checkboxInputs } = this.createElementWrapper(title, options);

    this.elementWrapper = elementWrapper;
    this.checkboxInputs = checkboxInputs;
    this.filter = filter;
  }

  public reset(): void {
    this.checkboxInputs.forEach((item) => (item.checked = false));
  }

  public getFilterQuery(): string {
    const selectedOptions = this.getSelectedOptions();
    const selectedOptionsWithQuotes = selectedOptions.map((item) => `"${item}"`);
    if (selectedOptions.length) {
      return `${this.filter}:${selectedOptionsWithQuotes.join(',')}`;
    } else {
      return '';
    }
  }

  public isSelected(): boolean {
    const selectedOptions = this.getSelectedOptions();
    return selectedOptions.length > 0;
  }

  public getHtmlElement(): HTMLElement {
    return this.elementWrapper;
  }

  private getSelectedOptions(): string[] {
    return this.checkboxInputs
      .filter((item) => item.checked)
      .map((item) => item.getAttribute('key') ?? '')
      .filter((item) => item !== '');
  }

  private createElementWrapper(
    title: string,
    options: EnumFilterOption[]
  ): { element: HTMLElement; inputs: HTMLInputElement[] } {
    const attributeWrapper = createElement('div', ['attribute-wrapper']);
    const filterHeader = this.createFilterHeader(title);
    attributeWrapper.append(filterHeader);
    const inputElements: HTMLInputElement[] = [];
    options.forEach((enumItem) => {
      const divForAttribute = createElement('div', ['checkbox-element']);
      const enumItemInputElement = createElement('input', ['checkbox-element'], {
        type: 'checkbox',
        key: enumItem.key,
        id: `attr_${enumItem.label}`,
      });
      inputElements.push(enumItemInputElement as HTMLInputElement);
      const enumItemLabelElement = createElement('label', [], { for: `attr_${enumItem.label}` });
      enumItemLabelElement.innerHTML = enumItem.label;
      divForAttribute.append(enumItemInputElement, enumItemLabelElement);

      attributeWrapper.append(divForAttribute);
    });

    return { element: attributeWrapper, inputs: inputElements };
  }

  private createFilterHeader(title: string): HTMLElement {
    const categoriesHeader = createElement('h3', ['filter-header-text']);
    categoriesHeader.innerHTML = title;
    return categoriesHeader;
  }
}
