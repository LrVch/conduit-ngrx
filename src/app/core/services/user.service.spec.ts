
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { getUser, getCredentials } from 'src/app/lib/testing';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let apiService: ApiService;

  class MockApiService {
    get = jest.fn();
    post = jest.fn();
    put = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ApiService, useValue: MockApiService }
      ]
    });

    service = TestBed.get(UserService);
    apiService = TestBed.get(ApiService);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate user', () => {
    const type = 'login';
    const credentials = getCredentials();
    const user = getUser();
    const result = cold('-a|', { a: { user } });
    const expected = cold('-b|', { b: user });
    apiService.post = jest.fn(() => result);

    expect(service.attemptAuth(type, credentials)).toBeObservable(expected);
    expect(apiService.post).toHaveBeenCalledWith(`${service.BASE_URL_USERS}/${type}`, { user: credentials });
  });

  it('should register user', () => {
    const type = '';
    const credentials = getCredentials();
    const user = getUser();
    const result = cold('-a|', { a: { user } });
    const expected = cold('-b|', { b: user });
    apiService.post = jest.fn(() => result);

    expect(service.attemptAuth(type, credentials)).toBeObservable(expected);
    expect(apiService.post).toHaveBeenCalledWith(service.BASE_URL_USERS, { user: credentials });
  });

  it('should retreive a user', () => {
    const user = getUser();
    const expected = cold('-a|', { a: { user } });
    apiService.get = jest.fn(() => expected);

    expect(service.getUser()).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL_USER}`);
  });

  it('should update a user', () => {
    const user = getUser();
    const result = cold('-a|', { a: { user } });
    const expected = cold('-b|', { b: user });
    apiService.put = jest.fn(() => result);

    expect(service.update(user)).toBeObservable(expected);
    expect(apiService.put).toHaveBeenCalledWith(
      `${service.BASE_URL_USER}`,
      { user }
    );
  });
});
