import { BaseAddress, Customer } from '@commercetools/platform-sdk';
import { createElement } from '../../../utils/utils';
import userFlow from '../../userFlow/userFlow';
import { Attributes } from '../../../types/types';
import './profile.scss';
import AccountDetailsForm from '../../pageComponents/forms/accountDetailsForm/accountDetailsForm';
import AccountAddressForm from '../../pageComponents/forms/accountAddressForm/accountAddressForm';
import { PubSub } from '../../../services/pubSub';
import BlankAddressForm from '../../pageComponents/forms/blankAddressForm/blankAddressForm';
import PasswordChangeForm from '../../pageComponents/forms/passwordChangeForm/passwordChangeForm';
export class Profile {
  public wrapper: HTMLElement;
  private user: Customer | null = null;
  private pubSub: PubSub = PubSub.getInstance();
  private accountDetailsTab: HTMLElement | null = null;
  private addressesTab: HTMLElement | null = null;

  constructor() {
    this.wrapper = createElement('main', ['profile_page'], { id: 'profile' });
    this.addPageContent();
    this.pubSub.subscribe(PubSub.eventName.addressesUpdated, () => this.updateAddressesTab());
  }

  private async addPageContent(): Promise<void> {
    const navigation = createElement('div', ['nav-bar']);
    const content = createElement('div', ['content']);
    this.user = await userFlow.getCurrentUserFromServer();

    this.wrapper.append(navigation, content);

    if (!this.user) return;

    this.accountDetailsTab = this.createAccountDetailsTab(this.user);
    this.addressesTab = this.createAddressTab(this.user);

    const tabs = [
      { label: 'Account details', content: this.accountDetailsTab, labelClass: 'account-details-tab' },
      { label: 'Addresses', content: this.addressesTab, labelClass: 'addresses-tab' },
    ];

    tabs.forEach((tab, ind) => {
      const inputAttrs: Attributes = { type: 'radio', name: 'tabs', id: `profile-tab_input-${ind}` };
      const input = createElement('input', ['profile-tab_input'], inputAttrs);
      const labelAttrs: Attributes = { for: input.id, id: `profile-tab-${ind}` };
      const label = createElement('label', ['profile-tab', tab.labelClass], labelAttrs);
      const section = createElement('section', ['profile-tab_content'], { id: `profile-tab_content-${ind}` });

      if (ind === 0 && input instanceof HTMLInputElement) input.checked = true;
      label.innerText = tab.label;

      this.wrapper.prepend(input);
      section.append(tab.content);
      navigation.append(label);
      content.append(section);
    });
  }

  private createAccountDetailsTab(user: Customer): HTMLElement {
    const accountDetailsTab = createElement('div', ['account-details-content']);

    const accountDetailsform = new AccountDetailsForm(user);
    const passwordChangeform = new PasswordChangeForm();

    accountDetailsTab.append(accountDetailsform.getHtmlElement(), passwordChangeform.getHtmlElement());

    return accountDetailsTab;
  }

  private createAddressTab(user: Customer): HTMLElement {
    const addressTab = createElement('div', ['addresses-content']);

    this.fillAddressesTab(addressTab, user);

    return addressTab;
  }

  private fillAddressesTab(addressTab: HTMLElement, user: Customer): void {
    addressTab.innerHTML = '';
    const defaultShipping = user.defaultShippingAddressId;
    const defaultBilling = user.defaultBillingAddressId;

    const blankAddressForm = new BlankAddressForm();

    user.addresses.forEach((address: BaseAddress) => {
      const defaultOptions = {
        isDefaultShipping: address.id === defaultShipping,
        isDefaultBilling: address.id === defaultBilling,
      };
      const addressForm = new AccountAddressForm(address, defaultOptions);

      addressTab.append(addressForm.getHtmlElement());
    });

    addressTab.append(blankAddressForm.getHtmlElement());
  }

  private updateAddressesTab(): void {
    const user = userFlow.getCurrentUser();

    if (!user) return;

    this.user = user;

    if (!this.addressesTab) this.addressesTab = this.createAddressTab(this.user);
    else this.fillAddressesTab(this.addressesTab, user);
  }
}
