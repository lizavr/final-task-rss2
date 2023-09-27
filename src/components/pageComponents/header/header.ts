import './header.scss';
import { PubSub } from '../../../services/pubSub';
import { addOverlay, createElement } from '../../../utils/utils';
import userFlow from '../../userFlow/userFlow';
import { PathObj } from '../../../types/types';
import shoppingFlow from '../../shoppingFlow/shoppingFlow';

export class Header {
  private readonly classLists = {
    main: ['home-btn'],
    catalog: ['catalog-btn'],
    aboutUs: ['about-us-btn'],
    cart: ['cart_btn', 'control-acc_btn', 'main-cart'],
    login: ['login_btn', 'control-acc_btn'],
    registration: ['registration_btn', 'control-acc_btn'],
    profile: ['profile_btn', 'control-acc_btn'],
    logout: ['logout_btn', 'control-acc_btn'],
  };

  private readonly attributes = {
    main: { id: 'main-btn', href: PathObj.mainPath },
    catalog: { id: 'catalog-btn', href: PathObj.catalogPath },
    aboutUs: { id: 'about-us-btn', href: PathObj.aboutUsPath },
    cart: { id: 'cart-btn', href: PathObj.cartPath },
    login: { id: 'login-btn', href: PathObj.loginPath },
    registration: { id: 'registration-btn', href: PathObj.registrationPath },
    profile: { id: 'profile-btn', href: PathObj.profilePath },
    logout: { id: 'logout-btn' },
  };

  public pubSub: PubSub = PubSub.getInstance();
  public wrapper: HTMLElement;
  public mainBtn: HTMLElement;
  public catalogBtn: HTMLElement;
  public aboutUsBtn: HTMLElement;
  public cartBtn: HTMLElement;
  public loginBtn: HTMLElement;
  public registrationBtn: HTMLElement;
  public profileBtn: HTMLElement;
  public logoutBtn: HTMLElement;
  public controlAccContent: HTMLElement;
  public navigationLinks: HTMLElement[];
  private menuBlock: HTMLElement;
  private mobileCartIcon: HTMLElement;
  private burgerIcon: HTMLElement;
  private mobileIconsWrapper: HTMLElement;

  constructor() {
    this.wrapper = createElement('header', ['header']);
    this.controlAccContent = createElement('div', ['control-acc_wrap']);

    [
      this.mainBtn,
      this.catalogBtn,
      this.aboutUsBtn,
      this.cartBtn,
      this.loginBtn,
      this.registrationBtn,
      this.profileBtn,
      this.logoutBtn,
    ] = this.createControlAccButtons();

    this.appendControlAccButtons();

    this.menuBlock = this.createMenuBlock();
    this.burgerIcon = this.createBurgerIcon();
    this.mobileCartIcon = this.createMobileCartIcon();
    this.mobileIconsWrapper = this.createMobileIconsWrapper(this.mobileCartIcon, this.burgerIcon);

    this.navigationLinks = [
      this.mainBtn,
      this.catalogBtn,
      this.aboutUsBtn,
      this.cartBtn,
      this.loginBtn,
      this.registrationBtn,
      this.profileBtn,
    ];

    this.wrapper.append(this.createHeaderContent());

    this.pubSub.subscribe(PubSub.eventName.loggedIn, () => this.appendControlAccButtons());
    this.pubSub.subscribe(PubSub.eventName.loggedOut, () => this.appendControlAccButtons());
    this.pubSub.subscribe(PubSub.eventName.cartUpdated, () => this.updateCartCount());

    this.updateCartCount();
  }

