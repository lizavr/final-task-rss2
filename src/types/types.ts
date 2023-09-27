import { ErrorResponse } from '@commercetools/platform-sdk';
import { ClientRequest } from '@commercetools/sdk-client-v2';

export type Attributes = {
  [index: string]: string;
};

export type EventCallback = (value?: string) => void;

export type HttpErrorType = {
  name: string;
  message: string;
  code: number;
  status: number;
  statusCode: number;
  body?: ErrorResponse;
  originalRequest: ClientRequest;
  headers?: {
    [key: string]: string;
  };
};

export enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  CONTENT_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export const enum PathObj {
  mainPath = '/',
  loginPath = '/login',
  registrationPath = '/register',
  catalogPath = '/catalog',
  productPath = '/product',
  profilePath = '/profile',
  cartPath = '/cart',
  aboutUsPath = '/about-us',
}

export type Address = {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
  isDefault: boolean;
};

export type EnumFilterOption = {
  key: string;
  label: string;
};

export type QueryArgsType = {
  sort: string;
  filter?: string[];
  'text.EN-US'?: string;
  limit?: number;
  offset?: number;
};

export interface teamData {
  image: string;
  name: string;
  role: string;
  location: string;
  gitHubName: string;
  gitHubLink: string;
  learning: string;
  contribution: string;
}
