import { createElement } from '../src/utils/utils';

describe('when we have a certain location', () => {
  it('content return content from corresponding page', () => {
    const arr = [
      {
        tag: 'a',
        instance: HTMLAnchorElement,
      },
      {
        tag: 'input',
        instance: HTMLInputElement,
      },
      {
        tag: 'select',
        instance: HTMLSelectElement,
      },
      {
        tag: 'div',
        instance: HTMLDivElement,
      },
      {
        tag: 'form',
        instance: HTMLFormElement,
      },
      {
        tag: 'custom',
        instance: HTMLElement,
      },
    ];

    arr.forEach((obj) => {
      const element = createElement(obj.tag);

      expect(element instanceof obj.instance).toBe(true);
    });
  });
});
