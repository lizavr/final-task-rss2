import { Attributes } from '../types/types';

export function createElement(tag: string, classlist: string[] = [], attributes: Attributes = {}, text = '') {
  const element = document.createElement(tag);
  if (classlist.length) element.classList.add(...classlist);
  element.innerText = text;

  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));

  return element;
}

export function createHorizontalTextElement(
  text = 'or',
  classlist: string[] = [],
  attributes: Attributes = {}
): HTMLElement {
  const horizontal = createElement('div', [...classlist, 'horizontalText'], attributes);
  horizontal.innerText = text;

  return horizontal;
}

export function addOverlay(): HTMLElement {
  let overlay: HTMLElement | null = document.body.querySelector('.overlay');

  if (overlay) return overlay;

  overlay = createElement('div', ['overlay']);
  document.body.append(overlay);

  return overlay;
}
