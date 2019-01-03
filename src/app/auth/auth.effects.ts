import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoginSuccess,
  AuthActionTypes,
  SettingsPageLogoutAction,
  LoginFail,
  LoggedLocalStorage,
  LoginPageAttemptLogin,
  LoginPageSetAuthErrors,
  UpdateUserRequest,
  UpdateUserSuccess,
  UpdateUserFail,
  SetUpdateUserErrors,
  LoggedLocalStorageRequest,
  LogoutConfirm,
  LogoutAction,
  AuthAttemptToGetUser,
  SetReturnUrl
} from './auth.actions';
import { tap, map, switchMap, catchError, filter, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store, Action, select } from '@ngrx/store';
import { of, defer, Observable } from 'rxjs';
import { UserService, Errors, ErrorsObj, LocalStorageService } from '../core';
import { AppState } from '../reducers';
import { HideMainLoader } from '../layout/layout.actions';
import { selectReturnUrl } from './auth.selectors';
import { getArticlesConfig } from '../articles/articles.selectors';
import { SetReturnArticlesConfig } from '../articles/articles.actions';
import { DialogService } from '../core/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class AuthEffects {

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.pipe(select(selectReturnUrl))),
    tap(([action, returnUrl]) => {
      const { user } = action.payload;

      this.localStorageService.saveToken(user.token);
      this.router.navigateByUrl(returnUrl || '/');
    })
  );

  @Effect()
  settingPageLogout$ = this.actions$.pipe(
    ofType<SettingsPageLogoutAction>(
      AuthActionTypes.SettingsPageLogoutAction,
    ),
    switchMap(action => this.translateService.get(action.payload.question)),
    exhaustMap(question => {
      const dialogRef = this.dialog.confirmation({
        data: { question: question  },
      });

      return dialogRef.afterClosed();
    }),
    filter(v => !!v),
    map(_ => new LogoutConfirm())
  );

  @Effect({ dispatch: false })
  logoutConfirm$ = this.actions$.pipe(
    ofType<LogoutConfirm>(AuthActionTypes.LogoutConfirm),
    tap(() => {
      this.localStorageService.destroyToken();
      this.router.navigateByUrl('/login');
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AuthActionTypes.LogoutAction),
    withLatestFrom(this.store.pipe(select(getArticlesConfig))),
    tap(([action, config]) => {
      const path = action.payload && action.payload.path;
      this.localStorageService.destroyToken();
      this.store.dispatch(new SetReturnUrl({ returnUrl: this.router.url }));
      this.store.dispatch(new SetReturnArticlesConfig({ config }));
      this.router.navigate([path || 'login']);
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
      this.localStorageService.destroyToken();
    })
  );

  @Effect()
  getUserFromApi$ = this.actions$.pipe(
    ofType<AuthAttemptToGetUser>(AuthActionTypes.AuthAttemptToGetUser),
    switchMap(_ => {
      return this.userService.getUser()
        .pipe(
          map(response => {
            const { user } = response;
            return new LoggedLocalStorage({ user: user });
          }),
          catchError(authErrors => {
            return of(new LoginFail({ authErrors }));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  setUserAsLogged$ = this.actions$.pipe(
    ofType<AuthAttemptToGetUser>(AuthActionTypes.AuthAttemptToGetUser),
    tap(_ => this.store.dispatch(new LoggedLocalStorageRequest()))
  );

  @Effect()
  loginAttempt$ = this.actions$.pipe(
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
  updateInfo$ = this.actions$.pipe(
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
  updateInfoFail$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserFail>(AuthActionTypes.UpdateUserFail),
    map(action => new SetUpdateUserErrors({ authErrors: action.payload.errors }))
  );

  @Effect()
  init$: Observable<Action> = defer((): Observable<AuthAttemptToGetUser | LoginFail> => {
    const token = this.localStorageService.getToken();

    if (token) {
      return of(new AuthAttemptToGetUser());
    } else {
      return of(new LoginFail({ authErrors: new ErrorsObj({ type: 'token', body: ['token not found'] }) }));
    }
  });

  constructor(
    private actions$: Actions,
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private dialog: DialogService,
    private translateService: TranslateService
  ) { }
}
