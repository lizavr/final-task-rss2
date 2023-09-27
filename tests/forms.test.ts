import { Customer } from '@commercetools/platform-sdk';
import AccountDetailsForm from '../src/components/pageComponents/forms/accountDetailsForm/accountDetailsForm';
import LoginForm from '../src/components/pageComponents/forms/loginForm/loginForm';
import RegistrationForm from '../src/components/pageComponents/forms/registrationForm/registrationForm';
import AddressElement from '../src/components/pageComponents/inputs/addressElement/addressElement';
import DateOfBirthInputElement from '../src/components/pageComponents/inputs/dateOfBirthInputElement/dateOfBirthInputElement';
import EmailInputElement from '../src/components/pageComponents/inputs/emailInputElement/emailInputElement';
import FirstNameInputElement from '../src/components/pageComponents/inputs/firstNameInputElement/firstNameInputElement';
import LastNameInputElement from '../src/components/pageComponents/inputs/lastNameInputElement/lastNameInputElement';
import PasswordInputElement from '../src/components/pageComponents/inputs/passwordInputElement/passwordInputElement';
import AccountAddressForm from '../src/components/pageComponents/forms/accountAddressForm/accountAddressForm';
import CityInputElement from '../src/components/pageComponents/inputs/cityInputElement/cityInputElement';
import StateInputElement from '../src/components/pageComponents/inputs/stateInputElement/stateInputElement';
import CountryInputElement from '../src/components/pageComponents/inputs/countryInputElement/countryInputElement';
import PostalCodeInputElement from '../src/components/pageComponents/inputs/postalCodeInputElement/postalCodeInputElement';
import BlankAddressForm from '../src/components/pageComponents/forms/blankAddressForm/blankAddressForm';
import PasswordChangeForm from '../src/components/pageComponents/forms/passwordChangeForm/passwordChangeForm';
import CurrentPasswordInputElement from '../src/components/pageComponents/inputs/currentPasswordInputElement/currentPasswordInputElement';
import ConfirmPasswordInputElement from '../src/components/pageComponents/inputs/confirmPasswordInputElement/confirmPasswordInputElement';

const blankUser: Customer = {
  id: 'id',
  email: 'email',
  version: 0,
  createdAt: 'createdAt',
  lastModifiedAt: 'lastModifiedAt',
  addresses: [
    {
      city: 'City',
      country: 'Country',
      postalCode: 'postalCode',
      streetName: 'StreetName',
    },
    {
      city: 'City2',
      country: 'Country2',
      postalCode: 'postalCode2',
      streetName: 'StreetName2',
    },
  ],
  isEmailVerified: false,
  authenticationMode: '',
};

describe('LoginForm', () => {
  const loginForm = new LoginForm();

  it('should create a form element', () => {
    const formElement = loginForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = loginForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [emailElement, passwordElement] = children;

    expect(emailElement instanceof EmailInputElement).toBe(true);
    expect(passwordElement instanceof PasswordInputElement).toBe(true);
  });
});

describe('RegistrationForm', () => {
  const registrationForm = new RegistrationForm();

  it('should create a form element', () => {
    const formElement = registrationForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = registrationForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [
      emailElement,
      passwordElement,
      firstNameElement,
      lastNameElement,
      dateOfBirthElement,
      shippingAddressElement,
      billingAddressElement,
    ] = children;

    expect(emailElement instanceof EmailInputElement).toBe(true);
    expect(passwordElement instanceof PasswordInputElement).toBe(true);
    expect(firstNameElement instanceof FirstNameInputElement).toBe(true);
    expect(lastNameElement instanceof LastNameInputElement).toBe(true);
    expect(dateOfBirthElement instanceof DateOfBirthInputElement).toBe(true);
    expect(shippingAddressElement instanceof AddressElement).toBe(true);
    expect(billingAddressElement instanceof AddressElement).toBe(true);
  });
});

describe('AccountDetailsForm', () => {
  const accountDetailsForm = new AccountDetailsForm(blankUser);

  it('should create a form element', () => {
    const formElement = accountDetailsForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = accountDetailsForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [emailElement, firstNameElement, lastNameElement, dateOfBirthElement] = children;

    expect(emailElement instanceof EmailInputElement).toBe(true);
    expect(firstNameElement instanceof FirstNameInputElement).toBe(true);
    expect(lastNameElement instanceof LastNameInputElement).toBe(true);
    expect(dateOfBirthElement instanceof DateOfBirthInputElement).toBe(true);
  });
});

describe('AccountAddressForm', () => {
  const address = blankUser.addresses[0];
  const isDefaultShipping = false;
  const isDefaultBilling = false;

  const accountAddressForm = new AccountAddressForm(address, { isDefaultShipping, isDefaultBilling });

  it('should create a form element', () => {
    const formElement = accountAddressForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = accountAddressForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [cityElement, stateElement, countryElement, postalCodeElement] = children;

    expect(cityElement instanceof CityInputElement).toBe(true);
    expect(stateElement instanceof StateInputElement).toBe(true);
    expect(countryElement instanceof CountryInputElement).toBe(true);
    expect(postalCodeElement instanceof PostalCodeInputElement).toBe(true);
  });
});

describe('BlankAddressForm', () => {
  const blankAddressForm = new BlankAddressForm();

  it('should create a form element', () => {
    const formElement = blankAddressForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = blankAddressForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [cityElement, stateElement, countryElement, postalCodeElement] = children;

    expect(cityElement instanceof CityInputElement).toBe(true);
    expect(stateElement instanceof StateInputElement).toBe(true);
    expect(countryElement instanceof CountryInputElement).toBe(true);
    expect(postalCodeElement instanceof PostalCodeInputElement).toBe(true);
  });
});

describe('PasswordChangeForm', () => {
  const passwordChangeForm = new PasswordChangeForm();

  it('should create a form element', () => {
    const formElement = passwordChangeForm.getHtmlElement();
    expect(formElement instanceof HTMLFormElement).toBe(true);
  });

  it('should create children input elements', () => {
    const children = passwordChangeForm['children'];
    expect(children.length).toBeGreaterThan(0);

    const [currentPasswordInputElement, newPasswordInputElement, confirmPasswordInputElement] = children;

    expect(currentPasswordInputElement instanceof CurrentPasswordInputElement).toBe(true);
    expect(newPasswordInputElement instanceof PasswordInputElement).toBe(true);
    expect(confirmPasswordInputElement instanceof ConfirmPasswordInputElement).toBe(true);
  });
});
