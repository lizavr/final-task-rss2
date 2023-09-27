import {
  Cart,
  MyCartAddDiscountCodeAction,
  MyCartAddLineItemAction,
  MyCartRemoveDiscountCodeAction,
  MyCartRemoveLineItemAction,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';
import { ApiClient } from '../api/client';
import { StorageManager } from '../storageManager/storageManager';
import { handleApiError } from '../api/apiErrorHandler';
import { showErrorToast, showSuccessfulToast } from '../../utils/toastUtils';
import { PubSub } from '../../services/pubSub';
import { HttpErrorType, HttpStatusCodes } from '../../types/types';
import { DISCOUNT_CODE_NON_APPLICABLE_ERROR, CONCURRENT_MODIFICATION_ERROR } from './shoppingFlowConstants';

class ShoppingFlow {
  private apiClient = ApiClient.getInstance();
  private pubSub = PubSub.getInstance();
  private storageManager = new StorageManager();
  private _cart: Cart | null = null;

  private constructor() {
    // Make constructor private to prohibit instance creation.
  }

  private static instance: ShoppingFlow;

  static getInstance(): ShoppingFlow {
    if (ShoppingFlow.instance) {
      return ShoppingFlow.instance;
    } else {
      ShoppingFlow.instance = new ShoppingFlow();

      return ShoppingFlow.instance;
    }
  }

  public async getMyCart({ createIfAbsent = false } = {}): Promise<Cart | null> {
    let cart = await this.getMyActiveCart();

    if (!cart && createIfAbsent) {
      cart = await this.createMyCart();
    }

    return cart;
  }

  private async getMyCartByID(cartId: string): Promise<Cart | null> {
    return this.apiClient.apiRoot
      .me()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute()
      .then((res) => res.body)
      .catch(() => null);
  }

  private async getMyActiveCart(): Promise<Cart | null> {
    return this.apiClient.apiRoot
      .me()
      .activeCart()
      .get()
      .execute()
      .then((res) => res.body)
      .catch(() => null);
  }

  private async createMyCart(): Promise<Cart | null> {
    const cart = await this.apiClient.apiRoot
      .me()
      .carts()
      .post({ body: { currency: 'USD' } })
      .execute()
      .then((res) => res.body)
      .catch((error) => {
        handleApiError(error);

        return null;
      });

    return cart;
  }

  public async addToCart(productId: string, quantity = 1): Promise<Cart | null> {
    let cart = await this.getMyCart({ createIfAbsent: true });

    if (cart) {
      const addLineItemAction: MyCartAddLineItemAction = {
        action: 'addLineItem',
        productId: productId,
        quantity: quantity,
      };
      const body = { version: cart.version, actions: [addLineItemAction] };

      cart = await this.apiClient.apiRoot
        .me()
        .carts()
        .withId({ ID: cart.id })
        .post({ body: body })
        .execute()
        .then((res) => res.body)
        .catch(async (error) => {
          if (!this.handleShoppingFlowError(error)) handleApiError(error);

          return await this.getMyCart();
        });
    }

    this.pubSub.publish(PubSub.eventName.cartUpdated);

    return cart;
  }

  public async isInCart(productId: string): Promise<boolean> {
    let isInCart = false;
    const cart = await this.getMyCart({ createIfAbsent: true });

    if (cart) {
      const lineItem = cart.lineItems?.find((item) => item.productId === productId);
      isInCart = Boolean(lineItem);
    }

    return isInCart;
  }

  public async removeFromCart(productId: string, quantity: number | undefined = undefined): Promise<Cart | null> {
    let cart = await this.getMyCart({ createIfAbsent: true });
    const lineItem = cart?.lineItems?.find((item) => item.productId === productId);

    if (cart && lineItem) {
      const removeLineItemAction: MyCartRemoveLineItemAction = {
        action: 'removeLineItem',
        lineItemId: lineItem.id,
        quantity: quantity,
      };
      const body = { version: cart.version, actions: [removeLineItemAction] };

      cart = await this.apiClient.apiRoot
        .me()
        .carts()
        .withId({ ID: cart.id })
        .post({ body: body })
        .execute()
        .then((res) => res.body)
        .catch(async (error) => {
          if (!this.handleShoppingFlowError(error)) handleApiError(error);

          return await this.getMyCart();
        });
    }

    this.pubSub.publish(PubSub.eventName.cartUpdated);

    return cart;
  }

  public async deleteCart(): Promise<Cart | null> {
    let cart = await this.getMyCart();
    if (cart) {
      cart = await this.apiClient.apiRoot
        .me()
        .carts()
        .withId({ ID: cart.id })
        .delete({ queryArgs: { version: cart.version } })
        .execute()
        .then(() => {
          showSuccessfulToast('Your cart was cleared successfully.');
          return null;
        });
    }

    this.pubSub.publish(PubSub.eventName.cartUpdated);

    return cart;
  }

  public async applyPromocode(promocode: string) {
    let cart = await this.getMyCart({ createIfAbsent: true });

    if (cart) {
      const applyPromocodeAction: MyCartAddDiscountCodeAction = {
        action: 'addDiscountCode',
        code: promocode,
      };
      const actions: MyCartUpdateAction[] = [applyPromocodeAction];

      if (cart.discountCodes) {
        cart.discountCodes.forEach((discountCodeInfo) => {
          const removePromocodeAction: MyCartRemoveDiscountCodeAction = {
            action: 'removeDiscountCode',
            discountCode: {
              typeId: discountCodeInfo.discountCode.typeId,
              id: discountCodeInfo.discountCode.id,
            },
          };
          actions.push(removePromocodeAction);
        });
      }

      const body = { version: cart.version, actions: actions };

      cart = await this.apiClient.apiRoot
        .me()
        .carts()
        .withId({ ID: cart.id })
        .post({ body: body })
        .execute()
        .then((res) => res.body)
        .catch(async (error) => {
          if (!this.handleShoppingFlowError(error)) handleApiError(error);

          return await this.getMyCart();
        });
    }

    return cart;
  }

  private handleShoppingFlowError(httpError: HttpErrorType): boolean {
    if (httpError.body) {
      const isDiscountError =
        httpError.statusCode === HttpStatusCodes.BAD_REQUEST &&
        httpError.body.errors?.some((item) => item.code === DISCOUNT_CODE_NON_APPLICABLE_ERROR);

      const isConflictError =
        httpError.statusCode === HttpStatusCodes.CONFLICT &&
        httpError.body.errors?.some((item) => item.code === CONCURRENT_MODIFICATION_ERROR);

      if (isDiscountError || isConflictError) {
        if (isDiscountError) showErrorToast(httpError.message);

        return true;
      }
    }

    return false;
  }

  public async getCodeByDiscountID(discountId: string): Promise<string | null> {
    return this.apiClient.apiRoot
      .discountCodes()
      .withId({ ID: discountId })
      .get({ queryArgs: {} })
      .execute()
      .then((res) => res.body.code)
      .catch(() => null);
  }
}

const shoppingFlow = ShoppingFlow.getInstance();

export default shoppingFlow;
