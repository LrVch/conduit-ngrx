import { TestBed, inject } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let store;
  const token = 'sometoken';
  const user = 'someuser';

  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(() => {
    store = {};

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    TestBed.configureTestingModule({
      providers: [JwtService]
    });

    service = TestBed.get(JwtService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should store the token in localStorage', () => {
    service.saveToken(token);

    expect(localStorage.setItem).toHaveBeenCalledWith(service.TOKEN_KEY, token);
    expect(localStorage.getItem(service.TOKEN_KEY)).toEqual(token);
  });

  it('should store the user in localStorage', () => {
    service.saveUser(user);

    expect(localStorage.setItem).toHaveBeenCalledWith(service.USER_KEY, user);
    expect(localStorage.getItem(service.USER_KEY)).toEqual(user);
  });

  it('should retrive token from localStorage', () => {
    localStorage.setItem(service.TOKEN_KEY, token);

    expect(service.getToken()).toEqual(token);
    expect(localStorage.getItem).toHaveBeenCalledWith(service.TOKEN_KEY);
  });

  it('should retrive user from localStorage', () => {
    localStorage.setItem(service.USER_KEY, user);

    expect(service.getUser()).toEqual(user);
    expect(localStorage.getItem).toHaveBeenCalledWith(service.USER_KEY);
  });

  it('should destroy token', () => {
    localStorage.setItem(service.TOKEN_KEY, token);

    service.destroyToken();

    expect(localStorage.removeItem).toHaveBeenCalledWith(service.TOKEN_KEY);
    expect(localStorage.getItem(service.TOKEN_KEY)).toBeNull();
  });

  it('should destroy user', () => {
    localStorage.setItem(service.USER_KEY, user);

    service.destroyUser();

    expect(localStorage.removeItem).toHaveBeenCalledWith(service.USER_KEY);
    expect(localStorage.getItem(service.USER_KEY)).toBeNull();
  });

  it('should destroy user data', () => {
    localStorage.setItem(service.USER_KEY, user);
    localStorage.setItem(service.TOKEN_KEY, token);

    service.destroyUseData();

    expect(localStorage.removeItem).toHaveBeenCalledWith(service.USER_KEY);
    expect(localStorage.getItem(service.USER_KEY)).toBeNull();

    expect(localStorage.removeItem).toHaveBeenCalledWith(service.TOKEN_KEY);
    expect(localStorage.getItem(service.TOKEN_KEY)).toBeNull();
  });
});
