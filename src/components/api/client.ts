import { PROJECT_KEY, SCOPE, CLIENT_ID, CLIENT_SECRET, REGION } from './apiConstants';
import fetch from 'node-fetch';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  TokenStore,
  TokenCache,
  RefreshAuthMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { StorageManager } from '../storageManager/storageManager';

export class ApiClient {
  private _apiRoot: ByProjectKeyRequestBuilder;
  private _tokenCacheCustomer: TokenCache;
  private _tokenCacheAnonymous: TokenCache;
  private storageManager = new StorageManager();

  private authMiddlewareOptions: AuthMiddlewareOptions = {
    host: `https://auth.${REGION}.commercetools.com`,
    projectKey: PROJECT_KEY,
    credentials: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
    scopes: [SCOPE],
    fetch,
  };

  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: `https://api.${REGION}.commercetools.com`,
    fetch,
  };

  private constructor() {
    this._apiRoot = this.defineApiRoot();
    this._tokenCacheCustomer = this.defineTokenCacheCustomer();
    this._tokenCacheAnonymous = this.defineTokenCacheAnonymous();
  }

  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (ApiClient.instance) {
      return ApiClient.instance;
    } else {
      ApiClient.instance = new ApiClient();

      return ApiClient.instance;
    }
  }

  public get apiRoot(): ByProjectKeyRequestBuilder {
    return this.apiRootCustomer ? this.apiRootCustomer : this.apiRootAnonymous;
  }

  public get apiRootCustomer(): ByProjectKeyRequestBuilder | null {
    return this.defineApiRootCustomer();
  }

  public get apiRootAnonymous(): ByProjectKeyRequestBuilder {
    return this.defineApiRootAnonymous();
  }

  public get tokenCacheCustomer(): TokenCache {
    return this._tokenCacheCustomer;
  }

  public get tokenCacheAnonymous(): TokenCache {
    return this._tokenCacheAnonymous;
  }

  public resetTokenCacheCustomer(): void {
    this._tokenCacheCustomer = this.defineTokenCacheCustomer();
  }

  public resetTokenCacheAnonymous(): void {
    this._tokenCacheAnonymous = this.defineTokenCacheAnonymous();
  }

  private defineApiRoot(): ByProjectKeyRequestBuilder {
    const client = new ClientBuilder()
      .withProjectKey(PROJECT_KEY)
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

    return apiRoot;
  }

  private defineApiRootCustomer(): ByProjectKeyRequestBuilder | null {
    const refreshToken = this.storageManager.getRefreshToken();

    if (refreshToken) {
      const client = new ClientBuilder()
        .withProjectKey(PROJECT_KEY)
        .withRefreshTokenFlow(this.getRefreshAuthMiddlewareOptions(refreshToken))
        .withHttpMiddleware(this.httpMiddlewareOptions)
        .build();

      const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

      return apiRoot;
    }

    return null;
  }

  private defineApiRootAnonymous(): ByProjectKeyRequestBuilder {
    const refreshToken = this.storageManager.getAnonymousRefreshToken();

    if (refreshToken) {
      const client = new ClientBuilder()
        .withProjectKey(PROJECT_KEY)
        .withRefreshTokenFlow(this.getRefreshAuthMiddlewareOptions(refreshToken))
        .withHttpMiddleware(this.httpMiddlewareOptions)
        .build();

      const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

      return apiRoot;
    }

    const client = new ClientBuilder()
      .withProjectKey(PROJECT_KEY)
      .withAnonymousSessionFlow(this.getAnonymousAuthMiddlewareOptions())
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

    apiRoot
      .categories()
      .get()
      .execute()
      .then(() => {
        const tokenCache = this._tokenCacheAnonymous.get();
        if (tokenCache?.refreshToken) this.storageManager.setAnonymousRefreshToken(tokenCache.refreshToken);
      });

    return apiRoot;
  }

  public getApiRootWithPasswordFlow(email: string, password: string): ByProjectKeyRequestBuilder {
    const client = new ClientBuilder()
      .withProjectKey(PROJECT_KEY)
      .withPasswordFlow(this.getPasswordAuthMiddlewareOptions(email, password))
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

    return apiRoot;
  }

  private defineTokenCacheCustomer(): TokenCache {
    return this.tokenStore({
      token: '',
      expirationTime: -1,
    });
  }

  private defineTokenCacheAnonymous(): TokenCache {
    return this.tokenStore({
      token: '',
      expirationTime: -1,
    });
  }

  private tokenStore(initVal: TokenStore): TokenCache {
    let value = initVal;
    return {
      get: () => value,
      set: (val: TokenStore) => {
        value = val;
      },
    };
  }

  private getPasswordAuthMiddlewareOptions(email: string, password: string): PasswordAuthMiddlewareOptions {
    return {
      ...this.authMiddlewareOptions,
      credentials: {
        ...this.authMiddlewareOptions.credentials,
        user: {
          username: email,
          password: password,
        },
      },
      tokenCache: this._tokenCacheCustomer,
      fetch,
    };
  }

  private getRefreshAuthMiddlewareOptions(refreshToken: string): RefreshAuthMiddlewareOptions {
    return { ...this.authMiddlewareOptions, refreshToken };
  }

  private getAnonymousAuthMiddlewareOptions(): AnonymousAuthMiddlewareOptions {
    return {
      host: `https://auth.${REGION}.commercetools.com`,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      scopes: [SCOPE],
      tokenCache: this._tokenCacheAnonymous,
      fetch,
    };
  }
}
