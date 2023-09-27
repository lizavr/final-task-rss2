export default interface IFormElement {
  getHtmlElement(): HTMLElement;
  validate(): boolean;
  getValue(): string;
}
