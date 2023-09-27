import { Customer } from '@commercetools/platform-sdk';

export class StorageManager {
  private prefix = '_tsa_';
  private refreshTokenName = `${this.prefix}rt`;
  private currentUserName = `${this.prefix}usr`;
  private currentCartID = `${this.prefix}cartId`;
  private anonymousRefreshTokenName = `${this.prefix}anrt`;

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenName);
  }

  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.refreshTokenName, refreshToken);
  }

  public removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenName);
  }

  public getCurrentUser(): Customer | null {
    const data = localStorage.getItem(this.currentUserName);
    return data ? JSON.parse(data) : data;
  }

  public setCurrentUser(user: Customer): void {
    localStorage.setItem(this.currentUserName, JSON.stringify(user));
  }

  public removeCurrentUser(): void {
    localStorage.removeItem(this.currentUserName);
  }

  public getCurrentCartID(): string | null {
    return localStorage.getItem(this.currentCartID);
  }

  public setCurrentCartID(cartId: string): void {
    localStorage.setItem(this.currentCartID, cartId);
  }

  public removeCurrentCartID(): void {
    localStorage.removeItem(this.currentCartID);
  }

  public getAnonymousRefreshToken(): string | null {
    return localStorage.getItem(this.anonymousRefreshTokenName);
  }

  public setAnonymousRefreshToken(anonymousRefreshToken: string): void {
    localStorage.setItem(this.anonymousRefreshTokenName, anonymousRefreshToken);
  }

  public removeAnonymousRefreshToken(): void {
    localStorage.removeItem(this.anonymousRefreshTokenName);
  }
}
