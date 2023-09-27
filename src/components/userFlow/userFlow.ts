import { Address, HttpErrorType, HttpStatusCodes, PathObj } from '../../types/types';
import { showErrorToast, showInfoToast, showSuccessfulToast } from '../../utils/toastUtils';
import { handleApiError } from '../api/apiErrorHandler';
import {
  FAILED_REGISTRATION_ERROR,
  USER_FLOW_REGISTRATION_TYPE,
  FAILED_REGISTRATION_USER_MESSAGE,
  SUCCESSFULL_REGISTRATION_USER_MESSAGE,
  FAILED_LOGIN_ERROR,
  USER_FLOW_LOGIN_TYPE,
  FAILED_LOGIN_USER_MESSAGE,
  SUCCESSFULL_LOGIN_USER_MESSAGE,
  USER_FLOW_PASSWORD_CHANGE_TYPE,
  FAILED_PASSWORD_CHANGE_MESSAGE,
  FAILED_PASSWORD_CHANGE_ERROR,
  SUCCESSFULL_PASSWORD_CHANGE_MESSAGE,
  INFO_PASSWORD_CHANGE_MESSAGE,
  UPDATE_PERSONAL_INFORMATION_MESSAGE,
  UPDATE_ADDRESS_MESSAGE,
  REMOVE_ADDRESS_MESSAGE,
  SET_DEFAULT_SHIPPING_ADDRESS_MESSAGE,
  SET_DEFAULT_BILLING_ADDRESS_MESSAGE,
  ADD_ADDRESS_MESSAGE,
  REMOVE_DEFAULT_SHIPPING_ADDRESS_MESSAGE,
  REMOVE_DEFAULT_BILLING_ADDRESS_MESSAGE,
} from './userFlowConstants';
import {
  BaseAddress,
  ClientResponse,
  Customer,
  CustomerChangePassword,
  ErrorObject,
  MyCustomerAddAddressAction,
  MyCustomerChangeAddressAction,
  MyCustomerChangeEmailAction,
  MyCustomerRemoveAddressAction,
  MyCustomerRemoveBillingAddressIdAction,
  MyCustomerRemoveShippingAddressIdAction,
  MyCustomerSetDateOfBirthAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
  MyCustomerSetFirstNameAction,
  MyCustomerSetLastNameAction,
  MyCustomerUpdate,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { ApiClient } from '../api/client';
import { StorageManager } from '../storageManager/storageManager';
import { PubSub } from '../../services/pubSub';

class UserFlow {
  private apiClient = ApiClient.getInstance();
  private storageManager = new StorageManager();
  private pubSub = PubSub.getInstance();
  private _user: Customer | null = null;

  private constructor() {
    // Make constructor private to prohibit instance creation.
  }

  private static instance: UserFlow;

  static getInstance(): UserFlow {
    if (UserFlow.instance) {
      return UserFlow.instance;
    } else {
      UserFlow.instance = new UserFlow();

      return UserFlow.instance;
    }
  }

  public async register(
    email: string,
    password: string,
    dateOfBirth: string,
    firstName: string,
    lastName: string,
    shippingAddress: Address,
    billingAddress: Address
  ): Promise<void> {
    const indexForBillingAddress = shippingAddress === billingAddress ? 0 : 1;
    this.apiClient.apiRoot
      .customers()
      .post({
        body: {
          email: email,
          password: password,
          dateOfBirth: dateOfBirth,
          firstName: firstName,
          lastName: lastName,
          addresses: shippingAddress === billingAddress ? [shippingAddress] : [shippingAddress, billingAddress],
          shippingAddresses: [0],
          billingAddresses: [indexForBillingAddress],
          defaultShippingAddress: shippingAddress.isDefault ? 0 : undefined,
          defaultBillingAddress: billingAddress.isDefault ? indexForBillingAddress : undefined,
        },
      })
      .execute()
      .then(() => showSuccessfulToast(SUCCESSFULL_REGISTRATION_USER_MESSAGE))
      .then(() => this.login(email, password))
      .catch((error) => this.handleError(error, USER_FLOW_REGISTRATION_TYPE));
  }

  public async login(email: string, password: string): Promise<void> {
    this.apiClient.apiRoot
      .me()
      .login()
      .post({
        body: {
          email: email,
          password: password,
        },
      })
      .execute()
      .then((res) => this.saveCurrentUser(res.body.customer))
      .then(() => this.fetchRefreshToken(email, password))
      .then(() => this.redirectTo(PathObj.mainPath))
      .then(() => this.pubSub.publish(PubSub.eventName.loggedIn))
      .then(() => this.pubSub.publish(PubSub.eventName.cartUpdated))
      .then(() => showSuccessfulToast(SUCCESSFULL_LOGIN_USER_MESSAGE))
      .then(() => this.apiClient.resetTokenCacheAnonymous())
      .then(() => this.storageManager.removeAnonymousRefreshToken())
      .catch((error) => this.handleError(error, USER_FLOW_LOGIN_TYPE));
  }

  public async updateUserAccountDetails(
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Promise<Customer | null> {
    const actions: MyCustomerUpdateAction[] = this.getAccountDetailsActions(email, firstName, lastName, dateOfBirth);

    return this.updateUser(actions);
  }

  public async updateUserAddress(address: BaseAddress): Promise<Customer | null> {
    const updateAddressAction: MyCustomerChangeAddressAction = {
      action: 'changeAddress',
      addressId: address.id,
      address: address,
    };

    return this.updateUser([updateAddressAction], UPDATE_ADDRESS_MESSAGE);
  }

  public async removeUserAddress(id: string): Promise<Customer | null> {
    const removeAddressAction: MyCustomerRemoveAddressAction = {
      action: 'removeAddress',
      addressId: id,
    };

    return this.updateUser([removeAddressAction], REMOVE_ADDRESS_MESSAGE);
  }

  public async setUserAddressAsDefault(type: 'shipping' | 'billing', addressId: string): Promise<Customer | null> {
    const setAddressAction: MyCustomerSetDefaultShippingAddressAction | MyCustomerSetDefaultBillingAddressAction = {
      action: type === 'shipping' ? 'setDefaultShippingAddress' : 'setDefaultBillingAddress',
      addressId: addressId,
    };
    const msg = type === 'shipping' ? SET_DEFAULT_SHIPPING_ADDRESS_MESSAGE : SET_DEFAULT_BILLING_ADDRESS_MESSAGE;

    return this.updateUser([setAddressAction], msg);
  }

  public removeDefaultUserAddress(type: 'shipping' | 'billing', addressId: string): Promise<Customer | null> {
    const removeDefaultAddressAction:
      | MyCustomerRemoveShippingAddressIdAction
      | MyCustomerRemoveBillingAddressIdAction = {
      action: type === 'shipping' ? 'removeShippingAddressId' : 'removeBillingAddressId',
      addressId: addressId,
    };
    const msg = type === 'shipping' ? REMOVE_DEFAULT_SHIPPING_ADDRESS_MESSAGE : REMOVE_DEFAULT_BILLING_ADDRESS_MESSAGE;

    return this.updateUser([removeDefaultAddressAction], msg);
  }

  public async addUserAddress(address: BaseAddress): Promise<Customer | null> {
    const addAddressAction: MyCustomerAddAddressAction = {
      action: 'addAddress',
      address: address,
    };

    return this.updateUser([addAddressAction], ADD_ADDRESS_MESSAGE);
  }

  public async changeUserPassword(currentPassword: string, newPassword: string): Promise<Customer | null> {
    const userId = this.getCurrentUserId();
    const version = this.getCurrentUserVersion();
    const body: CustomerChangePassword = {
      id: userId,
      version: version,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    const customer = await this.apiClient.apiRoot
      .customers()
      .password()
      .post({ body: body })
      .execute()
      .then((res) => res.body)
      .catch((error) => this.handleError(error, USER_FLOW_PASSWORD_CHANGE_TYPE));

    if (customer) {
      showSuccessfulToast(SUCCESSFULL_PASSWORD_CHANGE_MESSAGE);
      showInfoToast(INFO_PASSWORD_CHANGE_MESSAGE);

      this.logout();
      this.redirectTo(PathObj.loginPath);
    }

    return customer ? customer : null;
  }

  private async updateUser(
    actions: MyCustomerUpdateAction[],
    msg = UPDATE_PERSONAL_INFORMATION_MESSAGE
  ): Promise<Customer | null> {
    let customer;
    const apiRootCustomer = this.apiClient.apiRootCustomer;
    const version = this.getCurrentUserVersion();
    const body: MyCustomerUpdate = {
      version: version,
      actions: actions,
    };

    if (apiRootCustomer) {
      customer = await apiRootCustomer
        .me()
        .post({ body: body })
        .execute()
        .then((res: ClientResponse<Customer>) => res.body)
        .catch((error) => this.handleError(error, USER_FLOW_REGISTRATION_TYPE));

      if (customer) {
        this.saveCurrentUser(customer);
        showSuccessfulToast(msg);
      }
    }

    return customer ? customer : null;
  }

  private handleError(error: Error, opType: string): void {
    const httpError = error as HttpErrorType;

    if (!httpError) return;
    if (this.handleUserFlowError(httpError, opType)) return;

    handleApiError(httpError);
  }

  private handleUserFlowError(httpError: HttpErrorType, type: string): boolean {
    let isError = this.isRegistrationError;
    let userMsg = FAILED_REGISTRATION_USER_MESSAGE;

    if (type === USER_FLOW_LOGIN_TYPE) {
      isError = this.isLoginError;
      userMsg = FAILED_LOGIN_USER_MESSAGE;
    }

    if (type === USER_FLOW_PASSWORD_CHANGE_TYPE) {
      isError = this.isPasswordChangeError;
      userMsg = FAILED_PASSWORD_CHANGE_MESSAGE;
    }

    if (
      httpError.body &&
      httpError.statusCode === HttpStatusCodes.BAD_REQUEST &&
      httpError.body.errors?.some((item) => isError(item))
    ) {
      showErrorToast(userMsg);

      return true;
    }

    return false;
  }

  private isRegistrationError(item: ErrorObject): boolean {
    return item.code === FAILED_REGISTRATION_ERROR && item.field === 'email';
  }

  private isLoginError(item: ErrorObject): boolean {
    return item.code === FAILED_LOGIN_ERROR;
  }

  private isPasswordChangeError(item: ErrorObject): boolean {
    return item.code === FAILED_PASSWORD_CHANGE_ERROR;
  }

  private saveCurrentUser(user: Customer): void {
    this.storageManager.setCurrentUser(user);
  }

  private async fetchRefreshToken(email: string, password: string): Promise<void> {
    const apiRootWithPassword = this.apiClient.getApiRootWithPasswordFlow(email, password);

    return apiRootWithPassword
      .me()
      .get()
      .execute()
      .then(() => {
        const tokenCache = this.apiClient.tokenCacheCustomer.get();
        if (tokenCache?.refreshToken) this.storageManager.setRefreshToken(tokenCache.refreshToken);
      });
  }

  public redirectTo(path: string): void {
    history.pushState(path, '', path);
    this.pubSub.publish(PubSub.eventName.loadContent);
  }

  public loggedIn(): boolean {
    return Boolean(this.storageManager.getRefreshToken()) && Boolean(this.storageManager.getCurrentUser());
  }

  public logout(): void {
    this.apiClient.resetTokenCacheCustomer();
    this.storageManager.removeRefreshToken();
    this.storageManager.removeCurrentUser();
    this.redirectTo(PathObj.mainPath);

    this.pubSub.publish(PubSub.eventName.loggedOut);
    this.pubSub.publish(PubSub.eventName.cartUpdated);
  }

  public getCurrentUser(): Customer | null {
    return this.storageManager.getCurrentUser();
  }

  public async getCurrentUserFromServer(): Promise<Customer | null> {
    let customer = null;

    if (this.loggedIn()) {
      const apiRootCustomer = this.apiClient.apiRootCustomer;

      if (apiRootCustomer) {
        customer = await apiRootCustomer
          .me()
          .get()
          .execute()
          .then((res: ClientResponse<Customer>) => res.body)
          .catch(() => null);

        if (customer) this.saveCurrentUser(customer);
      }
    }

    return customer;
  }

  private getAccountDetailsActions(
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): MyCustomerUpdateAction[] {
    const emailAction: MyCustomerChangeEmailAction = { action: 'changeEmail', email: email };
    const firstNameAction: MyCustomerSetFirstNameAction = { action: 'setFirstName', firstName: firstName };
    const lastNameAction: MyCustomerSetLastNameAction = { action: 'setLastName', lastName: lastName };
    const dateOfBirthAction: MyCustomerSetDateOfBirthAction = { action: 'setDateOfBirth', dateOfBirth: dateOfBirth };

    return [emailAction, firstNameAction, lastNameAction, dateOfBirthAction];
  }

  private getCurrentUserVersion(): number {
    const user = this.getCurrentUser();
    return user ? user.version : -1;
  }

  private getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user ? user.id : '';
  }
}

const userFlow = UserFlow.getInstance();

export default userFlow;
