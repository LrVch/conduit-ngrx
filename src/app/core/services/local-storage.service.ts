import { Injectable } from '@angular/core';

const APP_PREFIX = 'CONDUIT-';
export const SETTINGS_KEY = 'appSettings';
export const TOKEN_KEY = 'contuit_token';

@Injectable()
export class LocalStorageService {
  constructor() {}

  static storage = localStorage;

  static loadInitialState() {
    return Object.keys(this.storage).reduce((state: any, storageKey) => {
      if (storageKey.includes(APP_PREFIX)) {
        const key = storageKey.replace(APP_PREFIX, '');
        const data = JSON.parse(this.storage.getItem(storageKey));

        state = { ...state, [key]: data };
      }

      return state;
    }, {});
  }

  setItem(key: string, value: any) {
    LocalStorageService.storage.setItem(
      `${APP_PREFIX}${key}`,
      JSON.stringify(value)
    );
  }

  getItem(key: string) {
    return JSON.parse(
      LocalStorageService.storage.getItem(`${APP_PREFIX}${key}`)
    );
  }

  removeItem(key: string) {
    LocalStorageService.storage.removeItem(`${APP_PREFIX}${key}`);
  }

  getToken(): string {
    return LocalStorageService.storage.getItem(TOKEN_KEY);
  }

  saveToken(token: string) {
    LocalStorageService.storage.setItem(TOKEN_KEY, token);
  }

  destroyToken() {
    LocalStorageService.storage.removeItem(TOKEN_KEY);
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    let retrievedValue: string;
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue);
    retrievedValue = this.getItem(testKey);
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
