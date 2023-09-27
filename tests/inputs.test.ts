import EmailInputElement from '../src/components/pageComponents/inputs/emailInputElement/emailInputElement';
import PasswordInputElement from '../src/components/pageComponents/inputs/passwordInputElement/passwordInputElement';
import FirstNameInputElement from '../src/components/pageComponents/inputs/firstNameInputElement/firstNameInputElement';
import LastNameInputElement from '../src/components/pageComponents/inputs/lastNameInputElement/lastNameInputElement';
import CityInputElement from '../src/components/pageComponents/inputs/cityInputElement/cityInputElement';
import StreetInputElement from '../src/components/pageComponents/inputs/streetInputElement/streetInputElement';
import BaseInputElement from '../src/components/pageComponents/inputs/baseInputElement/baseInputElement';
import dateOfBirthInputElement from '../src/components/pageComponents/inputs/dateOfBirthInputElement/dateOfBirthInputElement';
import CurrentPasswordInputElement from '../src/components/pageComponents/inputs/currentPasswordInputElement/currentPasswordInputElement';
import ConfirmPasswordInputElement from '../src/components/pageComponents/inputs/confirmPasswordInputElement/confirmPasswordInputElement';

describe('when user inputs email address', () => {
  it('validates the value according to rules', () => {
    const emailInputElement = new EmailInputElement();
    const input = emailInputElement.getInputElement();

    /**
     * Email should contains local and domain parts seprated by @, e.g. user@example.com.
     */
    const arr = [
      { value: 'test@example.com', valid: true },
      { value: 'user@gmail.com', valid: true },
      { value: 'someone@something.uk', valid: true },
      { value: 'someone@something.org', valid: true },
      { value: 'jbond_007&@mi6.defence.gov.uk', valid: true },
      { value: '_jbourne@unknown.net', valid: true },
      { value: 'tony@starkindustries.com', valid: true },
      { value: 'hulk@grrrrrrrr.arg', valid: true },
      { value: '', valid: false },
      { value: '@', valid: false },
      { value: 'eirueiu', valid: false },
      { value: 'test@example', valid: false },
      { value: 'test test@example.com', valid: false },
      { value: '@example.com', valid: false },
      { value: 'test@.com', valid: false },
      { value: ' @unknown.net', valid: false },
    ];

    arr.forEach((obj) => {
      input.setAttribute('value', obj.value);
      const validation = emailInputElement.validate();

      expect(validation).toBe(obj.valid);
    });
  });
});

describe('when user inputs password', () => {
  it('validates the value according to rules', () => {
    const passwordInputElement = new PasswordInputElement();
    const input = passwordInputElement.getInputElement();

    /**
     * Password should be at least 8 characters.
     * It should contain at least one number, one lowercase letter and one uppercase letter.
     * It must not contain leading or trailing whitespace.
     * It can contain special characters.
     */
    const arr = [
      { value: '123456aA', valid: true },
      { value: '98iiuiOm', valid: true },
      { value: 'oiOPPO29383', valid: true },
      { value: 'P909003343a', valid: true },
      { value: 'ooio_989U', valid: true },
      { value: 'ieiI;.%1(=@', valid: true },
      { value: '', valid: false },
      { value: '12345678', valid: false },
      { value: 'ioi12A', valid: false },
      { value: 'iruIywuyOOi_=%', valid: false },
      { value: '384783iuyuuty=', valid: false },
      { value: 'a1A', valid: false },
      { value: ' 123456aA', valid: false },
      { value: '123456aA ', valid: false },
    ];

    arr.forEach((obj) => {
      input.setAttribute('value', obj.value);
      const validation = passwordInputElement.validate();

      expect(validation).toBe(obj.valid);
    });
  });
});

describe('when user inputs first name', () => {
  it('validates the value according to rules', () => {
    const lastNameInputElement = new LastNameInputElement();

    /**
     * First name must contain at least one character and no special characters or numbers.
     */
    testOnlyLetters(lastNameInputElement);
  });
});

describe('when user inputs last name', () => {
  it('validates the value according to rules', () => {
    const firstNameInputElement = new FirstNameInputElement();

    /**
     * Last name must contain at least one character and no special characters or numbers.
     */
    testOnlyLetters(firstNameInputElement);
  });
});

describe('when user inputs city', () => {
  it('validates the value according to rules', () => {
    const cityInputElement = new CityInputElement();

    /**
     * Last name must contain at least one character and no special characters or numbers.
     */
    testOnlyLetters(cityInputElement);
  });
});

describe('when user inputs street', () => {
  it('validates the value according to rules', () => {
    const streetInputElement = new StreetInputElement();
    const input = streetInputElement.getInputElement();

    /**
     * Street must contain at least one character.
     */
    const arr = [
      { value: 'A', valid: true },
      { value: 'a', valid: true },
      { value: 'August', valid: true },
      { value: 'Victor', valid: true },
      { value: 'Maria', valid: true },
      { value: 'Madrid', valid: true },
      { value: 'a 4 ', valid: true },
      { value: 'ooio_989U', valid: true },
      { value: '12345678', valid: true },
      { value: 'iruIywuyOOi_=%', valid: true },
      { value: 'ioi12A', valid: true },
      { value: '384783iuyuuty=', valid: true },
      { value: '', valid: false },
      { value: ' ', valid: false },
    ];

    arr.forEach((obj) => {
      input.setAttribute('value', obj.value);
      const validation = streetInputElement.validate();

      expect(validation).toBe(obj.valid);
    });
  });
});

/**
 * Help functions.
 */
