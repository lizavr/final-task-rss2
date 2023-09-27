import { Main } from '../../pages/main/main';
import { AboutUs } from '../../pages/aboutUs/aboutUs';
import { Registration } from '../../pages/registration/registration';
import { Login } from '../../pages/login/login';
import { NotFound } from '../../pages/notFound/notFound';
import { PathObj } from '../../../types/types';
import { PubSub } from '../../../services/pubSub';
import userFlow from '../../userFlow/userFlow';
import Catalog from '../../pages/catalog/catalog';
import { ProductContent } from '../../pages/product/product';
import { ApiClient } from '../../api/client';
import { Category, Product } from '@commercetools/platform-sdk';
import { Profile } from '../../pages/profile/profile';
import { CartContent } from '../../pages/cart/cart';

export class Content {
  public pubSub: PubSub;
  public content:
    | Main
    | AboutUs
    | Registration
    | Login
    | Catalog
    | ProductContent
    | NotFound
    | Profile
    | CartContent
    | null;

  constructor() {
    this.content = null;

    this.pubSub = PubSub.getInstance();
    this.pubSub.subscribe(PubSub.eventName.loadContent, () => this.loadContent());

    this.loadContent();

    window.addEventListener('popstate', () => this.loadContent());
  }

  public async loadContent(): Promise<void> {
    const path = this.getCurrentPath();

    this.cleanSubscriptions();

    switch (path) {
      case PathObj.mainPath: {
        this.content = new Main();
        break;
      }

      case PathObj.aboutUsPath: {
        this.content = new AboutUs();
        break;
      }

      case PathObj.loginPath: {
        if (userFlow.loggedIn()) return userFlow.redirectTo(PathObj.mainPath);

        this.content = new Login();
        break;
      }

      case PathObj.registrationPath: {
        if (userFlow.loggedIn()) return userFlow.redirectTo(PathObj.mainPath);

        this.content = new Registration();
        break;
      }

      case PathObj.catalogPath: {
        this.content = new Catalog();
        break;
      }

      case PathObj.profilePath: {
        if (!userFlow.loggedIn()) return userFlow.redirectTo(PathObj.loginPath);

        this.content = new Profile();
        break;
      }

      case PathObj.cartPath: {
        this.content = new CartContent();
        break;
      }

      default: {
        if (path.includes(PathObj.productPath, 0)) {
          const product = await this.getProduct();
          this.content = product ? new ProductContent(product) : new NotFound();
        } else if (path.includes(PathObj.catalogPath, 0)) {
          const category = await this.getCategory();
          this.content = category ? new Catalog(category) : new NotFound();
        } else {
          this.content = new NotFound();
        }
      }
    }

    this.pubSub.publish(PubSub.eventName.updateContent);
  }

  private cleanSubscriptions(): void {
    if (this.content instanceof Catalog) {
      this.content.cleanSubscriptions();
    }
  }

  private getCurrentPath(): string {
    const currentPath = window.location.pathname;
    return currentPath;
  }

  private async getProduct(): Promise<Product | null> {
    const currentPath = this.getCurrentPath();
    const currentKey = currentPath.slice(currentPath.lastIndexOf('/') + 1);

    return ApiClient.getInstance()
      .apiRoot.products()
      .withKey({ key: `${currentKey}` })
      .get()
      .execute()
      .then((response) => response.body)
      .catch(() => {
        return null;
      });
  }

  private async getCategory(): Promise<Category | null> {
    const currentPath = this.getCurrentPath();
    const categoryKey = currentPath.slice(currentPath.lastIndexOf('/') + 1);

    return ApiClient.getInstance()
      .apiRoot.categories()
      .withKey({ key: `${categoryKey}` })
      .get({
        queryArgs: {
          expand: ['parent'],
        },
      })
      .execute()
      .then((response) => response.body)
      .catch(() => {
        return null;
      });
  }
}
