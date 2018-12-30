import { TestBed } from '@angular/core/testing';
import { NoAuthGuard } from './no-auth-guard.service';
import { Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as Actions from './auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from './auth.reducer';
import { getUser, getAuthErrors } from '@app/lib/testing';

describe('NoAuthGuard', () => {
  let service: NoAuthGuard;
  let router: Router;
  let store: Store<fromAuth.AuthState>;

  class MockRouter {
    url: 'returnUrl';
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
        NoAuthGuard,
        { provide: Router, useClass: MockRouter },
      ]
    });

    service = TestBed.get(NoAuthGuard);
    router = TestBed.get(Router);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(router, 'navigateByUrl');
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return observable of false from canActivate method', done => {
      const user = getUser();
      const action = new Actions.LoginSuccess({ user });

      store.dispatch(action);
      service.canActivate().subscribe(res => {
        expect(res).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/');
        done();
      }, done, done);
    });

    it('should return observable of true from canActivate method', done => {
      const authErrors = getAuthErrors();
      const action = new Actions.LoginFail({ authErrors });

      store.dispatch(action);
      service.canActivate().subscribe(res => {
        expect(res).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalledWith('/');
        done();
      }, done, done);
    });
  });
});
