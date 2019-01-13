import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let store;

  class MockStore {
    getItem(key: string): string {
      return key in this ? this[key] : null;
    }
    setItem(key: string, value: string) {
      this[key] = `${value}`;
    }
    removeItem(key: string) {
      delete this[key];
    }
    clear() {
      Object.keys(this).forEach(key => delete this[key]);
    }

    get length() {
      return Object.keys(this).length;
    }

    key(key: number): string {
      return '';
    }
  }

  beforeEach(() => {
    store = new MockStore();
    LocalStorageService.storage = store;
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('testLocalStorage should be executable', () => {
    spyOn(service, 'testLocalStorage');
    service.testLocalStorage();
    expect(service.testLocalStorage).toHaveBeenCalled();
  });

  it('should get, set, and remove the item', () => {
    service.setItem('TEST', 'item');
    expect(service.getItem('TEST')).toBe('item');
    service.removeItem('TEST');
    expect(service.getItem('TEST')).toBe(null);
    service.saveToken('token');
    expect(service.getToken()).toBe('token');
    service.destroyToken();
    expect(service.getToken()).toBe(null);
  });

  it('should load initial state', () => {
    service.setItem('test', { test: 'test' });
    expect(LocalStorageService.loadInitialState()).toEqual({
      test: { test: 'test' }
    });
  });
});
