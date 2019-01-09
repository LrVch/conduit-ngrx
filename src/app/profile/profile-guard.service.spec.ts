import { TestBed } from '@angular/core/testing';
import { ProfileGuard } from './profile-guard.service';
import { Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { ProfilesService } from '@app/core';
import { cold } from 'jasmine-marbles';
import * as fromProfileActions from './profile.actions';
import * as fromRoot from '@app/reducers';
import * as fromProfile from './profile.reducer';
import { getSomeErrors, getProfile } from '@app/lib/testing';

describe('ProfileGuard', () => {
  let service: ProfileGuard;
  let router: Router;
  let store: Store<fromProfile.ProfileState>;
  let profilesService: ProfilesService;
  let profile;
  let error;

  class MockProfilesService {
    dispath = jest.fn();
  }

  class MockRouter {
    url: 'returnUrl';
    navigate(path: string, params: any) {}
  }

  class MockRoute {
    params = {};
  }

  beforeEach(() => {
    profile = getProfile();
    error = getSomeErrors();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromProfile.profileReducer)
        })
      ],
      providers: [
        ProfileGuard,
        { provide: Router, useClass: MockRouter },
        { provide: ProfilesService, useClass: MockProfilesService }
      ]
    });

    service = TestBed.get(ProfileGuard);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    profilesService = TestBed.get(ProfilesService);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(console, 'error'); // .and.callThrough();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return observable of true from canActivate method', () => {
      const route = new MockRoute();
      const result = cold('-a|', { a: profile });
      const expected = cold('-b|', { b: true });
      route.params = {
        username: 'username'
      };

      profilesService.get = jest.fn(() => result);

      expect(service.canActivate(route as any)).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        new fromProfileActions.ProfileLoadSuccess({ profile })
      );
    });

    it('should return observable of false from canActivate method  if user not found', () => {
      const route = new MockRoute();
      const notFoundError = { status: '404' };
      const result = cold('#|', {}, notFoundError);
      const expected = cold('(b|)', { b: false });
      route.params = {
        username: 'username'
      };

      profilesService.get = jest.fn(() => result);

      expect(service.canActivate(route as any)).toBeObservable(expected);
      expect(console.error).toHaveBeenCalledWith(notFoundError);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should return observable of false from canActivate method if no username', () => {
      const route = new MockRoute();
      const expected = cold('(b|)', { b: false });
      route.params = {
        username: ''
      };

      expect(service.canActivate(route as any)).toBeObservable(expected);
      expect(console.error).toHaveBeenCalledWith(service.NO_USER_NAME);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
