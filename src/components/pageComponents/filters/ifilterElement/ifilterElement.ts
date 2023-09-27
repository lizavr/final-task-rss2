export default interface IFilterElement {
  isSelected(): boolean;
  getFilterQuery(): string;
  getHtmlElement(): HTMLElement;
  reset(): void;
}