  private createControlAccButtons(): HTMLElement[] {
    const mainBtn = createElement('a', this.classLists.main, this.attributes.main, 'Home');
    const catalogBtn = createElement('a', this.classLists.catalog, this.attributes.catalog, 'Catalog');
    const aboutUsBtn = createElement('a', this.classLists.aboutUs, this.attributes.aboutUs, 'About us');

    const cartBtn = createElement('a', this.classLists.cart, this.attributes.cart);
    const itemCount = createElement('div', ['item-count']);
    cartBtn.append(itemCount);

    const loginBtn = createElement('a', this.classLists.login, this.attributes.login, 'Login');
    const registrationBtn = createElement('a', this.classLists.registration, this.attributes.registration, 'Register');
    const profileBtn = createElement('a', this.classLists.profile, this.attributes.profile, 'Profile');
    const logoutBtn = createElement('a', this.classLists.logout, this.attributes.logout, 'Logout');

    logoutBtn.addEventListener('click', () => userFlow.logout());

    return [mainBtn, catalogBtn, aboutUsBtn, cartBtn, loginBtn, registrationBtn, profileBtn, logoutBtn];
  }

  private createHeaderContent(): HTMLElement {
    const headerContent_wrapper = createElement('div', ['header-content', 'width-content']);

    this.menuBlock.append(this.createNavigationContent(), this.controlAccContent);
    headerContent_wrapper.append(this.createLogoContent(), this.mobileIconsWrapper, this.menuBlock);

    return headerContent_wrapper;
  }

  private createLogoContent(): HTMLElement {
    const logoWrapper = createElement('div', ['logo-wrapper']);

    const logoImg = createElement('div', ['logo-img']);

    const logoText = createElement('span', ['logo-text'], {}, 'PLANTIQUE');

    logoWrapper.append(logoImg, logoText);

    return logoWrapper;
  }

  private createNavigationContent(): HTMLElement {
    const navigation = createElement('div', ['navigation-wrapper']);

    navigation.append(this.mainBtn, this.catalogBtn, this.aboutUsBtn);

    return navigation;
  }

  private appendControlAccButtons(): void {
    this.controlAccContent.innerHTML = '';
    this.controlAccContent.append(this.cartBtn);

    if (userFlow.loggedIn()) {
      this.controlAccContent.append(this.profileBtn, this.logoutBtn);
    } else {
      this.controlAccContent.append(this.loginBtn, this.registrationBtn);
    }
  }

  private createMenuBlock(): HTMLElement {
    const menuBlock = createElement('div', ['menu-block']);

    menuBlock.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement && menuBlock.classList.contains('open')) {
        this.openCloseBurgerMenu();
      }
    });

    return menuBlock;
  }

  private createMobileCartIcon(): HTMLElement {
    const cartBtn = createElement('a', this.classLists.cart, this.attributes.cart);
    const itemCount = createElement('div', ['item-count']);
    cartBtn.append(itemCount);
    return cartBtn;
  }

  private createBurgerIcon(): HTMLElement {
    const burgerIcon = createElement('i', ['burger-icon']);
    const overlay = addOverlay();

    burgerIcon.addEventListener('click', () => this.openCloseBurgerMenu());
    overlay.addEventListener('click', () => this.openCloseBurgerMenu());

    return burgerIcon;
  }

  private createMobileIconsWrapper(cartBtn: HTMLElement, burgerIcon: HTMLElement): HTMLElement {
    const menuIconsWrapper = createElement('div', ['menu-items']);
    menuIconsWrapper.append(cartBtn, burgerIcon);
    return menuIconsWrapper;
  }

  private openCloseBurgerMenu(): void {
    this.mobileIconsWrapper.classList.toggle('open');
    this.menuBlock.classList.toggle('open');
    document.body.classList.toggle('frozen');
    document.body.classList.toggle('show-overlay');
  }

  private async updateCartCount(): Promise<void> {
    const cart = await shoppingFlow.getMyCart();
    const count = cart?.totalLineItemQuantity ?? 0;
    const countStr = count.toString();

    this.cartBtn.children[0].innerHTML = countStr;
    this.mobileCartIcon.children[0].innerHTML = countStr;

    if (count) {
      this.cartBtn.children[0].classList.remove('empty-cart');
      this.mobileCartIcon.children[0].classList.remove('empty-cart');
    } else {
      this.cartBtn.children[0].classList.add('empty-cart');
      this.mobileCartIcon.children[0].classList.add('empty-cart');
    }
  }
}