function testOnlyLetters(inputElement: BaseInputElement) {
  const input = inputElement.getInputElement();

  const arr = [
    { value: 'A', valid: true },
    { value: 'a', valid: true },
    { value: 'August', valid: true },
    { value: 'Victor', valid: true },
    { value: 'Maria', valid: true },
    { value: 'Madrid', valid: true },
    { value: '', valid: false },
    { value: 'ooio_989U', valid: false },
    { value: '12345678', valid: false },
    { value: 'ioi12A', valid: false },
    { value: 'iruIywuyOOi_=%', valid: false },
    { value: '384783iuyuuty=', valid: false },
  ];

  arr.forEach((obj) => {
    input.setAttribute('value', obj.value);
    const validation = inputElement.validate();

    expect(validation).toBe(obj.valid);
  });
}

describe('when user inputs date of birth', () => {
  it('validates the value according to rules', () => {
    const dateBirthInputElement = new dateOfBirthInputElement();
    const input = dateBirthInputElement.getInputElement();
    const currentDate = new Date();

    const daysFromNow = (days: number) => {
      const date = new Date();
      date.setDate(currentDate.getDate() + days);

      return date;
    };

    const yearsFromNow = (years: number) => {
      const date = new Date();
      date.setFullYear(currentDate.getFullYear() + years);

      return date;
    };

    const formatDate = (date: Date): string => {
      // Format date in yyyy-mm-dd.
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const monthFormatted = month < 10 ? `0${month}` : month;
      const dayFormatted = day < 10 ? `0${day}` : day;

      return `${year}-${monthFormatted}-${dayFormatted}`;
    };

    /**
     * Date of birth should be not empty and user should be more than 13 years old.
     */
    const arr = [
      { value: yearsFromNow(-20), valid: true },
      { value: yearsFromNow(-40), valid: true },
      { value: yearsFromNow(-15), valid: true },
      { value: yearsFromNow(-100), valid: true },
      { value: yearsFromNow(-74), valid: true },
      { value: yearsFromNow(-13), valid: true },
      { value: '', valid: false },
      { value: '@', valid: false },
      { value: 'eirueiu', valid: false },
      { value: yearsFromNow(-12), valid: false },
      { value: yearsFromNow(-9), valid: false },
      { value: currentDate, valid: false },
      { value: yearsFromNow(2), valid: false },
      { value: daysFromNow(-1), valid: false },
      { value: daysFromNow(-(12 * 365)), valid: false },
      { value: daysFromNow(-1), valid: false },
    ];

    arr.forEach((obj) => {
      const value = obj.value instanceof Date ? formatDate(obj.value) : obj.value;
      input.setAttribute('value', value);
      const validation = dateBirthInputElement.validate();

      expect(validation).toBe(obj.valid);
    });
  });
});

describe('when user inputs password for password change', () => {
  it('validates the value according to rules', () => {
    const currentPasswordInputElement = new CurrentPasswordInputElement();
    const newPasswordInputElement = new PasswordInputElement('');
    const confirmPasswordInputElement = new ConfirmPasswordInputElement(newPasswordInputElement);

    [currentPasswordInputElement, newPasswordInputElement, confirmPasswordInputElement].forEach((element) => {
      expect(element instanceof PasswordInputElement).toBe(true);
    });

    const validateAll = (arr: PasswordInputElement[]) => arr.every((item) => item.validate());

    /**
     * Current Password can be any value but not epmty.
     * New Password should be at least 8 characters.
     * It should contain at least one number, one lowercase letter and one uppercase letter.
     * It must not contain leading or trailing whitespace.
     * It can contain special characters.
     * Confirmation Password must be the same as the New Password.
     */
    const arr = [
      {
        currentValue: '0',
        newValue: '123456aA',
        confirmValue: '123456aA',
        allValid: true,
      },
      {
        currentValue: '98iiuiOm',
        newValue: '98iiuiOm',
        confirmValue: '98iiuiOm',
        allValid: true,
      },
      {
        currentValue: '98iiuiOm',
        newValue: 'ooio_989U',
        confirmValue: 'ooio_989U',
        allValid: true,
      },
      {
        currentValue: '98iiuiOm',
        newValue: 'ieiI;.%1(=@',
        confirmValue: 'ieiI;.%1(=@',
        allValid: true,
      },
      {
        currentValue: '',
        newValue: 'ieiI;.%1(=@',
        confirmValue: 'ieiI;.%1(=@',
        allValid: false,
      },
      {
        currentValue: '0',
        newValue: 'ieiI;.%1(=@',
        confirmValue: 'ieiI;.%1(=@**',
        allValid: false,
      },
      {
        currentValue: '0',
        newValue: 'ieiI;.%1(=@**',
        confirmValue: 'ieiI;.%1(=@',
        allValid: false,
      },
      {
        currentValue: '0',
        newValue: '384783iuyuuty=',
        confirmValue: '384783iuyuuty=',
        allValid: false,
      },
      {
        currentValue: '0',
        newValue: ' 123456aA',
        confirmValue: ' 123456aA',
        allValid: false,
      },
      {
        currentValue: '0',
        newValue: '123456aA ',
        confirmValue: '123456aA ',
        allValid: false,
      },
    ];

    arr.forEach((obj) => {
      currentPasswordInputElement.setValue(obj.currentValue);
      newPasswordInputElement.setValue(obj.newValue);
      confirmPasswordInputElement.setValue(obj.confirmValue);

      const elems = [currentPasswordInputElement, newPasswordInputElement, confirmPasswordInputElement];

      expect(validateAll(elems)).toBe(obj.allValid);
    });
  });
});
