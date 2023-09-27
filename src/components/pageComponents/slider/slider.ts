import './slider.scss';
import { createElement } from '../../../utils/utils';

import { Swiper } from 'swiper';
import { Navigation, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export class Slider {
  public slider: HTMLElement;
  private sliderModal: HTMLElement;
  public sliderWrapper: HTMLElement;
  public isClickModalWindow: boolean;
  private swiper: Swiper | null = null;
  private swiperModal: Swiper | null = null;

  constructor(public arrayImgUrl: string[]) {
    this.slider = this.createSlider(arrayImgUrl);
    this.sliderModal = this.createSlider(arrayImgUrl, 'modal');

    this.sliderWrapper = createElement('div', ['slider-wrapper']);

    this.sliderWrapper.append(this.slider, this.sliderModal);

    this.isClickModalWindow = false;

    this.createSwiper();
  }

  private createSwiper(): void {
    const constructSwiper = (type = 'main') => {
      return new Swiper(`.swiper-${type}`, {
        modules: [Navigation, Keyboard],

        loop: true,

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
      });
    };

    // set timeout is needed so that when the swiper class is called, the selector already existing in the document is passed to the constructor
    setTimeout(() => {
      this.swiper = constructSwiper();
      this.swiperModal = constructSwiper('modal');
      this.eventsOn(this.swiper, this.swiperModal);
    }, 100);
  }

  private createSlider(arrayImgUrl: string[], type = 'main'): HTMLElement {
    const swiper = createElement('div', ['swiper', `swiper-${type}`]);

    const swiperWrapper = createElement('div', ['swiper-wrapper']);

    arrayImgUrl.forEach((url) => {
      const slide = createElement('div', ['swiper-slide', 'product_img']);
      slide.style.backgroundImage = `url('${url}')`;

      slide.addEventListener('click', this.showSliderInModalWindow);

      swiperWrapper.append(slide);
    });

    const prevEl = createElement('div', ['swiper-button-prev']);

    const nextEl = createElement('div', ['swiper-button-next']);

    swiper.append(swiperWrapper, prevEl, nextEl);
    return swiper;
  }

  showSliderInModalWindow = () => {
    const modalWindow = createElement('div', ['modal-window']);

    modalWindow.addEventListener('click', () => {
      this.closeSliderInModalWindow(modalWindow);
    });

    const closeBtn = createElement('button', ['close-window_btn'], {}, '🞫');

    if (this.isClickModalWindow === false) {
      if (this.swiper) this.eventsOff(this.swiper);
      if (this.swiper && this.swiperModal) this.eventsOn(this.swiperModal, this.swiper);

      modalWindow.append(closeBtn);

      this.sliderModal?.classList.add('slider_modal-window');

      document.body.append(modalWindow);
      document.body.style.overflow = 'hidden';

      this.isClickModalWindow = true;
    }
  };

  closeSliderInModalWindow = (window: HTMLElement) => {
    if (this.swiperModal) this.eventsOff(this.swiperModal);
    if (this.swiperModal && this.swiper) this.eventsOn(this.swiper, this.swiperModal);

    this.sliderModal?.classList.remove('slider_modal-window');

    document.body.removeChild(window);
    document.body.style.overflow = 'visible';

    this.isClickModalWindow = false;
  };

  private eventsOff(swiper: Swiper): void {
    swiper.keyboard.disable();
    swiper.off('slideNextTransitionStart');
    swiper.off('slidePrevTransitionStart');
  }

  private eventsOn(swiper: Swiper, secondSwiper: Swiper): void {
    swiper.keyboard.enable();
    swiper.on('slideNextTransitionStart', () => secondSwiper.slideNext());
    swiper.on('slidePrevTransitionStart', () => secondSwiper.slidePrev());
  }
}
