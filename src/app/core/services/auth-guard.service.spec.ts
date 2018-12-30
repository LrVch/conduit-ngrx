import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as Actions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from '@app/auth/auth.reducer';
import { getUser, getAuthErrors } from '@app/lib/testing';

describe('AuthGuard', () => {
  let service: AuthGuard;
  let router: Router;
  let store: Store<fromAuth.AuthState>;

  class MockRouter {
    url: 'returnUrl';
    navigate(path: string, params: any) { }
    navigateByUrl(path: string) { }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromAuth.authReducer),
        }),
      ],
      providers: [
        AuthGuard,
        { provide: Router, useClass: MockRouter },
      ]
    });

    service = TestBed.get(AuthGuard);
    router = TestBed.get(Router);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return observable of true from canActivate method', done => {
      const user = getUser();
      const action = new Actions.LoginSuccess({ user });

      store.dispatch(action);
      service.canActivate().subscribe(res => {
        expect(res).toBeTruthy();
        expect(router.navigate).not.toHaveBeenCalledWith(['login']);
        done();
      }, done, done);
    });

    it('should return observable of false from canActivate method', done => {
      const authErrors = getAuthErrors();
      const action = new Actions.LoginFail({ authErrors });

      store.dispatch(action);
      service.canActivate().subscribe(res => {
        expect(res).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['login']);
        done();
      }, done, done);
    });
  });

  describe('canLoad', () => {
    it('should return observable of true from canLoad method', done => {
      const user = getUser();
      const action = new Actions.LoginSuccess({ user });

      store.dispatch(action);

      service.canLoad().subscribe(res => {
        expect(res).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalledWith('/login');
        done();
      }, done, done);
    });

    it('should return observable of false from canLoad method', done => {
      const authErrors = getAuthErrors();
      const action = new Actions.LoginFail({ authErrors });

      store.dispatch(action);

      service.canLoad().subscribe(res => {
        expect(res).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
        done();
      }, done, done);
    });
  });
});
