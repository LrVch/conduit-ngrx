import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoginSuccess,
  AuthActionTypes,
  LogoutAction,
  LoginFail,
  LoggedLocalStorage,
  LoginPageAttemptLogin,
  LoginAttemptCopmlete,
  LoginPageSetAuthErrors,
  UpdateUserRequest,
  UpdateUserSuccess,
  UpdateUserFail,
  SetUpdateUserErrors,
  LoggedLocalStorageRequest
} from './auth.actions';
import { tap, finalize, map, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { of, noop, defer, Observable } from 'rxjs';
import { UserService, User } from '../core';
import { AppState } from '../reducers';
import { JwtService } from '../core';
import { HideMainLoader } from '../layout/layout.actions';


@Injectable()
export class AuthEffects {

  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    tap(action => {
      const { user } = action.payload;

      this.jwtService.saveToken(user.token);
      this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(
      AuthActionTypes.LogoutAction,
    ),
    tap(() => {
      this.jwtService.destroyUseData();
      this.router.navigateByUrl('/login');
    })
  );

  @Effect({ dispatch: false })
  loginFail$ = this.actions$.pipe(
    ofType<LoginFail>(
      AuthActionTypes.LoginFail
    ),
    tap(() => {
      this.jwtService.destroyUseData();
    })
  );

  @Effect()
  init$: Observable<Action> = defer((): Observable<LoggedLocalStorage | LoginFail> => {
    const token = this.jwtService.getToken();

    if (token) {
      this.store.dispatch(new LoggedLocalStorageRequest());
      return this.userService.getUser()
        .pipe(
          switchMap(responce => {
            const { user } = responce;
            return of(new LoggedLocalStorage({ user }));
          }),
          catchError(error => {
            console.error(error);
            return of(new LoginFail());
          })
        );
    } else {
      return of(new LoginFail());
    }
  });

  @Effect({ dispatch: false })
  loginAttempt = this.actions$.pipe(
    ofType<LoginPageAttemptLogin>(AuthActionTypes.LoginPageAttemptLogin),
    tap(action => {
      this.userService.attemptAuth(action.payload.authType, action.payload.credentials)
        .pipe(
          tap(user => {
            this.store.dispatch(new LoginSuccess({ user }));
          }),
          finalize(() => {
            this.store.dispatch(new LoginAttemptCopmlete());
          })
        )
        .subscribe(
          noop,
          authErrors => {
            this.store.dispatch(new LoginFail());
            this.store.dispatch(new HideMainLoader());
            this.store.dispatch(new LoginPageSetAuthErrors({ authErrors }));
          }
        );
    })
  );

  @Effect({ dispatch: false })
  updateInfo = this.actions$.pipe(
    ofType<UpdateUserRequest>(AuthActionTypes.UpdateUserRequest),
    tap(action => {
      this.userService.update(action.payload.user)
        .pipe(
          tap(user => {
            this.store.dispatch(new UpdateUserSuccess({ user }));
          })
        )
        .subscribe(
          noop,
          authErrors => {
            this.store.dispatch(new UpdateUserFail());
            this.store.dispatch(new SetUpdateUserErrors({ authErrors }));
          }
        );
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>,
    private jwtService: JwtService
  ) { }
}
