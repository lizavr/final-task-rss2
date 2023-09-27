export {
  FAILED_REGISTRATION_ERROR,
  USER_FLOW_REGISTRATION_TYPE,
  FAILED_REGISTRATION_USER_MESSAGE,
  SUCCESSFULL_REGISTRATION_USER_MESSAGE,
  FAILED_LOGIN_ERROR,
  USER_FLOW_LOGIN_TYPE,
  FAILED_LOGIN_USER_MESSAGE,
  SUCCESSFULL_LOGIN_USER_MESSAGE,
  FAILED_PASSWORD_CHANGE_ERROR,
  USER_FLOW_PASSWORD_CHANGE_TYPE,
  FAILED_PASSWORD_CHANGE_MESSAGE,
  SUCCESSFULL_PASSWORD_CHANGE_MESSAGE,
  INFO_PASSWORD_CHANGE_MESSAGE,
  UPDATE_PERSONAL_INFORMATION_MESSAGE,
  UPDATE_ADDRESS_MESSAGE,
  REMOVE_ADDRESS_MESSAGE,
  ADD_ADDRESS_MESSAGE,
  SET_DEFAULT_SHIPPING_ADDRESS_MESSAGE,
  SET_DEFAULT_BILLING_ADDRESS_MESSAGE,
  REMOVE_DEFAULT_SHIPPING_ADDRESS_MESSAGE,
  REMOVE_DEFAULT_BILLING_ADDRESS_MESSAGE,
};

const FAILED_REGISTRATION_ERROR = 'DuplicateField';
const USER_FLOW_REGISTRATION_TYPE = 'registration';
const FAILED_REGISTRATION_USER_MESSAGE =
  'There is already an existing customer with the provided email.\nTry either log in or use another email address.';
const SUCCESSFULL_REGISTRATION_USER_MESSAGE = 'You have been successfully registered';

const FAILED_LOGIN_ERROR = 'InvalidCredentials';
const USER_FLOW_LOGIN_TYPE = 'login';
const FAILED_LOGIN_USER_MESSAGE =
  'Email or password is incorrect. Please, check the credentials you typed in and try again.';
const SUCCESSFULL_LOGIN_USER_MESSAGE = 'You have been successfully logged in';

const FAILED_PASSWORD_CHANGE_ERROR = 'InvalidCurrentPassword';
const USER_FLOW_PASSWORD_CHANGE_TYPE = 'password-change';
const FAILED_PASSWORD_CHANGE_MESSAGE =
  'Current password is incorrect. Please, check the credentials you typed in and try again.';
const SUCCESSFULL_PASSWORD_CHANGE_MESSAGE = 'Your password was successfully updated.';
const INFO_PASSWORD_CHANGE_MESSAGE = 'You need to re-login.';

const UPDATE_PERSONAL_INFORMATION_MESSAGE = 'Your personal information was successfully updated.';
const UPDATE_ADDRESS_MESSAGE = 'The address was successfully updated.';
const REMOVE_ADDRESS_MESSAGE = 'The address was successfully removed.';
const ADD_ADDRESS_MESSAGE = 'The address was successfully added.';
const SET_DEFAULT_SHIPPING_ADDRESS_MESSAGE = 'The address was successfully set as default shipping address.';
const SET_DEFAULT_BILLING_ADDRESS_MESSAGE = 'The address was successfully set as default billing address.';
const REMOVE_DEFAULT_SHIPPING_ADDRESS_MESSAGE = 'The default shipping address was removed.';
const REMOVE_DEFAULT_BILLING_ADDRESS_MESSAGE = 'The default billing address was removed.';
