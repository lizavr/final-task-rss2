import './app.scss';
import { Header } from '../pageComponents/header/header';
import { Content } from '../pageComponents/content/content';
import { Footer } from '../pageComponents/footer/footer';
import { PubSub } from '../../services/pubSub';

export class App {
  public pubSub: PubSub;
  public wrapper: HTMLElement;
  public header: Header;
  public content: Content;
  public footer: Footer;

  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('app-wrapper');

    this.header = new Header();
    this.content = new Content();
    this.footer = new Footer();

    this.pubSub = PubSub.getInstance();
    this.pubSub.subscribe(PubSub.eventName.updateContent, () => this.render());

    this.render();
    this.listenClicks();
  }

  public render(): void {
    this.wrapper.innerHTML = '';

    if (this.content.content !== null) {
      this.wrapper.append(this.header.wrapper, this.content.content.wrapper, this.footer.wrapper);
    }
    this.pubSub.publish(PubSub.eventName.contentRendered);
    this.showActiveLink();
  }

  private listenClicks(): void {
    document.addEventListener('click', (event) => {
      let target = event.target;

      if (target instanceof HTMLElement) {
        const parent = target.closest('.card') || target.closest('.link');
        target = parent instanceof HTMLAnchorElement ? parent : target;
      }

      if (target instanceof HTMLAnchorElement) {
        const { pathname, host } = target;

        if (window.location.host == host) {
          event.preventDefault();

          history.pushState(pathname, '', pathname);
          this.pubSub.publish(PubSub.eventName.loadContent);
        }
      }
    });
  }

  private showActiveLink(): void {
    const currentPath = window.location.pathname;
    const navigationLinks = this.header.navigationLinks;

    navigationLinks.forEach((link) => {
      link.classList.remove('active-element');

      if (link instanceof HTMLAnchorElement && link.pathname === currentPath) {
        link.classList.add('active-element');
      }
    });
  }
}
