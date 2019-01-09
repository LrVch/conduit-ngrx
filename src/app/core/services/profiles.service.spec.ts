import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { ProfilesService } from './profiles.service';
import { ApiService } from './api.service';
import { getProfile } from '@app/lib/testing';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let apiService: ApiService;

  class MockApiService {
    get = jest.fn();
    post = jest.fn();
    delete = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfilesService,
        { provide: ApiService, useValue: MockApiService }
      ]
    });

    service = TestBed.get(ProfilesService);
    apiService = TestBed.get(ApiService);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should retreive a profile', () => {
    const username = 'username';
    const profile = getProfile();
    const result = cold('-a|', { a: { profile } });
    const expected = cold('-b|', { b: profile });
    apiService.get = jest.fn(() => result);

    expect(service.get(username)).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(
      `${service.BASE_URL}${username}`
    );
  });

  it('should follow the user', () => {
    const username = 'username';
    const profile = getProfile();
    const expected = cold('-a|', { a: { profile } });
    apiService.post = jest.fn(() => expected);

    expect(service.follow(username)).toBeObservable(expected);
    expect(apiService.post).toHaveBeenCalledWith(
      `${service.BASE_URL}${username}/follow`
    );
  });

  it('should unfollow the user', () => {
    const username = 'username';
    const profile = getProfile();
    const expected = cold('-a|', { a: { profile } });
    apiService.delete = jest.fn(() => expected);

    expect(service.unfollow(username)).toBeObservable(expected);
    expect(apiService.delete).toHaveBeenCalledWith(
      `${service.BASE_URL}${username}/follow`
    );
  });
});
