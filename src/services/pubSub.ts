import { EventCallback } from '../types/types';

export class PubSub {
  events: Record<string, Array<EventCallback>> = {};
  static eventName: Record<string, string> = {
    loadContent: 'load-content',
    updateContent: 'update-content',
    contentRendered: 'content-rendered',
    loggedIn: 'logged-in',
    loggedOut: 'logged-out',
    filtersUpdated: 'filters-updated',
    addressesUpdated: 'addresses-updated',
    cartUpdated: 'cart-updated',
  };

  private static instance: PubSub;

  public static getInstance(): PubSub {
    if (PubSub.instance) {
      return PubSub.instance;
    } else {
      PubSub.instance = new PubSub();

      return PubSub.instance;
    }
  }

  public publish(eventName: string, value?: string): void {
    if (this.events[eventName] !== undefined) {
      this.events[eventName].forEach((func) => {
        if (value !== undefined) {
          func(value);
        } else {
          func();
        }
      });
    }
  }

  public subscribe(eventName: string, handler: EventCallback): void {
    if (Array.isArray(this.events[eventName]) === false) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  public unsubscribe(eventName: string, handler: EventCallback): void {
    const eventHandlers = this.events[eventName];
    if (eventHandlers) {
      this.events[eventName] = eventHandlers.filter((func) => func !== handler);
    }
  }
}
