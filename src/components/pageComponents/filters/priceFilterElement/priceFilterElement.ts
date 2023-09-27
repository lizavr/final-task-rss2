import { createElement } from '../../../../utils/utils';
import './inputRange.scss';
import 'nouislider/dist/nouislider.css';
import noUiSlider, { API } from 'nouislider';
import IFilterElement from '../ifilterElement/ifilterElement';

export default class PriceFilterElement implements IFilterElement {
  static readonly PRICE_LOW = 0;
  static readonly PRICE_HIGH = 100;

  private priceElementWrapper: HTMLElement;
  private priceRange: HTMLElement;
  private sliderElement: API;
  private from: number;
  private to: number;
  private fromInput: HTMLInputElement;
  private toInput: HTMLInputElement;

  constructor() {
    this.from = PriceFilterElement.PRICE_LOW;
    this.to = PriceFilterElement.PRICE_HIGH;
    this.fromInput = this.createFromInput();
    this.toInput = this.createToInput();
    const inputsRange = this.createInputsRange(this.fromInput, this.toInput);
    this.priceRange = this.createPriceRange();
    this.sliderElement = this.createSliderElement(this.priceRange);
    this.priceElementWrapper = this.createPriceFilterElement(this.priceRange, inputsRange);
  }

  public getFilterQuery(): string {
    return `variants.price.centAmount:range(${this.from * 100} to ${this.to * 100})`;
  }

  public isSelected(): boolean {
    return this.from != PriceFilterElement.PRICE_LOW || this.to != PriceFilterElement.PRICE_HIGH;
  }

  public getHtmlElement(): HTMLElement {
    return this.priceElementWrapper;
  }

  public reset(): void {
    this.sliderElement.set([PriceFilterElement.PRICE_LOW, PriceFilterElement.PRICE_HIGH]);
  }

  private createFilterHeader(title: string): HTMLElement {
    const categoriesHeader = createElement('h3', ['filter-header-text']);
    categoriesHeader.innerHTML = title;
    return categoriesHeader;
  }

  private createPriceFilterElement(priceRange: HTMLElement, inputsRange: HTMLElement): HTMLElement {
    const priceElementWrapper = createElement('div');
    const titlePrice = this.createFilterHeader('Price');
    priceElementWrapper.append(titlePrice, priceRange, inputsRange);
    return priceElementWrapper;
  }

  private createPriceRange(): HTMLElement {
    return createElement('div');
  }

  private createSliderElement(divSlider: HTMLElement): API {
    const sliderElement = noUiSlider.create(divSlider, {
      start: [this.from, this.to],
      connect: true,
      range: {
        min: PriceFilterElement.PRICE_LOW,
        max: PriceFilterElement.PRICE_HIGH,
      },
      format: {
        to: (value) => Math.round(value),
        from: (value) => parseFloat(value),
      },
    });
    sliderElement.on('update', (values) => {
      this.fromInput.value = values[0].toString();
      this.toInput.value = values[1].toString();
      this.from = +values[0];
      this.to = +values[1];
    });
    return sliderElement;
  }

  private createInputsRange(fromInput: HTMLElement, toInput: HTMLElement): HTMLElement {
    const divRangeInput = createElement('div');
    const fromLabelEl = createElement('label', ['label-from'], { for: 'inputFrom' });
    fromLabelEl.innerHTML = 'from $: ';
    const toLabelEl = createElement('label', ['label-to'], { for: 'inputTo' });
    toLabelEl.innerHTML = 'to $: ';
    divRangeInput.append(fromLabelEl, fromInput, toLabelEl, toInput);
    return divRangeInput;
  }

  private createFromInput(): HTMLInputElement {
    const fromInput = createElement('input', ['input-from'], {
      type: 'number',
      id: 'inputFrom',
      value: this.from.toString(),
    }) as HTMLInputElement;
    fromInput.addEventListener('change', (ev) => {
      if (ev.target instanceof HTMLInputElement) {
        this.from = +ev.target.value;
        this.sliderElement.set([this.from, this.to]);
      }
    });
    return fromInput;
  }

  private createToInput(): HTMLInputElement {
    const toInput = createElement('input', ['input-to'], {
      type: 'number',
      id: 'inputTo',
      value: this.to.toString(),
    }) as HTMLInputElement;
    toInput.addEventListener('change', (ev) => {
      if (ev.target instanceof HTMLInputElement) {
        this.to = +ev.target.value;
        this.sliderElement.set([this.from, this.to]);
      }
    });
    return toInput;
  }
}
