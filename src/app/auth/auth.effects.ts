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
import { UserService, User, Errors, ErrorsObj } from '../core';
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
    tap((action) => {
      const { authErrors } = action.payload;
      // console.error(authErrors);
      this.store.dispatch(new LoginPageSetAuthErrors({ authErrors }));
      this.store.dispatch(new HideMainLoader());
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
          catchError(authErrors => {
            return of(new LoginFail({ authErrors }));
          })
        );
    } else {
      return of(new LoginFail({ authErrors: new ErrorsObj({ type: 'token', body: ['token not found'] }) }));
    }
  });

  @Effect()
  loginAttempt = this.actions$.pipe(
    ofType<LoginPageAttemptLogin>(AuthActionTypes.LoginPageAttemptLogin),
    switchMap(action => {
      return this.userService.attemptAuth(action.payload.authType, action.payload.credentials)
        .pipe(
          map(user => new LoginSuccess({ user })),
          catchError(authErrors => {
            return of(new LoginFail({ authErrors }));
          })
        );
    })
  );

  @Effect()
  updateInfo = this.actions$.pipe(
    ofType<UpdateUserRequest>(AuthActionTypes.UpdateUserRequest),
    switchMap(action => {
      return this.userService.update(action.payload.user)
        .pipe(
          map(user => new UpdateUserSuccess({ user })),
          catchError((errors: Errors) => {
            return of(new UpdateUserFail({ errors }));
          })
        );
    })
  );

  @Effect()
  updateInfoFail: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserFail>(AuthActionTypes.UpdateUserFail),
    map(action => new SetUpdateUserErrors({ authErrors: action.payload.errors }))
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>,
    private jwtService: JwtService
  ) { }
}
